import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promo Maklon Kosmetik Ramadan & Lebaran | Dreamlab",
  description:
    "Wujudkan brand kosmetik & parfum Anda siap panen momentum Ramadan dan Lebaran bersama Dreamlab. Promo MOQ fleksibel, free custom formula, BPOM & Halal MUI.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Promo Maklon Kosmetik Ramadan & Lebaran | Dreamlab",
    description:
      "Wujudkan brand kosmetik & parfum Anda siap panen momentum Ramadan dan Lebaran bersama Dreamlab. Promo MOQ fleksibel, free custom formula, BPOM & Halal MUI.",
    images: [{ url: "https://dreamlab.id/assets/ramadan/hero-desktop.webp" }],
    type: "website",
    locale: "id_ID",
    siteName: "Dreamlab",
  },
};

export default function MetaAdsRamadanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
