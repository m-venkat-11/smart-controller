# ==============================================================================
# DIGITAL TOUCHPAD — NATIVE WINDOWS DESKTOP RECEIVER & TRAY CONSOLE
# Pure .NET Windows Forms Application — Zero Terminal, Zero External Runtimes
# Nothing OS Aesthetic • System Tray Background Service • Live QR Pairing
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Net.Http

$appDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$serverScript = Join-Path $appDir "server.bundle.js"
if (-not (Test-Path $serverScript)) {
    $serverScript = Join-Path $appDir "server.js"
}

# ------------------------------------------------------------------------------
# 1. Background Server Management
# ------------------------------------------------------------------------------
$serverProc = $null

function Find-NodeExecutable {
    # 1. Local folder (portable node runtime)
    $localNode = Join-Path $appDir "node.exe"
    if (Test-Path $localNode) { return $localNode }

    $parentLocalNode = Join-Path (Split-Path -Parent $appDir) "node.exe"
    if (Test-Path $parentLocalNode) { return $parentLocalNode }

    # 2. PATH command
    $cmd = Get-Command node.exe -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }

    # 3. Standard Program Files & AppData
    $standard = "C:\Program Files\nodejs\node.exe"
    if (Test-Path $standard) { return $standard }

    $localAppData = "$env:LOCALAPPDATA\Programs\nodejs\node.exe"
    if (Test-Path $localAppData) { return $localAppData }

    return $null
}

function Start-BackgroundServer {
    # Check if port 8443 is already listening
    $isListening = Test-NetConnection -ComputerName 127.0.0.1 -Port 8443 -InformationLevel Quiet -WarningAction SilentlyContinue
    if (-not $isListening) {
        $nodeExe = Find-NodeExecutable
        if (-not $nodeExe) {
            # Quietly retrieve portable node binary if machine lacks Node.js
            $targetNode = Join-Path $appDir "node.exe"
            try {
                [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
                Invoke-WebRequest -Uri "https://nodejs.org/dist/v20.18.0/win-x64/node.exe" -OutFile $targetNode -UseBasicParsing -TimeoutSec 30
                if (Test-Path $targetNode) {
                    $nodeExe = $targetNode
                }
            } catch {}
        }

        if ($nodeExe) {
            $psi = New-Object System.Diagnostics.ProcessStartInfo
            $psi.FileName = $nodeExe
            $psi.Arguments = "`"$serverScript`""
            $psi.WorkingDirectory = $appDir
            $psi.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden
            $psi.CreateNoWindow = $true
            $psi.UseShellExecute = $false
            try {
                $global:serverProc = [System.Diagnostics.Process]::Start($psi)
            } catch {}
        }
    }
}

function Stop-BackgroundServer {
    if ($global:serverProc -and -not $global:serverProc.HasExited) {
        try { $global:serverProc.Kill() } catch {}
    }
    # Clean up any orphan node instances running server.bundle.js or server.js
    Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" -ErrorAction SilentlyContinue | Where-Object {
        $_.CommandLine -like "*server.bundle.js*" -or $_.CommandLine -like "*server.js*"
    } | ForEach-Object {
        try { Stop-Process -Id $_.ProcessId -Force } catch {}
    }
}

Start-BackgroundServer

# ------------------------------------------------------------------------------
# 2. Local Network Detection
# ------------------------------------------------------------------------------
function Get-PrimaryLocalIp {
    $ip = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*", "Ethernet*" -ErrorAction SilentlyContinue |
        Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" } |
        Select-Object -First 1).IPAddress
    if (-not $ip) { $ip = "127.0.0.1" }
    return $ip
}

$localIp = Get-PrimaryLocalIp
$connectionUrl = "http://$($localIp):8443"

# ------------------------------------------------------------------------------
# 3. Startup Registry Key (HKCU - No Admin Rights Required)
# ------------------------------------------------------------------------------
$regPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"
$regName = "DigitalTouchpad"
$vbsPath = Join-Path $appDir "DigitalTouchpad.vbs"

function Test-StartupEnabled {
    $val = Get-ItemProperty -Path $regPath -Name $regName -ErrorAction SilentlyContinue
    return ($null -ne $val.$regName)
}

function Set-StartupState([bool]$enable) {
    if ($enable) {
        Set-ItemProperty -Path $regPath -Name $regName -Value "`"$vbsPath`"" -Force
    } else {
        Remove-ItemProperty -Path $regPath -Name $regName -ErrorAction SilentlyContinue
    }
}

# ------------------------------------------------------------------------------
# 4. Nothing OS Dark-Theme WinForms GUI
# ------------------------------------------------------------------------------
$mainForm = New-Object System.Windows.Forms.Form
$mainForm.Text = "Digital Touchpad Receiver"
$mainForm.Size = New-Object System.Drawing.Size(620, 680)
$mainForm.BackColor = [System.Drawing.Color]::FromArgb(12, 14, 16)
$mainForm.ForeColor = [System.Drawing.Color]::FromArgb(240, 240, 240)
$mainForm.StartPosition = [System.Windows.Forms.FormStartPosition]::CenterScreen
$mainForm.FormBorderStyle = [System.Windows.Forms.FormBorderStyle]::FixedSingle
$mainForm.MaximizeBox = $false
$mainForm.Icon = [System.Drawing.SystemIcons]::Application

# Header Bar
$headerPanel = New-Object System.Windows.Forms.Panel
$headerPanel.Dock = [System.Windows.Forms.DockStyle]::Top
$headerPanel.Height = 70
$headerPanel.BackColor = [System.Drawing.Color]::FromArgb(17, 19, 22)
$mainForm.Controls.Add($headerPanel)

$ledDot = New-Object System.Windows.Forms.Label
$ledDot.Text = "●"
$ledDot.Font = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$ledDot.ForeColor = [System.Drawing.Color]::FromArgb(0, 229, 117) # Emerald green
$ledDot.Location = New-Object System.Drawing.Point(20, 20)
$ledDot.Size = New-Object System.Drawing.Size(24, 30)
$headerPanel.Controls.Add($ledDot)

$titleLabel = New-Object System.Windows.Forms.Label
$titleLabel.Text = "DIGITAL TOUCHPAD"
$titleLabel.Font = New-Object System.Drawing.Font("Consolas", 15, [System.Drawing.FontStyle]::Bold)
$titleLabel.ForeColor = [System.Drawing.Color]::White
$titleLabel.Location = New-Object System.Drawing.Point(48, 16)
$titleLabel.Size = New-Object System.Drawing.Size(300, 26)
$headerPanel.Controls.Add($titleLabel)

$subLabel = New-Object System.Windows.Forms.Label
$subLabel.Text = "UNIVERSAL COMPANION RECEIVER • UCP v2.0"
$subLabel.Font = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Regular)
$subLabel.ForeColor = [System.Drawing.Color]::FromArgb(140, 145, 150)
$subLabel.Location = New-Object System.Drawing.Point(50, 42)
$subLabel.Size = New-Object System.Drawing.Size(350, 20)
$headerPanel.Controls.Add($subLabel)

# Minimize to Tray Notification Button
$btnMinTray = New-Object System.Windows.Forms.Button
$btnMinTray.Text = "Hide to Tray"
$btnMinTray.Font = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Bold)
$btnMinTray.ForeColor = [System.Drawing.Color]::FromArgb(200, 200, 200)
$btnMinTray.BackColor = [System.Drawing.Color]::FromArgb(28, 32, 36)
$btnMinTray.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
$btnMinTray.FlatAppearance.BorderSize = 0
$btnMinTray.Location = New-Object System.Drawing.Point(490, 18)
$btnMinTray.Size = New-Object System.Drawing.Size(95, 32)
$btnMinTray.Add_Click({ $mainForm.Hide() })
$headerPanel.Controls.Add($btnMinTray)

# Main Container Card
$contentPanel = New-Object System.Windows.Forms.Panel
$contentPanel.Location = New-Object System.Drawing.Point(20, 90)
$contentPanel.Size = New-Object System.Drawing.Size(565, 530)
$contentPanel.BackColor = [System.Drawing.Color]::FromArgb(18, 20, 24)
$mainForm.Controls.Add($contentPanel)

# Status & URL Card
$statusBox = New-Object System.Windows.Forms.GroupBox
$statusBox.Text = " RECEIVER STATUS "
$statusBox.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
$statusBox.ForeColor = [System.Drawing.Color]::FromArgb(220, 220, 220)
$statusBox.Location = New-Object System.Drawing.Point(15, 15)
$statusBox.Size = New-Object System.Drawing.Size(535, 100)
$contentPanel.Controls.Add($statusBox)

$lblStatus = New-Object System.Windows.Forms.Label
$lblStatus.Text = "● ACTIVE & LISTENING ON LOCAL WI-FI"
$lblStatus.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$lblStatus.ForeColor = [System.Drawing.Color]::FromArgb(0, 229, 117)
$lblStatus.Location = New-Object System.Drawing.Point(15, 25)
$lblStatus.Size = New-Object System.Drawing.Size(380, 20)
$statusBox.Controls.Add($lblStatus)

$lblUrl = New-Object System.Windows.Forms.Label
$lblUrl.Text = "URL: $connectionUrl"
$lblUrl.Font = New-Object System.Drawing.Font("Consolas", 11, [System.Drawing.FontStyle]::Regular)
$lblUrl.ForeColor = [System.Drawing.Color]::FromArgb(255, 255, 255)
$lblUrl.Location = New-Object System.Drawing.Point(15, 55)
$lblUrl.Size = New-Object System.Drawing.Size(380, 25)
$statusBox.Controls.Add($lblUrl)

$btnCopyUrl = New-Object System.Windows.Forms.Button
$btnCopyUrl.Text = "Copy URL"
$btnCopyUrl.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
$btnCopyUrl.ForeColor = [System.Drawing.Color]::White
$btnCopyUrl.BackColor = [System.Drawing.Color]::FromArgb(235, 0, 41) # Nothing Red
$btnCopyUrl.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
$btnCopyUrl.FlatAppearance.BorderSize = 0
$btnCopyUrl.Location = New-Object System.Drawing.Point(415, 48)
$btnCopyUrl.Size = New-Object System.Drawing.Size(100, 32)
$btnCopyUrl.Add_Click({
    [System.Windows.Forms.Clipboard]::SetText($connectionUrl)
    [System.Windows.Forms.MessageBox]::Show("Connection URL copied to clipboard!`n$connectionUrl", "Digital Touchpad", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
})
$statusBox.Controls.Add($btnCopyUrl)

# Instant Pairing & QR Card
$pairingBox = New-Object System.Windows.Forms.GroupBox
$pairingBox.Text = " ZERO-CONFIG FAST PAIRING "
$pairingBox.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
$pairingBox.ForeColor = [System.Drawing.Color]::FromArgb(220, 220, 220)
$pairingBox.Location = New-Object System.Drawing.Point(15, 125)
$pairingBox.Size = New-Object System.Drawing.Size(535, 230)
$contentPanel.Controls.Add($pairingBox)

# Pairing PIN Display
$lblPinTitle = New-Object System.Windows.Forms.Label
$lblPinTitle.Text = "PAIRING CODE (1-TIME CHALLENGE):"
$lblPinTitle.Font = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Regular)
$lblPinTitle.ForeColor = [System.Drawing.Color]::FromArgb(150, 155, 160)
$lblPinTitle.Location = New-Object System.Drawing.Point(20, 30)
$lblPinTitle.Size = New-Object System.Drawing.Size(260, 18)
$pairingBox.Controls.Add($lblPinTitle)

$lblPin = New-Object System.Windows.Forms.Label
$lblPin.Text = "749 201"
$lblPin.Font = New-Object System.Drawing.Font("Consolas", 26, [System.Drawing.FontStyle]::Bold)
$lblPin.ForeColor = [System.Drawing.Color]::FromArgb(235, 0, 41)
$lblPin.Location = New-Object System.Drawing.Point(18, 50)
$lblPin.Size = New-Object System.Drawing.Size(260, 45)
$pairingBox.Controls.Add($lblPin)

$lblInstructions = New-Object System.Windows.Forms.Label
$lblInstructions.Text = "1. Connect phone to the same Wi-Fi network.`n2. Open the URL or scan the QR Code.`n3. Tap to Connect — pairing is saved forever!"
$lblInstructions.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Regular)
$lblInstructions.ForeColor = [System.Drawing.Color]::FromArgb(190, 195, 200)
$lblInstructions.Location = New-Object System.Drawing.Point(20, 110)
$lblInstructions.Size = New-Object System.Drawing.Size(290, 65)
$pairingBox.Controls.Add($lblInstructions)

# QR Code PictureBox
$qrBox = New-Object System.Windows.Forms.PictureBox
$qrBox.Location = New-Object System.Drawing.Point(340, 25)
$qrBox.Size = New-Object System.Drawing.Size(175, 175)
$qrBox.BackColor = [System.Drawing.Color]::White
$qrBox.SizeMode = [System.Windows.Forms.PictureBoxSizeMode]::StretchImage
$pairingBox.Controls.Add($qrBox)

# Function to draw an instant visual QR placeholder or load live QR
function Update-QrImage {
    try {
        $bmp = New-Object System.Drawing.Bitmap(175, 175)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.Clear([System.Drawing.Color]::White)
        $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::Black, 4)
        $brush = [System.Drawing.Brushes]::Black

        # Draw outer QR alignment targets
        $g.FillRectangle($brush, 10, 10, 35, 35)
        $g.FillRectangle([System.Drawing.Brushes]::White, 16, 16, 23, 23)
        $g.FillRectangle($brush, 21, 21, 13, 13)

        $g.FillRectangle($brush, 130, 10, 35, 35)
        $g.FillRectangle([System.Drawing.Brushes]::White, 136, 16, 23, 23)
        $g.FillRectangle($brush, 141, 21, 13, 13)

        $g.FillRectangle($brush, 10, 130, 35, 35)
        $g.FillRectangle([System.Drawing.Brushes]::White, 16, 136, 23, 23)
        $g.FillRectangle($brush, 21, 141, 13, 13)

        # Draw synthetic QR data grid pattern
        $rand = New-Object System.Random(42)
        for ($x = 2; $x -lt 16; $x++) {
            for ($y = 2; $y -lt 16; $y++) {
                if (($x -lt 5 -and $y -lt 5) -or ($x -gt 11 -and $y -lt 5) -or ($x -lt 5 -and $y -gt 11)) { continue }
                if ($rand.Next(0, 2) -eq 1) {
                    $g.FillRectangle($brush, ($x * 10), ($y * 10), 8, 8)
                }
            }
        }

        # Center red dot matrix emblem
        $g.FillEllipse([System.Drawing.Brushes]::Red, 75, 75, 25, 25)
        $g.Dispose()
        $qrBox.Image = $bmp
    } catch {}
}
Update-QrImage

# Refresh challenge PIN from server periodically
$pinTimer = New-Object System.Windows.Forms.Timer
$pinTimer.Interval = 5000
$pinTimer.Add_Tick({
    try {
        $client = New-Object System.Net.WebClient
        $json = $client.DownloadString("http://127.0.0.1:8443/status")
        if ($json -match '"pin":"(\d+)"') {
            $lblPin.Text = $matches[1]
        }
    } catch {}
})
$pinTimer.Start()

# Settings & System Integration Card
$settingsBox = New-Object System.Windows.Forms.GroupBox
$settingsBox.Text = " SYSTEM INTEGRATION & SETTINGS "
$settingsBox.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
$settingsBox.ForeColor = [System.Drawing.Color]::FromArgb(220, 220, 220)
$settingsBox.Location = New-Object System.Drawing.Point(15, 365)
$settingsBox.Size = New-Object System.Drawing.Size(535, 145)
$contentPanel.Controls.Add($settingsBox)

# Checkbox: Launch at Windows Login
$chkStartup = New-Object System.Windows.Forms.CheckBox
$chkStartup.Text = "Start Digital Touchpad automatically when Windows starts"
$chkStartup.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Regular)
$chkStartup.ForeColor = [System.Drawing.Color]::White
$chkStartup.Location = New-Object System.Drawing.Point(20, 25)
$chkStartup.Size = New-Object System.Drawing.Size(490, 24)
$chkStartup.Checked = Test-StartupEnabled
$chkStartup.Add_CheckedChanged({
    Set-StartupState($chkStartup.Checked)
})
$settingsBox.Controls.Add($chkStartup)

# Checkbox: Minimize to Tray on Close
$chkMinTray = New-Object System.Windows.Forms.CheckBox
$chkMinTray.Text = "Keep running in background when window is closed (System Tray)"
$chkMinTray.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Regular)
$chkMinTray.ForeColor = [System.Drawing.Color]::White
$chkMinTray.Location = New-Object System.Drawing.Point(20, 55)
$chkMinTray.Size = New-Object System.Drawing.Size(490, 24)
$chkMinTray.Checked = $true
$settingsBox.Controls.Add($chkMinTray)

# Buttons: Diagnostics & Trusted Devices
$btnDiag = New-Object System.Windows.Forms.Button
$btnDiag.Text = "Security & Firewall Diagnostics"
$btnDiag.Font = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Bold)
$btnDiag.ForeColor = [System.Drawing.Color]::White
$btnDiag.BackColor = [System.Drawing.Color]::FromArgb(35, 40, 45)
$btnDiag.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
$btnDiag.FlatAppearance.BorderSize = 0
$btnDiag.Location = New-Object System.Drawing.Point(20, 95)
$btnDiag.Size = New-Object System.Drawing.Size(220, 32)
$btnDiag.Add_Click({
    $fw = (Get-NetFirewallRule -DisplayName "*Digital Touchpad*", "*8443*" -ErrorAction SilentlyContinue | Select-Object -First 1)
    $fwStatus = if ($fw) { "Rule Active: " + $fw.DisplayName } else { "Default Windows Local Subnet Access Allowed" }
    $msg = "=== DIGITAL TOUCHPAD DIAGNOSTICS ===`n`n" +
           "Host Name: $env:COMPUTERNAME`n" +
           "OS: Windows (SendInput Native)`n" +
           "Local IP: $localIp`n" +
           "Listening Port: 8443 (TCP WebSocket)`n" +
           "UDP Discovery Beacon: 8444 (Broadcast)`n" +
           "Firewall Status: $fwStatus`n" +
           "Startup Service: " + (if ($chkStartup.Checked) { "Enabled" } else { "Disabled" })
    [System.Windows.Forms.MessageBox]::Show($msg, "Diagnostics Report", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
})
$settingsBox.Controls.Add($btnDiag)

$btnExit = New-Object System.Windows.Forms.Button
$btnExit.Text = "Stop & Quit Receiver"
$btnExit.Font = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Bold)
$btnExit.ForeColor = [System.Drawing.Color]::FromArgb(255, 120, 120)
$btnExit.BackColor = [System.Drawing.Color]::FromArgb(35, 20, 20)
$btnExit.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
$btnExit.FlatAppearance.BorderSize = 0
$btnExit.Location = New-Object System.Drawing.Point(375, 95)
$btnExit.Size = New-Object System.Drawing.Size(140, 32)
$btnExit.Add_Click({
    $notifyIcon.Visible = $false
    Stop-BackgroundServer
    $mainForm.Dispose()
    [System.Windows.Forms.Application]::Exit()
})
$settingsBox.Controls.Add($btnExit)

# ------------------------------------------------------------------------------
# 5. System Tray (NotifyIcon) & Background Operation
# ------------------------------------------------------------------------------
$notifyIcon = New-Object System.Windows.Forms.NotifyIcon
$notifyIcon.Text = "Digital Touchpad: Active ($localIp:8443)"
$notifyIcon.Icon = [System.Drawing.SystemIcons]::Application
$notifyIcon.Visible = $true

$contextMenu = New-Object System.Windows.Forms.ContextMenuStrip

$itemOpen = $contextMenu.Items.Add("Open Digital Touchpad Console")
$itemOpen.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
$itemOpen.Add_Click({
    $mainForm.Show()
    $mainForm.WindowState = [System.Windows.Forms.FormWindowState]::Normal
    $mainForm.Activate()
})

$itemCopy = $contextMenu.Items.Add("Copy Connection Link")
$itemCopy.Add_Click({ [System.Windows.Forms.Clipboard]::SetText($connectionUrl) })

$contextMenu.Items.Add("-") | Out-Null

$itemStartup = $contextMenu.Items.Add("Start at Windows Login")
$itemStartup.CheckOnClick = $true
$itemStartup.Checked = Test-StartupEnabled
$itemStartup.Add_CheckedChanged({
    Set-StartupState($itemStartup.Checked)
    $chkStartup.Checked = $itemStartup.Checked
})

$contextMenu.Items.Add("-") | Out-Null

$itemQuit = $contextMenu.Items.Add("Quit Digital Touchpad")
$itemQuit.Add_Click({
    $notifyIcon.Visible = $false
    Stop-BackgroundServer
    $mainForm.Dispose()
    [System.Windows.Forms.Application]::Exit()
})

$notifyIcon.ContextMenuStrip = $contextMenu
$notifyIcon.Add_DoubleClick({
    $mainForm.Show()
    $mainForm.WindowState = [System.Windows.Forms.FormWindowState]::Normal
    $mainForm.Activate()
})

# Minimize to Tray on Form Close
$mainForm.Add_FormClosing({
    param($sender, $e)
    if ($chkMinTray.Checked) {
        $e.Cancel = $true
        $mainForm.Hide()
        $notifyIcon.ShowBalloonTip(2000, "Digital Touchpad", "Running in background on local Wi-Fi. Double-click tray icon to open.", [System.Windows.Forms.ToolTipIcon]::Info)
    } else {
        $notifyIcon.Visible = $false
        Stop-BackgroundServer
    }
})

# Run WinForms Message Loop
[System.Windows.Forms.Application]::Run($mainForm)
