"use client";

import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import Image from "next/image";
import { Star, ShieldCheck, ChevronLeft, ChevronRight, Sparkles, Layers, Package } from "lucide-react";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";

interface Testimonial {
  text: string;
  author: string;
  role: string;
}

interface TestimonialsProps {
  title: string;
  items: Testimonial[];
}

const customTestimonials = [
  {
    index: "01",
    author: "dr. Amalia S.",
    role: "Owner Aesthetics Clinic",
    text: "Awalnya saya ragu formula lab pasaran yang biasa. Ternyata RnD Dreamlab sangat presisi meracik formula khusus klinis jerawat kami. Pasien klinik kami langsung merasakan jerawat reda dalam 3 hari. Repeat order pasien klinik melesat tajam!",
    product: "Clinical Acne Serum",
    productionVolume: "45.000+ Pcs",
    status: "BPOM & Halal Terbit",
    batch: "#DL-ACN-098",
    image: "/assets/images/testi_1.webp"
  },
  {
    index: "02",
    author: "Fiona T.",
    role: "Beauty Influencer & Founder Brand",
    text: "Khawatir urusan BPOM dan sertifikasi Halal bikin pusing dan telat launching produk makeup kami. Ternyata tim Dreamlab mengurus semua dari A sampai Z secara transparan dan sangat cepat. Lip tint kami terbit BPOM tepat waktu, launching sukses besar tanpa drama!",
    product: "Velvet Lip Tint",
    productionVolume: "80.000+ Pcs",
    status: "BPOM & Halal Terbit",
    batch: "#DL-LIP-112",
    image: "/assets/images/testi_2.webp"
  },
  {
    index: "03",
    author: "Reza P.",
    role: "E-Commerce Brand Builder",
    text: "Pengalaman maklon sebelumnya selalu kena hidden fees di tengah jalan yang memotong laba bersih. Di Dreamlab, struktur biaya HPP sangat kompetitif dan transparan sejak awal. Kami bisa dapat margin profit bersih di atas 60% dan bebas mengatur budget marketing!",
    product: "Brightening Sunscreen",
    productionVolume: "120.000+ Pcs",
    status: "BPOM & Halal Terbit",
    batch: "#DL-SUN-854",
    image: "/assets/images/testi_3.webp"
  },
  {
    index: "04",
    author: "Siti K.",
    role: "Brand Skincare Founder",
    text: "Sebagai pemula, modal awal saya sangat terbatas untuk memproduksi massal. Pabrik lain minta MOQ puluhan ribu pcs, tapi Dreamlab memberikan MOQ sangat fleksibel mulai dari 1.000 pcs saja. Batch pertama laku keras, dan sekarang batch ketiga kualitasnya tetap konsisten!",
    product: "Glow Body Lotion",
    productionVolume: "15.000+ Pcs",
    status: "BPOM & Halal Terbit",
    batch: "#DL-LOT-231",
    image: "/assets/images/testi_4.webp"
  }
];

// Elite Custom Easing Curve (Apple / Tom Ford Premium Ease-Out)
const premiumEase = [0.16, 1, 0.3, 1] as any;

const Testimonials: React.FC<TestimonialsProps> = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [xOffset, setXOffset] = useState(560);

  const activeIndex = (page % customTestimonials.length + customTestimonials.length) % customTestimonials.length;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setXOffset(560);
      } else if (window.innerWidth >= 1024) {
        setXOffset(480);
      } else if (window.innerWidth >= 768) {
        setXOffset(380);
      } else {
        setXOffset(260); // Peek-a-boo offset on mobile
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleDotClick = (index: number) => {
    const currentActive = activeIndex;
    if (index === currentActive) return;
    const dir = index > currentActive ? 1 : -1;
    setPage([page + (index - currentActive), dir]);
  };

  const getDiff = (idx: number) => {
    let d = idx - activeIndex;
    const len = customTestimonials.length;
    if (d < -len / 2) d += len;
    if (d > len / 2) d -= len;
    return d;
  };

  return (
    <section className="py-24 lg:py-32 bg-[#FAF9F5] relative overflow-hidden w-full">
      {/* Light soft ambient DNA glow */}
      <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-brand-orange/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 relative z-10">
        
        {/* Section Header - Elegant Slide Down */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: premiumEase }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16 lg:mb-20"
        >
          <span className="text-[11px] font-bold tracking-[0.3em] text-[#3399CC] uppercase bg-[#3399CC]/5 px-4 py-2 rounded-full inline-block mb-5 border border-[#3399CC]/10">
            Kisah Sukses Partner
          </span>
          <h2 className="text-[28px] md:text-[48px] font-normal font-display tracking-tight text-brand-black mb-4 leading-[1.1] uppercase">
            Apa Kata <span className="text-brand-orange">Partner Kami</span>
          </h2>
          <p className="text-sm md:text-base text-gray-500 font-medium max-w-xl mx-auto tracking-wide">
            Bagaimana laboratorium manufaktur Dreamlab membantu brand kecantikan meluncurkan produk klinis terlaris mereka.
          </p>
        </motion.div>

        {/* 3-CARD CAROUSEL SHOWCASE STAGE */}
        <div className="relative w-full h-[540px] md:h-[420px] lg:h-[440px] overflow-visible flex justify-center items-center mb-10">
          {customTestimonials.map((testi, idx) => {
            const isSelected = activeIndex === idx;
            const diff = getDiff(idx);

            // Compute responsive styles dynamically with massive 3D depth ratios
            const isMobile = xOffset < 300;
            const styles = {
              x: diff === 0 ? 0 : diff === -1 ? -xOffset : diff === 1 ? xOffset : diff > 0 ? xOffset * 2 : -xOffset * 2,
              scale: diff === 0 ? 1 : Math.abs(diff) === 1 ? (isMobile ? 0.66 : 0.72) : 0.5,
              opacity: diff === 0 ? 1 : Math.abs(diff) === 1 ? (isMobile ? 0.08 : 0.22) : 0,
              rotate: diff === 0 ? 0 : diff === -1 ? -3 : diff === 1 ? 3 : 0, // Elite Deck Tilt
              zIndex: diff === 0 ? 30 : Math.abs(diff) === 1 ? 10 : 0
            };

            return (
              <motion.div
                key={idx}
                animate={styles}
                transition={{ type: "spring" as const, stiffness: 150, damping: 20 }}
                onClick={() => {
                  if (Math.abs(diff) === 1) {
                    paginate(diff);
                  }
                }}
                className={`absolute w-full max-w-[90%] md:max-w-[620px] lg:max-w-[660px] xl:max-w-[700px] bg-white border border-gray-100/90 rounded-[2.5rem] shadow-[0_20px_50px_rgba(246,145,30,0.03)] overflow-hidden flex flex-col md:flex-row items-stretch select-none transition-shadow duration-300 md:h-[400px] lg:h-[420px] ${isSelected ? "cursor-auto shadow-[0_25px_60px_rgba(246,145,30,0.06)]" : "cursor-pointer hover:shadow-md"}`}
                style={{
                  pointerEvents: Math.abs(diff) <= 1 ? "auto" : "none"
                }}
              >
                
                {/* Left Side: Framed Image Showcase */}
                <div className="w-full md:w-[35%] flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-[#FAF9F5] via-white to-[#FAF9F5] p-6 md:p-0 border-b md:border-b-0 md:border-r border-gray-100/60 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#FAF9F5]/40 to-white/60 z-0 pointer-events-none" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full bg-brand-orange/[0.02] blur-[20px] pointer-events-none z-0" />
                  
                  {/* Framed Polaroid-Style Art Box with custom vertical zero-gravity wave */}
                  <motion.div 
                    animate={isSelected ? {
                      y: [0, -6, 0],
                      rotate: [-2, 0, -2],
                      transition: {
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    } : {
                      y: 0,
                      rotate: 0
                    }}
                    className={`relative w-[130px] md:w-[140px] h-[170px] md:h-[180px] bg-white p-2.5 rounded-2xl border border-gray-100 shadow-[0_8px_20px_rgba(246,145,30,0.05)] transition-opacity duration-500 z-10 ${isSelected ? "opacity-100" : "opacity-40"}`}
                  >
                    <div className="relative w-full h-[80%] rounded-xl overflow-hidden bg-gray-50/50">
                      <Image
                        src={testi.image}
                        alt={getImageAlt(testi.image, testi.product)}
                        title={getImageTitle(testi.image)}
                        fill
                        className="object-contain p-2 mix-blend-multiply"
                        sizes="200px"
                        priority
                      />
                    </div>
                    <div className="h-[20%] flex items-center justify-center pt-1.5">
                      <span className="text-[8px] font-bold tracking-[0.15em] text-gray-400 uppercase">
                        FORMULATION LAB
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Right Side: Editorial Premium Typography Block */}
                <div className="w-full md:w-[65%] p-8 lg:p-10 flex flex-col justify-between space-y-4 bg-white relative">
                  
                  {/* Trust Priming */}
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} fill="#F6911E" color="#F6911E" />
                        ))}
                      </div>
                      
                      <span className="text-[8px] font-bold tracking-[0.15em] text-[#3399CC] uppercase bg-[#3399CC]/5 px-2.5 py-0.5 rounded-full border border-[#3399CC]/10">
                        Formula Terverifikasi
                      </span>
                    </div>

                    {/* Testimonial Quote (Softened opacity for side cards to boost depth contrast) */}
                    <blockquote className={`text-[13px] md:text-sm lg:text-[15px] leading-[1.65] font-medium italic font-sans transition-all duration-500 ${isSelected ? "text-brand-black/90" : "text-brand-black/20"}`}>
                      &quot;{testi.text}&quot;
                    </blockquote>
                  </div>

                  {/* Profile Block */}
                  <div className="flex items-center gap-3">
                    <div className="relative p-[1.5px] rounded-full bg-gradient-to-tr from-brand-orange to-[#3399CC] shadow-sm">
                      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-onest font-black text-[10px] text-brand-black">
                        {testi.author.split(' ')[0].charAt(0)}{testi.author.split(' ').length > 1 ? testi.author.split(' ')[1].charAt(0) : ''}
                      </div>
                    </div>
                    <div>
                      <cite className="font-onest font-black text-xs md:text-sm not-italic text-brand-black block tracking-tight">
                        {testi.author}
                      </cite>
                      <span className="text-[8px] text-gray-400 font-bold block mt-0.5 tracking-wide uppercase">{testi.role}</span>
                    </div>
                  </div>

                  {/* High-End Clean Tags Row */}
                  <div className={`flex flex-wrap gap-1.5 pt-4 border-t border-gray-100 transition-all duration-500 ${isSelected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 md:pointer-events-none"}`}>
                    <div className="flex items-center gap-1 px-2.5 py-0.5 bg-gray-50 rounded-full text-[9px] font-bold text-gray-600 border border-gray-100/80">
                      <Sparkles size={9} className="text-[#3399CC]" />
                      <span>{testi.product}</span>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-0.5 bg-brand-orange/[0.03] rounded-full text-[9px] font-mono font-bold text-brand-orange border border-brand-orange/10">
                      <Layers size={9} className="text-brand-orange" />
                      <span>{testi.batch}</span>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-0.5 bg-[#3399CC]/[0.03] rounded-full text-[9px] font-bold text-[#3399CC] border border-[#3399CC]/10">
                      <Package size={9} className="text-[#3399CC]" />
                      <span>{testi.productionVolume}</span>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-0.5 bg-green-50/60 rounded-full text-[9px] font-bold text-green-600 border border-green-100/50">
                      <ShieldCheck size={9} className="text-green-500" />
                      <span>BPOM & Halal</span>
                    </div>
                  </div>

                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Control Center */}
        <div className="flex justify-center items-center gap-8">
          
          {/* Prev Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => paginate(-1)}
            className="w-10 h-10 rounded-full border border-gray-200/80 bg-white flex items-center justify-center hover:border-brand-orange hover:bg-brand-orange/[0.02] text-gray-500 hover:text-brand-orange transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={16} />
          </motion.button>

          {/* Pagination dots */}
          <div className="flex gap-2">
            {customTestimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                className={`h-2 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 ${activeIndex === i ? 'w-6 bg-brand-orange shadow-sm' : 'w-2 bg-brand-orange/20 hover:bg-brand-orange/45'}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => paginate(1)}
            className="w-10 h-10 rounded-full border border-gray-200/80 bg-white flex items-center justify-center hover:border-brand-orange hover:bg-brand-orange/[0.02] text-gray-500 hover:text-brand-orange transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
            aria-label="Next testimonial"
          >
            <ChevronRight size={16} />
          </motion.button>

        </div>

      </div>
    </section>
  );
};

export default Testimonials;
