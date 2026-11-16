# WINDOWS SMARTSCREEN & CODE SIGNING STRATEGY

## 1. Overview of Microsoft Defender SmartScreen

Microsoft Defender SmartScreen is a cloud-based anti-phishing and anti-malware service built into Windows 10 and 11. It checks downloaded and executed applications against Microsoft's reputation database.

### How SmartScreen Evaluates Applications:
1. **Known Good (High Reputation):** Applications digitally signed with a recognized Authenticode certificate that have established significant download volume and zero malware telemetry.
2. **Unknown (No Reputation):** New applications or unsigned binaries trigger the prompt: *"Windows protected your PC — Microsoft Defender SmartScreen prevented an unrecognized app from starting."*
3. **Known Malicious:** Applications confirmed to match known malicious signatures are blocked completely.

---

## 2. Release Distribution Pathways

### Route A: Microsoft Store (MSIX Package) — Preferred
The Microsoft Store provides the cleanest user experience for Windows users:
* **Microsoft-Managed Code Signing:** Applications packaged as MSIX and distributed through the Microsoft Store are signed directly by Microsoft Corporation.
* **Instant SmartScreen Reputation:** Store applications do not trigger SmartScreen warnings.
* **Seamless Background Updates:** Handled by the Windows Package Manager without elevated UAC prompts.
* **Architecture:** Packaged using `Windows Application Packaging Project` (WAP) targeting Windows 10 build 19041+ and Windows 11.

### Route B: Direct Distribution with EV / Standard Authenticode Certificate
For users downloading directly from the official website or GitHub:
* Use a valid **Authenticode Code Signing Certificate** from an approved CA (e.g. DigiCert, Sectigo, or SSL.com).
* Sign all installer executables, background launchers, and uninstallation binaries with SHA-256 signatures.
* Timestamp every binary using an RFC 3161 compliant timestamp server (e.g., `http://timestamp.digicert.com`).
* Sign using:
  ```powershell
  signtool.exe sign /tr http://timestamp.digicert.com /td sha256 /fd sha256 /a "DigitalTouchpad.exe"
  ```
* Consistent signing identity across releases builds cumulative SmartScreen reputation over time.

---

## 3. Transparency & What NOT to Do

Digital Touchpad strictly adheres to legitimate security best practices:
* **NEVER** instruct users to disable SmartScreen in Windows Settings.
* **NEVER** instruct users to disable Smart App Control.
* **NEVER** use suspicious packers (e.g. UPX, Themida, VMProtect) which trigger heuristic detection.
* **NEVER** download executable code dynamically from remote untrusted URLs.
* When running an initial open-source release prior to certificate issuance, users can inspect the complete source code and click *"More info" $\rightarrow$ "Run anyway"* with full transparency.
