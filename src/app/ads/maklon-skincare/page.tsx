"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useMetaAdsCtaPixel } from "@/lib/meta-ads-pixel";
import { AdsCredibilitySection } from "@/components/landing-pages/AdsCredibilitySection";

const premiumEase = [0.16, 1, 0.3, 1] as any;

export default function MaklonSkincareAdsLP() {
  const benefits = [
    "FREE Formula Custom",
    "FREE Desain Logo & Kemasan",
    "FREE Pengurusan BPOM & Halal",
    "MOQ Fleksibel",
    "FREE Digital Marketing Support"
  ];

  useMetaAdsCtaPixel("Maklon Skincare");

  return (
    <div className="landing-page-ads min-h-screen bg-[#FAF9F6] text-brand-black font-sans selection:bg-[#FF8A00] selection:text-white">

      {/* 1. HERO - PRESERVED */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white pt-8 lg:pt-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "translate3d(0,0,0)" }}
        >
          <Image
            src="/new asset/background-visual-hero-section/skincare.webp"
            alt="Dreamlab Premium Skincare"
            fill
            priority
            fetchPriority="high"
            decoding="sync"
            className="object-cover"
            sizes="100vw"
            style={{ imageRendering: "auto", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.0 }}
            className="absolute inset-0 bg-gradient-to-r from-white/55 via-white/20 to-transparent z-10 hidden lg:block"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.0 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.45)_0%,transparent_95%)] lg:hidden z-10"
          />
        </motion.div>

        <div className="container-custom relative z-20 w-full">
          <div className="max-w-2xl lg:max-w-3xl">

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="inline-flex items-center gap-3 px-3 py-1 bg-[#FF8A00]/5 rounded-full mb-2.5 md:mb-4 border border-[#FF8A00]/20 backdrop-blur-sm"
            >
              <span className="w-1 h-1 rounded-full bg-[#FF8A00]" />
              <span className="text-[9px] lg:text-[10px] font-black text-[#FF8A00] uppercase tracking-[0.2em] font-onest">
                Dreamlab #JUARAFORMULA
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 1, ease: premiumEase }}
              className="font-extrabold text-brand-black mb-3 md:mb-4 leading-[1.1] tracking-tight uppercase text-[28px] sm:text-[38px] md:text-[48px] lg:text-[64px] xl:text-[72px]"
              style={{ textShadow: '0 0 30px rgba(255,255,255,0.8)' }}
            >
              <span className="text-[#FF8A00]">Mau Buat Brand</span>
              <br />
              <span className="text-[#FF8A00]">Skincare Premium?</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 1 }}
              className="text-xs sm:text-sm text-brand-black/80 lg:text-brand-black/70 font-medium leading-relaxed mb-6 md:mb-8 max-w-xl lg:text-[18px] xl:text-[20px]"
              style={{ textShadow: '0 0 20px rgba(255,255,255,0.5)' }}
            >
              Wujudkan brand skincare yang siap bersaing di market melalui formula inovatif, custom ingredient, dan pendampingan dari awal hingga produk siap dipasarkan.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="flex flex-wrap gap-3 mb-8 max-w-2xl"
            >
              {benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#FF8A00]/15 px-4 py-2.5 rounded-xl shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#FF8A00] shrink-0" />
                  <span className="text-[12px] sm:text-sm font-bold text-brand-black/90 tracking-wide font-onest">
                    {benefit}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9, duration: 0.8 }}
              className="flex flex-col items-start gap-3"
            >
              <a
                href="/ads/thankyou/metaads/"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-[#FF8A00] hover:bg-brand-black text-white font-bold py-4 px-10 rounded-xl transition-all duration-500 shadow-[0_15px_30px_rgba(246,145,30,0.15)] hover:-translate-y-1"
              >
                <span className="uppercase tracking-[0.2em] text-[10px] font-onest">KONSULTASIKAN BRAND ANDA SEKARANG</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </motion.div>

          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 1 }}
          className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10"
        />
      </section>

      {/* 2. COUNTER */}
      <section className="bg-white py-12 md:py-16 border-b border-neutral-100 relative z-20">
        <div className="container-custom max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 items-center">
            <div className="flex flex-col items-center justify-center md:border-r border-neutral-200 py-4">
              <span className="text-[44px] md:text-[56px] font-extrabold text-[#2F6BFF] leading-none mb-2 font-display">500+</span>
              <span className="text-[13px] md:text-[15px] font-bold text-brand-black uppercase tracking-widest text-center">BRAND TELAH BEKERJA SAMA</span>
            </div>
            <div className="flex flex-col items-center justify-center py-4">
              <span className="text-[44px] md:text-[56px] font-extrabold text-[#2F6BFF] leading-none mb-2 font-display">1000+</span>
              <span className="text-[13px] md:text-[15px] font-bold text-brand-black uppercase tracking-widest text-center">PRODUK TELAH DIKEMBANGKAN</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT CATALOG */}
      <section className="bg-[#FAF9F6] py-16 md:py-24">
        <div className="container-custom px-4">
          <div className="text-center mb-12">
            <span className="text-[10px] md:text-[11px] font-black tracking-[0.25em] text-[#FF8A00] uppercase font-onest mb-3 block">
              PILIH KATEGORI PRODUK
            </span>
            <h2 className="text-3xl md:text-[40px] font-black text-brand-black tracking-tight leading-[1.1] uppercase font-display mb-4">
              PRODUK BEAUTY YANG BISA<br />
              <span className="text-[#2F6BFF]">ANDA KEMBANGKAN</span>
            </h2>
            <p className="text-sm md:text-base text-neutral-500 max-w-2xl mx-auto">
              Mulai dari skincare hingga parfum, kembangkan produk sesuai konsep dan target market brand Anda.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-neutral-100 shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_35px_rgba(0,0,0,0.15)] border border-neutral-200/80 transition-all duration-300 hover:-translate-y-1">
              <Image src="/assets/landing-skincare/catalog-skincare.jpg" alt="Skincare" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 via-40% to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 text-white drop-shadow-md">
                <h3 className="text-lg md:text-2xl font-black uppercase tracking-wide mb-1 md:mb-2 font-display text-white !text-white drop-shadow" style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>SKINCARE</h3>
                <p className="text-xs md:text-sm text-white/90 leading-relaxed font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>Serum, Moisturizer, Sunscreen, Facial Wash, Mask</p>
              </div>
            </div>
            
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-neutral-100 shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_35px_rgba(0,0,0,0.15)] border border-neutral-200/80 transition-all duration-300 hover:-translate-y-1">
              <Image src="/assets/landing-skincare/catalog-bodycare.jpg" alt="Body Care" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 via-40% to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 text-white drop-shadow-md">
                <h3 className="text-lg md:text-2xl font-black uppercase tracking-wide mb-1 md:mb-2 font-display text-white !text-white drop-shadow" style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>BODY CARE</h3>
                <p className="text-xs md:text-sm text-white/90 leading-relaxed font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>Body Lotion, Body Serum, Body Scrub, Body Wash</p>
              </div>
            </div>

            <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-neutral-100 shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_35px_rgba(0,0,0,0.15)] border border-neutral-200/80 transition-all duration-300 hover:-translate-y-1">
              <Image src="/assets/landing-skincare/catalog-parfum.jpg" alt="Parfum" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 via-40% to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 text-white drop-shadow-md">
                <h3 className="text-lg md:text-2xl font-black uppercase tracking-wide mb-1 md:mb-2 font-display text-white !text-white drop-shadow" style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>PARFUM</h3>
                <p className="text-xs md:text-sm text-white/90 leading-relaxed font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>Extrait de Parfum, Eau de Parfum, Eau de Toilette, Body Mist</p>
              </div>
            </div>

            <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-neutral-100 shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_35px_rgba(0,0,0,0.15)] border border-neutral-200/80 transition-all duration-300 hover:-translate-y-1">
              <Image src="/assets/landing-skincare/catalog-babycare.jpg" alt="Baby Care" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 via-40% to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 text-white drop-shadow-md">
                <h3 className="text-lg md:text-2xl font-black uppercase tracking-wide mb-1 md:mb-2 font-display text-white !text-white drop-shadow" style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>BABY CARE</h3>
                <p className="text-xs md:text-sm text-white/90 leading-relaxed font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>Baby Lotion, Baby Wash, Baby Oil, Baby Shampoo</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 md:mt-16">
            <a href="/" target="_self" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#2F6BFF] text-[#2F6BFF] rounded-xl font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-[#2F6BFF] hover:text-white transition-all duration-300">
              EXPLORE CATALOG <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 4. 5 LANGKAH MUDAH */}
      <section className="bg-white py-16 md:py-24 border-t border-neutral-100">
        <div className="container-custom px-4">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-[10px] md:text-[11px] font-black tracking-[0.25em] text-[#FF8A00] uppercase font-onest mb-3 block">
              ALUR PENGEMBANGAN
            </span>
            <h2 className="text-3xl md:text-[40px] font-black text-brand-black tracking-tight leading-[1.1] uppercase font-display mb-4">
              5 LANGKAH MUDAH<br />
              <span className="text-[#2F6BFF]">WUJUDKAN BRAND SKINCARE ANDA</span>
            </h2>
            <p className="text-sm md:text-base text-neutral-500 max-w-2xl mx-auto">
              Dari ide hingga siap dikembangkan, setiap tahap didampingi bersama Dreamlab.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-100 shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.22)] border border-neutral-200/80 transition-all duration-400 hover:-translate-y-1">
              <Image src="/assets/maklon-parfum/consultation.webp" alt="Konsultasi" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E36]/95 via-[#0F1E36]/60 via-45% to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white drop-shadow-md">
                <span className="text-xs font-black tracking-widest text-white mb-2 block font-onest drop-shadow" style={{ color: "#ffffff" }}>STEP 01</span>
                <h3 className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display text-white !text-white drop-shadow" style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>KONSULTASI BRAND & TARGET MARKET</h3>
                <p className="text-[13px] text-white/95 leading-relaxed font-medium drop-shadow-sm" style={{ color: "rgba(255,255,255,0.95)" }}>Diskusikan konsep produk, target market, positioning, dan benefit yang ingin dikembangkan.</p>
              </div>
            </div>
            
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-100 shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.22)] border border-neutral-200/80 transition-all duration-400 hover:-translate-y-1">
              <Image src="/assets/maklon-parfum/sample.webp" alt="Formula & Sample" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E36]/95 via-[#0F1E36]/60 via-45% to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white drop-shadow-md">
                <span className="text-xs font-black tracking-widest text-white mb-2 block font-onest drop-shadow" style={{ color: "#ffffff" }}>STEP 02</span>
                <h3 className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display text-white !text-white drop-shadow" style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>CUSTOM FORMULA & SAMPLE</h3>
                <p className="text-[13px] text-white/95 leading-relaxed font-medium drop-shadow-sm" style={{ color: "rgba(255,255,255,0.95)" }}>Tim R&D mengembangkan formula dan sample sesuai kebutuhan serta karakter brand Anda.</p>
              </div>
            </div>

            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-100 shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.22)] border border-neutral-200/80 transition-all duration-400 hover:-translate-y-1">
              <Image src="/assets/maklon-parfum/legal-design.webp" alt="Legalitas & Desain" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E36]/95 via-[#0F1E36]/60 via-45% to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white drop-shadow-md">
                <span className="text-xs font-black tracking-widest text-white mb-2 block font-onest drop-shadow" style={{ color: "#ffffff" }}>STEP 03</span>
                <h3 className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display text-white !text-white drop-shadow" style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>LEGALITAS & DESAIN</h3>
                <p className="text-[13px] text-white/95 leading-relaxed font-medium drop-shadow-sm" style={{ color: "rgba(255,255,255,0.95)" }}>Setelah formula disetujui, proses dilanjutkan ke legalitas dan desain kemasan.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:px-24 md:px-12">
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[16/9] bg-neutral-100 shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.22)] border border-neutral-200/80 transition-all duration-400 hover:-translate-y-1">
              <Image src="/assets/maklon-parfum/production.webp" alt="Produksi" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E36]/95 via-[#0F1E36]/60 via-45% to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white drop-shadow-md">
                <span className="text-xs font-black tracking-widest text-white mb-2 block font-onest drop-shadow" style={{ color: "#ffffff" }}>STEP 04</span>
                <h3 className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display text-white !text-white drop-shadow" style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>PRODUKSI & QUALITY CONTROL</h3>
                <p className="text-[13px] text-white/95 leading-relaxed font-medium drop-shadow-sm" style={{ color: "rgba(255,255,255,0.95)" }}>Produk masuk ke tahap produksi dan melewati proses quality control.</p>
              </div>
            </div>

            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[16/9] bg-neutral-100 shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.22)] border border-neutral-200/80 transition-all duration-400 hover:-translate-y-1">
              <Image src="/assets/maklon-parfum/delivery.webp" alt="Launching" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E36]/95 via-[#0F1E36]/60 via-45% to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white drop-shadow-md">
                <span className="text-xs font-black tracking-widest text-white mb-2 block font-onest drop-shadow" style={{ color: "#ffffff" }}>STEP 05</span>
                <h3 className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display text-white !text-white drop-shadow" style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>SIAP LAUNCHING</h3>
                <p className="text-[13px] text-white/95 leading-relaxed font-medium drop-shadow-sm" style={{ color: "rgba(255,255,255,0.95)" }}>Produk selesai diproduksi, dipersiapkan untuk dikirim dan mulai dipasarkan.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 md:mt-16">
            <a href="/ads/thankyou/metaads/" className="inline-flex items-center gap-2 px-10 py-5 bg-[#FF8A00] text-white rounded-xl font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-[#D97700] hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-[#FF8A00]/25">
              KONSULTASI BRAND ANDA <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* 5. BEAUTY ACADEMY */}
      <section className="bg-[#FAF9F6] py-16 md:py-24 border-t border-neutral-100">
        <div className="container-custom px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left: Copy & List */}
            <div className="lg:col-span-7">
              <span className="text-[10px] md:text-[11px] font-black tracking-[0.25em] text-[#FF8A00] uppercase font-onest mb-3 block">
                FREE BEAUTYPRENEUR COMMUNITY
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-[36px] font-black text-brand-black tracking-tight leading-[1.15] uppercase font-display mb-4">
                HANYA DI DREAMLAB, BRAND ANDA BUKAN SEKADAR DIPRODUKSI, TETAPI JUGA <span className="text-[#2F6BFF]">DIBIMBING UNTUK BERTUMBUH</span>
              </h2>
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-8">
                Nikmati pendampingan praktis untuk memperkuat branding dan meningkatkan penjualan online.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                {[
                  "Mentoring strategi digital marketing",
                  "Panduan membangun branding dan positioning produk",
                  "Strategi memasarkan dan menjual produk secara online",
                  "Networking bersama komunitas beautypreneur",
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border border-neutral-200/80 p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
                    <span className="w-7 h-7 rounded-full bg-[#FF8A00]/10 text-[#FF8A00] font-black flex items-center justify-center shrink-0 text-sm">
                      ✓
                    </span>
                    <span className="text-xs md:text-sm font-bold text-brand-black/90 leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <a
                  href="/ads/thankyou/metaads/"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF8A00] text-white rounded-xl font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-[#D97700] hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-[#FF8A00]/20"
                >
                  JADI PARTNER DREAMLAB <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right: Collage */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              <div className="col-span-2 relative rounded-2xl overflow-hidden aspect-[16/10] shadow-[0_10px_25px_rgba(0,0,0,0.1)] border border-neutral-200/80 group">
                <Image
                  src="/assets/maklon-parfum/academy-community.webp"
                  alt="Komunitas beautypreneur Dreamlab"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-neutral-200/80 group">
                <Image
                  src="/assets/maklon-parfum/academy-digital-marketing.webp"
                  alt="Mentoring digital marketing"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-neutral-200/80 group">
                <Image
                  src="/assets/maklon-parfum/academy-branding.webp"
                  alt="Sesi branding Dreamlab Academy"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. OUR CLIENT */}
      <section className="bg-[#EEF4FF] py-16 md:py-24 border-t border-blue-100">
        <div className="container-custom px-4 text-center">
          <div className="mb-10 md:mb-16">
            <span className="text-[10px] md:text-[11px] font-black tracking-[0.25em] text-[#FF8A00] uppercase font-onest mb-3 block">
              OUR CLIENT
            </span>
            <h2 className="text-3xl md:text-[40px] font-black text-brand-black tracking-tight leading-[1.1] uppercase font-display max-w-3xl mx-auto">
              DIPERCAYA 500+ BRAND<br />
              UNTUK MENGEMBANGKAN PRODUK BEAUTY
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white p-6 md:p-12 rounded-3xl shadow-xl shadow-blue-900/5">
            <Image src="/assets/maklon-parfum/our-clients.webp" alt="Client Logos" width={980} height={400} className="w-full h-auto mix-blend-multiply" sizes="(max-width: 768px) 100vw, 1000px" />
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="bg-white py-20 md:py-32 border-t border-neutral-100">
        <div className="container-custom px-4 text-center max-w-3xl mx-auto">
          <span className="text-[10px] md:text-[11px] font-black tracking-[0.25em] text-[#FF8A00] uppercase font-onest mb-4 block">
            MULAI DARI IDE ANDA
          </span>
          <h2 className="text-3xl md:text-[48px] lg:text-[56px] font-black text-brand-black tracking-tight leading-[1.1] uppercase font-display mb-6">
            SIAP MEMBANGUN<br />
            <span className="text-[#2F6BFF]">BRAND SKINCARE ANDA?</span>
          </h2>
          <p className="text-sm md:text-lg text-neutral-500 mb-10 md:mb-14">
            Mulai dari konsep hingga custom formula bersama tim Dreamlab.
          </p>
          <a href="/ads/thankyou/metaads/" className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-12 py-5 bg-[#2F6BFF] text-white rounded-xl font-bold uppercase tracking-widest text-sm md:text-base hover:bg-[#2052CC] hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-[#2F6BFF]/25">
            KONSULTASI BRAND ANDA <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* CREDIBILITY / CERTIFICATIONS BANNER */}
      <AdsCredibilitySection channel="metaads" />

      {/* FLOATING WA BUTTON */}
      <a
        href="/ads/thankyou/metaads/"
        className="fixed bottom-6 right-6 z-50 bg-[#25d366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
        aria-label="Contact via WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
        <span className="absolute right-full mr-4 bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-bold shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">Chat with us!</span>
      </a>

    </div>
  );
}
