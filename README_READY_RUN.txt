# IDCE Ready Run

Project ini sudah disiapkan agar bisa langsung dijalankan di Windows.

## Cara jalan lokal

1. Extract ZIP ini.
2. Masuk ke folder `IDCE-main`.
3. Klik dua kali `setup-gemini.bat`.
4. Paste API Key Gemini kamu.
5. Tunggu sampai muncul:
   `IDCE running at http://localhost:5500`
6. Buka browser:
   `http://localhost:5500`

Setelah setup pertama selesai, hari berikutnya cukup klik:
`run.bat`

## Test chatbot

Saat website sedang berjalan, klik:
`test-gemini.bat`

Atau langsung tanya dari ChatBot di website.

## Deploy Vercel

Di Vercel, tambahkan Environment Variables:

GEMINI_API_KEY=API_KEY_KAMU
GEMINI_MODEL=gemini-2.5-flash

Lalu Redeploy project.

## Catatan

API key tidak boleh dimasukkan ke script.js. API key harus ada di `.env` untuk lokal atau Environment Variables di Vercel.
