"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Package, 
  Award, 
  CheckCircle2, 
  Users, 
  FlaskConical, 
  DollarSign, 
  ShoppingBag, 
  MessageCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Palette,
  Star
} from "lucide-react";
import { useMetaAdsCtaPixel } from "@/lib/meta-ads-pixel";
import { AdsCredibilitySection } from "@/components/landing-pages/AdsCredibilitySection";

const THANKYOU_URL = "/ads/thankyou/metaads/?p=meta-mof";

const partnerBrands = [
  { name: "Sense Soul", logo: "/assets/images/Sense-Soul-300x300.webp" },
  { name: "Tazzi", logo: "/assets/images/Tazzi-300x300.webp" },
  { name: "Jilly Daily", logo: "/assets/images/Jilly-Daily-300x300.webp" },
  { name: "Labbol", logo: "/assets/images/Labbol-300x300.webp" },
  { name: "Itnob", logo: "/assets/images/Itnob-300x300.webp" },
  { name: "Bebiboster", logo: "/assets/images/Bebiboster-300x300.webp" },
];

const marketPotentials = [
  {
    icon: DollarSign,
    badge: "MARGIN 60% – 80%",
    title: "Margin Keuntungan Tebal",
    desc: "HPP produksi efisien memungkinkan Anda menentukan harga jual dengan margin profit sehat untuk budget iklan & endorse.",
  },
  {
    icon: TrendingUp,
    badge: "PASAR RATUSAN TRILIUN",
    title: "Pasar Terus Tumbuh",
    desc: "Industri kecantikan Indonesia naik 10%+ per tahun didorong fenomena local pride dan kebutuhan perawatan diri harian.",
  },
  {
    icon: ShoppingBag,
    badge: "VIRAL SOCIAL COMMERCE",
    title: "Laris Tanpa Toko Fisik",
    desc: "Manfaatkan kekuatan live TikTok & affiliate marketing. Brand baru bisa langsung tembus ribuan order sejak peluncuran pertama.",
  },
  {
    icon: ShieldCheck,
    badge: "NOL RESIKO PABRIK",
    title: "Tanpa Modal Mesin & Lab",
    desc: "Tidak perlu modal miliaran untuk bangun pabrik sendiri. Dreamlab bertindak sebagai fasilitas R&D dan pabrik maklon privat Anda.",
  },
];

const catalogSlides = [
  {
    id: "skincare",
    title: "Skincare & Face Care",
    tag: "Kategori Paling Laris",
    badgeColor: "bg-amber-500",
    desc: "Formula aktif pencerah, barrier repair, dan perlindungan sinar UV dengan tekstur ringan cepat meresap.",
    items: [
      "Brightening Serum (SymWhite 377 / PDRN)",
      "Ceramide Barrier Repair Moisturizer",
      "Airy Glow Finish Sunscreen SPF 50+",
      "Low pH Gentle Facial Wash & Toner"
    ],
    activeIngredients: "SymWhite 377, Ceramide Complex, PDRN, Centella",
    image: "/new asset/landing page/skincare.webp",
  },
  {
    id: "parfum",
    title: "Parfum & Luxury Fragrance",
    tag: "Margin Paling Tebal",
    badgeColor: "bg-purple-600",
    desc: "Eau de Parfum (EDP) & Extrait de Parfum dengan ketahanan 8–12 jam+. Karakter aroma mewah setara desainer.",
    items: [
      "Extrait de Parfum (Konsentrasi Bibit Tinggi)",
      "Eau de Parfum (EDP) Karakter Mewah",
      "Hair & Body Fragrance Mist",
      "Relaxing Linen & Pillow Spray"
    ],
    activeIngredients: "Bibit parfum impor Eropa, alcohol denat grade kosmetik",
    image: "/new asset/landing page/parfum.webp",
  },
  {
    id: "bodycare",
    title: "Body Care & Underarm",
    tag: "Volume Penjualan Cepat",
    badgeColor: "bg-emerald-600",
    desc: "Rangkaian perawatan badan mencerahkan, melembutkan, dan memberikan wangi parfum mewah sepanjang hari.",
    items: [
      "Tone-Up Glowing Body Serum",
      "Brightening Underarm Deo Serum",
      "Aromatherapy Perfumed Body Wash",
      "Exfoliating Brightening Body Scrub"
    ],
    activeIngredients: "Glutathione, Niacinamide, Shea Butter, AHA/BHA",
    image: "/new asset/landing page/LP_MAKLON_KOSMETIK_DREAMLAB.png",
  },
  {
    id: "haircare",
    title: "Hair Care & Scalp Treatment",
    tag: "Tren Niche Meledak",
    badgeColor: "bg-blue-600",
    desc: "Solusi rambut rontok, lepek, dan ketombe dengan bahan aktif modern yang terbukti secara klinis.",
    items: [
      "Anti-Hairfall Scalp Tonic Booster",
      "Hair Growth Stimulating Serum",
      "Keratin Treatment Hair Mask",
      "Lightweight Hair Perfume Oil"
    ],
    activeIngredients: "Redensyl, Biotin, Keratin Complex, Rosemary Extract",
    image: "/new asset/landing page/haircare.png",
  },
  {
    id: "lipcare",
    title: "Lip Care & Color Cosmetic",
    tag: "Produk Viral TikTok",
    badgeColor: "bg-pink-600",
    desc: "Pewarna dan nutrisi bibir dengan formula nyaman, tidak lengket, dan memberikan efek plumping alami.",
    items: [
      "Tinted Hydrating Lip Oil",
      "Plumping Lip Treatment Serum",
      "Non-Drying Velvet Lip Cream",
      "Moisturizing Tinted Lip Balm"
    ],
    activeIngredients: "Peptides, Jojoba Oil, Vitamin E, Hyaluronic Acid",
    image: "/assets/images/blog/kemasan_lip_serum_ceramic_tip_dreamlab.jpg",
  },
];

const academyPillars = [
  {
    num: "01",
    title: "Product & Formula Positioning",
    desc: "Mempertajam diferensiasi konsep formula agar brand Anda punya keunikan kuat dibanding kompetitor di pasaran.",
    icon: Sparkles,
  },
  {
    num: "02",
    title: "Branding & Free Desain Kemasan",
    desc: "Dapatkan desain logo dan kemasan botol/box profesional siap cetak tanpa biaya tambahan, setara brand internasional.",
    icon: Palette,
  },
  {
    num: "03",
    title: "Digital Marketing & Ads Strategy",
    desc: "Blueprint taktik beriklan Meta Ads, TikTok Ads, live streaming funnel, hingga cara merekrut affiliate creator.",
    icon: TrendingUp,
  },
  {
    num: "04",
    title: "Brand Community Owner Network",
    desc: "Akses eksklusif jejaring komunitas sesama founder brand kecantikan alumni Dreamlab untuk sharing tren & scale-up.",
    icon: Users,
  },
];

export default function MetaAdsMofLandingPage() {
  useMetaAdsCtaPixel("Meta Ads MOF");

  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const scrollSlider = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.firstElementChild?.clientWidth || 320;
    const scrollAmount = direction === "left" ? -(cardWidth + 16) : cardWidth + 16;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const scrollLeft = sliderRef.current.scrollLeft;
    const cardWidth = sliderRef.current.firstElementChild?.clientWidth || 320;
    const index = Math.round(scrollLeft / (cardWidth + 16));
    setActiveSlide(Math.min(Math.max(index, 0), catalogSlides.length - 1));
  };

  return (
    <div className="landing-page-ads min-h-screen bg-white text-neutral-900 font-sans selection:bg-brand-orange selection:text-white pb-24 md:pb-12">
      
      {/* ============ STICKY HEADER WITH OFFICIAL DREAMLAB LOGO ============ */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 py-3 shadow-xs">
        <div className="container-custom px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik-.webp"
              alt="Dreamlab Maklon Kosmetik"
              width={140}
              height={45}
              className="h-8 sm:h-10 w-auto object-contain"
              priority
            />
            <span className="hidden lg:inline-block text-[11px] font-bold text-neutral-400 tracking-wider uppercase border-l border-neutral-200 pl-3">
              Inkubator & Maklon Kosmetik Resmi BPOM
            </span>
          </div>

          <a
            href={THANKYOU_URL}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-brand-orange/90 active:scale-95 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Konsultasi WA</span>
          </a>
        </div>
      </header>

      {/* ============ 1. CLEAN HERO SECTION ============ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/50 via-white to-white pt-6 pb-10 sm:pt-10 sm:pb-14 border-b border-neutral-100">
        <div className="container-custom px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-orange/10 border border-brand-orange/20 rounded-full text-brand-orange">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase font-onest">
                PELUANG BISNIS KOSMETIK & SKINCARE 2026/2027
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-black tracking-tight leading-[1.18] uppercase text-neutral-900 font-display">
              Punya Ide Produk Kecantikan?{' '}
              <span className="text-brand-orange block sm:inline">Wujudkan Brand Impian Anda</span>{' '}
              Bersama Dreamlab
            </h1>

            {/* Subheadline */}
            <p className="text-xs sm:text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Dari riset tren formula eksklusif, sertifikasi BPOM & Halal, desain kemasan mewah, hingga pendampingan bisnis gratis. Kami dampingi sampai produk siap laris di pasaran.
            </p>

            {/* Quick Benefits Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] sm:text-xs font-bold text-neutral-700">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200/90 rounded-full shadow-xs">
                <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> 1 Formula 1 Klien
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200/90 rounded-full shadow-xs">
                <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> Izin BPOM & Halal All-In
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200/90 rounded-full shadow-xs">
                <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> Free Desain Kemasan
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200/90 rounded-full shadow-xs">
                <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> MOQ Fleksibel
              </span>
            </div>

            {/* Primary Hero CTA */}
            <div className="pt-2 sm:pt-4">
              <a
                href={THANKYOU_URL}
                className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-4.5 bg-brand-orange text-white rounded-full font-black text-sm sm:text-base uppercase tracking-wider transition-all duration-200 shadow-lg shadow-brand-orange/20 hover:bg-brand-orange/95 hover:scale-[1.02] active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-current shrink-0" />
                <span>Konsultasi Peluang Bisnis Gratis</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>
              <p className="text-[11px] text-neutral-500 mt-2.5 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Diskusi santai via WhatsApp bersama Business Development Dreamlab
              </p>
            </div>

            {/* Trust Stats Strip */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-neutral-100 max-w-lg mx-auto">
              <div className="text-center p-2">
                <span className="block text-xl sm:text-2xl font-black text-brand-orange font-display">500+</span>
                <span className="text-[10px] sm:text-xs text-neutral-500 font-medium">Brand Tercipta</span>
              </div>
              <div className="text-center p-2 border-x border-neutral-100">
                <span className="block text-xl sm:text-2xl font-black text-neutral-900 font-display">CPKB A</span>
                <span className="text-[10px] sm:text-xs text-neutral-500 font-medium">Standar Pabrik</span>
              </div>
              <div className="text-center p-2">
                <span className="block text-xl sm:text-2xl font-black text-emerald-600 font-display">100%</span>
                <span className="text-[10px] sm:text-xs text-neutral-500 font-medium">Resmi BPOM</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============ BRAND YANG PERNAH DIPRODUKSI DI DREAMLAB ============ */}
      <section className="py-10 bg-[#FAF8F5] border-b border-neutral-200/60 overflow-hidden">
        <div className="container-custom px-4">
          <div className="text-center space-y-1.5 mb-6">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-brand-orange block font-onest">
              PORTFOLIO BRAND MITRA
            </span>
            <h2 className="text-base sm:text-xl font-black uppercase text-neutral-900 font-display">
              Brand yang Pernah Diproduksi di Dreamlab
            </h2>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Telah dipercaya oleh brand owner di seluruh Indonesia dari skincare, body care, hingga luxury parfum.
            </p>
          </div>

          {/* Logo Marquee / Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 max-w-4xl mx-auto items-center">
            {partnerBrands.map((brand, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-3 sm:p-4 border border-neutral-200/80 shadow-2xs flex items-center justify-center hover:scale-105 transition-transform"
              >
                <div className="relative h-12 w-full flex items-center justify-center">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={100}
                    height={50}
                    className="max-h-10 w-auto object-contain opacity-85 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-neutral-500 bg-white/80 px-3 py-1 rounded-full border border-neutral-200">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              Bergabung bersama 500+ Brand Owner sukses lulusan Dreamlab
            </span>
          </div>
        </div>
      </section>

      {/* ============ 2. POTENSI BISNIS KOSMETIK ============ */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container-custom px-4">
          
          <div className="max-w-2xl mx-auto text-center space-y-2.5 mb-8 sm:mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 rounded-full text-brand-orange text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              POTENSI BISNIS KECANTIKAN
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 uppercase font-display tracking-tight">
              Mengapa Sekarang Waktu Terbaik Membangun{' '}
              <span className="text-brand-orange">Brand Sendiri?</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              Jangan hanya menjadi konsumen atau reseller dengan margin tipis. Memiliki brand sendiri memberi Anda kendali penuh atas harga, profit, dan aset bisnis masa depan.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-10">
            {marketPotentials.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="bg-[#FAFAFA] border border-neutral-200/70 rounded-2xl p-5 hover:border-brand-orange/40 hover:bg-white hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="inline-block text-[10px] font-black tracking-wider text-brand-orange uppercase font-onest">
                      {item.badge}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-neutral-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Perbandingan: Coba Sendiri vs Bersama Dreamlab */}
          <div className="bg-[#FAF8F5] rounded-2xl p-5 sm:p-7 md:p-9 border border-neutral-200/70 max-w-3xl mx-auto space-y-5">
            <div className="text-center space-y-1">
              <h3 className="text-base sm:text-lg font-black text-neutral-900 uppercase font-display">
                Bandingkan: Memulai Sendiri vs Bersama Dreamlab
              </h3>
              <p className="text-[11px] sm:text-xs text-neutral-500">
                Pangkas risiko modal, formula rusak, dan kebingungan regulasi sejak hari pertama.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white border border-red-200 rounded-xl p-4 space-y-2">
                <span className="text-[11px] font-black text-red-600 uppercase tracking-wider block">
                  ✕ Jika Mencoba Sendiri
                </span>
                <ul className="text-xs text-neutral-600 space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <span className="text-red-500 font-bold shrink-0">•</span>
                    Investasi mesin & sewa lab miliaran rupiah
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-red-500 font-bold shrink-0">•</span>
                    Pusing urus uji lab & berkas BPOM berbulan-bulan
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-red-500 font-bold shrink-0">•</span>
                    Risiko formula pecah, berjamur, atau tidak stabil
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-red-500 font-bold shrink-0">•</span>
                    Bingung strategi pemasaran dan boncos di iklan
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-emerald-300 rounded-xl p-4 space-y-2">
                <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider block">
                  ✓ Didampingi Dreamlab
                </span>
                <ul className="text-xs text-neutral-700 space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    MOQ fleksibel terjangkau, bebas modal pabrik
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    Legalitas 100% all-in (BPOM, Halal MUI, Paten HKI)
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    1 Klien = 1 Formula unik racikan R&D profesional
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    Mentoring bisnis & digital ads di Beauty Academy
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center pt-2">
              <a
                href={THANKYOU_URL}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-brand-orange text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-brand-orange/95 active:scale-95 transition-all shadow-sm"
              >
                <span>Diskusikan Potensi Brand Anda</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ============ 3. APA YANG MAU DIBIKIN (SLIDER CATALOG PRODUK) ============ */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#FAFAFA] border-y border-neutral-100 overflow-hidden">
        <div className="container-custom px-4">
          
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 rounded-full text-brand-orange text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <FlaskConical className="w-3.5 h-3.5" />
              KATALOG FORMULA SIAP PRODUKSI
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 uppercase font-display tracking-tight">
              Pilihan Katalog Produk{' '}
              <span className="text-brand-orange">Bisa Disesuaikan Konsep Anda</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              Geser (slide) untuk melihat kategori produk impian yang bisa kami formulasikan untuk brand Anda.
            </p>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center justify-between max-w-5xl mx-auto mb-4 px-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-brand-orange font-onest">
                Kategori {activeSlide + 1}
              </span>
              <span className="text-xs text-neutral-400">
                dari {catalogSlides.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollSlider("left")}
                aria-label="Kategori Sebelumnya"
                className="w-8 h-8 rounded-full bg-white border border-neutral-200 shadow-xs flex items-center justify-center text-neutral-700 hover:bg-brand-orange hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollSlider("right")}
                aria-label="Kategori Selanjutnya"
                className="w-8 h-8 rounded-full bg-white border border-neutral-200 shadow-xs flex items-center justify-center text-neutral-700 hover:bg-brand-orange hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Slide Carousel */}
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-1 px-4 sm:px-2 max-w-5xl mx-auto scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {catalogSlides.map((cat, idx) => (
              <div
                key={cat.id}
                className="snap-center shrink-0 w-[84vw] sm:w-[320px] md:w-[350px] bg-white rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 sm:h-48 w-full bg-neutral-100 overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 85vw, 350px"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-brand-orange text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs border border-brand-orange/20">
                      {cat.tag}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-3">
                    <h3 className="text-base sm:text-lg font-black text-neutral-900 uppercase font-display tracking-tight">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {cat.desc}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      {cat.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-neutral-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-neutral-100">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">
                        Pilihan Bahan Aktif Tren:
                      </span>
                      <span className="text-[11px] font-semibold text-brand-orange">
                        {cat.activeIngredients}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-0">
                  <a
                    href={THANKYOU_URL}
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 bg-neutral-100 hover:bg-brand-orange hover:text-white text-neutral-900 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    <span>Konsultasikan Kategori Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {catalogSlides.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeSlide === i ? "w-6 bg-brand-orange" : "w-1.5 bg-neutral-300"
                }`}
              />
            ))}
          </div>

          {/* Custom Benchmark Box */}
          <div className="bg-white border border-brand-orange/20 rounded-2xl p-5 sm:p-6 max-w-2xl mx-auto text-center space-y-3 shadow-xs mt-8">
            <h3 className="text-sm sm:text-base font-black text-neutral-900 uppercase font-display">
              Punya Contoh Produk / Benchmark Impian Sendiri?
            </h3>
            <p className="text-xs text-neutral-600 max-w-lg mx-auto">
              Kirimkan sampel atau referensi yang Anda sukai. Formulator Dreamlab siap meracik formula tandingan dengan karakter aroma, tekstur, dan manfaat yang Anda mau.
            </p>
            <a
              href={THANKYOU_URL}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-orange text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-brand-orange/95 active:scale-95 transition-all shadow-xs"
            >
              <span>Kirimkan Referensi Produk Anda</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </section>

      {/* ============ 4. BEAUTY ACADEMY & BRAND COMMUNITY ============ */}
      <section className="py-12 sm:py-16 md:py-20 bg-white border-b border-neutral-100">
        <div className="container-custom px-4">
          
          <div className="max-w-2xl mx-auto text-center space-y-2.5 mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 rounded-full text-brand-orange text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              DREAMPRENEUR BEAUTY ACADEMY
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 uppercase font-display tracking-tight">
              Bukan Cuma Diproduksi, Brand Anda{' '}
              <span className="text-brand-orange">Dibimbing Sampai Laris</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              Kekhawatiran terbesar pemula bukan cara bikin produk, tapi cara menjualnya. Setiap mitra maklon Dreamlab otomatis mendapatkan pendampingan bisnis 4 pilar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto mb-8">
            {academyPillars.map((pillar) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={pillar.num}
                  className="bg-[#FAFAFA] border border-neutral-200/70 p-5 rounded-2xl hover:border-brand-orange/30 hover:bg-white hover:shadow-xs transition-all duration-200 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-brand-orange tracking-wider font-onest">
                      {pillar.num}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <h3 className="text-xs sm:text-sm font-black uppercase text-neutral-900 font-display tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <a
              href={THANKYOU_URL}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-brand-orange/95 active:scale-95 transition-all shadow-sm"
            >
              <span>Dapatkan Akses Mentoring Beauty Academy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </section>

      {/* ============ 5. CREDIBILITY & LEGALITAS ============ */}
      <AdsCredibilitySection channel="metaads" />

      {/* ============ 6. CLEAN FINAL CTA BANNER ============ */}
      <section className="py-14 sm:py-18 bg-brand-orange text-white relative overflow-hidden">
        <div className="container-custom px-4 text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            KONSULTASI PERTAMA GRATIS
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase font-display tracking-tight leading-tight">
            Mulai Langkah Pertama Brand Kosmetik Anda Sekarang
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed max-w-lg mx-auto">
            Diskusikan ide produk, estimasi HPP, dan strategi awal bersama tim Business Development Dreamlab tanpa komitmen awal.
          </p>

          <div className="pt-2">
            <a
              href={THANKYOU_URL}
              className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 sm:px-10 py-4 bg-white text-brand-orange rounded-full font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chat Tim Dreamlab di WhatsApp</span>
            </a>
          </div>

          <p className="text-[11px] text-white/70">
            Respon cepat • 100% Kerahasiaan Ide Terjamin (NDA)
          </p>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="py-6 bg-white border-t border-neutral-100 text-center text-[11px] text-neutral-400 space-y-1">
        <p className="font-bold uppercase tracking-widest text-neutral-600">
          PT Karya Impian Laboratoris (Dreamlab)
        </p>
        <p>© 2026 Dreamlab Indonesia. All rights reserved.</p>
      </footer>

      {/* ============ FIXED MOBILE BOTTOM BAR (HIGH-CONVERTING) ============ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md px-4 py-2.5 border-t border-neutral-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <a
          href={THANKYOU_URL}
          className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white rounded-full font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-transform"
        >
          <MessageCircle className="w-4 h-4 fill-current shrink-0" />
          <span>KONSULTASI BRAND SEKARANG (GRATIS)</span>
        </a>
      </div>

    </div>
  );
}
