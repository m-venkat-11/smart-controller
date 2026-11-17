@echo off
title Stop Digital Touchpad
cd /d "%~dp0"

echo ================================================================
echo           STOPPING DIGITAL TOUCHPAD RECEIVER
echo ================================================================
echo.

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8443 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
    echo [?] Receiver process PID %%a terminated.
)

powershell.exe -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name = 'powershell.exe'\" | Where-Object { $_.CommandLine -like '*injector.ps1*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }" >nul 2>&1

echo.
echo [?] Digital Touchpad receiver has been completely stopped.
echo     Port 8443 is now released.
echo.
timeout /t 3