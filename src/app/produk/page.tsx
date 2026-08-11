import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { homepageData } from "@/data/homepage";
import CtaSection from "@/components/CtaSection";

const KatalogProduk = dynamic(() => import("@/components/KatalogProduk"));

export const metadata: Metadata = {
  title: "Katalog Produk Maklon Kosmetik | Dreamlab",
  description:
    "Katalog produk maklon kosmetik Dreamlab: skincare, body care, hair care, decorative, baby care, parfum, foot care, dan PKRT. BPOM, CPKB, Halal MUI. MOQ fleksibel.",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  alternates: { canonical: "https://dreamlab.id/produk/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Dreamlab",
    title: "Katalog Produk Maklon Kosmetik | Dreamlab",
    description:
      "Katalog produk maklon kosmetik Dreamlab: skincare, body care, hair care, decorative, baby care, parfum, foot care, dan PKRT. BPOM, CPKB, Halal MUI.",
    url: "https://dreamlab.id/produk/",
  },
};

export default function ProdukPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="py-16 bg-brand-black">
        <div className="container-custom text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Katalog Produk Maklon Dreamlab
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Satu tempat untuk semua kebutuhan maklon kosmetik Anda — dari skincare,
            body care, hair care, decorative, baby care, hingga parfum. Semua
            bersertifikat BPOM, CPKB Grade A & Halal MUI.
          </p>
        </div>
      </section>
      <KatalogProduk title={homepageData.katalog.title} categories={homepageData.katalog.categories} />
      <CtaSection title="Wujudkan Brand Kosmetik Impian Anda dalam 3 Bulan" subtitle="Konsultasi gratis dengan tim Dreamlab untuk produk maklon Anda." />
    </main>
  );
}
