# MANAGED DEVICE DEPLOYMENT GUIDE (COLLEGE & ENTERPRISE)

## 1. Operating in Restricted Environments

Educational institutions, universities, and corporate workplaces often manage Windows computers using **Microsoft Intune**, **Active Directory Group Policy (GPO)**, **AppLocker**, or **Windows Defender Application Control (WDAC)**.

### Common Institutional Restrictions:
* **No Administrator Rights:** Users cannot write to `C:\Program Files` or modify system-wide registry keys.
* **AppLocker / WDAC Allowlisting:** Only approved binaries in signed paths can execute.
* **Client Isolation (Guest Wi-Fi):** Wireless access points prevent direct peer-to-peer communication between laptops and phones on the same network.
* **Multicast / Broadcast Suppression:** Routers drop UDP broadcasts to reduce wireless congestion.

---

## 2. Digital Touchpad Operational Modes

Digital Touchpad natively accommodates both unmanaged and managed environments:

### Mode A: Standard Personal Computer (Default)
* Full automatic workflow: Install $\rightarrow$ Launch $\rightarrow$ Auto-Discover $\rightarrow$ Pair $\rightarrow$ Control.
* Uses local UDP broadcast and port 8443 WebSocket bridge.

### Mode B: Managed / Restricted Computer
* **Current User Installation:** Installs cleanly into `%LOCALAPPDATA%\DigitalTouchpad` without needing administrative elevation.
* **Startup Persistence via HKCU:** Uses `HKCU\Software\Microsoft\Windows\CurrentVersion\Run`, which does not require elevated permissions.
* **Client Isolation Fallback (QR Pairing):**
  * When a campus network blocks UDP broadcast or router peer-to-peer routing, automatic discovery will report that the host cannot be reached.
  * The application clearly informs the user:
    ```
    "Network Isolation Detected: Your Wi-Fi network is preventing direct phone-to-PC connections.
    Solution: Enable Phone Hotspot or Computer Mobile Hotspot to connect directly."
    ```
  * Creating a direct Windows Mobile Hotspot or Phone Hotspot bypasses campus network client isolation with 100% reliability!

---

## 3. Enterprise Allowlisting Information for IT Administrators

IT administrators wishing to allowlist Digital Touchpad can use the following technical profile:

* **Product Name:** Digital Touchpad Companion Receiver
* **Vendor Identity:** Digital Touchpad Open Source Project
* **Binary Path:** `%LOCALAPPDATA%\DigitalTouchpad\DigitalTouchpadApp.ps1`
* **Inbound Port:** TCP 8443 (bound to `localhost` and local IPv4 subnet)
* **Outbound Traffic:** None (Zero external telemetry)
* **Kernel Drivers:** None
* **Privilege Level:** Standard User (`SECURITY_MANDATORY_MEDIUM_RID`)
