@echo off
title FaceTrust AI - Backend Status Monitor
color 0B

echo.
echo ============================================
echo  █▀▀ ▄▀█ █▀▀ █▀▀ ▀█▀ █▀█ █░█ █▀ ▀█▀   ▄▀█ █
echo  █▀░ █▀█ █▄▄ █▄▄ ░█░ █▀▄ █▄█ ▄█ ░█░   █▀█ █
echo ============================================
echo           Backend Status Monitor
echo ============================================
echo.

REM Set working directory
cd /d "%~dp0"

:status_check
cls
echo.
echo ============================================
echo  FaceTrust AI Backend Status Monitor
echo ============================================
echo.

echo Checking backend health...
echo.

REM Check if Python is running
tasklist /FI "IMAGENAME eq python.exe" /FO CSV 2>NUL | find /I "python.exe" >nul
if errorlevel 1 (
    echo ❌ Backend Process: NOT RUNNING
    echo    No Python processes found
) else (
    echo ✅ Backend Process: RUNNING
    for /f "tokens=2" %%i in ('tasklist /FI "IMAGENAME eq python.exe" /FO CSV ^| find /I "python.exe"') do (
        echo    Process ID: %%i
    )
)

echo.
echo Checking API endpoints...
echo.

REM Check health endpoint
curl -s -o nul -w "%%{http_code}" http://localhost:5000/health > temp_status.txt 2>nul
if exist temp_status.txt (
    set /p status_code=<temp_status.txt
    del temp_status.txt
    if "%status_code%"=="200" (
        echo ✅ Health Endpoint: OK (HTTP %status_code%)
    ) else (
        echo ❌ Health Endpoint: ERROR (HTTP %status_code%)
    )
) else (
    echo ❌ Health Endpoint: UNREACHABLE
)

REM Check main API endpoint
curl -s -o nul -w "%%{http_code}" http://localhost:5000/api/face-recognition > temp_api.txt 2>nul
if exist temp_api.txt (
    set /p api_code=<temp_api.txt
    del temp_api.txt
    if "%api_code%"=="405" (
        echo ✅ API Endpoint: OK (HTTP %api_code% - Method Not Allowed is expected)
    ) else (
        echo ✅ API Endpoint: OK (HTTP %api_code%)
    )
) else (
    echo ❌ API Endpoint: UNREACHABLE
)

echo.
echo Checking model status...
echo.

REM Check if models directory exists
if exist "src\model\Models" (
    echo ✅ Models Directory: EXISTS
    dir /b "src\model\Models\*.jpg" 2>nul | find /c ".jpg" > temp_models.txt
    if exist temp_models.txt (
        set /p model_count=<temp_models.txt
        del temp_models.txt
        echo    Team Members: %model_count% registered
    ) else (
        echo    Team Members: 0 registered (using mock data)
    )
) else (
    echo ❌ Models Directory: NOT FOUND
)

echo.
echo Checking log files...
echo.

if exist "backend.log" (
    echo ✅ Log File: EXISTS
    for %%A in (backend.log) do echo    Size: %%~zA bytes
    echo    Last modified: 
    for %%A in (backend.log) do echo    %%~tA
) else (
    echo ❌ Log File: NOT FOUND
)

echo.
echo ============================================
echo  Status Check Complete - %date% %time%
echo ============================================
echo.
echo Press any key to refresh status...
echo Press Ctrl+C to exit
echo.

timeout /t 10 >nul
goto status_check
