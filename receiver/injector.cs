using System;
using System.IO;
using System.Runtime.InteropServices;

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

        // Virtual key codes
        const byte VK_LWIN = 0x5B;
        const byte VK_CONTROL = 0x11;
        const byte VK_SHIFT = 0x10;
        const byte VK_MENU = 0x12; // Alt
        const byte VK_ESCAPE = 0x1B;
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

                case "VOL_UP":
                    keybd_event(VK_VOLUME_UP, 0, 0, UIntPtr.Zero);
                    keybd_event(VK_VOLUME_UP, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    break;

                case "VOL_DOWN":
                    keybd_event(VK_VOLUME_DOWN, 0, 0, UIntPtr.Zero);
                    keybd_event(VK_VOLUME_DOWN, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    break;

                case "MUTE":
                    keybd_event(VK_VOLUME_MUTE, 0, 0, UIntPtr.Zero);
                    keybd_event(VK_VOLUME_MUTE, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    break;

                case "MEDIA_PLAY_PAUSE":
                    keybd_event(VK_MEDIA_PLAY_PAUSE, 0, 0, UIntPtr.Zero);
                    keybd_event(VK_MEDIA_PLAY_PAUSE, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    break;

                case "MEDIA_NEXT":
                    keybd_event(VK_MEDIA_NEXT_TRACK, 0, 0, UIntPtr.Zero);
                    keybd_event(VK_MEDIA_NEXT_TRACK, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    break;

                case "MEDIA_PREV":
                    keybd_event(VK_MEDIA_PREV_TRACK, 0, 0, UIntPtr.Zero);
                    keybd_event(VK_MEDIA_PREV_TRACK, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
                    break;
            }
        }
    }
}
