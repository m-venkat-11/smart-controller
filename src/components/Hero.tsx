import React, { useState, useRef } from 'react';
import { ArrowRight, Smartphone, Laptop, Wifi, ShieldCheck, Zap, Activity, Radio, Sparkles } from 'lucide-react';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  // Interactive cursor simulation between phone and laptop mockup
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [isHoveringPad, setIsHoveringPad] = useState(false);
  const [lastClick, setLastClick] = useState<string | null>(null);
  const [packetCount, setPacketCount] = useState(842);
  const [simulatedLatency, setSimulatedLatency] = useState(3.4);

  const padRef = useRef<HTMLDivElement>(null);

  const handlePadMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));
    setCursorPos({ x, y });
    setPacketCount((p) => p + 1);
    setSimulatedLatency(Number((3.2 + Math.random() * 0.8).toFixed(1)));
  };

  const handlePadClick = (type: string) => {
    setLastClick(type);
    setPacketCount((p) => p + 2);
    setTimeout(() => setLastClick(null), 800);
  };

  return (
    <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 overflow-hidden">
      {/* Background ambient light effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] aura-red pointer-events-none opacity-20 blur-3xl"></div>
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] aura-cyan pointer-events-none opacity-15 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Announcement Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-glyph-surface/90 border border-white/10 text-xs font-mono backdrop-blur-md hover:border-white/20 transition-colors">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-glyph-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-glyph-red"></span>
            </span>
            <span className="text-zinc-300 font-medium">UCP v1.0 Universal Control Protocol</span>
            <span className="text-zinc-500">•</span>
            <span className="text-glyph-cyan flex items-center gap-1">
              <Zap className="w-3 h-3" /> Sub-5ms LAN
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Your Phone.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
              Your Touchpad.
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-zinc-400 max-w-2xl mx-auto font-sans leading-relaxed">
            Turn your smartphone into a wireless touchpad and control your computer with effortless precision. Built on Nothing-inspired minimalism, zero cloud reliance, and hardware-level responsiveness.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('playground')}
              className="px-6 py-3.5 rounded-2xl bg-glyph-red hover:bg-glyph-red-bright text-white font-mono text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[0_0_30px_-5px_rgba(235,0,41,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>TEST LIVE TOUCHPAD</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('how-it-works')}
              className="px-6 py-3.5 rounded-2xl glass-panel-elevated hover:bg-white/10 text-white font-mono text-xs sm:text-sm font-medium border border-white/15 transition-all duration-300"
            >
              SEE HOW IT WORKS
            </button>

            <button
              onClick={() => onNavigate('download')}
              className="px-5 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white font-mono text-xs sm:text-sm border border-white/10 transition-colors"
            >
              GET RECEIVER
            </button>
          </div>

          {/* Compatibility Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-zinc-400">
            <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Universal Host:</span>
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300">Windows 10/11</span>
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300">macOS</span>
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300">Linux</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Mobile:</span>
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300">Android 10+</span>
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300">iOS</span>
          </div>
        </div>

        {/* Dual Device Mockup Stage */}
        <div className="mt-14 sm:mt-20 max-w-5xl mx-auto">
          <div className="glass-panel-elevated rounded-3xl p-4 sm:p-8 border border-white/10 relative shadow-2xl">
            {/* Top Device Bar */}
            <div className="flex flex-wrap items-center justify-between pb-6 border-b border-white/10 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-glyph-red"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/40"></div>
                <div className="w-3 h-3 rounded-full bg-glyph-green/40"></div>
                <span className="font-dot text-xs tracking-wider text-zinc-400 pl-2">ACTIVE PAIR: POCO F4 ⇄ THINKPAD X1</span>
              </div>

              {/* Live Dot Telemetry */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-glyph-green/10 text-glyph-green border border-glyph-green/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-glyph-green animate-pulse"></span>
                  <span>CONNECTED</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-zinc-400">
                  <Activity className="w-3.5 h-3.5 text-glyph-cyan" />
                  <span>LATENCY: <strong className="text-white font-dot">{simulatedLatency} MS</strong></span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-zinc-400">
                  <Radio className="w-3.5 h-3.5 text-glyph-red" />
                  <span>PACKETS: <strong className="text-white font-mono">{packetCount}</strong></span>
                </div>
              </div>
            </div>

            {/* Interactive Dual Mockup Screen */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-center">
              {/* Phone Mockup (Left 5 Cols) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full max-w-[280px] sm:max-w-[300px] rounded-[36px] bg-black p-3.5 border-4 border-zinc-800 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative">
                  {/* Phone Speaker Notch */}
                  <div className="w-20 h-4 bg-zinc-900 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <div className="w-3 h-1 bg-zinc-700 rounded-full"></div>
                  </div>

                  {/* Phone Screen: GlyphPad Touch Surface */}
                  <div className="rounded-[26px] bg-glyph-bg border border-white/10 p-3 flex flex-col h-[400px] select-none relative overflow-hidden">
                    {/* Screen Header */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pb-2 border-b border-white/5">
                      <span className="font-dot text-white">GLYPHPAD</span>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-glyph-green"></span>
                        <span>Wi-Fi 5G</span>
                      </div>
                    </div>

                    {/* Interactive Touchpad Area */}
                    <div
                      ref={padRef}
                      onMouseMove={handlePadMouseMove}
                      onMouseEnter={() => setIsHoveringPad(true)}
                      onMouseLeave={() => setIsHoveringPad(false)}
                      onClick={() => handlePadClick('PRIMARY CLICK (TAP)')}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        handlePadClick('SECONDARY CLICK (2-FINGER)');
                      }}
                      className="flex-1 my-2 rounded-2xl bg-zinc-900/60 border border-white/10 relative cursor-crosshair flex flex-col items-center justify-center hover:border-glyph-red/50 transition-colors overflow-hidden group"
                    >
                      <div className="absolute inset-0 dot-pattern opacity-30"></div>

                      {/* Finger position indicator dot */}
                      <div
                        className="absolute w-7 h-7 rounded-full border-2 border-glyph-red bg-glyph-red/20 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75 flex items-center justify-center"
                        style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
                      >
                        <div className="w-2 h-2 rounded-full bg-glyph-red"></div>
                      </div>

                      {/* Touchpad Guide Text */}
                      <div className="text-center z-10 pointer-events-none p-4">
                        <p className="font-dot text-xs text-zinc-300">TOUCH SURFACE</p>
                        <p className="text-[10px] font-mono text-zinc-500 mt-1">Move cursor here to test live response</p>
                        {lastClick && (
                          <div className="mt-2 px-2 py-0.5 rounded bg-glyph-red text-white font-mono text-[9px] animate-bounce">
                            {lastClick}
                          </div>
                        )}
                      </div>

                      {/* Gesture Hints Footer */}
                      <div className="absolute bottom-2 inset-x-2 flex justify-between text-[9px] font-mono text-zinc-500 px-2 py-1 bg-black/40 rounded-lg">
                        <span>Tap: Left Click</span>
                        <span>2-Finger: Scroll</span>
                        <span>Right Click: Menu</span>
                      </div>
                    </div>

                    {/* Bottom Tactile Button Dock */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handlePadClick('LEFT MOUSE')}
                        className="py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 font-mono text-[11px] text-zinc-300 active:bg-glyph-red active:text-white border border-white/5 transition-colors"
                      >
                        L-CLICK
                      </button>
                      <button
                        onClick={() => handlePadClick('RIGHT MOUSE')}
                        className="py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 font-mono text-[11px] text-zinc-300 active:bg-glyph-red active:text-white border border-white/5 transition-colors"
                      >
                        R-CLICK
                      </button>
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono text-zinc-500 mt-3">Smartphone Controller Surface</span>
              </div>

              {/* Radiant Signal Beam (Col 2 on large screens) */}
              <div className="lg:col-span-2 hidden lg:flex flex-col items-center justify-center py-4">
                <div className="w-full flex items-center justify-center relative">
                  <div className="h-0.5 w-full bg-gradient-to-r from-glyph-red via-glyph-cyan to-glyph-green relative">
                    <div className="absolute -top-1 w-2.5 h-2.5 rounded-full bg-white animate-ping left-1/2 -translate-x-1/2"></div>
                  </div>
                </div>
                <div className="mt-2 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400 text-center">
                  UCP ENCRYPTED STREAM
                </div>
              </div>

              {/* Laptop Screen Mockup (Right 5 Cols) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full rounded-2xl bg-zinc-950 p-2 sm:p-3 border border-white/15 shadow-2xl relative">
                  {/* Laptop Camera dot */}
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 mx-auto mb-2"></div>

                  {/* Desktop Canvas Display */}
                  <div className="rounded-xl bg-[#0c0d10] border border-white/10 h-[380px] p-3 relative overflow-hidden flex flex-col justify-between">
                    {/* Simulated Desktop Window */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                        <span className="text-[10px] font-mono text-zinc-400 pl-2">GlyphPad Receiver v1.0 — Ready</span>
                      </div>
                      <span className="text-[10px] font-mono text-glyph-green">192.168.1.104:8443</span>
                    </div>

                    {/* Screen Canvas Area with Live Cursor */}
                    <div className="flex-1 relative my-2 rounded-lg bg-zinc-900/30 border border-white/5 overflow-hidden">
                      {/* Grid wallpaper */}
                      <div className="absolute inset-0 dot-pattern opacity-20"></div>

                      {/* Desktop Icons */}
                      <div className="p-3 space-y-3">
                        <div className="w-12 h-10 rounded-lg bg-white/5 border border-white/10 p-1 flex flex-col items-center justify-center">
                          <Laptop className="w-4 h-4 text-zinc-400" />
                          <span className="text-[8px] font-mono text-zinc-500">PC Host</span>
                        </div>
                        <div className="w-12 h-10 rounded-lg bg-white/5 border border-white/10 p-1 flex flex-col items-center justify-center">
                          <Smartphone className="w-4 h-4 text-glyph-red" />
                          <span className="text-[8px] font-mono text-zinc-500">Phone</span>
                        </div>
                      </div>

                      {/* LIVE SYSTEM CURSOR */}
                      <div
                        className="absolute w-4 h-4 pointer-events-none transition-all duration-75 -translate-x-1 -translate-y-1 z-30"
                        style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
                      >
                        {/* Windows-style crisp SVG cursor */}
                        <svg className="w-4 h-4 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" viewBox="0 0 16 16" fill="none">
                          <path d="M1 1L6 14L8.5 9L13.5 8L1 1Z" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
                        </svg>
                        {lastClick && (
                          <span className="absolute -top-3 left-4 text-[9px] font-mono px-1 rounded bg-glyph-red text-white whitespace-nowrap animate-pulse">
                            CLICK
                          </span>
                        )}
                      </div>

                      {/* Telemetry HUD in Laptop Corner */}
                      <div className="absolute bottom-2 right-2 p-2 rounded-lg bg-black/80 border border-white/10 text-[9px] font-mono space-y-0.5">
                        <div className="text-zinc-400">STATUS: <span className="text-glyph-green">INJECTING</span></div>
                        <div className="text-zinc-400">DISPATCH: <span className="text-white">SendInput Win32</span></div>
                        <div className="text-zinc-400">COORD: <span className="text-glyph-cyan font-dot">{Math.round(cursorPos.x * 19.2)}, {Math.round(cursorPos.y * 10.8)}</span></div>
                      </div>
                    </div>

                    {/* Desktop Taskbar */}
                    <div className="h-6 rounded-md bg-zinc-900 border border-white/5 flex items-center justify-between px-2 text-[9px] font-mono text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-sm bg-white/40"></div>
                        <span>Windows Desktop Receiver</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wifi className="w-2.5 h-2.5 text-glyph-green" />
                        <span>12:00 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono text-zinc-500 mt-3">Target Laptop Screen (Native Input Injection)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
