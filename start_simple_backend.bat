@echo off
echo Starting FaceTrust AI Backend Server...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

REM Install required packages if not present
echo Installing/updating required packages...
pip install flask flask-cors opencv-contrib-python numpy

REM Start the backend server
echo.
echo Starting backend server on port 5000...
echo Server will be available at http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

python simple_backend.py

pause
