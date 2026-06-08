"use client";

import StandardProductHero from "./StandardProductHero";
import ProductTabs from "./ProductTabs";
import { BrandMarquee, ProductFAQ } from "./ProductSections";
import ProductDetailTabs from "./ProductDetailTabs";
import BabyCareCatalog from "./BabyCareCatalog";
import ProductVariantSection from "./ProductVariantSection";
import DecorativeProductDetailTabs from "./DecorativeProductDetailTabs";
import HaircareProductDetailTabs from "./HaircareProductDetailTabs";
import CtaSection from "./CtaSection";
import FloatingWhatsApp from "./FloatingWhatsApp";

import { CategoryTab, FAQItem } from "@/types";


interface ProductPageTemplateProps {
  data: {
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    backgroundImage: string;
    heroBgColor?: string;
    categories: CategoryTab[];
    faqs: FAQItem[];
  };
}

export default function ProductPageTemplate({ data }: ProductPageTemplateProps) {
  return (
    <main className="bg-brand-white min-h-screen">
      {/* 1. Hero Section */}
      <StandardProductHero 
        title={data.title}
        subtitle={data.subtitle}
        description={data.description}
        backgroundImage={data.backgroundImage}
        category={data.title}
        bgColor={data.heroBgColor}
      />

      {/* 2. Trusted Brand Marquee (Shown for all except maybe specific ones, but let's keep it consistent) */}
      <BrandMarquee />

      {/* 3. Product Catalog */}
      <div id="catalog" className="scroll-mt-24">
        {(data.slug === "skincare" || data.slug === "bodycare" || data.slug === "footcare") ? (
          <>
            <ProductDetailTabs categories={data.categories} />
            {data.slug === "skincare" && <ProductVariantSection />}
          </>
        ) : (data.slug === "decorative" || data.slug === "parfum") ? (
          <DecorativeProductDetailTabs categories={data.categories} />
        ) : data.slug === "haircare" ? (
          <HaircareProductDetailTabs categories={data.categories} />
        ) : data.slug === "babycare" ? (
          <BabyCareCatalog products={data.categories[0].products} />
        ) : (
          <>
            <div className="container-custom pt-24 text-center">
              <div className="inline-block px-4 py-1 bg-brand-orange/10 rounded-full mb-6">
                <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.3em] font-onest">
                  Our Collection
                </span>
              </div>
              <h2 className="text-brand-black mb-4">
                <span className="font-light">EXPLORE OUR</span><br />
                <span className="font-black text-brand-orange">PRODUCT RANGE</span>
              </h2>
              <div className="w-24 h-1.5 bg-brand-orange mx-auto rounded-full mb-12" />
            </div>
            <ProductTabs categories={data.categories} />
          </>
        )}
      </div>

      {/* 4. CTA Section */}
      <CtaSection 
        title={
          data.slug === "babycare" ? (
            <>SIAP WUJUDKAN <span className="text-brand-orange">BRAND BABY CARE ?</span></>
          ) : (
            <>SIAP WUJUDKAN <span className="text-brand-orange">BRAND IMPIAN ANDA?</span></>
          )
        }
        subtitle={
          data.slug === "babycare" 
            ? "Maklon Baby Care BPOM Konsultasi Gratis dengan Business Development untuk Konsep Produk Aman, Formula Juara"
            : `Maklon ${data.title} BPOM. Konsultasi Gratis dengan Business Development untuk Konsep Produk dan Formula Juara.`
        }
      />

      {/* 5. FAQ Section */}
      <ProductFAQ category={data.title} faqs={data.faqs} />

      <FloatingWhatsApp />
    </main>
  );
}
