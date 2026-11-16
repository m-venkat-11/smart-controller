using System;
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
        const byte VK_DELETE = 0x2E;
        const byte VK_LWIN = 0x5B;

        const byte VK_VOLUME_MUTE = 0xAD;
        const byte VK_VOLUME_DOWN = 0xAE;
        const byte VK_VOLUME_UP = 0xAF;
        const byte VK_MEDIA_NEXT_TRACK = 0xB0;
        const byte VK_MEDIA_PREV_TRACK = 0xB1;
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

                        case "S": // Scroll: S <delta>
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

                        case "K": // Press key: K <vkCode>
                            if (parts.Length >= 2) {
                                byte vk = byte.Parse(parts[1]);
                                TapKey(vk);
                            }
                            break;

                        case "TEXT": // Type text: TEXT <base64 encoded UTF8 string>
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

        static void TypeString(string text) {
            foreach (char c in text) {
                // Unicode keystroke
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
                case "SHOW_DESKTOP": // Win + D
                    keybd_event(VK_LWIN, 0, 0, UIntPtr.Zero);
                    keybd_event(0x44, 0, 0, UIntPtr.Zero); // 'D'
                    keybd_event(0x44, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    keybd_event(VK_LWIN, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    break;

                case "TASK_MANAGER": // Ctrl + Shift + Esc
                    keybd_event(VK_CONTROL, 0, 0, UIntPtr.Zero);
                    keybd_event(VK_SHIFT, 0, 0, UIntPtr.Zero);
                    keybd_event(VK_ESCAPE, 0, 0, UIntPtr.Zero);
                    keybd_event(VK_ESCAPE, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    keybd_event(VK_SHIFT, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    break;

                case "LOCK_PC":
                    LockWorkStation();
                    break;

                case "SNIP": // Win + Shift + S
                    keybd_event(VK_LWIN, 0, 0, UIntPtr.Zero);
                    keybd_event(VK_SHIFT, 0, 0, UIntPtr.Zero);
                    keybd_event(0x53, 0, 0, UIntPtr.Zero); // 'S'
                    keybd_event(0x53, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    keybd_event(VK_SHIFT, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    keybd_event(VK_LWIN, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    break;

                case "ALT_TAB":
                    keybd_event(VK_MENU, 0, 0, UIntPtr.Zero);
                    keybd_event(VK_TAB, 0, 0, UIntPtr.Zero);
                    keybd_event(VK_TAB, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    keybd_event(VK_MENU, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    break;

                case "DESKTOP_LEFT": // Win + Ctrl + Left
                    keybd_event(VK_LWIN, 0, 0, UIntPtr.Zero);
                    keybd_event(VK_CONTROL, 0, 0, UIntPtr.Zero);
                    keybd_event(VK_LEFT, 0, 0, UIntPtr.Zero);
                    keybd_event(VK_LEFT, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    keybd_event(VK_LWIN, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    break;

                case "DESKTOP_RIGHT": // Win + Ctrl + Right
                    keybd_event(VK_LWIN, 0, 0, UIntPtr.Zero);
                    keybd_event(VK_CONTROL, 0, 0, UIntPtr.Zero);
                    keybd_event(VK_RIGHT, 0, 0, UIntPtr.Zero);
                    keybd_event(VK_RIGHT, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    keybd_event(VK_LWIN, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    break;

                case "COPY": // Ctrl + C
                    keybd_event(VK_CONTROL, 0, 0, UIntPtr.Zero);
                    keybd_event(0x43, 0, 0, UIntPtr.Zero); // 'C'
                    keybd_event(0x43, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    break;

                case "PASTE": // Ctrl + V
                    keybd_event(VK_CONTROL, 0, 0, UIntPtr.Zero);
                    keybd_event(0x56, 0, 0, UIntPtr.Zero); // 'V'
                    keybd_event(0x56, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    break;

                case "UNDO": // Ctrl + Z
                    keybd_event(VK_CONTROL, 0, 0, UIntPtr.Zero);
                    keybd_event(0x5A, 0, 0, UIntPtr.Zero); // 'Z'
                    keybd_event(0x5A, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    break;

                case "SELECT_ALL": // Ctrl + A
                    keybd_event(VK_CONTROL, 0, 0, UIntPtr.Zero);
                    keybd_event(0x41, 0, 0, UIntPtr.Zero); // 'A'
                    keybd_event(0x41, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    break;

                case "SLIDE_NEXT": // Page Down / Right Arrow
                    TapKey(VK_NEXT);
                    break;

                case "SLIDE_PREV": // Page Up / Left Arrow
                    TapKey(VK_PRIOR);
                    break;

                case "FULLSCREEN": // F5
                    TapKey(0x74); // VK_F5
                    break;

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
            }
        }
    }
}
