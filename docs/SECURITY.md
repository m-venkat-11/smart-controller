# SECURITY THREAT MODEL & DEFENSE ARCHITECTURE
## SmartController: GlyphPad

### 1. Threat Model & Boundaries

The threat model assumes an untrusted environment where unapproved devices may exist on the same local Wi-Fi or hotspot network. Network presence alone NEVER grants authorization to inject inputs or execute actions on the target computer.

---

### 2. Threat Analysis & Mitigations

| Threat | Impact | Defense & Architectural Mitigation |
| :--- | :--- | :--- |
| **Unauthorized Device Input Injection** | Malicious cursor control or rogue keystrokes | Explicit two-way cryptographic pairing approval. Host user must manually approve device via PIN/QR code. |
| **Replay & Sequence Manipulation** | Old commands replayed to trigger actions | Strictly monotonic sequence numbers per session, cryptographically bound session nonces, and timestamp expiry. |
| **Arbitrary Shell Execution** | Remote code execution on the host | Strict input allowlist. Receivers accept only enumerated typed IDs (`ACTION_LOCK_PC`, `ACTION_VOLUME_UP`), never raw strings or shell paths. |
| **Stuck Keys / Accidental Modifiers** | Unintended key holds upon Wi-Fi drop | Heartbeat watchdog (3s cutoff). Upon packet drop, the receiver triggers an atomic `RELEASE_ALL` for all simulated keys and buttons. |
| **Integrity Boundaries (UIPI)** | Control over elevated system prompts | Follows Windows UIPI guidelines honestly. Input injection runs at standard user integrity without illicit kernel bypasses. |
| **Credential & Secret Exposure** | Leakage of paired keys | Secrets stored exclusively in native secure vaults (Windows Credential Vault, Android Keystore, macOS Keychain). |
