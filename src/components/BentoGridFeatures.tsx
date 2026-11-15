import React from 'react';
import { MousePointer, HandMetal, Keyboard, ShieldCheck, Wifi, Radio, Sliders, Presentation, Monitor, ShieldAlert } from 'lucide-react';

export const BentoGridFeatures: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-mono text-xs">
            <span>MODULAR ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Everything You Need. Nothing You Don&apos;t.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-sans">
            Engineered from first principles with zero extraneous baggage. Every module is purpose-built for low-latency tactile control.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Card 1: Precision Touchpad (Large 2 Cols) */}
          <div className="md:col-span-2 glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden group hover:border-glyph-red/50 transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 aura-red pointer-events-none opacity-20"></div>
            <div className="flex items-center justify-between pb-6">
              <div className="p-3 rounded-2xl bg-glyph-red/10 border border-glyph-red/20 text-glyph-red">
                <MousePointer className="w-6 h-6" />
              </div>
              <span className="font-dot text-xs text-zinc-500">FEATURE 01</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Ballistic Precision Touchpad</h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-sans mb-6">
              Sub-pixel vector streaming with non-linear ballistic curves. Your finger movements map to the computer screen with natural acceleration and zero jitter.
            </p>

            {/* Visual Dial Illustration */}
            <div className="h-40 rounded-2xl bg-zinc-950/80 border border-white/10 flex items-center justify-around p-4 relative overflow-hidden">
              <div className="absolute inset-0 dot-pattern opacity-30"></div>
              <div className="relative w-24 h-24 rounded-full border border-white/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-glyph-red/40 flex items-center justify-center animate-spin" style={{ animationDuration: '12s' }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-glyph-red -translate-y-8"></div>
                </div>
                <span className="font-dot text-[11px] text-white">120 Hz</span>
              </div>
              <div className="space-y-1 font-mono text-xs">
                <div className="text-zinc-500">ACCEL: <span className="text-white">QUADRATIC</span></div>
                <div className="text-zinc-500">DRIFT TOL: <span className="text-glyph-green">&le; 10 DP</span></div>
                <div className="text-zinc-500">WATCHDOG: <span className="text-glyph-cyan">ACTIVE</span></div>
              </div>
            </div>
          </div>

          {/* Card 2: Multi-Touch Gestures (1 Col) */}
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden hover:border-glyph-violet/50 transition-all duration-300">
            <div className="p-3 rounded-2xl bg-glyph-violet/10 border border-glyph-violet/20 text-glyph-violet w-fit mb-6">
              <HandMetal className="w-6 h-6" />
            </div>
            <span className="font-dot text-xs text-zinc-500 block mb-2">FEATURE 02</span>
            <h3 className="text-lg font-bold text-white mb-2">Tactile Gestures</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-4">
              Two-finger scrolling, pinch zoom, tap-to-click, and three-finger window cycling with an 80ms settle threshold.
            </p>
            <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 font-mono text-[11px] text-zinc-400 space-y-1">
              <div className="flex justify-between"><span>Tap:</span> <strong className="text-white">L-Click</strong></div>
              <div className="flex justify-between"><span>2F Tap:</span> <strong className="text-white">R-Click</strong></div>
              <div className="flex justify-between"><span>2F Drag:</span> <strong className="text-white">Smooth Scroll</strong></div>
            </div>
          </div>

          {/* Card 3: Cryptographic Pairing (1 Col) */}
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden hover:border-glyph-green/50 transition-all duration-300">
            <div className="p-3 rounded-2xl bg-glyph-green/10 border border-glyph-green/20 text-glyph-green w-fit mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-dot text-xs text-zinc-500 block mb-2">FEATURE 03</span>
            <h3 className="text-lg font-bold text-white mb-2">Cryptographic Trust</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-4">
              Local Wi-Fi presence alone never grants input access. Pairing requires explicit host authorization via short-lived PIN or QR code.
            </p>
            <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 text-center font-dot text-sm text-glyph-green tracking-widest">
              PIN: 742-891
            </div>
          </div>

          {/* Card 4: Keyboard & Chords (1 Col) */}
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden hover:border-glyph-cyan/50 transition-all duration-300">
            <div className="p-3 rounded-2xl bg-glyph-cyan/10 border border-glyph-cyan/20 text-glyph-cyan w-fit mb-6">
              <Keyboard className="w-6 h-6" />
            </div>
            <span className="font-dot text-xs text-zinc-500 block mb-2">FEATURE 04</span>
            <h3 className="text-lg font-bold text-white mb-2">Keyboard & Chords</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-4">
              Trigger Ctrl, Alt, Shift, and Windows/Command key sequences with single-tap macro pads.
            </p>
            <div className="flex items-center gap-2 font-mono text-xs text-white">
              <span className="px-2 py-1 rounded bg-white/10 border border-white/10">Win+D</span>
              <span className="px-2 py-1 rounded bg-white/10 border border-white/10">Alt+Tab</span>
              <span className="px-2 py-1 rounded bg-white/10 border border-white/10">Esc</span>
            </div>
          </div>

          {/* Card 5: Universal Connectivity (Large 2 Cols) */}
          <div className="md:col-span-2 glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden hover:border-white/30 transition-all duration-300">
            <div className="flex items-center justify-between pb-6">
              <div className="p-3 rounded-2xl bg-white/10 border border-white/20 text-white">
                <Wifi className="w-6 h-6" />
              </div>
              <span className="font-dot text-xs text-zinc-500">FEATURE 05</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Multi-Transport Connection Engine</h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-sans mb-6">
              Adaptive failover protocol. Connect over local 2.4/5GHz Wi-Fi, direct mobile hotspot, or optional Bluetooth HID on supported hardware.
            </p>
            <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
              <div className="p-3 rounded-xl bg-zinc-900 border border-white/10">
                <span className="text-glyph-green block font-bold">PRIMARY</span>
                <span className="text-white mt-1 block">Local Wi-Fi LAN</span>
                <span className="text-zinc-500 text-[10px]">P95 &lt; 4ms</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-white/10">
                <span className="text-glyph-cyan block font-bold">FALLBACK</span>
                <span className="text-white mt-1 block">Phone Hotspot</span>
                <span className="text-zinc-500 text-[10px]">Zero Router</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-white/10">
                <span className="text-zinc-400 block font-bold">OPTIONAL</span>
                <span className="text-white mt-1 block">Bluetooth HID</span>
                <span className="text-zinc-500 text-[10px]">Receiver-Free</span>
              </div>
            </div>
          </div>

          {/* Card 6: Presentation Mode (1 Col) */}
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden hover:border-glyph-amber/50 transition-all duration-300">
            <div className="p-3 rounded-2xl bg-glyph-amber/10 border border-glyph-amber/20 text-glyph-amber w-fit mb-6">
              <Presentation className="w-6 h-6" />
            </div>
            <span className="font-dot text-xs text-zinc-500 block mb-2">FEATURE 06</span>
            <h3 className="text-lg font-bold text-white mb-2">Presentation Deck</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-4">
              Slide advance controls, presentation timer ticker, and high-visibility laser dot cursor mode.
            </p>
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="text-white font-dot">TIMER: 18:45</span>
              <span className="px-2 py-0.5 rounded bg-glyph-amber/20 text-glyph-amber text-[10px]">LIVE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
