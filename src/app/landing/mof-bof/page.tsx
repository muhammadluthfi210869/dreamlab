'use client';

import Image from 'next/image';
import Script from 'next/script';
import { useCallback } from 'react';
import { MessageCircle, Sparkles, ShieldCheck, TrendingUp } from 'lucide-react';

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

      {/* Init script — set params via next/script (afterInteractive) */}
      <Script
        id="amoforms-init-1639043"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(a,m,o,c,r,m){a[o+c]=a[o+c]||{setMeta:function(p){this.params=(this.params||[]).concat([p])}},a[o+r]=a[o+r]||function(f){a[o+r].f=(a[o+r].f||[]).concat([f])},a[o+r]({id:"1639043",hash:"e0c06e982b3fd577ee1fa1aae0674c34",locale:"id"}),a[o+m]=a[o+m]||function(f,k){a[o+m].f=(a[o+m].f||[]).concat([[f,k]])}}(window,0,"amo_forms_","params","load","loaded");
          `,
        }}
      />
      {/* Loader script — raw <script> tag di dalam Final CTA biar Kommo render di posisi yang benar */}

      {/* ============ HERO ============ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-brand-black">
        <Image
          src="/images/landing/dreamlab_hero_lp.png"
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
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-white uppercase">Juaranya Formula — Partner Maklon Kosmetik Premium</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] uppercase font-display">
              Formula Sendiri,{' '}
              <span className="text-brand-orange">Bukan Formula Bersama</span>
            </h1>
            <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-xl">
              Kalau maklon lain kasih kamu &ldquo;pilih dari katalog&rdquo;, Dreamlab riset dan
              racik formula khusus untuk brand kamu dari nol — bersertifikat{' '}
              <strong className="text-white font-bold">BPOM</strong>,{' '}
              <strong className="text-white font-bold">CPKB Grade A</strong>, dan{' '}
              <strong className="text-white font-bold">Halal MUI</strong>.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-brand-orange text-white rounded-[50px] font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 min-w-[240px]"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                Konsultasi Gratis Sekarang
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BEDA DARI YANG LAIN ============ */}
      <section className="py-20 md:py-24 bg-[#FAF9F6]">
        <div className="container-custom max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-brand-black tracking-tight leading-[1.15] uppercase font-display">
            Pengen Brand Skincare yang{' '}
            <span className="text-brand-orange">Beda</span>, Bukan Cuma Versi Lain{' '}
            dari yang Sudah Ada?
          </h2>
          <p className="text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Kebanyakan brand baru cuma beda di kemasan — isi di dalamnya sama persis dengan brand
            lain, karena dibuat dari formula katalog yang dipakai ulang ke banyak klien. Dreamlab
            kerja dari arah sebaliknya: tim R&amp;D riset dan racik formula baru{' '}
            <strong>khusus untuk brand kamu</strong>. Jadi yang bikin brand kamu beda bukan cuma
            desain kemasan — tapi apa yang sebenarnya ada di dalam produknya.
          </p>
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

      {/* ============ KENAPA BEDA ============ */}
      <section id="beda" className="py-20 md:py-24 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-brand-black tracking-tight text-center mb-4 uppercase font-display">
            Kenapa Beda dari Maklon Lain
          </h2>
          <p className="text-sm md:text-base text-neutral-400 text-center max-w-2xl mx-auto mb-12 md:mb-16 font-medium">
            Dreamlab bukan cuma maklon — Dreamlab itu partner yang mikirin brand kamu dari riset
            formula sampai gimana caranya bersaing di pasar. Ini yang bikin Dreamlab jadi{' '}
            <strong className="text-brand-orange">Juaranya Formula</strong>.
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

      {/* ============ FINAL CTA ============ */}
      <section id="form-kommo" className="py-20 md:py-28 bg-brand-black text-brand-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/[0.03] blur-[180px] rounded-full pointer-events-none" />
        <div className="container-custom text-center relative space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] uppercase font-display max-w-3xl mx-auto">
            Jangan Tunggu Sampai{' '}
            <span className="text-brand-orange">Ide Brand Kamu Ditiru</span>{' '}
            Orang Lain — Amankan Formula Kamu Sekarang
          </h2>
          <p className="text-base md:text-lg text-white/60 max-w-xl mx-auto">
            Ribuan brand sudah mulai dengan konsultasi gratis. Sekarang giliran kamu.
          </p>
          {/* DOM anchor + loader — Kommo widget render iframe SEBELUM script tag ini */}
          <script
            id="amoforms_script_1639043"
            async
            charSet="utf-8"
            src="https://forms.kommo.com/forms/assets/js/amoforms.js?1784112363"
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
