"use client";

import React from 'react';
import { openWARoundRobin } from "@/lib/wa-roundrobin";

export default function ProductClosingCTA() {

  return (
    <section className="relative z-10 bg-[#1A1A1A] py-24 lg:py-40 overflow-hidden text-center">
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="font-display text-[38px] md:text-[52px] lg:text-[80px] font-normal text-white uppercase tracking-tight leading-[1.05]">
            Waktunya Menguji <br /><span className="text-brand-orange">Visi Anda.</span>
          </h2>
          <p className="font-poppins text-lg lg:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            Jadwalkan pembuatan sampel (prototipe) untuk Anda tes dan evaluasi secara personal sebelum melangkah ke tahap produksi massal.
          </p>
          <button onClick={() => openWARoundRobin("Halo Dreamlab! Saya ingin menjadwalkan pembuatan sampel parfum. Mohon info prosedurnya.")} className="inline-block bg-brand-orange text-white font-bold py-6 px-16 rounded-2xl shadow-xl hover:-translate-y-2 transition-all">
            JADWALKAN PEMBUATAN SAMPEL
          </button>
        </div>
      </div>
    </section>
  );
}
