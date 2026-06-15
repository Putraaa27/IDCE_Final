@echo off
title IDCE - Test Gemini API
color 0E
cls
echo ============================================================
echo  IDCE - Test Gemini API
echo ============================================================
echo.
echo Pastikan website sedang berjalan lewat run.bat atau setup-gemini.bat
echo.
curl -X POST http://localhost:5500/api/gemini -H "Content-Type: application/json" -d "{\"message\":\"Jelaskan singkat apa itu IDCE ITSB\"}"
echo.
echo.
pause
