// src/components/Dashboard.jsx
import React from 'react';
import { supabase } from '../supabaseClient';
import KitabScanner from './KitabScanner';
import SavedScans from './SavedScans';

export default function Dashboard({ session }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 my-4 w-full">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <p className="text-sm text-slate-500">Selamat datang,</p>
          <p className="font-bold text-slate-800 break-all">{session.user.email}</p>
        </div>
        <button onClick={handleLogout} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 text-sm">
          Logout
        </button>
      </div>

      <SavedScans userId={session.user.id} />
      
      <hr className="my-6 border-slate-200" />

      <KitabScanner userId={session.user.id} />
    </div>
  );
}