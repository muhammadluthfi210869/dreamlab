'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { trackLeadEvent } from '@/lib/lead-analytics';
import { InternationalPhoneInput } from '@/components/InternationalPhoneInput';
import { CountryCode } from 'libphonenumber-js';

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
  description: string;
  badge?: string;
}

export const PRODUCTION_TIERS: ProductionTierItem[] = [
  {
    name: 'Brand Starter',
    quantityPcs: 300,
    segment: 'Micro Prospect',
    title: 'BRAND STARTER',
    qtyLabel: '300 PCS',
    description: 'Mulai eksplorasi dan validasi konsep produk.',
  },
  {
    name: 'Brand Launch',
    quantityPcs: 500,
    segment: 'MOQ Fit',
    title: 'BRAND LAUNCH',
    qtyLabel: '500 PCS',
    description: 'Mulai membangun brand dengan rencana produksi yang lebih matang.',
  },
  {
    name: 'Brand Growth',
    quantityPcs: 1000,
    segment: 'Growth Prospect',
    title: 'BRAND GROWTH',
    qtyLabel: '1.000 PCS',
    badge: 'Rekomendasi',
    description: 'Untuk brand yang ingin berkembang dengan kapasitas lebih besar.',
  },
  {
    name: 'Brand Partner',
    quantityPcs: 5000,
    segment: 'Strategic Prospect',
    title: 'BRAND PARTNER',
    qtyLabel: '5.000 PCS',
    description: 'Untuk brand yang membutuhkan skala produksi lanjutan.',
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
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [category, setCategory] = useState<string>(defaultCategory);
  const [customProduct, setCustomProduct] = useState<string>('');
  
  // Explicit selection required (no automatic preselection)
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

  // Submission & Result state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<{
    inquiryReference: string;
    whatsappUrl: string;
    leadSegment: string;
    productionTierName: string;
    requestedQuantityPcs: number;
    assignedSales: { name: string; phone: string };
  } | null>(null);

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
      setError('Silakan pilih salah satu tier kuantitas produksi yang Anda rencanakan.');
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

      setResultData({
        inquiryReference: data.inquiryReference,
        whatsappUrl: data.whatsappUrl,
        leadSegment: data.leadSegment,
        productionTierName: data.productionTierName || selectedTier.name,
        requestedQuantityPcs: data.requestedQuantityPcs || selectedTier.quantityPcs,
        assignedSales: data.assignedSales || { name: 'Business Consultant Dreamlab', phone: '' },
      });

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

      setIsSuccess(true);
    } catch (err: any) {
      console.error('[LeadQualificationModal] Submit error:', err);
      setError(
        err?.message || 'Terjadi gangguan jaringan. Silakan periksa koneksi Anda dan coba lagi.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppHandoffClick = () => {
    if (!resultData) return;

    fetch('/api/leads/qualify/wa-click/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inquiryReference: resultData.inquiryReference,
      }),
    }).catch(() => {});

    // Audits click without firing secondary conversion
    trackLeadEvent('whatsapp_handoff_clicked', {
      source,
      channel,
      category: resolvedCategory,
      productionTier: resultData.productionTierName,
      quantityPcs: resultData.requestedQuantityPcs,
      inquiryReference: resultData.inquiryReference,
      campaign,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-auto transition-all">
        {/* Header - Dreamlab Blue Styling */}
        <div className="relative px-5 py-4 sm:px-6 sm:py-5 border-b border-blue-900/30 bg-gradient-to-r from-[#0F1E36] via-[#162B4D] to-[#1E3A8A] text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Tutup formulir"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30">
              Dreamlab Production Journey
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            {isSuccess ? 'Rencana Produksi Siap Dikonsultasikan' : 'Pilih Rencana Produksi Brand Anda'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {isSuccess
              ? 'Terhubung langsung dengan tim Business Consultant Dreamlab.'
              : 'Pilih tier kuantitas dan dapatkan proposal formula, sampel, serta estimasi resmi.'}
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

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* 1. Production Tiers (Ascending Order, Explicit Selection Required) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-900">
                    1. Rencana Kuantitas Produksi (Pilih Tier) <span className="text-red-500">*</span>
                  </label>
                  {!selectedTier && (
                    <span className="text-[11px] text-amber-600 font-medium">Wajib dipilih</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PRODUCTION_TIERS.map((tier) => {
                    const isSelected = selectedTier?.name === tier.name;
                    return (
                      <div
                        key={tier.name}
                        onClick={() => setSelectedTier(tier)}
                        className={`relative p-3.5 rounded-xl border text-left cursor-pointer select-none transition-all ${
                          isSelected
                            ? 'bg-[#1E3A8A]/5 border-[#1E3A8A] ring-2 ring-[#1E3A8A]/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        {/* Header card with tier title and badge */}
                        <div className="flex items-center justify-between gap-1.5 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 tracking-tight">
                              {tier.title}
                            </span>
                            <span className="text-xs font-black text-[#1E3A8A]">
                              — {tier.qtyLabel}
                            </span>
                          </div>

                          {tier.badge && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              ★ {tier.badge}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-[11px] sm:text-xs text-slate-500 leading-snug">
                          {tier.description}
                        </p>

                        {/* Radio indicator */}
                        <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                          <span className={`font-semibold ${isSelected ? 'text-[#1E3A8A]' : 'text-slate-400'}`}>
                            {isSelected ? '✓ Terpilih' : 'Klik untuk memilih'}
                          </span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
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

                <p className="text-[11px] text-slate-400 mt-2 italic">
                  * Ketersediaan kuantitas produksi bergantung pada kategori produk dan kompleksitas formulasi.
                </p>
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
                    4. Nomor WhatsApp Aktif (Indonesia & Internasional) <span className="text-red-500">*</span>
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

                  <p className="text-[11px] text-slate-400 mt-1">
                    Mendukung nomor Indonesia (+62) dan internasional. Nomor digunakan untuk pengiriman proposal resmi.
                  </p>
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
          ) : (
            /* SUCCESS & WHATSAPP HANDOFF */
            <div className="py-2 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Kualifikasi Produksi Diterima
                </span>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-2">
                  Lanjutkan Diskusi Langsung via WhatsApp
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Tim Business Consultant Dreamlab siap memberikan rincian formula, sampel, dan penawaran resmi.
                </p>
              </div>

              {/* Delivery Summary Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 text-slate-500">
                  <span>Kode Konsultasi</span>
                  <span className="font-mono font-bold text-slate-900">{resultData?.inquiryReference}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Nama:</span>
                  <span className="font-semibold text-slate-900">{fullName}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Mau Buat Apa:</span>
                  <span className="font-semibold text-slate-900">{resolvedCategory}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Tier Produksi:</span>
                  <span className="font-bold text-[#1E3A8A]">
                    {resultData?.productionTierName} ({resultData?.requestedQuantityPcs.toLocaleString('id-ID')} pcs)
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>WhatsApp (E.164):</span>
                  <span className="font-mono font-medium text-slate-800">{phoneMeta.e164 || phoneInput}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-slate-500 text-[11px]">
                  <span>Konsultan Bertugas:</span>
                  <span className="font-medium text-emerald-700">
                    {resultData?.assignedSales?.name || 'Business Consultant Dreamlab'}
                  </span>
                </div>
              </div>

              {/* Direct WhatsApp CTA */}
              <a
                href={resultData?.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppHandoffClick}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-[#25D366] hover:bg-[#20bd5a] shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>Lanjut Chat WhatsApp dengan Tim Konsultan</span>
              </a>

              <p className="text-[11px] text-slate-400">
                Pesan WhatsApp sudah terisi otomatis dengan nama, kategori produk, tier produksi ({resultData?.productionTierName}), dan kode konsultasi Anda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
