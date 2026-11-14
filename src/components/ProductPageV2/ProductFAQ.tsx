"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { getProductFaqs } from "@/data/product-faqs";

interface ProductFAQProps {
  categorySlug: string;
  categoryName: string;
  subCategorySlug?: string;
  productSlug?: string;
  productName?: string;
}

export default function ProductFAQ({ categorySlug, categoryName, subCategorySlug, productSlug, productName }: ProductFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = getProductFaqs(categorySlug, subCategorySlug, productSlug);
  const displayName = productName || categoryName;

  return (
    <section className="bg-white py-20 md:py-24 border-t border-neutral-100 relative overflow-hidden w-full">
      {/* Dynamic ambient highlight backdrop */}
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-brand-orange/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        {/* Centered Heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-display font-normal text-brand-black tracking-tight uppercase">
            Ketahui Lebih Lanjut Maklon <span className="text-brand-orange font-bold">{displayName}</span> Dreamlab
          </h2>
          <div className="w-16 h-1 bg-brand-orange mx-auto mt-4 rounded-full" />
        </div>

        {/* Centered Premium Accordions — All answers rendered in SSR HTML */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 md:p-8 lg:p-10 divide-y divide-neutral-100">
            {faqs.map((item, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div key={idx} className="py-5 first:pt-0 last:pb-0">
                  {/* Trigger Header */}
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left focus:outline-none group"
                  >
                    <div className="flex items-start gap-4 pr-4">
                      <HelpCircle className={`size-5 mt-0.5 flex-shrink-0 transition-colors duration-300 ${isOpen ? "text-brand-orange" : "text-neutral-400"}`} />
                      <h3 className={`text-sm md:text-base font-bold font-onest leading-snug transition-colors duration-300 ${isOpen ? "text-brand-orange" : "text-neutral-800 group-hover:text-brand-orange"}`}>
                        {item.question}
                      </h3>
                    </div>

                    <div
                      className={`size-8 rounded-full border flex items-center justify-center flex-shrink-0 shadow-inner transition-all duration-300 ${
                        isOpen
                          ? "rotate-180 border-brand-orange/30 bg-brand-orange/5 text-brand-orange"
                          : "border-neutral-200 bg-neutral-50 text-neutral-400 group-hover:border-brand-orange/40 group-hover:text-brand-orange"
                      }`}
                    >
                      <ChevronDown className="size-4" />
                    </div>
                  </button>

                  {/* Body Collapsible — Always rendered in initial HTML for SSR/SEO */}
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pl-9 pt-4 pb-2 text-xs md:text-sm text-neutral-600 leading-relaxed font-normal max-w-[95%]">
                        <div className="w-8 h-[2px] bg-brand-orange/20 mb-4 rounded-full" />
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}