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
  const fullUrl = url.startsWith('http')
    ? url
    : `${siteUrl}${url.startsWith('/') ? url : `/${url}`}`;
  const cleanUrl = fullUrl.replace(/\/?$/, '/');

  const graph: Record<string, unknown>[] = [
    // Organization
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'Dreamlab Indonesia',
      legalName: 'PT Karya Impian Laboratoris',
      url: `${siteUrl}/`,
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
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+62-819-5241-7051',
          contactType: 'sales',
          name: 'Annisa (Sales & Business Development)',
          areaServed: 'ID',
          availableLanguage: 'Indonesian',
        },
        {
          '@type': 'ContactPoint',
          telephone: '+62-877-1223-2389',
          contactType: 'sales',
          name: 'Jessica (Sales & Business Development)',
          areaServed: 'ID',
          availableLanguage: 'Indonesian',
        },
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Dukuh Kupang Timur XX No.77B, Pakis, Kec. Sawahan',
        addressLocality: 'Surabaya',
        addressRegion: 'Jawa Timur',
        postalCode: '60256',
        addressCountry: 'ID',
      },
    },

    // WebSite
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: `${siteUrl}/`,
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
      author: article.author.includes('Dreamlab')
        ? {
            '@type': 'Organization',
            name: article.author,
            url: `${siteUrl}/`,
          }
        : {
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
      '@type': ['LocalBusiness', 'Manufacturer'],
      '@id': `${siteUrl}/#localbusiness`,
      parentOrganization: { '@id': `${siteUrl}/#organization` },
      name: 'Dreamlab Indonesia',
      legalName: 'PT Karya Impian Laboratoris',
      description: 'Pabrik maklon kosmetik, skincare, bodycare dan parfum bersertifikat CPKB Grade A, BPOM dan Halal MUI di Jawa Timur.',
      url: `${siteUrl}/`,
      telephone: '+62-819-5241-7051',
      email: 'official@dreamlab.id',
      hasMap: 'https://maps.app.goo.gl/UDWzjzsL9ZjTPzLJ6',
      priceRange: 'Rp Rp Rp',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Dukuh Kupang Timur XX No.77B, Pakis, Kec. Sawahan',
        addressLocality: 'Surabaya',
        addressRegion: 'Jawa Timur',
        postalCode: '60256',
        addressCountry: 'ID',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -7.289167,
        longitude: 112.716389,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '17:00',
        },
      ],
      areaServed: [
        { '@type': 'Country', name: 'Indonesia' },
        { '@type': 'AdministrativeArea', name: 'Jawa Timur' },
      ],
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
}

export function generateProductPageSchema(data: ProductPageSchemaData) {
  const siteUrl = 'https://dreamlab.id';
  const { url, productName, categoryName, tagline, description, heroImage, breadcrumbs, faqs, moq, productionTime, certifications, priceRange } = data;
  const cleanUrl = url.replace(/\/?$/, '/');

  const graph: Record<string, unknown>[] = [
    // Organization
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'Dreamlab Indonesia',
      legalName: 'PT Karya Impian Laboratoris',
      url: `${siteUrl}/`,
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
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+62-819-5241-7051',
          contactType: 'sales',
          name: 'Annisa (Sales & Business Development)',
          areaServed: 'ID',
          availableLanguage: 'Indonesian',
        },
        {
          '@type': 'ContactPoint',
          telephone: '+62-877-1223-2389',
          contactType: 'sales',
          name: 'Jessica (Sales & Business Development)',
          areaServed: 'ID',
          availableLanguage: 'Indonesian',
        },
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Dukuh Kupang Timur XX No.77B, Pakis, Kec. Sawahan',
        addressLocality: 'Surabaya',
        addressRegion: 'Jawa Timur',
        postalCode: '60256',
        addressCountry: 'ID',
      },
    },

    // WebSite
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: `${siteUrl}/`,
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
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: heroImage.startsWith('http') ? heroImage : new URL(heroImage, siteUrl).toString(),
      },
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
