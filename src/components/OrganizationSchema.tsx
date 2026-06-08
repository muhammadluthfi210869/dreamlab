import React from 'react';
import JsonLd from './JsonLd';

export default function OrganizationSchema() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://dreamlab.id/#organization",
    "name": "Dreamlab Indonesia",
    "url": "https://dreamlab.id",
    "logo": "https://dreamlab.id/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik--192x192.webp",
    "sameAs": [
      "https://www.instagram.com/dreamlab.id",
      "https://www.facebook.com/dreamlab.id",
      "https://www.tiktok.com/@dreamlab.id"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+62-812-3456-7890",
      "contactType": "customer service",
      "areaServed": "ID",
      "availableLanguage": "Indonesian"
    }
  };

  return <JsonLd data={organizationData} />;
}
