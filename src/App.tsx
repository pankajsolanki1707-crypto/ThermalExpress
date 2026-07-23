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
import { LandingPage } from './pages/LandingPage';
import { SEOMetadata } from './seo/SEOMetadata';
import { SoftwareApplicationSchema, FAQPageSchema } from './seo/JsonLd';

const AppContent: React.FC = () => {
  const [view, setView] = useState<'app' | 'landing'>('app');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  if (view === 'landing') {
    return <LandingPage onLaunchApp={() => setView('app')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Global Technical SEO Metadata & Schemas */}
      <SEOMetadata />
      <SoftwareApplicationSchema />
      <FAQPageSchema />

      {/* App Navigation Header - Logo acts as Home button */}
      <Header
        onGoHome={() => setView('app')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenInventory={() => setIsInventoryOpen(true)}
      />

      {/* Sleek Announcement / Guide Banner */}
      <div className="bg-emerald-50 border-b border-emerald-100 py-1.5 px-4 text-center text-xs font-semibold text-emerald-800 flex items-center justify-center gap-2">
        <span>⚡ Zero Signup Retail Counter Billing</span>
        <span>•</span>
        <button
          onClick={() => setView('landing')}
          className="text-emerald-700 hover:underline font-bold"
        >
          View Bluetooth Printer Setup & Hardware Specs →
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
