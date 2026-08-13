"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Quote,
  Rocket,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { ATTRIBUTION_PARAMS } from "@/lib/lead-routing";

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const CTA_BASE =
  "inline-flex items-center justify-center gap-2.5 px-8 py-4 sm:px-10 sm:py-5 rounded-[50px] bg-gradient-to-r from-[#C2185B] to-[#6D28D9] text-white font-extrabold text-sm sm:text-[15px] uppercase tracking-wider transition-all duration-300 shadow-[0_12px_32px_-10px_rgba(147,51,234,0.65)] hover:brightness-110 hover:shadow-[0_16px_40px_-10px_rgba(192,38,211,0.7)] hover:scale-[1.02] active:scale-95";

const DP_ACCENT =
  "bg-clip-text text-transparent bg-gradient-to-r from-[#E11D8F] via-[#C026D3] to-[#8B5CF6] [filter:drop-shadow(0_5px_16px_rgba(201,42,211,0.45))]";

const EVENT_DATE = "29 Agustus 2026";
const EVENT_TIME = "11.00 – 17.00 WIB";
const EVENT_VENUE = "Excotel Design Hotel, Surabaya";

const TRUST_ITEMS = ["Limited seats", "Learning + Networking", "Industry practitioners"];

const PROBLEMS = [
  {
    text: "Formula bagus + salah market",
    result: "produk sulit dijual",
  },
  {
    text: "Market ada + positioning tidak jelas",
    result: "brand sulit dibedakan",
  },
  {
    text: "Traffic ada + belum market fit",
    result: "ads makin mahal",
  },
  {
    text: "Sales ada + tidak punya growth strategy",
    result: "sulit scale",
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

const WHY_ATTEND = [
  {
    title: "SALAH PRODUK",
    desc: "Stok sulit bergerak.",
  },
  {
    title: "SALAH MARKET",
    desc: "Komunikasi tidak nyambung.",
  },
  {
    title: "SALAH STRATEGI",
    desc: "Ads terus jalan tapi tidak tahu apa yang harus diperbaiki.",
  },
];

const EXPERIENCE = [
  "Business Networking",
  "Beautypreneur Community",
  "Industry Expert Discussion",
  "Practical Learning",
  "Collaboration Opportunities",
  "Business Connection",
];

const OFFER_ITEMS = [
  "Product Development",
  "Quality & Testing",
  "Business Strategy",
  "Performance Marketing",
  "Networking Session",
];

const OBJECTIONS = [
  {
    q: "“Saya belum punya brand.”",
    a: "Justru cocok. Dreampreneur membantumu memahami market dan proses membangun beauty business sebelum mengeluarkan budget lebih jauh.",
  },
  {
    q: "“Saya sudah punya brand.”",
    a: "Materinya tidak berhenti di cara memulai. Kita juga membahas positioning, product-market fit, acquisition, dan scale.",
  },
  {
    q: "“Saya bukan orang beauty.”",
    a: "Kamu tidak harus menjadi formulator. Kamu datang untuk memahami bagaimana produk, bisnis, dan market bekerja bersama.",
  },
];

const FAQS = [
  {
    q: "Apakah seat bisa di-refund?",
    a: "Seat bersifat terbatas dan non-refundable. Kamu bisa transfer seat ke orang lain jika tidak bisa hadir — hubungi tim Dreamlab untuk pengalihan.",
  },
  {
    q: "Materi apa saja yang akan dibahas?",
    a: "Empat pilar: Product Opportunity & Development, Quality & Testing, Business Strategy, dan Market Fit to Scale (perfomancy marketing).",
  },
  {
    q: "Apakah ada sertifikat?",
    a: "Ya, peserta mendapatkan sertifikat partisipasi resmi dari Dreamlab.",
  },
];

const w = () => window as any;

function pushDataEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  (w().dataLayer = w().dataLayer || []).push({
    event: name,
    page: window.location.pathname,
    campaign: "dreampreneur-vol-2",
    ...params,
  });
}
function gtagEvent(name: string, params: Record<string, unknown>) {
  if (typeof w().gtag === "function") w().gtag("event", name, params);
}
function fbqEvent(name: string, params?: Record<string, unknown>) {
  if (typeof w().fbq === "function") w().fbq("track", name, params);
}
function fbqCustom(name: string, params: Record<string, unknown>) {
  if (typeof w().fbq === "function") w().fbq("trackCustom", name, params);
}
function ttqEvent(name: string, params: Record<string, unknown>) {
  if (w().ttq && typeof w().ttq.track === "function") w().ttq.track(name, params);
}

function trackView() {
  const base = { page: window.location.pathname, campaign: "dreampreneur-vol-2" };
  pushDataEvent("view_content", base);
  gtagEvent("view_content", base);
  fbqEvent("ViewContent", base);
  ttqEvent("view_content", base);
}

function trackCta(label: string) {
  const base = { cta_label: label, campaign: "dreampreneur-vol-2" };
  pushDataEvent("cta_click", base);
  gtagEvent("cta_click", base);
  fbqEvent("AddToCart", { content_name: label, content_category: "Landing Page Dreampreneur Vol 2" });
  ttqEvent("cta_click", base);
}

function trackFormStart() {
  const base = { form_name: "dreampreneur_registration", campaign: "dreampreneur-vol-2" };
  pushDataEvent("form_start", base);
  gtagEvent("form_start", base);
  fbqEvent("InitiateCheckout", base);
}

function trackFormSubmit(fields: Record<string, string>) {
  const base = {
    form_name: "dreampreneur_registration",
    cta_label: "RESERVE MY SEAT",
    campaign: "dreampreneur-vol-2",
    form_fields: fields,
  };
  pushDataEvent("form_submit", base);
  gtagEvent("form_submit", base);
  fbqCustom("DreampreneurSubmit", base);
  ttqEvent("form_submit", base);
}

function isValidWhatsApp(value: string): boolean {
  const cleaned = value.replace(/[\s\-().]/g, "");
  return /^(\+?62|0)?8\d{8,11}$/.test(cleaned);
}

export default function DreampreneurLanding() {
  const [registerId] = useState("register");
  const [showSticky, setShowSticky] = useState(false);

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState("");
  const [brand, setBrand] = useState("");
  const [errors, setErrors] = useState<{ name?: string; whatsapp?: string; status?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    trackView();
    const onScroll = () => setShowSticky(window.scrollY > 560);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToRegister = useCallback(
    (label: string) => {
      trackCta(label);
      document.getElementById(registerId)?.scrollIntoView({ behavior: "smooth" });
    },
    [registerId],
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = "Nama wajib diisi.";
    if (!isValidWhatsApp(whatsapp)) errs.whatsapp = "Nomor WhatsApp tidak valid.";
    if (!status) errs.status = "Pilih status kamu dulu.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    const fields = { name: name.trim(), whatsapp: whatsapp.trim(), status, brand: brand.trim() || "—" };
    trackFormSubmit(fields);

    const lines = [
      "Saya mau reservasi seat Dreampreneur Vol. 2.",
      `Nama: ${name.trim()}`,
      `WhatsApp: ${whatsapp.trim()}`,
      `Status: ${status}`,
      brand.trim() ? `Brand: ${brand.trim()}` : null,
    ].filter(Boolean).join("\n");

    const params = new URLSearchParams();
    params.set("source", "dreampreneur");
    params.set("msg", lines);
    const cur = new URLSearchParams(window.location.search);
    for (const key of ATTRIBUTION_PARAMS) {
      const val = cur.get(key);
      if (val) params.set(key, val);
    }
    window.location.assign(`/dreampreneur-batch-2/thankyou/?${params.toString()}`);
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
          .landing-page-ads h1 { font-size: 40px !important; }
          .landing-page-ads h2 { font-size: 30px !important; }
        }
      `}</style>
      {/* ============ STICKY MOBILE CTA ============ */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 md:hidden transition-transform duration-300 ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-[#F7F1FC]/95 backdrop-blur border-t border-[#E4D8F4] pt-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(109,40,217,0.25)]">
          <button
            type="button"
            onClick={() => scrollToRegister("sticky_amankan_seat")}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#C2185B] to-[#6D28D9] text-white font-extrabold text-sm uppercase tracking-wider py-4 shadow-[0_12px_30px_-8px_rgba(147,51,234,0.7)] active:scale-[0.98]"
            aria-label="Amankan seat Dreampreneur Vol. 2"
          >
            AMANKAN SEAT
          </button>
          <p className="text-center text-[10px] font-bold text-neutral-500 mt-1.5">Rp149.000 · Tinggal 7 seat lagi</p>
        </div>
      </div>

      {/* ============ SECTION 1 — HERO ============ */}
      <section className="relative overflow-hidden bg-brand-black text-white">
        <div className="pointer-events-none absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-[#E11D8F]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 w-[26rem] h-[26rem] rounded-full bg-[#8B5CF6]/30 blur-3xl" />
        <div className="pointer-events-none absolute -top-16 left-1/3 w-[20rem] h-[20rem] rounded-full bg-[#C026D3]/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "64px 64px" }} />

        <motion.div className="container-custom relative py-20 md:py-28 lg:py-36" initial="hidden" animate="visible" variants={stagger}>
          <motion.div className="max-w-3xl space-y-7" variants={fadeUp}>
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#F472B6] animate-pulse" />
              <span className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-white uppercase">Dreampreneur Vol. 2</span>
            </div>

            <h1 className="text-[38px] sm:text-5xl lg:text-[64px] font-black tracking-tight leading-[1.05] uppercase font-display text-white ![font-weight:800] [text-shadow:0_8px_40px_rgba(201,42,211,0.35)]">
              Mau Mulai Beauty Brand, Tapi <span className={DP_ACCENT}>Bingung Mulai</span> dari Mana?
            </h1>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white/90 leading-snug uppercase font-display [text-shadow:0_4px_24px_rgba(139,92,246,0.4)]">
              Atau Sudah Punya Brand, Tapi Growth-nya Masih Stuck?
            </h2>

            <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl">
              Dreampreneur membantumu memahami apa yang sering tidak terlihat saat membangun beauty brand — mulai dari memilih produk, menemukan market, membangun positioning, sampai mengubah marketing menjadi sales.
            </p>

            <div className="pt-2 space-y-3">
              <button type="button" onClick={() => scrollToRegister("hero_cta")} className={CTA_BASE}>
                Saya Mau Ikut Dreampreneur
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-white/50 font-medium">Untuk aspiring beautypreneur &amp; existing brand owner.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {TRUST_ITEMS.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 text-xs font-bold text-white/80 bg-white/10 border border-white/15 rounded-full px-4 py-2">
                  <BadgeCheck className="w-4 h-4 text-brand-orange" />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============ SECTION 2 — AUDIENCE SELF-IDENTIFICATION ============ */}
      <motion.section
        className="py-16 md:py-24 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
      >
        <div className="container-custom">
          <motion.div className="max-w-2xl mx-auto text-center space-y-4 mb-12 md:mb-16" variants={fadeUp}>
            <h2 className="text-3xl md:text-[44px] font-black tracking-tight leading-[1.1] uppercase font-display">
              Kamu Lagi Ada di <span className={DP_ACCENT}>Fase Mana?</span>
            </h2>
            <p className="text-sm md:text-base text-neutral-500 leading-relaxed">
              Pilih perjalananmu — dan lihat apa yang akan kita bedah di Dreampreneur Vol. 2.
            </p>
          </motion.div>

          <motion.div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto" variants={stagger}>
            <motion.div
              className="rounded-3xl p-8 md:p-10 bg-[#F4EEFD] border border-brand-orange/20 space-y-5 flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300"
              variants={fadeUp}
            >
              <Rocket className="w-9 h-9 text-brand-orange" />
              <h3 className="text-xl md:text-2xl font-black uppercase font-display tracking-tight">Saya Mau Mulai Brand</h3>
              <ul className="space-y-3">
                {[
                  "Produk apa yang sebaiknya saya buat?",
                  "Market saya sebenarnya siapa?",
                  "Budget sebaiknya dipakai untuk apa dulu?",
                  "Bagaimana supaya tidak launching asal-asalan?",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-neutral-600 leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Dreampreneur membantumu melihat beauty business dari market sampai produk sebelum mengambil langkah pertama.
              </p>
              <button type="button" onClick={() => scrollToRegister("fase_mulai_brand")} className={`${CTA_BASE} mt-auto`}>
                Saya Mau Mulai Brand
              </button>
            </motion.div>

            <motion.div
              className="rounded-3xl p-8 md:p-10 bg-brand-black text-white space-y-5 flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300"
              variants={fadeUp}
            >
              <TrendingUp className="w-9 h-9 text-brand-orange" />
              <h3 className="text-xl md:text-2xl font-black uppercase font-display tracking-tight text-white">Saya Sudah Punya Brand</h3>
              <ul className="space-y-3">
                {[
                  "Kenapa sales sulit naik?",
                  "Produk saya sudah market fit atau belum?",
                  "Harus tambah produk atau memperbaiki marketing?",
                  "Ads sudah jalan, tapi bagaimana cara scale?",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-white/70 leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-white/60 leading-relaxed">
                Dreampreneur membantumu melihat apa yang perlu diperbaiki sebelum mengeluarkan lebih banyak budget untuk growth.
              </p>
              <button type="button" onClick={() => scrollToRegister("fase_punya_brand")} className={`${CTA_BASE} mt-auto`}>
                Saya Mau Scale Brand
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ============ SECTION 3 — CORE BUSINESS PROBLEM ============ */}
      <motion.section
        className="py-16 md:py-24 bg-[#F8F4FF]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
      >
        <div className="container-custom">
          <motion.div className="max-w-3xl mx-auto text-center space-y-4 mb-12 md:mb-16" variants={fadeUp}>
            <h2 className="text-3xl md:text-[44px] font-black tracking-tight leading-[1.1] uppercase font-display">
              Produk Bagus Saja <span className={DP_ACCENT}>Belum Cukup</span> untuk Membangun Winning Brand.
            </h2>
          </motion.div>

          <motion.div className="grid sm:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto" variants={stagger}>
            {PROBLEMS.map((p) => (
              <motion.div key={p.text} className="rounded-2xl bg-white border border-neutral-100 p-6 md:p-7 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-2" variants={fadeUp}>
                <p className="font-bold text-brand-black text-sm md:text-base">{p.text}</p>
                <p className="flex items-center gap-2 text-[#5B21B6] font-extrabold text-sm md:text-base uppercase tracking-wide">
                  <ArrowRight className="w-4 h-4" />
                  {p.result}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto mt-12 rounded-3xl bg-brand-black text-white p-8 md:p-12 text-center shadow-xl"
            variants={fadeUp}
          >
            <p className="text-[11px] md:text-xs font-bold tracking-[0.3em] text-brand-orange uppercase">Framework</p>
            <p className="text-3xl md:text-[44px] font-black tracking-tight uppercase font-display mt-3">
              Product × Market × Brand × Marketing
            </p>
            <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-xl mx-auto mt-4">
              Empat hal ini harus saling terhubung.
            </p>
            <p className="text-sm md:text-base text-brand-orange font-bold mt-1">
              Dan itu yang akan kita bedah di Dreampreneur Vol. 2.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* ============ SECTION 4 — TRANSFORMATION ============ */}
      <motion.section
        className="py-16 md:py-24 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
      >
        <div className="container-custom">
          <motion.div className="max-w-2xl mx-auto text-center space-y-4 mb-12 md:mb-16" variants={fadeUp}>
            <h2 className="text-3xl md:text-[44px] font-black tracking-tight leading-[1.1] uppercase font-display">
              Dari Bingung → <span className={DP_ACCENT}>Punya Arah yang Lebih Jelas.</span>
            </h2>
          </motion.div>

          <motion.div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto" variants={stagger}>
            <motion.div className="rounded-3xl border border-neutral-100 bg-[#F8F4FF] p-7 md:p-9 space-y-5 shadow-sm" variants={fadeUp}>
              <h3 className="text-lg font-black uppercase tracking-wide font-display flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-orange" />
                New Beautypreneur
              </h3>
              <div className="rounded-2xl bg-white border border-neutral-200 p-5 space-y-1">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Before</p>
                <p className="text-sm text-neutral-500 italic">“Aku mau bikin skincare, tapi bikin apa?”</p>
              </div>
              <div className="rounded-2xl bg-brand-black text-white p-5 space-y-3">
                <p className="text-[10px] font-bold text-brand-orange uppercase tracking-widest">After</p>
                <p className="text-sm text-white/80">Memahami cara melihat:</p>
                <p className="text-base font-black uppercase font-display leading-snug tracking-tight">
                  Market → Opportunity → Product → Positioning
                </p>
                <p className="text-xs text-white/50">sebelum membangun brand.</p>
              </div>
            </motion.div>

            <motion.div className="rounded-3xl border border-neutral-100 bg-[#F8F4FF] p-7 md:p-9 space-y-5 shadow-sm" variants={fadeUp}>
              <h3 className="text-lg font-black uppercase tracking-wide font-display flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-orange" />
                Existing Brand Owner
              </h3>
              <div className="rounded-2xl bg-white border border-neutral-200 p-5 space-y-1">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Before</p>
                <p className="text-sm text-neutral-500 italic">“Sudah jualan, tapi kenapa susah scale?”</p>
              </div>
              <div className="rounded-2xl bg-brand-black text-white p-5 space-y-3">
                <p className="text-[10px] font-bold text-brand-orange uppercase tracking-widest">After</p>
                <p className="text-sm text-white/80">Memahami cara mengevaluasi:</p>
                <p className="text-base font-black uppercase font-display leading-snug tracking-tight">
                  Market Fit → Positioning → Acquisition → Scale
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ============ SECTION 5 — WHAT THEY WILL LEARN ============ */}
      <motion.section
        className="py-16 md:py-24 bg-[#F8F4FF]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
      >
        <div className="container-custom">
          <motion.div className="max-w-3xl mx-auto text-center space-y-4 mb-12 md:mb-16" variants={fadeUp}>
            <h2 className="text-3xl md:text-[44px] font-black tracking-tight leading-[1.1] uppercase font-display">
              Bukan Teori. Kita Bedah Hal yang <span className={DP_ACCENT}>Akan Kamu Hadapi di Market.</span>
            </h2>
          </motion.div>

          <motion.div className="grid md:grid-cols-2 gap-6" variants={stagger}>
            {LEARN_ITEMS.map((item) => (
              <motion.div key={item.num} className="rounded-3xl bg-white border border-neutral-100 p-7 md:p-9 shadow-sm hover:shadow-lg transition-shadow duration-300 space-y-4" variants={fadeUp}>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-orange/10 text-brand-orange font-black text-lg">{item.num}</span>
                  <CheckCircle2 className="w-6 h-6 text-[#5B21B6]" />
                </div>
                <h3 className="text-lg md:text-xl font-black uppercase font-display tracking-tight leading-snug">{item.question}</h3>
                <p className="text-xs md:text-sm font-bold text-[#5B21B6] uppercase tracking-wide">Speaker: {item.speaker}</p>
                <p className="text-sm text-neutral-600 leading-relaxed">{item.topic}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ============ SECTION 6 — WHY ATTEND ============ */}
      <motion.section
        className="py-16 md:py-24 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
      >
        <div className="container-custom">
          <motion.div className="max-w-3xl mx-auto text-center space-y-4 mb-12 md:mb-16" variants={fadeUp}>
            <h2 className="text-3xl md:text-[44px] font-black tracking-tight leading-[1.1] uppercase font-display">
              Jangan Habiskan Budget Hanya untuk <span className={DP_ACCENT}>Trial &amp; Error.</span>
            </h2>
          </motion.div>

          <motion.div className="grid sm:grid-cols-3 gap-5 md:gap-6 max-w-4xl mx-auto" variants={stagger}>
            {WHY_ATTEND.map((item) => (
              <motion.div key={item.title} className="rounded-2xl border border-neutral-100 bg-[#F8F4FF] p-6 md:p-7 text-center space-y-2" variants={fadeUp}>
                <h3 className="text-sm md:text-base font-black text-[#5B21B6] uppercase tracking-wider font-display">{item.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="max-w-3xl mx-auto mt-10 text-center space-y-3" variants={fadeUp}>
            <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
              Dreampreneur memberikan perspektif dari:
            </p>
            <p className="text-base md:text-xl font-black uppercase font-display tracking-tight">
              Product Development + Quality + Business + Marketing
            </p>
            <p className="text-sm text-neutral-500">dalam satu sesi.</p>
            <div className="pt-4">
              <button type="button" onClick={() => scrollToRegister("why_attend_cta")} className={CTA_BASE}>
                Amankan Seat Saya
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ============ SECTION 7 — EVENT EXPERIENCE ============ */}
      <motion.section
        className="py-16 md:py-24 bg-brand-black text-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
      >
        <div className="pointer-events-none absolute -top-24 -left-24 w-[24rem] h-[24rem] rounded-full bg-brand-orange/10 blur-3xl" />
        <div className="container-custom relative">
          <motion.div className="max-w-2xl space-y-4 mb-12 md:mb-16" variants={fadeUp}>
            <h2 className="text-3xl md:text-[44px] font-black tracking-tight leading-[1.1] uppercase font-display text-white">
              More Than Just <span className={DP_ACCENT}>a Class.</span>
            </h2>
            <p className="text-sm md:text-base text-white/70 leading-relaxed">
              Meet beautypreneurs, creators, business owners, and industry practitioners who are building their next move.
            </p>
          </motion.div>

          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" variants={stagger}>
            {EXPERIENCE.map((item) => (
              <motion.div key={item} className="rounded-2xl bg-white/5 border border-white/10 p-6 flex items-center gap-3 transition-colors hover:bg-white/10" variants={fadeUp}>
                <BadgeCheck className="w-5 h-5 text-brand-orange shrink-0" />
                <span className="text-sm font-bold text-white">{item}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="mt-12 rounded-3xl bg-brand-orange text-brand-black p-8 md:p-10 text-center" variants={fadeUp}>
            <p className="text-lg md:text-2xl font-black uppercase font-display tracking-tight leading-snug">
              You might come for the knowledge and leave with your next connection.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* ============ SECTION 8 — SOCIAL PROOF ============ */}
      <motion.section
        className="py-16 md:py-24 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
      >
        <div className="container-custom">
          <motion.div className="max-w-3xl mx-auto text-center space-y-4 mb-10 md:mb-14" variants={fadeUp}>
            <h2 className="text-3xl md:text-[44px] font-black tracking-tight leading-[1.1] uppercase font-display">
              See What Happened at <span className={DP_ACCENT}>Dreampreneur.</span>
            </h2>
            <p className="text-sm md:text-base text-neutral-500 leading-relaxed">
              Networking, insight praktisi industri, dan sesi belajar bersama yang kembali hadir di Vol. 2.
            </p>
          </motion.div>

          <motion.div className="max-w-4xl mx-auto space-y-6" variants={fadeUp}>
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
            <figcaption className="text-center text-xs text-neutral-400 font-medium">
              Cuplikan sesi Dreampreneur Academy oleh Dreamlab — diskusi langsung bersama praktisi industri.
            </figcaption>
            <p className="text-center text-[15px] md:text-base text-neutral-600 leading-relaxed italic max-w-2xl mx-auto">
              Ya, suasana belajar dan networking itu akan kembali — dan kali ini materinya lebih fokus: bedah product, market, positioning, dan scale dalam satu hari.
            </p>

            <div className="max-w-2xl mx-auto rounded-3xl bg-gradient-to-br from-[#F4EEFD] to-[#FCE9FA] border border-brand-orange/20 p-7 md:p-9 shadow-lg shadow-[#C026D3]/10 mb-2">
              <Quote className="w-8 h-8 text-brand-orange mb-4" fill="currentColor" strokeWidth={0} />
              <blockquote className="text-[15px] md:text-lg font-medium text-brand-black leading-relaxed">
                &ldquo;Aku sempat ragu memulai, tapi mengikuti batch pertama Dreampreneur membuka mata aku bahwa membangun brand itu soal keberanian, bukan sekadar teori. Dari sanalah aku akhirnya memberanikan diri membangun brand parfum sendiri dengan konsep yang inovatif — dan merasa lebih siap menghadapi langkah berikutnya.&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
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
          </motion.div>
        </div>
      </motion.section>

      {/* ============ SECTION 9 — OBJECTION HANDLING ============ */}
      <motion.section
        className="py-16 md:py-24 bg-[#F8F4FF]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
      >
        <div className="container-custom">
          <motion.div className="max-w-2xl mx-auto text-center space-y-4 mb-10 md:mb-12" variants={fadeUp}>
            <h2 className="text-3xl md:text-[44px] font-black tracking-tight leading-[1.1] uppercase font-display">
              Masih Ragu <span className={DP_ACCENT}>Ikut?</span>
            </h2>
          </motion.div>

          <motion.div className="max-w-2xl mx-auto space-y-4" variants={stagger}>
            {OBJECTIONS.map((o) => (
              <motion.details key={o.q} className="group rounded-2xl bg-white border border-neutral-100 shadow-sm" variants={fadeUp}>
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 md:px-7 py-5 font-bold text-[15px] md:text-base text-brand-black">
                  {o.q}
                  <span className="w-7 h-7 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0 transition-transform group-open:rotate-45 text-lg font-black">+</span>
                </summary>
                <p className="px-6 md:px-7 pb-6 text-sm md:text-[15px] text-neutral-600 leading-relaxed">{o.a}</p>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ============ SECTION 10 — EVENT OFFER ============ */}
      <motion.section
        className="py-16 md:py-24 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
      >
        <div className="container-custom">
          <motion.div className="max-w-3xl mx-auto text-center space-y-4 mb-10 md:mb-14" variants={fadeUp}>
            <h2 className="text-3xl md:text-[44px] font-black tracking-tight leading-[1.1] uppercase font-display">
              Satu Hari untuk Melihat Beauty Business dari <span className={DP_ACCENT}>4 Perspektif.</span>
            </h2>
          </motion.div>

          <motion.div className="max-w-4xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-8" variants={fadeUp}>
            <div className="rounded-3xl bg-[#F8F4FF] border border-neutral-100 p-7 md:p-9 space-y-3">
              {OFFER_ITEMS.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm md:text-[15px] font-bold text-brand-black">
                  <CheckCircle2 className="w-5 h-5 text-[#5B21B6] shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <div className="rounded-3xl bg-brand-black text-white p-8 md:p-10 flex flex-col justify-between shadow-xl">
              <div className="space-y-5">
                <p className="w-fit rounded-full bg-brand-orange px-4 py-1.5 text-[10px] md:text-xs font-black text-brand-black uppercase tracking-widest">
                  Early Bird
                </p>
                <div className="space-y-1">
                  <p className="text-lg text-white/50 line-through">Rp250.000</p>
                  <p className="text-[40px] md:text-6xl font-black text-brand-orange font-display tracking-tight">Rp149.000</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <p className="text-lg md:text-xl font-black uppercase font-display tracking-tight leading-snug text-white">
                  Seat hampir penuh.
                </p>
                <p className="text-xl md:text-2xl font-black uppercase font-display tracking-tight text-brand-orange">
                  Tinggal 7 seat lagi.
                </p>
                <button type="button" onClick={() => scrollToRegister("offer_cta")} className={`${CTA_BASE} w-full`}>
                  Amankan Seat Sekarang
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ============ SECTION 11 — EVENT DETAILS ============ */}
      <motion.section
        className="py-16 md:py-24 bg-[#F8F4FF]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
      >
        <div className="container-custom">
          <motion.div className="max-w-2xl mx-auto text-center space-y-3 mb-10 md:mb-12" variants={fadeUp}>
            <h2 className="text-3xl md:text-[44px] font-black tracking-tight leading-[1.1] uppercase font-display">
              Detail <span className={DP_ACCENT}>Acara</span>
            </h2>
            <p className="text-sm md:text-base text-neutral-500 font-bold uppercase tracking-widest">Dreampreneur Vol. 2</p>
            <p className="text-xs md:text-sm text-neutral-400 uppercase tracking-[0.3em]">Connect • Learn • Scale</p>
          </motion.div>

          <motion.div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto" variants={stagger}>
            {[
              { icon: CalendarDays, label: "Tanggal", value: EVENT_DATE },
              { icon: Clock, label: "Waktu", value: EVENT_TIME },
              { icon: MapPin, label: "Lokasi", value: EVENT_VENUE },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.label} className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-6 md:p-8 text-center space-y-3" variants={fadeUp}>
                  <Icon className="w-7 h-7 text-brand-orange mx-auto" />
                  <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">{item.label}</p>
                  <p className="text-sm md:text-[15px] font-bold text-brand-black">{item.value}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* ============ SECTION 12 — REGISTRATION FORM ============ */}
      <motion.section
        id={registerId}
        className="py-16 md:py-24 bg-white scroll-mt-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
      >
        <div className="container-custom">
          <motion.div className="max-w-xl mx-auto text-center space-y-3 mb-10" variants={fadeUp}>
            <h2 className="text-3xl md:text-[44px] font-black tracking-tight leading-[1.1] uppercase font-display">
              Reserve Seat <span className={DP_ACCENT}>Kamu Sekarang</span>
            </h2>
            <p className="text-sm md:text-base text-neutral-500 leading-relaxed">
              Isi form singkat di bawah. Tim Dreamlab akan menghubungimu via WhatsApp untuk konfirmasi pembayaran &amp; detail kehadiran.
            </p>
          </motion.div>

          <motion.div className="max-w-lg mx-auto rounded-[28px] bg-[#F4EEFD] border border-brand-orange/20 p-6 sm:p-9 shadow-[0_18px_50px_rgba(0,0,0,0.06)]" variants={fadeUp}>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <label className="grid gap-2 text-sm font-bold text-brand-black">
                Nama<span className={DP_ACCENT}>*</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                  }}
                  onFocus={() => trackFormStart()}
                  className="rounded-2xl border border-[#E1D4F5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#7C3AED]"
                  placeholder="Nama lengkap kamu"
                  autoComplete="name"
                />
                {errors.name && <span className="text-xs font-bold text-red-600">{errors.name}</span>}
              </label>

              <label className="grid gap-2 text-sm font-bold text-brand-black">
                WhatsApp<span className={DP_ACCENT}>*</span>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => {
                    setWhatsapp(e.target.value);
                    if (errors.whatsapp) setErrors((p) => ({ ...p, whatsapp: undefined }));
                  }}
                  onFocus={() => trackFormStart()}
                  className="rounded-2xl border border-[#E1D4F5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#7C3AED]"
                  placeholder="08xxxxxxxxxx"
                  autoComplete="tel"
                  inputMode="tel"
                />
                {errors.whatsapp && <span className="text-xs font-bold text-red-600">{errors.whatsapp}</span>}
              </label>

              <fieldset className="grid gap-2 text-sm font-bold text-brand-black">
                <legend>Status kamu<span className={DP_ACCENT}>*</span></legend>
                <div className="grid grid-cols-2 gap-3">
                  {["Belum punya brand", "Sudah punya brand"].map((s) => (
                    <label
                      key={s}
                      className={`cursor-pointer rounded-2xl border px-4 py-3 text-center text-sm font-bold transition ${
                        status === s ? "border-[#7C3AED] bg-gradient-to-r from-[#C2185B] to-[#6D28D9] text-white" : "border-[#E1D4F5] bg-white text-brand-black hover:border-brand-orange/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={s}
                        checked={status === s}
                        onChange={() => {
                          setStatus(s);
                          if (errors.status) setErrors((p) => ({ ...p, status: undefined }));
                        }}
                        onFocus={() => trackFormStart()}
                        className="sr-only"
                      />
                      {s}
                    </label>
                  ))}
                </div>
                {errors.status && <span className="text-xs font-bold text-red-600">{errors.status}</span>}
              </fieldset>

              <label className="grid gap-2 text-sm font-bold text-brand-black">
                Nama brand (opsional)
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="rounded-2xl border border-[#E1D4F5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#7C3AED]"
                  placeholder="Kalau sudah punya brand"
                  autoComplete="organization"
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className={`${CTA_BASE} w-full ${submitting ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {submitting ? "Mengirim..." : "Reserve My Seat"}
              </button>

              <p className="text-center text-xs text-neutral-500 leading-relaxed">
                Harga early bird Rp149.000 · kuota terbatas · konfirmasi pembayaran lewat WhatsApp.
              </p>
            </form>
          </motion.div>
        </div>
      </motion.section>

      {/* ============ FINAL CTA ============ */}
      <motion.section
        className="py-16 md:py-28 bg-brand-black text-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
      >
        <div className="pointer-events-none absolute -top-32 -right-24 w-[26rem] h-[26rem] rounded-full bg-brand-orange/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 w-[24rem] h-[24rem] rounded-full bg-brand-orange/10 blur-3xl" />
        <motion.div className="container-custom relative text-center space-y-6" variants={fadeUp}>
          <h2 className="text-3xl md:text-[44px] font-black tracking-tight leading-[1.1] uppercase font-display text-white max-w-3xl mx-auto">
            6 Bulan dari Sekarang, Kamu Bisa Tetap <span className={DP_ACCENT}>Memikirkan Ide yang Sama.</span>
          </h2>
          <p className="text-lg md:text-xl font-bold text-white/80 uppercase font-display">Atau mulai memahaminya hari ini.</p>
          <p className="text-sm md:text-base text-white/60 leading-relaxed max-w-xl mx-auto">
            Untuk kamu yang ingin memulai beauty brand dengan arah yang lebih jelas atau sudah punya brand dan ingin menemukan next growth opportunity.
          </p>

          <div className="space-y-1 pt-2">
            <p className="text-base md:text-xl font-black uppercase tracking-[0.2em] font-display text-white">Dreampreneur Vol. 2</p>
            <p className="text-[11px] md:text-sm text-brand-orange font-bold uppercase tracking-[0.35em]">Connect. Learn. Scale.</p>
          </div>

          <div className="pt-3">
            <button type="button" onClick={() => scrollToRegister("final_cta")} className={CTA_BASE}>
              Yes, Saya Mau Reserve Seat
            </button>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}