import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Peluang Bisnis Brand Kosmetik & Skincare Sendiri | Dreamlab',
  description: 'Wujudkan brand kecantikan impian Anda bersama Dreamlab. 1 Klien = 1 Formula eksklusif, resmi BPOM & Halal, MOQ fleksibel, dan pendampingan bisnis gratis.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Peluang Bisnis Brand Kosmetik & Skincare Sendiri | Dreamlab',
    description: 'Wujudkan brand kecantikan impian Anda bersama Dreamlab. 1 Klien = 1 Formula eksklusif, resmi BPOM & Halal, MOQ fleksibel, dan pendampingan bisnis gratis.',
    images: [{ url: 'https://dreamlab.id/new%20asset/background-visual-hero-section/home-page.webp' }],
    type: 'website',
    locale: 'id_ID',
    siteName: 'Dreamlab',
  },
};

export default function MetaAdsMofLayout({ children }: { children: React.ReactNode }) {
  return children;
}

