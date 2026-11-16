import React from 'react';
import { Zap, WifiOff, ShieldCheck, Layers } from 'lucide-react';

export const QuickFeatureStrip: React.FC = () => {
  const highlights = [
    {
      icon: Zap,
      title: 'SUB-5MS LATENCY',
      desc: 'High-frequency 120Hz touch sampling with zero perceptual delay.',
      accent: 'text-aura-cyan',
      glow: 'hover:border-cyan-500/30',
    },
    {
      icon: WifiOff,
      title: 'LOCAL-FIRST LAN',
      desc: '100% offline functionality. Operates without internet or cloud logins.',
      accent: 'text-aura-green',
      glow: 'hover:border-emerald-500/30',
    },
    {
      icon: ShieldCheck,
      title: 'CRYPTOGRAPHIC TRUST',
      desc: 'Mutual pairing approval with TLS 1.3 encryption and replay shields.',
      accent: 'text-aura-pink',
      glow: 'hover:border-pink-500/30',
    },
    {
      icon: Layers,
      title: 'UNIVERSAL HOST REACH',
      desc: 'Native input dispatching across Windows, macOS, and Linux.',
      accent: 'text-aura-purple',
      glow: 'hover:border-purple-500/30',
    },
  ];

  return (
    <section className="py-6 border-y border-white/5 bg-white/[0.015]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`flex items-start gap-3.5 p-4 rounded-2xl glass-panel border border-white/5 ${item.glow} transition-all duration-300`}
              >
                <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0 ${item.accent}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-dot text-xs text-white tracking-wider">{item.title}</h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-sans">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
