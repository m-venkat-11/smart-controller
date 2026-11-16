import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Volume1,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Square,
  Lock,
  Monitor,
  Layers,
  Copy,
  Scissors,
  Clipboard,
  Undo2,
  Redo2,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Camera,
  Activity,
  Sliders,
  Sparkles,
  Settings,
  Folder,
  Search,
  Terminal,
  Calculator,
  Globe,
  FileText,
  SlidersHorizontal,
  Power,
  RefreshCw,
  Moon,
  AlertTriangle,
  X,
  Tv,
  Save,
  ZoomIn,
  ZoomOut,
  AppWindow,
  LayoutGrid,
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

  // Power action safety confirmation sheet (PRD Page 9 requirement)
  const [powerModal, setPowerModal] = useState<{
    isOpen: boolean;
    action: 'SLEEP' | 'RESTART' | 'SHUTDOWN' | null;
    countdown: number;
  }>({
    isOpen: false,
    action: null,
    countdown: 10,
  });

  const vibrate = (ms: number = 20) => {
    if (hapticEnabled && typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(ms);
    }
  };

  const trigger = (action: string, label: string) => {
    onAction(action);
    setActiveFeedback(label);
    vibrate(25);
    setTimeout(() => setActiveFeedback(null), 1200);
  };

  // Countdown timer for power operations
  useEffect(() => {
    let timer: any;
    if (powerModal.isOpen && powerModal.countdown > 0) {
      timer = setTimeout(() => {
        setPowerModal((prev) => ({ ...prev, countdown: prev.countdown - 1 }));
      }, 1000);
    } else if (powerModal.isOpen && powerModal.countdown === 0 && powerModal.action) {
      // Execute the power action after countdown expires
      onAction(powerModal.action);
      setActiveFeedback(`EXECUTED: ${powerModal.action}`);
      setPowerModal({ isOpen: false, action: null, countdown: 10 });
    }
    return () => clearTimeout(timer);
  }, [powerModal.isOpen, powerModal.countdown, powerModal.action, onAction]);

  const openPowerConfirmation = (action: 'SLEEP' | 'RESTART' | 'SHUTDOWN') => {
    vibrate(35);
    setPowerModal({
      isOpen: true,
      action,
      countdown: action === 'SLEEP' ? 3 : 10,
    });
  };

  const cancelPowerAction = () => {
    vibrate(20);
    setPowerModal({ isOpen: false, action: null, countdown: 10 });
  };

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-6 space-y-6">
      {/* HUD Active Action Notification Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#121417] border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#eb0029]" />
          <span className="font-dot text-xs text-white tracking-wider">WINDOWS SYSTEM CONTROLS & APPS</span>
        </div>
        <div className="flex items-center gap-2">
          {activeFeedback ? (
            <span className="px-3 py-1 rounded-full bg-[#eb0029] text-white font-dot text-xs font-bold animate-pulse shadow-[0_0_12px_#eb0029]">
              {activeFeedback}
            </span>
          ) : (
            <span className="font-mono text-xs text-zinc-500 hidden sm:inline">
              ALLOWLISTED SYSTEM COMMANDS
            </span>
          )}
        </div>
      </div>

      {/* SECTION 1: ESSENTIAL WINDOWS APPS & LAUNCHERS (PRD Section 09 P0/P1) */}
      <div className="rounded-[32px] bg-[#111315] border border-white/10 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-emerald-400" />
            <span className="font-dot text-xs text-white tracking-wider">ALLOWLISTED WINDOWS APPLICATIONS</span>
          </div>
          <span className="font-mono text-[10px] text-zinc-500">P0 / P1 TARGETS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          <button
            onClick={() => trigger('SETTINGS', 'SETTINGS (WIN+I)')}
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <Settings className="w-4 h-4 text-zinc-300" />
            <span>SETTINGS</span>
          </button>

          <button
            onClick={() => trigger('EXPLORER', 'FILE EXPLORER (WIN+E)')}
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <Folder className="w-4 h-4 text-amber-400" />
            <span>EXPLORER</span>
          </button>

          <button
            onClick={() => trigger('SEARCH', 'WINDOWS SEARCH (WIN+S)')}
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <Search className="w-4 h-4 text-blue-400" />
            <span>SEARCH</span>
          </button>

          <button
            onClick={() => trigger('TASK_MANAGER', 'TASK MANAGER')}
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>TASK MGR</span>
          </button>

          <button
            onClick={() => trigger('TERMINAL', 'TERMINAL / POWERSHELL')}
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>TERMINAL</span>
          </button>

          <button
            onClick={() => trigger('CALCULATOR', 'CALCULATOR')}
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <Calculator className="w-4 h-4 text-rose-400" />
            <span>CALC</span>
          </button>

          <button
            onClick={() => trigger('BROWSER', 'DEFAULT BROWSER')}
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <Globe className="w-4 h-4 text-sky-400" />
            <span>BROWSER</span>
          </button>

          <button
            onClick={() => trigger('NOTEPAD', 'NOTEPAD')}
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <FileText className="w-4 h-4 text-zinc-300" />
            <span>NOTEPAD</span>
          </button>

          <button
            onClick={() => trigger('CONTROL_PANEL', 'CONTROL PANEL')}
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            <span>CONTROL</span>
          </button>

          <button
            onClick={() => trigger('SNIP', 'SNIPPING TOOL (WIN+SHIFT+S)')}
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <Camera className="w-4 h-4 text-purple-400" />
            <span>SNIP TOOL</span>
          </button>

          <button
            onClick={() => trigger('SCREENSHOT', 'FULL SCREENSHOT (PRTSCN)')}
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <Camera className="w-4 h-4 text-teal-400" />
            <span>PRTSCN</span>
          </button>

          <button
            onClick={() => trigger('PROJECT_SCREEN', 'PROJECT SCREEN (WIN+P)')}
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <Tv className="w-4 h-4 text-orange-400" />
            <span>PROJECT</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: RADIANT JEWEL-TONE CONTROL CARDS (EXACT MATCH FOR REFERENCE 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* CARD 1: Radiant Rose / Pink (Reference 2 Center Card) - Audio & Volume Master */}
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
                trigger('VOL_DOWN', 'VOL DOWN (-)');
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
                trigger('VOL_UP', 'VOL UP (+)');
              }}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>VOL +</span>
            </button>
          </div>
        </div>

        {/* CARD 2: Emerald Mint Radiant Card - Window & Screen Management */}
        <div className="card-radiant-green rounded-[32px] p-6 space-y-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-emerald-300" />
              <span className="font-mono text-xs text-emerald-200/80 font-semibold tracking-wider">WINDOW CONTROL</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-black/40 border border-emerald-400/30 text-emerald-200 font-mono text-[10px]">
              WIN+KEY
            </div>
          </div>

          <div className="text-center py-2 space-y-1">
            <div className="flex justify-center">
              <DotMatrixDisplay value="WIND" size="xl" color="#34d399" inactiveColor="rgba(255, 255, 255, 0.1)" />
            </div>
            <span className="font-mono text-[11px] text-emerald-200/70">DESKTOP MANAGEMENT</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={() => trigger('SHOW_DESKTOP', 'SHOW DESKTOP (WIN+D)')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-emerald-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Monitor className="w-3.5 h-3.5 text-emerald-300" />
              <span>DESKTOP</span>
            </button>

            <button
              onClick={() => trigger('TASK_VIEW', 'TASK VIEW (WIN+TAB)')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-emerald-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-300" />
              <span>TASK VIEW</span>
            </button>

            <button
              onClick={() => trigger('MINIMIZE_ALL', 'MINIMIZE ALL (WIN+M)')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-emerald-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Minimize2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>MIN ALL</span>
            </button>

            <button
              onClick={() => trigger('RESTORE_ALL', 'RESTORE ALL (WIN+SHIFT+M)')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-emerald-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Maximize2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>RESTORE</span>
            </button>

            <button
              onClick={() => trigger('SNAP_LEFT', 'SNAP WINDOW LEFT')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-emerald-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-emerald-300" />
              <span>SNAP L</span>
            </button>

            <button
              onClick={() => trigger('SNAP_RIGHT', 'SNAP WINDOW RIGHT')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-emerald-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>SNAP R</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
            </button>
          </div>
        </div>

        {/* CARD 3: Deep Ocean Sapphire Blue Radiant Card - Media Controller */}
        <div className="card-radiant-blue rounded-[32px] p-6 space-y-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-blue-300" />
              <span className="font-mono text-xs text-blue-200/80 font-semibold tracking-wider">MEDIA CONTROLLER</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-black/40 border border-blue-400/30 text-blue-200 font-mono text-[10px]">
              UNIVERSAL
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
            <span className="font-mono text-[11px] text-blue-200/70">PLAYBACK ENGINE</span>
          </div>

          {/* Media Control Action Buttons */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            <button
              onClick={() => trigger('MEDIA_PREV', 'PREVIOUS TRACK')}
              className="py-3.5 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-blue-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsPlaying(!isPlaying);
                trigger('MEDIA_PLAY_PAUSE', isPlaying ? 'PAUSE' : 'PLAY');
              }}
              className="col-span-2 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-dot text-xs font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            <button
              onClick={() => trigger('MEDIA_NEXT', 'NEXT TRACK')}
              className="py-3.5 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-blue-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CARD 4: Arc Cyan Radiant Card - Virtual Desktops */}
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
            <span className="font-mono text-[11px] text-cyan-200/70">WORKSPACES</span>
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

            <button
              onClick={() => trigger('NEW_DESKTOP', 'NEW DESKTOP (WIN+CTRL+D)')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-cyan-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>+ NEW DESK</span>
            </button>

            <button
              onClick={() => trigger('CLOSE_DESKTOP', 'CLOSE DESKTOP (WIN+CTRL+F4)')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-cyan-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>✕ CLOSE DESK</span>
            </button>
          </div>
        </div>

        {/* CARD 5: Presentation Remote Card (Master Prompt 10.3) */}
        <div className="card-radiant-wine rounded-[32px] p-6 space-y-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tv className="w-5 h-5 text-amber-300" />
              <span className="font-mono text-xs text-amber-200/80 font-semibold tracking-wider">PRESENTATION REMOTE</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-black/40 border border-amber-400/30 text-amber-200 font-mono text-[10px]">
              SLIDES / PPT
            </div>
          </div>

          <div className="text-center py-2 space-y-1">
            <div className="flex justify-center">
              <DotMatrixDisplay value="PPT" size="xl" color="#fbbf24" inactiveColor="rgba(255, 255, 255, 0.1)" />
            </div>
            <span className="font-mono text-[11px] text-amber-200/70">SLIDE CONTROL</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={() => trigger('START_SLIDES', 'START PRESENTATION (F5)')}
              className="py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>START (F5)</span>
            </button>

            <button
              onClick={() => trigger('END_SLIDES', 'END SLIDES (ESC)')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Square className="w-3.5 h-3.5" />
              <span>END (ESC)</span>
            </button>

            <button
              onClick={() => trigger('SLIDE_PREV', 'PREV SLIDE (PAGE UP)')}
              className="py-3.5 rounded-2xl bg-black/40 hover:bg-black/60 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4 text-amber-300" />
              <span>PREV SLIDE</span>
            </button>

            <button
              onClick={() => trigger('SLIDE_NEXT', 'NEXT SLIDE (PAGE DOWN)')}
              className="py-3.5 rounded-2xl bg-black/40 hover:bg-black/60 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>NEXT SLIDE</span>
              <ChevronRight className="w-4 h-4 text-amber-300" />
            </button>

            <button
              onClick={() => trigger('BLACK_SCREEN', 'BLACK SCREEN (B)')}
              className="py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 active:scale-95 border border-white/10 text-zinc-300 font-mono text-[10px] transition-all flex items-center justify-center"
            >
              BLACK (B)
            </button>

            <button
              onClick={() => trigger('WHITE_SCREEN', 'WHITE SCREEN (W)')}
              className="py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 active:scale-95 border border-white/10 text-zinc-300 font-mono text-[10px] transition-all flex items-center justify-center"
            >
              WHITE (W)
            </button>
          </div>
        </div>

        {/* CARD 6: Power, Session Security & Confirmation (PRD Page 9 Requirement) */}
        <div className="card-radiant-wine rounded-[32px] p-6 space-y-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Power className="w-5 h-5 text-red-400" />
              <span className="font-mono text-xs text-red-200/80 font-semibold tracking-wider">POWER & SECURITY</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-black/40 border border-red-400/30 text-red-200 font-mono text-[10px]">
              GUARDRAILS
            </div>
          </div>

          <div className="text-center py-2 space-y-1">
            <div className="flex justify-center">
              <DotMatrixDisplay value="POWR" size="xl" color="#f87171" inactiveColor="rgba(255, 255, 255, 0.1)" />
            </div>
            <span className="font-mono text-[11px] text-red-200/70">SAFE POWER ACTIONS</span>
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
              onClick={() => openPowerConfirmation('SLEEP')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Moon className="w-3.5 h-3.5 text-blue-300" />
              <span>SLEEP</span>
            </button>

            <button
              onClick={() => openPowerConfirmation('RESTART')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>RESTART</span>
            </button>

            <button
              onClick={() => openPowerConfirmation('SHUTDOWN')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:scale-95 border border-red-500/30 text-red-300 font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Power className="w-3.5 h-3.5 text-red-400" />
              <span>SHUTDOWN</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: EDITING SHORTCUTS & CLIPBOARD (Master Prompt 10.1) */}
      <div className="rounded-[32px] bg-[#111315] border border-white/10 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clipboard className="w-4 h-4 text-purple-400" />
            <span className="font-dot text-xs text-white tracking-wider">EDITING & WORKFLOW SHORTCUTS</span>
          </div>
          <span className="font-mono text-[10px] text-zinc-500">CTRL+KEY</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
          <button
            onClick={() => trigger('COPY', 'COPY (CTRL+C)')}
            className="py-3 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
          >
            <Copy className="w-3.5 h-3.5 text-zinc-300" />
            <span>COPY</span>
          </button>

          <button
            onClick={() => trigger('PASTE', 'PASTE (CTRL+V)')}
            className="py-3 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
          >
            <Clipboard className="w-3.5 h-3.5 text-zinc-300" />
            <span>PASTE</span>
          </button>

          <button
            onClick={() => trigger('CUT', 'CUT (CTRL+X)')}
            className="py-3 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
          >
            <Scissors className="w-3.5 h-3.5 text-zinc-300" />
            <span>CUT</span>
          </button>

          <button
            onClick={() => trigger('UNDO', 'UNDO (CTRL+Z)')}
            className="py-3 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
          >
            <Undo2 className="w-3.5 h-3.5 text-zinc-300" />
            <span>UNDO</span>
          </button>

          <button
            onClick={() => trigger('REDO', 'REDO (CTRL+Y)')}
            className="py-3 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
          >
            <Redo2 className="w-3.5 h-3.5 text-zinc-300" />
            <span>REDO</span>
          </button>

          <button
            onClick={() => trigger('SELECT_ALL', 'SELECT ALL (CTRL+A)')}
            className="py-3 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
          >
            <AppWindow className="w-3.5 h-3.5 text-zinc-300" />
            <span>ALL</span>
          </button>

          <button
            onClick={() => trigger('SAVE', 'SAVE FILE (CTRL+S)')}
            className="py-3 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
          >
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            <span>SAVE</span>
          </button>

          <button
            onClick={() => trigger('FIND', 'FIND IN PAGE (CTRL+F)')}
            className="py-3 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
          >
            <Search className="w-3.5 h-3.5 text-blue-400" />
            <span>FIND</span>
          </button>
        </div>
      </div>

      {/* POWER ACTION CONFIRMATION SHEET MODAL (PRD Page 9 Explicit Requirement) */}
      {powerModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-[32px] bg-[#14171a] border border-red-500/40 p-6 space-y-6 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-[#eb0029] animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="font-dot text-lg font-bold text-white tracking-wider">
                CONFIRM {powerModal.action} REQUEST
              </h3>
              <p className="font-sans text-xs text-zinc-300">
                PRD Safety Guardrail: This action will impact your running workstation session.
              </p>
            </div>

            {/* Countdown Badge */}
            <div className="py-3 px-6 rounded-2xl bg-black/60 border border-white/15 inline-flex flex-col items-center justify-center">
              <span className="font-mono text-xs text-zinc-400">EXECUTING IN:</span>
              <div className="pt-1">
                <DotMatrixDisplay value={`${powerModal.countdown}S`} size="lg" color="#eb0029" />
              </div>
            </div>

            {/* Action & Cancel Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={cancelPowerAction}
                className="py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-dot text-xs font-bold transition-all border border-white/20"
              >
                CANCEL (ABORT)
              </button>

              <button
                onClick={() => {
                  if (powerModal.action) {
                    onAction(powerModal.action);
                    setActiveFeedback(`EXECUTED: ${powerModal.action}`);
                  }
                  setPowerModal({ isOpen: false, action: null, countdown: 10 });
                }}
                className="py-3.5 rounded-2xl bg-[#eb0029] hover:bg-[#c40022] active:scale-95 text-white font-dot text-xs font-bold transition-all shadow-[0_0_20px_rgba(235,0,41,0.5)]"
              >
                EXECUTE NOW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
