'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Package, Palette, MessageCircle, TrendingUp, FlaskConical, Award } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const benefits = [
  { icon: FlaskConical, title: 'Custom Formula', desc: 'Racik formula deodorant sesuai kebutuhan kulit dan preferensi aroma — dari spray, roll-on, dry serum, hingga balm.' },
  { icon: Palette, title: 'Desain Kemasan', desc: 'Free desain kemasan eksklusif yang mencerminkan identitas brand kamu. Tampil beda dari kompetitor.' },
  { icon: ShieldCheck, title: 'Legalitas Lengkap', desc: 'Dukungan penuh BPOM, Halal, dan Uji Lab. Produk siap edar tanpa hambatan regulasi.' },
  { icon: Package, title: 'MOQ Fleksibel', desc: 'Cocok untuk brand baru maupun skala besar. Mulai dari quantity kecil, scale up kapan saja.' },
  { icon: Award, title: 'Free Coaching Bisnis', desc: 'Bimbingan 1-on-1 dari riset pasar, strategi harga, hingga cara menjual deodorant ke distributor.' },
  { icon: Sparkles, title: 'Peluang Tren', desc: 'Deodorant berbasis skincare adalah pasar yang tumbuh cepat. Jadilah first mover di kategori ini.' },
];

const products = [
  { name: 'Deodorant Spray', image: '/new asset/bodycare/deodorant-spray.webp', desc: 'Segar, cepat kering, coverage luas' },
  { name: 'Deodorant Roll On', image: '/new asset/bodycare/deodorant-roll-on.webp', desc: 'Aplikasi presisi, cocok untuk daily use' },
  { name: 'Deodorant Dry Serum', image: '/new asset/bodycare/deodorant-dry-serum.webp', desc: 'Tekstur ringan, nyaman di kulit sensitif' },
  { name: 'Deodorant Balm', image: '/new asset/bodycare/deodorant-balm.webp', desc: 'Formula padat, tanpa alkohol, ramah kulit' },
];

export default function DeodorantMetaAdsLP() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-brand-black font-sans selection:bg-brand-orange selection:text-white">

      {/* ============ HERO ============ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-brand-black">
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40 pointer-events-none z-10" />
        <Image
          src="/new asset/bodycare/deodorant-spray.webp"
          alt="Maklon Deodorant Custom Formula"
          fill
          priority
          className="object-cover object-center scale-110"
          sizes="100vw"
        />
        <motion.div
          className="container-custom relative z-20 w-full py-24 md:py-32 lg:py-40"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div className="max-w-2xl space-y-8" variants={fadeUp}>
            <motion.div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full" variants={fadeUp}>
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-white uppercase">Tren Gaya Hidup Aktif Menciptakan Peluang Baru</span>
            </motion.div>
            <motion.h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] uppercase font-display" variants={fadeUp}>
              Wujudkan Brand Deodorant{' '}
              <span className="text-brand-orange">Dengan Custom Formula</span>
            </motion.h1>
            <motion.p className="text-base md:text-lg text-white/80 leading-relaxed max-w-xl" variants={fadeUp}>
              Tren olahraga dan gaya hidup aktif meningkat drastis — permintaan deodorant berbasis skincare ikut melonjak. 
              Sekarang saatnya Anda memiliki brand deodorant sendiri dengan formula eksklusif, legalitas lengkap, dan MOQ ramah.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-4 pt-2" variants={fadeUp}>
              <Link
                href="https://dreamlab.id/ads/thankyou/metaads/"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-brand-orange text-white rounded-[50px] font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                Konsultasi Gratis Sekarang
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============ PROBLEM ============ */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <motion.h2
              className="text-2xl md:text-3xl lg:text-4xl font-black text-brand-black tracking-tight leading-[1.15] uppercase font-display"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
            >
              Deodorant Biasa <span className="text-brand-orange">Tidak Lagi Cukup</span>
            </motion.h2>
            <motion.p
              className="text-base md:text-lg text-neutral-500 leading-relaxed"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
            >
              Konsumen sekarang mencari deodorant yang lebih dari sekadar penghilang bau — mereka ingin produk
              perawatan kulit yang aman, nyaman, dan punya nilai lebih. Deodorant dengan bahan aktif skincare,
              tanpa alkohol, dan dengan aroma premium adalah permintaan pasar yang belum banyak terpenuhi.
            </motion.p>
          </div>
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
          >
            {[
              { value: '300%', label: 'Pertumbuhan pasar deodorant skincare (2025)' },
              { value: '65%', label: 'Konsumen milenial cari deodorant tanpa alkohol' },
              { value: '4', label: 'Varian produk: Spray, Roll On, Dry Serum, Balm' },
              { value: '1', label: 'Formula eksklusif = 1 brand (bukan katalog umum)' },
            ].map((stat, i) => (
              <motion.div key={i} className="p-6 rounded-xl bg-[#FAF9F6] border border-neutral-100 text-center space-y-3" variants={fadeUp}>
                <span className="block text-3xl md:text-4xl font-black text-brand-orange font-display">{stat.value}</span>
                <span className="block text-xs md:text-sm text-neutral-500 leading-snug">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ SOLUTION — PRODUCT SHOWCASE ============ */}
      <motion.section
        className="py-20 md:py-24 bg-[#FAF9F6]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        <div className="container-custom">
          <motion.div className="max-w-3xl mx-auto text-center space-y-4 mb-16" variants={fadeUp}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-brand-black tracking-tight leading-[1.15] uppercase font-display">
              Solusi Maklon{' '}
              <span className="text-brand-orange">Lengkap</span>{' '}
              untuk Brand Deodorant Kamu
            </h2>
            <p className="text-base md:text-lg text-neutral-500 leading-relaxed">
              Dari konsep hingga produk jadi — Dreamlab siapkan formula, kemasan, dan legalitas
              untuk 4 varian deodorant yang sedang naik daun.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <motion.div key={i} className="group" variants={fadeUp}>
                <div className="aspect-square rounded-2xl bg-white border border-neutral-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h3 className="text-base font-bold text-brand-black">{product.name}</h3>
                <p className="text-sm text-neutral-500 mt-1">{product.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ============ BENEFITS / USP GRID ============ */}
      <motion.section
        className="py-20 md:py-24 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        <div className="container-custom">
          <motion.div className="max-w-3xl mx-auto text-center space-y-4 mb-16" variants={fadeUp}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-brand-black tracking-tight leading-[1.15] uppercase font-display">
              Kenapa Pilih{' '}
              <span className="text-brand-orange">Dreamlab</span>
            </h2>
            <p className="text-base md:text-lg text-neutral-500 leading-relaxed">
              Bukan cuma maklon — kami partner yang bikin brand deodorant kamu siap bersaing.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i} className="group p-6 md:p-7 rounded-xl bg-[#FAF9F6] border border-neutral-100 hover:border-brand-orange/20 hover:bg-brand-orange/[0.02] transition-all duration-300 space-y-4" variants={fadeUp}>
                  <div className="w-11 h-11 rounded-xl bg-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors">
                    <Icon className="w-5 h-5 text-brand-orange" />
                  </div>
                  <h3 className="text-base font-bold text-brand-black">{item.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ============ STATS BAR ============ */}
      <motion.section
        className="bg-brand-black py-14 md:py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        <div className="container-custom">
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-10" variants={stagger}>
            {[
              { value: '500+', label: 'Brand sudah diproduksi' },
              { value: '1:1', label: '1 Klien = 1 Formula (bukan template)' },
              { value: '50+', label: 'Varian produk deodorant siap custom' },
            ].map((stat, i) => (
              <motion.div key={i} className="text-center space-y-3" variants={fadeUp}>
                <span className="block text-4xl md:text-5xl lg:text-6xl font-black text-brand-orange font-display">{stat.value}</span>
                <span className="block text-xs md:text-sm font-bold text-white/50 uppercase tracking-widest">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ============ CTA ============ */}
      <motion.section
        className="py-20 md:py-28 bg-brand-orange text-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        <motion.div className="container-custom text-center relative space-y-8" variants={fadeUp}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] uppercase font-display max-w-3xl mx-auto text-white">
            Siap Bikin{' '}
            <span className="text-white">Brand Deodorant</span>{' '}
            Sendiri?
          </h2>
          <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto">
            Dapatkan konsultasi GRATIS dengan tim Dreamlab. Kami bantu dari konsep formula
            sampai strategi go-to-market. Isi form sekarang, tim kami akan menghubungi dalam 1x24 jam.
          </p>
          <Link
            href="https://dreamlab.id/ads/thankyou/metaads/"
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
          <p className="text-[10px] font-bold text-white/50 tracking-widest uppercase">PT Karya Impian Laboratoris</p>
          <p className="text-[9px] font-medium text-white/40 tracking-wide uppercase">All Rights Reserved.</p>
        </div>
      </footer>

    </div>
  );
}
