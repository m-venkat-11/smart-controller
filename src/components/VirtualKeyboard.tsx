import React, { useState } from 'react';
import { Send, CornerDownLeft, Delete, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles, Key } from 'lucide-react';
import { PlatformType, PLATFORM_INFO } from '../core/protocol/dynamicActions';
import { nothingAudio } from '../utils/audioFeedback';

interface VirtualKeyboardProps {
  onTypeText: (text: string) => void;
  onSendKey: (key: string) => void;
  onAction: (action: string) => void;
  hapticEnabled: boolean;
  activePlatform: PlatformType;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onTypeText,
  onSendKey,
  onAction,
  hapticEnabled,
  activePlatform,
}) => {
  const [inputText, setInputText] = useState('');
  const [lastDispatched, setLastDispatched] = useState<string | null>(null);

  const vibrate = (ms: number = 20) => {
    if (hapticEnabled && typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(ms);
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText) return;
    nothingAudio.playClick('pop');
    onTypeText(inputText);
    setLastDispatched(`"${inputText}"`);
    setInputText('');
    vibrate(25);
    setTimeout(() => setLastDispatched(null), 1200);
  };

  const handleKeyClick = (key: string, label?: string) => {
    nothingAudio.playClick('sharp');
    onSendKey(key);
    setLastDispatched(label || key);
    vibrate(15);
    setTimeout(() => setLastDispatched(null), 1000);
  };

  const platformInfo = PLATFORM_INFO[activePlatform];

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-6 space-y-6">
      {/* Live Text Transmitter Form */}
      <div className="card-radiant-blue rounded-[32px] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-300" />
            <span className="font-dot text-sm font-bold text-white tracking-wider">LIVE TEXT TRANSMITTER</span>
          </div>
          {lastDispatched && (
            <span className="font-mono text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30">
              DISPATCHED: {lastDispatched}
            </span>
          )}
        </div>

        <p className="text-xs text-blue-200/70 font-sans">
          Type text on your phone and press Send to inject real keystrokes directly into active applications on {platformInfo.name}.
        </p>

        <form onSubmit={handleSendText} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Type text to inject to ${activePlatform.toUpperCase()}...`}
            className="flex-1 bg-black/50 border border-white/20 focus:border-blue-400 rounded-2xl px-4 py-3 text-white placeholder-zinc-500 font-mono text-sm outline-none transition-all"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-dot text-xs font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>SEND</span>
          </button>
        </form>
      </div>

      {/* Tactile Modifier & System Keys */}
      <div className="rounded-[32px] bg-[#111315] border border-white/10 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-dot text-xs text-zinc-400 tracking-wider">
            {activePlatform.toUpperCase()} MODIFIER ROW
          </span>
          <span className="font-mono text-[10px] text-zinc-500">{platformInfo.description}</span>
        </div>

        {/* Essential Modifiers */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          <button
            onClick={() => handleKeyClick('ESC')}
            className="py-3.5 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:bg-[#eb0029] active:text-white text-zinc-200 border border-white/10 font-mono text-xs font-bold transition-all active:scale-95 shadow-sm text-center"
          >
            ESC
          </button>

          <button
            onClick={() => handleKeyClick('TAB')}
            className="py-3.5 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:bg-[#eb0029] active:text-white text-zinc-200 border border-white/10 font-mono text-xs font-bold transition-all active:scale-95 shadow-sm text-center"
          >
            TAB
          </button>

          {/* Dynamic Meta / Command / Super key */}
          <button
            onClick={() => onAction('SHOW_DESKTOP')}
            className="py-3.5 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:bg-[#eb0029] active:text-white text-zinc-200 border border-white/10 font-mono text-xs font-bold transition-all active:scale-95 shadow-sm text-center"
          >
            {platformInfo.defaultKeyModifiers.meta}
          </button>

          {/* Dynamic Ctrl key */}
          <button
            onClick={() => onAction('TASK_MANAGER')}
            className="py-3.5 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:bg-[#eb0029] active:text-white text-zinc-200 border border-white/10 font-mono text-xs font-bold transition-all active:scale-95 shadow-sm text-center"
          >
            {platformInfo.defaultKeyModifiers.ctrl}
          </button>

          {/* Dynamic Alt / Opt key */}
          <button
            onClick={() => onAction('ALT_TAB')}
            className="py-3.5 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:bg-[#eb0029] active:text-white text-zinc-200 border border-white/10 font-mono text-xs font-bold transition-all active:scale-95 shadow-sm text-center"
          >
            {platformInfo.defaultKeyModifiers.alt}
          </button>

          <button
            onClick={() => handleKeyClick('BACKSPACE')}
            className="py-3.5 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:bg-[#eb0029] active:text-white text-zinc-200 border border-white/10 font-mono text-xs font-bold transition-all active:scale-95 shadow-sm flex items-center justify-center gap-1"
          >
            <Delete className="w-3.5 h-3.5" />
            <span>{activePlatform === 'macos' ? 'DELETE' : 'BKSP'}</span>
          </button>
        </div>

        {/* Space, Enter, Arrows Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Space & Enter */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => handleKeyClick('SPACE', 'SPACE')}
              className="py-4 rounded-2xl bg-[#1c2024] hover:bg-[#252a30] active:bg-blue-600 active:text-white text-zinc-200 border border-white/10 font-dot text-xs font-bold transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
            >
              <span>[ SPACE BAR ]</span>
            </button>

            <button
              onClick={() => handleKeyClick('ENTER', activePlatform === 'macos' ? 'RETURN ↵' : 'ENTER ↵')}
              className="py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-dot text-xs font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2"
            >
              <CornerDownLeft className="w-4 h-4" />
              <span>{activePlatform === 'macos' ? 'RETURN KEY' : 'ENTER KEY'}</span>
            </button>
          </div>

          {/* Directional D-Pad Arrows */}
          <div className="bg-black/40 rounded-2xl p-3 border border-white/10 flex flex-col items-center justify-center gap-2">
            <button
              onClick={() => handleKeyClick('UP', 'ARROW UP')}
              className="w-12 h-10 rounded-xl bg-[#1c2024] hover:bg-[#252a30] active:bg-white active:text-black text-zinc-200 border border-white/10 flex items-center justify-center transition-all active:scale-95"
            >
              <ArrowUp className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleKeyClick('LEFT', 'ARROW LEFT')}
                className="w-12 h-10 rounded-xl bg-[#1c2024] hover:bg-[#252a30] active:bg-white active:text-black text-zinc-200 border border-white/10 flex items-center justify-center transition-all active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleKeyClick('DOWN', 'ARROW DOWN')}
                className="w-12 h-10 rounded-xl bg-[#1c2024] hover:bg-[#252a30] active:bg-white active:text-black text-zinc-200 border border-white/10 flex items-center justify-center transition-all active:scale-95"
              >
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleKeyClick('RIGHT', 'ARROW RIGHT')}
                className="w-12 h-10 rounded-xl bg-[#1c2024] hover:bg-[#252a30] active:bg-white active:text-black text-zinc-200 border border-white/10 flex items-center justify-center transition-all active:scale-95"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Function Keys Row */}
        <div className="space-y-2 pt-2">
          <span className="font-mono text-[10px] text-zinc-500 uppercase">FUNCTION KEYS (F1-F12)</span>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((f) => (
              <button
                key={f}
                onClick={() => {
                  if (f === 5) onAction('START_SLIDES');
                  else handleKeyClick(`F${f}`);
                }}
                className="py-2 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white active:text-black text-zinc-300 font-mono text-[11px] transition-all border border-white/5 active:scale-95 text-center"
              >
                F{f}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
