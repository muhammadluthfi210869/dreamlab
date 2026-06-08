"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const premiumEase = [0.16, 1, 0.3, 1] as any;

interface FAQItem {
  question: string;
  answer: string;
}

interface AlurFAQProps {
  title: string[];
  items: FAQItem[];
}

export default function AlurFAQ({ items }: AlurFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-20 md:py-24 border-t border-neutral-100 relative overflow-hidden w-full">
      {/* Dynamic ambient highlight backdrop */}
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-brand-orange/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        {/* Centered Heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-display font-normal text-brand-black tracking-tight uppercase">
            Ketahui Lebih Lanjut Maklon <span className="text-brand-orange font-bold">Alur Maklon</span> Dreamlab
          </h2>
          <div className="w-16 h-1 bg-brand-orange mx-auto mt-4 rounded-full" />
        </div>

        {/* Centered Premium Accordions */}
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: premiumEase }}
            viewport={{ once: true, margin: "-50px" }}
            className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 md:p-8 lg:p-10 divide-y divide-neutral-100"
          >
            {items.map((item, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div key={idx} className="py-5 first:pt-0 last:pb-0">
                  {/* Trigger Header */}
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left focus:outline-none group"
                  >
                    <div className="flex items-start gap-4 pr-4">
                      {/* Decorative small indicator */}
                      <HelpCircle className={`size-5 mt-0.5 flex-shrink-0 transition-colors duration-300 ${isOpen ? "text-brand-orange" : "text-neutral-400"}`} />
                      
                      <h4 className={`text-sm md:text-base font-bold font-onest leading-snug transition-colors duration-300 ${isOpen ? "text-brand-orange" : "text-neutral-800 group-hover:text-brand-orange"}`}>
                        {item.question}
                      </h4>
                    </div>

                    {/* Hardware-Accelerated Chevron circle indicator */}
                    <motion.div 
                      animate={{ 
                        rotate: isOpen ? 180 : 0,
                        scale: isOpen ? 1.05 : 1,
                        borderColor: isOpen ? "rgba(246, 145, 30, 0.3)" : "rgba(229, 229, 229, 1)",
                        backgroundColor: isOpen ? "rgba(246, 145, 30, 0.05)" : "rgba(250, 250, 250, 1)",
                        color: isOpen ? "#F6911E" : "#A3A3A3"
                      }}
                      transition={{ duration: 0.4, ease: premiumEase }}
                      className="size-8 rounded-full border flex items-center justify-center flex-shrink-0 shadow-inner group-hover:border-brand-orange/40 group-hover:text-brand-orange"
                    >
                      <ChevronDown className="size-4" />
                    </motion.div>
                  </button>

                  {/* Body Collapsible */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: premiumEase }}
                        className="overflow-hidden"
                      >
                        {/* Gliding dissolve answer panel */}
                        <motion.div 
                          initial={{ y: -8, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.05, ease: premiumEase }}
                          className="pl-9 pt-4 pb-2 text-xs md:text-sm text-neutral-500 leading-relaxed font-normal max-w-[95%]"
                        >
                          {/* Sleek separator line */}
                          <div className="w-8 h-[2px] bg-brand-orange/20 mb-4 rounded-full" />
                          {item.answer}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
