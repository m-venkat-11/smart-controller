@echo off
title Digital Touchpad Companion
cd /d "%~dp0"

:: If silent GUI launcher exists, start it with zero terminal
if exist "receiver\DigitalTouchpad.vbs" (
    start "" wscript.exe "receiver\DigitalTouchpad.vbs"
    exit /b 0
)
if exist "DigitalTouchpad.vbs" (
    start "" wscript.exe "DigitalTouchpad.vbs"
    exit /b 0
)

:: Clear previous receiver instances on port 8443
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8443 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

if exist "receiver\server.bundle.js" (
    node receiver\server.bundle.js
) else (
    node receiver\server.js
)
pause
