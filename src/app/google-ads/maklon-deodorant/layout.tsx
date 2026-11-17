import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maklon Deodorant Custom Formula & Cepat Edar BPOM | Dreamlab',
  description:
    'Pabrik maklon deodorant terpercaya di Indonesia. Rancang brand deodorant spray, roll on, dry serum, dan balm berizin BPOM, Halal, dan MOQ fleksibel bersama Dreamlab.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Maklon Deodorant Custom Formula & Cepat Edar BPOM | Dreamlab',
    description:
      'Pabrik maklon deodorant terpercaya di Indonesia. Rancang brand deodorant spray, roll on, dry serum, dan balm berizin BPOM, Halal, dan MOQ fleksibel bersama Dreamlab.',
    images: [{ url: 'https://dreamlab.id/new%20asset/background-visual-hero-section/bodycare.webp' }],
    type: 'website',
    locale: 'id_ID',
    siteName: 'Dreamlab',
  },
  alternates: {
    canonical: 'https://dreamlab.id/google-ads/maklon-deodorant/',
  },
};

export default function GoogleAdsMaklonDeodorantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
