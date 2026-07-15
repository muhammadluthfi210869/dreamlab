'use client';

import Image from 'next/image';
import { useCallback, useEffect } from 'react';
import { Calculator, Tag, TrendingUp, MessageCircle, Gift, Award, Star } from 'lucide-react';

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
];

const bonuses = [
  {
    icon: Gift,
    title: 'Free Desain Logo & Kemasan',
    desc: 'Dapatkan desain logo dan kemasan profesional tanpa biaya tambahan. Brand kamu siap tampil premium dari hari pertama.',
  },
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
        <div className="container-custom relative w-full py-24 md:py-32 lg:py-40">
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-white uppercase">Dreamlab — Partner Maklon Kosmetik Premium</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] uppercase font-display">
              Mulai Brand Kosmetik yang{' '}
              <span className="text-brand-orange">Tepat</span>{' '}
              Bersama Dreamlab
            </h1>
            <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-xl">
              Dari riset formula eksklusif hingga strategi pemasaran, kami dampingi sampai
              brand Anda siap mendominasi pasar.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-brand-orange text-white rounded-[50px] font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                Konsultasi Gratis Sekarang
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEAR-RELIEF SECTION ============ */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-brand-black tracking-tight leading-[1.15] uppercase font-display">
              Takut Bisnis Skincare Gagal?{' '}
              <span className="text-brand-orange">Kami Pastikan Anda Siap Melangkah</span>
            </h2>
            <p className="text-base md:text-lg text-neutral-500 leading-relaxed">
              Risiko terbesar brand baru bukan karena produknya jelek — tapi karena kurang persiapan
              di bisnisnya. Dreamlab dampingi dari hulu ke hilir.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {fears.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="group p-8 rounded-2xl bg-[#FAF9F6] border border-neutral-100 hover:border-brand-orange/20 hover:bg-brand-orange/[0.02] transition-all duration-300 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors">
                    <Icon className="w-6 h-6 text-brand-orange" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-black">{item.title}</h3>
                  <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ BONUS SECTION ============ */}
      <section className="py-20 md:py-24 bg-[#FAF9F6]">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-brand-black tracking-tight leading-[1.15] uppercase font-display">
              Mulai Bisnis{' '}
              <span className="text-brand-orange">Tanpa Beban</span>{' '}
              dengan Bonus Kami
            </h2>
            <p className="text-base md:text-lg text-neutral-500 leading-relaxed">
              Setiap kerja sama maklon sudah termasuk gratis — jadi kamu bisa fokus ke strategi brand,
              bukan khawatir biaya tambahan.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {bonuses.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="relative p-8 md:p-10 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-5">
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
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ STATS ROW ============ */}
      <section className="bg-brand-black py-14 md:py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { value: '500+', label: 'Brand sudah diproduksi' },
              { value: '1:1', label: '1 Klien = 1 Formula (bukan template)' },
              { value: '7', label: 'Kategori produk didukung' },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-3">
                <span className="block text-4xl md:text-5xl lg:text-6xl font-black text-brand-orange font-display">
                  {stat.value}
                </span>
                <span className="block text-xs md:text-sm font-bold text-white/50 uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIAL SECTION ============ */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-brand-black tracking-tight text-center mb-4 uppercase font-display">
            Apa Kata{' '}
            <span className="text-brand-orange">Klien Dreamlab</span>
          </h2>
          <p className="text-sm md:text-base text-neutral-400 text-center max-w-xl mx-auto mb-12 md:mb-16 font-medium">
            Mereka sudah merasakan langsung pendampingan dari tim Dreamlab.
          </p>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((t, i) => (
              <blockquote
                key={i}
                className="bg-[#FAF9F6] p-8 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-5"
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
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section id="form-kommo" className="py-20 md:py-28 bg-brand-orange text-white relative overflow-hidden">
        <div className="container-custom text-center relative space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] uppercase font-display max-w-3xl mx-auto text-white">
            Siap Memulai{' '}
            <span className="text-white">Brand Anda?</span>
          </h2>
          <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto">
            Isi form di bawah, tim Dreamlab akan menghubungi kamu dalam 1x24 jam untuk
            sesi konsultasi GRATIS.
          </p>
        </div>
      </section>

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
