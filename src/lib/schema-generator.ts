export interface SchemaPageData {
  url: string;
  title: string;
  description: string;
  h1: string;
  type: 'article' | 'service' | 'category' | 'homepage' | 'blog' | 'author';
  breadcrumbs: { name: string; url?: string }[];
  image?: string;
  faqs?: { question: string; answer: string }[];
  article?: {
    headline: string;
    image: string;
    datePublished: string;
    dateModified?: string;
    author: string;
  };
}

export function generatePageSchema(data: SchemaPageData) {
  const { url, title, description, breadcrumbs, faqs, article, image } = data;
  const siteUrl = 'https://dreamlab.id';
  const cleanUrl = url.replace(/\/?$/, '/');

  const graph: Record<string, unknown>[] = [
    // Organization
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'Dreamlab Indonesia',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik--192x192.webp`,
        width: 192,
        height: 192,
      },
      sameAs: [
        'https://www.instagram.com/dreamlab.id',
        'https://www.facebook.com/dreamlab.id',
        'https://www.tiktok.com/@dreamlab.id',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+62-812-3456-7890',
        contactType: 'customer service',
        areaServed: 'ID',
        availableLanguage: 'Indonesian',
      },
    },

    // WebSite
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Dreamlab Indonesia',
      description: 'Pabrik maklon kosmetik terbaik di Indonesia. Solusi lengkap dari formulasi, kemasan, BPOM & halal, MOQ fleksibel.',
      publisher: { '@id': `${siteUrl}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/?s={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },

    // WebPage
    {
      '@type': 'WebPage',
      '@id': `${cleanUrl}#webpage`,
      url: cleanUrl,
      name: title,
      description: description,
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: { '@id': `${siteUrl}/#organization` },
      breadcrumb: { '@id': `${cleanUrl}#breadcrumb` },
      ...(image ? { primaryImageOfPage: { '@type': 'ImageObject', url: image } } : {}),
    },

    // BreadcrumbList
    {
      '@type': 'BreadcrumbList',
      '@id': `${cleanUrl}#breadcrumb`,
      itemListElement: breadcrumbs.map((bc, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: bc.name,
        ...(bc.url ? { item: bc.url.startsWith('http') ? bc.url : `${siteUrl}${bc.url}` } : {}),
      })),
    },
  ];

  // Article schema for blog posts
  if (data.type === 'article' && article) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${cleanUrl}#article`,
      headline: article.headline,
      description: description,
      image: article.image,
      author: {
        '@type': 'Person',
        name: article.author,
      },
      publisher: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
      },
      datePublished: article.datePublished,
      dateModified: article.dateModified || article.datePublished,
      mainEntityOfPage: { '@id': `${cleanUrl}#webpage` },
    });
  }

  // FAQPage schema
  if (faqs && faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${cleanUrl}#faq`,
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  // LocalBusiness for service/location pages
  if (data.type === 'service') {
    graph.push({
      '@type': 'LocalBusiness',
      '@id': `${siteUrl}/#localbusiness`,
      parentOrganization: { '@id': `${siteUrl}/#organization` },
      name: 'Dreamlab Indonesia',
      description: 'Pabrik maklon kosmetik dan skincare bersertifikat CPKB Grade A dan Halal.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. Raya Menganti KM 12',
        addressLocality: 'Surabaya',
        addressRegion: 'Jawa Timur',
        postalCode: '61175',
        addressCountry: 'ID',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '-7.301170',
        longitude: '112.645530',
      },
      areaServed: 'Indonesia',
      telephone: '+62-812-3456-7890',
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export interface ProductPageSchemaData {
  url: string;
  productName: string;
  categoryName: string;
  tagline: string;
  description: string;
  heroImage: string;
  breadcrumbs: { label: string; href?: string }[];
  faqs: { question: string; answer: string }[];
  moq: string;
  productionTime: string;
  certifications: string[];
  priceRange?: string;
  ratingValue?: number;
  reviewCount?: number;
}

export function generateProductPageSchema(data: ProductPageSchemaData) {
  const siteUrl = 'https://dreamlab.id';
  const { url, productName, categoryName, tagline, description, heroImage, breadcrumbs, faqs, moq, productionTime, certifications, ratingValue, reviewCount } = data;
  const cleanUrl = url.replace(/\/?$/, '/');

  const graph: Record<string, unknown>[] = [
    // Organization
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'Dreamlab Indonesia',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik--192x192.webp`,
        width: 192,
        height: 192,
      },
      sameAs: [
        'https://www.instagram.com/dreamlab.id',
        'https://www.facebook.com/dreamlab.id',
        'https://www.tiktok.com/@dreamlab.id',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+62-812-3456-7890',
        contactType: 'customer service',
        areaServed: 'ID',
        availableLanguage: 'Indonesian',
      },
    },

    // WebSite
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Dreamlab Indonesia',
      description: 'Pabrik maklon kosmetik terbaik di Indonesia. Solusi lengkap dari formulasi, kemasan, BPOM & halal, MOQ fleksibel.',
      publisher: { '@id': `${siteUrl}/#organization` },
    },

    // Service (Product Category)
    {
      '@type': 'Service',
      '@id': `${cleanUrl}#service`,
      name: `Maklon ${productName}`,
      description: description,
      provider: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Dreamlab Indonesia',
      },
      serviceType: 'Kontrak Manufaktur Kosmetik',
      areaServed: 'Indonesia',
      offers: { '@id': `${cleanUrl}#offer` },
    },

    // Product (Top-level for better indexing)
    {
      '@type': 'Product',
      '@id': `${cleanUrl}#product`,
      name: `Maklon ${productName}`,
      description: description,
      category: categoryName,
      brand: {
        '@type': 'Brand',
        name: 'Dreamlab Indonesia',
      },
      manufacturer: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Dreamlab Indonesia',
      },
      offers: {
        '@id': `${cleanUrl}#offer`,
      },
      ...(ratingValue ? {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: ratingValue,
          bestRating: 5,
          worstRating: 1,
          ratingCount: reviewCount || 1,
        },
      } : {}),
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'MOQ', value: moq },
        { '@type': 'PropertyValue', name: 'Production Time', value: productionTime },
        ...certifications.map((cert) => ({ '@type': 'PropertyValue', name: 'Certification', value: cert })),
      ],
    },

    // Offer
    {
      '@type': 'Offer',
      '@id': `${cleanUrl}#offer`,
      url: cleanUrl,
      priceCurrency: 'IDR',
      minOrderQuantity: moq,
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString().split('T')[0],
      seller: {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Dreamlab Indonesia',
      },
    },

    // WebPage
    {
      '@type': 'WebPage',
      '@id': `${cleanUrl}#webpage`,
      url: cleanUrl,
      name: `Maklon ${productName} — ${tagline} | Dreamlab`,
      description: description.substring(0, 160),
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: { '@id': `${siteUrl}/#organization` },
      breadcrumb: { '@id': `${cleanUrl}#breadcrumb` },
      primaryImageOfPage: { '@type': 'ImageObject', url: heroImage },
    },

    // BreadcrumbList
    {
      '@type': 'BreadcrumbList',
      '@id': `${cleanUrl}#breadcrumb`,
      itemListElement: breadcrumbs.map((bc, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: bc.label,
        ...(bc.href ? { item: bc.href.startsWith('http') ? bc.href : `${siteUrl}${bc.href}` } : {}),
      })),
    },
  ];

  // FAQPage schema
  if (faqs && faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${cleanUrl}#faq`,
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
