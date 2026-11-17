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
    <header className="border-b-2 border-white/20 bg-[#111317]/98 backdrop-blur-3xl sticky top-0 z-40 transition-all shadow-[0_16px_40px_rgba(0,0,0,0.85)]">
      {/* Top Red Laser Glyph Accent Edge */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#eb0029] to-transparent shadow-[0_0_12px_#eb0029]" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 space-y-2.5">
        {/* ROW 1: SYSTEM HARDWARE STATUS & CONTROL DECK */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pb-2 border-b border-white/[0.08]">
          {/* Left: Brand Identity & Active Host Target */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-3">
              {/* Animated Nothing Glyph Icon */}
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-black/80 border border-white/25 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25)]">
                <span
                  className={`w-3.5 h-3.5 rounded-full ${
                    isRealConnected
                      ? 'bg-[#00e575] shadow-[0_0_14px_#00e575]'
                      : 'bg-[#eb0029] shadow-[0_0_14px_#eb0029]'
                  } transition-all duration-300`}
                />
                {isRealConnected && (
                  <span className="absolute w-7 h-7 rounded-full border border-emerald-400/50 animate-ping" />
                )}
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-dot text-base sm:text-lg font-bold tracking-widest text-white flex items-center gap-1.5 uppercase">
                    <span>GLYPHPAD</span>
                    <span className="text-[#eb0029] font-silk">/</span>
                    <span className="text-zinc-400 font-sans text-xs font-bold tracking-wider">TOUCHPAD</span>
                    <span className="text-[10px] font-mono text-[#eb0029] font-bold px-1.5 py-0.2 rounded-md bg-[#eb0029]/15 border border-[#eb0029]/35">
                      (1)
                    </span>
                  </span>

                  <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-zinc-200 tracking-wider hidden md:inline-block font-semibold">
                    UCP v2.0
                  </span>

                  {/* Dynamic OS Selector Pill */}
                  <button
                    onClick={onOpenConnectModal}
                    className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                    title="Switch or discover computers"
                  >
                    <span className="text-xs">{getPlatformIcon()}</span>
                    <span className="uppercase text-[9px] font-bold tracking-wider">{activePlatform}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isRealConnected ? 'bg-[#00e575] shadow-[0_0_6px_#00e575]' : 'bg-zinc-500'
                      }`}
                    ></span>
                    <span>
                      {isRealConnected
                        ? `LINKED: ${receiverHost.toUpperCase()}`
                        : 'STANDALONE WIRELESS TOUCHPAD • ZERO-CONFIG'}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Connectivity & Utility Tools */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Pair PC / Status Pill */}
            <button
              onClick={onOpenConnectModal}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all active:scale-95 ${
                isRealConnected
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:bg-emerald-500/25'
                  : 'bg-gradient-to-r from-[#eb0029]/30 to-[#eb0029]/15 hover:from-[#eb0029]/40 hover:to-[#eb0029]/25 border-[#eb0029] text-white shadow-[0_0_15px_rgba(235,0,41,0.35)]'
              }`}
            >
              {isRealConnected ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <div className="flex items-center gap-1">
                    <DotMatrixDisplay value={`${latency}MS`} size="sm" color="#34d399" showInactive={false} />
                  </div>
                  <span className="text-[9px] font-mono bg-emerald-500/30 px-1.5 py-0.5 rounded text-emerald-200 font-bold">
                    ONLINE
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-[#eb0029]" />
                  <span className="font-dot text-xs font-bold tracking-wider">PAIR PC</span>
                  <span className="text-[9px] font-mono bg-black/50 px-1.5 py-0.5 rounded text-zinc-200">
                    QR
                  </span>
                </>
              )}
            </button>

            {/* Standalone Receiver Download Pill */}
            <a
              href="/DigitalTouchpad-Receiver.zip"
              download="DigitalTouchpad-Receiver.zip"
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-zinc-200 hover:text-white transition-all hidden sm:flex items-center gap-1.5 font-mono text-[10px]"
              title="Download 1-Click Desktop Receiver for Windows (75 KB, Zero Terminal)"
            >
              <Download className="w-3.5 h-3.5 text-[#00e575]" />
              <span className="font-dot tracking-wider font-bold">GET RECEIVER</span>
              <span className="text-[8px] bg-black/40 px-1 rounded text-zinc-300 font-mono">ZIP</span>
            </a>

            {/* Quick Settings Icon in Top Deck */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`p-1.5 rounded-xl border transition-all ${
                activeTab === 'settings'
                  ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-zinc-200 hover:text-white'
              }`}
              title="Touchpad Settings & Preferences"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-zinc-300 hover:text-white transition-colors hidden sm:flex"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ROW 2: TACTICAL CONTROLLER MODE DOCK (FULL WIDTH, NO CUTOFF) */}
        <nav className="flex items-center justify-between sm:justify-center gap-1.5 p-1 rounded-2xl bg-black/80 border border-white/20 overflow-x-auto w-full scrollbar-none shadow-inner">
          <button
            onClick={() => setActiveTab('touchpad')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl font-dot text-xs font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'touchpad'
                ? 'bg-white text-black shadow-[0_0_18px_rgba(255,255,255,0.45)] scale-100'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>TOUCHPAD</span>
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl font-dot text-xs font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'actions'
                ? 'bg-[#eb0029] text-white shadow-[0_0_18px_rgba(235,0,41,0.55)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>ACTIONS ({activePlatform.toUpperCase()})</span>
          </button>

          <button
            onClick={() => setActiveTab('keyboard')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl font-dot text-xs font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'keyboard'
                ? 'bg-blue-600 text-white shadow-[0_0_18px_rgba(37,99,235,0.45)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>KEYBOARD</span>
          </button>

          <button
            onClick={() => setActiveTab('gamepad')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl font-dot text-xs font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'gamepad'
                ? 'bg-purple-600 text-white shadow-[0_0_18px_rgba(147,51,234,0.45)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>NOTHING D-PAD</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl font-dot text-xs font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'diagnostics'
                ? 'bg-emerald-600 text-white shadow-[0_0_18px_rgba(5,150,105,0.45)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>DIAGNOSTICS</span>
          </button>

          {/* Prominent SETTINGS tab with clear text and icon */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl font-dot text-xs font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-amber-400 text-black shadow-[0_0_18px_rgba(251,191,36,0.6)] font-bold'
                : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-400/10'
            }`}
            title="User Customization & Settings"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>SETTINGS</span>
          </button>
        </nav>
      </div>

      {/* Distinct Bottom Accent Border */}
      <div className="h-[2px] w-full bg-white/15" />
    </header>
  );
};
