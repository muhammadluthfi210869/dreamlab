"use client";

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ProductCategoryV2 } from "@/types/product-v2";
import { openWARoundRobin } from "@/lib/wa-roundrobin";

interface ProductCTAProps {
  data: ProductCategoryV2;
  productName?: string;
}

export default function ProductCTA({ data, productName }: ProductCTAProps) {
  const displayName = productName || data.name;
  const waMessage = `Halo Dreamlab! Saya tertarik untuk konsultasi bikin Brand ${displayName} saya sendiri. Bisa info langkah awalnya?`;

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="relative z-10 bg-white py-32 md:py-48 overflow-hidden border-t border-gray-100"
    >
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          
          {/* Eyebrow */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
              }
            }}
            className="flex justify-center"
          >
            <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.5em] border-b border-brand-orange pb-2">
              Ready to Scale?
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as any }
              }
            }}
             className="font-display text-[38px] md:text-[52px] lg:text-[80px] font-normal text-[#212120] leading-[1.05] tracking-tight uppercase"
          >
            Wujudkan <br className="hidden md:block"/>
            <span className="text-brand-orange">Brand Impian</span> Anda
          </motion.h2>

          {/* Subtext */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] as any }
              }
            }}
            className="text-brand-gray text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Nggak perlu pusing mikirin pabrik, legalitas, atau formula. Fokus di visi Anda, biar kami yang urus seluruh kompleksitas teknisnya.
          </motion.p>

          {/* Action Button */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] as any }
              }
            }}
            className="pt-8 flex flex-col items-center gap-6"
          >
            <button
              onClick={() => openWARoundRobin(waMessage)}
              className="group relative inline-flex items-center gap-6 px-10 py-5 bg-[#212120] text-white overflow-hidden transition-all duration-500 hover:pr-14"
            >
              <span className="relative z-10 text-[12px] font-black uppercase tracking-[0.3em]">
                Konsultasi Strategis Gratis
              </span>
              <div className="absolute right-0 top-0 h-full w-0 bg-brand-orange transition-all duration-500 group-hover:w-full z-0"></div>
              <ArrowRight className="relative z-10 w-5 h-5 transition-transform duration-500 group-hover:translate-x-2" />
            </button>
            
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Limited Production Slots Monthly
            </p>
          </motion.div>

          {/* Institutional Trust Badges */}
          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] as any }
              }
            }}
            className="mt-24 pt-16 border-t border-gray-100 grid grid-cols-2 md:grid-cols-3 gap-12"
          >
            <div className="text-center space-y-1">
              <div className="text-xl font-black text-[#212120]">Low MOQ</div>
              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Start Small, Scale Fast</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-xl font-black text-[#212120]">Full Support</div>
              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Legal, Design & Production</div>
            </div>
            <div className="text-center space-y-1 col-span-2 md:col-span-1">
              <div className="text-xl font-black text-[#212120]">Free Sampling</div>
              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Validate Your Aroma First</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#F8F9FA] rounded-full blur-[100px] opacity-50 -z-10"></div>
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#FDFDFC] rounded-full blur-[100px] opacity-50 -z-10"></div>
    </motion.section>
  );
}