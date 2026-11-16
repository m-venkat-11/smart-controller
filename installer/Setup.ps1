# ==============================================================================
# DIGITAL TOUCHPAD — WINDOWS INSTALLER SCRIPT
# Installs to %LOCALAPPDATA%\DigitalTouchpad (No admin rights required for files)
# Creates Shortcuts, Firewall Rule, and Uninstaller
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$appName = "Digital Touchpad"
$installDir = Join-Path $env:LOCALAPPDATA "DigitalTouchpad"
$sourceDir = Resolve-Path (Join-Path $PSScriptRoot "..")

Write-Host "[*] Target Installation Directory: $installDir" -ForegroundColor Cyan

# 1. Terminate existing receiver processes
Write-Host "[*] Stopping any active instances..." -ForegroundColor Gray
Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*server.js*"
} | ForEach-Object { try { Stop-Process -Id $_.ProcessId -Force } catch {} }

# 2. Create Target Directory & Copy Application Files
if (-not (Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir -Force | Out-Null
}

Write-Host "[*] Copying application files..." -ForegroundColor Gray
$itemsToCopy = @("receiver", "dist", "DigitalTouchpad.vbs", "package.json")
foreach ($item in $itemsToCopy) {
    $src = Join-Path $sourceDir $item
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $installDir -Recurse -Force | Out-Null
    }
}

# 3. Create Windows Shortcuts (Desktop and Start Menu)
Write-Host "[*] Creating Desktop and Start Menu shortcuts..." -ForegroundColor Gray
$wsh = New-Object -ComObject WScript.Shell

# Desktop Shortcut
$desktopPath = [System.Environment]::GetFolderPath("Desktop")
if (-not $desktopPath -or -not (Test-Path $desktopPath)) {
    $desktopPath = Join-Path $env:USERPROFILE "Desktop"
}
if (Test-Path $desktopPath) {
    $shortcutDesktop = $wsh.CreateShortcut((Join-Path $desktopPath "$appName.lnk"))
    $shortcutDesktop.TargetPath = "wscript.exe"
    $shortcutDesktop.Arguments = "`"$installDir\DigitalTouchpad.vbs`""
    $shortcutDesktop.WorkingDirectory = $installDir
    $shortcutDesktop.Description = "Digital Touchpad Wireless Companion Receiver"
    $shortcutDesktop.Save()
}

# Start Menu Shortcut
$programsPath = [System.Environment]::GetFolderPath("Programs")
if (-not $programsPath -or -not (Test-Path $programsPath)) {
    $programsPath = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs"
}
$startMenuAppDir = Join-Path $programsPath $appName
if (-not (Test-Path $startMenuAppDir)) {
    New-Item -ItemType Directory -Path $startMenuAppDir -Force -ErrorAction SilentlyContinue | Out-Null
}
if (Test-Path $startMenuAppDir) {
    $shortcutStart = $wsh.CreateShortcut((Join-Path $startMenuAppDir "$appName.lnk"))
    $shortcutStart.TargetPath = "wscript.exe"
    $shortcutStart.Arguments = "`"$installDir\DigitalTouchpad.vbs`""
    $shortcutStart.WorkingDirectory = $installDir
    $shortcutStart.Description = "Digital Touchpad Wireless Companion Receiver"
    $shortcutStart.Save()
}

# 4. Generate Uninstaller in Install Directory and Start Menu
Write-Host "[*] Generating uninstaller..." -ForegroundColor Gray
$uninstallerScript = @"
@echo off
title Uninstall Digital Touchpad
echo ========================================================
echo             UNINSTALL DIGITAL TOUCHPAD
echo ========================================================
echo.
echo [*] Terminating running receiver processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8443 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [*] Removing shortcuts...
del /F /Q "%USERPROFILE%\Desktop\Digital Touchpad.lnk" >nul 2>&1
rd /S /Q "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Digital Touchpad" >nul 2>&1

echo [*] Removing startup registry key...
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "DigitalTouchpad" /f >nul 2>&1

echo [*] Removing firewall rules...
netsh advfirewall firewall delete rule name="Digital Touchpad Receiver" >nul 2>&1

echo [*] Cleaning installation folder...
cd /d "%TEMP%"
rd /S /Q "$installDir" >nul 2>&1

echo.
echo [✓] Digital Touchpad has been successfully uninstalled.
echo.
pause
"@

if (Test-Path $installDir) {
    $uninstallerPath = Join-Path $installDir "Uninstall-DigitalTouchpad.bat"
    Set-Content -Path $uninstallerPath -Value $uninstallerScript -Encoding ASCII
}

if (Test-Path $startMenuAppDir) {
    $shortcutUninstall = $wsh.CreateShortcut((Join-Path $startMenuAppDir "Uninstall $appName.lnk"))
    $shortcutUninstall.TargetPath = $uninstallerPath
    $shortcutUninstall.WorkingDirectory = $installDir
    $shortcutUninstall.Description = "Uninstall Digital Touchpad"
    $shortcutUninstall.Save()
}

# 5. Narrow Windows Firewall Rule Configuration (Port 8443 TCP)
Write-Host "[*] Checking Windows Firewall rule for Port 8443 (TCP)..." -ForegroundColor Gray
try {
    $existing = Get-NetFirewallRule -DisplayName "Digital Touchpad Receiver" -ErrorAction SilentlyContinue
    if (-not $existing) {
        netsh advfirewall firewall add rule name="Digital Touchpad Receiver" dir=in action=allow protocol=TCP localport=8443 profile=private >nul 2>&1
        Write-Host "    ✓ Configured Private network firewall rule for port 8443" -ForegroundColor Green
    } else {
        Write-Host "    ✓ Firewall rule already active" -ForegroundColor Green
    }
} catch {
    Write-Host "    (Firewall rule configuration will use standard Windows prompt on first run)" -ForegroundColor Yellow
}

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host " [✓] DIGITAL TOUCHPAD INSTALLATION COMPLETE!" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host " • Application installed to: $installDir" -ForegroundColor White
Write-Host " • Desktop shortcut created: Digital Touchpad.lnk" -ForegroundColor White
Write-Host " • Start Menu shortcut created." -ForegroundColor White
Write-Host " • Uninstaller generated." -ForegroundColor White
Write-Host " • Run Digital Touchpad from your Desktop or Start Menu anytime!" -ForegroundColor White
Write-Host "========================================================`n" -ForegroundColor Green

# Launch the installed application immediately
Write-Host "[*] Launching Digital Touchpad in background..." -ForegroundColor Cyan
Start-Process "wscript.exe" -ArgumentList "`"$installDir\DigitalTouchpad.vbs`""
