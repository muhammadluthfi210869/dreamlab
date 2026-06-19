"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";
import { ChevronRight, Phone, Plus, Minus, ChevronDown, HelpCircle } from "lucide-react";

interface ProductHeroProps {
  category: string;
  tagline: string;
  description: string;
  imageSrc: string;
}

export function ProductHero({ category, tagline, description, imageSrc }: ProductHeroProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-brand-white overflow-hidden">
      <div className="container-custom grid lg:grid-cols-2 gap-12 items-center py-20 relative z-10">
        <div className="space-y-8 animate-in slide-in-from-left duration-700">
          <div className="inline-block px-4 py-1 bg-brand-orange/10 rounded-full">
            <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.3em] font-onest">
              {category}
            </span>
          </div>
          <h1 className="text-6xl lg:text-7xl font-onest text-brand-black leading-tight tracking-wider">
            <span className="font-light">CIPTAKAN BRAND</span><br />
            <span className="font-black text-brand-orange">{category}</span>
          </h1>
          <p className="text-xl text-brand-black/70 max-w-lg font-onest">
            {tagline}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/thankyou/google/"
              className="bg-brand-orange text-brand-white px-8 py-4 rounded-full font-onest font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-brand-orange/20"
            >
              Hubungi Tim Kami <ChevronRight className="w-5 h-5" />
            </Link>
            <Link 
              href="#"
              className="bg-brand-black text-brand-white px-8 py-4 rounded-full font-onest font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-brand-black/20"
            >
              Jadwalkan Pertemuan
            </Link>
          </div>
        </div>
        <div className="relative animate-in slide-in-from-right duration-700">
          <div className="absolute -inset-4 bg-brand-orange/5 rounded-full blur-3xl -z-10" />
          <Image
            src={imageSrc}
            alt={`${category} — Jasa Maklon ${category} BPOM Halal Dreamlab`}
            title={`Jasa Maklon ${category} Dreamlab Indonesia`}
            width={800}
            height={800}
            className="w-full h-auto object-contain drop-shadow-2xl"
          />
        </div>
      </div>
      {/* Decorative text background */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 text-[20vw] font-black text-gray-50 -z-0 whitespace-nowrap pointer-events-none opacity-20 uppercase font-onest">
        {category}
      </div>
    </section>
  );
}

interface ProductCatalogProps {
  category: string;
  items: { name: string; image: string }[];
}

export function ProductCatalog({ category, items }: ProductCatalogProps) {
  return (
    <section className="py-24 bg-brand-white">
      <div className="container-custom">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-display text-brand-black uppercase tracking-widest">
            <span className="font-light">KATALOG PRODUK</span><br />
            <span className="font-black text-brand-orange">{category}</span>
          </h2>
          <div className="w-20 h-1 bg-brand-orange mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.map((item, idx) => (
            <div 
              key={idx}
              className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-brand-orange transition-all duration-500 hover:shadow-2xl hover:shadow-brand-orange/10 text-center"
            >
              <div className="aspect-square relative mb-6 overflow-hidden rounded-2xl bg-gray-50">
                <Image
                  src={item.image}
                  alt={getImageAlt(item.image, item.name)}
                  title={getImageTitle(item.image)}
                  fill
                  className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <h3 className="font-onest font-bold text-brand-black uppercase tracking-wider text-sm group-hover:text-brand-orange transition-colors">
                {item.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BrandMarquee() {
  const logos = [
    { name: "Bebiboster", src: "/assets/images/Bebiboster-300x300.webp" },
    { name: "Chloe Green", src: "/assets/images/1-300x300.webp" },
    { name: "Itnob", src: "/assets/images/Itnob-300x300.webp" },
    { name: "Jilly Daily", src: "/assets/images/Jilly-Daily-300x300.webp" },
    { name: "Tazzi", src: "/assets/images/Tazzi-300x300.webp" },
    { name: "Sense Soul", src: "/assets/images/Sense-Soul-300x300.webp" },
    { name: "Labbol", src: "/assets/images/Labbol-300x300.webp" },
  ];

  return (
    <section className="py-20 bg-brand-white border-y border-gray-100 overflow-hidden">
      <div className="container-custom mb-12 text-center">
        <h2 className="text-3xl font-display text-brand-black uppercase tracking-widest">
          <span className="font-black text-brand-orange">DREAMLAB TELAH DIPERCAYA</span><br />
          <span className="font-light">500+ BRAND</span>
        </h2>
      </div>
      
      <div className="relative flex overflow-hidden">
        <motion.div
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            ease: "linear",
            duration: 25,
            repeat: Infinity,
          }}
          className="flex w-max"
        >
          {/* First set of logos */}
          <div className="flex gap-x-24 items-center px-12">
            {logos.map((logo, idx) => (
              <div key={`brand-set1-${idx}`} className="relative w-48 h-24 grayscale hover:grayscale-0 transition-all duration-500 flex-shrink-0">
                <Image
                  src={logo.src}
                  alt={`Logo ${logo.name} — klien maklon Dreamlab`}
                  title={`${logo.name} — Klien Maklon Kosmetik Dreamlab`}
                  fill
                  className="object-contain"
                  sizes="192px"
                />
              </div>
            ))}
          </div>
          {/* Second set of logos for seamless loop */}
          <div className="flex gap-x-24 items-center px-12">
            {logos.map((logo, idx) => (
              <div key={`brand-set2-${idx}`} className="relative w-48 h-24 grayscale hover:grayscale-0 transition-all duration-500 flex-shrink-0">
                <Image
                  src={logo.src}
                  alt={`Logo ${logo.name} — klien maklon Dreamlab`}
                  title={`${logo.name} — Klien Maklon Kosmetik Dreamlab`}
                  fill
                  className="object-contain"
                  sizes="192px"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function ProductCTA({ category }: { category: string }) {
  return (
    <section className="py-24 relative overflow-hidden bg-brand-orange rounded-[4rem] mx-4 lg:mx-8 my-20">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white/10 -skew-x-12 translate-x-1/2" />
      <div className="container-custom relative z-10 text-center space-y-10">
        <h2 className="text-5xl lg:text-7xl font-display text-brand-white leading-tight uppercase tracking-wider">
          <span className="font-light">SIAP WUJUDKAN</span><br />
          <span className="font-black">BRAND {category} ?</span>
        </h2>
        <p className="text-brand-white/80 text-xl max-w-2xl mx-auto font-onest">
          Maklon {category} BPOM Konsultasi Gratis dengan Business Development untuk Konsep Produk Aman, Formula Juara
        </p>
        <Link
          href="/thankyou/google/"
          className="inline-flex items-center gap-3 bg-brand-white text-brand-orange px-10 py-5 rounded-full font-onest font-black uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-2xl"
        >
          <Phone className="w-6 h-6" />
          Konsultasi Produk Sekarang
        </Link>
      </div>
    </section>
  );
}

interface FAQItem {
  question: string;
  answer: string;
}

export function ProductFAQ({ category, faqs }: { category: string; faqs: FAQItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const premiumEase = [0.16, 1, 0.3, 1] as any;

  return (
    <section className="bg-white py-20 md:py-24 border-t border-neutral-100 relative overflow-hidden w-full">
      {/* Dynamic ambient highlight backdrop */}
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-brand-orange/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        {/* Centered Heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-display font-normal text-brand-black tracking-tight uppercase">
            Ketahui Lebih Lanjut Maklon <span className="text-brand-orange font-bold">{category}</span> Dreamlab
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
            {faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;

              return (
                <div key={idx} className="py-5 first:pt-0 last:pb-0">
                  {/* Trigger Header */}
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left focus:outline-none group"
                  >
                    <div className="flex items-start gap-4 pr-4">
                      {/* Decorative small indicator */}
                      <HelpCircle className={`size-5 mt-0.5 flex-shrink-0 transition-colors duration-300 ${isOpen ? "text-brand-orange" : "text-neutral-400"}`} />
                      
                      <h4 className={`text-sm md:text-base font-bold font-onest leading-snug transition-colors duration-300 ${isOpen ? "text-brand-orange" : "text-neutral-800 group-hover:text-brand-orange"}`}>
                        {faq.question}
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
                          {faq.answer}
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
