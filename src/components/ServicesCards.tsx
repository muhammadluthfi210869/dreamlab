"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Lightbulb, FlaskConical, Factory, HeartHandshake } from "lucide-react";
import { ServicesCardsData } from "@/types";

interface ServicesCardsProps {
  data: ServicesCardsData;
}

const iconMap: Record<number, React.ReactNode> = {
  1: <Lightbulb className="w-7 h-7" />,
  2: <FlaskConical className="w-7 h-7" />,
  3: <Factory className="w-7 h-7" />,
  4: <HeartHandshake className="w-7 h-7" />
};

export default function ServicesCards({ data }: ServicesCardsProps) {
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-brand-orange font-black uppercase tracking-[0.4em] text-xs mb-4 block">
            Proses Kami
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-brand-black leading-[1.15] uppercase">
            {data.headline}
          </h2>
          <p className="text-brand-black/50 text-lg md:text-xl mt-4 max-w-2xl mx-auto leading-relaxed">
            {data.subheadline}
          </p>
          <div className="w-16 h-1.5 bg-brand-orange mx-auto mt-6 rounded-full" />
        </div>

        {/* Cards Grid (Image 3 Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          {data.cards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -8, boxShadow: "0 25px 50px rgba(247,148,29,0.12)" }}
              className="bg-white border border-gray-100 rounded-[24px] p-8 flex flex-col items-center text-center group hover:border-brand-orange/30 transition-all duration-500 shadow-sm"
            >
              {/* Step Number */}
              <span className="text-[10px] font-mono font-bold text-brand-orange/40 tracking-widest mb-4">
                STEP {card.step}
              </span>

              {/* Icon Circle (Brand Orange Gradient Style) */}
              <div className="w-16 h-16 bg-gradient-to-br from-brand-orange to-brand-orange/70 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-brand-orange/30 group-hover:scale-110 transition-transform duration-300">
                {iconMap[card.id]}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold font-onest text-brand-black uppercase mb-3 leading-tight">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-brand-black/50 text-sm leading-relaxed mb-6 flex-grow">
                {card.description}
              </p>

              {/* Arrow Button */}
              <div className="w-10 h-10 bg-brand-orange/5 rounded-full flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
