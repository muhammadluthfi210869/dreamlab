"use client";

import React from 'react';
import { motion } from 'framer-motion';
import AlurMaklonTimeline from '../AlurMaklonTimeline';

export default function ProductProcess() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="relative z-10 bg-[#FDFDFC] pt-12 lg:pt-16 pb-24 lg:pb-32 border-b border-gray-100 overflow-hidden"
    >
      <div className="container-custom">
        <div className="flex flex-col gap-12 lg:gap-16">
          
          {/* Top Header: Restored Original UI & Copy */}
          <div className="max-w-3xl space-y-6">
            <motion.div 
              variants={{
                hidden: { opacity: 0, x: -20 },
                show: { opacity: 1, x: 0, transition: { duration: 0.8 } }
              }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-[3px] bg-brand-orange"></div>
              <span className="text-xs font-black text-brand-orange uppercase tracking-[0.4em]">
                tahapan praktis dan mudah untuk brand kosmetik anda
              </span>
            </motion.div>
            
            <div className="overflow-hidden">
              <motion.h2 
                variants={{
                  hidden: { y: "100%" },
                  show: { y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
                }}
                 className="font-display text-[38px] lg:text-[80px] font-normal text-[#212120] leading-[1.05] tracking-tighter uppercase"
              >
                PROSES MAKLON
              </motion.h2>
            </div>
          </div>

          {/* Sequential Pipeline - Replaced with Infographic 8-Step Timeline */}
          <div className="relative">
            <AlurMaklonTimeline hideHeader={true} />
          </div>

        </div>
      </div>
    </motion.section>
  );
}