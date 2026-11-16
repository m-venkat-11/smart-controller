import React, { useState } from 'react';
import { X, Wifi, WifiOff, Laptop, Smartphone, Check, Terminal, ExternalLink, QrCode } from 'lucide-react';
import { DotMatrixDisplay } from './DotMatrixDisplay';

interface ReceiverModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiverAddress: string;
  setReceiverAddress: (addr: string) => void;
  isRealConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  pinCode: string;
}

export const ReceiverModal: React.FC<ReceiverModalProps> = ({
  isOpen,
  onClose,
  receiverAddress,
  setReceiverAddress,
  isRealConnected,
  onConnect,
  onDisconnect,
  pinCode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-[36px] bg-[#111315] border border-white/20 p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden">
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
            <Laptop className="w-6 h-6 text-[#eb0029]" />
          </div>
          <div>
            <h3 className="font-dot text-base font-bold text-white tracking-wider">CONNECT TO WINDOWS PC</h3>
            <p className="font-mono text-xs text-zinc-400">Universal Control Protocol (UCP v1.0) Bridge</p>
          </div>
        </div>

        {/* Status Pill */}
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between ${
            isRealConnected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-white/5 border-white/10 text-zinc-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-3 h-3 rounded-full ${
                isRealConnected ? 'bg-emerald-400 animate-pulse' : 'bg-[#eb0029]'
              }`}
            />
            <span className="font-dot text-xs font-bold tracking-wider">
              {isRealConnected ? 'CONNECTED & ACTIVE' : 'DISCONNECTED / OFFLINE'}
            </span>
          </div>

          {isRealConnected && (
            <button
              onClick={onDisconnect}
              className="px-3 py-1 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-mono text-xs font-bold transition-all"
            >
              DISCONNECT
            </button>
          )}
        </div>

        {/* IP Address Input Field */}
        <div className="space-y-2">
          <label className="font-dot text-xs text-white">RECEIVER IP & PORT</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
              placeholder="e.g. 192.168.1.104:8443 or localhost:8443"
              className="flex-1 bg-black/60 border border-white/20 focus:border-[#eb0029] rounded-2xl px-4 py-3 font-mono text-sm text-white placeholder-zinc-600 outline-none transition-all"
            />
            <button
              onClick={onConnect}
              className="px-6 py-3 rounded-2xl bg-[#eb0029] hover:bg-[#c40022] active:scale-95 text-white font-dot text-xs font-bold transition-all shadow-[0_0_15px_rgba(235,0,41,0.4)]"
            >
              {isRealConnected ? 'RECONNECT' : 'CONNECT'}
            </button>
          </div>
          <span className="font-mono text-[10px] text-zinc-500">
            Default port is 8443. For local browser test, use <strong>localhost:8443</strong>. For phone, use PC's Wi-Fi IP.
          </span>
        </div>

        {/* Pairing PIN Display (PRD Section 04/12) */}
        <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-dot text-xs text-zinc-300">SESSION PAIRING PIN</span>
            <div className="font-mono text-[10px] text-zinc-500">Encrypted token handshake</div>
          </div>
          <div className="px-4 py-1.5 rounded-xl bg-[#eb0029]/20 border border-[#eb0029]/40">
            <DotMatrixDisplay value={pinCode} size="sm" color="#FFFFFF" />
          </div>
        </div>

        {/* Quick Setup Instructions */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3 font-mono text-xs text-zinc-300">
          <div className="font-dot text-[11px] text-white font-bold flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>HOW TO CONNECT YOUR PC & PHONE:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-zinc-400 text-[11px]">
            <li>
              On your PC, double-click <strong className="text-zinc-200">start-receiver.bat</strong> (or run <code className="text-zinc-200 bg-white/10 px-1 py-0.5 rounded">node receiver/server.js</code>).
            </li>
            <li>
              Your terminal will display your PC's IP, e.g. <strong className="text-emerald-400">http://192.168.1.xxx:8443</strong>.
            </li>
            <li>
              <span className="text-zinc-200 font-bold">📱 On your Phone:</span> Open <strong className="text-emerald-400">http://192.168.1.xxx:8443</strong> in Chrome or Safari. Your PC serves this full app locally and connects with zero configuration!
            </li>
            <li>
              <span className="text-zinc-200 font-bold">💻 In this browser:</span> Type your IP above and click <strong className="text-[#eb0029]">CONNECT</strong>.
            </li>
          </ol>
        </div>

        {/* Local Wi-Fi Tip */}
        <div className="text-center pt-1">
          <span className="font-mono text-[11px] text-zinc-400 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
            ⚡ Both devices must be on the same Wi-Fi network • Zero Cloud • Local-First
          </span>
        </div>
      </div>
    </div>
  );
};
