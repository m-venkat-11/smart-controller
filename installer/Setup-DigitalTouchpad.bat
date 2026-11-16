@echo off
title Digital Touchpad Setup
cd /d "%~dp0"

echo ========================================================
echo              DIGITAL TOUCHPAD INSTALLER
echo     Zero-Manual-Configuration Wireless Touchpad
echo ========================================================
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Setup.ps1"

echo.
pause
