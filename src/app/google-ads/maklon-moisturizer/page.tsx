"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  FlaskConical,
  ShieldCheck,
  Sparkles,
  Droplet,
  Zap,
  Sun,
  CheckCircle2,
  ArrowRight,
  Package,
  Palette,
  Layers,
  Award,
  Lock,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import { homepageData } from "@/data/homepage";
import { aboutData } from "@/data/about-us";
import { AdsCredibilitySection } from "@/components/landing-pages/AdsCredibilitySection";

// Dynamically import LogoScroll
const LogoScroll = dynamic(() => import("@/components/LogoScroll"), {
  ssr: true,
  loading: () => <div className="py-16 bg-[#FFFFFB]" />,
});

const premiumEase = [0.16, 1, 0.3, 1] as const;

const GOOGLE_ADS_MOISTURIZER_CTA =
  "/ads/thankyou/google-ads/?source=google-moisturizer&from=/google-ads/maklon-moisturizer/";

export default function MaklonMoisturizerAdsLP() {
  return (
    <div className="landing-page-moisturizer min-h-screen bg-[#FFFFFB] text-[#212120] font-sans selection:bg-[#F6911E] selection:text-white">
      {/* =========================================================================
          1. HERO SECTION
          - Badge: #1 Maklon Moisturizer Custom Formula
          - Headline: Wujudkan Brand Moisturizer High-End Milikmu dengan Formula Eksklusif & Skin Barrier Expert
          - Single CTA Button: Konsultasikan Custom Formula Moisturizer Anda
          - Counter Data: 500++ Brand Telah Berkolaborasi & 1000+ Produk Skincare Sukses Diproduksi
          ========================================================================= */}
      <section className="relative w-full min-h-[92vh] lg:min-h-screen overflow-hidden flex items-center pt-24 pb-16 lg:py-0 bg-[#FFFFFB]">
        {/* Background Visual Image (Full Screen Showcase) */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src="/images/maklon-moisturizer/hero-moisturizer-collection.jpg"
            alt="Pabrik Maklon Moisturizer High-End Dreamlab Indonesia"
            fill
            priority
            fetchPriority="high"
            decoding="sync"
            className="object-cover object-[82%_center] md:object-center"
            sizes="100vw"
          />
          {/* Multi-layered luxury gradient overlay to keep text ultra-crisp while showcasing product aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFFFFB] via-[#FFFFFB]/90 to-[#FFFFFB]/25 md:from-[#FFFFFB] md:via-[#FFFFFB]/85 md:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFB] via-transparent to-transparent lg:hidden" />
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-10 w-[350px] h-[350px] bg-[#4898D3]/10 blur-[130px] rounded-full pointer-events-none z-10" />
        <div className="absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-[#F6911E]/10 blur-[120px] rounded-full pointer-events-none z-10" />

        <div className="container-custom relative z-20 w-full py-12 md:py-20 lg:py-28">
          <div className="max-w-xl md:max-w-2xl lg:max-w-3xl text-left space-y-6 md:space-y-8">
            
            {/* Badge #1 Maklon Moisturizer */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: premiumEase }}
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#2A5841]/10 border border-[#2A5841]/25 rounded-full backdrop-blur-md shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2A5841] animate-pulse" />
                <span className="text-[11px] md:text-xs font-black tracking-widest text-[#2A5841] uppercase">
                  #1 Maklon Moisturizer Custom Formula
                </span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: premiumEase }}
              className="space-y-3"
            >
              <h1 className="text-[34px] sm:text-[46px] md:text-[56px] lg:text-[66px] xl:text-[72px] font-black leading-[1.08] tracking-tight text-[#212120] uppercase font-display">
                Wujudkan Brand <span className="text-[#F6911E]">Moisturizer High-End</span> Milikmu
              </h1>
              <p className="text-[#2A5841] text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F6911E] fill-current" />
                Formula Eksklusif &amp; Skin Barrier Expert
              </p>
            </motion.div>

            {/* Sub-headline Copywriting */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: premiumEase }}
              className="text-[#454543] text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-medium"
            >
              Ciptakan lini pelembap signature berdaya saing tinggi: tekstur <em>water-gel</em> meleleh seketika, mengunci hidrasi 72 jam, meredakan jerawat, dan memperbaiki <em>skin barrier</em> secara klinis dengan standar fasilitas CPKB Grade A &amp; BPOM.
            </motion.p>

            {/* Single CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: premiumEase }}
              className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <a
                href={GOOGLE_ADS_MOISTURIZER_CTA}
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#F6911E] hover:bg-[#212120] text-white font-black py-4 px-8 md:px-10 rounded-full transition-all duration-300 shadow-[0_15px_30px_rgba(246,145,30,0.3)] hover:-translate-y-1 text-xs md:text-sm uppercase tracking-wider"
              >
                {/* WhatsApp SVG Icon */}
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.019-5.117-2.875-6.976C16.592 1.899 14.116.88 11.986.88 6.548.88 2.122 5.3 2.119 10.74c-.002 1.706.452 3.37 1.312 4.848l-.994 3.629 3.73-.973zm11.366-6.726c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                </svg>
                <span>Konsultasikan Custom Formula Moisturizer Anda</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>

            {/* Counter Data Social Proof Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: premiumEase }}
              className="pt-6 border-t border-neutral-200/80"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[#F6911E] font-display leading-tight">500++</p>
                  <p className="text-xs sm:text-[13px] font-bold text-[#454543]">Brand Telah Berkolaborasi</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[#4898D3] font-display leading-tight">1000+</p>
                  <p className="text-xs sm:text-[13px] font-bold text-[#454543]">Produk Sukses Diproduksi</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[#2A5841] font-display leading-tight">1-Client</p>
                  <p className="text-xs sm:text-[13px] font-bold text-[#454543]">1-Formula Eksklusif</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[#212120] font-display leading-tight">CPKB</p>
                  <p className="text-xs sm:text-[13px] font-bold text-[#454543]">Grade A &amp; BPOM Resmi</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CARD NILAI UTAMA (3 KOLOM)
          - Diformulasikan oleh R&D Skincare
          - 1-Client 1-Formula Eksklusif
          - Legalitas BPOM & Halal Tuntas
          ========================================================================= */}
      <section className="py-16 md:py-24 bg-white border-y border-neutral-100">
        <div className="container-custom">
          
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-3">
            <span className="text-[11px] font-black tracking-[0.25em] text-[#F6911E] uppercase block">
              KEUNGGULAN UTAMA DREAMLAB
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#212120] uppercase font-display leading-tight">
              Standar Tertinggi untuk <span className="text-[#2A5841]">Formula Moisturizer</span> Anda
            </h2>
            <p className="text-sm md:text-base text-neutral-500 font-medium">
              Kombinasi sains formulasi dermatologi, integritas hak cipta resep, dan legalitas izin edar resmi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: premiumEase }}
              className="group bg-[#FFFFFB] border border-[#2A5841]/15 hover:border-[#2A5841] rounded-[24px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#2A5841]/10 text-[#2A5841] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FlaskConical className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black uppercase text-[#212120] font-display leading-snug">
                  Diformulasikan oleh R&amp;D Skincare
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                  Didukung formulator ahli kimia farmasi berpengalaman dalam sediaan <em>barrier repairing</em>, emulsi mikro, dan <em>water-bursting technology</em> yang stabil pada iklim tropis.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center gap-2 text-xs font-bold text-[#2A5841]">
                <CheckCircle2 className="w-4 h-4 text-[#2A5841]" />
                <span>Teknologi Delivery System Unggul</span>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: premiumEase }}
              className="group bg-[#FFFFFB] border border-[#F6911E]/20 hover:border-[#F6911E] rounded-[24px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#F6911E]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#F6911E]/10 text-[#F6911E] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black uppercase text-[#212120] font-display leading-snug">
                  1-Client 1-Formula Eksklusif
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                  Bukan formula generik pasaran. Resep moisturizer diracik privat dan 100% eksklusif milik brand Anda, memberikan nilai tawar unik yang tidak dapat dijiplak oleh kompetitor.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center gap-2 text-xs font-bold text-[#F6911E] relative z-10">
                <CheckCircle2 className="w-4 h-4 text-[#F6911E]" />
                <span>Kerahasiaan Dijamin NDA Tertulis</span>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: premiumEase }}
              className="group bg-[#FFFFFB] border border-[#4898D3]/20 hover:border-[#4898D3] rounded-[24px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#4898D3]/10 text-[#4898D3] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black uppercase text-[#212120] font-display leading-snug">
                  Legalitas BPOM &amp; Halal Tuntas
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                  Dreamlab mengawal seluruh proses registrasi notifikasi resmi BPOM, sertifikasi Halal Kemenag, uji stabilitas mikrobiologi, hingga dokumen legalitas produk tuntas sampai siap edar.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center gap-2 text-xs font-bold text-[#4898D3]">
                <CheckCircle2 className="w-4 h-4 text-[#4898D3]" />
                <span>100% Aman, Resmi &amp; Terpercaya</span>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          3. SECTION KATALOG PRODUK (3 VARIAN GRID 3 KOLOM)
          - Hydra Moisturizer (Hidrasi mendalam & skin barrier)
          - Acne Moisturizer (Menenangkan jerawat & kontrol sebum)
          - Brightening Moisturizer (Mencerahkan kusam & glowing)
          ========================================================================= */}
      <section className="py-16 md:py-24 bg-[#FFFFFB]">
        <div className="container-custom">
          
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-3">
            <span className="text-[11px] font-black tracking-[0.25em] text-[#4898D3] uppercase block">
              KATALOG FORMULASI POPULER
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#212120] uppercase font-display leading-tight">
              3 Kategori Moisturizer <span className="text-[#F6911E]">Paling Diburu Pasar</span>
            </h2>
            <p className="text-sm md:text-base text-neutral-500 font-medium">
              Pilih pilar sediaan pelembap yang sesuai dengan target audiens dan arah positioning brand skincare Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Varian 1: Hydra Moisturizer */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: premiumEase }}
              className="bg-white border border-[#4898D3]/20 rounded-[28px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-400 flex flex-col group hover:-translate-y-1.5"
            >
              {/* Product Image Container */}
              <div className="relative aspect-square w-full bg-[#f0f8ff] overflow-hidden">
                <Image
                  src="/images/maklon-moisturizer/hydra-boost-moisturizer.jpg"
                  alt="Hydra Boost Hyaluronic Acid Water Gel Moisturizer"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 left-4 bg-[#4898D3] text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md">
                  Skin Barrier &amp; Deep Hydration
                </div>
              </div>

              {/* Product Details */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#4898D3] text-xs font-black uppercase tracking-widest">
                    <Droplet className="w-4 h-4" />
                    <span>Hydra Water Gel</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase text-[#212120] font-display">
                    Hydra Boost Barrier Gel
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                    Fokus menghidrasi kulit hingga lapisan terdalam, mengunci kadar air 72 jam, serta memperbaiki struktur <em>skin barrier</em> yang dehidrasi dan sensitif.
                  </p>

                  <div className="pt-2 space-y-2">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">Hero Ingredients:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {["8X Hyaluronic Acid", "5X Ceramide", "Centella Asiatica", "Panthenol B5"].map((item) => (
                        <span key={item} className="text-[11px] font-bold bg-[#4898D3]/10 text-[#4898D3] px-2.5 py-1 rounded-md">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <a
                  href={GOOGLE_ADS_MOISTURIZER_CTA}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#4898D3] hover:bg-[#212120] text-white font-extrabold py-3.5 px-6 rounded-full transition-all duration-300 text-xs uppercase tracking-wider shadow-md hover:shadow-lg"
                >
                  <span>Konsultasi Hydra Moisturizer</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Varian 2: Acne Moisturizer */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: premiumEase }}
              className="bg-white border border-[#2A5841]/20 rounded-[28px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-400 flex flex-col group hover:-translate-y-1.5"
            >
              {/* Product Image Container */}
              <div className="relative aspect-square w-full bg-[#f4f8f5] overflow-hidden">
                <Image
                  src="/images/maklon-moisturizer/acne-clearing-moisturizer.jpg"
                  alt="Acne-Clearing Calming Moisturizer"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 left-4 bg-[#2A5841] text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md">
                  Acne-Calming &amp; Sebum Control
                </div>
              </div>

              {/* Product Details */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#2A5841] text-xs font-black uppercase tracking-widest">
                    <Zap className="w-4 h-4" />
                    <span>Calming Emulsion</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase text-[#212120] font-display">
                    Acne Clearing Calming Gel
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                    Fokus menenangkan jerawat meradang, meredakan kemerahan, menyeimbangkan produksi minyak berlebih, serta mencegah timbulnya bekas jerawat.
                  </p>

                  <div className="pt-2 space-y-2">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">Hero Ingredients:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {["Succinic Acid", "Salicylic Acid (BHA)", "Heartleaf", "Zinc PCA", "Tea Tree"].map((item) => (
                        <span key={item} className="text-[11px] font-bold bg-[#2A5841]/10 text-[#2A5841] px-2.5 py-1 rounded-md">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <a
                  href={GOOGLE_ADS_MOISTURIZER_CTA}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#2A5841] hover:bg-[#212120] text-white font-extrabold py-3.5 px-6 rounded-full transition-all duration-300 text-xs uppercase tracking-wider shadow-md hover:shadow-lg"
                >
                  <span>Konsultasi Acne Moisturizer</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Varian 3: Brightening Moisturizer */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: premiumEase }}
              className="bg-white border border-[#F6911E]/25 rounded-[28px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-400 flex flex-col group hover:-translate-y-1.5"
            >
              {/* Product Image Container */}
              <div className="relative aspect-square w-full bg-[#fffcf5] overflow-hidden">
                <Image
                  src="/images/maklon-moisturizer/brightening-moisturizer.png"
                  alt="Brightening Glow Pudding Moisturizer with Alpha Arbutin & Kojic Acid"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 left-4 bg-[#F6911E] text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md">
                  Glowing &amp; Tone Evening
                </div>
              </div>

              {/* Product Details */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#F6911E] text-xs font-black uppercase tracking-widest">
                    <Sun className="w-4 h-4" />
                    <span>Radiance Pudding Cream</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase text-[#212120] font-display">
                    Brightening Glow Moisturizer
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                    Fokus mencerahkan kulit kusam, meratakan warna kulit tidak merata, memudarkan noda hitam, dan menghasilkan kilau <em>glass skin</em> alami tanpa rasa lengket.
                  </p>

                  <div className="pt-2 space-y-2">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">Hero Ingredients:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {["Alpha Arbutin", "Kojic Acid", "Niacinamide 4%", "Centella Asiatica", "Tranexamic"].map((item) => (
                        <span key={item} className="text-[11px] font-bold bg-[#F6911E]/10 text-[#F6911E] px-2.5 py-1 rounded-md">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <a
                  href={GOOGLE_ADS_MOISTURIZER_CTA}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#F6911E] hover:bg-[#212120] text-white font-extrabold py-3.5 px-6 rounded-full transition-all duration-300 text-xs uppercase tracking-wider shadow-md hover:shadow-lg"
                >
                  <span>Konsultasi Brightening Moisturizer</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          4. PROBLEM & SOLUSI + FASILITAS FREE (MOQ FLEKSIBEL & BONUS EKSKLUSIF)
          - Poin kelebihan MOQ fleksibel
          - Free Desain Logo & Kemasan
          - Free Konsultasi Bisnis
          - Free Marketing Kit & Photo Product
          ========================================================================= */}
      <section className="py-16 md:py-24 bg-[#1b2a22] text-white relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F6911E]/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4898D3]/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="container-custom relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left: Problem & Solusi Copy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#2A5841] border border-white/10 rounded-full text-xs font-bold text-[#FFFFFB]">
                <Sparkles className="w-3.5 h-3.5 text-[#F6911E]" />
                <span>SOLUSI MAKLON MOISTURIZER MODERN</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase font-display leading-[1.1] text-white">
                Tak Perlu Takut Modal Besar. <span className="text-[#F6911E]">MOQ Fleksibel</span> &amp; Fasilitas Lengkap!
              </h2>

              <p className="text-neutral-300 text-sm md:text-base leading-relaxed font-normal">
                Banyak calon pemilik brand terhambat oleh syarat pabrik konvensional yang mewajibkan produksi puluhan ribu unit di awal. Dreamlab hadir dengan skema <strong>MOQ Fleksibel yang ramah bagi pemula</strong>, meminimalkan risiko <em>dead stock</em>, dan memastikan arus kas bisnis tetap sehat.
              </p>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#F6911E]">
                  Keunggulan Finansial Maklon di Dreamlab:
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-200">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#F6911E] shrink-0" />
                    <span><strong>MOQ Fleksibel:</strong> Mulai produksi tanpa beban kuantitas raksasa.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#F6911E] shrink-0" />
                    <span><strong>Transparansi HPP:</strong> Biaya formula, botol jar/pump, dan izin terperinci jelas.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#F6911E] shrink-0" />
                    <span><strong>Cash Flow Aman:</strong> Alokasikan anggaran lebih banyak untuk strategi iklan &amp; promosi.</span>
                  </li>
                </ul>
              </div>

              <a
                href={GOOGLE_ADS_MOISTURIZER_CTA}
                className="inline-flex items-center justify-center gap-2.5 bg-[#F6911E] hover:bg-white hover:text-[#212120] text-white font-black py-4 px-8 rounded-full transition-all duration-300 text-xs sm:text-sm uppercase tracking-wider shadow-xl"
              >
                <span>Dapatkan Skema MOQ &amp; Simulasi Biaya</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Right: 4 Fasilitas Free Eksklusif */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4.5">
              
              {/* Free 1 */}
              <div className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-md hover:bg-white/15 transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#F6911E] text-white flex items-center justify-center mb-4 shadow-md">
                  <Palette className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#F6911E] block mb-1">
                  GRATIS / FREE
                </span>
                <h3 className="text-base font-black uppercase text-white font-display mb-2">
                  Desain Logo &amp; Kemasan
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Tim desainer in-house Dreamlab merancang visual logo dan packaging jar/pump yang estetik, modern, dan siap bersaing di etalase premium.
                </p>
              </div>

              {/* Free 2 */}
              <div className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-md hover:bg-white/15 transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#4898D3] text-white flex items-center justify-center mb-4 shadow-md">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#4898D3] block mb-1">
                  GRATIS / FREE
                </span>
                <h3 className="text-base font-black uppercase text-white font-display mb-2">
                  Konsultasi Bisnis &amp; HPP
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Diskusi komprehensif mengenai penentuan target market, kalkulasi HPP yang sehat, hingga rekomendasi harga retail untuk margin optimal.
                </p>
              </div>

              {/* Free 3 */}
              <div className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-md hover:bg-white/15 transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#2A5841] text-white flex items-center justify-center mb-4 shadow-md">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-1">
                  GRATIS / FREE
                </span>
                <h3 className="text-base font-black uppercase text-white font-display mb-2">
                  Marketing Kit &amp; Photo Product
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Aset foto produk komersial studio profesional berkualitas tinggi siap pakai untuk konten TikTok, feeds Instagram, dan banner marketplace.
                </p>
              </div>

              {/* Free 4 */}
              <div className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-md hover:bg-white/15 transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4 shadow-md">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-300 block mb-1">
                  GRATIS / FREE
                </span>
                <h3 className="text-base font-black uppercase text-white font-display mb-2">
                  Custom Sample Formula
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Uji coba langsung tekstur, kelembapan, dan aroma sample moisturizer Anda secara nyata hingga Anda 100% puas sebelum masuk produksi massal.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          5. PROGRAM DREAMPRENEUR & BRAND KOLABORASI
          - Sesi mentoring bisnis beautypreneur
          - Social proof logo partner Dreamlab
          ========================================================================= */}
      <section className="bg-[#EEF4FF] py-16 md:py-24 border-b border-blue-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left: Copy & Pillars */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[11px] font-black tracking-[0.25em] text-[#F6911E] uppercase block">
                DREAMPRENEUR BEAUTY ACADEMY
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#212120] uppercase font-display leading-tight">
                Brand Anda Bukan Hanya Diproduksi, Tapi Juga <span className="text-[#4898D3]">Dimentoring Sampai Sukses</span>
              </h2>
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                Melalui program <strong>Dreampreneur</strong>, Dreamlab menyediakan ekosistem inkubasi eksklusif yang membimbing para beautypreneur dari tahap perumusan konsep hingga ekspansi penjualan.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-blue-100 p-5 rounded-2xl shadow-sm">
                  <span className="text-xs font-black text-[#4898D3] tracking-wider block mb-1">PILAR 01</span>
                  <h3 className="text-sm font-black uppercase text-[#212120] mb-1 font-display">Product &amp; Trend Insight</h3>
                  <p className="text-xs text-neutral-600">Riset tren bahan aktif global dan formulasi yang paling diminati konsumen lokal.</p>
                </div>

                <div className="bg-white border border-blue-100 p-5 rounded-2xl shadow-sm">
                  <span className="text-xs font-black text-[#4898D3] tracking-wider block mb-1">PILAR 02</span>
                  <h3 className="text-sm font-black uppercase text-[#212120] mb-1 font-display">Branding &amp; Positioning</h3>
                  <p className="text-xs text-neutral-600">Membangun narasi produk dan daya pembeda yang kuat di benak audiens.</p>
                </div>

                <div className="bg-white border border-blue-100 p-5 rounded-2xl shadow-sm">
                  <span className="text-xs font-black text-[#4898D3] tracking-wider block mb-1">PILAR 03</span>
                  <h3 className="text-sm font-black uppercase text-[#212120] mb-1 font-display">Digital Ads &amp; Marketing</h3>
                  <p className="text-xs text-neutral-600">Strategi beriklan di Meta Ads, TikTok Ads, dan marketplace untuk skala pertumbuhan cepat.</p>
                </div>

                <div className="bg-white border border-blue-100 p-5 rounded-2xl shadow-sm">
                  <span className="text-xs font-black text-[#4898D3] tracking-wider block mb-1">PILAR 04</span>
                  <h3 className="text-sm font-black uppercase text-[#212120] mb-1 font-display">Beautypreneur Network</h3>
                  <p className="text-xs text-neutral-600">Terhubung langsung dengan ratusan founder dan komunitas pengusaha kecantikan.</p>
                </div>
              </div>

              <div>
                <a
                  href={GOOGLE_ADS_MOISTURIZER_CTA}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#F6911E] text-white rounded-full font-extrabold uppercase tracking-wider text-xs md:text-sm hover:bg-[#212120] transition-all duration-300 shadow-lg shadow-[#F6911E]/20"
                >
                  <span>Gabung Program Dreampreneur</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right: Visual Academy Real Images */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              <div className="col-span-2 relative rounded-2xl overflow-hidden aspect-[16/10] shadow-md border border-neutral-200 group">
                <Image
                  src="/assets/maklon-parfum/academy-community.webp"
                  alt="Sesi Mentoring Komunitas Dreampreneur Dreamlab"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-sm border border-neutral-200 group">
                <Image
                  src="/assets/maklon-parfum/academy-digital-marketing.webp"
                  alt="Mentoring Digital Marketing Skincare"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-sm border border-neutral-200 group">
                <Image
                  src="/assets/maklon-parfum/academy-branding.webp"
                  alt="Sesi Branding Skincare Dreampreneur"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Kredibilitas & Sertifikasi Standar Industri */}
      <AdsCredibilitySection channel="google-ads" />

      {/* Social Proof Partner Logos */}
      <LogoScroll
        logos={aboutData.partnerLogos}
        headline={homepageData.trustedBrands.title}
        subHeadline="Ratusan brand kecantikan mempercayakan produksi produk skincare dan moisturizer mereka kepada fasilitas CPKB Dreamlab."
      />

      {/* =========================================================================
          6. ALUR KERJA (4 LANGKAH CEPAT & TERARAH)
          - Step 01: Konsultasi Ide & Target Market
          - Step 02: Riset R&D & Custom Sample
          - Step 03: Legalitas BPOM, Halal & Desain Kemasan
          - Step 04: Produksi CPKB Grade A & Siap Launching
          ========================================================================= */}
      <section className="bg-white py-16 md:py-24 border-t border-neutral-100">
        <div className="container-custom">
          
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-3">
            <span className="text-[11px] font-black tracking-[0.25em] text-[#F6911E] uppercase block">
              ALUR KERJA TERSTRUKTUR
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#212120] uppercase font-display leading-tight">
              4 Langkah Mudah <span className="text-[#2A5841]">Ciptakan Brand Moisturizer</span> Anda
            </h2>
            <p className="text-sm md:text-base text-neutral-500 font-medium">
              Dari tahap konsultasi ide hingga produk berizin resmi siap dipasarkan, seluruh alur didampingi secara intensif.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-neutral-900 shadow-lg border border-neutral-200/80 transition-all duration-300 hover:-translate-y-1.5">
              <Image
                src="/assets/maklon-parfum/consultation.webp"
                alt="Konsultasi Maklon Moisturizer"
                fill
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11253c]/95 via-[#11253c]/50 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <span className="text-xs font-black tracking-widest text-[#F6911E] mb-2 block">
                  LANGKAH 01
                </span>
                <h3 className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display">
                  Konsultasi Konsep
                </h3>
                <p className="text-xs text-neutral-200 leading-relaxed">
                  Diskusikan ide produk moisturizer, target market, hero ingredients, dan ekspektasi tekstur yang diinginkan.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-neutral-900 shadow-lg border border-neutral-200/80 transition-all duration-300 hover:-translate-y-1.5">
              <Image
                src="/assets/maklon-parfum/sample.webp"
                alt="Riset Formulasi R&D Moisturizer"
                fill
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11253c]/95 via-[#11253c]/50 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <span className="text-xs font-black tracking-widest text-[#F6911E] mb-2 block">
                  LANGKAH 02
                </span>
                <h3 className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display">
                  Riset &amp; Sampel R&amp;D
                </h3>
                <p className="text-xs text-neutral-200 leading-relaxed">
                  Tim R&amp;D meracik formula khusus dan mengirimkan sampel untuk Anda evaluasi secara langsung hingga disetujui.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-neutral-900 shadow-lg border border-neutral-200/80 transition-all duration-300 hover:-translate-y-1.5">
              <Image
                src="/assets/maklon-parfum/legal-design.webp"
                alt="Izin BPOM & Desain Packaging Moisturizer"
                fill
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11253c]/95 via-[#11253c]/50 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <span className="text-xs font-black tracking-widest text-[#F6911E] mb-2 block">
                  LANGKAH 03
                </span>
                <h3 className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display">
                  Legalitas &amp; Desain
                </h3>
                <p className="text-xs text-neutral-200 leading-relaxed">
                  Pengurusan notifikasi BPOM resmi, sertifikasi Halal, serta finalisasi rancangan kemasan jar/pump siap cetak.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-neutral-900 shadow-lg border border-neutral-200/80 transition-all duration-300 hover:-translate-y-1.5">
              <Image
                src="/assets/maklon-parfum/production.webp"
                alt="Produksi CPKB Grade A dan QC"
                fill
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11253c]/95 via-[#11253c]/50 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <span className="text-xs font-black tracking-widest text-[#F6911E] mb-2 block">
                  LANGKAH 04
                </span>
                <h3 className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display">
                  Produksi &amp; Siap Kirim
                </h3>
                <p className="text-xs text-neutral-200 leading-relaxed">
                  Produksi massal di fasilitas CPKB Grade A, uji kontrol kualitas menyeluruh, dan produk siap meluncur ke pasar.
                </p>
              </div>
            </div>

          </div>

          <div className="text-center mt-12">
            <a
              href={GOOGLE_ADS_MOISTURIZER_CTA}
              className="inline-flex items-center gap-2 px-10 py-5 bg-[#F6911E] text-white rounded-full font-black uppercase tracking-wider text-xs md:text-sm hover:bg-[#212120] hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-[#F6911E]/25"
            >
              <span>Mulai Konsultasi Alur Maklon Sekarang</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

        </div>
      </section>

      {/* =========================================================================
          7. FINAL CTA & FOOTER
          - Penutup eksklusif dengan tombol utama kustom formula
          - Garansi kerahasiaan NDA
          ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-[#212120] text-white py-20 md:py-28">
        {/* Glow circles */}
        <div className="absolute top-1/2 left-10 w-[450px] h-[450px] bg-[#2A5841]/20 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#F6911E]/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-[#FFFFFB]">
            <Lock className="w-3.5 h-3.5 text-[#F6911E]" />
            <span>100% NON-DISCLOSURE AGREEMENT (NDA) GUARANTEED</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase font-display leading-[1.1] text-white">
            Wujudkan Brand <span className="text-[#F6911E]">Moisturizer Impian</span> Anda Bersama Dreamlab
          </h2>

          <p className="text-sm md:text-base lg:text-lg text-neutral-300 leading-relaxed font-medium max-w-2xl mx-auto">
            Diskusikan ide tekstur, active ingredients, dan strategi peluncuran produk moisturizer Anda bersama konsultan formulator kami. Tanpa komitmen awal, kerahasiaan ide dilindungi penuh secara hukum.
          </p>

          <div className="pt-4 flex flex-col items-center gap-4">
            <a
              href={GOOGLE_ADS_MOISTURIZER_CTA}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#F6911E] hover:bg-white hover:text-[#212120] text-white font-black py-4 px-10 rounded-full transition-all duration-300 shadow-[0_15px_30px_rgba(246,145,30,0.35)] hover:-translate-y-1 text-sm uppercase tracking-wider"
            >
              {/* WhatsApp Icon */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.019-5.117-2.875-6.976C16.592 1.899 14.116.88 11.986.88 6.548.88 2.122 5.3 2.119 10.74c-.002 1.706.452 3.37 1.312 4.848l-.994 3.629 3.73-.973zm11.366-6.726c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
              </svg>
              <span>Konsultasikan Custom Formula Moisturizer Anda</span>
            </a>

            {/* Trust points */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4 text-xs font-bold text-neutral-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#F6911E]" />
                1-Client 1-Formula
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2A5841]" />
                CPKB Grade A &amp; BPOM
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4898D3]" />
                MOQ Fleksibel
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#F6911E]" />
                Garansi Kerahasiaan NDA
              </span>
            </div>
          </div>

        </div>

        {/* Minimalist Landing Page Footer */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center text-xs text-neutral-500 font-medium">
          <p>&copy; {new Date().getFullYear()} Dreamlab Indonesia &bull; Maklon Kosmetik Juaranya Formula. All rights reserved.</p>
        </div>
      </section>

      {/* Floating WhatsApp Action Button */}
      <a
        href={GOOGLE_ADS_MOISTURIZER_CTA}
        className="fixed bottom-6 right-6 z-50 bg-[#25d366] hover:bg-[#20ba59] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
        aria-label="Konsultasi via WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="absolute right-full mr-4 bg-[#212120] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Konsultasi Formula Gratis!
        </span>
      </a>
    </div>
  );
}
