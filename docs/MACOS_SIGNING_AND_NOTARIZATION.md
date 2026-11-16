# MACOS SECURITY, CODE SIGNING & NOTARIZATION

## 1. Overview of macOS Security Architecture

When distributing a companion desktop application on macOS, three security subsystems govern installation and input control:
1. **Gatekeeper:** Enforces that applications downloaded from the internet are signed by an identified Apple developer and notarized by Apple.
2. **Apple Notarization Service:** Automated security audit that scans the binary for malicious components and issues a cryptographic ticket.
3. **Transparency, Consent, and Control (TCC) & Accessibility Permissions:** macOS strictly prohibits synthetic mouse and keyboard generation unless the user explicitly grants **Accessibility** permissions in System Settings.

---

## 2. Packaging & Distribution Workflow

### Step 1: Code Signing with Developer ID Application Certificate
All native binaries and app bundles must be signed with a valid Apple Developer ID:
```bash
codesign --deep --force --options runtime \
  --sign "Developer ID Application: Your Name (TEAMID)" \
  --entitlements entitlements.plist \
  "Digital Touchpad.app"
```

### Required Entitlements (`entitlements.plist`):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.network.server</key>
    <true/>
    <key>com.apple.security.network.client</key>
    <true/>
</dict>
</plist>
```

### Step 2: Apple Notarization
Submit the packaged `.dmg` or `.zip` to Apple's notarization notary service:
```bash
xcrun notarytool submit "DigitalTouchpad.dmg" \
  --keychain-profile "AC_PASSWORD" \
  --wait
```
Once approved, staple the notarization ticket:
```bash
xcrun stapler staple "DigitalTouchpad.dmg"
```

---

## 3. Guiding the User for Accessibility Permissions

On macOS, synthetic mouse movement via Quartz (`CGEventCreateMouseEvent` / AppleScript) fails silently until granted Accessibility permissions:
* When Digital Touchpad launches on macOS, it checks `AXIsProcessTrusted()`.
* If false, it prompts the user with clear visual steps:
  1. Open **System Settings** $\rightarrow$ **Privacy & Security** $\rightarrow$ **Accessibility**.
  2. Toggle **Digital Touchpad** to **ON**.
* The application **never** attempts to bypass TCC or inject into other processes without user authorization.
