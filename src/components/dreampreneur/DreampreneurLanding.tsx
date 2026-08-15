"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { CalendarDays, CheckCircle2, Clock, MapPin, Quote, Star } from "lucide-react";
import {
  DREAMPRENEUR_THANKYOU_PATH,
  buildDreampreneurThankyouUrl,
  ensureMetaPixelQueue,
  preconnectWhatsApp,
  trackDreampreneurCtaClick,
  trackDreampreneurScroll,
  trackDreampreneurView,
} from "@/lib/dreampreneur";

const CTA_BASE =
  "inline-flex items-center justify-center gap-2.5 px-8 py-4 sm:px-10 sm:py-5 rounded-[50px] bg-gradient-to-r from-[#C2185B] to-[#6D28D9] text-white font-extrabold text-sm sm:text-[15px] uppercase tracking-wider transition-all duration-300 shadow-[0_12px_32px_-10px_rgba(147,51,234,0.65)] hover:brightness-110 hover:shadow-[0_16px_40px_-10px_rgba(192,38,211,0.7)] hover:scale-[1.02] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const CTA_SECONDARY =
  "inline-flex items-center justify-center gap-2.5 px-8 py-4 sm:px-10 sm:py-5 rounded-[50px] bg-white/10 border border-white/25 text-white font-extrabold text-sm sm:text-[15px] uppercase tracking-wider transition-all duration-300 hover:bg-white/20 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white backdrop-blur-sm";

const DP_ACCENT =
  "bg-clip-text text-transparent bg-gradient-to-r from-[#E11D8F] via-[#C026D3] to-[#8B5CF6] [filter:drop-shadow(0_5px_16px_rgba(201,42,211,0.45))]";

const EVENT_DATE = "29 Agustus 2026";
const EVENT_TIME = "11.00–17.00 WIB";
const EVENT_VENUE = "Excotel Design Hotel, Surabaya";
const EVENT_ADDRESS = "Jl. Ahmad Yani No.119, Surabaya";
const PRICE_NORMAL = "Rp250.000";
const PRICE_EARLY_BIRD = "Rp189.000";

const BENEFITS = [
  {
    title: "Learning Session with R&D",
    desc: "Pelajari proses pengembangan produk dan formula yang relevan dengan kebutuhan market.",
  },
  {
    title: "Organic Growth & Scale-Up Insight",
    desc: "Pahami strategi membangun positioning, menjangkau market, dan meningkatkan pertumbuhan brand.",
  },
  {
    title: "AI-Optimized Business Matchmaking",
    desc: "Temukan peluang koneksi dan kolaborasi yang lebih relevan untuk perkembangan bisnismu.",
  },
];

const LEARN_ITEMS = [
  {
    num: "01",
    question: "Produk apa yang punya peluang?",
    speaker: "R&D Dreamlab",
    topic:
      "Tren industri skincare, peluang kategori produk, product development, dan inovasi formula yang relevan dengan kebutuhan market.",
  },
  {
    num: "02",
    question: "Bagaimana membuat produk lebih siap dipercaya market?",
    speaker: "SIG — Kepala Operasional Uji Lab",
    topic: "Quality, testing, dan bagaimana standar produk membantu membangun trust.",
  },
  {
    num: "03",
    question: "Sudah punya produk, lalu bagaimana membangun bisnisnya?",
    speaker: "Fadhila — Senior Business Development Strategist",
    topic: "Positioning, business development, brand direction, dan growth strategy.",
  },
  {
    num: "04",
    question: "Produk sudah jadi. Bagaimana menemukan pembelinya?",
    speaker: "Revita — Digital Marketing Strategist",
    topic:
      "From Market Fit to Scale — membaca respons market, menemukan product-market fit, hingga mendorong penjualan melalui Shopee Ads, Meta CPAS, dan Performance Marketing.",
  },
];

const MENTORS = [
  { name: "Amira Alydrus", role: "Cosmetic Formulation Expert", initials: "AA" },
  { name: "Fadhila Syahab", role: "Business Development Strategist", initials: "FS" },
  { name: "Revita", role: "Digital Marketer", initials: "R" },
  { name: "Bari Noor Rahman", role: "SIG Manager Operasional", initials: "B" },
];

const EXPERIENCE_ITEMS = [
  "Product & Formula Insight",
  "Business Development Strategy",
  "Operational & Quality Insight",
  "Organic Growth & Performance Marketing",
];

const TRUST_ITEMS = ["Limited seats", "Learning + Networking", "Industry practitioners"];

export default function DreampreneurLanding() {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    ensureMetaPixelQueue();
    preconnectWhatsApp();
    trackDreampreneurView();
    const onScroll = () => setShowSticky(window.scrollY > 560);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToMentors = () => {
    trackDreampreneurScroll("hero_meet_mentors");
    document.getElementById("mentors")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    e.preventDefault();
    trackDreampreneurCtaClick(label);
    window.location.assign(buildDreampreneurThankyouUrl());
  };

  return (
    <div
      className="landing-page-ads min-h-screen bg-[#F7F1FC] text-brand-black font-sans selection:bg-[#C026D3] selection:text-white pb-24 md:pb-0"
      style={
        {
          "--dream-orange": "#E11D8F",
          "--dream-dark": "#310A52",
          "--dream-green": "#7C3AED",
          "--dream-black": "#2B0643",
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
          .landing-page-ads h1 { font-size: 38px !important; line-height: 1.1 !important; }
          .landing-page-ads h2 { font-size: 28px !important; line-height: 1.15 !important; }
        }
      `}</style>

      {/* ============ MOBILE STICKY CTA ============ */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 md:hidden transition-transform duration-300 ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-[#F7F1FC]/95 backdrop-blur border-t border-[#E4D8F4] pt-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(109,40,217,0.25)]">
          <a
            href={DREAMPRENEUR_THANKYOU_PATH}
            onClick={(e) => handleRegisterClick(e, "sticky_daftar_sekarang")}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#C2185B] to-[#6D28D9] text-white font-extrabold text-sm uppercase tracking-wider py-4 shadow-[0_12px_30px_-8px_rgba(147,51,234,0.7)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6D28D9]"
            aria-label="Daftar Dreampreneur Batch 2 — Rp189K"
          >
            Daftar Sekarang — Rp189K
          </a>
          <p className="text-center text-[10px] font-bold text-neutral-500 mt-1.5">
            Early Bird {PRICE_EARLY_BIRD} · Seat terbatas
          </p>
        </div>
      </div>

      {/* ============ 1. HERO ============ */}
      <section className="relative overflow-hidden bg-brand-black text-white">
        <div className="pointer-events-none absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-[#E11D8F]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 w-[26rem] h-[26rem] rounded-full bg-[#8B5CF6]/30 blur-3xl" />
        <div className="pointer-events-none absolute -top-16 left-1/3 w-[20rem] h-[20rem] rounded-full bg-[#C026D3]/20 blur-3xl" />

        <div className="container-custom relative py-16 md:py-24 lg:py-28">
          <div className="max-w-3xl mx-auto text-center space-y-7">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#F472B6] animate-pulse" />
              <span className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-white uppercase">
                Dreampreneur Batch 2 — Beauty Academy
              </span>
            </div>

            <h1 className="text-[34px] sm:text-4xl lg:text-[46px] font-black tracking-tight leading-[1.1] uppercase font-display text-white [text-shadow:0_8px_40px_rgba(201,42,211,0.35)]">
              Mau Mulai Beauty Brand, Tapi <span className={DP_ACCENT}>Bingung Mulai</span> dari Mana?
            </h1>

            <h2 className="text-xl sm:text-2xl lg:text-[28px] font-extrabold text-white/90 leading-snug uppercase font-display [text-shadow:0_4px_24px_rgba(139,92,246,0.4)]">
              Atau Sudah Punya Brand, Tapi <span className="text-white/60">Growth-nya Masih Stuck?</span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
              A Growth &amp; Networking Session for Future Beautypreneurs. Satu hari untuk memahami
              formula, strategi bisnis, growth marketing, dan peluang kolaborasi agar beauty brand
              lebih siap bertumbuh.
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-1">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-white/85 bg-white/10 border border-white/15 rounded-full px-4 py-2">
                <CalendarDays className="w-4 h-4 text-[#F472B6]" /> {EVENT_DATE}
              </span>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-white/85 bg-white/10 border border-white/15 rounded-full px-4 py-2">
                <Clock className="w-4 h-4 text-[#F472B6]" /> {EVENT_TIME}
              </span>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-white/85 bg-white/10 border border-white/15 rounded-full px-4 py-2">
                <MapPin className="w-4 h-4 text-[#F472B6]" /> {EVENT_VENUE}
              </span>
            </div>

            <div className="flex items-baseline justify-center gap-3 pt-1">
              <span className="text-lg text-white/40 line-through">{PRICE_NORMAL}</span>
              <span className="text-4xl sm:text-5xl font-black text-[#F9A8D4] font-display tracking-tight">
                {PRICE_EARLY_BIRD}
              </span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <a
                href={DREAMPRENEUR_THANKYOU_PATH}
                onClick={(e) => handleRegisterClick(e, "hero_cta")}
                className={CTA_BASE}
              >
                Daftar Dreampreneur — {PRICE_EARLY_BIRD}
              </a>
              <button type="button" onClick={scrollToMentors} className={CTA_SECONDARY}>
                Meet Our Mentors
              </button>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
              {TRUST_ITEMS.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 text-xs font-bold text-white/80 bg-white/10 border border-white/15 rounded-full px-4 py-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#F472B6]" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. WHAT YOU'LL GET ============ */}
      <section className="py-16 md:py-20 bg-white" aria-labelledby="what-youll-get">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-10 md:mb-12">
            <h2 id="what-youll-get" className="text-3xl md:text-[38px] font-black tracking-tight leading-[1.1] uppercase font-display">
              What You&apos;ll <span className={DP_ACCENT}>Get</span>
            </h2>
            <p className="text-sm md:text-base text-neutral-500 leading-relaxed">
              Tiga bekal utama untuk membangun beauty brand yang lebih siap bertumbuh.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 lg:gap-7 max-w-4xl mx-auto">
            {BENEFITS.map((b, i) => (
              <div
                key={b.title}
                className="rounded-3xl bg-[#F8F4FF] border border-neutral-100 p-7 md:p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E11D8F] to-[#7C3AED] text-white font-black text-lg">
                  {i + 1}
                </span>
                <h3 className="text-base md:text-lg font-black uppercase tracking-wide font-display leading-snug">
                  {b.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 2b. THE ANSWER — QUESTIONS WE'LL UNPACK ============ */}
      <section className="py-16 md:py-20 bg-[#F8F4FF]" aria-labelledby="the-answer">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-10 md:mb-12">
            <h2 id="the-answer" className="text-3xl md:text-[38px] font-black tracking-tight leading-[1.1] uppercase font-display">
              Bukan Teori. Kita Bedah Hal yang <span className={DP_ACCENT}>Akan Kamu Hadapi di Market.</span>
            </h2>
            <p className="text-sm md:text-base text-neutral-500 leading-relaxed">
              Empat pertanyaan yang akan terjawab dalam satu hari bersama praktisi industri.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 lg:gap-6 max-w-4xl mx-auto">
            {LEARN_ITEMS.map((item) => (
              <div
                key={item.num}
                className="rounded-3xl bg-white border border-neutral-100 p-7 md:p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <span className="inline-flex items-center gap-2 text-xs font-black text-[#7C3AED] uppercase tracking-widest">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E11D8F] to-[#7C3AED] text-white flex items-center justify-center text-sm">
                    {item.num}
                  </span>
                  {item.speaker}
                </span>
                <h3 className="text-base md:text-lg font-black uppercase tracking-wide font-display leading-snug text-brand-black">
                  {item.question}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{item.topic}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 3. MEET OUR MENTORS ============ */}
      <section id="mentors" className="py-16 md:py-20 bg-brand-black text-white relative overflow-hidden scroll-mt-6" aria-labelledby="meet-mentors">
        <div className="pointer-events-none absolute -top-24 -right-24 w-[24rem] h-[24rem] rounded-full bg-[#E11D8F]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-[24rem] h-[24rem] rounded-full bg-[#8B5CF6]/15 blur-3xl" />

        <div className="container-custom relative">
          <div className="max-w-2xl text-center mx-auto space-y-3 mb-10 md:mb-12">
            <h2 id="meet-mentors" className="text-3xl md:text-[38px] font-black tracking-tight leading-[1.1] uppercase font-display text-white">
              Meet Our <span className={DP_ACCENT}>Mentors</span>
            </h2>
            <p className="text-sm md:text-base text-white/70 leading-relaxed">
              Belajar langsung dari praktisi yang menangani formula, pengembangan bisnis, operasional, dan digital marketing.
            </p>
          </div>

          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-center">
            <div className="relative max-w-xs mx-auto w-full lg:max-w-none">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#E11D8F]/25 via-transparent to-[#8B5CF6]/25 blur-2xl rounded-[40px]" />
              <div className="relative rounded-[24px] overflow-hidden border border-white/15 shadow-[0_20px_60px_-20px_rgba(109,40,217,0.55)]">
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
                <li key={m.name} className="flex items-center gap-4 rounded-2xl bg-white/5 border border-white/10 p-4 md:p-5 hover:bg-white/10 transition-colors">
                  <span
                    aria-hidden="true"
                    className="shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-[#E11D8F] to-[#7C3AED] flex items-center justify-center text-white font-black text-lg shadow-[0_8px_24px_-8px_rgba(201,42,211,0.7)]"
                  >
                    {m.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm md:text-base font-black text-white font-display uppercase tracking-wide leading-tight">
                      {m.name}
                    </span>
                    <span className="block text-xs md:text-[13px] text-white/60 font-medium mt-1 leading-snug">
                      {m.role}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ 4. EVENT EXPERIENCE ============ */}
      <section className="py-16 md:py-20 bg-white" aria-labelledby="event-experience">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-10 md:mb-12">
            <h2 id="event-experience" className="text-3xl md:text-[38px] font-black tracking-tight leading-[1.1] uppercase font-display">
              Event <span className={DP_ACCENT}>Experience</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-5xl mx-auto">
            {EXPERIENCE_ITEMS.map((item) => (
              <div key={item} className="rounded-2xl bg-[#F8F4FF] border border-neutral-100 p-6 text-center space-y-3">
                <CheckCircle2 className="w-6 h-6 text-[#7C3AED] mx-auto" />
                <p className="text-sm md:text-[15px] font-bold text-brand-black leading-snug">{item}</p>
              </div>
            ))}
          </div>

          <p className="max-w-2xl mx-auto text-center text-sm md:text-base text-neutral-500 leading-relaxed mt-8">
            Bukan hanya belajar teori. Kamu akan melihat beauty business dari sisi produk, market, operasional, dan pertumbuhan.
          </p>
        </div>
      </section>

      {/* ============ 5. SOCIAL PROOF ============ */}
      <section className="py-16 md:py-20 bg-[#F8F4FF]" aria-labelledby="social-proof">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-10 md:mb-12">
            <h2 id="social-proof" className="text-3xl md:text-[38px] font-black tracking-tight leading-[1.1] uppercase font-display">
              See What Happened at <span className={DP_ACCENT}>Dreampreneur</span>
            </h2>
            <p className="text-sm md:text-base text-neutral-500 leading-relaxed">
              Sesi belajar, diskusi, dan networking bersama para beautypreneur dan praktisi industri.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <figure className="rounded-3xl overflow-hidden shadow-lg border border-neutral-100">
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
            <p className="text-center text-xs text-neutral-400 font-medium mt-3">
              Cuplikan sesi Dreampreneur Academy oleh Dreamlab — diskusi langsung bersama praktisi industri.
            </p>
          </div>

          <div className="max-w-2xl mx-auto rounded-3xl bg-gradient-to-br from-[#F4EEFD] to-[#FCE9FA] border border-brand-orange/20 p-7 md:p-9 shadow-lg shadow-[#C026D3]/10">
            <Quote className="w-8 h-8 text-brand-orange mb-4" fill="currentColor" strokeWidth={0} />
            <blockquote className="text-[15px] md:text-lg font-medium text-brand-black leading-relaxed">
              &ldquo;Aku sempat ragu memulai, tapi mengikuti batch pertama Dreampreneur membuka mata aku bahwa membangun brand itu soal keberanian, bukan sekadar teori. Dari sanalah aku akhirnya memberanikan diri membangun brand parfum sendiri dengan konsep yang inovatif — dan merasa lebih siap menghadapi langkah berikutnya.&rdquo;
            </blockquote>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E11D8F] to-[#7C3AED] flex items-center justify-center text-white font-black text-lg">
                E
              </div>
              <div>
                <p className="font-black text-brand-black text-sm md:text-base font-display">Kak Eki</p>
                <p className="text-xs md:text-sm text-[#5B21B6] font-semibold">Peserta Batch 1 · Founder Brand Parfum</p>
              </div>
              <div className="ml-auto flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-brand-orange" fill="currentColor" strokeWidth={0} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 6. EVENT DETAILS & TICKET ============ */}
      <section className="py-16 md:py-20 bg-white" aria-labelledby="event-details">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-10 md:mb-12">
            <h2 id="event-details" className="text-3xl md:text-[38px] font-black tracking-tight leading-[1.1] uppercase font-display">
              Details &amp; <span className={DP_ACCENT}>Ticket</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            <div className="rounded-3xl bg-[#F8F4FF] border border-neutral-100 p-7 md:p-9 space-y-5">
              <div className="flex items-start gap-4">
                <span className="w-11 h-11 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-5 h-5 text-[#7C3AED]" />
                </span>
                <div>
                  <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">Tanggal</p>
                  <p className="text-sm md:text-[15px] font-bold text-brand-black">{EVENT_DATE}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-11 h-11 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#7C3AED]" />
                </span>
                <div>
                  <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">Waktu</p>
                  <p className="text-sm md:text-[15px] font-bold text-brand-black">{EVENT_TIME}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-11 h-11 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#7C3AED]" />
                </span>
                <div>
                  <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">Lokasi</p>
                  <p className="text-sm md:text-[15px] font-bold text-brand-black">{EVENT_VENUE}</p>
                  <p className="text-xs text-neutral-500 font-medium mt-1">{EVENT_ADDRESS}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-brand-black text-white p-7 md:p-9 flex flex-col justify-between shadow-xl">
              <div className="space-y-5">
                <p className="w-fit rounded-full bg-[#E11D8F] px-4 py-1.5 text-[10px] md:text-xs font-black text-white uppercase tracking-widest">
                  Early Bird
                </p>
                <div className="space-y-1">
                  <p className="text-lg text-white/50 line-through">{PRICE_NORMAL}</p>
                  <p className="text-[40px] md:text-5xl font-black text-[#F9A8D4] font-display tracking-tight">
                    {PRICE_EARLY_BIRD}
                  </p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <p className="text-base md:text-lg font-black uppercase font-display tracking-tight leading-snug text-white">
                  Seat terbatas.
                </p>
                <a
                  href={DREAMPRENEUR_THANKYOU_PATH}
                  onClick={(e) => handleRegisterClick(e, "offer_cta")}
                  className={`${CTA_BASE} w-full`}
                >
                  Daftar Dreampreneur — {PRICE_EARLY_BIRD}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 7. REGISTRATION — Direct WhatsApp CTA ============ */}
      <section className="py-16 md:py-20 bg-[#F8F4FF]" aria-labelledby="join-title">
        <div className="container-custom">
          <div className="max-w-xl mx-auto rounded-[28px] bg-white border border-[#E4D8F4] p-8 sm:p-10 text-center shadow-[0_18px_50px_rgba(0,0,0,0.06)] space-y-6">
            <h2 id="join-title" className="text-3xl md:text-[38px] font-black tracking-tight leading-[1.1] uppercase font-display">
              Siap Jadi Bagian dari <span className={DP_ACCENT}>Dreampreneur?</span>
            </h2>
            <p className="text-sm md:text-base text-neutral-500 leading-relaxed">
              Amankan seat kamu dan lanjutkan pendaftaran langsung bersama tim Dreampreneur melalui WhatsApp.
            </p>
            <a
              href={DREAMPRENEUR_THANKYOU_PATH}
              onClick={(e) => handleRegisterClick(e, "register_cta")}
              className={`${CTA_BASE} w-full`}
            >
              Daftar Dreampreneur — {PRICE_EARLY_BIRD}
            </a>
            <p className="text-xs font-bold text-neutral-500">
              Early Bird {PRICE_EARLY_BIRD} · Seat terbatas
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
