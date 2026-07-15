'use client';

import Image from 'next/image';
import Script from 'next/script';

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

export default function LandingMofBofPage() {
  return (
    <div className="landing-page-ads min-h-screen bg-[#FAF9F6] text-brand-black font-sans selection:bg-brand-orange selection:text-white">

      <Script
        id="amoforms-init-1639043"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(a,m,o,c,r,m){a[o+c]=a[o+c]||{setMeta:function(p){this.params=(this.params||[]).concat([p])}},a[o+r]=a[o+r]||function(f){a[o+r].f=(a[o+r].f||[]).concat([f])},a[o+r]({id:"1639043",hash:"e0c06e982b3fd577ee1fa1aae0674c34",locale:"id"}),a[o+m]=a[o+m]||function(f,k){a[o+m].f=(a[o+m].f||[]).concat([[f,k]])}}(window,0,"amo_forms_","params","load","loaded");
          `,
        }}
      />
      <Script
        id="amoforms-script-1639043"
        src="https://forms.kommo.com/forms/assets/js/amoforms.js?1784090513"
        strategy="afterInteractive"
      />

      {/* ===== HERO ===== */}
      <section className="relative w-full overflow-hidden flex items-center pt-24 lg:pt-0 bg-[#FAF9F6]">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-brand-orange/[0.02] blur-[120px] rounded-full pointer-events-none" />
        <div className="container-custom relative w-full py-16 md:py-24 lg:py-32">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-6 md:space-y-8 order-2 md:order-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-black tracking-tight leading-[1.1] uppercase font-display">
                Formula yang Sama, Nggak Akan Pernah Bikin Brand Kamu Juara
              </h1>
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed font-medium">
                Dreamlab bikin 1 formula eksklusif untuk 1 klien — bukan template yang dipakai ulang
                ke brand lain. Bersertifikat BPOM, CPKB Grade A, dan Halal MUI, dari riset sampai
                produk siap jual.
              </p>
              <div id="kommo-form-hero" className="kommo-form-container" />
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="/images/landing/Dreamlab_Landingpage_MOF-BOF_1.jpg"
                alt="Dreamlab - Maklon Kosmetik Juaranya Formula"
                width={600}
                height={600}
                priority
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BADGE ROW ===== */}
      <section className="bg-brand-black py-8">
        <div className="container-custom text-center">
          <p className="text-sm md:text-base font-bold tracking-widest text-brand-white/80 uppercase">
            Tersertifikasi Resmi:{' '}
            <span className="text-brand-white">BPOM</span>
            <span className="text-brand-white/40 mx-2">·</span>
            <span className="text-brand-white">CPKB Grade A</span>
            <span className="text-brand-white/40 mx-2">·</span>
            <span className="text-brand-white">Halal MUI</span>
          </p>
        </div>
      </section>

      {/* ===== STATS ROW ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center space-y-2">
              <span className="block text-3xl md:text-4xl lg:text-5xl font-black text-brand-orange font-display">500+</span>
              <span className="block text-xs md:text-sm font-bold text-neutral-500 uppercase tracking-wider">Brand sudah diproduksi</span>
            </div>
            <div className="text-center space-y-2">
              <span className="block text-3xl md:text-4xl lg:text-5xl font-black text-brand-orange font-display">1:1</span>
              <span className="block text-xs md:text-sm font-bold text-neutral-500 uppercase tracking-wider">1 Klien = 1 Formula (bukan template)</span>
            </div>
            <div className="text-center space-y-2">
              <span className="block text-3xl md:text-4xl lg:text-5xl font-black text-brand-orange font-display">7</span>
              <span className="block text-xs md:text-sm font-bold text-neutral-500 uppercase tracking-wider">Kategori produk didukung</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== QUOTE CARDS ===== */}
      <section className="py-16 md:py-20 bg-[#FAF9F6]">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-black text-brand-black tracking-tight text-center mb-12 uppercase font-display">
            Kata Mereka yang Sudah Jalan Bareng Dreamlab
          </h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((t, i) => (
              <blockquote key={i} className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-100 shadow-sm space-y-4">
                <svg className="w-8 h-8 text-brand-orange/30" fill="currentColor" viewBox="0 0 24 24">
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

      {/* ===== KENAPA BEDA ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-black text-brand-black tracking-tight text-center mb-12 uppercase font-display">
            Kenapa Beda dari Maklon Lain
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
            <div className="p-6 md:p-8 rounded-2xl bg-[#FAF9F6] border border-neutral-100 space-y-3">
              <h3 className="text-lg font-bold text-brand-black">Formula Eksklusif, Bukan Katalog</h3>
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                Maklon lain sering pakai formula yang sama untuk banyak brand. Dreamlab riset dan
                bikin formula khusus punya kamu — nggak dijual ke brand lain.
              </p>
            </div>
            <div className="p-6 md:p-8 rounded-2xl bg-[#FAF9F6] border border-neutral-100 space-y-3">
              <h3 className="text-lg font-bold text-brand-black">Legalitas Jelas dari Awal</h3>
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                BPOM, CPKB Grade A, Halal MUI diproses sejak awal, bukan janji di akhir.
              </p>
            </div>
            <div className="p-6 md:p-8 rounded-2xl bg-[#FAF9F6] border border-neutral-100 space-y-3">
              <h3 className="text-lg font-bold text-brand-black">MOQ Fleksibel</h3>
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                Baru mulai? MOQ Dreamlab dirancang ramah untuk brand baru, bukan cuma untuk pemain
                besar.
              </p>
            </div>
            <div className="p-6 md:p-8 rounded-2xl bg-[#FAF9F6] border border-neutral-100 space-y-3">
              <h3 className="text-lg font-bold text-brand-black">Bukan Cuma Produksi, Tapi Full Support</h3>
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                Desain kemasan dan marketing support gratis — kamu nggak jalan sendirian dari
                formula sampai jualan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CARA KERJA ===== */}
      <section className="py-16 md:py-20 bg-[#FAF9F6]">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-black text-brand-black tracking-tight text-center mb-12 uppercase font-display">
            Cara Kerjanya
          </h2>
          <ol className="max-w-2xl mx-auto space-y-6">
            {[
              { step: 1, text: 'Isi form konsultasi gratis — ceritakan ide brand kamu' },
              { step: 2, text: 'Tim R&D bikin formula eksklusif khusus untuk brand kamu' },
              { step: 3, text: 'Produksi dengan standar BPOM, CPKB Grade A, Halal MUI' },
              { step: 4, text: 'Brand kamu siap jual, lengkap dengan kemasan dan support marketing' },
            ].map((item) => (
              <li key={item.step} className="flex gap-4 md:gap-6 items-start">
                <span className="shrink-0 w-10 h-10 rounded-full bg-brand-orange text-white font-black text-sm flex items-center justify-center font-display">
                  {item.step}
                </span>
                <p className="text-sm md:text-base text-neutral-600 leading-relaxed pt-2">
                  {item.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-16 md:py-20 bg-brand-black text-brand-white">
        <div className="container-custom text-center space-y-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-[1.1] uppercase font-display">
            Formula Kamu Belum Ada — Sebelum Kompetitor Duluan yang Punya
          </h2>
          <div id="kommo-form-final" className="kommo-form-container flex justify-center pt-4" />
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 border-t border-neutral-200 bg-white">
        <div className="container-custom text-center">
          <p className="text-[9px] font-medium text-brand-black/30 tracking-wide uppercase">
            © PT Karya Impian Laboratoris. All Rights Reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
