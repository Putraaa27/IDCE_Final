@echo off
title IDCE - Setup Gemini API
color 0A
cls

echo ============================================================
echo  IDCE - Setup Gemini API dan Jalankan Website
echo ============================================================
echo.
echo Masukkan API Key Gemini kamu di bawah ini.
echo API key akan disimpan ke file .env lokal.
echo File .env tidak boleh diupload ke GitHub.
echo.

set /p GEMINI_KEY=Masukkan GEMINI_API_KEY: 

if "%GEMINI_KEY%"=="" (
  echo.
  echo API key kosong. Setup dibatalkan.
  pause
  exit /b
)

(
echo GEMINI_API_KEY=%GEMINI_KEY%
echo GEMINI_MODEL=gemini-2.5-flash
) > .env

echo.
echo File .env berhasil dibuat.
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js belum terinstall atau belum terbaca di PATH.
  echo Install Node.js LTS dulu dari https://nodejs.org
  echo Setelah itu buka CMD baru dan jalankan setup-gemini.bat lagi.
  pause
  exit /b
)

echo Mengecek dependency project...
npm install

echo.
echo Menjalankan IDCE di http://localhost:5500
echo Jangan tutup jendela CMD ini selama website digunakan.
echo.

npm run dev

pause