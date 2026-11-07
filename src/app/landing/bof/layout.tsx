import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maklon Kosmetik Resmi BPOM & Sampel Kilat | Dreamlab',
  robots: { index: false, follow: false },
};

export default function LandingBofLayout({ children }: { children: React.ReactNode }) {
  return children;
}

