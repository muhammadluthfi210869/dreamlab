import React from 'react';
import JsonLd from './JsonLd';

export default function OrganizationSchema() {
  // Layout harus statik (tanpa headers()) supaya seluruh halaman bisa di-cache
  // di edge. Schema Organization dipakai default Indonesian (hhalaman /en/*
  // ditangani WebSite schema English di en/layout.tsx).
  const isEn = false;

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://dreamlab.id/#organization",
    "name": "Dreamlab Indonesia",
    "url": "https://dreamlab.id/",
    "logo": "https://dreamlab.id/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik--192x192.webp",
    "sameAs": [
      "https://www.instagram.com/dreamlab.id",
      "https://www.facebook.com/dreamlab.id",
      "https://www.tiktok.com/@dreamlab.id"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+62-881-0272-40339",
      "contactType": "customer service",
      "areaServed": isEn ? "Worldwide" : "ID",
      "availableLanguage": isEn ? "English" : "Indonesian"
    }
  };

  return <JsonLd data={organizationData} />;
}
