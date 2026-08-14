import type { Metadata } from 'next';
import DreampreneurLanding from '@/components/dreampreneur/DreampreneurLanding';

export const metadata: Metadata = {
  title: 'Dreampreneur Batch 2 | Connect, Learn & Scale — Dreamlab',
  description:
    'Satu hari untuk memahami formula, strategi bisnis, growth marketing, dan peluang kolaborasi agar beauty brand lebih siap bertumbuh. 29 Agustus 2026, Surabaya.',
  alternates: {
    canonical: 'https://dreamlab.id/dreampreneur-batch-2/',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'Dreamlab',
    title: 'Dreampreneur Batch 2 | Connect, Learn & Scale — Dreamlab',
    description:
      'Satu hari untuk memahami formula, strategi bisnis, growth marketing, dan peluang kolaborasi agar beauty brand lebih siap bertumbuh. 29 Agustus 2026, Surabaya.',
    url: 'https://dreamlab.id/dreampreneur-batch-2/',
    images: [
      {
        url: 'https://dreamlab.id/assets/images/dreampreneur-batch-2/flyer.png',
        width: 810,
        height: 1013,
        alt: 'Dreampreneur Batch 2 — Beauty Academy di Surabaya',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dreampreneur Batch 2 | Connect, Learn & Scale — Dreamlab',
    description:
      'Satu hari untuk memahami formula, strategi bisnis, growth marketing, dan peluang kolaborasi agar beauty brand lebih siap bertumbuh. 29 Agustus 2026, Surabaya.',
    images: ['https://dreamlab.id/assets/images/dreampreneur-batch-2/flyer.png'],
  },
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
};

export default function DreampreneurPage() {
  return <DreampreneurLanding />;
}