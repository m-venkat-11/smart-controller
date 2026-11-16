# INSTALLATION, DIRECTORY STRUCTURE & UNINSTALLATION

## 1. Installation Overview

Digital Touchpad is engineered for **zero friction**:
* **Standard User Installation:** Installs into user-scoped directories (`%LOCALAPPDATA%\DigitalTouchpad`), avoiding administrative UAC prompts during file placement.
* **No Node.js Prerequisite for End Users:** Can be run as a standalone Windows GUI application.
* **Zero Terminal Window:** Launches quietly in the background with a System Tray icon.

---

## 2. Directory & Registration Layout

```
C:\Users\<Username>\AppData\Local\DigitalTouchpad\
├── DigitalTouchpad.vbs         # Silent background launcher (No terminal)
├── package.json               # Manifest & dependency descriptors
├── receiver\
│   ├── DigitalTouchpadApp.ps1 # WinForms desktop UI & Tray controller
│   ├── server.js              # Local HTTP & WebSocket UCP v2.0 engine
│   ├── injector.ps1           # Native Win32 SendInput execution engine
│   └── trusted_devices.json   # Persistent cryptographic pairing store
├── dist\                      # Pre-compiled offline web client assets
└── Uninstall-DigitalTouchpad.bat # Complete uninstaller script
```

### Windows Shell Integrations:
* **Desktop Shortcut:** `%USERPROFILE%\Desktop\Digital Touchpad.lnk` $\rightarrow$ launches `DigitalTouchpad.vbs` silently.
* **Start Menu:** `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Digital Touchpad\`
  * `Digital Touchpad.lnk`
  * `Uninstall Digital Touchpad.lnk`
* **Startup at Login (Optional):** Registry entry in `HKCU\Software\Microsoft\Windows\CurrentVersion\Run\DigitalTouchpad`.

---

## 3. Clean Uninstallation Guarantee

Digital Touchpad believes in respectful software behavior. The uninstaller removes 100% of the application's components without leaving orphaned files or altered system settings:

### What the Uninstaller Does:
1. Closes any active background receiver processes.
2. Removes shortcuts from Desktop and Start Menu.
3. Deletes the `HKCU` startup registry key.
4. Removes the narrowly scoped Windows Firewall rule for port 8443.
5. Deletes the installation folder `%LOCALAPPDATA%\DigitalTouchpad`.
6. Leaves all unrelated system files and settings completely untouched.
