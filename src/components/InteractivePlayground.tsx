import React, { useState, useRef, useEffect } from 'react';
import { MousePointer, RefreshCw, Radio, Shield, Terminal, Volume2, Sliders, Play, Laptop, Smartphone, CheckCircle, Zap, Wifi, Link2, Unlink } from 'lucide-react';
import { GestureClassifier } from '../core/protocol/gestureEngine';
import { createUCPEnvelope } from '../core/protocol/serializer';
import { ConnectionStateMachine } from '../core/protocol/stateMachine';
import { ConnectionState, UCPEnvelope } from '../core/protocol/types';
import { DotMatrixDisplay } from './DotMatrixDisplay';

export const InteractivePlayground: React.FC = () => {
  // State Machine & Classifier instances
  const [stateMachine] = useState(() => new ConnectionStateMachine('CONNECTED'));
  const [classifier] = useState(() => new GestureClassifier(1.2, true));
  const [connectionState, setConnectionState] = useState<ConnectionState>('CONNECTED');

  // Real WebSocket bridge to PC receiver
  const [pcAddress, setPcAddress] = useState('192.168.1.104:8443');
  const [isRealConnected, setIsRealConnected] = useState(false);
  const [realWs, setRealWs] = useState<WebSocket | null>(null);

  // Interactive Coordinates & Metrics
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [isClicking, setIsClicking] = useState<string | null>(null);
  const [recentPackets, setRecentPackets] = useState<UCPEnvelope[]>([]);
  const [latency, setLatency] = useState(18);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [sensitivity, setSensitivity] = useState(1.2);
  const [naturalScroll, setNaturalScroll] = useState(true);
  const [touchActive, setTouchActive] = useState(false);

  const padRef = useRef<HTMLDivElement>(null);

  // Subscribe to connection state machine
  useEffect(() => {
    return stateMachine.subscribe((state) => {
      setConnectionState(state);
    });
  }, [stateMachine]);

  // Update classifier tuning
  useEffect(() => {
    classifier.sensitivity = sensitivity;
    classifier.naturalScrolling = naturalScroll;
  }, [classifier, sensitivity, naturalScroll]);

  // Connect to Real PC WebSocket Receiver
  const toggleRealConnection = () => {
    if (isRealConnected && realWs) {
      realWs.close();
      setRealWs(null);
      setIsRealConnected(false);
      return;
    }

    try {
      const cleanAddr = pcAddress.replace('http://', '').replace('ws://', '').trim();
      const ws = new WebSocket(`ws://${cleanAddr}/ucp`);
      ws.onopen = () => {
        setIsRealConnected(true);
        setRealWs(ws);
      };
      ws.onclose = () => {
        setIsRealConnected(false);
        setRealWs(null);
      };
      ws.onerror = () => {
        alert(`Could not connect to ws://${cleanAddr}/ucp. Make sure receiver is running!`);
      };
    } catch (e) {
      alert('Invalid receiver address');
    }
  };

  // Dispatch a simulated packet + forward to Real PC if connected
  const emitPacket = (type: any, payload: any) => {
    if (connectionState !== 'CONNECTED' && connectionState !== 'DEGRADED') return;
    const packet = createUCPEnvelope(type, 'sess_prod_99x8', payload);
    setRecentPackets((prev) => [packet, ...prev.slice(0, 14)]);
    setLatency(Math.floor(16 + Math.random() * 4));

    // Forward to real Windows PC if connected
    if (realWs && realWs.readyState === WebSocket.OPEN) {
      realWs.send(JSON.stringify({ type, payload }));
    }
  };

  // Handle Touch/Mouse input on the pad
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!padRef.current) return;
    setTouchActive(true);
    const rect = padRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const events = classifier.onTouchStart([{ id: e.pointerId, x, y }]);
    handleGestureEvents(events);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!touchActive || !padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const events = classifier.onTouchMove([{ id: e.pointerId, x, y }]);
    handleGestureEvents(events);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setTouchActive(false);
    const events = classifier.onTouchEnd([e.pointerId]);
    handleGestureEvents(events);
  };

  const handleGestureEvents = (events: any[]) => {
    events.forEach((ev) => {
      if (ev.type === 'POINTER_MOVE' || ev.type === 'DRAG_MOVE') {
        setCursorPos((prev) => {
          const nextX = Math.max(2, Math.min(98, prev.x + ev.dx * 0.25));
          const nextY = Math.max(2, Math.min(98, prev.y + ev.dy * 0.25));
          return { x: nextX, y: nextY };
        });
        emitPacket('POINTER_MOVE', { dx: Number(ev.dx.toFixed(2)), dy: Number(ev.dy.toFixed(2)) });
      } else if (ev.type === 'LEFT_CLICK') {
        triggerClick('PRIMARY LEFT CLICK');
        emitPacket('BUTTON_STATE', { button: 'LEFT', action: 'CLICK' });
      } else if (ev.type === 'DOUBLE_CLICK') {
        triggerClick('DOUBLE CLICK');
        emitPacket('BUTTON_STATE', { button: 'LEFT', action: 'DOUBLE_CLICK' });
      } else if (ev.type === 'RIGHT_CLICK') {
        triggerClick('SECONDARY RIGHT CLICK');
        emitPacket('BUTTON_STATE', { button: 'RIGHT', action: 'CLICK' });
      } else if (ev.type === 'SCROLL') {
        emitPacket('SCROLL', { deltaX: Number(ev.deltaX.toFixed(1)), deltaY: Number(ev.deltaY.toFixed(1)) });
      }
    });
  };

  const triggerClick = (msg: string) => {
    setIsClicking(msg);
    if (hapticEnabled && typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(25);
    }
    setTimeout(() => setIsClicking(null), 700);
  };

  return (
    <div className="py-12 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Title & Real PC Bridge Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-dot text-sm text-rose-400 tracking-widest">LIVE PROTOCOL SANDBOX</span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-zinc-300">UCP v1.0</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">Interactive Touchpad Simulator</h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans mt-0.5">
              Interact directly on the virtual smartphone pad below to watch real-time native input injection and streaming packets.
            </p>
          </div>

          {/* Real PC WebSocket Bridge Input */}
          <div className="glass-panel-elevated p-2 sm:p-3 rounded-2xl border border-white/15 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-dot text-zinc-400 flex items-center gap-1 pl-1">
              <Wifi className="w-3.5 h-3.5 text-cyan-400" />
              <span>REAL PC:</span>
            </span>
            <input
              type="text"
              value={pcAddress}
              onChange={(e) => setPcAddress(e.target.value)}
              placeholder="192.168.1.xxx:8443"
              disabled={isRealConnected}
              className="bg-black/60 border border-white/10 rounded-xl px-2.5 py-1 text-xs font-mono text-white w-40 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={toggleRealConnection}
              className={`px-3 py-1.5 rounded-xl font-dot text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isRealConnected
                  ? 'bg-emerald-400 text-black shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
              }`}
            >
              {isRealConnected ? (
                <>
                  <Unlink className="w-3.5 h-3.5" />
                  <span>CONNECTED TO PC</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5" />
                  <span>BRIDGE TO PC</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3-Column Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Col 1: Phone Controller Mockup (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="w-full max-w-[320px] rounded-[36px] bg-[#0c0d10] p-3.5 border-4 border-zinc-800 shadow-2xl relative">
              <div className="w-20 h-4 bg-zinc-900 rounded-full mx-auto mb-3 flex items-center justify-center">
                <div className="w-3 h-1 bg-zinc-700 rounded-full"></div>
              </div>

              {/* Phone Touchpad Surface in Radiant Pink Frame */}
              <div className="card-radiant-pink rounded-[26px] p-3 flex flex-col h-[460px] select-none">
                <div className="flex items-center justify-between text-[10px] font-mono text-rose-200 pb-2 border-b border-white/10">
                  <span className="font-dot text-white">GLYPHPAD (1)</span>
                  <div className="flex items-center gap-1.5">
                    <DotMatrixDisplay value={latency} size="sm" color="#FFFFFF" />
                    <span className="text-zinc-400">ms</span>
                  </div>
                </div>

                {/* The Interactive Touch Area */}
                <div
                  ref={padRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className="flex-1 my-2 rounded-2xl bg-black/40 border border-white/15 relative cursor-crosshair flex flex-col items-center justify-center hover:border-white/30 transition-colors overflow-hidden group touch-none"
                >
                  <div className="absolute inset-0 dot-pattern opacity-30"></div>

                  <div className="text-center pointer-events-none p-4">
                    <p className="font-dot text-xs text-white">ACTIVE CONTROL SURFACE</p>
                    <p className="text-[10px] font-mono text-rose-200/80 mt-1">Touch / Drag cursor inside this area</p>
                    {isClicking && (
                      <div className="mt-3 px-3 py-1 rounded bg-amber-400 text-black font-dot text-xs font-bold animate-bounce shadow-lg">
                        {isClicking}
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-2 inset-x-2 flex justify-between text-[9px] font-mono text-rose-200/70 px-2 py-1 bg-black/50 rounded-lg">
                    <span>Tap: L-Click</span>
                    <span>Hold: Drag</span>
                    <span>Right: R-Click</span>
                  </div>
                </div>

                {/* Explicit Click Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      triggerClick('PRIMARY LEFT CLICK');
                      emitPacket('BUTTON_STATE', { button: 'LEFT', action: 'CLICK' });
                    }}
                    className="py-3 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white active:text-black font-dot text-xs text-white border border-white/10 transition-colors"
                  >
                    LEFT CLICK
                  </button>
                  <button
                    onClick={() => {
                      triggerClick('SECONDARY RIGHT CLICK');
                      emitPacket('BUTTON_STATE', { button: 'RIGHT', action: 'CLICK' });
                    }}
                    className="py-3 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white active:text-black font-dot text-xs text-white border border-white/10 transition-colors"
                  >
                    RIGHT CLICK
                  </button>
                </div>
              </div>
            </div>
            <span className="text-xs font-dot text-zinc-500 mt-3">Virtual Mobile Touchpad Client</span>
          </div>

          {/* Col 2: Target Desktop Monitor (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="w-full rounded-2xl bg-zinc-950 p-3 border border-white/15 shadow-2xl">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 mx-auto mb-2"></div>
              <div className="rounded-xl bg-[#0c0d10] border border-white/10 h-[460px] p-3 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[10px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    <span className="text-zinc-400">Target Display (1920x1080)</span>
                  </div>
                  <span className="text-cyan-400 font-dot">{isRealConnected ? 'REAL PC BRIDGE ACTIVE' : 'SendInput Active'}</span>
                </div>

                {/* Display Area with Live Cursor */}
                <div className="flex-1 my-2 rounded-lg bg-zinc-900/40 border border-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 dot-pattern opacity-25"></div>

                  <div className="p-4 space-y-2">
                    <div className="w-24 h-14 rounded-lg bg-white/5 border border-white/10 p-2 flex flex-col justify-between">
                      <Laptop className="w-4 h-4 text-zinc-400" />
                      <span className="text-[9px] font-mono text-zinc-400">Desktop Host</span>
                    </div>
                  </div>

                  {/* LIVE CURSOR */}
                  <div
                    className="absolute w-4 h-4 pointer-events-none transition-all duration-75 -translate-x-1 -translate-y-1 z-30"
                    style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
                  >
                    <svg className="w-4 h-4 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" viewBox="0 0 16 16" fill="none">
                      <path d="M1 1L6 14L8.5 9L13.5 8L1 1Z" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
                    </svg>
                    {isClicking && (
                      <span className="absolute -top-3 left-4 text-[9px] font-dot px-1 rounded bg-amber-400 text-black whitespace-nowrap animate-pulse">
                        {isClicking}
                      </span>
                    )}
                  </div>

                  {/* HUD In Bottom Corner */}
                  <div className="absolute bottom-2 right-2 p-2 rounded-lg bg-black/80 border border-white/10 text-[9px] font-mono space-y-0.5">
                    <div className="text-zinc-400">X: <span className="text-cyan-400 font-dot">{Math.round(cursorPos.x * 19.2)}</span></div>
                    <div className="text-zinc-400">Y: <span className="text-cyan-400 font-dot">{Math.round(cursorPos.y * 10.8)}</span></div>
                  </div>
                </div>

                {/* Taskbar */}
                <div className="h-6 rounded bg-zinc-900 border border-white/5 flex items-center justify-between px-2 text-[9px] font-mono text-zinc-400">
                  <span>GlyphPad Receiver v1.0</span>
                  <span className="text-emerald-400 font-dot">{isRealConnected ? 'CONNECTED TO REAL PC' : 'ONLINE'}</span>
                </div>
              </div>
            </div>
            <span className="text-xs font-dot text-zinc-500 mt-3">Target Operating System Screen</span>
          </div>

          {/* Col 3: Live Protocol Packet Inspector (4 Cols) */}
          <div className="lg:col-span-4 glass-panel-elevated rounded-3xl p-5 border border-white/10 h-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-rose-400" />
                <h3 className="font-dot text-xs text-white">LIVE PACKET INSPECTOR</h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">{recentPackets.length} PACKETS</span>
            </div>

            {/* Tuning Controls */}
            <div className="space-y-3 pb-3 border-b border-white/10 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">SENSITIVITY ({sensitivity}x)</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={sensitivity}
                  onChange={(e) => setSensitivity(Number(e.target.value))}
                  className="w-24 accent-rose-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-400">NATURAL SCROLLING</span>
                <input
                  type="checkbox"
                  checked={naturalScroll}
                  onChange={(e) => setNaturalScroll(e.target.checked)}
                  className="accent-rose-500 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-400">HAPTIC CLICK PULSE</span>
                <input
                  type="checkbox"
                  checked={hapticEnabled}
                  onChange={(e) => setHapticEnabled(e.target.checked)}
                  className="accent-rose-500 rounded"
                />
              </div>
            </div>

            {/* Streaming Packets Terminal View */}
            <div className="h-[280px] overflow-y-auto space-y-2 pr-1 font-mono text-[10px]">
              {recentPackets.length === 0 ? (
                <div className="h-full flex items-center justify-center text-zinc-500 text-center font-dot">
                  Move or tap on the simulated touchpad to inspect live UCP packets.
                </div>
              ) : (
                recentPackets.map((pkt) => (
                  <div
                    key={pkt.sequence}
                    className="p-2.5 rounded-xl bg-black/60 border border-white/5 space-y-0.5 animate-in fade-in"
                  >
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="text-cyan-400 font-bold font-dot">#{pkt.sequence} • {pkt.type}</span>
                      <span className="text-zinc-500">{new Date(pkt.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <pre className="text-zinc-300 text-[9px] overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(pkt.payload)}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
