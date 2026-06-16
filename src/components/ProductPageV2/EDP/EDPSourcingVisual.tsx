"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function EDPSourcingVisual() {
  return (
    <section className="relative min-h-[500px] lg:min-h-[700px] flex items-center bg-[#F9F7F2] overflow-hidden">
      {/* Background Image - Right Aligned Landscape */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/new asset/produk/parfum/edp-sourcing.webp"
          alt="EDP Sourcing Ecosystem"
          fill
          className="object-cover object-right"
        />
        {/* Masking for text readability on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F9F7F2] via-[#F9F7F2]/60 to-transparent w-full lg:w-[60%]" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-[1px] bg-brand-orange" />
              <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.4em]">Integrated Ecosystem</span>
            </div>
            
            <h2 className="font-display text-[28px] lg:text-[48px] font-normal text-[#212120] uppercase tracking-tight leading-none mb-8">
              Ekosistem Sourcing <br />
              <span className="text-brand-orange">Terpadu.</span>
            </h2>
            
            <p className="text-lg text-[#212120]/70 font-medium leading-relaxed mb-8">
              Tinggalkan kerepotan mencari vendor kemasan pihak ketiga. Akses langsung ke ribuan opsi botol kaca premium, spray nozzle anti-macet, dan desain box rigid eksklusif. Terima beres dari cairan hingga kemasan akhir.
            </p>

            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#F9F7F2] bg-gray-200 overflow-hidden">
                    <div className="w-full h-full bg-brand-orange/10 flex items-center justify-center">
                      <span className="text-[8px] font-bold">PKG</span>
                    </div>
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-bold text-[#212120]/40 uppercase tracking-widest">
                1000+ Sourcing Options
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
