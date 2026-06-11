"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function EDPClosing() {
  const whatsappMessage = encodeURIComponent(
    "Halo Dreamlab! Saya ingin menjadwalkan pembuatan sampel aroma untuk brand saya."
  );
  const whatsappLink = `https://wa.me/62881027240339?text=${whatsappMessage}`;

  return (
    <section className="py-24 bg-[#1B1B1B] text-white overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-orange/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="container-custom relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 rounded-full mb-8 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Risk Reversal Guarantee</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-8">
            Uji Sendiri <br />
            <span className="text-brand-orange">Kualitas Formulasi Kami.</span>
          </h2>

          <p className="text-lg lg:text-xl text-white/60 font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
            Jangan membeli kucing dalam karung. Diskusikan target HPP Anda dan mari buat sampel aroma fisik (prototipe) untuk Anda tes dan evaluasi sebelum masuk produksi massal.
          </p>

          <div className="flex flex-col items-center gap-8">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-6 bg-brand-orange hover:bg-white hover:text-[#1B1B1B] text-white font-bold py-6 px-14 rounded-2xl transition-all duration-500 shadow-[0_20px_40px_rgba(246,145,30,0.2)] hover:-translate-y-2"
            >
              <span className="uppercase tracking-[0.2em] text-xs font-onest">Jadwalkan Pembuatan Sampel</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
            </a>

            <div className="flex items-center gap-8 pt-8 border-t border-white/5 w-full max-w-md justify-center">
              <div className="text-center">
                <div className="text-2xl font-black text-white">48h</div>
                <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Sample Turnaround</div>
              </div>
              <div className="w-[1px] h-10 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-black text-white">100%</div>
                <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Confidentiality</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
