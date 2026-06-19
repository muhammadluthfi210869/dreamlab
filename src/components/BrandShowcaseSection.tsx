'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const premiumEase = [0.16, 1, 0.3, 1] as any;

export default function BrandShowcaseSection() {
  return (
    <section className="relative py-20 md:py-28 bg-white overflow-hidden border-b border-gray-50">
      
      {/* Concentric Circular Background Lines - Matching screenshot */}
      <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none hidden md:flex items-center justify-center z-0">
        <div className="absolute w-[600px] h-[600px] rounded-full border border-gray-100 flex items-center justify-center">
          <div className="w-[500px] h-[500px] rounded-full border border-gray-100 flex items-center justify-center">
            <div className="w-[400px] h-[400px] rounded-full border border-gray-100 flex items-center justify-center">
              <div className="w-[300px] h-[300px] rounded-full border border-gray-100 flex items-center justify-center">
                <div className="w-[200px] h-[200px] rounded-full border border-gray-100" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: 4-Grid Asymmetric Layout */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 w-full"
          >
            <div className="grid grid-cols-12 gap-4 items-stretch relative">
              
              {/* Top Left: Main Image (Lab / Scientist) */}
              <div className="col-span-7 relative rounded-[24px] overflow-hidden shadow-xl border border-neutral-100 group min-h-[220px] lg:min-h-[260px]">
                <Image
                  src="/new asset/people/17.webp"
                  alt="Dreamlab R&D Lab"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 60vw, 30vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                <div className="absolute top-1/2 -right-6 -translate-y-1/2 z-20">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="w-12 h-12 rounded-full bg-brand-orange flex items-center justify-center text-white shadow-xl cursor-pointer hover:bg-neutral-900 transition-colors"
                  >
                    <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.div>
                </div>
              </div>

              {/* Top Right: Portfolio Numbers Card */}
              <div className="col-span-5 bg-brand-black border border-brand-orange/15 rounded-[24px] p-5 flex flex-col justify-center items-center text-center shadow-xl text-white">
                <span className="text-3xl md:text-4xl font-extrabold font-onest text-white leading-none tracking-tight">1.000+</span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-orange mt-2 leading-tight">Produk Dikembangkan</span>
                <p className="text-[9px] text-white/50 mt-2 leading-tight">Fasilitas produksi bersertifikat CPKB Grade A</p>
              </div>

              {/* Bottom Left: World Class Innovation Card */}
              <div className="col-span-5 bg-brand-orange rounded-[24px] p-5 flex flex-col justify-center items-center text-center shadow-xl text-white">
                <span className="text-3xl md:text-4xl font-extrabold font-onest text-white leading-none tracking-tight">World Class</span>
                <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-wider leading-tight">Innovation</span>
                <p className="text-[9px] text-white/70 mt-2 leading-tight">500+ formulasi untuk brand di 15+ negara</p>
              </div>

              {/* Bottom Right: Secondary Image (Quality Control) */}
              <div className="col-span-7 relative rounded-[24px] overflow-hidden shadow-xl border border-neutral-100 group min-h-[220px] lg:min-h-[260px]">
                <Image
                  src="/new asset/people/Busdev-dreamlab.png"
                  alt="Dreamlab Quality Control"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 60vw, 30vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl py-1.5 px-3 flex items-center gap-1.5 shadow-md border border-brand-orange/10">
                  <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-brand-black font-onest">BPOM VERIFIED</span>
                </div>
              </div>
              
            </div>
          </motion.div>

          {/* Right Column: Copywriting & CTAs */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: premiumEase, delay: 0.1 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <div className="space-y-2">
              <span className="text-[11px] font-black tracking-[0.25em] text-brand-orange uppercase">
                Dreamlab #JUARA FORMULA
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-brand-black tracking-tight leading-[1.1] uppercase">
                Wujudkan Brand <span className="text-brand-orange text-glow">Bersama Dreamlab</span>
              </h2>
            </div>
            
            <div className="h-[2px] w-16 bg-brand-orange/40 rounded-full" />

            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-medium">
              Dreamlab adalah perusahaan maklon kosmetik dengan layanan lengkap dari awal hingga akhir. Kami menawarkan <strong className="text-brand-black">One Stop Maklon Service</strong>, mulai dari konsultasi, pembuatan formula, desain kemasan, produksi, hingga pengurusan izin BPOM dan Halal.
            </p>

            {/* Interactive CTAs to enhance conversion */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/thankyou/google/"
                className="flex items-center gap-2 bg-brand-orange hover:bg-brand-black text-white hover:text-white px-8 py-4 rounded-2xl font-black text-xs tracking-widest transition-all duration-300 shadow-xl shadow-brand-orange/10 hover:scale-105 active:scale-95"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                KONSULTASI GRATIS (WA)
              </Link>

              <Link 
                href="/services/"
                className="flex items-center gap-1.5 hover:text-brand-orange text-brand-black font-black text-xs tracking-widest py-4 px-6 rounded-2xl group transition-colors"
              >
                PELAJARI ALUR MAKLON
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
