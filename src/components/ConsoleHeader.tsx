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
    <header className="sticky top-0 z-50 w-full bg-[#131722]/98 backdrop-blur-3xl border-b-2 border-[#eb0029] shadow-[0_4px_25px_rgba(0,0,0,0.8),0_2px_10px_rgba(235,0,41,0.25)] transition-all">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-2.5 flex flex-col lg:flex-row items-center justify-between gap-1.5 sm:gap-2 lg:gap-4">
        {/* ROW 1 ON MOBILE / LEFT SECTION ON DESKTOP */}
        <div className="flex items-center justify-between w-full lg:w-auto gap-2 lg:gap-3">
          {/* Brand & Dynamic OS Target Lockup */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Glowing Nothing Hardware Jewel */}
            <div className="relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-black/80 border border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25)]">
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

            <div className="flex items-center gap-1.5">
              <span className="font-dot text-sm sm:text-base font-bold tracking-wider text-white flex items-center gap-1 uppercase">
                <span>GLYPHPAD</span>
                <span className="text-[#eb0029] font-silk text-xs">/</span>
                <span className="text-zinc-400 font-sans text-[10px] sm:text-xs font-bold tracking-normal">(1)</span>
              </span>

              {/* Dynamic OS Selector Pill */}
              <button
                onClick={onOpenConnectModal}
                className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center gap-1 transition-all active:scale-95 shadow-sm"
                title="Click to switch or discover computers"
              >
                <span className="text-[10px]">{getPlatformIcon()}</span>
                <span className="uppercase font-bold tracking-wider">{activePlatform}</span>
              </button>
            </div>
          </div>

          {/* ON MOBILE ONLY: Right Quick Actions in Top Row */}
          <div className="flex lg:hidden items-center gap-1.5">
            {/* Mobile Pair PC Badge */}
            <button
              onClick={onOpenConnectModal}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full border transition-all active:scale-95 text-[11px] font-dot font-bold ${
                isRealConnected
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-gradient-to-r from-[#eb0029] to-[#b3001e] hover:from-[#ff1a40] hover:to-[#eb0029] border-[#eb0029] text-white shadow-[0_0_10px_rgba(235,0,41,0.4)]'
              }`}
            >
              {isRealConnected ? (
                <>
                  <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span className="font-mono text-[10px]">{latency}MS</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-2.5 h-2.5 text-white" />
                  <span>PAIR</span>
                </>
              )}
            </button>

            {/* Mobile Settings Icon */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`p-1 rounded-lg border transition-all ${
                activeTab === 'settings'
                  ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)] font-bold'
                  : 'bg-white/10 text-zinc-300 hover:text-amber-300 border-white/15'
              }`}
              title="Touchpad Settings & Customization"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-zinc-300 hover:text-white transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* CENTER / ROW 2: Slim High-Contrast Mode Dock */}
        <nav className="w-full lg:w-auto flex items-center justify-start lg:justify-center gap-1 p-0.5 sm:p-1 rounded-xl bg-black/70 border border-white/15 overflow-x-auto scrollbar-none shadow-inner">
          <button
            onClick={() => setActiveTab('touchpad')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg font-dot text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'touchpad'
                ? 'bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.45)] scale-100'
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>TOUCHPAD</span>
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg font-dot text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'actions'
                ? 'bg-[#eb0029] text-white shadow-[0_0_12px_rgba(235,0,41,0.5)]'
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>ACTIONS</span>
          </button>

          <button
            onClick={() => setActiveTab('keyboard')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg font-dot text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'keyboard'
                ? 'bg-sky-500 text-black shadow-[0_0_12px_rgba(14,165,233,0.45)]'
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>KEYS</span>
          </button>

          <button
            onClick={() => setActiveTab('gamepad')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg font-dot text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'gamepad'
                ? 'bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.45)]'
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>D-PAD</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg font-dot text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'diagnostics'
                ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.45)]'
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>STATS</span>
          </button>

          {/* Prominent SETTINGS tab */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg font-dot text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(251,191,36,0.6)] font-bold'
                : 'text-amber-400 hover:text-amber-300 hover:bg-amber-400/15'
            }`}
            title="User Customization & Touchpad Settings"
          >
            <Settings className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>SETTINGS</span>
          </button>
        </nav>

        {/* DESKTOP ONLY: RIGHT ACTIONS CLUSTER */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Desktop Pair PC Badge */}
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

          {/* Quick Receiver Download (Desktop Only) */}
          <a
            href="/DigitalTouchpad-Receiver.zip"
            download="DigitalTouchpad-Receiver.zip"
            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-zinc-200 hover:text-white transition-all flex items-center gap-1 font-mono text-[10px]"
            title="Download 1-Click Desktop Receiver for Windows (75 KB, Zero Terminal)"
          >
            <Download className="w-3 h-3 text-[#00e575]" />
            <span className="font-dot font-semibold">GET (.ZIP)</span>
          </a>

          {/* Quick Settings Icon */}
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
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-zinc-300 hover:text-white transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
