# MICROSOFT DEFENDER & ANTIVIRUS COMPATIBILITY

## 1. Design for Zero Antivirus Conflicts

Many third-party input and remote-control tools get flagged by antivirus heuristics because they behave like keyloggers or remote access trojans (RATs). Digital Touchpad is architected specifically to avoid these triggers:

| Typical RAT / Malware Behavior | Digital Touchpad Design Choice |
| :--- | :--- |
| **Global Keyboard Hooks (`SetWindowsHookEx`)** | **NEVER used.** Digital Touchpad does NOT record, log, or monitor what the user types on the PC. It only injects input received from the authenticated phone. |
| **DLL Injection / Process Injection** | **NEVER used.** Operates purely in user space via standard documented Win32 input queues. |
| **Hidden Background Persistence** | **NEVER used.** All background activity is tied to a visible System Tray icon with an explicit Exit option. |
| **Automatic Antivirus Disabling** | **NEVER attempted.** The receiver never accesses or modifies Windows Defender registry keys, PowerShell cmdlets, or exclusions. |
| **Unsigned Raw C# Binaries** | Replaced with official in-memory P/Invoke using the Microsoft-signed Windows PowerShell host (`powershell.exe`) and official Win32 `SendInput`. |

---

## 2. Why Win32 `SendInput` is Safe

`SendInput` is the official Microsoft Win32 API created specifically for accessibility devices, virtual input hardware, and assistive technology:
* It queues input directly to the active window station without requiring kernel-level drivers.
* It does not trigger driver signature enforcement (DSE) warnings.
* It respects Windows UIPI (User Interface Privilege Isolation) and UAC barriers.

---

## 3. Documented False-Positive Response Procedure

If any security software flags the official Digital Touchpad distribution:
1. **Log Detection Details:** Record the exact vendor name, detection label (e.g., `Trojan:Win32/Wacatac`), file path, and SHA-256 hash.
2. **Verify Cryptographic Hash:** Compare the file hash against the official release build artifact on GitHub releases.
3. **Submit for Official Vendor Review:**
   * **Microsoft Defender:** Submit to [Microsoft Security Intelligence Portal](https://www.microsoft.com/en-us/wdsi/filesubmission) under "Software Developer" false-positive submission.
   * **VirusTotal:** Submit file hash and public release notes.
4. **Publish Transparency Notice:** Inform users in the GitHub release notes with verification hashes and vendor submission status.
