"use client";

import { motion } from "framer-motion";

export default function EDPValidation() {
  const cards = [
    {
      title: "Body Mist",
      focus: "Volume game, margin tipis, ritel cepat.",
      isHighlighted: false,
    },
    {
      title: "EAU DE PARFUM",
      focus: "Target pekerja/profesional. HPP efisien dengan harga jual premium. Keseimbangan cost dan margin paling ideal.",
      isHighlighted: true,
    },
    {
      title: "Extrait",
      focus: "Niche luxury, volume lambat, R&D tinggi.",
      isHighlighted: false,
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="font-display text-[28px] lg:text-[48px] font-normal text-[#212120] uppercase tracking-tight leading-none">
            Mengapa EDP Adalah <br />
            <span className="text-brand-orange">Sweet-Spot Bisnis Anda?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-[2rem] transition-all duration-500 ${
                card.isHighlighted 
                  ? "bg-[#1B1B1B] text-white shadow-2xl scale-105 z-10 py-12" 
                  : "bg-[#F9F7F2] text-[#212120]/40 opacity-60 grayscale"
              }`}
            >
              {card.isHighlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-orange text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
                  The Sweet Spot
                </div>
              )}
              
              <h3 className={`font-onest text-2xl font-black uppercase mb-6 ${card.isHighlighted ? "text-white" : "text-[#212120]"}`}>
                {card.title}
              </h3>
              
              <p className={`text-sm leading-relaxed font-medium ${card.isHighlighted ? "text-white/80" : "text-[#212120]/60"}`}>
                <span className="block text-[10px] font-black uppercase tracking-widest mb-2 text-brand-orange">Fokus Strategis:</span>
                {card.focus}
              </p>

              {card.isHighlighted && (
                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="flex-grow h-[2px] bg-brand-orange" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Market Leader Choice</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
