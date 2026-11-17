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
import { PlatformType, PLATFORM_INFO } from '../core/protocol/dynamicActions';
import { nothingAudio } from '../utils/audioFeedback';

interface QuickActionsGridProps {
  onAction: (action: string) => void;
  hapticEnabled: boolean;
  activePlatform: PlatformType;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  onAction,
  hapticEnabled,
  activePlatform,
}) => {
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
    nothingAudio.playClick('light');
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

  const platformInfo = PLATFORM_INFO[activePlatform];

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-6 space-y-6">
      {/* HUD Active Action Notification Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#121417] border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#eb0029]" />
          <span className="font-dot text-xs text-white tracking-wider">
            {platformInfo.name.toUpperCase()} SYSTEM CONTROLS
          </span>
        </div>
        <div className="flex items-center gap-2">
          {activeFeedback ? (
            <span className="px-3 py-1 rounded-full bg-[#eb0029] text-white font-dot text-xs font-bold animate-pulse shadow-[0_0_12px_#eb0029]">
              {activeFeedback}
            </span>
          ) : (
            <span className="font-mono text-xs text-zinc-400 hidden sm:inline">
              DYNAMIC CAPABILITY MANIFEST • {activePlatform.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* SECTION 1: DYNAMIC SYSTEM APPLICATIONS (ADAPTED TO CONNECTED OS) */}
      <div className="rounded-[32px] bg-[#111315] border border-white/10 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-emerald-400" />
            <span className="font-dot text-xs text-white tracking-wider">
              {activePlatform === 'windows'
                ? 'WINDOWS APPLICATIONS & TOOLS'
                : activePlatform === 'macos'
                ? 'APPLE MACOS APPS & UTILITIES'
                : 'LINUX DESKTOP UTILITIES'}
            </span>
          </div>
          <span className="font-mono text-[10px] text-zinc-500">DYNAMIC LAUNCHERS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {/* Settings / System Preferences */}
          <button
            onClick={() =>
              trigger(
                'SETTINGS',
                activePlatform === 'windows'
                  ? 'SETTINGS (WIN+I)'
                  : activePlatform === 'macos'
                  ? 'SYSTEM SETTINGS (CMD+,)'
                  : 'SETTINGS'
              )
            }
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <Settings className="w-4 h-4 text-zinc-300" />
            <span>{activePlatform === 'macos' ? 'SYS PREFS' : 'SETTINGS'}</span>
          </button>

          {/* File Manager / Finder */}
          <button
            onClick={() =>
              trigger(
                'FILE_MANAGER',
                activePlatform === 'windows' ? 'EXPLORER (WIN+E)' : activePlatform === 'macos' ? 'FINDER' : 'FILES'
              )
            }
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <Folder className="w-4 h-4 text-amber-400" />
            <span>{activePlatform === 'macos' ? 'FINDER' : activePlatform === 'windows' ? 'EXPLORER' : 'FILES'}</span>
          </button>

          {/* Search / Spotlight / Overview */}
          <button
            onClick={() =>
              trigger(
                'SEARCH',
                activePlatform === 'windows' ? 'SEARCH (WIN+S)' : activePlatform === 'macos' ? 'SPOTLIGHT (CMD+SPACE)' : 'OVERVIEW'
              )
            }
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <Search className="w-4 h-4 text-blue-400" />
            <span>{activePlatform === 'macos' ? 'SPOTLIGHT' : 'SEARCH'}</span>
          </button>

          {/* Task Manager / Activity Monitor */}
          <button
            onClick={() =>
              trigger(
                'TASK_MANAGER',
                activePlatform === 'macos' ? 'ACTIVITY MONITOR' : 'TASK MANAGER'
              )
            }
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>{activePlatform === 'macos' ? 'ACTIVITY' : 'TASK MGR'}</span>
          </button>

          {/* Terminal */}
          <button
            onClick={() => trigger('TERMINAL', 'TERMINAL')}
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>TERMINAL</span>
          </button>

          {/* Calculator */}
          <button
            onClick={() => trigger('CALCULATOR', 'CALCULATOR')}
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <Calculator className="w-4 h-4 text-rose-400" />
            <span>CALC</span>
          </button>

          {/* Web Browser */}
          <button
            onClick={() => trigger('BROWSER', activePlatform === 'macos' ? 'SAFARI / BROWSER' : 'DEFAULT BROWSER')}
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <Globe className="w-4 h-4 text-sky-400" />
            <span>{activePlatform === 'macos' ? 'SAFARI' : 'BROWSER'}</span>
          </button>

          {/* Text Editor */}
          <button
            onClick={() => trigger('NOTEPAD', activePlatform === 'macos' ? 'TEXTEDIT' : 'NOTEPAD')}
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <FileText className="w-4 h-4 text-zinc-300" />
            <span>{activePlatform === 'macos' ? 'TEXTEDIT' : 'NOTEPAD'}</span>
          </button>

          {/* Screenshot / Snipping Tool */}
          <button
            onClick={() =>
              trigger(
                'SNIP',
                activePlatform === 'windows' ? 'SNIPPING TOOL (WIN+SHIFT+S)' : activePlatform === 'macos' ? 'CAPTURE (CMD+SHIFT+4)' : 'SCREENSHOT'
              )
            }
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <Camera className="w-4 h-4 text-purple-400" />
            <span>{activePlatform === 'macos' ? 'SCREENSHOT' : 'SNIP TOOL'}</span>
          </button>

          {/* Mission Control / Task View */}
          <button
            onClick={() =>
              trigger(
                'TASK_VIEW',
                activePlatform === 'macos' ? 'MISSION CONTROL (F3)' : 'TASK VIEW (WIN+TAB)'
              )
            }
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <Layers className="w-4 h-4 text-teal-400" />
            <span>{activePlatform === 'macos' ? 'MISSION CTRL' : 'TASK VIEW'}</span>
          </button>

          {/* Desktop Toggle */}
          <button
            onClick={() =>
              trigger(
                'SHOW_DESKTOP',
                activePlatform === 'windows' ? 'DESKTOP (WIN+D)' : activePlatform === 'macos' ? 'DESKTOP (F11)' : 'DESKTOP (SUPER+D)'
              )
            }
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <Monitor className="w-4 h-4 text-emerald-400" />
            <span>DESKTOP</span>
          </button>

          {/* App Switcher */}
          <button
            onClick={() =>
              trigger(
                'ALT_TAB',
                activePlatform === 'macos' ? 'APP SWITCH (CMD+TAB)' : 'APP SWITCH (ALT+TAB)'
              )
            }
            className="py-3.5 px-2 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>{activePlatform === 'macos' ? 'CMD+TAB' : 'ALT+TAB'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: RADIANT CONTROL CARDS (EXACT MATCH FOR REFERENCE 2 IMAGES) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* CARD 1: Radiant Rose / Pink (Reference 2 Center Card) - Audio Master */}
        <div className="card-radiant-pink rounded-[32px] p-6 space-y-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-rose-300" />
              <span className="font-mono text-xs text-rose-200/80 font-semibold tracking-wider">AUDIO MASTER</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-black/40 border border-rose-400/30 text-rose-200 font-mono text-[10px] uppercase">
              {activePlatform} AUDIO
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

          {/* Equalizer Visualizer Bars from Reference 2 */}
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

        {/* CARD 2: Emerald Mint Radiant Card - Window Management */}
        <div className="card-radiant-green rounded-[32px] p-6 space-y-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-emerald-300" />
              <span className="font-mono text-xs text-emerald-200/80 font-semibold tracking-wider">WINDOW CONTROL</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-black/40 border border-emerald-400/30 text-emerald-200 font-mono text-[10px]">
              {platformInfo.defaultKeyModifiers.meta} SHORTCUTS
            </div>
          </div>

          <div className="text-center py-2 space-y-1">
            <div className="flex justify-center">
              <DotMatrixDisplay value="WIND" size="xl" color="#34d399" inactiveColor="rgba(255, 255, 255, 0.1)" />
            </div>
            <span className="font-mono text-[11px] text-emerald-200/70">WORKSPACE TILES</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={() => trigger('SHOW_DESKTOP', 'DESKTOP VIEW')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-emerald-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Monitor className="w-3.5 h-3.5 text-emerald-300" />
              <span>DESKTOP</span>
            </button>

            <button
              onClick={() => trigger('TASK_VIEW', activePlatform === 'macos' ? 'MISSION CONTROL' : 'TASK VIEW')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-emerald-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-300" />
              <span>{activePlatform === 'macos' ? 'MISSION CTRL' : 'TASK VIEW'}</span>
            </button>

            <button
              onClick={() => trigger('SNAP_LEFT', 'SNAP LEFT')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-emerald-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-emerald-300" />
              <span>TILE LEFT</span>
            </button>

            <button
              onClick={() => trigger('SNAP_RIGHT', 'SNAP RIGHT')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-emerald-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>TILE RIGHT</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
            </button>

            <button
              onClick={() => trigger('MAXIMIZE', 'MAXIMIZE / FULLSCREEN')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-emerald-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Maximize2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>MAXIMIZE</span>
            </button>

            <button
              onClick={() => trigger('MINIMIZE_ALL', 'MINIMIZE WINDOWS')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-emerald-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Minimize2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>MINIMIZE</span>
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

        {/* CARD 4: Arc Cyan Radiant Card - Workspaces & Virtual Desktops */}
        <div className="card-radiant-cyan rounded-[32px] p-6 space-y-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-300" />
              <span className="font-mono text-xs text-cyan-200/80 font-semibold tracking-wider">
                {activePlatform === 'macos' ? 'MAC SPACES' : 'VIRTUAL DESKTOPS'}
              </span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-black/40 border border-cyan-400/30 text-cyan-200 font-mono text-[10px]">
              {activePlatform === 'macos' ? 'CTRL+ARROWS' : 'WIN+CTRL'}
            </div>
          </div>

          <div className="text-center py-2 space-y-1">
            <div className="flex justify-center">
              <DotMatrixDisplay value="VIRT" size="xl" color="#22d3ee" inactiveColor="rgba(255, 255, 255, 0.1)" />
            </div>
            <span className="font-mono text-[11px] text-cyan-200/70">SWITCH SPACES</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={() => trigger('DESKTOP_LEFT', 'DESKTOP / SPACE LEFT')}
              className="py-3.5 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-cyan-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4 text-cyan-300" />
              <span>SPACE LEFT</span>
            </button>

            <button
              onClick={() => trigger('DESKTOP_RIGHT', 'DESKTOP / SPACE RIGHT')}
              className="py-3.5 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-cyan-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>SPACE RIGHT</span>
              <ChevronRight className="w-4 h-4 text-cyan-300" />
            </button>

            <button
              onClick={() => trigger('NEW_DESKTOP', 'CREATE NEW DESKTOP')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-cyan-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>+ NEW SPACE</span>
            </button>

            <button
              onClick={() => trigger('CLOSE_DESKTOP', 'CLOSE CURRENT SPACE')}
              className="py-3 rounded-2xl bg-black/40 hover:bg-black/60 active:bg-cyan-600 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>✕ CLOSE SPACE</span>
            </button>
          </div>
        </div>

        {/* CARD 5: Presentation Remote Card */}
        <div className="card-radiant-wine rounded-[32px] p-6 space-y-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tv className="w-5 h-5 text-amber-300" />
              <span className="font-mono text-xs text-amber-200/80 font-semibold tracking-wider">PRESENTATION REMOTE</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-black/40 border border-amber-400/30 text-amber-200 font-mono text-[10px]">
              KEYNOTE / PPT
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
              onClick={() => trigger('START_SLIDES', 'START PRESENTATION')}
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
              onClick={() => trigger('SLIDE_PREV', 'PREV SLIDE')}
              className="py-3.5 rounded-2xl bg-black/40 hover:bg-black/60 active:scale-95 border border-white/10 text-white font-dot text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4 text-amber-300" />
              <span>PREV SLIDE</span>
            </button>

            <button
              onClick={() => trigger('SLIDE_NEXT', 'NEXT SLIDE')}
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

        {/* CARD 6: Power & Security with PRD Page 9 Safety Guardrails */}
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
              onClick={() =>
                trigger(
                  'LOCK_PC',
                  activePlatform === 'macos' ? 'LOCK SCREEN (CTRL+CMD+Q)' : 'LOCK WORKSTATION'
                )
              }
              className="py-3 rounded-2xl bg-[#eb0029] hover:bg-[#c40022] active:scale-95 text-white font-dot text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>LOCK SCREEN</span>
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

      {/* SECTION 3: DYNAMIC EDITING SHORTCUTS */}
      <div className="rounded-[32px] bg-[#111315] border border-white/10 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clipboard className="w-4 h-4 text-purple-400" />
            <span className="font-dot text-xs text-white tracking-wider">
              {activePlatform === 'macos' ? 'COMMAND ⌘ SHORTCUTS' : 'CTRL+KEY SHORTCUTS'}
            </span>
          </div>
          <span className="font-mono text-[10px] text-zinc-500">{platformInfo.defaultKeyModifiers.ctrl}+KEY</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
          <button
            onClick={() => trigger('COPY', activePlatform === 'macos' ? 'COPY (CMD+C)' : 'COPY (CTRL+C)')}
            className="py-3 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
          >
            <Copy className="w-3.5 h-3.5 text-zinc-300" />
            <span>COPY</span>
          </button>

          <button
            onClick={() => trigger('PASTE', activePlatform === 'macos' ? 'PASTE (CMD+V)' : 'PASTE (CTRL+V)')}
            className="py-3 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
          >
            <Clipboard className="w-3.5 h-3.5 text-zinc-300" />
            <span>PASTE</span>
          </button>

          <button
            onClick={() => trigger('CUT', activePlatform === 'macos' ? 'CUT (CMD+X)' : 'CUT (CTRL+X)')}
            className="py-3 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
          >
            <Scissors className="w-3.5 h-3.5 text-zinc-300" />
            <span>CUT</span>
          </button>

          <button
            onClick={() => trigger('UNDO', activePlatform === 'macos' ? 'UNDO (CMD+Z)' : 'UNDO (CTRL+Z)')}
            className="py-3 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
          >
            <Undo2 className="w-3.5 h-3.5 text-zinc-300" />
            <span>UNDO</span>
          </button>

          <button
            onClick={() => trigger('REDO', activePlatform === 'macos' ? 'REDO (CMD+SHIFT+Z)' : 'REDO (CTRL+Y)')}
            className="py-3 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
          >
            <Redo2 className="w-3.5 h-3.5 text-zinc-300" />
            <span>REDO</span>
          </button>

          <button
            onClick={() => trigger('SELECT_ALL', activePlatform === 'macos' ? 'SELECT ALL (CMD+A)' : 'SELECT ALL (CTRL+A)')}
            className="py-3 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
          >
            <AppWindow className="w-3.5 h-3.5 text-zinc-300" />
            <span>ALL</span>
          </button>

          <button
            onClick={() => trigger('SAVE', activePlatform === 'macos' ? 'SAVE (CMD+S)' : 'SAVE (CTRL+S)')}
            className="py-3 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
          >
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            <span>SAVE</span>
          </button>

          <button
            onClick={() => trigger('FIND', activePlatform === 'macos' ? 'FIND (CMD+F)' : 'FIND (CTRL+F)')}
            className="py-3 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:scale-95 border border-white/10 text-white font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1"
          >
            <Search className="w-3.5 h-3.5 text-blue-400" />
            <span>FIND</span>
          </button>
        </div>
      </div>

      {/* POWER ACTION CONFIRMATION SHEET MODAL (PRD Page 9 Explicit Guardrail) */}
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
                PRD Safety Guardrail: This will affect the running session on your {platformInfo.name}.
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
