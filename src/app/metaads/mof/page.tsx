"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Package,
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
  Briefcase,
  BadgeCheck,
  Flame,
  Repeat,
  Rocket,
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
  {
    icon: DollarSign,
    metric: "Profit 300% – 500%",
    title: "Margin Keuntungan Brand Owner Tebal",
    pill: "HPP Rp 25rb → Jual Rp 99rb–149rb",
    color: "text-brand-orange",
    bgIcon: "bg-brand-orange/10 text-brand-orange border-brand-orange/20",
  },
  {
    icon: TrendingUp,
    metric: "Rp 158+ Triliun",
    title: "Nilai Pasar Kosmetik & Skincare Indonesia",
    pill: "Naik Pesat Setiap Tahun",
    color: "text-[#4898D3]",
    bgIcon: "bg-[#4898D3]/10 text-[#4898D3] border-[#4898D3]/20",
  },
  {
    icon: Repeat,
    metric: "85% Repeat Order",
    title: "Produk Habis Pakai Tiap 3–4 Minggu",
    pill: "Konsumen Beli Ulang Terus",
    color: "text-emerald-600",
    bgIcon: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  {
    icon: ShoppingBag,
    metric: "#1 Paling Laris",
    title: "Kategori Transaksi Tertinggi di TikTok & Shopee",
    pill: "Jutaan Paket Terjual / Hari",
    color: "text-brand-orange",
    bgIcon: "bg-brand-orange/10 text-brand-orange border-brand-orange/20",
  },
  {
    icon: Rocket,
    metric: "Balik Modal 1 Batch",
    title: "Tanpa Modal Bangun Pabrik & Mesin Miliaran",
    pill: "MOQ Ringan & Terukur",
    color: "text-[#4898D3]",
    bgIcon: "bg-[#4898D3]/10 text-[#4898D3] border-[#4898D3]/20",
  },
  {
    icon: Flame,
    metric: "8+ Segmen Cuan",
    title: "Skincare, Pria, Baby Care & Parfum Meledak",
    pill: "Peluang Pasar Sangat Luas",
    color: "text-emerald-600",
    bgIcon: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
];

const partnerAdvantages = [
  {
    num: "01",
    title: "Formula 1:1 Eksklusif & Free R&D",
    desc: "Diracik khusus oleh apoteker berpengalaman untuk brand Anda seorang—dijamin unik dan tidak diduplikasi ke klien lain.",
    icon: FlaskConical,
    badge: "Gratis Sampel",
  },
  {
    num: "02",
    title: "Legalitas All-In Paralel",
    desc: "Pengurusan izin edar BPOM, sertifikasi Halal, dan pendaftaran HKI kami urus penuh secara paralel hingga tuntas.",
    icon: ShieldCheck,
    badge: "Terima Beres",
  },
  {
    num: "03",
    title: "MOQ Fleksibel & Ramah Modal",
    desc: "Mulai produksi dengan kuantitas masuk akal agar mayoritas modal Anda bisa fokus untuk agresivitas marketing & iklan.",
    icon: Package,
    badge: "Modal Efisien",
  },
  {
    num: "04",
    title: "Free Desain Logo & Kemasan 3D",
    desc: "Tim kreatif kami buatkan identitas visual, mockup botol, dan desain box mewah siap cetak tanpa biaya tambahan.",
    icon: Palette,
    badge: "Senilai Rp 5 Jt",
  },
  {
    num: "05",
    title: "Transparansi HPP Sejak Hari Pertama",
    desc: "Rincian biaya bahan baku dan kemasan dibuka transparan di awal sehingga Anda bisa menghitung proyeksi profit dengan akurat.",
    icon: DollarSign,
    badge: "Tanpa Biaya Tersembunyi",
  },
  {
    num: "06",
    title: "Akses Eksklusif Beauty Academy",
    desc: "Bimbingan bisnis, strategi iklan digital, dan jejaring sesama founder brand kecantikan di seluruh Indonesia.",
    icon: Users,
    badge: "Full Mentoring",
  },
];

const catalogSlides = [
  {
    id: "skincare",
    title: "Skincare & Face Care",
    tag: "Best Seller #1",
    desc: "Serum pencerah, ceramide barrier moisturizer, glowing sunscreen SPF 50+, gentle cleanser & hydrating toner.",
    items: [
      "Brightening Serum (SymWhite 377 / PDRN)",
      "Barrier Repair Ceramide Moisturizer",
      "Airy Glow Hybrid Sunscreen SPF 50+",
    ],
    activeIngredients: "SymWhite 377, Ceramide Complex, PDRN, Centella",
    image: "/new asset/landing page/skincare.webp",
  },
  {
    id: "personalcare",
    title: "Personal Care",
    tag: "Repeat Order Cepat",
    desc: "Produk perawatan & kebersihan tubuh harian dengan formula lembut, antibakteri, dan keharuman tahan lama.",
    items: [
      "Antibacterial & Moisturizing Body Wash",
      "Deodorant Roll-On & Spray Anti-Noda",
      "Nourishing Hand & Body Wash",
    ],
    activeIngredients: "Tea Tree Oil, Niacinamide, Aloe Vera, Vitamin E",
    image: "/new asset/bodycare/body-wash.webp",
  },
  {
    id: "babycare",
    title: "Baby Care",
    tag: "Pasar Loyal Ibu & Anak",
    desc: "Formulasi ekstra lembut, hypoallergenic, pH seimbang, dan aman untuk kulit bayi yang sensitif.",
    items: [
      "Sensitive Baby 2-in-1 Hair & Body Wash",
      "Soothing Baby Moisturizing Lotion",
      "Calming Natural Baby Oil & Cologne",
    ],
    activeIngredients: "Chamomile Extract, Calendula, Jojoba Oil, Oat",
    image: "/new asset/baby-care/baby-wash.webp",
  },
  {
    id: "haircare",
    title: "Hair Care & Scalp Care",
    tag: "Tren Perawatan Rambut",
    desc: "Rangkaian perawatan rambut rontok, ketombe, dan perbaikan batang rambut rusak berstandar salon profesional.",
    items: [
      "Anti-Hairfall Keratin Shampoo & Conditioner",
      "Intensive Hair Growth Scalp Tonic & Serum",
      "Deep Repair Nourishing Hair Mask",
    ],
    activeIngredients: "Redensyl, Biotin, Hydrolyzed Keratin, Rosemary",
    image: "/new asset/haircare/shampoo.webp",
  },
  {
    id: "mensgrooming",
    title: "Men's Grooming",
    tag: "Pasar Pria Meledak",
    desc: "Lini produk perawatan pria modern mulai dari penata rambut, perawatan jenggot, hingga pencuci wajah pria.",
    items: [
      "Water-Based & Matte Clay Pomade",
      "Beard & Mustache Growth Serum",
      "Charcoal Oil-Control Men's Facial Wash",
    ],
    activeIngredients: "Biotin, Activated Charcoal, Argan Oil, Menthol",
    image: "/new asset/haircare/pomade.webp",
  },
  {
    id: "parfum",
    title: "Parfum & Luxury Fragrance",
    tag: "Margin Paling Tebal",
    desc: "Extrait de Parfum & EDP tahan 8–12 jam+ dengan karakter wangi niche Eropa yang mewah dan berkelas.",
    items: [
      "Extrait de Parfum (Konsentrasi Bibit Tinggi)",
      "Eau de Parfum (EDP) Signature Scent",
      "Refreshing Hair & Body Fragrance Mist",
    ],
    activeIngredients: "Fine Fragrance Oil Impor Eropa, Fixative Grade A",
    image: "/new asset/landing page/parfum.webp",
  },
  {
    id: "bodycare",
    title: "Brightening Body Care",
    tag: "Volume Penjualan Tinggi",
    desc: "Body serum tone-up instan, body butter mewah, body scrub eksfoliasi, dan krim pencerah lipatan.",
    items: [
      "Instant Tone-Up Whitening Body Serum",
      "Rich Nourishing Body Butter & Scrub",
      "Underarm & Fold Brightening Cream",
    ],
    activeIngredients: "Glutathione, Alpha Arbutin, Shea Butter, AHA",
    image: "/new asset/bodycare/body-butter.webp",
  },
  {
    id: "lipcare",
    title: "Lip Care & Hybrid Makeup",
    tag: "Viral di TikTok",
    desc: "Perawatan dan pewarna bibir dengan aplikator modern, tekstur ringan tidak lengket, dan efek melembapkan.",
    items: [
      "Peptide Plumping Lip Serum (Ceramic Tip)",
      "Tinted Hydrating Lip Oil & Lip Butter",
      "Velvet Transferproof Lip Cream",
    ],
    activeIngredients: "Tripeptide, Hyaluronic Acid, Jojoba Oil, Vitamin E",
    image: "/assets/images/blog/kemasan_lip_serum_ceramic_tip_dreamlab.jpg",
  },
];

const communityImages = [
  {
    src: "/assets/images/blog/beautypreneur-batch-2-dreamlab-sharing-session.jpg",
    badge: "SHARING SESSION",
    title: "Mentoring & Growth Strategy",
    caption: "Bedah strategi brand positioning & identifikasi target market bersama praktisi industri kecantikan.",
  },
  {
    src: "/assets/images/blog/beautypreneur-batch-2-dreamlab-bangun-brand.jpg",
    badge: "WORKSHOP EKSLUSIF",
    title: "Bangun Brand Bersama Partner",
    caption: "Pendampingan intensif dari riset produk, peluncuran perdana, hingga optimasi penjualan digital.",
  },
  {
    src: "/assets/images/blog/maklon-parfum-after-sales-beauty-academy.webp",
    badge: "BEAUTY ACADEMY",
    title: "After-Sales Community & Networking",
    caption: "Komunitas eksklusif ratusan founder brand Dreamlab untuk kolaborasi dan evaluasi bisnis berkala.",
  },
];

export default function MetaAdsMofLandingPage() {
  useMetaAdsCtaPixel("Meta Ads MOF");

  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const scrollSlider = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.firstElementChild?.clientWidth || 310;
    const scrollAmount = direction === "left" ? -(cardWidth + 16) : cardWidth + 16;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const scrollToIndex = (index: number) => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.firstElementChild?.clientWidth || 310;
    sliderRef.current.scrollTo({ left: index * (cardWidth + 16), behavior: "smooth" });
    setActiveSlide(index);
  };

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const scrollLeft = sliderRef.current.scrollLeft;
    const cardWidth = sliderRef.current.firstElementChild?.clientWidth || 310;
    const index = Math.round(scrollLeft / (cardWidth + 16));
    setActiveSlide(Math.min(Math.max(index, 0), catalogSlides.length - 1));
  };

  const marqueeBrands = [...partnerBrands, ...partnerBrands, ...partnerBrands];

  return (
    <div className="landing-page-ads min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-white text-neutral-900 font-sans selection:bg-brand-orange selection:text-white pb-24 md:pb-12">
      {/* Pure CSS Keyframes for 100% Bulletproof Running Logo Marquee */}
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

      {/* ============ CLEAN TOP BRAND BAR (NO POPUP LAYER) ============ */}
      <header className="w-full bg-white border-b border-neutral-100 py-3">
        <div className="container-custom w-full px-4 flex items-center justify-between gap-2">
          <Image
            src="/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik-.webp"
            alt="Dreamlab Maklon Kosmetik"
            width={135}
            height={44}
            unoptimized
            className="h-8 sm:h-9 w-auto object-contain shrink-0"
            priority
          />

          <a
            href={THANKYOU_URL}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-orange text-white rounded-full text-[11px] sm:text-xs font-extrabold uppercase tracking-wider shadow-xs hover:bg-brand-orange/90 active:scale-95 transition-all shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current shrink-0" />
            <span>Konsultasi Gratis</span>
          </a>
        </div>
      </header>

      {/* ============ 1. HERO SECTION: FULL-BLEED SKINCARE BACKGROUND SEPERTI HOMEPAGE (TANPA POPUP LAYER) ============ */}
      <section className="relative w-full min-h-[540px] sm:min-h-[600px] lg:min-h-[640px] flex items-start lg:items-center overflow-hidden pt-8 pb-52 sm:py-16 lg:py-20 bg-[#D7E6F5] border-b border-neutral-200/60">
        {/* Full-Bleed Skincare Background Visual (Exactly like Homepage PremiumHero) */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src="/new asset/background-visual-hero-section/home-page.webp"
            alt="Dreamlab Skincare & Cosmetic Manufacturing"
            fill
            priority
            unoptimized
            className="object-cover object-[82%_bottom] sm:object-[78%_center] lg:object-right"
            sizes="100vw"
          />
          {/* Soft Directional Readability Gradient: Top-to-Bottom on Mobile (so bottles at the bottom are 100% clear!), Left-to-Right on Desktop */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 via-55% to-transparent lg:bg-gradient-to-r lg:from-white/92 lg:via-white/65 lg:via-50% lg:to-transparent" />
        </div>

        {/* Soft Dreamlab Sky Blue (#4898D3) & Orange (#F39200) Ambient Shadow Behind Headline */}
        <div
          className="absolute top-8 left-0 w-[320px] sm:w-[480px] h-[240px] sm:h-[320px] pointer-events-none z-0 blur-[80px] opacity-35"
          style={{
            background: "radial-gradient(circle at 30% 40%, #4898D3 0%, #F39200 85%, transparent 100%)",
          }}
        />

        <div className="container-custom w-full px-4 relative z-10">
          <div className="w-full max-w-xl lg:max-w-2xl text-center lg:text-left space-y-4">
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/90 border border-brand-orange/30 rounded-full text-brand-orange shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse shrink-0" />
              <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase">
                PARTNER MAKLON KOSMETIK & SKINCARE
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.12] uppercase text-neutral-900 font-display"
              style={{
                textShadow: "0 8px 28px rgba(72,152,211,0.22), 0 4px 14px rgba(243,146,0,0.18)",
              }}
            >
              INGIN WUJUDKAN BRAND IMPIAN?{" "}
              <span className="text-brand-orange block mt-1">
                DREAMLAB PILIHAN YANG TEPAT
              </span>
            </h1>

            {/* Requested Subheadline: BUAT BRAND TANPA RIBET HANYA 3 BULAN */}
            <div>
              <span className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-[#4898D3] text-white font-black text-xs sm:text-sm md:text-base uppercase tracking-wider shadow-[0_8px_20px_rgba(72,152,211,0.35)]">
                <Zap className="w-4 h-4 text-amber-200 fill-amber-200 shrink-0" />
                <span>BUAT BRAND TANPA RIBET HANYA 3 BULAN</span>
              </span>
            </div>

            {/* Quick Conversion Checkmarks */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs font-extrabold text-neutral-800">
              <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-xs border border-neutral-200/80 rounded-full shadow-2xs">
                <Check className="w-3.5 h-3.5 text-brand-orange stroke-[3] shrink-0" /> 1 Formula 1 Klien
              </span>
              <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-xs border border-neutral-200/80 rounded-full shadow-2xs">
                <Check className="w-3.5 h-3.5 text-brand-orange stroke-[3] shrink-0" /> Resmi BPOM & Halal
              </span>
              <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-xs border border-neutral-200/80 rounded-full shadow-2xs">
                <Check className="w-3.5 h-3.5 text-brand-orange stroke-[3] shrink-0" /> Free Desain Kemasan
              </span>
              <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-xs border border-neutral-200/80 rounded-full shadow-2xs">
                <Check className="w-3.5 h-3.5 text-brand-orange stroke-[3] shrink-0" /> MOQ Fleksibel
              </span>
            </div>

            {/* High-Conversion Primary CTA */}
            <div className="pt-2 space-y-2">
              <a
                href={THANKYOU_URL}
                className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 sm:px-10 py-4 bg-brand-orange text-white rounded-full font-black text-xs sm:text-base uppercase tracking-wider transition-all duration-200 shadow-[0_12px_28px_rgba(243,146,0,0.35)] hover:bg-neutral-900 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0" />
                <span>Konsultasi & Cek Biaya Maklon Gratis</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>
              <p className="text-[11px] sm:text-xs font-bold text-neutral-700 flex items-center justify-center lg:justify-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Respon Cepat via WhatsApp bersama Spesialis Maklon Dreamlab</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. POTENSI BISNIS KOSMETIK SAAT INI (CLEAN DREAMLAB LIGHT THEME + ANGKA CUAN BESAR) ============ */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#F4F9FD] via-white to-[#FFFDF9] border-b border-neutral-100 relative overflow-hidden">
        <div className="container-custom px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-brand-orange/10 border border-brand-orange/25 rounded-full text-brand-orange text-[10px] sm:text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
              PELUANG CUAN INDUSTRI KECANTIKAN 2026
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 uppercase font-display tracking-tight">
              Potensi Bisnis Kosmetik Saat Ini
            </h2>
          </div>

          {/* 6 Big Metric Potential Cards (Clean White Cards with Bold Numbers) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {potensiPoints.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl p-5 bg-white border border-neutral-200/90 hover:border-brand-orange/50 transition-all flex flex-col justify-between gap-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xl sm:text-2xl font-black tracking-tight font-display ${item.color}`}>
                      {item.metric}
                    </span>
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${item.bgIcon}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <p className="text-sm sm:text-base font-extrabold text-neutral-900 leading-snug">
                    {item.title}
                  </p>

                  <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-neutral-700 bg-[#FAF8F5] border border-neutral-200/80 px-2.5 py-1 rounded-lg">
                      <Check className="w-3 h-3 text-emerald-600 stroke-[3] shrink-0" />
                      {item.pill}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Real Profit Simulation Highlight Bar */}
          <div className="mt-6 sm:mt-8 max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-brand-orange to-[#E69500] p-4 sm:p-5 shadow-[0_12px_28px_rgba(243,146,0,0.25)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-0.5">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-100 block">
                ILUSTRASI POTENSI PROFIT BRAND OWNER
              </span>
              <p className="text-sm sm:text-lg font-black text-white">
                Jual 1.000 Pcs/Bulan × Profit Rp 60.000 ={" "}
                <span className="underline decoration-2 underline-offset-4">
                  Potensi Laba Rp 60 Juta / Bulan!
                </span>
              </p>
            </div>
            <a
              href={THANKYOU_URL}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white text-neutral-900 rounded-full font-black text-xs uppercase tracking-wider hover:bg-neutral-100 active:scale-95 transition-all shrink-0 shadow-xs"
            >
              <span>Hitung HPP Brand Saya</span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-orange" />
            </a>
          </div>
        </div>
      </section>

      {/* ============ 3. KEUNTUNGAN BERPARTNER DENGAN DREAMLAB ============ */}
      <section className="py-12 sm:py-16 bg-[#FAF8F5] border-b border-neutral-200/60">
        <div className="container-custom px-4">
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#4898D3]/10 border border-[#4898D3]/25 rounded-full text-[#4898D3] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" />
              MENGAPA MEMILIH DREAMLAB
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 uppercase font-display tracking-tight">
              Keuntungan Berpartner dengan Dreamlab
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto">
              Seluruh proses produksi dari hulu ke hilir kami tangani penuh agar Anda bisa fokus penuh membesarkan penjualan brand Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {partnerAdvantages.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold uppercase">
                        {adv.badge}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-neutral-900">
                      {adv.title}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {adv.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] font-bold text-[#4898D3]">
                    <span>Keunggulan #{adv.num}</span>
                    <BadgeCheck className="w-4 h-4 text-brand-orange" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <a
              href={THANKYOU_URL}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-orange text-white rounded-full font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:bg-brand-orange/90 active:scale-95 transition-all shadow-md"
            >
              <span>Diskusikan Konsep & HPP Brand Anda</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ============ 4. KATALOG PRODUK (SLIDE KESAMPING + FOTO PRODUK ASLI KATALOG) ============ */}
      <section className="py-12 sm:py-16 bg-white border-b border-neutral-100 overflow-hidden">
        <div className="container-custom px-4">
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 rounded-full text-brand-orange text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <FlaskConical className="w-3.5 h-3.5" />
              8 KATEGORI PRODUK SIAP PRODUKSI
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 uppercase font-display tracking-tight">
              Produk Apa yang Ingin Anda Ciptakan?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Pilih atau geser (slide) ke samping untuk melihat lini produk yang siap kami formulasikan untuk brand Anda.
            </p>
          </div>

          {/* Quick Category Pills (Tap to Slide) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 max-w-5xl mx-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {catalogSlides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => scrollToIndex(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all shrink-0 border ${
                  activeSlide === idx
                    ? "bg-brand-orange text-white border-brand-orange shadow-xs"
                    : "bg-[#FAFAFA] text-neutral-700 border-neutral-200 hover:border-brand-orange/50"
                }`}
              >
                {slide.title}
              </button>
            ))}
          </div>

          {/* Slider Navigation Controls */}
          <div className="flex items-center justify-between max-w-5xl mx-auto mb-3">
            <span className="text-xs font-bold text-neutral-500">
              Menampilkan <strong className="text-brand-orange">Kategori {activeSlide + 1}</strong> dari {catalogSlides.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollSlider("left")}
                aria-label="Sebelumnya"
                className="w-9 h-9 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-neutral-700 hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-colors shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollSlider("right")}
                aria-label="Selanjutnya"
                className="w-9 h-9 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-neutral-700 hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-colors shadow-2xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Swipeable Cards */}
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 max-w-5xl mx-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {catalogSlides.map((cat) => (
              <div
                key={cat.id}
                className="snap-center shrink-0 w-[85vw] sm:w-[330px] md:w-[350px] bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Square / 4:3 Studio Catalog Product Image */}
                  <div className="relative h-56 sm:h-60 w-full bg-[#F8F6F2] overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      unoptimized
                      loading="eager"
                      className="object-cover object-center hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 85vw, 350px"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-brand-orange shadow-xs">
                        {cat.tag}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-base sm:text-lg font-black text-neutral-900 font-display uppercase tracking-tight">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {cat.desc}
                    </p>

                    <div className="pt-1 space-y-1.5">
                      {cat.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-neutral-800 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-neutral-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                        Bahan Aktif Unggulan:
                      </span>
                      <span className="text-[11px] font-bold text-brand-orange">
                        {cat.activeIngredients}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <a
                    href={THANKYOU_URL}
                    className="inline-flex items-center justify-center gap-1.5 w-full py-3 bg-brand-orange text-white rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-xs hover:bg-brand-orange/90 transition-colors"
                  >
                    <span>Buat Produk {cat.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {catalogSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeSlide === i ? "w-7 bg-brand-orange" : "w-2 bg-neutral-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ 5. AKSES COMMUNITY BRAND OWNER (BEAUTY ACADEMY - 3 FOTO RESMI TAMPIL PENUH) ============ */}
      <section className="py-12 sm:py-16 bg-[#FAF8F5] border-b border-neutral-200/60">
        <div className="container-custom px-4">
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 rounded-full text-brand-orange text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              EKSKLUSIF MITRA DREAMLAB
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 uppercase font-display tracking-tight">
              AKSES COMMUNITY BRAND OWNER
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-xl mx-auto">
              Bukan sekadar diproduksi lalu dilepas. Anda otomatis tergabung dalam ekosistem <strong>Dreamlab Beauty Academy</strong> untuk belajar strategi jualan, iklan, dan networking sesama pemilik brand.
            </p>
          </div>

          {/* 3 Official Beauty Academy Event Photos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto mb-8">
            {communityImages.map((img, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-neutral-200/90 shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative h-48 sm:h-52 w-full bg-neutral-100 overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    unoptimized
                    loading="eager"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-brand-orange text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
                      {img.badge}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="text-sm font-extrabold text-neutral-900">
                    {img.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {img.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href={THANKYOU_URL}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-orange text-white rounded-full font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:bg-brand-orange/95 active:scale-95 transition-all shadow-md"
            >
              <span>Gabung Komunitas Brand Owner Dreamlab</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ============ 6. LOGO PARTNER DREAMLAB BERJALAN DINAMIS (TANPA KOTAK, UKURAN BESAR & JELAS) ============ */}
      <section className="py-10 sm:py-14 bg-white border-b border-neutral-100 overflow-hidden">
        <div className="container-custom px-4 mb-4">
          <div className="text-center space-y-1.5">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-brand-orange block">
              PORTFOLIO KLIEN KAMI
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-neutral-900 font-display">
              Brand yang Pernah Diproduksi di Dreamlab
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
              Dipercaya oleh 500+ brand owner di seluruh Indonesia dari klinik kecantikan, influencer, hingga pengusaha baru.
            </p>
          </div>
        </div>

        {/* Continuous Running Marquee Track — Large Clean Logos Without Boxes (Exactly like Homepage LogoScroll) */}
        <div className="relative w-full overflow-hidden py-2">
          {/* Left & Right Soft Fade Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          <div className="dreamlab-marquee-track gap-8 sm:gap-14 md:gap-20 px-4">
            {marqueeBrands.map((brand, i) => (
              <div
                key={`partner-logo-${i}`}
                className="relative h-32 sm:h-40 md:h-44 w-40 sm:w-52 md:w-60 shrink-0 flex items-center justify-center transition-transform duration-300 hover:scale-105"
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
          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold text-neutral-700 bg-[#FAF8F5] px-4 py-1.5 rounded-full border border-neutral-200 shadow-2xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            500+ Brand Telah Sukses Rilis Bersama Dreamlab
          </span>
        </div>
      </section>

      {/* ============ 7. LEGALITAS & SERTIFIKASI PABRIK ============ */}
      <AdsCredibilitySection channel="metaads" />

      {/* ============ 8. HIGH-CONVERSION FINAL CTA BANNER (CLEAN WARM CREAM & DREAMLAB SKY BLUE) ============ */}
      <section className="py-14 sm:py-18 bg-gradient-to-b from-[#F4F9FD] to-[#FFF8EE] border-t border-neutral-200/70 relative overflow-hidden">
        <div className="container-custom px-4 text-center space-y-5 max-w-2xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-brand-orange/10 rounded-full text-brand-orange text-[10px] sm:text-xs font-extrabold uppercase tracking-wider border border-brand-orange/25">
            <Sparkles className="w-3.5 h-3.5" />
            KONSULTASI & ESTIMASI HPP GRATIS
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase font-display tracking-tight leading-tight text-neutral-900">
            Siap Wujudkan Brand Impian Anda{" "}
            <span className="text-brand-orange">Hanya Dalam 3 Bulan?</span>
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-lg mx-auto">
            Diskusikan ide produk, estimasi modal, dan klaim sampel formula bersama tim ahli Dreamlab hari ini tanpa komitmen awal.
          </p>

          <div className="pt-2">
            <a
              href={THANKYOU_URL}
              className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-9 py-4 bg-brand-orange text-white rounded-full font-black text-sm sm:text-base uppercase tracking-wider hover:bg-neutral-900 transition-all shadow-[0_10px_28px_rgba(243,146,0,0.35)] active:scale-95"
            >
              <MessageCircle className="w-5 h-5 fill-current shrink-0" />
              <span>Hubungi Tim Dreamlab di WhatsApp</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>
      </section>

      {/* ============ STICKY MOBILE BOTTOM CONVERSION BAR ============ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] md:hidden">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="flex flex-col">
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Tim Konsultan Online
            </span>
            <span className="text-xs font-black text-neutral-900">
              Buat Brand Hanya 3 Bulan
            </span>
          </div>
          <a
            href={THANKYOU_URL}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] text-white rounded-full font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-transform shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-current shrink-0" />
            <span>Chat WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
