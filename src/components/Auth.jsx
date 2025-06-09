// src/components/Auth.jsx
import React from "react";
import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Auth() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "", content: "" });

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", content: "" });

    // Hapus baris ini:
    // const authMethod = isLoginView ? supabase.auth.signInWithPassword : supabase.auth.signUp;

    // Deklarasikan variabel untuk menampung hasil
    let error;

    if (isLoginView) {
      // Panggil langsung dari supabase.auth
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      error = signInError;
    } else {
      // Panggil langsung dari supabase.auth
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      error = signUpError;
      // Jika pendaftaran berhasil (tidak ada error), set pesan sukses
      if (!signUpError) {
        setMessage({
          type: "success",
          content: "Pendaftaran berhasil! Cek email untuk verifikasi.",
        });
      }
    }

    if (error) {
      setMessage({ type: "error", content: error.message });
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full">
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
        {isLoginView ? "Login" : "Register"}
      </h2>

      {message.content && (
        <p
          className={`mb-4 text-sm text-center ${
            message.type === "error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {message.content}
        </p>
      )}

      {/* Kode Baru dengan Ikon Google */}
      <button
        onClick={handleGoogleLogin}
        type="button"
        className="w-full flex items-center justify-center bg-white border border-slate-300 text-slate-700 py-3 px-4 rounded-xl hover:bg-slate-50 font-semibold mb-4 transition-colors"
      >
        <svg
          className="w-5 h-5 mr-3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
        >
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          ></path>
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          ></path>
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.089,5.571l6.19,5.238C42.022,36.218,44,30.561,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
        </svg>
        Masuk dengan Google
      </button>

      <div className="flex items-center before:flex-1 before:border-t before:border-slate-300 after:flex-1 after:border-t after:border-slate-300">
        <p className="mx-4 mb-0 text-center font-semibold text-sm text-slate-500">
          ATAU
        </p>
      </div>

      <form onSubmit={handleAuthAction}>
        <div className="mt-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mt-4 mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white font-semibold py-3 px-4 rounded-xl transition duration-200 ${
            isLoginView
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Memproses..." : isLoginView ? "Masuk" : "Daftar"}
        </button>
      </form>

      <p className="text-sm text-center text-slate-600 mt-4">
        {isLoginView ? "Belum punya akun? " : "Sudah punya akun? "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsLoginView(!isLoginView);
            setMessage({ type: "", content: "" });
          }}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          {isLoginView ? "Daftar di sini" : "Login di sini"}
        </a>
      </p>
    </div>
  );
}
