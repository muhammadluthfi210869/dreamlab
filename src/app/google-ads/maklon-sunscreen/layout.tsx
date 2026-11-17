import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maklon Sunscreen Custom Formula & Cepat Edar BPOM | Dreamlab',
  description:
    'Pabrik maklon sunscreen terbaik di Indonesia. Ciptakan brand tabir surya Physical, Hybrid, Chemical, Tone Up, dan Gel berizin BPOM, Halal, dan MOQ fleksibel bersama Dreamlab.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Maklon Sunscreen Custom Formula & Cepat Edar BPOM | Dreamlab',
    description:
      'Pabrik maklon sunscreen terbaik di Indonesia. Ciptakan brand tabir surya Physical, Hybrid, Chemical, Tone Up, dan Gel berizin BPOM, Halal, dan MOQ fleksibel bersama Dreamlab.',
    images: [{ url: 'https://dreamlab.id/new%20asset/background-visual-hero-section/skincare.webp' }],
    type: 'website',
    locale: 'id_ID',
    siteName: 'Dreamlab',
  },
  alternates: {
    canonical: 'https://dreamlab.id/google-ads/maklon-sunscreen/',
  },
};

export default function GoogleAdsMaklonSunscreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
