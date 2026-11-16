# WINDOWS FIREWALL REQUIREMENTS & NETWORK PRIVILEGES

## 1. Network Architecture & Port Allocation

Digital Touchpad uses a strictly scoped, least-privilege networking model:

| Port | Protocol | Scope | Direction | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **8443** | TCP | Private / Local Subnet | Inbound | HTTP asset delivery & WebSocket UCP v2.0 input bridge |
| **8444** | UDP | Local Subnet Broadcast | Inbound / Outbound | Zero-configuration local discovery beacon |

* **Local Private Subnet Only:** The server binds to local interfaces (`0.0.0.0`) and is designed exclusively for LAN/Wi-Fi communication.
* **No Public Internet Inbound:** The receiver never requests UPnP port forwarding or router pinhole creation.
* **No Outbound Telemetry:** The server makes zero outbound internet connections.

---

## 2. Firewall Rule Configuration

When installed via `Setup-DigitalTouchpad.bat`, the installer configures a single narrowly scoped Windows Defender Firewall rule:

```powershell
netsh advfirewall firewall add rule name="Digital Touchpad Receiver" dir=in action=allow protocol=TCP localport=8443 profile=private
```

### Key Security Safeguards:
1. **Scoped to `profile=private`:** The rule applies ONLY when the PC is connected to a recognized Private home or work network. When connected to a Public Wi-Fi network (coffee shop, airport), Windows Firewall automatically suppresses incoming connections.
2. **Narrow Port Scope:** Only port `8443` is allowed; all other ports remain completely protected.
3. **No Firewall Disabling:** The installer **NEVER** turns off Windows Firewall or disables stateful inspection.

---

## 3. Handling Managed or Blocked Networks

If a user is on an institutional network (e.g. college dorm, corporate office) where inbound ports are blocked by Group Policy:
1. The receiver detects the firewall state via built-in diagnostics.
2. The user is presented with the exact required configuration so their network administrator can review and approve it.
3. The phone client displays an informative message: *"Firewall or network isolation is preventing local connection. Ensure both devices are on the same private Wi-Fi network."*
