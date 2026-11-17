import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maklon Kosmetik & Skincare Custom Formula BPOM | Dreamlab',
  description: 'Jasa maklon kosmetik & skincare terpercaya di Indonesia. 1 Klien 1 Formula eksklusif, resmi BPOM & Halal MUI, MOQ fleksibel bersama Dreamlab.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Maklon Kosmetik & Skincare Custom Formula BPOM | Dreamlab',
    description: 'Jasa maklon kosmetik & skincare terpercaya di Indonesia. 1 Klien 1 Formula eksklusif, resmi BPOM & Halal MUI, MOQ fleksibel bersama Dreamlab.',
    images: [{ url: 'https://dreamlab.id/new%20asset/background-visual-hero-section/skincare.webp' }],
    type: 'website',
    locale: 'id_ID',
    siteName: 'Dreamlab',
  },
  alternates: {
    canonical: 'https://dreamlab.id/google-ads/maklon-kosmetik/',
  },
};

export default function GoogleAdsMaklonKosmetikLayout({ children }: { children: React.ReactNode }) {
  return children;
}

