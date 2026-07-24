import React from 'react';
import { Logo } from '../components/Logo';
import { SEOMetadata } from '../seo/SEOMetadata';
import {
  ShieldCheck,
  HardDrive,
  UserX,
  WifiOff,
  Bluetooth,
  Camera,
  MessageSquare,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  FileText
} from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBackToApp: () => void;
  onGoToAbout: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({
  onBackToApp,
  onGoToAbout,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white flex flex-col">
      {/* SEO Metadata for Privacy Policy */}
      <SEOMetadata
        title="Privacy Policy | Thermal Express - 100% Offline & Private POS Billing"
        description="Thermal Express Privacy Policy: 100% local browser storage, zero account signup, zero data collection. Learn how your store inventory and sales data remain completely private on your device."
        keywords={[
          'Thermal Express Privacy Policy',
          'Offline POS Privacy',
          'Local Storage Receipt Maker Privacy',
          'Zero Signup Billing Data Security',
        ]}
      />

      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Logo onClick={onBackToApp} />

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onGoToAbout}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-600 transition px-3 py-2 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              About Us
            </button>
            <button
              onClick={onBackToApp}
              className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Billing</span>
            </button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        
        {/* Header Hero Banner */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Privacy First Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Thermal Express Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            Effective Date: July 24, 2026 • Last Updated: July 2026
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            At <strong>Thermal Express</strong>, we believe that your store's sales data, inventory catalog, customer details, and revenue records belong strictly to you. Unlike cloud-based POS platforms that upload your business data to external servers, Thermal Express is engineered ground-up as a <strong>100% offline-first, client-side web application</strong>.
          </p>
        </section>

        {/* Core Guarantees Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <HardDrive className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Local Data Storage</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All inventory items, prices, sales history, and store details stay inside your browser's IndexedDB / LocalStorage.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <UserX className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Zero Signup Required</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No registration, no accounts, no passwords, and no corporate email tracking. Start billing in one click.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <WifiOff className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Works 100% Offline</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No internet connection needed for billing, barcode scanning, printing thermal bills, or searching inventory.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-emerald-600" />
              1. Information We Storage & How It Is Handled
            </h2>
            <p>
              Thermal Express operates entirely within your web browser environment. When you configure your store name, address, GSTIN, currency, upload a store logo, or create product categories and items, this information is processed locally by client-side JavaScript.
            </p>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <span className="font-semibold text-slate-800">What is stored on your device:</span>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Store profile details (Store Name, Subtitle, Contact, GSTIN, Address, UPI ID).</li>
                <li>Product Inventory items (Name, Price, SKU/Barcode, Stock quantity, Category).</li>
                <li>Transaction Sales Records (Receipt ID, timestamp, items purchased, totals, payment method).</li>
                <li>App configuration preferences (thermal paper size, tax rate, auto-cut settings).</li>
              </ul>
            </div>
            <p className="text-slate-600 font-semibold">
              🔒 None of this data is ever transmitted, synced, or backed up to Thermal Express servers or third-party cloud infrastructure.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Bluetooth className="w-5 h-5 text-indigo-600" />
              2. Device Permissions (Web Bluetooth & Barcode Scanner Camera)
            </h2>
            <p>
              To deliver retail billing functionality directly inside your web browser, Thermal Express requests browser API permissions:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <Bluetooth className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Web Bluetooth API (ESC/POS Printing):</strong> Allows your browser to discover and send binary print commands directly to 58mm or 80mm Bluetooth thermal printers. The connection is ephemeral (GATT protocol) and operates strictly peer-to-peer between browser and printer.
                </div>
              </li>
              <li className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <Camera className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Camera Access (In-Browser Barcode Scanner):</strong> Used solely to process video frames in memory using client-side barcode decoding engines (html5-qrcode). Camera feeds are never recorded, saved, or transmitted.
                </div>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-600" />
              3. WhatsApp Receipt Sharing & Digital Sharing
            </h2>
            <p>
              When you choose to share a receipt with a customer via WhatsApp:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>The application formats a standard WhatsApp Web deep link (<code className="bg-slate-100 px-1 py-0.5 rounded">https://wa.me/&lt;phone&gt;?text=...</code>).</li>
              <li>Customer phone numbers and item summary text are compiled completely on your local machine.</li>
              <li>Thermal Express does not store customer phone numbers, log chat links, or track messaging history.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-600" />
              4. Cookies, Analytics & Tracking
            </h2>
            <p>
              Thermal Express does not use invasive advertising cookies, third-party tracking scripts, or cross-site fingerprinting tools.
            </p>
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>We do NOT sell, rent, monetize, or trade user data or store transactions under any circumstances.</span>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-600" />
              5. Data Control, Retention & One-Click Wiping
            </h2>
            <p>
              Because all data resides exclusively in your web browser's storage, you retain 100% ownership and complete administrative control:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Export Backup:</strong> You can export your sales history and inventory at any time.</li>
              <li><strong>Instant Data Erasure:</strong> Clicking the <span className="text-rose-600 font-semibold">"Reset / Clear All Data"</span> icon in the app header or store settings immediately and permanently deletes all stored products, receipt records, and store settings from your browser storage.</li>
              <li><strong>Browser Cache Clearing:</strong> Clearing your browser history or site data for this domain also completely erases all local application data.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              6. Contact Us & Privacy Enquiries
            </h2>
            <p>
              If you have any questions or feedback regarding our privacy commitments or local storage architecture, feel free to review our open source repository or contact our team via the application support link.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 space-y-2 mt-auto">
        <div className="flex justify-center items-center gap-4 text-slate-600 font-medium">
          <button onClick={onBackToApp} className="hover:text-emerald-600 transition">
            Home Billing Terminal
          </button>
          <span>•</span>
          <button onClick={onGoToAbout} className="hover:text-emerald-600 transition">
            About Us
          </button>
          <span>•</span>
          <span className="text-emerald-700 font-bold">Privacy Policy</span>
        </div>
        <p>© 2026 Thermal Express • Built for 100% Private & Offline Micro-Retail Billing</p>
      </footer>
    </div>
  );
};
