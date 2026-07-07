import type { Metadata } from 'next';
import type { PilotPageData } from '@/data/seo-pilot/batch-1';

export function buildPilotMetadata(page: PilotPageData): Metadata {
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: [
      page.keywordTarget,
      page.pageType === 'pilot_article' ? 'panduan maklon skincare' : 'estimasi maklon skincare',
      'Dreamlab',
    ],
    alternates: {
      canonical: page.canonical,
    },
    openGraph: {
      type: page.pageType === 'pilot_article' ? 'article' : 'website',
      locale: 'id_ID',
      siteName: 'Dreamlab',
      title: page.metaTitle,
      description: page.metaDescription,
      url: page.canonical,
      publishedTime: page.pageType === 'pilot_article' ? page.publishedAt : undefined,
      modifiedTime: page.updatedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription,
    },
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  };
}
