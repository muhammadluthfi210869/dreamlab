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
  FileCheck2,
  Boxes,
  Zap,
  Check
} from "lucide-react";
import { useMetaAdsCtaPixel } from "@/lib/meta-ads-pixel";
import { AdsCredibilitySection } from "@/components/landing-pages/AdsCredibilitySection";
import { AdsBeautyAcademySection } from "@/components/landing-pages/AdsBeautyAcademySection";

const THANKYOU_URL = "/ads/thankyou/metaads/?p=meta-bof";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const bofPillars = [
  {
    icon: DollarSign,
    badge: "TRANSPARANSI BIAYA",
    title: "HPP Jelas Tanpa Biaya Tersembunyi",
    desc: "Perhitungan biaya bahan aktif, kemasan, hingga uji lab kami paparkan transparan sejak awal. Anda tahu persis margin keuntungan sebelum produksi dimulai.",
  },
  {
    icon: Boxes,
    badge: "SCALE-UP AMAN",
    title: "MOQ Fleksibel Sesuai Skala Bisnis",
    desc: "Mulai produksi tanpa membebani arus kas. Kuota Minimum Order Quantity (MOQ) disesuaikan agar sisa modal bisa dialokasikan maksimal ke iklan dan promosi.",
  },
  {
    icon: Zap,
    badge: "PROSES CEPAT",
    title: "Sampel Cepat & Formula Eksklusif",
    desc: "Tim formulator R&D berpengalaman siap meracik sampel dalam hitungan hari. Formula 1:1 eksklusif milik brand Anda, bukan racikan template massal.",
  },
  {
    icon: FileCheck2,
    badge: "LEGALITAS ALL-IN",
    title: "100% BPOM, Halal & HKI Diurus Lengkap",
    desc: "Semua urusan pendaftaran notifikasi BPOM, uji laboratorium, sertifikasi Halal, hingga pendaftaran hak paten merek HKI kami tangani secara paralel.",
  },
];

const timelineSteps = [
  {
    step: "01",
    title: "Konsultasi & Target HPP",
    desc: "Diskusikan ide produk, target market, dan budget yang Anda miliki dengan tim Business Development kami.",
  },
  {
    step: "02",
    title: "Pembuatan Sampel Formula R&D",
    desc: "Tim R&D meracik sampel khusus untuk Anda coba (tekstur, wangi, sensasi rasa, dan khasiat) sampai cocok.",
  },
  {
    step: "03",
    title: "Registrasi BPOM & Legalitas",
    desc: "Pengajuan izin edar BPOM resmi, sertifikasi Halal, serta pendaftaran merk HKI kami urus secara paralel.",
  },
  {
    step: "04",
    title: "Produksi Massal CPKB Grade A",
    desc: "Produk diproduksi di fasilitas bersertifikat CPKB dengan standar higienitas dan pengawasan mutu (QC) ketat.",
  },
  {
    step: "05",
    title: "Produk Siap Kirim & Siap Jual",
    desc: "Produk dikemas rapi, disegel, dan siap dikirim ke gudang Anda untuk dipasarkan ke ribuan pembeli.",
  },
];

const readyCategories = [
  {
    title: "Skincare Series (Face Care)",
    highlight: "Kategori Paling Laris",
    items: ["Brightening & Anti-Aging Serum", "Barrier Repair Ceramide Moisturizer", "Airy Matte / Glow Finish Sunscreen", "Low pH Gentle Cleanser & Toner"],
    usp: "Formulasi bahan aktif premium bersertifikasi uji lab klinis.",
  },
  {
    title: "Perfumed Body Care",
    highlight: "Volume Penjualan Tinggi",
    items: ["Tone-Up Glowing Body Serum", "Underarm Whitening Deo Serum", "Aromatherapy Perfumed Body Wash", "Exfoliating Brightening Body Scrub"],
    usp: "Wangi mewah tahan lama dengan tekstur ringan tidak lengket.",
  },
  {
    title: "Fine Fragrance (Parfum)",
    highlight: "Margin Sangat Tebal",
    items: ["Extrait de Parfum (Ketahanan 12+ jam)", "Eau de Parfum (EDP) Niche Character", "Hair & Body Fragrance Mist", "Linen & Pillow Relaxing Spray"],
    usp: "Konsentrasi bibit wangi tinggi tanpa aroma alkohol menyengat.",
  },
  {
    title: "Hair & Scalp Treatment",
    highlight: "Tren Pasar Meningkat Pesat",
    items: ["Anti-Hairfall Scalp Tonic", "Hair Growth Booster Serum", "Keratin Nourishing Hair Mask", "Non-Greasy Hair Perfume Oil"],
    usp: "Kombinasi bahan aktif modern (Redensyl, Biotin, Rosemary).",
  },
];

export default function MetaAdsBofLandingPage() {
  useMetaAdsCtaPixel("Meta Ads BOF");

  return (
    <div className="landing-page-ads min-h-screen bg-[#FAF9F6] text-brand-black font-sans selection:bg-brand-orange selection:text-white pb-20">
      
      {/* ============ FLOATING WHATSAPP CTA ============ */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href={THANKYOU_URL}
          className="flex items-center gap-3 px-5 py-3.5 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group border border-white/20"
          aria-label="Konsultasi Maklon di WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-current shrink-0" />
          <span className="text-xs sm:text-sm font-black tracking-wide uppercase font-onest pr-1">
            Mulai Produksi
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
              Pabrik Maklon Resmi BPOM & CPKB Grade A
            </span>
          </div>
          <a
            href={THANKYOU_URL}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-orange text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-brand-orange/90 transition-all shadow-sm"
          >
            Klaim Sampel Formula
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
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/60" />
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
                SIAP PRODUKSI BULAN INI — BPOM & CPKB RESMI
              </span>
            </motion.div>

            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] uppercase font-display"
              variants={fadeUp}
            >
              Siap Luncurkan Brand Kosmetik Anda?{' '}
              <span className="text-brand-orange">Maklon Resmi BPOM, MOQ Fleksibel & Sampel Kilat</span>
            </motion.h1>

            <motion.p 
              className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed max-w-2xl font-normal"
              variants={fadeUp}
            >
              Eksekusi rencana bisnis Anda sekarang. Tim R&D Dreamlab siap meracik sampel formula eksklusif Anda, izin edar BPOM all-in, HPP transparan, hingga produk siap kirim ke gudang Anda.
            </motion.p>

            {/* Checklist Highlights */}
            <motion.div 
              className="grid sm:grid-cols-2 gap-3 pt-2 max-w-xl text-xs sm:text-sm text-white/90"
              variants={fadeUp}
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-orange shrink-0" />
                <span>Free Pembuatan Sampel R&D</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-orange shrink-0" />
                <span>Izin BPOM, Halal & HKI All-In</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-orange shrink-0" />
                <span>MOQ Fleksibel Terjangkau</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-orange shrink-0" />
                <span>Free Desain Logo & Kemasan</span>
              </div>
            </motion.div>

            <motion.div className="pt-4" variants={fadeUp}>
              <a
                href={THANKYOU_URL}
                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-brand-orange text-white rounded-full font-black text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-xl hover:shadow-brand-orange/30 hover:scale-[1.02] active:scale-95"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                Klaim Sampel & Konsultasi Produksi
              </a>
              <p className="text-[11px] text-white/60 mt-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                Diskusi langsung dengan Tim Business Development (Respon Cepat)
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============ 2. KEUNGGULAN EKSEKUSI & TIMELINE ============ */}
      <section className="py-20 md:py-24 bg-white border-b border-neutral-100">
        <div className="container-custom">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-orange/10 rounded-full text-brand-orange text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              EFISIENSI & KEPATUHAN
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-black tracking-tight leading-[1.15] uppercase font-display">
              Eksekusi Cepat, Legalitas Aman,{' '}
              <span className="text-brand-orange">Tanpa Biaya Siluman</span>
            </h2>
            <p className="text-sm md:text-base text-neutral-600 leading-relaxed font-normal">
              Kami memahami kecepatan dan kejelasan biaya adalah kunci utama peluncuran produk Anda. Dreamlab menjamin proses yang transparan dari hulu ke hilir.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-16">
            {bofPillars.map((item, idx) => {
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

          {/* Timeline 5 Langkah */}
          <div className="bg-[#FAF9F6] rounded-2xl p-6 sm:p-8 md:p-10 border border-neutral-200/80 max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] uppercase font-bold text-brand-orange tracking-widest font-onest block">
                TIMELINE PRODUKSI JELAS
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-brand-black uppercase font-display tracking-tight">
                Alur Maklon 5 Langkah Hingga Produk Siap Jual
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-neutral-200/80 space-y-2.5 relative">
                  <span className="text-2xl font-black text-brand-orange font-display block">
                    {step.step}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-brand-black leading-snug">
                    {step.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-neutral-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <a
                href={THANKYOU_URL}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-orange text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-brand-orange/90 transition-all shadow-md"
              >
                Hitung HPP & Konsultasikan MOQ Sekarang
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ============ 3. APA YANG MAU DIBIKIN (KATALOG SIAP PRODUKSI) ============ */}
      <section className="py-20 md:py-24 bg-[#FAF9F6] border-b border-neutral-100">
        <div className="container-custom">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-orange/10 rounded-full text-brand-orange text-xs font-bold uppercase tracking-wider">
              <FlaskConical className="w-3.5 h-3.5" />
              KATALOG SIAP PRODUKSI
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-black tracking-tight leading-[1.15] uppercase font-display">
              Pilihan Formula Produk{' '}
              <span className="text-brand-orange">Unggulan Brand Anda</span>
            </h2>
            <p className="text-sm md:text-base text-neutral-600 leading-relaxed font-normal">
              Seluruh produk kami dapat disesuaikan tekstur, wangi, warna, dan bahan aktifnya secara privat. 1 Brand = 1 Formula unik milik Anda.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto mb-12">
            {readyCategories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 space-y-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-brand-orange tracking-widest bg-brand-orange/10 px-3 py-1 rounded-full">
                      {cat.highlight}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-brand-black uppercase font-display tracking-tight">
                    {cat.title}
                  </h3>

                  <ul className="space-y-2 text-xs sm:text-sm text-neutral-700">
                    {cat.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-neutral-100 space-y-3">
                  <p className="text-[11px] text-neutral-500 italic">
                    {cat.usp}
                  </p>
                  <a
                    href={THANKYOU_URL}
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-neutral-100 hover:bg-brand-orange hover:text-white text-brand-black rounded-lg font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Request Sampel Kategori Ini
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-brand-black text-white rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto text-center space-y-4 shadow-xl">
            <h3 className="text-base sm:text-lg font-black text-brand-orange uppercase font-display">
              Ingin Custom Formula Khusus Sesuai Benchmark Produk Impian?
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto">
              Kirimkan referensi tekstur, aroma, atau bahan aktif yang Anda inginkan. Formulator Dreamlab siap mereplikasi dan mengoptimalkannya dengan standar legalitas BPOM.
            </p>
            <a
              href={THANKYOU_URL}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-orange text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-brand-orange/90 transition-all shadow-md"
            >
              Klaim Sampel Formula Custom Anda
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </section>

      {/* ============ 4. BEAUTY ACADEMY & BRAND COMMUNITY ============ */}
      <AdsBeautyAcademySection
        categoryName="Maklon Kosmetik"
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
            AMBIL KEPUTUSAN HARI INI
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] uppercase font-display">
            Waktunya Meluncurkan Brand Kosmetik Anda Sendiri
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-xl mx-auto">
            Jangan tunda lagi saat pasar sedang berkembang pesat. Hubungi kami sekarang untuk klaim sampel formula dan amankan slot produksi Anda bulan ini.
          </p>

          <div className="pt-4">
            <a
              href={THANKYOU_URL}
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 bg-white text-brand-orange rounded-full font-black text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              Klaim Sampel & Jadwalkan Konsultasi
            </a>
          </div>

          <p className="text-[11px] text-white/70">
            Respon cepat tim Dreamlab • 100% Bebas Biaya Konsultasi Awal
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

