# IDCE - Immersive Digital Campus Experience ITSB

Project ini berisi landing page interaktif ITSB dengan tema terang, Gemini ChatBot, gamification mission, dashboard data, YouTube preview, form registrasi, dan Google Maps.

## Jalankan lokal

1. Buat file `.env` dari `.env.example`.
2. Isi `GEMINI_API_KEY`.
3. Jalankan:

```bash
npm run dev
```

Buka `http://localhost:5500`.

## Deploy Vercel

Tambahkan Environment Variable di Vercel:

```text
GEMINI_API_KEY=isi_api_key_kamu
GEMINI_MODEL=gemini-3.5-flash
```

Lalu redeploy.

## Catatan data

Dashboard memakai snapshot data publik dari platform ITSB: website resmi, portal PMB, Instagram, dan YouTube. Angka sosial dapat berubah sesuai pembaruan platform.


## Update WOW Night/Light

Versi ini sudah ditambahkan:
- Night/Light mode dengan warna dan font yang menyesuaikan.
- Floating quick dock.
- Scroll progress bar.
- Toast mission notification.
- Confetti celebration.
- Live journey clock.
- Spotlight hover interaction pada card.
- Gemini server dengan fallback model dan pembersih Markdown.

Untuk lokal:
1. Extract ZIP.
2. Masuk folder IDCE-main.
3. Klik start-now.bat atau jalankan npm run dev.
4. Buka http://localhost:5500

Jika port 5500 penuh:
klik fix-port-5500.bat.
