'use client';

import Image from 'next/image';
import { useCallback, useEffect } from 'react';
import { Calculator, Tag, TrendingUp, MessageCircle, Gift, Award, Star, FlaskConical, Package, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const fears = [
  {
    icon: Calculator,
    title: 'Perhitungan HPP',
    desc: 'Kami bantu hitung HPP detail per produk — dari bahan baku, kemasan, hingga produksi — jadi kamu tahu persis margin bisnis sejak awal.',
  },
  {
    icon: Tag,
    title: 'Strategi Harga',
    desc: 'Tentukan harga jual yang kompetitif tanpa mengorbankan profit. Kami sesuaikan dengan segmentasi pasar target kamu.',
  },
  {
    icon: TrendingUp,
    title: 'Strategi Digital Marketing',
    desc: 'Dari konten sosial media hingga funnel iklan, kami kasih panduan marketing yang udah teruji buat brand kosmetik baru.',
  },
  {
    icon: MessageCircle,
    title: 'Konsultasi Brand',
    desc: 'Diskusikan konsep brand, target pasar, dan positioning dari awal — biar brand kamu lahir dengan fondasi yang kuat.',
  },
  {
    icon: FlaskConical,
    title: 'Custom Formula',
    desc: 'Anda bisa custom formula dan tim R&D kami siap membantu riset produk impian Anda.',
  },
  {
    icon: Package,
    title: 'MOQ Fleksibel',
    desc: 'Anda bebas menentukan MOQ fleksibel yang paling sesuai dengan kebutuhan skala bisnis Anda.',
  },
  {
    icon: ShieldCheck,
    title: 'Full Legal Support',
    desc: 'Dukungan penuh BPOM, Halal, dan CPKB Grade A.',
  },
  {
    icon: Gift,
    title: 'Free Desain Logo & Kemasan',
    desc: 'Dapatkan desain logo dan kemasan profesional tanpa biaya tambahan. Brand kamu siap tampil premium dari hari pertama.',
  },
];

const bonuses = [
  {
    icon: Award,
    title: 'Free Coaching Bisnis',
    desc: 'Coaching 1-on-1 dengan tim Dreamlab — dari strategi go-to-market, cara pitching ke distributor, sampai manajemen stok.',
    note: 'Kuota terbatas untuk menjaga kualitas pendampingan.',
  },
];

const testimonials = [
  {
    quote: 'Pendampingan dari Dreamlab sangat membantu saya yang baru pertama kali terjun ke bisnis skincare. Dari formula sampai kemasan, semuanya diarahkan dengan jelas.',
    label: '— Klien Dreamlab',
  },
  {
    quote: 'Yang saya suka adalah transparansi sejak awal. Saya tahu persis biaya, bahan yang dipakai, dan timeline produksi. Tidak ada hal yang ditutup-tutupi.',
    label: '— Klien Dreamlab',
  },
  {
    quote: 'Free coaching bisnisnya benar-benar membantu. Saya jadi paham cara positioning produk di pasar yang ramai.',
    label: '— Klien Dreamlab',
  },
];

export default function LandingMofBofPage() {
  const scrollToForm = useCallback(() => {
    document.getElementById('form-kommo')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const w = window as any;
    const p = 'amo_forms_';

    w[p + 'params'] = w[p + 'params'] || {
      setMeta: function (p: any) {
        this.params = (this.params || []).concat([p]);
      },
    };
    w[p + 'load'] = w[p + 'load'] || function (f: any) {
      w[p + 'load'].f = (w[p + 'load'].f || []).concat([f]);
    };
    w[p + 'load']({ id: '1639043', hash: 'e0c06e982b3fd577ee1fa1aae0674c34', locale: 'id' });
    w[p + 'loaded'] = w[p + 'loaded'] || function (f: any, k: any) {
      w[p + 'loaded'].f = (w[p + 'loaded'].f || []).concat([[f, k]]);
    };

    const existing = document.getElementById('amoforms_script_1639043');
    if (!existing) {
      const script = document.createElement('script');
      script.id = 'amoforms_script_1639043';
      script.src = 'https://forms.kommo.com/forms/assets/js/amoforms.js?1784112363';
      script.async = true;
      script.charset = 'utf-8';
      document.getElementById('form-kommo')?.appendChild(script);
    }
  }, []);

  return (
    <div className="landing-page-ads min-h-screen bg-[#FAF9F6] text-brand-black font-sans selection:bg-brand-orange selection:text-white">

      {/* ============ FLOATING WA BUTTON → scroll to form ============ */}
      <div className="fixed bottom-8 right-8 z-50 wa-float">
        <button
          type="button"
          onClick={scrollToForm}
          className="flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform group"
          aria-label="Konsultasi Gratis"
        >
          <MessageCircle className="w-8 h-8 fill-current" />
          <span className="absolute right-20 bg-white text-brand-black px-4 py-2.5 rounded-lg text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100">
            Konsultasi Gratis
          </span>
        </button>
        <style>{`
          .wa-float {
            animation: wa-appear 0.4s ease-out 1s both;
          }
          @media (prefers-reduced-motion: reduce) {
            .wa-float { animation: none; }
          }
          @keyframes wa-appear {
            from { opacity: 0; transform: scale(0); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>

      {/* ============ HERO ============ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-brand-black">
        <Image
          src="/images/landing/dreamlab_hero_lp.png"
          alt="Dreamlab - Maklon Kosmetik Premium"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30 pointer-events-none" />
        <motion.div
          className="container-custom relative w-full py-24 md:py-32 lg:py-40"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div className="max-w-2xl space-y-8" variants={fadeUp}>
            <motion.div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full" variants={fadeUp}>
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-white uppercase">Dreamlab — Partner Maklon Kosmetik Premium</span>
            </motion.div>
            <motion.h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] uppercase font-display" variants={fadeUp}>
              Mulai Brand Kosmetik yang{' '}
              <span className="text-brand-orange">Tepat</span>{' '}
              Bersama Dreamlab
            </motion.h1>
            <motion.p className="text-base md:text-lg text-white/80 leading-relaxed max-w-xl" variants={fadeUp}>
              Dari riset formula eksklusif hingga strategi pemasaran, kami dampingi sampai
              brand Anda siap mendominasi pasar.
            </motion.p>
            <motion.div className="pt-2" variants={fadeUp}>
              <button
                type="button"
                onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-brand-orange text-white rounded-[50px] font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                Konsultasi Gratis Sekarang
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============ FEAR-RELIEF SECTION ============ */}
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
              Takut Bisnis Skincare Gagal?{' '}
              <span className="text-brand-orange">Kami Pastikan Anda Siap Melangkah</span>
            </h2>
            <p className="text-base md:text-lg text-neutral-500 leading-relaxed">
              Risiko terbesar brand baru bukan karena produknya jelek — tapi karena kurang persiapan
              di bisnisnya. Dreamlab dampingi dari hulu ke hilir.
            </p>
          </motion.div>
          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5" variants={stagger}>
            {fears.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i} className="group p-5 md:p-6 rounded-xl bg-[#FAF9F6] border border-neutral-100 hover:border-brand-orange/20 hover:bg-brand-orange/[0.02] transition-all duration-300 space-y-3" variants={fadeUp}>
                  <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors">
                    <Icon className="w-5 h-5 text-brand-orange" />
                  </div>
                  <h3 className="text-sm font-bold text-brand-black leading-snug">{item.title}</h3>
                  <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
          <motion.div className="flex justify-center mt-12" variants={fadeUp}>
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-orange text-white rounded-[50px] font-extrabold text-sm uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
            >
              <MessageCircle className="w-5 h-5 shrink-0" />
              Konsultasi Gratis Sekarang
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* ============ BONUS SECTION ============ */}
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
              Mulai Bisnis{' '}
              <span className="text-brand-orange">Tanpa Beban</span>{' '}
              dengan Bonus Kami
            </h2>
            <p className="text-base md:text-lg text-neutral-500 leading-relaxed">
              Setiap kerja sama maklon sudah termasuk gratis — jadi kamu bisa fokus ke strategi brand,
              bukan khawatir biaya tambahan.
            </p>
          </motion.div>
          <motion.div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto" variants={stagger}>
            {bonuses.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i} className="relative p-8 md:p-10 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-5" variants={fadeUp}>
                  <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-brand-orange" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-black">{item.title}</h3>
                  <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                    {item.desc}
                  </p>
                  {item.note && (
                    <p className="text-xs font-bold text-brand-orange/80 flex items-center gap-2 border-t border-neutral-100 pt-4 mt-2">
                      <Star className="w-3.5 h-3.5 shrink-0" />
                      {item.note}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* ============ STATS ROW ============ */}
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
              { value: '7', label: 'Kategori produk didukung' },
            ].map((stat, i) => (
              <motion.div key={i} className="text-center space-y-3" variants={fadeUp}>
                <span className="block text-4xl md:text-5xl lg:text-6xl font-black text-brand-orange font-display">
                  {stat.value}
                </span>
                <span className="block text-xs md:text-sm font-bold text-white/50 uppercase tracking-widest">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ============ TESTIMONIAL SECTION ============ */}
      <motion.section
        className="py-20 md:py-24 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        <div className="container-custom">
          <motion.h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-brand-black tracking-tight text-center mb-4 uppercase font-display" variants={fadeUp}>
            Apa Kata{' '}
            <span className="text-brand-orange">Klien Dreamlab</span>
          </motion.h2>
          <motion.p className="text-sm md:text-base text-neutral-400 text-center max-w-xl mx-auto mb-12 md:mb-16 font-medium" variants={fadeUp}>
            Mereka sudah merasakan langsung pendampingan dari tim Dreamlab.
          </motion.p>
          <motion.div className="grid md:grid-cols-3 gap-6 md:gap-8" variants={stagger}>
            {testimonials.map((t, i) => (
              <motion.blockquote
                key={i}
                className="bg-[#FAF9F6] p-8 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-5"
                variants={fadeUp}
              >
                <svg className="w-8 h-8 text-brand-orange/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-sm md:text-base text-neutral-600 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <cite className="block text-xs font-bold text-brand-orange not-italic tracking-wide">
                  {t.label}
                </cite>
              </motion.blockquote>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ============ FINAL CTA ============ */}
      <motion.section
        id="form-kommo"
        className="py-20 md:py-28 bg-brand-orange text-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        <motion.div className="container-custom text-center relative space-y-8" variants={fadeUp}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] uppercase font-display max-w-3xl mx-auto text-white">
            Siap Memulai{' '}
            <span className="text-white">Brand Anda?</span>
          </h2>
          <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto">
            Isi form di bawah, tim Dreamlab akan menghubungi kamu dalam 1x24 jam untuk
            sesi konsultasi GRATIS.
          </p>
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
