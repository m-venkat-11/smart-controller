# DIGITAL TOUCHPAD — SECURITY & DISTRIBUTION ARCHITECTURE

## 1. Product Identity & Trust Model

**Digital Touchpad** transforms smartphones and tablets into precision wireless touchpads for laptops and desktop computers. The product operates on a strict **zero-cloud, local-first, privacy-by-design architecture**.

### Core Tenets:
1. **Zero External Cloud Routing:** All mouse movements, touch gestures, keyboard strokes, and control commands travel directly over the local network (Wi-Fi or LAN) between the phone and computer. No command data ever touches external servers.
2. **Cooperation with OS Security:** The application does not attempt to bypass, disable, or tamper with operating system security controls, antivirus programs, or firewalls.
3. **Least Privilege Principle:** The desktop receiver operates with standard user privileges under `%LOCALAPPDATA%`. Administrative elevation is never required for normal operation.
4. **Transparent & Open Architecture:** Built using standard, documented operating system APIs (Win32 `SendInput`, macOS `Accessibility / Quartz`, Linux `X11 / uinput`).

---

## 2. Software Bill of Materials (SBOM)

| Component | Technology | Role | Security Evaluation |
| :--- | :--- | :--- | :--- |
| **Windows Desktop Host** | PowerShell / .NET 4.8 WinForms | System Tray icon, GUI console, and life-cycle manager | Runs under Microsoft-signed `powershell.exe` host; zero unverified binaries. |
| **Windows Input Engine** | Win32 `SendInput` via P/Invoke | Mouse cursor positioning, clicks, and keystrokes | Official Microsoft API for synthetic input; safe from heuristic flag. |
| **Local Web & Socket Server** | Node.js v20+ / `ws` | Local HTTP static asset server and WebSocket UCP engine | Bound strictly to local private network interfaces (`0.0.0.0:8443`). |
| **Service Discovery** | UDP Broadcast (Port 8444) | Zero-configuration beaconing for automatic mobile discovery | Publishes only machine name, OS, and one-time challenge token. |
| **Mobile Client** | React 18, TypeScript, TailwindCSS | Web app & PWA touch surface with QR camera scanner | Client-side only; zero remote telemetry; runs in sandboxed browser. |

---

## 3. Cryptographic Pairing & Authentication (UCP v2.0)

Digital Touchpad uses a two-phase authentication model:

### Phase 1 — Initial Mutual Discovery & Pairing
1. The desktop receiver generates a random **6-Digit Pairing PIN** and a 128-bit rotating **Challenge Token** (refreshed every 3 minutes).
2. The computer displays this as a visual PIN and a dynamic **QR Code**.
3. The smartphone discovers the computer via UDP beacon, subnet scan, or camera QR scan.
4. The smartphone submits a `PAIR_REQUEST` containing its unique device identifier (`deviceId`) and the matching PIN/Token.
5. The desktop validates the challenge and issues a permanent cryptographic `authToken` (`sess_tok_xxxxxxxxxxxx`).
6. Both devices store the pairing in their respective trusted devices store (`trusted_devices.json` on desktop, `localStorage` on phone).

### Phase 2 — One-Tap Reconnection
1. On all subsequent connections, the phone issues `SESSION_RESUME` containing its `deviceId` and `authToken`.
2. The desktop validates the token against its local trust store.
3. Trust is confirmed immediately with zero manual IP entry or repeated PIN prompts.
4. If trust is revoked by the user on either side, all future sessions are rejected until re-paired.
