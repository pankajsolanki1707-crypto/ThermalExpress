import { CartItem, StoreSettings } from '../types';
import { sanitizeString, roundMoney } from './security';

export function formatWhatsAppBillText(
  items: CartItem[],
  settings: StoreSettings,
  receiptNumber: string,
  subtotal: number,
  taxAmount: number,
  discountAmount: number,
  totalAmount: number
): string {
  const dateStr = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const cleanStoreName = sanitizeString(settings.storeName, 100).toUpperCase();
  const cleanTagline = sanitizeString(settings.tagline, 100);
  const cleanAddress = sanitizeString(settings.address, 150);
  const cleanPhone = sanitizeString(settings.phone, 20);

  let text = `🧾 *RECEIPT #${sanitizeString(receiptNumber, 20)}*\n`;
  text += `🏬 *${cleanStoreName}*\n`;
  if (cleanTagline) text += `_${cleanTagline}_\n`;
  if (cleanAddress) text += `📍 ${cleanAddress}\n`;
  if (cleanPhone) text += `📞 ${cleanPhone}\n`;
  text += `📅 ${dateStr}\n`;
  text += `------------------------------------\n`;
  text += `*ITEMS PURCHASED:*\n`;

  items.forEach(({ product, quantity }) => {
    const cleanItemName = sanitizeString(product.name, 80);
    const itemTotal = roundMoney(product.price * quantity).toFixed(2);
    text += `▪️ ${cleanItemName}\n   ${quantity} x ${settings.currency}${roundMoney(product.price).toFixed(2)} = *${settings.currency}${itemTotal}*\n`;
  });

  text += `------------------------------------\n`;
  text += `Subtotal: ${settings.currency}${roundMoney(subtotal).toFixed(2)}\n`;

  if (discountAmount > 0) {
    text += `Discount: -${settings.currency}${roundMoney(discountAmount).toFixed(2)}\n`;
  }

  if (settings.taxRate > 0) {
    text += `Tax (${settings.taxRate}%): ${settings.currency}${roundMoney(taxAmount).toFixed(2)}\n`;
  }

  text += `💰 *TOTAL AMOUNT: ${settings.currency}${roundMoney(totalAmount).toFixed(2)}*\n`;
  text += `------------------------------------\n`;

  if (settings.upiId) {
    text += `💳 *Pay via UPI:* ${sanitizeString(settings.upiId, 50)}\n`;
  }

  const cleanFooterNote = sanitizeString(settings.footerNote, 100) || 'Thank you for your business!';
  text += `\n✨ *${cleanFooterNote}*`;

  return text;
}

export function generateWhatsAppLink(
  phoneNumber: string,
  formattedText: string
): string {
  // Strip all non-digit characters for strict phone validation
  let cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Default to India country code 91 if 10 digits provided
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }

  // Safe URI encoding for special characters (&, ?, #, /, %, line breaks)
  const encodedText = encodeURIComponent(formattedText);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
