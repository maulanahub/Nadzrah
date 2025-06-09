// src/components/Modal.jsx
import React, { useState, useEffect } from 'react';

export default function Modal({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <svg className="h-6 w-6 text-red-600" /* ... SVG path ... */ ></svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mt-4">Terjadi Kesalahan</h3>
        <p className="text-sm text-slate-600 mt-2">{message}</p>
        <button onClick={onClose} className="mt-6 bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 w-full">
          Coba Lagi
        </button>
      </div>
    </div>
  );
}