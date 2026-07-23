import React, { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { SalesRecord } from '../types';
import { formatWhatsAppBillText, generateWhatsAppLink } from '../utils/whatsapp';
import { X, History, Trash2, Send, Calendar, DollarSign, Receipt, FileSpreadsheet, Download } from 'lucide-react';

interface SalesHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SalesHistoryModal: React.FC<SalesHistoryModalProps> = ({ isOpen, onClose }) => {
  const { salesHistory, deleteSaleRecord, settings } = useBilling();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredHistory = salesHistory.filter((record) => {
    const term = searchTerm.toLowerCase();
    return (
      record.receiptNumber.includes(term) ||
      (record.customerPhone && record.customerPhone.includes(term)) ||
      record.paymentMethod.toLowerCase().includes(term)
    );
  });

  const totalRevenue = salesHistory.reduce((sum, s) => sum + s.total, 0);

  // Requirement 4: Client-side CSV Helper Generator
  const exportSalesCSV = () => {
    if (salesHistory.length === 0) return;

    const headers = ['Receipt #', 'Date/Time', 'Payment Method', 'Total Amount', 'Items Count', 'Customer Phone'];
    const rows = salesHistory.map((s) => [
      `"${s.receiptNumber}"`,
      `"${new Date(s.timestamp).toLocaleString()}"`,
      `"${s.paymentMethod}"`,
      `"${s.total.toFixed(2)}"`,
      `"${s.items.reduce((acc, i) => acc + i.quantity, 0)}"`,
      `"${s.customerPhone || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales_history_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleResendWhatsApp = (record: SalesRecord) => {
    if (!record.customerPhone) return;
    const formattedBill = formatWhatsAppBillText(
      record.items,
      settings,
      record.receiptNumber,
      record.subtotal,
      record.taxAmount,
      record.discountAmount,
      record.total
    );
    const waUrl = generateWhatsAppLink(record.customerPhone, formattedBill);
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900">Sales History & Past Bills</h3>
          </div>

          <div className="flex items-center gap-2">
            {/* REQUIREMENT 4: CSV EXPORT BUTTON */}
            <button
              onClick={exportSalesCSV}
              disabled={salesHistory.length === 0}
              className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Export to CSV
            </button>
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sales Metrics Cards */}
        <div className="grid grid-cols-2 gap-3 p-5 bg-slate-50 border-b border-slate-200">
          <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">Total Revenue</span>
              <span className="text-base font-bold text-slate-900">
                {settings.currency}{totalRevenue.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">Total Bills</span>
              <span className="text-base font-bold text-slate-900">
                {salesHistory.length} Receipts
              </span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-5 pt-4">
          <input
            type="text"
            placeholder="Search history by receipt # or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* History List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {filteredHistory.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-medium">
              No sales records found in history.
            </div>
          ) : (
            filteredHistory.map((record) => (
              <div
                key={record.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">
                      Bill #{record.receiptNumber}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                      {record.paymentMethod}
                    </span>
                  </div>

                  <span className="font-bold text-sm text-emerald-700">
                    {settings.currency}{record.total.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(record.timestamp).toLocaleString()}
                  </div>
                  <div>{record.items.reduce((s, i) => s + i.quantity, 0)} items</div>
                </div>

                {/* Items Summary preview */}
                <div className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded-lg truncate border border-slate-100">
                  {record.items.map((i) => `${i.product.name} (${i.quantity}x)`).join(', ')}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  {record.customerPhone ? (
                    <button
                      onClick={() => handleResendWhatsApp(record)}
                      className="text-xs text-emerald-700 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Send className="w-3 h-3" /> Resend WhatsApp (+91 {record.customerPhone})
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400">No phone attached</span>
                  )}

                  <button
                    onClick={() => deleteSaleRecord(record.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
