'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ShieldCheck, FlaskConical, Package, Award, Heart, Droplet } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const products = [
  { name: 'Baby Wash', image: '/new asset/baby-care/baby-wash.webp' },
  { name: 'Baby Shampoo', image: '/new asset/baby-care/baby-shampoo.webp' },
  { name: 'Baby Lotion', image: '/new asset/baby-care/baby-lotion.webp' },
  { name: 'Baby Powder', image: '/new asset/baby-care/baby-powder.webp' },
  { name: 'Baby Cologne', image: '/new asset/baby-care/baby-cologne.webp' },
];

const benefits = [
  { icon: FlaskConical, title: 'Custom Formula Premium', desc: 'Formula exclusive bebas paraben, hypoallergenic, pH balanced — dirancang khusus untuk kulit bayi yang sensitif.' },
  { icon: ShieldCheck, title: 'Legalitas Siap Edar', desc: 'BPOM, Halal MUI, dan uji lab lengkap. Produk Anda siap masuk pasar tanpa hambatan regulasi.' },
  { icon: Heart, title: 'Riset Pasar Ibu Muda', desc: 'Kami support riset tren dan kebutuhan ibu modern — dari preferensi aroma hingga kemasan yang praktis.' },
  { icon: Package, title: 'MOQ Ramah Pemula', desc: 'Mulai dari quantity kecil. Cocok untuk brand baru yang ingin uji pasar sebelum scale up.' },
  { icon: Award, title: 'Free Desain Kemasan', desc: 'Desain eksklusif yang mencerminkan kelembutan dan kepercayaan — daya tarik utama di rak toko.' },
  { icon: Droplet, title: 'Bebas Bahan Keras', desc: 'Tanpa pewangi sintetis berlebih, tanpa alkohol keras, tanpa pewarna buatan.' },
];

export default function BabyCareMetaAdsLP() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-brand-black font-sans selection:bg-brand-orange selection:text-white">

      {/* ============ HERO ============ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-brand-black">
        <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/50 to-black/30 pointer-events-none z-10" />
        <Image
          src="/new asset/background-visual-hero-section/babycare.webp"
          alt="Maklon Baby Care Premium"
          fill
          priority
          className="object-cover object-center"
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
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-white uppercase">Baby Care Premium — Aman & Lembut untuk Buah Hati</span>
            </motion.div>
            <motion.h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] uppercase font-display" variants={fadeUp}>
              Bangun Baby Care Line{' '}
              <span className="text-brand-orange">yang Dipercaya</span>{' '}
              Orang Tua Indonesia
            </motion.h1>
            <motion.p className="text-base md:text-lg text-white/80 leading-relaxed max-w-xl" variants={fadeUp}>
              Setiap orang tua hanya ingin yang terbaik untuk buah hatinya. Dreamlab bantu Anda
              menciptakan produk baby care yang aman, lembut, dan bersertifikat — dari formula
              bebas paraben hingga kemasan yang memenangkan hati ibu muda.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-4 pt-2" variants={fadeUp}>
              <Link
                href="https://dreamlab.id/ads/thankyou/metaads/"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-brand-orange text-white rounded-[50px] font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
              >
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
              Banyak Produk Bayi{' '}
              <span className="text-brand-orange">Tidak Sepenuhnya Aman</span>
            </motion.h2>
            <motion.p
              className="text-base md:text-lg text-neutral-500 leading-relaxed"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
            >
              Ibu muda sekarang lebih kritis. Mereka baca label, cek komposisi, dan hanya memilih
              produk yang benar-benar aman untuk kulit bayi. Paraben, pewangi sintetis, dan bahan
              keras lainnya adalah <strong>red flag utama</strong>. Sayangnya, masih banyak produk
              baby care di pasaran yang belum memenuhi standar keamanan ini — dan itu artinya
              <strong> peluang besar bagi brand Anda</strong>.
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
              { value: '87%', label: 'Ibu muda cek label produk sebelum beli' },
              { value: '2×', label: 'Pertumbuhan pasar baby care natural (2025)' },
              { value: '5', label: 'Varian produk: Wash, Shampoo, Lotion, Powder, Cologne' },
              { value: '100%', label: 'Produk bebas paraben & hypoallergenic' },
            ].map((stat, i) => (
              <motion.div key={i} className="p-6 rounded-xl bg-[#FAF9F6] border border-neutral-100 text-center space-y-3" variants={fadeUp}>
                <span className="block text-3xl md:text-4xl font-black text-brand-orange font-display">{stat.value}</span>
                <span className="block text-xs md:text-sm text-neutral-500 leading-snug">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ PRODUCT SHOWCASE ============ */}
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
              Maklon Baby Care{' '}
              <span className="text-brand-orange">Dreamlab</span>
            </h2>
            <p className="text-base md:text-lg text-neutral-500 leading-relaxed">
              Dari sabun hingga parfum bayi — semua bisa dikustom sesuai visi brand Anda.
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-6">
            {products.map((product, i) => (
              <motion.div key={i} className="w-[170px] group" variants={fadeUp}>
                <div className="aspect-square rounded-2xl bg-white border border-neutral-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 mb-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h3 className="text-sm font-bold text-brand-black text-center">{product.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ============ BENEFITS ============ */}
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
              Bukan sekadar maklon — kami partner yang pastikan produk baby care Anda aman, legal, dan siap bersaing.
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

      {/* ============ STATS ============ */}
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
              { value: '5', label: 'Varian baby care siap custom' },
              { value: '100%', label: 'BPOM & Halal MUI terjamin' },
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
            Siap Hadirkan{' '}
            <span className="text-white">Baby Care</span>{' '}
            Terbaik?
          </h2>
          <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto">
            Dapatkan konsultasi GRATIS dengan tim Dreamlab. Kami bantu dari formulasi,
            legalitas, hingga strategi masuk pasar ibu muda Indonesia.
          </p>
          <Link
            href="https://dreamlab.id/ads/thankyou/metaads/"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-brand-orange rounded-[50px] font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
          >
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
