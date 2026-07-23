import React, { useEffect } from 'react';

interface SEOMetadataProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  keywords?: string[];
}

export const SEOMetadata: React.FC<SEOMetadataProps> = ({
  title = 'Free Thermal Receipt Generator | 58mm & 80mm Bluetooth Print | Thermal Express',
  description = 'Create and print retail bills directly to your Bluetooth thermal printer from your browser. No signup, no app installation. Perfect for 58mm & 80mm POS printers.',
  canonicalUrl = 'https://thermalexpress.app',
  keywords = [
    'Free thermal receipt generator online',
    'Bluetooth POS bill maker web app',
    '58mm thermal printer receipt maker',
    '80mm POS bill maker',
    'Free Kirana store billing app online',
    'ESC/POS browser print utility',
    'Zero signup retail bill generator',
  ],
}) => {
  useEffect(() => {
    // Dynamic Page Title Update
    document.title = title;

    // Update Meta Description
    let metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;

    // Update Meta Keywords
    let metaKeywords = document.querySelector<HTMLMetaElement>('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords.join(', ');

    // Google Site Verification Tag
    let googleVerification = document.querySelector<HTMLMetaElement>('meta[name="google-site-verification"]');
    if (!googleVerification) {
      googleVerification = document.createElement('meta');
      googleVerification.name = 'google-site-verification';
      document.head.appendChild(googleVerification);
    }
    googleVerification.content = 'k1HPjIefxNhbnW18m7GHkUSXJ4ggpK08WLs4raNBfcY';

    // OpenGraph Tags
    const updateOgTag = (property: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    updateOgTag('og:title', title);
    updateOgTag('og:description', description);
    updateOgTag('og:url', canonicalUrl);
    updateOgTag('og:type', 'website');
    updateOgTag('og:site_name', 'Thermal Express');

    // Twitter Card Tags
    const updateTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    updateTwitterTag('twitter:card', 'summary_large_image');
    updateTwitterTag('twitter:title', title);
    updateTwitterTag('twitter:description', description);
  }, [title, description, canonicalUrl, keywords]);

  return null;
};
