import React from 'react';
import { ShieldCheck, Lock, EyeOff, ServerOff, Terminal, Key } from 'lucide-react';

export const PrivacySecurity: React.FC = () => {
  const points = [
    {
      icon: EyeOff,
      title: 'ZERO KEYSTROKE STORAGE',
      desc: 'GlyphPad never logs typed text, passwords, or clipboard buffers. Input events are converted into ephemeral OS messages and immediately discarded.',
    },
    {
      icon: ServerOff,
      title: 'NO CLOUD RELIANCE',
      desc: 'Local-network control functions completely offline without internet or external third-party server accounts.',
    },
    {
      icon: Lock,
      title: 'MUTUAL PAIRING TRUST',
      desc: 'Unknown mobile devices cannot inject commands. Pairing requires one-time local physical approval with cryptographic keys saved in protected system vaults.',
    },
    {
      icon: Terminal,
      title: 'STRICT INPUT ALLOWLIST',
      desc: 'No arbitrary terminal commands, scripts, or executable paths are accepted from the mobile client. Only verified enumerated system codes run.',
    },
  ];

  return (
    <section className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel-elevated rounded-3xl p-8 sm:p-14 border border-white/10 relative overflow-hidden">
          {/* Ambient Emerald Glow */}
          <div className="absolute -top-24 -left-24 w-96 h-96 aura-green pointer-events-none opacity-25"></div>

          <div className="max-w-3xl space-y-4 mb-12 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-glyph-green/10 border border-glyph-green/20 text-glyph-green font-mono text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DEFENSE-IN-DEPTH ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Your Control. Your Devices. Your Privacy.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
              We believe a wireless input tool should never become a surveillance vector. GlyphPad adheres to strict zero-knowledge security principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {points.map((pt, idx) => {
              const Icon = pt.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-zinc-950/70 border border-white/5 hover:border-glyph-green/30 transition-all group"
                >
                  <div className="p-3 rounded-xl bg-glyph-green/10 text-glyph-green border border-glyph-green/20 w-fit mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-dot text-sm text-white tracking-wider mb-2 group-hover:text-glyph-green transition-colors">
                    {pt.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">{pt.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
