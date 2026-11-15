import React from 'react';
import { Smartphone, Laptop, Wifi, ShieldCheck, ArrowRight, Zap, RefreshCw, Cpu, CheckCircle } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const lifecycle = [
    {
      num: '01',
      title: 'LOCAL SERVICE DISCOVERY',
      desc: 'The desktop receiver advertises its presence via platform-native mDNS / Bonjour (DNS-SD) on port 8443. The mobile client listens for announcements without broadcast spam or port scanning.',
      tech: 'mDNS / DNS-SD • Zero manual IP typing',
    },
    {
      num: '02',
      title: 'PHYSICAL PAIRING APPROVAL',
      desc: 'The phone initiates a pairing request. The computer displays a one-time 6-digit numeric PIN or QR code. The host user explicitly confirms approval on the computer, establishing mutual cryptographic trust.',
      tech: 'Short-lived PIN • TLS 1.3 Session Nonce',
    },
    {
      num: '03',
      title: 'ENCRYPTED CONTROL SESSION',
      desc: 'Both endpoints negotiate capabilities (mouse, keyboard, media, display). A high-speed WebSocket channel carries versioned UCP packets over TLS with monotonic sequence replay protection.',
      tech: 'UCP Envelope • Sub-5ms Packet Roundtrip',
    },
    {
      num: '04',
      title: 'NATIVE INPUT DISPATCHING',
      desc: 'The receiver validates every message against a strict schema allowlist. Approved pointer and keyboard events are translated into native OS calls (SendInput on Windows, CGEvent on macOS, uinput on Linux).',
      tech: 'Win32 SendInput • UIPI Boundary Compliant',
    },
    {
      num: '05',
      title: 'WATCHDOG & RELEASE SAFETY',
      desc: 'A background watchdog verifies heartbeat liveness every 1000ms. If the connection drops or the phone battery dies, the receiver automatically triggers Release-All to prevent stuck keys or clicks.',
      tech: '3000ms Timeout • Atomic Key Clearance',
    },
  ];

  const environments = [
    {
      name: 'Home Wi-Fi (2.4 & 5 GHz)',
      status: 'OPTIMAL',
      badge: 'text-glyph-green bg-glyph-green/10 border-glyph-green/20',
      desc: 'Direct peer-to-peer communication on the local subnet. P95 latency typically under 4ms.',
    },
    {
      name: 'Phone Hotspot (Zero Router)',
      status: 'VERIFIED',
      badge: 'text-glyph-green bg-glyph-green/10 border-glyph-green/20',
      desc: 'Connect your laptop to your phone hotspot. Functions 100% offline without cellular data.',
    },
    {
      name: 'Campus / Enterprise Wi-Fi',
      status: 'REQUIRES HOTSPOT',
      badge: 'text-glyph-amber bg-glyph-amber/10 border-glyph-amber/20',
      desc: 'Networks with client isolation block local device discovery. Use Phone Hotspot mode for instant connectivity.',
    },
    {
      name: 'Bluetooth HID Direct',
      status: 'OPTIONAL (RECEIVER-FREE)',
      badge: 'text-glyph-cyan bg-glyph-cyan/10 border-glyph-cyan/20',
      desc: 'Supported on Android phones with OEM HID device role. Emulates standard Bluetooth mouse/keyboard without receiver.',
    },
  ];

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-mono text-xs">
            <span>ENGINEERING SPECIFICATION</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            How GlyphPad Works.
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
            A comprehensive look at the discovery, pairing lifecycle, encryption, and low-latency native input architecture.
          </p>
        </div>

        {/* 5-Step Deep Lifecycle */}
        <div className="space-y-6">
          <h2 className="font-dot text-sm text-zinc-400 tracking-wider">LIFECYCLE PIPELINE</h2>
          <div className="space-y-4">
            {lifecycle.map((step, idx) => (
              <div
                key={idx}
                className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
              >
                <div className="md:col-span-1 flex items-center justify-center">
                  <span className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/15 flex items-center justify-center font-dot text-base text-glyph-red font-bold">
                    {step.num}
                  </span>
                </div>
                <div className="md:col-span-8 space-y-2">
                  <h3 className="font-dot text-base text-white tracking-wider">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">{step.desc}</p>
                </div>
                <div className="md:col-span-3 text-left md:text-right">
                  <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300 inline-block">
                    {step.tech}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Environments Matrix */}
        <div className="space-y-6">
          <h2 className="font-dot text-sm text-zinc-400 tracking-wider">CONNECTION ENVIRONMENTS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {environments.map((env, i) => (
              <div key={i} className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">{env.name}</h3>
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${env.badge}`}>
                    {env.status}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">{env.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Packet Structure Card */}
        <div className="glass-panel-elevated rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="font-dot text-xs text-glyph-cyan tracking-wider">JSON / BINARY SCHEMA</span>
              <h3 className="text-xl font-bold text-white mt-1">Universal Control Protocol Envelope</h3>
            </div>
            <span className="text-xs font-mono text-zinc-400">SCHEMA v1.0</span>
          </div>

          <pre className="p-4 sm:p-6 rounded-2xl bg-zinc-950 font-mono text-xs text-zinc-300 overflow-x-auto border border-white/5">
{`{
  "version": "1.0",
  "type": "POINTER_MOVE",
  "sessionId": "sess_f8a92c4b81",
  "sequence": 14209,
  "timestamp": 1731718920145,
  "payload": {
    "dx": -4.25,
    "dy": 1.80,
    "pressure": 0.92,
    "isTouch": true
  }
}`}
          </pre>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-zinc-400">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <strong className="text-white block font-dot">MONOTONIC SEQUENCE</strong>
              <span>Guarantees packet order and eliminates replay attacks</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <strong className="text-white block font-dot">BOUNDED DELTAS</strong>
              <span>Restricts crazy jumps and pointer runaway errors</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <strong className="text-white block font-dot">SESSION BINDING</strong>
              <span>Tokens invalidate immediately upon disconnect</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
