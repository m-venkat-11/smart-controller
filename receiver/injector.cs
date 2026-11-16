using System;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;

namespace GlyphPadReceiver {
    public class InputInjector {
        [DllImport("user32.dll", SetLastError = true)]
        static extern void mouse_event(uint dwFlags, int dx, int dy, uint dwData, UIntPtr dwExtraInfo);

        [DllImport("user32.dll", SetLastError = true)]
        static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo);

        [DllImport("user32.dll")]
        static extern bool LockWorkStation();

        [DllImport("PowrProf.dll", CharSet = CharSet.Auto, ExactSpelling = true)]
        static extern bool SetSuspendState(bool hiberate, bool forceCritical, bool disableWakeEvent);

        // Mouse flags
        const uint MOUSEEVENTF_MOVE = 0x0001;
        const uint MOUSEEVENTF_LEFTDOWN = 0x0002;
        const uint MOUSEEVENTF_LEFTUP = 0x0004;
        const uint MOUSEEVENTF_RIGHTDOWN = 0x0008;
        const uint MOUSEEVENTF_RIGHTUP = 0x0010;
        const uint MOUSEEVENTF_MIDDLEDOWN = 0x0020;
        const uint MOUSEEVENTF_MIDDLEUP = 0x0040;
        const uint MOUSEEVENTF_WHEEL = 0x0800;
        const uint MOUSEEVENTF_HWHEEL = 0x01000;

        // Keyboard flags
        const uint KEYEVENTF_EXTENDEDKEY = 0x0001;
        const uint KEYEVENTF_KEYUP = 0x0002;
        const uint KEYEVENTF_UNICODE = 0x0004;

        // Virtual key codes
        const byte VK_BACK = 0x08;
        const byte VK_TAB = 0x09;
        const byte VK_RETURN = 0x0D;
        const byte VK_SHIFT = 0x10;
        const byte VK_CONTROL = 0x11;
        const byte VK_MENU = 0x12; // Alt
        const byte VK_ESCAPE = 0x1B;
        const byte VK_SPACE = 0x20;
        const byte VK_PRIOR = 0x21; // Page Up
        const byte VK_NEXT = 0x22;  // Page Down
        const byte VK_END = 0x23;
        const byte VK_HOME = 0x24;
        const byte VK_LEFT = 0x25;
        const byte VK_UP = 0x26;
        const byte VK_RIGHT = 0x27;
        const byte VK_DOWN = 0x28;
        const byte VK_SNAPSHOT = 0x2C; // Print Screen
        const byte VK_DELETE = 0x2E;
        const byte VK_LWIN = 0x5B;

        const byte VK_VOLUME_MUTE = 0xAD;
        const byte VK_VOLUME_DOWN = 0xAE;
        const byte VK_VOLUME_UP = 0xAF;
        const byte VK_MEDIA_NEXT_TRACK = 0xB0;
        const byte VK_MEDIA_PREV_TRACK = 0xB1;
        const byte VK_MEDIA_STOP = 0xB2;
        const byte VK_MEDIA_PLAY_PAUSE = 0xB3;

        static void Main(string[] args) {
            Console.WriteLine("INJECTOR_READY");
            string line;
            while ((line = Console.ReadLine()) != null) {
                line = line.Trim();
                if (string.IsNullOrEmpty(line)) continue;

                try {
                    string[] parts = line.Split(' ');
                    string cmd = parts[0].ToUpper();

                    switch (cmd) {
                        case "M": // Move: M <dx> <dy>
                            if (parts.Length >= 3) {
                                int dx = int.Parse(parts[1]);
                                int dy = int.Parse(parts[2]);
                                mouse_event(MOUSEEVENTF_MOVE, dx, dy, 0, UIntPtr.Zero);
                            }
                            break;

                        case "LD": // Left Down
                            mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, UIntPtr.Zero);
                            break;

                        case "LU": // Left Up
                            mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, UIntPtr.Zero);
                            break;

                        case "LC": // Left Click
                            mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, UIntPtr.Zero);
                            mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, UIntPtr.Zero);
                            break;

                        case "LDC": // Left Double Click
                            mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, UIntPtr.Zero);
                            mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, UIntPtr.Zero);
                            mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, UIntPtr.Zero);
                            mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, UIntPtr.Zero);
                            break;

                        case "RD": // Right Down
                            mouse_event(MOUSEEVENTF_RIGHTDOWN, 0, 0, 0, UIntPtr.Zero);
                            break;

                        case "RU": // Right Up
                            mouse_event(MOUSEEVENTF_RIGHTUP, 0, 0, 0, UIntPtr.Zero);
                            break;

                        case "RC": // Right Click
                            mouse_event(MOUSEEVENTF_RIGHTDOWN, 0, 0, 0, UIntPtr.Zero);
                            mouse_event(MOUSEEVENTF_RIGHTUP, 0, 0, 0, UIntPtr.Zero);
                            break;

                        case "MD": // Middle Down
                            mouse_event(MOUSEEVENTF_MIDDLEDOWN, 0, 0, 0, UIntPtr.Zero);
                            break;

                        case "MU": // Middle Up
                            mouse_event(MOUSEEVENTF_MIDDLEUP, 0, 0, 0, UIntPtr.Zero);
                            break;

                        case "MC": // Middle Click
                            mouse_event(MOUSEEVENTF_MIDDLEDOWN, 0, 0, 0, UIntPtr.Zero);
                            mouse_event(MOUSEEVENTF_MIDDLEUP, 0, 0, 0, UIntPtr.Zero);
                            break;

                        case "S": // Scroll Vertical: S <delta>
                            if (parts.Length >= 2) {
                                int delta = int.Parse(parts[1]);
                                mouse_event(MOUSEEVENTF_WHEEL, 0, 0, (uint)delta, UIntPtr.Zero);
                            }
                            break;

                        case "HS": // Horizontal Scroll: HS <delta>
                            if (parts.Length >= 2) {
                                int hdelta = int.Parse(parts[1]);
                                mouse_event(MOUSEEVENTF_HWHEEL, 0, 0, (uint)hdelta, UIntPtr.Zero);
                            }
                            break;

                        case "K": // Key code: K <vk>
                            if (parts.Length >= 2) {
                                byte vk = byte.Parse(parts[1]);
                                TapKey(vk);
                            }
                            break;

                        case "TEXT": // Type text: TEXT <base64>
                            if (parts.Length >= 2) {
                                byte[] bytes = Convert.FromBase64String(parts[1]);
                                string text = Encoding.UTF8.GetString(bytes);
                                TypeString(text);
                            }
                            break;

                        case "RELEASE_ALL":
                            ReleaseAll();
                            break;

                        case "ACTION":
                            if (parts.Length >= 2) {
                                HandleAction(parts[1]);
                            }
                            break;
                    }
                } catch {
                    // Ignore malformed command silently
                }
            }
        }

        static void TapKey(byte vk) {
            keybd_event(vk, 0, 0, UIntPtr.Zero);
            keybd_event(vk, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
        }

        static void SendChord(byte mod1, byte key) {
            keybd_event(mod1, 0, 0, UIntPtr.Zero);
            keybd_event(key, 0, 0, UIntPtr.Zero);
            keybd_event(key, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
            keybd_event(mod1, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
        }

        static void SendChord3(byte mod1, byte mod2, byte key) {
            keybd_event(mod1, 0, 0, UIntPtr.Zero);
            keybd_event(mod2, 0, 0, UIntPtr.Zero);
            keybd_event(key, 0, 0, UIntPtr.Zero);
            keybd_event(key, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
            keybd_event(mod2, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
            keybd_event(mod1, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
        }

        static void TypeString(string text) {
            foreach (char c in text) {
                keybd_event(0, (byte)c, KEYEVENTF_UNICODE, UIntPtr.Zero);
                keybd_event(0, (byte)c, KEYEVENTF_UNICODE | KEYEVENTF_KEYUP, UIntPtr.Zero);
            }
        }

        static void ReleaseAll() {
            mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, UIntPtr.Zero);
            mouse_event(MOUSEEVENTF_RIGHTUP, 0, 0, 0, UIntPtr.Zero);
            mouse_event(MOUSEEVENTF_MIDDLEUP, 0, 0, 0, UIntPtr.Zero);
            keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
            keybd_event(VK_SHIFT, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
            keybd_event(VK_MENU, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
            keybd_event(VK_LWIN, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
        }

        static void HandleAction(string action) {
            switch (action.ToUpper()) {
                // 1. WINDOWS SYSTEM & APPS (PRD Section 09)
                case "SETTINGS": // Win + I
                    SendChord(VK_LWIN, 0x49); // 'I'
                    break;

                case "EXPLORER": // Win + E
                    SendChord(VK_LWIN, 0x45); // 'E'
                    break;

                case "SEARCH": // Win + S
                    SendChord(VK_LWIN, 0x53); // 'S'
                    break;

                case "TASK_MANAGER": // Ctrl + Shift + Esc
                    SendChord3(VK_CONTROL, VK_SHIFT, VK_ESCAPE);
                    break;

                case "TERMINAL": // Open terminal
                    try { Process.Start("wt.exe"); } catch {
                        try { Process.Start("powershell.exe"); } catch { }
                    }
                    break;

                case "CALCULATOR":
                    try { Process.Start("calc.exe"); } catch { }
                    break;

                case "BROWSER":
                    try { Process.Start("https://"); } catch { }
                    break;

                case "NOTEPAD":
                    try { Process.Start("notepad.exe"); } catch { }
                    break;

                case "CONTROL_PANEL":
                    try { Process.Start("control.exe"); } catch { }
                    break;

                // 2. WINDOW MANAGEMENT (PRD Page 8 & 9)
                case "SHOW_DESKTOP": // Win + D
                    SendChord(VK_LWIN, 0x44); // 'D'
                    break;

                case "MINIMIZE_ALL": // Win + M
                    SendChord(VK_LWIN, 0x4D); // 'M'
                    break;

                case "RESTORE_ALL": // Win + Shift + M
                    SendChord3(VK_LWIN, VK_SHIFT, 0x4D);
                    break;

                case "TASK_VIEW": // Win + Tab
                    SendChord(VK_LWIN, VK_TAB);
                    break;

                case "ALT_TAB": // Alt + Tab
                    SendChord(VK_MENU, VK_TAB);
                    break;

                case "SNAP_LEFT": // Win + Left
                    SendChord(VK_LWIN, VK_LEFT);
                    break;

                case "SNAP_RIGHT": // Win + Right
                    SendChord(VK_LWIN, VK_RIGHT);
                    break;

                case "MAXIMIZE": // Win + Up
                    SendChord(VK_LWIN, VK_UP);
                    break;

                case "MINIMIZE": // Win + Down
                    SendChord(VK_LWIN, VK_DOWN);
                    break;

                // 3. VIRTUAL DESKTOPS
                case "DESKTOP_LEFT": // Win + Ctrl + Left
                    SendChord3(VK_LWIN, VK_CONTROL, VK_LEFT);
                    break;

                case "DESKTOP_RIGHT": // Win + Ctrl + Right
                    SendChord3(VK_LWIN, VK_CONTROL, VK_RIGHT);
                    break;

                case "NEW_DESKTOP": // Win + Ctrl + D
                    SendChord3(VK_LWIN, VK_CONTROL, 0x44); // 'D'
                    break;

                case "CLOSE_DESKTOP": // Win + Ctrl + F4
                    SendChord3(VK_LWIN, VK_CONTROL, 0x73); // VK_F4
                    break;

                // 4. DISPLAY & SCREENSHOT
                case "SNIP": // Win + Shift + S
                    SendChord3(VK_LWIN, VK_SHIFT, 0x53); // 'S'
                    break;

                case "SCREENSHOT": // Print Screen
                    TapKey(VK_SNAPSHOT);
                    break;

                case "PROJECT_SCREEN": // Win + P
                    SendChord(VK_LWIN, 0x50); // 'P'
                    break;

                // 5. AUDIO & MEDIA CONTROLS
                case "VOL_UP":
                    TapKey(VK_VOLUME_UP);
                    break;

                case "VOL_DOWN":
                    TapKey(VK_VOLUME_DOWN);
                    break;

                case "MUTE":
                    TapKey(VK_VOLUME_MUTE);
                    break;

                case "MEDIA_PLAY_PAUSE":
                    TapKey(VK_MEDIA_PLAY_PAUSE);
                    break;

                case "MEDIA_NEXT":
                    TapKey(VK_MEDIA_NEXT_TRACK);
                    break;

                case "MEDIA_PREV":
                    TapKey(VK_MEDIA_PREV_TRACK);
                    break;

                case "MEDIA_STOP":
                    TapKey(VK_MEDIA_STOP);
                    break;

                // 6. EDITING SHORTCUTS
                case "COPY": // Ctrl + C
                    SendChord(VK_CONTROL, 0x43);
                    break;

                case "PASTE": // Ctrl + V
                    SendChord(VK_CONTROL, 0x56);
                    break;

                case "CUT": // Ctrl + X
                    SendChord(VK_CONTROL, 0x58);
                    break;

                case "UNDO": // Ctrl + Z
                    SendChord(VK_CONTROL, 0x5A);
                    break;

                case "REDO": // Ctrl + Y
                    SendChord(VK_CONTROL, 0x59);
                    break;

                case "SELECT_ALL": // Ctrl + A
                    SendChord(VK_CONTROL, 0x41);
                    break;

                case "FIND": // Ctrl + F
                    SendChord(VK_CONTROL, 0x46);
                    break;

                case "SAVE": // Ctrl + S
                    SendChord(VK_CONTROL, 0x53);
                    break;

                case "ZOOM_IN": // Ctrl + Plus
                    SendChord(VK_CONTROL, 0xBB);
                    break;

                case "ZOOM_OUT": // Ctrl + Minus
                    SendChord(VK_CONTROL, 0xBD);
                    break;

                // 7. PRESENTATION MODE
                case "SLIDE_NEXT":
                    TapKey(VK_NEXT);
                    break;

                case "SLIDE_PREV":
                    TapKey(VK_PRIOR);
                    break;

                case "FULLSCREEN":
                case "START_SLIDES": // F5
                    TapKey(0x74); // VK_F5
                    break;

                case "SLIDES_CURRENT": // Shift + F5
                    SendChord(VK_SHIFT, 0x74);
                    break;

                case "END_SLIDES": // Esc
                    TapKey(VK_ESCAPE);
                    break;

                case "BLACK_SCREEN": // 'B'
                    TapKey(0x42);
                    break;

                case "WHITE_SCREEN": // 'W'
                    TapKey(0x57);
                    break;

                // 8. POWER & SECURITY
                case "LOCK_PC":
                    LockWorkStation();
                    break;

                case "SLEEP":
                    try { SetSuspendState(false, true, true); } catch { }
                    break;

                case "RESTART":
                    try { Process.Start("shutdown.exe", "/r /t 0"); } catch { }
                    break;

                case "SHUTDOWN":
                    try { Process.Start("shutdown.exe", "/s /t 0"); } catch { }
                    break;

                // 9. BASIC KEYS
                case "ESC":
                    TapKey(VK_ESCAPE);
                    break;

                case "ENTER":
                    TapKey(VK_RETURN);
                    break;

                case "BACKSPACE":
                    TapKey(VK_BACK);
                    break;

                case "TAB":
                    TapKey(VK_TAB);
                    break;

                case "SPACE":
                    TapKey(VK_SPACE);
                    break;

                case "UP":
                    TapKey(VK_UP);
                    break;

                case "DOWN":
                    TapKey(VK_DOWN);
                    break;

                case "LEFT":
                    TapKey(VK_LEFT);
                    break;

                case "RIGHT":
                    TapKey(VK_RIGHT);
                    break;
            }
        }
    }
}
