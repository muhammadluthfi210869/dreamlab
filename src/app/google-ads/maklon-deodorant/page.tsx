'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  FlaskConical,
  Palette,
  ShieldCheck,
  Package,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';
import { AdsCredibilitySection } from '@/components/landing-pages/AdsCredibilitySection';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
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
    title: '1 Klien 1 Formula Eksklusif',
    desc: 'Formula deodorant diracik privat oleh formulator R&D Dreamlab. Resep tidak diperjualbelikan ke brand lain demi menjaga diferensiasi produk Anda.',
  },
  {
    icon: Sparkles,
    title: 'Tren Active Skincare Formula',
    desc: 'Bukan sekadar penahan bau badan — kami padukan bahan aktif seperti Niacinamide, AHA/BHA, Centella, dan Probiotik untuk mencerahkan dan merawat ketiak.',
  },
  {
    icon: ShieldCheck,
    title: 'Legalitas BPOM & Halal Lengkap',
    desc: 'Dreamlab mengurus seluruh proses pendaftaran notifikasi BPOM, sertifikasi Halal, hingga uji klinis laboratorium sampai izin edar terbit resmi.',
  },
  {
    icon: Package,
    title: 'MOQ Fleksibel & Ramah Pemula',
    desc: 'Mulai produksi brand deodorant Anda dengan kuantitas terjangkau tanpa harus terbebani modal besar atau penumpukan stok di awal bisnis.',
  },
  {
    icon: Palette,
    title: 'Free Desain Kemasan & Packaging',
    desc: 'Tim desain kreatif kami siap merancang packaging botol spray, roll on, atau tube serum yang modern, estetik, dan sesuai karakter brand Anda.',
  },
  {
    icon: Award,
    title: 'Pendampingan Sampai Siap Jual',
    desc: 'Dapatkan kalkulasi HPP transparan, rekomendasi strategi harga pasar, hingga konsultasi go-to-market agar brand Anda cepat mencetak profit.',
  },
];

const products = [
  {
    name: 'Deodorant Spray',
    image: '/new asset/bodycare/deodorant-spray.webp',
    desc: 'Sensasi segar seketika, formula cepat kering tanpa lengket, coverage semprotan halus, dan perlindungan anti bau badan hingga 48 jam.',
  },
  {
    name: 'Deodorant Roll On',
    image: '/new asset/bodycare/deodorant-roll-on.webp',
    desc: 'Aplikasi presisi dan merata dengan formula emulsi lembut anti-stain. Tidak meninggalkan noda kuning di pakaian serta aman untuk pemakaian harian.',
  },
  {
    name: 'Deodorant Dry Serum',
    image: '/new asset/bodycare/deodorant-dry-serum.webp',
    desc: 'Inovasi tekstur serum ringan yang meresap ke lapisan kulit dalam. Diperkaya active brightening untuk mencerahkan lipatan ketiak sensitif.',
  },
  {
    name: 'Deodorant Natural Balm',
    image: '/new asset/bodycare/deodorant-balm.webp',
    desc: 'Formula butter padat berbasis bahan alami tanpa alkohol dan bebas garam aluminium. Melembapkan, menenangkan, dan sangat ramah untuk kulit sensitif.',
  },
];

export default function GoogleAdsMaklonDeodorantPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-brand-black font-sans selection:bg-brand-orange selection:text-white">
      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-brand-black">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40 pointer-events-none z-10" />
        <Image
          src="/new asset/bodycare/deodorant-spray.webp"
          alt="Pabrik Jasa Maklon Deodorant BPOM Dreamlab"
          fill
          priority
          fetchPriority="high"
          decoding="sync"
          className="object-cover object-[75%_center] md:object-center scale-105"
          sizes="100vw"
        />

        <div className="container-custom relative z-20 w-full py-24 md:py-32 lg:py-40">
          <motion.div
            className="max-w-2xl lg:max-w-3xl space-y-7"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Tagline Badge */}
            <motion.div
              className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full"
              variants={fadeUp}
            >
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-white uppercase font-onest">
                Pabrik Maklon Deodorant Resmi • BPOM & CPKB Certified
              </span>
            </motion.div>

            {/* Main H1 Headline */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.08] uppercase font-display"
              variants={fadeUp}
            >
              Maklon Deodorant{' '}
              <span className="block text-white">Custom Formula</span>
              <span className="text-brand-orange block">& Cepat Edar BPOM</span>
            </motion.h1>

            {/* Value Description */}
            <motion.p
              className="text-base md:text-lg text-white/85 leading-relaxed max-w-2xl font-normal"
              variants={fadeUp}
            >
              Wujudkan brand deodorant signature Anda dengan formula efektif, aroma
              eksklusif, dan perizinan legal lengkap. Mulai dari kuantitas fleksibel,
              didampingi formulator profesional dari konsep hingga produk siap jual di market.
            </motion.p>

            {/* USPs Mini Badges */}
            <motion.div
              className="flex flex-wrap gap-2.5 pt-1"
              variants={fadeUp}
            >
              {['1 Klien 1 Formula', 'Izin BPOM & Halal Resmi', 'MOQ Fleksibel', 'Free Konsultasi & R&D'].map((usp, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-xs text-white font-medium"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange" />
                  <span>{usp}</span>
                </div>
              ))}
            </motion.div>

            {/* Hero CTA Button */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              variants={fadeUp}
            >
              <Link
                href="/ads/thankyou/google-ads/"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand-orange hover:bg-brand-black text-white font-extrabold py-4 px-9 rounded-full transition-all duration-300 shadow-[0_15px_30px_rgba(243,146,0,0.3)] hover:-translate-y-0.5 text-sm uppercase tracking-wider"
              >
                {/* WhatsApp SVG Icon */}
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.019-5.117-2.875-6.976C16.592 1.899 14.116.88 11.986.88 6.548.88 2.122 5.3 2.119 10.74c-.002 1.706.452 3.37 1.312 4.848l-.994 3.629 3.73-.973zm11.366-6.726c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>KONSULTASI FORMULA GRATIS</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============ COUNTER SECTION (DI BAWAH HERO) ============ */}
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
              PILIHAN KATEGORI PRODUK
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-black tracking-tight leading-[1.1] uppercase font-display">
              KATALOG MAKLON DEODORANT
            </h2>
            <p className="text-sm md:text-base text-neutral-500 leading-relaxed max-w-2xl mx-auto">
              Tersedia berbagai pilihan formulasi dan kemasan modern berstandar BPOM
              yang siap disesuaikan dengan target konsumen brand Anda:
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

      {/* ============ KENAPA PILIH DREAMLAB (USP GRID) ============ */}
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
              KEUNGGULAN PABRIK DREAMLAB
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-brand-black tracking-tight leading-[1.15] uppercase font-display">
              Kenapa Memilih Maklon Deodorant di <span className="text-brand-orange">Dreamlab</span>?
            </h2>
            <p className="text-base md:text-lg text-neutral-500 leading-relaxed">
              Komitmen kami adalah menghadirkan produk berkualitas tinggi yang siap memenangkan
              persaingan pasar dengan skema kemitraan yang transparan dan aman.
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

      {/* ============ 5 LANGKAH MUDAH WUJUDKAN BRAND ============ */}
      <section className="bg-white py-16 md:py-24 border-t border-neutral-100">
        <div className="container-custom px-4">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-[10px] md:text-[11px] font-black tracking-[0.25em] text-[#FF8A00] uppercase font-onest mb-3 block">
              ALUR PENGEMBANGAN PRODUK
            </span>
            <h2 className="text-3xl md:text-[40px] font-black text-brand-black tracking-tight leading-[1.1] uppercase font-display mb-4">
              5 LANGKAH MUDAH<br />
              <span className="text-[#2F6BFF]">WUJUDKAN BRAND DEODORANT ANDA</span>
            </h2>
            <p className="text-sm md:text-base text-neutral-500 max-w-2xl mx-auto">
              Dari konsep awal hingga produk siap edar, seluruh proses dipandu langkah demi langkah oleh tim spesialis Dreamlab.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Step 1 */}
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-100 shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.22)] border border-neutral-200/80 transition-all duration-400 hover:-translate-y-1">
              <Image
                src="/assets/maklon-parfum/consultation.webp"
                alt="Konsultasi Brand Deodorant"
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
                  KONSULTASI KONSEP & TARGET PASAR
                </h3>
                <p
                  className="text-[13px] text-white/95 leading-relaxed font-medium drop-shadow-sm"
                  style={{ color: "rgba(255,255,255,0.95)" }}
                >
                  Diskusikan konsep deodorant, profil aroma, target harga jual, dan active ingredients yang diinginkan.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-100 shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.22)] border border-neutral-200/80 transition-all duration-400 hover:-translate-y-1">
              <Image
                src="/assets/maklon-parfum/sample.webp"
                alt="Pengembangan Formula & Sample"
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
                  PENGEMBANGAN CUSTOM FORMULA & SAMPLE
                </h3>
                <p
                  className="text-[13px] text-white/95 leading-relaxed font-medium drop-shadow-sm"
                  style={{ color: "rgba(255,255,255,0.95)" }}
                >
                  Tim R&D meracik formula khusus (spray, roll on, serum, balm) dan mengirimkan tester sample untuk uji coba.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-100 shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.22)] border border-neutral-200/80 transition-all duration-400 hover:-translate-y-1">
              <Image
                src="/assets/maklon-parfum/legal-design.webp"
                alt="Legalitas BPOM & Desain Packaging"
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
                  LEGALITAS BPOM, HALAL & PACKAGING
                </h3>
                <p
                  className="text-[13px] text-white/95 leading-relaxed font-medium drop-shadow-sm"
                  style={{ color: "rgba(255,255,255,0.95)" }}
                >
                  Registrasi perizinan BPOM & Halal resmi diproses bersamaan dengan perancangan desain kemasan botol/tube.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:px-24 md:px-12">
            {/* Step 4 */}
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[16/9] bg-neutral-100 shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.22)] border border-neutral-200/80 transition-all duration-400 hover:-translate-y-1">
              <Image
                src="/assets/maklon-parfum/production.webp"
                alt="Produksi Standar CPKB & QC"
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
                  PRODUKSI HIGIENIS CPKB & QUALITY CONTROL
                </h3>
                <p
                  className="text-[13px] text-white/95 leading-relaxed font-medium drop-shadow-sm"
                  style={{ color: "rgba(255,255,255,0.95)" }}
                >
                  Produksi massal berstandar CPKB dengan kontrol kualitas ketat untuk menjamin keamanan & kestabilan formula.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[16/9] bg-neutral-100 shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.22)] border border-neutral-200/80 transition-all duration-400 hover:-translate-y-1">
              <Image
                src="/assets/maklon-parfum/delivery.webp"
                alt="Produk Selesai Siap Kirim & Launching"
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
                  PRODUK SELESAI, PACKING & SIAP LAUNCHING
                </h3>
                <p
                  className="text-[13px] text-white/95 leading-relaxed font-medium drop-shadow-sm"
                  style={{ color: "rgba(255,255,255,0.95)" }}
                >
                  Deodorant Anda siap dikirim aman ke lokasi tujuan, lengkap dan siap untuk peluncuran resmi ke pasar.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 md:mt-16">
            <Link
              href="/ads/thankyou/google-ads/"
              className="inline-flex items-center gap-2 px-10 py-5 bg-[#FF8A00] text-white rounded-full font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-[#D97700] hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-[#FF8A00]/25"
            >
              <span>KONSULTASI BRAND DEODORANT ANDA</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ BEAUTY ACADEMY & COMMUNITY ============ */}
      <section className="bg-[#FAF9F6] py-16 md:py-24 border-t border-neutral-100">
        <div className="container-custom px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Content */}
            <div className="lg:col-span-7">
              <span className="text-[10px] md:text-[11px] font-black tracking-[0.25em] text-[#FF8A00] uppercase font-onest mb-3 block">
                DREAMPRENEUR BEAUTY ACADEMY
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-[36px] font-black text-brand-black tracking-tight leading-[1.15] uppercase font-display mb-4">
                HANYA DI DREAMLAB, BRAND ANDA BUKAN SEKADAR DIPRODUKSI, TETAPI JUGA{' '}
                <span className="text-[#2F6BFF]">DIBIMBING UNTUK BERTUMBUH</span>
              </h2>
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-8">
                Nikmati program pendampingan eksklusif untuk membekali brand owner strategi
                pemasaran praktis, positioning produk, dan penetrasi pasar yang terbukti berhasil.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-black text-[#2F6BFF] tracking-wider block font-onest mb-1.5">
                    01
                  </span>
                  <h3 className="text-sm font-black uppercase text-brand-black mb-1 font-display">
                    PRODUCT & BRAND POSITIONING
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Menemukan sudut pandang unik agar deodorant Anda menonjol dan disukai konsumen.
                  </p>
                </div>

                <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-black text-[#2F6BFF] tracking-wider block font-onest mb-1.5">
                    02
                  </span>
                  <h3 className="text-sm font-black uppercase text-brand-black mb-1 font-display">
                    BRANDING & PACKAGING STRATEGY
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Membangun citra brand premium melalui visual packaging dan story yang kuat.
                  </p>
                </div>

                <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-black text-[#2F6BFF] tracking-wider block font-onest mb-1.5">
                    03
                  </span>
                  <h3 className="text-sm font-black uppercase text-brand-black mb-1 font-display">
                    DIGITAL ADS & FUNNEL PENJUALAN
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Panduan beriklan di Meta, TikTok, dan Google Ads untuk mendatangkan repeat order.
                  </p>
                </div>

                <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-black text-[#2F6BFF] tracking-wider block font-onest mb-1.5">
                    04
                  </span>
                  <h3 className="text-sm font-black uppercase text-brand-black mb-1 font-display">
                    BEAUTYPRENEUR NETWORKING
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Koneksi bisnis dan sharing wawasan langsung bersama 500+ brand owner jaringan Dreamlab.
                  </p>
                </div>
              </div>

              <div>
                <Link
                  href="/ads/thankyou/google-ads/"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF8A00] text-white rounded-full font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-[#D97700] hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-[#FF8A00]/20"
                >
                  <span>KONSULTASI BERSAMA DREAMLAB</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Real Photos Collage */}
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

      {/* ============ CLOSING CTA ============ */}
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
            Siap Bangun Brand Deodorant{' '}
            <span className="text-white">Signature Anda</span>?
          </h2>
          <p className="text-base md:text-lg text-white/85 max-w-xl mx-auto">
            Diskusikan ide produk, estimasi HPP kompetitif, dan sampel formula bersama
            tim formulator Dreamlab tanpa komitmen awal. Kami siap membantu dari nol sampai siap jual.
          </p>
          <Link
            href="/ads/thankyou/google-ads/"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-brand-orange rounded-[50px] font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
          >
            {/* WhatsApp Icon */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.019-5.117-2.875-6.976C16.592 1.899 14.116.88 11.986.88 6.548.88 2.122 5.3 2.119 10.74c-.002 1.706.452 3.37 1.312 4.848l-.994 3.629 3.73-.973zm11.366-6.726c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Konsultasi Gratis Sekarang
          </Link>
        </motion.div>
      </motion.section>

      {/* CREDIBILITY / CERTIFICATIONS BANNER */}
      <AdsCredibilitySection channel="google-ads" />

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

      {/* FLOATING WHATSAPP BUTTON */}
      <Link
        href="/ads/thankyou/google-ads/"
        className="fixed bottom-6 right-6 z-50 bg-[#25d366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
        aria-label="Konsultasi via WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </Link>
    </div>
  );
}
