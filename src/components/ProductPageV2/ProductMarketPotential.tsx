"use client";

import React from 'react';

export default function ProductMarketPotential() {
  return (
    <section className="relative z-10 bg-white py-24 lg:py-32 overflow-hidden border-t border-gray-50">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0H0V60' fill='none' stroke='%23000' stroke-width='1'/%3E%3C/svg%3E")` }} />

      <div className="container-custom relative z-10">
        <div className="flex flex-col gap-20">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[3px] bg-brand-orange"></div>
              <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.4em]">Commercial Validation</span>
            </div>
            <h2 className="font-display text-[38px] lg:text-[80px] font-normal text-[#212120] leading-[1.05] tracking-tighter uppercase">
              Kenapa EDP Adalah Instrumen <br />
              <span className="text-brand-orange">Skala Bisnis yang Ideal?</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            <div className="group space-y-8 p-10 bg-[#FDFDFC] rounded-[2.5rem] border border-gray-100 transition-all duration-700 hover:shadow-[0_30px_70px_rgba(246,145,30,0.1)] hover:-translate-y-2">
              <h3 className="font-onest text-2xl lg:text-3xl font-black text-[#212120] uppercase tracking-tight">Permintaan Pasar <br />Tertinggi</h3>
              <p className="font-poppins text-base lg:text-lg text-[#212120]/70 leading-relaxed">
                Konsumen modern mencari parfum yang tahan seharian untuk bekerja, menjadikan EDP sebagai kategori dengan perputaran penjualan tertinggi.
              </p>
              <div className="w-12 h-[2px] bg-brand-orange/20 group-hover:w-full group-hover:bg-brand-orange transition-all duration-700" />
            </div>
            <div className="group space-y-8 p-10 bg-[#FDFDFC] rounded-[2.5rem] border border-gray-100 transition-all duration-700 hover:shadow-[0_30px_70px_rgba(246,145,30,0.1)] hover:-translate-y-2">
              <h3 className="font-onest text-2xl lg:text-3xl font-black text-[#212120] uppercase tracking-tight">Titik Margin <br />Paling Optimal</h3>
              <p className="font-poppins text-base lg:text-lg text-[#212120]/70 leading-relaxed">
                Biaya produksi yang terukur memberikan Anda fleksibilitas untuk masuk ke rentang harga jual menengah hingga premium dengan margin yang tebal.
              </p>
              <div className="w-12 h-[2px] bg-brand-orange/20 group-hover:w-full group-hover:bg-brand-orange transition-all duration-700" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
