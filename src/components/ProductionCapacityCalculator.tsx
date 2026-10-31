'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, Copy, Check, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ProductionCapacityCalculator() {
  const [targetDemand, setTargetDemand] = useState<number>(15000);
  const [readyStock, setReadyStock] = useState<number>(0);
  const [existingCapacity, setExistingCapacity] = useState<number>(10000);
  const [bufferPercent, setBufferPercent] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const calculations = useMemo(() => {
    const validTarget = Math.max(0, Math.round(targetDemand || 0));
    const validReady = Math.max(0, Math.round(readyStock || 0));
    const validExisting = Math.max(0, Math.round(existingCapacity || 0));
    const validBuffer = Math.min(100, Math.max(0, bufferPercent || 0));

    const adjustedDemand = Math.ceil(validTarget * (1 + validBuffer / 100));
    const remainingNeed = Math.max(0, adjustedDemand - validReady);
    const capacityGap = Math.max(0, remainingNeed - validExisting);
    const existingAllocation = Math.min(remainingNeed, validExisting);
    const unmetPercent = adjustedDemand > 0 ? (capacityGap / adjustedDemand) * 100 : 0;
    const existingCoveragePercent = adjustedDemand > 0 ? (existingAllocation / adjustedDemand) * 100 : 0;
    const readyStockPercent = adjustedDemand > 0 ? (Math.min(validReady, adjustedDemand) / adjustedDemand) * 100 : 0;

    return {
      validTarget,
      validReady,
      validExisting,
      validBuffer,
      adjustedDemand,
      remainingNeed,
      capacityGap,
      existingAllocation,
      unmetPercent,
      existingCoveragePercent,
      readyStockPercent,
    };
  }, [targetDemand, readyStock, existingCapacity, bufferPercent]);

  const formatNumber = (val: number) => val.toLocaleString('id-ID');

  const handleCopySummary = () => {
    const summary = `Ringkasan Simulasi Kebutuhan Kapasitas Produksi Tambahan:
- Target Kebutuhan: ${formatNumber(calculations.validTarget)} pcs
- Buffer Stok: ${calculations.validBuffer}% (Total Kebutuhan: ${formatNumber(calculations.adjustedDemand)} pcs)
- Stok Siap Jual Saat Ini: ${formatNumber(calculations.validReady)} pcs
- Kebutuhan Bersih Produksi: ${formatNumber(calculations.remainingNeed)} pcs
- Kapasitas Existing Teralokasi: ${formatNumber(calculations.existingAllocation)} pcs
- GAP KAPASITAS TAMBAHAN: ${formatNumber(calculations.capacityGap)} pcs (${calculations.unmetPercent.toFixed(1)}% kebutuhan belum terpenuhi)

Simulasi dilakukan via Kalkulator Kapasitas Dreamlab (https://dreamlab.id/jasa-maklon-kosmetik-kapasitas-produksi/)`;

    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="my-8 rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-xl md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-3 pb-6 border-b border-slate-200 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-[#D98A00]">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#D98A00]">Interactive Planning Tool</span>
            <h3 className="text-xl font-bold text-slate-900 md:text-2xl">Hitung Kebutuhan Kapasitas Produksi Tambahan</h3>
          </div>
        </div>
        <span className="self-start rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 md:self-auto">
          Peak Season &amp; Expansion
        </span>
      </div>

      {/* Form Inputs Grid */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-2 block text-xs font-bold text-slate-700">
            1. Target Kebutuhan (pcs)
          </label>
          <input
            type="number"
            min="0"
            step="500"
            value={targetDemand}
            onChange={(e) => setTargetDemand(Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#D98A00] focus:bg-white focus:ring-2 focus:ring-[#D98A00]/20"
            placeholder="Contoh: 15000"
          />
          <p className="mt-1 text-[11px] text-slate-500">Estimasi total demand penjualan</p>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold text-slate-700">
            2. Stok Siap Jual Saat Ini (pcs)
          </label>
          <input
            type="number"
            min="0"
            step="100"
            value={readyStock}
            onChange={(e) => setReadyStock(Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#D98A00] focus:bg-white focus:ring-2 focus:ring-[#D98A00]/20"
            placeholder="Contoh: 0"
          />
          <p className="mt-1 text-[11px] text-slate-500">Persediaan on-hand di gudang</p>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold text-slate-700">
            3. Kapasitas Existing Alokasi (pcs)
          </label>
          <input
            type="number"
            min="0"
            step="500"
            value={existingCapacity}
            onChange={(e) => setExistingCapacity(Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#D98A00] focus:bg-white focus:ring-2 focus:ring-[#D98A00]/20"
            placeholder="Contoh: 10000"
          />
          <p className="mt-1 text-[11px] text-slate-500">Slot yang disanggupi pabrik utama</p>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold text-slate-700">
            4. Buffer Stok Tambahan (%)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={bufferPercent}
              onChange={(e) => setBufferPercent(Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0)))}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 pr-8 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#D98A00] focus:bg-white focus:ring-2 focus:ring-[#D98A00]/20"
              placeholder="0"
            />
            <span className="pointer-events-none absolute right-3 top-2.5 text-sm font-bold text-slate-400">%</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Cadangan lonjakan campaign (0–100%)</p>
        </div>
      </div>

      {/* Output Calculation Cards */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-center">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Kebutuhan</span>
          <strong className="text-base sm:text-lg font-bold text-slate-900 block mt-1">
            {formatNumber(calculations.adjustedDemand)} <span className="text-xs font-normal text-slate-500">pcs</span>
          </strong>
          <span className="text-[10px] text-slate-400">Termasuk buffer</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-center">
          <span className="text-[11px] font-semibold text-slate-500 block">Kebutuhan Bersih</span>
          <strong className="text-base sm:text-lg font-bold text-slate-900 block mt-1">
            {formatNumber(calculations.remainingNeed)} <span className="text-xs font-normal text-slate-500">pcs</span>
          </strong>
          <span className="text-[10px] text-slate-400">Setelah potong stok</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-center">
          <span className="text-[11px] font-semibold text-slate-500 block">Kapasitas Existing</span>
          <strong className="text-base sm:text-lg font-bold text-slate-900 block mt-1">
            {formatNumber(calculations.existingAllocation)} <span className="text-xs font-normal text-slate-500">pcs</span>
          </strong>
          <span className="text-[10px] text-slate-400">Terserap maksimal</span>
        </div>

        <div className={`col-span-2 sm:col-span-1 rounded-xl border p-3.5 text-center ${
          calculations.capacityGap > 0 
            ? 'border-amber-300 bg-amber-50 text-amber-900' 
            : 'border-emerald-300 bg-emerald-50 text-emerald-900'
        }`}>
          <span className="text-[11px] font-extrabold uppercase tracking-wide block">
            Gap Kapasitas
          </span>
          <strong className="text-lg sm:text-xl font-extrabold block mt-1">
            {formatNumber(calculations.capacityGap)} <span className="text-xs font-normal">pcs</span>
          </strong>
          <span className="text-[10px] opacity-80">
            {calculations.capacityGap > 0 ? 'Butuh pabrik kedua' : 'Tercukupi'}
          </span>
        </div>

        <div className="col-span-2 sm:col-span-2 lg:col-span-1 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-center">
          <span className="text-[11px] font-semibold text-slate-500 block">% Belum Terpenuhi</span>
          <strong className={`text-base sm:text-lg font-bold block mt-1 ${calculations.capacityGap > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {calculations.unmetPercent.toFixed(1)}%
          </strong>
          <span className="text-[10px] text-slate-400">Dari total demand</span>
        </div>
      </div>

      {/* Visual Allocation Bar */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Komposisi Pemenuhan Kebutuhan Produk</span>
          <span>{formatNumber(calculations.adjustedDemand)} pcs total</span>
        </div>
        <div className="flex h-5 w-full overflow-hidden rounded-full bg-slate-200">
          {calculations.readyStockPercent > 0 && (
            <div
              style={{ width: `${Math.min(100, calculations.readyStockPercent)}%` }}
              className="bg-sky-500 text-[10px] font-bold text-white flex items-center justify-center transition-all duration-500"
              title={`Stok Siap: ${formatNumber(calculations.validReady)} pcs`}
            >
              {calculations.readyStockPercent >= 10 && 'Stok Siap'}
            </div>
          )}
          {calculations.existingCoveragePercent > 0 && (
            <div
              style={{ width: `${Math.min(100 - calculations.readyStockPercent, calculations.existingCoveragePercent)}%` }}
              className="bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center transition-all duration-500"
              title={`Pabrik Utama: ${formatNumber(calculations.existingAllocation)} pcs`}
            >
              {calculations.existingCoveragePercent >= 15 && 'Pabrik Utama'}
            </div>
          )}
          {calculations.unmetPercent > 0 && (
            <div
              style={{ width: `${calculations.unmetPercent}%` }}
              className="bg-amber-500 text-[10px] font-bold text-white flex items-center justify-center transition-all duration-500 animate-pulse"
              title={`Gap Tambahan: ${formatNumber(calculations.capacityGap)} pcs`}
            >
              {calculations.unmetPercent >= 12 && 'GAP TAMBAHAN'}
            </div>
          )}
        </div>
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-sky-500"></span>
            <span>Stok Gudang ({calculations.readyStockPercent.toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-600"></span>
            <span>Kapasitas Existing ({calculations.existingCoveragePercent.toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500"></span>
            <span className="font-bold text-amber-700">Gap Produksi Tambahan ({calculations.unmetPercent.toFixed(0)}%)</span>
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="mt-5">
        {calculations.capacityGap === 0 ? (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-emerald-900">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <strong>Kapasitas Manufaktur Existing Mencukupi:</strong> Berdasarkan asumsi target kebutuhan dan stok yang Anda masukkan, fasilitas utama Anda saat ini masih mampu meng-cover seluruh kebutuhan produksi tanpa kendala gap kapasitas.
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <strong>Terdapat Gap Kapasitas Sebesar {formatNumber(calculations.capacityGap)} Pcs:</strong> Fasilitas manufaktur utama Anda tidak dapat menyerap seluruh permintaan peak season ini. Anda membutuhkan partner maklon kosmetik tambahan dengan slot produksi siap pakai untuk mengamankan stok tepat waktu.
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-5 sm:flex-row">
        <button
          type="button"
          onClick={handleCopySummary}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 sm:w-auto"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Ringkasan Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Salin Ringkasan Kebutuhan Produksi</span>
            </>
          )}
        </button>

        <a
          href={`https://dreamlab.id/thankyou/google/?source=calculator-gap&target=${calculations.validTarget}&gap=${calculations.capacityGap}`}
          className="btn-calculator-cta inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D98A00] to-[#f0b830] px-6 py-3 text-xs sm:text-sm font-extrabold !text-white !no-underline shadow-lg shadow-amber-500/20 transition hover:brightness-105 hover:!text-white sm:w-auto"
          style={{ color: '#ffffff', textDecoration: 'none' }}
        >
          <span className="!text-white font-extrabold" style={{ color: '#ffffff' }}>Konsultasikan Kebutuhan Produksi Anda</span>
          <ArrowRight className="h-4 w-4 !text-white flex-shrink-0" style={{ color: '#ffffff', stroke: '#ffffff' }} />
        </a>
      </div>

      {/* Disclaimer */}
      <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
        <strong className="font-bold text-slate-500">Catatan:</strong> Hasil kalkulasi ini merupakan simulasi estimasi perencanaan produksi operasional internal brand Anda dan bukan merupakan konfirmasi ketersediaan slot kapasitas, komitmen waktu <strong>lead time</strong>, atau penawaran harga resmi dari Dreamlab. Evaluasi kapasitas aktual dilakukan berdasarkan sediaan, spesifikasi teknis, formula, kemasan, dan jadwal produksi riil.
      </p>
    </div>
  );
}
