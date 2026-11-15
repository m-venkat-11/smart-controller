import React from 'react';
import { ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface CompatibilitySectionProps {
  onNavigate: (page: string) => void;
}

export const CompatibilitySection: React.FC<CompatibilitySectionProps> = ({ onNavigate }) => {
  const platforms = [
    {
      category: 'DESKTOP COMPUTERS',
      items: [
        { name: 'Windows 11 & 10', arch: 'x64 / ARM64', status: 'VERIFIED IN LAB', badge: 'text-glyph-green bg-glyph-green/10 border-glyph-green/20' },
        { name: 'macOS Sonoma & Ventura', arch: 'Apple Silicon / Intel', status: 'IN DEVELOPMENT', badge: 'text-glyph-cyan bg-glyph-cyan/10 border-glyph-cyan/20' },
        { name: 'Linux (Ubuntu, Fedora, Arch)', arch: 'X11 & Wayland (uinput)', status: 'IN DEVELOPMENT', badge: 'text-glyph-cyan bg-glyph-cyan/10 border-glyph-cyan/20' },
        { name: 'ChromeOS', arch: 'Crostini / Android Runtime', status: 'EXPERIMENTAL', badge: 'text-glyph-amber bg-glyph-amber/10 border-glyph-amber/20' },
      ],
    },
    {
      category: 'MOBILE CONTROLLERS',
      items: [
        { name: 'Android Smartphones', arch: 'Android 10 - 15+', status: 'VERIFIED IN LAB', badge: 'text-glyph-green bg-glyph-green/10 border-glyph-green/20' },
        { name: 'Android Tablets', arch: 'Wide Screen Surfaces', status: 'VERIFIED IN LAB', badge: 'text-glyph-green bg-glyph-green/10 border-glyph-green/20' },
        { name: 'Apple iPhone', arch: 'iOS 16 - 18+', status: 'IN DEVELOPMENT', badge: 'text-glyph-cyan bg-glyph-cyan/10 border-glyph-cyan/20' },
        { name: 'Apple iPad', arch: 'iPadOS Multi-Touch', status: 'IN DEVELOPMENT', badge: 'text-glyph-cyan bg-glyph-cyan/10 border-glyph-cyan/20' },
      ],
    },
  ];

  return (
    <section className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-mono text-xs">
              <span>UNBIASED HARDWARE HONESTY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Your Devices. One Experience.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-sans">
              As required by the Master Prompt, we never advertise unsupported operating systems. Every platform status reflects actual verified testing.
            </p>
          </div>

          <button
            onClick={() => onNavigate('compatibility')}
            className="px-5 py-3 rounded-2xl glass-panel-elevated hover:bg-white/10 text-white font-mono text-xs flex items-center gap-2 border border-white/15 w-fit"
          >
            <span>FULL COMPATIBILITY MATRIX</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Platform Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {platforms.map((group, idx) => (
            <div key={idx} className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
              <h3 className="font-dot text-sm text-zinc-400 tracking-wider pb-3 border-b border-white/10">
                {group.category}
              </h3>
              <div className="space-y-3">
                {group.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <span className="text-xs font-mono text-zinc-500">{item.arch}</span>
                    </div>
                    <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${item.badge}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
