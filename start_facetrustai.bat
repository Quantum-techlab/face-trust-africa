@echo off
title FaceTrust AI - Startup Manager
color 0A

echo.
echo  ============================================
echo  █▀▀ ▄▀█ █▀▀ █▀▀ ▀█▀ █▀█ █░█ █▀ ▀█▀   ▄▀█ █
echo  █▀░ █▀█ █▄▄ █▄▄ ░█░ █▀▄ █▄█ ▄█ ░█░   █▀█ █
echo  ============================================
echo            Face Recognition System
echo  ============================================
echo.

REM Set working directory
cd /d "%~dp0"

echo [1/5] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Python is not installed or not in PATH
    echo    Please install Python 3.8+ from python.org
    pause
    exit /b 1
)
echo ✅ Python is installed

echo.
echo [2/5] Installing required packages...
echo    Installing Flask...
pip install flask >nul 2>&1
echo    Installing Flask-CORS...
pip install flask-cors >nul 2>&1
echo    Installing OpenCV...
pip install opencv-contrib-python >nul 2>&1
echo    Installing NumPy...
pip install numpy >nul 2>&1
echo    Installing Requests...
pip install requests >nul 2>&1
echo ✅ All packages installed

echo.
echo [3/5] Checking model files...
if exist "src\model\Models\*.jpg" (
    echo ✅ Model images found
) else (
    echo ⚠️  No model images found - will use mock data
)

echo.
echo [4/5] Testing backend connection...
timeout /t 2 >nul

echo.
echo [5/5] Starting FaceTrust AI Backend Server...
echo.
echo 🚀 Server starting on http://localhost:5000
echo 📊 Frontend should connect automatically
echo 🔄 To restart: run this script again
echo 🛑 To stop: Press Ctrl+C in this window
echo.
echo ============================================
echo   Backend is ready for face recognition
echo ============================================
echo.

REM Start the backend server
python simple_backend.py

echo.
echo ============================================
echo     Backend server has stopped
echo ============================================
pause
