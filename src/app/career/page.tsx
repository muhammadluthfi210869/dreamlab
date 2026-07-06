"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  Lightbulb, 
  Users, 
  TrendingUp, 
  Heart, 
  ShieldCheck,
  MapPin,
  ArrowRight
} from "lucide-react";

const premiumEase = [0.16, 1, 0.3, 1] as any;

const cultureItems = [
  {
    icon: Lightbulb,
    title: "Inovasi Tanpa Henti",
    desc: "Kami percaya ide terbaik lahir dari rasa ingin tahu yang terus tumbuh."
  },
  {
    icon: Users,
    title: "Satu Tim, Satu Tujuan",
    desc: "Kolaborasi, saling dungung, dan komunikasi terbuka adalah kunci kami."
  },
  {
    icon: TrendingUp,
    title: "Tumbuh Bersama",
    desc: "Kami berinvestasi dalam pengembangan diri dan karier setiap individu."
  },
  {
    icon: Heart,
    title: "Berdampak Nyata",
    desc: "Karya kami membantu mewujudkan mimpi brand dan kecantikan yang aman."
  },
  {
    icon: ShieldCheck,
    title: "Integritas & Profesional",
    desc: "Kami bekerja dengan standar tinggi, jujur, dan bertanggung jawab."
  }
];

const openPositions = [
  {
    id: "rd-formulation",
    dept: "R&D",
    title: "R&D Formulation Specialist",
    location: "Surabaya",
    type: "Full-time",
    deptBg: "bg-blue-50 text-blue-600 border-blue-100"
  },
  {
    id: "digital-marketing",
    dept: "MARKETING",
    title: "Digital Marketing Strategist",
    location: "Surabaya",
    type: "Full-time",
    deptBg: "bg-orange-50 text-orange-600 border-orange-100"
  },
  {
    id: "packaging-design",
    dept: "DESIGN",
    title: "Packaging & Graphic Designer",
    location: "Surabaya",
    type: "Full-time",
    deptBg: "bg-purple-50 text-purple-600 border-purple-100"
  },
  {
    id: "production-supervisor",
    dept: "PRODUCTION",
    title: "Production Supervisor",
    location: "Surabaya",
    type: "Full-time",
    deptBg: "bg-amber-50 text-amber-600 border-amber-100"
  }
];

export default function CareerPage() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopyEmail = (jobTitle: string) => {
    navigator.clipboard.writeText("humanresource@dreamlab.id");
    setCopiedText(jobTitle);
    setTimeout(() => setCopiedText(null), 2500);
  };

  return (
    <main className="bg-[#FAF9F6] text-brand-black min-h-screen font-sans selection:bg-[#f39200] selection:text-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[95vh] flex items-center pt-36 sm:pt-44 md:pt-48 pb-24 md:pb-32 bg-[#E5EEF9]">
        {/* Background Visual Image (Right Side) */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src="/new asset/people/bg-career.png"
            alt="Dreamlab Indonesia Career Team"
            fill
            priority
            unoptimized={true}
            className="object-cover object-[85%_center] md:object-right-bottom"
            sizes="100vw"
          />
          {/* Soft gradient overlay to blend left side content and keep text readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#E5EEF9]/95 via-[#E5EEF9]/85 to-transparent md:from-[#E5EEF9]/90 md:via-[#E5EEF9]/55 md:to-transparent z-10" />
        </div>

        <div className="container-custom relative z-20 w-full">
          <div className="max-w-xl md:max-w-2xl lg:max-w-3xl space-y-8 md:space-y-10 text-left">
            
            <h1 className="space-y-1 sm:space-y-2 font-display">
              <span className="block text-[#112b3e] text-[36px] sm:text-[48px] md:text-[58px] lg:text-[70px] xl:text-[74px] font-normal leading-[1.08] tracking-tight max-w-[740px] uppercase font-display">
                Berkarya.
              </span>
              <span className="block text-[#112b3e] text-[36px] sm:text-[48px] md:text-[58px] lg:text-[70px] xl:text-[74px] font-normal leading-[1.08] tracking-tight max-w-[740px] uppercase font-display">
                Bertumbuh.
              </span>
              <span className="block text-[#0F67FF] text-[36px] sm:text-[48px] md:text-[58px] lg:text-[70px] xl:text-[74px] font-normal leading-[1.08] tracking-tight max-w-[740px] uppercase font-display">
                Berdampak.
              </span>
            </h1>

            {/* Separator Line (Mockup Blue) */}
            <div className="w-16 h-1 bg-[#0F67FF] rounded-full" />

            <div className="space-y-4">
              <p className="text-neutral-700 text-sm md:text-base font-semibold font-sans flex items-center gap-1.5">
                Yuk bergabung bersama Dreamlab ✨
              </p>
            </div>

            <div>
              <Link
                href="#open-positions"
                className="group inline-flex items-center justify-center gap-3 bg-[#0F67FF] hover:bg-[#0055E0] text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-[0_15px_30px_rgba(15,103,255,0.2)] hover:-translate-y-1 text-xs md:text-sm font-onest uppercase tracking-wider"
              >
                <span>Cek Posisi Tersedia</span>
                <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CULTURE BANNER (Overlapping Card Row) */}
      <section className="relative z-30 -mt-16 md:-mt-20 mb-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: premiumEase }}
            className="bg-white rounded-[32px] p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-neutral-100/80 w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 divide-y md:divide-y-0 lg:divide-x divide-neutral-100">
              {cultureItems.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div 
                    key={idx} 
                    className={`flex flex-col items-center lg:items-start text-center lg:text-left py-4 md:py-2 ${
                      idx > 0 ? "lg:pl-6" : ""
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#0F67FF]/10 flex items-center justify-center text-[#0F67FF] mb-4 shrink-0 shadow-sm">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm md:text-base font-black text-[#11253c] tracking-tight mb-2 font-display uppercase leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-500 font-medium font-sans leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. OPEN POSITIONS SECTION */}
      <section id="open-positions" className="py-16 md:py-24 bg-[#FAF9F6] relative z-10 scroll-mt-24">
        <div className="container-custom space-y-12">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-neutral-200/60 pb-6">
            <div className="space-y-2 text-left">
              <h2 className="text-3xl sm:text-[38px] md:text-[44px] font-black uppercase tracking-tight text-[#11253c] font-display">
                Posisi Terbuka
              </h2>
              <div className="w-12 h-1 bg-[#f39200] rounded-full" />
            </div>
            <Link 
              href="#open-positions"
              className="group text-sm font-black text-[#f39200] uppercase tracking-wider flex items-center gap-1.5 hover:text-brand-black transition-colors"
            >
              <span>Lihat Semua Lowongan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {openPositions.map((pos) => (
              <motion.div
                key={pos.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: premiumEase }}
                className="bg-white border border-neutral-100 rounded-[28px] p-6 text-left flex flex-col justify-between min-h-[250px] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Category Badge */}
                  <span className={`inline-block text-[9px] font-black px-2.5 py-1 rounded-md tracking-widest uppercase border ${pos.deptBg}`}>
                    {pos.dept}
                  </span>
                  
                  {/* Title */}
                  <h3 className="text-base md:text-lg font-black text-[#11253c] tracking-tight leading-snug line-clamp-2 font-display uppercase">
                    {pos.title}
                  </h3>
                </div>

                <div className="space-y-4 pt-6 border-t border-neutral-100">
                  {/* Metadata: Location & Type */}
                  <div className="space-y-2 text-xs font-semibold text-neutral-500 font-sans">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                      <span>{pos.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-neutral-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                      <span>{pos.type}</span>
                    </div>
                  </div>

                  {/* Apply / Detail Link */}
                  <button 
                    onClick={() => handleCopyEmail(pos.title)}
                    className="group text-xs font-black text-[#f39200] uppercase tracking-wider flex items-center gap-1 hover:text-brand-black transition-colors pt-1 text-left"
                  >
                    <span>{copiedText === pos.title ? "Email Disalin!" : "Lihat Detail"}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. CLOSING CTA BANNER */}
      <section className="py-16 md:py-24 bg-[#FAF9F6] relative z-10">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: premiumEase }}
            className="bg-gradient-to-r from-[#E5EEF9] to-[#F1F6FC] rounded-[32px] p-8 md:p-12 text-[#11253c] shadow-lg relative overflow-hidden min-h-[340px] flex items-center w-full border border-neutral-100"
          >
            {/* Background Image on Right Side */}
            <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[45%] md:w-[40%] z-0 select-none pointer-events-none opacity-30 sm:opacity-100 mix-blend-multiply">
              <Image
                src="/new asset/people/career_cta_cosmetics.jpg"
                alt="Dreamlab Cosmetics Showcase"
                fill
                unoptimized={true}
                className="object-cover sm:object-contain object-right"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>

            {/* Left side copywriting content */}
            <div className="relative z-20 max-w-xl space-y-6 text-left w-full sm:w-[60%]">
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl md:text-[36px] font-black uppercase leading-[1.12] tracking-tight font-display text-[#112b3e]">
                  Siap menjadi bagian dari<br />
                  perjalanan besar Dreamlab?
                </h2>
                <p className="text-sm md:text-base text-neutral-500 font-medium font-sans leading-relaxed">
                  Kirimkan CV terbaikmu ke <span className="font-bold text-[#112b3e]">humanresource@dreamlab.id</span> dan wujudkan karier impianmu bersama kami.
                </p>
              </div>

              <div>
                <button
                  onClick={() => handleCopyEmail("general")}
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#f39200] hover:bg-brand-black text-white font-extrabold py-4 px-10 rounded-full transition-all duration-300 shadow-[0_12px_24px_rgba(243,146,0,0.2)] hover:-translate-y-0.5 text-xs sm:text-sm uppercase tracking-wider"
                >
                  <span>{copiedText === "general" ? "Email Disalin!" : "Lamar Sekarang"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
