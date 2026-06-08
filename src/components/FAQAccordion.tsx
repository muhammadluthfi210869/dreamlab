"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={index}
            className={`border border-brand-black/10 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-lg shadow-brand-orange/5 border-brand-orange/20' : 'hover:border-brand-orange/30'}`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between p-6 md:p-8 text-left bg-white transition-colors"
            >
              <span className={`text-lg md:text-xl font-onest font-bold uppercase tracking-tight transition-colors ${isOpen ? 'text-brand-orange' : 'text-brand-black'}`}>
                {item.question}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className={`${isOpen ? 'text-brand-orange' : 'text-brand-black/40'}`}
              >
                <ChevronDown size={24} />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-8 md:px-8 md:pb-10 text-brand-black/70 leading-relaxed text-lg">
                    <div className="w-12 h-1 bg-brand-orange/20 mb-6 rounded-full" />
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
