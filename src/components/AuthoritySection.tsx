"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Shield, CheckCircle, ArrowRight, Award } from "lucide-react";
import { AuthoritySectionData } from "@/types";
import { getImageTitle } from "@/lib/image-utils";

interface AuthoritySectionProps {
  data: AuthoritySectionData;
}

const iconMap: Record<string, React.ReactNode> = {
  shield: <Shield className="w-6 h-6" />,
  check: <CheckCircle className="w-6 h-6" />,
  award: <Award className="w-6 h-6" />
};

export default function AuthoritySection({ data }: AuthoritySectionProps) {
  const [mainImg, secondaryImg, tertiaryImg] = data.images;

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-brand-orange/[0.015] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-brand-orange/[0.01] rounded-full blur-[80px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Content (IT Solutions style) */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Elegant Brand Eyebrow */}
            <div className="inline-flex items-center gap-2">
              <span className="text-brand-orange font-bold text-[11px] uppercase tracking-[0.2em] border-b-2 border-brand-orange/30 pb-1 font-onest">
                Otoritas & Sertifikasi
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-[45px] font-display font-normal text-brand-black leading-[1.1] uppercase tracking-tight">
                {data.headline.split('. ').map((part, i, arr) => (
                  <span key={i} className={i === arr.length - 1 ? "text-brand-orange font-normal italic block mt-1" : ""}>
                    {part}{i < arr.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </h2>
              <p className="text-brand-black/60 text-sm md:text-base leading-relaxed max-w-xl">
                {data.subheadline}
              </p>
            </div>

            {/* Premium Bullet Points with Pebble Icons */}
            <div className="space-y-5">
              {data.points.map((point, idx) => (
                <motion.div
                  key={point.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className="flex gap-4 group"
                >
                  {/* Pebble Icon Container */}
                  <div className="w-14 h-14 bg-brand-orange/5 border border-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 shadow-sm">
                    {iconMap[point.icon]}
                  </div>

                  {/* Bullet Content */}
                  <div className="space-y-1 pt-1">
                    <h3 className="text-sm md:text-base font-extrabold font-onest text-brand-black uppercase tracking-wide">
                      {point.title}
                    </h3>
                    <p className="text-brand-black/60 text-xs md:text-sm leading-relaxed">
                      {point.description}
                    </p>
                    {point.certNo && (
                      <span className="inline-block text-[9px] font-mono font-bold text-brand-orange bg-brand-orange/5 px-2 py-0.5 rounded-md tracking-wider mt-1">
                        {point.certNo}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center gap-6 md:gap-8 pt-4 border-t border-neutral-100">
              <Link
                href={data.ctaLink}
                className="bg-brand-orange hover:bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl transition-all duration-300 group inline-flex items-center gap-2.5 shadow-lg shadow-brand-orange/15 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{data.ctaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Staggered Layout Collage (IT Solutions reference) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 w-full"
          >
            <div className="grid grid-cols-12 gap-4 items-stretch relative">
              
              {/* Top Left: Main Collage Image (Scientist / Lab work) */}
              <div className="col-span-7 relative rounded-[24px] overflow-hidden shadow-xl border border-neutral-100 group min-h-[220px] lg:min-h-[260px]">
                <Image
                  src={mainImg}
                  alt="Dreamlab R&D Lab"
                  title={getImageTitle(mainImg)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 60vw, 30vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                
                {/* Play Video Trigger Widget */}
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

              {/* Bottom Right: Secondary Collage Image (Formulation / Apoteker) */}
              <div className="col-span-7 relative rounded-[24px] overflow-hidden shadow-xl border border-neutral-100 group min-h-[220px] lg:min-h-[260px]">
                <Image
                  src={secondaryImg}
                  alt="Dreamlab Quality Control"
                  title={getImageTitle(secondaryImg)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 60vw, 30vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                
                {/* Custom active verification badge */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl py-1.5 px-3 flex items-center gap-1.5 shadow-md border border-brand-orange/10">
                  <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-brand-black font-onest">BPOM VERIFIED</span>
                </div>
              </div>
              
            </div>
          </motion.div>

        </div>



      </div>
    </section>
  );
}
