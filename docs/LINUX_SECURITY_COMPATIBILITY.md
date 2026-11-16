# LINUX SECURITY & INPUT COMPATIBILITY

## 1. Linux Display Servers: X11 vs. Wayland

Linux desktop environments are currently transitioning from the legacy **X11** windowing system to modern **Wayland** compositors (GNOME Wayland, KDE Plasma Wayland, Hyprland, Sway). This directly impacts synthetic mouse input injection:

| Display Server | Primary Input API | Privilege Requirement | Compatibility Status |
| :--- | :--- | :--- | :--- |
| **X11 (Xorg)** | `xdotool` / `XTestFakeMotionEvent` | User space (No root required) | Full out-of-the-box support across all desktop environments. |
| **Wayland** | `/dev/uinput` via Linux kernel | Requires membership in `input` group or `udev` rule | Native support with standard non-root `udev` configuration. |

---

## 2. Non-Root `/dev/uinput` Configuration (Wayland)

Wayland intentionally isolates windows from global input inspection and synthetic events for security. To inject mouse and keyboard input on Wayland without running as `root`:

1. Install the Digital Touchpad `udev` rule into `/etc/udev/rules.d/99-digitaltouchpad-uinput.rules`:
   ```udev
   KERNEL=="uinput", MODE="0660", GROUP="input", TAG+="uaccess"
   ```
2. Add the current user to the `input` group:
   ```bash
   sudo usermod -a -G input $USER
   ```
3. Reload udev rules:
   ```bash
   sudo udevadm control --reload-rules && sudo udevadm trigger
   ```

---

## 3. Packaging & Distribution Formats

To ensure universal compatibility across Ubuntu, Debian, Fedora, Arch, and openSUSE:
* **AppImage:** Self-contained portable executable bundle requiring zero system installation:
  ```bash
  chmod +x DigitalTouchpad-x86_64.AppImage
  ./DigitalTouchpad-x86_64.AppImage
  ```
* **DEB Package:** Standard installation package for Debian/Ubuntu with desktop menu integration and systemd user service.
* **SELinux & AppArmor:** Digital Touchpad operates strictly within unconfined user profile boundaries, making zero modifications to system mandatory access control (MAC) policies.
