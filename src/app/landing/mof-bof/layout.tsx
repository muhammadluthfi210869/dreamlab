import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Konsultasi HPP & Strategi Brand Maklon Kosmetik | Dreamlab',
  description: 'Hitung HPP, tentukan strategi harga, dan wujudkan brand kosmetik custom formula berizin BPOM & Halal bersama Dreamlab. Gratis desain kemasan & coaching bisnis.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Konsultasi HPP & Strategi Brand Maklon Kosmetik | Dreamlab',
    description: 'Hitung HPP, tentukan strategi harga, dan wujudkan brand kosmetik custom formula berizin BPOM & Halal bersama Dreamlab. Gratis desain kemasan & coaching bisnis.',
    images: [{ url: 'https://dreamlab.id/new%20asset/background-visual-hero-section/home-page.webp' }],
    type: 'website',
    locale: 'id_ID',
    siteName: 'Dreamlab',
  },
};

export default function LandingMofBofLayout({ children }: { children: React.ReactNode }) {
  return children;
}

