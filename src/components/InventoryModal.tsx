import React, { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { Product } from '../types';
import { X, Package, Plus, Trash2, Edit3, Barcode } from 'lucide-react';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose }) => {
  const { products, addProduct, updateProduct, deleteProduct, settings } = useBilling();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState('General');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    const numericPrice = parseFloat(price) || 0;
    // BARCODE IS COMPLETELY OPTIONAL - DO NOT AUTO-GENERATE DUMMY NUMBERS!
    const cleanBarcode = barcode.trim();

    if (editingId) {
      const existing = products.find((p) => p.id === editingId);
      if (existing) {
        updateProduct({
          ...existing,
          name: name.trim(),
          price: numericPrice,
          barcode: cleanBarcode,
          category: category.trim() || 'General',
        });
      }
    } else {
      addProduct({
        name: name.trim(),
        price: numericPrice,
        barcode: cleanBarcode,
        category: category.trim() || 'General',
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setPrice('');
    setBarcode('');
    setCategory('General');
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setPrice(p.price.toString());
    setBarcode(p.barcode || '');
    setCategory(p.category || 'General');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900">Product Catalog</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add/Edit Product Form */}
        <form onSubmit={handleSave} className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700">
              {editingId ? 'Edit Product' : 'Add Product to Catalog'}
            </h4>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-slate-500 hover:underline"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <div className="sm:col-span-1">
              <input
                type="text"
                required
                placeholder="Product Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <input
                type="number"
                step="0.01"
                required
                placeholder={`Price (${settings.currency}) *`}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Barcode (Optional)"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Category (e.g. Snacks)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> {editingId ? 'Save Changes' : 'Add to Catalog'}
          </button>
        </form>

        {/* Product Catalog List */}
        <div className="p-5 overflow-y-auto space-y-2 flex-1">
          {products.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No products in catalog yet. Add your first product above.
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900">
                      {product.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                      {product.category || 'General'}
                    </span>
                  </div>
                  {product.barcode && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Barcode className="w-3 h-3 text-slate-400" /> {product.barcode}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-xs text-slate-900">
                    {settings.currency}{product.price.toFixed(2)}
                  </span>

                  <button
                    onClick={() => startEdit(product)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition"
                    title="Edit Product"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition"
                    title="Delete Product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
