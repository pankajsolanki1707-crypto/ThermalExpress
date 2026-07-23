export interface Product {
  id: string;
  name: string;
  price: number;
  barcode: string;
  category?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type QrCodeType = 'UPI' | 'CUSTOM_IMAGE' | 'URL';

export interface StoreSettings {
  storeName: string;
  tagline: string;
  address: string;
  phone: string;
  gstin: string;
  currency: string;
  taxRate: number; // in percentage, e.g. 5 for 5%
  discountAmount: number;
  paperWidth: '58mm' | '80mm';
  
  // Market Ready QR Code Settings
  showQrCode: boolean;
  qrCodeType: QrCodeType;
  upiId: string; // e.g. merchant@upi
  customQrImage: string; // Base64 data URL for uploaded GPay/PhonePe/Paytm QR image
  customQrUrl: string; // Store website / Google review link
  footerNote: string; // Custom footer note e.g. "No refunds without receipt"
}

export interface SalesRecord {
  id: string;
  receiptNumber: string;
  timestamp: string;
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  paymentMethod: 'UPI' | 'CASH' | 'CARD';
  customerPhone?: string;
}

export interface BluetoothPrinterDevice {
  device: BluetoothDevice;
  server?: BluetoothRemoteGATTServer;
  characteristic?: BluetoothRemoteGATTCharacteristic;
  name: string;
  connected: boolean;
}
