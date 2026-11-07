import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Peluang Bisnis Brand Kosmetik & Skincare Sendiri | Dreamlab',
  description: 'Wujudkan brand kecantikan impian Anda bersama Dreamlab. 1 Klien = 1 Formula eksklusif, resmi BPOM & Halal, MOQ fleksibel, dan pendampingan bisnis gratis.',
  robots: { index: false, follow: false },
};

export default function MetaAdsMofLayout({ children }: { children: React.ReactNode }) {
  return children;
}

