import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertTriangle, Shield, Info, Filter } from 'lucide-react';

export const CompatibilityPage: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'VERIFIED' | 'DEV'>('ALL');

  const matrix = [
    {
      platform: 'Windows 11',
      type: 'Desktop Host',
      osReq: '22H2 / 23H2 / 24H2 (x64, ARM64)',
      injection: 'Win32 SendInput API',
      permissions: 'Inbound Firewall Rule (TCP/8443)',
      status: 'VERIFIED IN LAB',
      badge: 'text-glyph-green bg-glyph-green/10 border-glyph-green/20',
      notes: 'Standard user integrity. Does not inject into elevated UAC secure prompts per UIPI.',
    },
    {
      platform: 'Windows 10',
      type: 'Desktop Host',
      osReq: '21H2 / 22H2 (x64, x86)',
      injection: 'Win32 SendInput API',
      permissions: 'Inbound Firewall Rule (TCP/8443)',
      status: 'VERIFIED IN LAB',
      badge: 'text-glyph-green bg-glyph-green/10 border-glyph-green/20',
      notes: 'Full pointer, scroll, shortcuts, volume, and media session support.',
    },
    {
      platform: 'Android Phones & Tablets',
      type: 'Mobile Controller',
      osReq: 'Android 10 through 15+',
      injection: 'Client Multi-Touch Engine',
      permissions: 'ACCESS_FINE_LOCATION (BLE), Wi-Fi Multicast',
      status: 'VERIFIED IN LAB',
      badge: 'text-glyph-green bg-glyph-green/10 border-glyph-green/20',
      notes: 'Jetpack Compose touch surface with 120Hz high refresh rate sampling.',
    },
    {
      platform: 'macOS Sonoma & Sequoia',
      type: 'Desktop Host',
      osReq: 'macOS 14 / 15 (Apple Silicon & Intel)',
      injection: 'CoreGraphics CGEventPost',
      permissions: 'macOS Accessibility (System Settings)',
      status: 'IN DEVELOPMENT',
      badge: 'text-glyph-cyan bg-glyph-cyan/10 border-glyph-cyan/20',
      notes: 'Requires Accessibility permissions for system-wide pointer injection.',
    },
    {
      platform: 'Linux (Ubuntu / Fedora / Arch)',
      type: 'Desktop Host',
      osReq: 'Kernel 5.15+ (X11 Desktop)',
      injection: 'X11 XTestFakeMotionEvent',
      permissions: 'Standard user session access',
      status: 'IN DEVELOPMENT',
      badge: 'text-glyph-cyan bg-glyph-cyan/10 border-glyph-cyan/20',
      notes: 'Full X11 pointer and key sym support. Native Rust receiver.',
    },
    {
      platform: 'Linux (Wayland)',
      type: 'Desktop Host',
      osReq: 'GNOME 44+ / KDE Plasma 6',
      injection: '/dev/uinput Virtual Device Driver',
      permissions: 'uinput user group / udev rule',
      status: 'IN DEVELOPMENT',
      badge: 'text-glyph-cyan bg-glyph-cyan/10 border-glyph-cyan/20',
      notes: 'Wayland security prohibits direct injection; requires virtual uinput node.',
    },
    {
      platform: 'Apple iPhone & iPad',
      type: 'Mobile Controller',
      osReq: 'iOS 16 - 18+',
      injection: 'SwiftUI Multi-Touch Engine',
      permissions: 'NSLocalNetworkUsageDescription',
      status: 'IN DEVELOPMENT',
      badge: 'text-glyph-cyan bg-glyph-cyan/10 border-glyph-cyan/20',
      notes: 'Wi-Fi LAN mode supported; iOS generic Bluetooth HID mouse role is restricted by Apple.',
    },
    {
      platform: 'ChromeOS',
      type: 'Desktop Host',
      osReq: 'ChromeOS 118+ (Crostini Linux)',
      injection: 'Linux Container / Android subsystem',
      permissions: 'Developer Mode / Crostini ports',
      status: 'EXPERIMENTAL',
      badge: 'text-glyph-amber bg-glyph-amber/10 border-glyph-amber/20',
      notes: 'Requires validated container bridge. Subject to sandbox constraints.',
    },
  ];

  const filtered = matrix.filter((row) => {
    if (filter === 'VERIFIED') return row.status === 'VERIFIED IN LAB';
    if (filter === 'DEV') return row.status === 'IN DEVELOPMENT' || row.status === 'EXPERIMENTAL';
    return true;
  });

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-mono text-xs">
            <span>TRANSPARENT SYSTEM COMPATIBILITY</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Platform Matrix & Permissions.
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
            Every supported operating system with its native injection method and mandatory OS permission boundaries.
          </p>

          {/* Filter Bar */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {(['ALL', 'VERIFIED', 'DEV'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs transition-all ${
                  filter === mode
                    ? 'bg-white text-black font-bold'
                    : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
                }`}
              >
                {mode === 'ALL' ? 'ALL PLATFORMS' : mode === 'VERIFIED' ? 'VERIFIED ONLY' : 'IN DEVELOPMENT'}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Table */}
        <div className="glass-panel-elevated rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black/40 text-zinc-400 border-b border-white/10 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-6">Platform / OS</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Injection Engine</th>
                  <th className="py-4 px-6">System Permissions</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <strong className="text-white text-sm font-sans block">{item.platform}</strong>
                      <span className="text-zinc-500 text-[11px]">{item.osReq}</span>
                    </td>
                    <td className="py-4 px-6 text-zinc-300">{item.type}</td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 rounded bg-zinc-900 border border-white/10 text-glyph-cyan">
                        {item.injection}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-zinc-400 max-w-xs">{item.permissions}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] border whitespace-nowrap ${item.badge}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Permission Architecture Deep Dives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-glyph-red">
              <Shield className="w-5 h-5" />
              <h3 className="font-dot text-sm text-white">WINDOWS UIPI INTEGRITY LIMITATIONS</h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
              Windows User Interface Privilege Isolation (UIPI) restricts SendInput calls from injecting into applications running at a higher integrity level (such as elevated Administrator prompts or UAC Secure Desktop). GlyphPad runs at standard user level and never attempts unauthorized kernel hooks.
            </p>
          </div>

          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-glyph-cyan">
              <Info className="w-5 h-5" />
              <h3 className="font-dot text-sm text-white">MACOS ACCESSIBILITY SECURITY</h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
              macOS enforces system-wide sandbox protection. The GlyphPad macOS receiver detects whether Accessibility permissions (AXIsProcessTrusted) have been granted, and presents an interactive step-by-step setup guide rather than failing silently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
