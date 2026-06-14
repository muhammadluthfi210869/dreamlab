"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  PackageCheck, 
  Headphones, 
  Award,
  TrendingUp,
  MessageCircle,
  CheckCircle2
} from "lucide-react";

const premiumEase = [0.16, 1, 0.3, 1] as any;

const parfumBg = "#EAD7CD";
const parfumVivid = "#E2BC86";

export default function MaklonParfumAdsLP() {
  const benefits = [
    "Free Custom Formula",
    "Free Desain Kemasan",
    "Free BPOM & Halal",
    "Free HKI",
    "Free Konsultasi"
  ];

  const usps = [
    {
      title: "Aromanya Eksklusif",
      desc: "Formula parfum dirancang unik dan eksklusif oleh perfumer ahli kami — wewangian berkelas yang tidak akan ditemukan di pasar massal.",
      tag: "tidak ada di mana-mana",
      icon: <Sparkles className="w-6 h-6 text-brand-orange" />
    },
    {
      title: "Kemasan Menawan",
      desc: "Desain botol dan kotak kemasan mewah berstandar estetika tinggi. Membuat produk Anda langsung mencuri perhatian saat pertama kali dilihat.",
      tag: "bikin orang berhenti scroll",
      icon: <Layers className="w-6 h-6 text-brand-orange" />
    },
    {
      title: "Legalitas Kilat",
      desc: "Seluruh sertifikasi keamanan, izin edar BPOM, Halal MUI, hingga pendaftaran Hak Kekayaan Intelektual (HKI) kami yang mengurus.",
      tag: "jual hari ini, legal besok",
      icon: <ShieldCheck className="w-6 h-6 text-brand-orange" />
    },
    {
      title: "Produk Siap Jual",
      desc: "Parfum Anda dikirim dalam keadaan selesai diproduksi, dikemas rapi, dan siap didistribusikan ke pasar ritel atau online store.",
      tag: "bukan siap dirakit",
      icon: <PackageCheck className="w-6 h-6 text-brand-orange" />
    },
    {
      title: "Layanan BD Responsif",
      desc: "Dukungan konsultasi berkelanjutan dan bantuan sales manager yang siaga menangani setiap kebutuhan dan kendala operasional Anda.",
      tag: "ada yang bisa dihubungi",
      icon: <Headphones className="w-6 h-6 text-brand-orange" />
    },
    {
      title: "Merek Premium",
      desc: "Formulasi bahan baku impor berkualitas tinggi memastikan ketahanan aroma dan prestise yang menempatkan brand Anda di level global.",
      tag: "berdiri sejajar",
      icon: <Award className="w-6 h-6 text-brand-orange" />
    }
  ];

  return (
    <div className="landing-page-ads min-h-screen bg-[#FAF9F6] text-brand-black font-sans selection:bg-brand-orange selection:text-white">

      {/* 1. HEADER */}
      <header className="w-full bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik-.webp"
              alt="Dreamlab Logo"
              width={160}
              height={52}
              className="h-10 sm:h-12 w-auto object-contain"
              priority
            />
          </Link>
          <a
            href="/thankyou-maklon/"
            className="bg-brand-orange text-white px-5 py-2.5 rounded-xl font-bold text-xs font-onest uppercase tracking-wider hover:bg-brand-black transition-all duration-300 flex items-center gap-2 shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Hubungi Sales</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>
      </header>

      {/* 2. HERO */}
      <section className="relative min-h-[600px] lg:min-h-screen xl:min-h-[800px] flex items-center overflow-hidden bg-white pt-24 pb-16 lg:pt-36 lg:pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "translate3d(0,0,0)",
          }}
        >
          <Image
            src="/new asset/background-visual-hero-section/parfum.webp"
            alt="Dreamlab Premium Parfum"
            fill
            priority
            fetchPriority="high"
            decoding="sync"
            className="object-cover"
            sizes="100vw"
            style={{
              imageRendering: "auto",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.0 }}
            className="absolute inset-0 bg-gradient-to-r from-white/55 via-white/20 to-transparent z-10 hidden lg:block"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.0 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.45)_0%,transparent_95%)] lg:hidden z-10"
          />
        </motion.div>

        <div className="container-custom relative z-20 w-full">
          <div className="max-w-2xl lg:max-w-3xl">

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="inline-flex items-center gap-3 px-3 py-1 bg-brand-orange/5 rounded-full mb-2.5 md:mb-4 border border-brand-orange/20 backdrop-blur-sm"
            >
              <span className="w-1 h-1 rounded-full bg-brand-orange" />
              <span className="text-[9px] lg:text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] font-onest">
                Dreamlab #JUARAFORMULA
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 1, ease: premiumEase }}
              className="font-normal text-brand-black mb-3 md:mb-4 leading-[1.1] tracking-tight uppercase text-[28px] sm:text-[38px] md:text-[48px] lg:text-[64px] xl:text-[72px]"
              style={{ textShadow: '0 0 30px rgba(255,255,255,0.8)' }}
            >
              <span className="text-brand-orange">Mau Buat Brand</span>
              <br />
              <span className="text-brand-orange italic">Parfum Premium?</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 1 }}
              className="text-xs sm:text-sm text-brand-black/80 lg:text-brand-black/70 font-medium leading-relaxed mb-6 md:mb-8 max-w-xl lg:text-[18px] xl:text-[20px]"
              style={{ textShadow: '0 0 20px rgba(255,255,255,0.5)' }}
            >
              Kami racikkan formulanya. Kami desainkan kemasannya. Kami urus BPOM, Halal, HKI-nya. <strong className="text-brand-black font-semibold">Kamu tinggal jual.</strong>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.8 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6 md:mb-8 max-w-xl"
            >
              {benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-brand-orange/15 px-3 py-2 rounded-xl shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                  <span className="text-[11px] sm:text-xs font-bold text-brand-black/90 tracking-wide font-onest">
                    {benefit}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6"
            >
              <a
                href="/thankyou-maklon/"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-brand-orange hover:bg-brand-black text-white font-bold py-4 px-10 rounded-xl transition-all duration-500 shadow-[0_15px_30px_rgba(246,145,30,0.15)] hover:-translate-y-1"
              >
                <span className="uppercase tracking-[0.2em] text-[10px] font-onest">KONSULTASIKAN BRAND ANDA SEKARANG</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </motion.div>

          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 1 }}
          className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F9F7F2] to-transparent z-10"
        />
      </section>

      {/* 3. URGENCY & MARKET — Warm/Light Version (No Dark Mode) */}
      <section
        className="relative py-20 md:py-28 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${parfumBg}22 0%, #FAF9F6 50%, ${parfumVivid}22 100%)` }}
      >
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] opacity-[0.08] blur-[100px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${parfumVivid} 0%, transparent 70%)` }}
        />

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left: Stat Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                className="w-full max-w-[360px] border rounded-[32px] p-8 md:p-10 flex flex-col justify-center text-left shadow-2xl relative"
                style={{ backgroundColor: `${parfumBg}33`, borderColor: `${parfumVivid}44` }}
              >
                <div className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${parfumVivid}22` }}>
                  <TrendingUp className="w-6 h-6 text-brand-orange" />
                </div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-orange">
                  PARFUM LOKAL MARKET
                </span>
                <span className="text-6xl md:text-7xl font-extrabold font-onest text-brand-black leading-none tracking-tight mt-4">
                  +23%
                </span>
                <span className="text-sm font-bold text-brand-black/90 mt-2">
                  Tumbuh Setiap Tahun
                </span>
                <p className="text-xs text-brand-black/50 mt-4 leading-relaxed">
                  Konsumen di Indonesia semakin memprioritaskan merek lokal. Ini adalah momentum emas bagi brand Anda.
                </p>
              </div>
            </div>

            {/* Right: Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="text-[11px] font-black tracking-[0.25em] text-brand-orange uppercase font-onest">
                MOMENTUM PASAR EMAS
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-brand-black tracking-tight leading-[1.1] uppercase font-display">
                Kenapa Kamu Harus Mulai Brand Parfum Bareng DreamLab <span className="text-brand-orange">Sekarang</span>
              </h2>

              <div className="h-[2px] w-16 bg-brand-orange/40 rounded-full" />

              <div className="space-y-4 text-brand-black/80 text-sm md:text-base leading-relaxed font-medium">
                <p>
                  Pasar parfum lokal Indonesia sedang meledak dan tumbuh 23% per tahun. Konsumen makin bangga dan memilih brand lokal karena kualitas yang bersaing.
                </p>
                <p className="border-l-4 border-brand-orange pl-4 italic bg-brand-orange/[0.03] py-3 pr-3 rounded-r-xl text-brand-black/70">
                  "Tapi slot di pasar ini tidak menunggu. Setiap hari yang kamu tunda, ada brand owner lain yang sudah memesan sampel pertamanya di DreamLab."
                </p>
              </div>

              <div className="pt-4">
                <a
                  href="/thankyou-maklon/"
                  className="bg-brand-orange text-white px-8 py-4.5 rounded-xl font-bold text-xs sm:text-sm font-onest uppercase tracking-widest hover:bg-brand-black hover:scale-[1.03] active:scale-95 transition-all duration-300 inline-flex items-center gap-3"
                >
                  <span>Minta Sampel Parfum Pertamamu</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. USP GRID */}
      <section className="bg-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none hidden lg:flex items-center justify-center z-0 opacity-40">
          <div className="absolute w-[700px] h-[700px] rounded-full border border-gray-200/50 flex items-center justify-center">
            <div className="w-[500px] h-[500px] rounded-full border border-gray-200/50 flex items-center justify-center">
              <div className="w-[300px] h-[300px] rounded-full border border-gray-200/50" />
            </div>
          </div>
        </div>

        <div className="container-custom relative z-10 text-center space-y-16">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-[11px] font-black tracking-[0.25em] text-brand-orange uppercase font-onest">
              KEUNGGULAN UTAMA
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-brand-black tracking-tight leading-[1.1] uppercase font-display">
              Kenapa Kamu Harus Mulai Brand Parfum <span className="text-brand-orange">Bareng DreamLab</span>
            </h2>
            <div className="h-[2px] w-20 bg-brand-orange/40 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-left">
            {usps.map((usp, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-[28px] border border-gray-100 shadow-sm hover:border-brand-orange/20 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-orange/5 border border-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300">
                    {usp.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg md:text-xl font-bold text-brand-black leading-snug">
                      {usp.title}
                    </h3>
                    <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                      {usp.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-orange bg-brand-orange/[0.06] px-3 py-1 rounded-full">
                    {usp.tag}
                  </span>
                  <span className="text-xs font-semibold text-neutral-300 group-hover:text-brand-orange transition-colors">
                    0{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <a
              href="/thankyou-maklon/"
              className="bg-brand-orange text-white px-8 py-5 rounded-2xl font-black text-xs sm:text-sm font-onest uppercase tracking-widest shadow-xl shadow-brand-orange/10 hover:bg-brand-black hover:scale-[1.03] active:scale-95 transition-all duration-300 inline-flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              <span>KONSULTASIKAN BRAND ANDA SEKARANG</span>
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>

        </div>
      </section>

      {/* 5. CLOSING CTA — Homepage style background visual */}
      <section className="relative w-full overflow-hidden bg-white min-h-[420px] sm:min-h-[480px] md:min-h-[500px] lg:min-h-[580px] flex items-center border-t border-b border-neutral-100">

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0 }}
          className="absolute inset-0 z-0 select-none pointer-events-none bg-white"
        >
          <Image
            src="/new asset/new-icon-packing-design/sampul-web-2.webp"
            alt="Dreamlab Cosmetics Showcase"
            fill
            unoptimized={true}
            priority={true}
            className="object-cover object-[78%_center] sm:object-[82%_center] md:object-[86%_center] lg:object-[88%_center] xl:object-[92%_center]"
          />
          <div className="absolute inset-y-0 left-0 w-[50%] bg-gradient-to-r from-white via-white/60 to-transparent z-10 hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/45 to-transparent md:hidden z-10" />
        </motion.div>

        <div className="container-custom relative z-20 w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full py-16 md:py-24">

            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-span-12 md:col-span-6 lg:col-span-6 text-left z-20 flex flex-col justify-center"
            >
              <h2 className="text-brand-orange text-[30px] sm:text-[40px] md:text-[38px] lg:text-[48px] xl:text-[54px] font-display font-extrabold leading-[1.12] tracking-tight font-onest mb-6 uppercase">
                Siap Mewujudkan Brand Parfum Impian Anda?
              </h2>

              <p className="text-neutral-500 text-sm md:text-base leading-relaxed mb-8 font-sans max-w-lg">
                Mulai langkah sukses bisnis parfum premium Anda bersama tim ahli kami. Kami memandu konsultasi formula, desain, legalitas, hingga produk tiba di gudang Anda.
              </p>

              <div className="rounded-2xl w-fit mt-2">
                <a
                  href="/thankyou-maklon/"
                  className="inline-flex items-center justify-center bg-brand-orange hover:bg-[#D98200] hover:scale-[1.03] text-white px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-extrabold text-sm md:text-base lg:text-lg uppercase tracking-wider transition-all duration-300 shadow-xl shadow-brand-orange/15 w-fit"
                >
                  Jadwalkan Konsultasi Gratis (WA)
                </a>
              </div>
            </motion.div>

            <div className="hidden md:block md:col-span-6 lg:col-span-6 h-full" />

          </div>
        </div>
      </section>

      {/* FLOATING WA BUTTON */}
      <a
        href="/thankyou-maklon/"
        className="fixed bottom-6 right-6 z-50 bg-[#25d366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
        aria-label="Contact via WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
        <span className="absolute right-full mr-4 bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-bold shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">Chat with us!</span>
      </a>

      {/* 6. FOOTER — Warm tone */}
      <footer
        className="py-10 border-t"
        style={{ backgroundColor: `${parfumBg}55`, borderColor: `${parfumVivid}22` }}
      >
        <div className="container-custom text-center space-y-4">
          <Image
            src="/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik-.webp"
            alt="Dreamlab Logo"
            width={120}
            height={38}
            className="h-8 w-auto mx-auto object-contain"
          />
          <p className="text-[10px] font-medium text-brand-black/40 tracking-wide uppercase mt-4">
            © PT Karya Impian Laboratoris. All Rights Reserved.
          </p>
          <div className="flex justify-center gap-6 text-[10px] text-brand-black/40 font-bold uppercase tracking-wider">
            <Link href="/privacy-policy" className="hover:text-brand-orange transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms-of-service" className="hover:text-brand-orange transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
