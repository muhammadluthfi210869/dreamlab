"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Package,
  Users,
  FlaskConical,
  DollarSign,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Palette,
  Star,
  Repeat,
  Sparkles,
} from "lucide-react";
import { useMetaAdsCtaPixel } from "@/lib/meta-ads-pixel";
import { AdsCredibilitySection } from "@/components/landing-pages/AdsCredibilitySection";
import { FloatingWhatsAppCTA } from "@/components/FloatingWhatsAppCTA";

const THANKYOU_URL = "/ads/thankyou/metaads/?p=meta-bof";

const partnerBrands = [
  { name: "Sense Soul", logo: "/assets/images/Sense-Soul-300x300.webp" },
  { name: "Tazzi", logo: "/assets/images/Tazzi-300x300.webp" },
  { name: "Jilly Daily", logo: "/assets/images/Jilly-Daily-300x300.webp" },
  { name: "Labbol", logo: "/assets/images/Labbol-300x300.webp" },
  { name: "Itnob", logo: "/assets/images/Itnob-300x300.webp" },
  { name: "Bebiboster", logo: "/assets/images/Bebiboster-300x300.webp" },
  { name: "Chloe Green", logo: "/assets/images/1-300x300.webp" },
];

// 3 POIN SINGKAT TANPA PENJELASAN PANJANG
const potensiPoints = [
  {
    icon: DollarSign,
    metric: "60% – 80%",
    title: "Margin Profit Tebal per Produk",
    tag: "High Margin",
  },
  {
    icon: TrendingUp,
    metric: "Rp 158+ Triliun",
    title: "Nilai Pasar Kosmetik Indonesia",
    tag: "Terus Tumbuh",
  },
  {
    icon: Repeat,
    metric: "85% Repeat",
    title: "Produk Habis Pakai Bulanan",
    tag: "Order Berulang",
  },
];

// POIN SINGKAT TANPA PENJELASAN PANJANG (DI BAWAH PRODUK DISPLAY)
const partnerAdvantages = [
  {
    title: "1 Klien 1 Formula Eksklusif",
    icon: FlaskConical,
  },
  {
    title: "Gratis Izin BPOM, Halal & HKI",
    icon: ShieldCheck,
  },
  {
    title: "MOQ Fleksibel & Ramah Modal",
    icon: Package,
  },
  {
    title: "Free Desain Logo & Kemasan 3D",
    icon: Palette,
  },
  {
    title: "HPP Transparan Sejak Awal",
    icon: DollarSign,
  },
  {
    title: "Full Support R&D & Marketing",
    icon: Users,
  },
];

const catalogSlides = [
  {
    id: "skincare",
    title: "Skincare & Face Care",
    tag: "Best Seller",
    products: "Serum, Moisturizer, Sunscreen SPF 50+, Toner & Cleanser",
    image: "/new asset/landing page/skincare.webp",
  },
  {
    id: "personalcare",
    title: "Personal Care",
    tag: "Repeat Tinggi",
    products: "Body Wash, Deodorant Roll-On & Spray, Hand Wash",
    image: "/new asset/bodycare/body-wash.webp",
  },
  {
    id: "babycare",
    title: "Baby Care",
    tag: "Hypoallergenic",
    products: "Baby Hair & Body Wash, Baby Lotion, Calming Baby Oil",
    image: "/new asset/baby-care/baby-wash.webp",
  },
  {
    id: "haircare",
    title: "Hair Care",
    tag: "Standar Salon",
    products: "Keratin Shampoo, Hair Tonic & Serum, Hair Mask",
    image: "/new asset/haircare/shampoo.webp",
  },
  {
    id: "mensgrooming",
    title: "Men's Grooming",
    tag: "Pasar Pria",
    products: "Pomade, Beard Serum, Men's Charcoal Facial Wash",
    image: "/new asset/haircare/pomade.webp",
  },
  {
    id: "parfum",
    title: "Parfum & Fragrance",
    tag: "Margin Tebal",
    products: "Extrait de Parfum, Eau de Parfum (EDP) & Body Mist",
    image: "/new asset/landing page/parfum.webp",
  },
  {
    id: "bodycare",
    title: "Body Care",
    tag: "Volume Tinggi",
    products: "Whitening Body Serum, Body Butter, Scrub & Underarm Cream",
    image: "/new asset/bodycare/body-butter.webp",
  },
  {
    id: "lipcare",
    title: "Lip Care",
    tag: "Tren Viral",
    products: "Peptide Lip Serum, Tinted Lip Oil, Lip Butter & Lip Cream",
    image: "/assets/images/blog/kemasan_lip_serum_ceramic_tip_dreamlab.jpg",
  },
];

const communityImages = [
  {
    src: "/assets/images/blog/beautypreneur-batch-2-dreamlab-sharing-session.jpg",
    badge: "SHARING SESSION",
    title: "Mentoring & Strategi Brand",
  },
  {
    src: "/assets/images/blog/beautypreneur-batch-2-dreamlab-bangun-brand.jpg",
    badge: "WORKSHOP EKSLUSIF",
    title: "Bangun Brand Bersama Partner",
  },
  {
    src: "/assets/images/blog/maklon-parfum-after-sales-beauty-academy.webp",
    badge: "BEAUTY ACADEMY",
    title: "Networking Ratusan Brand Owner",
  },
];

export default function MetaAdsBofLandingPage() {
  useMetaAdsCtaPixel("Meta Ads BOF");

  const catalogSliderRef = useRef<HTMLDivElement>(null);
  const [activeCatalogSlide, setActiveCatalogSlide] = useState(0);

  const communitySliderRef = useRef<HTMLDivElement>(null);
  const [activeCommunitySlide, setActiveCommunitySlide] = useState(0);

  const scrollSlider = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right"
  ) => {
    if (!ref.current) return;
    const cardWidth = ref.current.firstElementChild?.clientWidth || 300;
    const scrollAmount = direction === "left" ? -(cardWidth + 16) : cardWidth + 16;
    ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const scrollToIndex = (
    ref: React.RefObject<HTMLDivElement | null>,
    index: number,
    setActive: (idx: number) => void
  ) => {
    if (!ref.current) return;
    const cardWidth = ref.current.firstElementChild?.clientWidth || 300;
    ref.current.scrollTo({ left: index * (cardWidth + 16), behavior: "smooth" });
    setActive(index);
  };

  const handleScroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    total: number,
    setActive: (idx: number) => void
  ) => {
    if (!ref.current) return;
    const scrollLeft = ref.current.scrollLeft;
    const cardWidth = ref.current.firstElementChild?.clientWidth || 300;
    const index = Math.round(scrollLeft / (cardWidth + 16));
    setActive(Math.min(Math.max(index, 0), total - 1));
  };

  const marqueeBrands = [...partnerBrands, ...partnerBrands, ...partnerBrands];

  return (
    <div className="landing-page-ads min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#FAF9F6] text-neutral-900 font-sans selection:bg-brand-orange selection:text-white">
      {/* Pure CSS Keyframes for Continuous Running Logo Marquee */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes dreamlabMarquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.3333%, 0, 0); }
        }
        .dreamlab-marquee-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: dreamlabMarquee 22s linear infinite !important;
          will-change: transform;
        }
        .dreamlab-marquee-track:hover {
          animation-play-state: paused !important;
        }
      `}} />

      {/* ============ 1. HERO SECTION: GAMBAR BOTOL DI ATAS, COPYWRITING DI BAWAH (TIDAK MENUTUPI BOTOL) ============ */}
      <section className="relative w-full min-h-[640px] sm:min-h-[660px] lg:min-h-[700px] flex flex-col justify-between overflow-hidden bg-[#D5E5F4]">
        {/* Full-Bleed Skincare Background Visual */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src="/new asset/background-visual-hero-section/home-page.webp"
            alt="Dreamlab Skincare & Cosmetic Manufacturing"
            fill
            priority
            unoptimized
            className="object-cover object-[84%_12%] sm:object-[80%_center] lg:object-right"
            sizes="100vw"
          />
          {/* Mobile: Top 45% is 100% clear so the bottles shine at the top; Bottom 55% fades smoothly into white so the headline sits cleanly below! */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_0%,rgba(255,255,255,0.12)_32%,rgba(255,255,255,0.88)_54%,rgba(255,255,255,0.98)_76%,#FAF9F6_100%)] lg:bg-[linear-gradient(to_right,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.84)_42%,rgba(255,255,255,0.15)_75%,transparent_100%)]" />
        </div>

        {/* Top Minimal Brand Bar */}
        <div className="container-custom w-full px-4 pt-5 sm:pt-7 relative z-10 flex items-center justify-between">
          <Image
            src="/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik-.webp"
            alt="Dreamlab Maklon Kosmetik"
            width={135}
            height={44}
            unoptimized
            className="h-8 sm:h-10 w-auto object-contain drop-shadow-xs"
            priority
          />
        </div>

        {/* Hero Copy Block — Positioned Lower on Mobile (pt-56) so Bottles Remain Unobstructed Above */}
        <div className="container-custom w-full px-4 pt-56 pb-10 sm:pt-28 sm:pb-16 lg:py-24 relative z-10 mt-auto lg:my-auto">
          {/* Soft Dreamlab Blue & Orange Glow Behind Headline */}
          <div
            className="absolute -inset-x-4 top-44 bottom-4 lg:top-8 lg:w-[540px] pointer-events-none -z-10 blur-[65px] opacity-40"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(72,152,211,0.45) 0%, rgba(243,146,0,0.35) 70%, transparent 100%)",
            }}
          />

          <div className="w-full max-w-xl lg:max-w-2xl mx-auto lg:mx-0 text-center lg:text-left space-y-3.5">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/25 text-brand-orange backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase">
                DREAMLAB #JUARANYAFORMULA
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[28px] sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.08] uppercase text-neutral-900 font-display">
              INGIN WUJUDKAN BRAND IMPIAN?{" "}
              <span className="text-brand-orange block mt-1">
                DREAMLAB PILIHAN YANG TEPAT
              </span>
            </h1>

            {/* Subheadline */}
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/90 border border-neutral-200/90 shadow-2xs text-xs sm:text-base font-extrabold uppercase tracking-wider text-neutral-800">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                <span>Buat Brand Tanpa Ribet Hanya 3 Bulan</span>
              </span>
            </div>

            {/* Primary CTA Button */}
            <div className="pt-3">
              <a
                href={THANKYOU_URL}
                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-9 py-4 bg-brand-orange text-white rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_14px_30px_rgba(243,146,0,0.35)] hover:bg-neutral-900 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0" />
                <span>Klaim Sampel & Cek HPP Gratis</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. KEUNTUNGAN BERPARTNER DENGAN DREAMLAB (DI ATAS PRODUK DISPLAY, POIN RINGKAS) ============ */}
      <section className="py-10 sm:py-14 bg-[#FAF9F6]">
        <div className="container-custom px-4">
          <div className="text-center mb-6 sm:mb-8">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.22em] text-brand-orange block mb-1">
              MENGAPA DREAMLAB
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 uppercase font-display tracking-tight">
              Keuntungan Berpartner dengan Dreamlab
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {partnerAdvantages.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-[0_6px_20px_rgba(0,0,0,0.03)]"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-neutral-900 leading-snug">
                    {adv.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ 3. PRODUK DISPLAY / KATALOG PRODUK (SLIDE KESAMPING - FULL VISUAL CARD) ============ */}
      <section className="py-10 sm:py-14 bg-white border-y border-neutral-200/60 overflow-hidden">
        <div className="container-custom px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between max-w-5xl mx-auto mb-6 gap-3">
            <div className="text-center sm:text-left">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.22em] text-brand-orange block mb-1">
                PILIH KATEGORI PRODUK
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 uppercase font-display tracking-tight">
                Produk Apa yang Ingin Anda Ciptakan?
              </h2>
            </div>

            {/* Slider Arrow Buttons */}
            <div className="flex items-center justify-center sm:justify-end gap-2">
              <button
                type="button"
                onClick={() => scrollSlider(catalogSliderRef, "left")}
                aria-label="Sebelumnya"
                className="w-9 h-9 rounded-full border border-neutral-300 bg-white flex items-center justify-center text-neutral-700 hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollSlider(catalogSliderRef, "right")}
                aria-label="Selanjutnya"
                className="w-9 h-9 rounded-full border border-neutral-300 bg-white flex items-center justify-center text-neutral-700 hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Swipeable Luxury Visual Product Cards */}
          <div
            ref={catalogSliderRef}
            onScroll={() =>
              handleScroll(
                catalogSliderRef,
                catalogSlides.length,
                setActiveCatalogSlide
              )
            }
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 max-w-5xl mx-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {catalogSlides.map((cat) => (
              <a
                key={cat.id}
                href={THANKYOU_URL}
                className="group snap-center shrink-0 w-[76vw] sm:w-[270px] md:w-[290px] relative aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-900 shadow-[0_12px_30px_rgba(0,0,0,0.10)] border border-neutral-200/80 block"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  unoptimized
                  loading="eager"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 76vw, 290px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 via-45% to-transparent" />

                <div className="absolute top-3.5 left-3.5">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-brand-orange shadow-xs">
                    {cat.tag}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 text-white space-y-2">
                  <h3 className="text-lg sm:text-xl font-black uppercase font-display tracking-wide text-white drop-shadow-xs">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-white/85 leading-relaxed line-clamp-2">
                    {cat.products}
                  </p>
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-orange text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                      <span>Klaim Sampel Ini</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {catalogSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() =>
                  scrollToIndex(catalogSliderRef, i, setActiveCatalogSlide)
                }
                aria-label={`Produk ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeCatalogSlide === i ? "w-6 bg-brand-orange" : "w-2 bg-neutral-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ 4. POTENSI BISNIS KOSMETIK SAAT INI (DI BAWAH PRODUK DISPLAY, 3 POIN RINGKAS) ============ */}
      <section className="py-10 sm:py-14 bg-[#FAF9F6] border-b border-neutral-200/60">
        <div className="container-custom px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-[0_16px_45px_rgba(0,0,0,0.05)]">
            <div className="text-center mb-6">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.22em] text-brand-orange block mb-1">
                PELUANG BISNIS KECANTIKAN
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 uppercase font-display tracking-tight">
                Potensi Bisnis Kosmetik Saat Ini
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 sm:divide-x divide-neutral-200/80">
              {potensiPoints.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2 p-3.5 sm:px-6 rounded-2xl sm:rounded-none bg-[#FAF9F6] sm:bg-transparent border sm:border-0 border-neutral-200/70"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="inline-block text-[10px] font-black uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-md mb-1">
                        {item.tag}
                      </span>
                      <span className="block text-xl sm:text-2xl font-black text-neutral-900 font-display leading-none">
                        {item.metric}
                      </span>
                      <span className="block text-xs sm:text-sm font-bold text-neutral-600 mt-1">
                        {item.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 5. AKSES COMMUNITY BRAND OWNER (BENTUK SLIDE KESAMPING) ============ */}
      <section className="py-10 sm:py-14 bg-white border-b border-neutral-200/60 overflow-hidden">
        <div className="container-custom px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between max-w-5xl mx-auto mb-6 gap-3">
            <div className="text-center sm:text-left">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.22em] text-brand-orange block mb-1">
                DREAMLAB BEAUTY ACADEMY
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 uppercase font-display tracking-tight">
                Akses Community Brand Owner
              </h2>
            </div>

            {/* Slider Arrow Buttons */}
            <div className="flex items-center justify-center sm:justify-end gap-2">
              <button
                type="button"
                onClick={() => scrollSlider(communitySliderRef, "left")}
                aria-label="Sebelumnya"
                className="w-9 h-9 rounded-full border border-neutral-300 bg-white flex items-center justify-center text-neutral-700 hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollSlider(communitySliderRef, "right")}
                aria-label="Selanjutnya"
                className="w-9 h-9 rounded-full border border-neutral-300 bg-white flex items-center justify-center text-neutral-700 hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Swipeable Community Photos */}
          <div
            ref={communitySliderRef}
            onScroll={() =>
              handleScroll(
                communitySliderRef,
                communityImages.length,
                setActiveCommunitySlide
              )
            }
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 max-w-5xl mx-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {communityImages.map((img, i) => (
              <div
                key={i}
                className="snap-center shrink-0 w-[82vw] sm:w-[320px] md:w-[340px] bg-white rounded-3xl overflow-hidden border border-neutral-200/90 shadow-[0_10px_25px_rgba(0,0,0,0.06)]"
              >
                <div className="relative h-56 sm:h-60 w-full bg-neutral-100 overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    unoptimized
                    loading="eager"
                    className="object-cover"
                    sizes="(max-width: 640px) 82vw, 340px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-3 py-1 rounded-full bg-brand-orange text-white text-[10px] font-black uppercase tracking-wider">
                      {img.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-base sm:text-lg font-black text-white uppercase font-display">
                      {img.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-1">
            {communityImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() =>
                  scrollToIndex(communitySliderRef, i, setActiveCommunitySlide)
                }
                aria-label={`Slide Komunitas ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeCommunitySlide === i ? "w-6 bg-brand-orange" : "w-2 bg-neutral-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ 6. LOGO PARTNER DREAMLAB BERJALAN DINAMIS (TANPA KOTAK, UKURAN BESAR & JELAS) ============ */}
      <section className="py-10 sm:py-14 bg-white border-b border-neutral-100 overflow-hidden">
        <div className="container-custom px-4 mb-4 text-center">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-brand-orange block mb-1">
            PORTFOLIO KLIEN KAMI
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-neutral-900 font-display">
            Brand yang Pernah Diproduksi di Dreamlab
          </h2>
        </div>

        <div className="relative w-full overflow-hidden py-2">
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          <div className="dreamlab-marquee-track gap-8 sm:gap-14 md:gap-20 px-4">
            {marqueeBrands.map((brand, i) => (
              <div
                key={`partner-logo-${i}`}
                className="relative h-32 sm:h-40 md:h-44 w-40 sm:w-52 md:w-60 shrink-0 flex items-center justify-center"
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  unoptimized
                  loading="eager"
                  className="object-contain"
                  sizes="(max-width: 640px) 160px, 240px"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-2 px-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold text-neutral-700 bg-[#FAF8F5] px-4 py-1.5 rounded-full border border-neutral-200">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            500+ Brand Telah Sukses Rilis Bersama Dreamlab
          </span>
        </div>
      </section>

      {/* ============ 7. LEGALITAS & SERTIFIKASI PABRIK ============ */}
      <AdsCredibilitySection channel="metaads" />

      {/* ============ 8. FINAL CTA BANNER ============ */}
      <section className="py-12 sm:py-16 bg-[#FFF8EE] border-t border-neutral-200/70">
        <div className="container-custom px-4 text-center space-y-4 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black uppercase font-display tracking-tight leading-tight text-neutral-900">
            Siap Wujudkan Brand Impian{" "}
            <span className="text-brand-orange">Hanya Dalam 3 Bulan?</span>
          </h2>

          <div className="pt-1">
            <a
              href={THANKYOU_URL}
              className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-9 py-4 bg-brand-orange text-white rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-neutral-900 transition-all shadow-[0_12px_28px_rgba(243,146,0,0.3)] active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current shrink-0" />
              <span>Klaim Sampel & Cek HPP di WhatsApp</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>
      </section>

      {/* ============ 9. FLOATING WHATSAPP POPUP CTA ============ */}
      <FloatingWhatsAppCTA
        label="Konsultasi WhatsApp"
        onClick={() => {
          window.location.href = THANKYOU_URL;
        }}
      />
    </div>
  );
}
