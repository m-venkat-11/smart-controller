import React from 'react';
import { Hero } from '../components/Hero';
import { QuickFeatureStrip } from '../components/QuickFeatureStrip';
import { ProductShowcase } from '../components/ProductShowcase';
import { BentoGridFeatures } from '../components/BentoGridFeatures';
import { HowItWorks } from '../components/HowItWorks';
import { CompatibilitySection } from '../components/CompatibilitySection';
import { PrivacySecurity } from '../components/PrivacySecurity';
import { ArrowRight, Sparkles, Download } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-0">
      <Hero onNavigate={onNavigate} />
      <QuickFeatureStrip />
      <ProductShowcase />
      <BentoGridFeatures />
      <HowItWorks />
      <CompatibilitySection onNavigate={onNavigate} />
      <PrivacySecurity />

      {/* Final Call to Action Section */}
      <section className="py-20 sm:py-28 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel-glow rounded-3xl p-8 sm:p-16 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 aura-red pointer-events-none opacity-30 blur-2xl"></div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-glyph-red/10 border border-glyph-red/20 text-glyph-red font-mono text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>READY TO TAKE CONTROL?</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Bring the comfort of a touchpad to the device already in your hand.
            </h2>

            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto font-sans leading-relaxed">
              No extra hardware to carry. No latency compromises. Experience the future of mobile-to-computer tactile control today.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('playground')}
                className="px-6 py-3.5 rounded-2xl bg-glyph-red hover:bg-glyph-red-bright text-white font-mono text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg transition-all"
              >
                <span>OPEN LIVE SANDBOX</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('download')}
                className="px-6 py-3.5 rounded-2xl glass-panel-elevated hover:bg-white/10 text-white font-mono text-xs sm:text-sm font-medium border border-white/15 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD APPS</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
