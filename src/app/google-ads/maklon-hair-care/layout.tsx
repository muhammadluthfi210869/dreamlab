import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maklon Hair Care Custom Formula & BPOM Resmi | Dreamlab',
  description: 'Wujudkan brand hair care (shampoo, hair serum, hair tonic, hair mask) custom formula berizin BPOM & Halal MUI bersama Dreamlab. MOQ fleksibel & pendampingan penuh.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Maklon Hair Care Custom Formula & BPOM Resmi | Dreamlab',
    description: 'Wujudkan brand hair care (shampoo, hair serum, hair tonic, hair mask) custom formula berizin BPOM & Halal MUI bersama Dreamlab. MOQ fleksibel & pendampingan penuh.',
    images: [{ url: 'https://dreamlab.id/new%20asset/background-visual-hero-section/haircare.webp' }],
    type: 'website',
    locale: 'id_ID',
    siteName: 'Dreamlab',
  },
  alternates: {
    canonical: 'https://dreamlab.id/google-ads/maklon-hair-care/',
  },
};

export default function GoogleAdsMaklonHairCareLayout({ children }: { children: React.ReactNode }) {
  return children;
}

