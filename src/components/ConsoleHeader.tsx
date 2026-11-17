import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  Laptop,
  Settings,
  Terminal,
  Shield,
  RefreshCw,
  Maximize2,
  Minimize2,
  Sparkles,
  Smartphone,
  Download,
  BookOpen,
} from 'lucide-react';
import { DotMatrixDisplay } from './DotMatrixDisplay';
import { ConnectionState } from '../core/protocol/types';
import { PlatformType, PLATFORM_INFO } from '../core/protocol/dynamicActions';

interface ConsoleHeaderProps {
  connectionState: ConnectionState;
  latency: number;
  receiverHost: string;
  isRealConnected: boolean;
  activePlatform: PlatformType;
  setActivePlatform: (p: PlatformType) => void;
  onOpenConnectModal: () => void;
  activeTab: 'touchpad' | 'actions' | 'keyboard' | 'gamepad' | 'diagnostics' | 'settings';
  setActiveTab: (tab: 'touchpad' | 'actions' | 'keyboard' | 'gamepad' | 'diagnostics' | 'settings') => void;
}

export const ConsoleHeader: React.FC<ConsoleHeaderProps> = ({
  connectionState,
  latency,
  receiverHost,
  isRealConnected,
  activePlatform,
  setActivePlatform,
  onOpenConnectModal,
  activeTab,
  setActiveTab,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const getPlatformIcon = () => {
    if (activePlatform === 'windows') return '🪟';
    if (activePlatform === 'macos') return '🍏';
    return '🐧';
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#151922]/98 backdrop-blur-3xl border-b-2 border-[#eb0029] shadow-[0_8px_30px_rgba(0,0,0,0.8),0_4px_20px_rgba(235,0,41,0.35)] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap lg:flex-nowrap items-center justify-between gap-3">
        {/* LEFT: Distinct Brand & OS Target Lockup */}
        <div className="flex items-center gap-3">
          {/* Glowing Nothing Hardware Module */}
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-black/80 border border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25)]">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isRealConnected
                  ? 'bg-[#00e575] shadow-[0_0_10px_#00e575]'
                  : 'bg-[#eb0029] shadow-[0_0_10px_#eb0029]'
              } transition-all duration-300`}
            />
            {isRealConnected && (
              <span className="absolute w-5 h-5 rounded-full border border-emerald-400/50 animate-ping" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-dot text-base sm:text-lg font-bold tracking-widest text-white flex items-center gap-1 uppercase">
              <span>GLYPHPAD</span>
              <span className="text-[#eb0029] font-silk">/</span>
              <span className="text-zinc-400 font-sans text-xs font-bold tracking-normal">(1)</span>
            </span>

            {/* Platform Selector Pill */}
            <button
              onClick={onOpenConnectModal}
              className="font-mono text-[9px] px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
              title="Click to switch or discover computers"
            >
              <span className="text-xs">{getPlatformIcon()}</span>
              <span className="uppercase font-bold tracking-wider">{activePlatform}</span>
            </button>
          </div>
        </div>

        {/* CENTER: Slim High-Contrast Mode Dock (All 6 options visible, no cutoff) */}
        <nav className="flex items-center gap-1 p-1 rounded-xl bg-black/70 border border-white/15 overflow-x-auto scrollbar-none shadow-inner mx-auto lg:mx-0">
          <button
            onClick={() => setActiveTab('touchpad')}
            className={`px-3 py-1 rounded-lg font-dot text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'touchpad'
                ? 'bg-white text-black shadow-[0_0_14px_rgba(255,255,255,0.45)] scale-100'
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>TOUCHPAD</span>
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            className={`px-3 py-1 rounded-lg font-dot text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'actions'
                ? 'bg-[#eb0029] text-white shadow-[0_0_14px_rgba(235,0,41,0.5)]'
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>ACTIONS</span>
          </button>

          <button
            onClick={() => setActiveTab('keyboard')}
            className={`px-3 py-1 rounded-lg font-dot text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'keyboard'
                ? 'bg-sky-500 text-black shadow-[0_0_14px_rgba(14,165,233,0.45)]'
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>KEYS</span>
          </button>

          <button
            onClick={() => setActiveTab('gamepad')}
            className={`px-3 py-1 rounded-lg font-dot text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'gamepad'
                ? 'bg-purple-500 text-white shadow-[0_0_14px_rgba(168,85,247,0.45)]'
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>D-PAD</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-3 py-1 rounded-lg font-dot text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'diagnostics'
                ? 'bg-emerald-500 text-black shadow-[0_0_14px_rgba(16,185,129,0.45)]'
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>STATS</span>
          </button>

          {/* Prominent SETTINGS tab with clear amber highlight and icon */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1 rounded-lg font-dot text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-amber-400 text-black shadow-[0_0_14px_rgba(251,191,36,0.6)] font-bold'
                : 'text-amber-400 hover:text-amber-300 hover:bg-amber-400/15'
            }`}
            title="User Customization & Touchpad Settings"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>SETTINGS</span>
          </button>
        </nav>

        {/* RIGHT: Fast Connectivity & Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Pair PC / Status Badge */}
          <button
            onClick={onOpenConnectModal}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all active:scale-95 text-xs font-dot font-bold ${
              isRealConnected
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.3)]'
                : 'bg-gradient-to-r from-[#eb0029] to-[#b3001e] hover:from-[#ff1a40] hover:to-[#eb0029] border-[#eb0029] text-white shadow-[0_0_14px_rgba(235,0,41,0.4)]'
            }`}
          >
            {isRealConnected ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px]">{latency}MS</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-white" />
                <span>PAIR PC</span>
              </>
            )}
          </button>

          {/* Quick Receiver Download */}
          <a
            href="/DigitalTouchpad-Receiver.zip"
            download="DigitalTouchpad-Receiver.zip"
            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-zinc-200 hover:text-white transition-all hidden sm:flex items-center gap-1 font-mono text-[10px]"
            title="Download 1-Click Desktop Receiver for Windows (75 KB, Zero Terminal)"
          >
            <Download className="w-3 h-3 text-[#00e575]" />
            <span className="font-dot font-semibold">GET (.ZIP)</span>
          </a>

          {/* Quick Settings Button */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`p-1.5 rounded-lg border transition-all ${
              activeTab === 'settings'
                ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)] font-bold'
                : 'bg-white/10 hover:bg-amber-400/20 text-zinc-300 hover:text-amber-300 border-white/15'
            }`}
            title="Touchpad Settings & Customization"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-zinc-300 hover:text-white transition-colors hidden sm:flex"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
