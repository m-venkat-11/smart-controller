# PLATFORM COMPATIBILITY & PERMISSION MATRIX
## SmartController: GlyphPad

### 1. Verification & Status Definitions
- **Verified in Lab:** Validated on physical devices or active automated OS rigs.
- **In Development:** Architectural contracts complete; driver/binding phase active.
- **Experimental:** Subject to operating system sandboxing limitations.
- **Unsupported:** Operating system lacks required public APIs or prohibits input injection.

---

### 2. Comprehensive Matrix

| Platform Tier | OS & Version | Connection Modes | Pointer Injection | Keyboard / Shortcuts | Required System Permissions | Current Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Mobile Client** | Android 10 - 15+ | Wi-Fi LAN / Hotspot / Bluetooth HID (selected models) | Client capture (multi-touch) | Full virtual keyboard | Near-by devices, Wi-Fi multicast | Verified in Lab |
| **Mobile Client** | iOS 16 - 18+ | Wi-Fi LAN / Hotspot | Client capture (multi-touch) | Virtual keyboard | Local Network (`NSLocalNetworkUsageDescription`) | In Development |
| **Desktop Host** | Windows 10/11 (x64, ARM64) | Wi-Fi LAN / Hotspot | Win32 `SendInput` | Full allowlisted keys & media | Firewall inbound rule (TCP/WebSocket) | Verified in Lab |
| **Desktop Host** | macOS 13 - 15+ (Apple Silicon/Intel) | Wi-Fi LAN / Hotspot | CoreGraphics `CGEvent` | Full virtual keys | macOS Accessibility (`AXIsProcessTrusted`) | In Development |
| **Desktop Host** | Linux (Ubuntu/Fedora/Arch - X11) | Wi-Fi LAN | `XTest` extension | Key symbols | User group access | In Development |
| **Desktop Host** | Linux (Wayland) | Wi-Fi LAN | `uinput` virtual device | Key symbols | `/dev/uinput` permissions | Experimental |
| **Desktop Host** | ChromeOS | Wi-Fi LAN | Android / Linux Container | Basic pointer | Restricted container | Experimental |
