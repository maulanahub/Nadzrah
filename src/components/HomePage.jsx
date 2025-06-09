// src/components/HomePage.jsx

import React from 'react';

// Anda bisa menggunakan ikon SVG lain yang lebih spesifik jika mau
const IkonKamera = () => (
    <svg className="w-8 h-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>
);

const IkonAnalisis = () => (
    <svg className="w-8 h-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

const IkonSimpan = () => (
    <svg className="w-8 h-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 12.75l-4.5 3.75V3.75m9 0H12m4.5 0H18a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 18 21.75H6a2.25 2.25 0 0 1-2.25-2.25V6.25A2.25 2.25 0 0 1 6 3.75h1.5" />
    </svg>
);


// Komponen HomePage menerima satu prop: onStart, yang merupakan fungsi
// untuk memberitahu App.jsx agar beralih ke halaman login.
export default function HomePage({ onStart }) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">📖 Nadzrah</h1>
        <p className="text-slate-500 mt-2">Pindai & Analisis Teks Arab Gundul dengan Mudah</p>
      </div>

      <div className="mt-8 space-y-6">
        <h2 className="text-xl font-semibold text-slate-700 text-center">Cara Menggunakan</h2>
        
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0"><IkonKamera /></div>
          <div>
            <h3 className="font-semibold text-slate-800">1. Pindai Teks</h3>
            <p className="text-sm text-slate-600">Gunakan kamera atau unggah gambar dari galeri yang berisi teks Arab gundul (tanpa harakat).</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0"><IkonAnalisis /></div>
          <div>
            <h3 className="font-semibold text-slate-800">2. Dapatkan Hasil Analisis</h3>
            <p className="text-sm text-slate-600">AI kami akan secara otomatis menambahkan harakat, menerjemahkan, serta memberikan analisis Nahwu & Shorof.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0"><IkonSimpan /></div>
          <div>
            <h3 className="font-semibold text-slate-800">3. Simpan Riwayat</h3>
            <p className="text-sm text-slate-600">Simpan hasil analisis Anda untuk dipelajari kembali di kemudian hari melalui halaman riwayat.</p>
          </div>
        </div>
      </div>
      
      <div className="mt-10">
        <button
          onClick={onStart}
          className="w-full bg-indigo-600 text-white text-lg font-semibold py-4 px-6 rounded-xl hover:bg-indigo-700 transition-all duration-300 ease-in-out text-center shadow-md hover:shadow-lg"
        >
          Mulai Sekarang
        </button>
      </div>
    </div>
  );
}