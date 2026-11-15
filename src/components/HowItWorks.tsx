import React from 'react';
import { Smartphone, Laptop, Wifi, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'OPEN APPLICATION',
      desc: 'Launch GlyphPad on your phone and the lightweight receiver on your laptop or desktop. The devices immediately detect each other on the local network.',
      accent: 'border-glyph-red text-glyph-red',
    },
    {
      step: '02',
      title: 'APPROVE PAIRING',
      desc: 'Approve the one-time pairing request on your computer using a short-lived 6-digit PIN or QR code. No cloud accounts, logins, or external relays.',
      accent: 'border-glyph-cyan text-glyph-cyan',
    },
    {
      step: '03',
      title: 'INSTANT CONTROL',
      desc: 'Your phone touchscreen instantly becomes a fluid, tactile touchpad. Move the pointer, execute multi-finger gestures, or trigger system actions.',
      accent: 'border-glyph-green text-glyph-green',
    },
  ];

  return (
    <section className="py-20 sm:py-28 relative border-t border-white/5 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-mono text-xs">
            <span>ZERO SETUP COMPLEXITY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Connected in Three Simple Steps.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-sans">
            No terminal commands, no IP addresses, no ADB debugging, and no network driver hassles.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 relative hover:border-white/20 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-6">
                <span className={`w-10 h-10 rounded-xl border flex items-center justify-center font-dot text-sm font-bold ${item.accent}`}>
                  {item.step}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">STEP {idx + 1} OF 3</span>
              </div>
              <h3 className="font-dot text-base text-white tracking-wider mb-3 group-hover:text-zinc-200">{item.title}</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Visual Communication Pipeline Diagram */}
        <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-10 relative overflow-hidden">
          <div className="text-center mb-8">
            <span className="font-dot text-xs text-zinc-400 tracking-wider">UNIVERSAL CONTROL PIPELINE (UCP)</span>
            <h4 className="text-lg font-bold text-white mt-1">End-to-End Control Architecture</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center relative">
            {/* Stage 1: Mobile */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-glyph-red/20 text-glyph-red border border-glyph-red/30 mx-auto flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h5 className="font-dot text-xs text-white">MOBILE CLIENT</h5>
              <p className="text-[10px] font-mono text-zinc-400">120Hz Multi-Touch • Gesture Classifier</p>
            </div>

            {/* Stage 2: Transport */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-glyph-cyan/20 text-glyph-cyan border border-glyph-cyan/30 mx-auto flex items-center justify-center">
                <Wifi className="w-5 h-5" />
              </div>
              <h5 className="font-dot text-xs text-white">SECURE TRANSPORT</h5>
              <p className="text-[10px] font-mono text-zinc-400">Local Wi-Fi LAN / TLS 1.3 • Heartbeat</p>
            </div>

            {/* Stage 3: Desktop Receiver */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-glyph-green/20 text-glyph-green border border-glyph-green/30 mx-auto flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <h5 className="font-dot text-xs text-white">HOST RECEIVER</h5>
              <p className="text-[10px] font-mono text-zinc-400">Allowlist Check • Watchdog Releaser</p>
            </div>

            {/* Stage 4: Native Input */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-glyph-violet/20 text-glyph-violet border border-glyph-violet/30 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h5 className="font-dot text-xs text-white">NATIVE OS INPUT</h5>
              <p className="text-[10px] font-mono text-zinc-400">SendInput Win32 • CGEvent • uinput</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
