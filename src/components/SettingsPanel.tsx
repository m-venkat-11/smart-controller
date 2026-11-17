import React from 'react';
import { Sliders, Vibrate, Eye, Palette, RotateCcw, Shield, Check } from 'lucide-react';

interface SettingsPanelProps {
  sensitivity: number;
  setSensitivity: (val: number) => void;
  naturalScroll: boolean;
  setNaturalScroll: (val: boolean) => void;
  hapticEnabled: boolean;
  setHapticEnabled: (val: boolean) => void;
  wakeLockActive: boolean;
  toggleWakeLock: () => void;
  surfaceTheme: string;
  setSurfaceTheme: (theme: string) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  sensitivity,
  setSensitivity,
  naturalScroll,
  setNaturalScroll,
  hapticEnabled,
  setHapticEnabled,
  wakeLockActive,
  toggleWakeLock,
  surfaceTheme,
  setSurfaceTheme,
}) => {
  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl nothing-card-subtle">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-white" />
          <span className="font-dot text-xs text-white tracking-wider">TOUCH & GESTURE PREFERENCES</span>
        </div>
        <button
          onClick={() => {
            setSensitivity(1.2);
            setNaturalScroll(true);
            setHapticEnabled(true);
            setSurfaceTheme('monochrome');
          }}
          className="flex items-center gap-1 font-mono text-xs text-zinc-400 hover:text-white"
        >
          <RotateCcw className="w-3 h-3" />
          <span>RESET DEFAULTS</span>
        </button>
      </div>

      <div className="rounded-[32px] nothing-card p-6 space-y-6">
        {/* Pointer Sensitivity Slider */}
        <div className="space-y-3 pb-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <span className="font-dot text-xs text-white">POINTER SENSITIVITY</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-white font-bold">
              {sensitivity.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.4"
            max="2.8"
            step="0.1"
            value={sensitivity}
            onChange={(e) => setSensitivity(parseFloat(e.target.value))}
            className="w-full accent-[#eb0029] bg-white/10 rounded-lg cursor-pointer h-2"
          />
          <div className="flex justify-between font-mono text-[10px] text-zinc-500">
            <span>Precise (0.4x)</span>
            <span>Balanced (1.2x)</span>
            <span>Fast (2.8x)</span>
          </div>
        </div>

        {/* Natural Scrolling Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <div>
            <div className="font-dot text-xs text-white">NATURAL SCROLLING</div>
            <div className="font-sans text-xs text-zinc-400">Content moves in the direction of your fingers</div>
          </div>
          <button
            onClick={() => setNaturalScroll(!naturalScroll)}
            className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
              naturalScroll ? 'bg-emerald-600' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform ${
                naturalScroll ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Haptic Vibration Feedback */}
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <div>
            <div className="font-dot text-xs text-white">HAPTIC TACTILE FEEDBACK</div>
            <div className="font-sans text-xs text-zinc-400">Vibrate phone on tap, click, and gestures</div>
          </div>
          <button
            onClick={() => setHapticEnabled(!hapticEnabled)}
            className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
              hapticEnabled ? 'bg-emerald-600' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform ${
                hapticEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Keep Screen Awake (Screen Wake Lock API) */}
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <div>
            <div className="font-dot text-xs text-white">KEEP SCREEN AWAKE</div>
            <div className="font-sans text-xs text-zinc-400">Prevents phone display from sleeping while controlling</div>
          </div>
          <button
            onClick={toggleWakeLock}
            className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
              wakeLockActive ? 'bg-[#eb0029]' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform ${
                wakeLockActive ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Surface Theme Accent Selector */}
        <div className="space-y-3 pt-2">
          <span className="font-dot text-xs text-white">TOUCHPAD RADIANT THEME</span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { id: 'monochrome', label: 'NOTHING DARK', color: '#1c2024' },
              { id: 'emerald', label: 'EMERALD MINT', color: '#059669' },
              { id: 'rose', label: 'RADIANT ROSE', color: '#e11d48' },
              { id: 'blue', label: 'SAPPHIRE COBALT', color: '#2563eb' },
              { id: 'purple', label: 'AMETHYST VIOLET', color: '#9333ea' },
            ].map((th) => (
              <button
                key={th.id}
                onClick={() => setSurfaceTheme(th.id)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  surfaceTheme === th.id
                    ? 'border-white bg-white/10 text-white shadow-lg'
                    : 'border-white/10 bg-black/40 text-zinc-400 hover:text-white'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full mx-auto mb-2 shadow-sm"
                  style={{ backgroundColor: th.color }}
                />
                <span className="font-mono text-[10px] block font-bold">{th.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
