import React from 'react';
import { useBilling } from '../context/BillingContext';
import { Logo } from './Logo';
import { Settings, History, Package, WifiOff, Trash2, Home, Info, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenInventory: () => void;
  onGoHome?: () => void;
  onOpenAbout?: () => void;
  onOpenPrivacy?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenHistory,
  onOpenInventory,
  onGoHome,
  onOpenAbout,
  onOpenPrivacy,
}) => {
  const { settings, salesHistory, clearAllData } = useBilling();

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all local data, inventory, and sales history?')) {
      clearAllData();
      window.location.reload();
    }
  };

  const handleHomeClick = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      // Scroll to top of page cleanly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        
        {/* Brand Logo - Clicking acts as Home Button */}
        <Logo onClick={handleHomeClick} />

        {/* Header Menu Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
          {/* Explicit Home Button */}
          <button
            onClick={handleHomeClick}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5 text-xs font-semibold"
            title="Home Billing Workspace"
          >
            <Home className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Home</span>
          </button>

          {/* Inventory Catalog button */}
          <button
            onClick={onOpenInventory}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5 text-xs font-semibold"
            title="Product Catalog"
          >
            <Package className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Catalog</span>
          </button>

          {/* Sales History button */}
          <button
            onClick={onOpenHistory}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5 text-xs font-semibold relative"
            title="Sales History"
          >
            <History className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">History</span>
            {salesHistory.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                {salesHistory.length > 99 ? '99+' : salesHistory.length}
              </span>
            )}
          </button>

          {/* About Us menu link */}
          {onOpenAbout && (
            <button
              onClick={onOpenAbout}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5 text-xs font-semibold"
              title="About Us & Hardware Specs"
            >
              <Info className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline">About Us</span>
            </button>
          )}

          {/* Privacy Policy menu link */}
          {onOpenPrivacy && (
            <button
              onClick={onOpenPrivacy}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5 text-xs font-semibold"
              title="Privacy Policy"
            >
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span className="hidden sm:inline">Privacy Policy</span>
            </button>
          )}

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5 text-xs font-semibold"
            title="Store Settings"
          >
            <Settings className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Reset / Clear Data */}
          <button
            onClick={handleClearData}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Reset All Data & Clear Local Storage"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
