'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Sparkles, MessageCircle, HelpCircle, CheckCircle } from 'lucide-react';

interface CategoryConfig {
  name: string;
  label: string;
  basePrices: {
    standard: number;
    premium: number;
    executive: number;
  };
}

const CATEGORIES: CategoryConfig[] = [
  {
    name: 'skincare',
    label: 'Skincare (Serum, Cream, Toner)',
    basePrices: { standard: 18000, premium: 28000, executive: 48000 }
  },
  {
    name: 'bodycare',
    label: 'Body Care (Lotion, Soap, Scrub)',
    basePrices: { standard: 14000, premium: 22000, executive: 38000 }
  },
  {
    name: 'haircare',
    label: 'Hair Care (Shampoo, Serum, Conditioner)',
    basePrices: { standard: 16000, premium: 25000, executive: 42000 }
  },
  {
    name: 'cosmetics',
    label: 'Cosmetics (Lip Cream, Cushion, Foundation)',
    basePrices: { standard: 22000, premium: 32000, executive: 55000 }
  }
];

const TIERS = [
  {
    id: 'standard',
    name: 'Standard',
    desc: 'Bahan dasar berkualitas, standar BPOM, kemasan standar.',
    features: ['Izin BPOM & Halal', 'Uji Stabilitas Standard', 'Kemasan Standard']
  },
  {
    id: 'premium',
    name: 'Premium',
    desc: 'Bahan aktif impor populer (Niacinamide, Retinol, dll), kemasan premium.',
    features: ['Izin BPOM & Halal', 'Bahan Aktif Impor', 'Uji Efikasi & Stabilitas', 'Desain Kemasan Eksklusif']
  },
  {
    id: 'executive',
    name: 'Executive',
    desc: 'Formulasi kustom eksklusif, bahan aktif langka/organik, kemasan khusus.',
    features: ['Izin BPOM & Halal', 'Custom Formulasi Unik', 'Efikasi Klinis Teruji', 'Kemasan Eksklusif & Custom Box', 'Prioritas Produksi']
  }
];

export default function MaklonCalculator() {
  const [category, setCategory] = useState('skincare');
  const [tier, setTier] = useState('premium');
  const [quantity, setQuantity] = useState(3000);

  // Constants
  const bpomHalalFee = 12500000; // Rp12.5M fixed fee (sample, design, BPOM, Halal registration)

  const activeCategory = useMemo(() => {
    return CATEGORIES.find(c => c.name === category) || CATEGORIES[0];
  }, [category]);

  const pricing = useMemo(() => {
    const basePrice = activeCategory.basePrices[tier as keyof typeof activeCategory.basePrices];
    
    // Quantity discounts
    let discount = 0;
    if (quantity >= 10000) discount = 0.15; // 15% discount for 10k+
    else if (quantity >= 5000) discount = 0.10; // 10% discount for 5k-10k
    else if (quantity >= 3000) discount = 0.05; // 5% discount for 3k-5k

    const finalPricePerUnit = Math.round(basePrice * (1 - discount));
    const productionCost = finalPricePerUnit * quantity;
    const totalCost = productionCost + bpomHalalFee;

    return {
      pricePerUnit: finalPricePerUnit,
      productionCost,
      totalCost,
      discountPercent: discount * 100,
      bpomHalalFee
    };
  }, [activeCategory, tier, quantity]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const waMessage = useMemo(() => {
    const text = `Halo Dreamlab, saya mencoba Kalkulator Maklon di website Anda. Saya tertarik membuat:\n` +
      `- Kategori: ${activeCategory.label}\n` +
      `- Tingkat Formulasi: ${tier.toUpperCase()}\n` +
      `- Estimasi Kuantitas: ${quantity.toLocaleString('id-ID')} pcs\n` +
      `- Estimasi Biaya Per Unit: ${formatCurrency(pricing.pricePerUnit)}\n` +
      `- Estimasi Total Biaya (Termasuk BPOM & Halal): ${formatCurrency(pricing.totalCost)}\n\n` +
      `Mohon info lebih lanjut untuk memulai sampel formulasi. Terima kasih.`;
    return encodeURIComponent(text);
  }, [activeCategory, tier, quantity, pricing]);

  return (
    <div className="w-full bg-[#1A1A1A] text-white rounded-[40px] p-6 md:p-8 border border-white/5 shadow-2xl relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-orange/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-brand-orange/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="w-12 h-12 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl flex items-center justify-center text-brand-orange">
          <Calculator className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest block">Simulasi Biaya</span>
          <h3 className="text-xl font-bold text-white uppercase tracking-tight font-display leading-none mt-1">Kalkulator Maklon</h3>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        {/* Step 1: Category Selection */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">1. Pilih Jenis Produk</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setCategory(cat.name)}
                className={`py-3 px-4 rounded-2xl text-left border text-xs font-bold transition-all duration-300 ${
                  category === cat.name
                    ? 'bg-brand-orange border-brand-orange text-white shadow-lg'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {cat.label.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Formulation Tier */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">2. Kualitas Formulasi</label>
          <div className="grid grid-cols-3 gap-2">
            {TIERS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTier(t.id)}
                className={`py-3 px-2 rounded-2xl text-center border text-xs font-bold transition-all duration-300 ${
                  tier === t.id
                    ? 'bg-brand-orange border-brand-orange text-white shadow-lg'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
          
          <div className="mt-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-[11px] text-gray-300 leading-relaxed">
              {TIERS.find(t => t.id === tier)?.desc}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
              {TIERS.find(t => t.id === tier)?.features.map((feat, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-[10px] text-brand-orange font-bold">
                  <CheckCircle className="w-3 h-3" />
                  {feat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Quantity Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">3. Jumlah Produksi (MOQ)</label>
            <span className="text-sm font-bold text-brand-orange">
              {quantity.toLocaleString('id-ID')} Pcs
            </span>
          </div>
          <div className="relative pt-2">
            <input
              type="range"
              min="1000"
              max="20000"
              step="500"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-orange"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-2">
              <span>1.000 Pcs (MOQ)</span>
              <span>10.000 Pcs</span>
              <span>20.000 Pcs</span>
            </div>
          </div>
        </div>

        {/* Pricing Summary Box */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mt-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-brand-orange/20">
            <Sparkles className="w-12 h-12" />
          </div>
          
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Estimasi Rincian Investasi</h4>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Harga Per Unit:</span>
              <div className="text-right">
                <span className="font-bold text-white">{formatCurrency(pricing.pricePerUnit)}</span>
                {pricing.discountPercent > 0 && (
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded ml-2 font-bold">
                    Diskon {pricing.discountPercent}%
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
              <span className="text-gray-400">Biaya Produksi ({quantity.toLocaleString('id-ID')} pcs):</span>
              <span className="font-medium text-white">{formatCurrency(pricing.productionCost)}</span>
            </div>

            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
              <span className="text-gray-400 flex items-center gap-1">
                Biaya BPOM, Halal & Formulasi
                <span className="group relative cursor-pointer text-gray-500 hover:text-white transition-colors">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black text-[9px] text-gray-300 font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10 leading-normal z-50">
                    Investasi satu kali untuk pendaftaran merek, legalitas BPOM, sertifikasi Halal, desain kemasan, dan sampel uji laboratorium.
                  </span>
                </span>
              </span>
              <span className="font-medium text-white">{formatCurrency(pricing.bpomHalalFee)}</span>
            </div>

            <div className="flex justify-between items-end pt-2">
              <span className="text-xs font-bold text-brand-orange uppercase">Estimasi Investasi Total:</span>
              <div className="text-right">
                <div className="text-xl font-black text-white font-display">
                  {formatCurrency(pricing.totalCost)}
                </div>
                <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                  Mulai sekitar {formatCurrency(Math.round(pricing.totalCost / 6))} / bulan (Tenor Cicilan)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <a
          href={`https://wa.me/62881027240339?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full bg-brand-orange hover:bg-white text-white hover:text-brand-orange py-4 rounded-2xl font-black text-center text-xs tracking-widest transition-all duration-300 shadow-xl border border-transparent hover:border-brand-orange group"
        >
          <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
          KONSULTASI FORMULASI SEKARANG
        </a>
        
        <p className="text-[9px] text-center text-gray-500 font-medium leading-relaxed">
          *Perhitungan di atas merupakan estimasi kasar. Biaya final dipengaruhi oleh kerumitan formula bahan aktif, jenis botol/pot kemasan, dan volume kemasan.
        </p>
      </div>
    </div>
  );
}
