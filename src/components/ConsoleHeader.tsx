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
    <header className="sticky top-0 z-40 px-2 sm:px-4 pt-2 pb-1 pointer-events-none">
      {/* Floating Island Command Capsule */}
      <div className="pointer-events-auto max-w-7xl mx-auto rounded-2xl bg-gradient-to-r from-[#0c1015]/95 via-[#131922]/95 to-[#0c1015]/95 backdrop-blur-2xl border border-white/[0.14] shadow-[0_8px_32px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-wrap lg:flex-nowrap items-center justify-between gap-2.5 px-3 sm:px-4 py-2 transition-all">
        {/* LEFT: Compact Brand & Device Status */}
        <div className="flex items-center gap-2.5">
          {/* Glowing Nothing Hardware Jewel */}
          <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-black/60 border border-white/20 shadow-inner">
            <span
              className={`w-2 h-2 rounded-full ${
                isRealConnected
                  ? 'bg-[#00e575] shadow-[0_0_8px_#00e575]'
                  : 'bg-[#eb0029] shadow-[0_0_8px_#eb0029]'
              } transition-all duration-300`}
            />
            {isRealConnected && (
              <span className="absolute w-4 h-4 rounded-full border border-emerald-400/50 animate-ping" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-dot text-sm font-bold tracking-wider text-white flex items-center gap-1 uppercase">
              <span>GLYPHPAD</span>
              <span className="text-[#eb0029] font-silk text-xs">/</span>
              <span className="text-[10px] font-mono text-zinc-400 font-bold">(1)</span>
            </span>

            {/* Platform Selector Pill */}
            <button
              onClick={onOpenConnectModal}
              className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-zinc-200 flex items-center gap-1 transition-all active:scale-95 shadow-sm"
              title="Click to switch or discover computers"
            >
              <span className="text-xs">{getPlatformIcon()}</span>
              <span className="uppercase font-bold tracking-wider">{activePlatform}</span>
            </button>
          </div>
        </div>

        {/* CENTER: Slim Tactical Mode Switcher (All 6 options visible, no cutoff) */}
        <nav className="flex items-center gap-1 p-0.5 rounded-xl bg-black/60 border border-white/10 overflow-x-auto scrollbar-none shadow-inner mx-auto lg:mx-0">
          <button
            onClick={() => setActiveTab('touchpad')}
            className={`px-3 py-1 rounded-lg font-dot text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'touchpad'
                ? 'bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.4)] scale-100'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <span>TOUCHPAD</span>
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            className={`px-3 py-1 rounded-lg font-dot text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'actions'
                ? 'bg-[#eb0029] text-white shadow-[0_0_12px_rgba(235,0,41,0.5)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <span>ACTIONS</span>
          </button>

          <button
            onClick={() => setActiveTab('keyboard')}
            className={`px-3 py-1 rounded-lg font-dot text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'keyboard'
                ? 'bg-sky-500 text-black shadow-[0_0_12px_rgba(14,165,233,0.45)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <span>KEYS</span>
          </button>

          <button
            onClick={() => setActiveTab('gamepad')}
            className={`px-3 py-1 rounded-lg font-dot text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'gamepad'
                ? 'bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.45)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <span>D-PAD</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-3 py-1 rounded-lg font-dot text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'diagnostics'
                ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.45)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <span>STATS</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1 rounded-lg font-dot text-xs font-bold flex items-center gap-1 transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-amber-400 text-black shadow-[0_0_14px_rgba(251,191,36,0.55)] font-bold'
                : 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-400/10'
            }`}
            title="User Customization & Touchpad Settings"
          >
            <Settings className="w-3 h-3" />
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
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                : 'bg-[#eb0029]/25 hover:bg-[#eb0029]/35 border-[#eb0029] text-white shadow-[0_0_12px_rgba(235,0,41,0.3)]'
            }`}
          >
            {isRealConnected ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px]">{latency}MS</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-[#eb0029]" />
                <span>PAIR PC</span>
              </>
            )}
          </button>

          {/* Quick Receiver Download */}
          <a
            href="/DigitalTouchpad-Receiver.zip"
            download="DigitalTouchpad-Receiver.zip"
            className="px-2.5 py-1 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-zinc-300 hover:text-white transition-all hidden sm:flex items-center gap-1 font-mono text-[10px]"
            title="Download 1-Click Desktop Receiver for Windows (75 KB, Zero Terminal)"
          >
            <Download className="w-3 h-3 text-[#00e575]" />
            <span className="font-dot font-semibold">GET (.ZIP)</span>
          </a>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-zinc-400 hover:text-white transition-colors hidden sm:flex"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
