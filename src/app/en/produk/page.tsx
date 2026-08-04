import type { Metadata } from "next";
import KatalogProduk from "@/components/KatalogProduk";
import CtaSection from "@/components/CtaSection";
import { catalogContentEn, ctaContentEn } from "@/data/en/site";

export const metadata: Metadata = {
  // Versi Indonesia tidak memiliki halaman /produk/ (hanya /produk/[kategori]),
  // jadi metadata ini mengikuti arti katalog produk maklon Dreamlab.
  title: {
    absolute: "Dreamlab | Cosmetic Manufacturing Product Catalog",
  },
  description:
    "Cosmetic manufacturing (maklon) product catalog: skincare, body care, hair care, decorative, baby care, perfume, foot care, and PKRT. BPOM, CPKB, Halal MUI.",
  // /en/produk/ tidak punya pasangan halaman Indonesia (tidak ada /produk/ di ID),
  // jadi cukup canonical saja — tanpa hreflang (mencegah hreflang-to-404).
  alternates: { canonical: "https://dreamlab.id/en/produk/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Dreamlab",
    title: "Dreamlab | Cosmetic Manufacturing Product Catalog",
    description:
      "Cosmetic manufacturing (maklon) product catalog: skincare, body care, hair care, decorative, baby care, perfume, foot care, and PKRT.",
    url: "https://dreamlab.id/en/produk/",
  },
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
};

export default function EnProdukPage() {
  return (
    <main className="min-h-screen bg-brand-white">
      {/* Katalog produk — komponen KatalogProduk yang sama persis dengan home
          Indonesia, diisi konten English (visual categories) */}
      <KatalogProduk content={catalogContentEn} />

      {/* CTA */}
      <CtaSection {...ctaContentEn} />
    </main>
  );
}
