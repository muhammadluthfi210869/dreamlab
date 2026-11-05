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
  defaultBudget?: string;
  extraWaText?: string;
  source?: string;
  channel?: 'metaads' | 'google-ads' | 'other';
  landingPage?: string;
  campaign?: string;
}

export interface BudgetOption {
  id: string;
  label: string;
  value: string;
  tierName: string;
  quantityPcs: number;
  segment: string;
  tagline: string;
  isPopular?: boolean;
}

export const BUDGET_OPTIONS: BudgetOption[] = [
  {
    id: 'under_25m',
    label: '< 25 Juta',
    value: '< 25 Juta',
    tierName: 'STARTER',
    quantityPcs: 500,
    segment: 'Starter Prospect',
    tagline: 'Mulai & uji pasar',
  },
  {
    id: '25_50m',
    label: '25–50 Juta',
    value: '25–50 Juta',
    tierName: 'GROWTH',
    quantityPcs: 1000,
    segment: 'Growth Prospect',
    tagline: 'Bangun brand',
    isPopular: true,
  },
  {
    id: '50_100m',
    label: '50–100 Juta',
    value: '50–100 Juta',
    tierName: 'GROWTH',
    quantityPcs: 2500,
    segment: 'Growth Prospect',
    tagline: 'Kembangkan produk',
  },
  {
    id: '100_250m',
    label: '100–250 Juta',
    value: '100–250 Juta',
    tierName: 'SCALE',
    quantityPcs: 5000,
    segment: 'Enterprise Prospect',
    tagline: 'Perluas pasar',
  },
  {
    id: '250_500m',
    label: '250–500 Juta',
    value: '250–500 Juta',
    tierName: 'ENTERPRISE',
    quantityPcs: 10000,
    segment: 'Strategic Prospect',
    tagline: 'Scale-up brand',
  },
  {
    id: 'above_500m',
    label: '> 500 Juta',
    value: '> 500 Juta',
    tierName: 'ENTERPRISE',
    quantityPcs: 20000,
    segment: 'Strategic Prospect',
    tagline: 'Produksi skala besar',
  },
];

// Backward-compatibility export
export const PRODUCTION_TIERS = BUDGET_OPTIONS.map((b) => ({
  name: b.tierName,
  quantityPcs: b.quantityPcs,
  segment: b.segment,
  title: b.label,
  qtyLabel: b.label,
  level: b.tierName,
  tagline: b.tagline,
  levelBadgeClass: 'bg-[#ede9fe] text-[#6d28d9]',
  image: '/new asset/produk/skincare/card1-dayandnightcreame.webp',
}));

export function LeadQualificationModal({
  isOpen,
  onClose,
  defaultCategory = 'Skincare',
  defaultBudget,
  extraWaText,
  source = 'paid-ads',
  channel = 'metaads',
  landingPage = '',
  campaign = '',
}: LeadQualificationModalProps) {
  // Form fields: Nama, HP, Rencana Budget
  const [fullName, setFullName] = useState<string>('');
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<BudgetOption | null>(null);

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

  useEffect(() => {
    if (isOpen && defaultBudget) {
      const matched = BUDGET_OPTIONS.find(
        (opt) => opt.value === defaultBudget || opt.label === defaultBudget
      );
      if (matched) {
        setSelectedBudget(matched);
      }
    }
  }, [isOpen, defaultBudget]);

  // Track modal open
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setRedirecting(false);
      trackLeadEvent('qualification_started', {
        source,
        channel,
        step: 1,
        category: defaultCategory,
        campaign,
      });
    }
  }, [isOpen, source, channel, defaultCategory, campaign]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validate Full Name
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Silakan isi nama lengkap Anda (minimal 2 karakter).');
      return;
    }

    // 2. Validate WhatsApp Phone
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

    // 3. Validate Rencana Budget
    if (!selectedBudget) {
      setError('Silakan pilih salah satu rencana budget produksi Anda.');
      return;
    }

    if (!consent) {
      setError('Harap centang persetujuan kontak untuk melanjutkan konsultasi.');
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

      const eventId =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
              const r = (Math.random() * 16) | 0;
              const v = c === 'x' ? r : (r & 0x3) | 0x8;
              return v.toString(16);
            });

      const budgetToTierSegment: Record<string, string> = {
        under_25m: 'Starter',
        '25_50m': 'Growth',
        '50_100m': 'Scale',
        '100_250m': 'Scale',
        '250_500m': 'Enterprise',
        above_500m: 'Enterprise',
      };
      const resolvedBrowserSegment =
        budgetToTierSegment[selectedBudget.id] || selectedBudget.segment;

      // Fire Pixel qualification_completed right after client-side validation passes
      // and BEFORE fetch('/api/leads/qualify/') using eventID = eventId so the Pixel
      // request has the full API round-trip to finish and deduplicates with Server CAPI.
      trackLeadEvent('qualification_completed', {
        source,
        channel,
        category: defaultCategory,
        budgetRange: selectedBudget.value,
        productionTier: selectedBudget.tierName,
        campaign,
        leadSegment: resolvedBrowserSegment,
        eventId,
      });

      const res = await fetch('/api/leads/qualify/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: defaultCategory,
          fullName: fullName.trim(),
          whatsappPhone: phoneInput.trim(),
          whatsappPhoneE164: phoneMeta.e164,
          phoneCountryIso2: phoneMeta.countryIso2,
          phoneCountryDialCode: phoneMeta.dialCode,
          budgetRange: selectedBudget.value,
          productionTierName: selectedBudget.tierName,
          requestedQuantityPcs: selectedBudget.quantityPcs,
          leadQuantitySegment: selectedBudget.segment,
          simulationNote: extraWaText || undefined,
          source,
          channel,
          landingPage: landingPage || window.location.pathname,
          landingUrl: window.location.href,
          referrer: document.referrer || undefined,
          utmSource,
          utmMedium,
          utmCampaign,
          utmContent,
          utmTerm,
          gclid,
          fbclid,
          visitorId,
          eventId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Terjadi kesalahan sistem saat menyimpan kualifikasi.');
      }

      setRedirecting(true);

      let targetWaUrl = data.whatsappUrl || data.redirectUrl || '';
      if (extraWaText && targetWaUrl) {
        try {
          const parsedUrl = new URL(targetWaUrl);
          const currentText = parsedUrl.searchParams.get('text') || '';
          if (!currentText.includes(extraWaText)) {
            parsedUrl.searchParams.set(
              'text',
              currentText ? `${currentText}\n${extraWaText}` : extraWaText
            );
            targetWaUrl = parsedUrl.toString();
          }
        } catch {
          /* ignore URL parse error */
        }
      }

      // Simpan session fallback untuk Thank You page
      if (typeof sessionStorage !== 'undefined' && targetWaUrl) {
        try {
          sessionStorage.setItem('dl_qualified_wa_url', targetWaUrl);
        } catch {
          /* ignore */
        }
      }

      // Pastikan mengarah ke Thank You page (wajib untuk tracking konversi Meta Ads Pixel & Google Ads)
      const thankYouBase =
        channel === 'google-ads'
          ? '/ads/thankyou/google-ads/'
          : '/ads/thankyou/metaads/';

      const thankYouParams = new URLSearchParams();
      thankYouParams.set('source', source || (channel === 'google-ads' ? 'google-ads' : 'metaads'));
      thankYouParams.set('category', defaultCategory);
      if (data.inquiryReference && !data.isDuplicate) {
        thankYouParams.set('inquiry', data.inquiryReference);
        thankYouParams.set('event_id', data.inquiryReference);
      }
      if (data.assignedSales?.name) {
        thankYouParams.set('sales_name', data.assignedSales.name);
      }
      if (data.assignedSales?.phone) {
        thankYouParams.set('sales_phone', data.assignedSales.phone);
      }
      if (targetWaUrl) {
        thankYouParams.set('wa_url', targetWaUrl);
      }

      window.location.href = `${thankYouBase}?${thankYouParams.toString()}`;
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
      <div className="relative w-full max-w-[480px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto transition-all">
        {/* Header - Dreamlab Smart Qualification */}
        <div className="relative px-5 py-5 sm:px-6 sm:py-5 bg-gradient-to-r from-[#0a1b38] via-[#0f2a58] to-[#163870] text-white overflow-hidden">
          {/* Subtle Visual Dropper Background */}
          <div className="absolute right-0 top-0 bottom-0 w-[50%] pointer-events-none select-none opacity-40 mix-blend-screen">
            <Image
              src="/new asset/background-visual-hero-section/skincare.webp"
              alt="Dreamlab Dropper Visual"
              fill
              className="object-cover object-right"
              sizes="240px"
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
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
              Konsultasi Brand Anda
            </h3>
            <p className="text-xs text-blue-100/90 mt-1.5 leading-relaxed max-w-[340px]">
              Kembangkan formula berstandar BPOM & dapatkan akses eksklusif bimbingan bisnis <strong>Dreampreneur Beauty Academy</strong> sebagai <strong>Brand Community Owner</strong>.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[82vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2.5">
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
                Mengalihkan secara aman ke WhatsApp Business Consultant...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Field 1: Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Rina Anggraini"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:border-[#0f2e6b] focus:ring-2 focus:ring-[#0f2e6b]/15 outline-none transition-all"
                />
              </div>

              {/* Field 2: Nomor WhatsApp / HP */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Nomor WhatsApp / HP <span className="text-red-500">*</span>
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
                <span className="text-[10.5px] text-slate-400 mt-1 block">
                  Format WhatsApp aktif (contoh: 81234567890)
                </span>
              </div>

              {/* Field 3: Rencana Budget */}
              <div className="pt-1">
                <div className="mb-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Rencana Budget Produksi <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pilih estimasi modal yang disiapkan untuk memulai atau mengembangkan brand:
                  </p>
                </div>

                {/* 6 Opsi Budget: Grid 2 Kolom */}
                <div className="grid grid-cols-2 gap-2">
                  {BUDGET_OPTIONS.map((opt) => {
                    const isSelected = selectedBudget?.id === opt.id;
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setSelectedBudget(opt)}
                        className={`relative p-2.5 sm:p-3 rounded-xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer select-none ${
                          isSelected
                            ? 'border-[#0284c7] bg-[#f0f9ff] shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
                            {opt.label}
                          </span>
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected ? 'border-[#0284c7] bg-white' : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <span className="w-2 h-2 rounded-full bg-[#0284c7]" />}
                          </div>
                        </div>

                        {opt.isPopular && (
                          <span className="inline-block w-fit text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-[#0284c7] text-white mt-0.5 mb-1 shadow-xs">
                            POPULER
                          </span>
                        )}

                        <span className="text-[10px] text-slate-500 leading-tight">
                          {opt.tagline}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Persetujuan Privasi */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="consent-checkbox-modal"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#0f2e6b] focus:ring-[#0f2e6b]"
                />
                <label htmlFor="consent-checkbox-modal" className="text-[11px] text-slate-500 leading-tight">
                  Saya menyetujui untuk dihubungi oleh Business Consultant Dreamlab mengenai rencana produksi dan penawaran maklon.{' '}
                  <Link href="/privacy-policy/" target="_blank" className="text-[#0f2e6b] underline font-medium">
                    Kebijakan Privasi
                  </Link>
                </label>
              </div>

              {/* Benefit Highlight */}
              <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-950 flex items-center gap-2">
                <span className="shrink-0 text-base">🎓</span>
                <span>
                  <strong>Akses Eksklusif:</strong> Termasuk bimbingan Dreampreneur Beauty Academy & jejaring Brand Community Owner.
                </span>
              </div>

              {/* Submit CTA */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm tracking-wide uppercase text-white bg-gradient-to-r from-[#D98A00] to-[#f0b830] hover:brightness-105 shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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
                <p className="text-center text-[10.5px] text-slate-400 mt-2 leading-relaxed">
                  Tim kami siap merespons via WhatsApp untuk memberikan estimasi HPP dan solusi formula.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
