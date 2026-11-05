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
};

export default function HppCalculator() {
  const uid = useId();
  const [product, setProduct] = useState<BodycareProduct>('Body Lotion');
  const [price, setPrice] = useState<number>(100000);
  const [priceInputText, setPriceInputText] = useState<string>('100.000');
  const [channelCut, setChannelCut] = useState<number>(12);
  const [marketing, setMarketing] = useState<number>(20);
  const [ops, setOps] = useState<number>(5);
  const [margin, setMargin] = useState<number>(30);
  const [qty, setQty] = useState<number>(1000);
  const [qtyInputText, setQtyInputText] = useState<string>('1.000');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const hasTrackedUsageRef = useRef<boolean>(false);

  const calc = useMemo(
    () => calcHpp({ price, channelCut, marketing, ops, margin, qty }),
    [price, channelCut, marketing, ops, margin, qty]
  );

  const fireFirstInteraction = (
    nextProduct: string,
    nextInput: CalcInput
  ) => {
    try {
      sessionStorage.setItem(
        'dl_hpp_calc_last',
        JSON.stringify({ product: nextProduct, ...nextInput })
      );
    } catch {
      /* ignore storage errors */
    }

    if (hasTrackedUsageRef.current) return;
    hasTrackedUsageRef.current = true;

    const nextCalc = calcHpp(nextInput);
    if (typeof window !== 'undefined') {
      const w = window as unknown as {
        dataLayer?: Array<Record<string, unknown>>;
        fbq?: (...args: unknown[]) => void;
      };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({
        event: 'hpp_calculator_used',
        product: nextProduct,
        selling_price: nextInput.price,
        target_hpp: Math.round(nextCalc.hpp),
        quantity: nextInput.qty,
      });

      if (typeof w.fbq === 'function') {
        w.fbq('trackCustom', 'HppCalculatorUsed', {
          product: nextProduct,
          content_category: 'Bodycare',
        });
      }
    }
  };

  const handleProductSelect = (p: BodycareProduct) => {
    setProduct(p);
    fireFirstInteraction(p, { price, channelCut, marketing, ops, margin, qty });
  };

  const handlePriceInput = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    const numeric = digits ? parseInt(digits, 10) : 0;
    setPrice(numeric);
    setPriceInputText(digits ? idrFormatter.format(numeric) : '');
    fireFirstInteraction(product, {
      price: numeric,
      channelCut,
      marketing,
      ops,
      margin,
      qty,
    });
  };

  const handlePriceSlider = (val: number) => {
    setPrice(val);
    setPriceInputText(idrFormatter.format(val));
    fireFirstInteraction(product, {
      price: val,
      channelCut,
      marketing,
      ops,
      margin,
      qty,
    });
  };

  const handleChannelChip = (cut: number) => {
    setChannelCut(cut);
    fireFirstInteraction(product, {
      price,
      channelCut: cut,
      marketing,
      ops,
      margin,
      qty,
    });
  };

  const handleChannelInput = (raw: string) => {
    const cleaned = raw.replace(/[^\d.]/g, '');
    const parsed = cleaned === '' ? 0 : Math.min(90, Math.max(0, Number(cleaned)));
    setChannelCut(parsed);
    fireFirstInteraction(product, {
      price,
      channelCut: parsed,
      marketing,
      ops,
      margin,
      qty,
    });
  };

  const handleMarketingChange = (val: number) => {
    setMarketing(val);
    fireFirstInteraction(product, {
      price,
      channelCut,
      marketing: val,
      ops,
      margin,
      qty,
    });
  };

  const handleOpsChange = (val: number) => {
    setOps(val);
    fireFirstInteraction(product, {
      price,
      channelCut,
      marketing,
      ops: val,
      margin,
      qty,
    });
  };

  const handleMarginChange = (val: number) => {
    setMargin(val);
    fireFirstInteraction(product, {
      price,
      channelCut,
      marketing,
      ops,
      margin: val,
      qty,
    });
  };

  const handleQtyPreset = (preset: number) => {
    setQty(preset);
    setQtyInputText(idrFormatter.format(preset));
    fireFirstInteraction(product, {
      price,
      channelCut,
      marketing,
      ops,
      margin,
      qty: preset,
    });
  };

  const handleQtyInput = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    const numeric = digits ? Math.max(1, parseInt(digits, 10)) : 0;
    setQty(numeric);
    setQtyInputText(digits ? idrFormatter.format(numeric) : '');
    fireFirstInteraction(product, {
      price,
      channelCut,
      marketing,
      ops,
      margin,
      qty: numeric,
    });
  };

  const handleCtaClick = () => {
    const bucket = budgetBucket(calc.modal);
    if (typeof window !== 'undefined') {
      const w = window as unknown as {
        dataLayer?: Array<Record<string, unknown>>;
      };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({
        event: 'hpp_calculator_cta',
        product,
        target_hpp: Math.round(calc.hpp),
        quantity: qty,
        budget_bucket: bucket,
      });
    }
    setIsModalOpen(true);
  };

  const sliderPriceValue = Math.min(500000, Math.max(20000, price || 20000));
  const currentBucket = calc.valid ? budgetBucket(calc.modal) : '< 25 Juta';
  const currentWaLine = calc.valid ? waLine(product, price, calc.hpp, qty) : '';

  const healthHint = useMemo(() => {
    if (!calc.valid) return null;
    if (calc.ratio < 0.15) {
      return {
        tone: 'warn' as const,
        text: 'Ruang HPP cukup sempit. Pertimbangkan kemasan standar atau ukuran yang lebih efisien.',
      };
    }
    if (calc.ratio <= 0.35) {
      return {
        tone: 'ok' as const,
        text: 'Ruang HPP umum untuk brand bodycare. Masih ada fleksibilitas memilih formula dan kemasan.',
      };
    }
    return {
      tone: 'neutral' as const,
      text: 'Ruang HPP longgar. Pastikan margin dan budget marketing sudah realistis.',
    };
  }, [calc.valid, calc.ratio]);

  return (
    <section
      aria-label="Kalkulator Target HPP Bodycare"
      className="my-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 md:p-8 shadow-lg not-prose"
    >
      {/* Header */}
      <div className="mb-6 border-b border-slate-100 pb-4">
        <span className="inline-block rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#D98A00]">
          Simulasi Perencanaan Bisnis
        </span>
        <h3 className="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
          Kalkulator Target HPP Brand Bodycare
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          Hitung mundur batas maksimal HPP per pcs dari target harga jual, potongan channel, marketing, dan margin.
        </p>
      </div>

      {/* Main Grid: Inputs Left, Results Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* LEFT COLUMN: INPUTS */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Jenis Produk */}
          <div>
            <span
              id={`${uid}-product-label`}
              className="block text-xs sm:text-sm font-bold text-slate-800 mb-2"
            >
              1. Jenis produk
            </span>
            <div
              role="group"
              aria-labelledby={`${uid}-product-label`}
              className="flex flex-wrap gap-1.5 sm:gap-2"
            >
              {PRODUCTS.map((item) => {
                const active = product === item;
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={active}
                    onClick={() => handleProductSelect(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border focus:outline-none focus:ring-2 focus:ring-[#D98A00] ${
                      active
                        ? 'bg-gradient-to-r from-[#D98A00] to-[#f0b830] text-white border-[#D98A00] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
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
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label
                htmlFor={`${uid}-price-input`}
                className="text-xs sm:text-sm font-bold text-slate-800"
              >
                2. Target harga jual ke konsumen (Rp/pcs)
              </label>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-bold text-slate-500">
                Rp
              </span>
              <input
                id={`${uid}-price-input`}
                type="text"
                inputMode="numeric"
                value={priceInputText}
                onChange={(e) => handlePriceInput(e.target.value)}
                aria-describedby={`${uid}-price-slider-hint`}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-10 pr-4 py-2.5 text-sm sm:text-base font-extrabold text-slate-900 focus:border-[#D98A00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D98A00]/25"
                placeholder="100.000"
              />
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
              className="flex justify-between text-[11px] text-slate-500 mt-0.5"
            >
              <span>Rp20.000</span>
              <span>Rp250.000</span>
              <span>Rp500.000</span>
            </div>
          </div>

          {/* 3. Channel Penjualan Utama */}
          <div>
            <span
              id={`${uid}-channel-label`}
              className="block text-xs sm:text-sm font-bold text-slate-800 mb-2"
            >
              3. Channel penjualan utama &amp; potongan channel
            </span>
            <div
              role="group"
              aria-labelledby={`${uid}-channel-label`}
              className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2.5"
            >
              {CHANNELS.map((ch) => {
                const isSelected = channelCut === ch.cut;
                return (
                  <button
                    key={ch.name}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleChannelChip(ch.cut)}
                    className={`px-3 py-2 rounded-xl border text-left transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D98A00] ${
                      isSelected
                        ? 'border-[#D98A00] bg-amber-50/80 text-slate-900 shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="block text-xs font-bold leading-tight">{ch.name}</span>
                    <span className="text-[11px] font-semibold text-[#D98A00]">{ch.cut}%</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2">
              <label
                htmlFor={`${uid}-channel-cut`}
                className="text-xs font-semibold text-slate-700"
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
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 pr-6 text-right text-xs sm:text-sm font-bold text-slate-900 focus:border-[#D98A00] focus:outline-none focus:ring-2 focus:ring-[#D98A00]/25"
                />
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  %
                </span>
              </div>
            </div>
          </div>

          {/* 4. Biaya Marketing */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor={`${uid}-marketing`}
                className="text-xs sm:text-sm font-bold text-slate-800"
              >
                4. Biaya marketing (% harga jual)
              </label>
              <span className="text-xs sm:text-sm font-extrabold text-[#D98A00]">
                {marketing}% ({formatRp((price * marketing) / 100)})
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
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
            </div>
          </div>

          {/* 5. Biaya Operasional & Pengiriman */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor={`${uid}-ops`}
                className="text-xs sm:text-sm font-bold text-slate-800"
              >
                5. Biaya operasional &amp; pengiriman (%)
              </label>
              <span className="text-xs sm:text-sm font-extrabold text-[#D98A00]">
                {ops}% ({formatRp((price * ops) / 100)})
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
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>0%</span>
              <span>10%</span>
              <span>20%</span>
            </div>
          </div>

          {/* 6. Target Margin Keuntungan */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor={`${uid}-margin`}
                className="text-xs sm:text-sm font-bold text-slate-800"
              >
                6. Target margin keuntungan (%)
              </label>
              <span className="text-xs sm:text-sm font-extrabold text-[#D98A00]">
                {margin}% ({formatRp((price * margin) / 100)})
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
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>5%</span>
              <span>30%</span>
              <span>60%</span>
            </div>
          </div>

          {/* 7. Jumlah Produksi Pertama */}
          <div>
            <label
              htmlFor={`${uid}-qty-input`}
              className="block text-xs sm:text-sm font-bold text-slate-800 mb-2"
            >
              7. Jumlah produksi pertama (pcs)
            </label>
            <div className="flex flex-wrap gap-2 mb-2.5">
              {QTY_PRESETS.map((preset) => {
                const isSelected = qty === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleQtyPreset(preset)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D98A00] ${
                      isSelected
                        ? 'border-[#D98A00] bg-gradient-to-r from-[#D98A00] to-[#f0b830] text-white shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {idrFormatter.format(preset)} pcs
                  </button>
                );
              })}
            </div>
            <div className="relative">
              <input
                id={`${uid}-qty-input`}
                type="text"
                inputMode="numeric"
                value={qtyInputText}
                onChange={(e) => handleQtyInput(e.target.value)}
                placeholder="Jumlah custom (contoh: 1.500)"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 pr-14 text-sm font-bold text-slate-900 focus:border-[#D98A00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D98A00]/25"
              />
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                pcs
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RESULTS CARD */}
        <div
          aria-live="polite"
          className="lg:col-span-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-6 space-y-5"
        >
          {!calc.valid ? (
            <div
              role="alert"
              className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-900 text-xs sm:text-sm font-semibold leading-relaxed"
            >
              Kombinasi biaya dan margin melebihi harga jual. Turunkan biaya marketing, margin, atau naikkan harga jual.
            </div>
          ) : (
            <>
              {/* 1. Big HPP Number */}
              <div className="rounded-2xl bg-gradient-to-br from-[#0a1b38] via-[#0f2a58] to-[#163870] p-4 sm:p-5 text-white shadow-md">
                <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  <span>Target HPP Maksimal / pcs</span>
                  <span>{product}</span>
                </div>
                <div className="mt-1.5 flex items-baseline gap-2 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {formatRp(calc.hpp)}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-amber-300">
                    ({Math.round(calc.ratio * 100)}% dari harga jual)
                  </span>
                </div>
                <p className="mt-2 text-xs text-blue-100/90">
                  Penerimaan bersih setelah potongan channel:{' '}
                  <strong className="text-white">{formatRp(calc.net)}</strong> / pcs
                </p>
              </div>

              {/* 2. Stacked Horizontal Bar */}
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Komposisi Harga Jual</span>
                  <span>{formatRp(price)}</span>
                </div>
                <div
                  className="flex h-4 w-full overflow-hidden rounded-full bg-slate-200 shadow-inner"
                  role="img"
                  aria-label="Komposisi harga jual per segmen biaya dan HPP"
                >
                  {calc.segments.map((seg) => {
                    const pct = price > 0 ? Math.max(0, (seg.value / price) * 100) : 0;
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
                  })}
                </div>

                {/* 3. Legend (Rp + %) */}
                <ul className="mt-3 space-y-1.5 text-xs">
                  {calc.segments.map((seg) => {
                    const pct = price > 0 ? Math.round((seg.value / price) * 100) : 0;
                    const isHpp = seg.label === 'HPP (target)';
                    const colorCfg = SEGMENT_COLORS[seg.label] || {
                      bar: 'bg-slate-500',
                      dot: 'bg-slate-500',
                    };
                    return (
                      <li
                        key={seg.label}
                        className={`flex items-center justify-between gap-2 rounded-lg px-2.5 py-1 ${
                          isHpp
                            ? 'bg-amber-50 border border-amber-200/80 font-extrabold text-slate-900'
                            : 'text-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span
                            className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${colorCfg.dot}`}
                          />
                          <span className="truncate">{seg.label}</span>
                        </span>
                        <span className="shrink-0 font-bold">
                          {formatRp(seg.value)} ({pct}%)
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* 4. Two Tiles: Modal Produksi & Laba Kotor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                  <span className="block text-[11px] font-semibold text-slate-500">
                    Perkiraan modal produksi
                  </span>
                  <strong className="mt-1 block text-base sm:text-lg font-extrabold text-slate-900">
                    {formatRp(calc.modal)}
                  </strong>
                  <span className="text-[11px] text-slate-500">
                    Untuk {idrFormatter.format(qty)} pcs ({currentBucket})
                  </span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                  <span className="block text-[11px] font-semibold text-slate-500">
                    Laba kotor per pcs
                  </span>
                  <strong className="mt-1 block text-base sm:text-lg font-extrabold text-emerald-700">
                    {formatRp(calc.labaPerPcs)}
                  </strong>
                  <span className="text-[11px] text-slate-500">
                    Margin {margin}% dari harga jual
                  </span>
                </div>
              </div>

              {/* 5. Health Hint */}
              {healthHint && (
                <div
                  className={`rounded-xl border p-3.5 text-xs leading-relaxed font-medium ${
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
                className="w-full py-3.5 px-5 rounded-2xl font-extrabold text-xs sm:text-sm tracking-wide uppercase text-white bg-gradient-to-r from-[#D98A00] to-[#f0b830] hover:brightness-105 shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D98A00]"
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
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Simulasi ini untuk perencanaan, bukan penawaran harga. Biaya aktual mengikuti formula, bahan, kemasan, dan jumlah produksi yang disepakati.
              </p>
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
        landingPage="/maklon-bodycare-panduan-memulai-brand-sendiri/"
      />
    </section>
  );
}

