import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dreamlab Bisnis Kosmetik & Skincare | Dreamlab',
  description: 'Wawasan untuk beautypreneur Indonesia, temukan tren dan cara menjadi beautypreneur. Dreamlab maklon kosmetik yang tepat untuk bisnis anda.',
  alternates: {
    canonical: 'https://dreamlab.id/news-blog/',
  },
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  openGraph: {
    title: 'Dreamlab Bisnis Kosmetik & Skincare | Dreamlab',
    description: 'Wawasan untuk beautypreneur Indonesia, temukan tren dan cara menjadi beautypreneur. Dreamlab maklon kosmetik yang tepat untuk bisnis anda.',
    url: 'https://dreamlab.id/news-blog/',
    siteName: 'Dreamlab',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function NewsBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
