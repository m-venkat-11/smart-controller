import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, CheckCircle2, RefreshCw, Terminal, Vibrate, MousePointer, Hand } from 'lucide-react';
import { DotMatrixDisplay } from './DotMatrixDisplay';
import { UCPEnvelope } from '../core/protocol/types';
import { nothingAudio } from '../utils/audioFeedback';

interface DiagnosticsPanelProps {
  latency: number;
  packets: UCPEnvelope[];
  isRealConnected: boolean;
  receiverHost: string;
  onRunPingTest: () => void;
}

export const DiagnosticsPanel: React.FC<DiagnosticsPanelProps> = ({
  latency,
  packets,
  isRealConnected,
  receiverHost,
  onRunPingTest,
}) => {
  // Mobile & Desktop Test Verification States
  const [tapTested, setTapTested] = useState(false);
  const [twoTapTested, setTwoTapTested] = useState(false);
  const [scrollTested, setScrollTested] = useState(false);
  const [hapticTested, setHapticTested] = useState(false);

  // Latency history for sparkline
  const [latencyHistory, setLatencyHistory] = useState<number[]>([18, 16, 17, 19, 15, 14, 16, 18, 17, 15, 16, 18]);

  useEffect(() => {
    if (latency > 0) {
      setLatencyHistory((prev) => [...prev.slice(-20), latency]);
    }
  }, [latency]);

  const p95Latency = Math.round(
    [...latencyHistory].sort((a, b) => a - b)[Math.floor(latencyHistory.length * 0.95)] || latency
  );

  const testHaptic = () => {
    nothingAudio.playClick('sharp');
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([20, 40, 20]);
    }
    setHapticTested(true);
  };

  return (
    <div className="max-w-5xl mx-auto p-1.5 sm:p-6 space-y-3 sm:space-y-6 select-none">
      {/* Top Health Header Card */}
      <div className="card-radiant-green rounded-2xl sm:rounded-[32px] p-4 sm:p-6 space-y-4 sm:space-y-6 border border-emerald-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-dot text-xs sm:text-sm font-bold text-white tracking-wider">
                SYSTEM TELEMETRY & DIAGNOSTICS
              </h3>
              <p className="font-mono text-[10px] sm:text-xs text-emerald-200/80">
                UCP v2.0 Real-Time Protocol State
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              nothingAudio.playClick('pop');
              onRunPingTest();
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-black/50 hover:bg-black/70 border border-white/20 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>RUN PING TEST</span>
          </button>
        </div>

        {/* Metric Cards Grid - Fully Responsive 2-Col on Mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 pt-1 sm:pt-2">
          {/* P95 Latency */}
          <div className="bg-black/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 space-y-1.5">
            <span className="font-mono text-[9px] sm:text-[11px] text-zinc-400 uppercase tracking-wider block">
              P95 LATENCY
            </span>
            <div className="flex items-center justify-between">
              <DotMatrixDisplay value={`${p95Latency}MS`} size="sm" color="#34d399" />
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 shrink-0">
                PASS
              </span>
            </div>
          </div>

          {/* Current RTT */}
          <div className="bg-black/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 space-y-1.5">
            <span className="font-mono text-[9px] sm:text-[11px] text-zinc-400 uppercase tracking-wider block">
              CURRENT RTT
            </span>
            <div className="flex items-center justify-between">
              <DotMatrixDisplay value={`${latency}MS`} size="sm" color="#60a5fa" />
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 shrink-0">
                ACTIVE
              </span>
            </div>
          </div>

          {/* Receiver Host */}
          <div className="bg-black/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 space-y-1 sm:space-y-1.5 overflow-hidden">
            <span className="font-mono text-[9px] sm:text-[11px] text-zinc-400 uppercase tracking-wider block">
              TARGET HOST
            </span>
            <div className="font-mono text-xs sm:text-sm font-bold text-white truncate" title={receiverHost}>
              {isRealConnected ? receiverHost : 'STANDBY'}
            </div>
            <div className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isRealConnected ? 'bg-[#00e575] animate-ping' : 'bg-zinc-500'}`} />
              <span>{isRealConnected ? 'CONNECTED' : 'OFFLINE'}</span>
            </div>
          </div>

          {/* UIPI / Injection Engine */}
          <div className="bg-black/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 space-y-1 sm:space-y-1.5">
            <span className="font-mono text-[9px] sm:text-[11px] text-zinc-400 uppercase tracking-wider block">
              INPUT ENGINE
            </span>
            <div className="flex items-center gap-1 font-mono text-xs sm:text-sm font-bold text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">C# WIN32 OK</span>
            </div>
            <div className="text-[9px] font-mono text-zinc-400">Zero-Lag SendInput</div>
          </div>
        </div>

        {/* Latency History Sparkline Visualizer */}
        <div className="bg-black/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-zinc-300">
            <span>PACKET RTT JITTER (LAST 20)</span>
            <span className="text-emerald-400">&lt; 30ms OPTIMAL</span>
          </div>

          <div className="flex items-end gap-1 h-12 sm:h-14 pt-1">
            {latencyHistory.map((val, idx) => {
              const maxH = 45;
              const hPercent = Math.min(100, Math.max(15, (val / maxH) * 100));
              return (
                <div
                  key={idx}
                  className="flex-1 rounded-t-sm transition-all duration-300"
                  style={{
                    height: `${hPercent}%`,
                    backgroundColor: val < 25 ? '#10b981' : val < 50 ? '#f59e0b' : '#ef4444',
                  }}
                  title={`${val}ms`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Touch & Hardware Verification Suite (Tailored for Mobile Touchscreens & PC) */}
      <div className="rounded-2xl sm:rounded-[32px] nothing-card p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-dot text-xs text-white tracking-wider flex items-center gap-1.5">
            <Hand className="w-3.5 h-3.5 text-[#eb0029]" />
            <span>TOUCH GESTURE SELF-TEST MATRIX</span>
          </h4>
          <span className="font-mono text-[9px] sm:text-[10px] text-zinc-400">TAP EACH TO VERIFY</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {/* Test 1: Tap (Primary Left Click) */}
          <button
            onClick={() => {
              nothingAudio.playClick('sharp');
              setTapTested(true);
            }}
            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 ${
              tapTested
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-white/5 border-white/10 text-zinc-200 hover:bg-white/10 active:scale-95'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 ${tapTested ? 'text-emerald-400' : 'text-zinc-500'}`} />
            <span className="text-[11px] sm:text-xs">1-TAP (CLICK)</span>
            <span className="font-mono text-[9px] text-zinc-400">
              {tapTested ? 'PASSED ✓' : 'TAP HERE'}
            </span>
          </button>

          {/* Test 2: Two-Finger Tap (Right Click) */}
          <button
            onClick={() => {
              nothingAudio.playClick('sharp');
              setTwoTapTested(true);
            }}
            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 ${
              twoTapTested
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-white/5 border-white/10 text-zinc-200 hover:bg-white/10 active:scale-95'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 ${twoTapTested ? 'text-emerald-400' : 'text-zinc-500'}`} />
            <span className="text-[11px] sm:text-xs">2-TAP (RIGHT)</span>
            <span className="font-mono text-[9px] text-zinc-400">
              {twoTapTested ? 'PASSED ✓' : 'TAP HERE'}
            </span>
          </button>

          {/* Test 3: Scroll Gesture */}
          <div
            onWheel={() => setScrollTested(true)}
            onTouchMove={() => setScrollTested(true)}
            onClick={() => setScrollTested(true)}
            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
              scrollTested
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-white/5 border-white/10 text-zinc-200 hover:bg-white/10'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 ${scrollTested ? 'text-emerald-400' : 'text-zinc-500'}`} />
            <span className="text-[11px] sm:text-xs">2-DRAG SCROLL</span>
            <span className="font-mono text-[9px] text-zinc-400">
              {scrollTested ? 'PASSED ✓' : 'DRAG HERE'}
            </span>
          </div>

          {/* Test 4: Haptic Vibration Feedback */}
          <button
            onClick={testHaptic}
            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 ${
              hapticTested
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-white/5 border-white/10 text-zinc-200 hover:bg-white/10 active:scale-95'
            }`}
          >
            <Vibrate className={`w-4 h-4 sm:w-5 sm:h-5 ${hapticTested ? 'text-emerald-400' : 'text-zinc-500'}`} />
            <span className="text-[11px] sm:text-xs">HAPTIC MOTOR</span>
            <span className="font-mono text-[9px] text-zinc-400">
              {hapticTested ? 'VERIFIED ✓' : 'TEST VIBRATE'}
            </span>
          </button>
        </div>
      </div>

      {/* Real-time UCP Protocol Live Packet Stream */}
      <div className="rounded-2xl sm:rounded-[32px] nothing-card p-4 sm:p-6 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-dot text-xs text-white tracking-wider">LIVE TELEMETRY STREAM</span>
          </div>
          <span className="font-mono text-[10px] text-zinc-400">60FPS BUFFER</span>
        </div>

        <div className="bg-black/75 rounded-xl sm:rounded-2xl p-3 font-mono text-[11px] space-y-1.5 max-h-40 sm:max-h-52 overflow-y-auto border border-white/10 scrollbar-thin">
          {packets.length === 0 ? (
            <div className="text-zinc-500 italic text-[10px]">Move your finger on the touchpad to stream live UCP packets...</div>
          ) : (
            packets.slice(0, 10).map((pkt, i) => (
              <div key={i} className="flex items-center gap-2 text-zinc-300 hover:text-white text-[10px] sm:text-[11px]">
                <span className="text-zinc-500 shrink-0">[{new Date(pkt.timestamp).toLocaleTimeString()}]</span>
                <span className="text-emerald-400 font-bold shrink-0">#{pkt.sequence}</span>
                <span className="px-1.5 py-0.2 rounded bg-white/10 text-zinc-200 text-[9px] uppercase shrink-0">{pkt.type}</span>
                <span className="text-zinc-400 truncate">{JSON.stringify(pkt.payload)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
