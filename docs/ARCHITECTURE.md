# GLYPHPAD SYSTEM ARCHITECTURE
## Universal Cross-Platform Architecture

### 1. High-Level Component Topology

```
┌────────────────────────────────────────────────────────┐
│                      MOBILE CLIENT                     │
│  (Android Compose / iOS SwiftUI / Web Simulator)       │
│  ┌────────────────────┐      ┌──────────────────────┐  │
│  │ Touchpad Surface   │      │ Gesture Recognizer   │  │
│  └─────────┬──────────┘      └──────────┬───────────┘  │
│            └──────────────┬─────────────┘              │
│                           ▼                            │
│                 ┌──────────────────┐                   │
│                 │ UCP Shared Core  │                   │
│                 │ (State/Protocol) │                   │
│                 └─────────┬────────┘                   │
└───────────────────────────┼────────────────────────────┘
                            │
               WebSocket / TLS (Encrypted)
                            │
┌───────────────────────────▼────────────────────────────┐
│                    DESKTOP RECEIVER                    │
│  (Windows .NET/Win32 • macOS Swift • Linux Rust)       │
│                 ┌──────────────────┐                   │
│                 │ Session Watchdog │                   │
│                 └─────────┬────────┘                   │
│                           ▼                            │
│                 ┌──────────────────┐                   │
│                 │ Action Validator │                   │
│                 │ (Allowlist Check)│                   │
│                 └─────────┬────────┘                   │
│                           ▼                            │
│                 ┌──────────────────┐                   │
│                 │ Native OS Input  │                   │
│                 │ (SendInput/uinput│                   │
│                 └──────────────────┘                   │
└────────────────────────────────────────────────────────┘
```

### 2. Core Responsibilities

1. **Touchpad Surface:**
   - Captures raw multi-touch coordinates with timestamping.
   - Applies non-linear acceleration curves and natural scrolling reversals based on user preferences.

2. **Gesture Recognition Engine:**
   - Differentiates single tap (left click), two-finger tap (right click), three-finger tap (middle click), two-finger vertical/horizontal drag (scrolling), and pinch-to-zoom.
   - Enforces a 80ms multi-finger settle delay to completely prevent accidental single clicks during multi-finger gestures.

3. **Desktop Input Dispatcher:**
   - Dispatches inputs directly to the host operating system using native input injection APIs:
     - **Windows:** Win32 `SendInput` API, subject to UIPI integrity boundary guidelines.
     - **macOS:** CoreGraphics `CGEventCreateMouseEvent` / `CGEventPost`, governed by user-granted Accessibility permissions.
     - **Linux:** `/dev/uinput` virtual device driver or X11 `XTestFakeMotionEvent`.

4. **Safety & Zero-Privilege Security:**
   - No arbitrary shell scripts or command-line strings are ever accepted.
   - Quick actions resolve to hardcoded internal enum handlers.
