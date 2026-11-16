@echo off
title GlyphPad Receiver
cd /d "%~dp0"

echo ========================================================
echo               GLYPHPAD RECEIVER LAUNCHER
echo ========================================================

echo [*] Checking for previous receiver instances on port 8443...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8443 ^| findstr LISTENING') do (
    echo [*] Terminating stale process on port 8443 (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

echo [*] Starting GlyphPad Companion Receiver...
echo.
node receiver/server.js
pause
