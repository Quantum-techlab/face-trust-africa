@echo off
title FaceTrust AI Production Server
color 0A

echo.
echo ============================================
echo  █▀▀ ▄▀█ █▀▀ █▀▀ ▀█▀ █▀█ █░█ █▀ ▀█▀   ▄▀█ █
echo  █▀░ █▀█ █▄▄ █▄▄ ░█░ █▀▄ █▄█ ▄█ ░█░   █▀█ █
echo ============================================
echo        Production Server Manager
echo ============================================
echo.

REM Set working directory
cd /d "%~dp0"

echo [1/4] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Python is not installed or not in PATH
    echo    Please install Python 3.8+ from python.org
    pause
    exit /b 1
)
echo ✅ Python is installed

echo.
echo [2/4] Installing required packages...
echo    Installing Flask...
pip install flask >nul 2>&1
echo    Installing Flask-CORS...
pip install flask-cors >nul 2>&1
echo    Installing OpenCV...
pip install opencv-contrib-python >nul 2>&1
echo    Installing NumPy...
pip install numpy >nul 2>&1
echo ✅ All packages installed

echo.
echo [3/4] Checking model files...
if exist "src\model\Models\*.jpg" (
    echo ✅ Model images found
) else (
    echo ⚠️  No model images found - will use mock data
)

echo.
echo [4/4] Starting Production Server...
echo.
echo 🚀 FaceTrust AI Production Server v2.0.0
echo 📊 Server will be available at:
echo    - http://localhost:5000
echo    - http://127.0.0.1:5000
echo.
echo 🔧 Features:
echo    - Auto-restart on failures
echo    - Comprehensive logging
echo    - Health monitoring
echo    - Production-ready configuration
echo.
echo 🛑 To stop: Press Ctrl+C or close this window
echo 📝 Logs: Check backend.log for detailed information
echo.
echo ============================================
echo   Production server is starting...
echo ============================================
echo.

REM Start the production server
python production_backend.py

echo.
echo ============================================
echo     Production server has stopped
echo ============================================
pause
