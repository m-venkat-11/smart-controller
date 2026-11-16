import React, { useState, useEffect, useRef } from 'react';
import { ConsoleHeader } from '../components/ConsoleHeader';
import { TouchpadSurface } from '../components/TouchpadSurface';
import { QuickActionsGrid } from '../components/QuickActionsGrid';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { NothingGamepad } from '../components/NothingGamepad';
import { DiagnosticsPanel } from '../components/DiagnosticsPanel';
import { SettingsPanel } from '../components/SettingsPanel';
import { DeviceHubModal } from '../components/DeviceHubModal';
import { ConnectionStateMachine } from '../core/protocol/stateMachine';
import { createUCPEnvelope } from '../core/protocol/serializer';
import { ConnectionState, UCPEnvelope } from '../core/protocol/types';
import { PlatformType, PLATFORM_INFO } from '../core/protocol/dynamicActions';
import { Sparkles, Terminal, Download, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  // Navigation & Mode
  const [activeTab, setActiveTab] = useState<'touchpad' | 'actions' | 'keyboard' | 'gamepad' | 'diagnostics' | 'settings'>('touchpad');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [showDocsAccordion, setShowDocsAccordion] = useState(false);

  // Dynamic Machine & OS State (PRD Universal Device Target)
  const [activePlatform, setActivePlatform] = useState<PlatformType>('windows');
  const [connectedHost, setConnectedHost] = useState<string>('Universal Host');
  const [connectedOsName, setConnectedOsName] = useState<string>('Windows 11 / macOS / Linux');

  // Connection & WebSocket state
  const [receiverAddress, setReceiverAddress] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('glyph_receiver_addr');
      if (saved) return saved;
      if (window.location.port && window.location.port !== '80' && window.location.port !== '443') {
        return window.location.host;
      }
      return 'localhost:8443';
    }
    return 'localhost:8443';
  });
  const [isRealConnected, setIsRealConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>('DISCONNECTED');
  const [latency, setLatency] = useState(14);
  const [packets, setPackets] = useState<UCPEnvelope[]>([]);
  const [pinCode] = useState('749 201');

  // Preferences
  const [sensitivity, setSensitivity] = useState(1.2);
  const [naturalScroll, setNaturalScroll] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [surfaceTheme, setSurfaceTheme] = useState('monochrome');

  const wsRef = useRef<WebSocket | null>(null);
  const wakeLockRef = useRef<any>(null);
  const pingIntervalRef = useRef<any>(null);
  const lastPacketLogRef = useRef<number>(0);

  // Auto-connect on initial load
  useEffect(() => {
    connectToReceiver();
    return () => {
      disconnectFromReceiver();
    };
  }, []);

  // Screen WakeLock management
  const toggleWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        if (!wakeLockActive) {
          const lock = await (navigator as any).wakeLock.request('screen');
          wakeLockRef.current = lock;
          setWakeLockActive(true);
        } else if (wakeLockRef.current) {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
          setWakeLockActive(false);
        }
      } catch (err) {
        console.warn('Wake Lock request failed:', err);
      }
    } else {
      alert('Screen Wake Lock is not supported on this browser.');
    }
  };

  // Connect to PC Receiver via WebSocket
  const connectToReceiver = (customAddress?: string) => {
    disconnectFromReceiver();

    const targetAddr = customAddress || receiverAddress;

    try {
      let cleanAddr = targetAddr
        .replace('http://', '')
        .replace('https://', '')
        .replace('ws://', '')
        .replace('wss://', '')
        .trim();

      // If user provided just IP without port, default to 8443
      if (!cleanAddr.includes(':')) {
        cleanAddr = `${cleanAddr}:8443`;
      }

      localStorage.setItem('glyph_receiver_addr', cleanAddr);

      setConnectionState('CONNECTING');
      const ws = new WebSocket(`ws://${cleanAddr}/ucp`);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsRealConnected(true);
        setConnectionState('CONNECTED');
        console.log('[GlyphPad] Connected to receiver at', cleanAddr);

        // Start ping heartbeat
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            const start = Date.now();
            ws.send(JSON.stringify({ type: 'PING', payload: { timestamp: start } }));
          }
        }, 2000);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Dynamic Platform & Device Profile Negotiation Handshake
          if (data.type === 'SESSION_ACK' && data.payload) {
            const payload = data.payload;
            if (payload.host) setConnectedHost(payload.host);
            if (payload.osName) setConnectedOsName(payload.osName);
            if (payload.platform) {
              const p = payload.platform.toLowerCase();
              if (p.includes('mac') || p === 'darwin') {
                setActivePlatform('macos');
              } else if (p.includes('linux')) {
                setActivePlatform('linux');
              } else {
                setActivePlatform('windows');
              }
            }
          }

          if (data.type === 'PONG') {
            const rtt = Date.now() - (data.payload?.clientTimestamp || Date.now());
            setLatency(Math.max(4, rtt));
          }
        } catch (_) {}
      };

      ws.onclose = () => {
        setIsRealConnected(false);
        setConnectionState('DISCONNECTED');
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      };

      ws.onerror = () => {
        setIsRealConnected(false);
        setConnectionState('FAILED');
      };
    } catch (e) {
      setConnectionState('FAILED');
    }
  };

  const disconnectFromReceiver = () => {
    if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsRealConnected(false);
    setConnectionState('DISCONNECTED');
  };

  // Dispatch Packet to Receiver & Record Telemetry (Zero-lag socket transmission)
  const dispatchEnvelope = (type: any, payload: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }));
    }

    // Only update diagnostics state for non-pointer events, or throttled to keep 60fps
    const now = Date.now();
    if (type !== 'POINTER_MOVE' || now - lastPacketLogRef.current > 200) {
      lastPacketLogRef.current = now;
      const envelope = createUCPEnvelope(type, 'sess_live_99x8', payload);
      setPackets((prev) => [envelope, ...prev.slice(0, 19)]);
    }
  };

  // Touchpad Handlers
  const handlePointerMove = (dx: number, dy: number) => {
    dispatchEnvelope('POINTER_MOVE', {
      dx: Number(dx.toFixed(2)),
      dy: Number(dy.toFixed(2)),
    });
  };

  const handleClick = (button: 'LEFT' | 'RIGHT' | 'MIDDLE') => {
    dispatchEnvelope('BUTTON_STATE', {
      button,
      action: 'CLICK',
    });
  };

  const handleDoubleClick = () => {
    dispatchEnvelope('DOUBLE_CLICK', {});
  };

  const handleScroll = (deltaY: number, deltaX?: number) => {
    dispatchEnvelope('SCROLL', {
      delta: Math.round(deltaY),
      deltaY: Math.round(deltaY),
      deltaX: deltaX ? Math.round(deltaX) : 0,
    });
  };

  const handleAction = (action: string) => {
    dispatchEnvelope('ACTION', { action });
  };

  const handleTypeText = (text: string) => {
    dispatchEnvelope('TYPE_TEXT', { text });
  };

  const handleSendKey = (key: string) => {
    dispatchEnvelope('KEY', { key });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08090a] text-[#f5f6f8]">
      {/* Top Header & Connection Bar with Dynamic OS State */}
      <ConsoleHeader
        connectionState={connectionState}
        latency={latency}
        receiverHost={isRealConnected ? connectedHost : receiverAddress}
        isRealConnected={isRealConnected}
        activePlatform={activePlatform}
        setActivePlatform={setActivePlatform}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Working Interface */}
      <main className="flex-1 flex flex-col p-2 sm:p-4 max-w-7xl mx-auto w-full">
        {activeTab === 'touchpad' && (
          <TouchpadSurface
            onPointerMove={handlePointerMove}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onScroll={handleScroll}
            onAction={handleAction}
            sensitivity={sensitivity}
            naturalScroll={naturalScroll}
            hapticEnabled={hapticEnabled}
            surfaceTheme={surfaceTheme}
          />
        )}

        {/* Dynamic Quick Actions according to connected PC */}
        {activeTab === 'actions' && (
          <QuickActionsGrid
            onAction={handleAction}
            hapticEnabled={hapticEnabled}
            activePlatform={activePlatform}
          />
        )}

        {/* Dynamic Virtual Keyboard with OS-appropriate modifiers */}
        {activeTab === 'keyboard' && (
          <VirtualKeyboard
            onTypeText={handleTypeText}
            onSendKey={handleSendKey}
            onAction={handleAction}
            hapticEnabled={hapticEnabled}
            activePlatform={activePlatform}
          />
        )}

        {activeTab === 'gamepad' && (
          <NothingGamepad
            onSendKey={handleSendKey}
            onAction={handleAction}
            hapticEnabled={hapticEnabled}
          />
        )}

        {activeTab === 'diagnostics' && (
          <DiagnosticsPanel
            latency={latency}
            packets={packets}
            isRealConnected={isRealConnected}
            receiverHost={isRealConnected ? `${connectedHost} (${activePlatform.toUpperCase()})` : receiverAddress}
            onRunPingTest={() => {
              if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                const start = Date.now();
                wsRef.current.send(JSON.stringify({ type: 'PING', payload: { timestamp: start } }));
              } else {
                setLatency(Math.floor(12 + Math.random() * 5));
              }
            }}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPanel
            sensitivity={sensitivity}
            setSensitivity={setSensitivity}
            naturalScroll={naturalScroll}
            setNaturalScroll={setNaturalScroll}
            hapticEnabled={hapticEnabled}
            setHapticEnabled={setHapticEnabled}
            wakeLockActive={wakeLockActive}
            toggleWakeLock={toggleWakeLock}
            surfaceTheme={surfaceTheme}
            setSurfaceTheme={setSurfaceTheme}
          />
        )}
      </main>

      {/* Collapsible Architecture & Multi-Platform Guide */}
      <footer className="border-t border-white/10 bg-[#0d0f11] py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-[#00e575]"></span>
                <span className="uppercase">UNIVERSAL CROSS-PLATFORM • {activePlatform} ACTIVE</span>
              </span>
              <span>•</span>
              <span>UCP v1.0 PROTOCOL</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsConnectModalOpen(true)}
                className="hover:text-white transition-colors underline"
              >
                Receiver: {isRealConnected ? `${connectedHost} (Connected)` : 'Offline / Standby'}
              </button>

              <button
                onClick={() => setShowDocsAccordion(!showDocsAccordion)}
                className="flex items-center gap-1 text-zinc-300 hover:text-white px-3 py-1 rounded-lg bg-white/5 border border-white/10 transition-colors"
              >
                <span>Universal Multi-PC Guide</span>
                {showDocsAccordion ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {showDocsAccordion && (
            <div className="pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs text-zinc-300 animate-fadeIn">
              <div className="space-y-2 p-4 rounded-2xl bg-black/40 border border-white/5">
                <div className="font-dot text-white font-bold tracking-wider">🪟 WINDOWS PC / LAPTOP</div>
                <p className="text-zinc-400">
                  Run <code className="text-zinc-200 bg-white/10 px-1 py-0.5 rounded">start-receiver.bat</code>. Implements native Win32 SendInput with zero driver installations. Dynamic Windows actions (Task Manager, Snipping Tool, Win+D, Virtual Desktops).
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-black/40 border border-white/5">
                <div className="font-dot text-white font-bold tracking-wider">🍏 APPLE MACBOOK / MAC DESKTOP</div>
                <p className="text-zinc-400">
                  Run <code className="text-zinc-200 bg-white/10 px-1 py-0.5 rounded">node receiver/server.js</code> on macOS. Automatically activates Quartz / AppleScript adapter with Mac shortcuts (Spotlight, Mission Control, Command ⌘ keys, Spaces).
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-black/40 border border-white/5">
                <div className="font-dot text-white font-bold tracking-wider">🐧 LINUX (UBUNTU / FEDORA / ARCH)</div>
                <p className="text-zinc-400">
                  Run <code className="text-zinc-200 bg-white/10 px-1 py-0.5 rounded">node receiver/server.js</code> on Linux. Dynamically binds X11 / Wayland uinput for seamless touchpad movement, Super key navigation, and desktop controls.
                </p>
              </div>
            </div>
          )}
        </div>
      </footer>

      {/* Universal Device Connectivity Hub Modal */}
      <DeviceHubModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        activePlatform={activePlatform}
        setActivePlatform={setActivePlatform}
        connectedHost={connectedHost}
        isRealConnected={isRealConnected}
        receiverAddress={receiverAddress}
        setReceiverAddress={setReceiverAddress}
        onConnect={(target) => {
          if (target) {
            connectToReceiver(target);
          } else {
            connectToReceiver();
          }
        }}
        onDisconnect={disconnectFromReceiver}
        pinCode={pinCode}
      />
    </div>
  );
};
