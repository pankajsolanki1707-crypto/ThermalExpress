import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useBilling } from '../context/BillingContext';
import { generateESCPOSBuffer, printViaWebBluetooth } from '../utils/escpos';
import { formatWhatsAppBillText, generateWhatsAppLink } from '../utils/whatsapp';
import { downloadReceiptPDF, shareReceiptPDF } from '../utils/pdf';
import {
  Printer,
  Send,
  Bluetooth,
  FileDown,
  Share2,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Zap,
} from 'lucide-react';

export const PrintAndShareControls: React.FC = () => {
  const {
    cart,
    settings,
    activeReceiptNumber,
    subtotal,
    taxAmount,
    discountAmount,
    totalAmount,
    completeSale,
  } = useBilling();

  const [customerPhone, setCustomerPhone] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [printStatus, setPrintStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CASH' | 'CARD'>('UPI');

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // Ignore if web environment restricts canvas
    }
  };

  // 1. Primary Action: Web Bluetooth Thermal Print
  const handleBluetoothPrint = async (): Promise<boolean> => {
    if (cart.length === 0) return false;
    setIsPrinting(true);
    setPrintStatus({ type: 'idle', message: '' });

    try {
      const escposBuffer = generateESCPOSBuffer(
        cart,
        settings,
        activeReceiptNumber,
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
        paymentMethod
      );

      await printViaWebBluetooth(escposBuffer);

      setPrintStatus({
        type: 'success',
        message: 'Receipt printed via Bluetooth thermal printer!',
      });
      triggerCelebration();

      completeSale(paymentMethod, customerPhone || undefined);
      return true;
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Print failed:', error);
      setPrintStatus({
        type: 'error',
        message: error.message || 'Bluetooth printing failed. Ensure printer is ON.',
      });
      return false;
    } finally {
      setIsPrinting(false);
    }
  };

  // 2. WhatsApp Share Helper
  const handleWhatsAppShare = async (): Promise<boolean> => {
    if (cart.length === 0) return false;

    // Try Web Share API with PDF file first on mobile
    const sharedNative = await shareReceiptPDF(activeReceiptNumber, settings.storeName, customerPhone);
    if (sharedNative) {
      triggerCelebration();
      completeSale(paymentMethod, customerPhone || undefined);
      setPrintStatus({
        type: 'success',
        message: 'PDF receipt shared successfully!',
      });
      return true;
    }

    if (!customerPhone || customerPhone.replace(/\D/g, '').length < 10) {
      setPrintStatus({
        type: 'error',
        message: 'Please enter a 10-digit mobile number for WhatsApp receipt.',
      });
      return false;
    }

    const formattedBill = formatWhatsAppBillText(
      cart,
      settings,
      activeReceiptNumber,
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount
    );

    const waUrl = generateWhatsAppLink(customerPhone, formattedBill);
    window.open(waUrl, '_blank');

    triggerCelebration();
    completeSale(paymentMethod, customerPhone);
    setPrintStatus({
      type: 'success',
      message: 'WhatsApp text receipt link launched!',
    });
    return true;
  };

  // 3. COMBINED WORKFLOW: Print & Send WhatsApp Simultaneously!
  const handlePrintAndWhatsApp = async () => {
    if (cart.length === 0) return;

    if (customerPhone && customerPhone.replace(/\D/g, '').length >= 10) {
      const formattedBill = formatWhatsAppBillText(
        cart,
        settings,
        activeReceiptNumber,
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount
      );
      const waUrl = generateWhatsAppLink(customerPhone, formattedBill);
      window.open(waUrl, '_blank');
    }

    await handleBluetoothPrint();
  };

  // 4. Download PDF Receipt (Secondary Button)
  const handleDownloadPDF = async () => {
    if (cart.length === 0) return;
    setIsGeneratingPdf(true);
    setPrintStatus({ type: 'idle', message: '' });

    try {
      await downloadReceiptPDF(activeReceiptNumber, settings.storeName);
      setPrintStatus({
        type: 'success',
        message: `Receipt #${activeReceiptNumber} saved as PDF!`,
      });
      triggerCelebration();
      completeSale(paymentMethod, customerPhone || undefined);
    } catch (err: unknown) {
      const error = err as Error;
      setPrintStatus({
        type: 'error',
        message: 'Failed to generate PDF: ' + error.message,
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // 5. Standard Browser Desktop Print
  const handleStandardPrint = () => {
    if (cart.length === 0) return;
    triggerCelebration();
    window.print();
    completeSale(paymentMethod, customerPhone || undefined);
  };

  const isCartEmpty = cart.length === 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 text-xs tracking-wide uppercase">
          Checkout & Receipt Actions
        </h3>
        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
          Ready
        </span>
      </div>

      {/* Payment Method Selector */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
          Payment Method
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(['UPI', 'CASH', 'CARD'] as const).map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition ${
                paymentMethod === method
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {method === 'UPI' ? '⚡ UPI QR' : method === 'CASH' ? '💵 Cash' : '💳 Card'}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Mobile Input for WhatsApp */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
          Customer WhatsApp Number (Optional)
        </label>
        <div className="flex gap-1.5">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2 text-xs text-slate-400 font-medium">+91</span>
            <input
              type="tel"
              maxLength={10}
              placeholder="9876543210"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full pl-11 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleWhatsAppShare}
            disabled={isCartEmpty}
            className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 disabled:opacity-40 text-slate-800 font-semibold text-xs flex items-center gap-1 shadow-xs transition"
          >
            <Send className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp
          </button>
        </div>
      </div>

      {/* Status Feedback Banner */}
      {printStatus.message && (
        <div
          className={`p-2.5 rounded-xl text-xs flex items-start gap-2 border ${
            printStatus.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {printStatus.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          )}
          <span className="flex-1 font-medium">{printStatus.message}</span>
        </div>
      )}

      {/* ACTION HIERARCHY FIX: High-Visibility Primary Call-To-Action Button */}
      <div className="space-y-2 pt-1">
        {/* 1. PRIMARY CTA: Print ESC/POS Bluetooth Thermal Receipt */}
        <button
          onClick={handleBluetoothPrint}
          disabled={isCartEmpty || isPrinting}
          className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 active:scale-98"
        >
          {isPrinting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Connecting Bluetooth Printer...
            </>
          ) : (
            <>
              <Bluetooth className="w-4.5 h-4.5" /> Print ESC/POS (Web Bluetooth)
            </>
          )}
        </button>

        {/* 2. COMBINED STREAMLINED WORKFLOW: Print & Send WhatsApp */}
        <button
          onClick={handlePrintAndWhatsApp}
          disabled={isCartEmpty || isPrinting}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" /> Print & Send WhatsApp
        </button>

        {/* 3. SECONDARY GHOST BUTTONS: Download PDF, Share PDF, System Print */}
        <div className="grid grid-cols-3 gap-1.5 pt-0.5">
          <button
            onClick={handleDownloadPDF}
            disabled={isCartEmpty || isGeneratingPdf}
            className="py-2 px-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 disabled:opacity-40 text-slate-700 font-semibold text-[11px] shadow-xs transition flex items-center justify-center gap-1"
          >
            {isGeneratingPdf ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <>
                <FileDown className="w-3 h-3 text-indigo-600" /> PDF
              </>
            )}
          </button>

          <button
            onClick={handleWhatsAppShare}
            disabled={isCartEmpty}
            className="py-2 px-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 disabled:opacity-40 text-slate-700 font-semibold text-[11px] shadow-xs transition flex items-center justify-center gap-1"
          >
            <Share2 className="w-3 h-3 text-emerald-600" /> Share
          </button>

          <button
            onClick={handleStandardPrint}
            disabled={isCartEmpty}
            className="py-2 px-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 disabled:opacity-40 text-slate-700 font-semibold text-[11px] shadow-xs transition flex items-center justify-center gap-1"
          >
            <Printer className="w-3 h-3 text-slate-500" /> Desktop
          </button>
        </div>
      </div>
    </div>
  );
};
