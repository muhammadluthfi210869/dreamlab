'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Check,
  CheckCircle2,
  Sparkles,
  FlaskConical,
  Microscope,
  Factory,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  Loader2,
  Globe,
  Building2,
  TrendingUp,
} from 'lucide-react';

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1178862663474674';

interface ProductionScaleOption {
  pcs: string;
  pcsNum: number;
  level: string;
  tagline: string;
  badge?: string;
  isPopular?: boolean;
}

const PRODUCTION_SCALES: ProductionScaleOption[] = [
  {
    pcs: '500 PCS',
    pcsNum: 500,
    level: 'STARTER',
    tagline: 'Mulai wujudkan brand Anda.',
  },
  {
    pcs: '1.000 PCS',
    pcsNum: 1000,
    level: 'GROWTH',
    tagline: 'Bangun brand Anda lebih serius.',
    badge: 'PALING POPULER',
    isPopular: true,
  },
  {
    pcs: '5.000 PCS',
    pcsNum: 5000,
    level: 'SCALE',
    tagline: 'Perluas pasar dan tingkatkan produksi.',
  },
  {
    pcs: '10.000 PCS',
    pcsNum: 10000,
    level: 'ENTERPRISE',
    tagline: 'Siapkan brand untuk pasar yang lebih besar.',
  },
];

const PRODUCT_CATEGORIES = [
  'Parfum',
  'Skincare',
  'Bodycare',
  'Haircare',
  'Personal Care',
  'Lainnya',
];

const BUSINESS_STAGES = [
  'Baru punya ide',
  'Sedang menyiapkan brand',
  'Sudah punya brand',
  'Sudah berjualan dan ingin scale-up',
];

const PRODUCTION_TIMELINES = [
  'Secepatnya',
  '1–3 bulan',
  '3–6 bulan',
  'Masih dalam tahap perencanaan',
];

export default function MetaAdsMaklonLanding() {
  const searchParams = useSearchParams();

  // Form State
  const [selectedScale, setSelectedScale] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [otherCategoryText, setOtherCategoryText] = useState<string>('');
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [selectedTimeline, setSelectedTimeline] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [whatsappPhone, setWhatsappPhone] = useState<string>('');

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mobile Sticky CTA Visibility
  const [showStickyCta, setShowStickyCta] = useState(false);

  // Tracking Refs
  const formRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const hasTrackedViewContent = useRef(false);

  // UTM Parameters
  const [utmParams, setUtmParams] = useState({
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    utm_term: '',
    fbclid: '',
  });

  // 1. Initialize Meta Pixel & Capture UTMs
  useEffect(() => {
    // Read UTMs
    const params = {
      utm_source: searchParams.get('utm_source') || 'meta',
      utm_medium: searchParams.get('utm_medium') || 'cpc',
      utm_campaign: searchParams.get('utm_campaign') || '',
      utm_content: searchParams.get('utm_content') || '',
      utm_term: searchParams.get('utm_term') || '',
      fbclid: searchParams.get('fbclid') || '',
    };
    setUtmParams(params);

    // Save in sessionStorage
    try {
      sessionStorage.setItem('dl_meta_ads_utm', JSON.stringify(params));
    } catch {}

    // Init Pixel if not already initialized
    const win = window as any;
    if (!win.fbq) {
      win.fbq = function () {
        if (win.fbq.callMethod) win.fbq.callMethod.apply(win.fbq, arguments);
        else win.fbq.queue.push(arguments);
      };
      win._fbq = win.fbq;
      win.fbq.push = win.fbq;
      win.fbq.loaded = true;
      win.fbq.version = '2.0';
      win.fbq.queue = [];
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      script.async = true;
      document.head.appendChild(script);
      script.onload = () => {
        win.fbq('init', META_PIXEL_ID);
        win.fbq('track', 'PageView');
      };
    } else {
      win.fbq('track', 'PageView');
    }
  }, [searchParams]);

  // 2. Track ViewContent on reaching qualification form & Scroll Listeners
  useEffect(() => {
    const handleScroll = () => {
      // Toggle sticky CTA
      if (heroRef.current && formRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        const formRect = formRef.current.getBoundingClientRect();
        const isPastHero = heroBottom < 100;
        const isFormVisible = formRect.top < window.innerHeight && formRect.bottom > 100;

        setShowStickyCta(isPastHero && !isFormVisible && !isSubmitted);

        // ViewContent Pixel Trigger
        if (!hasTrackedViewContent.current && formRect.top < window.innerHeight * 0.75) {
          hasTrackedViewContent.current = true;
          const win = window as any;
          if (typeof win.fbq === 'function') {
            win.fbq('track', 'ViewContent', {
              content_name: 'Qualification Form - Meta Ads Maklon',
              content_category: 'Lead Form',
            });
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSubmitted]);

  // Scroll smoothly to form
  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // WhatsApp click handler with Contact event
  const handleWhatsAppClick = () => {
    const win = window as any;
    if (typeof win.fbq === 'function') {
      win.fbq('track', 'Contact', {
        content_name: 'WhatsApp Direct Chat',
        content_category: 'Lead Contact',
      });
    }
  };

  // 3. Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validation
    if (!selectedScale) {
      setSubmitError('Pilih salah satu target produksi brand Anda.');
      return;
    }
    if (!selectedCategory) {
      setSubmitError('Pilih jenis produk yang ingin Anda kembangkan.');
      return;
    }
    if (selectedCategory === 'Lainnya' && !otherCategoryText.trim()) {
      setSubmitError('Tuliskan jenis produk yang ingin Anda buat pada kolom Lainnya.');
      return;
    }
    if (!fullName.trim() || fullName.trim().length < 2) {
      setSubmitError('Mohon isi nama lengkap Anda.');
      return;
    }

    // Phone validation (Accept Indonesian numbers)
    let cleanPhone = whatsappPhone.replace(/[^\d]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith('8')) {
      cleanPhone = '62' + cleanPhone;
    } else if (!cleanPhone.startsWith('62')) {
      cleanPhone = '62' + cleanPhone;
    }

    if (!/^628\d{8,12}$/.test(cleanPhone)) {
      setSubmitError('Nomor WhatsApp tidak valid. Masukkan nomor HP aktif (contoh: 081234567890).');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: fullName.trim(),
        phone: cleanPhone,
        production_quantity: selectedScale,
        product_category: selectedCategory,
        other_product_category: otherCategoryText.trim(),
        business_stage: selectedStage,
        production_timeline: selectedTimeline,
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        utm_content: utmParams.utm_content,
        utm_term: utmParams.utm_term,
        fbclid: utmParams.fbclid,
      };

      const res = await fetch('/api/leads/meta-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Terjadi kesalahan saat memproses formulir.');
      }

      // Track Meta Pixel Lead Event
      const win = window as any;
      if (typeof win.fbq === 'function') {
        win.fbq('track', 'Lead', {
          content_name: 'Meta Ads Lead Form',
          content_category: selectedCategory,
          value: parseInt(selectedScale.replace(/[^\d]/g, ''), 10) || 1000,
          currency: 'IDR',
        });
      }

      setIsSubmitted(true);

      // Scroll to top of form section smoothly
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Gagal mengirimkan informasi. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSelectedScale('');
    setSelectedCategory('');
    setOtherCategoryText('');
    setSelectedStage('');
    setSelectedTimeline('');
    setFullName('');
    setWhatsappPhone('');
    setIsSubmitted(false);
    setSubmitError(null);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#D98A00] selection:text-white pb-16">
      
      {/* Top Header / Branding Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-28 sm:h-9 sm:w-32">
              <Image
                src="/assets/images/dreamlab-logo-blue.png"
                alt="Dreamlab Cosmetics Laboratories"
                fill
                priority
                className="object-contain object-left"
                sizes="140px"
              />
            </div>
            <div className="hidden border-l border-slate-200 pl-3 sm:block">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#003B6D]">
                Juaranya Formula
              </span>
            </div>
          </div>

          <a
            href="https://api.whatsapp.com/send/?phone=62881027240339&text=Halo+Dreamlab%2C+saya+ingin+konsultasi+maklon+kosmetik+dari+iklan+Meta+Ads."
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
          >
            <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Tanya Kami</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>
      </header>

      {/* 4. HERO SECTION */}
      <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white pt-8 pb-12 sm:pt-14 sm:pb-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1 text-xs font-extrabold text-[#003B6D] shadow-sm mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[#D98A00]" />
            <span>Beyond Manufacturing &bull; Your Beauty Brand Growth Partner</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl md:text-5xl lg:text-[52px] lg:leading-[1.15]">
            Wujudkan Brand Kosmetik Anda Bersama Dreamlab
          </h1>

          {/* Supporting Copy */}
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-relaxed">
            Dari ide produk, pengembangan formula, hingga produksi — Dreamlab membantu Anda membangun produk yang siap dibawa ke pasar.
          </p>

          {/* CTA Box */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3">
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#D98A00] to-[#f0b830] px-8 py-4 text-sm sm:text-base font-extrabold text-white shadow-xl shadow-amber-500/25 transition hover:brightness-105 active:scale-[0.98] sm:w-auto"
            >
              <span>MULAI RENCANAKAN BRAND ANDA</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-xs text-slate-500">
              Konsultasikan kebutuhan produk dan target produksi Anda bersama tim Dreamlab.
            </p>
          </div>

          {/* Laboratory Visual Element */}
          <div className="relative mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
              <Image
                src="/new asset/landing page/maklon_kosmetik.webp"
                alt="Fasilitas Riset Laboratorium & Manufaktur Kosmetik Dreamlab"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-left sm:bottom-4 sm:left-6">
                <span className="inline-block rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#003B6D] backdrop-blur-sm">
                  Standar CPKB Golongan A
                </span>
                <p className="text-xs sm:text-sm font-semibold text-white drop-shadow-sm mt-1">
                  1 Client = 1 Exclusive Formula &bull; Bersertifikat Resmi BPOM RI &amp; Halal MUI
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. TRUST / VALUE STRIP */}
      <section className="border-y border-slate-200/80 bg-slate-50/70 py-4">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 flex-shrink-0 text-emerald-600" />
              <span className="text-xs sm:text-sm font-bold text-slate-800">Formula Custom</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 flex-shrink-0 text-emerald-600" />
              <span className="text-xs sm:text-sm font-bold text-slate-800">Tim R&amp;D</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 flex-shrink-0 text-emerald-600" />
              <span className="text-xs sm:text-sm font-bold text-slate-800">Produksi Kosmetik</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 flex-shrink-0 text-emerald-600" />
              <span className="text-xs sm:text-sm font-bold text-slate-800">Support Pengembangan Brand</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION — WHY DREAMLAB */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl md:text-4xl">
              Bukan Sekadar Produksi. Kami Membantu Brand Anda Berkembang.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              Setiap brand punya kebutuhan yang berbeda. Karena itu, Dreamlab tidak hanya memproduksi produk, tetapi membantu Anda mengembangkan formula dan kebutuhan produksi sesuai arah brand Anda.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Card 1: FORMULA */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-[#D98A00]">
                <FlaskConical className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-extrabold uppercase tracking-wide text-slate-900">
                FORMULA
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                Pengembangan formula sesuai konsep dan kebutuhan produk Anda.
              </p>
            </div>

            {/* Card 2: R&D */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7]">
                <Microscope className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-extrabold uppercase tracking-wide text-slate-900">
                R&amp;D
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                Didukung tim R&amp;D untuk proses pengembangan dan evaluasi formula.
              </p>
            </div>

            {/* Card 3: PRODUCTION */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Factory className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-extrabold uppercase tracking-wide text-slate-900">
                PRODUCTION
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                Dari pengembangan produk hingga produksi dalam skala yang sesuai dengan pertumbuhan brand Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7 - 14. MAIN CONVERSION SECTION (QUALIFICATION FORM) */}
      <section
        id="form-section"
        ref={formRef}
        className="scroll-mt-12 py-12 sm:py-16 bg-slate-50/70 border-t border-slate-200"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg shadow-slate-200/50">
            
            {/* Header Form */}
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-extrabold text-[#92400e] mb-3">
                <Building2 className="h-3.5 w-3.5" />
                <span>Konsultasi Perencanaan Brand</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                Siapkan Brand Anda untuk Tumbuh
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                Pilih target produksi dan produk yang ingin Anda kembangkan. Tim Dreamlab akan menggunakan informasi ini untuk memahami kebutuhan brand Anda.
              </p>
            </div>

            {/* If Submitted: SUCCESS STATE */}
            {isSubmitted ? (
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-8 text-center animate-fadeIn">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-xl sm:text-2xl font-extrabold text-slate-900">
                  Terima Kasih!
                </h3>
                <p className="mt-2 text-sm font-semibold text-emerald-900">
                  Informasi brand Anda sudah kami terima.
                </p>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                  Tim Dreamlab akan menghubungi Anda melalui WhatsApp untuk memahami kebutuhan produk dan rencana produksi Anda.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-slate-800 sm:w-auto"
                  >
                    <span>Kembali ke Dreamlab</span>
                  </button>

                  <a
                    href="https://www.instagram.com/dreamlab_official/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-xs sm:text-sm font-bold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                  >
                    <InstagramIcon className="h-4 w-4 text-pink-600" />
                    <span>Follow Instagram @dreamlab_official</span>
                  </a>
                </div>
              </div>
            ) : (
              /* ACTIVE FORM */
              <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                
                {/* 8. FORM — PRODUCTION SCALE */}
                <div>
                  <div className="mb-3">
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      Seberapa Besar Target Produksi Brand Anda? <span className="text-red-500">*</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pilih skala produksi yang paling sesuai dengan rencana dan target brand Anda.
                    </p>
                  </div>

                  {/* 4 Radio Cards Progression (Start -> Grow -> Scale -> Enterprise) */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {PRODUCTION_SCALES.map((scale) => {
                      const isSelected = selectedScale === scale.pcs;
                      return (
                        <div
                          key={scale.pcs}
                          onClick={() => setSelectedScale(scale.pcs)}
                          className={`relative cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 select-none ${
                            isSelected
                              ? 'border-[#003B6D] bg-sky-50/40 shadow-md ring-2 ring-[#003B6D]/20'
                              : scale.isPopular
                              ? 'border-amber-300 bg-amber-50/20 hover:border-amber-400'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          {/* Badge Paling Populer */}
                          {scale.badge && (
                            <span className="absolute -top-2.5 right-3 rounded-full bg-[#D98A00] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                              {scale.badge}
                            </span>
                          )}

                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-xl sm:text-2xl font-black text-slate-950 block">
                                {scale.pcs}
                              </span>
                              <span className="text-xs font-black uppercase tracking-widest text-[#003B6D] mt-0.5 block">
                                {scale.level}
                              </span>
                            </div>

                            {/* Radio Circle Indicator */}
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                                isSelected
                                  ? 'border-[#003B6D] bg-[#003B6D] text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                            </div>
                          </div>

                          <p className="mt-2 text-xs text-slate-600 font-medium italic">
                            {scale.tagline}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 9. FORM — PRODUCT CATEGORY */}
                <div className="border-t border-slate-200/80 pt-6">
                  <div className="mb-3">
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      Produk Apa yang Ingin Anda Kembangkan? <span className="text-red-500">*</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pilih produk yang ingin Anda bawa ke pasar bersama Dreamlab.
                    </p>
                  </div>

                  {/* Category Pills */}
                  <div className="flex flex-wrap gap-2.5">
                    {PRODUCT_CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                            isSelected
                              ? 'bg-[#003B6D] text-white shadow-sm ring-2 ring-[#003B6D]/30'
                              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {/* "Lainnya" Text Input */}
                  {selectedCategory === 'Lainnya' && (
                    <div className="mt-3.5 animate-fadeIn">
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Produk yang ingin dibuat:
                      </label>
                      <input
                        type="text"
                        value={otherCategoryText}
                        onChange={(e) => setOtherCategoryText(e.target.value)}
                        placeholder="Contoh: Deodorant Spray, Lip Balm, Foot Scrub"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#003B6D] focus:outline-none focus:ring-2 focus:ring-[#003B6D]/20"
                      />
                    </div>
                  )}
                </div>

                {/* 10. FORM — BUSINESS STATUS */}
                <div className="border-t border-slate-200/80 pt-6">
                  <div className="mb-3">
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      Saat Ini Anda Berada di Tahap Mana?
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Membantu tim konsultan kami menyesuaikan sesi diskusi.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {BUSINESS_STAGES.map((stage) => {
                      const isSelected = selectedStage === stage;
                      return (
                        <div
                          key={stage}
                          onClick={() => setSelectedStage(stage)}
                          className={`cursor-pointer rounded-xl border px-3.5 py-3 text-xs sm:text-sm font-medium transition ${
                            isSelected
                              ? 'border-[#003B6D] bg-sky-50/50 text-[#003B6D] font-bold'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{stage}</span>
                            <div
                              className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-[#003B6D] bg-[#003B6D] text-white' : 'border-slate-300'
                              }`}
                            >
                              {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 12. OPTIONAL QUALIFICATION: PRODUCTION TIMELINE */}
                <div className="border-t border-slate-200/80 pt-6">
                  <div className="mb-3">
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      Kapan Anda Ingin Mulai Produksi?
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pilih estimasi tenggat waktu jadwal rilis produk Anda.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {PRODUCTION_TIMELINES.map((timeline) => {
                      const isSelected = selectedTimeline === timeline;
                      return (
                        <div
                          key={timeline}
                          onClick={() => setSelectedTimeline(timeline)}
                          className={`cursor-pointer rounded-xl border p-2.5 text-center text-xs font-semibold transition ${
                            isSelected
                              ? 'border-[#003B6D] bg-[#003B6D] text-white'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {timeline}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 11. FORM — CONTACT */}
                <div className="border-t border-slate-200/80 pt-6">
                  <div className="mb-4">
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      Mari Kenalan dengan Anda
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Informasi kontak hanya digunakan untuk konsultasi produk melalui WhatsApp.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Nama Lengkap */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Contoh: Rina Anggraini"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#003B6D] focus:outline-none focus:ring-2 focus:ring-[#003B6D]/20"
                      />
                    </div>

                    {/* Nomor WhatsApp */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                      </label>
                      <div className="flex rounded-xl border border-slate-300 bg-white overflow-hidden focus-within:border-[#003B6D] focus-within:ring-2 focus-within:ring-[#003B6D]/20">
                        <span className="flex items-center bg-slate-100 px-3.5 text-xs sm:text-sm font-bold text-slate-600 border-r border-slate-200">
                          +62
                        </span>
                        <input
                          type="tel"
                          required
                          value={whatsappPhone}
                          onChange={(e) => setWhatsappPhone(e.target.value)}
                          placeholder="81234567890"
                          className="w-full bg-white px-3.5 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Contoh pengisian: 81234567890 (otomatis diawali kode negara +62)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {submitError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    {submitError}
                  </div>
                )}

                {/* 13. SUBMIT CTA BUTTON */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#D98A00] to-[#f0b830] px-8 py-4 text-sm sm:text-base font-extrabold uppercase text-white shadow-xl shadow-amber-500/25 transition hover:brightness-105 active:scale-[0.98] disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>MEMPROSES...</span>
                      </>
                    ) : (
                      <>
                        <span>KONSULTASIKAN BRAND SAYA</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                  <p className="mt-2.5 text-center text-[11px] text-slate-500 leading-relaxed">
                    Tim Dreamlab akan menghubungi Anda melalui WhatsApp untuk membahas kebutuhan produk dan produksi Anda.
                  </p>
                </div>

              </form>
            )}

          </div>

        </div>
      </section>

      {/* 28. FINAL CTA SECTION */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-[#00274a] p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            {/* Subtle radial glow */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative z-10">
              <span className="inline-block rounded-full bg-white/10 px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-[#f0b830] backdrop-blur-sm mb-4">
                Partner Pertumbuhan Brand Anda
              </span>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Siap Membawa Brand Anda ke Level Berikutnya?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-xs sm:text-sm text-slate-300 leading-relaxed">
                Mulai dari produk yang ingin Anda ciptakan. Dreamlab siap membantu Anda mengembangkan formula dan produksinya.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#D98A00] to-[#f0b830] px-7 py-3.5 text-xs sm:text-sm font-extrabold uppercase text-white shadow-lg shadow-amber-500/25 transition hover:brightness-105 sm:w-auto"
                >
                  <span>MULAI KONSULTASI</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <a
                  href="https://api.whatsapp.com/send/?phone=62881027240339&text=Halo+Dreamlab%2C+saya+ingin+chat+WhatsApp+seputar+maklon+kosmetik."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-xs sm:text-sm font-bold text-white transition hover:bg-white/20 sm:w-auto"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-400" />
                  <span>Chat WhatsApp Dreamlab</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 24. FOOTER */}
      <footer className="border-t border-slate-100 bg-white py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="relative h-6 w-20">
                <Image
                  src="/assets/images/dreamlab-logo-blue.png"
                  alt="Dreamlab Cosmetics Laboratories"
                  fill
                  className="object-contain"
                  sizes="100px"
                />
              </div>
              <span className="font-bold text-slate-700">Dreamlab Cosmetics Laboratories</span>
              <span className="hidden sm:inline text-slate-300">&bull;</span>
              <span className="hidden sm:inline font-semibold text-[#003B6D]">Juaranya Formula</span>
            </div>

            <div className="flex items-center gap-5">
              <a
                href="https://www.instagram.com/dreamlab_official/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900 transition flex items-center gap-1"
              >
                <InstagramIcon className="h-3.5 w-3.5 text-pink-600" />
                <span>Instagram</span>
              </a>
              <a
                href="https://dreamlab.id"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900 transition flex items-center gap-1"
              >
                <Globe className="h-3.5 w-3.5 text-sky-600" />
                <span>Website</span>
              </a>
              <a
                href="https://api.whatsapp.com/send/?phone=62881027240339&text=Halo+Dreamlab%2C+saya+ingin+konsultasi+maklon."
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="hover:text-slate-900 transition flex items-center gap-1"
              >
                <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* 22. MOBILE STICKY CTA */}
      {showStickyCta && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md shadow-2xl transition-all duration-300 sm:hidden">
          <button
            type="button"
            onClick={scrollToForm}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D98A00] to-[#f0b830] py-3 text-xs font-black uppercase text-white shadow-lg shadow-amber-500/30 active:scale-[0.98]"
          >
            <span>MULAI RENCANAKAN BRAND ANDA</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
