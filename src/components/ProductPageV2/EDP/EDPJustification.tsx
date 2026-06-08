"use client";

import { motion } from "framer-motion";
import { Scale, Zap, ShieldCheck, Lock } from "lucide-react";

export default function EDPJustification() {
  const points = [
    {
      icon: Scale,
      title: "MOQ Dinamis & HPP Transparan.",
      desc: "Skema yang ramah untuk tes pasar pemula hingga scale-up massal, dengan rincian biaya pokok yang terang benderang sejak awal."
    },
    {
      icon: Zap,
      title: "Kalibrasi Rasio 3:1.",
      desc: "Sillage (jejak) tajam dan longevity di atas 8 jam. Cairan stabil, anti-degradasi, dan bebas noda kuning (stain-free) pada pakaian."
    },
    {
      icon: ShieldCheck,
      title: "Jalur Cepat BPOM.",
      desc: "Tim regulasi kami memastikan 100% produk lolos BPOM dan Halal. Anda tinggal fokus pada strategi marketing."
    },
    {
      icon: Lock,
      title: "Kepemilikan Hak Cipta Penuh.",
      desc: "DNA formulasi Anda dilindungi Non-Disclosure Agreement (NDA). Tidak akan pernah diproduksi ulang untuk brand kompetitor."
    }
  ];

  return (
    <section className="py-24 bg-[#F9F7F2]">
      <div className="container-custom">
        <div className="max-w-4xl mb-20">
          <h2 className="font-display text-[28px] lg:text-[48px] font-normal text-[#212120] uppercase tracking-tight leading-[1.1]">
            Arsitektur Formulasi yang <br />
            <span className="text-brand-orange">Melindungi Reputasi & Profit Anda.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
          {points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col gap-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-brand-orange/20 flex items-center justify-center text-brand-orange shadow-sm">
                <point.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-onest text-xl lg:text-2xl font-black text-[#212120] uppercase tracking-tight mb-4">
                  {point.title}
                </h3>
                <p className="text-[#212120]/60 leading-relaxed font-medium">
                  {point.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
