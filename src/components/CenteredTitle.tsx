"use client";

import { motion } from "framer-motion";

interface CenteredTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  light?: boolean;
}

export default function CenteredTitle({ title, subtitle, className = "", light = false }: CenteredTitleProps) {
  return (
    <section className={`py-12 md:py-20 bg-white ${className}`}>
      <div className="container-custom text-center">
        <div className="space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-2xl md:text-[32px] font-normal tracking-widest ${light ? 'text-[#444444]' : 'text-brand-orange'}`}
            style={{ fontFamily: light ? 'var(--font-helvetica)' : 'var(--font-viga)' }}
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-5xl lg:text-[50px] font-black font-onest text-brand-orange leading-tight tracking-tight"
            >
              {subtitle}
            </motion.h3>
          )}
        </div>
      </div>
    </section>
  );
}
