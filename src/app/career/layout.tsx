import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Career | Dreamlab Indonesia',
  description: 'Lihat posisi terbuka dan mulai perjalanan karier bersama Dreamlab Indonesia.',
  alternates: {
    canonical: 'https://dreamlab.id/career/',
  },
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  openGraph: {
    title: 'Career | Dreamlab Indonesia',
    description: 'Lihat posisi terbuka dan mulai perjalanan karier bersama Dreamlab Indonesia.',
    url: 'https://dreamlab.id/career/',
    siteName: 'Dreamlab Indonesia',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function CareerLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}
