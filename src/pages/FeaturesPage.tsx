import React, { useState } from 'react';
import { 
  MousePointer, Sliders, HandMetal, Move, Keyboard, Zap, 
  Volume2, Presentation, ShieldCheck, RefreshCw, Sparkles, ShieldAlert, CheckCircle2 
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<number>(0);

  const features = [
    {
      icon: MousePointer,
      title: 'Precision Touchpad Control',
      summary: 'Continuous 120Hz sub-pixel vector streaming with ballistic acceleration curve.',
      details: 'Instead of sending bulky coordinate snapshots, GlyphPad calculates differential vectors and applies a non-linear velocity curve. Fine movements allow pixel-by-pixel editing, while fast swipes cross multi-monitor workspaces effortlessly.',
      accent: 'text-glyph-cyan',
      specs: ['120Hz update frequency', '< 10 dp drift tolerance', 'Non-linear acceleration curve', 'Multi-monitor support'],
    },
    {
      icon: Sliders,
      title: 'Pointer Sensitivity & Ballistics',
      summary: 'Customizable sensitivity multiplier, scroll velocity, and acceleration modes.',
      details: 'Adjust tracking sensitivity to match your display resolution and personal ergonomics. Choose between linear tracking, standard quadratic acceleration, and high-precision design modes.',
      accent: 'text-glyph-red',
      specs: ['0.2x to 4.0x sensitivity scale', 'Natural and inverted scrolling', 'Configurable trackpad boundary insets', 'Local persistent settings'],
    },
    {
      icon: HandMetal,
      title: 'Multi-Touch Gestures',
      summary: 'One-finger, two-finger, and three-finger gesture detection with settle timeouts.',
      details: 'Features an integrated state machine that distinguishes single taps from drags, and two-finger taps (right click) from scrolls. An 80ms multi-touch settle window eliminates accidental single clicks.',
      accent: 'text-glyph-violet',
      specs: ['1-Finger Tap: Left Click', '2-Finger Tap: Right Click', '3-Finger Tap: Middle Click', '2-Finger Drag: Smooth Scroll'],
    },
    {
      icon: Move,
      title: 'Tap-to-Drag & Text Selection',
      summary: 'Tactile press-and-hold drag interaction for window resizing and text marking.',
      details: 'Double-tap and hold to immediately lock the primary mouse button down. Glide across the pad to highlight code or reposition heavy desktop windows, releasing cleanly upon finger lift.',
      accent: 'text-glyph-green',
      specs: ['350ms hold-to-engage threshold', 'Visual drag indicator state', 'Failsafe button auto-release', 'Zero stuck mouse clicks'],
    },
    {
      icon: Keyboard,
      title: 'Virtual Keyboard & Modifiers',
      summary: 'Full virtual keyboard input with Ctrl, Alt, Shift, and Windows/Command modifiers.',
      details: 'Summon an on-screen keyboard deck with physical modifier latching. Type terminal commands, password fields, or text strings with native Unicode character support.',
      accent: 'text-glyph-cyan',
      specs: ['Hardware modifier latching', 'Full function keys F1-F12', 'System shortcut chords', 'Unicode & locale aware'],
    },
    {
      icon: Zap,
      title: 'Custom Shortcuts & Macro Deck',
      summary: 'One-tap execution of allowlisted system actions and productivity chords.',
      details: 'Instantly trigger Task Manager (Ctrl+Shift+Esc), Windows Search (Win+S), File Explorer, Show Desktop (Win+D), or screen snip (Win+Shift+S) without typing.',
      accent: 'text-glyph-red',
      specs: ['Strictly allowlisted action IDs', 'Zero arbitrary shell commands', 'Single-tap trigger pads', 'Customizable user decks'],
    },
    {
      icon: Volume2,
      title: 'Hardware Audio & Display Controls',
      summary: 'Direct master volume adjustment, media track scrubbing, and internal brightness.',
      details: 'Control system audio via native Windows Audio Endpoint APIs, play/pause media sessions across Spotify and YouTube, and tune internal display backlight with granular slider bars.',
      accent: 'text-glyph-amber',
      specs: ['Master audio volume & mute', 'Media session track skipping', 'Internal panel brightness', 'State feedback verification'],
    },
    {
      icon: Presentation,
      title: 'Presentation Mode',
      summary: 'Turn your smartphone into a presentation remote with laser dot and slide timers.',
      details: 'Advance slides in PowerPoint, Google Slides, or Keynote. Features a high-contrast presentation timer and a high-visibility pointer laser mode.',
      accent: 'text-glyph-violet',
      specs: ['Slide forward & backward keys', 'Vibrating slide pace timer', 'Black screen toggle (B key)', 'Full-screen slide activation'],
    },
    {
      icon: ShieldCheck,
      title: 'Trusted Device Management',
      summary: 'Manage paired computers, revoke trust tokens, and view session telemetry.',
      details: 'View active connections, cryptographic trust fingerprints, and round-trip ping times. Easily revoke access with one tap to immediately invalidate stored credentials.',
      accent: 'text-glyph-green',
      specs: ['One-tap device revocation', 'Saved trust token management', 'Cryptographic key pinning', 'Zero cloud account required'],
    },
    {
      icon: RefreshCw,
      title: 'Exponential Reconnect Backoff',
      summary: 'Automatic session recovery after Wi-Fi blips, computer sleep, or network switches.',
      details: 'If your router restarts or you walk out of Wi-Fi range, GlyphPad pauses outgoing gestures and performs smart reconnect retries with randomized jitter to prevent network floods.',
      accent: 'text-glyph-cyan',
      specs: ['1s, 2s, 4s, 8s backoff schedule', '30s capped retry limit', 'Network interface change hook', 'Automatic reconnection toggle'],
    },
    {
      icon: Sparkles,
      title: 'Tactile Haptic Tuning',
      summary: 'Vibration click pulses, audio tick feedback, and left/right handed layouts.',
      details: 'Experience realistic tactile confirmation when tapping or clicking. Flip the bottom button arrangement for left-handed ergonomics with a single toggle.',
      accent: 'text-glyph-red',
      specs: ['Subtle haptic click feedback', 'Optional audio tick sounds', 'Left-handed layout switch', 'Edge swipe deadzone tuning'],
    },
    {
      icon: ShieldAlert,
      title: 'Watchdog & Release-All Failsafe',
      summary: 'Automated 3-second heartbeat watchdog that guarantees zero stuck keys.',
      details: 'If the phone battery dies or the connection is abruptly severed, the desktop companion receiver automatically triggers an atomic Release-All to prevent stuck keys or mouse buttons.',
      accent: 'text-glyph-green',
      specs: ['3000ms heartbeat cutoff', 'Atomic Release-All on disconnect', 'Session cleanup on app crash', 'UIPI integrity respect'],
    },
  ];

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-mono text-xs">
            <span>COMPLETE CAPABILITY MATRIX</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Engineered Features.
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
            Detailed breakdown of all 12 core capabilities powering the GlyphPad wireless control ecosystem.
          </p>
        </div>

        {/* Feature Grid with Deep Dive Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            const isSelected = selectedFeature === idx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedFeature(idx)}
                className={`glass-panel-elevated rounded-3xl p-6 sm:p-8 border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isSelected ? 'border-glyph-red shadow-xl bg-zinc-900/90' : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${feat.accent}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-dot text-xs text-zinc-500">#{String(idx + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">{feat.summary}</p>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed border-t border-white/5 pt-3">
                    {feat.details}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 mt-4 space-y-1.5 font-mono text-[11px] text-zinc-400">
                  {feat.specs.map((sp, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-glyph-green shrink-0" />
                      <span>{sp}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
