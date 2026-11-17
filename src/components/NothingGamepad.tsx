import React from 'react';
import { DotMatrixDisplay } from './DotMatrixDisplay';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, Square, Circle } from 'lucide-react';
import { nothingAudio } from '../utils/audioFeedback';

interface NothingGamepadProps {
  onSendKey: (key: string) => void;
  onAction: (action: string) => void;
  hapticEnabled: boolean;
}

export const NothingGamepad: React.FC<NothingGamepadProps> = ({
  onSendKey,
  onAction,
  hapticEnabled,
}) => {
  const vibrate = (ms: number = 20) => {
    if (hapticEnabled && typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(ms);
    }
  };

  const handlePress = (key: string) => {
    nothingAudio.playClick('sharp');
    onSendKey(key);
    vibrate(20);
  };

  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl nothing-card-subtle">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]"></div>
          <span className="font-dot text-xs text-white tracking-wider">NOTHING OS TACTILE CONTROLLER</span>
        </div>
        <span className="font-mono text-xs text-purple-300">MEDIA & GAMING D-PAD</span>
      </div>

      {/* Main Gamepad Surface */}
      <div className="card-radiant-purple rounded-[36px] p-6 sm:p-10 space-y-8 relative overflow-hidden">
        {/* Bumpers Row */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => handlePress('ESC')}
            className="flex-1 py-3.5 rounded-2xl bg-black/50 hover:bg-black/70 active:bg-white active:text-black border border-white/10 text-zinc-300 font-dot text-xs font-bold transition-all active:scale-95 text-center"
          >
            LB [ ESC ]
          </button>

          <button
            onClick={() => onAction('MEDIA_PLAY_PAUSE')}
            className="flex-1 py-3.5 rounded-2xl bg-black/50 hover:bg-black/70 active:bg-white active:text-black border border-white/10 text-zinc-300 font-dot text-xs font-bold transition-all active:scale-95 text-center"
          >
            RB [ PLAY/PAUSE ]
          </button>
        </div>

        {/* Center Console with D-Pad, Dotted Gamepad Graphic, and Action Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-around gap-8 py-4">
          {/* Circular D-Pad */}
          <div className="relative w-48 h-48 rounded-full bg-black/60 border border-white/15 p-2 shadow-2xl flex items-center justify-center">
            {/* Up Button */}
            <button
              onClick={() => handlePress('UP')}
              className="absolute top-2 w-14 h-14 rounded-2xl bg-[#1c2024] hover:bg-[#282e34] active:bg-[#eb0029] active:text-white border border-white/10 text-white flex items-center justify-center transition-all active:scale-90 shadow-md"
            >
              <ArrowUp className="w-6 h-6" />
            </button>

            {/* Left Button */}
            <button
              onClick={() => handlePress('LEFT')}
              className="absolute left-2 w-14 h-14 rounded-2xl bg-[#1c2024] hover:bg-[#282e34] active:bg-[#eb0029] active:text-white border border-white/10 text-white flex items-center justify-center transition-all active:scale-90 shadow-md"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Center Pivot */}
            <div className="w-10 h-10 rounded-full bg-[#111315] border border-white/10"></div>

            {/* Right Button */}
            <button
              onClick={() => handlePress('RIGHT')}
              className="absolute right-2 w-14 h-14 rounded-2xl bg-[#1c2024] hover:bg-[#282e34] active:bg-[#eb0029] active:text-white border border-white/10 text-white flex items-center justify-center transition-all active:scale-90 shadow-md"
            >
              <ArrowRight className="w-6 h-6" />
            </button>

            {/* Down Button */}
            <button
              onClick={() => handlePress('DOWN')}
              className="absolute bottom-2 w-14 h-14 rounded-2xl bg-[#1c2024] hover:bg-[#282e34] active:bg-[#eb0029] active:text-white border border-white/10 text-white flex items-center justify-center transition-all active:scale-90 shadow-md"
            >
              <ArrowDown className="w-6 h-6" />
            </button>
          </div>

          {/* Authentic Nothing OS Dotted Gamepad Center Widget (Exact match to Reference 1) */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-32 h-32 rounded-full bg-black/80 border border-white/20 p-4 shadow-2xl flex items-center justify-center">
              {/* Dotted Gamepad SVG */}
              <svg width="72" height="52" viewBox="0 0 72 52" fill="none">
                {/* Dotted Gamepad Grid matching Reference Image 1 */}
                <circle cx="16" cy="12" r="3.2" fill="#FFFFFF" />
                <circle cx="24" cy="12" r="3.2" fill="#FFFFFF" />
                <circle cx="48" cy="12" r="3.2" fill="#FFFFFF" />
                <circle cx="56" cy="12" r="3.2" fill="#FFFFFF" />

                <circle cx="10" cy="20" r="3.2" fill="#FFFFFF" />
                <circle cx="18" cy="20" r="3.2" fill="#FFFFFF" />
                <circle cx="26" cy="20" r="3.2" fill="#FFFFFF" />
                <circle cx="36" cy="20" r="2.5" fill="#eb0029" />
                <circle cx="46" cy="20" r="3.2" fill="#FFFFFF" />
                <circle cx="54" cy="20" r="3.2" fill="#FFFFFF" />
                <circle cx="62" cy="20" r="3.2" fill="#FFFFFF" />

                <circle cx="10" cy="28" r="3.2" fill="#FFFFFF" />
                <circle cx="18" cy="28" r="3.2" fill="#FFFFFF" />
                <circle cx="26" cy="28" r="3.2" fill="#FFFFFF" />
                <circle cx="36" cy="28" r="2.5" fill="#eb0029" />
                <circle cx="46" cy="28" r="3.2" fill="#FFFFFF" />
                <circle cx="54" cy="28" r="3.2" fill="#FFFFFF" />
                <circle cx="62" cy="28" r="3.2" fill="#FFFFFF" />

                <circle cx="12" cy="36" r="3.2" fill="#FFFFFF" />
                <circle cx="20" cy="36" r="3.2" fill="#FFFFFF" />
                <circle cx="52" cy="36" r="3.2" fill="#FFFFFF" />
                <circle cx="60" cy="36" r="3.2" fill="#FFFFFF" />

                <circle cx="14" cy="44" r="3.2" fill="#FFFFFF" />
                <circle cx="58" cy="44" r="3.2" fill="#FFFFFF" />
              </svg>
            </div>
            <span className="font-dot text-[10px] text-purple-200 tracking-widest uppercase">TACTILE D-PAD</span>
          </div>

          {/* Action Buttons (A, B, X, Y) */}
          <div className="relative w-48 h-48 rounded-full bg-black/60 border border-white/15 p-2 shadow-2xl flex items-center justify-center">
            {/* Y Button (Top) */}
            <button
              onClick={() => handlePress('BACKSPACE')}
              className="absolute top-2 w-14 h-14 rounded-full bg-[#1c2024] hover:bg-[#282e34] active:bg-amber-500 active:text-black border border-white/10 text-white font-dot text-base font-bold flex items-center justify-center transition-all active:scale-90 shadow-md"
            >
              Y
            </button>

            {/* X Button (Left) */}
            <button
              onClick={() => handlePress('TAB')}
              className="absolute left-2 w-14 h-14 rounded-full bg-[#1c2024] hover:bg-[#282e34] active:bg-blue-500 active:text-white border border-white/10 text-white font-dot text-base font-bold flex items-center justify-center transition-all active:scale-90 shadow-md"
            >
              X
            </button>

            {/* Center Spacer */}
            <div className="w-10 h-10 rounded-full bg-[#111315] border border-white/10"></div>

            {/* B Button (Right) */}
            <button
              onClick={() => handlePress('ESC')}
              className="absolute right-2 w-14 h-14 rounded-full bg-[#1c2024] hover:bg-[#282e34] active:bg-[#eb0029] active:text-white border border-white/10 text-white font-dot text-base font-bold flex items-center justify-center transition-all active:scale-90 shadow-md"
            >
              B
            </button>

            {/* A Button (Bottom) */}
            <button
              onClick={() => handlePress('ENTER')}
              className="absolute bottom-2 w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-90 text-white font-dot text-base font-bold flex items-center justify-center transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]"
            >
              A
            </button>
          </div>
        </div>

        {/* Start / Select Buttons */}
        <div className="flex items-center justify-center gap-6 pt-2">
          <button
            onClick={() => handlePress('TAB')}
            className="px-6 py-2.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-zinc-300 font-dot text-xs font-bold transition-all active:scale-95"
          >
            SELECT
          </button>
          <button
            onClick={() => handlePress('ENTER')}
            className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-zinc-200 font-dot text-xs font-bold transition-all active:scale-95 shadow-md"
          >
            START
          </button>
        </div>
      </div>
    </div>
  );
};
