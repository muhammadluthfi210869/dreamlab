import React from 'react';
import { headers } from 'next/headers';
import JsonLd from './JsonLd';

export default async function OrganizationSchema() {
  // Deteksi bahasa dari proxy.ts (x-dreamlab-path) — /en/ pakai English, selainnya Indonesian.
  const h = await headers();
  const pathname = h.get("x-dreamlab-path") || "/";
  const isEn = pathname.startsWith("/en");

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
