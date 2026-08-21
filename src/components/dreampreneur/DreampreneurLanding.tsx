"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, MapPin, Calendar, Clock, HelpCircle } from "lucide-react";
import {
  DREAMPRENEUR_THANKYOU_PATH,
  buildDreampreneurThankyouUrl,
  ensureMetaPixelQueue,
  preconnectWhatsApp,
  trackDreampreneurCtaClick,
  trackDreampreneurExplore,
  trackDreampreneurView,
} from "@/lib/dreampreneur";

export default function DreampreneurLanding() {
  const [showSticky, setShowSticky] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    ensureMetaPixelQueue();
    preconnectWhatsApp();
    trackDreampreneurView();
    
    const handleScroll = () => {
      // Tampilkan sticky CTA setelah melewati hero section (> 600px)
      setShowSticky(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    e.preventDefault();
    trackDreampreneurCtaClick(label);
    window.location.assign(buildDreampreneurThankyouUrl());
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const EVENT_DATE = "29 Agustus 2026";
  const EVENT_TIME = "11.00–17.00 WIB";

  return (
    <div
      className="landing-page-ads min-h-screen bg-[#FFF4E8] text-[#141414] font-sans selection:bg-[#FF5A1F] selection:text-white overflow-x-hidden"
      style={
        {
          "--color-jingga": "#FF5A1F",
          "--color-biru": "#3157FF",
          "--color-kuning": "#FFD83D",
          "--color-hitam": "#141414",
          "--color-krem": "#FFF4E8",
        } as CSSProperties
      }
    >
      {/* CSS Custom untuk Gaya Editorial Bold */}
      <style>{`
        .landing-page-ads h1,
        .landing-page-ads h2,
        .landing-page-ads h3,
        .landing-page-ads h4,
        .landing-page-ads .font-display {
          font-family: "Viga", var(--font-viga), sans-serif !important;
          font-weight: 800 !important;
          letter-spacing: -0.02em;
        }
        .editorial-border {
          border: 3px solid #141414;
        }
        .editorial-shadow-orange {
          box-shadow: 6px 6px 0px 0px #FF5A1F;
        }
        .editorial-shadow-blue {
          box-shadow: 6px 6px 0px 0px #3157FF;
        }
        .editorial-shadow-black {
          box-shadow: 6px 6px 0px 0px #141414;
        }
        .editorial-shadow-kuning {
          box-shadow: 6px 6px 0px 0px #FFD83D;
        }
        .marker-highlight-yellow {
          background: linear-gradient(180deg, transparent 60%, #FFD83D 60%);
        }
        .marker-highlight-orange {
          background: linear-gradient(180deg, transparent 60%, #FF5A1F 60%);
        }
        .sticker-badge {
          display: inline-block;
          padding: 6px 12px;
          background-color: #FF5A1F;
          color: #FFF4E8;
          font-weight: 900;
          text-transform: uppercase;
          border: 2px solid #141414;
          transform: rotate(-2deg);
        }
        @media (max-width: 767.98px) {
          .landing-page-ads h1 { font-size: 32px !important; line-height: 1.15 !important; }
          .landing-page-ads h2 { font-size: 26px !important; line-height: 1.2 !important; }
        }
      `}</style>

      {/* ============ 16. TOMBOL TETAP DI PONSEL ============ */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 md:hidden transition-transform duration-300 ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-[#FFF4E8] border-t-3 border-[#141414] py-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(20,20,20,0.15)] flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Harga Spesial</span>
            <span className="text-lg font-black text-[#FF5A1F]">Rp189.000</span>
          </div>
          <a
            href={DREAMPRENEUR_THANKYOU_PATH}
            onClick={(e) => handleRegisterClick(e, "sticky_daftar")}
            className="flex-1 max-w-[200px] inline-flex items-center justify-center gap-2 rounded-none bg-[#FF5A1F] text-[#FFF4E8] font-black text-sm uppercase py-3.5 px-4 border-2 border-[#141414] hover:bg-[#ff6e39] active:scale-[0.97] transition-all editorial-shadow-black"
          >
            Daftar <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* ============ 1. HERO / BAGIAN UTAMA ============ */}
      <section className="relative overflow-hidden bg-[#FFF4E8] text-[#141414] border-b-3 border-[#141414] pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            
            {/* Kiri: Teks & Informasi Utama */}
            <div className="md:col-span-7 flex flex-col space-y-6 md:space-y-8">
              <div>
                <span className="sticker-badge text-xs md:text-sm tracking-widest font-black inline-block mb-4">
                  BEAUTY ACADEMY BATCH 2
                </span>
                
                <h1 className="text-3xl sm:text-4xl lg:text-[46px] leading-[1.1] text-[#141414] uppercase">
                  Bangun Brand Kosmetik <br />
                  <span className="marker-highlight-yellow">Yang Lebih Terarah,</span> <br />
                  Sampai Dipercaya Pasar.
                </h1>
              </div>

              {/* Hook Box */}
              <div className="bg-[#FFD83D] border-3 border-[#141414] p-4 md:p-5 relative editorial-shadow-black">
                <span className="absolute -top-3 left-4 bg-[#FF5A1F] text-white text-[10px] font-black px-2 py-0.5 uppercase border-2 border-[#141414]">
                  PENTING!
                </span>
                <p className="text-sm md:text-base font-black leading-relaxed text-[#141414]">
                  JANGAN PRODUKSI DULU sebelum tahu produk Anda punya peluang laku. Banyak brand gagal bukan karena produknya jelek, tapi karena salah merancang formula, packaging, harga, dan positioning dari awal.
                </p>
              </div>

              <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-semibold">
                Untuk Anda yang baru ingin memulai maupun yang brand-nya sudah berjalan. Pelajari bagaimana melihat brand dari sisi produk, formula, bisnis, pemasaran hingga pemanfaatan kecerdasan buatan agar keputusan tidak hanya berdasarkan perkiraan.
              </p>

              {/* Ringkasan Pembahasan */}
              <div className="flex flex-wrap gap-2 text-xs font-black uppercase text-[#141414]">
                {["Produk & Formula", "Bisnis", "Pemasaran", "Kecerdasan Buatan"].map((tag, i) => (
                  <span key={i} className="bg-white border-2 border-[#141414] px-3 py-1.5 rounded-none font-semibold">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Informasi Jadwal & Lokasi */}
              <div className="bg-white border-3 border-[#141414] p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Tanggal</p>
                  <p className="text-sm font-black text-[#141414]">{EVENT_DATE}</p>
                </div>
                <div className="sm:border-l-2 sm:border-[#141414]">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Waktu</p>
                  <p className="text-sm font-black text-[#141414]">{EVENT_TIME}</p>
                </div>
                <div className="sm:border-l-2 sm:border-[#141414]">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Lokasi</p>
                  <p className="text-sm font-black text-[#141414]">Excotel Design Hotel, Surabaya</p>
                </div>
              </div>

              {/* Penawaran & CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-2">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-bold line-through">Normal Rp250.000</span>
                  <span className="text-3xl font-black text-[#FF5A1F] tracking-tight">Harga Spesial Rp189.000</span>
                </div>
                <a
                  href={DREAMPRENEUR_THANKYOU_PATH}
                  onClick={(e) => handleRegisterClick(e, "hero_cta")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-none bg-[#FF5A1F] text-white font-black text-base uppercase border-3 border-[#141414] hover:bg-[#ff6e39] active:scale-[0.98] transition-all editorial-shadow-black"
                >
                  Saya Mau Ikut <ArrowRight className="w-5 h-5" />
                </a>
              </div>
              <p className="text-xs font-bold text-slate-600">
                * Kuota peserta terbatas · Acara tatap muka di Surabaya
              </p>
            </div>

            {/* Kanan: Visual Composition */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-[340px] md:max-w-none pt-4">
                <div className="absolute inset-0 bg-[#3157FF] border-3 border-[#141414] translate-x-4 translate-y-4" />
                <div className="relative bg-white border-3 border-[#141414] p-3 transition-transform hover:rotate-1">
                  <Image
                    src="/assets/images/dreampreneur-batch-2/flyer.png"
                    alt="BEAUTY ACADEMY BATCH 2 — Surabaya"
                    width={810}
                    height={1013}
                    className="w-full h-auto object-cover border-2 border-[#141414]"
                    priority
                  />
                  {/* Sticker Badges Overlay */}
                  <div className="absolute top-6 -left-6 bg-[#FFD83D] border-2 border-[#141414] px-3 py-1 font-black uppercase text-xs rotate-[-6deg] shadow-md">
                    🔥 Hanya Rp189K
                  </div>
                  <div className="absolute bottom-6 -right-4 bg-[#3157FF] text-white border-2 border-[#141414] px-3 py-1 font-black uppercase text-xs rotate-[4deg] shadow-md">
                    📍 Live Surabaya
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============ 2. IDENTIFIKASI AUDIENS ============ */}
      <section className="bg-[#FFF4E8] text-[#141414] border-b-3 border-[#141414] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF5A1F] border-2 border-[#FF5A1F] px-3 py-1">
              Fase Pemilik Bisnis
            </span>
            <h2 className="text-3xl md:text-4xl uppercase mt-4">
              Anda Sekarang Ada di Fase Yang Mana?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
            
            {/* Box 1: Baru Mau Memulai */}
            <div className="bg-white border-3 border-[#141414] p-6 md:p-8 flex flex-col justify-between editorial-shadow-orange">
              <div className="space-y-6">
                <span className="inline-block bg-[#FF5A1F] text-white text-xs font-black uppercase px-3 py-1 border-2 border-[#141414]">
                  Fase 1 — Baru Ingin Memulai
                </span>
                <h3 className="text-xl md:text-2xl uppercase leading-snug">
                  Punya keinginan bikin brand, tapi masih ragu untuk mulai?
                </h3>
                <ul className="space-y-3.5 text-slate-700">
                  {[
                    "Produk pertama sebaiknya apa?",
                    "Formula seperti apa yang perlu dipertimbangkan?",
                    "Kalau sudah produksi tetapi sulit dijual bagaimana?",
                    "Bagaimana menentukan pembeda produk?",
                    "Setelah produk jadi, pemasaran dimulai dari mana?",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm font-medium font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-200 bg-[#FFF4E8]/50 p-4">
                <p className="text-xs font-bold text-slate-500 uppercase">Pertanyaan Terbesar Anda:</p>
                <p className="text-base font-black text-[#FF5A1F] mt-1">
                  “Kalau sudah keluar modal, tapi produknya nggak laku bagaimana?”
                </p>
              </div>
            </div>

            {/* Box 2: Brand Sudah Berjalan */}
            <div className="bg-white border-3 border-[#141414] p-6 md:p-8 flex flex-col justify-between editorial-shadow-blue">
              <div className="space-y-6">
                <span className="inline-block bg-[#3157FF] text-white text-xs font-black uppercase px-3 py-1 border-2 border-[#141414]">
                  Fase 2 — Brand Sudah Berjalan
                </span>
                <h3 className="text-xl md:text-2xl uppercase leading-snug">
                  Produk sudah ada, tapi brand belum tumbuh sesuai harapan?
                </h3>
                <ul className="space-y-3.5 text-slate-700">
                  {[
                    "Penjualan masih naik turun?",
                    "Konten sudah jalan tetapi hasil belum terasa?",
                    "Promosi sudah dilakukan tetapi belum konsisten?",
                    "Harus membuat produk baru atau memperkuat yang sekarang?",
                    "Apa sebenarnya yang harus diprioritaskan?",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm font-medium font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3157FF] mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-200 bg-[#FFF4E8]/50 p-4">
                <p className="text-xs font-bold text-slate-500 uppercase">Pertanyaan Terbesar Anda:</p>
                <p className="text-base font-black text-[#3157FF] mt-1">
                  “Brand sudah jalan, tapi langkah berikutnya sebenarnya apa?”
                </p>
              </div>
            </div>

          </div>

          <div className="text-center mt-12 md:mt-16 bg-[#141414] text-white border-3 border-[#141414] py-6 px-4">
            <h3 className="text-xl md:text-2xl uppercase font-black tracking-wider leading-relaxed">
              BEDA FASE. TAPI SAMA-SAMA BUTUH ARAH YANG LEBIH JELAS.
            </h3>
          </div>
        </div>
      </section>

      {/* ============ 3. MASALAH YANG DIALAMI (10 KARTU MASALAH / LUKA TERBESAR) ============ */}
      <section className="bg-[#141414] text-white border-b-3 border-[#141414] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-[#FFD83D] border-2 border-[#FFD83D] px-3 py-1">
              Kenali Penyakit Brand
            </span>
            <h2 className="text-3xl md:text-4xl uppercase mt-4 text-[#FFF4E8]">
              Brand Anda Sekarang Mentok di Bagian Mana?
            </h2>
            <p className="text-sm md:text-base text-slate-400 mt-2">
              MASALAH BRAND KOSMETIK JARANG CUMA SATU.
            </p>
          </div>

          {/* Grid Asimetris Kartu Masalah */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[#141414]">
            
            {/* LUKA 1 — Takut produksi tapi tidak laku (Large block) */}
            <div className="md:col-span-2 bg-[#FF5A1F] text-white border-3 border-[#141414] p-6 md:p-8 flex flex-col justify-between shadow-[4px_4px_0_0_#FFF]">
              <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-2 py-0.5 w-fit border border-white">
                01 — LUKA TERBESAR
              </span>
              <div className="my-6">
                <h3 className="text-xl md:text-2xl uppercase font-black leading-snug">
                  “Takut sudah keluar ratusan juta untuk produksi, ternyata produknya tidak laku.”
                </h3>
                <p className="text-sm text-orange-100 mt-2 font-semibold">
                  Hampir semua masalah bermuara pada ketakutan ini. Modal sudah habis terpakai, tapi produk diam di gudang karena tidak sesuai dengan target pasar.
                </p>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#FFD83D]">
                💡 Solusi Academy: Product Fit Blueprint
              </p>
            </div>

            {/* LUKA 2 — Punya modal tapi bingung (Medium block) */}
            <div className="bg-white text-[#141414] border-3 border-[#141414] p-6 flex flex-col justify-between shadow-[4px_4px_0_0_#FF5A1F]">
              <span className="text-xs font-black uppercase tracking-widest bg-[#FF5A1F] text-white px-2 py-0.5 w-fit border border-[#141414]">
                02 — LUKA UTAMA
              </span>
              <div className="my-4">
                <h3 className="text-lg font-black uppercase leading-snug">
                  Punya modal tapi bingung bikin produk apa?
                </h3>
                <p className="text-xs text-slate-600 mt-2 font-semibold">
                  Takut hanya mengikuti tren viral sesaat yang cepat redup di pasar tanpa analisis kompetitor yang jelas.
                </p>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#3157FF]">
                💡 Solusi: Product Opportunity Mapping
              </p>
            </div>

            {/* LUKA 3 — Omzet mentok (Medium block) */}
            <div className="bg-white text-[#141414] border-3 border-[#141414] p-6 flex flex-col justify-between shadow-[4px_4px_0_0_#3157FF]">
              <span className="text-xs font-black uppercase tracking-widest bg-[#3157FF] text-white px-2 py-0.5 w-fit border border-[#141414]">
                03 — LUKA UTAMA
              </span>
              <div className="my-4">
                <h3 className="text-lg font-black uppercase leading-snug">
                  Sudah punya brand tapi omzet segitu-gitu saja?
                </h3>
                <p className="text-xs text-slate-600 mt-2 font-semibold">
                  Brand terus berjalan, tapi terasa jalan di tempat. Aktivitas terasa sangat sibuk tapi hasil pertumbuhannya tidak sebanding.
                </p>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
                💡 Solusi: Brand Diagnostic
              </p>
            </div>

            {/* LUKA 4 — Ads boncos & posting sepi (Medium block) */}
            <div className="bg-white text-[#141414] border-3 border-[#141414] p-6 flex flex-col justify-between shadow-[4px_4px_0_0_#FFD83D]">
              <span className="text-xs font-black uppercase tracking-widest bg-[#FFD83D] text-black px-2 py-0.5 w-fit border border-[#141414]">
                04 — LUKA UTAMA
              </span>
              <div className="my-4">
                <h3 className="text-lg font-black uppercase leading-snug">
                  Sudah posting & ads tapi penjualan tidak naik?
                </h3>
                <p className="text-xs text-slate-600 mt-2 font-semibold">
                  Sudah keluar biaya iklan di Meta Ads namun boncos. Bingung apakah masalahnya ada di produk, konten, atau penawarannya.
                </p>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
                💡 Solusi: Marketing & Conversion Diagnostic
              </p>
            </div>

            {/* LUKA 5 — Mulai dari mana (Medium block) */}
            <div className="bg-white text-[#141414] border-3 border-[#141414] p-6 flex flex-col justify-between shadow-[4px_4px_0_0_#141414]">
              <span className="text-xs font-black uppercase tracking-widest bg-[#141414] text-white px-2 py-0.5 w-fit border border-[#141414]">
                05 — LUKA UTAMA
              </span>
              <div className="my-4">
                <h3 className="text-lg font-black uppercase leading-snug">
                  Mau bikin brand tapi tidak tahu mulai dari mana?
                </h3>
                <p className="text-xs text-slate-600 mt-2 font-semibold">
                  Belum paham alur formula, standar pengujian legalitas BPOM, hingga bagaimana cara memilih maklon yang tepat.
                </p>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#3157FF]">
                💡 Solusi: 0 → Launch Roadmap
              </p>
            </div>

            {/* Kartu Tambahan: 06 — Formula Tanpa Keunggulan */}
            <div className="bg-white text-[#141414] border-3 border-[#141414] p-6 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">06 — FORMULA</span>
              <div className="my-4">
                <h3 className="text-base font-black uppercase">Formula Produk Tidak Punya Pembeda?</h3>
                <p className="text-xs text-slate-600 mt-2 font-semibold">
                  Menggunakan bahan yang sedang populer belum tentu cukup membuat produk punya alasan kuat untuk dipilih.
                </p>
              </div>
            </div>

            {/* Kartu Tambahan: 07 — Salah Packaging */}
            <div className="bg-white text-[#141414] border-3 border-[#141414] p-6 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">07 — PACKAGING</span>
              <div className="my-4">
                <h3 className="text-base font-black uppercase">Formula Premium, Packaging Murahan?</h3>
                <p className="text-xs text-slate-600 mt-2 font-semibold">
                  Kualitas formula sangat premium, namun bisa terlihat murahan gara-gara salah pemilihan botol dan desain kemasan.
                </p>
              </div>
            </div>

            {/* Kartu Tambahan: 08 — HPP Jebol */}
            <div className="bg-white text-[#141414] border-3 border-[#141414] p-6 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">08 — PRICING & HPP</span>
              <div className="my-4">
                <h3 className="text-base font-black uppercase">Kemasan Keren, Tapi HPP Jebol?</h3>
                <p className="text-xs text-slate-600 mt-2 font-semibold">
                  Biaya wadah dan kemasan terlalu tinggi, membuat margin unit economics produk tidak bisa menguntungkan bisnis.
                </p>
              </div>
            </div>

            {/* Kartu Tambahan: 09 — Views Tinggi Sales Sepi */}
            <div className="bg-white text-[#141414] border-3 border-[#141414] p-6 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">09 — CONVERSION</span>
              <div className="my-4">
                <h3 className="text-base font-black uppercase">Views Konten Tinggi, Sales Sepi?</h3>
                <p className="text-xs text-slate-600 mt-2 font-semibold">
                  Banyak penonton di TikTok/Instagram tapi sedikit sekali yang checkout. Hubungan konten ke penjualan belum terbentuk.
                </p>
              </div>
            </div>

            {/* Kartu Tambahan: 10 — Operasional & Kerja Manual */}
            <div className="bg-white text-[#141414] border-3 border-[#141414] p-6 flex flex-col justify-between md:col-span-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">10 — OPERASIONAL</span>
                  <h3 className="text-base font-black uppercase">Pekerjaan Rutin Bisnis Masih Dikerjakan Manual?</h3>
                  <p className="text-xs text-slate-600 font-semibold">
                    Riset produk, pembuatan ide konten, hingga riset pasar menyita waktu. Operasional belum terotomasi dengan teknologi AI.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Penutup */}
          <div className="mt-12 text-center space-y-4 max-w-2xl mx-auto pt-8 border-t-2 border-slate-800">
            <h3 className="text-xl md:text-2xl uppercase font-black text-[#FFD83D]">
              BANYAK AKTIVITAS BELUM TENTU MEMBUAT BRAND PUNYA ARAH.
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-semibold">
              Kadang yang perlu diperbaiki bukan seberapa banyak yang Anda kerjakan, tetapi <span className="text-white underline decoration-[#FF5A1F] decoration-2">apa yang seharusnya diprioritaskan.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ============ 4. AKAR MASALAH (DIAGRAM ALUR) ============ */}
      <section className="bg-[#3157FF] text-white border-b-3 border-[#141414] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-12">
            <h2 className="text-3xl md:text-4xl uppercase leading-tight">
              Brand Kosmetik Tidak Bisa <br />
              Dibangun Dari Satu Sisi Saja.
            </h2>
            <p className="text-base md:text-lg text-blue-100 font-semibold leading-relaxed">
              Produk bagus saja belum cukup. Pemasaran ramai saja juga belum cukup. <br />
              Semuanya harus saling terhubung dalam satu rantai yang kokoh.
            </p>
          </div>

          {/* Diagram Alur Perjalanan Brand */}
          <div className="bg-white text-[#141414] border-3 border-[#141414] p-6 md:p-10 my-8 relative editorial-shadow-black">
            <span className="absolute -top-3.5 left-6 bg-[#FF5A1F] text-white text-[10px] font-black px-3 py-1 uppercase border-2 border-[#141414]">
              ALUR PERJALANAN BRAND KOSMETIK YANG BENAR
            </span>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 text-center pt-4">
              {[
                { step: "01", name: "Market Opportunity", desc: "Kebutuhan Pasar" },
                { step: "02", name: "Product Fit", desc: "Kesesuaian Produk" },
                { step: "03", name: "Formula R&D", desc: "Formula Unik" },
                { step: "04", name: "Packaging", desc: "Kemasan & HPP" },
                { step: "05", name: "Pricing", desc: "Harga Jual" },
                { step: "06", name: "Branding", desc: "Arah & Nilai" },
                { step: "07", name: "Launch Plan", desc: "Launching & Iklan" },
                { step: "08", name: "Scale Up", desc: "Pertumbuhan" }
              ].map((item, i) => (
                <div key={i} className="bg-[#FFF4E8] border-2 border-[#141414] p-3 flex flex-col justify-between items-center relative">
                  <span className="text-[10px] font-black text-[#3157FF] bg-white border border-[#141414] px-1.5 py-0.5 rounded-none">
                    {item.step}
                  </span>
                  <div className="my-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{item.name}</p>
                    <p className="text-xs font-black uppercase text-[#141414] mt-1">{item.desc}</p>
                  </div>
                  {i < 7 && (
                    <span className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-xl font-black text-[#FF5A1F]">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center space-y-6 mt-12">
            <h3 className="text-2xl md:text-3xl uppercase font-black text-[#FFD83D]">
              Semuanya Harus Saling Terhubung.
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-blue-50">
              Produk bagus tanpa komunikasi yang tepat sulit dikenal. Pemasaran aktif tanpa produk dan arah bisnis yang kuat juga sulit membangun kepercayaan. <br />
              <strong className="text-white underline decoration-[#FFD83D] decoration-2 font-bold">
                Dreamlab bukan cuma membantu Anda membuat produk. Kami membantu Anda membangun produk yang punya peluang untuk menang di market.
              </strong>
            </p>
          </div>
        </div>
      </section>

      {/* ============ 5. BEAUTY ACADEMY BATCH 2 SEBAGAI SOLUSI (KLINIK BRAND) ============ */}
      <section className="bg-[#FFF4E8] text-[#141414] border-b-3 border-[#141414] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center space-y-6 mb-12">
            <span className="sticker-badge text-xs md:text-sm">KLINIK BRAND SKINCARE</span>
            <h2 className="text-3xl md:text-4xl uppercase">
              Itulah Yang Akan Kita Bedah <br />
              Dalam Satu Hari.
            </h2>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed font-semibold">
              BEAUTY ACADEMY BATCH 2 dirancang bukan sebagai seminar teori biasa, melainkan sebagai <strong>Klinik Brand</strong>. Tempat Anda mendiagnosis masalah brand, menemukan akarnya, dan mendapatkan peta arah langkah bisnis Anda selanjutnya.
            </p>
          </div>

          {/* Sebelum vs Sesudah Layout */}
          <div className="bg-white border-3 border-[#141414] p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-black uppercase text-center border-b-2 border-[#141414] pb-4 mb-4">
              PERUBAHAN PERSPEKTIF ANDA SETELAH ACARA
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { before: "Bingung Produknya", after: "Lebih tahu apa yang perlu dipertimbangkan" },
                { before: "Bingung Formulanya", after: "Lebih memahami nilai produknya" },
                { before: "Bingung Pemasarannya", after: "Lebih tahu bagian yang perlu difokuskan" },
                { before: "Bingung Arah Brand", after: "Lebih jelas menentukan langkah berikutnya" }
              ].map((item, i) => (
                <div key={i} className="border-2 border-[#141414] p-4 bg-[#FFF4E8]/30 flex flex-col justify-between">
                  <div className="bg-[#FF5A1F]/10 border border-[#FF5A1F] text-[#FF5A1F] text-xs font-bold px-2 py-1 uppercase w-fit mb-2">
                    Sebelum: {item.before}
                  </div>
                  <div className="text-slate-900 font-black text-sm uppercase">
                    ↓ <br />
                    Sesudah: <span className="text-[#3157FF]">{item.after}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12 space-y-4">
            <h3 className="text-xl md:text-2xl uppercase font-black">
              DATANG DENGAN BANYAK PERTANYAAN. <br />
              PULANG DENGAN ARAH YANG LEBIH JELAS.
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              Bukan berarti semua masalah selesai dalam satu hari. <br />
              Tetapi peserta akan mendapatkan lebih banyak perspektif sebelum mengambil keputusan berikutnya.
            </p>
          </div>
        </div>
      </section>

      {/* ============ 6. EMPAT PEMBAHASAN UTAMA (MODUL) ============ */}
      <section className="bg-[#FFF4E8] text-[#141414] border-b-3 border-[#141414] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-[#3157FF] border-2 border-[#3157FF] px-3 py-1">
              Kurikulum Klinik
            </span>
            <h2 className="text-3xl md:text-4xl uppercase mt-4">
              1 Hari Untuk Membedah <br />
              4 Pertanyaan Besar Brand Kosmetik.
            </h2>
          </div>

          {/* 4 Editorial Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            
            {/* Modul 01 */}
            <div className="bg-white border-3 border-[#141414] p-6 md:p-8 flex flex-col justify-between relative editorial-shadow-orange">
              <span className="absolute -top-5 right-6 text-5xl font-black text-slate-200">01</span>
              <div>
                <span className="text-xs font-black uppercase text-[#FF5A1F] tracking-widest block mb-2">01 — PRODUK & FORMULA</span>
                <h3 className="text-lg md:text-xl font-black uppercase leading-snug">
                  Produk apa yang layak dikembangkan dan punya alasan untuk dipilih?
                </h3>
                <p className="text-xs text-slate-500 mt-2 italic font-bold">
                  * Jangan hanya mulai dari pertanyaan: produk apa yang sedang viral?
                </p>
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <p className="text-xs font-bold uppercase text-slate-400 mb-2">Apa yang akan dibahas:</p>
                  <ul className="grid grid-cols-2 gap-2 text-xs font-black uppercase text-slate-700">
                    <li>✓ Tren Produk</li>
                    <li>✓ Formula Unik</li>
                    <li>✓ Kebutuhan Pasar</li>
                    <li>✓ Kesiapan Produk</li>
                    <li>✓ Pengembangan</li>
                    <li>✓ Nilai Produk</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Modul 02 */}
            <div className="bg-white border-3 border-[#141414] p-6 md:p-8 flex flex-col justify-between relative editorial-shadow-blue">
              <span className="absolute -top-5 right-6 text-5xl font-black text-slate-200">02</span>
              <div>
                <span className="text-xs font-black uppercase text-[#3157FF] tracking-widest block mb-2">02 — BISNIS & PERTUMBUHAN</span>
                <h3 className="text-lg md:text-xl font-black uppercase leading-snug">
                  Produk sudah ada. Brand-nya mau dibawa ke mana?
                </h3>
                <p className="text-xs text-slate-500 mt-2 italic font-bold">
                  * Mengatur unit economics, HPP kemasan, dan strategi naik kelas.
                </p>
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <p className="text-xs font-bold uppercase text-slate-400 mb-2">Apa yang akan dibahas:</p>
                  <ul className="grid grid-cols-2 gap-2 text-xs font-black uppercase text-slate-700">
                    <li>✓ Peluang Bisnis</li>
                    <li>✓ Prioritas Brand</li>
                    <li>✓ Arah Brand</li>
                    <li>✓ Pengembangan</li>
                    <li>✓ Pertumbuhan</li>
                    <li>✓ Langkah Berikut</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Modul 03 */}
            <div className="bg-white border-3 border-[#141414] p-6 md:p-8 flex flex-col justify-between relative editorial-shadow-black">
              <span className="absolute -top-5 right-6 text-5xl font-black text-slate-200">03</span>
              <div>
                <span className="text-xs font-black uppercase text-[#141414] tracking-widest block mb-2">03 — PEMASARAN</span>
                <h3 className="text-lg md:text-xl font-black uppercase leading-snug">
                  Produk bagus. Bagaimana membuat orang tertarik?
                </h3>
                <p className="text-xs text-slate-500 mt-2 italic font-bold">
                  * Bagaimana membuat orang tahu, tertarik, lalu mempertimbangkan produk?
                </p>
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <p className="text-xs font-bold uppercase text-slate-400 mb-2">Apa yang akan dibahas:</p>
                  <ul className="grid grid-cols-2 gap-2 text-xs font-black uppercase text-slate-700">
                    <li>✓ Launching Plan</li>
                    <li>✓ Pemasaran Digital</li>
                    <li>✓ Strategi Konten</li>
                    <li>✓ Traffic Konversi</li>
                    <li>✓ Pertumbuhan Organik</li>
                    <li>✓ Minat Pasar</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Modul 04 */}
            <div className="bg-white border-3 border-[#141414] p-6 md:p-8 flex flex-col justify-between relative editorial-shadow-kuning">
              <span className="absolute -top-5 right-6 text-5xl font-black text-slate-200">04</span>
              <div>
                <span className="text-xs font-black uppercase text-[#FF5A1F] tracking-widest block mb-2">04 — KECERDASAN BUATAN & OTOMASI</span>
                <h3 className="text-lg md:text-xl font-black uppercase leading-snug">
                  Bisnis makin jalan. Masa semuanya masih manual?
                </h3>
                <p className="text-xs text-slate-500 mt-2 italic font-bold">
                  * Apa yang bisa dibantu teknologi supaya kerja lebih efektif?
                </p>
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <p className="text-xs font-bold uppercase text-slate-400 mb-2">Apa yang akan dibahas:</p>
                  <ul className="grid grid-cols-2 gap-2 text-xs font-black uppercase text-slate-700">
                    <li>✓ Riset Terotomasi</li>
                    <li>✓ Ide Konten Cepat</li>
                    <li>✓ AI untuk Marketing</li>
                    <li>✓ Alur Pekerjaan</li>
                    <li>✓ Automasi Penjualan</li>
                    <li>✓ Kerja Efektif</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

          <div className="text-center mt-12 md:mt-16">
            <a
              href={DREAMPRENEUR_THANKYOU_PATH}
              onClick={(e) => handleRegisterClick(e, "curriculum_cta")}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-none bg-[#FF5A1F] text-white font-black text-base uppercase border-3 border-[#141414] hover:bg-[#ff6e39] active:scale-[0.98] transition-all editorial-shadow-black"
            >
              Saya Mau Ikut <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ============ 7. PERBANDINGAN ============ */}
      <section className="bg-[#FFF4E8] text-[#141414] border-b-3 border-[#141414] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF5A1F] border-2 border-[#FF5A1F] px-3 py-1">
              Kenapa Kami?
            </span>
            <h2 className="text-3xl md:text-4xl uppercase">
              Kenapa BEAUTY ACADEMY BATCH 2?
            </h2>
            <p className="text-base md:text-lg text-slate-700 font-semibold leading-relaxed">
              Kenapa harus mencari jawaban produk, bisnis, dan pemasaran sendiri-sendiri? <br />
              Padahal semuanya saling menentukan arah sebuah brand.
            </p>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border-3 border-[#141414] bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#141414] text-white border-b-3 border-[#141414]">
                  <th className="p-4 uppercase font-black text-sm">ASPEK</th>
                  <th className="p-4 uppercase font-black text-sm border-l-2 border-slate-700">BELAJAR SENDIRI / KELAS UMUM</th>
                  <th className="p-4 uppercase font-black text-sm bg-[#FF5A1F] text-white border-l-2 border-[#141414]">BEAUTY ACADEMY BATCH 2</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#141414] text-sm">
                {[
                  { aspek: "Pembahasan", umum: "Biasanya hanya satu topik", academy: "Produk, formula, bisnis, pemasaran & AI" },
                  { aspek: "Konteks", umum: "Bisnis umum", academy: "Fokus khusus pada brand kosmetik" },
                  { aspek: "Produk & Formula", umum: "Tidak selalu dibahas", academy: "Menjadi salah satu pembahasan utama" },
                  { aspek: "Pemasaran", umum: "Banyak fokus pada taktik", academy: "Dikaitkan dengan produk dan arah bisnis" },
                  { aspek: "Perspektif", umum: "Biasanya satu bidang", academy: "4 praktisi dari bidang berbeda" },
                  { aspek: "Peserta", umum: "Berbagai jenis bisnis", academy: "Calon pemilik & pemilik brand kosmetik" },
                  { aspek: "Relasi", umum: "Peserta beragam", academy: "Bertemu orang yang juga membangun bisnis kosmetik" },
                  { aspek: "Waktu", umum: "Mencari banyak sumber", academy: "Berbagai perspektif dalam satu hari" },
                  { aspek: "Harga", umum: "Membutuhkan beberapa kelas", academy: "Harga spesial Rp189.000" }
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-[#FFF4E8]/20" : "bg-white"}>
                    <td className="p-4 font-black uppercase text-[#141414]">{row.aspek}</td>
                    <td className="p-4 text-slate-600 font-semibold border-l-2 border-slate-200">{row.umum}</td>
                    <td className="p-4 font-black bg-[#FFF4E8] text-[#FF5A1F] border-l-3 border-[#141414]">{row.academy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Stack View */}
          <div className="md:hidden space-y-6">
            {[
              { aspek: "Pembahasan", umum: "Biasanya satu topik", academy: "Produk, formula, bisnis, pemasaran & AI" },
              { aspek: "Konteks", umum: "Bisnis umum", academy: "Fokus brand kosmetik" },
              { aspek: "Produk & Formula", umum: "Tidak selalu dibahas", academy: "Menjadi pembahasan utama" },
              { aspek: "Perspektif", umum: "Biasanya satu bidang", academy: "4 praktisi bidang berbeda" },
              { aspek: "Waktu", umum: "Mencari banyak sumber", academy: "Semua didapat dalam satu hari" },
              { aspek: "Harga", umum: "Butuh beberapa kelas mahal", academy: "Harga spesial Rp189.000" }
            ].map((row, i) => (
              <div key={i} className="bg-white border-3 border-[#141414] p-5 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 w-fit">
                  Aspek: {row.aspek}
                </span>
                <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                  <div className="border-r border-slate-200 pr-2">
                    <p className="font-bold text-slate-400 uppercase">KELAS UMUM</p>
                    <p className="text-slate-600 mt-1 font-semibold">{row.umum}</p>
                  </div>
                  <div>
                    <p className="font-black text-[#FF5A1F] uppercase">BEAUTY ACADEMY</p>
                    <p className="font-black text-[#141414] mt-1">{row.academy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 md:mt-16 space-y-6">
            <h3 className="text-2xl md:text-3xl uppercase font-black">
              SATU HARI. EMPAT PERSPEKTIF. <br />
              SATU ARAH YANG LEBIH JELAS.
            </h3>
            <a
              href={DREAMPRENEUR_THANKYOU_PATH}
              onClick={(e) => handleRegisterClick(e, "comparison_cta")}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-none bg-[#FF5A1F] text-white font-black text-base uppercase border-3 border-[#141414] hover:bg-[#ff6e39] active:scale-[0.98] transition-all editorial-shadow-black"
            >
              Amankan Kursi Anda <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ============ 8. PEMBICARA / MENTORS ============ */}
      <section className="bg-[#141414] text-white border-b-3 border-[#141414] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-[#FFD83D] border-2 border-[#FFD83D] px-3 py-1">
              Tim Praktisi
            </span>
            <h2 className="text-3xl md:text-4xl uppercase mt-4 text-[#FFF4E8]">
              Satu Brand Kosmetik <br />
              Butuh Lebih Dari Satu Perspektif.
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Belajar langsung dari tim klinisi yang membantu diagnosis arah bisnis Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "AMIRA ALYDRUS",
                role: "Cosmetic Formulation Expert",
                question: "Produk dan formula seperti apa yang perlu dipertimbangkan?",
                focus: "PRODUK & FORMULA"
              },
              {
                name: "FADHILA SYAHAB",
                role: "Business Development Strategist",
                question: "Bagaimana membuat brand punya arah bisnis dan peluang bertumbuh?",
                focus: "BISNIS & PERTUMBUHAN"
              },
              {
                name: "REVITA",
                role: "Digital Marketer",
                question: "Bagaimana membuat pasar tahu, tertarik dan mempertimbangkan produk?",
                focus: "PEMASARAN & KECERDASAN BUATAN"
              },
              {
                name: "BARI NOOR RAHMAN",
                role: "SIG Manager Operasional",
                question: "Apa yang perlu diperhatikan agar produk dan operasional lebih siap berjalan?",
                focus: "OPERASIONAL"
              }
            ].map((mentor, i) => (
              <div key={i} className="bg-[#141414] border-3 border-slate-700 p-6 flex flex-col justify-between hover:border-[#FF5A1F] transition-all">
                <div>
                  <span className="text-[10px] font-black text-[#FFD83D] bg-slate-800 border border-[#FFD83D] px-2 py-0.5 rounded-none block w-fit mb-4">
                    Fokus: {mentor.focus}
                  </span>
                  <h3 className="text-lg font-black uppercase text-white font-display">
                    {mentor.name}
                  </h3>
                  <p className="text-xs text-[#FF5A1F] font-bold mt-1 uppercase tracking-wider border-b border-slate-800 pb-3">
                    {mentor.role}
                  </p>
                  <p className="text-xs text-slate-300 italic leading-relaxed mt-4">
                    &ldquo;{mentor.question}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 9. BUKTI ACARA SEBELUMNYA ============ */}
      <section className="bg-[#FFF4E8] text-[#141414] border-b-3 border-[#141414] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF5A1F] border-2 border-[#FF5A1F] px-3 py-1">
              Dokumentasi Nyata
            </span>
            <h2 className="text-3xl md:text-4xl uppercase mt-4">
              Bukan Cuma Datang, <br />
              Dudul, Dengar, Lalu Pulang.
            </h2>
            <p className="text-sm text-slate-600 mt-2 font-semibold">
              Belajar langsung. Bertanya langsung. Bertemu orang yang juga sedang membangun brand.
            </p>
          </div>

          <div className="bg-white border-3 border-[#141414] p-4 md:p-6 mb-8 editorial-shadow-black">
            <Image
              src="/assets/images/Dreamlab-Dreamprenuer-Academy--1024x540.webp"
              alt="Bukti Keberhasilan Dreampreneur Academy Batch 1"
              width={1024}
              height={540}
              className="w-full h-auto object-cover border-2 border-[#141414]"
              loading="lazy"
            />
          </div>

          {/* Testimoni Real Kak Eki */}
          <div className="bg-white border-3 border-[#141414] p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-none bg-[#FF5A1F] text-white flex items-center justify-center font-black text-xl shrink-0 border-2 border-[#141414]">
              E
            </div>
            <div className="space-y-4">
              <p className="text-base md:text-lg italic text-slate-800 leading-relaxed font-semibold">
                &ldquo;Aku sempat ragu memulai, tapi mengikuti batch pertama Dreampreneur membuka mata aku bahwa membangun brand itu soal keberanian, bukan sekadar teori. Dari sanalah aku akhirnya memberanikan diri membangun brand parfum sendiri dengan konsep yang inovatif — dan merasa lebih siap menghadapi langkah berikutnya.&rdquo;
              </p>
              <div>
                <p className="font-black text-base uppercase text-[#141414]">Kak Eki</p>
                <p className="text-xs text-[#FF5A1F] font-bold uppercase">Peserta Batch 1 · Founder Brand Parfum</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <a
              href={DREAMPRENEUR_THANKYOU_PATH}
              onClick={(e) => handleRegisterClick(e, "proof_cta")}
              className="inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-none bg-[#FF5A1F] text-white font-black text-sm md:text-base uppercase border-3 border-[#141414] hover:bg-[#ff6e39] active:scale-[0.98] transition-all editorial-shadow-black"
            >
              Daftar Sekarang <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ============ 10. APA YANG DIDAPATKAN ============ */}
      <section className="bg-[#FFF4E8] text-[#141414] border-b-3 border-[#141414] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-[#3157FF] border-2 border-[#3157FF] px-3 py-1">
              Fasilitas Peserta
            </span>
            <h2 className="text-3xl md:text-4xl uppercase mt-4">
              Rp189.000, <br />
              Apa Saja Yang Anda Dapatkan?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { title: "SESI BELAJAR SATU HARI PENUH", desc: "Pembahasan mendalam berbagai sisi brand kosmetik tanpa terburu-buru." },
              { title: "BELAJAR BERSAMA 4 PRAKTISI", desc: "Dapatkan perspektif dari pakar produk, bisnis, pemasaran, dan operasional." },
              { title: "SESI MEMBANGUN RELASI", desc: "Waktu khusus untuk bertukar ide dan memperluas jaringan dengan praktisi & peserta lain." },
              { title: "MAKAN SIANG", desc: "Makan siang berkualitas sudah termasuk dalam investasi tiket Anda." },
              { title: "MERCHANDISE DREAMPRENEUR", desc: "Merchandise eksklusif Dreampreneur yang bisa dibawa pulang peserta." },
              { title: "E-BOOK FRAMEWORK SKINCARE", desc: "E-book panduan praktis framework memulai brand skincare langsung dari nol." }
            ].map((facility, i) => (
              <div key={i} className="bg-white border-3 border-[#141414] p-5 flex flex-col justify-between shadow-[4px_4px_0_0_#3157FF]">
                <div className="space-y-3">
                  <span className="w-8 h-8 bg-[#3157FF] text-white flex items-center justify-center font-black text-xs border border-[#141414]">
                    {i + 1}
                  </span>
                  <h3 className="text-sm font-black uppercase leading-tight text-[#141414]">
                    {facility.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    {facility.desc}
                  </p>
                </div>
                <span className="text-[10px] text-[#3157FF] font-black uppercase tracking-widest block mt-4">
                  ✓ Sudah Termasuk
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 11. NILAI DARI MENGURANGI KESALAHAN ============ */}
      <section className="bg-[#141414] text-white border-b-3 border-[#141414] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center space-y-4 mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-[#FFD83D] border-2 border-[#FFD83D] px-3 py-1">
              Urgensi & Manajemen Risiko
            </span>
            <h2 className="text-3xl md:text-4xl uppercase text-[#FFF4E8]">
              Sebelum Keluar Modal Lebih Jauh, <br />
              Pastikan Brand Anda Punya Arah.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[#141414]">
            
            {/* Box 1 */}
            <div className="bg-white border-3 border-[#141414] p-6 relative shadow-[4px_4px_0_0_#FFD83D]">
              <span className="absolute -top-3.5 left-4 bg-[#FF5A1F] text-white text-[10px] font-black px-2 py-0.5 border-2 border-[#141414] uppercase">
                Risiko 1
              </span>
              <h3 className="text-base font-black uppercase text-[#141414] mt-2">Salah Pilih Produk</h3>
              <p className="text-xs text-slate-600 mt-2 font-semibold">
                Modal Anda masuk ke pengembangan produk yang ternyata kurang relevan atau tidak benar-benar dibutuhkan pasar.
              </p>
            </div>

            {/* Box 2 */}
            <div className="bg-white border-3 border-[#141414] p-6 relative shadow-[4px_4px_0_0_#FFD83D]">
              <span className="absolute -top-3.5 left-4 bg-[#FF5A1F] text-white text-[10px] font-black px-2 py-0.5 border-2 border-[#141414] uppercase">
                Risiko 2
              </span>
              <h3 className="text-base font-black uppercase text-[#141414] mt-2">Formula Tanpa Pembeda</h3>
              <p className="text-xs text-slate-600 mt-2 font-semibold">
                Konsumen tidak dapat melihat alasan kuat mengapa mereka harus memilih produk Anda dibandingkan para kompetitor.
              </p>
            </div>

            {/* Box 3 */}
            <div className="bg-white border-3 border-[#141414] p-6 relative shadow-[4px_4px_0_0_#FFD83D]">
              <span className="absolute -top-3.5 left-4 bg-[#FF5A1F] text-white text-[10px] font-black px-2 py-0.5 border-2 border-[#141414] uppercase">
                Risiko 3
              </span>
              <h3 className="text-base font-black uppercase text-[#141414] mt-2">Peluncuran Tanpa Arah</h3>
              <p className="text-xs text-slate-600 mt-2 font-semibold">
                Produk sudah masuk ke pasar, tetapi target pasar belum memahami nilai dan solusi dari kehadiran produk Anda.
              </p>
            </div>

            {/* Box 4 */}
            <div className="bg-white border-3 border-[#141414] p-6 relative shadow-[4px_4px_0_0_#FFD83D]">
              <span className="absolute -top-3.5 left-4 bg-[#FF5A1F] text-white text-[10px] font-black px-2 py-0.5 border-2 border-[#141414] uppercase">
                Risiko 4
              </span>
              <h3 className="text-base font-black uppercase text-[#141414] mt-2">Pemasaran Tanpa Fokus</h3>
              <p className="text-xs text-slate-600 mt-2 font-semibold">
                Biaya operasional promosi terus berjalan dan keluar, namun masalah utama yang memblokir penjualan tidak diketahui.
              </p>
            </div>

          </div>

          <div className="text-center mt-12 bg-slate-900 border-2 border-slate-800 p-6 space-y-4">
            <h3 className="text-xl md:text-2xl uppercase font-black text-[#FFD83D]">
              Rp189.000 BUKAN JAMINAN BRAND ANDA LANGSUNG SUKSES.
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-semibold">
              TAPI SATU HARI INI BISA MEMBERI ANDA LEBIH BANYAK PERTIMBANGAN SEBELUM MENGAMBIL KEPUTUSAN BERIKUTNYA.
            </p>
          </div>
        </div>
      </section>

      {/* ============ 12. HARGA ============ */}
      <section className="bg-[#FF5A1F] text-white border-b-3 border-[#141414] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl md:text-5xl uppercase leading-none">
              Investasi Satu Hari <br />
              Untuk Arah Brand Yang Lebih Jelas.
            </h2>
          </div>

          {/* Pricing Box */}
          <div className="bg-white text-[#141414] border-4 border-[#141414] p-6 md:p-10 relative overflow-hidden editorial-shadow-black max-w-2xl mx-auto">
            <span className="absolute -top-4 left-6 bg-[#3157FF] text-white text-xs font-black px-3 py-1 uppercase border-2 border-[#141414] rotate-[-1deg]">
              HARGA SPESIAL PROMOSI
            </span>
            
            <div className="flex flex-col items-center text-center space-y-4 pt-4">
              <span className="text-sm font-bold text-slate-400 line-through">Normal Rp250.000</span>
              <h3 className="text-4xl md:text-6xl font-black text-[#FF5A1F] tracking-tight font-display">
                Rp189.000
              </h3>
              
              <div className="w-full border-t-2 border-dashed border-slate-200 py-4 my-4">
                <p className="text-xs font-black uppercase text-slate-500 mb-3">Paket sudah termasuk:</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-left max-w-md mx-auto text-xs font-black uppercase">
                  <div>✓ 1 Hari Belajar</div>
                  <div>✓ Makan Siang</div>
                  <div>✓ 4 Praktisi Expert</div>
                  <div>✓ Merchandise Eksklusif</div>
                  <div>✓ Networking Session</div>
                  <div>✓ E-book Framework</div>
                </div>
              </div>

              <a
                href={DREAMPRENEUR_THANKYOU_PATH}
                onClick={(e) => handleRegisterClick(e, "price_cta")}
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 rounded-none bg-[#FF5A1F] text-white font-black text-lg uppercase border-3 border-[#141414] hover:bg-[#ff6e39] active:scale-[0.98] transition-all editorial-shadow-black"
              >
                Amankan Kursi Rp189.000 →
              </a>
              
              <p className="text-[10px] font-bold text-slate-500 uppercase">
                * Kuota peserta terbatas · Harga spesial berlaku selama periode promosi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 13. DETAIL ACARA (TIKET FISIK) ============ */}
      <section className="bg-[#3157FF] text-white border-b-3 border-[#141414] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Physical Ticket Design */}
          <div className="bg-[#FFF4E8] text-[#141414] border-4 border-[#141414] p-6 md:p-10 relative overflow-hidden editorial-shadow-black">
            {/* Cutout Tiket Kiri & Kanan */}
            <div className="hidden md:block absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#3157FF] rounded-full border-r-4 border-[#141414]" />
            <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#3157FF] rounded-full border-l-4 border-[#141414]" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-4 md:px-6">
              
              <div className="space-y-6 flex-1">
                <div>
                  <span className="text-xs font-black uppercase text-[#FF5A1F] tracking-widest block mb-2">TIKET ACARA TATAP MUKA</span>
                  <h2 className="text-3xl md:text-4xl font-black uppercase font-display leading-none">
                    BEAUTY ACADEMY BATCH 2
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t-2 border-b-2 border-[#141414] py-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-500">Tanggal</p>
                    <p className="text-base font-black uppercase">29 AGUSTUS 2026</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-500">Waktu</p>
                    <p className="text-base font-black uppercase">11.00–17.00 WIB</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold uppercase text-slate-500">Tempat & Kota</p>
                    <p className="text-base font-black uppercase">EXCOTEL DESIGN HOTEL, SURABAYA</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase bg-[#FFD83D] border border-[#141414] px-2 py-0.5">
                    HARGA SPESIAL Rp189.000
                  </span>
                </div>
              </div>

              {/* Sisi Kanan Tiket (Stub) */}
              <div className="md:border-l-3 md:border-dashed md:border-[#141414] md:pl-8 flex flex-col justify-center items-center md:items-stretch text-center md:text-left gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Status Tiket</p>
                  <p className="text-xs font-black text-green-600 uppercase">✓ Tersedia</p>
                </div>
                <a
                  href={DREAMPRENEUR_THANKYOU_PATH}
                  onClick={(e) => handleRegisterClick(e, "ticket_stub_cta")}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-none bg-[#FF5A1F] text-white font-black text-sm uppercase border-2 border-[#141414] hover:bg-[#ff6e39] active:scale-[0.98] transition-all editorial-shadow-black"
                >
                  Daftar Sekarang <ArrowRight className="w-4 h-4" />
                </a>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ============ 14. PERTANYAAN UMUM (FAQ) ============ */}
      <section className="bg-[#FFF4E8] text-[#141414] border-b-3 border-[#141414] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF5A1F] border-2 border-[#FF5A1F] px-3 py-1">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl uppercase mt-4">
              Masih Ragu Apa Beauty Academy Batch 2 Cocok Untuk Anda?
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Saya belum punya brand. Apakah tetap cocok?",
                a: "Ya. BEAUTY ACADEMY BATCH 2 juga ditujukan untuk Anda yang baru ingin memulai dan ingin memahami produk, bisnis serta pemasaran sebelum melangkah lebih jauh."
              },
              {
                q: "Brand saya sudah berjalan. Apakah masih relevan?",
                a: "Ya. Pembahasannya juga relevan untuk pemilik brand yang ingin melihat kembali produk, bisnis, pemasaran dan langkah berikutnya."
              },
              {
                q: "Apakah saya harus sudah punya produk?",
                a: "Tidak."
              },
              {
                q: "Apakah acara ini hanya untuk skincare?",
                a: "Tidak. Pembahasan berfokus pada strategi membangun brand kosmetik dari produk, formula, bisnis, pemasaran hingga kecerdasan buatan."
              },
              {
                q: "Apa yang termasuk dalam tiket?",
                a: "Sesi belajar satu hari penuh, sesi membangun relasi, makan siang, merchandise Dreampreneur dan E-book Framework Memulai Brand Skincare."
              },
              {
                q: "Berwarna berapa harga tiket?",
                a: "Harga spesial Rp189.000 dari harga normal Rp250.000."
              },
              {
                q: "Kapan acaranya?",
                a: "29 Agustus 2026 pukul 11.00–17.00 WIB."
              },
              {
                q: "Di mana acaranya?",
                a: "Excotel Design Hotel, Surabaya."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white border-2 border-[#141414] overflow-hidden">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between gap-4 p-4 text-left font-black uppercase text-sm md:text-base hover:bg-[#FFF4E8]/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#FF5A1F] transition-transform shrink-0 ${
                      activeFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-200 overflow-hidden ${
                    activeFaq === i ? "max-h-[300px] border-t-2 border-[#141414]" : "max-h-0"
                  }`}
                >
                  <p className="p-4 text-sm text-slate-700 leading-relaxed font-semibold">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 15. AJAKAN TERAKHIR ============ */}
      <section className="bg-[#141414] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest bg-[#FF5A1F] text-white px-3 py-1 border border-white">
              KESEMPATAN TERAKHIR
            </span>
            
            <h2 className="text-3xl md:text-5xl uppercase font-display leading-tight text-[#FFF4E8]">
              Jangan Cuma Bikin <br />
              Brand Kosmetik.
            </h2>
            
            <div className="bg-[#FF5A1F] text-white border-3 border-white p-4 rotate-[-1deg] inline-block my-4">
              <h3 className="text-xl md:text-3xl uppercase font-black">
                BANGUN DENGAN ARAH, SAMPAI SIAP DIPERCAYA PASAR.
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left my-8 text-[#141414]">
              <div className="border border-slate-700 p-5 bg-white">
                <h4 className="font-black uppercase text-[#FF5A1F] text-sm">Belum Mulai?</h4>
                <p className="text-xs text-slate-600 mt-2 font-semibold">
                  Bangun pondasinya dengan pertimbangan yang lebih matang sejak awal. Mencegah kerugian modal sebelum memproduksi produk.
                </p>
              </div>
              <div className="border border-slate-700 p-5 bg-white">
                <h4 className="font-black uppercase text-[#3157FF] text-sm">Brand Sudah Berjalan?</h4>
                <p className="text-xs text-slate-600 mt-2 font-semibold">
                  Temukan apa yang perlu diperkuat untuk langkah berikutnya. Diagnosis letak kesalahan strategi konversi Anda.
                </p>
              </div>
            </div>

            {/* Event Summary Details */}
            <div className="space-y-2 text-sm text-slate-400">
              <p className="font-bold text-white uppercase">BEAUTY ACADEMY BATCH 2</p>
              <p>29 AGUSTUS 2026 · EXCOTEL DESIGN HOTEL, SURABAYA</p>
              <div className="flex justify-center items-center gap-3 pt-2">
                <span className="line-through text-slate-500">Rp250.000</span>
                <span className="text-2xl font-black text-[#FF5A1F]">Rp189.000</span>
              </div>
            </div>

            <div className="pt-6">
              <a
                href={DREAMPRENEUR_THANKYOU_PATH}
                onClick={(e) => handleRegisterClick(e, "final_cta")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-5 rounded-none bg-[#FF5A1F] text-white font-black text-lg uppercase border-3 border-white hover:bg-[#ff6e39] active:scale-[0.98] transition-all"
              >
                Saya Mau Ikut <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}