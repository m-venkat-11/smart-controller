import React from 'react';
import { MousePointer, HandMetal, Keyboard, ShieldCheck, Wifi, Sliders, Presentation, Sparkles, Activity } from 'lucide-react';
import { DotMatrixDisplay } from './DotMatrixDisplay';

export const BentoGridFeatures: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-dot text-xs">
            <span>NOTHING OS MINIMALISM • RADIANT MODULAR BENTO</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Everything You Need.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-rose-400">
              Nothing You Don&apos;t.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-sans">
            Engineered with the glowing jewel tones of modern glassmorphism and the tactile discipline of Nothing OS.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Precision Touchpad (Radiant Pink - 2 Cols) */}
          <div className="md:col-span-2 card-radiant-pink rounded-3xl p-6 sm:p-8 flex flex-col justify-between group transition-all duration-300">
            <div>
              <div className="flex items-center justify-between pb-6">
                <div className="p-3 rounded-2xl bg-white/10 border border-white/20 text-rose-200">
                  <MousePointer className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 font-dot text-xs text-rose-300">
                  <span>SAMPLING</span>
                  <DotMatrixDisplay value="120" size="sm" color="#FFFFFF" />
                  <span>HZ</span>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Ballistic Vector Touchpad</h3>
              <p className="text-sm text-rose-100/80 leading-relaxed font-sans mb-6">
                Sub-pixel differential vector streaming with non-linear ballistic acceleration. Feel the zero-lag responsiveness across large 4K monitors.
              </p>
            </div>

            {/* Visual Dial Illustration */}
            <div className="h-36 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-around p-4 relative overflow-hidden">
              <div className="absolute inset-0 dot-pattern opacity-30"></div>
              <div className="relative w-20 h-20 rounded-full border border-rose-400/40 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center animate-spin" style={{ animationDuration: '10s' }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-300 -translate-y-7 shadow-[0_0_8px_rgba(252,211,77,0.8)]"></div>
                </div>
                <DotMatrixDisplay value="04" size="sm" color="#FFFFFF" />
              </div>
              <div className="space-y-1 font-mono text-xs">
                <div className="text-rose-200">ACCEL: <span className="text-white font-dot">QUADRATIC</span></div>
                <div className="text-rose-200">DRIFT: <span className="text-amber-300 font-dot">&le; 10 DP</span></div>
                <div className="text-rose-200">WATCHDOG: <span className="text-emerald-400 font-dot">ACTIVE</span></div>
              </div>
            </div>
          </div>

          {/* Card 2: Emerald Mint (Multi-Touch Gestures - 1 Col) */}
          <div className="card-radiant-green rounded-3xl p-6 sm:p-8 flex flex-col justify-between group transition-all duration-300">
            <div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/20 text-emerald-200 w-fit mb-6">
                <HandMetal className="w-6 h-6" />
              </div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-white">Tactile Gestures</h3>
                <DotMatrixDisplay value="24" size="sm" color="#FFFFFF" />
              </div>
              <p className="text-xs text-emerald-100/80 leading-relaxed font-sans mb-4">
                Two-finger scrolling, pinch zoom, tap-to-click, and three-finger window cycling with an 80ms settle threshold.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-[11px] text-emerald-200 space-y-1">
              <div className="flex justify-between"><span>1F Tap:</span> <strong className="text-white">Left Click</strong></div>
              <div className="flex justify-between"><span>2F Tap:</span> <strong className="text-white">Right Click</strong></div>
              <div className="flex justify-between"><span>2F Drag:</span> <strong className="text-white">Smooth Scroll</strong></div>
            </div>
          </div>

          {/* Card 3: Deep Ocean Cobalt (Cryptographic Pairing - 1 Col) */}
          <div className="card-radiant-blue rounded-3xl p-6 sm:p-8 flex flex-col justify-between group transition-all duration-300">
            <div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/20 text-blue-200 w-fit mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-white">Cryptographic Trust</h3>
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              </div>
              <p className="text-xs text-blue-100/80 leading-relaxed font-sans mb-4">
                Local Wi-Fi presence alone never grants input access. Pairing requires explicit host authorization via short-lived numeric PIN.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center space-y-1">
              <span className="text-[9px] font-mono text-blue-300 block">ONE-TIME PAIRING PIN</span>
              <DotMatrixDisplay value="842" size="md" color="#FFFFFF" />
            </div>
          </div>

          {/* Card 4: Arc Cyan (Keyboard & Macro Deck - 1 Col) */}
          <div className="card-radiant-cyan rounded-3xl p-6 sm:p-8 flex flex-col justify-between group transition-all duration-300">
            <div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/20 text-cyan-200 w-fit mb-6">
                <Keyboard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Keyboard Deck</h3>
              <p className="text-xs text-cyan-100/80 leading-relaxed font-sans mb-4">
                Trigger Ctrl, Alt, Shift, and Windows/Command key combinations with single-tap macro pads.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-white">
              <span className="px-2 py-1 rounded-lg bg-black/40 border border-white/15">Win+D</span>
              <span className="px-2 py-1 rounded-lg bg-black/40 border border-white/15">Alt+Tab</span>
              <span className="px-2 py-1 rounded-lg bg-black/40 border border-white/15">Esc</span>
            </div>
          </div>

          {/* Card 5: Royal Purple (Universal Multi-Transport - 2 Cols) */}
          <div className="md:col-span-2 card-radiant-purple rounded-3xl p-6 sm:p-8 flex flex-col justify-between group transition-all duration-300">
            <div>
              <div className="flex items-center justify-between pb-6">
                <div className="p-3 rounded-2xl bg-white/10 border border-white/20 text-purple-200">
                  <Wifi className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 font-dot text-xs text-purple-200">
                  <span>LINK</span>
                  <DotMatrixDisplay value="100" size="sm" color="#FFFFFF" />
                  <span>%</span>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Multi-Transport Connection Engine</h3>
              <p className="text-sm text-purple-100/80 leading-relaxed font-sans mb-6">
                Adaptive failover protocol. Connect over local 2.4/5GHz Wi-Fi, direct phone hotspot without a router, or Bluetooth HID on supported hardware.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-emerald-400 block font-bold font-dot">PRIMARY</span>
                <span className="text-white mt-1 block">Local Wi-Fi LAN</span>
                <span className="text-purple-300 text-[10px]">P95 &lt; 4ms</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-cyan-400 block font-bold font-dot">HOTSPOT</span>
                <span className="text-white mt-1 block">Phone Tether</span>
                <span className="text-purple-300 text-[10px]">Zero Router</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-pink-400 block font-bold font-dot">BLUETOOTH</span>
                <span className="text-white mt-1 block">HID Device</span>
                <span className="text-purple-300 text-[10px]">Receiver-Free</span>
              </div>
            </div>
          </div>

          {/* Card 6: Wine Crimson (Presentation Remote - 1 Col) */}
          <div className="card-radiant-wine rounded-3xl p-6 sm:p-8 flex flex-col justify-between group transition-all duration-300">
            <div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/20 text-red-200 w-fit mb-6">
                <Presentation className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Presentation Remote</h3>
              <p className="text-xs text-red-100/80 leading-relaxed font-sans mb-4">
                Slide advance controls, presentation timer ticker, and high-visibility laser dot cursor mode.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-red-200">TIMER:</span>
              <DotMatrixDisplay value="18" size="sm" color="#FFFFFF" />
              <span className="px-2 py-0.5 rounded bg-amber-400 text-black font-dot text-[9px] font-bold">LIVE</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
