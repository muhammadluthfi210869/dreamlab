"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getProductDataV2 } from "@/data/products-v2";
import ProductGrid from "@/components/ProductPageV2/ProductGrid";
import { homepageData } from "@/data/homepage";
import { aboutData } from "@/data/about-us";
import { 
  FlaskConical, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Award, 
  PackageCheck, 
  Headphones 
} from "lucide-react";

// Dynamically import homepage blocks
const LogoScroll = dynamic(() => import("@/components/LogoScroll"), { 
  ssr: true,
  loading: () => <div className="py-20 bg-[#FAF9F6]" />
});

const ProductProcess = dynamic(() => import("@/components/ProductPageV2/ProductProcess"), {
  ssr: true,
  loading: () => <div className="py-20 bg-[#FAF9F6]" />
});

const premiumEase = [0.16, 1, 0.3, 1] as any;

export default function MaklonParfumAdsLP() {
  const parfumData = getProductDataV2("parfum");

  return (
    <div className="landing-page-ads min-h-screen bg-[#FAF9F6] text-brand-black font-sans selection:bg-brand-orange selection:text-white">

      {/* 1. HERO SECTION (Homepage Layout Style) */}
      <section className="relative w-full min-h-screen overflow-hidden flex items-center pt-24 lg:pt-0 bg-[#FAF9F6]">
        {/* Background Visual Image (Full Screen) */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src="/new asset/landing page/parfum.png"
            alt="Dreamlab Indonesia Premium Parfum Hero Visual"
            fill
            priority
            fetchPriority="high"
            decoding="sync"
            className="object-cover object-[82%_center] md:object-center"
            sizes="100vw"
          />
          {/* Gradient overlay to blend background image and keep text readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6]/95 via-[#FAF9F6]/80 to-[#FAF9F6]/15 md:from-[#FAF9F6]/92 md:via-[#FAF9F6]/65 md:to-transparent" />
        </div>

        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-brand-orange/[0.02] blur-[120px] rounded-full pointer-events-none z-10" />

        <div className="container-custom relative z-20 w-full py-16 md:py-24 lg:py-32 flex items-center">
          <div className="max-w-xl md:max-w-2xl lg:max-w-3xl text-left space-y-6 md:space-y-8">

            <div className="hero-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-brand-orange/5 border border-brand-orange/15 rounded-full backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                <span className="text-[10px] md:text-xs font-bold tracking-widest text-brand-orange uppercase font-onest">
                  Dreamlab #JUARAFORMULA
                </span>
              </div>
            </div>

            <h1 className="hero-fade-in" style={{ animationDelay: "0.35s" }}>
              <span className="block text-brand-orange text-[36px] sm:text-[48px] md:text-[62px] lg:text-[72px] xl:text-[80px] font-black leading-[1.05] tracking-tight max-w-[740px] uppercase font-display">
                Mau Buat
              </span>
              <span className="block text-brand-orange italic font-black text-[36px] sm:text-[48px] md:text-[62px] lg:text-[72px] xl:text-[80px] leading-[1.05] tracking-tight max-w-[740px] uppercase font-display">
                Parfum
              </span>
              <span className="block text-brand-black text-[36px] sm:text-[48px] md:text-[62px] lg:text-[72px] xl:text-[80px] font-black leading-[1.05] tracking-tight max-w-[740px] uppercase font-display">
                Custom?
              </span>
            </h1>

            <div className="hero-fade-in" style={{ animationDelay: "0.5s" }}>
              <p className="text-neutral-500 text-sm md:text-base leading-relaxed max-w-xl font-medium font-sans">
                Wujudkan aroma signature milik brand Anda sendiri.
              </p>
            </div>

            <div className="hero-fade-in" style={{ animationDelay: "0.65s" }}>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="/ads/thankyou/google/?source=googleads-parfum"
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand-orange hover:bg-brand-black text-white font-extrabold py-4 px-8 rounded-full transition-all duration-300 shadow-[0_15px_30px_rgba(243,146,0,0.2)] hover:-translate-y-1 text-xs md:text-sm"
                >
                  {/* WhatsApp SVG Icon */}
                  <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.019-5.117-2.875-6.976C16.592 1.899 14.116.88 11.986.88 6.548.88 2.122 5.3 2.119 10.74c-.002 1.706.452 3.37 1.312 4.848l-.994 3.629 3.73-.973zm11.366-6.726c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                  </svg>
                  <span>KONSULTASI FORMULA GRATIS</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        <style>{`
          .hero-fade-in {
            opacity: 0;
            animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes heroFadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </section>

      {/* 1.5. TRANSITION BAR: 4 USP CARD (2x2 Grid on mobile, 4 Columns on desktop) */}
      <section className="relative z-30 -mt-12 md:-mt-16 mb-8 md:mb-12">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8, ease: premiumEase }}
            className="bg-white rounded-3xl p-6 md:p-8 lg:py-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-neutral-100/80 w-full"
          >
            {/* 2x2 grid on mobile (grid-cols-2) and 4-column row on desktop (lg:grid-cols-4) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-x-0 lg:divide-x divide-neutral-100">
              
              {/* USP 1 */}
              <div className="flex flex-col items-center text-center px-2 py-2 lg:px-6">
                <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-3">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <h3 className="text-[13px] md:text-sm font-extrabold text-brand-black uppercase tracking-wider mb-1 font-display">
                  1 Klien 1 Formula
                </h3>
                <p className="text-[11px] md:text-xs text-neutral-500 font-medium font-sans">
                  Diciptakan oleh RND Perfumery
                </p>
              </div>

              {/* USP 2 */}
              <div className="flex flex-col items-center text-center px-2 py-2 lg:px-6">
                <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-[13px] md:text-sm font-extrabold text-brand-black uppercase tracking-wider mb-1 font-display">
                  Buat Brand Hanya 3 Bulan
                </h3>
                <p className="text-[11px] md:text-xs text-neutral-500 font-medium font-sans">
                  Dari 0 sampai siap jual
                </p>
              </div>

              {/* USP 3 */}
              <div className="flex flex-col items-center text-center px-2 py-2 lg:px-6">
                <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-3">
                  <PackageCheck className="w-6 h-6" />
                </div>
                <h3 className="text-[13px] md:text-sm font-extrabold text-brand-black uppercase tracking-wider mb-1 font-display">
                  MOQ Fleksibel
                </h3>
                <p className="text-[11px] md:text-xs text-neutral-500 font-medium font-sans">
                  Mulai brand Anda tanpa ribet
                </p>
              </div>

              {/* USP 4 */}
              <div className="flex flex-col items-center text-center px-2 py-2 lg:px-6">
                <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-3">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="text-[13px] md:text-sm font-extrabold text-brand-black uppercase tracking-wider mb-1 font-display">
                  Konsultasi Gratis
                </h3>
                <p className="text-[11px] md:text-xs text-neutral-500 font-medium font-sans">
                  Diskusi konsep & aroma tanpa biaya
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SECTION 2: PRODUCT CATALOG / PRODUCT GRID */}
      {parfumData && (
        <ProductGrid products={parfumData.products} categorySlug={parfumData.slug} />
      )}

      {/* 2.5. SECTION 2.5: R&D DETAILS & MOQ SECTION (As Mocked in User Request Image) */}
      <section className="py-12 md:py-16 bg-[#FAF9F6] relative z-10">
        <div className="container-custom space-y-8 md:space-y-12">
          
          {/* Card 1: 1 KLIEN 1 FORMULA (Premium brand blue card) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: premiumEase }}
            className="bg-[#112b3e] border border-white/5 rounded-[32px] p-6 sm:p-8 lg:p-12 text-white shadow-xl relative overflow-hidden bg-gradient-to-br from-[#112b3e] via-[#112b3e] to-[#163a54] hover:border-brand-orange/20 transition-all duration-500"
          >
            {/* Glowing background shapes for premium look */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#0F67FF]/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              
              {/* Left Column: Lab Image with rounded corners */}
              <div className="lg:col-span-5 relative aspect-square w-full rounded-[24px] overflow-hidden shadow-2xl border border-white/5 group">
                <Image
                  src="/new asset/landing page/perfume_lab_rd.jpg"
                  alt="R&D Perfumery Laboratory"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 400px"
                />
              </div>

              {/* Right Column: Copywriting & 4 points list */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-[38px] lg:text-[44px] font-black uppercase leading-[1.08] tracking-tight font-display text-brand-orange">
                    1 KLIEN<br />
                    1 FORMULA
                  </h2>
                  <p className="text-neutral-300 text-sm md:text-base font-medium font-sans">
                    Diciptakan oleh R&amp;D Perfumery Expert
                  </p>
                </div>
                
                {/* Clean Visual Anchor Line */}
                <div className="w-20 h-1 bg-brand-orange rounded-full my-5" />

                <ul className="space-y-4">
                  {/* Item 1 */}
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full border border-brand-orange/30 flex items-center justify-center text-brand-orange shrink-0 bg-brand-orange/5">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                    <span className="text-neutral-200 text-sm md:text-base font-medium font-sans leading-relaxed">
                      Aroma eksklusif tidak dipakai brand lain
                    </span>
                  </li>
                  {/* Item 2 */}
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full border border-brand-orange/30 flex items-center justify-center text-brand-orange shrink-0 bg-brand-orange/5">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                    <span className="text-neutral-200 text-sm md:text-base font-medium font-sans leading-relaxed">
                      Dibuat khusus untuk karakter brand Anda
                    </span>
                  </li>
                  {/* Item 3 */}
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full border border-brand-orange/30 flex items-center justify-center text-brand-orange shrink-0 bg-brand-orange/5">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                    <span className="text-neutral-200 text-sm md:text-base font-medium font-sans leading-relaxed">
                      R&amp;D Perfumery Expert berpengalaman
                    </span>
                  </li>
                  {/* Item 4 */}
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full border border-brand-orange/30 flex items-center justify-center text-brand-orange shrink-0 bg-brand-orange/5">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                    <span className="text-neutral-200 text-sm md:text-base font-medium font-sans leading-relaxed">
                      Revisi sampai cocok
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Card 2: 3 Bulan & MOQ Fleksibel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: premiumEase }}
            className="bg-white rounded-[32px] p-6 sm:p-8 lg:p-12 border border-neutral-100 shadow-md w-full"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 lg:divide-x divide-neutral-200/80">
              
              {/* Left Column: Dari 0 Sampai Siap Jual */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 lg:pb-0 lg:pr-12">
                {/* Custom Stopwatch Graphic */}
                <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
                  {/* Custom SVG Circular Stopwatch Ring */}
                  <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" stroke="#FAF9F6" strokeWidth="8" fill="none" />
                    <circle cx="50" cy="50" r="44" stroke="#f39200" strokeWidth="8" fill="none" strokeDasharray="276" strokeDashoffset="90" strokeLinecap="round" />
                  </svg>
                  {/* Ticks or Notches */}
                  <div className="absolute top-1 w-1.5 h-3.5 bg-[#11253c] rounded-full" />
                  <div className="absolute right-1 w-3.5 h-1.5 bg-[#11253c] rounded-full" />
                  <div className="absolute left-1 w-3.5 h-1.5 bg-[#11253c] rounded-full" />
                  <div className="absolute bottom-1 w-1.5 h-3.5 bg-[#11253c] rounded-full" />
                  {/* Big Number 3 in Center */}
                  <span className="text-6xl font-black text-brand-orange font-display select-none">3</span>
                </div>

                <div className="space-y-2 text-center sm:text-left">
                  <h3 className="text-xl md:text-2xl font-black text-brand-black uppercase leading-tight font-display">
                    DARI 0<br />
                    SAMPAI SIAP<br />
                    JUAL
                  </h3>
                  <p className="text-brand-orange font-bold font-sans text-sm md:text-base">
                    Hanya 3 Bulan!
                  </p>
                </div>
              </div>

              {/* Right Column: MOQ Fleksibel */}
              <div className="flex flex-col items-center sm:items-start gap-4 pt-8 lg:pt-0 lg:pl-12 border-t lg:border-t-0 border-neutral-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#11253c] text-white flex items-center justify-center">
                    <PackageCheck className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-black text-[#11253c] uppercase leading-none font-display">
                      MOQ
                    </h3>
                    <h3 className="text-lg font-black text-brand-orange uppercase leading-none font-display mt-0.5">
                      FLEKSIBEL
                    </h3>
                  </div>
                </div>

                <p className="text-neutral-500 text-sm md:text-base font-semibold leading-relaxed max-w-sm text-center sm:text-left">
                  Mulai brand parfummu tanpa ribet stok besar.
                </p>

                <div className="w-full sm:w-auto pt-2 flex flex-col items-center sm:items-start gap-2">
                  <a
                    href="/ads/thankyou/google/?source=googleads-parfum"
                    className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-orange hover:bg-brand-black text-white font-extrabold py-3.5 px-8 rounded-full transition-all duration-300 shadow-[0_12px_24px_rgba(243,146,0,0.15)] hover:-translate-y-0.5 text-xs uppercase"
                  >
                    {/* WhatsApp Icon */}
                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>KONSULTASI GRATIS</span>
                  </a>
                  <span className="text-[10px] md:text-[11px] font-bold text-neutral-400 uppercase tracking-wider block text-center sm:text-left mt-1.5">
                    Wujudkan Parfum Signature Brand Anda Sekarang!
                  </span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* 2.6. LOGO SCROLL - DI PERCAYA 500+ BRAND */}
      <LogoScroll 
        logos={aboutData.partnerLogos} 
        headline={homepageData.trustedBrands.title}
        subHeadline={homepageData.trustedBrands.subtitle}
      />

      {/* 2.7. ALUR PROSES SECTION */}
      <ProductProcess />

      {/* 4. CLOSING CTA — Homepage style background visual */}
      <section className="relative w-full overflow-hidden bg-white min-h-[420px] sm:min-h-[480px] md:min-h-[500px] lg:min-h-[580px] flex items-center border-t border-b border-neutral-100">

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0 }}
          className="absolute inset-0 z-0 select-none pointer-events-none bg-white"
        >
          <Image
            src="/new asset/new-icon-packing-design/sampul-web-2.webp"
            alt="Dreamlab Cosmetics Showcase"
            fill
            unoptimized={true}
            priority={true}
            className="object-cover object-[78%_center] sm:object-[82%_center] md:object-[86%_center] lg:object-[88%_center] xl:object-[92%_center]"
          />
          <div className="absolute inset-y-0 left-0 w-[50%] bg-gradient-to-r from-white via-white/60 to-transparent z-10 hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/45 to-transparent md:hidden z-10" />
        </motion.div>

        <div className="container-custom relative z-20 w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full py-16 md:py-24">

            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-span-12 md:col-span-6 lg:col-span-6 text-left z-20 flex flex-col justify-center"
            >
              <h2 className="text-brand-black text-[28px] sm:text-[36px] md:text-[38px] lg:text-[46px] xl:text-[52px] font-display font-extrabold leading-[1.12] tracking-tight uppercase mb-4">
                Wujudkan Brand Parfum<br />
                Impian Anda<br />
                <span className="text-brand-orange">dalam 3 bulan</span>
              </h2>

              <p className="text-neutral-500 text-sm md:text-base leading-relaxed mb-6 font-sans max-w-lg">
                Pelanggan Anda tidak membutuhkan parfum yang pasaran. Mereka mencari aroma yang memiliki karakter, identitas, dan alasan untuk diingat.
              </p>

              <div className="rounded-2xl w-fit mt-2 flex flex-col items-start gap-3">
                <a
                  href="/ads/thankyou/google/?source=googleads-parfum"
                  className="inline-flex items-center justify-center bg-brand-orange hover:bg-[#D98200] hover:scale-[1.03] text-white px-8 py-4 rounded-2xl font-extrabold text-xs md:text-sm uppercase tracking-wider transition-all duration-300 shadow-xl shadow-brand-orange/15 w-fit"
                >
                  <span>FREE KONSULTASI BISNIS</span>
                </a>

                {/* Polished Points Row with check circle icons */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs font-bold text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-brand-orange shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>Respon Cepat</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-brand-orange shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>Tanpa Kewajiban</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-brand-orange shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>100% Gratis</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="hidden md:block md:col-span-6 lg:col-span-6 h-full" />

          </div>
        </div>
      </section>

      {/* FLOATING WA BUTTON */}
      <a
        href="/ads/thankyou/google/?source=googleads-parfum"
        className="fixed bottom-6 right-6 z-50 bg-[#25d366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
        aria-label="Contact via WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
        <span className="absolute right-full mr-4 bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-bold shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">Chat with us!</span>
      </a>

    </div>
  );
}
