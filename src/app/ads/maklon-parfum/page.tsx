"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, FlaskConical, Sparkles, ShieldCheck, TrendingUp, Paintbrush, Target, Activity } from "lucide-react";
import { useMetaAdsCtaPixel } from "@/lib/meta-ads-pixel";
import Link from "next/link";

const ease = [0.16, 1, 0.3, 1] as any;

export default function MaklonParfumAdsLP() {
  useMetaAdsCtaPixel("Maklon Parfum");

  return (
    <div className="landing-page-ads min-h-screen bg-[#F7F9FF] text-[#111827] font-sans selection:bg-[#FF6A1A] selection:text-white">
      
      {/* 1. HERO */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center bg-gradient-to-br from-[#111827] via-[#1a388a] to-[#2056D7] overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-[url('/assets/Dreamlab-Maklon-Parfum.webp')] opacity-20 bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#2056D7]/80 to-transparent z-10" />

        <div className="container mx-auto px-5 lg:px-8 relative z-20 w-full">
          <div className="max-w-2xl lg:max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              className="inline-block px-4 py-1.5 bg-white/10 rounded-full mb-6 border border-white/20 backdrop-blur-md"
            >
              <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-widest">
                MAKLON PARFUM CUSTOM & SIGNATURE SCENT
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1, ease }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight uppercase mb-6"
            >
              WUJUDKAN BRAND PARFUM<br />
              DENGAN SIGNATURE SCENT<br />
              <span className="text-[#FF6A1A]">YANG PUNYA KARAKTER SENDIRI</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-sm sm:text-base md:text-lg text-white/90 font-medium leading-relaxed mb-8 max-w-xl"
            >
              Dikembangkan bersama tim R&D Dreamlab untuk menghasilkan aroma custom yang relevan dengan konsep brand, positioning, dan target pasar Anda.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center gap-4 mb-10"
            >
              <a
                href="/ads/thankyou/metaads/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#FF6A1A] hover:bg-[#e55910] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-[0_10px_25px_rgba(255,106,26,0.3)] hover:-translate-y-1 text-sm uppercase tracking-wide"
              >
                KONSULTASIKAN BRAND PARFUM ANDA <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#katalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-xl transition-all border border-white/20 text-sm uppercase tracking-wide backdrop-blur-sm"
              >
                LIHAT PILIHAN PRODUK
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="flex flex-wrap items-center gap-4 sm:gap-8 text-white/80 text-xs sm:text-sm font-semibold"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF6A1A]" />
                <span>500++ Brand Bekerja Sama</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF6A1A]" />
                <span>1000+ Produk Dikembangkan</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FF6A1A]" />
                <span>CPKB Grade A</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. VALUE BAR DI BAWAH HERO */}
      <section className="relative z-30 -mt-10 sm:-mt-16 px-4 sm:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: FlaskConical, title: "R&D & FORMULASI", desc: "Arah aroma dikembangkan bersama tim R&D sesuai karakter brand yang ingin dibangun." },
              { icon: Sparkles, title: "1 CLIENT, 1 CUSTOM FORMULA", desc: "Formula dibuat eksklusif agar brand memiliki pembeda yang lebih jelas di market." },
              { icon: ShieldCheck, title: "BPOM, HALAL & CPKB", desc: "Pendampingan legalitas dan produksi dalam sistem one-stop maklon service." }
            ].map((val, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-[0_10px_40px_rgba(32,86,215,0.06)] border border-[#2056D7]/10 flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-xl bg-[#F7F9FF] text-[#2056D7] flex items-center justify-center border border-[#2056D7]/10">
                  <val.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-[#111827] text-sm uppercase tracking-wide mb-2">{val.title}</h3>
                  <p className="text-[#111827]/70 text-sm font-medium leading-relaxed">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. KATALOG PRODUK PARFUM */}
      <section id="katalog" className="py-20 md:py-28 bg-[#F7F9FF]">
        <div className="container mx-auto px-5 lg:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-[#111827] uppercase tracking-tight leading-[1.15] mb-4">
              BANGUN LINI WEWANGIAN YANG SESUAI<br className="hidden md:block" />
              <span className="text-[#2056D7]">DENGAN POSITIONING BRAND ANDA</span>
            </h2>
            <p className="text-sm md:text-base text-[#111827]/70 font-medium">
              Mulai dari daily fragrance sampai konsentrasi premium, pilih format produk yang paling sesuai untuk target pasar Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Eau de Parfum", subtitle: "Konsentrasi aroma kuat dan tahan lama, ideal untuk produk signature." },
              { title: "Eau de Toilette", subtitle: "Karakter ringan dan menyegarkan, cocok untuk pemakaian harian." },
              { title: "Eau de Cologne", subtitle: "Sensasi segar seketika dengan konsentrasi yang lebih ringan." },
              { title: "Extrait de Parfum", subtitle: "Lini premium dengan konsentrasi fragrance oil tertinggi." },
              { title: "Body Mist", subtitle: "Aroma ringan dan praktis disemprotkan berkali-kali sepanjang hari." },
              { title: "Minyak Atsiri", subtitle: "Eksplorasi wewangian natural dari bahan baku esensial alami." }
            ].map((prod, i) => (
              <div key={i} className="group relative bg-white rounded-2xl p-8 border border-[#2056D7]/10 hover:border-[#3F78FF]/30 hover:shadow-xl transition-all overflow-hidden flex flex-col justify-end min-h-[240px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#F7F9FF] to-transparent rounded-bl-full pointer-events-none" />
                <div className="relative z-10 mt-auto">
                  <h3 className="text-xl font-black text-[#111827] mb-2 group-hover:text-[#2056D7] transition-colors">{prod.title}</h3>
                  <p className="text-sm text-[#111827]/60 font-medium leading-relaxed mb-6">{prod.subtitle}</p>
                  <a href="/ads/thankyou/metaads/" className="inline-flex items-center gap-2 text-xs font-bold text-[#FF6A1A] uppercase tracking-wider group-hover:gap-3 transition-all">
                    Eksplorasi Produk <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY DREAMLAB */}
      <section className="py-20 md:py-28 bg-white border-y border-[#2056D7]/5">
        <div className="container mx-auto px-5 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-[10px] font-bold text-[#2056D7] bg-[#F7F9FF] border border-[#2056D7]/20 px-3 py-1 rounded-full uppercase tracking-widest mb-6">
                MENGAPA DREAMLAB
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#111827] uppercase tracking-tight leading-[1.15] mb-6">
                MAKLON PARFUM BUKAN SEKADAR<br />
                <span className="text-[#FF6A1A]">PRODUKSI BOTOL DAN AROMA</span>
              </h2>
              <p className="text-sm md:text-base text-[#111827]/70 font-medium leading-relaxed mb-8">
                Brand perlu formula, kesiapan legalitas, desain, dan strategi pemasaran yang bergerak dalam satu arah.
              </p>
              <a
                href="/ads/thankyou/metaads/"
                className="inline-flex items-center justify-center gap-3 bg-[#111827] hover:bg-[#1f2937] text-white font-bold py-4 px-8 rounded-xl transition-all text-sm uppercase tracking-wide"
              >
                MULAI DISKUSI <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="space-y-6">
              {[
                { num: "01", title: "MOQ MENYESUAIKAN", desc: "Skala produksi dapat disesuaikan dengan kebutuhan pengembangan brand dan rencana bisnis Anda." },
                { num: "02", title: "FORMULA EKSKLUSIF", desc: "Konsep 1 Client, 1 Custom Formula membantu brand membangun aroma dengan pembeda yang lebih kuat." },
                { num: "03", title: "ONE-STOP MAKLON", desc: "Dari konsultasi, formulasi, sampling, desain, legalitas, produksi, hingga media promosi." }
              ].map((val, i) => (
                <div key={i} className="flex gap-6 items-start bg-[#F7F9FF] p-6 rounded-2xl border border-[#2056D7]/5">
                  <span className="text-4xl font-black text-[#2056D7]/20 leading-none">{val.num}</span>
                  <div>
                    <h4 className="font-black text-[#111827] uppercase tracking-wide text-sm mb-2">{val.title}</h4>
                    <p className="text-sm text-[#111827]/70 font-medium">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. BRAND DEVELOPMENT SUPPORT */}
      <section className="py-20 md:py-28 bg-[#2056D7] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3F78FF]/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-5 lg:px-8 max-w-5xl relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-[10px] font-bold text-white bg-white/10 border border-white/20 px-3 py-1 rounded-full uppercase tracking-widest mb-6 backdrop-blur-sm">
              LEBIH DARI SEKADAR PABRIK
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[1.1] mb-6">
              BRAND ANDA JUGA DIDAMPINGI<br />
              <span className="text-[#FF6A1A]">UNTUK LEBIH SIAP MASUK KE MARKET</span>
            </h2>
            <p className="text-sm md:text-base text-white/80 font-medium leading-relaxed mb-12">
              Dreamlab mendukung pengembangan brand melalui creative, branding, dan digital marketing agar produk tidak berhenti di tahap produksi saja.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {[
                { icon: Paintbrush, text: "Creative & desain untuk visual brand" },
                { icon: Target, text: "Branding agar identitas lebih mudah dikenali" },
                { icon: Activity, text: "Digital marketing untuk menjangkau target audience" }
              ].map((point, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FF6A1A]/10 text-[#FF6A1A] flex items-center justify-center">
                    <point.icon className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-sm text-white">{point.text}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12">
              <a
                href="/ads/thankyou/metaads/"
                className="inline-flex items-center justify-center gap-3 bg-[#FF6A1A] hover:bg-[#e55910] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-[#FF6A1A]/20 text-sm uppercase tracking-wide"
              >
                TANYAKAN SUPPORT DIGITAL MARKETING →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SOCIAL PROOF */}
      <section className="py-20 md:py-24 bg-[#F7F9FF] border-b border-[#2056D7]/5">
        <div className="container mx-auto px-5 lg:px-8 max-w-5xl text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-[#111827] uppercase tracking-tight leading-[1.2] mb-12 max-w-2xl mx-auto">
            DIPERCAYA UNTUK MENGEMBANGKAN BRAND<br />
            DARI IDE SAMPAI SIAP DIPASARKAN
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#2056D7]/10 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-[#2056D7] mb-2">500++</span>
              <span className="text-sm font-bold uppercase text-[#111827]/70 tracking-wider">Brand Telah Bekerja Sama</span>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#2056D7]/10 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-[#2056D7] mb-2">1000+</span>
              <span className="text-sm font-bold uppercase text-[#111827]/70 tracking-wider">Produk Dikembangkan</span>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#2056D7]/10 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-[#2056D7] mb-2">GRADE A</span>
              <span className="text-sm font-bold uppercase text-[#111827]/70 tracking-wider">Fasilitas Produksi CPKB</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ALUR MAKLON */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-5 lg:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-[#111827] uppercase tracking-tight leading-[1.15] mb-4">
              DARI IDE AROMA<br className="hidden sm:block" />
              <span className="text-[#FF6A1A]">SAMPAI BRAND SIAP MASUK MARKET</span>
            </h2>
            <p className="text-sm md:text-base text-[#111827]/70 font-medium">
              Alur dibuat transparan agar Anda tahu apa yang terjadi di setiap tahap pengembangan produk.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "KONSULTASI IDE", desc: "Diskusikan target pasar, positioning, karakter aroma, dan konsep produk." },
              { title: "FORMULASI TEPAT", desc: "Tim R&D mengembangkan arah formula sesuai brief dan kebutuhan brand." },
              { title: "PEMBUATAN SAMPLE", desc: "Sample disiapkan agar aroma, karakter, dan pengalaman produk dapat dievaluasi." },
              { title: "DISKUSI HASIL", desc: "Hasil sample didiskusikan untuk mendapatkan formula yang paling sesuai." },
              { title: "LEGALITAS & DESAIN", desc: "Persiapan BPOM, Halal, dan kebutuhan desain kemasan dilakukan secara terarah." },
              { title: "PRODUKSI", desc: "Produk diproduksi mengikuti standar fasilitas dan quality control Dreamlab." },
              { title: "MEDIA PROMOSI", desc: "Siapkan kebutuhan visual dan materi promosi agar brand lebih siap diluncurkan." },
              { title: "PEMASARAN", desc: "Susun langkah pemasaran online maupun offline sesuai target audience brand." }
            ].map((step, i) => (
              <div key={i} className="bg-[#F7F9FF] border border-[#2056D7]/10 p-6 rounded-2xl relative overflow-hidden group hover:bg-white hover:border-[#3F78FF]/30 hover:shadow-lg transition-all">
                <span className="absolute -top-4 -right-4 text-7xl font-black text-[#2056D7]/5 group-hover:text-[#2056D7]/10 transition-colors pointer-events-none select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative z-10">
                  <span className="inline-block bg-[#2056D7] text-white text-[10px] font-black px-2.5 py-1 rounded-md mb-4">
                    TAHAP {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="font-black text-[#111827] uppercase text-sm mb-2">{step.title}</h4>
                  <p className="text-[#111827]/70 text-xs sm:text-sm font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-[#111827] via-[#1a388a] to-[#2056D7] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/Dreamlab-Maklon-Parfum.webp')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        <div className="container mx-auto px-5 lg:px-8 max-w-3xl relative z-10 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[1.1] mb-6">
            SIAP MEMBANGUN BRAND PARFUM<br />
            <span className="text-[#FF6A1A]">DENGAN SIGNATURE SCENT ANDA SENDIRI?</span>
          </h2>
          <p className="text-sm md:text-base text-white/90 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
            Konsultasikan ide, target pasar, dan arah aroma Anda bersama tim Dreamlab untuk menentukan langkah pengembangan produk yang paling sesuai.
          </p>
          <a
            href="/ads/thankyou/metaads/"
            className="inline-flex items-center justify-center gap-3 bg-[#FF6A1A] hover:bg-[#e55910] text-white font-bold py-5 px-10 rounded-xl transition-all shadow-lg shadow-[#FF6A1A]/20 text-sm sm:text-base uppercase tracking-wide w-full sm:w-auto"
          >
            KONSULTASI MAKLON PARFUM →
          </a>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-[#111827] text-white/60 py-12 md:py-16 border-t border-white/10 text-sm font-medium">
        <div className="container mx-auto px-5 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <h4 className="text-white font-black text-lg uppercase tracking-widest">DREAMLAB COSMETICS</h4>
              <p className="leading-relaxed max-w-xs">
                Beauty Brand Development Partner<br />
                Maklon Juaranya Formula
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:text-right">
              <div>
                <h5 className="text-white font-bold uppercase tracking-wider mb-3 text-xs">Marketing Office</h5>
                <p className="leading-relaxed">
                  Jl. Dukuh Kupang Timur XX No.77B<br />
                  Sawahan, Surabaya
                </p>
              </div>
              <div>
                <h5 className="text-white font-bold uppercase tracking-wider mb-3 text-xs">Contact</h5>
                <p>Email: Official@dreamlab.id</p>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-white/40">
            <p>&copy; 2026 Dreamlab — PT Karya Impian Laboratoris. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* FLOATING WA BUTTON */}
      <a
        href="/ads/thankyou/metaads/"
        className="fixed bottom-6 right-6 z-50 bg-[#25d366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
        aria-label="Contact via WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>

    </div>
  );
}
