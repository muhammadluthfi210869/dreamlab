'use client';

import React, { useState, useMemo, useRef, useId } from 'react';
import { LeadQualificationModal } from './LeadQualificationModal';

export const PRODUCTS = [
  'Body Lotion',
  'Body Wash',
  'Body Scrub',
  'Body Serum',
  'Body Butter',
  'Body Oil',
  'Shower Gel',
  'Deodorant',
] as const;

export type BodycareProduct = (typeof PRODUCTS)[number];
export type HppCalculatorMode = 'quick' | 'detail';

export const CHANNELS = [
  { name: 'Marketplace', cut: 12 },
  { name: 'Reseller / agen', cut: 30 },
  { name: 'Website / WA langsung', cut: 3 },
];

export const QTY_PRESETS = [500, 1000, 2000, 5000];

export const BUDGET_BUCKETS: [number, string][] = [
  [25e6, '< 25 Juta'],
  [50e6, '25–50 Juta'],
  [100e6, '50–100 Juta'],
  [250e6, '100–250 Juta'],
  [500e6, '250–500 Juta'],
  [Infinity, '> 500 Juta'],
];

export type CalcInput = {
  price: number;
  channelCut: number;
  marketing: number;
  ops: number;
  margin: number;
  qty: number;
};

export type QuickCalcInput = {
  price: number;
  hppPct: number;
  qty: number;
};

export function calcHpp(s: CalcInput) {
  const net = s.price * (1 - s.channelCut / 100);
  const hpp = net - (s.price * (s.marketing + s.ops + s.margin)) / 100;
  return {
    net,
    hpp,
    ratio: hpp / s.price,
    modal: hpp * s.qty,
    labaPerPcs: (s.price * s.margin) / 100,
    segments: [
      { label: 'Potongan channel', value: (s.price * s.channelCut) / 100 },
      { label: 'Marketing', value: (s.price * s.marketing) / 100 },
      { label: 'Operasional', value: (s.price * s.ops) / 100 },
      { label: 'Margin', value: (s.price * s.margin) / 100 },
      { label: 'HPP (target)', value: hpp },
    ],
    valid: s.price > 0 && hpp > 0,
  };
}

export function calcHppQuick(s: QuickCalcInput) {
  const targetHpp = (s.price * s.hppPct) / 100;
  const total = targetHpp * s.qty;
  const sisaPerUnit = s.price - targetHpp;
  return {
    hpp: targetHpp,
    targetHpp,
    ratio: s.price > 0 ? targetHpp / s.price : 0,
    total,
    modal: total,
    sisaPerUnit,
    segments: [
      { label: 'HPP (target)', value: targetHpp },
      { label: 'Sisa nilai per unit sebelum biaya lain', value: sisaPerUnit },
    ],
    valid: s.price > 0 && targetHpp > 0 && s.hppPct > 0 && s.hppPct < 100,
  };
}

export const budgetBucket = (modal: number) =>
  BUDGET_BUCKETS.find(([max]) => modal < max)![1];

export const waLine = (product: string, price: number, hpp: number, qty: number) =>
  `Simulasi HPP: ${product}, harga jual Rp${Math.round(price).toLocaleString('id-ID')}, target HPP Rp${Math.round(hpp).toLocaleString('id-ID')}/pcs, ${qty.toLocaleString('id-ID')} pcs.`;

const idrFormatter = new Intl.NumberFormat('id-ID');
const formatRp = (n: number) => `Rp${idrFormatter.format(Math.round(n))}`;

const SEGMENT_COLORS: Record<string, { bar: string; dot: string }> = {
  'Potongan channel': { bar: 'bg-slate-400', dot: 'bg-slate-400' },
  Marketing: { bar: 'bg-sky-500', dot: 'bg-sky-500' },
  Operasional: { bar: 'bg-indigo-400', dot: 'bg-indigo-400' },
  Margin: { bar: 'bg-emerald-500', dot: 'bg-emerald-500' },
  'HPP (target)': {
    bar: 'bg-gradient-to-r from-[#D98A00] to-[#f0b830]',
    dot: 'bg-[#D98A00]',
  },
  'Sisa nilai per unit sebelum biaya lain': {
    bar: 'bg-emerald-500',
    dot: 'bg-emerald-500',
  },
};

export interface HppCalculatorProps {
  defaultMode?: HppCalculatorMode;
}

export default function HppCalculator({ defaultMode = 'detail' }: HppCalculatorProps) {
  const uid = useId();
  const [mode, setMode] = useState<HppCalculatorMode>(defaultMode);
  const [product, setProduct] = useState<BodycareProduct>('Body Lotion');
  const [price, setPrice] = useState<number>(100000);
  const [priceInputText, setPriceInputText] = useState<string>('100.000');

  // Quick mode percentage (10-60%, default 30%)
  const [hppPct, setHppPct] = useState<number>(30);

  // Detail mode percentages
  const [channelCut, setChannelCut] = useState<number>(12);
  const [marketing, setMarketing] = useState<number>(20);
  const [ops, setOps] = useState<number>(5);
  const [margin, setMargin] = useState<number>(30);

  // Quantity defaults: 500 in quick mode, 1000 in detail mode
  const initialQty = defaultMode === 'quick' ? 500 : 1000;
  const [qty, setQty] = useState<number>(initialQty);
  const [qtyInputText, setQtyInputText] = useState<string>(
    idrFormatter.format(initialQty)
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const hasTrackedUsageRef = useRef<boolean>(false);

  const detailCalc = useMemo(
    () => calcHpp({ price, channelCut, marketing, ops, margin, qty }),
    [price, channelCut, marketing, ops, margin, qty]
  );

  const quickCalc = useMemo(
    () => calcHppQuick({ price, hppPct, qty }),
    [price, hppPct, qty]
  );

  const activeValid = mode === 'quick' ? quickCalc.valid : detailCalc.valid;
  const activeHpp = mode === 'quick' ? quickCalc.hpp : detailCalc.hpp;
  const activeRatio = mode === 'quick' ? quickCalc.ratio : detailCalc.ratio;
  const activeModal = mode === 'quick' ? quickCalc.modal : detailCalc.modal;

  const fireFirstInteraction = (
    nextMode: HppCalculatorMode,
    nextProduct: string,
    nextPrice: number,
    nextTargetHpp: number,
    nextQty: number
  ) => {
    try {
      sessionStorage.setItem(
        'dl_hpp_calc_last',
        JSON.stringify({
          mode: nextMode,
          product: nextProduct,
          price: nextPrice,
          targetHpp: nextTargetHpp,
          qty: nextQty,
        })
      );
    } catch {
      /* ignore storage errors */
    }

    if (hasTrackedUsageRef.current) return;
    hasTrackedUsageRef.current = true;

    if (typeof window !== 'undefined') {
      const w = window as unknown as {
        dataLayer?: Array<Record<string, unknown>>;
        fbq?: (...args: unknown[]) => void;
      };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({
        event: 'hpp_calculator_used',
        mode: nextMode,
        product: nextProduct,
        selling_price: nextPrice,
        target_hpp: Math.round(nextTargetHpp),
        quantity: nextQty,
      });

      if (typeof w.fbq === 'function') {
        w.fbq('trackCustom', 'HppCalculatorUsed', {
          product: nextProduct,
          mode: nextMode,
          content_category: 'Bodycare',
        });
      }
    }
  };

  const handleModeSwitch = (nextMode: HppCalculatorMode) => {
    setMode(nextMode);
    const nextTargetHpp =
      nextMode === 'quick'
        ? calcHppQuick({ price, hppPct, qty }).hpp
        : calcHpp({ price, channelCut, marketing, ops, margin, qty }).hpp;
    fireFirstInteraction(nextMode, product, price, nextTargetHpp, qty);
  };

  const handleProductSelect = (p: BodycareProduct) => {
    setProduct(p);
    fireFirstInteraction(mode, p, price, activeHpp, qty);
  };

  const handlePriceInput = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    const numeric = digits ? parseInt(digits, 10) : 0;
    setPrice(numeric);
    setPriceInputText(digits ? idrFormatter.format(numeric) : '');
    const nextHpp =
      mode === 'quick'
        ? calcHppQuick({ price: numeric, hppPct, qty }).hpp
        : calcHpp({ price: numeric, channelCut, marketing, ops, margin, qty }).hpp;
    fireFirstInteraction(mode, product, numeric, nextHpp, qty);
  };

  const handlePriceSlider = (val: number) => {
    setPrice(val);
    setPriceInputText(idrFormatter.format(val));
    const nextHpp =
      mode === 'quick'
        ? calcHppQuick({ price: val, hppPct, qty }).hpp
        : calcHpp({ price: val, channelCut, marketing, ops, margin, qty }).hpp;
    fireFirstInteraction(mode, product, val, nextHpp, qty);
  };

  const handleHppPctChange = (val: number) => {
    setHppPct(val);
    const nextHpp = calcHppQuick({ price, hppPct: val, qty }).hpp;
    fireFirstInteraction(mode, product, price, nextHpp, qty);
  };

  const handleChannelChip = (cut: number) => {
    setChannelCut(cut);
    const nextHpp = calcHpp({
      price,
      channelCut: cut,
      marketing,
      ops,
      margin,
      qty,
    }).hpp;
    fireFirstInteraction(mode, product, price, nextHpp, qty);
  };

  const handleChannelInput = (raw: string) => {
    const cleaned = raw.replace(/[^\d.]/g, '');
    const parsed = cleaned === '' ? 0 : Math.min(90, Math.max(0, Number(cleaned)));
    setChannelCut(parsed);
    const nextHpp = calcHpp({
      price,
      channelCut: parsed,
      marketing,
      ops,
      margin,
      qty,
    }).hpp;
    fireFirstInteraction(mode, product, price, nextHpp, qty);
  };

  const handleMarketingChange = (val: number) => {
    setMarketing(val);
    const nextHpp = calcHpp({
      price,
      channelCut,
      marketing: val,
      ops,
      margin,
      qty,
    }).hpp;
    fireFirstInteraction(mode, product, price, nextHpp, qty);
  };

  const handleOpsChange = (val: number) => {
    setOps(val);
    const nextHpp = calcHpp({
      price,
      channelCut,
      marketing,
      ops: val,
      margin,
      qty,
    }).hpp;
    fireFirstInteraction(mode, product, price, nextHpp, qty);
  };

  const handleMarginChange = (val: number) => {
    setMargin(val);
    const nextHpp = calcHpp({
      price,
      channelCut,
      marketing,
      ops,
      margin: val,
      qty,
    }).hpp;
    fireFirstInteraction(mode, product, price, nextHpp, qty);
  };

  const handleQtyPreset = (preset: number) => {
    setQty(preset);
    setQtyInputText(idrFormatter.format(preset));
    fireFirstInteraction(mode, product, price, activeHpp, preset);
  };

  const handleQtyInput = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    const numeric = digits ? Math.max(1, parseInt(digits, 10)) : 0;
    setQty(numeric);
    setQtyInputText(digits ? idrFormatter.format(numeric) : '');
    fireFirstInteraction(mode, product, price, activeHpp, numeric);
  };

  const handleCtaClick = () => {
    const bucket = budgetBucket(activeModal);
    if (typeof window !== 'undefined') {
      const w = window as unknown as {
        dataLayer?: Array<Record<string, unknown>>;
      };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({
        event: 'hpp_calculator_cta',
        mode,
        product,
        target_hpp: Math.round(activeHpp),
        quantity: qty,
        budget_bucket: bucket,
      });
    }
    setIsModalOpen(true);
  };

  const sliderPriceValue = Math.min(500000, Math.max(20000, price || 20000));
  const currentBucket = activeValid ? budgetBucket(activeModal) : '< 25 Juta';
  const currentWaLine = activeValid ? waLine(product, price, activeHpp, qty) : '';

  const healthHint = useMemo(() => {
    if (!activeValid) return null;
    if (activeRatio < 0.15) {
      return {
        tone: 'warn' as const,
        text: 'Ruang HPP cukup sempit. Pertimbangkan kemasan standar atau ukuran yang lebih efisien.',
      };
    }
    if (activeRatio <= 0.35) {
      return {
        tone: 'ok' as const,
        text: 'Ruang HPP umum untuk brand bodycare. Masih ada fleksibilitas memilih formula dan kemasan.',
      };
    }
    return {
      tone: 'neutral' as const,
      text: 'Ruang HPP longgar. Pastikan margin dan budget marketing sudah realistis.',
    };
  }, [activeValid, activeRatio]);

  return (
    <section
      aria-label="Kalkulator Target HPP Bodycare"
      className="my-8 rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-md not-prose"
    >
      {/* Header + Mode Toggle */}
      <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <span className="inline-block rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#D98A00]">
            Simulasi Perencanaan Bisnis
          </span>
          <div className="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
            Kalkulator Target HPP Brand Bodycare
          </div>
          <div className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {mode === 'quick'
              ? 'Mode Cepat: hitung target HPP langsung dari harga jual × persentase target HPP.'
              : 'Hitung mundur batas maksimal HPP per pcs dari target harga jual, potongan channel, marketing, operasional, dan margin.'}
          </div>
        </div>

        {/* Two-option mode toggle */}
        <div
          role="group"
          aria-label="Pilih mode kalkulator HPP"
          className="inline-flex shrink-0 rounded-xl border border-slate-200 bg-slate-100 p-1 self-start"
        >
          <button
            type="button"
            aria-pressed={mode === 'quick'}
            onClick={() => handleModeSwitch('quick')}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D98A00] ${
              mode === 'quick'
                ? 'bg-gradient-to-r from-[#D98A00] to-[#f0b830] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Mode Cepat
          </button>
          <button
            type="button"
            aria-pressed={mode === 'detail'}
            onClick={() => handleModeSwitch('detail')}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D98A00] ${
              mode === 'detail'
                ? 'bg-gradient-to-r from-[#D98A00] to-[#f0b830] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Mode Detail
          </button>
        </div>
      </div>

      {/* Stacked Layout Optimized for Article Column Width */}
      <div className="space-y-6">
        {/* TOP SECTION: INPUTS */}
        <div className="rounded-2xl border border-slate-200/80 bg-[#FAF9F6] p-4 sm:p-6 space-y-5">
          {/* 1. Jenis Produk */}
          <div>
            <span
              id={`${uid}-product-label`}
              className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-2.5"
            >
              1. Jenis produk
            </span>
            <div
              role="group"
              aria-labelledby={`${uid}-product-label`}
              className="flex flex-wrap gap-2"
            >
              {PRODUCTS.map((item) => {
                const active = product === item;
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={active}
                    onClick={() => handleProductSelect(item)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border focus:outline-none focus:ring-2 focus:ring-[#D98A00] ${
                      active
                        ? 'bg-gradient-to-r from-[#D98A00] to-[#f0b830] text-white border-[#D98A00] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:bg-amber-50/40'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Target Harga Jual */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <label
                htmlFor={`${uid}-price-input`}
                className="text-xs sm:text-sm font-extrabold text-slate-800"
              >
                2. Target harga jual ke konsumen (Rp/pcs)
              </label>
              <span className="text-xs font-bold text-[#9a6200] whitespace-nowrap">
                {formatRp(price)} / pcs
              </span>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-extrabold text-slate-500">
                Rp
              </span>
              <input
                id={`${uid}-price-input`}
                type="text"
                inputMode="numeric"
                value={priceInputText}
                onChange={(e) => handlePriceInput(e.target.value)}
                aria-describedby={`${uid}-price-slider-hint`}
                className="w-full rounded-xl border border-slate-300 bg-white pl-11 pr-16 py-2.5 text-base font-extrabold text-slate-900 tabular-nums focus:border-[#D98A00] focus:outline-none focus:ring-2 focus:ring-[#D98A00]/25"
                placeholder="100.000"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                / pcs
              </span>
            </div>
            <input
              id={`${uid}-price-slider`}
              type="range"
              aria-label="Slider target harga jual ke konsumen"
              min={20000}
              max={500000}
              step={1000}
              value={sliderPriceValue}
              onChange={(e) => handlePriceSlider(Number(e.target.value))}
              className="mt-2.5 w-full accent-[#D98A00] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D98A00]/30 rounded-lg"
            />
            <div
              id={`${uid}-price-slider-hint`}
              className="flex justify-between text-[11px] font-medium text-slate-500 mt-0.5 tabular-nums"
            >
              <span>Rp20.000</span>
              <span>Rp250.000</span>
              <span>Rp500.000</span>
            </div>
          </div>

          {mode === 'quick' ? (
            /* QUICK MODE: 3. Persentase Target HPP */
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <label
                  htmlFor={`${uid}-hpp-pct`}
                  className="text-xs sm:text-sm font-extrabold text-slate-800"
                >
                  3. Persentase target HPP (% dari harga jual)
                </label>
                <span className="inline-block rounded-lg bg-amber-500/15 px-2.5 py-1 text-xs font-extrabold text-[#9a6200] whitespace-nowrap tabular-nums">
                  {hppPct}% · {formatRp((price * hppPct) / 100)}
                </span>
              </div>
              <input
                id={`${uid}-hpp-pct`}
                type="range"
                min={10}
                max={60}
                step={1}
                value={hppPct}
                onChange={(e) => handleHppPctChange(Number(e.target.value))}
                className="w-full accent-[#D98A00] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D98A00]/30 rounded-lg"
              />
              <div className="flex justify-between text-[11px] font-medium text-slate-500 mt-0.5 tabular-nums">
                <span>10%</span>
                <span>30% (umum)</span>
                <span>60%</span>
              </div>
            </div>
          ) : (
            /* DETAIL MODE: Channel, Marketing, Operasional, Margin */
            <>
              {/* 3. Channel Penjualan Utama */}
              <div>
                <span
                  id={`${uid}-channel-label`}
                  className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-2.5"
                >
                  3. Channel penjualan utama &amp; potongan channel
                </span>
                <div
                  role="group"
                  aria-labelledby={`${uid}-channel-label`}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-2.5"
                >
                  {CHANNELS.map((ch) => {
                    const isSelected = channelCut === ch.cut;
                    return (
                      <button
                        key={ch.name}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => handleChannelChip(ch.cut)}
                        className={`px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-[#D98A00] ${
                          isSelected
                            ? 'border-[#D98A00] bg-amber-50 text-slate-900 shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xs font-bold leading-snug">
                          {ch.name}
                        </span>
                        <span className="shrink-0 rounded-md bg-amber-500/15 px-2 py-0.5 text-xs font-extrabold text-[#9a6200] tabular-nums">
                          {ch.cut}%
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2">
                  <label
                    htmlFor={`${uid}-channel-cut`}
                    className="text-xs font-semibold text-slate-600"
                  >
                    Potongan channel (%) — bisa diubah manual:
                  </label>
                  <div className="relative w-24 shrink-0">
                    <input
                      id={`${uid}-channel-cut`}
                      type="number"
                      min={0}
                      max={90}
                      step={1}
                      value={channelCut}
                      onChange={(e) => handleChannelInput(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 pr-6 text-right text-xs sm:text-sm font-extrabold text-slate-900 tabular-nums focus:border-[#D98A00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D98A00]/25"
                    />
                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* 4, 5, 6. Sliders in a Clean White Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
                {/* 4. Biaya Marketing */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label
                      htmlFor={`${uid}-marketing`}
                      className="text-xs sm:text-sm font-extrabold text-slate-800"
                    >
                      4. Biaya marketing (% harga jual)
                    </label>
                    <span className="inline-block rounded-lg bg-amber-500/15 px-2.5 py-0.5 text-xs font-extrabold text-[#9a6200] whitespace-nowrap tabular-nums">
                      {marketing}% · {formatRp((price * marketing) / 100)}
                    </span>
                  </div>
                  <input
                    id={`${uid}-marketing`}
                    type="range"
                    min={0}
                    max={50}
                    step={1}
                    value={marketing}
                    onChange={(e) => handleMarketingChange(Number(e.target.value))}
                    className="w-full accent-[#D98A00] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D98A00]/30 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] font-medium text-slate-400 tabular-nums">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                  </div>
                </div>

                {/* 5. Biaya Operasional & Pengiriman */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label
                      htmlFor={`${uid}-ops`}
                      className="text-xs sm:text-sm font-extrabold text-slate-800"
                    >
                      5. Biaya operasional &amp; pengiriman (%)
                    </label>
                    <span className="inline-block rounded-lg bg-amber-500/15 px-2.5 py-0.5 text-xs font-extrabold text-[#9a6200] whitespace-nowrap tabular-nums">
                      {ops}% · {formatRp((price * ops) / 100)}
                    </span>
                  </div>
                  <input
                    id={`${uid}-ops`}
                    type="range"
                    min={0}
                    max={20}
                    step={1}
                    value={ops}
                    onChange={(e) => handleOpsChange(Number(e.target.value))}
                    className="w-full accent-[#D98A00] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D98A00]/30 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] font-medium text-slate-400 tabular-nums">
                    <span>0%</span>
                    <span>10%</span>
                    <span>20%</span>
                  </div>
                </div>

                {/* 6. Target Margin Keuntungan */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label
                      htmlFor={`${uid}-margin`}
                      className="text-xs sm:text-sm font-extrabold text-slate-800"
                    >
                      6. Target margin keuntungan (%)
                    </label>
                    <span className="inline-block rounded-lg bg-amber-500/15 px-2.5 py-0.5 text-xs font-extrabold text-[#9a6200] whitespace-nowrap tabular-nums">
                      {margin}% · {formatRp((price * margin) / 100)}
                    </span>
                  </div>
                  <input
                    id={`${uid}-margin`}
                    type="range"
                    min={5}
                    max={60}
                    step={1}
                    value={margin}
                    onChange={(e) => handleMarginChange(Number(e.target.value))}
                    className="w-full accent-[#D98A00] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D98A00]/30 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] font-medium text-slate-400 tabular-nums">
                    <span>5%</span>
                    <span>30%</span>
                    <span>60%</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Jumlah Produksi Pertama */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <label
                htmlFor={`${uid}-qty-input`}
                className="text-xs sm:text-sm font-extrabold text-slate-800"
              >
                {mode === 'quick' ? '4' : '7'}. Jumlah produksi pertama (pcs)
              </label>
              <span className="text-xs font-bold text-[#9a6200] whitespace-nowrap tabular-nums">
                {idrFormatter.format(qty)} pcs
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {QTY_PRESETS.map((preset) => {
                const isSelected = qty === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleQtyPreset(preset)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border whitespace-nowrap transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D98A00] ${
                      isSelected
                        ? 'border-[#D98A00] bg-gradient-to-r from-[#D98A00] to-[#f0b830] text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {idrFormatter.format(preset)} pcs
                  </button>
                );
              })}
              <div className="relative flex-1 min-w-[140px]">
                <input
                  id={`${uid}-qty-input`}
                  type="text"
                  inputMode="numeric"
                  value={qtyInputText}
                  onChange={(e) => handleQtyInput(e.target.value)}
                  placeholder="Jumlah lain"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 pr-12 text-xs sm:text-sm font-extrabold text-slate-900 tabular-nums focus:border-[#D98A00] focus:outline-none focus:ring-2 focus:ring-[#D98A00]/25"
                />
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  pcs
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: LIVE RESULTS DASHBOARD */}
        <div
          aria-live="polite"
          className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6 space-y-5"
        >
          {!activeValid ? (
            <div
              role="alert"
              className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-900 text-xs sm:text-sm font-semibold leading-relaxed"
            >
              Kombinasi biaya dan margin melebihi harga jual. Turunkan biaya marketing, margin, atau naikkan harga jual.
            </div>
          ) : (
            <>
              {/* 1. Big HPP Banner */}
              <div className="rounded-2xl bg-gradient-to-br from-[#0a1b38] via-[#0f2a58] to-[#163870] p-5 sm:p-6 text-white shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-amber-300">
                    {mode === 'quick'
                      ? 'Target HPP / Unit'
                      : 'Target HPP Maksimal / Pcs'}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-extrabold text-amber-300 whitespace-nowrap">
                    {product}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-black tracking-tight text-white whitespace-nowrap tabular-nums">
                      {formatRp(activeHpp)}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-amber-300 whitespace-nowrap">
                      ({Math.round(activeRatio * 100)}% dari harga jual)
                    </span>
                  </div>
                  {mode === 'detail' ? (
                    <div className="text-xs text-blue-100/90">
                      Penerimaan bersih setelah potongan channel:{' '}
                      <strong className="text-white font-extrabold whitespace-nowrap tabular-nums">
                        {formatRp(detailCalc.net)} / pcs
                      </strong>
                    </div>
                  ) : (
                    <div className="text-xs text-blue-100/90">
                      Harga jual target:{' '}
                      <strong className="text-white font-extrabold whitespace-nowrap tabular-nums">
                        {formatRp(price)}
                      </strong>{' '}
                      × {hppPct}%
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Stacked Horizontal Bar + Tabular Breakdown */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                <div className="mb-2.5 flex items-center justify-between gap-2 text-xs sm:text-sm font-extrabold text-slate-800">
                  <span>Komposisi Harga Jual</span>
                  <span className="whitespace-nowrap tabular-nums text-slate-900">
                    {formatRp(price)}
                  </span>
                </div>
                <div
                  className="flex h-4 w-full overflow-hidden rounded-full bg-slate-200 shadow-inner"
                  role="img"
                  aria-label="Komposisi harga jual per segmen biaya dan HPP"
                >
                  {(mode === 'quick' ? quickCalc.segments : detailCalc.segments).map(
                    (seg) => {
                      const pct =
                        price > 0 ? Math.max(0, (seg.value / price) * 100) : 0;
                      if (pct <= 0) return null;
                      const colorCfg = SEGMENT_COLORS[seg.label] || {
                        bar: 'bg-slate-500',
                        dot: 'bg-slate-500',
                      };
                      return (
                        <div
                          key={seg.label}
                          style={{ width: `${pct}%` }}
                          className={`${colorCfg.bar} transition-all duration-300`}
                          title={`${seg.label}: ${formatRp(seg.value)} (${Math.round(pct)}%)`}
                        />
                      );
                    }
                  )}
                </div>

                {/* 3. Legend using div rows (immune to .article-content ul/li styles) */}
                <div className="mt-3.5 space-y-1.5 text-xs sm:text-sm">
                  {(mode === 'quick' ? quickCalc.segments : detailCalc.segments).map(
                    (seg) => {
                      const pct =
                        price > 0 ? Math.round((seg.value / price) * 100) : 0;
                      const isHpp = seg.label === 'HPP (target)';
                      const colorCfg = SEGMENT_COLORS[seg.label] || {
                        bar: 'bg-slate-500',
                        dot: 'bg-slate-500',
                      };
                      return (
                        <div
                          key={seg.label}
                          className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 ${
                            isHpp
                              ? 'bg-amber-50 border border-amber-200/90 font-extrabold text-slate-900'
                              : 'bg-slate-50/70 text-slate-700 font-medium'
                          }`}
                        >
                          <span className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`inline-block h-3 w-3 shrink-0 rounded-full ${colorCfg.dot}`}
                            />
                            <span className="truncate">{seg.label}</span>
                          </span>
                          <span className="shrink-0 font-extrabold whitespace-nowrap tabular-nums text-slate-900">
                            {formatRp(seg.value)}{' '}
                            <span className="text-slate-500 font-semibold">
                              ({pct}%)
                            </span>
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* 4. Two Wide Summary Tiles */}
              {mode === 'quick' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <span className="block text-xs font-bold text-slate-500">
                      Total berdasarkan target HPP
                    </span>
                    <strong className="mt-1 block text-xl sm:text-2xl font-black text-slate-900 whitespace-nowrap tabular-nums">
                      {formatRp(quickCalc.total)}
                    </strong>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      Untuk {idrFormatter.format(qty)} pcs (Budget: {currentBucket})
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <span className="block text-xs font-bold text-slate-500">
                      Sisa nilai per unit sebelum biaya lain
                    </span>
                    <strong className="mt-1 block text-xl sm:text-2xl font-black text-emerald-700 whitespace-nowrap tabular-nums">
                      {formatRp(quickCalc.sisaPerUnit)}
                    </strong>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      Untuk channel, marketing, operasional &amp; margin
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <span className="block text-xs font-bold text-slate-500">
                      Perkiraan modal produksi
                    </span>
                    <strong className="mt-1 block text-xl sm:text-2xl font-black text-slate-900 whitespace-nowrap tabular-nums">
                      {formatRp(detailCalc.modal)}
                    </strong>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      Untuk {idrFormatter.format(qty)} pcs (Budget: {currentBucket})
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <span className="block text-xs font-bold text-slate-500">
                      Laba kotor per pcs
                    </span>
                    <strong className="mt-1 block text-xl sm:text-2xl font-black text-emerald-700 whitespace-nowrap tabular-nums">
                      {formatRp(detailCalc.labaPerPcs)}
                    </strong>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      Margin {margin}% dari harga jual
                    </span>
                  </div>
                </div>
              )}

              {/* 5. Health Hint */}
              {healthHint && (
                <div
                  className={`rounded-xl border p-3.5 text-xs sm:text-sm leading-relaxed font-semibold ${
                    healthHint.tone === 'warn'
                      ? 'border-amber-300 bg-amber-50 text-amber-950'
                      : healthHint.tone === 'ok'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                      : 'border-sky-200 bg-sky-50 text-sky-950'
                  }`}
                >
                  {healthHint.text}
                </div>
              )}

              {/* 6. CTA Button */}
              <button
                type="button"
                onClick={handleCtaClick}
                className="w-full py-4 px-6 rounded-2xl font-extrabold text-xs sm:text-sm tracking-wide uppercase text-white bg-gradient-to-r from-[#D98A00] to-[#f0b830] hover:brightness-105 shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D98A00]"
              >
                <span>Konsultasikan Simulasi Ini</span>
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>

              {/* 7. Disclaimer */}
              <div className="text-[11px] text-slate-500 leading-relaxed text-center">
                Simulasi ini untuk perencanaan, bukan penawaran harga. Biaya aktual mengikuti formula, bahan, kemasan, dan jumlah produksi yang disepakati.
              </div>
            </>
          )}
        </div>
      </div>

      {/* Existing Lead Qualification Modal */}
      <LeadQualificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultCategory="Bodycare"
        defaultBudget={currentBucket}
        extraWaText={currentWaLine}
        source="article-hpp-calculator"
        channel="other"
        landingPage={
          typeof window !== 'undefined'
            ? window.location.pathname
            : '/biaya-maklon-bodycare-target-hpp/'
        }
      />
    </section>
  );
}
