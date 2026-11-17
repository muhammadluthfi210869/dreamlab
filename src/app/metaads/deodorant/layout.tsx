import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maklon Deodorant Custom Formula BPOM & Halal | Dreamlab',
  description: 'Buat brand deodorant spray, roll on, balm, atau serum custom formula berizin BPOM & Halal MUI bersama Dreamlab. MOQ fleksibel & free desain kemasan.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Maklon Deodorant Custom Formula BPOM & Halal | Dreamlab',
    description: 'Buat brand deodorant spray, roll on, balm, atau serum custom formula berizin BPOM & Halal MUI bersama Dreamlab. MOQ fleksibel & free desain kemasan.',
    images: [{ url: 'https://dreamlab.id/new%20asset/background-visual-hero-section/bodycare.webp' }],
    type: 'website',
    locale: 'id_ID',
    siteName: 'Dreamlab',
  },
};

export default function DeodorantLayout({ children }: { children: React.ReactNode }) {
  return children;
}
