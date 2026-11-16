import React, { useState, useRef } from 'react';
import { ArrowRight, Smartphone, Laptop, Wifi, ShieldCheck, Zap, Activity, Radio, Sparkles, Sliders, Volume2, Power, Plus, ChevronLeft, Settings } from 'lucide-react';
import { DotMatrixDisplay } from './DotMatrixDisplay';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [lastClick, setLastClick] = useState<string | null>(null);
  const [packetCount, setPacketCount] = useState(148);
  const [simulatedLatency, setSimulatedLatency] = useState(18);

  const padRef = useRef<HTMLDivElement>(null);

  const handlePadMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));
    setCursorPos({ x, y });
    setPacketCount((p) => p + 1);
    setSimulatedLatency(Math.floor(16 + Math.random() * 4));
  };

  const handlePadClick = (type: string) => {
    setLastClick(type);
    setPacketCount((p) => p + 2);
    setTimeout(() => setLastClick(null), 800);
  };

  return (
    <section className="relative pt-10 pb-20 sm:pt-16 sm:pb-32 overflow-hidden">
      {/* Radiant ambient colored auras matching Reference 2 */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] aura-pink pointer-events-none opacity-25 blur-3xl"></div>
      <div className="absolute top-40 right-1/4 w-[500px] h-[500px] aura-cyan pointer-events-none opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 left-1/3 w-[450px] h-[450px] aura-green pointer-events-none opacity-20 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Top Nothing Dot Pill */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#121417] border border-white/15 text-xs font-dot backdrop-blur-md shadow-lg">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aura-pink opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-aura-pink"></span>
            </span>
            <span className="text-white tracking-widest">GLYPHPAD (1) • RADIANT CONTROL SURFACE</span>
            <span className="text-zinc-500">•</span>
            <span className="text-aura-green flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-aura-green"></span> 120 HZ
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Your Phone.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300">
              Your Touchpad.
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-zinc-300 max-w-2xl mx-auto font-sans leading-relaxed">
            Turn your smartphone into a high-precision, zero-latency wireless touchpad with Nothing-inspired dot matrix typography and radiant tactile glassmorphism.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('playground')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-dot text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-[0_0_35px_-5px_rgba(225,29,72,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>TEST LIVE SANDBOX</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('how-it-works')}
              className="px-6 py-3.5 rounded-2xl glass-panel-elevated hover:bg-white/10 text-white font-dot text-xs sm:text-sm border border-white/15 transition-all duration-300"
            >
              HOW IT WORKS
            </button>

            <button
              onClick={() => onNavigate('download')}
              className="px-5 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white font-dot text-xs sm:text-sm border border-white/10 transition-colors"
            >
              DOWNLOAD RECEIVER
            </button>
          </div>
        </div>

        {/* =========================================================================
            THE 3 RADIANT PHONE CONTROLLERS (Direct Match to User Reference 2 Image!)
           ========================================================================= */}
        <div className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
            
            {/* -------------------------------------------------------------
                PHONE 1: SYSTEM SENSORS & TACTILE METRICS (LEFT)
               ------------------------------------------------------------- */}
            <div className="w-full max-w-[340px] mx-auto rounded-[44px] bg-[#0c0d10] p-4 border-[5px] border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative flex flex-col gap-3">
              {/* Speaker Notch */}
              <div className="w-24 h-4 bg-zinc-900 rounded-full mx-auto mb-1 flex items-center justify-center">
                <div className="w-3 h-1 bg-zinc-700 rounded-full"></div>
              </div>

              {/* Status Header */}
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono text-zinc-400">Response Latency History</span>
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <DotMatrixDisplay value="28" size="md" color="#FFFFFF" />
                    <span className="text-xs font-mono text-zinc-400">ms</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DotMatrixDisplay value="1.8" size="md" color="#FFFFFF" />
                    <span className="text-xs font-mono text-zinc-400">k/s</span>
                  </div>
                </div>
              </div>

              {/* Mock Airflow/Trackpad Outline */}
              <div className="h-20 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 dot-pattern opacity-20"></div>
                <div className="w-36 h-10 rounded-lg bg-zinc-800/60 border border-white/10 flex items-center justify-center">
                  <span className="font-dot text-[10px] text-zinc-400 tracking-widest">GLYPH SURFACE</span>
                </div>
                {/* Airflow waves */}
                <div className="absolute bottom-1 flex gap-1.5 opacity-30">
                  <span className="w-1 h-3 bg-white rounded-full"></span>
                  <span className="w-1 h-4 bg-white rounded-full"></span>
                  <span className="w-1 h-3 bg-white rounded-full"></span>
                </div>
              </div>

              {/* Radiant Card 1: Emerald Mint (Temperature / Tracking Rate) */}
              <div className="card-radiant-green rounded-3xl p-4 space-y-2 relative overflow-hidden">
                <div className="flex justify-between items-center text-[10px] font-mono text-emerald-200">
                  <span>Tracking Resolution</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <DotMatrixDisplay value="24" size="xl" color="#FFFFFF" />
                    <span className="block text-[9px] font-mono text-emerald-300/80">sub-pixel delta</span>
                  </div>
                  {/* Equalizer Frequency Graphic with Yellow Pointer */}
                  <div className="flex items-center gap-1 h-10 relative">
                    {[12, 18, 26, 32, 22, 14, 8].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1 rounded-full ${i === 3 ? 'bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.8)]' : 'bg-emerald-400/40'}`}
                        style={{ height: `${h}px` }}
                      ></span>
                    ))}
                    {/* Yellow Arrow Cursor */}
                    <div className="w-0 h-0 border-y-4 border-y-transparent border-l-6 border-l-amber-300 ml-1"></div>
                  </div>
                </div>
              </div>

              {/* 2-Column Split: Radiant Blue & Radiant Berry Cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Radiant Blue Card (Energy / Packets) */}
                <div className="card-radiant-blue rounded-3xl p-3.5 space-y-2">
                  <span className="text-[10px] font-mono text-blue-200">Packets Emitted</span>
                  <div className="flex items-baseline gap-1">
                    <DotMatrixDisplay value="45" size="lg" color="#FFFFFF" />
                    <span className="text-[10px] font-mono text-blue-300">k</span>
                  </div>
                  {/* Mini Bar Spectrum */}
                  <div className="flex items-end gap-1 h-7 pt-1">
                    {[6, 12, 18, 24, 16, 10].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1.5 rounded-full ${i === 3 ? 'bg-amber-300' : 'bg-blue-400/50'}`}
                        style={{ height: `${h}px` }}
                      ></span>
                    ))}
                  </div>
                </div>

                {/* Radiant Berry Magenta Card (Comfort / Precision) */}
                <div className="card-radiant-magenta rounded-3xl p-3.5 space-y-2">
                  <span className="text-[10px] font-mono text-pink-200">Gesture Accuracy</span>
                  <div className="flex items-center justify-between">
                    <DotMatrixDisplay value="32" size="lg" color="#FFFFFF" />
                    <span className="text-xs font-mono text-pink-300">%</span>
                  </div>
                  {/* Circular Dotted Gauge with Yellow Arc Notch */}
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-pink-400/40 mx-auto flex items-center justify-center relative">
                    <div className="w-2 h-2 rounded-full bg-amber-300 absolute -top-1 right-2 shadow-[0_0_6px_rgba(252,211,77,0.8)]"></div>
                    <span className="text-[8px] font-mono text-pink-300">120Hz</span>
                  </div>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------
                PHONE 2: CENTER HERO PHONE (LARGE ROSE PINK RADIANT CARD)
               ------------------------------------------------------------- */}
            <div className="w-full max-w-[360px] mx-auto rounded-[48px] bg-[#0c0d10] p-4 sm:p-5 border-[5px] border-zinc-700 shadow-[0_25px_70px_rgba(225,29,72,0.4)] relative flex flex-col gap-3 scale-105 z-20">
              {/* Speaker Notch */}
              <div className="w-28 h-4 bg-zinc-900 rounded-full mx-auto mb-1 flex items-center justify-center">
                <div className="w-3.5 h-1 bg-zinc-700 rounded-full"></div>
              </div>

              {/* Phone Header Bar */}
              <div className="flex items-center justify-between px-2 pt-1">
                <button className="nothing-btn-circle w-8 h-8">
                  <ChevronLeft className="w-4 h-4 text-zinc-300" />
                </button>
                <span className="font-dot text-xs text-white tracking-widest">CONTROL SURFACE</span>
                <button className="nothing-btn-circle w-8 h-8">
                  <Settings className="w-3.5 h-3.5 text-zinc-300" />
                </button>
              </div>

              {/* HUGE RADIANT PINK / ROSE CARD (Direct match to center phone in image!) */}
              <div className="card-radiant-pink rounded-[32px] p-5 sm:p-6 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs font-mono text-rose-200">
                  <span className="font-dot tracking-wider">TOUCHPAD SAMPLING</span>
                  <span className="w-2 h-2 rounded-full bg-aura-pink animate-pulse"></span>
                </div>

                {/* GIANT DOTTED LED NUMBERS */}
                <div className="text-center py-2 space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <DotMatrixDisplay value={simulatedLatency} size="2xl" color="#FFFFFF" />
                    <span className="text-sm font-mono text-rose-200 self-end pb-2">ms</span>
                  </div>
                  <span className="text-[10px] font-mono text-rose-200/80 tracking-widest block">
                    P95 ROUND-TRIP LATENCY
                  </span>
                </div>

                {/* Vertical Equalizer Spectrum with Glowing Yellow Center Peak */}
                <div className="flex items-end justify-center gap-1.5 h-16 py-2">
                  {[8, 12, 16, 22, 30, 42, 56, 42, 30, 22, 16, 12, 8].map((val, idx) => {
                    const isPeak = idx === 6;
                    return (
                      <span
                        key={idx}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          isPeak
                            ? 'bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.9)] w-1.5'
                            : 'bg-rose-300/40'
                        }`}
                        style={{ height: `${val}px` }}
                      ></span>
                    );
                  })}
                </div>

                {/* Interactive Touchpad Zone */}
                <div
                  ref={padRef}
                  onMouseMove={handlePadMouseMove}
                  onClick={() => handlePadClick('PRIMARY CLICK')}
                  className="rounded-2xl bg-black/40 border border-white/10 p-3 text-center cursor-crosshair hover:border-white/30 transition-all select-none relative"
                >
                  <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none"></div>
                  <p className="font-dot text-[11px] text-white">DRAG TO MOVE CURSOR</p>
                  <p className="text-[9px] font-mono text-rose-200/70 mt-0.5">Sub-millisecond direct PC control</p>
                  {lastClick && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-400 text-black font-dot text-[9px] font-bold animate-bounce">
                      {lastClick}
                    </span>
                  )}
                </div>

                {/* Capsule Time / Channel Pill with Tactile + Button */}
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                      <span>CH-01: 5.0 GHz</span>
                    </div>
                    <div className="flex items-center gap-2 text-rose-300">
                      <span className="w-2 h-2 rounded-full bg-aura-pink"></span>
                      <span>SEC: TLS 1.3</span>
                    </div>
                  </div>

                  {/* Circular Dial with Plus */}
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Bottom Pill Action */}
                <div className="flex items-center gap-2 pt-1">
                  <button className="flex-1 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-dot text-xs tracking-wider transition-colors border border-white/15">
                    LOCK ACTIVE PAD
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:bg-zinc-200 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------
                PHONE 3: POWER STATUS & ARC GAUGES (RIGHT)
               ------------------------------------------------------------- */}
            <div className="w-full max-w-[340px] mx-auto rounded-[44px] bg-[#0c0d10] p-4 border-[5px] border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative flex flex-col gap-3">
              {/* Speaker Notch */}
              <div className="w-24 h-4 bg-zinc-900 rounded-full mx-auto mb-1 flex items-center justify-center">
                <div className="w-3 h-1 bg-zinc-700 rounded-full"></div>
              </div>

              {/* Status Header */}
              <div className="flex items-center justify-between px-2 pt-1">
                <button className="nothing-btn-circle w-8 h-8">
                  <ChevronLeft className="w-4 h-4 text-zinc-300" />
                </button>
                <span className="font-dot text-xs text-white tracking-widest">OVERVIEW</span>
                <button className="nothing-btn-circle w-8 h-8">
                  <Settings className="w-3.5 h-3.5 text-zinc-300" />
                </button>
              </div>

              {/* Radiant Card 3: Power Status with Gradient Arc Gauge */}
              <div className="card-radiant-cyan rounded-3xl p-4 space-y-3">
                <div className="flex justify-between items-center text-[10px] font-mono text-cyan-200">
                  <span>Host Connection Status</span>
                  <span className="text-zinc-400">ONLINE</span>
                </div>

                {/* Multi-Color Gradient Arc Meter */}
                <div className="relative flex flex-col items-center justify-center pt-2 pb-1">
                  <svg className="w-44 h-24" viewBox="0 0 160 85">
                    {/* Background Arc Track */}
                    <path
                      d="M 15 75 A 65 65 0 0 1 145 75"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    {/* Colored Radiant Gradient Arc */}
                    <defs>
                      <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="60%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 15 75 A 65 65 0 0 1 145 75"
                      fill="none"
                      stroke="url(#arcGrad)"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    {/* Glowing White Indicator Bead */}
                    <circle cx="122" cy="32" r="6" fill="#FFFFFF" filter="drop-shadow(0 0 4px rgba(255,255,255,0.9))" />
                  </svg>

                  {/* Dotted Value in center of arc */}
                  <div className="text-center -mt-6 space-y-0.5">
                    <DotMatrixDisplay value="18" size="lg" color="#FFFFFF" />
                    <span className="text-[10px] font-mono text-cyan-200 block">Host Link: 100%</span>
                  </div>
                </div>
              </div>

              {/* 2-Column Split: Olive Lime & Deep Wine Humidity Cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Lime Olive Card (Air Quality / Signal) */}
                <div className="card-radiant-lime rounded-3xl p-3.5 space-y-2">
                  <span className="text-[10px] font-mono text-lime-200">Signal Index</span>
                  {/* Step Graph */}
                  <svg className="w-full h-8" viewBox="0 0 80 30" fill="none">
                    <path d="M 5 25 L 25 25 L 25 15 L 45 15 L 45 8 L 75 8" stroke="#bef264" strokeWidth="2" fill="none" />
                    <circle cx="25" cy="15" r="2.5" fill="#FFFFFF" />
                  </svg>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-dot text-lime-300">AQI</span>
                    <DotMatrixDisplay value="25" size="sm" color="#bef264" />
                  </div>
                </div>

                {/* Wine Crimson Card (Humidity / Sensitivity) */}
                <div className="card-radiant-wine rounded-3xl p-3.5 space-y-2">
                  <span className="text-[10px] font-mono text-red-200">Sensitivity Level</span>
                  {/* Horizontal Tick Ruler with Yellow Pointer */}
                  <div className="h-6 flex items-center justify-center relative">
                    <div className="flex gap-1 items-center">
                      {[4, 8, 12, 16, 20, 16, 12, 8, 4].map((h, i) => (
                        <span key={i} className="w-0.5 bg-red-300/40 rounded-full" style={{ height: `${h}px` }}></span>
                      ))}
                    </div>
                    <div className="w-1.5 h-3 bg-amber-300 rounded-sm absolute top-0 shadow-[0_0_6px_rgba(252,211,77,0.8)]"></div>
                  </div>
                  <div className="text-right">
                    <DotMatrixDisplay value="79" size="sm" color="#FFFFFF" />
                  </div>
                </div>
              </div>

              {/* Radiant Purple Card (Power Used / Chart) */}
              <div className="card-radiant-purple rounded-3xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-purple-200">
                  <span>Input Bandwidth</span>
                  <div className="flex gap-1 text-[8px] font-mono">
                    <span className="px-1.5 py-0.5 rounded-full bg-purple-900 border border-purple-400 text-purple-200">W</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-zinc-400">M</span>
                  </div>
                </div>

                {/* Wave Curve Chart with White Glowing Peak */}
                <div className="h-10 flex items-end justify-between px-1 relative">
                  {[10, 18, 14, 38, 20, 16].map((h, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <span
                        className={`w-3 rounded-full ${i === 3 ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]' : 'bg-purple-400/40'}`}
                        style={{ height: `${h}px` }}
                      ></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
