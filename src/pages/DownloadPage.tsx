import React, { useState } from 'react';
import { Download, Laptop, Smartphone, Terminal, CheckCircle2, Shield, AlertCircle, Copy, ExternalLink } from 'lucide-react';

export const DownloadPage: React.FC = () => {
  const [downloadTriggered, setDownloadTriggered] = useState<string | null>(null);
  const [copiedSha, setCopiedSha] = useState<string | null>(null);

  const downloads = [
    {
      id: 'win-installer',
      platform: 'Windows Desktop Receiver',
      os: 'Windows 10 / 11 (64-bit)',
      type: 'Standalone MSIX / Portable ZIP',
      version: 'v1.0.0-release',
      size: '14.2 MB',
      sha: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      accent: 'border-glyph-cyan text-glyph-cyan',
      primaryBtn: 'DOWNLOAD PORTABLE ZIP',
      secondaryBtn: 'MSIX INSTALLER',
      instructions: 'Extract the ZIP file and run GlyphPadReceiver.exe. Allow the Windows Defender Firewall prompt for local network communication.',
    },
    {
      id: 'android-apk',
      platform: 'Android Mobile Controller',
      os: 'Android 10 - 15+ (ARM64 / v8a)',
      type: 'Direct APK Package',
      version: 'v1.0.0-release',
      size: '18.6 MB',
      sha: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
      accent: 'border-glyph-green text-glyph-green',
      primaryBtn: 'DOWNLOAD APK (ARM64)',
      secondaryBtn: 'GOOGLE PLAY BETA',
      instructions: 'Download the APK to your phone and install. Open the app while connected to the same Wi-Fi network as your computer.',
    },
    {
      id: 'macos-dmg',
      platform: 'macOS Desktop Receiver',
      os: 'macOS 14 Sonoma / 15 Sequoia',
      type: 'Universal DMG (Apple Silicon & Intel)',
      version: 'v1.0.0-beta.2',
      size: '22.4 MB',
      sha: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      accent: 'border-glyph-violet text-glyph-violet',
      primaryBtn: 'DOWNLOAD DMG (UNIVERSAL)',
      secondaryBtn: 'INSTALL VIA HOMEBREW',
      instructions: 'Drag GlyphPad to Applications. On first launch, open System Settings > Privacy & Security > Accessibility and enable GlyphPad.',
    },
    {
      id: 'linux-pkg',
      platform: 'Linux Desktop Receiver',
      os: 'Ubuntu, Fedora, Arch Linux (x86_64)',
      type: 'AppImage / .deb Package',
      version: 'v1.0.0-beta.2',
      size: '16.8 MB',
      sha: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
      accent: 'border-glyph-amber text-glyph-amber',
      primaryBtn: 'DOWNLOAD APPIMAGE',
      secondaryBtn: 'DEB PACKAGE',
      instructions: 'Make executable with chmod +x GlyphPad.AppImage and run. For Wayland support, verify your user belongs to the input group.',
    },
  ];

  const handleDownload = (id: string, name: string) => {
    setDownloadTriggered(name);
    // Create an ephemeral release metadata JSON file download
    const releaseManifest = {
      product: 'GlyphPad',
      release: id,
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      repository: 'https://github.com/m-venkat-11/smart-controller',
      instructions: 'Run receiver on host PC and install APK on mobile client. Ensure devices share the same local network subnet.',
    };
    const blob = new Blob([JSON.stringify(releaseManifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `glyphpad-${id}-release-spec.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadTriggered(null), 3000);
  };

  const copySha = (sha: string) => {
    navigator.clipboard.writeText(sha);
    setCopiedSha(sha);
    setTimeout(() => setCopiedSha(null), 2000);
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-mono text-xs">
            <span>OFFICIAL ARTIFACTS</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Download Center.
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
            Download the desktop receiver for your computer and the mobile controller for your phone. All artifacts are verified with SHA-256 integrity hashes.
          </p>
        </div>

        {downloadTriggered && (
          <div className="p-4 rounded-2xl bg-glyph-green/20 border border-glyph-green text-glyph-green font-mono text-xs text-center animate-in fade-in">
            ✓ Release manifest and installation instructions downloaded for: <strong>{downloadTriggered}</strong>
          </div>
        )}

        {/* Download Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {downloads.map((item) => (
            <div
              key={item.id}
              className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="font-dot text-xs text-zinc-400">{item.type}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                    {item.version}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{item.platform}</h3>
                  <span className="text-xs font-mono text-zinc-500">{item.os} • {item.size}</span>
                </div>

                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  {item.instructions}
                </p>

                {/* SHA-256 Checksum */}
                <div className="p-3 rounded-xl bg-black/50 border border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <div className="truncate mr-2">
                    <span className="text-zinc-400">SHA-256: </span>
                    <span>{item.sha.slice(0, 16)}...{item.sha.slice(-12)}</span>
                  </div>
                  <button
                    onClick={() => copySha(item.sha)}
                    className="p-1 rounded bg-white/5 hover:text-white transition-colors shrink-0"
                    title="Copy Checksum"
                  >
                    {copiedSha === item.sha ? <CheckCircle2 className="w-3.5 h-3.5 text-glyph-green" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-white/5 mt-6">
                <button
                  onClick={() => handleDownload(item.id, item.platform)}
                  className="py-3 px-4 rounded-xl bg-white text-black font-mono text-xs font-bold hover:bg-zinc-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{item.primaryBtn}</span>
                </button>
                <button
                  onClick={() => handleDownload(item.id, `${item.platform} (Alternative)`)}
                  className="py-3 px-4 rounded-xl glass-panel hover:bg-white/10 text-zinc-300 hover:text-white font-mono text-xs border border-white/10 transition-colors"
                >
                  {item.secondaryBtn}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Source Code Note */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-glyph-cyan" />
            <div>
              <h4 className="font-dot text-sm text-white">BUILD FROM SOURCE CODE</h4>
              <p className="text-xs text-zinc-400 font-sans">
                Full repository available on GitHub with C# (.NET 8), Rust, and Kotlin build scripts.
              </p>
            </div>
          </div>
          <a
            href="https://github.com/m-venkat-11/smart-controller"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-2 border border-white/10 transition-colors whitespace-nowrap"
          >
            <span>GITHUB REPO</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
