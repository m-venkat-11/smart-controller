import React, { useState } from 'react';
import { Menu, X, ArrowUpRight, Github, Laptop, Smartphone, Terminal } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Overview' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'compatibility', label: 'Compatibility' },
    { id: 'download', label: 'Download' },
    { id: 'support', label: 'Support & FAQ' },
  ];

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => handleNav('home')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-glyph-surface border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-glyph-red transition-colors duration-300">
            <div className="absolute inset-0 dot-pattern opacity-40"></div>
            <div className="w-3.5 h-3.5 rounded-full border-2 border-white/80 group-hover:border-glyph-red transition-colors flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-glyph-red"></div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-dot text-sm sm:text-base tracking-widest text-white font-bold">GLYPHPAD</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-glyph-red/20 text-glyph-red font-mono font-medium border border-glyph-red/30">v1.0</span>
            </div>
            <span className="text-[10px] font-mono text-glyph-muted hidden sm:inline">SMARTCONTROLLER ECOSYSTEM</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 ${
                currentPage === link.id
                  ? 'text-white bg-white/10 font-bold border border-white/15 shadow-sm'
                  : 'text-glyph-muted hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Action Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Status Badge */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-glyph-green animate-pulse"></span>
            <span className="text-zinc-400">LAN:</span>
            <span className="text-white font-semibold">P95 &lt; 4ms</span>
          </div>

          {/* GitHub Repo */}
          <a
            href="https://github.com/m-venkat-11/smart-controller"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-glyph-surface border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
            title="View GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Live Playground CTA */}
          <button
            onClick={() => handleNav('playground')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all duration-200 ${
              currentPage === 'playground'
                ? 'bg-glyph-red text-white shadow-[0_0_20px_-3px_rgba(235,0,41,0.5)]'
                : 'bg-white/10 hover:bg-glyph-red hover:text-white text-white border border-white/15'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>LIVE SANDBOX</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => handleNav('playground')}
            className="px-2.5 py-1.5 rounded-lg bg-glyph-red text-white text-[10px] font-mono font-bold"
          >
            SANDBOX
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 text-zinc-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden glass-panel-elevated border-b border-white/10 px-4 pt-3 pb-6 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className={`text-left px-3 py-2.5 rounded-lg text-xs font-mono tracking-wider transition-colors ${
                currentPage === link.id
                  ? 'bg-glyph-red/20 text-glyph-red font-bold border border-glyph-red/30'
                  : 'text-zinc-300 hover:bg-white/5'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <a
              href="https://github.com/m-venkat-11/smart-controller"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white py-1"
            >
              <Github className="w-4 h-4" />
              <span>m-venkat-11/smart-controller</span>
            </a>
            <span className="text-[10px] font-mono text-glyph-green flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-glyph-green"></span> ONLINE
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
