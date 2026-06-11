"use client";

import dynamic from "next/dynamic";
import ProductHero from "./ProductHero";
import ProductAbout from "./ProductAbout";
import ProductGrid from "./ProductGrid";
import SubCategoryGrid from "./SubCategoryGrid";
import ProductPackagingGrid from "./ProductPackagingGrid";

const AdvantagesGrid = dynamic(() => import("@/components/AdvantagesGrid"));
const ProductProcess = dynamic(() => import("./ProductProcess"));
const ProductFAQ = dynamic(() => import("./ProductFAQ"));
const CtaSection = dynamic(() => import("@/components/CtaSection"));

interface ProductPageV2Props {
  data: any;
}

export default function ProductPageV2({ data }: ProductPageV2Props) {
  const hasSubCategories = data.subCategories && data.subCategories.length > 0;

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
        <ProductGrid products={data.products} categorySlug={data.slug} />
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

