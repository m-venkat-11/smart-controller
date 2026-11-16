@echo off
title GlyphPad Receiver
cd /d "%~dp0"
echo Starting GlyphPad Receiver...
node receiver/server.js
pause
