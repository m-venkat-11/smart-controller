import React from 'react';
import { Github, Shield, Cpu, Wifi, Terminal, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full glass-panel border-t border-white/5 mt-20 sm:mt-28 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 aura-red pointer-events-none opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-glyph-surface border border-white/10 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full border border-white flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-glyph-red"></div>
                </div>
              </div>
              <span className="font-dot text-base tracking-widest text-white">GLYPHPAD</span>
            </div>
            <p className="text-sm text-zinc-400 max-w-md leading-relaxed font-sans">
              Universal cross-platform wireless touchpad and tactical control ecosystem. Transform your mobile device into a precision input surface with sub-5ms local latency, zero cloud dependency, and hardware-grade security.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-glyph-green"></span>
                <span>UCP v1.0 • TLS 1.3</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-300">
                <Shield className="w-3.5 h-3.5 text-glyph-cyan" />
                <span>Zero Keystroke Storage</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="font-dot text-xs tracking-wider text-zinc-200">PRODUCT</h4>
            <ul className="space-y-2 text-xs font-mono text-zinc-400">
              <li>
                <button onClick={() => onNavigate('features')} className="hover:text-white transition-colors">
                  Features & Gestures
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-white transition-colors">
                  Architecture & Protocol
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('compatibility')} className="hover:text-white transition-colors">
                  OS Compatibility Matrix
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('download')} className="hover:text-white transition-colors">
                  Download Receivers & App
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('playground')} className="hover:text-glyph-red transition-colors flex items-center gap-1">
                  <span>Interactive Sandbox</span>
                  <span className="text-[9px] px-1 bg-glyph-red/20 text-glyph-red rounded">LIVE</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Resources & Open Source */}
          <div className="space-y-3">
            <h4 className="font-dot text-xs tracking-wider text-zinc-200">DEVELOPMENT</h4>
            <ul className="space-y-2 text-xs font-mono text-zinc-400">
              <li>
                <a
                  href="https://github.com/m-venkat-11/smart-controller"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              </li>
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-white transition-colors">
                  Troubleshooting & FAQ
                </button>
              </li>
              <li>
                <span className="text-zinc-600 cursor-not-allowed">
                  REST & WebSocket Spec (Docs)
                </span>
              </li>
              <li>
                <span className="text-zinc-600 cursor-not-allowed">
                  SendInput Native Adapter
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            © {new Date().getFullYear()} GlyphPad / SmartController. Engineered for universal input freedom.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-glyph-green"></span>
              All systems operational
            </span>
            <span>Local LAN First</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
