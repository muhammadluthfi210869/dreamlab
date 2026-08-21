"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import {
  DREAMPRENEUR_THANKYOU_PATH,
  buildDreampreneurThankyouUrl,
  ensureMetaPixelQueue,
  preconnectWhatsApp,
  trackDreampreneurCtaClick,
  trackDreampreneurView,
} from "@/lib/dreampreneur";

export default function DreampreneurLanding() {
  const [showSticky, setShowSticky] = useState(false);
  const [passedPrice, setPassedPrice] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    ensureMetaPixelQueue();
    preconnectWhatsApp();
    trackDreampreneurView();

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowSticky(scrollY > 500);
      const priceEl = document.getElementById("price-section");
      if (priceEl) {
        const priceTop = priceEl.getBoundingClientRect().top + scrollY;
        setPassedPrice(scrollY > priceTop - 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRegisterClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    label: string
  ) => {
    e.preventDefault();
    trackDreampreneurCtaClick(label);
    window.location.assign(buildDreampreneurThankyouUrl());
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const EVENT_DATE = "29 Agustus 2026";
  const EVENT_TIME = "11.00\u201317.00 WIB";
  const EVENT_VENUE = "Excotel Design Hotel, Surabaya";

  return (
    <div
      className="landing-page-ads min-h-screen bg-white text-[#141414] font-sans selection:bg-[#5A31F4] selection:text-white overflow-x-hidden antialiased"
      style={
        {
          "--color-ungu": "#5A31F4",
          "--color-pink": "#E63E97",
          "--color-biru": "#4A7DFF",
          "--color-orange": "#FF5A1F",
          "--color-offwhite": "#FFF8FC",
        } as CSSProperties
      }
    >
      <style>{`
        .dp-display {
          font-family: "Viga", var(--font-viga), sans-serif !important;
          font-weight: 900 !important;
          letter-spacing: -0.03em;
        }
        .dp-hero-hl {
          font-family: "Viga", var(--font-viga), sans-serif !important;
          font-size: clamp(2.2rem, 8.5vw, 5rem);
          line-height: 1.02;
          font-weight: 900;
          letter-spacing: -0.04em;
        }
        .dp-section-hl {
          font-family: "Viga", var(--font-viga), sans-serif !important;
          font-size: clamp(1.8rem, 5.5vw, 3.2rem);
          line-height: 1.05;
          font-weight: 900;
          letter-spacing: -0.03em;
        }
      `}</style>

      {/* ===== MOBILE STICKY CTA ===== */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 md:hidden transition-transform duration-300 ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-[#FFF8FC]/95 backdrop-blur-md border-t border-[#E9D5FF]/50 py-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(59,7,100,0.06)] flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Harga Spesial</span>
            <span className="text-lg font-black text-[#5A31F4]">Rp189.000</span>
          </div>
          <a
            href={DREAMPRENEUR_THANKYOU_PATH}
            onClick={(e) => handleRegisterClick(e, "sticky_daftar")}
            className="flex-1 max-w-[200px] inline-flex items-center justify-center gap-2 rounded-2xl bg-[#5A31F4] text-white font-black text-sm uppercase py-3.5 px-4 hover:bg-[#4A2ACB] active:scale-[0.97] transition-all shadow-md"
          >
            Daftar <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* ===== 1. HERO ===== */}
      <section className="bg-gradient-to-b from-[#FAF8FC] to-[#F5EEF8] pt-16 pb-16 md:pt-24 md:pb-24">
        <div className="container mx-auto px-5 max-w-4xl flex flex-col items-center text-center gap-6">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FAF8FC] border border-[#C5A880]/35 text-[#C5A880] text-[10px] sm:text-xs font-black uppercase tracking-widest">
            BEAUTY ACADEMY BATCH 2
          </span>

          <h1 className="dp-hero-hl text-[#3B0764] uppercase w-full max-w-3xl leading-[1.05]">
            Pahami Cara Bangun Brand Kosmetik<br />
            <span className="text-[#C5A880]">dari 0 Sampai Market Fit.</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-500 font-semibold max-w-xl mx-auto leading-relaxed">
            Bagaimana menyelaraskan konsep produk, formula, eksekusi bisnis, dan strategi pasar secara presisi.
          </p>

          <div className="w-full max-w-md md:max-w-xl mt-4 relative">
            <div className="absolute -inset-4 bg-[#3B0764]/5 rounded-3xl blur-2xl opacity-60 pointer-events-none" />
            <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100/80">
              <Image
                src="/assets/images/dreampreneur-batch-2/flyer.png"
                alt="BEAUTY ACADEMY BATCH 2 — Surabaya, 29 Agustus 2026"
                width={810}
                height={1013}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2. PROBLEM ===== */}
      <section className="bg-white py-16 md:py-24 border-y border-slate-100">
        <div className="container mx-auto px-5 max-w-4xl">
          <div className="text-center mb-12 space-y-3">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#6D28D9] border border-[#E9D5FF] px-3 py-1 rounded-full bg-[#F9F6FC]">
              DIAGNOSTIK BISNIS
            </span>
            <h2 className="dp-section-hl text-[#2E1065] uppercase">
              Apakah Anda Mengalami<br />Salah Satu Titik Hambat Ini?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-xl mx-auto leading-relaxed">
              Banyak brand owner menghabiskan modal besar di awal karena melangkah tanpa urutan prioritas yang tepat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E9D5FF] border border-[#E9D5FF] rounded-3xl overflow-hidden bg-white shadow-sm">
            <div className="flex flex-col divide-y divide-[#E9D5FF]">
              {[
                "Bingung menentukan langkah awal yang valid dalam membangun brand kosmetik.",
                "Khawatir salah memilih kategori produk dan meleset menyasar target pasar.",
                "Kesulitan merumuskan formula dan karakter produk yang punya diferensiasi kuat.",
                "Budget pemasaran terus terkuras, namun angka konversi dan retensi stagnan."
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-6 sm:p-8 hover:bg-[#F9F6FC]/30 transition-colors"
                >
                  <span className="text-2xl sm:text-3xl font-[900] text-[#6D28D9] leading-none shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-[#2E1065] leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-col divide-y divide-[#E9D5FF]">
              {[
                "Belum menemukan segmentasi pasar yang spesifik dan berdaya beli tinggi.",
                "Belum memiliki sistem penetrasi pasar yang terukur agar brand cepat dikenal.",
                "Brand sudah berjalan, namun identitas dan positioning-nya belum berkarakter.",
                "Mengalami kebuntuan (growth plateau) saat ingin membawa brand ke level ekspansi."
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-6 sm:p-8 hover:bg-[#F9F6FC]/30 transition-colors"
                >
                  <span className="text-2xl sm:text-3xl font-[900] text-[#6D28D9] leading-none shrink-0">
                    {String(i + 5).padStart(2, "0")}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-[#2E1065] leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3. FRAMEWORK ===== */}
      <section className="bg-[#F9F6FC] py-16 md:py-24">
        <div className="container mx-auto px-5 max-w-5xl">
          <div className="text-center mb-12 space-y-3">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#3B0764] border border-[#C5A880]/30 px-3 py-1 rounded-full bg-white">
              THE STRATEGIC ROADMAP
            </span>
            <h2 className="dp-section-hl text-[#3B0764] uppercase max-w-2xl mx-auto">
              Brand Kosmetik Tidak Bisa<br />Dibangun Hanya dari Satu Sisi.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-xl mx-auto leading-relaxed">
              Setiap tahap saling mengunci. Melewati satu tahapan akan merusak efisiensi tahapan berikutnya.
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-3 md:gap-y-6 md:gap-x-2 max-w-4xl mx-auto">
            {[
              "Kebutuhan Pasar",
              "Konsep Produk",
              "Formulasi & Karakter",
              "Posisi & Arah Brand",
              "Strategi Bisnis & Margin",
              "Peluncuran (Launch Execution)",
              "Konten & Distribusi Pemasaran",
              "Membangun Kepercayaan Pasar",
              "Validasi & Pertumbuhan Berkelanjutan"
            ].map((step, i, arr) => (
              <div key={i} className="flex flex-col md:flex-row items-center gap-2 md:gap-3 w-full md:w-auto">
                <div className="bg-white border border-[#C5A880]/35 rounded-2xl px-5 py-4 shadow-sm text-center min-w-[170px] w-full md:w-auto hover:border-[#C5A880] transition-colors">
                  <span className="text-[10px] font-black text-[#C5A880] block uppercase tracking-wider">
                    Tahap {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-xs font-black uppercase text-[#3B0764] mt-1 leading-tight">
                    {step}
                  </p>
                </div>
                {i < arr.length - 1 && (
                  <span className="text-[#C5A880] font-black text-lg rotate-90 md:rotate-0 my-1 md:my-0">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. APA YANG AKAN DIBEDAH ===== */}
      <section className="bg-white border-y border-slate-100 py-16 md:py-24">
        <div className="container mx-auto px-5 max-w-4xl">
          <div className="text-center mb-12 space-y-3">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#3B0764] border border-[#E9D5FF] px-3 py-1 rounded-full bg-[#F9F6FC]">
              BEDAH MATERI UTAMA
            </span>
            <h2 className="dp-section-hl text-[#2E1065] uppercase">
              BEAUTY ACADEMY BATCH 2<br />AKAN KITA BEDAH DALAM SATU HARI.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-xl mx-auto leading-relaxed">
              Menguraikan sepuluh poin penting untuk membangun brand dari nol sampai siap bertumbuh:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              { num: "01", text: "Membaca tren dan kebutuhan pasar", bg: "bg-[#FFF8FC] border-[#E63E97]/20 text-[#E63E97]" },
              { num: "02", text: "Menentukan konsep dan arah produk", bg: "bg-white border-slate-100 text-slate-400" },
              { num: "03", text: "Mengembangkan formula yang relevan dan punya pembeda", bg: "bg-[#F0F0FF] border-[#5A31F4]/20 text-[#5A31F4]" },
              { num: "04", text: "Menyiapkan produk agar lebih siap dipercaya pasar", bg: "bg-white border-slate-100 text-slate-400" },
              { num: "05", text: "Menentukan arah dan strategi bisnis brand", bg: "bg-[#E6F0FF] border-[#4A7DFF]/20 text-[#4A7DFF]" },
              { num: "06", text: "Melihat peluang serta menentukan prioritas pertumbuhan", bg: "bg-white border-slate-100 text-slate-400" },
              { num: "07", text: "Menyusun strategi peluncuran produk", bg: "bg-[#FFF8FC] border-[#E63E97]/20 text-[#E63E97]" },
              { num: "08", text: "Membangun konten dan pemasaran yang menarik minat pasar", bg: "bg-white border-slate-100 text-slate-400" },
              { num: "09", text: "Memanfaatkan AI untuk riset, pemasaran, dan pekerjaan bisnis", bg: "bg-[#F0F0FF] border-[#5A31F4]/20 text-[#5A31F4]" },
              { num: "10", text: "Menyiapkan operasional dan kualitas produk agar brand lebih siap berkembang", bg: "bg-white border-slate-100 text-slate-400" },
            ].map((item, i) => (
              <div
                key={i}
                className={`relative overflow-hidden border rounded-3xl p-6 sm:p-8 flex items-center gap-5 hover:shadow-md transition-all ${item.bg}`}
              >
                <span className="text-4xl sm:text-5xl font-[900] leading-none shrink-0 opacity-80">
                  {item.num}
                </span>
                <p className="font-extrabold text-xs sm:text-sm text-slate-800 leading-snug">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href={DREAMPRENEUR_THANKYOU_PATH}
              onClick={(e) => handleRegisterClick(e, "solusi_cta")}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#5A31F4] text-white font-black text-sm sm:text-base uppercase shadow-xl shadow-[#5A31F4]/25 hover:bg-[#4A2ACB] active:scale-[0.98] transition-all min-h-[52px]"
            >
              Saya Mau Ikut <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ===== 5. MENTOR ===== */}
      <section className="bg-gradient-to-br from-[#5A31F4] via-[#6e3efd] to-[#7B4DFF] py-16 md:py-24 text-white">
        <div className="container mx-auto px-5 max-w-5xl">
          <div className="text-center mb-12 space-y-3">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#E63E97] border border-[#E63E97]/30 px-3 py-1 rounded-full bg-white">
              TIM PRAKTISI
            </span>
            <h2 className="dp-section-hl uppercase text-white font-display">MEET OUR MENTORS</h2>
            <p className="text-purple-100 font-medium text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Belajar langsung dari praktisi di bidang produk, bisnis, pemasaran, dan operasional.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "AMIRA ALYDRUS",
                role: "Cosmetic Formulation Expert",
                focus: "PRODUK & FORMULA",
                points: ["Tren & kebutuhan pasar", "Pengembangan formula", "Pembeda produk"],
                badgeColor: "bg-[#E63E97]/10 text-[#E63E97]"
              },
              {
                name: "FADHILA SYAHAB",
                role: "Business Development Strategist",
                focus: "BISNIS & PERTUMBUHAN",
                points: ["Arah bisnis brand", "Peluang pertumbuhan", "Prioritas langkah berikutnya"],
                badgeColor: "bg-[#4A7DFF]/10 text-[#4A7DFF]"
              },
              {
                name: "REVITA",
                role: "Digital Marketer",
                focus: "PEMASARAN & KECERDASAN BUATAN",
                points: ["Strategi peluncuran", "Konten & pemasaran", "AI untuk bisnis"],
                badgeColor: "bg-[#FF5A1F]/10 text-[#FF5A1F]"
              },
              {
                name: "BARI NOOR RAHMAN",
                role: "SIG Manager Operasional",
                focus: "OPERASIONAL & KESIAPAN PRODUK",
                points: ["Kesiapan produk", "Kualitas & kepercayaan", "Kesiapan operasional"],
                badgeColor: "bg-[#4A7DFF]/10 text-[#4A7DFF]"
              }
            ].map((mentor, i) => (
              <div
                key={i}
                className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <span className={`inline-block ${mentor.badgeColor} text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-4`}>
                    {mentor.focus}
                  </span>
                  <h3 className="text-base sm:text-lg font-[900] uppercase text-[#141414] leading-tight mb-1">
                    {mentor.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-4">
                    {mentor.role}
                  </p>
                </div>
                <ul className="space-y-2 border-t border-slate-100 pt-4 mt-auto">
                  {mentor.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 font-semibold leading-tight">
                      <span className="text-[#5A31F4] font-black">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 6. DOKUMENTASI ===== */}
      <section className="bg-white border-y border-slate-100 py-16 md:py-24">
        <div className="container mx-auto px-5 max-w-4xl">
          <div className="text-center mb-12 space-y-3">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#E63E97] border border-[#E63E97]/25 px-3 py-1 rounded-full bg-[#FFF8FC]">
              DOKUMENTASI EVENT
            </span>
            <h2 className="dp-section-hl text-[#141414] uppercase">
              BUKAN CUMA DATANG,<br />DUDUK, DENGAR, LALU PULANG.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
              Belajar langsung, bertanya langsung, dan bertemu dengan sesama beautypreneur.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-100 shadow-sm mb-8 bg-white p-2">
            <Image
              src="/assets/images/Dreamlab-Dreamprenuer-Academy--1024x540.webp"
              alt="Suasana Dreampreneur Academy Batch 1"
              width={1024}
              height={540}
              className="w-full h-auto object-cover rounded-2xl"
              loading="lazy"
            />
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#E63E97] text-white flex items-center justify-center font-[900] text-xl shrink-0">
              E
            </div>
            <div className="space-y-3">
              <p className="text-sm sm:text-base md:text-lg italic text-slate-700 leading-relaxed font-semibold">
                &ldquo;Aku sempat ragu memulai, tapi mengikuti batch pertama Dreampreneur membuka mata aku bahwa membangun brand itu soal keberanian, bukan sekadar teori. Dari sanalah aku akhirnya memberanikan diri membangun brand parfum sendiri dengan konsep yang inovatif — dan merasa lebih siap menghadapi langkah berikutnya.&rdquo;
              </p>
              <div>
                <p className="font-extrabold text-sm sm:text-base uppercase text-[#141414]">Kak Eki</p>
                <p className="text-xs text-[#E63E97] font-black uppercase tracking-wider">Peserta Batch 1 · Founder Brand Parfum</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 7. HARGA ===== */}
      <section id="price-section" className="bg-[#FFF8FC] py-16 md:py-24 border-b border-slate-100">
        <div className="container mx-auto px-5 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="dp-section-hl text-[#141414] uppercase">
              INVESTASI SATU HARI<br />UNTUK ARAH BRAND<br />YANG LEBIH JELAS.
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 max-w-md mx-auto shadow-xl h-auto">
            <div className="flex justify-center mb-5">
              <span className="inline-block bg-[#E63E97]/10 text-[#E63E97] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-[#E63E97]/25">
                HARGA SPESIAL
              </span>
            </div>

            <div className="flex flex-col items-center text-center gap-5">
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 line-through uppercase tracking-wider mb-1">
                  Normal Rp250.000
                </span>
                <div className="text-5xl sm:text-6xl font-black text-[#5A31F4] tracking-tight">
                  Rp189.000
                </div>
              </div>

              <div className="w-full bg-[#FFF8FC] border border-[#E63E97]/10 rounded-2xl py-3 px-4">
                <p className="text-xs font-black uppercase tracking-wider text-[#FF5A1F] text-center">
                  ⚠️ KUOTA PESERTA TERBATAS
                </p>
              </div>

              <div className="w-full border-t border-slate-100 pt-5 text-left">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-wider">
                  PAKET SUDAH TERMASUK:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm font-bold text-slate-700">
                  {["✓ 1 Hari Belajar", "✓ Makan Siang", "✓ 4 Praktisi Expert", "✓ Merchandise Eksklusif", "✓ Sesi Membangun Relasi", "✓ E-book Framework"].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-[#E63E97] font-black">✓</span>
                      <span>{item.replace("✓ ", "")}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={DREAMPRENEUR_THANKYOU_PATH}
                onClick={(e) => handleRegisterClick(e, "price_cta")}
                className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[#FF5A1F] text-white font-black text-sm sm:text-base uppercase shadow-lg shadow-orange-500/20 hover:bg-[#e04e18] active:scale-[0.98] transition-all min-h-[52px]"
              >
                AMANKAN KURSI Rp189.000 →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 8. FAQ ===== */}
      <section className="bg-white border-y border-slate-100 py-16 md:py-24">
        <div className="container mx-auto px-5 max-w-3xl">
          <div className="text-center mb-12 space-y-3">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#5A31F4] border border-[#5A31F4]/20 px-3 py-1 rounded-full bg-[#F0F0FF]">
              FAQ
            </span>
            <h2 className="dp-section-hl text-[#141414] uppercase">MASIH RAGU?</h2>
          </div>

          <div className="space-y-3">
            {[
              { q: "Saya belum punya brand. Apakah tetap cocok?", a: "Ya. BEAUTY ACADEMY BATCH 2 juga ditujukan untuk Anda yang baru ingin memulai dan ingin memahami produk, bisnis serta pemasaran sebelum melangkah lebih jauh." },
              { q: "Brand saya sudah berjalan. Apakah masih relevan?", a: "Ya. Pembahasannya juga relevan untuk pemilik brand yang ingin melihat kembali produk, bisnis, pemasaran dan langkah berikutnya." },
              { q: "Apakah saya harus sudah punya produk?", a: "Tidak." },
              { q: "Apakah acara ini hanya untuk skincare?", a: "Tidak. Pembahasan berfokus pada strategi membangun brand kosmetik dari produk, formula, bisnis, pemasaran hingga kecerdasan buatan." },
              { q: "Apa yang termasuk dalam tiket?", a: "Sesi belajar satu hari penuh, sesi membangun relasi, makan siang, merchandise Dreampreneur dan E-book Framework Memulai Brand Skincare." },
              { q: "Berapa harga tiket?", a: "Harga spesial Rp189.000 dari harga normal Rp250.000." },
              { q: "Kapan acaranya?", a: "29 Agustus 2026 pukul 11.00–17.00 WIB." },
              { q: "Di mana acaranya?", a: "Excotel Design Hotel, Surabaya." },
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-slate-100 overflow-hidden rounded-2xl shadow-sm hover:border-slate-200 transition-colors">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left font-extrabold uppercase text-xs sm:text-sm text-slate-800 hover:bg-[#FFF8FC]/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-[#5A31F4] transition-transform shrink-0" />
                </button>
                <div className={`transition-all duration-200 overflow-hidden ${activeFaq === i ? "max-h-[400px] border-t border-slate-100" : "max-h-0"}`}>
                  <p className="p-5 text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 9. FINAL CTA ===== */}
      <section className="bg-gradient-to-br from-[#5A31F4] via-[#6d3cfc] to-[#8D4DFF] py-16 md:py-24 text-white pb-[calc(4.5rem+env(safe-area-inset-bottom))] relative overflow-hidden">
        {/* Soft pink highlight glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E63E97]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-5 max-w-4xl relative z-10">
          <div className="text-center space-y-8 max-w-2xl mx-auto">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-[#E63E97] text-white px-4 py-1.5 rounded-full">
              KESEMPATAN TERAKHIR
            </span>

            <h2 className="dp-section-hl uppercase text-white font-display">
              JANGAN CUMA BIKIN<br />BRAND KOSMETIK.
            </h2>

            <div className="border border-white/20 bg-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
              <p className="text-xl sm:text-2xl md:text-3xl uppercase font-[900] leading-tight tracking-tight text-white dp-display">
                BANGUN DENGAN ARAH,<br />
                <span className="text-[#FF4FA3]">SAMPAI SIAP DIPERCAYA PASAR.</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h4 className="font-extrabold uppercase text-[#E63E97] text-xs sm:text-sm mb-2">Belum Mulai?</h4>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
                  Bangun pondasinya dengan pertimbangan yang lebih matang sejak awal. Kurangi risiko modal terbuang sebelum produk benar-benar masuk produksi.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h4 className="font-extrabold uppercase text-[#5A31F4] text-xs sm:text-sm mb-2">Brand Sudah Berjalan?</h4>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
                  Temukan apa yang perlu diperkuat untuk langkah berikutnya. Lihat kembali bagian strategi yang mungkin menghambat konversi dan pertumbuhan brand.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-purple-100">
              <p className="font-black uppercase text-white text-base sm:text-lg tracking-wider dp-display">
                BEAUTY ACADEMY BATCH 2
              </p>
              <p className="font-bold uppercase tracking-wide">
                29 AGUSTUS 2026 · EXCOTEL DESIGN HOTEL, SURABAYA
              </p>
              <div className="flex justify-center items-center gap-3 pt-2">
                <span className="line-through text-purple-300/80 font-bold">
                  Rp250.000
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#FF4FA3] dp-display">
                  Rp189.000
                </span>
              </div>
            </div>

            <a
              href={DREAMPRENEUR_THANKYOU_PATH}
              onClick={(e) => handleRegisterClick(e, "final_cta")}
              className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-white text-[#5A31F4] hover:bg-[#FFF8FC] active:scale-[0.98] font-black text-sm sm:text-base uppercase shadow-xl transition-all min-h-[56px]"
            >
              SAYA MAU IKUT →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}