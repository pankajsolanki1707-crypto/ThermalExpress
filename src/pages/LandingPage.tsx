import React, { useState } from 'react';
import { SEO_ROUTES, SEORoute } from '../seo/sitemap';
import { SEOMetadata } from '../seo/SEOMetadata';
import { SoftwareApplicationSchema, FAQPageSchema } from '../seo/JsonLd';
import { Logo } from '../components/Logo';
import {
  Printer,
  WifiOff,
  Send,
  CheckCircle2,
  HelpCircle,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  ChevronDown,
} from 'lucide-react';

interface LandingPageProps {
  onLaunchApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  const [currentRoutePath, setCurrentRoutePath] = useState<string>('/');
  const currentRoute: SEORoute =
    SEO_ROUTES.find((r) => r.path === currentRoutePath) || SEO_ROUTES[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Dynamic SEO Meta & Head Tags */}
      <SEOMetadata
        title={currentRoute.title}
        description={currentRoute.description}
        keywords={currentRoute.keywords}
      />
      <SoftwareApplicationSchema />
      <FAQPageSchema />

      {/* Navigation Header with Fresh Logo */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          
          {/* Fresh Vector Logo */}
          <Logo onClick={onLaunchApp} />

          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchApp}
              className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Launch Terminal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-6">
          {/* Hardware Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <WifiOff className="w-3.5 h-3.5" /> 100% Offline-First • Zero Signup Required
          </div>

          {/* Dynamic H1 Heading */}
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            {currentRoute.h1}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {currentRoute.description}
          </p>

          {/* Primary Call to Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onLaunchApp}
              className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 transition flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Open Billing Workspace (Free)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>

          {/* Programmatic SEO Page Selector Tabs */}
          <div className="pt-8 border-t border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block mb-3 uppercase tracking-wider">
              Explore Targeted Hardware & Industry SEO Landing Pages:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
              {SEO_ROUTES.map((route) => (
                <button
                  key={route.path}
                  onClick={() => setCurrentRoutePath(route.path)}
                  className={`py-1.5 px-3.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    currentRoutePath === route.path
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {route.path === '/' ? '🌐 Generic Thermal' : route.title.split('|')[0].trim()}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="py-12 bg-white border-y border-slate-200 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Why Micro-Retailers Choose Thermal Express
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Zero friction, zero monthly fees, built strictly for fast counter billing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <article className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Printer className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Web Bluetooth Printing</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Connect 58mm & 80mm Bluetooth thermal printers directly from Google Chrome. Sends raw ESC/POS binary streams without drivers.
                </p>
                <ul className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-200">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Supports 58mm (32 cols) & 80mm (48 cols)</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Native ESC/POS paper cut commands</li>
                </ul>
              </article>

              <article className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">In-Browser Camera Scanner</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Use your smartphone or webcam as a high-speed retail barcode scanner. Plays an instant retail audio beep on code detection.
                </p>
                <ul className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-200">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> EAN-13, UPC-A, Code-128 & QR support</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Synthesized Web Audio API scan beep</li>
                </ul>
              </article>

              <article className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Send className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">WhatsApp & PDF E-Receipts</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Send digital bills instantly to customer WhatsApp numbers or download high-DPI PDF files without external thermal hardware.
                </p>
                <ul className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-200">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 1-Click WhatsApp deep links</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Real Shopper UPI QR code integration</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* Technical Guide Section */}
        <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
          <article className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-600" /> How to connect a Bluetooth Thermal Printer to Chrome
            </h2>
            <ol className="text-xs sm:text-sm text-slate-700 space-y-2 list-decimal pl-5 leading-relaxed">
              <li>Turn on your portable 58mm or 80mm Bluetooth thermal receipt printer.</li>
              <li>Open <strong>Thermal Express</strong> in Google Chrome or Microsoft Edge on Android, Windows, or macOS.</li>
              <li>Add items to your cart and click <strong>"Print ESC/POS (Web Bluetooth)"</strong>.</li>
              <li>Select your Bluetooth thermal printer from the native browser popup.</li>
              <li>The browser will establish a direct GATT connection and send raw ESC/POS commands instantly!</li>
            </ol>
          </article>

          <article className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" /> Supported Hardware (58mm, 80mm, ESC/POS)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Thermal Express supports all standard ESC/POS compliant Bluetooth thermal printers, including PT-210, MTP-II, RPP02N, Xprinter, and POS-5802.
            </p>
          </article>

          {/* Structured FAQ Section */}
          <article className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" /> Frequently Asked Questions (FAQ)
            </h2>
            
            <div className="space-y-3 pt-2 text-xs sm:text-sm">
              <details className="group p-4 rounded-xl bg-slate-50 border border-slate-200 transition">
                <summary className="font-bold text-slate-900 cursor-pointer flex items-center justify-between">
                  <span>How to print to thermal printer from browser?</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition" />
                </summary>
                <p className="mt-2 text-slate-600 leading-relaxed">
                  Thermal Express uses native Web Bluetooth API. Simply click "Print ESC/POS", pick your paired printer, and print without installing drivers.
                </p>
              </details>

              <details className="group p-4 rounded-xl bg-slate-50 border border-slate-200 transition">
                <summary className="font-bold text-slate-900 cursor-pointer flex items-center justify-between">
                  <span>Is this receipt maker really free?</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition" />
                </summary>
                <p className="mt-2 text-slate-600 leading-relaxed">
                  Yes, 100% free with no monthly fees, no credit card required, and no account signup.
                </p>
              </details>

              <details className="group p-4 rounded-xl bg-slate-50 border border-slate-200 transition">
                <summary className="font-bold text-slate-900 cursor-pointer flex items-center justify-between">
                  <span>Does it work offline?</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition" />
                </summary>
                <p className="mt-2 text-slate-600 leading-relaxed">
                  Yes, all items, settings, and sales records are saved strictly in your browser local storage.
                </p>
              </details>
            </div>
          </article>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <p className="font-semibold text-slate-700">Thermal Express • Free Retail POS & Web Bluetooth Billing</p>
        <p>Built for micro-retailers, Kirana stores, cafes, and mobile vendors worldwide.</p>
      </footer>
    </div>
  );
};
