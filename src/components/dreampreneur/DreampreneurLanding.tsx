"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { ArrowRight, BadgeCheck, BookOpen, CalendarDays, CheckCircle2, Clock, Gift, Lightbulb, MapPin, Quote, Sparkles, Star, TrendingUp, Utensils } from "lucide-react";
import {
  DREAMPRENEUR_THANKYOU_PATH,
  buildDreampreneurThankyouUrl,
  ensureMetaPixelQueue,
  preconnectWhatsApp,
  trackDreampreneurCtaClick,
  trackDreampreneurExplore,
  trackDreampreneurView,
} from "@/lib/dreampreneur";

const CTA_BASE =
  "inline-flex items-center justify-center gap-2.5 px-8 py-4 sm:px-10 sm:py-5 rounded-[50px] bg-gradient-to-r from-[#db2777] to-[#9d174d] text-white font-extrabold text-sm sm:text-[15px] uppercase tracking-wider transition-all duration-300 shadow-[0_16px_38px_-12px_rgba(225,29,72,0.55)] hover:brightness-110 hover:shadow-[0_20px_44px_-12px_rgba(190,18,60,0.6)] hover:scale-[1.02] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#be123c]";

const CTA_SECONDARY =
  "inline-flex items-center justify-center gap-2.5 px-8 py-4 sm:px-10 sm:py-5 rounded-[50px] bg-white border border-slate-200 text-slate-800 font-extrabold text-sm sm:text-[15px] uppercase tracking-wider transition-all duration-300 hover:border-[#db2777]/50 hover:text-[#db2777] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#db2777] shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)]";

const DP_ACCENT =
  "bg-clip-text text-transparent bg-gradient-to-r from-[#db2777] via-[#be123c] to-[#9d174d]";

const EVENT_DATE = "29 Agustus 2026";
const EVENT_TIME = "11.00–17.00 WIB";
const EVENT_VENUE = "Excotel Design Hotel, Surabaya";
const EVENT_ADDRESS = "Jl. Ahmad Yani No.119, Surabaya";
const PRICE_NORMAL = "Rp250.000";
const PRICE_EARLY_BIRD = "Rp189.000";
const EVENT_TS = new Date("2026-08-29T11:00:00+07:00").getTime();

const EXPERIENCE_BENEFITS = [
  {
    title: "Makan Siang",
    desc: "Lunch disediakan agar kamu fokus mengikuti rangkaian acara dari awal sampai akhir.",
    Icon: Utensils,
    featured: false,
  },
  {
    title: "Exclusive Merchandise",
    desc: "Merchandise eksklusif yang hanya bisa didapatkan peserta Dreampreneur Batch 2.",
    Icon: Gift,
    featured: false,
  },
  {
    title: "E-book Framework Memulai Brand Skincare",
    desc: "Panduan praktis langkah demi langkah untuk membangun brand skincare dari nol.",
    Icon: BookOpen,
    featured: true,
  },
];

const PROBLEM_AUDIENCE = [
  {
    label: "Baru Mau Memulai",
    title: "Punya Cita-Cita Beauty Brand, Tapi Bingung Mulai dari Mana",
    desc: "Takutan boncos karena belum paham produk apa yang laku, target market, sampai proses pengembangan produknya.",
    Icon: Lightbulb,
  },
  {
    label: "Sudah Punya Brand",
    title: "Brand Sudah Berjalan, Tapi Masih Stuck",
    desc: "Strategi produk, pemasaran, operasional, dan pertumbuhan brand belum memiliki arah yang jelas.",
    Icon: TrendingUp,
  },
];

const LEARN_ITEMS = [
  {
    num: "01",
    block: "Product-Market Fit & Validasi Industri Beauty 2026",
    points: [
      "Cara melihat peluang kategori skincare/bodycare yang permintaannya tinggi.",
      "Bukan sekadar ikut-ikutan tren sesaat yang cepat mati.",
    ],
  },
  {
    num: "02",
    block: "Bedah Key Metrics & R&D Formulation (Dreamlab)",
    points: [
      "Variabel penentu kesuksesan formula.",
      "Riset bahan aktif dan standar keamanan.",
      "Cara kerja sama dengan maklon tanpa salah langkah.",
    ],
  },
  {
    num: "03",
    block: "Standar Kredibilitas & Lab Testing (SIG Laboratories)",
    points: [
      "Pentingnya uji laboratorium dan legalitas BPOM.",
      "Membuat produk lebih siap dipercaya oleh market secara instan.",
    ],
  },
  {
    num: "04",
    block: "Business Development & Organic Growth Strategy",
    points: [
      "Menyusun positioning brand.",
      "Arah bisnis jangka panjang.",
      "Strategi organic growth step-by-step.",
    ],
  },
  {
    num: "05",
    block: "Performance Marketing & AI-Optimized Launching",
    points: [
      "Membaca respons market dan menyiapkan strategi launching.",
      "Pemanfaatan AI & automation untuk digital marketing.",
    ],
  },
  {
    num: "06",
    block: "TOFU, MOFU & BOFU Content Strategy untuk Beauty Brand",
    points: [
      "Bedah struktur konten dari menjangkau audiens baru.",
      "Hingga konversi penjualan yang konsisten.",
    ],
  },
];

const MENTORS = [
  { name: "Amira Alydrus", role: "Cosmetic Formulation Expert", initials: "AA", expert: "Meracik formula kosmetik yang aman dan siap masuk pasar." },
  { name: "Fadhila Syahab", role: "Business Development Strategist", initials: "FS", expert: "Menyusun strategi bisnis untuk menumbuhkan brand." },
  { name: "Bari Noor Rahman", role: "SIG Manager Operasional", initials: "B", expert: "Memastikan produk lolos uji laboratorium yang kredibel." },
  { name: "Revita", role: "Digital Marketer", initials: "R", expert: "Membaca market dan menemukan pembeli lewat digital marketing." },
];

const TRUST_ITEMS = ["Seat terbatas", "Belajar + Networking", "Praktisi industri langsung"];

type TimeLeft = { d: number; h: number; m: number; s: number };

export default function DreampreneurLanding() {
  const [showSticky, setShowSticky] = useState(false);
  const [showRegisterCta, setShowRegisterCta] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    ensureMetaPixelQueue();
    preconnectWhatsApp();
    trackDreampreneurView();
    const onScroll = () => {
      setShowSticky(window.scrollY > 560);
      const mentor = document.getElementById("meet-mentors");
      const threshold = mentor ? mentor.offsetTop + mentor.offsetHeight - 240 : 3600;
      setShowRegisterCta(window.scrollY >= threshold);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, EVENT_TS - Date.now());
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor(diff / 3600000) % 24,
        m: Math.floor(diff / 60000) % 60,
        s: Math.floor(diff / 1000) % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  const scrollToCurriculum = (label: string) => {
    trackDreampreneurExplore(label);
    document.getElementById("curriculum")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToMentors = () => {
    trackDreampreneurExplore("hero_meet_mentors");
    document.getElementById("meet-mentors")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    e.preventDefault();
    trackDreampreneurCtaClick(label);
    window.location.assign(buildDreampreneurThankyouUrl());
  };

  return (
    <div
      className="landing-page-ads min-h-screen bg-white text-slate-900 font-sans selection:bg-[#db2777] selection:text-white overflow-x-hidden"
      style={
        {
          "--dream-orange": "#e11d48",
          "--dream-dark": "#0f172a",
          "--dream-green": "#be123c",
          "--dream-black": "#1e293b",
        } as CSSProperties
      }
    >
      <style>{`
        .landing-page-ads h1,
        .landing-page-ads h2,
        .landing-page-ads h3,
        .landing-page-ads .font-display,
        .landing-page-ads .font-viga {
          font-family: "Viga", var(--font-viga), sans-serif !important;
          font-weight: 800 !important;
          font-synthesis-weight: auto;
        }
        @media (max-width: 767.98px) {
          .landing-page-ads h1 { font-size: 30px !important; line-height: 1.18 !important; }
          .landing-page-ads h2 { font-size: 25px !important; line-height: 1.2 !important; }
        }
      `}</style>

      {/* ============ MOBILE STICKY CTA ============ */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 md:hidden transition-transform duration-300 ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-white/95 backdrop-blur border-t border-slate-200 pt-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(15,23,42,0.12)]">
          {showRegisterCta ? (
            <>
              <a
                href={DREAMPRENEUR_THANKYOU_PATH}
                onClick={(e) => handleRegisterClick(e, "sticky_daftar_sekarang")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#db2777] to-[#9d174d] text-white font-extrabold text-sm uppercase tracking-wider py-4 shadow-[0_14px_32px_-10px_rgba(225,29,72,0.6)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#be123c]"
                aria-label="Daftar Dreampreneur Batch 2 — Rp189K"
              >
                Daftar Sekarang — {PRICE_EARLY_BIRD}
              </a>
              <p className="text-center text-[10px] font-bold text-slate-500 mt-1.5">
                Early Bird {PRICE_EARLY_BIRD} · Seat terbatas
              </p>
            </>
          ) : (
            <button
              type="button"
              onClick={() => scrollToCurriculum("sticky_lihat_detail")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#db2777] to-[#9d174d] text-white font-extrabold text-sm uppercase tracking-wider py-4 shadow-[0_14px_32px_-10px_rgba(225,29,72,0.6)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#be123c]"
              aria-label="Lihat Detail Acara Dreampreneur Batch 2"
            >
              Lihat Detail Acara
            </button>
          )}
        </div>
      </div>

      {/* ============ 1. HERO ============ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#fdf2f8] to-[#f3e8ff] text-slate-900">
        <div className="pointer-events-none absolute -top-40 -right-32 w-[32rem] h-[32rem] rounded-full bg-[#db2777]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-24 w-[30rem] h-[30rem] rounded-full bg-[#f9a8d4]/25 blur-3xl" />
        <div className="pointer-events-none absolute top-24 left-1/2 -translate-x-1/2 w-[22rem] h-[22rem] rounded-full bg-[#fecdd3]/40 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(225,29,72,0.06),transparent_60%)]" />

        <div className="container-custom relative py-16 md:py-28">
          <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#f3d1ff] text-[10px] md:text-xs font-bold tracking-[0.3em] text-[#a21caf] uppercase shadow-[0_8px_24px_-12px_rgba(168,85,247,0.35)]">
              <Sparkles className="w-3.5 h-3.5 text-[#db2777]" fill="currentColor" strokeWidth={0} />
              It&apos;s Time to Learn, Networking &amp; Scale!
            </div>

            <h1 className="text-[30px] sm:text-4xl lg:text-[44px] font-black tracking-tight leading-[1.14] font-display text-slate-900">
              Strategi Bikin Brand Skincare Sendiri dari Nol,{" "}
              <span className={DP_ACCENT}>Tembus Omzet Ratusan Juta</span> Tanpa Trial-Error Bikin Boncos.
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Pelajari strategi dan cara meracik produk, urus legalitas, hingga bangun sistem
              penjualan langsung dari para praktisi dan expert industri beauty.
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-1">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-[0_6px_18px_-10px_rgba(15,23,42,0.18)]">
                <CalendarDays className="w-4 h-4 text-[#db2777]" /> {EVENT_DATE}
              </span>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-[0_6px_18px_-10px_rgba(15,23,42,0.18)]">
                <Clock className="w-4 h-4 text-[#db2777]" /> {EVENT_TIME}
              </span>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-[0_6px_18px_-10px_rgba(15,23,42,0.18)]">
                <MapPin className="w-4 h-4 text-[#db2777]" /> {EVENT_VENUE}
              </span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <a
                href={DREAMPRENEUR_THANKYOU_PATH}
                onClick={(e) => handleRegisterClick(e, "hero_cta")}
                className={CTA_BASE}
              >
                Amankan Tiket Sekarang <ArrowRight className="w-4 h-4" />
              </a>
              <button type="button" onClick={scrollToMentors} className={CTA_SECONDARY}>
                Meet Our Mentors
              </button>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-3 pt-3">
{TRUST_ITEMS.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-[0_6px_18px_-10px_rgba(15,23,42,0.16)]"
                >
                  <BadgeCheck className="w-4 h-4 text-[#db2777]" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. REALITA DI LAPANGAN — IS THIS YOU? ============ */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden" aria-labelledby="problem-audience">
        <div className="pointer-events-none absolute -top-24 -right-24 w-[24rem] h-[24rem] rounded-full bg-[#db2777]/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-[24rem] h-[24rem] rounded-full bg-[#f9a8d4]/[0.18] blur-3xl" />

        <div className="container-custom relative">
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-10 md:mb-12">
            <p className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-rose-200 text-[10px] md:text-xs font-bold tracking-[0.25em] text-[#9d174d] uppercase shadow-[0_8px_24px_-12px_rgba(225,29,72,0.3)]">
              Realita di Lapangan
            </p>
            <h2 id="problem-audience" className="text-3xl md:text-[36px] font-black tracking-tight leading-[1.14] uppercase font-display text-slate-900">
              Mau Mulai Beauty Brand, Tapi Masih <span className={DP_ACCENT}>Bingung Harus Mulai dari Mana?</span>
            </h2>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Atau brand-mu sudah berjalan, tetapi kamu masih stuck menentukan langkah berikutnya? Kamu tidak sendirian.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-7 max-w-4xl mx-auto">
            {PROBLEM_AUDIENCE.map((p) => (
              <div
                key={p.title}
                className="rounded-3xl bg-white border border-slate-200 p-7 md:p-8 space-y-5 shadow-[0_20px_50px_-22px_rgba(15,23,42,0.18)] hover:border-[#db2777]/35 hover:shadow-[0_24px_56px_-20px_rgba(225,29,72,0.25)] transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#db2777] to-[#9d174d] text-white shadow-[0_10px_24px_-8px_rgba(225,29,72,0.55)]">
                    <p.Icon className="w-6 h-6" />
                  </span>
                  <span className="inline-flex items-center rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-[10px] font-black text-[#9d174d] uppercase tracking-widest">
                    {p.label}
                  </span>
                </div>
                <h3 className="text-base md:text-xl font-black uppercase tracking-wide font-display leading-snug text-slate-900">
                  {p.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto mt-10 md:mt-12 rounded-3xl bg-gradient-to-r from-rose-50 via-white to-rose-100 border border-rose-200 p-7 md:p-9 text-center shadow-[0_20px_50px_-20px_rgba(225,29,72,0.25)]">
            <Sparkles className="w-6 h-6 text-[#db2777] mx-auto mb-3" fill="currentColor" strokeWidth={0} />
            <p className="text-sm md:text-base text-slate-700 leading-relaxed">
              Dreampreneur membantu kamu menemukan arah yang lebih jelas sebelum menentukan langkah berikutnya.
            </p>
          </div>
        </div>
      </section>

      {/* ============ 3. CURRICULUM — MASTERCLASS MODULES ============ */}
      <section id="curriculum" className="py-16 md:py-24 bg-gradient-to-b from-[#fae8ff] via-[#fdf2f8] to-white relative overflow-hidden scroll-mt-6" aria-labelledby="curriculum-title">
        <div className="pointer-events-none absolute top-1/3 -left-32 w-[26rem] h-[26rem] rounded-full bg-[#db2777]/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-24 w-[26rem] h-[26rem] rounded-full bg-[#f9a8d4]/[0.22] blur-3xl" />

        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 md:mb-14">
            <p className="inline-flex items-center px-4 py-2 rounded-full bg-rose-50 border border-rose-200 text-[10px] md:text-xs font-black tracking-[0.25em] text-[#9d174d] uppercase">
              Masterclass Modules
            </p>
            <h2 id="curriculum-title" className="text-3xl md:text-[36px] font-black tracking-tight leading-[1.14] uppercase font-display text-slate-900">
              Kunci Growth &amp; Scale-Up Beauty Brand 2026 <span className="text-[#db2777]">→</span>{" "}
              <span className={DP_ACCENT}>Mengerti Formula Bangun Bisnis dari Nol</span>
            </h2>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Enam modul yang dibedah dalam satu hari bersama praktisi industri — bukan teori, langsung ke praktik yang bisa dipakai.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 max-w-6xl mx-auto">
            {LEARN_ITEMS.map((item) => (
              <div
                key={item.num}
                className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-7 md:p-8 shadow-[0_22px_55px_-25px_rgba(15,23,42,0.22)] hover:border-[#db2777]/45 hover:shadow-[0_26px_60px_-22px_rgba(225,29,72,0.3)] hover:-translate-y-1.5 transition-all duration-300"
              >
                <span className="pointer-events-none absolute -top-6 -right-4 text-[96px] font-black text-rose-100 font-display leading-none select-none">
                  {item.num}
                </span>
                <div className="relative flex items-center justify-between gap-3 mb-5">
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#db2777] to-[#9d174d] text-white font-black text-lg shadow-[0_10px_24px_-6px_rgba(225,29,72,0.6)]">
                    {item.num}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-rose-200 to-transparent" />
                </div>
                <h3 className="relative text-base md:text-lg font-black uppercase tracking-wide font-display leading-snug text-slate-900">
                  {item.block}
                </h3>
                <ul className="relative mt-4 space-y-2.5">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-[13px] md:text-sm text-slate-600 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#db2777] mt-[7px] shrink-0 shadow-[0_0_8px_rgba(225,29,72,0.6)]" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 4. MEET OUR MENTORS ============ */}
      <section id="meet-mentors" className="py-16 md:py-24 bg-white relative overflow-hidden scroll-mt-6" aria-labelledby="meet-mentors-title">
        <div className="pointer-events-none absolute -top-24 -right-24 w-[24rem] h-[24rem] rounded-full bg-[#db2777]/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-[24rem] h-[24rem] rounded-full bg-[#f9a8d4]/[0.2] blur-3xl" />

        <div className="container-custom relative">
          <div className="max-w-2xl text-center mx-auto space-y-4 mb-10 md:mb-14">
            <h2 id="meet-mentors-title" className="text-3xl md:text-[36px] font-black tracking-tight leading-[1.14] uppercase font-display text-slate-900">
              Meet Our <span className={DP_ACCENT}>Mentors</span>
            </h2>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Belajar langsung dari praktisi yang menangani formula, pengembangan bisnis, operasional, dan digital marketing.
            </p>
          </div>

          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-center">
            <div className="relative max-w-xs mx-auto w-full lg:max-w-none">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#fda4af]/60 via-transparent to-[#fbcfe8]/60 blur-2xl rounded-[40px]" />
              <div className="relative rounded-[24px] overflow-hidden border border-slate-200 shadow-[0_24px_60px_-22px_rgba(190,18,60,0.35)]">
                <Image
                  src="/assets/images/dreampreneur-batch-2/flyer.png"
                  alt="Pembicara Dreampreneur Batch 2 — para praktisi industri kecantikan"
                  width={810}
                  height={1013}
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              {MENTORS.map((m) => (
                <li key={m.name} className="flex flex-col gap-3 rounded-2xl bg-white border border-slate-200 p-4 md:p-5 shadow-[0_16px_40px_-22px_rgba(15,23,42,0.16)] hover:border-[#db2777]/40 hover:-translate-y-0.5 transition-all duration-300">
                  <span className="flex items-center gap-4">
                    <span
                      aria-hidden="true"
                      className="shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-[#db2777] to-[#9d174d] flex items-center justify-center text-white font-black text-lg ring-4 ring-rose-100 shadow-[0_10px_24px_-8px_rgba(225,29,72,0.55)]"
                    >
                      {m.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm md:text-base font-black text-slate-900 font-display uppercase tracking-wide leading-tight">
                        {m.name}
                      </span>
                      <span className="block text-xs md:text-[13px] text-[#9d174d] font-bold mt-1 leading-snug">
                        {m.role}
                      </span>
                    </span>
                  </span>
                  <p className="text-xs md:text-[13px] text-slate-600 leading-relaxed">{m.expert}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ 5. DOCUMENTATION & TESTIMONI BATCH 1 ============ */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white via-[#fdf2f8] to-[#f3e8ff] relative overflow-hidden" aria-labelledby="social-proof">
        <div className="pointer-events-none absolute -top-24 right-1/4 w-[24rem] h-[24rem] rounded-full bg-[#db2777]/[0.05] blur-3xl" />

        <div className="container-custom relative">
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-10 md:mb-14">
            <h2 id="social-proof" className="text-3xl md:text-[36px] font-black tracking-tight leading-[1.14] uppercase font-display text-slate-900">
              See What Happened at <span className={DP_ACCENT}>Dreampreneur</span>
            </h2>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Sesi belajar, diskusi, dan networking bersama para beautypreneur dan praktisi industri.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <figure className="rounded-3xl overflow-hidden shadow-[0_30px_70px_-25px_rgba(15,23,42,0.25)] border border-slate-200">
              <Image
                src="/assets/images/Dreamlab-Dreamprenuer-Academy--1024x540.webp"
                alt="Suasana sesi Dreampreneur Beauty Academy yang digelar Dreamlab — networking dan diskusi praktisi industri kecantikan"
                width={1024}
                height={540}
                sizes="(max-width: 1200px) 100vw, 1024px"
                loading="lazy"
                className="w-full h-auto object-cover"
              />
            </figure>
          </div>

          <div className="max-w-2xl mx-auto rounded-3xl bg-gradient-to-br from-rose-50 via-white to-rose-100 border border-rose-200 p-7 md:p-9 shadow-[0_24px_60px_-22px_rgba(190,18,60,0.3)]">
            <Quote className="w-8 h-8 text-[#db2777] mb-4" fill="currentColor" strokeWidth={0} />
            <blockquote className="text-[15px] md:text-lg font-medium text-slate-700 leading-relaxed">
              &ldquo;Aku sempat ragu memulai, tapi mengikuti batch pertama Dreampreneur membuka mata aku bahwa membangun brand itu soal keberanian, bukan sekadar teori. Dari sanalah aku akhirnya memberanikan diri membangun brand parfum sendiri dengan konsep yang inovatif — dan merasa lebih siap menghadapi langkah berikutnya.&rdquo;
            </blockquote>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#db2777] to-[#9d174d] flex items-center justify-center text-white font-black text-lg ring-4 ring-rose-100">
                E
              </div>
              <div>
                <p className="font-black text-slate-900 text-sm md:text-base font-display">Kak Eki</p>
                <p className="text-xs md:text-sm text-[#9d174d] font-semibold">Peserta Batch 1 · Founder Brand Parfum</p>
              </div>
              <div className="ml-auto flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#eab308]" fill="currentColor" strokeWidth={0} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 6. FASILITAS PESERTA ============ */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden" aria-labelledby="fasilitas-peserta">
        <div className="pointer-events-none absolute -top-24 -right-24 w-[24rem] h-[24rem] rounded-full bg-[#db2777]/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-[24rem] h-[24rem] rounded-full bg-[#f9a8d4]/[0.2] blur-3xl" />

        <div className="container-custom relative">
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-10 md:mb-14">
            <p className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-rose-200 text-[10px] md:text-xs font-bold tracking-[0.25em] text-[#9d174d] uppercase shadow-[0_8px_24px_-12px_rgba(225,29,72,0.3)]">
              All Included
            </p>
            <h2 id="fasilitas-peserta" className="text-3xl md:text-[36px] font-black tracking-tight leading-[1.14] uppercase font-display text-slate-900">
              Fasilitas <span className={DP_ACCENT}>Peserta</span>
            </h2>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Sudah termasuk dalam tiket Dreampreneur Batch 2.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 max-w-4xl mx-auto">
            {EXPERIENCE_BENEFITS.map((b) => (
              <div
                key={b.title}
                className={
                  b.featured
                    ? "rounded-3xl bg-white border border-[#db2777]/45 p-7 md:p-8 space-y-4 shadow-[0_24px_55px_-20px_rgba(225,29,72,0.35)] ring-1 ring-rose-200 hover:-translate-y-1.5 transition-all duration-300"
                    : "rounded-3xl bg-white border border-slate-200 p-7 md:p-8 space-y-4 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.18)] hover:border-[#db2777]/35 hover:-translate-y-1.5 transition-all duration-300"
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#db2777] to-[#9d174d] text-white shadow-[0_10px_24px_-8px_rgba(225,29,72,0.55)]">
                    <b.Icon className="w-6 h-6" />
                  </span>
                  {b.featured && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#db2777] to-[#9d174d] px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest shadow-[0_8px_20px_-8px_rgba(225,29,72,0.7)]">
                      <Sparkles className="w-3 h-3" /> Value Utama
                    </span>
                  )}
                </div>
                <h3 className="text-base md:text-lg font-black uppercase tracking-wide font-display leading-snug text-slate-900">
                  {b.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

          <p className="max-w-2xl mx-auto text-center text-sm md:text-base text-slate-600 leading-relaxed mt-8">
            Acara juga mencakup sesi networking bersama praktisi industri dan sesama beautypreneur.
          </p>
        </div>
      </section>

      {/* ============ 7. KILLER OFFER — DETAIL ACARA + HARGA + CTA ============ */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white via-[#fae8ff] to-[#fdf2f8] relative overflow-hidden" aria-labelledby="ticket-title">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(225,29,72,0.08),transparent_60%)]" />
        <div className="pointer-events-none absolute -top-24 left-1/4 w-[24rem] h-[24rem] rounded-full bg-[#fbcfe8]/40 blur-3xl" />

        <div className="container-custom relative">
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-10 md:mb-14">
            <h2 id="ticket-title" className="text-3xl md:text-[36px] font-black tracking-tight leading-[1.14] uppercase font-display text-slate-900">
              Siap Menentukan Langkah Berikutnya untuk <span className={DP_ACCENT}>Brand-mu?</span>
            </h2>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Satu hari yang bisa mengubah arah bisnismu. Amankan seat-mu sekarang.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            <div className="rounded-3xl bg-white border border-slate-200 p-7 md:p-9 space-y-5 shadow-[0_20px_55px_-25px_rgba(15,23,42,0.18)]">
              <div className="flex items-start gap-4">
                <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#db2777] to-[#9d174d] flex items-center justify-center shrink-0 shadow-[0_10px_24px_-8px_rgba(225,29,72,0.55)]">
                  <CalendarDays className="w-5 h-5 text-white" />
                </span>
                <div>
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Tanggal</p>
                  <p className="text-sm md:text-[15px] font-bold text-slate-900">{EVENT_DATE}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#db2777] to-[#9d174d] flex items-center justify-center shrink-0 shadow-[0_10px_24px_-8px_rgba(225,29,72,0.55)]">
                  <Clock className="w-5 h-5 text-white" />
                </span>
                <div>
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Waktu</p>
                  <p className="text-sm md:text-[15px] font-bold text-slate-900">{EVENT_TIME}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#db2777] to-[#9d174d] flex items-center justify-center shrink-0 shadow-[0_10px_24px_-8px_rgba(225,29,72,0.55)]">
                  <MapPin className="w-5 h-5 text-white" />
                </span>
                <div>
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Lokasi</p>
                  <p className="text-sm md:text-[15px] font-bold text-slate-900">{EVENT_VENUE}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">{EVENT_ADDRESS}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-3">
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Semuanya sudah termasuk</p>
                {EXPERIENCE_BENEFITS.map((b) => (
                  <div key={b.title} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#db2777] shrink-0" />
                    <p className="text-sm text-slate-700">{b.title}</p>
                  </div>
                ))}
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#db2777] shrink-0" />
                  <p className="text-sm text-slate-700">Sesi networking dengan praktisi industri</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-b from-white to-rose-50 border border-[#db2777]/40 p-7 md:p-9 flex flex-col justify-between shadow-[0_30px_80px_-25px_rgba(225,29,72,0.4)] ring-1 ring-rose-200 relative overflow-hidden">
              <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#db2777]/15 blur-3xl" />

              <div className="relative space-y-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="w-fit rounded-full bg-gradient-to-r from-[#db2777] to-[#9d174d] px-4 py-1.5 text-[10px] md:text-xs font-black text-white uppercase tracking-widest shadow-[0_8px_20px_-6px_rgba(225,29,72,0.7)]">
                    Early Bird
                  </p>
                  <p className="rounded-full bg-[#db2777]/10 border border-[#db2777]/30 px-3 py-1 text-[11px] font-black text-[#9d174d] uppercase tracking-wider">
                    Hemat 24%
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-lg text-slate-400 line-through">{PRICE_NORMAL}</p>
                  <p className="text-[44px] md:text-6xl font-black text-[#db2777] font-display tracking-tight">
                    {PRICE_EARLY_BIRD}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Harga khusus berakhir dalam</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { v: timeLeft?.d, t: "Hari" },
                      { v: timeLeft?.h, t: "Jam" },
                      { v: timeLeft?.m, t: "Menit" },
                      { v: timeLeft?.s, t: "Detik" },
                    ].map((x) => (
                      <div key={x.t} className="rounded-2xl bg-white border border-rose-200 px-2 py-3 text-center shadow-[0_8px_20px_-12px_rgba(225,29,72,0.3)]">
                        <div className="text-xl md:text-2xl font-black text-[#db2777] font-display">{x.v === undefined ? "--" : pad(x.v)}</div>
                        <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">{x.t}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative space-y-4 mt-8">
                <p className="text-base md:text-lg font-black uppercase font-display tracking-tight leading-snug text-slate-900">
                  Seat terbatas untuk session ini.
                </p>
                <a
                  href={DREAMPRENEUR_THANKYOU_PATH}
                  onClick={(e) => handleRegisterClick(e, "ticket_cta")}
                  className="w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#db2777] to-[#9d174d] text-white font-black text-base sm:text-lg uppercase tracking-wider py-5 shadow-[0_18px_50px_-14px_rgba(225,29,72,0.8)] hover:brightness-110 hover:scale-[1.02] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#be123c] transition-all duration-300"
                >
                  Amankan Seat — {PRICE_EARLY_BIRD} <ArrowRight className="w-5 h-5" />
                </a>
                <p className="text-center text-xs text-slate-500 font-medium">
                  Lanjutkan ke halaman pendaftaran — dikonfirmasi tim kami via WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}