# SECURITY & CONNECTIVITY DIAGNOSTICS GUIDE

## 1. Diagnostics Subsystem Overview

Digital Touchpad includes an active diagnostics subsystem accessible from the desktop tray application and the mobile client:
* **Truthful Indicators:** Never shows a "green" status unless the actual underlying capability has been verified.
* **Separation of Concerns:** Distinguishes between process execution, local port binding, firewall reachability, pairing status, and input injection.

---

## 2. Diagnostic Check Matrix

| Check Name | Target Subsystem | Pass Condition | Failure Recovery Action |
| :--- | :--- | :--- | :--- |
| **Local Port 8443** | TCP Socket Listener | `Test-NetConnection -Port 8443` succeeds | Auto-terminates stale zombie receiver instances. |
| **UDP Discovery Beacon** | UDP Broadcast (Port 8444) | Socket bound and broadcasting | Informs user to use QR scan fallback if router drops UDP. |
| **Win32 Input Injector** | `SendInput` API | `SendInput` returns count $\ge 1$ | Reinitializes in-memory P/Invoke engine. |
| **Firewall Profile** | Windows Defender Firewall | Inbound TCP 8443 allowed on Private profile | Prompts user or administrator to apply scoped rule. |
| **Network Isolation** | Wi-Fi Access Point | Phone and PC can reach each other | Instructs user to enable Phone Hotspot or PC Hotspot. |
| **Pairing Challenge** | UCP v2.0 Cryptographic Token | Valid 6-digit PIN or token match | Regenerates dynamic challenge token. |

---

## 3. Exporting Diagnostic Reports

The desktop console allows exporting a sanitized diagnostic report for troubleshooting:
* **What is Included:** OS version, active network adapter type (Wi-Fi/Ethernet), local IP, port listening status, firewall rule presence, and input injection confirmation.
* **What is Excluded:** Zero private authentication tokens, zero Wi-Fi passwords, and zero personal user documents or browsing history.
