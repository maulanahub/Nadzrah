// src/components/ConfirmationModal.jsx

import React from 'react';

export default function ConfirmationModal({ title, message, confirmText = 'Ya', cancelText = 'Batal', onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-600 mt-2">{message}</p>
        <div className="mt-6 flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl hover:bg-slate-300 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-red-700 transition shadow-md"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}