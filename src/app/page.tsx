import { homepageData } from "@/data/homepage";
import { aboutData } from "@/data/about-us";
import { articles } from "@/data/articles";
import { Metadata } from "next";
import Link from "next/link";
import { getSEOData } from "@/lib/seo-service";
import { getMetaKeywords } from "@/data/keywords";
import dynamic from "next/dynamic";
import { resolveArticleImageSrc } from "@/lib/asset-paths";

const LogoScroll = dynamic(() => import("@/components/LogoScroll"), { 
  ssr: true,
  loading: () => <div className="py-20 bg-[#FAF9F6]" />
});

const PremiumHero = dynamic(() => import("@/components/PremiumHero"), { 
  ssr: true,
  loading: () => <div className="h-screen bg-[#F1E9DA]" />
});
const ProductTrustBar = dynamic(() => import("@/components/ProductPageV2/ProductTrustBar"), { 
  ssr: true,
  loading: () => <div className="py-8 bg-white" />
});
const AdvantagesGrid = dynamic(() => import("@/components/AdvantagesGrid"), { 
  ssr: true,
  loading: () => <div className="py-20 bg-gray-50" />
});
const OurCertification = dynamic(() => import("@/components/OurCertification"), { 
  ssr: true,
  loading: () => <div className="py-20 bg-white" />
});
const KatalogProduk = dynamic(() => import("@/components/KatalogProduk"), { 
  ssr: true,
  loading: () => <div className="py-16 bg-white" />
});
const BrandShowcaseSection = dynamic(() => import("@/components/BrandShowcaseSection"), { 
  ssr: true,
  loading: () => <div className="py-20 bg-white" />
});
const Testimonials = dynamic(() => import("@/components/Testimonials"), { 
  ssr: true,
  loading: () => <div className="py-16 bg-gray-50" />
});
const FaqHome = dynamic(() => import("@/components/FaqHome"), { 
  ssr: true,
  loading: () => <div className="py-20 bg-white" />
});
const CtaSection = dynamic(() => import("@/components/CtaSection"), { 
  ssr: true,
  loading: () => <div className="py-16 bg-brand-orange" />
});
const MediaCoverage = dynamic(() => import("@/components/MediaCoverage"), { 
  ssr: true,
  loading: () => <div className="py-16 bg-white" />
});
const BlogSection = dynamic(() => import("@/components/BlogSection"), { 
  ssr: true,
  loading: () => <div className="py-16 bg-gray-50" />
});

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSEOData("/");

  return {
    title: seoData?.meta_title
      ? { absolute: seoData.meta_title }
      : { absolute: "Dreamlab | Maklon Kosmetik & Parfum BPOM Terbaik - Wujudkan Brand Impian Anda" },
    description: seoData?.meta_description || "One-Stop Maklon Kosmetik Bersertifikat BPOM, CPKB Grade A & Halal MUI di Surabaya. 500+ Brand Sudah Mempercayakan Formulasi & Produksinya pada Kami.",
    keywords: getMetaKeywords(''),
    alternates: {
      canonical: seoData?.canonical || "https://dreamlab.id/",
    },
  };
}

export default function Home() {
  const { hero, trustedBrands, advantages, katalog, testimonials, blog } = homepageData;
  const priorityBlogSlugs = new Set([
    "/biaya-maklon-parfum-moq-kecil",
    "/bisnis-skincare-glow-glasskin-cystamine",
  ]);
  const spotlightPosts = articles
    .filter((article) => priorityBlogSlugs.has(article.slug))
    .slice(0, 3)
    .map((article) => ({
      title: article.title,
      date: article.publishDate,
      category: article.categories?.[0] || "Artikel",
      image: article.featuredImage
        ? resolveArticleImageSrc(article.featuredImage)
        : "/assets/images/blog/artikel-cta.png",
      excerpt: article.excerpt,
      link: `${article.slug.replace(/\/?$/, "/")}`,
    }));

  return (
    <main className="min-h-screen bg-brand-white">
      {/* 1. HERO SECTION (Plek Ketiplek Content) */}
      <PremiumHero 
        smallTitle={hero.smallTitle}
        title={hero.title}
        subtitle={hero.subtitle}
        ctaText={hero.ctaText}
        ctaLink={hero.ctaLink}
        backgroundImage={hero.backgroundImage}
      />

      {/* 1.5. TRUST BAR SECTION */}
      <ProductTrustBar />

      {/* 2. KATALOG PRODUK (Moved to Section 2 as requested) */}
      <KatalogProduk 
        title={katalog.title}
        categories={katalog.categories}
      />

      {/* 2.3. BRAND SHOWCASE SECTION (Sunscreen Highlight) */}
      <BrandShowcaseSection />

      {/* 2.5. DI PERCAYA 150+ BRAND (LOGO SCROLL - BERWARNA) */}
      <LogoScroll 
        logos={aboutData.partnerLogos} 
        headline={trustedBrands.title}
        subHeadline={trustedBrands.subtitle}
      />



      {/* 5. 8 KEUNTUNGAN (Slider Otomatis) */}
      <AdvantagesGrid 
        title={advantages.title}
        items={advantages.items}
      />

      {/* 5.5. SERTIFIKASI RESMI TERPERCAYA (Our Certification Section) */}
      <OurCertification />

      {/* 6. TESTIMONIALS */}
      {/* TODO: Re-enable testimonials slider when content is ready */}
      {/* <Testimonials
        title={testimonials.title}
        items={testimonials.items}
      /> */}

      {/* 7. CTA SECTION (Siap Wujudkan Brand Impian?) */}
      <CtaSection />

      {/* 7.5. LIPUTAN MEDIA */}
      <MediaCoverage 
        title={homepageData.media.title} 
        logos={homepageData.media.logos} 
      />

      {/* 6.8. GENERAL TRUST FAQ */}
      <FaqHome />

      <section className="bg-[#fff8ef] px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-[#eadfcf] bg-white p-8 text-center shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-10">
          <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">Panduan Batch 1</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-[#1f1f1d] sm:text-4xl">
            Butuh jalur yang lebih rapi untuk membaca biaya dan MOQ?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
            Buka hub panduan Dreamlab untuk membaca 2 artikel pilot dan 2 money page yang disusun khusus untuk intent buyer, estimasi, dan validasi MOQ.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/panduan/"
              className="inline-flex items-center justify-center rounded-full bg-[#D98A00] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#D98A00]/20 transition hover:translate-y-[-1px] hover:bg-[#c97e00]"
            >
              Buka Hub Panduan
            </Link>
          </div>
        </div>
      </section>

      {/* 10. BLOG SECTION */}
      <BlogSection 
        title={blog.title}
        posts={spotlightPosts.length > 0 ? spotlightPosts : blog.posts}
      />
    </main>
  );
}
