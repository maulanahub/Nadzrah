// src/components/NotificationModal.jsx

import React from 'react';

// Ikon untuk sukses (centang) dan error (seru)
const IkonSukses = () => (
  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
    <svg className="h-6 w-6 text-green-600" stroke="currentColor" fill="none" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

const IkonError = () => (
  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  </div>
);

export default function NotificationModal({ type = 'error', title, message, onClose }) {
  const isSuccess = type === 'success';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
        {isSuccess ? <IkonSukses /> : <IkonError />}
        <h3 className="text-lg font-semibold text-slate-800 mt-4">{title || (isSuccess ? 'Berhasil' : 'Terjadi Kesalahan')}</h3>
        <p className="text-sm text-slate-600 mt-2">{message}</p>
        <button
          onClick={onClose}
          className={`mt-6 w-full font-bold py-2 px-6 rounded-lg transition ${
            isSuccess 
            ? 'bg-green-600 text-white hover:bg-green-700' 
            : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}