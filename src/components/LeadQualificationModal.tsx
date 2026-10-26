'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  badge?: string;
}

// 4 Compact Production Tiers (Ascending Order)
export const PRODUCTION_TIERS: ProductionTierItem[] = [
  {
    name: 'Brand Starter',
    quantityPcs: 300,
    segment: 'Micro Prospect',
    title: 'Brand Starter',
    qtyLabel: '300 PCS',
  },
  {
    name: 'Brand Launch',
    quantityPcs: 500,
    segment: 'MOQ Fit',
    title: 'Brand Launch',
    qtyLabel: '500 PCS',
  },
  {
    name: 'Brand Growth',
    quantityPcs: 1000,
    segment: 'Growth Prospect',
    title: 'Brand Growth',
    qtyLabel: '1.000 PCS',
    badge: 'Rekomendasi',
  },
  {
    name: 'Brand Partner',
    quantityPcs: 5000,
    segment: 'Strategic Prospect',
    title: 'Brand Partner',
    qtyLabel: '5.000 PCS',
  },
];

const CATEGORIES = ['Parfum', 'Skincare', 'Bodycare', 'Haircare', 'Lainnya'];

export function LeadQualificationModal({
  isOpen,
  onClose,
  defaultCategory = 'Parfum',
  source = 'paid-ads',
  channel = 'metaads',
  landingPage = '',
  campaign = '',
}: LeadQualificationModalProps) {
  const [category, setCategory] = useState<string>(defaultCategory);
  const [customProduct, setCustomProduct] = useState<string>('');
  
  // No tier preselected automatically
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
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resolvedCategory =
    category === 'Lainnya' && customProduct.trim() ? customProduct.trim() : category;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validate Tier Selection (Must be explicitly chosen)
    if (!selectedTier) {
      setError('Silakan pilih salah satu rencana tier produksi Anda.');
      return;
    }

    // 2. Validate Category
    if (!resolvedCategory) {
      setError('Silakan pilih jenis produk yang ingin Anda buat.');
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
        throw new Error(data.error || 'Gagal menyimpan rencana produksi. Silakan coba kembali.');
      }

      // Trigger conversion event once
      trackLeadEvent('qualification_completed', {
        source,
        channel,
        category: resolvedCategory,
        productionTier: selectedTier.name,
        quantityPcs: selectedTier.quantityPcs,
        leadSegment: data.leadSegment,
        inquiryReference: data.inquiryReference,
        campaign,
      });

      // Save prefilled WA URL to sessionStorage for Thank You page auto-redirect
      if (typeof sessionStorage !== 'undefined' && data.whatsappUrl) {
        sessionStorage.setItem('dl_qualified_wa_url', data.whatsappUrl);
      }

      setRedirecting(true);

      // Determine existing Thank You Page URL
      const isMeta = channel === 'metaads' || source.includes('meta');
      const thankYouBase = isMeta ? '/ads/thankyou/metaads/' : '/ads/thankyou/google-ads/';
      const thankYouUrl = `${thankYouBase}?source=${encodeURIComponent(source)}&from=${encodeURIComponent(
        landingPage || window.location.pathname
      )}&inquiry=${encodeURIComponent(data.inquiryReference)}`;

      // Redirect prospect to the existing Thank You Page
      window.location.href = thankYouUrl;
    } catch (err: any) {
      console.error('[LeadQualificationModal] Submit error:', err);
      setError(
        err?.message || 'Terjadi gangguan jaringan. Silakan periksa koneksi Anda dan coba lagi.'
      );
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting && !redirecting) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-auto transition-all">
        {/* Header - Dreamlab Blue Styling */}
        <div className="relative px-5 py-4 sm:px-6 sm:py-5 border-b border-blue-900/30 bg-gradient-to-r from-[#0F1E36] via-[#162B4D] to-[#1E3A8A] text-white">
          {!submitting && !redirecting && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Tutup formulir"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30">
              Dreamlab Smart Qualification
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            {redirecting ? 'Menghubungkan ke Tim Konsultan...' : 'Pilih Rencana Produksi Brand Anda'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {redirecting
              ? 'Data Anda telah tersimpan. Mengalihkan ke halaman konfirmasi resmi...'
              : 'Dapatkan proposal formula, sampel, serta estimasi resmi langsung dari tim Business Development.'}
          </p>
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
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5">
              {/* 1. Production Tiers (Compact 2x2 Grid, No Descriptions, No Extra Text, Explicit Selection) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-900">
                    1. Rencana Kuantitas Produksi <span className="text-red-500">*</span>
                  </label>
                  {!selectedTier && (
                    <span className="text-[11px] text-amber-600 font-medium">Pilih salah satu</span>
                  )}
                </div>

                {/* Compact 2x2 Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  {PRODUCTION_TIERS.map((tier) => {
                    const isSelected = selectedTier?.name === tier.name;
                    return (
                      <div
                        key={tier.name}
                        onClick={() => setSelectedTier(tier)}
                        className={`relative p-3 sm:p-3.5 rounded-xl border text-left cursor-pointer select-none transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#1E3A8A]/10 border-[#1E3A8A] ring-2 ring-[#1E3A8A]/25 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs font-bold text-slate-800 tracking-tight">
                            {tier.title}
                          </span>
                          {tier.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                              {tier.badge}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm sm:text-base font-black text-[#1E3A8A]">
                            {tier.qtyLabel}
                          </span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-[#1E3A8A] bg-[#1E3A8A]' : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Kategori Produk */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-2">
                  2. Mau buat produk apa? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = category === cat;
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                          isSelected
                            ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
                {category === 'Lainnya' && (
                  <input
                    type="text"
                    value={customProduct}
                    onChange={(e) => setCustomProduct(e.target.value)}
                    placeholder="Sebutkan jenis produk Anda (misal: Serum Rambut, Lip Tint...)"
                    className="mt-2.5 w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/15 outline-none"
                    autoFocus
                  />
                )}
              </div>

              {/* 3. Kontak (Nama Lengkap & International WhatsApp) */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1">
                    3. Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Rina Anggraini"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/15 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1">
                    4. Nomor WhatsApp Aktif <span className="text-red-500">*</span>
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
                </div>
              </div>

              {/* Persetujuan Privasi */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="consent-checkbox-journey"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#1E3A8A] focus:ring-[#1E3A8A]"
                />
                <label htmlFor="consent-checkbox-journey" className="text-[11px] text-slate-500 leading-tight">
                  Saya menyetujui dihubungi oleh tim Business Consultant Dreamlab mengenai rencana produksi dan penawaran maklon.{' '}
                  <Link href="/privacy-policy/" target="_blank" className="text-[#1E3A8A] underline font-medium">
                    Kebijakan Privasi
                  </Link>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#172e6f] hover:to-[#1d4ed8] shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Menghubungkan ke Tim Konsultan...</span>
                  </>
                ) : (
                  <>
                    <span>Kirim & Hubungi Konsultan Dreamlab</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
