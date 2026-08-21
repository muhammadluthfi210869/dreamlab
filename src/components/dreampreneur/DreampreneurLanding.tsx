"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, MapPin, Calendar, Clock } from "lucide-react";
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
      className="landing-page-ads min-h-screen bg-[#FFF8FC] text-[#141414] font-sans selection:bg-[#FF5A1F] selection:text-white overflow-x-hidden"
      style={
        {
          "--color-ungu": "#4A2ACB",
          "--color-pink": "#E63E97",
          "--color-biru": "#4A7DFF",
          "--color-orange": "#FF5A1F",
          "--color-offwhite": "#FFF8FC",
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
          box-shadow: 6px 6px 0px 0px #4A7DFF;
        }
        .editorial-shadow-black {
          box-shadow: 6px 6px 0px 0px #141414;
        }
        .editorial-shadow-ungu {
          box-shadow: 6px 6px 0px 0px #4A2ACB;
        }
        .sticker-badge {
          display: inline-block;
          padding: 6px 12px;
          background-color: #4A2ACB;
          color: #FFF8FC;
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
        <div className="bg-[#FFF8FC] border-t-3 border-[#141414] py-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(20,20,20,0.15)] flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Harga Spesial</span>
            <span className="text-lg font-black text-[#FF5A1F]">Rp189.000</span>
          </div>
          <a
            href={DREAMPRENEUR_THANKYOU_PATH}
            onClick={(e) => handleRegisterClick(e, "sticky_daftar")}
            className="flex-1 max-w-[200px] inline-flex items-center justify-center gap-2 rounded-none bg-[#FF5A1F] text-[#FFF8FC] font-black text-sm uppercase py-3.5 px-4 border-2 border-[#141414] hover:bg-[#ff6e39] active:scale-[0.97] transition-all editorial-shadow-black"
          >
            Daftar <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* ============ 1. HERO / BAGIAN UTAMA ============ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF8FC] to-[#FFF0F6] text-[#141414] border-b-3 border-[#141414] pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            
            {/* Kiri: Teks & Informasi Utama */}
            <div className="md:col-span-7 flex flex-col space-y-6 md:space-y-8">
              <div>
                <span className="sticker-badge text-xs md:text-sm tracking-widest font-black inline-block mb-4">
                  BEAUTY ACADEMY BATCH 2
                </span>
                
                <h1 className="text-3xl sm:text-4xl lg:text-[46px] leading-[1.1] text-[#4A2ACB] uppercase">
                  Bangun Brand Kosmetik <br />
                  <span className="text-[#FF5A1F] underline decoration-4 decoration-[#4A2ACB]">Yang Lebih Terarah,</span> <br />
                  Sampai Dipercaya Pasar.
                </h1>
              </div>

              {/* Hook Box */}
              <div className="bg-[#FFF8FC] border-3 border-[#141414] p-5 relative editorial-shadow-ungu">
                <span className="absolute -top-3.5 left-4 bg-[#FF5A1F] text-white text-[10px] font-black px-2.5 py-1 uppercase border-2 border-[#141414] rotate-[-1deg]">
                  1 HARI PAHAM FRAMEWORK BANGUN BRAND DARI 0 SAMPAI MARKET FIT
                </span>
                <p className="text-sm md:text-base font-black leading-relaxed text-[#141414] pt-3">
                  Bagaimana membuat produk, formula, bisnis, dan pemasaran lebih selaras dengan kebutuhan pasar.
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
                <div className="absolute inset-0 bg-[#4A7DFF] border-3 border-[#141414] translate-x-4 translate-y-4" />
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
                  <div className="absolute bottom-6 -right-4 bg-[#E63E97] text-white border-2 border-[#141414] px-3 py-1 font-black uppercase text-xs rotate-[4deg] shadow-md">
                    📍 Live Surabaya
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============ 2. IDENTIFIKASI AUDIENS (PROBLEM STICKER WALL) ============ */}
      <section className="bg-[#FFF8FC] text-[#141414] border-b-3 border-[#141414] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-[#E63E97] border-2 border-[#E63E97] px-3 py-1">
              PIKIRAN BRAND OWNER
            </span>
            <h2 className="text-3xl md:text-4xl uppercase leading-tight">
              Kebanyakan Brand Bukan Kekurangan Ide. <br />
              Mereka Bingung Harus Mulai Dan Memperbaiki Dari Mana.
            </h2>
            <p className="text-base text-slate-700 font-semibold">
              Kalau Anda merasa:
            </p>
          </div>

          {/* Grid Bubble / Sticker Wall */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              { text: "BINGUNG MAU BIKIN PRODUK APA", bg: "bg-[#4A2ACB]/10 border-[#4A2ACB] text-[#4A2ACB]" },
              { text: "IKUT PRODUK VIRAL, TAPI NGGAK TAHU PASARNYA", bg: "bg-white border-[#4A7DFF] text-[#141414]" },
              { text: "FORMULA ADA, TAPI BELUM PUNYA PEMBEDA", bg: "bg-[#E63E97]/10 border-[#E63E97] text-[#E63E97]" },
              { text: "SUDAH PRODUKSI, TAKUT NGGAK LAKU", bg: "bg-[#FF5A1F] border-[#141414] text-white font-black scale-105 shadow-md rotate-[-2deg]" },
              { text: "BRAND SUDAH JADI, TAPI ARAHNYA BELUM JELAS", bg: "bg-[#4A2ACB]/10 border-[#4A2ACB] text-[#4A2ACB]" },
              { text: "SUDAH LAUNCHING, PENJUALAN MASIH SEPI", bg: "bg-white border-[#4A7DFF] text-[#141414]" },
              { text: "KONTEN JALAN, TAPI ORANG BELUM TERTARIK BELI", bg: "bg-[#E63E97]/10 border-[#E63E97] text-[#E63E97]" },
              { text: "SUDAH PROMOSI, BUDGET TERUS KELUAR", bg: "bg-[#4A7DFF]/10 border-[#4A7DFF] text-[#4A7DFF]" },
              { text: "BINGUNG HARUS TAMBAH PRODUK ATAU OPTIMALKAN YANG ADA", bg: "bg-white border-[#141414] text-[#141414]" },
              { text: "NGGAK TAHU BAGIAN MANA YANG SEBENARNYA HARUS DIPERBAIKI", bg: "bg-[#E63E97]/10 border-[#E63E97] text-[#E63E97] font-black" }
            ].map((bubble, i) => (
              <div
                key={i}
                className={`border-2 p-5 rounded-3xl flex items-center justify-center text-center font-bold text-sm md:text-base leading-snug transition-transform hover:scale-102 hover:rotate-1 ${bubble.bg} ${
                  i === 9 ? "sm:col-span-2 md:col-span-3 border-3" : ""
                }`}
              >
                <span>{bubble.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 3. Brand Kosmetik Tidak Bisa Dibangun Dari Satu Sisi Saja ============ */}
      <section className="bg-[#4A2ACB] text-white border-b-3 border-[#141414] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-12">
            <h2 className="text-3xl md:text-4xl uppercase leading-tight font-display">
              Brand Kosmetik Tidak Bisa <br />
              Dibangun Dari Satu Sisi Saja.
            </h2>
            <p className="text-base md:text-lg text-pink-100 font-semibold leading-relaxed">
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
                <div key={i} className="bg-[#FFF8FC] border-2 border-[#141414] p-3 flex flex-col justify-between items-center relative">
                  <span className="text-[10px] font-black text-[#4A2ACB] bg-white border border-[#141414] px-1.5 py-0.5 rounded-none">
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

          <div className="max-w-3xl mx-auto text-left space-y-6 mt-12 bg-[#FFF8FC]/10 border-2 border-white/20 p-6 md:p-8">
            <h3 className="text-xl md:text-2xl uppercase font-black text-[#FFD83D] text-center border-b border-white/20 pb-4">
              Bagaimana Alur Ini Bekerja & Saling Terhubung:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-pink-50 leading-relaxed font-semibold">
              <div>
                <p className="font-black text-[#FFD83D] uppercase text-base mb-1">1. IDE KE PRODUK FIT</p>
                Analisis pasar mendalam (Market Opportunity) menentukan produk apa yang layak dikembangkan. Dari sana R&D merancang formula yang aman serta memiliki USP (pembeda) unik agar produk fit dengan keinginan pasar.
              </div>
              <div className="border-t border-white/10 pt-4 md:pt-0 md:border-t-0 md:border-l md:border-white/20 md:pl-6">
                <p className="font-black text-[#FFD83D] uppercase text-base mb-1">2. HPP & BRANDING</p>
                Rantai kemasan (Packaging) dipilih selaras dengan harga jual produk (Pricing) agar struktur HPP tetap sehat dan memberikan keuntungan bagi operasional serta aktivitas promosi ke depan.
              </div>
              <div className="border-t border-white/10 pt-4 md:pt-0 md:border-t-0 md:border-l md:border-white/20 md:pl-6">
                <p className="font-black text-[#FFD83D] uppercase text-base mb-1">3. LAUNCHING & SCALE</p>
                Positioning brand diturunkan ke konten & digital marketing. Eksekusi promosi dilakukan dengan strategi peluncuran produk terarah agar menghasilkan konversi maksimal dan pertumbuhan brand yang stabil.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 4. BEAUTY ACADEMY Akan Kita Bedah Dalam Satu Hari ============ */}
      <section className="bg-[#FFF8FC] text-[#141414] border-b-3 border-[#141414] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-[#4A2ACB] border-2 border-[#4A2ACB] px-3 py-1">
              BEDAH MATERI UTAMA
            </span>
            <h2 className="text-3xl md:text-4xl uppercase mt-4">
              BEAUTY ACADEMY Akan Kita Bedah Dalam Satu Hari
            </h2>
            <p className="text-sm text-slate-600 mt-2 font-semibold">
              Menguraikan sepuluh poin penting untuk membangun brand dari nol sampai siap bertumbuh:
            </p>
          </div>

          {/* Bullet Points with Shape Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {[
              { num: "01", text: "Membaca tren dan kebutuhan pasar", color: "border-[#E63E97] hover:bg-[#E63E97]/5" },
              { num: "02", text: "Menentukan konsep dan arah produk", color: "border-[#4A2ACB] hover:bg-[#4A2ACB]/5" },
              { num: "03", text: "Mengembangkan formula yang relevan dan punya pembeda", color: "border-[#4A7DFF] hover:bg-[#4A7DFF]/5" },
              { num: "04", text: "Menyiapkan produk agar lebih siap dipercaya pasar", color: "border-[#FF5A1F] hover:bg-[#FF5A1F]/5" },
              { num: "05", text: "Menentukan arah dan strategi bisnis brand", color: "border-[#4A2ACB] hover:bg-[#4A2ACB]/5" },
              { num: "06", text: "Melihat peluang serta menentukan prioritas pertumbuhan", color: "border-[#E63E97] hover:bg-[#E63E97]/5" },
              { num: "07", text: "Menyusun strategi peluncuran produk", color: "border-[#4A7DFF] hover:bg-[#4A7DFF]/5" },
              { num: "08", text: "Membangun konten dan pemasaran yang menarik minat pasar", color: "border-[#FF5A1F] hover:bg-[#FF5A1F]/5" },
              { num: "09", text: "Memanfaatkan AI untuk riset, pemasaran, dan pekerjaan bisnis", color: "border-[#4A2ACB] hover:bg-[#4A2ACB]/5" },
              { num: "10", text: "Menyiapkan operasional dan kualitas produk agar brand lebih siap berkembang", color: "border-[#E63E97] hover:bg-[#E63E97]/5" }
            ].map((item, i) => (
              <div
                key={i}
                className={`border-3 border-[#141414] p-5 rounded-2xl bg-white flex items-center gap-4 transition-all duration-300 hover:translate-x-1 ${item.color}`}
              >
                <span className="w-10 h-10 rounded-full bg-[#141414] text-white flex items-center justify-center font-black text-sm shrink-0">
                  {item.num}
                </span>
                <p className="font-bold text-slate-800 text-sm md:text-base leading-snug">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 md:mt-16">
            <a
              href={DREAMPRENEUR_THANKYOU_PATH}
              onClick={(e) => handleRegisterClick(e, "solusi_cta")}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-none bg-[#FF5A1F] text-white font-black text-base uppercase border-3 border-[#141414] hover:bg-[#ff6e39] active:scale-[0.98] transition-all editorial-shadow-black"
            >
              Saya Mau Ikut <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ============ 5. MENTOR SECTION (DARK PREMIUM) ============ */}
      <section className="bg-[#0F0C20] text-white border-b-3 border-[#141414] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-[#4A7DFF] border-2 border-[#4A7DFF] px-3 py-1">
              Tim Praktisi
            </span>
            <h2 className="text-3xl md:text-4xl uppercase mt-4 text-[#FFF8FC] font-display">
              Satu Brand Kosmetik <br />
              Butuh Lebih Dari Satu Perspektif.
            </h2>
            <p className="text-sm text-slate-400 mt-2 font-semibold">
              Belajar langsung dari tim praktisi yang mendiagnosis arah bisnis Anda.
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
              <div key={i} className="bg-[#1C1738] border-2 border-[#4A7DFF] p-6 flex flex-col justify-between hover:border-[#FF5A1F] transition-all duration-300">
                <div>
                  <span className="text-[10px] font-black text-[#E63E97] bg-[#0F0C20] border border-[#E63E97] px-2 py-0.5 rounded-none block w-fit mb-4">
                    Fokus: {mentor.focus}
                  </span>
                  <h3 className="text-lg font-black uppercase text-white font-display">
                    {mentor.name}
                  </h3>
                  <p className="text-xs text-[#FF5A1F] font-bold mt-1 uppercase tracking-wider border-b border-slate-700 pb-3">
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

      {/* ============ 6. TESTIMONI / DOKUMENTASI ============ */}
      <section className="bg-[#FFF8FC] text-[#141414] border-b-3 border-[#141414] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-[#E63E97] border-2 border-[#E63E97] px-3 py-1">
              Dokumentasi Nyata
            </span>
            <h2 className="text-3xl md:text-4xl uppercase mt-4">
              Bukan Cuma Datang, <br />
              Duduk, Dengar, Lalu Pulang.
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
            <div className="w-14 h-14 rounded-none bg-[#E63E97] text-white flex items-center justify-center font-black text-xl shrink-0 border-2 border-[#141414]">
              E
            </div>
            <div className="space-y-4">
              <p className="text-base md:text-lg italic text-slate-800 leading-relaxed font-semibold">
                &ldquo;Aku sempat ragu memulai, tapi mengikuti batch pertama Dreampreneur membuka mata aku bahwa membangun brand itu soal keberanian, bukan sekadar teori. Dari sanalah aku akhirnya memberanikan diri membangun brand parfum sendiri dengan konsep yang inovatif — dan merasa lebih siap menghadapi langkah berikutnya.&rdquo;
              </p>
              <div>
                <p className="font-black text-base uppercase text-[#141414]">Kak Eki</p>
                <p className="text-xs text-[#E63E97] font-bold uppercase">Peserta Batch 1 · Founder Brand Parfum</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 7. HARGA / SCARCITY SECTION ============ */}
      <section className="bg-gradient-to-r from-[#E63E97] to-[#4A2ACB] text-white border-b-3 border-[#141414] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-5xl uppercase leading-none font-display">
              Investasi Satu Hari <br />
              Untuk Arah Brand Yang Lebih Jelas.
            </h2>
          </div>

          {/* Pricing Box */}
          <div className="bg-white text-[#141414] border-4 border-[#141414] p-6 md:p-10 relative overflow-hidden editorial-shadow-black max-w-2xl mx-auto">
            <span className="absolute -top-4 left-6 bg-[#4A7DFF] text-white text-xs font-black px-3 py-1 uppercase border-2 border-[#141414] rotate-[-1deg]">
              HARGA SPESIAL PROMOSI
            </span>
            
            <div className="flex flex-col items-center text-center space-y-4 pt-4">
              <span className="text-sm font-bold text-slate-400 line-through">Normal Rp250.000</span>
              <h3 className="text-4xl md:text-6xl font-black text-[#FF5A1F] tracking-tight font-display">
                Rp189.000
              </h3>
              
              {/* Bar Proses Tinggal 5 Seat Lagi */}
              <div className="w-full max-w-md mx-auto space-y-2 mt-2 bg-[#FFF8FC] p-3 border-2 border-[#141414] rounded-xl" role="status" aria-live="polite">
                <div className="relative w-full h-4 overflow-hidden rounded-full bg-slate-200">
                  <span className="absolute inset-y-0 left-0 w-[92%] rounded-l-full bg-gradient-to-r from-[#FF5A1F] to-[#E63E97]" />
                  <span className="absolute inset-y-0 left-[92%] w-[8%] rounded-r-full bg-[#E63E97] animate-pulse" />
                </div>
                <p className="text-xs font-black uppercase tracking-wide text-center text-[#FF5A1F] animate-pulse">
                  🔥 Sisa 5 Seat Lagi! Kuota Hampir Penuh
                </p>
              </div>

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

      {/* ============ 8. PERTANYAAN UMUM (FAQ) ============ */}
      <section className="bg-[#FFF8FC] text-[#141414] border-b-3 border-[#141414] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-[#4A2ACB] border-2 border-[#4A2ACB] px-3 py-1">
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
                q: "Berapa harga tiket?",
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
                  className="w-full flex items-center justify-between gap-4 p-4 text-left font-black uppercase text-sm md:text-base hover:bg-[#FFF8FC]/40 transition-colors"
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

      {/* ============ 9. AJAKAN TERAKHIR / FOOTER CTA ============ */}
      <section className="bg-[#141414] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest bg-[#E63E97] text-white px-3 py-1 border border-white">
              KESEMPATAN TERAKHIR
            </span>
            
            <h2 className="text-3xl md:text-5xl uppercase font-display leading-tight text-[#FFF8FC]">
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
                <h4 className="font-black uppercase text-[#E63E97] text-sm">Belum Mulai?</h4>
                <p className="text-xs text-slate-600 mt-2 font-semibold">
                  Bangun pondasinya dengan pertimbangan yang lebih matang sejak awal. Mencegah kerugian modal sebelum memproduksi produk.
                </p>
              </div>
              <div className="border border-slate-700 p-5 bg-white">
                <h4 className="font-black uppercase text-[#4A7DFF] text-sm">Brand Sudah Berjalan?</h4>
                <p className="text-xs text-slate-600 mt-2 font-semibold">
                  Temukan apa yang perlu diperkuat untuk langkah berikutnya. Diagnosis letak kesalahan strategi konversi Anda.
                </p>
              </div>
            </div>

            {/* Event Summary Details */}
            <div className="space-y-2 text-sm text-slate-400">
              <p className="font-bold text-white uppercase font-display">BEAUTY ACADEMY BATCH 2</p>
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