"use client";

import React from "react";
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
  Clock,
  Layers,
  HeartHandshake
} from "lucide-react";
import { useMetaAdsCtaPixel } from "@/lib/meta-ads-pixel";
import { AdsCredibilitySection } from "@/components/landing-pages/AdsCredibilitySection";
import { AdsBeautyAcademySection } from "@/components/landing-pages/AdsBeautyAcademySection";

const THANKYOU_URL = "/ads/thankyou/metaads/?p=meta-mof";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const marketPotentials = [
  {
    icon: DollarSign,
    badge: "MARGIN TINGGI",
    title: "Margin Keuntungan 60% – 80%",
    desc: "HPP produksi yang efisien memungkinkan Anda menentukan harga jual dengan margin tebal. Ruang profit luas untuk biaya iklan, endorsement, dan scale-up tim.",
  },
  {
    icon: TrendingUp,
    badge: "PASAR TERUS TUMBUH",
    title: "Pasar Kosmetik Ratusan Triliun",
    desc: "Industri kecantikan Indonesia diproyeksikan terus tumbuh di atas 10% setiap tahunnya. Kesadaran merawat diri konsumen lokal kini berada di level tertinggi.",
  },
  {
    icon: ShoppingBag,
    badge: "ERA SOCIAL COMMERCE",
    title: "Viralitas TikTok & Live Selling",
    desc: "Brand baru tidak perlu toko fisik mewah. Dengan strategi konten, live streaming, dan affiliate marketing, produk bisa terjual ribuan pcs dari hari pertama peluncuran.",
  },
  {
    icon: ShieldCheck,
    badge: "NOL RESIKO PABRIK",
    title: "Tanpa Biaya Mesin & Laboratorium",
    desc: "Anda tidak perlu investasi pabrik bernilai miliaran rupiah atau menggaji formulator. Dreamlab menjadi pabrik dan R&D eksklusif di belakang brand Anda.",
  },
];

const categories = [
  {
    title: "Skincare & Face Care",
    tag: "Kategori Paling Dicari",
    desc: "Mulai dari Serum Pencerah, Barrier Repair Moisturizer, Glowing Sunscreen, Low pH Facial Wash, hingga Gentle Exfoliating Toner.",
    activeIngredients: "SymWhite 377, Ceramide Complex, PDRN, Niacinamide, Centella Asiatica",
    image: "/new asset/landing page/skincare.webp",
  },
  {
    title: "Parfum & Luxury Fragrance",
    tag: "High Repeat Order",
    desc: "Eau de Parfum (EDP) & Extrait de Parfum dengan ketahanan 8–12 jam+. Karakter aroma eksklusif dari gourmand, woody, powdery hingga fresh fruity.",
    activeIngredients: "Bibit parfum premium Eropa, long-lasting fixative formula, BPOM certified",
    image: "/new asset/landing page/parfum.webp",
  },
  {
    title: "Body Care & Underarm Treatment",
    tag: "Volume Penjualan Cepat",
    desc: "Body Serum Instant Tone-Up, Perfumed Body Lotion, Body Scrub Lulur Mewah, serta Brightening Underarm Deodorant Serum.",
    activeIngredients: "Glutathione, Alpha Arbutin, Shea Butter, AHA/BHA Underarm Care",
    image: "/new asset/landing page/LP_MAKLON_KOSMETIK_DREAMLAB.png",
  },
  {
    title: "Hair Care & Scalp Health",
    tag: "Niche Market Meledak",
    desc: "Shampoo Anti-Rontok, Hair Growth Tonic, Hair Mask Treatment, hingga Hair Fragrance Mist yang tidak membuat lepek.",
    activeIngredients: "Redensyl, Keratin Complex, Biotin, Rosemary Extract",
    image: "/new asset/landing page/haircare.png",
  },
];

export default function MetaAdsMofLandingPage() {
  useMetaAdsCtaPixel("Meta Ads MOF");

  return (
    <div className="landing-page-ads min-h-screen bg-[#FAF9F6] text-brand-black font-sans selection:bg-brand-orange selection:text-white pb-20">
      
      {/* ============ FLOATING WHATSAPP CTA ============ */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href={THANKYOU_URL}
          className="flex items-center gap-3 px-5 py-3.5 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group border border-white/20"
          aria-label="Konsultasi Peluang Brand di WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-current shrink-0" />
          <span className="text-xs sm:text-sm font-black tracking-wide uppercase font-onest pr-1">
            Konsultasi Sekarang
          </span>
        </a>
      </div>

      {/* ============ HEADER TOP BAR ============ */}
      <header className="w-full bg-white border-b border-neutral-100 py-3.5 sticky top-0 z-40 shadow-xs">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-xl tracking-tight text-brand-black uppercase">
              DREAM<span className="text-brand-orange">LAB</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-neutral-400 border-l border-neutral-200 pl-2">
              Pabrik Maklon & Inkubator Brand Kosmetik
            </span>
          </div>
          <a
            href={THANKYOU_URL}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-orange text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-brand-orange/90 transition-all shadow-sm"
          >
            Konsultasi Gratis
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* ============ 1. HERO SECTION ============ */}
      <section className="relative overflow-hidden bg-brand-black text-white pt-12 pb-20 md:py-28 lg:py-32">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="/images/landing/dreamlab_hero_lp.png"
            alt="Dreamlab Maklon Kosmetik"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/50" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div 
            className="max-w-3xl space-y-6"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-orange/20 border border-brand-orange/40 rounded-full backdrop-blur-md"
              variants={fadeUp}
            >
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[10px] sm:text-xs font-black tracking-widest text-brand-orange uppercase font-onest">
                PELUANG BISNIS KOSMETIK & SKINCARE 2026/2027
              </span>
            </motion.div>

            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] uppercase font-display"
              variants={fadeUp}
            >
              Punya Ide Produk Kecantikan?{' '}
              <span className="text-brand-orange">Waktunya Wujudkan Brand Impian Anda</span>{' '}
              Bersama Dreamlab
            </motion.h1>

            <motion.p 
              className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed max-w-2xl font-normal"
              variants={fadeUp}
            >
              Tidak perlu pabrik miliaran rupiah atau pusing soal legalitas. Dreamlab mendampingi Anda dari riset formula eksklusif, sertifikasi BPOM & Halal, desain kemasan mewah, hingga strategi pemasaran sampai produk laris manis di pasaran.
            </motion.p>

            {/* Micro stats banner */}
            <motion.div 
              className="grid grid-cols-3 gap-3 pt-2 max-w-lg border-y border-white/10 py-3"
              variants={fadeUp}
            >
              <div>
                <span className="block text-xl sm:text-2xl font-black text-brand-orange font-display">500+</span>
                <span className="text-[10px] sm:text-xs text-white/70 font-medium">Brand Telah Lahir</span>
              </div>
              <div className="border-x border-white/10 px-3">
                <span className="block text-xl sm:text-2xl font-black text-brand-orange font-display">1 : 1</span>
                <span className="text-[10px] sm:text-xs text-white/70 font-medium">Formula Eksklusif</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-black text-brand-orange font-display">100%</span>
                <span className="text-[10px] sm:text-xs text-white/70 font-medium">Resmi Izin BPOM</span>
              </div>
            </motion.div>

            <motion.div className="pt-4" variants={fadeUp}>
              <a
                href={THANKYOU_URL}
                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-brand-orange text-white rounded-full font-black text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-xl hover:shadow-brand-orange/30 hover:scale-[1.02] active:scale-95"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                Konsultasi Peluang Bisnis Gratis
              </a>
              <p className="text-[11px] text-white/60 mt-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                Diskusi santai via WhatsApp bersama Business Development Dreamlab
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============ 2. POTENSI BISNIS KOSMETIK ============ */}
      <section className="py-20 md:py-24 bg-white border-b border-neutral-100">
        <div className="container-custom">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-orange/10 rounded-full text-brand-orange text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              POTENSI BISNIS KECANTIKAN
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-black tracking-tight leading-[1.15] uppercase font-display">
              Mengapa Sekarang Waktu Terbaik Membangun{' '}
              <span className="text-brand-orange">Brand Kosmetik Sendiri?</span>
            </h2>
            <p className="text-sm md:text-base text-neutral-600 leading-relaxed font-normal">
              Jangan hanya menjadi konsumen atau reseller produk orang lain dengan margin tipis. Memiliki brand sendiri memberi Anda kendali penuh atas harga, profit, dan aset bisnis masa depan.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-12">
            {marketPotentials.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="bg-[#FAF9F6] border border-neutral-200/80 rounded-2xl p-6 hover:shadow-lg hover:border-brand-orange/30 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="inline-block text-[10px] font-black tracking-wider text-brand-orange uppercase font-onest">
                      {item.badge}
                    </span>
                    <h3 className="text-base font-bold text-brand-black leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Perbandingan: Sendiri vs Bersama Dreamlab */}
          <div className="bg-[#FAF9F6] rounded-2xl p-6 sm:p-8 md:p-10 border border-neutral-200/80 max-w-4xl mx-auto space-y-6">
            <h3 className="text-lg sm:text-xl font-black text-brand-black uppercase text-center font-display tracking-tight">
              Bandingkan: Memulai Sendiri vs Didampingi Dreamlab
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50/60 border border-red-200/70 rounded-xl p-5 space-y-3">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
                  ✕ Jika Mencoba Sendiri
                </span>
                <ul className="text-xs sm:text-sm text-neutral-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold shrink-0">•</span>
                    Investasi mesin & lab hingga miliaran rupiah
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold shrink-0">•</span>
                    Pusing mengurus izin BPOM dan uji laboratorium sendiri
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold shrink-0">•</span>
                    Resiko formula tidak stabil, pecah, atau berjamur
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold shrink-0">•</span>
                    Bingung strategi pemasaran dan boncos di iklan
                  </li>
                </ul>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-xl p-5 space-y-3">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  ✓ Bersama Dreamlab
                </span>
                <ul className="text-xs sm:text-sm text-neutral-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    MOQ fleksibel terjangkau, bebas modal pabrik
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    Legalitas 100% all-in (BPOM, Halal MUI, HKI Merek)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    1 Klien = 1 Formula unik racikan R&D berpengalaman
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    Mentoring bisnis eksklusif di Dreampreneur Beauty Academy
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center pt-2">
              <a
                href={THANKYOU_URL}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-orange text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-brand-orange/90 transition-all shadow-md"
              >
                Diskusikan Potensi Brand Anda Sekarang
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ============ 3. APA YANG MAU DIBIKIN (KATALOG PRODUK) ============ */}
      <section className="py-20 md:py-24 bg-[#FAF9F6] border-b border-neutral-100">
        <div className="container-custom">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-orange/10 rounded-full text-brand-orange text-xs font-bold uppercase tracking-wider">
              <FlaskConical className="w-3.5 h-3.5" />
              KAPABILITAS FORMULASI
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-black tracking-tight leading-[1.15] uppercase font-display">
              Kategori Produk Apa yang Ingin{' '}
              <span className="text-brand-orange">Anda Ciptakan?</span>
            </h2>
            <p className="text-sm md:text-base text-neutral-600 leading-relaxed font-normal">
              Dari skincare wajah berformula aktif, parfum wangi mewah kelas dunia, hingga bodycare dan haircare. Tim formulator kami siap meracik konsep sesuai keinginan Anda.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto mb-12">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 sm:h-56 w-full bg-neutral-100 overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute top-3 left-3 bg-brand-black/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    {cat.tag}
                  </div>
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-brand-black uppercase font-display tracking-tight">
                      {cat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                      Pilihan Bahan Aktif Tren:
                    </span>
                    <span className="text-xs font-semibold text-brand-orange">
                      {cat.activeIngredients}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-brand-orange/30 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto text-center space-y-4 shadow-sm">
            <h3 className="text-base sm:text-lg font-black text-brand-black uppercase font-display">
              Punya Ide Formula Unik yang Belum Ada di Pasaran?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto">
              Tim R&D Dreamlab siap melakukan riset formula custom khusus untuk brand Anda. 1 Klien = 1 Formula eksklusif tanpa duplikasi dengan brand lain.
            </p>
            <a
              href={THANKYOU_URL}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-orange text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-brand-orange/90 transition-all shadow-md"
            >
              Konsultasikan Pilihan Formula Anda
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </section>

      {/* ============ 4. BEAUTY ACADEMY & BRAND COMMUNITY ============ */}
      <AdsBeautyAcademySection
        categoryName="Kosmetik & Skincare"
        onCtaClick={() => {
          window.location.href = THANKYOU_URL;
        }}
      />

      {/* ============ 5. CREDIBILITY & LEGALITAS ============ */}
      <AdsCredibilitySection channel="metaads" />

      {/* ============ 6. FINAL CTA BANNER ============ */}
      <section className="py-20 md:py-24 bg-brand-orange text-white relative overflow-hidden">
        <div className="container-custom text-center relative z-10 space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-white text-[11px] font-bold uppercase tracking-widest backdrop-blur-md">
            LANGKAH AWAL MENJADI BRAND OWNER
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] uppercase font-display">
            Siap Membangun Brand Kosmetik Impian Anda?
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-xl mx-auto">
            Klik tombol di bawah untuk terhubung langsung dengan tim Business Development Dreamlab. Konsultasikan ide produk, perhitungan HPP, dan strategi bisnis Anda tanpa komitmen awal.
          </p>

          <div className="pt-4">
            <a
              href={THANKYOU_URL}
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 bg-white text-brand-orange rounded-full font-black text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              Mulai Konsultasi Gratis Sekarang
            </a>
          </div>

          <p className="text-[11px] text-white/70">
            Respon cepat 1x24 jam di hari kerja • 100% Kerahasiaan Ide Terjaga (NDA)
          </p>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="py-8 bg-brand-black text-white/50 text-center text-xs space-y-1">
        <p className="font-bold uppercase tracking-widest text-white/70">
          PT Karya Impian Laboratoris (Dreamlab)
        </p>
        <p>© 2026 Dreamlab Indonesia. All rights reserved.</p>
      </footer>

    </div>
  );
}

