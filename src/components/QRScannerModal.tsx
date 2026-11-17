import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (scannedText: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
}) => {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [manualCode, setManualCode] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setErrorMessage('');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        setErrorMessage('Camera access is not supported on this browser/environment.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setHasCameraPermission(true);
        startBarcodeDetection();
      }
    } catch (err: any) {
      console.warn('Camera request error:', err);
      setHasCameraPermission(false);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please allow camera access in your browser settings or enter the pairing code manually.'
          : 'Could not initialize camera: ' + (err.message || 'Unknown error')
      );
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const startBarcodeDetection = () => {
    // Check if browser has native BarcodeDetector API (Chrome Android, Safari iOS 17+, Edge)
    if ('BarcodeDetector' in window) {
      const barcodeDetector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });

      const scanLoop = async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) {
          animationFrameRef.current = requestAnimationFrame(scanLoop);
          return;
        }

        try {
          const barcodes = await barcodeDetector.detect(videoRef.current);
          if (barcodes.length > 0) {
            const rawValue = barcodes[0].rawValue;
            if (rawValue) {
              if (navigator.vibrate) navigator.vibrate(40);
              stopCamera();
              onScanSuccess(rawValue);
              onClose();
              return;
            }
          }
        } catch (_) {}

        animationFrameRef.current = requestAnimationFrame(scanLoop);
      };

      animationFrameRef.current = requestAnimationFrame(scanLoop);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    stopCamera();
    onScanSuccess(manualCode.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-[32px] bg-[#111315] border border-white/20 p-5 sm:p-6 space-y-4 shadow-2xl flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mt-2">
          <Camera className="w-5 h-5 text-[#eb0029]" />
          <h3 className="font-dot text-sm font-bold tracking-widest text-white uppercase">
            SCAN DESKTOP QR CODE
          </h3>
        </div>
        <p className="font-mono text-xs text-zinc-400 max-w-xs">
          Point your camera at the QR code displayed on your computer screen to pair instantly.
        </p>

        {/* Video Camera Viewport */}
        <div className="relative w-64 h-64 rounded-2xl overflow-hidden bg-black border-2 border-[#eb0029]/50 flex items-center justify-center shadow-inner">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            playsInline
          />

          {/* Scanner Overlay Crosshair */}
          <div className="absolute inset-4 border border-dashed border-white/30 rounded-xl pointer-events-none flex items-center justify-center">
            <div className="w-12 h-1 bg-[#eb0029] absolute top-1/2 -translate-y-1/2 animate-pulse"></div>
          </div>

          {hasCameraPermission === false && (
            <div className="absolute inset-0 bg-black/90 p-4 flex flex-col items-center justify-center text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-[#eb0029]" />
              <p className="text-xs text-zinc-300 font-mono">{errorMessage}</p>
              <button
                onClick={startCamera}
                className="mt-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Camera
              </button>
            </div>
          )}
        </div>

        {/* Fallback Manual Entry */}
        <div className="w-full pt-2 border-t border-white/10">
          <form onSubmit={handleManualSubmit} className="space-y-2">
            <label className="text-[11px] font-mono text-zinc-400 block text-left">
              Or enter IP / Pairing Code manually:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="e.g. 192.168.1.100:8443 or PIN"
                className="flex-1 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#eb0029]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#eb0029] hover:bg-[#ff1a40] text-white text-xs font-bold font-mono tracking-wider transition-colors"
              >
                CONNECT
              </button>
            </div>
          </form>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
          <ShieldCheck className="w-3 h-3 text-[#00e575]" />
          <span>Local Wi-Fi Only • Cryptographically Signed Challenge</span>
        </div>
      </div>
    </div>
  );
};
