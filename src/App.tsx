import React, { useState } from 'react';
import { BillingProvider } from './context/BillingContext';
import { Header } from './components/Header';
import { CartManager } from './components/CartManager';
import { ThermalReceipt } from './components/ThermalReceipt';
import { PrintAndShareControls } from './components/PrintAndShareControls';
import { BarcodeScannerModal } from './components/BarcodeScannerModal';
import { StoreSettingsModal } from './components/StoreSettingsModal';
import { SalesHistoryModal } from './components/SalesHistoryModal';
import { InventoryModal } from './components/InventoryModal';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { SEOMetadata } from './seo/SEOMetadata';
import { SoftwareApplicationSchema, FAQPageSchema } from './seo/JsonLd';

const AppContent: React.FC = () => {
  const [view, setView] = useState<'app' | 'about' | 'privacy'>('app');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  if (view === 'about') {
    return (
      <AboutPage
        onLaunchApp={() => setView('app')}
        onGoToPrivacy={() => setView('privacy')}
      />
    );
  }

  if (view === 'privacy') {
    return (
      <PrivacyPolicyPage
        onBackToApp={() => setView('app')}
        onGoToAbout={() => setView('about')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Global Technical SEO Metadata & Schemas */}
      <SEOMetadata />
      <SoftwareApplicationSchema />
      <FAQPageSchema />

      {/* App Navigation Header */}
      <Header
        onGoHome={() => setView('app')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenAbout={() => setView('about')}
        onOpenPrivacy={() => setView('privacy')}
      />

      {/* Sleek Announcement / Guide Banner */}
      <div className="bg-emerald-50 border-b border-emerald-100 py-1.5 px-4 text-center text-xs font-semibold text-emerald-800 flex items-center justify-center gap-2 flex-wrap">
        <span>⚡ Zero Signup Retail Counter Billing</span>
        <span>•</span>
        <button
          onClick={() => setView('about')}
          className="text-emerald-700 hover:underline font-bold flex items-center gap-1"
        >
          <span>Bluetooth Printer Setup & Hardware Specs →</span>
        </button>
      </div>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Cart & Barcode Scanner */}
          <div className="lg:col-span-7 space-y-6">
            <CartManager
              onOpenScanner={() => setIsScannerOpen(true)}
              onOpenInventoryModal={() => setIsInventoryOpen(true)}
            />
          </div>

          {/* Right Column: Thermal Receipt Live Preview & Actions */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
            <PrintAndShareControls />

            <div className="bg-slate-200/50 rounded-2xl p-6 border border-slate-200 flex justify-center items-center shadow-inner overflow-x-auto">
              <ThermalReceipt />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500 space-y-1 mt-auto">
        <div className="flex justify-center items-center gap-3 text-slate-600 font-medium">
          <button onClick={() => setView('app')} className="hover:text-emerald-600 transition">
            Home Billing Terminal
          </button>
          <span>•</span>
          <button onClick={() => setView('about')} className="hover:text-emerald-600 transition">
            About Us
          </button>
          <span>•</span>
          <button onClick={() => setView('privacy')} className="hover:text-emerald-600 transition">
            Privacy Policy
          </button>
        </div>
        <p>© 2026 Thermal Express • 100% Offline & Private Retail Counter Billing</p>
      </footer>

      {/* Modals */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
      <StoreSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <SalesHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BillingProvider>
      <AppContent />
    </BillingProvider>
  );
};

export default App;
