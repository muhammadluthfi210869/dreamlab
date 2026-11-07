"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
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
  Star,
  Zap,
  Clock,
  Briefcase
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
  { name: "Chloe Green", logo: "/assets/images/1-300x300.webp" },
];

const potensiPoints = [
  { icon: DollarSign, text: "Margin Keuntungan Tebal 60% – 80%" },
  { icon: TrendingUp, text: "Pasar Kosmetik Ratusan Triliun (Tumbuh 10%+/Tahun)" },
  { icon: ShoppingBag, text: "Viral & Laris Cepat via TikTok Live & Affiliate" },
  { icon: ShieldCheck, text: "Nol Risiko Mesin & Bebas Modal Pabrik Miliaran" },
  { icon: FlaskConical, text: "1 Brand = 1 Formula Eksklusif (Bukan Template Pasaran)" },
  { icon: Award, text: "100% Legalitas BPOM, Halal MUI & Paten Merk HKI Resmi" },
];

const keuntunganPartner = [
  {
    title: "Formula 1:1 Eksklusif & Bebas Biaya R&D",
    desc: "Formula diracik privat oleh apoteker berpengalaman khusus untuk brand Anda tanpa duplikasi.",
    icon: FlaskConical,
  },
  {
    title: "Legalitas All-In Paralel",
    desc: "Semua pengurusan BPOM, sertifikasi Halal, dan hak paten HKI kami kerjakan paralel.",
    icon: ShieldCheck,
  },
  {
    title: "MOQ Fleksibel Masuk Akal",
    desc: "Mulai produksi tanpa beban stok besar agar sisa modal bisa dialokasikan untuk iklan & promosi.",
    icon: Package,
  },
  {
    title: "Free Desain Logo & Kemasan",
    desc: "Dapatkan branding visual dan desain kemasan box/botol premium siap cetak tanpa biaya tambahan.",
    icon: Palette,
  },
  {
    title: "Transparansi HPP Sejak Awal",
    desc: "Rincian biaya bahan baku dan kemasan jelas dari awal sehingga Anda tahu persis margin laba Anda.",
    icon: DollarSign,
  },
  {
    title: "Akses Komunitas Dreampreneur",
    desc: "Pendampingan bisnis, strategi digital marketing, dan networking sesama founder brand.",
    icon: Users,
  },
];

const catalogSlides = [
  {
    id: "skincare",
    title: "Skincare & Face Care",
    tag: "Best Seller",
    desc: "Serum pencerah, ceramide barrier moisturizer, glowing sunscreen SPF 50+, cleanser & toner.",
    items: ["Brightening Serum (SymWhite 377 / PDRN)", "Barrier Repair Ceramide Moisturizer", "Airy Glow Sunscreen SPF 50+"],
    activeIngredients: "SymWhite 377, Ceramide Complex, PDRN, Centella",
    image: "/new asset/landing page/skincare.webp",
  },
  {
    id: "parfum",
    title: "Parfum & Luxury Fragrance",
    tag: "Margin Tebal",
    desc: "Extrait de Parfum & EDP tahan 8–12 jam+ dengan aroma mewah berkarakter niche dunia.",
    items: ["Extrait de Parfum (Konsentrasi Bibit Tinggi)", "Eau de Parfum (EDP) Karakter Mewah", "Hair & Body Fragrance Mist"],
    activeIngredients: "Bibit parfum impor Eropa, cosmetic grade alcohol",
    image: "/new asset/landing page/parfum.webp",
  },
  {
    id: "bodycare",
    title: "Body Care",
    tag: "Volume Cepat",
    desc: "Body serum tone-up pencerah, body lotion wangi mewah, lulur body scrub, dan brightening underarm care.",
    items: ["Tone-Up Glowing Body Serum", "Underarm Whitening Deo Serum", "Aromatherapy Perfumed Body Wash"],
    activeIngredients: "Glutathione, Niacinamide, Shea Butter, AHA/BHA",
    image: "/new asset/landing page/LP_MAKLON_KOSMETIK_DREAMLAB.png",
  },
  {
    id: "personalcare",
    title: "Personal Care",
    tag: "Kebutuhan Harian",
    desc: "Produk kebersihan tubuh harian yang esensial dengan formula lembut dan aroma menyegarkan.",
    items: ["Deodorant Spray & Roll-On Cepat Kering", "Antibacterial Body Wash", "Moisturizing Hand & Nail Cream"],
    activeIngredients: "Magnesium, Tea Tree Oil, Aloe Vera, Vitamin E",
    image: "/new asset/bodycare/body-wash.webp",
  },
  {
    id: "mensgrooming",
    title: "Men's Grooming",
    tag: "Pasar Pria Meledak",
    desc: "Lini produk pria modern dari penata rambut hingga perawatan wajah dan jenggot.",
    items: ["Water-based & Oil-based Pomade", "Beard & Hair Growth Serum", "Deep Cleanse Men's Facial Wash"],
    activeIngredients: "Biotin, Activated Charcoal, Argan Oil, Menthol",
    image: "/new asset/haircare/pomade.webp",
  },
  {
    id: "babycare",
    title: "Baby Care",
    tag: "Formula Lembut",
    desc: "Formulasi ekstra aman, hypoallergenic, dan teruji klinis khusus untuk kulit bayi yang sensitif.",
    items: ["Baby 2-in-1 Hair & Body Wash", "Soothing Baby Moisturizing Lotion", "Mild Calming Baby Cologne"],
    activeIngredients: "Chamomile Extract, Calendula, Jojoba Oil, Oat Extract",
    image: "/new asset/baby-care/baby-wash.webp",
  },
  {
    id: "haircare",
    title: "Hair Care & Scalp Health",
    tag: "Tren Perawatan Rambut",
    desc: "Solusi rambut rontok, lepek, dan ketombe dengan bahan aktif modern yang terbukti secara klinis.",
    items: ["Anti-Hairfall Scalp Tonic Booster", "Hair Growth Stimulating Serum", "Keratin Treatment Hair Mask"],
    activeIngredients: "Redensyl, Biotin, Keratin Complex, Rosemary Extract",
    image: "/new asset/haircare/hair-conditioner.webp",
  },
  {
    id: "lipcare",
    title: "Lip Care & Color Cosmetic",
    tag: "Viral TikTok",
    desc: "Pewarna dan nutrisi bibir dengan formula nyaman, tidak lengket, dan memberi efek plumping.",
    items: ["Tinted Hydrating Lip Oil", "Plumping Lip Treatment Serum", "Non-Drying Velvet Lip Cream"],
    activeIngredients: "Peptides, Jojoba Oil, Vitamin E, Hyaluronic Acid",
    image: "/assets/images/blog/kemasan_lip_serum_ceramic_tip_dreamlab.jpg",
  },
];

const communityImages = [
  {
    src: "/assets/images/blog/beautypreneur-batch-2-dreamlab-sharing-session.jpg",
    caption: "Sharing Session & Mentoring Bersama Founder Brand",
  },
  {
    src: "/assets/images/blog/beautypreneur-batch-2-dreamlab-bangun-brand.jpg",
    caption: "Workshop Strategi Peluncuran Produk & Digital Ads",
  },
  {
    src: "/new asset/people/dsc00986.webp",
    caption: "Konsultasi & Brainstorming Formulasi Bersama Tim Ahli",
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

      {/* ============ 1. HERO SECTION WITH SKINCARE VISUAL BACKGROUND (LIKE HOMEPAGE) & BLUE/ORANGE GLOW ============ */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 border-b border-neutral-100 bg-[#FAF9F6]">
        
        {/* Skincare Visual Background Image (Like Homepage) */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
          <Image
            src="/new asset/background-visual-hero-section/home-page.webp"
            alt="Dreamlab Skincare & Cosmetic Maklon Background"
            fill
            priority
            fetchPriority="high"
            className="object-cover object-center opacity-30 md:opacity-35"
            sizes="100vw"
          />
          {/* Subtle gradient overlay to guarantee text readability & brand warmth */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6]/85 via-[#FAF9F6]/92 to-[#FAF9F6]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A8A]/10 via-transparent to-[#D98A00]/10" />
        </div>

        {/* Ambient Dreamlab Blue & Orange Glow Shadow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 sm:h-96 pointer-events-none z-0 blur-[100px] opacity-25">
          <div className="w-full h-full bg-gradient-to-r from-[#1E3A8A] via-[#3B82F6] to-[#D98A00] rounded-full" />
        </div>

        <div className="container-custom px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-orange/10 border border-brand-orange/20 rounded-full text-brand-orange shadow-xs">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase font-onest">
                PARTNER MAKLON KOSMETIK & SKINCARE
              </span>
            </div>

            {/* Requested Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.15] uppercase text-neutral-900 font-display">
              INGIN WUJUDKAN BRAND IMPIAN?{' '}
              <span className="text-brand-orange block sm:inline">DREAMLAB PILIHAN YANG TEPAT</span>
            </h1>

            {/* Requested Subheadline */}
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-900 font-black text-xs sm:text-sm uppercase tracking-wider">
              BUAT BRAND TANPA RIBET HANYA 3 BULAN
            </div>

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
                Respon Cepat via WhatsApp bersama Tim Business Development Dreamlab
              </p>
            </div>

            {/* Trust Stats Strip */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-neutral-100 max-w-lg mx-auto">
              <div className="text-center p-2">
                <span className="block text-xl sm:text-2xl font-black text-brand-orange font-display">500+</span>
                <span className="text-[10px] sm:text-xs text-neutral-500 font-medium">Brand Tercipta</span>
              </div>
              <div className="text-center p-2 border-x border-neutral-100">
                <span className="block text-xl sm:text-2xl font-black text-[#1E3A8A] font-display">CPKB A</span>
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

      {/* ============ 2. POTENSI (POIN TANPA PENJELASAN) ============ */}
      <section className="py-10 sm:py-14 bg-white border-b border-neutral-100">
        <div className="container-custom px-4">
          
          <div className="max-w-2xl mx-auto text-center space-y-1.5 mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 rounded-full text-brand-orange text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              POTENSI BISNIS
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 uppercase font-display tracking-tight">
              Potensi Bisnis Kosmetik Saat Ini
            </h2>
          </div>

          {/* Points Only Grid (Tanpa Penjelasan Panjang) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
            {potensiPoints.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-[#FAFAFA] border border-neutral-200/70 hover:border-brand-orange/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-neutral-800 leading-snug">
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ============ 3. KEUNTUNGAN BERPARTNER DENGAN DREAMLAB ============ */}
      <section className="py-12 sm:py-16 bg-[#FAF8F5] border-b border-neutral-200/60">
        <div className="container-custom px-4">
          
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-8 sm:mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100/70 rounded-full text-[#1E3A8A] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" />
              NILAI TAMBAH MITRA
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 uppercase font-display tracking-tight">
              Keuntungan Berpartner dengan Dreamlab
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto">
              Seluruh proses produksi dan legalitas kami tangani penuh agar Anda bisa fokus membesarkan penjualan brand Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
            {keuntunganPartner.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs hover:shadow-sm space-y-2.5 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-neutral-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {item.desc}
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
              <span>Diskusikan Rencana Brand Anda Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </section>

      {/* ============ 4. KATALOG PRODUK (SLIDE KESAMPING) ============ */}
      <section className="py-12 sm:py-16 md:py-20 bg-white border-b border-neutral-100 overflow-hidden">
        <div className="container-custom px-4">
          
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 rounded-full text-brand-orange text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <FlaskConical className="w-3.5 h-3.5" />
              KATALOG FORMULA
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 uppercase font-display tracking-tight">
              Produk Apa yang Ingin Anda Ciptakan?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              Geser (slide) ke samping untuk melihat seluruh kategori produk yang bisa kami formulasikan untuk brand Anda.
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
          <div className="bg-[#FAF8F5] border border-brand-orange/20 rounded-2xl p-5 sm:p-6 max-w-2xl mx-auto text-center space-y-3 shadow-xs mt-8">
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

      {/* ============ 5. AKSES COMMUNITY BRAND OWNER (DENGAN IMAGES) ============ */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F5] border-b border-neutral-200/60">
        <div className="container-custom px-4">
          
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 rounded-full text-brand-orange text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              EKSKLUSIF MITRA DREAMLAB
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 uppercase font-display tracking-tight">
              AKSES COMMUNITY BRAND OWNER
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal max-w-xl mx-auto">
              Setiap mitra produksi Dreamlab otomatis mendapatkan akses eksklusif ke komunitas sesama founder brand kecantikan untuk networking, sharing data tren, hingga akselerasi penjualan.
            </p>
          </div>

          {/* Community Real Images Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
            {communityImages.map((img, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-neutral-200/80 shadow-xs space-y-2.5 p-2.5"
              >
                <div className="relative h-44 sm:h-52 w-full rounded-xl overflow-hidden bg-neutral-100">
                  <Image
                    src={img.src}
                    alt={img.caption}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
                <p className="text-[11px] sm:text-xs font-semibold text-neutral-700 px-1.5 pb-1">
                  {img.caption}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href={THANKYOU_URL}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-brand-orange/95 active:scale-95 transition-all shadow-sm"
            >
              <span>Gabung Komunitas Brand Owner Dreamlab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </section>

      {/* ============ 6. LOGO PARTNER DREAMLAB (SEBELUM LEGALITAS) ============ */}
      <section className="py-10 bg-white border-b border-neutral-100 overflow-hidden">
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

          {/* Dynamic Infinite Running Marquee Logo Slider */}
          <div className="relative overflow-hidden w-full py-2">
            {/* Soft Edge Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

            <motion.div
              className="flex items-center gap-4 sm:gap-6 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {[...partnerBrands, ...partnerBrands].map((brand, i) => (
                <div
                  key={i}
                  className="w-36 sm:w-44 h-20 px-4 py-2 bg-[#FAFAFA] rounded-xl border border-neutral-200/80 shadow-2xs flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
                >
                  <div className="relative h-12 w-full flex items-center justify-center">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={120}
                      height={48}
                      className="max-h-11 w-auto object-contain opacity-85 hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="text-center mt-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-neutral-500 bg-[#FAF8F5] px-3.5 py-1 rounded-full border border-neutral-200">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              Dipercaya 500+ Brand Owner di Seluruh Indonesia
            </span>
          </div>
        </div>
      </section>

      {/* ============ 7. LEGALITAS & SERTIFIKASI PABRIK ============ */}
      <AdsCredibilitySection channel="metaads" />

      {/* ============ 8. FINAL CTA BANNER ============ */}
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
