import React from 'react';
import QRCode from 'react-qr-code';
import { useBilling } from '../context/BillingContext';
import { Store, QrCode } from 'lucide-react';

interface ThermalReceiptProps {
  receiptNumberOverride?: string;
  paymentMethod?: string;
}

export const ThermalReceipt: React.FC<ThermalReceiptProps> = ({
  receiptNumberOverride,
  paymentMethod = 'UPI',
}) => {
  const {
    cart,
    settings,
    activeReceiptNumber,
    subtotal,
    taxAmount,
    discountAmount,
    totalAmount,
  } = useBilling();

  const receiptNo = receiptNumberOverride || activeReceiptNumber;
  const is58mm = settings.paperWidth === '58mm';

  const currentDate = new Date().toLocaleString('en-IN', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  const activeUpiId = settings.upiId || 'merchant@upi';
  const shouldRenderQr = settings.showQrCode !== false;
  
  const upiPayUrl = activeUpiId
    ? `upi://pay?pa=${activeUpiId.trim()}&pn=${encodeURIComponent(
        settings.storeName || 'Store'
      )}&am=${totalAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Bill#' + receiptNo)}`
    : '';

  return (
    <div className="flex flex-col items-center w-full">
      {/* Format Indicator Badge */}
      <div className="mb-2 flex items-center gap-2 text-xs text-slate-500 no-print">
        <Store className="w-3.5 h-3.5" />
        <span>Format: <strong className="text-slate-800">{settings.paperWidth}</strong></span>
        <span>•</span>
        <span>Cols: <strong>{is58mm ? '32 chars' : '48 chars'}</strong></span>
      </div>

      {/* Simulated Thermal Receipt Container */}
      <div
        id="printable-thermal-receipt"
        className={`receipt-paper font-mono text-slate-900 transition-all duration-300 p-5 rounded-sm border border-slate-200 select-none bg-white ${
          is58mm ? 'w-[280px] text-xs' : 'w-[360px] text-sm'
        }`}
        style={{
          fontFamily: '"Courier Prime", Courier, monospace',
          lineHeight: 1.5,
        }}
      >
        {/* Jagged paper tear edges */}
        <div className="receipt-jagged-top no-print" />
        <div className="receipt-jagged-bottom no-print" />

        {/* Store Header */}
        <div className="text-center mb-3">
          <h2 className="font-bold text-base tracking-tight uppercase border-b border-black/20 pb-1">
            {settings.storeName || 'Your Online Quick Bill'}
          </h2>
          {settings.tagline && (
            <p className="text-[11px] italic mt-1 opacity-80 leading-snug">{settings.tagline}</p>
          )}
          {settings.address && (
            <p className="text-[11px] leading-normal mt-1 opacity-90">{settings.address}</p>
          )}
          {settings.phone && (
            <p className="text-[11px] mt-0.5">Ph: {settings.phone}</p>
          )}
          {settings.gstin && (
            <p className="text-[11px] mt-0.5 font-bold">GSTIN: {settings.gstin}</p>
          )}
        </div>

        {/* Divider */}
        <div className="border-b border-dashed border-black/40 my-2" />

        {/* Receipt Meta */}
        <div className="text-[11px] space-y-1">
          <div className="flex justify-between">
            <span>Bill No:</span>
            <span className="font-bold">#{receiptNo}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{currentDate}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment:</span>
            <span className="font-bold">{paymentMethod}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-dashed border-black/40 my-2" />

        {/* Item Table Header */}
        <div className="flex justify-between font-bold text-[11px] border-b border-black/20 pb-1">
          <span>ITEM (QTY)</span>
          <span>AMT ({settings.currency})</span>
        </div>

        {/* Item List with high-legibility vertical line height */}
        <div className="my-2.5 space-y-2 min-h-[50px]">
          {cart.length === 0 ? (
            <div className="text-center py-4 text-[11px] opacity-50 italic">
              [ Empty Cart ]
            </div>
          ) : (
            cart.map(({ product, quantity }) => (
              <div key={product.id} className="text-[11px] leading-normal">
                <div className="font-bold truncate py-0.5 text-slate-900">{product.name}</div>
                <div className="flex justify-between pl-2 text-[11px]">
                  <span>
                    {quantity} x {settings.currency}{product.price.toFixed(2)}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {settings.currency}{(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Divider */}
        <div className="border-b border-dashed border-black/40 my-2" />

        {/* Totals Breakdown */}
        <div className="space-y-1 text-[11px]">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{settings.currency}{subtotal.toFixed(2)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-800 font-medium">
              <span>Discount:</span>
              <span>-{settings.currency}{discountAmount.toFixed(2)}</span>
            </div>
          )}

          {settings.taxRate > 0 && (
            <div className="flex justify-between">
              <span>Tax ({settings.taxRate}%):</span>
              <span>{settings.currency}{taxAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="border-t-2 border-black my-1 pt-1 flex justify-between font-bold text-sm">
            <span>TOTAL:</span>
            <span>{settings.currency}{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-dashed border-black/40 my-3" />

        {/* SHOPPER UPI PAYMENT QR CODE */}
        {shouldRenderQr && activeUpiId ? (
          <div className="flex flex-col items-center my-3 text-center">
            {settings.qrCodeType === 'CUSTOM_IMAGE' && settings.customQrImage ? (
              <div className="bg-white p-1 rounded border border-black/30 shadow-xs inline-block">
                <img
                  src={settings.customQrImage}
                  alt="Merchant Payment QR"
                  className={is58mm ? 'w-24 h-24 object-contain' : 'w-28 h-28 object-contain'}
                />
              </div>
            ) : (
              <div className="bg-white p-2.5 rounded border border-black/30 shadow-xs inline-block">
                <QRCode
                  value={upiPayUrl}
                  size={is58mm ? 105 : 125}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox={`0 0 256 256`}
                />
              </div>
            )}
            <div className="text-[11px] font-bold mt-2 flex items-center gap-1 justify-center text-slate-900">
              <QrCode className="w-3.5 h-3.5 text-emerald-700" /> Scan & Pay via UPI
            </div>
            <div className="text-[10px] font-semibold text-slate-700 mt-0.5">{activeUpiId}</div>
          </div>
        ) : null}

        {/* Footer Message */}
        <div className="text-center text-[10px] mt-3 space-y-0.5 border-t border-dotted border-black/30 pt-2">
          <p className="font-bold">{settings.footerNote || 'Thank You For Your Business!'}</p>
          <p className="opacity-70">Powered by Thermal Express</p>
        </div>
      </div>
    </div>
  );
};
