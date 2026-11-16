/**
 * DYNAMIC SYSTEM ACTIONS & CAPABILITY PROFILES
 * Universal Control Protocol (UCP v1.0)
 * Dynamically adapts UI, shortcuts, and key chords based on connected PC (Windows, macOS, Linux)
 */

export type PlatformType = 'windows' | 'macos' | 'linux';

export interface DynamicAction {
  id: string;
  label: string;
  description: string;
  category: 'system' | 'window' | 'media' | 'presentation' | 'editing' | 'power';
  icon: string;
  shortcut: string;
  accent: 'emerald' | 'rose' | 'blue' | 'purple' | 'cyan' | 'amber' | 'wine';
  requiresConfirmation?: boolean;
  countdownSeconds?: number;
  platforms: PlatformType[];
}

export interface ReceiverDeviceProfile {
  id: string;
  hostname: string;
  platform: PlatformType;
  osName: string;
  osVersion: string;
  arch: string;
  deviceType: 'laptop' | 'desktop';
  ip: string;
  port: number;
  status: 'CONNECTED' | 'DISCOVERED' | 'SAVED' | 'OFFLINE';
  lastSeen?: number;
  battery?: {
    level: number;
    charging: boolean;
  };
  actions: DynamicAction[];
}

// Complete Dynamic Actions Master Catalog
export const MASTER_ACTION_CATALOG: DynamicAction[] = [
  // ==========================================
  // 1. SYSTEM APPS & LAUNCHERS
  // ==========================================
  {
    id: 'SETTINGS',
    label: 'SETTINGS',
    description: 'System Preferences & Settings',
    category: 'system',
    icon: 'Settings',
    shortcut: 'Win+I / Cmd+,',
    accent: 'emerald',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'FILE_MANAGER',
    label: 'FILES',
    description: 'Explorer / Finder / Nautilus',
    category: 'system',
    icon: 'Folder',
    shortcut: 'Win+E / Cmd+Opt+Space',
    accent: 'emerald',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'SEARCH',
    label: 'SEARCH',
    description: 'Windows Search / Spotlight / Overview',
    category: 'system',
    icon: 'Search',
    shortcut: 'Win+S / Cmd+Space / Super',
    accent: 'emerald',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'TASK_MANAGER',
    label: 'TASK MGR',
    description: 'Activity Monitor / Task Manager / System Monitor',
    category: 'system',
    icon: 'Activity',
    shortcut: 'Ctrl+Shift+Esc / Cmd+Opt+Esc',
    accent: 'emerald',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'TERMINAL',
    label: 'TERMINAL',
    description: 'PowerShell / Terminal.app / bash',
    category: 'system',
    icon: 'Terminal',
    shortcut: 'wt.exe / Terminal / Ctrl+Alt+T',
    accent: 'emerald',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'CALCULATOR',
    label: 'CALCULATOR',
    description: 'Desktop Calculator Tool',
    category: 'system',
    icon: 'Calculator',
    shortcut: 'calc.exe / Calc',
    accent: 'emerald',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'BROWSER',
    label: 'BROWSER',
    description: 'Default Web Browser',
    category: 'system',
    icon: 'Globe',
    shortcut: 'Default Browser',
    accent: 'emerald',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'SCREENSHOT',
    label: 'SNIP TOOL',
    description: 'Snipping Tool / Screenshot Capture',
    category: 'system',
    icon: 'Camera',
    shortcut: 'Win+Shift+S / Cmd+Shift+4 / PrtScn',
    accent: 'emerald',
    platforms: ['windows', 'macos', 'linux'],
  },

  // ==========================================
  // 2. WINDOW & WORKSPACE CONTROLS
  // ==========================================
  {
    id: 'SHOW_DESKTOP',
    label: 'DESKTOP',
    description: 'Show Desktop / Minimize All',
    category: 'window',
    icon: 'Monitor',
    shortcut: 'Win+D / F11 / Super+D',
    accent: 'cyan',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'TASK_VIEW',
    label: 'TASK VIEW',
    description: 'Mission Control / Task View / Activities',
    category: 'window',
    icon: 'Layers',
    shortcut: 'Win+Tab / F3 / Super',
    accent: 'cyan',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'APP_SWITCHER',
    label: 'SWITCH APPS',
    description: 'Alt+Tab / Cmd+Tab Application Switcher',
    category: 'window',
    icon: 'Layers',
    shortcut: 'Alt+Tab / Cmd+Tab',
    accent: 'cyan',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'SNAP_LEFT',
    label: 'SNAP LEFT',
    description: 'Tile window to left half',
    category: 'window',
    icon: 'ChevronLeft',
    shortcut: 'Win+Left / Tile Left',
    accent: 'cyan',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'SNAP_RIGHT',
    label: 'SNAP RIGHT',
    description: 'Tile window to right half',
    category: 'window',
    icon: 'ChevronRight',
    shortcut: 'Win+Right / Tile Right',
    accent: 'cyan',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'MAXIMIZE',
    label: 'MAXIMIZE',
    description: 'Maximize or enter full window',
    category: 'window',
    icon: 'Maximize2',
    shortcut: 'Win+Up / Ctrl+Cmd+F',
    accent: 'cyan',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'DESKTOP_LEFT',
    label: 'DESK LEFT',
    description: 'Switch Virtual Desktop / Space Left',
    category: 'window',
    icon: 'ChevronLeft',
    shortcut: 'Win+Ctrl+Left / Ctrl+Left',
    accent: 'cyan',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'DESKTOP_RIGHT',
    label: 'DESK RIGHT',
    description: 'Switch Virtual Desktop / Space Right',
    category: 'window',
    icon: 'ChevronRight',
    shortcut: 'Win+Ctrl+Right / Ctrl+Right',
    accent: 'cyan',
    platforms: ['windows', 'macos', 'linux'],
  },

  // ==========================================
  // 3. AUDIO & MEDIA CONTROLS
  // ==========================================
  {
    id: 'VOL_UP',
    label: 'VOL +',
    description: 'Increase Master Audio Volume',
    category: 'media',
    icon: 'Volume2',
    shortcut: 'Volume Up',
    accent: 'rose',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'VOL_DOWN',
    label: 'VOL -',
    description: 'Decrease Master Audio Volume',
    category: 'media',
    icon: 'Volume1',
    shortcut: 'Volume Down',
    accent: 'rose',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'MUTE',
    label: 'MUTE',
    description: 'Toggle Master Audio Mute',
    category: 'media',
    icon: 'VolumeX',
    shortcut: 'Mute Toggle',
    accent: 'rose',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'MEDIA_PLAY_PAUSE',
    label: 'PLAY / PAUSE',
    description: 'Global Play / Pause Media',
    category: 'media',
    icon: 'Play',
    shortcut: 'Media Play/Pause',
    accent: 'blue',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'MEDIA_NEXT',
    label: 'NEXT TRACK',
    description: 'Skip to Next Track',
    category: 'media',
    icon: 'SkipForward',
    shortcut: 'Media Next',
    accent: 'blue',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'MEDIA_PREV',
    label: 'PREV TRACK',
    description: 'Return to Previous Track',
    category: 'media',
    icon: 'SkipBack',
    shortcut: 'Media Prev',
    accent: 'blue',
    platforms: ['windows', 'macos', 'linux'],
  },

  // ==========================================
  // 4. PRESENTATION REMOTE
  // ==========================================
  {
    id: 'START_SLIDES',
    label: 'START (F5)',
    description: 'Start Presentation Slide Show',
    category: 'presentation',
    icon: 'Play',
    shortcut: 'F5 / Cmd+Opt+P',
    accent: 'amber',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'SLIDE_NEXT',
    label: 'NEXT SLIDE',
    description: 'Advance to Next Slide',
    category: 'presentation',
    icon: 'ChevronRight',
    shortcut: 'PageDown / Right',
    accent: 'amber',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'SLIDE_PREV',
    label: 'PREV SLIDE',
    description: 'Return to Previous Slide',
    category: 'presentation',
    icon: 'ChevronLeft',
    shortcut: 'PageUp / Left',
    accent: 'amber',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'BLACK_SCREEN',
    label: 'BLACK (B)',
    description: 'Blackout Slide Screen',
    category: 'presentation',
    icon: 'Square',
    shortcut: "'B' Key",
    accent: 'amber',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'END_SLIDES',
    label: 'END SLIDES',
    description: 'Exit Slide Presentation',
    category: 'presentation',
    icon: 'Square',
    shortcut: 'Escape Key',
    accent: 'amber',
    platforms: ['windows', 'macos', 'linux'],
  },

  // ==========================================
  // 5. EDITING & WORKFLOW
  // ==========================================
  {
    id: 'COPY',
    label: 'COPY',
    description: 'Copy selected content',
    category: 'editing',
    icon: 'Copy',
    shortcut: 'Ctrl+C / Cmd+C',
    accent: 'purple',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'PASTE',
    label: 'PASTE',
    description: 'Paste clipboard content',
    category: 'editing',
    icon: 'Clipboard',
    shortcut: 'Ctrl+V / Cmd+V',
    accent: 'purple',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'CUT',
    label: 'CUT',
    description: 'Cut selection to clipboard',
    category: 'editing',
    icon: 'Scissors',
    shortcut: 'Ctrl+X / Cmd+X',
    accent: 'purple',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'UNDO',
    label: 'UNDO',
    description: 'Undo previous operation',
    category: 'editing',
    icon: 'Undo2',
    shortcut: 'Ctrl+Z / Cmd+Z',
    accent: 'purple',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'REDO',
    label: 'REDO',
    description: 'Redo previously undone operation',
    category: 'editing',
    icon: 'Redo2',
    shortcut: 'Ctrl+Y / Cmd+Shift+Z',
    accent: 'purple',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'SAVE',
    label: 'SAVE',
    description: 'Save current active document',
    category: 'editing',
    icon: 'Save',
    shortcut: 'Ctrl+S / Cmd+S',
    accent: 'purple',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'SELECT_ALL',
    label: 'SELECT ALL',
    description: 'Select all content in document',
    category: 'editing',
    icon: 'AppWindow',
    shortcut: 'Ctrl+A / Cmd+A',
    accent: 'purple',
    platforms: ['windows', 'macos', 'linux'],
  },

  // ==========================================
  // 6. POWER & SECURITY (WITH PRD SAFETY GUARDRAILS)
  // ==========================================
  {
    id: 'LOCK_PC',
    label: 'LOCK SCREEN',
    description: 'Lock Workstation immediately',
    category: 'power',
    icon: 'Lock',
    shortcut: 'Win+L / Ctrl+Cmd+Q / Super+L',
    accent: 'wine',
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'SLEEP',
    label: 'SLEEP',
    description: 'Put computer to sleep',
    category: 'power',
    icon: 'Moon',
    shortcut: 'System Sleep',
    accent: 'wine',
    requiresConfirmation: true,
    countdownSeconds: 3,
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'RESTART',
    label: 'RESTART',
    description: 'Reboot the computer',
    category: 'power',
    icon: 'RefreshCw',
    shortcut: 'System Reboot',
    accent: 'wine',
    requiresConfirmation: true,
    countdownSeconds: 10,
    platforms: ['windows', 'macos', 'linux'],
  },
  {
    id: 'SHUTDOWN',
    label: 'SHUTDOWN',
    description: 'Power off computer',
    category: 'power',
    icon: 'Power',
    shortcut: 'System Power Off',
    accent: 'wine',
    requiresConfirmation: true,
    countdownSeconds: 10,
    platforms: ['windows', 'macos', 'linux'],
  },
];

// Helper to filter actions dynamically by target OS
export function getActionsForPlatform(platform: PlatformType): DynamicAction[] {
  return MASTER_ACTION_CATALOG.filter((action) => action.platforms.includes(platform));
}

// OS Specific Platform Information & Metadata
export const PLATFORM_INFO: Record<
  PlatformType,
  {
    name: string;
    icon: string;
    defaultKeyModifiers: {
      meta: string;
      ctrl: string;
      alt: string;
      shift: string;
    };
    description: string;
  }
> = {
  windows: {
    name: 'Windows 10 / 11',
    icon: 'Windows',
    defaultKeyModifiers: {
      meta: 'WIN',
      ctrl: 'CTRL',
      alt: 'ALT',
      shift: 'SHIFT',
    },
    description: 'Win32 SendInput & Universal UCP Bridge',
  },
  macos: {
    name: 'Apple macOS (Sonoma / Sequoia)',
    icon: 'Apple',
    defaultKeyModifiers: {
      meta: 'CMD ⌘',
      ctrl: 'CTRL ⌃',
      alt: 'OPT ⌥',
      shift: 'SHIFT ⇧',
    },
    description: 'Quartz & CoreGraphics Universal Bridge',
  },
  linux: {
    name: 'Linux (GNOME / KDE / Wayland)',
    icon: 'Linux',
    defaultKeyModifiers: {
      meta: 'SUPER',
      ctrl: 'CTRL',
      alt: 'ALT',
      shift: 'SHIFT',
    },
    description: 'X11 / Wayland uinput & evdev Input Bridge',
  },
};
