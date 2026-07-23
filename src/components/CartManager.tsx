import React, { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ScanLine,
  Tag,
  Percent,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface CartManagerProps {
  onOpenScanner: () => void;
  onOpenInventoryModal: () => void;
}

export const CartManager: React.FC<CartManagerProps> = ({ onOpenScanner, onOpenInventoryModal }) => {
  const {
    products,
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    settings,
    updateStoreSettings,
    subtotal,
    taxAmount,
    discountAmount,
    totalAmount,
  } = useBilling();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [customDiscount, setCustomDiscount] = useState<string>(settings.discountAmount.toString());

  // Requirement 2: Quick Custom Item Keypad Input State
  const [quickCustomPrice, setQuickCustomPrice] = useState<string>('');

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category || 'General')))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery));
    const matchesCategory =
      selectedCategory === 'All' || (p.category || 'General') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDiscountChange = (val: string) => {
    setCustomDiscount(val);
    const num = parseFloat(val) || 0;
    updateStoreSettings({ discountAmount: num });
  };

  // Requirement 2 Handler: Quick Custom Item Add
  const handleQuickCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const priceVal = parseFloat(quickCustomPrice);
    if (!priceVal || priceVal <= 0) return;

    addToCart('Custom Item', priceVal, 'Custom Item');
    setQuickCustomPrice('');
  };

  return (
    <div className="space-y-4">
      {/* Search, Scan & Quick Custom Item Keypad Action Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          
          {/* Search Input (6 cols) */}
          <div className="relative sm:col-span-6">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search catalog or barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* REQUIREMENT 2: Quick Custom Item Price Keypad (3.5 cols) */}
          <form onSubmit={handleQuickCustomAdd} className="sm:col-span-4 flex gap-1">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">
                {settings.currency}
              </span>
              <input
                type="number"
                step="1"
                min="1"
                placeholder="Price (e.g. 50)"
                value={quickCustomPrice}
                onChange={(e) => setQuickCustomPrice(e.target.value)}
                className="w-full pl-6 pr-2 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={!quickCustomPrice}
              className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs shrink-0 flex items-center gap-1 transition"
              title="Add Custom Item with this price"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" /> + Add
            </button>
          </form>

          {/* Prominent Tap to Scan Button (2.5 cols) */}
          <button
            onClick={onOpenScanner}
            className="sm:col-span-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition flex items-center justify-center gap-1.5 shrink-0 active:scale-95"
          >
            <ScanLine className="w-4 h-4" />
            <span>Scan</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-1 px-3 rounded-full shrink-0 font-medium transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={onOpenInventoryModal}
            className="py-1 px-2.5 rounded-full shrink-0 font-semibold text-emerald-700 hover:bg-emerald-50 transition ml-auto"
          >
            + Add Product
          </button>
        </div>

        {/* Quick Add Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 max-h-[160px] overflow-y-auto pr-1">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full py-4 text-center text-xs text-slate-400">
              No products found in catalog. Add items above or use "+ Add Product".
            </div>
          ) : (
            filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase block">
                    {product.category || 'General'}
                  </span>
                  <span className="font-semibold text-xs text-slate-900 line-clamp-1 group-hover:text-emerald-700">
                    {product.name}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60">
                  <span className="text-xs font-bold text-slate-800">
                    {settings.currency}{product.price.toFixed(2)}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-white text-slate-700 flex items-center justify-center text-xs font-bold shadow-xs group-hover:bg-emerald-600 group-hover:text-white">
                    +
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Cart Items List Container */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <h3 className="font-semibold text-slate-900 text-sm">
              Current Order Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
            </h3>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" /> Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">
              Cart is clean and empty. Type a price above or tap catalog items to begin billing.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
            {cart.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80"
              >
                <div className="flex-1 min-w-0 pr-3">
                  <div className="font-semibold text-xs text-slate-900 truncate">
                    {product.name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {settings.currency}{product.price.toFixed(2)} / unit
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-xs">
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      className="p-1 text-slate-600 hover:text-rose-600 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2.5 text-xs font-bold text-slate-900 min-w-[24px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      className="p-1 text-slate-600 hover:text-emerald-600 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <span className="text-xs font-bold text-slate-900 w-16 text-right">
                    {settings.currency}{(product.price * quantity).toFixed(2)}
                  </span>

                  {/* Delete Item */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bill Calculations Summary */}
        <div className="border-t border-slate-200 pt-4 space-y-2">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Subtotal:</span>
            <span className="font-semibold text-slate-900">
              {settings.currency}{subtotal.toFixed(2)}
            </span>
          </div>

          {/* Quick Discount Adjustment */}
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-emerald-600" /> Discount ({settings.currency}):
            </span>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={customDiscount}
              onChange={(e) => handleDiscountChange(e.target.value)}
              className="w-20 px-2 py-1 text-right rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Tax Breakdown */}
          {settings.taxRate > 0 && (
            <div className="flex justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-indigo-500" /> Tax ({settings.taxRate}%):
              </span>
              <span className="font-medium text-slate-900">
                {settings.currency}{taxAmount.toFixed(2)}
              </span>
            </div>
          )}

          {/* Final Total */}
          <div className="flex justify-between items-center text-base font-bold text-slate-900 border-t border-slate-200 pt-2 mt-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" /> Grand Total:
            </span>
            <span className="text-xl text-emerald-600">
              {settings.currency}{totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
