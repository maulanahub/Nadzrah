// src/components/KitabScanner.jsx

import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Spinner from "./Spinner";
import Modal from "./Modal";
import NotificationModal from "./NotificationModal";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function KitabScanner({ userId }) {
  // State dan Ref (tidak ada perubahan di sini)
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analysisOptions, setAnalysisOptions] = useState({
    harakat: true,
    terjemah: true,
    nahwu: false,
  });
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // useEffect untuk kamera (tidak ada perubahan di sini)
  useEffect(() => {
    let stream;
    const enableCamera = async () => {
      if (cameraActive) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Camera Error:", err);
          setError(
            "Tidak dapat mengakses kamera. Pastikan Anda telah memberikan izin pada browser."
          );
          setCameraActive(false);
        }
      }
    };
    enableCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive]);

  // Fungsi-fungsi (tidak ada perubahan di sini)
  const analyzeImage = async (base64ImageData) => {
    setIsLoading(true);
    setResults(null);

    let promptText = `Analisis gambar ini. Tugas Anda adalah mengenali Arab gundul (tanpa harakat) di dalamnya. Abaikan teks lain. Kembalikan HANYA objek JSON. 1. **isKitab**: Tentukan apakah gambar berisi teks Arab gundul (true/false). 2. **reason**: Jika 'isKitab' adalah false, berikan alasan singkat. Jika true, kosongkan string ini.`;
    if (analysisOptions.harakat) {
      promptText += `\n3. **textWithHarakat**: Jika 'isKitab' adalah true, ekstrak teks Arabnya dan berikan harakat (vokalisasi) yang paling sesuai.`;
    }
    if (analysisOptions.terjemah) {
      promptText += `\n4. **translation**: Jika 'isKitab' adalah true, terjemahkan teks yang sudah diberi harakat ke dalam Bahasa Indonesia.`;
    }
    if (analysisOptions.nahwu) {
      promptText += `\n5. **nahwuShorofAnalysis**: Jika 'isKitab' adalah true, berikan analisis gramatikal (Nahwu & Shorof) ringkas dalam format poin-poin.`;
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    const payload = {
      contents: [
        {
          parts: [
            { text: promptText },
            { inline_data: { mime_type: "image/jpeg", data: base64ImageData } },
          ],
        },
      ],
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(
          `API error! status: ${response.status}. Details: ${errorBody.error.message}`
        );
      }

      const result = await response.json();
      let responseText = result.candidates[0].content.parts[0].text;
      const firstBraceIndex = responseText.indexOf("{");
      const lastBraceIndex = responseText.lastIndexOf("}");

      if (firstBraceIndex !== -1 && lastBraceIndex > firstBraceIndex) {
        responseText = responseText.substring(
          firstBraceIndex,
          lastBraceIndex + 1
        );
      }

      const parsedJson = JSON.parse(responseText);

      if (parsedJson.isKitab) {
        setResults(parsedJson);
      } else {
        setError(
          parsedJson.reason ||
            "Gambar tidak terdeteksi sebagai tulisan Arab gundul."
        );
        resetScanner();
      }
    } catch (err) {
      console.error("Error during API call:", err);
      setError("Gagal menganalisis gambar. Periksa format respons dari API.");
      resetScanner();
    } finally {
      setIsLoading(false);
    }
  };
  const handleFileSelect = (event) => {
    setShowChoiceModal(false);
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result.split(",")[1];
        setImagePreview(e.target.result);
        analyzeImage(base64String);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      setError("File yang dipilih bukan gambar.");
    }
  };
  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      const base64String = dataUrl.split(",")[1];

      setImagePreview(dataUrl);
      setCameraActive(false);
      analyzeImage(base64String);
    }
  };
  const handleSaveResult = async () => {
    if (!results) return;
    const { error } = await supabase.from("saved_scans").insert({
      user_id: userId,
      harakat_text: results.textWithHarakat || null,
      translation_text: results.translation || null,
      nahwu_shorof_text: results.nahwuShorofAnalysis || null,
    });
    if (error) {
      setNotification({
        type: "error",
        message: `Gagal menyimpan: ${error.message}`,
      });
    } else {
      // Ganti alert dengan setNotification
      setNotification({
        type: "success",
        message: "Hasil pindai berhasil disimpan!",
      });
    }
  };
  const resetScanner = () => {
    setIsLoading(false);
    setResults(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setCameraActive(false);
  };
  const handleOptionChange = (e) => {
    const { id, checked } = e.target;
    setAnalysisOptions((prev) => ({ ...prev, [id]: checked }));
  };

  if (cameraActive) {
    return (
      <div className="w-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-xl border-2 border-slate-300 bg-black"
        ></video>
        <canvas ref={canvasRef} className="hidden"></canvas>
        <div className="mt-4 flex gap-4">
          <button
            onClick={handleCapture}
            className="flex-1 bg-green-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-green-700 transition shadow-md"
          >
            Ambil Gambar
          </button>
          <button
            onClick={() => setCameraActive(false)}
            className="flex-1 bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl hover:bg-slate-300 transition"
          >
            Batal
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {notification && (
        <NotificationModal
          type={notification.type}
          message={notification.message}
          onClose={() => {
            setNotification(null);
            // Jika notifikasinya sukses, reset scanner setelah ditutup
            if (notification.type === "success") {
              resetScanner();
            }
          }}
        />
      )}
      
      {showChoiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold text-slate-800">
              Pilih Sumber Gambar
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Gunakan kamera atau unggah dari galeri Anda.
            </p>
            <div className="mt-6 space-y-4">
              <button
                onClick={() => {
                  setCameraActive(true);
                  setShowChoiceModal(false);
                }}
                className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-indigo-700 transition"
              >
                Gunakan Kamera
              </button>
              <button
                onClick={() => {
                  fileInputRef.current.click();
                }}
                className="w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-700 transition"
              >
                Unggah dari Galeri
              </button>
            </div>
            <button
              onClick={() => setShowChoiceModal(false)}
              className="mt-4 text-sm text-slate-500 hover:text-slate-700"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      <div id="kitab-app-content">
        {/* Tampilan awal sebelum ada gambar */}
        {!imagePreview && !isLoading && (
          <>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-800">
                📖 Pindai Kitab Baru
              </h1>
              <p className="text-slate-500 mt-2">
                Pilih hasil yang diinginkan, lalu pindai.
              </p>
            </div>
            <div
              id="analysis-options"
              className="mt-4 p-4 bg-slate-50 rounded-lg space-y-3 border border-slate-200"
            >
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="harakat"
                  checked={analysisOptions.harakat}
                  onChange={handleOptionChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-3 text-slate-700">Teks dengan Harokat</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="terjemah"
                  checked={analysisOptions.terjemah}
                  onChange={handleOptionChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-3 text-slate-700">Terjemahan</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="nahwu"
                  checked={analysisOptions.nahwu}
                  onChange={handleOptionChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-3 text-slate-700">
                  Analisis Nahwu & Shorof
                </span>
              </label>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setShowChoiceModal(true)}
                className="w-full bg-indigo-600 text-white text-lg font-semibold py-4 px-6 rounded-xl hover:bg-indigo-700 transition-all"
              >
                Mulai Pindai
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
            </div>
          </>
        )}

        {isLoading && <Spinner message="Menganalisis gambar..." />}

        {/* --- BLOK PERUBAHAN UTAMA ADA DI SINI --- */}
        {/* Container utama ini muncul setelah ada pratinjau gambar dan tidak sedang loading */}
        {imagePreview && !isLoading && (
          <div className="mt-6 space-y-6">
            {/* 1. Tampilkan Pratinjau Gambar */}
            <div className="w-full rounded-xl overflow-hidden border-2 border-slate-200 border-dashed">
              <img
                src={imagePreview}
                alt="Pratinjau Gambar"
                className="w-full h-auto object-contain max-h-64"
              />
            </div>

            {/* 2. Tampilkan Hasil Analisis (jika sudah ada) */}
            {results && (
              <>
                {results.textWithHarakat && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800">
                      Teks dengan Harokat
                    </h3>
                    <p className="arabic-text mt-2 text-slate-900">
                      {results.textWithHarakat}
                    </p>
                  </div>
                )}
                {results.translation && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-bold text-slate-800">
                      Terjemahan
                    </h3>
                    <p className="mt-2 text-slate-700 whitespace-pre-wrap">
                      {results.translation}
                    </p>
                  </div>
                )}
                {results.nahwuShorofAnalysis && (
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <h3 className="text-lg font-bold text-slate-800">
                      Analisis Nahwu & Shorof
                    </h3>
                    <p className="mt-2 text-slate-700 whitespace-pre-wrap">
                      {results.nahwuShorofAnalysis}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* 3. Tampilkan Tombol Aksi (jika sudah ada hasil) */}
            {results && (
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSaveResult}
                  className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-green-700"
                >
                  Simpan Hasil
                </button>
                <button
                  onClick={resetScanner}
                  className="w-full bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-xl hover:bg-slate-300"
                >
                  Pindai Lagi
                </button>
              </div>
            )}
          </div>
        )}
        {/* --- AKHIR DARI BLOK PERUBAHAN --- */}
      </div>
    </>
  );
}
