import React from 'react';
import { useBilling } from '../context/BillingContext';
import { Logo } from './Logo';
import { Settings, History, Package, WifiOff, Trash2, Home } from 'lucide-react';

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

        {/* Quick Action Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Explicit Home Button */}
          <button
            onClick={handleHomeClick}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5 text-xs font-semibold"
            title="Home Billing Workspace"
          >
            <Home className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">Home</span>
          </button>

          {/* Inventory Catalog button */}
          <button
            onClick={onOpenInventory}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5 text-xs font-semibold"
            title="Product Catalog"
          >
            <Package className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">Catalog</span>
          </button>

          {/* Sales History button */}
          <button
            onClick={onOpenHistory}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5 text-xs font-semibold relative"
            title="Sales History"
          >
            <History className="w-4 h-4 text-indigo-600" />
            <span className="hidden md:inline">History</span>
            {salesHistory.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                {salesHistory.length > 99 ? '99+' : salesHistory.length}
              </span>
            )}
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5 text-xs font-semibold"
            title="Store Settings"
          >
            <Settings className="w-4 h-4 text-slate-600" />
            <span className="hidden md:inline">Settings</span>
          </button>

          {/* About Us navigation link */}
          {onOpenAbout && (
            <button
              onClick={onOpenAbout}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition text-xs font-semibold hidden lg:inline-block"
              title="About Us & Hardware Specs"
            >
              About Us
            </button>
          )}

          {/* Privacy Policy navigation link */}
          {onOpenPrivacy && (
            <button
              onClick={onOpenPrivacy}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition text-xs font-semibold hidden lg:inline-block"
              title="Privacy Policy"
            >
              Privacy Policy
            </button>
          )}

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
