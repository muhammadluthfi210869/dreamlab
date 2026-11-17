import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bangun Brand Kosmetik & Skincare Sendiri dari Nol | Dreamlab',
  description: 'Mulai bisnis skincare & kosmetik merek sendiri bersama Dreamlab. 1 Klien = 1 Formula eksklusif, legalitas BPOM & Halal, MOQ fleksibel, dan bimbingan bisnis.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Bangun Brand Kosmetik & Skincare Sendiri dari Nol | Dreamlab',
    description: 'Mulai bisnis skincare & kosmetik merek sendiri bersama Dreamlab. 1 Klien = 1 Formula eksklusif, legalitas BPOM & Halal, MOQ fleksibel, dan bimbingan bisnis.',
    images: [{ url: 'https://dreamlab.id/new%20asset/background-visual-hero-section/home-page.webp' }],
    type: 'website',
    locale: 'id_ID',
    siteName: 'Dreamlab',
  },
};

export default function LandingMofLayout({ children }: { children: React.ReactNode }) {
  return children;
}

