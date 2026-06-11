"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ProductAboutProps {
  categoryName: string;
}

export default function ProductAbout({ categoryName }: ProductAboutProps) {
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const whatsappMessage = encodeURIComponent(`Halo Dreamlab! Saya tertarik untuk maklon produk ${categoryName}. Mohon informasi dan konsultasi lebih lanjut.`);
  const whatsappLink = `https://wa.me/62881027240339?text=${whatsappMessage}`;

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="relative py-20 md:py-28 overflow-hidden bg-white"
    >
      {/* Soft Background Accents */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-brand-orange/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-brand-orange/[0.01] rounded-full blur-[80px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Premium Image Collage (5 Columns) */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, x: -30 },
              show: { opacity: 1, x: 0, transition: { duration: 1.0, ease: "easeOut" } }
            }}
            className="lg:col-span-6 relative w-full h-[480px] sm:h-[580px] flex items-center justify-center"
          >
            {/* Orange Counter Box (Top Left Melayang) */}
            <motion.div 
              variants={{
                hidden: { scale: 0.8, opacity: 0 },
                show: { scale: 1, opacity: 1, transition: { delay: 0.4, duration: 0.8, type: "spring" } }
              }}
              className="absolute top-4 left-2 sm:left-6 z-30 bg-brand-orange text-white p-5 rounded-full shadow-xl shadow-brand-orange/20 flex flex-col items-center justify-center text-center w-36 h-36 sm:w-40 sm:h-40 border-4 border-white"
            >
              {/* Dashed Inner Border */}
              <div className="absolute inset-2 border-2 border-dashed border-white/40 rounded-full pointer-events-none" />
              <span className="text-3xl sm:text-4xl font-black font-display tracking-tight leading-none mb-1">
                1000++
              </span>
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] font-onest opacity-90 leading-tight">
                Brand Sukses
              </span>
            </motion.div>

            {/* Main Big Image (Center Right) */}
            <div className="relative w-[78%] h-[85%] ml-auto rounded-t-[120px] rounded-b-[40px] overflow-hidden shadow-2xl border-4 border-gray-50 bg-[#F9F7F2]">
              <Image 
                src="/new asset/people/foto-bertiga.webp" 
                alt="Dreamlab RnD Expert Team" 
                title="Tim R&D dan Apoteker Ahli — Dreamlab Maklon Kosmetik"
                fill
                priority
                fetchPriority="high"
                decoding="sync"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>

            {/* Small Overlay Image (Bottom Left Melayang) */}
            <motion.div 
              variants={{
                hidden: { y: 30, opacity: 0 },
                show: { y: 0, opacity: 1, transition: { delay: 0.3, duration: 0.8, ease: "easeOut" } }
              }}
              className="absolute bottom-2 left-2 sm:left-6 z-20 w-[42%] h-[42%] rounded-[36px] overflow-hidden shadow-2xl border-[6px] sm:border-[8px] border-white bg-[#F9F7F2]"
            >
              <Image 
                src="/new asset/people/Busdev-dreamlab.png" 
                alt="Apoteker Penanggung Jawab Dreamlab" 
                title="Apoteker Penanggung Jawab — Dreamlab Maklon Kosmetik"
                fill
                sizes="(max-width: 1024px) 42vw, 240px"
                loading="lazy"
                decoding="async"
                className="object-cover object-center"
              />
            </motion.div>
          </motion.div>

          {/* Right Side: Copywriting & Value Propositions (7 Columns) */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, x: 30 },
              show: { opacity: 1, x: 0, transition: { duration: 1.0, ease: "easeOut" } }
            }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            {/* Small Premium Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#F39200]/5 border border-[#F39200]/15 rounded-full w-fit mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange font-onest">
                One-Stop Maklon Service
              </span>
            </div>

            {/* Main Headline - Title Case, Clean Display Font */}
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-normal leading-[1.1] tracking-tight text-brand-black mb-6">
              Wujudkan Brand <span className="text-brand-orange font-normal">{categoryName}</span> Juaranya Formula
            </h2>

            {/* Main Description */}
            <p className="text-base sm:text-[17px] leading-relaxed text-brand-black/75 mb-8">
              Dreamlab adalah perusahaan maklon {categoryName} dengan layanan lengkap dari awal hingga akhir. 
              Kami menawarkan <strong className="text-brand-black font-bold">One Stop Maklon Service</strong>. 
              Didukung penuh oleh sertifikasi resmi <strong className="text-brand-black font-bold">CPKB Grade A, BPOM, dan Halal</strong> untuk menjamin keamanan serta standar kualitas produk premium Anda di pasar.
            </p>

            {/* Value Checklists (2x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10">
              
              <div className="flex items-start gap-3.5 group">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F39200]/5 border border-[#F39200]/15 flex items-center justify-center text-brand-orange group-hover:bg-[#F39200] group-hover:text-white transition-all duration-300">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-black mb-0.5">Legalitas CPKB & BPOM</h4>
                  <p className="text-xs text-brand-black/60 leading-relaxed">Sertifikasi manufaktur CPKB Grade A, BPOM, dan Halal — jaminan izin edar aman.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 group">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F39200]/5 border border-[#F39200]/15 flex items-center justify-center text-brand-orange group-hover:bg-[#F39200] group-hover:text-white transition-all duration-300">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-black mb-0.5">Layanan One Stop Maklon</h4>
                  <p className="text-xs text-brand-black/60 leading-relaxed">Pendampingan penuh mulai konsep, formulasi, hingga siap jual.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 group">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F39200]/5 border border-[#F39200]/15 flex items-center justify-center text-brand-orange group-hover:bg-[#F39200] group-hover:text-white transition-all duration-300">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-black mb-0.5">RnD Formula Juara</h4>
                  <p className="text-xs text-brand-black/60 leading-relaxed">Pengembangan formula unik menggunakan bahan aktif bersertifikasi global.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 group">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F39200]/5 border border-[#F39200]/15 flex items-center justify-center text-brand-orange group-hover:bg-[#F39200] group-hover:text-white transition-all duration-300">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-black mb-0.5">MOQ Fleksibel</h4>
                  <p className="text-xs text-brand-black/60 leading-relaxed">Skala produksi awal terjangkau, ideal bagi pemula maupun korporasi.</p>
                </div>
              </div>

            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-8 pt-4 border-t border-gray-100">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand-orange hover:bg-brand-black text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-brand-orange/10 hover:-translate-y-0.5"
              >
                <span className="uppercase tracking-[0.15em] text-[10px] font-onest">Konsultasi Sekarang</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

          </motion.div>

        </div>
      </div>
    </motion.section>
  );
}
