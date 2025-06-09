// src/components/SavedScans.jsx

import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import ConfirmationModal from "./ConfirmationModal";

export default function SavedScans({ userId }) {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanToDelete, setScanToDelete] = useState(null);

  // 1. State baru untuk melacak item yang dipilih
  const [selectedScan, setSelectedScan] = useState(null);
  // Kita akan ubah sedikit fungsi ini agar bisa menangani loading manual
  const fetchScans = async () => {
    setLoading(true); // Aktifkan loading setiap kali fungsi ini dipanggil
    const { data, error } = await supabase
      .from("saved_scans")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching scans:", error);
    } else {
      setScans(data);
    }
    setLoading(false); // Nonaktifkan loading setelah selesai
  };
  useEffect(() => {
    const fetchScans = async () => {
      const { data, error } = await supabase
        .from("saved_scans")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching scans:", error);
      } else {
        setScans(data);
      }
      setLoading(false);
    };

    fetchScans();

    // Dengarkan perubahan (INSERT, UPDATE, DELETE) pada tabel saved_scans
    const channel = supabase
      .channel("public:saved_scans")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "saved_scans",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          // Jika ada perubahan, panggil lagi fetchScans untuk mengambil data terbaru

          fetchScans();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const deleteScan = async (scanId) => {
    await supabase.from("saved_scans").delete().match({ id: scanId });
    if (selectedScan && selectedScan.id === scanId) {
      setSelectedScan(null);
    }
    setScanToDelete(null); // Tutup modal setelah berhasil hapus
  };

  if (loading)
    return <p className="text-center text-slate-500 py-6">Memuat riwayat...</p>;

  // 2. Conditional Rendering: Jika ada item yang dipilih, tampilkan detail
  if (selectedScan) {
    return (
      <>
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">Detail Riwayat</h2>
            {/* Tombol untuk kembali ke daftar */}
            <button
              onClick={() => setSelectedScan(null)}
              className="text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-1 px-3 rounded-lg transition"
            >
              Kembali
            </button>
          </div>
          <div className="space-y-4">
            {/* Tampilkan setiap bagian dari data yang tersimpan */}
            {selectedScan.harakat_text && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800">
                  Teks dengan Harokat
                </h3>
                <p className="arabic-text mt-2 text-slate-900">
                  {selectedScan.harakat_text}
                </p>
              </div>
            )}
            {selectedScan.translation_text && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h3 className="text-lg font-bold text-slate-800">Terjemahan</h3>
                <p className="mt-2 text-slate-700 whitespace-pre-wrap">
                  {selectedScan.translation_text}
                </p>
              </div>
            )}
            {selectedScan.nahwu_shorof_text && (
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h3 className="text-lg font-bold text-slate-800">
                  Analisis Nahwu & Shorof
                </h3>
                <p className="mt-2 text-slate-700 whitespace-pre-wrap">
                  {selectedScan.nahwu_shorof_text}
                </p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // Jika tidak ada item yang dipilih, tampilkan daftar riwayat (UI default)
  return (
    <>
      {scanToDelete && (
        <ConfirmationModal
          title="Konfirmasi Hapus"
          message="Apakah Anda yakin ingin menghapus riwayat pindai ini secara permanen?"
          confirmText="Ya, Hapus"
          onConfirm={() => deleteScan(scanToDelete.id)}
          onCancel={() => setScanToDelete(null)}
        />
      )}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">
            Riwayat Pindai Tersimpan
          </h2>
          <button
            onClick={fetchScans}
            disabled={loading}
            title="Refresh Riwayat"
            className="p-2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* --- IKON REFRESH BARU --- */}
            <svg
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
              />
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
            </svg>
          </button>
        </div>
        {scans.length > 0 ? (
          <div className="space-y-3">
            {scans.map((scan) => (
              <div
                key={scan.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center"
              >
                {/* 3. Area yang bisa diklik untuk melihat detail */}
                <div
                  className="flex-grow cursor-pointer"
                  onClick={() => setSelectedScan(scan)}
                >
                  <p className="arabic-text text-base truncate" dir="rtl">
                    {scan.harakat_text?.substring(0, 30) ||
                      "Analisis tersimpan"}
                    ...
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(scan.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setScanToDelete(scan)}
                  className="flex-shrink-0 ml-4 text-red-500 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500 py-6">
            Anda belum memiliki riwayat pindai.
          </p>
        )}
      </div>
    </>
  );
}
