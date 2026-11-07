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
  BarChart3, 
  MessageCircle,
  FileCheck2,
  Boxes,
  Zap,
  Check,
  ChevronLeft,
  ChevronRight,
  Palette,
  Star
} from "lucide-react";
import { useMetaAdsCtaPixel } from "@/lib/meta-ads-pixel";
import { AdsCredibilitySection } from "@/components/landing-pages/AdsCredibilitySection";

const THANKYOU_URL = "/ads/thankyou/metaads/?p=meta-bof";

const partnerBrands = [
  { name: "Sense Soul", logo: "/assets/images/Sense-Soul-300x300.webp" },
  { name: "Tazzi", logo: "/assets/images/Tazzi-300x300.webp" },
  { name: "Jilly Daily", logo: "/assets/images/Jilly-Daily-300x300.webp" },
  { name: "Labbol", logo: "/assets/images/Labbol-300x300.webp" },
  { name: "Itnob", logo: "/assets/images/Itnob-300x300.webp" },
  { name: "Bebiboster", logo: "/assets/images/Bebiboster-300x300.webp" },
];

const bofPillars = [
  {
    icon: DollarSign,
    badge: "TRANSPARANSI BIAYA",
    title: "HPP Jelas Tanpa Biaya Tersembunyi",
    desc: "Perhitungan biaya bahan aktif, botol/kemasan, dan uji lab dipaparkan transparan dari awal. Anda tahu persis margin keuntungan sebelum produksi dimulai.",
  },
  {
    icon: Boxes,
    badge: "SCALE-UP AMAN",
    title: "MOQ Fleksibel Sesuai Cashflow",
    desc: "Mulai produksi tanpa beban kuota besar. Jumlah Minimum Order Quantity (MOQ) disesuaikan agar sisa modal bisa dialokasikan maksimal untuk beriklan.",
  },
  {
    icon: Zap,
    badge: "PROSES CEPAT",
    title: "Sampel R&D Kilat & 1:1 Eksklusif",
    desc: "Tim formulator R&D siap meracik sampel dalam hitungan hari. Formula 1:1 eksklusif milik brand Anda, bukan racikan template massal.",
  },
  {
    icon: FileCheck2,
    badge: "LEGALITAS ALL-IN",
    title: "BPOM, Halal & HKI Diurus Lengkap",
    desc: "Pendaftaran notifikasi BPOM resmi, uji laboratorium, sertifikasi Halal, hingga pendaftaran hak paten merek HKI kami tangani secara paralel.",
  },
];

const timelineSteps = [
  {
    step: "01",
    title: "Konsultasi & Target HPP",
    desc: "Diskusikan ide produk, target harga jual, dan budget yang Anda miliki bersama tim ahli kami.",
  },
  {
    step: "02",
    title: "Pembuatan Sampel Formula R&D",
    desc: "Tim R&D meracik sampel khusus untuk Anda coba (tekstur, wangi, sensasi rasa, khasiat) sampai cocok.",
  },
  {
    step: "03",
    title: "Pengurusan BPOM & Legalitas",
    desc: "Pendaftaran izin edar BPOM resmi, sertifikasi Halal, serta paten merk HKI diproses paralel.",
  },
  {
    step: "04",
    title: "Produksi Massal CPKB Grade A",
    desc: "Produk diproduksi di fasilitas bersertifikat CPKB dengan standar higienitas dan QC ketat.",
  },
  {
    step: "05",
    title: "Produk Siap Kirim & Siap Jual",
    desc: "Produk dikemas rapi, disegel, dan siap dikirim ke gudang Anda untuk dipasarkan ke ribuan pembeli.",
  },
];

const readyCatalogSlides = [
  {
    id: "skincare",
    title: "Skincare Series (Face Care)",
    highlight: "Kategori Paling Laris",
    desc: "Formulasi bahan aktif premium bersertifikasi uji klinis, siap diproduksi dengan MOQ fleksibel.",
    items: [
      "Brightening & Anti-Aging Serum",
      "Barrier Repair Ceramide Moisturizer",
      "Airy Matte / Glowing Sunscreen SPF 50+",
      "Low pH Gentle Cleanser & Hydrating Toner"
    ],
    usp: "1 Brand = 1 Formula unik racikan apoteker R&D Dreamlab.",
    image: "/new asset/landing page/skincare.webp",
  },
  {
    id: "parfum",
    title: "Fine Fragrance (Parfum)",
    highlight: "Margin Paling Tebal",
    desc: "Bibit wangi impor konsentrasi tinggi tanpa bau alkohol menyengat, terdaftar resmi di BPOM.",
    items: [
      "Extrait de Parfum (Ketahanan 12+ jam)",
      "Eau de Parfum (EDP) Karakter Niche Mewah",
      "Hair & Body Fragrance Mist",
      "Linen & Pillow Relaxing Spray"
    ],
    usp: "Pilihan botol luxury, cap magnet, dan box eksklusif gratis.",
    image: "/new asset/landing page/parfum.webp",
  },
  {
    id: "bodycare",
    title: "Perfumed Body Care",
    highlight: "Volume Penjualan Cepat",
    desc: "Formula cepat meresap dengan efek tone-up alami dan wangi mewah tahan lama di kulit.",
    items: [
      "Tone-Up Glowing Body Serum",
      "Underarm Whitening Deo Serum",
      "Aromatherapy Perfumed Body Wash",
      "Exfoliating Brightening Body Scrub"
    ],
    usp: "Tekstur ringan, tidak lengket, dan nyaman untuk iklim tropis.",
    image: "/new asset/landing page/LP_MAKLON_KOSMETIK_DREAMLAB.png",
  },
  {
    id: "haircare",
    title: "Hair & Scalp Treatment",
    highlight: "Tren Pasar Meledak",
    desc: "Kombinasi bahan aktif modern (Redensyl, Biotin, Rosemary) untuk perawatan rambut profesional.",
    items: [
      "Anti-Hairfall Scalp Tonic Booster",
      "Hair Growth Stimulating Serum",
      "Keratin Treatment Hair Mask",
      "Non-Greasy Hair Perfume Oil"
    ],
    usp: "Kinerja formula teruji laboratorium tanpa efek samping.",
    image: "/new asset/landing page/haircare.png",
  },
  {
    id: "lipcare",
    title: "Lip Treatment & Cosmetic",
    highlight: "Produk Viral TikTok",
    desc: "Koleksi perawatan bibir dengan pigmentasi tahan lama dan sensasi melembabkan instan.",
    items: [
      "Tinted Hydrating Lip Oil",
      "Plumping Lip Treatment Serum",
      "Non-Drying Velvet Lip Cream",
      "Moisturizing Tinted Lip Balm"
    ],
    usp: "Pilihan aplikator doe-foot, rollerball, dan ceramic tip modern.",
    image: "/assets/images/blog/kemasan_lip_serum_ceramic_tip_dreamlab.jpg",
  },
];

const academyPillars = [
  {
    num: "01",
    title: "Product & Formula Positioning",
    desc: "Mempertajam diferensiasi konsep formula agar produk Anda langsung menarik perhatian pasar sejak peluncuran.",
    icon: Sparkles,
  },
  {
    num: "02",
    title: "Branding & Free Desain Kemasan",
    desc: "Dapatkan desain logo dan kemasan botol/box profesional siap cetak tanpa biaya tambahan, setara brand global.",
    icon: Palette,
  },
  {
    num: "03",
    title: "Digital Marketing & Ads Strategy",
    desc: "Panduan praktis beriklan Meta Ads, TikTok Ads, live streaming, dan funnel konversi dari praktisi berpengalaman.",
    icon: TrendingUp,
  },
  {
    num: "04",
    title: "Brand Community Owner Network",
    desc: "Akses eksklusif jejaring komunitas sesama founder brand kecantikan alumni Dreamlab untuk akselerasi bisnis.",
    icon: Users,
  },
];

export default function MetaAdsBofLandingPage() {
  useMetaAdsCtaPixel("Meta Ads BOF");

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
    setActiveSlide(Math.min(Math.max(index, 0), readyCatalogSlides.length - 1));
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
              Pabrik Maklon Resmi BPOM & CPKB Grade A
            </span>
          </div>

          <a
            href={THANKYOU_URL}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-brand-orange/90 active:scale-95 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Klaim Sampel</span>
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
                SIAP PRODUKSI BULAN INI — BPOM RESMI & CPKB A
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-black tracking-tight leading-[1.18] uppercase text-neutral-900 font-display">
              Siap Luncurkan Brand Kosmetik Anda?{' '}
              <span className="text-brand-orange block sm:inline">Maklon Resmi BPOM, MOQ Fleksibel</span>{' '}
              & Sampel Kilat
            </h1>

            {/* Subheadline */}
            <p className="text-xs sm:text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Eksekusi rencana produk Anda tanpa buang waktu. Tim R&D Dreamlab siap meracik sampel formula eksklusif, proses perizinan BPOM all-in, HPP transparan, hingga produk siap kirim ke gudang Anda.
            </p>

            {/* Quick Benefits Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] sm:text-xs font-bold text-neutral-700">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200/90 rounded-full shadow-xs">
                <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> Free Sampel R&D
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200/90 rounded-full shadow-xs">
                <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> Izin BPOM, Halal & HKI All-In
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200/90 rounded-full shadow-xs">
                <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> MOQ Fleksibel Terjangkau
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200/90 rounded-full shadow-xs">
                <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> Free Desain Logo & Kemasan
              </span>
            </div>

            {/* Primary Hero CTA */}
            <div className="pt-2 sm:pt-4">
              <a
                href={THANKYOU_URL}
                className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-4.5 bg-brand-orange text-white rounded-full font-black text-sm sm:text-base uppercase tracking-wider transition-all duration-200 shadow-lg shadow-brand-orange/20 hover:bg-brand-orange/95 hover:scale-[1.02] active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-current shrink-0" />
                <span>Klaim Sampel & Konsultasi Produksi</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>
              <p className="text-[11px] text-neutral-500 mt-2.5 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Diskusi langsung dengan Tim Business Development (Respon Cepat)
              </p>
            </div>

            {/* Trust Stats Strip */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-neutral-100 max-w-lg mx-auto">
              <div className="text-center p-2">
                <span className="block text-xl sm:text-2xl font-black text-brand-orange font-display">500+</span>
                <span className="text-[10px] sm:text-xs text-neutral-500 font-medium">Brand Sukses</span>
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

      {/* ============ 2. KEUNGGULAN EKSEKUSI & TIMELINE ============ */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container-custom px-4">
          
          <div className="max-w-2xl mx-auto text-center space-y-2.5 mb-8 sm:mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 rounded-full text-brand-orange text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              KEUNGGULAN EKSEKUSI DREAMLAB
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 uppercase font-display tracking-tight">
              Eksekusi Cepat, Legalitas Aman,{' '}
              <span className="text-brand-orange">Tanpa Biaya Siluman</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              Kecepatan dan transparansi biaya adalah penentu keberhasilan produk Anda di pasar. Dreamlab menjamin alur maklon yang rapi dan pasti.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-10">
            {bofPillars.map((item, idx) => {
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

          {/* Timeline 5 Langkah Produksi */}
          <div className="bg-[#FAF8F5] rounded-2xl p-5 sm:p-7 md:p-9 border border-neutral-200/70 max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-brand-orange tracking-widest font-onest block">
                TIMELINE PRODUKSI TERSTRUKTUR
              </span>
              <h3 className="text-base sm:text-lg font-black text-neutral-900 uppercase font-display">
                Alur Maklon 5 Langkah Hingga Produk Siap Jual
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-neutral-200/80 space-y-1.5">
                  <span className="text-lg font-black text-brand-orange font-display block">
                    {step.step}
                  </span>
                  <h4 className="text-xs font-bold text-neutral-900 leading-snug">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <a
                href={THANKYOU_URL}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-brand-orange text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-brand-orange/95 active:scale-95 transition-all shadow-sm"
              >
                <span>Hitung HPP & Konsultasikan MOQ Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ============ 3. APA YANG MAU DIBIKIN (SLIDER KATALOG SIAP PRODUKSI) ============ */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#FAFAFA] border-y border-neutral-100 overflow-hidden">
        <div className="container-custom px-4">
          
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 rounded-full text-brand-orange text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <FlaskConical className="w-3.5 h-3.5" />
              KATALOG SIAP PRODUKSI
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 uppercase font-display tracking-tight">
              Pilihan Formula Produk{' '}
              <span className="text-brand-orange">Unggulan Brand Anda</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              Geser (slide) katalog formula kami. Seluruh produk dapat disesuaikan tekstur, aroma, dan bahan aktifnya sesuai benchmark Anda.
            </p>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center justify-between max-w-5xl mx-auto mb-4 px-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-brand-orange font-onest">
                Kategori {activeSlide + 1}
              </span>
              <span className="text-xs text-neutral-400">
                dari {readyCatalogSlides.length}
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
            {readyCatalogSlides.map((cat, idx) => (
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
                      {cat.highlight}
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

                    <p className="text-[11px] text-neutral-500 italic pt-2 border-t border-neutral-100">
                      {cat.usp}
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-0">
                  <a
                    href={THANKYOU_URL}
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 bg-neutral-100 hover:bg-brand-orange hover:text-white text-neutral-900 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    <span>Request Sampel Kategori Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {readyCatalogSlides.map((_, i) => (
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
              Ingin Custom Formula Khusus Sesuai Benchmark Anda?
            </h3>
            <p className="text-xs text-neutral-600 max-w-lg mx-auto">
              Kirimkan referensi tekstur, aroma, atau bahan aktif yang Anda inginkan. Formulator Dreamlab siap mereplikasi dan mengoptimalkannya dengan standar resmi BPOM.
            </p>
            <a
              href={THANKYOU_URL}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-orange text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-brand-orange/95 active:scale-95 transition-all shadow-xs"
            >
              <span>Klaim Sampel Formula Custom Anda</span>
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
              AKSELERATOR BISNIS DREAMLAB
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 uppercase font-display tracking-tight">
              Dukungan Pemasaran &{' '}
              <span className="text-brand-orange">Dreampreneur Beauty Academy</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              Kami pastikan produk Anda tidak menumpuk di gudang. Dapatkan bonus pendampingan bisnis langsung dari praktisi.
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
              <span>Klaim Bonus Pendampingan Pemasaran</span>
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
            AMBIL KEPUTUSAN HARI INI
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase font-display tracking-tight leading-tight">
            Waktunya Meluncurkan Brand Kosmetik Anda Sendiri
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed max-w-lg mx-auto">
            Jangan tunda lagi saat pasar sedang berkembang pesat. Hubungi kami sekarang untuk klaim sampel formula dan amankan slot produksi Anda bulan ini.
          </p>

          <div className="pt-2">
            <a
              href={THANKYOU_URL}
              className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 sm:px-10 py-4 bg-white text-brand-orange rounded-full font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Klaim Sampel & Konsultasi Sekarang</span>
            </a>
          </div>

          <p className="text-[11px] text-white/70">
            Respon cepat tim Dreamlab • 100% Bebas Biaya Konsultasi Awal
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
          <span>KLAIM SAMPEL & KONSULTASI SEKARANG</span>
        </a>
      </div>

    </div>
  );
}
