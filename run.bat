@echo off
title IDCE - Run Website
color 0B
cls
echo ============================================================
echo  IDCE - Jalankan Website
echo ============================================================
echo.
if not exist .env (
  echo File .env tidak ditemukan.
  echo Pastikan ZIP sudah diextract dengan lengkap.
  pause
  exit /b
)

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js belum terinstall atau belum terbaca di PATH.
  echo Install Node.js LTS dulu dari https://nodejs.org
  pause
  exit /b
)

echo Menjalankan IDCE di http://localhost:5500
echo Jika port 5500 dipakai, tutup terminal lama atau jalankan fix-port-5500.bat
echo.
npm run dev

pause
