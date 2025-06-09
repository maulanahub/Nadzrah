// src/App.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage'; // 1. Impor komponen HomePage yang baru

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 2. State baru untuk mengontrol tampilan antara home dan auth
  const [view, setView] = useState('home'); 

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 3. Logika render yang diperbarui
  const renderContent = () => {
    // Jika user sudah login, selalu tampilkan Dashboard
    if (session) {
      return <Dashboard key={session.user.id} session={session} />;
    }
    
    // Jika belum login, periksa state 'view'
    switch (view) {
      case 'home':
        // Tampilkan HomePage dan berikan fungsi untuk mengubah view ke 'auth'
        return <HomePage onStart={() => setView('auth')} />;
      case 'auth':
        return <Auth />;
      default:
        return <HomePage onStart={() => setView('auth')} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Memuat Aplikasi...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans">
      <div className="w-full max-w-md mx-auto p-4">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;