import { Metadata } from 'next';
import { GoogleAdsMaklonParfumClient } from '@/components/landing-pages/GoogleAdsMaklonParfumClient';

export const metadata: Metadata = {
  title: 'Maklon Parfum Custom Formula & Signature Scent | Dreamlab',
  description:
    'Wujudkan brand parfum dengan custom formula dan signature scent bersama Dreamlab. Didampingi dari formulasi, legalitas, produksi hingga pemasaran.',
  alternates: {
    canonical: 'https://dreamlab.id/google-ads/maklon-parfum/',
  },
};

export default function GoogleAdsMaklonParfum() {
  return <GoogleAdsMaklonParfumClient />;
}
