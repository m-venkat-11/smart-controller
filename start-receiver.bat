@echo off
title Digital Touchpad Launcher
cd /d "%~dp0"

echo ================================================================
echo           DIGITAL TOUCHPAD COMPANION RECEIVER
echo ================================================================
echo.

:: Clear previous receiver on port 8443
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8443 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

:: Locate node executable
set NODE_EXE=node
where node >nul 2>&1
if %errorlevel% neq 0 (
    if exist "C:\Program Files\nodejs\node.exe" set NODE_EXE="C:\Program Files\nodejs\node.exe"
    if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" set NODE_EXE="%LOCALAPPDATA%\Programs\nodejs\node.exe"
    if exist "node.exe" set NODE_EXE="%~dp0node.exe"
    if exist "receiver\node.exe" set NODE_EXE="%~dp0receiver\node.exe"
)

:: Locate server script
set SERVER_SCRIPT="%~dp0receiver\server.bundle.js"
if not exist %SERVER_SCRIPT% set SERVER_SCRIPT="%~dp0server.bundle.js"
if not exist %SERVER_SCRIPT% set SERVER_SCRIPT="%~dp0receiver\server.js"
if not exist %SERVER_SCRIPT% set SERVER_SCRIPT="%~dp0server.js"

:: Launch receiver in background (detached process)
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process %NODE_EXE% -ArgumentList '%SERVER_SCRIPT%' -WorkingDirectory '%~dp0' -WindowStyle Hidden"

:: Brief wait for socket
timeout /t 2 /nobreak >nul 2>&1

:: Display connection link and safe-to-close guidance
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$ip = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias 'Wi-Fi*', 'Ethernet*' -ErrorAction SilentlyContinue | Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254*' } | Select-Object -First 1).IPAddress; if (-not $ip) { $ip = '127.0.0.1' }; Write-Host '================================================================' -ForegroundColor Green; Write-Host '  [?] RECEIVER IS ACTIVE & RUNNING IN THE BACKGROUND!' -ForegroundColor Green; Write-Host '================================================================' -ForegroundColor Green; Write-Host ''; Write-Host '  ?? ON YOUR PHONE (CHROME OR SAFARI), OPEN:' -ForegroundColor Yellow; Write-Host \"     http://$($ip):8443\" -ForegroundColor Cyan; Write-Host ''; Write-Host '  ? OR IN smart-controller.vercel.app ENTER IP:'; Write-Host \"     $($ip)\" -ForegroundColor White; Write-Host ''; Write-Host '----------------------------------------------------------------'; Write-Host '  [NOTE] YOU CAN SAFELY CLOSE THIS WINDOW NOW!' -ForegroundColor Gray; Write-Host '         The receiver will KEEP RUNNING in the background.' -ForegroundColor Gray; Write-Host '         To stop it anytime, run stop-receiver.bat.' -ForegroundColor Gray; Write-Host '================================================================'"

echo.
pause