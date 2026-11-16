import React, { useState } from 'react';
import { Menu, X, Terminal, Radio } from 'lucide-react';
import { DotMatrixDisplay } from './DotMatrixDisplay';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'OVERVIEW' },
    { id: 'features', label: 'FEATURES' },
    { id: 'how-it-works', label: 'HOW IT WORKS' },
    { id: 'compatibility', label: 'COMPATIBILITY' },
    { id: 'download', label: 'DOWNLOAD' },
    { id: 'support', label: 'SUPPORT' },
  ];

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo with Nothing Dotted Glyph */}
        <div 
          onClick={() => handleNav('home')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* Circular Tactile Nothing Logo Badge */}
          <div className="w-10 h-10 rounded-full bg-[#121417] border border-white/15 flex items-center justify-center relative overflow-hidden group-hover:border-glyph-red transition-all duration-300 shadow-md">
            <div className="absolute inset-0 dot-pattern opacity-40"></div>
            {/* 3x3 Mini LED Matrix Center */}
            <div className="grid grid-cols-3 gap-1">
              <span className="w-1 h-1 rounded-full bg-white/40"></span>
              <span className="w-1 h-1 rounded-full bg-white"></span>
              <span className="w-1 h-1 rounded-full bg-white/40"></span>
              <span className="w-1 h-1 rounded-full bg-white"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-glyph-red animate-pulse"></span>
              <span className="w-1 h-1 rounded-full bg-white"></span>
              <span className="w-1 h-1 rounded-full bg-white/40"></span>
              <span className="w-1 h-1 rounded-full bg-white"></span>
              <span className="w-1 h-1 rounded-full bg-white/40"></span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-dot text-sm sm:text-base tracking-widest text-white font-bold">
                GLYPHPAD
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-glyph-red/20 text-glyph-red font-mono font-medium border border-glyph-red/30">
                (1)
              </span>
            </div>
            <span className="text-[9px] font-dot text-zinc-500 hidden sm:inline tracking-wider">
              SMART CONTROLLER SURFACE
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-dot tracking-wider transition-all duration-200 ${
                currentPage === link.id
                  ? 'text-white bg-white/10 font-bold border border-white/20 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Action Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Status Badge with Live Dotted Latency */}
          <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-aura-green animate-pulse"></span>
            <span className="text-zinc-400">P95:</span>
            <span className="text-white font-dot">04 MS</span>
          </div>

          {/* Live Controller CTA */}
          <button
            onClick={() => handleNav('home')}
            className={`px-4 py-2 rounded-xl text-xs font-dot tracking-wider font-bold flex items-center gap-2 transition-all duration-200 ${
              currentPage === 'home'
                ? 'bg-glyph-red text-white shadow-[0_0_25px_-3px_rgba(235,0,41,0.6)]'
                : 'bg-[#eb0029] hover:bg-[#c40022] text-white shadow-md'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>OPEN TOUCHPAD</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => handleNav('home')}
            className="px-2.5 py-1.5 rounded-lg bg-[#eb0029] text-white text-[10px] font-dot font-bold"
          >
            CONTROLLER
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
              className={`text-left px-3 py-2.5 rounded-xl text-xs font-dot tracking-wider transition-colors ${
                currentPage === link.id
                  ? 'bg-glyph-red/20 text-glyph-red font-bold border border-glyph-red/30'
                  : 'text-zinc-300 hover:bg-white/5'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 text-aura-green">
              <span className="w-1.5 h-1.5 rounded-full bg-aura-green animate-pulse"></span>
              <span>UCP v1.0 ONLINE</span>
            </span>
            <span className="font-dot text-[11px] text-zinc-500">GLYPHPAD (1)</span>
          </div>
        </div>
      )}
    </header>
  );
};
