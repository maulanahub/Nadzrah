# 📖 Nadzrah - Aplikasi Pindai & Analisis Teks Arab

Nadzrah adalah aplikasi web modern yang dirancang untuk membantu pelajar dan pengkaji teks Arab. Dengan memanfaatkan teknologi AI, aplikasi ini mampu memindai gambar berisi teks Arab gundul (tanpa harakat) dan secara otomatis memberikan harakat, terjemahan, serta analisis gramatikal (Nahwu & Shorof) dasar.

✨ **[Lihat Demo Langsung di Sini]([https://nadzrah.netlify.app])** ✨

---

### Tampilan Aplikasi

*Tambahkan screenshot atau GIF dari aplikasi Anda di sini untuk tampilan yang lebih menarik!*
![Screenshot Aplikasi Nadzrah](https://i.imgur.com/your-screenshot.png)

---

### 🚀 Fitur Utama

-   **Otentikasi Pengguna**: Sistem login dan registrasi yang aman menggunakan Email/Password dan Google OAuth, didukung oleh Supabase Auth.
-   **Pindai dari Gambar**: Pengguna dapat mengunggah gambar dari galeri atau mengambil foto langsung menggunakan kamera perangkat.
-   **Analisis Berbasis AI**: Didukung oleh Google Gemini Pro Vision API untuk:
    -   Memberikan **Harakat** (vokalisasi) pada teks Arab gundul.
    -   **Menerjemahkan** teks ke dalam Bahasa Indonesia.
    -   Memberikan **Analisis Nahwu & Shorof** dasar.
-   **Riwayat Pindai**: Setiap hasil analisis dapat disimpan dan diakses kembali kapan saja.
-   **Pembaruan Real-time**: Daftar riwayat diperbarui secara otomatis saat ada data baru yang disimpan atau dihapus, menggunakan Supabase Realtime Subscriptions.
-   **Antarmuka Modern**: Dibangun dengan React dan Tailwind CSS, serta dilengkapi dengan komponen modal kustom untuk pengalaman pengguna yang lebih baik.

---

### 🛠️ Teknologi yang Digunakan

-   **Frontend**:
    -   [React](https://reactjs.org/)
    -   [Vite](https://vitejs.dev/)
    -   [Tailwind CSS](https://tailwindcss.com/)
-   **Backend as a Service (BaaS)**:
    -   [Supabase](https://supabase.io/)
        -   **Authentication**: Untuk manajemen pengguna.
        -   **PostgreSQL Database**: Untuk menyimpan riwayat pindaian.
        -   **Realtime Subscriptions**: Untuk pembaruan daftar riwayat secara otomatis.
-   **Layanan AI**:
    -   [Google Gemini API](https://ai.google.dev/) (Model Pro Vision)
-   **Deployment**:
    -   [Netlify](https://www.netlify.com/)

---

### ⚙️ Panduan Instalasi Lokal

Untuk menjalankan proyek ini di komputer lokal Anda, ikuti langkah-langkah berikut:

**1. Prasyarat**
-   Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) (versi 18 atau lebih baru).
-   Memiliki akun Supabase dan Google Cloud (untuk API Key).

**2. Clone Repositori**
```bash
git clone [https://github.com/maulanahub/nadzrah.git](https://github.com/maulanahub/nadzrah.git)
cd nadzrah