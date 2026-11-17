import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jasa Maklon Kosmetik Siap Produksi & Legalitas BPOM | Dreamlab',
  description: 'Produksi brand kosmetik Anda bulan ini bersama pabrik CPKB Grade A Dreamlab. Formula eksklusif, HPP transparan, sampel kilat, dan urus BPOM hingga tuntas.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Jasa Maklon Kosmetik Siap Produksi & Legalitas BPOM | Dreamlab',
    description: 'Produksi brand kosmetik Anda bulan ini bersama pabrik CPKB Grade A Dreamlab. Formula eksklusif, HPP transparan, sampel kilat, dan urus BPOM hingga tuntas.',
    images: [{ url: 'https://dreamlab.id/new%20asset/background-visual-hero-section/home-page.webp' }],
    type: 'website',
    locale: 'id_ID',
    siteName: 'Dreamlab',
  },
};

export default function LandingBofLayout({ children }: { children: React.ReactNode }) {
  return children;
}

