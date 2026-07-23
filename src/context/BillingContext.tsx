import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, StoreSettings, SalesRecord } from '../types';
import { playScannerBeep } from '../utils/sound';
import { sanitizeString, roundMoney, safeJsonParse, safeLocalStorageSet } from '../utils/security';

interface BillingContextType {
  products: Product[];
  cart: CartItem[];
  settings: StoreSettings;
  salesHistory: SalesRecord[];
  activeReceiptNumber: string;
  
  // Cart Actions
  addToCart: (productOrBarcode: Product | string, fallbackPrice?: number, fallbackName?: string) => void;
  updateQuantity: (productId: string, deltaOrValue: number, isAbsolute?: boolean) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // Settings & Product Actions
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => void;
  addProduct: (productData: Omit<Product, 'id'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  // Checkout & Sales
  completeSale: (paymentMethod?: 'UPI' | 'CASH' | 'CARD', customerPhone?: string) => SalesRecord;
  deleteSaleRecord: (id: string) => void;
  clearAllData: () => void;
  exportBackupJSON: () => void;
  importBackupJSON: (jsonString: string) => boolean;
  
  // Computations
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
}

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Your Online Quick Bill',
  tagline: 'Micro-Retail Billing & Receipt Counter',
  address: 'Main Street, Market Square',
  phone: '9876543210',
  gstin: '',
  currency: '₹',
  taxRate: 0,
  discountAmount: 0,
  paperWidth: '58mm',
  
  // Shopper UPI QR Code Enabled by Default
  showQrCode: true,
  qrCodeType: 'UPI',
  upiId: 'merchant@upi',
  customQrImage: '',
  customQrUrl: '',
  footerNote: 'Thank You For Your Business!',
};

const BillingContext = createContext<BillingContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  SETTINGS: 'thermal_express_settings_v6',
  PRODUCTS: 'thermal_express_products_v6',
  CART: 'thermal_express_cart_v6',
  SALES: 'thermal_express_sales_v6',
  RECEIPT_COUNTER: 'thermal_express_rcounter_v6',
};

export const BillingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Settings State with Safe Parsing
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
      return safeJsonParse<StoreSettings>(saved, DEFAULT_SETTINGS);
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // 2. Inventory State with Safe Parsing
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
      return safeJsonParse<Product[]>(saved, []);
    } catch {
      return [];
    }
  });

  // 3. Cart State with Safe Parsing
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
      return safeJsonParse<CartItem[]>(saved, []);
    } catch {
      return [];
    }
  });

  // 4. Sales History State with Safe Parsing
  const [salesHistory, setSalesHistory] = useState<SalesRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SALES);
      return safeJsonParse<SalesRecord[]>(saved, []);
    } catch {
      return [];
    }
  });

  // 5. Active Receipt Counter with Safe Parsing
  const [receiptCounter, setReceiptCounter] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.RECEIPT_COUNTER);
      const parsed = parseInt(saved || '1001', 10);
      return isNaN(parsed) || parsed < 1 ? 1001 : parsed;
    } catch {
      return 1001;
    }
  });

  // LocalStorage Safe Syncing with QuotaExceeded Protection
  useEffect(() => {
    safeLocalStorageSet(LOCAL_STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  useEffect(() => {
    safeLocalStorageSet(LOCAL_STORAGE_KEYS.PRODUCTS, products);
  }, [products]);

  useEffect(() => {
    safeLocalStorageSet(LOCAL_STORAGE_KEYS.CART, cart);
  }, [cart]);

  useEffect(() => {
    safeLocalStorageSet(LOCAL_STORAGE_KEYS.SALES, salesHistory);
  }, [salesHistory]);

  useEffect(() => {
    safeLocalStorageSet(LOCAL_STORAGE_KEYS.RECEIPT_COUNTER, receiptCounter);
  }, [receiptCounter]);

  // Robust Financial Precision Math (No floating point overflow bugs)
  const rawSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const subtotal = roundMoney(rawSubtotal);
  
  const rawTax = (subtotal * Math.max(0, settings.taxRate || 0)) / 100;
  const taxAmount = roundMoney(rawTax);
  
  const maxDiscount = Math.min(subtotal, Math.max(0, settings.discountAmount || 0));
  const discountAmount = roundMoney(maxDiscount);
  
  const totalAmount = roundMoney(Math.max(0, subtotal + taxAmount - discountAmount));

  // Cart Actions with Sanitization & Precision checks
  const addToCart = (
    productOrBarcode: Product | string,
    fallbackPrice: number = 50,
    fallbackName?: string
  ) => {
    playScannerBeep();

    let targetProduct: Product | undefined;

    if (typeof productOrBarcode === 'object') {
      targetProduct = {
        ...productOrBarcode,
        name: sanitizeString(productOrBarcode.name, 100),
        price: roundMoney(productOrBarcode.price),
        barcode: sanitizeString(productOrBarcode.barcode, 50),
        category: sanitizeString(productOrBarcode.category, 50),
      };
    } else {
      const cleanInput = sanitizeString(productOrBarcode, 50);
      targetProduct = products.find(
        (p) => p.barcode && (p.barcode === cleanInput || p.name.toLowerCase() === cleanInput.toLowerCase())
      );

      if (!targetProduct) {
        const autoName = sanitizeString(fallbackName || `Scanned Item #${cleanInput.slice(-4)}`, 100);
        targetProduct = {
          id: `scanned-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: autoName,
          price: roundMoney(fallbackPrice),
          barcode: cleanInput,
          category: 'Quick Add',
        };
      }
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((ci) => ci.product.id === targetProduct!.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.max(1, updated[existingIndex].quantity + 1),
        };
        return updated;
      }
      return [...prevCart, { product: targetProduct!, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, deltaOrValue: number, isAbsolute: boolean = false) => {
    setCart((prevCart) => {
      return prevCart
        .map((ci) => {
          if (ci.product.id === productId) {
            const newQty = isAbsolute ? Math.max(0, Math.floor(deltaOrValue)) : ci.quantity + Math.floor(deltaOrValue);
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((ci) => ci.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Settings & Product Actions
  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      storeName: newSettings.storeName !== undefined ? sanitizeString(newSettings.storeName, 100) : prev.storeName,
      tagline: newSettings.tagline !== undefined ? sanitizeString(newSettings.tagline, 100) : prev.tagline,
      address: newSettings.address !== undefined ? sanitizeString(newSettings.address, 200) : prev.address,
      phone: newSettings.phone !== undefined ? sanitizeString(newSettings.phone, 20) : prev.phone,
      gstin: newSettings.gstin !== undefined ? sanitizeString(newSettings.gstin, 30) : prev.gstin,
      upiId: newSettings.upiId !== undefined ? sanitizeString(newSettings.upiId, 100) : prev.upiId,
      footerNote: newSettings.footerNote !== undefined ? sanitizeString(newSettings.footerNote, 150) : prev.footerNote,
      taxRate: newSettings.taxRate !== undefined ? roundMoney(Math.max(0, newSettings.taxRate)) : prev.taxRate,
      discountAmount: newSettings.discountAmount !== undefined ? roundMoney(Math.max(0, newSettings.discountAmount)) : prev.discountAmount,
    }));
  };

  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: sanitizeString(productData.name, 100),
      price: roundMoney(productData.price),
      barcode: sanitizeString(productData.barcode, 50),
      category: sanitizeString(productData.category || 'General', 50),
    };
    setProducts((prev) => [newProd, ...prev]);
    return newProd;
  };

  const updateProduct = (updatedProduct: Product) => {
    const sanitized: Product = {
      ...updatedProduct,
      name: sanitizeString(updatedProduct.name, 100),
      price: roundMoney(updatedProduct.price),
      barcode: sanitizeString(updatedProduct.barcode, 50),
      category: sanitizeString(updatedProduct.category || 'General', 50),
    };
    setProducts((prev) => prev.map((p) => (p.id === sanitized.id ? sanitized : p)));
    setCart((prev) =>
      prev.map((ci) => (ci.product.id === sanitized.id ? { ...ci, product: sanitized } : ci))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Sales & Receipts
  const completeSale = (paymentMethod: 'UPI' | 'CASH' | 'CARD' = 'UPI', customerPhone?: string): SalesRecord => {
    const cleanPhone = customerPhone ? sanitizeString(customerPhone.replace(/\D/g, ''), 15) : undefined;
    const newRecord: SalesRecord = {
      id: `sale-${Date.now()}`,
      receiptNumber: receiptCounter.toString(),
      timestamp: new Date().toISOString(),
      items: [...cart],
      subtotal,
      taxAmount,
      discountAmount,
      total: totalAmount,
      paymentMethod,
      customerPhone: cleanPhone,
    };

    setSalesHistory((prev) => [newRecord, ...prev]);
    setReceiptCounter((prev) => prev + 1);
    clearCart();
    return newRecord;
  };

  const deleteSaleRecord = (id: string) => {
    setSalesHistory((prev) => prev.filter((s) => s.id !== id));
  };

  const clearAllData = () => {
    setCart([]);
    setSalesHistory([]);
    setProducts([]);
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('LocalStorage clear failed:', e);
    }
  };

  const exportBackupJSON = () => {
    const backupData = {
      settings,
      products,
      salesHistory,
      receiptCounter,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ThermalExpress_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackupJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.settings) setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
      if (parsed.products && Array.isArray(parsed.products)) setProducts(parsed.products);
      if (parsed.salesHistory && Array.isArray(parsed.salesHistory)) setSalesHistory(parsed.salesHistory);
      if (parsed.receiptCounter) setReceiptCounter(parseInt(parsed.receiptCounter, 10) || 1001);
      return true;
    } catch (e) {
      console.error('Import backup failed:', e);
      return false;
    }
  };

  return (
    <BillingContext.Provider
      value={{
        products,
        cart,
        settings,
        salesHistory,
        activeReceiptNumber: receiptCounter.toString(),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        updateStoreSettings,
        addProduct,
        updateProduct,
        deleteProduct,
        completeSale,
        deleteSaleRecord,
        clearAllData,
        exportBackupJSON,
        importBackupJSON,
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
      }}
    >
      {children}
    </BillingContext.Provider>
  );
};

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
};
