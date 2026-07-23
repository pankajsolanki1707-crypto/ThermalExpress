export interface SEORoute {
  path: string;
  title: string;
  description: string;
  h1: string;
  keywords: string[];
  category: 'tool' | 'industry' | 'home';
  hardwareSupport: '58mm' | '80mm' | 'Both';
}

export const SEO_ROUTES: SEORoute[] = [
  {
    path: '/',
    title: 'Free Thermal Receipt Generator | 58mm & 80mm Bluetooth Print | Thermal Express',
    description: 'Create and print retail bills directly to your Bluetooth thermal printer from your browser. No signup, no app installation. Perfect for 58mm & 80mm POS printers.',
    h1: 'Generate & Print Thermal Receipts Instantly from Your Browser',
    keywords: [
      'Free thermal receipt generator online',
      'Bluetooth POS bill maker web app',
      '58mm thermal printer receipt maker',
      'ESC/POS browser print utility',
      'Zero signup retail bill generator',
    ],
    category: 'home',
    hardwareSupport: 'Both',
  },
  {
    path: '/tools/58mm-thermal-receipt-generator',
    title: '58mm Thermal Receipt Generator Online | Free Bluetooth POS Print',
    description: 'Instant 58mm (2 inch) thermal receipt generator. Connect portable 58mm Bluetooth thermal printers directly from Google Chrome without drivers.',
    h1: '58mm Thermal Printer Receipt Generator & Web Bluetooth POS Utility',
    keywords: [
      '58mm thermal printer receipt maker',
      '2 inch Bluetooth thermal print web app',
      'ESC/POS 58mm bill format generator',
      'Free mobile Bluetooth printer billing',
    ],
    category: 'tool',
    hardwareSupport: '58mm',
  },
  {
    path: '/tools/80mm-pos-bill-maker',
    title: '80mm POS Thermal Bill Maker Online | Free ESC/POS Web Print',
    description: 'Professional 80mm (3 inch) thermal receipt bill maker for retail stores. Features 48-column ESC/POS formatting, dynamic UPI payment QR codes, and WhatsApp sharing.',
    h1: '80mm POS Thermal Bill Maker & ESC/POS Browser Utility',
    keywords: [
      '80mm POS bill maker',
      '3 inch thermal receipt generator',
      'ESC/POS 80mm thermal print online',
      'High volume retail receipt printer web app',
    ],
    category: 'tool',
    hardwareSupport: '80mm',
  },
  {
    path: '/industry/kirana-store-billing-software-free',
    title: 'Free Kirana Store Billing App Online | Camera Barcode & Thermal Print',
    description: 'Zero subscription free Kirana store billing software online. Scan grocery item barcodes with smartphone camera and print 58mm/80mm thermal receipts.',
    h1: 'Free Kirana Store & Indian Micro-Retail Billing Web Utility',
    keywords: [
      'Free Kirana store billing app online',
      'Indian grocery bill maker with UPI QR',
      'Offline Kirana billing web app',
      'Zero signup Kirana receipt print',
    ],
    category: 'industry',
    hardwareSupport: 'Both',
  },
  {
    path: '/industry/restaurant-kot-receipt-maker',
    title: 'Free Restaurant KOT & Food Bill Receipt Maker Online | Thermal Express',
    description: 'Instant restaurant Kitchen Order Token (KOT) & customer receipt generator. Print 58mm/80mm order slips directly to kitchen thermal printers.',
    h1: 'Restaurant KOT Slip & Food Bill Receipt Generator',
    keywords: [
      'Restaurant KOT receipt maker',
      'Kitchen Order Token generator online',
      'Cafe food bill thermal printer app',
      'Free food stall receipt generator',
    ],
    category: 'industry',
    hardwareSupport: 'Both',
  },
];

export function generateSitemapXML(baseUrl: string = 'https://thermalexpress.app'): string {
  const urls = SEO_ROUTES.map((route) => {
    return `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>${route.path === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route.path === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}
