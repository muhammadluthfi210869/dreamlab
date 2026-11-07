import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Peluang Bisnis Brand Kosmetik & Skincare Sendiri | Dreamlab',
  robots: { index: false, follow: false },
};

export default function LandingMofLayout({ children }: { children: React.ReactNode }) {
  return children;
}

