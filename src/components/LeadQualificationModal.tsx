'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { trackLeadEvent } from '@/lib/lead-analytics';
import { InternationalPhoneInput } from '@/components/InternationalPhoneInput';

export interface LeadQualificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
  source?: string;
  channel?: 'metaads' | 'google-ads' | 'other';
  landingPage?: string;
  campaign?: string;
}

export interface ProductionTierItem {
  name: string;
  quantityPcs: number;
  segment: string;
  title: string;
  qtyLabel: string;
  level: string;
  tagline: string;
  levelBadgeClass: string;
  isPopular?: boolean;
  image: string;
}

// 4 Skala Produksi Resmi (Start -> Grow -> Scale -> Enterprise)
export const PRODUCTION_TIERS: ProductionTierItem[] = [
  {
    name: 'STARTER',
    quantityPcs: 500,
    segment: 'Starter Prospect',
    title: '500 PCS',
    qtyLabel: '500 PCS',
    level: 'STARTER',
    tagline: 'Mulai wujudkan brand Anda.',
    levelBadgeClass: 'bg-[#ede9fe] text-[#6d28d9]',
    image: '/new asset/produk/skincare/card1-dayandnightcreame.webp',
  },
  {
    name: 'GROWTH',
    quantityPcs: 1000,
    segment: 'Growth Prospect',
    title: '1.000 PCS',
    qtyLabel: '1.000 PCS',
    level: 'GROWTH',
    tagline: 'Bangun brand Anda lebih serius.',
    levelBadgeClass: 'bg-[#ede9fe] text-[#6d28d9]',
    isPopular: true,
    image: '/new asset/produk/skincare/card7-serum.webp',
  },
  {
    name: 'SCALE',
    quantityPcs: 5000,
    segment: 'Enterprise Prospect',
    title: '5.000 PCS',
    qtyLabel: '5.000 PCS',
    level: 'SCALE',
    tagline: 'Perluas pasar dan tingkatkan produksi.',
    levelBadgeClass: 'bg-[#ffedd5] text-[#c2410c]',
    image: '/new asset/produk/skincare/card4.webp',
  },
  {
    name: 'ENTERPRISE',
    quantityPcs: 10000,
    segment: 'Strategic Prospect',
    title: '10.000 PCS',
    qtyLabel: '10.000 PCS',
    level: 'ENTERPRISE',
    tagline: 'Siapkan brand untuk pasar yang lebih besar.',
    levelBadgeClass: 'bg-[#f3e8ff] text-[#7e22ce]',
    image: '/new asset/produk/skincare/hero-section.webp',
  },
];

const CATEGORIES = [
  {
    id: 'Parfum',
    name: 'Parfum',
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6v3H9z" />
        <path d="M10 6v3" />
        <path d="M14 6v3" />
        <rect x="5" y="9" width="14" height="12" rx="4" />
      </svg>
    ),
  },
  {
    id: 'Skincare',
    name: 'Skincare',
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <rect x="4" y="11" width="16" height="10" rx="3" />
      </svg>
    ),
  },
  {
    id: 'Bodycare',
    name: 'Bodycare',
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2h4" />
        <path d="M12 2v5" />
        <rect x="6" y="7" width="12" height="14" rx="4" />
        <path d="M12 11v4" />
      </svg>
    ),
  },
  {
    id: 'Haircare',
    name: 'Haircare',
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 0-4 4c0 3 4 8 4 8s4-5 4-8a4 4 0 0 0-4-4z" />
        <path d="M6 18c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      </svg>
    ),
  },
  {
    id: 'Lainnya',
    name: 'Lainnya',
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="5" cy="12" r="1.75" />
        <circle cx="12" cy="12" r="1.75" />
        <circle cx="19" cy="12" r="1.75" />
      </svg>
    ),
  },
];

export function LeadQualificationModal({
  isOpen,
  onClose,
  defaultCategory = 'Skincare',
  source = 'paid-ads',
  channel = 'metaads',
  landingPage = '',
  campaign = '',
}: LeadQualificationModalProps) {
  const [category, setCategory] = useState<string>(defaultCategory);
  const [customProduct, setCustomProduct] = useState<string>('');
  
  // No tier preselected automatically (User must actively select)
  const [selectedTier, setSelectedTier] = useState<ProductionTierItem | null>(null);

  // Contact fields
  const [fullName, setFullName] = useState<string>('');
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [phoneMeta, setPhoneMeta] = useState<{
    e164: string;
    countryIso2: string;
    dialCode: string;
    isValid: boolean;
  }>({
    e164: '',
    countryIso2: 'ID',
    dialCode: '+62',
    isValid: false,
  });
  const [consent, setConsent] = useState<boolean>(true);

  // Submission state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [redirecting, setRedirecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync default category
  useEffect(() => {
    if (defaultCategory) {
      setCategory(defaultCategory);
    }
  }, [defaultCategory]);

  // Track modal open
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setRedirecting(false);
      trackLeadEvent('qualification_started', {
        source,
        channel,
        step: 1,
        category,
        campaign,
      });
    }
  }, [isOpen, source, channel, category, campaign]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !submitting && !redirecting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, submitting, redirecting, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const resolvedCategory =
    category === 'Lainnya' && customProduct.trim() ? customProduct.trim() : category;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validate Production Scale Selection
    if (!selectedTier) {
      setError('Silakan pilih salah satu target produksi brand Anda.');
      return;
    }

    // 2. Validate Category
    if (!resolvedCategory) {
      setError('Silakan pilih jenis produk yang ingin Anda kembangkan.');
      return;
    }

    // 3. Validate Full Name
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Silakan isi nama lengkap Anda (minimal 2 karakter).');
      return;
    }

    // 4. Validate International WhatsApp Phone
    if (!phoneInput.trim()) {
      setError('Silakan masukkan nomor WhatsApp aktif Anda.');
      return;
    }

    if (!phoneMeta.isValid) {
      setError(
        `Nomor WhatsApp tidak valid untuk kode negara ${phoneMeta.dialCode}. Pastikan digit nomor sudah sesuai.`
      );
      return;
    }

    if (!consent) {
      setError('Harap setujui persetujuan kontak untuk melanjutkan konsultasi.');
      return;
    }

    setSubmitting(true);

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const utmSource = searchParams.get('utm_source') || undefined;
      const utmMedium = searchParams.get('utm_medium') || undefined;
      const utmCampaign = searchParams.get('utm_campaign') || campaign || undefined;
      const utmContent = searchParams.get('utm_content') || undefined;
      const utmTerm = searchParams.get('utm_term') || undefined;
      const gclid = searchParams.get('gclid') || undefined;
      const fbclid = searchParams.get('fbclid') || undefined;

      let visitorId = '';
      try {
        visitorId =
          localStorage.getItem('dl_visitor_id') ||
          localStorage.getItem('dreamlab_vid_client') ||
          '';
      } catch {
        /* ignore */
      }

      const res = await fetch('/api/leads/qualify/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: resolvedCategory,
          productionTierName: selectedTier.name,
          requestedQuantityPcs: selectedTier.quantityPcs,
          leadQuantitySegment: selectedTier.segment,
          fullName: fullName.trim(),
          whatsappPhone: phoneInput.trim(),
          whatsappPhoneE164: phoneMeta.e164,
          phoneCountryIso2: phoneMeta.countryIso2,
          phoneCountryDialCode: phoneMeta.dialCode,
          source,
          channel,
          landingPage: landingPage || window.location.pathname,
          referrer: document.referrer || undefined,
          utmSource,
          utmMedium,
          utmCampaign,
          utmContent,
          utmTerm,
          gclid,
          fbclid,
          visitorId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Terjadi kesalahan sistem saat menyimpan kualifikasi.');
      }

      trackLeadEvent('qualification_completed', {
        source,
        channel,
        category: resolvedCategory,
        tier: selectedTier.name,
        quantity: selectedTier.quantityPcs,
        campaign,
      });

      setRedirecting(true);

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        const dest = channel === 'google-ads'
          ? `/ads/thankyou/google-ads/?source=${source}&category=${encodeURIComponent(resolvedCategory)}`
          : `/ads/thankyou/metaads/?source=${source}&category=${encodeURIComponent(resolvedCategory)}`;
        window.location.href = dest;
      }
    } catch (err: any) {
      console.error('[LeadQualificationModal] Submit error:', err);
      setError(err?.message || 'Gagal mengirim formulir. Silakan coba lagi.');
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn lead-qualification-modal"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting && !redirecting) onClose();
      }}
    >
      <div className="relative w-full max-w-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto transition-all">
        {/* Header - Dreamlab Smart Qualification */}
        <div className="relative px-5 py-5 sm:px-6 sm:py-6 bg-gradient-to-r from-[#0a1b38] via-[#0f2a58] to-[#163870] text-white overflow-hidden">
          {/* Dropper & Skincare Jars Visual Background */}
          <div className="absolute right-0 top-0 bottom-0 w-[55%] pointer-events-none select-none opacity-50 mix-blend-screen">
            <Image
              src="/new asset/background-visual-hero-section/skincare.webp"
              alt="Dreamlab Dropper Visual"
              fill
              className="object-cover object-right"
              sizes="280px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1b38] via-[#0f2a58]/80 to-transparent" />
          </div>

          {!submitting && !redirecting && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Tutup formulir"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <div className="relative z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase bg-white/10 text-white/95 border border-white/20 backdrop-blur-md">
              DREAMLAB SMART QUALIFICATION
            </span>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-3 leading-tight">
              Siapkan Brand Anda<br />untuk Tumbuh
            </h3>
            <p className="text-xs text-blue-100/85 mt-1.5 leading-relaxed max-w-[320px]">
              Dari satu ide, menjadi produk yang siap Anda bawa ke pasar bersama Dreamlab.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[82vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2.5">
              <svg className="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {redirecting ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-[#1E3A8A] flex items-center justify-center animate-spin">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                Data Kualifikasi Berhasil Disimpan
              </h4>
              <p className="text-xs text-slate-500">
                Mengalihkan secara aman ke halaman konfirmasi...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* 1. Target Produksi (Vertical Stack with realistic product renders) */}
              <div>
                <div className="mb-2.5">
                  <label className="block text-xs sm:text-sm font-extrabold text-slate-900">
                    1. Target Produksi Brand Anda Berapa? <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                    Pilih skala produksi yang sesuai dengan rencana dan target brand Anda.
                  </p>
                </div>

                {/* 4 Cards Stack */}
                <div className="space-y-2.5">
                  {PRODUCTION_TIERS.map((tier) => {
                    const isSelected = selectedTier?.name === tier.name;
                    return (
                      <div
                        key={tier.name}
                        onClick={() => setSelectedTier(tier)}
                        className={`relative p-3 sm:p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between select-none overflow-hidden ${
                          isSelected
                            ? 'border-[#0284c7] bg-[#f0f9ff] shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        {/* Left: Text & Badges */}
                        <div className="z-10 flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                              {tier.title}
                            </span>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${tier.levelBadgeClass}`}>
                              {tier.level}
                            </span>
                            {tier.isPopular && (
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#0284c7] text-white shadow-xs">
                                PALING POPULER
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-normal">
                            {tier.tagline}
                          </p>
                        </div>

                        {/* Middle/Right: Clean Product Render */}
                        <div className="relative w-16 h-12 sm:w-20 sm:h-14 shrink-0 mx-2 pointer-events-none opacity-90">
                          <Image
                            src={tier.image}
                            alt={tier.title}
                            fill
                            className="object-contain"
                            sizes="80px"
                          />
                        </div>

                        {/* Far Right: Radio circle */}
                        <div className="shrink-0 pl-1 z-10">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected ? 'border-[#0284c7] bg-white' : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Produk Apa yang Ingin Anda Kembangkan? */}
              <div>
                <div className="mb-2">
                  <label className="block text-xs sm:text-sm font-extrabold text-slate-900">
                    2. Produk Apa yang Ingin Anda Kembangkan? <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                    Pilih produk yang ingin Anda bawa ke pasar dan mulai rencanakan pengembangannya bersama Dreamlab.
                  </p>
                </div>

                {/* 5 Pills Row with Icons */}
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = category === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`inline-flex items-center gap-1.5 py-2 px-3.5 rounded-2xl text-xs font-bold border transition-all text-center ${
                          isSelected
                            ? 'bg-[#0f2e6b] text-white border-[#0f2e6b] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        {cat.icon}
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}
                </div>

                {category === 'Lainnya' && (
                  <div className="mt-2.5 animate-fadeIn">
                    <input
                      type="text"
                      value={customProduct}
                      onChange={(e) => setCustomProduct(e.target.value)}
                      placeholder="Produk yang ingin dibuat: (contoh: Deodorant Spray, Lip Balm)"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0f2e6b] focus:ring-2 focus:ring-[#0f2e6b]/15 outline-none"
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* 3. Kontak (Mari Kenalan dengan Anda) */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="mb-1">
                  <span className="block text-xs sm:text-sm font-extrabold text-slate-900">
                    3. Mari Kenalan dengan Anda
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-500">
                    Isi data berikut agar tim Dreamlab dapat memahami kebutuhan dan rencana produksi brand Anda.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Rina Anggraini"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:border-[#0f2e6b] focus:ring-2 focus:ring-[#0f2e6b]/15 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                  </label>

                  <InternationalPhoneInput
                    value={phoneInput}
                    onChange={(rawVal, meta) => {
                      setPhoneInput(rawVal);
                      setPhoneMeta(meta);
                    }}
                    defaultCountry="ID"
                    placeholder="81234567890"
                    error={error && !phoneMeta.isValid ? error : null}
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Gunakan format WhatsApp aktif (contoh: 81234567890)
                  </span>
                </div>
              </div>

              {/* Persetujuan Privasi */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="consent-checkbox-journey"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#0f2e6b] focus:ring-[#0f2e6b]"
                />
                <label htmlFor="consent-checkbox-journey" className="text-[11px] text-slate-500 leading-tight">
                  Saya menyetujui dihubungi oleh tim Business Consultant Dreamlab mengenai rencana produksi dan penawaran maklon.{' '}
                  <Link href="/privacy-policy/" target="_blank" className="text-[#0f2e6b] underline font-medium">
                    Kebijakan Privasi
                  </Link>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-2xl font-black text-xs sm:text-sm tracking-wide uppercase text-white bg-gradient-to-r from-[#D98A00] to-[#f0b830] hover:brightness-105 shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>MENYIAPKAN KONSULTASI...</span>
                    </>
                  ) : (
                    <>
                      <span>KONSULTASIKAN BRAND SAYA</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
                <p className="text-center text-[10.5px] text-slate-500 mt-2 leading-relaxed">
                  Tim Dreamlab akan menghubungi Anda melalui WhatsApp untuk membahas kebutuhan produk dan produksi Anda.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
