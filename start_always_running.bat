@echo off
title FaceTrust AI - Always Running Production Server
color 0A

echo.
echo ============================================
echo  █▀▀ ▄▀█ █▀▀ █▀▀ ▀█▀ █▀█ █░█ █▀ ▀█▀   ▄▀█ █
echo  █▀░ █▀█ █▄▄ █▄▄ ░█░ █▀▄ █▄█ ▄█ ░█░   █▀█ █
echo ============================================
echo        Always Running Production Server
echo ============================================
echo.

REM Set working directory
cd /d "%~dp0"

echo [1/6] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Python is not installed or not in PATH
    echo    Please install Python 3.8+ from python.org
    echo    Download: https://python.org/downloads
    pause
    exit /b 1
)
echo ✅ Python is installed

echo.
echo [2/6] Installing required packages...
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
echo [3/6] Checking model files...
if exist "src\model\Models\*.jpg" (
    echo ✅ Model images found
    dir /b "src\model\Models\*.jpg" | find /c ".jpg" > temp_count.txt
    set /p image_count=<temp_count.txt
    del temp_count.txt
    echo    Found %image_count% team member images
) else (
    echo ⚠️  No model images found - will use mock data
)

echo.
echo [4/6] Starting production backend server...
echo.
echo 🚀 FaceTrust AI Production Server v2.0.0
echo 📊 Server will be available at:
echo    - http://localhost:5000
echo    - http://127.0.0.1:5000
echo.
echo 🔧 Production Features:
echo    - Auto-restart on failures (up to 10 attempts)
echo    - Health monitoring every 30 seconds
echo    - Comprehensive logging with timestamps
echo    - Memory and CPU resource limits
echo    - Graceful error handling and recovery
echo.
echo 📝 Logs: Check backend.log for detailed information
echo 🛑 To stop: Close this window or press Ctrl+C
echo 🔄 Auto-recovery: Server will restart automatically if it crashes
echo.
echo ============================================
echo   Production server starting...
echo ============================================
echo.

REM Start the production server with auto-restart capability
:restart_loop
echo [%date% %time%] Starting production server...
python production_backend.py
echo [%date% %time%] Server stopped, restarting in 5 seconds...
timeout /t 5 /nobreak >nul
goto restart_loop

echo.
echo ============================================
echo     Production server stopped
echo ============================================
pause
