import React, { useRef, useState, useEffect } from 'react';
import { MousePointer, Lock, Unlock, Hand, RefreshCw } from 'lucide-react';
import { DotMatrixDisplay } from './DotMatrixDisplay';

interface TouchpadSurfaceProps {
  onPointerMove: (dx: number, dy: number) => void;
  onClick: (button: 'LEFT' | 'RIGHT' | 'MIDDLE') => void;
  onDoubleClick: () => void;
  onScroll: (deltaY: number, deltaX?: number) => void;
  onAction: (action: string) => void;
  sensitivity: number;
  naturalScroll: boolean;
  hapticEnabled: boolean;
  surfaceTheme: string;
}

interface TouchPoint {
  id: number;
  x: number;
  y: number;
}

export const TouchpadSurface: React.FC<TouchpadSurfaceProps> = ({
  onPointerMove,
  onClick,
  onDoubleClick,
  onScroll,
  onAction,
  sensitivity,
  naturalScroll,
  hapticEnabled,
  surfaceTheme,
}) => {
  const padRef = useRef<HTMLDivElement>(null);
  const [activeTouches, setActiveTouches] = useState<TouchPoint[]>([]);
  const [currentGesture, setCurrentGesture] = useState<string>('READY');
  const [dragLock, setDragLock] = useState<boolean>(false);
  const [cursorPosPreview, setCursorPosPreview] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  // Touch tracking state
  const touchStartRef = useRef<{
    time: number;
    count: number;
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    moved: boolean;
  }>({
    time: 0,
    count: 0,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    moved: false,
  });

  const lastTapRef = useRef<number>(0);

  const vibrate = (ms: number = 20) => {
    if (hapticEnabled && typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(ms);
    }
  };

  // Touch Event Handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const touches = Array.from(e.touches).map((t) => ({
      id: t.identifier,
      x: t.clientX,
      y: t.clientY,
    }));
    setActiveTouches(touches);

    const first = e.touches[0];
    touchStartRef.current = {
      time: Date.now(),
      count: e.touches.length,
      startX: first.clientX,
      startY: first.clientY,
      lastX: first.clientX,
      lastY: first.clientY,
      moved: false,
    };

    if (e.touches.length === 1) {
      setCurrentGesture('TRACKING');
    } else if (e.touches.length === 2) {
      setCurrentGesture('2-FINGER SCROLL');
      vibrate(15);
    } else if (e.touches.length >= 3) {
      setCurrentGesture('3-FINGER GESTURE');
      vibrate(25);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const touches = Array.from(e.touches).map((t) => ({
      id: t.identifier,
      x: t.clientX,
      y: t.clientY,
    }));
    setActiveTouches(touches);

    const state = touchStartRef.current;
    if (e.touches.length === 1) {
      const current = e.touches[0];
      const rawDx = current.clientX - state.lastX;
      const rawDy = current.clientY - state.lastY;

      // Pointer acceleration
      const speed = Math.hypot(rawDx, rawDy);
      const accel = speed > 10 ? 1.4 : 1.0;
      const dx = rawDx * sensitivity * accel;
      const dy = rawDy * sensitivity * accel;

      if (Math.hypot(current.clientX - state.startX, current.clientY - state.startY) > 4) {
        state.moved = true;
      }

      onPointerMove(dx, dy);

      setCursorPosPreview((prev) => ({
        x: Math.max(5, Math.min(95, prev.x + dx * 0.15)),
        y: Math.max(5, Math.min(95, prev.y + dy * 0.15)),
      }));

      state.lastX = current.clientX;
      state.lastY = current.clientY;
      setCurrentGesture(dragLock ? 'DRAGGING' : 'MOVING');
    } else if (e.touches.length === 2) {
      state.moved = true;
      const current = e.touches[0];
      const rawDy = current.clientY - state.lastY;
      const rawDx = current.clientX - state.lastX;

      const scrollSign = naturalScroll ? -1 : 1;
      const deltaY = rawDy * scrollSign * 2.5;
      const deltaX = rawDx * scrollSign * 2.0;

      onScroll(deltaY, deltaX);

      state.lastX = current.clientX;
      state.lastY = current.clientY;
      setCurrentGesture('SCROLLING');
    } else if (e.touches.length === 3) {
      state.moved = true;
      const current = e.touches[0];
      const diffY = current.clientY - state.startY;

      if (diffY > 60) {
        // 3-finger swipe down -> Show Desktop
        onAction('SHOW_DESKTOP');
        setCurrentGesture('SHOW DESKTOP (WIN+D)');
        vibrate(30);
        state.startY = current.clientY; // reset to avoid duplicate
      } else if (diffY < -60) {
        // 3-finger swipe up -> Task View / Alt Tab
        onAction('TASK_MANAGER');
        setCurrentGesture('TASK MANAGER');
        vibrate(30);
        state.startY = current.clientY;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const remaining = Array.from(e.touches).map((t) => ({
      id: t.identifier,
      x: t.clientX,
      y: t.clientY,
    }));
    setActiveTouches(remaining);

    const state = touchStartRef.current;
    const duration = Date.now() - state.time;

    // Detect Tap Gestures
    if (!state.moved && duration < 240) {
      if (state.count === 1) {
        const now = Date.now();
        if (now - lastTapRef.current < 280) {
          // Double Tap
          onDoubleClick();
          setCurrentGesture('DOUBLE CLICK');
          vibrate(25);
          lastTapRef.current = 0;
        } else {
          // Single Tap (Left Click)
          onClick('LEFT');
          setCurrentGesture('LEFT CLICK');
          vibrate(15);
          lastTapRef.current = now;
        }
      } else if (state.count === 2) {
        // Two-finger tap (Right Click)
        onClick('RIGHT');
        setCurrentGesture('RIGHT CLICK');
        vibrate(30);
      }
    }

    if (e.touches.length === 0) {
      setTimeout(() => setCurrentGesture('READY'), 700);
    }
  };

  // Mouse / Pointer fallback for testing on Desktop
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return; // Handled by touch events
    touchStartRef.current = {
      time: Date.now(),
      count: 1,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      moved: false,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    if (e.buttons === 0) return;
    const state = touchStartRef.current;
    const dx = (e.clientX - state.lastX) * sensitivity * 1.2;
    const dy = (e.clientY - state.lastY) * sensitivity * 1.2;

    if (Math.hypot(e.clientX - state.startX, e.clientY - state.startY) > 3) {
      state.moved = true;
    }

    onPointerMove(dx, dy);

    setCursorPosPreview((prev) => ({
      x: Math.max(5, Math.min(95, prev.x + dx * 0.15)),
      y: Math.max(5, Math.min(95, prev.y + dy * 0.15)),
    }));

    state.lastX = e.clientX;
    state.lastY = e.clientY;
    setCurrentGesture(dragLock ? 'DRAGGING' : 'MOVING');
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const state = touchStartRef.current;
    const duration = Date.now() - state.time;
    if (!state.moved && duration < 250) {
      onClick('LEFT');
      setCurrentGesture('LEFT CLICK');
      vibrate(15);
    }
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}
    setTimeout(() => setCurrentGesture('READY'), 700);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto space-y-3 p-2 sm:p-4 select-none">
      {/* HUD Bar above Touchpad */}
      <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-[#111315]/80 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#eb0029] animate-pulse"></div>
          <span className="font-dot text-xs font-bold text-white tracking-widest uppercase">
            {currentGesture}
          </span>
        </div>

        {/* Dynamic Gestures Helper */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-zinc-400">
          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5">1-Tap: Left</span>
          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5">2-Tap: Right</span>
          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5">2-Drag: Scroll</span>
          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5">3-Swipe: Desktop</span>
        </div>

        {/* Cursor Position preview mini badge */}
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-300 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
          <MousePointer className="w-3 h-3 text-[#eb0029]" />
          <span>{Math.round(cursorPosPreview.x)}%</span>
          <span className="text-zinc-600">|</span>
          <span>{Math.round(cursorPosPreview.y)}%</span>
        </div>
      </div>

      {/* Main Touch Area */}
      <div
        ref={padRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`relative flex-1 min-h-[380px] sm:min-h-[460px] rounded-[32px] border transition-all cursor-crosshair overflow-hidden touch-none ${
          surfaceTheme === 'emerald'
            ? 'card-radiant-green'
            : surfaceTheme === 'rose'
            ? 'card-radiant-pink'
            : surfaceTheme === 'blue'
            ? 'card-radiant-blue'
            : surfaceTheme === 'purple'
            ? 'card-radiant-purple'
            : 'bg-[#121417] border-white/10'
        }`}
        style={{
          backgroundImage:
            'radial-gradient(rgba(255, 255, 255, 0.12) 1.5px, transparent 1.5px)',
          backgroundSize: '20px 20px',
        }}
      >
        {/* Subtle Watermark Branding */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
          <div className="w-16 h-16 rounded-full border border-white/40 flex items-center justify-center mb-3">
            <div className="w-6 h-6 rounded-full bg-[#eb0029]"></div>
          </div>
          <span className="font-dot text-lg font-bold tracking-[0.25em] text-white">GLYPHPAD</span>
          <span className="font-mono text-xs text-zinc-300 mt-1">TOUCH SURFACE</span>
        </div>

        {/* Visual Touch Points Ripple Follower */}
        {activeTouches.map((touch) => (
          <div
            key={touch.id}
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${touch.x - (padRef.current?.getBoundingClientRect().left || 0)}px`,
              top: `${touch.y - (padRef.current?.getBoundingClientRect().top || 0)}px`,
            }}
          >
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/40 animate-ping"></div>
            <div className="absolute inset-0 w-8 h-8 m-auto rounded-full bg-[#eb0029] shadow-[0_0_15px_#eb0029]"></div>
          </div>
        ))}

        {/* Virtual Cursor Indicator on Pad */}
        <div
          className="absolute w-3.5 h-3.5 rounded-full bg-white border-2 border-black shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none transition-all duration-75 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${cursorPosPreview.x}%`,
            top: `${cursorPosPreview.y}%`,
          }}
        />
      </div>

      {/* Tactile Bottom Mouse Click Bar (Nothing OS Aesthetic) */}
      <div className="grid grid-cols-4 gap-2.5 pt-1">
        <button
          onClick={() => {
            onClick('LEFT');
            setCurrentGesture('LEFT CLICK');
            vibrate(20);
          }}
          className="col-span-2 py-4 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:bg-[#eb0029] text-white border border-white/10 active:border-[#eb0029] font-dot text-sm font-bold tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
        >
          <span>LEFT CLICK</span>
        </button>

        <button
          onClick={() => {
            onClick('MIDDLE');
            setCurrentGesture('MIDDLE CLICK');
            vibrate(20);
          }}
          className="col-span-1 py-4 rounded-2xl bg-[#14171a] hover:bg-[#1c2024] active:bg-white active:text-black text-zinc-300 border border-white/10 font-dot text-xs font-bold tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center"
        >
          <span>MIDDLE</span>
        </button>

        <button
          onClick={() => {
            onClick('RIGHT');
            setCurrentGesture('RIGHT CLICK');
            vibrate(25);
          }}
          className="col-span-1 py-4 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:bg-[#eb0029] text-white border border-white/10 active:border-[#eb0029] font-dot text-sm font-bold tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center"
        >
          <span>RIGHT</span>
        </button>
      </div>

      {/* Additional Tactile Quick Tools */}
      <div className="flex items-center justify-between gap-2 px-1">
        <button
          onClick={() => {
            setDragLock(!dragLock);
            vibrate(30);
          }}
          className={`flex-1 py-2 rounded-xl border font-mono text-xs flex items-center justify-center gap-1.5 transition-all ${
            dragLock
              ? 'bg-[#eb0029] border-[#eb0029] text-white shadow-[0_0_12px_rgba(235,0,41,0.4)]'
              : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
          }`}
        >
          {dragLock ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          <span>DRAG LOCK: {dragLock ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={() => {
            onAction('SHOW_DESKTOP');
            vibrate(25);
          }}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white font-mono text-xs transition-all active:scale-95"
        >
          WIN+D
        </button>

        <button
          onClick={() => {
            onAction('TASK_MANAGER');
            vibrate(25);
          }}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white font-mono text-xs transition-all active:scale-95"
        >
          TASK MGR
        </button>
      </div>
    </div>
  );
};
