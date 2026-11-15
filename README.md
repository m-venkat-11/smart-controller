# GlyphPad — Universal Wireless Touchpad Ecosystem
## SmartController: Nothing-Inspired Precision Wireless Control Surface

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Deployment: Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com)
[![GitHub Repository](https://img.shields.io/badge/GitHub-m--venkat--11%2Fsmart--controller-red?logo=github)](https://github.com/m-venkat-11/smart-controller)
[![Protocol](https://img.shields.io/badge/Protocol-UCP%20v1.0-emerald)](#universal-control-protocol)

---

### Overview

**GlyphPad** (repository: `smart-controller`) transforms any smartphone or tablet into a high-precision, low-latency wireless touchpad, keyboard macro deck, and hardware remote for laptops and desktops running **Windows, macOS, and Linux**.

Inspired by the tactile industrial design of **Nothing OS** and radiant dark glassmorphism, GlyphPad provides hardware-level tactile feedback, ballistic non-linear acceleration, multi-touch gestures, and zero-reliance local LAN connectivity with sub-5ms P95 latency.

---

### Core Architecture & Highlights

- **Universal Control Protocol (UCP v1.0):** 120Hz differential vector streaming with sequence-numbered replay defense and watchdog auto-release.
- **Local LAN First:** 100% offline functionality. Operates over local Wi-Fi or Phone Hotspot without internet or cloud accounts.
- **Mutual Cryptographic Pairing:** Host authorization via short-lived 6-digit numeric PIN or QR code with TLS 1.3 encrypted sessions.
- **Native OS Input Injection:**
  - **Windows:** Win32 `SendInput` (UIPI integrity boundary compliant)
  - **macOS:** CoreGraphics `CGEventPost` with Accessibility permissions
  - **Linux:** `/dev/uinput` virtual device driver & X11 `XTest`
- **Tactile Gesture Classifier:** 1-finger move/click, 2-finger scroll/right-click, pinch-to-zoom, and 3-finger window cycling with an 80ms settling window.

---

### Project Structure

```
├── docs/
│   ├── ARCHITECTURE.md                 # System topology & OS injection engines
│   ├── NETWORK_PROTOCOL.md             # UCP v1.0 packet schemas & watchdog rules
│   ├── PLATFORM_COMPATIBILITY.md       # Honest OS compatibility matrix
│   ├── PROJECT_AUDIT.md                # Project audit & master prompt roadmap
│   ├── SECURITY.md                     # Threat model & cryptographic mitigations
│   ├── WEBSITE_DESIGN_DIRECTION.md     # Nothing UI & glassmorphism visual study
│   └── WEBSITE_DESIGN_SYSTEM.md        # Tokens, dot-matrix typography & colors
├── src/
│   ├── core/
│   │   └── protocol/
│   │       ├── gestureEngine.ts        # Multi-touch classifier & drift tolerances
│   │       ├── serializer.ts           # UCP packet serializer & validator
│   │       ├── stateMachine.ts         # Connection state machine
│   │       └── types.ts                # TypeScript UCP definitions
│   ├── components/                     # Reusable Nothing-styled React components
│   ├── pages/                          # Home, Features, How It Works, Compatibility, Download, Support, Sandbox
│   └── styles/                         # Tailwind CSS, dot-matrix fonts, glass effects
├── public/                             # Favicons, vector graphics, assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vercel.json                         # Vercel SPA rewrites & security headers
└── vite.config.ts
```

---

### Getting Started

#### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```

#### Production Build

```bash
# Compile TypeScript and bundle with Vite
npm run build
```

---

### Continuous Deployment to Vercel & GitHub

This repository is linked to **Vercel** with continuous deployment.
Every push to `main` on [https://github.com/m-venkat-11/smart-controller](https://github.com/m-venkat-11/smart-controller) automatically triggers a production build and deployment to Vercel.

---

### License

Engineered with pride for open tactile input freedom. Distributed under the MIT License.
