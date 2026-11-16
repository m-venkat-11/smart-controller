import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Volume1,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Lock,
  Monitor,
  Layers,
  Copy,
  Scissors,
  Clipboard,
  Undo2,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Camera,
  Activity,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { DotMatrixDisplay } from './DotMatrixDisplay';

interface QuickActionsGridProps {
  onAction: (action: string) => void;
  hapticEnabled: boolean;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ onAction, hapticEnabled }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(65);
  const [isMuted, setIsMuted] = useState(false);
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);

  const trigger = (action: string, label: string) => {
    onAction(action);
    setActiveFeedback(label);
    if (hapticEnabled && typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(25);
    }
    setTimeout(() => setActiveFeedback(null), 1200);
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* HUD Active Action Notification Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#121417] border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span className="font-dot text-xs text-white tracking-wider">WINDOWS SYSTEM CONTROLS</span>
        </div>
        <div className="flex items-center gap-2">
          {activeFeedback ? (
            <span className="px-3 py-1 rounded-full bg-[#eb0029] text-white font-dot text-xs font-bold animate-pulse shadow-[0_0_12px_#eb0029]">
              EXECUTED: {activeFeedback}
            </span>
          ) : (
            <span className="font-mono text-xs text-zinc-500">TAP ANY TILE TO DISPATCH NATIVE INPUT</span>
          )}
        </div>
      </div>

      {/* Grid of Radiant Cards (EXACT MATCH FOR REFERENCE 2 IMAGES) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* CARD 1: Radiant Rose / Pink (Reference 2 Center Timer Card) - Audio & Volume Master */}
        <div className="card-radiant-pink rounded-[32px] p-6 space-y-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-rose-300" />
              <span className="font-mono text-xs text-rose-200/80 font-semibold tracking-wider">AUDIO MASTER</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-black/40 border border-rose-400/30 text-rose-200 font-mono text-[10px]">
              WIN32 SOUND
            </div>
          </div>

          {/* Authentic Dot-Matrix Display for Volume */}
          <div className="text-center py-2 space-y-1">
            <div className="flex justify-center">
              <DotMatrixDisplay
                value={`${isMuted ? '00' : volumeLevel}%`}
                size="xl"
                color="#FFFFFF"
                inactiveColor="rgba(255, 255, 255, 0.12)"
              />
            </div>
            <span className="font-mono text-[11px] text-rose-200/70 uppercase">
              {isMuted ? 'MUTED' : 'SYSTEM OUTPUT'}
            </span>
          </div>

          {/* Equalizer Audio Bar Graphic from Reference 2 */}
          <div className="flex items-end justify-center gap-1.5 h-12 py-1">
            {[40, 65, 85, 100, 75, 50, 90, 60, 45, 80, 95, 70, 55, 40].map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full transition-all duration-300"
                style={{
                  height: `${isMuted ? 6 : (h * volumeLevel) / 100}%`,
                  backgroundColor: i === 3 || i === 10 ? '#facc15' : '#ffffff',
                  opacity: isMuted ? 0.2 : 0.85,
                }}
              />
            ))}
          </div>

          {/* Volume Control Action Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <button
              onClick={() => {
                setVolumeLevel((prev) => Math.max(0, prev - 10));
                trigger('VOL_DOWN', 'VOLUME DOWN (-)');
              }}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <Volume1 className="w-3.5 h-3.5" />
              <span>VOL -</span>
            </button>

            <button
              onClick={() => {
                setIsMuted(!isMuted);
                trigger('MUTE', 'MUTE TOGGLE');
              }}
              className={`py-3 rounded-2xl border active:scale-95 font-dot text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                isMuted
                  ? 'bg-[#eb0029] border-[#eb0029] text-white'
                  : 'bg-black/40 hover:bg-black/60 border-white/10 text-white'
              }`}
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>MUTE</span>
            </button>

            <button
              onClick={() => {
                setVolumeLevel((prev) => Math.min(100, prev + 10));
                setIsMuted(false);
                trigger('VOL_UP', 'VOLUME UP (+)');
              }}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>VOL +</span>
            </button>
          </div>
        </div>

        {/* CARD 2: Emerald Mint Radiant Card (Reference 2 Left Top) - System Workspace & Windows */}
        <div className="card-radiant-green rounded-[32px] p-6 space-y-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-emerald-300" />
              <span className="font-mono text-xs text-emerald-200/80 font-semibold tracking-wider">WINDOW DESKTOP</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-black/40 border border-emerald-400/30 text-emerald-200 font-mono text-[10px]">
              WIN+D
            </div>
          </div>

          <div className="text-center py-2 space-y-1">
            <div className="flex justify-center">
              <DotMatrixDisplay value="DESK" size="xl" color="#34d399" inactiveColor="rgba(255, 255, 255, 0.1)" />
            </div>
            <span className="font-mono text-[11px] text-emerald-200/70">WORKSPACE OVERVIEW</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={() => trigger('SHOW_DESKTOP', 'SHOW DESKTOP (WIN+D)')}
              className="py-3.5 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-emerald-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
            >
              <Monitor className="w-4 h-4 text-emerald-300" />
              <span>SHOW DESKTOP</span>
            </button>

            <button
              onClick={() => trigger('TASK_MANAGER', 'TASK MANAGER (CTRL+SHIFT+ESC)')}
              className="py-3.5 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-emerald-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
            >
              <Activity className="w-4 h-4 text-emerald-300" />
              <span>TASK MGR</span>
            </button>

            <button
              onClick={() => trigger('SNIP', 'SNIPPING TOOL (WIN+SHIFT+S)')}
              className="py-3.5 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-emerald-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
            >
              <Camera className="w-4 h-4 text-emerald-300" />
              <span>SNIP TOOL</span>
            </button>

            <button
              onClick={() => trigger('ALT_TAB', 'APP SWITCHER (ALT+TAB)')}
              className="py-3.5 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-emerald-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
            >
              <Layers className="w-4 h-4 text-emerald-300" />
              <span>ALT + TAB</span>
            </button>
          </div>
        </div>

        {/* CARD 3: Deep Ocean Sapphire Blue Radiant Card (Reference 2 Left Bottom) - Media Player */}
        <div className="card-radiant-blue rounded-[32px] p-6 space-y-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-blue-300" />
              <span className="font-mono text-xs text-blue-200/80 font-semibold tracking-wider">MEDIA CONTROLLER</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-black/40 border border-blue-400/30 text-blue-200 font-mono text-[10px]">
              SPOTIFY / YT
            </div>
          </div>

          <div className="text-center py-2 space-y-1">
            <div className="flex justify-center">
              <DotMatrixDisplay
                value={isPlaying ? 'PLAY' : 'PAUS'}
                size="xl"
                color="#60a5fa"
                inactiveColor="rgba(255, 255, 255, 0.1)"
              />
            </div>
            <span className="font-mono text-[11px] text-blue-200/70">GLOBAL PLAYBACK</span>
          </div>

          {/* Media Control Action Buttons */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <button
              onClick={() => trigger('MEDIA_PREV', 'PREVIOUS TRACK')}
              className="py-3.5 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-blue-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsPlaying(!isPlaying);
                trigger('MEDIA_PLAY_PAUSE', isPlaying ? 'PAUSE' : 'PLAY');
              }}
              className="py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-dot text-xs font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center gap-1"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={() => trigger('MEDIA_NEXT', 'NEXT TRACK')}
              className="py-3.5 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-blue-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CARD 4: Deep Wine Crimson Radiant Card - Security & Presentation */}
        <div className="card-radiant-wine rounded-[32px] p-6 space-y-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-300" />
              <span className="font-mono text-xs text-red-200/80 font-semibold tracking-wider">SECURITY & SLIDES</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-black/40 border border-red-400/30 text-red-200 font-mono text-[10px]">
              WIN+L
            </div>
          </div>

          <div className="text-center py-2 space-y-1">
            <div className="flex justify-center">
              <DotMatrixDisplay value="LOCK" size="xl" color="#f87171" inactiveColor="rgba(255, 255, 255, 0.1)" />
            </div>
            <span className="font-mono text-[11px] text-red-200/70">WORKSTATION GUARD</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={() => trigger('LOCK_PC', 'LOCK PC (WIN+L)')}
              className="py-3 rounded-2xl bg-[#eb0029] hover:bg-[#c40022] active:scale-95 text-white font-dot text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>LOCK PC</span>
            </button>

            <button
              onClick={() => trigger('FULLSCREEN', 'FULLSCREEN (F5)')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>FULLSCREEN</span>
            </button>

            <button
              onClick={() => trigger('SLIDE_PREV', 'PREVIOUS SLIDE (PAGE UP)')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>SLIDE PREV</span>
            </button>

            <button
              onClick={() => trigger('SLIDE_NEXT', 'NEXT SLIDE (PAGE DOWN)')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>SLIDE NEXT</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 5: Arc Cyan Radiant Card (Reference 2 Top Right Arc Gauge) - Virtual Desktops */}
        <div className="card-radiant-cyan rounded-[32px] p-6 space-y-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-300" />
              <span className="font-mono text-xs text-cyan-200/80 font-semibold tracking-wider">VIRTUAL DESKTOPS</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-black/40 border border-cyan-400/30 text-cyan-200 font-mono text-[10px]">
              WIN+CTRL
            </div>
          </div>

          <div className="text-center py-2 space-y-1">
            <div className="flex justify-center">
              <DotMatrixDisplay value="VIRT" size="xl" color="#22d3ee" inactiveColor="rgba(255, 255, 255, 0.1)" />
            </div>
            <span className="font-mono text-[11px] text-cyan-200/70">SWITCH WORKSPACES</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={() => trigger('DESKTOP_LEFT', 'DESKTOP LEFT (WIN+CTRL+LEFT)')}
              className="py-3.5 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-cyan-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4 text-cyan-300" />
              <span>DESK LEFT</span>
            </button>

            <button
              onClick={() => trigger('DESKTOP_RIGHT', 'DESKTOP RIGHT (WIN+CTRL+RIGHT)')}
              className="py-3.5 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-cyan-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>DESK RIGHT</span>
              <ChevronRight className="w-4 h-4 text-cyan-300" />
            </button>
          </div>
        </div>

        {/* CARD 6: Royal Purple Radiant Card - Quick Clipboard & Editing */}
        <div className="card-radiant-purple rounded-[32px] p-6 space-y-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clipboard className="w-5 h-5 text-purple-300" />
              <span className="font-mono text-xs text-purple-200/80 font-semibold tracking-wider">EDITING SHORTCUTS</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-black/40 border border-purple-400/30 text-purple-200 font-mono text-[10px]">
              CTRL+KEY
            </div>
          </div>

          <div className="text-center py-2 space-y-1">
            <div className="flex justify-center">
              <DotMatrixDisplay value="EDIT" size="xl" color="#c084fc" inactiveColor="rgba(255, 255, 255, 0.1)" />
            </div>
            <span className="font-mono text-[11px] text-purple-200/70">CLIPBOARD COMMANDS</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2">
            <button
              onClick={() => trigger('COPY', 'COPY (CTRL+C)')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-purple-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>COPY</span>
            </button>

            <button
              onClick={() => trigger('PASTE', 'PASTE (CTRL+V)')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-purple-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>PASTE</span>
            </button>

            <button
              onClick={() => trigger('UNDO', 'UNDO (CTRL+Z)')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-purple-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>UNDO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
