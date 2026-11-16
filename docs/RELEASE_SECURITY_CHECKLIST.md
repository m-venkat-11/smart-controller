# RELEASE SECURITY & ACCEPTANCE CHECKLIST

Before any release of Digital Touchpad is packaged, signed, or published, it must pass this release security gate:

## 1. Source Code & Binary Audit
- [x] Zero raw, unsigned `.exe` compiled on the fly.
- [x] Zero kernel-level drivers or third-party root certificates bundled.
- [x] Zero obfuscated code or suspicious packers (e.g. UPX).
- [x] In-memory execution using official, Microsoft-signed hosts (`powershell.exe`).
- [x] All dependencies audited with `npm audit` and vulnerability scanning.
- [x] Zero hardcoded IP addresses, secret keys, or test credentials in production code.

## 2. Operating System & Security Cooperation
- [x] Windows Defender Antivirus compatibility verified (Zero alerts on Win10/Win11).
- [x] Windows Defender SmartScreen guidance and code-signing documentation prepared.
- [x] Windows Firewall configured via least-privilege private profile (Port 8443 only).
- [x] Antivirus settings are NEVER disabled or modified automatically.
- [x] Silent background execution with real Windows System Tray icon (`NotifyIcon`).

## 3. Network & Zero-Manual-Configuration Experience
- [x] UDP Broadcast discovery beacon implemented on port 8444.
- [x] Real Subnet scan implemented in web client.
- [x] Instant Camera QR Code scanner modal (`QRScannerModal.tsx`) implemented.
- [x] One-time secure pairing challenge with 6-digit PIN and dynamic token.
- [x] One-tap reconnection for trusted devices stored in persistent trust stores.
- [x] Clean uninstaller script provided.

## 4. Mandatory Acceptance Test Verification
- [x] Tested on Windows 11 desktop and laptop.
- [x] Tested native mouse movement via Win32 `SendInput`.
- [x] Tested left click, right click, double click, scroll wheel, and system shortcuts.
- [x] Verified zero terminal exposure in normal operation via `DigitalTouchpad.vbs`.
- [x] Verified clean shutdown and release of all pressed keys on disconnect.
