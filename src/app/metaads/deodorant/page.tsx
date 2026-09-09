'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Package,
  Palette,
  MessageCircle,
  FlaskConical,
  Award,
  ArrowRight,
} from 'lucide-react';
import { useMetaAdsCtaPixel } from '@/lib/meta-ads-pixel';
import { AdsCredibilitySection } from '@/components/landing-pages/AdsCredibilitySection';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const benefits = [
  {
    icon: FlaskConical,
    title: 'Custom Formula',
    desc: 'Racik formula deodorant sesuai kebutuhan kulit dan preferensi aroma — dari spray, roll-on, dry serum, hingga balm.',
  },
  {
    icon: Palette,
    title: 'Desain Kemasan',
    desc: 'Free desain kemasan eksklusif yang mencerminkan identitas brand kamu. Tampil beda dari kompetitor.',
  },
  {
    icon: ShieldCheck,
    title: 'Legalitas Lengkap',
    desc: 'Dukungan penuh BPOM, Halal, dan Uji Lab. Produk siap edar tanpa hambatan regulasi.',
  },
  {
    icon: Package,
    title: 'MOQ Fleksibel',
    desc: 'Cocok untuk brand baru maupun skala besar. Mulai dari quantity kecil, scale up kapan saja.',
  },
  {
    icon: Award,
    title: 'Free Coaching Bisnis',
    desc: 'Bimbingan 1-on-1 dari riset pasar, strategi harga, hingga cara menjual deodorant ke distributor.',
  },
  {
    icon: Sparkles,
    title: 'Peluang Tren',
    desc: 'Deodorant berbasis skincare adalah pasar yang tumbuh cepat. Jadilah first mover di kategori ini.',
  },
];

const products = [
  {
    name: 'Deodorant Spray',
    image: '/new asset/bodycare/deodorant-spray.webp',
    desc: 'Segar, cepat kering, coverage luas dan praktis digunakan sehari-hari.',
  },
  {
    name: 'Deodorant Roll On',
    image: '/new asset/bodycare/deodorant-roll-on.webp',
    desc: 'Aplikasi presisi, perlindungan optimal dan ramah untuk daily use.',
  },
  {
    name: 'Deodorant Dry Serum',
    image: '/new asset/bodycare/deodorant-dry-serum.webp',
    desc: 'Tekstur ringan meresap cepat, mencerahkan dan nyaman di kulit sensitif.',
  },
  {
    name: 'Deodorant Balm',
    image: '/new asset/bodycare/deodorant-balm.webp',
    desc: 'Formula padat alami, tanpa alkohol, melembutkan serta ramah di ketiak.',
  },
];

export default function DeodorantMetaAdsLP() {
  useMetaAdsCtaPixel('Deodorant');

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-brand-black font-sans selection:bg-brand-orange selection:text-white">
      {/* ============ HERO ============ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-brand-black">
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/65 to-black/45 pointer-events-none z-10" />
        <Image
          src="/new asset/bodycare/deodorant-spray.webp"
          alt="Maklon Deodorant Custom Formula"
          fill
          priority
          fetchPriority="high"
          decoding="sync"
          className="object-cover object-center scale-105"
          sizes="100vw"
        />
        <motion.div
          className="container-custom relative z-20 w-full py-24 md:py-32 lg:py-40"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div className="max-w-2xl space-y-8" variants={fadeUp}>
            <motion.div
              className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full"
              variants={fadeUp}
            >
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-white uppercase">
                Tren Gaya Hidup Aktif Menciptakan Peluang Baru
              </span>
            </motion.div>
            <motion.h1
              className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] uppercase font-display"
              variants={fadeUp}
            >
              Wujudkan Brand Deodorant{' '}
              <span className="text-brand-orange">Dengan Custom Formula</span>
            </motion.h1>
            <motion.p
              className="text-base md:text-lg text-white/85 leading-relaxed max-w-xl"
              variants={fadeUp}
            >
              Tren olahraga dan gaya hidup aktif meningkat drastis — permintaan
              deodorant berbasis skincare ikut melonjak. Sekarang saatnya Anda
              memiliki brand deodorant sendiri dengan formula eksklusif, legalitas
              lengkap, dan MOQ ramah.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-2"
              variants={fadeUp}
            >
              <Link
                href="/ads/thankyou/metaads/"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-brand-orange text-white rounded-[50px] font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                Konsultasi Gratis Sekarang
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============ COUNTER (DI BAWAH HERO) ============ */}
      <section className="bg-white py-12 md:py-16 border-b border-neutral-100 relative z-20">
        <div className="container-custom max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 items-center">
            <div className="flex flex-col items-center justify-center md:border-r border-neutral-200 py-3 text-center">
              <span className="text-[44px] md:text-[56px] font-black text-[#FF8A00] leading-none mb-2 font-display">
                500++
              </span>
              <span className="text-xs md:text-sm font-extrabold text-brand-black uppercase tracking-widest text-center">
                DIPERCAYA 500++ BRAND
              </span>
            </div>
            <div className="flex flex-col items-center justify-center py-3 text-center">
              <span className="text-[44px] md:text-[56px] font-black text-[#2F6BFF] leading-none mb-2 font-display">
                1000++
              </span>
              <span className="text-xs md:text-sm font-extrabold text-brand-black uppercase tracking-widest text-center">
                1000++ PRODUK TELAH DIKEMBANGKAN
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ KATALOG MAKLON DEODORANT ============ */}
      <motion.section
        className="py-16 md:py-24 bg-[#FAF9F6]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto text-center space-y-3 mb-14"
            variants={fadeUp}
          >
            <span className="text-[10px] md:text-[11px] font-black tracking-[0.25em] text-[#FF8A00] uppercase font-onest block">
              PILIHAN FORMULA & FORMAT TERLENGKAP
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-black tracking-tight leading-[1.1] uppercase font-display">
              KATALOG MAKLON DEODORANT
            </h2>
            <p className="text-sm md:text-base text-neutral-500 leading-relaxed max-w-2xl mx-auto">
              Dari konsep hingga produk jadi — Dreamlab siapkan formula, kemasan,
              dan legalitas untuk berbagai varian deodorant unggulan siap edar.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <motion.div key={i} className="group flex flex-col h-full" variants={fadeUp}>
                <Link
                  href="https://dreamlab.id/produk/bodycare/deodorant/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col h-full bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 p-4"
                >
                  <div className="aspect-square rounded-xl bg-[#FAF9F6] overflow-hidden relative mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <h3 className="text-base font-bold text-brand-black group-hover:text-[#FF8A00] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-500 mt-1 mb-4 flex-1 leading-relaxed">
                    {product.desc}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF8A00] pt-2 border-t border-neutral-100">
                    <span>Lihat Detail Produk</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="https://dreamlab.id/produk/bodycare/deodorant/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-black hover:bg-[#FF8A00] text-white rounded-full font-bold uppercase tracking-wider text-xs md:text-sm transition-all duration-300 shadow-md hover:-translate-y-0.5"
            >
              <span>Jelajahi Semua Varian Deodorant</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ============ BENEFITS / USP GRID ============ */}
      <motion.section
        className="py-16 md:py-24 bg-white border-t border-neutral-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto text-center space-y-4 mb-16"
            variants={fadeUp}
          >
            <span className="text-[10px] md:text-[11px] font-black tracking-[0.25em] text-[#FF8A00] uppercase font-onest block">
              KEUNGGULAN MAKLON
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-brand-black tracking-tight leading-[1.15] uppercase font-display">
              Kenapa Pilih <span className="text-brand-orange">Dreamlab</span>
            </h2>
            <p className="text-base md:text-lg text-neutral-500 leading-relaxed">
              Bukan cuma maklon — kami partner yang bikin brand deodorant kamu siap
              bersaing dan unggul di pasaran.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  className="group p-6 md:p-7 rounded-xl bg-[#FAF9F6] border border-neutral-100 hover:border-brand-orange/20 hover:bg-brand-orange/[0.02] transition-all duration-300 space-y-4"
                  variants={fadeUp}
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors">
                    <Icon className="w-5 h-5 text-brand-orange" />
                  </div>
                  <h3 className="text-base font-bold text-brand-black">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ============ 5 LANGKAH MUDAH ============ */}
      <section className="bg-white py-16 md:py-24 border-t border-neutral-100">
        <div className="container-custom px-4">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-[10px] md:text-[11px] font-black tracking-[0.25em] text-[#FF8A00] uppercase font-onest mb-3 block">
              ALUR PENGEMBANGAN
            </span>
            <h2 className="text-3xl md:text-[40px] font-black text-brand-black tracking-tight leading-[1.1] uppercase font-display mb-4">
              5 LANGKAH MUDAH<br />
              <span className="text-[#2F6BFF]">WUJUDKAN BRAND DEODORANT ANDA</span>
            </h2>
            <p className="text-sm md:text-base text-neutral-500 max-w-2xl mx-auto">
              Dari formulasi hingga siap dipasarkan, setiap tahap didampingi secara menyeluruh oleh tim ahli Dreamlab.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-100 shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.22)] border border-neutral-200/80 transition-all duration-400 hover:-translate-y-1">
              <Image
                src="/assets/maklon-parfum/consultation.webp"
                alt="Konsultasi Brand"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E36]/95 via-[#0F1E36]/60 via-45% to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white drop-shadow-md">
                <span className="text-xs font-black tracking-widest text-white mb-2 block font-onest drop-shadow" style={{ color: "#ffffff" }}>
                  STEP 01
                </span>
                <h3
                  className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display text-white !text-white drop-shadow"
                  style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
                >
                  KONSULTASI BRAND & TARGET MARKET
                </h3>
                <p
                  className="text-[13px] text-white/95 leading-relaxed font-medium drop-shadow-sm"
                  style={{ color: "rgba(255,255,255,0.95)" }}
                >
                  Diskusikan konsep deodorant, target konsumen, active ingredients, dan positioning brand Anda.
                </p>
              </div>
            </div>

            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-100 shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.22)] border border-neutral-200/80 transition-all duration-400 hover:-translate-y-1">
              <Image
                src="/assets/maklon-parfum/sample.webp"
                alt="Formula & Sample"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E36]/95 via-[#0F1E36]/60 via-45% to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white drop-shadow-md">
                <span className="text-xs font-black tracking-widest text-white mb-2 block font-onest drop-shadow" style={{ color: "#ffffff" }}>
                  STEP 02
                </span>
                <h3
                  className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display text-white !text-white drop-shadow"
                  style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
                >
                  CUSTOM FORMULA & SAMPLE
                </h3>
                <p
                  className="text-[13px] text-white/95 leading-relaxed font-medium drop-shadow-sm"
                  style={{ color: "rgba(255,255,255,0.95)" }}
                >
                  Tim R&D meracik formula spesifik (spray, roll-on, dry serum, balm) dan mengirimkan sample untuk approval Anda.
                </p>
              </div>
            </div>

            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-100 shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.22)] border border-neutral-200/80 transition-all duration-400 hover:-translate-y-1">
              <Image
                src="/assets/maklon-parfum/legal-design.webp"
                alt="Legalitas & Desain"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E36]/95 via-[#0F1E36]/60 via-45% to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white drop-shadow-md">
                <span className="text-xs font-black tracking-widest text-white mb-2 block font-onest drop-shadow" style={{ color: "#ffffff" }}>
                  STEP 03
                </span>
                <h3
                  className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display text-white !text-white drop-shadow"
                  style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
                >
                  LEGALITAS & DESAIN KEMASAN
                </h3>
                <p
                  className="text-[13px] text-white/95 leading-relaxed font-medium drop-shadow-sm"
                  style={{ color: "rgba(255,255,255,0.95)" }}
                >
                  Pengurusan izin edar BPOM, sertifikasi Halal, serta perancangan desain packaging yang eye-catching.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:px-24 md:px-12">
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[16/9] bg-neutral-100 shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.22)] border border-neutral-200/80 transition-all duration-400 hover:-translate-y-1">
              <Image
                src="/assets/maklon-parfum/production.webp"
                alt="Produksi & QC"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E36]/95 via-[#0F1E36]/60 via-45% to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white drop-shadow-md">
                <span className="text-xs font-black tracking-widest text-white mb-2 block font-onest drop-shadow" style={{ color: "#ffffff" }}>
                  STEP 04
                </span>
                <h3
                  className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display text-white !text-white drop-shadow"
                  style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
                >
                  PRODUKSI & QUALITY CONTROL
                </h3>
                <p
                  className="text-[13px] text-white/95 leading-relaxed font-medium drop-shadow-sm"
                  style={{ color: "rgba(255,255,255,0.95)" }}
                >
                  Produksi massal higienis berstandar CPKB dan uji stabilitas ketat untuk memastikan kualitas terbaik.
                </p>
              </div>
            </div>

            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[16/9] bg-neutral-100 shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.22)] border border-neutral-200/80 transition-all duration-400 hover:-translate-y-1">
              <Image
                src="/assets/maklon-parfum/delivery.webp"
                alt="Siap Launching"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E36]/95 via-[#0F1E36]/60 via-45% to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white drop-shadow-md">
                <span className="text-xs font-black tracking-widest text-white mb-2 block font-onest drop-shadow" style={{ color: "#ffffff" }}>
                  STEP 05
                </span>
                <h3
                  className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display text-white !text-white drop-shadow"
                  style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
                >
                  SIAP LAUNCHING & PENGIRIMAN
                </h3>
                <p
                  className="text-[13px] text-white/95 leading-relaxed font-medium drop-shadow-sm"
                  style={{ color: "rgba(255,255,255,0.95)" }}
                >
                  Produk siap dikirim ke gudang Anda, lengkap dengan materi pendukung strategi penjualan dan promosi.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 md:mt-16">
            <Link
              href="/ads/thankyou/metaads/"
              className="inline-flex items-center gap-2 px-10 py-5 bg-[#FF8A00] text-white rounded-full font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-[#D97700] hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-[#FF8A00]/25"
            >
              <span>KONSULTASI BRAND DEODORANT ANDA</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ BEAUTY ACADEMY ============ */}
      <section className="bg-[#FAF9F6] py-16 md:py-24 border-t border-neutral-100">
        <div className="container-custom px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Copy & Benefits */}
            <div className="lg:col-span-7">
              <span className="text-[10px] md:text-[11px] font-black tracking-[0.25em] text-[#FF8A00] uppercase font-onest mb-3 block">
                BEAUTY ACADEMY & COMMUNITY
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-[36px] font-black text-brand-black tracking-tight leading-[1.15] uppercase font-display mb-4">
                HANYA DI DREAMLAB, BRAND ANDA BUKAN SEKADAR DIPRODUKSI, TETAPI JUGA{' '}
                <span className="text-[#2F6BFF]">DIBIMBING UNTUK BERTUMBUH</span>
              </h2>
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-8">
                Dapatkan pendampingan bisnis gratis untuk memastikan produk deodorant Anda
                sukses menembus pasar dan menghasilkan penjualan berulang.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-black text-[#2F6BFF] tracking-wider block font-onest mb-1.5">
                    01
                  </span>
                  <h3 className="text-sm font-black uppercase text-brand-black mb-1 font-display">
                    PRODUCT & BRAND DEVELOPMENT
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Membantu mempertajam positioning produk dan keunikan brand deodorant Anda.
                  </p>
                </div>

                <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-black text-[#2F6BFF] tracking-wider block font-onest mb-1.5">
                    02
                  </span>
                  <h3 className="text-sm font-black uppercase text-brand-black mb-1 font-display">
                    BRANDING & PACKAGING
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Membangun identitas visual premium agar mudah dikenali dan diminati konsumen.
                  </p>
                </div>

                <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-black text-[#2F6BFF] tracking-wider block font-onest mb-1.5">
                    03
                  </span>
                  <h3 className="text-sm font-black uppercase text-brand-black mb-1 font-display">
                    DIGITAL MARKETING STRATEGY
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Panduan strategi iklan berbayar (Meta & TikTok Ads) dan content marketing.
                  </p>
                </div>

                <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-black text-[#2F6BFF] tracking-wider block font-onest mb-1.5">
                    04
                  </span>
                  <h3 className="text-sm font-black uppercase text-brand-black mb-1 font-display">
                    BEAUTYPRENEUR COMMUNITY
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Bergabung dalam jaringan eksklusif ratusan brand owner alumni Dreamlab.
                  </p>
                </div>
              </div>

              <div>
                <Link
                  href="/ads/thankyou/metaads/"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF8A00] text-white rounded-full font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-[#D97700] hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-[#FF8A00]/20"
                >
                  <span>KONSULTASI BERSAMA DREAMLAB</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right: Real Collage Images */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              <div className="col-span-2 relative rounded-2xl overflow-hidden aspect-[16/10] shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-neutral-200/80 group">
                <Image
                  src="/assets/maklon-parfum/academy-community.webp"
                  alt="Komunitas beautypreneur Dreamlab"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-neutral-200/80 group">
                <Image
                  src="/assets/maklon-parfum/academy-digital-marketing.webp"
                  alt="Mentoring digital marketing"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-neutral-200/80 group">
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

      {/* CREDIBILITY / CERTIFICATIONS BANNER (Directly below Beautypreneur section) */}
      <AdsCredibilitySection channel="metaads" />

      {/* ============ CTA ============ */}
      <motion.section
        className="py-20 md:py-28 bg-brand-orange text-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        <motion.div
          className="container-custom text-center relative space-y-8"
          variants={fadeUp}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] uppercase font-display max-w-3xl mx-auto text-white">
            Siap Bikin{' '}
            <span className="text-white">Brand Deodorant</span>{' '}
            Sendiri?
          </h2>
          <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto">
            Dapatkan konsultasi GRATIS dengan tim Dreamlab. Kami bantu dari konsep formula
            sampai strategi go-to-market. Hubungi kami sekarang, tim kami siap mendampingi.
          </p>
          <Link
            href="/ads/thankyou/metaads/"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-brand-orange rounded-[50px] font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
          >
            <MessageCircle className="w-5 h-5 shrink-0" />
            Konsultasi Gratis Sekarang
          </Link>
        </motion.div>
      </motion.section>

      {/* ============ FOOTER ============ */}
      <footer className="py-8 bg-brand-orange border-t border-white/10">
        <div className="container-custom text-center space-y-1">
          <p className="text-[10px] font-bold text-white/50 tracking-widest uppercase">
            PT Karya Impian Laboratoris
          </p>
          <p className="text-[9px] font-medium text-white/40 tracking-wide uppercase">
            All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
