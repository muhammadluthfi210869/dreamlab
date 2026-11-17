import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maklon Baby Care BPOM & Hypoallergenic | Dreamlab',
  description: 'Wujudkan brand baby care aman, hypoallergenic, pH balanced, berizin BPOM & Halal MUI bersama Dreamlab. MOQ ramah pemula dan gratis desain kemasan.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Maklon Baby Care BPOM & Hypoallergenic | Dreamlab',
    description: 'Wujudkan brand baby care aman, hypoallergenic, pH balanced, berizin BPOM & Halal MUI bersama Dreamlab. MOQ ramah pemula dan gratis desain kemasan.',
    images: [{ url: 'https://dreamlab.id/new%20asset/background-visual-hero-section/babycare.webp' }],
    type: 'website',
    locale: 'id_ID',
    siteName: 'Dreamlab',
  },
};

export default function BabyCareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
