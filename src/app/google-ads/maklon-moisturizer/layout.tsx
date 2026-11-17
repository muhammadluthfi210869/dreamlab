import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maklon Moisturizer Custom Formula & Skin Barrier Expert | Dreamlab',
  description:
    'Pabrik maklon moisturizer terbaik di Indonesia. Ciptakan brand moisturizer high-end: Hydra Barrier, Acne Soothing, & Brightening Glow berizin BPOM & Halal resmi bersama Dreamlab.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Maklon Moisturizer Custom Formula & Skin Barrier Expert | Dreamlab',
    description:
      'Pabrik maklon moisturizer terbaik di Indonesia. Ciptakan brand moisturizer high-end: Hydra Barrier, Acne Soothing, & Brightening Glow berizin BPOM & Halal resmi bersama Dreamlab.',
    images: [{ url: 'https://dreamlab.id/new%20asset/background-visual-hero-section/skincare.webp' }],
    type: 'website',
    locale: 'id_ID',
    siteName: 'Dreamlab',
  },
  alternates: {
    canonical: 'https://dreamlab.id/google-ads/maklon-moisturizer/',
  },
};

export default function GoogleAdsMaklonMoisturizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
