import React, { useState, useEffect } from 'react';
import {
  X,
  Wifi,
  Laptop,
  Monitor,
  Check,
  RefreshCw,
  QrCode,
  Shield,
  Trash2,
  ChevronRight,
  Sparkles,
  Camera,
  Edit2,
} from 'lucide-react';
import { PlatformType } from '../core/protocol/dynamicActions';
import { QRScannerModal } from './QRScannerModal';

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
  authToken?: string;
  pairedAt?: number;
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
  onConnect: (address?: string, authToken?: string, pin?: string) => void;
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
  const [activeTab, setActiveTab] = useState<'discovered' | 'trusted' | 'manual'>('discovered');
  const [isScanning, setIsScanning] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [pairingPromptDevice, setPairingPromptDevice] = useState<DiscoveredDevice | null>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');

  // Trusted devices list saved in localStorage (PRD Section 3.2)
  const [trustedDevices, setTrustedDevices] = useState<DiscoveredDevice[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('digital_touchpad_trusted_devices');
        if (saved) return JSON.parse(saved);
      } catch (_) {}
    }
    return [
      {
        id: 'dev_win_current',
        hostname: 'Primary PC Workstation',
        platform: 'windows',
        osName: 'Windows 11',
        ip: '192.168.1.4',
        port: 8443,
        status: 'ONLINE',
        isTrusted: true,
        authToken: 'tok_trusted_default_1',
        pairedAt: Date.now() - 86400000,
      },
    ];
  });

  // Discovered LAN devices
  const [discoveredList, setDiscoveredList] = useState<DiscoveredDevice[]>([]);

  // Auto-scan on modal open
  useEffect(() => {
    if (isOpen) {
      runRealSubnetScan();
    }
  }, [isOpen]);

  const saveTrustedDevices = (devices: DiscoveredDevice[]) => {
    setTrustedDevices(devices);
    if (typeof window !== 'undefined') {
      localStorage.setItem('digital_touchpad_trusted_devices', JSON.stringify(devices));
    }
  };

  const handleRemoveTrusted = (id: string) => {
    saveTrustedDevices(trustedDevices.filter((d) => d.id !== id));
  };

  const handleRenameTrusted = (id: string) => {
    if (!editNameValue.trim()) return;
    saveTrustedDevices(
      trustedDevices.map((d) => (d.id === id ? { ...d, hostname: editNameValue.trim() } : d))
    );
    setEditingDeviceId(null);
    setEditNameValue('');
  };

  // Real Subnet Scan across local IPs
  const runRealSubnetScan = async () => {
    setIsScanning(true);
    const discovered: DiscoveredDevice[] = [];

    // Always probe localhost and the current receiver address first
    const candidates = new Set<string>();
    candidates.add('127.0.0.1:8443');
    candidates.add('localhost:8443');
    if (receiverAddress) candidates.add(receiverAddress);

    // Derive subnet from current window host or common subnets
    const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
    let subnetPrefix = '192.168.1.';
    if (currentHost.startsWith('192.168.')) {
      const parts = currentHost.split('.');
      subnetPrefix = `${parts[0]}.${parts[1]}.${parts[2]}.`;
    }

    // Add common IP range (1..30)
    for (let i = 2; i <= 25; i++) {
      candidates.add(`${subnetPrefix}${i}:8443`);
    }

    const probeList = Array.from(candidates);

    // Fast parallel probe with 500ms timeout
    await Promise.all(
      probeList.map(async (addr) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 600);
          const clean = addr.replace('http://', '').replace('https://', '');
          const res = await fetch(`http://${clean}/status`, {
            signal: controller.signal,
            mode: 'cors',
          });
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const hostIp = clean.split(':')[0];
            const hostPort = parseInt(clean.split(':')[1]) || 8443;
            const isAlreadyTrusted = trustedDevices.some(
              (t) => t.ip === hostIp || t.hostname === data.host
            );

            discovered.push({
              id: `disc_${data.host}_${hostIp}`,
              hostname: data.host || 'Desktop Computer',
              platform: data.platform || 'windows',
              osName: data.osName || 'Desktop OS',
              ip: hostIp,
              port: hostPort,
              status: 'ONLINE',
              latency: 8,
              isTrusted: isAlreadyTrusted,
            });
          }
        } catch (_) {}
      })
    );

    // If none found via subnet probe, keep existing current host if connected
    if (discovered.length === 0 && isRealConnected) {
      discovered.push({
        id: 'local_current',
        hostname: connectedHost,
        platform: activePlatform,
        osName: activePlatform === 'windows' ? 'Windows 11' : activePlatform === 'macos' ? 'macOS Sonoma' : 'Linux',
        ip: receiverAddress.split(':')[0] || '192.168.1.4',
        port: parseInt(receiverAddress.split(':')[1]) || 8443,
        latency: 12,
        status: 'ONLINE',
        isTrusted: true,
      });
    }

    setDiscoveredList(discovered);
    setIsScanning(false);
  };

  // QR Code scanned handler
  const handleQRScanResult = (text: string) => {
    try {
      let targetIp = text;
      let token = '';
      let pin = '';

      if (text.startsWith('http://') || text.startsWith('https://')) {
        const u = new URL(text);
        targetIp = u.host;
        pin = u.searchParams.get('pair') || '';
        token = u.searchParams.get('token') || '';
      } else if (text.startsWith('dtp://')) {
        const query = text.split('?')[1] || '';
        const params = new URLSearchParams(query);
        targetIp = `${params.get('ip') || '192.168.1.4'}:${params.get('port') || 8443}`;
        pin = params.get('pin') || '';
        token = params.get('token') || '';
      }

      setReceiverAddress(targetIp);
      onConnect(targetIp, token, pin);
      onClose();
    } catch (_) {
      setReceiverAddress(text);
      onConnect(text);
      onClose();
    }
  };

  // Device selection from Discovered list
  const handleSelectDiscovered = (device: DiscoveredDevice) => {
    if (device.isTrusted) {
      // Reconnect immediately with zero manual input!
      setReceiverAddress(`${device.ip}:${device.port}`);
      setActivePlatform(device.platform);
      onConnect(`${device.ip}:${device.port}`, device.authToken);
      onClose();
    } else {
      // First-time pairing prompt
      setPairingPromptDevice(device);
      setEnteredPin('');
    }
  };

  const handleConfirmPairing = () => {
    if (!pairingPromptDevice) return;
    const addr = `${pairingPromptDevice.ip}:${pairingPromptDevice.port}`;
    setReceiverAddress(addr);
    setActivePlatform(pairingPromptDevice.platform);

    // Save to trusted devices
    const newTrusted: DiscoveredDevice = {
      ...pairingPromptDevice,
      isTrusted: true,
      pairedAt: Date.now(),
      authToken: `tok_paired_${Date.now()}`,
    };
    saveTrustedDevices([...trustedDevices.filter((d) => d.ip !== pairingPromptDevice.ip), newTrusted]);

    onConnect(addr, newTrusted.authToken, enteredPin.trim());
    setPairingPromptDevice(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
        <div className="relative w-full max-w-2xl rounded-[36px] bg-[#111315] border border-white/20 p-5 sm:p-8 space-y-6 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
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
                DIGITAL TOUCHPAD CONNECTIVITY
              </h3>
              <p className="font-mono text-xs text-zinc-400">
                Zero-Manual-Configuration Wireless Touchpad Ecosystem
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
                    ? `Active Host: ${activePlatform.toUpperCase()} • ${receiverAddress}`
                    : 'Select your computer below or scan QR code'}
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

          {/* Fast QR Code Pairing Banner Button */}
          <button
            onClick={() => setIsQRScannerOpen(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#eb0029] to-[#b3001e] hover:from-[#ff1a40] hover:to-[#eb0029] text-white font-dot text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2.5 shadow-lg shadow-[#eb0029]/20 transition-all active:scale-[0.98]"
          >
            <Camera className="w-4 h-4" />
            <span>SCAN DESKTOP QR CODE (ZERO MANUAL INPUT)</span>
          </button>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/50 border border-white/10 text-xs font-dot">
            <button
              onClick={() => setActiveTab('discovered')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeTab === 'discovered' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              DISCOVER COMPUTERS ({discoveredList.length})
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
              ADVANCED IP
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[220px]">
            {/* TAB 1: AUTO DISCOVERY */}
            {activeTab === 'discovered' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
                  <span>Available Computers on Local Wi-Fi:</span>
                  <button
                    onClick={runRealSubnetScan}
                    disabled={isScanning}
                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isScanning ? 'animate-spin' : ''}`} />
                    <span>{isScanning ? 'SCANNING WI-FI...' : 'RE-SCAN'}</span>
                  </button>
                </div>

                {discoveredList.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center space-y-3">
                    <p className="font-mono text-xs text-zinc-400">
                      {isScanning
                        ? 'Scanning local Wi-Fi subnet for Digital Touchpad receivers...'
                        : 'No active receiver detected on the subnet.'}
                    </p>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => setIsQRScannerOpen(true)}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs flex items-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5 text-[#eb0029]" /> Scan QR Code
                      </button>
                      <button
                        onClick={runRealSubnetScan}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Re-scan
                      </button>
                    </div>
                  </div>
                ) : (
                  discoveredList.map((dev) => (
                    <div
                      key={dev.id}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                          {dev.platform === 'windows' ? (
                            <span className="text-xl">🪟</span>
                          ) : dev.platform === 'macos' ? (
                            <span className="text-xl">🍏</span>
                          ) : (
                            <span className="text-xl">🐧</span>
                          )}
                        </div>
                        <div>
                          <div className="font-dot text-sm font-bold text-white flex items-center gap-2">
                            <span>{dev.hostname}</span>
                            {dev.isTrusted && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[9px]">
                                TRUSTED
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-[11px] text-zinc-400">
                            {dev.osName} • {dev.ip}:{dev.port}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectDiscovered(dev)}
                        className="px-4 py-2 rounded-xl bg-white/10 group-hover:bg-[#eb0029] text-white font-mono text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <span>{dev.isTrusted ? 'CONNECT' : 'PAIR'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: SAVED TRUSTED COMPUTERS */}
            {activeTab === 'trusted' && (
              <div className="space-y-3">
                <p className="text-xs font-mono text-zinc-400 px-1">
                  Trusted computers connect instantly with one tap without requiring manual IP entry or PIN:
                </p>

                {trustedDevices.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center font-mono text-xs text-zinc-400">
                    No trusted computers saved yet. Pair with a computer to enable one-tap reconnection.
                  </div>
                ) : (
                  trustedDevices.map((dev) => (
                    <div
                      key={dev.id}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          {editingDeviceId === dev.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editNameValue}
                                onChange={(e) => setEditNameValue(e.target.value)}
                                className="bg-black/60 border border-white/20 rounded px-2 py-0.5 text-xs font-mono text-white"
                                autoFocus
                              />
                              <button
                                onClick={() => handleRenameTrusted(dev.id)}
                                className="text-xs text-emerald-400 font-bold"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <div className="font-dot text-sm font-bold text-white flex items-center gap-1.5">
                              <span>{dev.hostname}</span>
                              <button
                                onClick={() => {
                                  setEditingDeviceId(dev.id);
                                  setEditNameValue(dev.hostname);
                                }}
                                className="text-zinc-500 hover:text-zinc-300"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                          <div className="font-mono text-[11px] text-zinc-400">
                            {dev.osName} • {dev.ip}:{dev.port}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setReceiverAddress(`${dev.ip}:${dev.port}`);
                            setActivePlatform(dev.platform);
                            onConnect(`${dev.ip}:${dev.port}`, dev.authToken);
                            onClose();
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black font-mono text-xs font-bold transition-all"
                        >
                          CONNECT
                        </button>
                        <button
                          onClick={() => handleRemoveTrusted(dev.id)}
                          className="p-2 rounded-xl hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors"
                          title="Revoke trust"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: ADVANCED MANUAL IP */}
            {activeTab === 'manual' && (
              <div className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs font-mono text-zinc-400">
                  Advanced option for static networks or custom port configurations:
                </p>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-zinc-300">Computer IP Address & Port:</label>
                  <input
                    type="text"
                    value={receiverAddress}
                    onChange={(e) => setReceiverAddress(e.target.value)}
                    placeholder="e.g. 192.168.1.4:8443"
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#eb0029]"
                  />
                </div>
                <button
                  onClick={() => {
                    onConnect(receiverAddress);
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl bg-[#eb0029] hover:bg-[#ff1a40] text-white font-dot text-xs font-bold tracking-wider"
                >
                  CONNECT TO CUSTOM ADDRESS
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 1-Time Secure Pairing Dialog */}
      {pairingPromptDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-[32px] bg-[#14171a] border border-[#eb0029]/50 p-6 space-y-4 shadow-2xl text-center">
            <Shield className="w-10 h-10 text-[#eb0029] mx-auto" />
            <h4 className="font-dot text-base font-bold text-white">SECURE PAIRING CHALLENGE</h4>
            <p className="font-mono text-xs text-zinc-400">
              Enter the 6-digit PIN displayed on <strong className="text-white">{pairingPromptDevice.hostname}</strong>:
            </p>
            <input
              type="text"
              maxLength={6}
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              placeholder="749 201"
              className="w-full text-center tracking-[0.4em] text-2xl font-mono bg-black/60 border border-white/20 rounded-2xl p-3 text-white focus:border-[#eb0029] focus:outline-none"
            />
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setPairingPromptDevice(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmPairing}
                className="flex-1 py-2.5 rounded-xl bg-[#eb0029] hover:bg-[#ff1a40] text-xs font-mono text-white font-bold"
              >
                CONFIRM & PAIR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera QR Code Scanner */}
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScanSuccess={handleQRScanResult}
      />
    </>
  );
};
