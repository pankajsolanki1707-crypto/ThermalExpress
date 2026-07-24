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
  Info,
  Zap,
  Lock,
  Heart
} from 'lucide-react';

interface AboutPageProps {
  onLaunchApp: () => void;
  onGoToPrivacy: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onLaunchApp,
  onGoToPrivacy,
}) => {
  const [currentRoutePath, setCurrentRoutePath] = useState<string>('/');
  const currentRoute: SEORoute =
    SEO_ROUTES.find((r) => r.path === currentRoutePath) || SEO_ROUTES[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white flex flex-col">
      {/* Dynamic SEO Meta & Head Tags */}
      <SEOMetadata
        title="About Us | Thermal Express - Free Web Bluetooth Retail POS & Receipt Maker"
        description="Learn about Thermal Express: Our mission to empower micro-retailers, Kirana stores, and mobile vendors with 100% free, offline-first Web Bluetooth thermal printing billing software."
        keywords={[
          'About Thermal Express',
          'Free POS Billing Web App',
          'Offline Retail Bill Maker Mission',
          'Web Bluetooth Thermal Receipt Printer Setup',
        ]}
      />
      <SoftwareApplicationSchema />
      <FAQPageSchema />

      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Logo onClick={onLaunchApp} />

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onLaunchApp}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-600 transition px-3 py-2 rounded-xl hover:bg-slate-100 cursor-pointer hidden sm:inline-block"
            >
              Billing Terminal
            </button>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
              About Us
            </span>
            <button
              onClick={onGoToPrivacy}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-600 transition px-3 py-2 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={onLaunchApp}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Launch Terminal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        
        {/* About Us Hero Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Info className="w-4 h-4 text-emerald-600" /> About Us & Hardware Guide
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Empowering Micro-Retailers with Zero-Signup, Offline-First Counter Billing
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
            <strong>Thermal Express</strong> was built with a single focused vision: to deliver a blazing-fast, modern, zero-subscription POS receipt generator for local shopkeepers, Kirana stores, food stalls, and pop-up businesses worldwide—without complex software installations or monthly fees.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onLaunchApp}
              className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 transition flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Open Billing Terminal Now (Free)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={onGoToPrivacy}
              className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-white border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Read Our Privacy Policy</span>
            </button>
          </div>

          {/* Programmatic Hardware & Industry Pages Selector */}
          <div className="pt-8 border-t border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block mb-3 uppercase tracking-wider">
              Explore Hardware & Industry Use Cases:
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

        {/* Our Mission & Values Section */}
        <section className="py-12 bg-white border-y border-slate-200 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Our Core Pillars
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Why thousands of small business owners trust Thermal Express every day.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <article className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <WifiOff className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">100% Offline-First</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your store billing will never pause due to server downtime or lost internet connections. All operations run directly in your web browser.
                </p>
              </article>

              <article className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">100% Local Data Control</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No remote databases, no tracking cookies, no accounts. All products, prices, and receipts stay strictly stored on your own local device.
                </p>
              </article>

              <article className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Zero Signup & Free Forever</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Start generating bills immediately. No credit card, no sign-up forms, no monthly subscriptions, and no trial lockouts.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Technical Hardware Guide Section */}
        <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">
              Hardware Setup & Printer Specifications
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Connect portable ESC/POS Bluetooth printers directly from Chrome or Edge.
            </p>
          </div>

          <article className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-600" /> How to Connect a Bluetooth Thermal Printer
            </h3>
            <ol className="text-xs sm:text-sm text-slate-700 space-y-2.5 list-decimal pl-5 leading-relaxed">
              <li>Turn on your portable 58mm or 80mm Bluetooth thermal receipt printer.</li>
              <li>Open <strong>Thermal Express</strong> in Google Chrome or Microsoft Edge on Android, Windows, or macOS.</li>
              <li>Add items to your cart and click <strong>"Print ESC/POS (Web Bluetooth)"</strong>.</li>
              <li>Select your Bluetooth thermal printer from the native browser Bluetooth pair prompt.</li>
              <li>The browser will establish a direct GATT connection and transmit ESC/POS commands in milliseconds!</li>
            </ol>
          </article>

          <article className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" /> Supported Hardware (58mm, 80mm, ESC/POS)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Thermal Express supports all standard ESC/POS compliant Bluetooth thermal printers, including PT-210, MTP-II, RPP02N, Xprinter, POS-5802, and desktop 80mm POS printers.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 58mm (2-inch / 32 columns per line) ESC/POS formatting</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 80mm (3-inch / 48 columns per line) ESC/POS formatting</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Camera barcode scanner (EAN-13, UPC-A, Code-128, QR Code)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> WhatsApp 1-click digital receipt generator & high-DPI PDF generation</li>
            </ul>
          </article>

          {/* Structured FAQ Section */}
          <article className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" /> Frequently Asked Questions (FAQ)
            </h3>
            
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
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 space-y-2 mt-auto">
        <div className="flex justify-center items-center gap-4 text-slate-600 font-medium">
          <button onClick={onLaunchApp} className="hover:text-emerald-600 transition">
            Home Billing Terminal
          </button>
          <span>•</span>
          <span className="text-emerald-700 font-bold">About Us</span>
          <span>•</span>
          <button onClick={onGoToPrivacy} className="hover:text-emerald-600 transition">
            Privacy Policy
          </button>
        </div>
        <p>© 2026 Thermal Express • Free Retail POS & Web Bluetooth Billing</p>
      </footer>
    </div>
  );
};

// Also export LandingPage for backwards compatibility if referenced
export const LandingPage = AboutPage;
