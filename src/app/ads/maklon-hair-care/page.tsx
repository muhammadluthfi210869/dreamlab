"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowRight, CheckCircle2, Star, ShieldCheck } from "lucide-react";
import { useMetaAdsCtaPixel } from "@/lib/meta-ads-pixel";
import { AdsCredibilitySection } from "@/components/landing-pages/AdsCredibilitySection";
import { homepageData } from "@/data/homepage";
import { aboutData } from "@/data/about-us";

// Dynamically import LogoScroll
const LogoScroll = dynamic(() => import("@/components/LogoScroll"), { 
  ssr: true,
  loading: () => <div className="py-14 bg-white" />
});

const premiumEase = [0.16, 1, 0.3, 1] as any;

export default function MaklonHairCareAdsLP() {
  const benefits = [
    "FREE Formula Custom",
    "FREE Desain Logo & Kemasan",
    "FREE Pengurusan BPOM & Halal",
    "MOQ Fleksibel",
    "FREE Digital Marketing"
  ];

  useMetaAdsCtaPixel("Maklon Hair Care");

  return (
    <div className="landing-page-ads min-h-screen bg-[#FAF9F6] text-brand-black font-sans selection:bg-brand-orange selection:text-white">

      {/* 1. HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-8 lg:pt-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "translate3d(0,0,0)",
          }}
        >
          <Image
            src="/new asset/background-visual-hero-section/haircare.webp"
            alt="Dreamlab Premium Hair Care"
            fill
            priority
            fetchPriority="high"
            decoding="sync"
            className="object-cover"
            sizes="100vw"
            style={{
              imageRendering: "auto",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
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
          <div className="max-w-3xl lg:max-w-4xl">

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="inline-flex items-center gap-3 px-3.5 py-1.5 bg-brand-orange/5 rounded-full mb-4 md:mb-6 border border-brand-orange/20 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[9px] lg:text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] font-onest">
                Dreamlab #JUARAFORMULA
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1, ease: premiumEase }}
              className="font-black text-brand-black mb-4 md:mb-6 leading-[1.1] tracking-tight uppercase text-[32px] sm:text-[42px] md:text-[52px] lg:text-[64px] xl:text-[72px] font-display"
            >
              PUNYA IDE BRAND<br />
              <span className="text-brand-orange">HAIR CARE?</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="text-neutral-600 font-sans text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-2xl"
            >
              Dreamlab membantu Anda mengubah ide menjadi produk siap jual melalui pengembangan formula, inovasi ingredient, desain kemasan, hingga legalitas produk.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="flex flex-wrap gap-3 mb-8 max-w-2xl"
            >
              {benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-brand-orange/15 px-4 py-2.5 rounded-xl shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                  <span className="text-[12px] sm:text-sm font-bold text-brand-black/90 tracking-wide font-onest">
                    {benefit}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6"
            >
              <a
                href="/ads/thankyou/metaads/"
                className="group relative inline-flex items-center justify-center gap-3 bg-brand-orange hover:bg-brand-black text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-[0_12px_24px_rgba(243,146,0,0.2)] hover:shadow-[0_18px_32px_rgba(243,146,0,0.3)] hover:-translate-y-0.5"
              >
                <span className="uppercase tracking-wider text-[11px] font-display">Mulai Konsultasi Gratis</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </motion.div>

          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 1 }}
          className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F9F7F2] to-transparent z-10"
        />
      </section>

      {/* 2. SALON SECTION */}
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28">
        <div className="container-custom w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h2 className="text-brand-black text-[28px] sm:text-[36px] md:text-[44px] lg:text-[50px] font-display font-extrabold leading-[1.12] tracking-tight uppercase mb-6">
                Anda Pemilik Salon? Bangun<br />
                <span className="text-brand-orange">Brand Hair Care Treatment Anda Sendiri!</span>
              </h2>
              <p className="text-neutral-500 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
                Ini Peluang Anda Memiliki Brand Hair Care Sendiri. Ubah pelanggan treatment menjadi pelanggan produk dengan hair care berformula custom yang dirancang khusus untuk kebutuhan salon Anda.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. 5 LANGKAH MUDAH WUJUDKAN BRAND KOSMETIK ANDA */}
      <section className="bg-white py-16 md:py-24 border-t border-neutral-100">
        <div className="container-custom px-4">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-[10px] md:text-[11px] font-black tracking-[0.25em] text-brand-orange uppercase font-onest mb-3 block">
              ALUR PENGEMBANGAN
            </span>
            <h2 className="text-3xl md:text-[40px] font-black text-brand-black tracking-tight leading-[1.1] uppercase font-display mb-4">
              5 LANGKAH MUDAH<br />
              <span className="text-brand-orange">WUJUDKAN BRAND KOSMETIK ANDA</span>
            </h2>
            <p className="text-sm md:text-base text-neutral-500 max-w-2xl mx-auto font-sans">
              Dari ide hingga siap masuk market, setiap tahap didampingi bersama Dreamlab.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-100 shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.22)] border border-neutral-200/80 transition-all duration-400 hover:-translate-y-1">
              <Image src="/assets/maklon-parfum/consultation.webp" alt="Konsultasi Brand" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E36]/95 via-[#0F1E36]/60 via-45% to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white drop-shadow-md">
                <span className="text-xs font-black tracking-widest text-brand-orange mb-2 block font-onest drop-shadow">STEP 01</span>
                <h3 className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display text-white !text-white drop-shadow" style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>KONSULTASI BRAND & TARGET MARKET</h3>
                <p className="text-[13px] text-white/95 leading-relaxed font-medium drop-shadow-sm" style={{ color: "rgba(255,255,255,0.95)" }}>Diskusikan konsep produk, target market, positioning, dan kebutuhan brand Anda bersama formulator Dreamlab.</p>
              </div>
            </div>
            
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-100 shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.22)] border border-neutral-200/80 transition-all duration-400 hover:-translate-y-1">
              <Image src="/assets/maklon-parfum/sample.webp" alt="Formula & Sample" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E36]/95 via-[#0F1E36]/60 via-45% to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white drop-shadow-md">
                <span className="text-xs font-black tracking-widest text-brand-orange mb-2 block font-onest drop-shadow">STEP 02</span>
                <h3 className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display text-white !text-white drop-shadow" style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>CUSTOM FORMULA & SAMPLE</h3>
                <p className="text-[13px] text-white/95 leading-relaxed font-medium drop-shadow-sm" style={{ color: "rgba(255,255,255,0.95)" }}>Tim R&D meracik formula unik dan sample fisik eksklusif (1 Client = 1 Formula) hingga benar-benar sesuai standar Anda.</p>
              </div>
            </div>

            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-100 shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.22)] border border-neutral-200/80 transition-all duration-400 hover:-translate-y-1">
              <Image src="/assets/maklon-parfum/legal-design.webp" alt="Legalitas & Desain" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E36]/95 via-[#0F1E36]/60 via-45% to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white drop-shadow-md">
                <span className="text-xs font-black tracking-widest text-brand-orange mb-2 block font-onest drop-shadow">STEP 03</span>
                <h3 className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display text-white !text-white drop-shadow" style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>LEGALITAS & DESAIN KEMASAN</h3>
                <p className="text-[13px] text-white/95 leading-relaxed font-medium drop-shadow-sm" style={{ color: "rgba(255,255,255,0.95)" }}>Setelah formula disetujui, kami urus notifikasi resmi BPOM, sertifikasi Halal, serta desain label & kemasan produk.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:px-24 md:px-12">
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[16/9] bg-neutral-100 shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.22)] border border-neutral-200/80 transition-all duration-400 hover:-translate-y-1">
              <Image src="/assets/maklon-parfum/production.webp" alt="Produksi CPKB" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E36]/95 via-[#0F1E36]/60 via-45% to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white drop-shadow-md">
                <span className="text-xs font-black tracking-widest text-brand-orange mb-2 block font-onest drop-shadow">STEP 04</span>
                <h3 className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display text-white !text-white drop-shadow" style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>PRODUKSI CPKB & QUALITY CONTROL</h3>
                <p className="text-[13px] text-white/95 leading-relaxed font-medium drop-shadow-sm" style={{ color: "rgba(255,255,255,0.95)" }}>Produksi massal higienis di pabrik berstandar CPKB Grade A dengan pengujian kualitas ketat setiap batch.</p>
              </div>
            </div>

            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[16/9] bg-neutral-100 shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.22)] border border-neutral-200/80 transition-all duration-400 hover:-translate-y-1">
              <Image src="/assets/maklon-parfum/delivery.webp" alt="Siap Jualan" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E36]/95 via-[#0F1E36]/60 via-45% to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white drop-shadow-md">
                <span className="text-xs font-black tracking-widest text-brand-orange mb-2 block font-onest drop-shadow">STEP 05</span>
                <h3 className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display text-white !text-white drop-shadow" style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>SIAP LAUNCHING & JUALAN</h3>
                <p className="text-[13px] text-white/95 leading-relaxed font-medium drop-shadow-sm" style={{ color: "rgba(255,255,255,0.95)" }}>Produk siap dikirim, didukung konsultasi positioning dan strategi pemasaran digital untuk langsung mencetak omset.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 md:mt-16">
            <a href="/ads/thankyou/metaads/" className="inline-flex items-center gap-2 px-10 py-5 bg-brand-orange hover:bg-[#D98200] text-white rounded-full font-bold uppercase tracking-widest text-xs md:text-sm hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-brand-orange/25">
              KONSULTASI BRAND ANDA <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* 4. TESTIMONI PARTNER */}
      <section className="bg-[#FAF9F6] py-16 md:py-24 border-t border-neutral-100">
        <div className="container-custom px-4">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <span className="text-[10px] md:text-[11px] font-black tracking-[0.25em] text-brand-orange uppercase font-onest mb-3 block">
              TESTIMONI PARTNER
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-black tracking-tight leading-[1.1] uppercase font-display mb-4">
              APA KATA <span className="text-brand-orange">PARTNER KAMI</span>
            </h2>
            <p className="text-sm md:text-base text-neutral-500 font-sans max-w-xl mx-auto">
              Testimoni nyata dari pemilik brand dan salon kecantikan yang telah memproduksi produk unggulan mereka di Dreamlab.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white p-7 md:p-8 rounded-2xl border border-neutral-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed italic mb-6 font-sans">
                  &ldquo;Awalnya ragu bikin hair tonic & shampoo sendiri untuk salon. Ternyata tim RnD Dreamlab sangat responsif saat revisi sample sampai hasilnya pas banget. Klien salon kami suka dan penjualan produk salon naik 3x lipat!&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-brand-black font-display uppercase">dr. Kevin H.</h4>
                  <p className="text-xs text-neutral-400 font-medium">Owner Hair & Beauty Clinic</p>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full border border-green-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> BPOM Terbit
                </span>
              </div>
            </div>

            <div className="bg-white p-7 md:p-8 rounded-2xl border border-neutral-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed italic mb-6 font-sans">
                  &ldquo;Formula sulfate-free dan scalp care serum dari Dreamlab bener-bener berkarakter. Nggak cuma wangi, tapi efeknya bikin rambut rontok berkurang nyata. Batch pertama sold out dalam waktu 3 minggu.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-brand-black font-display uppercase">Fiona Angeline</h4>
                  <p className="text-xs text-neutral-400 font-medium">Founder Hair Care Brand</p>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-orange/10 text-brand-orange text-[10px] font-bold rounded-full border border-brand-orange/20">
                  Custom Formula
                </span>
              </div>
            </div>

            <div className="bg-white p-7 md:p-8 rounded-2xl border border-neutral-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed italic mb-6 font-sans">
                  &ldquo;Sebagai pemula, MOQ fleksibel dari Dreamlab sangat membantu kami tes pasar tanpa beban modal besar. Struktur HPP transparan, legalitas beres, dan kami diberi mentoring digital marketing gratis.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-brand-black font-display uppercase">Rian Pratama</h4>
                  <p className="text-xs text-neutral-400 font-medium">Barbershop & Grooming Owner</p>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200">
                  MOQ Fleksibel
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LOGO BERJALAN - DREAMLAB TELAH DIPERCAYA 500+ BRAND */}
      <LogoScroll 
        logos={aboutData.partnerLogos} 
        headline={homepageData.trustedBrands.title}
        subHeadline={homepageData.trustedBrands.subtitle}
      />

      {/* 6. CLOSING CTA — Homepage style background visual */}
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
                Mulai Brand<br />
                <span className="text-brand-orange">Hair Care Hari Ini</span>
              </h2>

              <p className="text-neutral-500 text-sm md:text-base leading-relaxed mb-6 font-sans max-w-lg">
                Chat sekarang - gratis, tanpa komitmen. 3 bulan lagi brandmu sudah bisa jualan.
              </p>

              <div className="rounded-2xl w-fit mt-2 flex flex-col items-start gap-3">
                <a
                  href="/ads/thankyou/metaads/"
                  className="inline-flex items-center justify-center bg-brand-orange hover:bg-[#D98200] hover:scale-[1.03] text-white px-8 py-4 rounded-2xl font-extrabold text-xs md:text-sm uppercase tracking-wider transition-all duration-300 shadow-xl shadow-brand-orange/15 w-fit"
                >
                  <span>FREE KONSULTASI BISNIS</span>
                </a>
                <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-neutral-400 font-onest">
                  RESPON CEPAT . TANPA KEWAJIBAN . 100% GRATIS
                </span>
              </div>
            </motion.div>

            <div className="hidden md:block md:col-span-6 lg:col-span-6 h-full" />

          </div>
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
