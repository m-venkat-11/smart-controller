import React, { useState } from 'react';
import { Wifi, WifiOff, Laptop, Settings, Terminal, Shield, RefreshCw, Maximize2, Minimize2, Sparkles, Smartphone, Download, BookOpen } from 'lucide-react';
import { DotMatrixDisplay } from './DotMatrixDisplay';
import { ConnectionState } from '../core/protocol/types';

interface ConsoleHeaderProps {
  connectionState: ConnectionState;
  latency: number;
  receiverHost: string;
  isRealConnected: boolean;
  onOpenConnectModal: () => void;
  activeTab: 'touchpad' | 'actions' | 'keyboard' | 'gamepad' | 'diagnostics' | 'settings';
  setActiveTab: (tab: 'touchpad' | 'actions' | 'keyboard' | 'gamepad' | 'diagnostics' | 'settings') => void;
}

export const ConsoleHeader: React.FC<ConsoleHeaderProps> = ({
  connectionState,
  latency,
  receiverHost,
  isRealConnected,
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

  return (
    <header className="border-b border-white/10 bg-[#0d0f11]/95 backdrop-blur-xl sticky top-0 z-40 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Connection Status */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2.5">
            {/* Red Nothing Dot */}
            <div className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-[#eb0029] inline-block shadow-[0_0_10px_#eb0029]"></span>
              {isRealConnected && (
                <span className="absolute w-5 h-5 rounded-full bg-[#00e575] opacity-50 animate-ping"></span>
              )}
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-dot text-sm sm:text-base font-bold tracking-wider text-white">GLYPHPAD</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/70">v1.0</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline">
                {isRealConnected ? `Connected to ${receiverHost}` : 'Local-First Wireless Touchpad'}
              </span>
            </div>
          </div>

          {/* Nothing OS Red Pill Widget (Exact match to Reference 1: "89%" / Latency badge) */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenConnectModal}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all active:scale-95 ${
                isRealConnected
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'bg-[#eb0029] border-[#eb0029] text-white shadow-[0_0_15px_rgba(235,0,41,0.3)]'
              }`}
            >
              {isRealConnected ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <div className="flex items-center gap-1">
                    <DotMatrixDisplay value={`${latency}MS`} size="sm" color="#34d399" showInactive={false} />
                  </div>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-white" />
                  <span className="font-dot text-xs font-bold tracking-wider">OFFLINE</span>
                  <span className="text-[10px] font-mono bg-black/30 px-1.5 py-0.2 rounded text-zinc-200">PAIR</span>
                </>
              )}
            </button>

            {/* Quick Link to Download Receiver */}
            <a
              href="#/download"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition-colors hidden sm:flex items-center gap-1 font-mono text-[10px]"
              title="Download Windows Receiver"
            >
              <Download className="w-3.5 h-3.5" />
              <span>GET RECEIVER</span>
            </a>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors hidden sm:flex"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Tactical Mode Navigation Tabs */}
        <nav className="flex items-center gap-1 p-1 rounded-2xl bg-black/50 border border-white/10 overflow-x-auto w-full md:w-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('touchpad')}
            className={`px-3 py-1.5 rounded-xl font-dot text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'touchpad'
                ? 'bg-white text-black shadow-lg scale-100'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>TOUCHPAD</span>
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            className={`px-3 py-1.5 rounded-xl font-dot text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'actions'
                ? 'bg-[#eb0029] text-white shadow-[0_0_12px_rgba(235,0,41,0.4)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>QUICK ACTIONS</span>
          </button>

          <button
            onClick={() => setActiveTab('keyboard')}
            className={`px-3 py-1.5 rounded-xl font-dot text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'keyboard'
                ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>KEYBOARD</span>
          </button>

          <button
            onClick={() => setActiveTab('gamepad')}
            className={`px-3 py-1.5 rounded-xl font-dot text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'gamepad'
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.4)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>NOTHING D-PAD</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-3 py-1.5 rounded-xl font-dot text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'diagnostics'
                ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(5,150,105,0.4)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>DIAGNOSTICS</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-2.5 py-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all ${
              activeTab === 'settings' ? 'text-white bg-white/10' : ''
            }`}
            title="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </nav>
      </div>
    </header>
  );
};
