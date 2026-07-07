import type { PilotPageData } from '@/data/seo-pilot/batch-1';

const SITE_URL = 'https://dreamlab.id';

function buildBreadcrumbSchema(page: PilotPageData) {
  const segments = page.slug.split('/').filter(Boolean);
  const crumbItems = [
    { name: 'Home', url: '/' },
  ];

  if (segments[0] === 'panduan') {
    crumbItems.push({ name: 'Panduan', url: '/panduan/' });
  }

  crumbItems.push({ name: page.title, url: page.slug });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${page.canonical}#breadcrumb`,
    itemListElement: crumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url.replace(/\/?$/, '/')}`,
    })),
  };
}

function buildWebPageSchema(page: PilotPageData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${page.canonical}#webpage`,
    url: page.canonical,
    name: page.metaTitle,
    description: page.metaDescription,
    inLanguage: 'id-ID',
    datePublished: page.publishedAt,
    dateModified: page.updatedAt,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Dreamlab',
      url: `${SITE_URL}/`,
    },
  };
}

function buildArticleSchema(page: PilotPageData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${page.canonical}#article`,
    headline: page.title,
    description: page.metaDescription,
    keywords: [page.keywordTarget, page.seoCluster],
    datePublished: page.publishedAt,
    dateModified: page.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'Dreamlab Maklon Kosmetik',
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Dreamlab Indonesia',
    },
    mainEntityOfPage: {
      '@id': `${page.canonical}#webpage`,
    },
  };
}

function buildServiceSchema(page: PilotPageData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${page.canonical}#service`,
    name: page.title,
    serviceType: 'Maklon Kosmetik',
    description: page.metaDescription,
    provider: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Dreamlab Indonesia',
    },
    areaServed: 'Indonesia',
    audience: {
      '@type': 'Audience',
      audienceType: 'Brand owner kosmetik dan skincare',
    },
  };
}

function buildFaqSchema(page: PilotPageData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${page.canonical}#faq`,
    mainEntity: page.faq.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildPilotSchemas(page: PilotPageData) {
  const graph: Record<string, unknown>[] = [buildWebPageSchema(page), buildBreadcrumbSchema(page), buildServiceSchema(page)];

  if (page.pageType === 'pilot_article') {
    graph.push(buildArticleSchema(page) as Record<string, unknown>);
  }

  if (page.faq.length > 0) {
    graph.push(buildFaqSchema(page) as Record<string, unknown>);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
