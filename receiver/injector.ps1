# GLYPHPAD NATIVE WIN32 INPUT INJECTOR ENGINE (SendInput)
# Pure in-memory Win32 invocation - 100% compliant with Windows Defender
# Uses official Windows SendInput API for flawless Windows 10 & 11 mouse/keyboard control

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$signature = @"
using System;
using System.Runtime.InteropServices;
using System.Text;

namespace GlyphPad {
    public class WinInput {
        [DllImport("user32.dll", SetLastError = true)]
        public static extern uint SendInput(uint nInputs, INPUT[] pInputs, int cbSize);

        [DllImport("user32.dll")]
        public static extern bool LockWorkStation();

        [DllImport("PowrProf.dll", CharSet = CharSet.Auto, ExactSpelling = true)]
        public static extern bool SetSuspendState(bool hibernate, bool forceCritical, bool disableWakeEvent);

        [StructLayout(LayoutKind.Explicit)]
        public struct INPUT {
            [FieldOffset(0)] public uint type;
            [FieldOffset(8)] public MOUSEINPUT mi;
            [FieldOffset(8)] public KEYBDINPUT ki;
        }

        [StructLayout(LayoutKind.Sequential)]
        public struct MOUSEINPUT {
            public int dx;
            public int dy;
            public uint mouseData;
            public uint dwFlags;
            public uint time;
            public UIntPtr dwExtraInfo;
        }

        [StructLayout(LayoutKind.Sequential)]
        public struct KEYBDINPUT {
            public ushort wVk;
            public ushort wScan;
            public uint dwFlags;
            public uint time;
            public UIntPtr dwExtraInfo;
        }

        public const uint INPUT_MOUSE = 0;
        public const uint INPUT_KEYBOARD = 1;

        public const uint MOUSEEVENTF_MOVE = 0x0001;
        public const uint MOUSEEVENTF_LEFTDOWN = 0x0002;
        public const uint MOUSEEVENTF_LEFTUP = 0x0004;
        public const uint MOUSEEVENTF_RIGHTDOWN = 0x0008;
        public const uint MOUSEEVENTF_RIGHTUP = 0x0010;
        public const uint MOUSEEVENTF_MIDDLEDOWN = 0x0020;
        public const uint MOUSEEVENTF_MIDDLEUP = 0x0040;
        public const uint MOUSEEVENTF_WHEEL = 0x0800;
        public const uint MOUSEEVENTF_HWHEEL = 0x1000;

        public const uint KEYEVENTF_EXTENDEDKEY = 0x0001;
        public const uint KEYEVENTF_KEYUP = 0x0002;
        public const uint KEYEVENTF_UNICODE = 0x0004;

        public const ushort VK_BACK = 0x08;
        public const ushort VK_TAB = 0x09;
        public const ushort VK_RETURN = 0x0D;
        public const ushort VK_SHIFT = 0x10;
        public const ushort VK_CONTROL = 0x11;
        public const ushort VK_MENU = 0x12; // Alt
        public const ushort VK_ESCAPE = 0x1B;
        public const ushort VK_SPACE = 0x20;
        public const ushort VK_PRIOR = 0x21; // Page Up
        public const ushort VK_NEXT = 0x22;  // Page Down
        public const ushort VK_END = 0x23;
        public const ushort VK_HOME = 0x24;
        public const ushort VK_LEFT = 0x25;
        public const ushort VK_UP = 0x26;
        public const ushort VK_RIGHT = 0x27;
        public const ushort VK_DOWN = 0x28;
        public const ushort VK_SNAPSHOT = 0x2C; // Print Screen
        public const ushort VK_DELETE = 0x2E;
        public const ushort VK_LWIN = 0x5B;

        public const ushort VK_VOLUME_MUTE = 0xAD;
        public const ushort VK_VOLUME_DOWN = 0xAE;
        public const ushort VK_VOLUME_UP = 0xAF;
        public const ushort VK_MEDIA_NEXT_TRACK = 0xB0;
        public const ushort VK_MEDIA_PREV_TRACK = 0xB1;
        public const ushort VK_MEDIA_STOP = 0xB2;
        public const ushort VK_MEDIA_PLAY_PAUSE = 0xB3;

        private static int InputSize = Marshal.SizeOf(typeof(INPUT));

        public static void Move(int dx, int dy) {
            INPUT[] inputs = new INPUT[1];
            inputs[0].type = INPUT_MOUSE;
            inputs[0].mi.dx = dx;
            inputs[0].mi.dy = dy;
            inputs[0].mi.dwFlags = MOUSEEVENTF_MOVE;
            SendInput(1, inputs, InputSize);
        }

        public static void MouseDown(uint flag) {
            INPUT[] inputs = new INPUT[1];
            inputs[0].type = INPUT_MOUSE;
            inputs[0].mi.dwFlags = flag;
            SendInput(1, inputs, InputSize);
        }

        public static void MouseUp(uint flag) {
            INPUT[] inputs = new INPUT[1];
            inputs[0].type = INPUT_MOUSE;
            inputs[0].mi.dwFlags = flag;
            SendInput(1, inputs, InputSize);
        }

        public static void MouseClick(uint downFlag, uint upFlag) {
            INPUT[] inputs = new INPUT[2];
            inputs[0].type = INPUT_MOUSE;
            inputs[0].mi.dwFlags = downFlag;
            inputs[1].type = INPUT_MOUSE;
            inputs[1].mi.dwFlags = upFlag;
            SendInput(2, inputs, InputSize);
        }

        public static void DoubleClick() {
            INPUT[] inputs = new INPUT[4];
            inputs[0].type = INPUT_MOUSE; inputs[0].mi.dwFlags = MOUSEEVENTF_LEFTDOWN;
            inputs[1].type = INPUT_MOUSE; inputs[1].mi.dwFlags = MOUSEEVENTF_LEFTUP;
            inputs[2].type = INPUT_MOUSE; inputs[2].mi.dwFlags = MOUSEEVENTF_LEFTDOWN;
            inputs[3].type = INPUT_MOUSE; inputs[3].mi.dwFlags = MOUSEEVENTF_LEFTUP;
            SendInput(4, inputs, InputSize);
        }

        public static void Scroll(int delta) {
            INPUT[] inputs = new INPUT[1];
            inputs[0].type = INPUT_MOUSE;
            inputs[0].mi.mouseData = (uint)delta;
            inputs[0].mi.dwFlags = MOUSEEVENTF_WHEEL;
            SendInput(1, inputs, InputSize);
        }

        public static void HScroll(int delta) {
            INPUT[] inputs = new INPUT[1];
            inputs[0].type = INPUT_MOUSE;
            inputs[0].mi.mouseData = (uint)delta;
            inputs[0].mi.dwFlags = MOUSEEVENTF_HWHEEL;
            SendInput(1, inputs, InputSize);
        }

        public static void ReleaseAll() {
            MouseUp(MOUSEEVENTF_LEFTUP);
            MouseUp(MOUSEEVENTF_RIGHTUP);
            MouseUp(MOUSEEVENTF_MIDDLEUP);
        }

        public static void TapKey(ushort vk) {
            INPUT[] inputs = new INPUT[2];
            inputs[0].type = INPUT_KEYBOARD; inputs[0].ki.wVk = vk;
            inputs[1].type = INPUT_KEYBOARD; inputs[1].ki.wVk = vk; inputs[1].ki.dwFlags = KEYEVENTF_KEYUP;
            SendInput(2, inputs, InputSize);
        }

        public static void SendChord(ushort mod1, ushort key) {
            INPUT[] inputs = new INPUT[4];
            inputs[0].type = INPUT_KEYBOARD; inputs[0].ki.wVk = mod1;
            inputs[1].type = INPUT_KEYBOARD; inputs[1].ki.wVk = key;
            inputs[2].type = INPUT_KEYBOARD; inputs[2].ki.wVk = key; inputs[2].ki.dwFlags = KEYEVENTF_KEYUP;
            inputs[3].type = INPUT_KEYBOARD; inputs[3].ki.wVk = mod1; inputs[3].ki.dwFlags = KEYEVENTF_KEYUP;
            SendInput(4, inputs, InputSize);
        }

        public static void SendChord3(ushort mod1, ushort mod2, ushort key) {
            INPUT[] inputs = new INPUT[6];
            inputs[0].type = INPUT_KEYBOARD; inputs[0].ki.wVk = mod1;
            inputs[1].type = INPUT_KEYBOARD; inputs[1].ki.wVk = mod2;
            inputs[2].type = INPUT_KEYBOARD; inputs[2].ki.wVk = key;
            inputs[3].type = INPUT_KEYBOARD; inputs[3].ki.wVk = key; inputs[3].ki.dwFlags = KEYEVENTF_KEYUP;
            inputs[4].type = INPUT_KEYBOARD; inputs[4].ki.wVk = mod2; inputs[4].ki.dwFlags = KEYEVENTF_KEYUP;
            inputs[5].type = INPUT_KEYBOARD; inputs[5].ki.wVk = mod1; inputs[5].ki.dwFlags = KEYEVENTF_KEYUP;
            SendInput(6, inputs, InputSize);
        }

        public static void TypeString(string text) {
            foreach (char c in text) {
                INPUT[] inputs = new INPUT[2];
                inputs[0].type = INPUT_KEYBOARD; inputs[0].ki.wScan = (ushort)c; inputs[0].ki.dwFlags = KEYEVENTF_UNICODE;
                inputs[1].type = INPUT_KEYBOARD; inputs[1].ki.wScan = (ushort)c; inputs[1].ki.dwFlags = KEYEVENTF_UNICODE | KEYEVENTF_KEYUP;
                SendInput(2, inputs, InputSize);
            }
        }

        public static void RunLoop() {
            try {
                Console.OutputEncoding = Encoding.UTF8;
            } catch { }

            Console.Out.WriteLine("INJECTOR_READY");
            Console.Out.Flush();

            string line;
            while ((line = Console.ReadLine()) != null) {
                if (line.Length == 0) continue;
                try {
                    int spaceIdx = line.IndexOf(' ');
                    string cmd = spaceIdx > 0 ? line.Substring(0, spaceIdx).ToUpper() : line.ToUpper();
                    string args = spaceIdx > 0 ? line.Substring(spaceIdx + 1).Trim() : "";

                    if (cmd == "M") {
                        int s2 = args.IndexOf(' ');
                        if (s2 > 0) {
                            int dx, dy;
                            if (int.TryParse(args.Substring(0, s2), out dx) &&
                                int.TryParse(args.Substring(s2 + 1), out dy)) {
                                Move(dx, dy);
                            }
                        }
                    }
                    else if (cmd == "LC") {
                        MouseClick(MOUSEEVENTF_LEFTDOWN, MOUSEEVENTF_LEFTUP);
                    }
                    else if (cmd == "LDC") {
                        DoubleClick();
                    }
                    else if (cmd == "RC") {
                        MouseClick(MOUSEEVENTF_RIGHTDOWN, MOUSEEVENTF_RIGHTUP);
                    }
                    else if (cmd == "MC") {
                        MouseClick(MOUSEEVENTF_MIDDLEDOWN, MOUSEEVENTF_MIDDLEUP);
                    }
                    else if (cmd == "LD") {
                        MouseDown(MOUSEEVENTF_LEFTDOWN);
                    }
                    else if (cmd == "LU") {
                        MouseUp(MOUSEEVENTF_LEFTUP);
                    }
                    else if (cmd == "RD") {
                        MouseDown(MOUSEEVENTF_RIGHTDOWN);
                    }
                    else if (cmd == "RU") {
                        MouseUp(MOUSEEVENTF_RIGHTUP);
                    }
                    else if (cmd == "MD") {
                        MouseDown(MOUSEEVENTF_MIDDLEDOWN);
                    }
                    else if (cmd == "MU") {
                        MouseUp(MOUSEEVENTF_MIDDLEUP);
                    }
                    else if (cmd == "S") {
                        int delta;
                        if (int.TryParse(args, out delta)) Scroll(delta);
                    }
                    else if (cmd == "HS") {
                        int delta;
                        if (int.TryParse(args, out delta)) HScroll(delta);
                    }
                    else if (cmd == "K") {
                        ushort vk;
                        if (ushort.TryParse(args, out vk)) TapKey(vk);
                    }
                    else if (cmd == "TEXT") {
                        if (!string.IsNullOrEmpty(args)) {
                            byte[] bytes = Convert.FromBase64String(args);
                            string txt = Encoding.UTF8.GetString(bytes);
                            TypeString(txt);
                        }
                    }
                    else if (cmd == "RELEASE_ALL") {
                        ReleaseAll();
                    }
                    else if (cmd == "ACTION") {
                        string act = args.ToUpper();
                        if (act == "SHOW_DESKTOP") SendChord(VK_LWIN, 0x44); // Win+D
                        else if (act == "TASK_VIEW") SendChord(VK_LWIN, VK_TAB); // Win+Tab
                        else if (act == "TASK_MANAGER") SendChord3(VK_CONTROL, VK_SHIFT, VK_ESCAPE); // Ctrl+Shift+Esc
                        else if (act == "EXPLORER" || act == "FILE_MANAGER") SendChord(VK_LWIN, 0x45); // Win+E
                        else if (act == "SETTINGS") SendChord(VK_LWIN, 0x49); // Win+I
                        else if (act == "SEARCH") SendChord(VK_LWIN, 0x53); // Win+S
                        else if (act == "CLIPBOARD") SendChord(VK_LWIN, 0x56); // Win+V
                        else if (act == "SCREENSHOT") SendChord3(VK_LWIN, VK_SHIFT, 0x53); // Win+Shift+S
                        else if (act == "LOCK_PC") LockWorkStation();
                        else if (act == "TERMINAL") {
                            try { System.Diagnostics.Process.Start("wt.exe"); } catch { System.Diagnostics.Process.Start("cmd.exe"); }
                        }
                        else if (act == "CALCULATOR") {
                            try { System.Diagnostics.Process.Start("calc.exe"); } catch { }
                        }
                        else if (act == "NOTEPAD") {
                            try { System.Diagnostics.Process.Start("notepad.exe"); } catch { }
                        }
                        else if (act == "VOL_UP") TapKey(VK_VOLUME_UP);
                        else if (act == "VOL_DOWN") TapKey(VK_VOLUME_DOWN);
                        else if (act == "MUTE") TapKey(VK_VOLUME_MUTE);
                        else if (act == "MEDIA_PLAY_PAUSE") TapKey(VK_MEDIA_PLAY_PAUSE);
                        else if (act == "MEDIA_NEXT") TapKey(VK_MEDIA_NEXT_TRACK);
                        else if (act == "MEDIA_PREV") TapKey(VK_MEDIA_PREV_TRACK);
                        else if (act == "SLEEP") SetSuspendState(false, true, false);
                        else if (act == "COPY") SendChord(VK_CONTROL, 0x43); // Ctrl+C
                        else if (act == "PASTE") SendChord(VK_CONTROL, 0x56); // Ctrl+V
                        else if (act == "SELECT_ALL") SendChord(VK_CONTROL, 0x41); // Ctrl+A
                        else if (act == "UNDO") SendChord(VK_CONTROL, 0x5A); // Ctrl+Z
                        else if (act == "ENTER") TapKey(VK_RETURN);
                        else if (act == "ESCAPE") TapKey(VK_ESCAPE);
                        else if (act == "BACKSPACE") TapKey(VK_BACK);
                        else if (act == "TAB") TapKey(VK_TAB);
                    }
                } catch {
                    // Fail-safe: continue loop without dropping connection
                }
            }
        }
    }
}
"@

try {
    Add-Type -TypeDefinition $signature -Language CSharp
} catch {
    # Type may already be loaded in session
}

# Enter compiled native C# CLR loop (Zero-overhead, microsecond stdin processing)
[GlyphPad.WinInput]::RunLoop()
