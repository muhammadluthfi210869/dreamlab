"use client";

import ProductHero from "./ProductHero";
import ProductAbout from "./ProductAbout";
import ProductGrid from "./ProductGrid";
import SubCategoryGrid from "./SubCategoryGrid";
import ProductPackagingGrid from "./ProductPackagingGrid";
import AdvantagesGrid from "@/components/AdvantagesGrid";
import ProductProcess from "./ProductProcess";
import ProductFAQ from "./ProductFAQ";
import CtaSection from "@/components/CtaSection";
import {
  HaircareMarqueeBand,
  HaircareValueSection,
  HaircareCertificationsSection,
  HaircareActiveIngredientsSlider,
  HaircareBusinessPackages,
  HaircareClientsSection,
} from "./HaircareSections";

interface ProductPageV2Props {
  data: any;
}

export default function ProductPageV2({ data }: ProductPageV2Props) {
  const hasSubCategories = data.subCategories && data.subCategories.length > 0;
  const isHaircare = data.slug === "haircare";

  if (isHaircare) {
    return (
      <main className="min-h-screen bg-white">
        {/* 1. Hero */}
        <ProductHero categoryData={data} />

        {/* 2. Pita nilai berjalan */}
        <HaircareMarqueeBand />

        {/* 3. Katalog produk (dengan filter masalah rambut) */}
        <ProductGrid
          products={data.products}
          categorySlug={data.slug}
        />

        {/* 4. Value: "Nilai yang Kamu Dapat dari Dreamlab" */}
        <HaircareValueSection />

        {/* 5. Our Certifications: "Legalitas dan Sertifikasi Resmi" */}
        <HaircareCertificationsSection />

        {/* 6. Bahan aktif (slider): "Bahan Aktif Unggulan Hair Care" */}
        <HaircareActiveIngredientsSlider />

        {/* 7. Kemasan */}
        <ProductPackagingGrid categorySlug={data.slug} />

        {/* 8. Proses maklon (1 versi responsif) */}
        <ProductProcess />

        {/* 9. Paket Bisnis: "Simulasi Paket Maklon Hair Care" */}
        <HaircareBusinessPackages />

        {/* 10. Our Client: "Dipercaya 1000+ Brand di Indonesia" */}
        <HaircareClientsSection />

        {/* 11. FAQ */}
        <ProductFAQ categorySlug={data.slug} categoryName={data.name} />

        {/* 12. CTA penutup */}
        <CtaSection title={`Wujudkan Brand ${data.name} Impian Anda dalam 3 Bulan`} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <ProductHero categoryData={data} />
      <ProductAbout categoryName={data.name} />

      {hasSubCategories ? (
        <SubCategoryGrid
          subCategories={data.subCategories}
          categorySlug={data.slug}
          categoryName={data.name}
        />
      ) : (
        <ProductGrid
          products={data.products.filter((p: { slug: string }) => !p.slug.startsWith("deodorant-"))}
          categorySlug={data.slug}
        />
      )}

      {/* Packaging design grid — skip for parfum category */}
      {data.slug !== "parfum" && <ProductPackagingGrid categorySlug={data.slug} />}

      <AdvantagesGrid title="8 Keuntungan Maklon" />
      <ProductProcess />
      <CtaSection title={`Wujudkan Brand ${data.name} Impian Anda dalam 3 Bulan`} />
      <ProductFAQ categorySlug={data.slug} categoryName={data.name} />
    </main>
  );
}
