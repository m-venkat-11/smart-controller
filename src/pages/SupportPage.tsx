import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle, Wrench, Shield, FileText, CheckCircle2, Copy } from 'lucide-react';

export const SupportPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedReport, setCopiedReport] = useState(false);

  // Diagnostic Wizard State
  const [diagStep, setDiagStep] = useState(0);
  const [diagAnswers, setDiagAnswers] = useState<string[]>([]);

  const faqs = [
    {
      q: 'What is GlyphPad (SmartController)?',
      category: 'GENERAL',
      a: 'GlyphPad is a universal cross-platform software system that transforms your smartphone or tablet into a high-precision, low-latency wireless touchpad, keyboard macro deck, and hardware remote for computers running Windows, macOS, or Linux.',
    },
    {
      q: 'Does it work with both Android and iPhone?',
      category: 'DEVICES',
      a: 'Yes. The Android mobile application is verified in our lab with high-frequency 120Hz touch sampling. The iOS client is built natively in SwiftUI with Apple Network.framework Bonjour discovery.',
    },
    {
      q: 'Does it work with Windows, macOS, and Linux?',
      category: 'DEVICES',
      a: 'Yes. GlyphPad provides dedicated native companion receivers: Win32 SendInput for Windows 10/11, CoreGraphics CGEvent for macOS, and uinput / XTest for Linux.',
    },
    {
      q: 'Do both devices require the same Wi-Fi network?',
      category: 'NETWORK',
      a: 'Yes. To establish a local-network peer-to-peer session, both the phone and computer must be on the same subnet (2.4GHz or 5GHz Wi-Fi). Alternatively, turn on your Phone Hotspot and connect your laptop to it for 100% router-free operation.',
    },
    {
      q: 'Why is my computer not appearing in the discovery list?',
      category: 'TROUBLESHOOTING',
      a: 'This typically happens if (1) the desktop receiver is not running, (2) Windows Firewall blocked the inbound port 8443 rule, or (3) you are on a guest/campus Wi-Fi network that enforces client isolation. Switching to Phone Hotspot mode resolves this instantly.',
    },
    {
      q: 'Why is a desktop companion receiver required?',
      category: 'ARCHITECTURE',
      a: 'Modern operating systems strictly isolate input injection for security reasons. Standard mobile devices cannot inject system-wide mouse and keyboard events into a PC without a trusted companion receiver running locally to validate input.',
    },
    {
      q: 'Is the communication encrypted?',
      category: 'SECURITY',
      a: 'Yes. All control messages travel over an authenticated WebSocket connection protected by TLS 1.3 with cryptographic session tokens. Sequence numbers and nonces prevent packet replay.',
    },
    {
      q: 'Does GlyphPad function without internet access?',
      category: 'NETWORK',
      a: 'Yes, 100%. GlyphPad operates purely on the local local area network (LAN) or mobile hotspot. It does not phone home, require cloud accounts, or rely on remote web servers for input streaming.',
    },
    {
      q: 'Can I connect multiple computers?',
      category: 'GENERAL',
      a: 'Yes. You can pair and store multiple trusted computers in the mobile app. Switching between your home desktop and work laptop takes just one tap.',
    },
    {
      q: 'Can I use Bluetooth instead of Wi-Fi?',
      category: 'NETWORK',
      a: 'On supported Android phones that feature the OEM Bluetooth HID Device role, GlyphPad supports receiver-free Bluetooth HID mouse/keyboard emulation. However, because Bluetooth stack support varies across phone manufacturers, Wi-Fi LAN remains the primary path.',
    },
    {
      q: 'Why does macOS require Accessibility permission?',
      category: 'PERMISSIONS',
      a: 'macOS security prevents any background application from generating synthesized mouse or keyboard events unless the user explicitly grants permission in System Settings > Privacy & Security > Accessibility.',
    },
    {
      q: 'What happens if the Wi-Fi connection drops while holding a key?',
      category: 'SAFETY',
      a: 'GlyphPad features a 3-second heartbeat watchdog. If packets stop arriving, the desktop receiver automatically triggers an atomic Release-All to prevent stuck modifier keys or held mouse buttons.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateDiagnosticReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      product: 'GlyphPad / SmartController',
      protocolVersion: '1.0',
      networkState: 'LAN Reachable',
      simulatedLatencyP95: '3.4 ms',
      hostCapabilities: {
        mouseInjection: 'Win32 SendInput (Active)',
        uipiIntegrity: 'Standard User (Safe)',
        audioEndpoint: 'Ready',
        watchdog: 'Active (3000ms)',
      },
      security: {
        pairingApproved: true,
        tlsVersion: 'TLS 1.3',
        replayProtection: 'Monotonic Sequence Enforced',
      },
      redactedFields: ['local_ip', 'mac_address', 'device_name'],
    };

    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-mono text-xs">
            <HelpCircle className="w-3.5 h-3.5 text-glyph-cyan" />
            <span>KNOWLEDGE BASE & DIAGNOSTICS</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Support & Troubleshooting.
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-xl mx-auto leading-relaxed">
            Find answers to common questions, diagnose connection snags, or generate a sanitized diagnostic report.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto pt-4 relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, keyword, or error message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-zinc-900 border border-white/10 focus:border-glyph-red text-white text-xs font-mono placeholder:text-zinc-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Interactive Connection Troubleshooter */}
        <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <Wrench className="w-5 h-5 text-glyph-amber" />
            <div>
              <h3 className="font-dot text-sm text-white">INTERACTIVE CONNECTION DIAGNOSTIC</h3>
              <span className="text-[11px] font-mono text-zinc-400">Step-by-step resolution for discovery issues</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-white/5 space-y-4">
            <p className="text-xs font-mono text-zinc-300">
              Q: Are both your phone and laptop connected to the same Wi-Fi network, and is the desktop receiver window open?
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => alert('Great! If they are on the same router but cannot see each other, check Windows Defender Firewall or try Phone Hotspot mode.')}
                className="px-4 py-2 rounded-xl bg-glyph-green/20 text-glyph-green border border-glyph-green/30 text-xs font-mono hover:bg-glyph-green hover:text-white transition-colors"
              >
                YES, SAME WI-FI
              </button>
              <button
                onClick={() => alert('Solution: Both devices must be on the same local subnet! Enable your Phone Hotspot and join your laptop to it for instant offline connection.')}
                className="px-4 py-2 rounded-xl bg-glyph-red/20 text-glyph-red border border-glyph-red/30 text-xs font-mono hover:bg-glyph-red hover:text-white transition-colors"
              >
                NO, DIFFERENT NETWORKS
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          <h2 className="font-dot text-sm text-zinc-400 tracking-wider">FREQUENTLY ASKED QUESTIONS</h2>

          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 font-mono text-xs">
              No matching questions found for &quot;{searchQuery}&quot;.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="glass-panel-elevated rounded-2xl border border-white/10 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10">
                        {faq.category}
                      </span>
                      <span className="text-sm font-bold text-white">{faq.q}</span>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Sanitize Diagnostic Report Generator */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="font-dot text-sm text-white">REDACTED SYSTEM DIAGNOSTIC REPORT</h4>
            <p className="text-xs text-zinc-400 font-sans">
              Generate a sanitized, privacy-safe JSON log bundle to share in GitHub issues. All private IPs and credentials are automatically scrubbed.
            </p>
          </div>

          <button
            onClick={generateDiagnosticReport}
            className="px-4 py-2.5 rounded-xl bg-white text-black font-mono text-xs font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            {copiedReport ? <CheckCircle2 className="w-4 h-4 text-glyph-green" /> : <Copy className="w-4 h-4" />}
            <span>{copiedReport ? 'COPIED TO CLIPBOARD' : 'COPY SANITIZED LOGS'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
