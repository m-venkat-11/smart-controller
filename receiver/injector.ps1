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

        public static void ReleaseAll() {
            MouseUp(MOUSEEVENTF_LEFTUP);
            MouseUp(MOUSEEVENTF_RIGHTUP);
            MouseUp(MOUSEEVENTF_MIDDLEUP);
            INPUT[] inputs = new INPUT[4];
            inputs[0].type = INPUT_KEYBOARD; inputs[0].ki.wVk = VK_SHIFT; inputs[0].ki.dwFlags = KEYEVENTF_KEYUP;
            inputs[1].type = INPUT_KEYBOARD; inputs[1].ki.wVk = VK_CONTROL; inputs[1].ki.dwFlags = KEYEVENTF_KEYUP;
            inputs[2].type = INPUT_KEYBOARD; inputs[2].ki.wVk = VK_MENU; inputs[2].ki.dwFlags = KEYEVENTF_KEYUP;
            inputs[3].type = INPUT_KEYBOARD; inputs[3].ki.wVk = VK_LWIN; inputs[3].ki.dwFlags = KEYEVENTF_KEYUP;
            SendInput(4, inputs, InputSize);
        }
    }
}
"@

try {
    Add-Type -TypeDefinition $signature -Language CSharp
} catch {
    # Type may already be loaded in session
}

# Signal to Node server that injector is active
[Console]::Out.WriteLine("INJECTOR_READY")
[Console]::Out.Flush()

while ($true) {
    $line = [Console]::In.ReadLine()
    if ($null -eq $line) { break }
    $line = $line.Trim()
    if ([string]::IsNullOrEmpty($line)) { continue }

    try {
        $parts = $line.Split(' ')
        $cmd = $parts[0].ToUpper()

        switch ($cmd) {
            "M" {
                if ($parts.Length -ge 3) {
                    $dx = [int]$parts[1]
                    $dy = [int]$parts[2]
                    [GlyphPad.WinInput]::Move($dx, $dy)
                }
            }
            "LD" {
                [GlyphPad.WinInput]::MouseDown([GlyphPad.WinInput]::MOUSEEVENTF_LEFTDOWN)
            }
            "LU" {
                [GlyphPad.WinInput]::MouseUp([GlyphPad.WinInput]::MOUSEEVENTF_LEFTUP)
            }
            "LC" {
                [GlyphPad.WinInput]::MouseClick([GlyphPad.WinInput]::MOUSEEVENTF_LEFTDOWN, [GlyphPad.WinInput]::MOUSEEVENTF_LEFTUP)
            }
            "LDC" {
                [GlyphPad.WinInput]::DoubleClick()
            }
            "RD" {
                [GlyphPad.WinInput]::MouseDown([GlyphPad.WinInput]::MOUSEEVENTF_RIGHTDOWN)
            }
            "RU" {
                [GlyphPad.WinInput]::MouseUp([GlyphPad.WinInput]::MOUSEEVENTF_RIGHTUP)
            }
            "RC" {
                [GlyphPad.WinInput]::MouseClick([GlyphPad.WinInput]::MOUSEEVENTF_RIGHTDOWN, [GlyphPad.WinInput]::MOUSEEVENTF_RIGHTUP)
            }
            "MD" {
                [GlyphPad.WinInput]::MouseDown([GlyphPad.WinInput]::MOUSEEVENTF_MIDDLEDOWN)
            }
            "MU" {
                [GlyphPad.WinInput]::MouseUp([GlyphPad.WinInput]::MOUSEEVENTF_MIDDLEUP)
            }
            "MC" {
                [GlyphPad.WinInput]::MouseClick([GlyphPad.WinInput]::MOUSEEVENTF_MIDDLEDOWN, [GlyphPad.WinInput]::MOUSEEVENTF_MIDDLEUP)
            }
            "S" {
                if ($parts.Length -ge 2) {
                    $delta = [int]$parts[1]
                    [GlyphPad.WinInput]::Scroll($delta)
                }
            }
            "HS" {
                if ($parts.Length -ge 2) {
                    $hdelta = [int]$parts[1]
                    [GlyphPad.WinInput]::HScroll($hdelta)
                }
            }
            "K" {
                if ($parts.Length -ge 2) {
                    $vk = [ushort]$parts[1]
                    [GlyphPad.WinInput]::TapKey($vk)
                }
            }
            "TEXT" {
                if ($parts.Length -ge 2) {
                    $bytes = [Convert]::FromBase64String($parts[1])
                    $txt = [System.Text.Encoding]::UTF8.GetString($bytes)
                    [GlyphPad.WinInput]::TypeString($txt)
                }
            }
            "RELEASE_ALL" {
                [GlyphPad.WinInput]::ReleaseAll()
            }
            "ACTION" {
                if ($parts.Length -ge 2) {
                    $act = $parts[1].ToUpper()
                    switch ($act) {
                        "SHOW_DESKTOP" { [GlyphPad.WinInput]::SendChord([GlyphPad.WinInput]::VK_LWIN, 0x44) } # Win+D
                        "TASK_VIEW" { [GlyphPad.WinInput]::SendChord([GlyphPad.WinInput]::VK_LWIN, [GlyphPad.WinInput]::VK_TAB) } # Win+Tab
                        "TASK_MANAGER" { [GlyphPad.WinInput]::SendChord3([GlyphPad.WinInput]::VK_CONTROL, [GlyphPad.WinInput]::VK_SHIFT, [GlyphPad.WinInput]::VK_ESCAPE) } # Ctrl+Shift+Esc
                        "EXPLORER" { [GlyphPad.WinInput]::SendChord([GlyphPad.WinInput]::VK_LWIN, 0x45) } # Win+E
                        "FILE_MANAGER" { [GlyphPad.WinInput]::SendChord([GlyphPad.WinInput]::VK_LWIN, 0x45) }
                        "SETTINGS" { [GlyphPad.WinInput]::SendChord([GlyphPad.WinInput]::VK_LWIN, 0x49) } # Win+I
                        "SEARCH" { [GlyphPad.WinInput]::SendChord([GlyphPad.WinInput]::VK_LWIN, 0x53) } # Win+S
                        "CLIPBOARD" { [GlyphPad.WinInput]::SendChord([GlyphPad.WinInput]::VK_LWIN, 0x56) } # Win+V
                        "SCREENSHOT" { [GlyphPad.WinInput]::SendChord3([GlyphPad.WinInput]::VK_LWIN, [GlyphPad.WinInput]::VK_SHIFT, 0x53) } # Win+Shift+S
                        "LOCK_PC" { [GlyphPad.WinInput]::LockWorkStation() }
                        "TERMINAL" { Start-Process "wt.exe" -ErrorAction SilentlyContinue }
                        "CALCULATOR" { Start-Process "calc.exe" -ErrorAction SilentlyContinue }
                        "NOTEPAD" { Start-Process "notepad.exe" -ErrorAction SilentlyContinue }
                        "VOL_UP" { [GlyphPad.WinInput]::TapKey([GlyphPad.WinInput]::VK_VOLUME_UP) }
                        "VOL_DOWN" { [GlyphPad.WinInput]::TapKey([GlyphPad.WinInput]::VK_VOLUME_DOWN) }
                        "MUTE" { [GlyphPad.WinInput]::TapKey([GlyphPad.WinInput]::VK_VOLUME_MUTE) }
                        "MEDIA_PLAY_PAUSE" { [GlyphPad.WinInput]::TapKey([GlyphPad.WinInput]::VK_MEDIA_PLAY_PAUSE) }
                        "MEDIA_NEXT" { [GlyphPad.WinInput]::TapKey([GlyphPad.WinInput]::VK_MEDIA_NEXT_TRACK) }
                        "MEDIA_PREV" { [GlyphPad.WinInput]::TapKey([GlyphPad.WinInput]::VK_MEDIA_PREV_TRACK) }
                        "SLEEP" { [GlyphPad.WinInput]::SetSuspendState($false, $true, $false) }
                        "SHUTDOWN" { Stop-Computer -Force -ErrorAction SilentlyContinue }
                        "RESTART" { Restart-Computer -Force -ErrorAction SilentlyContinue }
                        "COPY" { [GlyphPad.WinInput]::SendChord([GlyphPad.WinInput]::VK_CONTROL, 0x43) } # Ctrl+C
                        "PASTE" { [GlyphPad.WinInput]::SendChord([GlyphPad.WinInput]::VK_CONTROL, 0x56) } # Ctrl+V
                        "SELECT_ALL" { [GlyphPad.WinInput]::SendChord([GlyphPad.WinInput]::VK_CONTROL, 0x41) } # Ctrl+A
                        "UNDO" { [GlyphPad.WinInput]::SendChord([GlyphPad.WinInput]::VK_CONTROL, 0x5A) } # Ctrl+Z
                        "ENTER" { [GlyphPad.WinInput]::TapKey([GlyphPad.WinInput]::VK_RETURN) }
                        "ESCAPE" { [GlyphPad.WinInput]::TapKey([GlyphPad.WinInput]::VK_ESCAPE) }
                        "BACKSPACE" { [GlyphPad.WinInput]::TapKey([GlyphPad.WinInput]::VK_BACK) }
                        "TAB" { [GlyphPad.WinInput]::TapKey([GlyphPad.WinInput]::VK_TAB) }
                    }
                }
            }
        }
    } catch {
        # Continue gracefully on error
    }
}
