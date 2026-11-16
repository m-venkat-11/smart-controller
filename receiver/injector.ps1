# GLYPHPAD NATIVE WIN32 INJECTOR ENGINE (POWERSHELL / P-INVOKE)
# Pure in-memory Win32 invocation - 100% compliant with Windows Defender
# Runs natively on all Windows 10 & 11 systems without external binaries

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$signature = @"
using System;
using System.Runtime.InteropServices;
using System.Text;

namespace GlyphPad {
    public class WinInput {
        [DllImport("user32.dll", SetLastError = true)]
        public static extern void mouse_event(uint dwFlags, int dx, int dy, uint dwData, UIntPtr dwExtraInfo);

        [DllImport("user32.dll", SetLastError = true)]
        public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo);

        [DllImport("user32.dll")]
        public static extern bool LockWorkStation();

        [DllImport("PowrProf.dll", CharSet = CharSet.Auto, ExactSpelling = true)]
        public static extern bool SetSuspendState(bool hibernate, bool forceCritical, bool disableWakeEvent);

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

        public const byte VK_BACK = 0x08;
        public const byte VK_TAB = 0x09;
        public const byte VK_RETURN = 0x0D;
        public const byte VK_SHIFT = 0x10;
        public const byte VK_CONTROL = 0x11;
        public const byte VK_MENU = 0x12; // Alt
        public const byte VK_PAUSE = 0x13;
        public const byte VK_CAPITAL = 0x14;
        public const byte VK_ESCAPE = 0x1B;
        public const byte VK_SPACE = 0x20;
        public const byte VK_PRIOR = 0x21; // Page Up
        public const byte VK_NEXT = 0x22;  // Page Down
        public const byte VK_END = 0x23;
        public const byte VK_HOME = 0x24;
        public const byte VK_LEFT = 0x25;
        public const byte VK_UP = 0x26;
        public const byte VK_RIGHT = 0x27;
        public const byte VK_DOWN = 0x28;
        public const byte VK_SNAPSHOT = 0x2C; // Print Screen
        public const byte VK_INSERT = 0x2D;
        public const byte VK_DELETE = 0x2E;
        public const byte VK_LWIN = 0x5B;

        public const byte VK_VOLUME_MUTE = 0xAD;
        public const byte VK_VOLUME_DOWN = 0xAE;
        public const byte VK_VOLUME_UP = 0xAF;
        public const byte VK_MEDIA_NEXT_TRACK = 0xB0;
        public const byte VK_MEDIA_PREV_TRACK = 0xB1;
        public const byte VK_MEDIA_STOP = 0xB2;
        public const byte VK_MEDIA_PLAY_PAUSE = 0xB3;

        public static void TapKey(byte vk) {
            keybd_event(vk, 0, 0, UIntPtr.Zero);
            keybd_event(vk, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
        }

        public static void SendChord(byte mod1, byte key) {
            keybd_event(mod1, 0, 0, UIntPtr.Zero);
            keybd_event(key, 0, 0, UIntPtr.Zero);
            keybd_event(key, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
            keybd_event(mod1, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
        }

        public static void SendChord3(byte mod1, byte mod2, byte key) {
            keybd_event(mod1, 0, 0, UIntPtr.Zero);
            keybd_event(mod2, 0, 0, UIntPtr.Zero);
            keybd_event(key, 0, 0, UIntPtr.Zero);
            keybd_event(key, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
            keybd_event(mod2, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
            keybd_event(mod1, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
        }

        public static void TypeString(string text) {
            foreach (char c in text) {
                keybd_event(0, (byte)c, KEYEVENTF_UNICODE, UIntPtr.Zero);
                keybd_event(0, (byte)c, KEYEVENTF_UNICODE | KEYEVENTF_KEYUP, UIntPtr.Zero);
            }
        }

        public static void ReleaseAll() {
            mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, UIntPtr.Zero);
            mouse_event(MOUSEEVENTF_RIGHTUP, 0, 0, 0, UIntPtr.Zero);
            mouse_event(MOUSEEVENTF_MIDDLEUP, 0, 0, 0, UIntPtr.Zero);
            keybd_event(VK_SHIFT, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
            keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
            keybd_event(VK_MENU, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
            keybd_event(VK_LWIN, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
        }
    }
}
"@

try {
    Add-Type -TypeDefinition $signature -Language CSharp
} catch {
    # Type may already be loaded in this PowerShell session
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
                    [GlyphPad.WinInput]::mouse_event([GlyphPad.WinInput]::MOUSEEVENTF_MOVE, $dx, $dy, 0, [UIntPtr]::Zero)
                }
            }
            "LD" {
                [GlyphPad.WinInput]::mouse_event([GlyphPad.WinInput]::MOUSEEVENTF_LEFTDOWN, 0, 0, 0, [UIntPtr]::Zero)
            }
            "LU" {
                [GlyphPad.WinInput]::mouse_event([GlyphPad.WinInput]::MOUSEEVENTF_LEFTUP, 0, 0, 0, [UIntPtr]::Zero)
            }
            "LC" {
                [GlyphPad.WinInput]::mouse_event([GlyphPad.WinInput]::MOUSEEVENTF_LEFTDOWN, 0, 0, 0, [UIntPtr]::Zero)
                [GlyphPad.WinInput]::mouse_event([GlyphPad.WinInput]::MOUSEEVENTF_LEFTUP, 0, 0, 0, [UIntPtr]::Zero)
            }
            "LDC" {
                [GlyphPad.WinInput]::mouse_event([GlyphPad.WinInput]::MOUSEEVENTF_LEFTDOWN, 0, 0, 0, [UIntPtr]::Zero)
                [GlyphPad.WinInput]::mouse_event([GlyphPad.WinInput]::MOUSEEVENTF_LEFTUP, 0, 0, 0, [UIntPtr]::Zero)
                [GlyphPad.WinInput]::mouse_event([GlyphPad.WinInput]::MOUSEEVENTF_LEFTDOWN, 0, 0, 0, [UIntPtr]::Zero)
                [GlyphPad.WinInput]::mouse_event([GlyphPad.WinInput]::MOUSEEVENTF_LEFTUP, 0, 0, 0, [UIntPtr]::Zero)
            }
            "RD" {
                [GlyphPad.WinInput]::mouse_event([GlyphPad.WinInput]::MOUSEEVENTF_RIGHTDOWN, 0, 0, 0, [UIntPtr]::Zero)
            }
            "RU" {
                [GlyphPad.WinInput]::mouse_event([GlyphPad.WinInput]::MOUSEEVENTF_RIGHTUP, 0, 0, 0, [UIntPtr]::Zero)
            }
            "RC" {
                [GlyphPad.WinInput]::mouse_event([GlyphPad.WinInput]::MOUSEEVENTF_RIGHTDOWN, 0, 0, 0, [UIntPtr]::Zero)
                [GlyphPad.WinInput]::mouse_event([GlyphPad.WinInput]::MOUSEEVENTF_RIGHTUP, 0, 0, 0, [UIntPtr]::Zero)
            }
            "MD" {
                [GlyphPad.WinInput]::mouse_event([GlyphPad.WinInput]::MOUSEEVENTF_MIDDLEDOWN, 0, 0, 0, [UIntPtr]::Zero)
            }
            "MU" {
                [GlyphPad.WinInput]::mouse_event([GlyphPad.WinInput]::MOUSEEVENTF_MIDDLEUP, 0, 0, 0, [UIntPtr]::Zero)
            }
            "MC" {
                [GlyphPad.WinInput]::mouse_event([GlyphPad.WinInput]::MOUSEEVENTF_MIDDLEDOWN, 0, 0, 0, [UIntPtr]::Zero)
                [GlyphPad.WinInput]::mouse_event([GlyphPad.WinInput]::MOUSEEVENTF_MIDDLEUP, 0, 0, 0, [UIntPtr]::Zero)
            }
            "S" {
                if ($parts.Length -ge 2) {
                    $delta = [int]$parts[1]
                    [GlyphPad.WinInput]::mouse_event([GlyphPad.WinInput]::MOUSEEVENTF_WHEEL, 0, 0, [uint32]$delta, [UIntPtr]::Zero)
                }
            }
            "HS" {
                if ($parts.Length -ge 2) {
                    $hdelta = [int]$parts[1]
                    [GlyphPad.WinInput]::mouse_event([GlyphPad.WinInput]::MOUSEEVENTF_HWHEEL, 0, 0, [uint32]$hdelta, [UIntPtr]::Zero)
                }
            }
            "K" {
                if ($parts.Length -ge 2) {
                    $vk = [byte]$parts[1]
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
                        "TASK_VIEW" { [GlyphPad.WinInput]::SendChord([GlyphPad.WinInput]::VK_TAB, [GlyphPad.WinInput]::VK_LWIN) } # Win+Tab
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
