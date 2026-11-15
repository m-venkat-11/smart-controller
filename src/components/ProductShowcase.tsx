import React, { useState } from 'react';
import { MousePointer, Keyboard, HandMetal, Sliders, Volume2, Sun, Lock, Play, SkipForward, SkipBack, CheckCircle, AlertTriangle } from 'lucide-react';

export const ProductShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'touchpad' | 'keyboard' | 'gestures' | 'actions'>('touchpad');

  // Interactive states for the mini previews
  const [volume, setVolume] = useState(65);
  const [brightness, setBrightness] = useState(80);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeShortcut, setActiveShortcut] = useState<string | null>(null);
  const [showPowerModal, setShowPowerModal] = useState(false);
  const [powerCountdown, setPowerCountdown] = useState(10);

  const tabs = [
    { id: 'touchpad', label: '01. PRECISION TOUCHPAD', icon: MousePointer },
    { id: 'keyboard', label: '02. KEYBOARD & MACROS', icon: Keyboard },
    { id: 'gestures', label: '03. MULTI-TOUCH GESTURES', icon: HandMetal },
    { id: 'actions', label: '04. QUICK CONTROLS DOCK', icon: Sliders },
  ] as const;

  const triggerShortcut = (name: string) => {
    setActiveShortcut(name);
    setTimeout(() => setActiveShortcut(null), 1200);
  };

  return (
    <section className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-glyph-red/10 border border-glyph-red/20 text-glyph-red font-mono text-xs">
            <span>TACTILE HARDWARE-GRADE MODES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            One Touch. Complete Control.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-sans">
            Seamlessly pivot between precision pointer input, instant shortcut triggers, natural gestures, and host hardware controls.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl font-mono text-xs flex items-center gap-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-black font-bold shadow-lg scale-105'
                      : 'glass-panel text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Interactive Showcase Panel */}
        <div className="glass-panel-elevated rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Background Light */}
          <div className="absolute top-0 right-0 w-80 h-80 aura-red pointer-events-none opacity-20"></div>

          {/* TAB 1: PRECISION TOUCHPAD */}
          {activeTab === 'touchpad' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <span className="font-dot text-xs text-glyph-cyan tracking-wider">MODE 01 • CONTINUOUS TRACKING</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">Sub-Pixel Tactile Precision</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                  Unlike remote desktop tools that stream heavy video feeds, GlyphPad transmits tiny 16-byte differential vector packets at 120Hz. Native ballistic acceleration delivers pinpoint pixel accuracy.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-xs font-mono text-zinc-300">
                    <CheckCircle className="w-4 h-4 text-glyph-green shrink-0" />
                    <span>Non-linear acceleration with configurable curves</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-zinc-300">
                    <CheckCircle className="w-4 h-4 text-glyph-green shrink-0" />
                    <span>Natural and inverted scroll toggling</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-zinc-300">
                    <CheckCircle className="w-4 h-4 text-glyph-green shrink-0" />
                    <span>Failsafe auto-release watchdog on connection loss</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 flex justify-center">
                <div className="w-full max-w-md rounded-2xl bg-black/60 border border-white/15 p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-white/10 pb-3">
                    <span className="text-white font-dot">TRACKPAD SIMULATION</span>
                    <span className="text-glyph-green">120 Hz SAMPLING</span>
                  </div>

                  {/* Visual Touchpad Surface */}
                  <div className="h-56 rounded-xl bg-zinc-900/80 border border-white/10 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 dot-pattern opacity-40"></div>
                    <div className="w-32 h-32 rounded-full border border-glyph-cyan/30 flex items-center justify-center animate-pulse-subtle">
                      <div className="w-20 h-20 rounded-full border border-glyph-cyan/60 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-glyph-cyan/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-glyph-cyan"></div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-3 text-center">
                      <span className="font-dot text-[10px] text-zinc-400">P95 LATENCY: 3.4 MS • JITTER: 0.2 MS</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-zinc-500 block text-[10px]">TOLERANCE</span>
                      <strong className="text-white">&le; 10 DP DRIFT</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-zinc-500 block text-[10px]">TAP SETTLE</span>
                      <strong className="text-white">&le; 80 MS DELAY</strong>
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
                <span className="font-dot text-xs text-glyph-red tracking-wider">MODE 02 • LOW-LATENCY CHORDS</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">Full Keyboard & Macro Deck</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                  Execute complex operating-system key combinations without reaching for your physical keyboard. From presentation controls to task manager summoners, all key chords are capability-negotiated.
                </p>
                {activeShortcut && (
                  <div className="p-3 rounded-xl bg-glyph-red/20 border border-glyph-red text-glyph-red font-mono text-xs flex items-center gap-2 animate-in fade-in">
                    <span className="w-2 h-2 rounded-full bg-glyph-red animate-ping"></span>
                    <span>Dispatched chord: <strong>{activeShortcut}</strong></span>
                  </div>
                )}
              </div>

              <div className="lg:col-span-7 flex justify-center">
                <div className="w-full max-w-md rounded-2xl bg-black/60 border border-white/15 p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-white/10 pb-3">
                    <span className="text-white font-dot">INTERACTIVE MACRO DECK</span>
                    <span className="text-zinc-400">TAP TO TRIGGER</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { name: 'Ctrl + C', label: 'Copy' },
                      { name: 'Ctrl + V', label: 'Paste' },
                      { name: 'Win + D', label: 'Show Desktop' },
                      { name: 'Alt + Tab', label: 'Switch App' },
                      { name: 'Ctrl + Shift + Esc', label: 'Task Mgr' },
                      { name: 'Win + Shift + S', label: 'Screenshot' },
                      { name: 'Escape', label: 'Esc Key' },
                      { name: 'Win + L', label: 'Lock PC' },
                      { name: 'F5', label: 'Refresh' },
                    ].map((btn, idx) => (
                      <button
                        key={idx}
                        onClick={() => triggerShortcut(btn.name)}
                        className="p-3 rounded-xl bg-zinc-900 border border-white/10 hover:border-glyph-red hover:bg-zinc-800 active:scale-95 transition-all text-left group"
                      >
                        <span className="font-mono text-xs text-white block font-bold group-hover:text-glyph-red">{btn.name}</span>
                        <span className="text-[10px] text-zinc-500 font-sans">{btn.label}</span>
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
                <span className="font-dot text-xs text-glyph-violet tracking-wider">MODE 03 • TACTILE MULTI-TOUCH</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">Natural Fluid Gestures</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                  The integrated gesture state machine resolves touch contacts against movement and settle thresholds, distinguishing clicks from drags and two-finger scrolls cleanly.
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono text-zinc-300">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <strong className="text-white block font-dot">1-FINGER TAP</strong>
                    <span className="text-zinc-400 text-[11px]">Primary Left Click</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <strong className="text-white block font-dot">2-FINGER TAP</strong>
                    <span className="text-zinc-400 text-[11px]">Secondary Right Click</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <strong className="text-white block font-dot">2-FINGER DRAG</strong>
                    <span className="text-zinc-400 text-[11px]">Vertical / H-Scroll</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <strong className="text-white block font-dot">PINCH IN / OUT</strong>
                    <span className="text-zinc-400 text-[11px]">Ctrl + Wheel Zoom</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 flex justify-center">
                <div className="w-full max-w-md rounded-2xl bg-black/60 border border-white/15 p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-white/10 pb-3">
                    <span className="text-white font-dot">GESTURE CLASSIFIER</span>
                    <span className="text-glyph-violet">STATE READY</span>
                  </div>

                  <div className="h-56 rounded-xl bg-zinc-900/60 border border-white/10 relative flex flex-col items-center justify-center p-4">
                    <div className="flex items-center gap-6 mb-4">
                      <div className="w-12 h-12 rounded-full border-2 border-glyph-violet flex items-center justify-center text-glyph-violet font-dot text-sm animate-bounce">
                        1F
                      </div>
                      <div className="w-12 h-12 rounded-full border-2 border-glyph-cyan flex items-center justify-center text-glyph-cyan font-dot text-sm animate-pulse">
                        2F
                      </div>
                      <div className="w-12 h-12 rounded-full border-2 border-glyph-red flex items-center justify-center text-glyph-red font-dot text-sm">
                        3F
                      </div>
                    </div>
                    <p className="font-dot text-xs text-white">SETTLE WINDOW: 80 MS</p>
                    <p className="text-[10px] font-mono text-zinc-500 mt-1">Prevents false single clicks while placing second finger</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: QUICK CONTROLS DOCK */}
          {activeTab === 'actions' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <span className="font-dot text-xs text-glyph-amber tracking-wider">MODE 04 • HARDWARE TELEMETRY</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">Hardware Controls & Audio Deck</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                  Fine-tune system volume, adjust brightness, control media players, or lock your workstation. Destructive actions like Shutdown require an explicit 10-second cancellable confirmation.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setShowPowerModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-glyph-red/20 text-glyph-red border border-glyph-red/30 hover:bg-glyph-red hover:text-white font-mono text-xs font-bold transition-all flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>TEST SAFE POWER FLOW</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 flex justify-center">
                <div className="w-full max-w-md rounded-2xl bg-black/60 border border-white/15 p-6 space-y-5">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-white/10 pb-3">
                    <span className="text-white font-dot">HARDWARE SLIDERS</span>
                    <span className="text-glyph-amber">AUDIO & BRIGHTNESS</span>
                  </div>

                  {/* Volume Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400 flex items-center gap-1.5">
                        <Volume2 className="w-4 h-4 text-glyph-cyan" /> MASTER VOLUME
                      </span>
                      <span className="text-white font-dot">{volume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-full accent-glyph-cyan bg-zinc-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Brightness Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400 flex items-center gap-1.5">
                        <Sun className="w-4 h-4 text-glyph-amber" /> DISPLAY BRIGHTNESS
                      </span>
                      <span className="text-white font-dot">{brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-glyph-amber bg-zinc-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Media Controls Bar */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-500">MEDIA SESSION</span>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white">
                        <SkipBack className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-2.5 rounded-xl bg-white text-black hover:bg-zinc-200"
                      >
                        <Play className={`w-4 h-4 ${isPlaying ? 'fill-black' : ''}`} />
                      </button>
                      <button className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white">
                        <SkipForward className="w-4 h-4" />
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
          <div className="w-full max-w-sm rounded-3xl bg-zinc-950 border border-glyph-red p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-glyph-red">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
              <h4 className="font-dot text-sm text-white">DESTRUCTIVE POWER ACTION</h4>
            </div>
            <p className="text-xs text-zinc-400 font-sans">
              As required by the Master Prompt security specification, system shutdown initiates an explicit cancellable countdown to prevent accidental triggers.
            </p>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 text-center">
              <span className="text-3xl font-dot text-glyph-red">{powerCountdown} SEC</span>
              <span className="block text-[10px] font-mono text-zinc-500 mt-1">CANCEL ANYTIME TO ABORT</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPowerModal(false)}
                className="w-full py-2.5 rounded-xl bg-white text-black font-mono text-xs font-bold hover:bg-zinc-200"
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
