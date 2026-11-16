import React, { useState, useEffect } from 'react';
import {
  X,
  Wifi,
  Laptop,
  Monitor,
  Smartphone,
  Check,
  Terminal,
  RefreshCw,
  QrCode,
  Shield,
  Trash2,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { DotMatrixDisplay } from './DotMatrixDisplay';
import { PlatformType } from '../core/protocol/dynamicActions';

export interface DiscoveredDevice {
  id: string;
  hostname: string;
  platform: PlatformType;
  osName: string;
  ip: string;
  port: number;
  latency?: number;
  status: 'ONLINE' | 'STANDBY';
  isTrusted?: boolean;
}

interface DeviceHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePlatform: PlatformType;
  setActivePlatform: (p: PlatformType) => void;
  connectedHost: string;
  isRealConnected: boolean;
  receiverAddress: string;
  setReceiverAddress: (addr: string) => void;
  onConnect: (address?: string) => void;
  onDisconnect: () => void;
  pinCode: string;
}

export const DeviceHubModal: React.FC<DeviceHubModalProps> = ({
  isOpen,
  onClose,
  activePlatform,
  setActivePlatform,
  connectedHost,
  isRealConnected,
  receiverAddress,
  setReceiverAddress,
  onConnect,
  onDisconnect,
  pinCode,
}) => {
  const [activeTab, setActiveTab] = useState<'discovered' | 'manual' | 'trusted'>('discovered');
  const [isScanning, setIsScanning] = useState(false);

  // Trusted devices list saved in localStorage (PRD Section 5.3)
  const [trustedDevices, setTrustedDevices] = useState<DiscoveredDevice[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('glyph_trusted_devices');
        if (saved) return JSON.parse(saved);
      } catch (_) {}
    }
    return [
      {
        id: 'dev_win_1',
        hostname: 'Windows Workstation',
        platform: 'windows',
        osName: 'Windows 11 Pro',
        ip: '192.168.1.104',
        port: 8443,
        status: 'ONLINE',
        isTrusted: true,
      },
      {
        id: 'dev_mac_1',
        hostname: 'MacBook Pro (M2)',
        platform: 'macos',
        osName: 'macOS Sonoma 14.5',
        ip: '192.168.1.120',
        port: 8443,
        status: 'STANDBY',
        isTrusted: true,
      },
    ];
  });

  // Discovered LAN devices
  const [discoveredList, setDiscoveredList] = useState<DiscoveredDevice[]>([
    {
      id: 'local_current',
      hostname: isRealConnected ? connectedHost : 'Local Companion Host',
      platform: activePlatform,
      osName: activePlatform === 'windows' ? 'Windows 11 (UCP v1.0)' : activePlatform === 'macos' ? 'macOS Sonoma' : 'Linux GNOME',
      ip: receiverAddress.split(':')[0] || '127.0.0.1',
      port: parseInt(receiverAddress.split(':')[1]) || 8443,
      latency: 12,
      status: 'ONLINE',
      isTrusted: true,
    },
  ]);

  const saveTrustedDevices = (devices: DiscoveredDevice[]) => {
    setTrustedDevices(devices);
    if (typeof window !== 'undefined') {
      localStorage.setItem('glyph_trusted_devices', JSON.stringify(devices));
    }
  };

  const handleRemoveTrusted = (id: string) => {
    saveTrustedDevices(trustedDevices.filter((d) => d.id !== id));
  };

  const runDiscoveryScan = () => {
    setIsScanning(true);
    // Simulating active mDNS / broadcast probe
    setTimeout(() => {
      setIsScanning(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-[36px] bg-[#111315] border border-white/20 p-5 sm:p-8 space-y-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#eb0029]/20 border border-[#eb0029]/40 flex items-center justify-center">
            <Wifi className="w-6 h-6 text-[#eb0029]" />
          </div>
          <div>
            <h3 className="font-dot text-base sm:text-lg font-bold text-white tracking-wider">
              UNIVERSAL DEVICE CONNECTIVITY HUB
            </h3>
            <p className="font-mono text-xs text-zinc-400">
              Connect Any Smartphone to Any Windows, Mac, or Linux Computer
            </p>
          </div>
        </div>

        {/* Active Connection Bar */}
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isRealConnected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-white/5 border-white/10 text-zinc-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-3 h-3 rounded-full ${
                isRealConnected ? 'bg-emerald-400 animate-pulse' : 'bg-[#eb0029]'
              }`}
            />
            <div>
              <div className="font-dot text-xs font-bold tracking-wider">
                {isRealConnected ? `CONNECTED: ${connectedHost.toUpperCase()}` : 'DISCONNECTED / OFFLINE'}
              </div>
              <div className="font-mono text-[10px] text-zinc-400">
                {isRealConnected
                  ? `Active Profile: ${activePlatform.toUpperCase()} • ${receiverAddress}`
                  : 'Select or scan a computer below to connect'}
              </div>
            </div>
          </div>

          {isRealConnected && (
            <button
              onClick={onDisconnect}
              className="px-4 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-mono text-xs font-bold transition-all self-start sm:self-center"
            >
              DISCONNECT
            </button>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/50 border border-white/10 text-xs font-dot">
          <button
            onClick={() => setActiveTab('discovered')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'discovered' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            DISCOVER COMPUTERS
          </button>

          <button
            onClick={() => setActiveTab('trusted')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'trusted' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            SAVED COMPUTERS ({trustedDevices.length})
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'manual' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            MANUAL IP & PAIR
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          {/* TAB 1: AUTO DISCOVERY */}
          {activeTab === 'discovered' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>AVAILABLE COMPUTERS ON LOCAL WI-FI</span>
                <button
                  onClick={runDiscoveryScan}
                  className="flex items-center gap-1.5 text-zinc-200 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1 rounded-lg border border-white/10"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>{isScanning ? 'SCANNING LAN...' : 'RE-SCAN LAN'}</span>
                </button>
              </div>

              {/* List of Discovered Computers */}
              <div className="space-y-2.5">
                {discoveredList.map((dev) => (
                  <div
                    key={dev.id}
                    className="p-4 rounded-2xl bg-[#14171a] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold font-mono text-sm">
                        {dev.platform === 'windows' ? '🪟' : dev.platform === 'macos' ? '🍏' : '🐧'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-dot text-sm font-bold text-white">{dev.hostname}</span>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 uppercase">
                            {dev.platform}
                          </span>
                        </div>
                        <div className="font-mono text-xs text-zinc-400">
                          {dev.ip}:{dev.port} • {dev.osName}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const targetAddr = `${dev.ip}:${dev.port}`;
                        setReceiverAddress(targetAddr);
                        setActivePlatform(dev.platform);
                        onConnect(targetAddr);
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-[#eb0029] hover:bg-[#c40022] active:scale-95 text-white font-dot text-xs font-bold transition-all shadow-[0_0_12px_rgba(235,0,41,0.3)]"
                    >
                      CONNECT
                    </button>
                  </div>
                ))}
              </div>

              {/* Dynamic OS Simulation Selector (Allows testing any OS instantly) */}
              <div className="rounded-2xl bg-black/40 border border-white/10 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-dot text-xs text-zinc-300">PREVIEW OS CONTROLS & SHORTCUTS</span>
                  <span className="font-mono text-[10px] text-zinc-500">SWITCH PLATFORM MANIFEST</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setActivePlatform('windows')}
                    className={`py-2 px-3 rounded-xl border text-center font-dot text-xs transition-all ${
                      activePlatform === 'windows'
                        ? 'border-blue-500 bg-blue-500/20 text-white font-bold'
                        : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    🪟 WINDOWS
                  </button>
                  <button
                    onClick={() => setActivePlatform('macos')}
                    className={`py-2 px-3 rounded-xl border text-center font-dot text-xs transition-all ${
                      activePlatform === 'macos'
                        ? 'border-purple-500 bg-purple-500/20 text-white font-bold'
                        : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    🍏 MACOS
                  </button>
                  <button
                    onClick={() => setActivePlatform('linux')}
                    className={`py-2 px-3 rounded-xl border text-center font-dot text-xs transition-all ${
                      activePlatform === 'linux'
                        ? 'border-emerald-500 bg-emerald-500/20 text-white font-bold'
                        : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    🐧 LINUX
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRUSTED COMPUTERS */}
          {activeTab === 'trusted' && (
            <div className="space-y-3">
              <span className="font-mono text-xs text-zinc-400">REMEMBERED TRUSTED COMPUTERS (1-TAP RECONNECT)</span>
              {trustedDevices.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 font-mono text-xs border border-dashed border-white/10 rounded-2xl">
                  No saved trusted devices yet. Connect to a computer to save it here.
                </div>
              ) : (
                trustedDevices.map((dev) => (
                  <div
                    key={dev.id}
                    className="p-4 rounded-2xl bg-[#14171a] border border-white/10 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-sm">
                        {dev.platform === 'windows' ? '🪟' : dev.platform === 'macos' ? '🍏' : '🐧'}
                      </div>
                      <div>
                        <div className="font-dot text-sm font-bold text-white">{dev.hostname}</div>
                        <div className="font-mono text-xs text-zinc-400">{dev.ip}:{dev.port} • {dev.osName}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const targetAddr = `${dev.ip}:${dev.port}`;
                          setReceiverAddress(targetAddr);
                          setActivePlatform(dev.platform);
                          onConnect(targetAddr);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-dot text-xs font-bold transition-all"
                      >
                        CONNECT
                      </button>
                      <button
                        onClick={() => handleRemoveTrusted(dev.id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Remove trusted device"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: MANUAL IP & PAIR */}
          {activeTab === 'manual' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-dot text-xs text-white">TARGET RECEIVER IP & PORT</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={receiverAddress}
                    onChange={(e) => setReceiverAddress(e.target.value)}
                    placeholder="e.g. 192.168.1.104:8443 or localhost:8443"
                    className="flex-1 bg-black/60 border border-white/20 focus:border-[#eb0029] rounded-2xl px-4 py-3 font-mono text-sm text-white placeholder-zinc-600 outline-none transition-all"
                  />
                  <button
                    onClick={() => {
                      onConnect(receiverAddress);
                      onClose();
                    }}
                    className="px-6 py-3 rounded-2xl bg-[#eb0029] hover:bg-[#c40022] active:scale-95 text-white font-dot text-xs font-bold transition-all shadow-[0_0_15px_rgba(235,0,41,0.4)]"
                  >
                    CONNECT
                  </button>
                </div>
              </div>

              {/* 6-Digit PIN Pairing */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-dot text-xs text-zinc-300">SESSION PAIRING PIN</span>
                  <div className="font-mono text-[10px] text-zinc-500">Short-lived numeric authentication code</div>
                </div>
                <div className="px-4 py-1.5 rounded-xl bg-[#eb0029]/20 border border-[#eb0029]/40">
                  <DotMatrixDisplay value={pinCode} size="sm" color="#FFFFFF" />
                </div>
              </div>

              {/* Universal Instructions */}
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-2 font-mono text-xs text-zinc-300">
                <div className="font-dot text-[11px] text-white font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>UNIVERSAL RECEIVER LAUNCHER:</span>
                </div>
                <ul className="space-y-1.5 text-zinc-400 text-[11px]">
                  <li>• <strong className="text-zinc-200">On Windows:</strong> Double-click <code className="text-zinc-200">start-receiver.bat</code> or run <code className="text-zinc-200">node receiver/server.js</code></li>
                  <li>• <strong className="text-zinc-200">On macOS / Linux:</strong> Run <code className="text-zinc-200">node receiver/server.js</code></li>
                  <li>• <strong className="text-emerald-400">On your Phone:</strong> Open <strong className="text-emerald-400">http://&lt;pc-ip&gt;:8443</strong> directly in your mobile browser. It loads this app and connects with zero setup!</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
