@echo off
title IDCE - Fix Port 5500
color 0C
cls
echo Menutup proses yang memakai port 5500...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-NetTCPConnection -LocalPort 5500 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }"
echo Selesai. Sekarang jalankan start-now.bat atau npm run dev
pause
