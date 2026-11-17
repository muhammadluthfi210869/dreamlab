import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maklon Kosmetik Resmi BPOM & Sampel Kilat | Dreamlab',
  description: 'Maklon kosmetik siap produksi bulan ini. Formula eksklusif, izin BPOM & Halal all-in, HPP transparan, MOQ fleksibel, dan gratis desain kemasan.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Maklon Kosmetik Resmi BPOM & Sampel Kilat | Dreamlab',
    description: 'Maklon kosmetik siap produksi bulan ini. Formula eksklusif, izin BPOM & Halal all-in, HPP transparan, MOQ fleksibel, dan gratis desain kemasan.',
    images: [{ url: 'https://dreamlab.id/new%20asset/background-visual-hero-section/home-page.webp' }],
    type: 'website',
    locale: 'id_ID',
    siteName: 'Dreamlab',
  },
};

export default function MetaAdsBofLayout({ children }: { children: React.ReactNode }) {
  return children;
}

