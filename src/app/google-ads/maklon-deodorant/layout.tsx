import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maklon Deodorant Custom Formula & Cepat Edar BPOM | Dreamlab',
  description:
    'Pabrik maklon deodorant terpercaya di Indonesia. Rancang brand deodorant spray, roll on, dry serum, dan balm berizin BPOM, Halal, dan MOQ fleksibel bersama Dreamlab.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://dreamlab.id/google-ads/maklon-deodorant/',
  },
};

export default function GoogleAdsMaklonDeodorantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
