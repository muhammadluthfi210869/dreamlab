import type { Metadata } from "next";
import { buildAlternates } from "@/lib/seo-lang";
import KatalogProduk from "@/components/KatalogProduk";
import CtaSection from "@/components/CtaSection";
import { homepageDataEn, ctaContentEn } from "@/data/en/site";

export const metadata: Metadata = {
  // Versi Indonesia tidak memiliki halaman /produk/ (hanya /produk/[kategori]),
  // jadi metadata ini mengikuti arti katalog produk maklon Dreamlab.
  title: {
    absolute: "Dreamlab | Cosmetic Manufacturing Product Catalog",
  },
  description:
    "Cosmetic manufacturing (maklon) product catalog: skincare, body care, hair care, decorative, baby care, perfume, foot care, and PKRT. BPOM, CPKB, Halal MUI.",
  alternates: buildAlternates("/en/produk/"),
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
  const { katalog } = homepageDataEn;

  return (
    <main className="min-h-screen bg-brand-white">
      {/* Katalog produk — komponen KatalogProduk (bentuk title+categories) yang sama persis
          dengan katalog produk di halaman home Indonesia */}
      <KatalogProduk title={katalog.title} categories={katalog.categories} />

      {/* CTA */}
      <CtaSection {...ctaContentEn} />
    </main>
  );
}
