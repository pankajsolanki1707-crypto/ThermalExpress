import React from 'react';

export const SoftwareApplicationSchema: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Thermal Express',
    operatingSystem: 'Any Web Browser (Windows, Android, macOS, Linux, ChromeOS)',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
    description:
      'Free zero-signup client-side retail billing Web App with Web Bluetooth ESC/POS thermal printing, camera barcode scanning, UPI QR payments, and WhatsApp e-receipts.',
    featureList: [
      'In-browser Camera Barcode Scanner',
      'Web Bluetooth ESC/POS Thermal Printing (58mm & 80mm)',
      'Dynamic UPI QR Payment Generator',
      '1-Click WhatsApp E-Receipt Link & PDF Export',
      '100% Offline-First LocalStorage Architecture',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const FAQPageSchema: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How to print to thermal printer from browser?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Thermal Express uses the native Web Bluetooth API (supported in Google Chrome, Edge, and Opera). Simply click "Print ESC/POS (Web Bluetooth)", select your nearby paired 58mm or 80mm thermal printer from the browser popup, and the app will transmit raw ESC/POS binary buffers directly over Bluetooth GATT GATT without installing any drivers.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is this receipt maker really free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Thermal Express is 100% free with no monthly subscriptions, no account signup required, no database setup, and no hardware restrictions.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does it work offline?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. All cart data, inventory catalog, store configuration, and sales history are saved locally in your browser local storage. The application functions completely offline without an active internet connection.',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
