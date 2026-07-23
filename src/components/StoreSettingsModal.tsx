import React, { useState, useRef } from 'react';
import { useBilling } from '../context/BillingContext';
import { QrCodeType } from '../types';
import {
  X,
  Store,
  Save,
  QrCode,
  Upload,
  Download,
  FileJson,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface StoreSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoreSettingsModal: React.FC<StoreSettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateStoreSettings, exportBackupJSON, importBackupJSON } = useBilling();

  const [formState, setFormState] = useState(settings);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const jsonFileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(formState);
    onClose();
  };

  // Upload Custom QR Image as Base64 Data URL
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size is too large. Please select an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState((prev) => ({
          ...prev,
          customQrImage: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const success = importBackupJSON(content);
        if (success) {
          setImportStatus('Backup data imported successfully!');
          setTimeout(() => {
            onClose();
          }, 1200);
        } else {
          setImportStatus('Failed to import backup JSON. Invalid file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900">Store & Payment QR Setup</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {importStatus && (
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium flex items-center gap-2">
              {importStatus.includes('successfully') ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              {importStatus}
            </div>
          )}

          {/* Store Branding */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Store Name *
              </label>
              <input
                type="text"
                required
                value={formState.storeName}
                onChange={(e) => setFormState({ ...formState, storeName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tagline / Subheader
              </label>
              <input
                type="text"
                placeholder="e.g. Daily Essentials & Grocery"
                value={formState.tagline}
                onChange={(e) => setFormState({ ...formState, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Store Address
            </label>
            <input
              type="text"
              placeholder="Shop #12, Market Square"
              value={formState.address}
              onChange={(e) => setFormState({ ...formState, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="9876543210"
                value={formState.phone}
                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GSTIN / Tax ID
              </label>
              <input
                type="text"
                placeholder="27ABCDE1234F1ZH"
                value={formState.gstin}
                onChange={(e) => setFormState({ ...formState, gstin: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* REAL QR CODE SETUP MODULE */}
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-4.5 h-4.5 text-emerald-700" />
                <h4 className="font-bold text-xs text-slate-900">Payment QR Code Options</h4>
              </div>
              
              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.showQrCode}
                  onChange={(e) => setFormState({ ...formState, showQrCode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                <span className="ml-2 text-xs font-semibold text-slate-700">
                  {formState.showQrCode ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            {formState.showQrCode && (
              <div className="space-y-3 pt-1 border-t border-emerald-200/60">
                {/* Mode Select */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Select QR Code Source
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['UPI', 'CUSTOM_IMAGE', 'URL'] as QrCodeType[]).map((mode) => (
                      <button
                        type="button"
                        key={mode}
                        onClick={() => setFormState({ ...formState, qrCodeType: mode })}
                        className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition ${
                          formState.qrCodeType === mode
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {mode === 'UPI' ? 'Dynamic UPI VPA' : mode === 'CUSTOM_IMAGE' ? 'Upload QR' : 'Website Link'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Option 1: Dynamic UPI VPA */}
                {formState.qrCodeType === 'UPI' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Merchant UPI VPA ID *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. merchantname@paytm or shop@okicici"
                      value={formState.upiId}
                      onChange={(e) => setFormState({ ...formState, upiId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Encodes the exact bill total dynamically so customers scan to pay directly!
                    </p>
                  </div>
                )}

                {/* Option 2: Upload Custom QR Image */}
                {formState.qrCodeType === 'CUSTOM_IMAGE' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Upload GPay / PhonePe / Bank QR Image
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="py-2 px-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5 text-emerald-600" /> Choose QR File
                      </button>
                      {formState.customQrImage && (
                        <div className="flex items-center gap-2">
                          <img
                            src={formState.customQrImage}
                            alt="Uploaded QR"
                            className="w-8 h-8 rounded border object-contain bg-white"
                          />
                          <span className="text-[11px] text-emerald-700 font-semibold">Loaded ✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Option 3: Custom Website URL */}
                {formState.qrCodeType === 'URL' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Store Website or Google Review Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://myretailstore.com or review link"
                      value={formState.customQrUrl}
                      onChange={(e) => setFormState({ ...formState, customQrUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Paper Width & Tax Defaults */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Thermal Paper Width
              </label>
              <select
                value={formState.paperWidth}
                onChange={(e) => setFormState({ ...formState, paperWidth: e.target.value as '58mm' | '80mm' })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="58mm">58mm (Small - 2" Thermal Roll)</option>
                <option value="80mm">80mm (Standard - 3" Thermal Roll)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formState.taxRate}
                onChange={(e) => setFormState({ ...formState, taxRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Receipt Footer Note
            </label>
            <input
              type="text"
              placeholder="e.g. Thank you for your business!"
              value={formState.footerNote}
              onChange={(e) => setFormState({ ...formState, footerNote: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Backup & Restore Data */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <input
              ref={jsonFileInputRef}
              type="file"
              accept=".json"
              onChange={handleJsonImport}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => jsonFileInputRef.current?.click()}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
            >
              <FileJson className="w-3.5 h-3.5 text-indigo-600" /> Import JSON Backup
            </button>
            <button
              type="button"
              onClick={exportBackupJSON}
              className="text-xs text-indigo-600 hover:underline font-semibold flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Export Backup JSON
            </button>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
