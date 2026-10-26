'use client';

import React, { useState, useEffect, useId } from 'react';
import Link from 'next/link';
import { trackLeadEvent } from '@/lib/lead-analytics';

export interface LeadQualificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
  source?: string;
  channel?: 'metaads' | 'google-ads' | 'other';
  landingPage?: string;
  campaign?: string;
}

const CATEGORIES = ['Skincare', 'Bodycare', 'Haircare', 'Makeup', 'Parfum', 'Other'];

const QUANTITY_OPTIONS = [
  '100–499 pcs',
  '500–999 pcs',
  '1.000–4.999 pcs',
  '5.000+ pcs',
  'Belum menentukan',
];

const BUDGET_OPTIONS = [
  'Di bawah Rp10 juta',
  'Rp10–15 juta',
  'Rp15–30 juta',
  'Di atas Rp30 juta',
  'Belum menentukan budget',
];

const TIMELINE_OPTIONS = [
  'Dalam 1 bulan',
  '1–3 bulan',
  '3–6 bulan',
  'Lebih dari 6 bulan',
  'Masih riset',
];

const BUSINESS_STATUS_OPTIONS = [
  'Sudah memiliki brand kosmetik',
  'Sedang mempersiapkan brand',
  'Baru mengeksplorasi bisnis',
];

export function LeadQualificationModal({
  isOpen,
  onClose,
  defaultCategory = 'Parfum',
  source = 'paid-ads',
  channel = 'metaads',
  landingPage = '',
  campaign = '',
}: LeadQualificationModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 4 = Success Screen
  const [category, setCategory] = useState<string>(defaultCategory);
  const [otherCategory, setOtherCategory] = useState<string>('');
  const [quantityRange, setQuantityRange] = useState<string>('');
  const [budgetRange, setBudgetRange] = useState<string>('');
  const [productionTimeline, setProductionTimeline] = useState<string>('');
  const [businessStatus, setBusinessStatus] = useState<string>('');
  
  // Step 3
  const [fullName, setFullName] = useState<string>('');
  const [whatsappPhone, setWhatsappPhone] = useState<string>('');
  const [brandOrCompany, setBrandOrCompany] = useState<string>('');
  const [consent, setConsent] = useState<boolean>(true);

  // Submission & Result state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<{
    inquiryReference: string;
    whatsappUrl: string;
    leadSegment: string;
    assignedSales: { name: string; phone: string };
  } | null>(null);

  // Keep default category synced
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
        category: category === 'Other' && otherCategory ? otherCategory : category,
        campaign,
      });
    }
  }, [isOpen]);

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

  const resolvedCategory = category === 'Other' && otherCategory.trim() ? otherCategory.trim() : category;

  const handleStep1Next = () => {
    setError(null);
    if (!resolvedCategory) {
      setError('Silakan pilih salah satu kategori produk.');
      return;
    }
    if (!quantityRange) {
      setError('Silakan pilih rencana kuantitas produksi Anda.');
      return;
    }

    trackLeadEvent('qualification_step_completed', {
      source,
      channel,
      step: 1,
      category: resolvedCategory,
      quantityRange,
      campaign,
    });
    setStep(2);
  };

  const handleStep2Next = () => {
    setError(null);
    if (!budgetRange) {
      setError('Silakan pilih estimasi budget produksi Anda.');
      return;
    }
    if (!productionTimeline) {
      setError('Silakan pilih rencana timeline produksi Anda.');
      return;
    }
    if (!businessStatus) {
      setError('Silakan pilih status kesiapan bisnis Anda.');
      return;
    }

    trackLeadEvent('qualification_step_completed', {
      source,
      channel,
      step: 2,
      category: resolvedCategory,
      quantityRange,
      campaign,
    });
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Nama lengkap wajib diisi (minimal 2 huruf).');
      return;
    }

    const cleanPhone = whatsappPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      setError('Nomor WhatsApp tidak valid. Masukkan nomor yang benar (misal: 081234567890).');
      return;
    }

    if (!consent) {
      setError('Harap setujui persetujuan kontak untuk melanjutkan konsultasi.');
      return;
    }

    setSubmitting(true);

    try {
      // Gather attribution parameters from URL
      const searchParams = new URLSearchParams(window.location.search);
      const utmSource = searchParams.get('utm_source') || undefined;
      const utmMedium = searchParams.get('utm_medium') || undefined;
      const utmCampaign = searchParams.get('utm_campaign') || campaign || undefined;
      const utmContent = searchParams.get('utm_content') || undefined;
      const utmTerm = searchParams.get('utm_term') || undefined;
      const gclid = searchParams.get('gclid') || undefined;
      const fbclid = searchParams.get('fbclid') || undefined;

      // Visitor fingerprint if available
      let visitorId = '';
      try {
        visitorId = localStorage.getItem('dl_visitor_id') || localStorage.getItem('dreamlab_vid_client') || '';
      } catch {
        /* ignore */
      }

      const res = await fetch('/api/leads/qualify/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: resolvedCategory,
          quantityRange,
          budgetRange,
          productionTimeline,
          businessStatus,
          fullName: fullName.trim(),
          whatsappPhone: cleanPhone,
          brandOrCompany: brandOrCompany.trim() || undefined,
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
        assignedSales: data.assignedSales,
      });

      // Track successful submission
      trackLeadEvent('qualification_submitted', {
        source,
        channel,
        step: 3,
        category: resolvedCategory,
        quantityRange,
        leadSegment: data.leadSegment,
        inquiryReference: data.inquiryReference,
        campaign: utmCampaign,
      });

      // Move to Success Handoff screen
      setStep(4);
    } catch (err: any) {
      console.error('[LeadQualificationModal] Submit error:', err);
      setError(err?.message || 'Terjadi gangguan jaringan. Mohon periksa koneksi Anda dan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (!resultData?.whatsappUrl) return;

    // Log the click separately
    try {
      fetch('/api/leads/qualify/wa-click/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inquiryReference: resultData.inquiryReference }),
        keepalive: true,
      });
    } catch {
      /* ignore */
    }

    trackLeadEvent('whatsapp_clicked', {
      source,
      channel,
      category: resolvedCategory,
      quantityRange,
      leadSegment: resultData.leadSegment,
      inquiryReference: resultData.inquiryReference,
    });

    window.open(resultData.whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Brand Accent & Progress */}
        <div className="bg-gradient-to-r from-[#FAF9F6] via-white to-[#FFF8F0] px-6 pt-6 pb-4 border-b border-neutral-100 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D98A00] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#D98A00]">
                {step === 4 ? 'Formulir Diterima' : `Konsultasi Produksi — Langkah ${step} dari 3`}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
              aria-label="Tutup Formulir"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar (hidden on success) */}
          {step < 4 && (
            <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#D98A00] h-full transition-all duration-300 rounded-full"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Scrollable Form Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-start gap-2.5">
              <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* ================= STEP 1: PRODUCTION NEEDS ================= */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 id="modal-headline" className="text-xl sm:text-2xl font-black text-neutral-900 leading-tight">
                  Yuk, Ceritakan Produk yang Ingin Anda Buat
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                  Bantu tim Dreamlab memahami kebutuhan Anda agar konsultasi lebih tepat.
                </p>
              </div>

              {/* Product Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Kategori Produk
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = category === cat;
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 text-left flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#FFF9F0] border-[#D98A00] text-[#D98A00] shadow-sm font-bold'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <span>{cat}</span>
                        {isSelected && <span className="text-[#D98A00] font-black text-xs">✓</span>}
                      </button>
                    );
                  })}
                </div>

                {category === 'Other' && (
                  <input
                    type="text"
                    value={otherCategory}
                    onChange={(e) => setOtherCategory(e.target.value)}
                    placeholder="Tuliskan jenis produk Anda..."
                    className="mt-2.5 w-full text-xs sm:text-sm px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#D98A00]"
                  />
                )}
              </div>

              {/* Planned Production Quantity */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Rencana Kuantitas Produksi
                </label>
                <div className="space-y-2">
                  {QUANTITY_OPTIONS.map((qty) => {
                    const isSelected = quantityRange === qty;
                    return (
                      <button
                        type="button"
                        key={qty}
                        onClick={() => setQuantityRange(qty)}
                        className={`w-full py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 text-left flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#FFF9F0] border-[#D98A00] text-[#D98A00] shadow-sm font-bold'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <span>{qty}</span>
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#D98A00] bg-[#D98A00]' : 'border-neutral-300'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleStep1Next}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#D98A00] hover:bg-[#B87500] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[#D98A00]/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Lanjut ke Kesiapan Produksi &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: BUSINESS & READINESS ================= */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 leading-tight">
                  Seberapa Siap Rencana Produksi Anda?
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                  Informasi ini membantu kami menyiapkan formulasi dan simulasi biaya yang realistis.
                </p>
              </div>

              {/* Estimated Production Budget */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Estimasi Budget Produksi
                </label>
                <div className="space-y-1.5">
                  {BUDGET_OPTIONS.map((bgt) => {
                    const isSelected = budgetRange === bgt;
                    return (
                      <button
                        type="button"
                        key={bgt}
                        onClick={() => setBudgetRange(bgt)}
                        className={`w-full py-2.5 px-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all text-left flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#FFF9F0] border-[#D98A00] text-[#D98A00] font-bold shadow-sm'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <span>{bgt}</span>
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#D98A00] bg-[#D98A00]' : 'border-neutral-300'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Planned Timeline */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Target Timeline Peluncuran
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TIMELINE_OPTIONS.map((tml) => {
                    const isSelected = productionTimeline === tml;
                    return (
                      <button
                        type="button"
                        key={tml}
                        onClick={() => setProductionTimeline(tml)}
                        className={`py-2 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all text-left flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#FFF9F0] border-[#D98A00] text-[#D98A00] font-bold shadow-sm'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <span>{tml}</span>
                        {isSelected && <span className="text-[#D98A00] text-xs">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Business Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Status Bisnis Anda
                </label>
                <div className="space-y-1.5">
                  {BUSINESS_STATUS_OPTIONS.map((status) => {
                    const isSelected = businessStatus === status;
                    return (
                      <button
                        type="button"
                        key={status}
                        onClick={() => setBusinessStatus(status)}
                        className={`w-full py-2.5 px-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all text-left flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#FFF9F0] border-[#D98A00] text-[#D98A00] font-bold shadow-sm'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <span>{status}</span>
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#D98A00] bg-[#D98A00]' : 'border-neutral-300'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-4 rounded-2xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 font-bold text-sm transition-colors"
                >
                  &larr; Kembali
                </button>
                <button
                  type="button"
                  onClick={handleStep2Next}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-[#D98A00] hover:bg-[#B87500] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[#D98A00]/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Lanjut ke Informasi Kontak &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: CONTACT INFORMATION ================= */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 leading-tight">
                  Hubungkan dengan Tim Dreamlab
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                  Tim Business Development Dreamlab akan menyiapkan ringkasan konsultasi sesuai data Anda.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Jessica Angeline"
                  className="w-full text-xs sm:text-sm px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#D98A00] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-semibold">
                    🇮🇩 +62
                  </span>
                  <input
                    type="tel"
                    required
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="81234567890"
                    className="w-full text-xs sm:text-sm pl-16 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#D98A00] transition-colors"
                  />
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Digunakan untuk konfirmasi dan chat konsultasi via WhatsApp resmi Dreamlab.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Nama Brand atau Perusahaan <span className="text-neutral-400 font-normal">(Opsional)</span>
                </label>
                <input
                  type="text"
                  value={brandOrCompany}
                  onChange={(e) => setBrandOrCompany(e.target.value)}
                  placeholder="Contoh: Glow Studio / Belum Ada"
                  className="w-full text-xs sm:text-sm px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#D98A00] transition-colors"
                />
              </div>

              {/* Privacy Policy & Consent */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-neutral-600">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 rounded text-[#D98A00] focus:ring-[#D98A00] border-neutral-300"
                  />
                  <span>
                    Saya menyetujui data ini digunakan tim Dreamlab untuk konsultasi &amp; penawaran resmi.{' '}
                    <Link
                      href="/privacy-policy/"
                      target="_blank"
                      className="text-[#D98A00] underline font-semibold hover:text-[#B87500]"
                    >
                      Kebijakan Privasi
                    </Link>
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setStep(2)}
                  className="py-3 px-4 rounded-2xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 font-bold text-sm transition-colors"
                >
                  &larr; Kembali
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-[#D98A00] hover:bg-[#B87500] disabled:bg-neutral-300 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[#D98A00]/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Menyimpan Rencana...</span>
                    </>
                  ) : (
                    <span>Lanjut Konsultasi via WhatsApp &rarr;</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 4: SUCCESS & WA HANDOFF ================= */}
          {step === 4 && resultData && (
            <div className="py-2 text-center space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-mono font-bold text-[#D98A00] mb-2.5">
                  Kode Konsultasi: {resultData.inquiryReference}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 leading-tight">
                  Terima Kasih! Rencana Produksi Anda Sudah Kami Terima.
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-md mx-auto leading-relaxed">
                  Selanjutnya, Anda bisa melanjutkan konsultasi bersama tim Dreamlab melalui WhatsApp.
                </p>
              </div>

              {/* Consultation Summary Box */}
              <div className="bg-[#FAF9F6] border border-neutral-200/80 rounded-2xl p-4 text-left text-xs space-y-2">
                <div className="flex justify-between items-center text-neutral-500 pb-1.5 border-b border-neutral-200/50">
                  <span>Kategori Produk</span>
                  <span className="font-bold text-neutral-800">{resolvedCategory}</span>
                </div>
                <div className="flex justify-between items-center text-neutral-500 pb-1.5 border-b border-neutral-200/50">
                  <span>Estimasi Produksi</span>
                  <span className="font-bold text-neutral-800">{quantityRange}</span>
                </div>
                <div className="flex justify-between items-center text-neutral-500">
                  <span>Dedicated BD Support</span>
                  <span className="font-bold text-neutral-800">{resultData.assignedSales.name}</span>
                </div>
              </div>

              {/* Action Button: Lanjut ke WhatsApp */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppClick}
                  className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-sm sm:text-base shadow-xl shadow-[#25D366]/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.019-5.117-2.875-6.976C16.592 1.899 14.116.88 11.986.88 6.548.88 2.122 5.3 2.119 10.74c-.002 1.706.452 3.37 1.312 4.848l-.994 3.629 3.73-.973zm11.366-6.726c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                  </svg>
                  <span>Lanjut ke WhatsApp</span>
                </button>
                <p className="text-[11px] text-neutral-400 mt-2">
                  Format pesan konsultasi otomatis terisi rapi di aplikasi WhatsApp Anda.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
