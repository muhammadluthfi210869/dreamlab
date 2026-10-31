import { Metadata } from 'next';
import { Suspense } from 'react';
import MetaAdsMaklonLanding from '@/components/landing-pages/MetaAdsMaklonLanding';

export const metadata: Metadata = {
  title: 'Maklon Kosmetik | Bangun Brand Anda Bersama Dreamlab',
  description:
    'Wujudkan brand kosmetik Anda bersama Dreamlab. Konsultasikan pengembangan formula, produk, dan kebutuhan produksi sesuai target brand Anda.',
  robots: 'noindex, follow',
  openGraph: {
    title: 'Wujudkan Brand Kosmetik Anda Bersama Dreamlab',
    description: 'Dari ide produk hingga produksi. Mulai rencanakan brand Anda bersama Dreamlab.',
    url: 'https://dreamlab.id/ads/maklon-kosmetik/',
    siteName: 'Dreamlab Indonesia',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function MaklonKosmetikMetaAdsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <MetaAdsMaklonLanding />
    </Suspense>
  );
}
