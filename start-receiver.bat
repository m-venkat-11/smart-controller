@echo off
title Digital Touchpad Receiver Console
cd /d "%~dp0"

echo ================================================================
echo           DIGITAL TOUCHPAD COMPANION RECEIVER (WINDOWS)
echo ================================================================
echo.

:: Clear previous receiver instances on port 8443
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8443 ^| findstr LISTENING') do (
    echo [*] Closing previous receiver instance on port 8443 (PID %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

:: Locate node executable
set NODE_EXE=node
where node >nul 2>&1
if %errorlevel% neq 0 (
    if exist "C:\Program Files\nodejs\node.exe" set NODE_EXE="C:\Program Files\nodejs\node.exe"
    if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" set NODE_EXE="%LOCALAPPDATA%\Programs\nodejs\node.exe"
    if exist "node.exe" set NODE_EXE="node.exe"
    if exist "receiver\node.exe" set NODE_EXE="receiver\node.exe"
)

if exist "receiver\server.bundle.js" (
    %NODE_EXE% receiver\server.bundle.js
) else if exist "server.bundle.js" (
    %NODE_EXE% server.bundle.js
) else if exist "receiver\server.js" (
    %NODE_EXE% receiver\server.js
) else (
    %NODE_EXE% server.js
)

echo.
pause
