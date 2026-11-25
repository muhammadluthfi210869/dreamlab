"use client";

import React from "react";
import ProductHero from "./ProductHero";
import ProductAbout from "./ProductAbout";
import ProductGrid from "./ProductGrid";
import HaircareCatalogGrid from "./HaircareCatalogGrid";
import SubCategoryGrid from "./SubCategoryGrid";
import ProductPackagingGrid from "./ProductPackagingGrid";
import AdvantagesGrid from "@/components/AdvantagesGrid";
import ProductProcess from "./ProductProcess";
import ProductFAQ from "./ProductFAQ";
import CtaSection from "@/components/CtaSection";
import OurCertification from "@/components/OurCertification";
import {
  HaircareMarqueeBand,
  HaircareValueSection,
  HaircareActiveIngredientsSlider,
  HaircareBusinessPackages,
  HaircareClientsSection,
} from "./HaircareSections";

export interface CategoryPageLayoutProps {
  data: any;
}

export function Hero({ data }: { data: any }) {
  return <ProductHero categoryData={data} />;
}

export function StatStrip({ show }: { show: boolean }) {
  if (!show) return null;
  return <HaircareMarqueeBand />;
}

export function Intro({
  show,
  categoryName,
}: {
  show: boolean;
  categoryName: string;
}) {
  if (!show) return null;
  return <ProductAbout categoryName={categoryName} />;
}

export function Catalog({ data }: { data: any }) {
  const isHaircare = data.slug === "haircare";
  const hasSubCategories =
    Array.isArray(data.subCategories) && data.subCategories.length > 0;

  if (isHaircare) {
    return (
      <HaircareCatalogGrid
        products={data.products}
        categorySlug={data.slug}
      />
    );
  }

  if (hasSubCategories) {
    return (
      <SubCategoryGrid
        subCategories={data.subCategories}
        categorySlug={data.slug}
        categoryName={data.name}
      />
    );
  }

  return (
    <ProductGrid
      products={(data.products || []).filter(
        (p: { slug: string }) => !p.slug.startsWith("deodorant-")
      )}
      categorySlug={data.slug}
    />
  );
}

export function Benefits({ isHaircare }: { isHaircare: boolean }) {
  if (isHaircare) {
    return <HaircareValueSection />;
  }
  return <AdvantagesGrid title="8 Keuntungan Maklon" />;
}

export function Legalitas({ show }: { show: boolean }) {
  if (!show) return null;
  return <OurCertification />;
}

export function Ingredients({ show }: { show: boolean }) {
  if (!show) return null;
  return <HaircareActiveIngredientsSlider />;
}

export function Packaging({
  show,
  categorySlug,
}: {
  show: boolean;
  categorySlug: string;
}) {
  if (!show) return null;
  return <ProductPackagingGrid categorySlug={categorySlug} />;
}

export function Process() {
  return <ProductProcess />;
}

export function Marquee({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="relative w-full overflow-hidden py-6 bg-[#FFF3E2] border-y border-[rgba(33,33,32,0.10)] group">
      <div className="flex w-max animate-[marquee_36s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {[0, 1].map((dupIdx) => (
          <div
            key={dupIdx}
            aria-hidden={dupIdx === 1 ? "true" : undefined}
            className="flex items-center gap-8 px-4 shrink-0"
          >
            {items.map((item, idx) => (
              <span
                key={`${dupIdx}-${idx}`}
                className="text-sm font-semibold text-[#212120] whitespace-nowrap"
              >
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export function Paket({ show }: { show: boolean }) {
  if (!show) return null;
  return <HaircareBusinessPackages />;
}

export function Trust({ show }: { show: boolean }) {
  if (!show) return null;
  return <HaircareClientsSection />;
}

export function FAQ({
  categorySlug,
  categoryName,
}: {
  categorySlug: string;
  categoryName: string;
}) {
  return <ProductFAQ categorySlug={categorySlug} categoryName={categoryName} />;
}

export function FinalCTA({ categoryName }: { categoryName: string }) {
  return (
    <CtaSection
      title={`Wujudkan Brand ${categoryName} Impian Anda dalam 3 Bulan`}
    />
  );
}

export default function CategoryPageLayout({ data }: CategoryPageLayoutProps) {
  const isHaircare = data.slug === "haircare";
  const hasPackaging = data.slug !== "parfum";

  return (
    <div className="min-h-screen bg-white text-[#212120] overflow-x-clip">
      {/* 1. Hero */}
      <Hero data={data} />

      {/* 2. StatStrip (haircare) */}
      <StatStrip show={isHaircare} />

      {/* 3. Intro ("Wujudkan Brand {X} Juaranya Formula") */}
      <Intro show={!isHaircare} categoryName={data.name} />

      {/* 4. Catalog ("… Siap Maklon") */}
      <Catalog data={data} />

      {/* 5. Benefits ("Keuntungan…" / "8 Keuntungan Maklon di Dreamlab") */}
      <Benefits isHaircare={isHaircare} />

      {/* 6. Legalitas (haircare) */}
      <Legalitas show={isHaircare} />

      {/* 7. Ingredients ("Bahan Aktif Unggulan …", haircare) */}
      <Ingredients show={isHaircare} />

      {/* 8. Packaging ("Pilihan Kemasan … Premium") */}
      <Packaging show={hasPackaging} categorySlug={data.slug} />

      {/* 9. Process ("PROSES MAKLON") */}
      <Process />

      {/* 10. Marquee strip (only when page has separate marquee items) */}
      <Marquee items={data.marqueeItems} />

      {/* 11. Paket ("Simulasi Paket Maklon …", haircare) */}
      <Paket show={isHaircare} />

      {/* 12. Trust ("Dipercaya 1000+ Brand …", haircare) */}
      <Trust show={isHaircare} />

      {/* 13. FAQ ("Ketahui Lebih Lanjut …") */}
      <FAQ categorySlug={data.slug} categoryName={data.name} />

      {/* 14. Final CTA ("Wujudkan Brand {X} Impian Anda dalam 3 Bulan") */}
      <FinalCTA categoryName={data.name} />
    </div>
  );
}
