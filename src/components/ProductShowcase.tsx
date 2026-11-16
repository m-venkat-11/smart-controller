import React, { useState } from 'react';
import { MousePointer, Keyboard, HandMetal, Sliders, Volume2, Sun, Lock, Play, SkipForward, SkipBack, CheckCircle, AlertTriangle } from 'lucide-react';
import { DotMatrixDisplay } from './DotMatrixDisplay';

export const ProductShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'touchpad' | 'keyboard' | 'gestures' | 'actions'>('touchpad');

  const [volume, setVolume] = useState(65);
  const [brightness, setBrightness] = useState(80);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeShortcut, setActiveShortcut] = useState<string | null>(null);
  const [showPowerModal, setShowPowerModal] = useState(false);
  const [powerCountdown, setPowerCountdown] = useState(10);

  const tabs = [
    { id: 'touchpad', label: '01. PRECISION TOUCHPAD', icon: MousePointer, color: 'text-rose-400' },
    { id: 'keyboard', label: '02. KEYBOARD & MACROS', icon: Keyboard, color: 'text-cyan-400' },
    { id: 'gestures', label: '03. MULTI-TOUCH GESTURES', icon: HandMetal, color: 'text-emerald-400' },
    { id: 'actions', label: '04. QUICK CONTROLS DOCK', icon: Sliders, color: 'text-purple-400' },
  ] as const;

  const triggerShortcut = (name: string) => {
    setActiveShortcut(name);
    setTimeout(() => setActiveShortcut(null), 1200);
  };

  return (
    <section className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-dot text-xs">
            <span>TACTILE HARDWARE-GRADE MODES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            One Touch.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-cyan-400">
              Complete Control.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-sans">
            Seamlessly pivot between precision pointer input, instant shortcut triggers, natural gestures, and host hardware controls.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-2xl font-dot text-xs flex items-center gap-2.5 transition-all duration-300 ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-xl scale-105'
                      : 'glass-panel text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : tab.color}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Interactive Showcase Panel with Radiant Styling */}
        <div className="card-radiant-pink rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* TAB 1: PRECISION TOUCHPAD */}
          {activeTab === 'touchpad' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <span className="font-dot text-xs text-rose-300 tracking-wider">MODE 01 • CONTINUOUS TRACKING</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">Sub-Pixel Tactile Precision</h3>
                <p className="text-sm text-rose-100/80 leading-relaxed font-sans">
                  Unlike remote desktop tools that stream heavy video feeds, GlyphPad transmits tiny 16-byte differential vector packets at 120Hz. Native ballistic acceleration delivers pinpoint pixel accuracy.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-xs font-mono text-zinc-200">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Non-linear acceleration with configurable curves</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-zinc-200">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Natural and inverted scroll toggling</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-zinc-200">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Failsafe auto-release watchdog on connection loss</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 flex justify-center">
                <div className="w-full max-w-md rounded-3xl bg-black/50 border border-white/15 p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-300 border-b border-white/10 pb-3">
                    <span className="text-white font-dot">TRACKPAD TELEMETRY</span>
                    <span className="text-emerald-400 font-dot">120 HZ SAMPLING</span>
                  </div>

                  {/* Visual Touchpad Surface */}
                  <div className="h-56 rounded-2xl bg-zinc-900/60 border border-white/10 relative flex flex-col items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 dot-pattern opacity-40"></div>
                    <div className="w-28 h-28 rounded-full border border-rose-400/40 flex items-center justify-center animate-pulse-subtle">
                      <div className="w-16 h-16 rounded-full border border-rose-400/60 flex items-center justify-center">
                        <DotMatrixDisplay value="18" size="sm" color="#FFFFFF" />
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <span className="font-dot text-[11px] text-zinc-300">P95 LATENCY: 04 MS</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-zinc-400 block text-[10px]">TOLERANCE</span>
                      <strong className="text-white font-dot">&le; 10 DP</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-zinc-400 block text-[10px]">SETTLE WINDOW</span>
                      <strong className="text-white font-dot">&le; 80 MS</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KEYBOARD & MACROS */}
          {activeTab === 'keyboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <span className="font-dot text-xs text-cyan-300 tracking-wider">MODE 02 • LOW-LATENCY CHORDS</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">Full Keyboard & Macro Deck</h3>
                <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                  Execute complex operating-system key combinations without reaching for your physical keyboard. From presentation controls to task manager summoners, all key chords are capability-negotiated.
                </p>
                {activeShortcut && (
                  <div className="p-3 rounded-xl bg-white/15 border border-white/30 text-white font-mono text-xs flex items-center gap-2 animate-in fade-in">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Dispatched chord: <strong>{activeShortcut}</strong></span>
                  </div>
                )}
              </div>

              <div className="lg:col-span-7 flex justify-center">
                <div className="w-full max-w-md rounded-3xl bg-black/50 border border-white/15 p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-300 border-b border-white/10 pb-3">
                    <span className="text-white font-dot">INTERACTIVE MACRO DECK</span>
                    <span className="text-zinc-400 font-dot">TAP TO DISPATCH</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { name: 'Ctrl + C', label: 'Copy' },
                      { name: 'Ctrl + V', label: 'Paste' },
                      { name: 'Win + D', label: 'Desktop' },
                      { name: 'Alt + Tab', label: 'App Switch' },
                      { name: 'Ctrl+Shift+Esc', label: 'Task Mgr' },
                      { name: 'Win+Shift+S', label: 'Snip' },
                      { name: 'Escape', label: 'Esc Key' },
                      { name: 'Win + L', label: 'Lock PC' },
                      { name: 'F5', label: 'Refresh' },
                    ].map((btn, idx) => (
                      <button
                        key={idx}
                        onClick={() => triggerShortcut(btn.name)}
                        className="p-3 rounded-2xl bg-zinc-900/80 border border-white/10 hover:border-white/30 active:scale-95 transition-all text-left group"
                      >
                        <span className="font-dot text-xs text-white block font-bold group-hover:text-amber-300">{btn.name}</span>
                        <span className="text-[10px] text-zinc-400 font-sans">{btn.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MULTI-TOUCH GESTURES */}
          {activeTab === 'gestures' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <span className="font-dot text-xs text-emerald-300 tracking-wider">MODE 03 • TACTILE MULTI-TOUCH</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">Natural Fluid Gestures</h3>
                <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                  The integrated gesture state machine resolves touch contacts against movement and settle thresholds, distinguishing clicks from drags and two-finger scrolls cleanly.
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono text-zinc-200">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                    <strong className="text-white block font-dot">1-FINGER TAP</strong>
                    <span className="text-zinc-400 text-[11px]">Primary Left Click</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                    <strong className="text-white block font-dot">2-FINGER TAP</strong>
                    <span className="text-zinc-400 text-[11px]">Secondary Right Click</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                    <strong className="text-white block font-dot">2-FINGER DRAG</strong>
                    <span className="text-zinc-400 text-[11px]">Vertical / H-Scroll</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                    <strong className="text-white block font-dot">PINCH IN / OUT</strong>
                    <span className="text-zinc-400 text-[11px]">Ctrl + Wheel Zoom</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 flex justify-center">
                <div className="w-full max-w-md rounded-3xl bg-black/50 border border-white/15 p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-300 border-b border-white/10 pb-3">
                    <span className="text-white font-dot">GESTURE CLASSIFIER</span>
                    <span className="text-emerald-400 font-dot">SETTLED</span>
                  </div>

                  <div className="h-56 rounded-2xl bg-zinc-900/60 border border-white/10 relative flex flex-col items-center justify-center p-4">
                    <div className="flex items-center gap-6 mb-4">
                      <div className="w-12 h-12 rounded-full border-2 border-emerald-400 flex items-center justify-center text-emerald-300 font-dot text-sm animate-bounce">
                        1F
                      </div>
                      <div className="w-12 h-12 rounded-full border-2 border-cyan-400 flex items-center justify-center text-cyan-300 font-dot text-sm animate-pulse">
                        2F
                      </div>
                      <div className="w-12 h-12 rounded-full border-2 border-pink-400 flex items-center justify-center text-pink-300 font-dot text-sm">
                        3F
                      </div>
                    </div>
                    <p className="font-dot text-xs text-white">SETTLE WINDOW: 80 MS</p>
                    <p className="text-[10px] font-mono text-zinc-400 mt-1">Prevents false single clicks while placing second finger</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: QUICK CONTROLS DOCK */}
          {activeTab === 'actions' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <span className="font-dot text-xs text-purple-300 tracking-wider">MODE 04 • HARDWARE TELEMETRY</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">Hardware Controls & Audio Deck</h3>
                <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                  Fine-tune system volume, adjust brightness, control media players, or lock your workstation. Destructive actions like Shutdown require an explicit 10-second cancellable confirmation.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setShowPowerModal(true)}
                    className="px-4 py-2.5 rounded-2xl bg-rose-600/30 text-rose-300 border border-rose-500/40 hover:bg-rose-600 hover:text-white font-dot text-xs font-bold transition-all flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>TEST SAFE POWER FLOW</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 flex justify-center">
                <div className="w-full max-w-md rounded-3xl bg-black/50 border border-white/15 p-6 space-y-5">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-300 border-b border-white/10 pb-3">
                    <span className="text-white font-dot">HARDWARE SLIDERS</span>
                    <span className="text-amber-300 font-dot">AUDIO & BRIGHTNESS</span>
                  </div>

                  {/* Volume Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-300 flex items-center gap-1.5">
                        <Volume2 className="w-4 h-4 text-cyan-400" /> MASTER VOLUME
                      </span>
                      <DotMatrixDisplay value={volume} size="sm" color="#FFFFFF" />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-full accent-cyan-400 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Brightness Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-300 flex items-center gap-1.5">
                        <Sun className="w-4 h-4 text-amber-300" /> DISPLAY BRIGHTNESS
                      </span>
                      <DotMatrixDisplay value={brightness} size="sm" color="#FFFFFF" />
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-amber-300 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Media Controls Bar */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">MEDIA SESSION</span>
                    <div className="flex items-center gap-2">
                      <button className="nothing-btn-circle w-8 h-8">
                        <SkipBack className="w-3.5 h-3.5 text-zinc-300" />
                      </button>
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-colors"
                      >
                        <Play className={`w-3.5 h-3.5 ${isPlaying ? 'fill-black' : ''}`} />
                      </button>
                      <button className="nothing-btn-circle w-8 h-8">
                        <SkipForward className="w-3.5 h-3.5 text-zinc-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Safe Power Countdown Modal */}
      {showPowerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-zinc-950 border border-rose-500 p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-500">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
              <h4 className="font-dot text-sm text-white">DESTRUCTIVE POWER ACTION</h4>
            </div>
            <p className="text-xs text-zinc-400 font-sans">
              As required by the Master Prompt security specification, system shutdown initiates an explicit cancellable countdown to prevent accidental triggers.
            </p>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 text-center">
              <DotMatrixDisplay value={powerCountdown} size="lg" color="#e11d48" />
              <span className="block text-[10px] font-mono text-zinc-500 mt-2">CANCEL ANYTIME TO ABORT</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPowerModal(false)}
                className="w-full py-2.5 rounded-xl bg-white text-black font-dot text-xs font-bold hover:bg-zinc-200"
              >
                ABORT / CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
