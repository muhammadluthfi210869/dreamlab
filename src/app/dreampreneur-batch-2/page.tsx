import type { Metadata } from 'next';
import DreampreneurLanding from '@/components/dreampreneur/DreampreneurLanding';

export const metadata: Metadata = {
  title: 'Dreampreneur Vol. 2 | Connect, Learn & Scale — Dreamlab',
  description:
    'Belajar membangun dan scale beauty brand bersama praktisi product development, business strategy, quality testing, dan digital marketing di Dreampreneur Vol. 2.',
  alternates: {
    canonical: 'https://dreamlab.id/dreampreneur-batch-2/',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'Dreamlab',
    title: 'Dreampreneur Vol. 2 | Connect, Learn & Scale — Dreamlab',
    description:
      'Belajar membangun dan scale beauty brand bersama praktisi product development, business strategy, quality testing, dan digital marketing di Dreampreneur Vol. 2.',
    url: 'https://dreamlab.id/dreampreneur-batch-2/',
    images: [
      {
        url: 'https://dreamlab.id/assets/images/Dreamlab-Dreamprenuer-Academy--1024x540.webp',
        width: 1024,
        height: 540,
        alt: 'Dreampreneur Vol. 2 — Dreamlab Beauty Business Event',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dreampreneur Vol. 2 | Connect, Learn & Scale — Dreamlab',
    description:
      'Belajar membangun dan scale beauty brand bersama praktisi product development, business strategy, quality testing, dan digital marketing di Dreampreneur Vol. 2.',
    images: ['https://dreamlab.id/assets/images/Dreamlab-Dreamprenuer-Academy--1024x540.webp'],
  },
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
};

export default function DreampreneurPage() {
  return <DreampreneurLanding />;
}