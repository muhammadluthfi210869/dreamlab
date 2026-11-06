'use client';

import React, { useState, useId } from 'react';

const DEFAULT_CHECKLIST_ITEMS = [
  'Ide produk yang ingin dibuat',
  'Target konsumen',
  'Kebutuhan konsumen yang ingin dijawab',
  'Target harga jual',
  'Target HPP (gunakan kalkulator di atas)',
  'Perkiraan jumlah produksi',
  'Konsep kemasan dan positioning (jika sudah ada)',
] as const;

const BIAYA_CHECKLIST_ITEMS = [
  'Ide produk: body lotion, body serum, body wash, body scrub, atau produk lain.',
  'Target konsumen: siapa yang dilayani dan kebutuhan perawatan tubuh apa yang dijawab.',
  'Target harga jual: dasar positioning dan perhitungan target HPP.',
  'Target HPP: gunakan kalkulator di atas untuk simulasi awal.',
  'Perkiraan jumlah produksi: sesuai modal, target penjualan, dan strategi peluncuran.',
] as const;

export interface ConsultationChecklistProps {
  variant?: 'default' | 'biaya';
}

export default function ConsultationChecklist({
  variant = 'default',
}: ConsultationChecklistProps) {
  const uid = useId();
  const items = variant === 'biaya' ? BIAYA_CHECKLIST_ITEMS : DEFAULT_CHECKLIST_ITEMS;
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));

  const toggleItem = (idx: number) => {
    setChecked((prev) => prev.map((val, i) => (i === idx ? !val : val)));
  };

  const completedCount = checked.filter(Boolean).length;

  return (
    <div className="my-6 rounded-2xl border border-slate-200 bg-[#FAF9F6] p-4 sm:p-6 not-prose">
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="text-xs sm:text-sm font-extrabold text-slate-900">
          Checklist Persiapan Konsultasi Bodycare
        </span>
        <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-extrabold text-[#9a6200]">
          {completedCount} / {items.length} siap
        </span>
      </div>
      <div className="space-y-2.5">
        {items.map((item, idx) => {
          const isChecked = checked[idx];
          const inputId = `${uid}-check-${idx}`;
          return (
            <div key={item}>
              <label
                htmlFor={inputId}
                className={`flex items-start gap-3 rounded-xl border p-3 sm:p-3.5 transition-all cursor-pointer select-none ${
                  isChecked
                    ? 'border-[#D98A00] bg-amber-50/70 text-slate-900'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                }`}
              >
                <input
                  id={inputId}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleItem(idx)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-[#D98A00] focus:ring-[#D98A00]"
                />
                <span
                  className={`text-xs sm:text-sm font-semibold leading-snug ${
                    isChecked ? 'line-through text-slate-500' : 'text-slate-800'
                  }`}
                >
                  {item}
                </span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
