"use client";

import { motion } from "framer-motion";
import { 
  Droplet, 
  Layers, 
  Sparkles, 
  Zap, 
  Sun, 
  FlaskConical, 
  Eye, 
  Clock, 
  Waves 
} from "lucide-react";

const variants = [
  { id: "acne", label: "ACNE SERUM", Icon: Droplet },
  { id: "peeling", label: "PEELING SERUM", Icon: Layers },
  { id: "brightening", label: "BRIGHTENING SERUM", Icon: Sparkles },
  { id: "vit-c", label: "VITAMIN C SERUM", Icon: Zap },
  { id: "luminous", label: "LUMINOUS SERUM", Icon: Sun },
  { id: "niacinamide", label: "NIACINAMIDE SERUM", Icon: FlaskConical },
  { id: "eye", label: "EYE SERUM", Icon: Eye },
  { id: "anti-aging", label: "ANTI AGING SERUM", Icon: Clock },
  { id: "moisturizing", label: "MOISTURIZING SERUM", Icon: Waves },
];

export default function ProductVariantSection() {
  return (
    <section className="py-10 bg-[#F9FBFC]">
      <div className="container-custom">
        <div className="text-center mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 bg-brand-orange/10 rounded-full mb-6"
          >
            <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.3em] font-onest">
              Varian Produk
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-brand-black mb-4"
          >
            <span className="font-light">TEMUKAN BERBAGAI</span><br />
            <span className="font-black text-brand-orange uppercase">Varian Skincare</span>
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-24 h-1.5 bg-brand-orange mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {variants.map((variant, index) => (
            <motion.div
              key={variant.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 border border-brand-black/5 group"
            >
              <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-2xl bg-[#F8F8F8] group-hover:bg-brand-orange/10 transition-colors duration-500">
                <variant.Icon className="w-10 h-10 text-brand-black/60 group-hover:text-brand-orange transition-colors duration-500" strokeWidth={1.2} />
              </div>
              <h3 className="text-brand-black text-[13px] font-black text-center leading-tight tracking-wider font-onest max-w-[120px]">
                {variant.label}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
