// src/components/Dashboard.jsx
import React, { useState } from 'react';
import { supabase } from "../supabaseClient";
import KitabScanner from "./KitabScanner";
import SavedScans from "./SavedScans";
import ConfirmationModal from "./ConfirmationModal";

export default function Dashboard({ session }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      {showLogoutConfirm && (
        <ConfirmationModal
          title="Konfirmasi Logout"
          message="Apakah Anda yakin ingin keluar dari sesi ini?"
          confirmText="Ya, Logout"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 my-4 w-full">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
          <div>
            <p className="text-sm text-slate-500">Selamat datang,</p>
            <p className="font-bold text-slate-800 break-all">
              {session.user.email}
            </p>
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 text-sm"
          >
            Logout
          </button>
        </div>

        <KitabScanner userId={session.user.id} />

        <hr className="my-6 border-slate-200" />

        <SavedScans userId={session.user.id} />
      </div>
    </>
  );
}
