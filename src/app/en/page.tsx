import type { Metadata } from "next";
import Link from "next/link";
import { buildAlternates } from "@/lib/seo-lang";
import PremiumHero from "@/components/PremiumHero";
import ProductTrustBar from "@/components/ProductPageV2/ProductTrustBar";
import KatalogProduk from "@/components/KatalogProduk";
import BrandShowcaseSection from "@/components/BrandShowcaseSection";
import LogoScroll from "@/components/LogoScroll";
import AdvantagesGrid from "@/components/AdvantagesGrid";
import OurCertification from "@/components/OurCertification";
import CtaSection from "@/components/CtaSection";
import MediaCoverage from "@/components/MediaCoverage";
import FaqHome from "@/components/FaqHome";
import BlogSection from "@/components/BlogSection";
import { aboutData } from "@/data/about-us";
import {
  homepageDataEn,
  trustBarContentEn,
  brandShowcaseContentEn,
  advantagesContentEn,
  faqHomeContentEn,
  ctaContentEn,
  catalogContentEn,
  homeBlogContentEn,
} from "@/data/en/site";

export const metadata: Metadata = {
  // Terjemahan setia dari metadata halaman Home Indonesia.
  title: {
    absolute:
      "Dreamlab | Best BPOM Cosmetic & Perfume Manufacturer - Make Your Dream Brand a Reality",
  },
  description:
    "One-Stop Cosmetic Manufacturing (Maklon) Certified BPOM, CPKB Grade A & Halal MUI in Surabaya. 500+ brands have trusted their formulation & production with us.",
  alternates: buildAlternates("/en/"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Dreamlab",
    title:
      "Dreamlab | Best BPOM Cosmetic & Perfume Manufacturer - Make Your Dream Brand a Reality",
    description:
      "One-Stop Cosmetic Manufacturing (Maklon) Certified BPOM, CPKB Grade A & Halal MUI in Surabaya. 500+ brands have trusted their formulation & production with us.",
    url: "https://dreamlab.id/en/",
  },
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
};

export default function EnHome() {
  const { hero, trustedBrands, media, blog } = homepageDataEn;

  return (
    <main className="min-h-screen bg-brand-white">
      {/* 1. HERO SECTION — komponen PremiumHero (sama persis dengan versi Indonesia) */}
      <PremiumHero
        smallTitle={hero.smallTitle}
        title={hero.title}
        subtitle={hero.subtitle}
        ctaText={hero.ctaText}
        ctaLink={hero.ctaLink}
        backgroundImage={hero.backgroundImage}
      />

      {/* 1.5. TRUST BAR */}
      <ProductTrustBar items={trustBarContentEn} />

      {/* 2. KATALOG PRODUK — komponen sama persis dengan home Indonesia, diisi
          konten English (visual categories) supaya tidak memakai teks default ID. */}
      <KatalogProduk content={catalogContentEn} />

      {/* 2.3. BRAND SHOWCASE */}
      <BrandShowcaseSection content={brandShowcaseContentEn} />

      {/* 2.5. TRUSTED BY 500+ BRAND (LOGO SCROLL) */}
      <LogoScroll
        logos={aboutData.partnerLogos}
        headline={trustedBrands.title}
        subHeadline={trustedBrands.subtitle}
      />

      {/* 5. 8 ADVANTAGES */}
      <AdvantagesGrid title="8 Advantages of Manufacturing at Dreamlab" content={advantagesContentEn} />

      {/* 5.5. CERTIFICATION */}
      <OurCertification alt="Official Dreamlab Certification CPKB BPOM Halal Kemenkumham" />

      {/* 7. CTA */}
      <CtaSection {...ctaContentEn} />

      {/* 7.5. MEDIA COVERAGE */}
      <MediaCoverage title={media.title} logos={media.logos} />

      {/* 6.8. GENERAL TRUST FAQ */}
      <FaqHome content={faqHomeContentEn} />

      {/* GUIDE HUB PROMO (setara "Panduan Batch 1" di versi Indonesia) */}
      <section className="bg-[#fff8ef] px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-[#eadfcf] bg-white p-8 text-center shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-10">
          <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">
            Guide Batch 1
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-[#1f1f1d] sm:text-4xl">
            Need a cleaner path to read costs and MOQ?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
            Open the Dreamlab guide hub to read 2 pilot articles and 2 money pages designed
            specifically for buyer intent, cost estimation, and MOQ validation.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/panduan/"
              className="inline-flex items-center justify-center rounded-full bg-[#D98A00] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#D98A00]/20 transition hover:translate-y-[-1px] hover:bg-[#c97e00]"
            >
              Open Guide Hub
            </Link>
          </div>
        </div>
      </section>

      {/* 10. BLOG SECTION — setara spotlight posts di home Indonesia (kartu English
          menautkan ke artikel asli yang masih berbahasa Indonesia) */}
      <BlogSection
        title={blog.title}
        posts={homeBlogContentEn.posts}
        seeAllText={homeBlogContentEn.seeAllText}
        readMoreText={homeBlogContentEn.readMoreText}
      />
    </main>
  );
}
