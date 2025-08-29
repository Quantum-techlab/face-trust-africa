@echo off
echo ================================================
echo FaceTrust AI - Face Recognition Backend
echo ================================================
echo Starting backend server...
echo.

cd /d "E:\face-trust-africa"
python run_server.py

echo.
echo Server stopped. Press any key to restart...
pause
goto :start
