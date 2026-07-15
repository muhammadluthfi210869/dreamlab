'use client';

import Image from 'next/image';
import { useCallback } from 'react';
import { MessageCircle, Sparkles, ShieldCheck, TrendingUp } from 'lucide-react';

const testimonials = [
  {
    quote: 'Dulu saya coba maklon lain, formulanya standar semua. Di Dreamlab, formula serum saya beneran exclusive — nggak ada brand lain yang pakai formula yang sama.',
    brand: '— Owner Brand Skincare Lokal',
  },
  {
    quote: 'Yang bikin saya percaya Dreamlab: dari awal udah diarahin soal BPOM dan Halal, bukan janji di akhir. Produk saya lolos BPOM tanpa revisi.',
    brand: '— Founder Brand Body Care',
  },
  {
    quote: 'MOQ-nya ramah untuk brand baru. Saya bisa mulai dari quantity kecil dulu, scale up pas permintaan naik. Nggak perlu modal besar di awal.',
    brand: '— Pemilik Brand Hair Care',
  },
];

const differentiators = [
  {
    title: 'Formula Eksklusif, Bukan Katalog',
    desc: 'Maklon lain sering pakai formula yang sama untuk banyak brand. Dreamlab riset dan bikin formula khusus punya kamu — nggak dijual ke brand lain.',
    icon: Sparkles,
  },
  {
    title: 'Legalitas Jelas dari Awal',
    desc: 'BPOM, CPKB Grade A, Halal MUI diproses sejak awal, bukan janji di akhir.',
    icon: ShieldCheck,
  },
  {
    title: 'MOQ Fleksibel',
    desc: 'Baru mulai? MOQ Dreamlab dirancang ramah untuk brand baru, bukan cuma untuk pemain besar.',
    icon: TrendingUp,
  },
  {
    title: 'Bukan Cuma Produksi, Tapi Full Support',
    desc: 'Desain kemasan dan marketing support gratis — kamu nggak jalan sendirian dari formula sampai jualan.',
    icon: MessageCircle,
  },
];

export default function LandingMofBofPage() {
  const scrollToForm = useCallback(() => {
    document.getElementById('form-kommo')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="landing-page-ads min-h-screen bg-[#FAF9F6] text-brand-black font-sans selection:bg-brand-orange selection:text-white">

      {/* Init script — set params, must run before amoforms.js loads */}
      <script
        id="amoforms-init-1639043"
        dangerouslySetInnerHTML={{
          __html: `!function(a,m,o,c,r,m){a[o+c]=a[o+c]||{setMeta:function(p){this.params=(this.params||[]).concat([p])}},a[o+r]=a[o+r]||function(f){a[o+r].f=(a[o+r].f||[]).concat([f])},a[o+r]({id:"1639043",hash:"e0c06e982b3fd577ee1fa1aae0674c34",locale:"id"}),a[o+m]=a[o+m]||function(f,k){a[o+m].f=(a[o+m].f||[]).concat([[f,k]])}}(window,0,"amo_forms_","params","load","loaded");`,
        }}
      />

      {/* ============ HERO ============ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-brand-black">
        <Image
          src="/images/landing/Dreamlab_Landingpage_MOF-BOF_1.jpg"
          alt="Dreamlab - Maklon Kosmetik Juaranya Formula"
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
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-white uppercase">Maklon Kosmetik Premium</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] uppercase font-display">
              Formula yang Sama,{' '}
              <span className="text-brand-orange">Nggak Akan Pernah</span>{' '}
              Bikin Brand Kamu Juara
            </h1>
            <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-xl">
              Dreamlab bikin 1 formula eksklusif untuk 1 klien — bukan template yang dipakai ulang
              ke brand lain. Bersertifikat <strong className="text-white font-bold">BPOM</strong>,{' '}
              <strong className="text-white font-bold">CPKB Grade A</strong>, dan{' '}
              <strong className="text-white font-bold">Halal MUI</strong>, dari riset sampai
              produk siap jual.
            </p>
            {/* CTA scroll ke form di bawah */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="button"
                onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-brand-orange text-white rounded-[50px] font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 min-w-[240px]"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                Konsultasi Gratis Sekarang
              </button>
              <a
                href="#beda"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-[50px] font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 hover:bg-white/20 hover:border-white/50 active:scale-95 min-w-[200px]"
              >
                Pelajari Dulu
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST BADGE ROW ============ */}
      <section className="bg-brand-black py-8 md:py-10 border-t border-white/5">
        <div className="container-custom flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <span className="text-xs md:text-sm font-bold tracking-widest text-brand-white/50 uppercase">Tersertifikasi Resmi:</span>
          <span className="text-sm md:text-base font-black text-white tracking-wide">BPOM</span>
          <span className="w-1 h-1 rounded-full bg-brand-orange/50" />
          <span className="text-sm md:text-base font-black text-white tracking-wide">CPKB Grade A</span>
          <span className="w-1 h-1 rounded-full bg-brand-orange/50" />
          <span className="text-sm md:text-base font-black text-white tracking-wide">Halal MUI</span>
        </div>
      </section>

      {/* ============ STATS ROW ============ */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { value: '500+', label: 'Brand sudah diproduksi' },
              { value: '1:1', label: '1 Klien = 1 Formula (bukan template)' },
              { value: '7', label: 'Kategori produk didukung' },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-3">
                <span className="block text-4xl md:text-5xl lg:text-6xl font-black text-brand-orange font-display">
                  {stat.value}
                </span>
                <span className="block text-xs md:text-sm font-bold text-neutral-400 uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ QUOTE CARDS ============ */}
      <section className="py-20 md:py-24 bg-[#FAF9F6]">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-brand-black tracking-tight text-center mb-4 uppercase font-display">
            Kata Mereka yang Sudah Jalan Bareng Dreamlab
          </h2>
          <p className="text-sm md:text-base text-neutral-400 text-center max-w-xl mx-auto mb-12 md:mb-16 font-medium">
            Brand-brand ini memilih formula eksklusif, bukan template jadi.
          </p>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((t, i) => (
              <blockquote
                key={i}
                className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-5"
              >
                <svg className="w-8 h-8 text-brand-orange/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-sm md:text-base text-neutral-600 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <cite className="block text-xs font-bold text-brand-orange not-italic tracking-wide">
                  {t.brand}
                </cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ============ KENAPA BEDA ============ */}
      <section id="beda" className="py-20 md:py-24 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-brand-black tracking-tight text-center mb-4 uppercase font-display">
            Kenapa Beda dari Maklon Lain
          </h2>
          <p className="text-sm md:text-base text-neutral-400 text-center max-w-xl mx-auto mb-12 md:mb-16 font-medium">
            Bukan cuma produksi — kamu dapet partner yang riset &amp; develop formula khusus.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
            {differentiators.map((item, i) => {
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

      {/* ============ CARA KERJA ============ */}
      <section className="py-20 md:py-24 bg-[#FAF9F6]">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-brand-black tracking-tight text-center mb-4 uppercase font-display">
            Cara Kerjanya
          </h2>
          <p className="text-sm md:text-base text-neutral-400 text-center max-w-xl mx-auto mb-12 md:mb-16 font-medium">
            4 langkah dari ide sampai produk siap jual.
          </p>
          <div className="max-w-2xl mx-auto">
            {[
              { number: 1, text: 'Isi form konsultasi gratis — ceritakan ide brand kamu' },
              { number: 2, text: 'Tim R&D bikin formula eksklusif khusus untuk brand kamu' },
              { number: 3, text: 'Produksi dengan standar BPOM, CPKB Grade A, Halal MUI' },
              { number: 4, text: 'Brand kamu siap jual, lengkap dengan kemasan dan support marketing' },
            ].map((item) => (
              <div key={item.number} className="flex gap-5 md:gap-7 items-start pb-8 last:pb-0 relative">
                <div className="shrink-0 relative">
                  <span className="w-12 h-12 rounded-full bg-brand-orange text-white font-black text-lg flex items-center justify-center font-display shadow-md relative z-10">
                    {item.number}
                  </span>
                  {item.number < 4 && (
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-px h-8 bg-brand-orange/20" />
                  )}
                </div>
                <p className="text-base md:text-lg text-neutral-600 leading-relaxed pt-3">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section id="form-kommo" className="py-20 md:py-28 bg-brand-black text-brand-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/[0.03] blur-[180px] rounded-full pointer-events-none" />
        <div className="container-custom text-center relative space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] uppercase font-display max-w-3xl mx-auto">
            Formula Kamu Belum Ada —{' '}
            <span className="text-brand-orange">Sebelum Kompetitor Duluan</span> yang Punya
          </h2>
          <p className="text-base md:text-lg text-white/60 max-w-xl mx-auto">
            Ribuan brand sudah mulai dengan konsultasi gratis. Sekarang giliran kamu.
          </p>
          {/* Script loader = tempat form akan di-render oleh widget Kommo */}
          <script
            id="amoforms_script_1639043"
            async
            charSet="utf-8"
            src="https://forms.kommo.com/forms/assets/js/amoforms.js?1784107897"
          />
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="py-8 border-t border-neutral-200 bg-white">
        <div className="container-custom text-center space-y-1">
          <p className="text-[10px] font-bold text-brand-black/20 tracking-widest uppercase">
            PT Karya Impian Laboratoris
          </p>
          <p className="text-[9px] font-medium text-brand-black/20 tracking-wide uppercase">
            All Rights Reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
