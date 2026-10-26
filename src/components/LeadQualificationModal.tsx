'use client';

import React, { useState, useEffect } from 'react';
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

const CATEGORIES = ['Parfum', 'Skincare', 'Bodycare', 'Haircare', 'Lainnya'];

const QUANTITY_OPTIONS = [
  { value: '500–999 pcs', label: '500 – 999 pcs', badge: 'Rekomendasi MOQ', highlight: true },
  { value: '1.000–4.999 pcs', label: '1.000 – 4.999 pcs', badge: 'Skala Berkembang' },
  { value: '5.000+ pcs', label: '5.000+ pcs', badge: 'Skala Besar' },
  { value: '100–499 pcs', label: '100 – 499 pcs', badge: 'Uji Pasar' },
];

export function LeadQualificationModal({
  isOpen,
  onClose,
  defaultCategory = 'Parfum',
  source = 'meta-ads',
  channel = 'metaads',
  landingPage = '',
  campaign = '',
}: LeadQualificationModalProps) {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [category, setCategory] = useState<string>(defaultCategory);
  const [customProduct, setCustomProduct] = useState<string>('');
  const [quantityRange, setQuantityRange] = useState<string>('500–999 pcs');
  const [fullName, setFullName] = useState<string>('');
  const [whatsappPhone, setWhatsappPhone] = useState<string>('');
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

  const resolvedCategory = category === 'Lainnya' && customProduct.trim() ? customProduct.trim() : category;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Silakan isi nama lengkap Anda (minimal 2 karakter).');
      return;
    }

    const cleanPhone = whatsappPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      setError('Silakan masukkan nomor WhatsApp yang valid (contoh: 081234567890).');
      return;
    }

    if (!resolvedCategory) {
      setError('Silakan pilih jenis produk yang ingin Anda buat.');
      return;
    }

    if (!quantityRange) {
      setError('Silakan pilih estimasi kuantitas produksi (MOQ).');
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
          fullName: fullName.trim(),
          whatsappPhone: cleanPhone,
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
        assignedSales: data.assignedSales || { name: 'Business Consultant Dreamlab', phone: '' },
      });

      trackLeadEvent('qualification_completed', {
        source,
        channel,
        category: resolvedCategory,
        quantityRange,
        leadSegment: data.leadSegment,
        inquiryReference: data.inquiryReference,
        campaign,
      });

      setIsSuccess(true);
    } catch (err: any) {
      console.error('[LeadQualificationModal] Submit error:', err);
      setError(err?.message || 'Terjadi gangguan jaringan. Silakan periksa koneksi Anda dan coba lagi.');
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

    trackLeadEvent('whatsapp_handoff_clicked', {
      source,
      channel,
      category: resolvedCategory,
      quantityRange,
      inquiryReference: resultData.inquiryReference,
      campaign,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-auto transition-all transform scale-100">
        {/* Header */}
        <div className="relative px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Tutup form"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#D98A00]/20 text-[#F5A623] border border-[#D98A00]/40">
              Konsultasi Maklon Resmi
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            {isSuccess ? 'Rencana Produksi Siap Dikonsultasikan' : 'Konsultasikan Rencana Produksi Anda'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {isSuccess
              ? 'Terhubung langsung dengan tim Business Consultant Dreamlab.'
              : 'Dapatkan estimasi MOQ, kalkulasi biaya, dan sampel formula eksklusif.'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
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
              {/* 1. Mau Buat Produk Apa? */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                  1. Mau buat produk apa? <span className="text-red-500">*</span>
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
                            ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-sm'
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
                    placeholder="Sebutkan jenis produk Anda (misal: Lip Serum, Pomade...)"
                    className="mt-2.5 w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-[#D98A00] focus:ring-2 focus:ring-[#D98A00]/20 outline-none"
                    autoFocus
                  />
                )}
              </div>

              {/* 2. Mau Produksi Berapa? (MOQ) */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                  2. Mau produksi berapa pcs? (Rencana MOQ) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  {QUANTITY_OPTIONS.map((opt) => {
                    const isSelected = quantityRange === opt.value;
                    return (
                      <div
                        key={opt.value}
                        onClick={() => setQuantityRange(opt.value)}
                        className={`p-3 rounded-xl border cursor-pointer select-none transition-all relative ${
                          isSelected
                            ? 'bg-[#D98A00]/10 border-[#D98A00] ring-1 ring-[#D98A00]'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                              opt.highlight
                                ? 'bg-[#D98A00] text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {opt.badge}
                          </span>
                          <span
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-[#D98A00] bg-[#D98A00]' : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                          {opt.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Kontak (Nama & WhatsApp) */}
              <div className="space-y-3 pt-1 border-t border-slate-100">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1">
                    3. Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Rina Anggraini"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-[#D98A00] focus:ring-2 focus:ring-[#D98A00]/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1">
                    4. Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs sm:text-sm">
                      +62
                    </span>
                    <input
                      type="tel"
                      required
                      value={whatsappPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setWhatsappPhone(val);
                      }}
                      placeholder="81234567890"
                      className="w-full pl-12 pr-3.5 py-2.5 text-xs sm:text-sm font-mono rounded-xl border border-slate-200 focus:border-[#D98A00] focus:ring-2 focus:ring-[#D98A00]/20 outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Nomor digunakan untuk pengiriman estimasi penawaran dan konfirmasi sampel formula.
                  </p>
                </div>
              </div>

              {/* Persetujuan */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="consent-checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#D98A00] focus:ring-[#D98A00]"
                />
                <label htmlFor="consent-checkbox" className="text-[11px] text-slate-500 leading-tight">
                  Saya menyetujui dihubungi oleh tim konsultan Dreamlab mengenai rencana maklon dan penawaran terkait.{' '}
                  <Link href="/privacy-policy/" target="_blank" className="text-[#D98A00] underline">
                    Kebijakan Privasi
                  </Link>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#D98A00] to-[#F5A623] hover:from-[#c27b00] hover:to-[#e0961b] shadow-lg shadow-[#D98A00]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Menghubungkan ke Konsultan...</span>
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
            /* STEP 2: SUCCESS & WHATSAPP HANDOFF */
            <div className="py-2 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Data Konsultasi Berhasil Terkirim
                </span>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-2">
                  Lanjutkan Diskusi Langsung via WhatsApp
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Business Consultant Dreamlab siap memberikan rincian MOQ dan proposal formula produk Anda.
                </p>
              </div>

              {/* Delivery Summary Box */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 text-left text-xs space-y-1.5">
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-200 text-slate-500">
                  <span>Kode Konsultasi</span>
                  <span className="font-mono font-bold text-slate-800">{resultData?.inquiryReference}</span>
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
                  <span>Rencana MOQ:</span>
                  <span className="font-semibold text-[#D98A00]">{quantityRange}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200 text-slate-500 text-[11px]">
                  <span>Konsultan Bertugas:</span>
                  <span className="font-medium text-emerald-700">{resultData?.assignedSales?.name || 'Tim Konsultan'}</span>
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
                Pesan WhatsApp sudah terisi otomatis dengan nama, jenis produk, dan rencana kuantitas Anda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
