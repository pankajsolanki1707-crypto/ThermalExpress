import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, Camera, Keyboard, CheckCircle2, AlertCircle } from 'lucide-react';
import { useBilling } from '../context/BillingContext';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ isOpen, onClose }) => {
  const { addToCart, products } = useBilling();
  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [lastScannedName, setLastScannedName] = useState<string | null>(null);

  // Manual fallback states
  const [manualCodeOrName, setManualCodeOrName] = useState('');
  const [manualPrice, setManualPrice] = useState('50');

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScanTimestamp = useRef<number>(0);

  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') {
      stopScanner();
      return;
    }

    // Initialize Html5Qrcode
    const qrRegionId = 'html5-qrcode-reader';
    let isMounted = true;

    const startCamera = async () => {
      try {
        setCameraError(null);
        const html5QrCode = new Html5Qrcode(qrRegionId, {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.QR_CODE,
          ],
          verbose: false,
        });
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 12,
            qrbox: { width: 280, height: 160 },
            aspectRatio: 1.777778,
          },
          (decodedText) => {
            if (!isMounted) return;

            // Throttle duplicate scans within 1.5 seconds
            const now = Date.now();
            if (now - lastScanTimestamp.current < 1500) {
              return;
            }
            lastScanTimestamp.current = now;

            // Look up item or create fallback
            const match = products.find(p => p.barcode === decodedText || p.name.toLowerCase() === decodedText.toLowerCase());
            const itemName = match ? match.name : `Item #${decodedText.slice(-4)}`;

            addToCart(decodedText);
            setLastScannedCode(decodedText);
            setLastScannedName(itemName);

            // Reset banner after 2.5s
            setTimeout(() => {
              setLastScannedCode(null);
              setLastScannedName(null);
            }, 2500);
          },
          () => {
            // Ignore scan failure frames
          }
        );
      } catch (err: unknown) {
        console.error('Failed to start camera scanner:', err);
        const e = err as Error;
        setCameraError(
          e.message?.includes('Permission')
            ? 'Camera permission was denied. Please allow camera access in browser settings.'
            : 'Camera non-functional or in use by another app. Try manual entry.'
        );
      }
    };

    // Small delay to allow DOM render of reader container
    const timer = setTimeout(() => {
      startCamera();
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      stopScanner();
    };
  }, [isOpen, activeTab]);

  const stopScanner = () => {
    if (scannerRef.current) {
      if (scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
      scannerRef.current = null;
    }
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCodeOrName.trim()) return;

    const numericPrice = parseFloat(manualPrice) || 50;
    addToCart(manualCodeOrName.trim(), numericPrice);
    
    setLastScannedCode(manualCodeOrName.trim());
    setLastScannedName(manualCodeOrName.trim());

    setManualCodeOrName('');
    setTimeout(() => {
      setLastScannedCode(null);
      setLastScannedName(null);
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Scan Barcode</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Point rear camera at item barcode</p>
            </div>
          </div>

          <button
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-2 bg-slate-100 dark:bg-slate-800/50 gap-2 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition ${
              activeTab === 'camera'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" /> Live Camera
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition ${
              activeTab === 'manual'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Keyboard className="w-4 h-4" /> Manual Entry
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {/* Success Banner */}
          {lastScannedCode && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div>
                <strong>Added to cart:</strong> {lastScannedName}
              </div>
            </div>
          )}

          {activeTab === 'camera' ? (
            <div className="relative">
              {/* Scanner Video Box */}
              <div
                id="html5-qrcode-reader"
                className="w-full rounded-xl overflow-hidden bg-slate-950 min-h-[260px] border border-slate-800"
              ></div>

              {cameraError && (
                <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">{cameraError}</p>
                    <button
                      onClick={() => setActiveTab('manual')}
                      className="mt-2 text-xs font-semibold underline text-slate-900 dark:text-white"
                    >
                      Switch to Manual Entry →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleManualAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Barcode Number or Item Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 8901234567890 or Cold Drink"
                  value={manualCodeOrName}
                  onChange={(e) => setManualCodeOrName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Price (fallback if item not in catalog)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={manualPrice}
                  onChange={(e) => setManualPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                Add Item to Cart
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
          Beep plays automatically on every successful item scan 🔔
        </div>
      </div>
    </div>
  );
};
