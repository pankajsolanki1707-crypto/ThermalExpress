import { CartItem, StoreSettings } from '../types';
import { sanitizeString, roundMoney } from './security';

function formatTwoColumns(leftText: string, rightText: string, width: number): string {
  const maxLeft = width - rightText.length - 1;
  let trimmedLeft = leftText;
  if (trimmedLeft.length > maxLeft) {
    trimmedLeft = trimmedLeft.substring(0, maxLeft);
  }
  const spaces = width - trimmedLeft.length - rightText.length;
  return trimmedLeft + ' '.repeat(Math.max(1, spaces)) + rightText;
}

export function generateESCPOSBuffer(
  items: CartItem[],
  settings: StoreSettings,
  receiptNumber: string,
  subtotal: number,
  taxAmount: number,
  discountAmount: number,
  totalAmount: number,
  paymentMethod: string = 'UPI'
): Uint8Array {
  const maxCols = settings.paperWidth === '58mm' ? 32 : 48;
  const divider = '-'.repeat(maxCols);
  const doubleDivider = '='.repeat(maxCols);

  const commands: number[] = [];

  const addBytes = (...bytes: number[]) => {
    commands.push(...bytes);
  };

  const addText = (text: string) => {
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      commands.push(code < 128 ? code : 63);
    }
  };

  const addLine = (text: string = '') => {
    addText(text + '\n');
  };

  // 1. Initialize Printer
  addBytes(0x1B, 0x40);

  // 2. Header
  addBytes(0x1B, 0x61, 0x01); // Center align
  addBytes(0x1D, 0x21, 0x11); // Double size
  addBytes(0x1B, 0x45, 0x01); // Bold ON
  addLine(sanitizeString(settings.storeName, 50).toUpperCase());
  addBytes(0x1D, 0x21, 0x00); // Normal size

  if (settings.tagline) {
    addLine(sanitizeString(settings.tagline, 60));
  }
  addBytes(0x1B, 0x45, 0x00); // Bold OFF

  if (settings.address) addLine(sanitizeString(settings.address, 80));
  if (settings.phone) addLine(`Tel: ${sanitizeString(settings.phone, 20)}`);
  if (settings.gstin) addLine(`GSTIN: ${sanitizeString(settings.gstin, 25)}`);

  addLine(divider);

  // 3. Meta
  addBytes(0x1B, 0x61, 0x00); // Left align
  addLine(`Bill No: #${sanitizeString(receiptNumber, 20)}`);
  addLine(`Date: ${new Date().toLocaleString()}`);
  if (paymentMethod) addLine(`Payment: ${sanitizeString(paymentMethod, 20)}`);
  addLine(divider);

  // 4. Table Header
  addBytes(0x1B, 0x45, 0x01); // Bold ON
  const itemHeader = formatTwoColumns('ITEM (QTY)', 'AMT (' + settings.currency + ')', maxCols);
  addLine(itemHeader);
  addBytes(0x1B, 0x45, 0x00); // Bold OFF
  addLine(divider);

  // 5. Item Lines
  items.forEach(({ product, quantity }) => {
    const itemTotal = roundMoney(product.price * quantity).toFixed(2);
    const qtyStr = `${quantity}x @ ${roundMoney(product.price).toFixed(2)}`;
    
    addLine(sanitizeString(product.name, 40));
    addLine(formatTwoColumns(`  ${qtyStr}`, `${settings.currency}${itemTotal}`, maxCols));
  });

  addLine(divider);

  // 6. Totals
  addLine(formatTwoColumns('Subtotal:', `${settings.currency}${roundMoney(subtotal).toFixed(2)}`, maxCols));

  if (discountAmount > 0) {
    addLine(formatTwoColumns('Discount:', `-${settings.currency}${roundMoney(discountAmount).toFixed(2)}`, maxCols));
  }

  if (settings.taxRate > 0) {
    addLine(formatTwoColumns(`Tax (${settings.taxRate}%):`, `${settings.currency}${roundMoney(taxAmount).toFixed(2)}`, maxCols));
  }

  addLine(doubleDivider);
  addBytes(0x1B, 0x45, 0x01); // Bold ON
  addBytes(0x1D, 0x21, 0x01); // Height double
  addLine(formatTwoColumns('TOTAL PAID:', `${settings.currency}${roundMoney(totalAmount).toFixed(2)}`, maxCols));
  addBytes(0x1D, 0x21, 0x00); // Normal size
  addBytes(0x1B, 0x45, 0x00); // Bold OFF
  addLine(doubleDivider);

  // 7. Footer & UPI Note
  addBytes(0x1B, 0x61, 0x01); // Center align
  if (settings.upiId) {
    addLine(`Pay via UPI: ${sanitizeString(settings.upiId, 40)}`);
  }
  addLine(sanitizeString(settings.footerNote, 50) || 'Thank You For Shopping!');
  addLine('Powered by Thermal Express');

  // 8. Feed lines & Cut Paper
  addBytes(0x1B, 0x64, 0x04); // Feed 4 lines
  addBytes(0x1D, 0x56, 0x42, 0x00); // Paper cut command

  return new Uint8Array(commands);
}

/**
 * Connect to a Web Bluetooth Thermal Printer and print the byte buffer safely.
 */
export async function printViaWebBluetooth(buffer: Uint8Array): Promise<boolean> {
  // Check browser support (iOS Safari / Firefox / non-Chromium)
  if (!navigator || !navigator.bluetooth) {
    throw new Error('Web Bluetooth is not supported in this browser. Please use Chrome, Edge, or Opera over HTTPS/localhost.');
  }

  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [
        '000018f0-0000-1000-8000-00805f9b34fb',
        'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
        '49535343-fe7d-4ae5-8fa9-9fafd205e455',
        '00001101-0000-1000-8000-00805f9b34fb'
      ]
    });

    if (!device || !device.gatt) {
      throw new Error('No device selected or GATT server unavailable.');
    }

    const server = await device.gatt.connect();
    const services = await server.getPrimaryServices();
    
    if (services.length === 0) {
      throw new Error('No primary GATT services found on Bluetooth device.');
    }

    let writeCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;

    for (const service of services) {
      const characteristics = await service.getCharacteristics();
      for (const char of characteristics) {
        if (char.properties.write || char.properties.writeWithoutResponse) {
          writeCharacteristic = char;
          break;
        }
      }
      if (writeCharacteristic) break;
    }

    if (!writeCharacteristic) {
      throw new Error('Could not find a writeable characteristic on the thermal printer.');
    }

    const CHUNK_SIZE = 64;
    for (let i = 0; i < buffer.length; i += CHUNK_SIZE) {
      const chunk = buffer.subarray(i, i + CHUNK_SIZE);
      const dataBuffer = chunk.buffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength) as ArrayBuffer;
      if (writeCharacteristic.properties.writeWithoutResponse) {
        await writeCharacteristic.writeValueWithoutResponse(dataBuffer);
      } else {
        await writeCharacteristic.writeValue(dataBuffer);
      }
      await new Promise(res => setTimeout(res, 30));
    }

    setTimeout(() => {
      if (device.gatt?.connected) {
        device.gatt.disconnect();
      }
    }, 1000);

    return true;
  } catch (error: unknown) {
    const err = error as Error;
    console.warn('Bluetooth Print Exception:', err);
    if (err.name === 'NotFoundError' || err.message.includes('cancelled') || err.message.includes('User cancelled')) {
      throw new Error('Bluetooth device selection was cancelled.');
    }
    if (err.name === 'NetworkError' || err.message.includes('disconnected')) {
      throw new Error('Bluetooth connection lost during print. Please try again.');
    }
    throw err;
  }
}
