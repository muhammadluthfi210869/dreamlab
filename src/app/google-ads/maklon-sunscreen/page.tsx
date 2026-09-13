"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Sun,
  ShieldCheck,
  Sparkles,
  Droplet,
  Zap,
  CheckCircle2,
  ArrowRight,
  Package,
  Palette,
  Layers,
  Award,
  Lock,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import { homepageData } from "@/data/homepage";
import { aboutData } from "@/data/about-us";
import { AdsCredibilitySection } from "@/components/landing-pages/AdsCredibilitySection";

// Dynamically import LogoScroll
const LogoScroll = dynamic(() => import("@/components/LogoScroll"), {
  ssr: true,
  loading: () => <div className="py-16 bg-[#FFFFFB]" />,
});

const premiumEase = [0.16, 1, 0.3, 1] as const;

const GOOGLE_ADS_SUNSCREEN_CTA =
  "/ads/thankyou/google-ads/?source=google-sunscreen&from=/google-ads/maklon-sunscreen/";

const sunscreenCatalog = [
  {
    id: "physical-sunscreen",
    name: "Physical Sunscreen",
    tag: "Mineral & Sensitive Skin",
    image: "/new asset/icon-packing-design/sunscreen/physical-sunscreen.webp",
    description:
      "Sunscreen mineral murni dengan Zinc Oxide & Titanium Dioxide yang memantulkan sinar UV seketika. Zero chemical irritation, bebas white cast, sangat aman untuk kulit sensitif, anak, dan ibu hamil.",
    spfPa: "SPF 50+ PA++++",
    heroIngredients: ["Zinc Oxide", "Titanium Dioxide", "Niacinamide", "Centella Asiatica"],
    idealFor: "Kulit sensitif, rosacea, acne-prone, & pasca-treatment klinik.",
    accentColor: "#2A5841",
    bgColor: "#f4f8f5",
  },
  {
    id: "hybrid-sunscreen",
    name: "Hybrid Sunscreen",
    tag: "Best Seller • Dual Protection",
    image: "/new asset/icon-packing-design/sunscreen/hybrid-sunscreen.webp",
    description:
      "Menggabungkan keunggulan filter mineral dan kimia dalam satu sediaan mutakhir. Menawarkan keamanan mineral filter dan tekstur ultra-ringan kimia tanpa rasa lengket atau white cast.",
    spfPa: "SPF 50+ PA++++",
    heroIngredients: ["Zinc Oxide", "Uvinul A Plus", "Tinosorb S", "Hyaluronic Acid"],
    idealFor: "Semua jenis kulit di iklim tropis, pemakaian harian outdoor/indoor.",
    accentColor: "#F6911E",
    bgColor: "#fffcf5",
  },
  {
    id: "chemical-sunscreen",
    name: "Chemical Sunscreen",
    tag: "Ultra-Lightweight • Invisible Finish",
    image: "/new asset/icon-packing-design/sunscreen/chemical-sunscreen.webp",
    description:
      "Filter generasi terbaru yang menyerap sinar UV dan mengubahnya menjadi energi panas aman. Tekstur seringan air, langsung meresap, dan sempurna sebagai base primer makeup tanpa residu.",
    spfPa: "SPF 50+ PA++++",
    heroIngredients: ["Uvinul A Plus", "Tinosorb S", "Octocrylene", "Vitamin E"],
    idealFor: "Penggemar makeup, aktivitas padat perkotaan, & kulit normal-kombinasi.",
    accentColor: "#4898D3",
    bgColor: "#f0f8ff",
  },
  {
    id: "tone-up-sunscreen",
    name: "Tone Up Sunscreen",
    tag: "K-Beauty • Instant Glowing",
    image: "/new asset/icon-packing-design/sunscreen/tone-up-sunscreen.webp",
    description:
      "Tren K-Beauty yang memadukan proteksi UV spektrum luas dengan efek mencerahkan instan. Mengandung pearl pigments halus untuk kulit tampak cerah bercahaya alami sejak aplikasi pertama.",
    spfPa: "SPF 50+ PA++++",
    heroIngredients: ["Niacinamide", "Pearl Pigments", "Zinc Oxide", "Tranexamic Acid"],
    idealFor: "Konsumen yang menginginkan sunscreen sekaligus primer pencerah instan.",
    accentColor: "#F6911E",
    bgColor: "#fffaf0",
  },
  {
    id: "sunscreen-gel",
    name: "Sunscreen Gel",
    tag: "Oil-Free • Cooling Sensation",
    image: "/new asset/icon-packing-design/sunscreen/sunscreen-gel.webp",
    description:
      "Formulasi gel berbasis air dengan sensasi dingin menyejukkan. Oil-free, non-comedogenic, dan sangat ringan — solusi tepat bagi pemilik kulit berminyak yang enggan memakai krim tebal.",
    spfPa: "SPF 50+ PA++++",
    heroIngredients: ["Chemical UV Filters", "4D Hyaluronic Acid", "Aloe Vera", "Witch Hazel"],
    idealFor: "Kulit sangat berminyak, berjerawat, remaja, & aktivitas olahraga luar ruang.",
    accentColor: "#2A5841",
    bgColor: "#f0f9f6",
  },
];

export default function MaklonSunscreenAdsLP() {
  return (
    <div className="landing-page-sunscreen min-h-screen bg-[#FFFFFB] text-[#212120] font-sans selection:bg-[#F6911E] selection:text-white">
      {/* =========================================================================
          1. HERO SECTION
          - Headline: WUJUDKAN BRAND SUNSCREEN ANDA SENDIRI
          - Badge: #1 Maklon Sunscreen Custom Formula
          - Image: /images/maklon-sunscreen/hero-sunscreen-collection.jpg
          - Social Proof Counters (500++ Brand, 1000+ Produk, SPF 50+, CPKB)
          - Single CTA Button
          ========================================================================= */}
      <section className="relative w-full min-h-[92vh] lg:min-h-screen overflow-hidden flex items-center pt-24 pb-16 lg:py-0 bg-[#FFFFFB]">
        {/* Background Visual Image */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src="/images/maklon-sunscreen/hero-sunscreen-collection.jpg"
            alt="Pabrik Maklon Sunscreen Custom Formula Dreamlab Indonesia"
            fill
            priority
            fetchPriority="high"
            decoding="sync"
            className="object-cover object-[80%_center] md:object-center"
            sizes="100vw"
          />
          {/* Gradient overlay to keep typography sharp while highlighting the bottle lineup */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFFFFB] via-[#FFFFFB]/92 to-[#FFFFFB]/25 md:from-[#FFFFFB] md:via-[#FFFFFB]/85 md:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFB] via-transparent to-transparent lg:hidden" />
        </div>

        {/* Ambient Sunlight Glow */}
        <div className="absolute top-1/4 left-10 w-[350px] h-[350px] bg-[#F6911E]/12 blur-[130px] rounded-full pointer-events-none z-10" />
        <div className="absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-[#4898D3]/12 blur-[120px] rounded-full pointer-events-none z-10" />

        <div className="container-custom relative z-20 w-full py-12 md:py-20 lg:py-28">
          <div className="max-w-xl md:max-w-2xl lg:max-w-3xl text-left space-y-6 md:space-y-8">
            
            {/* Badge #1 Maklon Sunscreen */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: premiumEase }}
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#F6911E]/10 border border-[#F6911E]/25 rounded-full backdrop-blur-md shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F6911E] animate-pulse" />
                <span className="text-[11px] md:text-xs font-black tracking-widest text-[#F6911E] uppercase">
                  #1 Maklon Sunscreen Custom Formula
                </span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: premiumEase }}
              className="space-y-2"
            >
              <h1 className="text-[34px] sm:text-[46px] md:text-[56px] lg:text-[66px] xl:text-[72px] font-black leading-[1.08] tracking-tight text-[#212120] uppercase font-display">
                WUJUDKAN BRAND <span className="text-[#F6911E]">SUNSCREEN ANDA</span> SENDIRI
              </h1>
              <p className="text-[#4898D3] text-base sm:text-lg md:text-xl font-black uppercase tracking-wide flex items-center gap-2">
                <Sun className="w-5 h-5 text-[#F6911E] fill-current" />
                Proteksi Spektrum Luas • Zero White-Cast • Standar CPKB &amp; BPOM
              </p>
            </motion.div>

            {/* Sub-headline Copywriting */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: premiumEase }}
              className="text-[#454543] text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-medium"
            >
              Kembangkan produk tabir surya impian Anda bersama Dreamlab. Tersedia pilihan formula <strong>Physical, Hybrid, Chemical, Tone Up, hingga Gel</strong> dengan perlindungan SPF 30 sampai SPF 50+ PA++++ yang ringan, cepat meresap, dan nyaman untuk iklim tropis.
            </motion.p>

            {/* Single CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: premiumEase }}
              className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <a
                href={GOOGLE_ADS_SUNSCREEN_CTA}
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#F6911E] hover:bg-[#212120] text-white font-black py-4 px-8 md:px-10 rounded-full transition-all duration-300 shadow-[0_15px_30px_rgba(246,145,30,0.3)] hover:-translate-y-1 text-xs md:text-sm uppercase tracking-wider"
              >
                {/* WhatsApp SVG Icon */}
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.019-5.117-2.875-6.976C16.592 1.899 14.116.88 11.986.88 6.548.88 2.122 5.3 2.119 10.74c-.002 1.706.452 3.37 1.312 4.848l-.994 3.629 3.73-.973zm11.366-6.726c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                </svg>
                <span>KONSULTASIKAN FORMULA SUNSCREEN ANDA</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>

            {/* Counter Data Social Proof Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: premiumEase }}
              className="pt-6 border-t border-neutral-200/80"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[#F6911E] font-display leading-tight">500++</p>
                  <p className="text-xs sm:text-[13px] font-bold text-[#454543]">Brand Telah Berkolaborasi</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[#4898D3] font-display leading-tight">1000+</p>
                  <p className="text-xs sm:text-[13px] font-bold text-[#454543]">Produk Sukses Diproduksi</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[#2A5841] font-display leading-tight">SPF 50+</p>
                  <p className="text-xs sm:text-[13px] font-bold text-[#454543]">PA++++ Broad Spectrum</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[#212120] font-display leading-tight">CPKB</p>
                  <p className="text-xs sm:text-[13px] font-bold text-[#454543]">Grade A &amp; BPOM Resmi</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CARD NILAI UTAMA (3 KOLOM)
          - R&D Proteksi UV Spektrum Luas
          - 1-Client 1-Formula Eksklusif
          - Uji In-Vitro/In-Vivo, BPOM & Halal Tuntas
          ========================================================================= */}
      <section className="py-16 md:py-24 bg-white border-y border-neutral-100">
        <div className="container-custom">
          
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-3">
            <span className="text-[11px] font-black tracking-[0.25em] text-[#F6911E] uppercase block">
              KEUNGGULAN MAKLON SUNSCREEN DREAMLAB
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#212120] uppercase font-display leading-tight">
              Standar R&amp;D Tertinggi untuk <span className="text-[#F6911E]">Proteksi UV Kulit Tropis</span>
            </h2>
            <p className="text-sm md:text-base text-neutral-500 font-medium">
              Sains formulasi photostable, kenyamanan sensori tanpa rasa dempul, dan jaminan sertifikasi resmi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: premiumEase }}
              className="group bg-[#FFFFFB] border border-[#F6911E]/20 hover:border-[#F6911E] rounded-[24px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#F6911E]/10 text-[#F6911E] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Sun className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black uppercase text-[#212120] font-display leading-snug">
                  Proteksi Broad Spectrum Teruji
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                  Menggunakan UV filter generasi terbaru (Tinosorb, Uvinul, Zinc Oxide). Photostable, stabil pada suhu panas tropis, tidak perih di mata, serta proteksi maksimal UVA, UVB, &amp; Blue Light.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center gap-2 text-xs font-bold text-[#F6911E]">
                <CheckCircle2 className="w-4 h-4 text-[#F6911E]" />
                <span>Uji In-Vitro &amp; In-Vivo SPF Valid</span>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: premiumEase }}
              className="group bg-[#FFFFFB] border border-[#4898D3]/20 hover:border-[#4898D3] rounded-[24px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#4898D3]/10 text-[#4898D3] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black uppercase text-[#212120] font-display leading-snug">
                  1-Client 1-Formula Eksklusif
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                  Bukan sunscreen generik pasaran. Setiap formula diracik privat sesuai preferensi finish brand Anda: <em>dewy glow, matte velvet, breathable,</em> hingga <em>water-burst cooling</em>.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center gap-2 text-xs font-bold text-[#4898D3]">
                <CheckCircle2 className="w-4 h-4 text-[#4898D3]" />
                <span>Zero White Cast &amp; Bebas Residu Abu-abu</span>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: premiumEase }}
              className="group bg-[#FFFFFB] border border-[#2A5841]/20 hover:border-[#2A5841] rounded-[24px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#2A5841]/10 text-[#2A5841] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black uppercase text-[#212120] font-display leading-snug">
                  Legalitas BPOM &amp; Halal Tuntas
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                  Diproduksi di pabrik bersertifikasi CPKB Grade A. Dreamlab mengurus seluruh perizinan notifikasi izin edar BPOM, sertifikasi Halal, hingga klaim dermatologi resmi sampai siap edar.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center gap-2 text-xs font-bold text-[#2A5841]">
                <CheckCircle2 className="w-4 h-4 text-[#2A5841]" />
                <span>100% Aman, Legal &amp; Siap Jual</span>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          3. SECTION KATALOG PRODUK SUNSCREEN
          Sesuai dengan https://dreamlab.id/produk/skincare/sunscreen/
          (Physical Sunscreen, Hybrid Sunscreen, Chemical Sunscreen, Tone Up, Sunscreen Gel)
          ========================================================================= */}
      <section className="py-16 md:py-24 bg-[#FFFFFB]">
        <div className="container-custom">
          
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-3">
            <span className="text-[11px] font-black tracking-[0.25em] text-[#F6911E] uppercase block">
              KATALOG SEDIAAN MAKLON SUNSCREEN
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#212120] uppercase font-display leading-tight">
              5 Formulasi Sunscreen <span className="text-[#4898D3]">Paling Diminati Konsumen</span>
            </h2>
            <p className="text-sm md:text-base text-neutral-500 font-medium">
              Eksplorasi formula tabir surya resmi Dreamlab. Setiap varian dirancang spesifik untuk kebutuhan tipe kulit, gaya hidup, dan segmen pasar yang berbeda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sunscreenCatalog.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: premiumEase }}
                className="bg-white border border-neutral-200/80 rounded-[28px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-400 flex flex-col group hover:-translate-y-1.5"
              >
                {/* Product Image Container */}
                <div
                  className="relative aspect-square w-full overflow-hidden"
                  style={{ backgroundColor: product.bgColor }}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div
                    className="absolute top-4 left-4 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md"
                    style={{ backgroundColor: product.accentColor }}
                  >
                    {product.tag}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#212120] text-[11px] font-black px-2.5 py-1 rounded-md shadow-sm border border-neutral-200">
                    {product.spfPa}
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black uppercase text-[#212120] font-display">
                      {product.name}
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                      {product.description}
                    </p>

                    <div className="pt-2 space-y-2">
                      <p className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                        Hero Ingredients:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {product.heroIngredients.map((ing) => (
                          <span
                            key={ing}
                            className="text-[11px] font-bold px-2.5 py-1 rounded-md"
                            style={{
                              backgroundColor: `${product.accentColor}15`,
                              color: product.accentColor,
                            }}
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1 text-xs text-neutral-500 font-medium">
                      <strong className="text-neutral-700">Ideal Untuk:</strong> {product.idealFor}
                    </div>
                  </div>

                  <a
                    href={GOOGLE_ADS_SUNSCREEN_CTA}
                    className="w-full inline-flex items-center justify-center gap-2 text-white font-extrabold py-3.5 px-6 rounded-full transition-all duration-300 text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:opacity-90"
                    style={{ backgroundColor: product.accentColor }}
                  >
                    <span>Konsultasi {product.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}

            {/* Custom Formula Callout Box (Filling 6th grid spot) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5, ease: premiumEase }}
              className="bg-gradient-to-br from-[#212120] to-[#162734] border border-neutral-700 rounded-[28px] p-8 text-white flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#F6911E] text-white flex items-center justify-center shadow-lg">
                  <Sun className="w-7 h-7" />
                </div>
                <span className="text-xs font-black tracking-widest text-[#F6911E] uppercase block">
                  CUSTOM SPECIFICATION
                </span>
                <h3 className="text-2xl font-black uppercase font-display leading-tight">
                  Punya Ide Formula Sunscreen Kustom Lain?
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Ingin menambahkan bahan aktif khusus seperti Ceramide, Ectoin, Mugwort, Peptide, atau membuat format <em>sunscreen spray</em> &amp; <em>sunscreen stick</em>? Tim R&amp;D Dreamlab siap meraciknya khusus untuk brand Anda.
                </p>
              </div>

              <div className="pt-6">
                <a
                  href={GOOGLE_ADS_SUNSCREEN_CTA}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#F6911E] hover:bg-white hover:text-[#212120] text-white font-black py-4 px-6 rounded-full transition-all duration-300 text-xs uppercase tracking-wider shadow-lg"
                >
                  <span>Diskusikan Formula Khusus Anda</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. PROBLEM & SOLUSI + FASILITAS FREE (MOQ FLEKSIBEL & BONUS EKSKLUSIF)
          ========================================================================= */}
      <section className="py-16 md:py-24 bg-[#1b2a22] text-white relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F6911E]/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4898D3]/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left: Problem & Solusi Copy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#2A5841] border border-white/10 rounded-full text-xs font-bold text-[#FFFFFB]">
                <Sun className="w-3.5 h-3.5 text-[#F6911E]" />
                <span>SOLUSI MAKLON SUNSCREEN TROPIS</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase font-display leading-[1.1] text-white">
                Formula Tanpa Residu White Cast. <span className="text-[#F6911E]">MOQ Fleksibel</span> &amp; Bebas Pusing!
              </h2>

              <p className="text-neutral-300 text-sm md:text-base leading-relaxed font-normal">
                Banyak brand sunscreen gagal di pasar karena formula yang lengket, membuat wajah tampak abu-abu, atau menyumbat pori-pori. Dreamlab merancang formula ramah iklim tropis dengan <strong>MOQ Fleksibel</strong> agar Anda dapat menguji respon pasar tanpa terbebani modal besar di awal.
              </p>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#F6911E]">
                  Keuntungan Bermitra Bersama Dreamlab:
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-200">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#F6911E] shrink-0" />
                    <span><strong>MOQ Fleksibel:</strong> Mulai produksi pertama tanpa risiko stok mati (dead stock).</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#F6911E] shrink-0" />
                    <span><strong>Uji In-Vitro/In-Vivo:</strong> Validasi nilai klaim SPF &amp; PA akurat sesuai regulasi.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#F6911E] shrink-0" />
                    <span><strong>Packaging Anti-Bocor:</strong> Pilihan botol tube, airless pump, &amp; spray kedap udara.</span>
                  </li>
                </ul>
              </div>

              <a
                href={GOOGLE_ADS_SUNSCREEN_CTA}
                className="inline-flex items-center justify-center gap-2.5 bg-[#F6911E] hover:bg-white hover:text-[#212120] text-white font-black py-4 px-8 rounded-full transition-all duration-300 text-xs sm:text-sm uppercase tracking-wider shadow-xl"
              >
                <span>Dapatkan Skema MOQ &amp; Simulasi Biaya</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Right: 4 Fasilitas Free Eksklusif */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4.5">
              
              {/* Free 1 */}
              <div className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-md hover:bg-white/15 transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#F6911E] text-white flex items-center justify-center mb-4 shadow-md">
                  <Palette className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#F6911E] block mb-1">
                  GRATIS / FREE
                </span>
                <h3 className="text-base font-black uppercase text-white font-display mb-2">
                  Desain Logo &amp; Kemasan Tube
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Tim desainer in-house Dreamlab merancang kemasan tube, pump, atau botol sunscreen yang elegan, eye-catching, dan sesuai regulasi label BPOM.
                </p>
              </div>

              {/* Free 2 */}
              <div className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-md hover:bg-white/15 transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#4898D3] text-white flex items-center justify-center mb-4 shadow-md">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#4898D3] block mb-1">
                  GRATIS / FREE
                </span>
                <h3 className="text-base font-black uppercase text-white font-display mb-2">
                  Konsultasi Bisnis &amp; HPP
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Diskusi penetapan target segmen pasar, perhitungan HPP transparan, serta strategi harga jual kompetitif untuk margin keuntungan maksimal.
                </p>
              </div>

              {/* Free 3 */}
              <div className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-md hover:bg-white/15 transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#2A5841] text-white flex items-center justify-center mb-4 shadow-md">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-1">
                  GRATIS / FREE
                </span>
                <h3 className="text-base font-black uppercase text-white font-display mb-2">
                  Marketing Kit &amp; Photo Product
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Foto produk studio komersial beresolusi tinggi siap pakai untuk materi iklan TikTok Ads, feeds Instagram, dan banner marketplace Anda.
                </p>
              </div>

              {/* Free 4 */}
              <div className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-md hover:bg-white/15 transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4 shadow-md">
                  <Sun className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-300 block mb-1">
                  GRATIS / FREE
                </span>
                <h3 className="text-base font-black uppercase text-white font-display mb-2">
                  Custom Sample Formula
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Uji coba tekstur, aroma, kecepatan penyerapan, dan uji bebas white-cast secara langsung hingga Anda puas sebelum produksi massal dimulai.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          5. PROGRAM DREAMPRENEUR & BRAND KOLABORASI
          ========================================================================= */}
      <section className="bg-[#EEF4FF] py-16 md:py-24 border-b border-blue-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left: Copy & Pillars */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[11px] font-black tracking-[0.25em] text-[#F6911E] uppercase block">
                DREAMPRENEUR BEAUTY ACADEMY
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#212120] uppercase font-display leading-tight">
                Brand Sunscreen Anda <span className="text-[#4898D3]">Dimentoring Sampai Sukses</span> di Pasar
              </h2>
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                Melalui program <strong>Dreampreneur</strong>, Dreamlab membekali para founder dengan wawasan riset pasar kecantikan, strategi peluncuran produk, dan optimasi penjualan digital.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-blue-100 p-5 rounded-2xl shadow-sm">
                  <span className="text-xs font-black text-[#4898D3] tracking-wider block mb-1">PILAR 01</span>
                  <h3 className="text-sm font-black uppercase text-[#212120] mb-1 font-display">Sunscreen Market Trend</h3>
                  <p className="text-xs text-neutral-600">Membaca tren UV protection global dan format sunscreen yang paling diminati konsumen Indonesia.</p>
                </div>

                <div className="bg-white border border-blue-100 p-5 rounded-2xl shadow-sm">
                  <span className="text-xs font-black text-[#4898D3] tracking-wider block mb-1">PILAR 02</span>
                  <h3 className="text-sm font-black uppercase text-[#212120] mb-1 font-display">USP &amp; Branding</h3>
                  <p className="text-xs text-neutral-600">Menentukan klaim pembeda (outdoor, anti-pollution, hybrid, tone up) agar brand memiliki daya pikat unik.</p>
                </div>

                <div className="bg-white border border-blue-100 p-5 rounded-2xl shadow-sm">
                  <span className="text-xs font-black text-[#4898D3] tracking-wider block mb-1">PILAR 03</span>
                  <h3 className="text-sm font-black uppercase text-[#212120] mb-1 font-display">Digital Ads Scaling</h3>
                  <p className="text-xs text-neutral-600">Strategi promosi berbayar di TikTok Ads, Meta Ads, dan livestream shopping untuk perputaran repeat order cepat.</p>
                </div>

                <div className="bg-white border border-blue-100 p-5 rounded-2xl shadow-sm">
                  <span className="text-xs font-black text-[#4898D3] tracking-wider block mb-1">PILAR 04</span>
                  <h3 className="text-sm font-black uppercase text-[#212120] mb-1 font-display">Beautypreneur Network</h3>
                  <p className="text-xs text-neutral-600">Terhubung langsung dengan ratusan brand owner, praktisi industri, dan ekosistem manufaktur Dreamlab.</p>
                </div>
              </div>

              <div>
                <a
                  href={GOOGLE_ADS_SUNSCREEN_CTA}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#F6911E] text-white rounded-full font-extrabold uppercase tracking-wider text-xs md:text-sm hover:bg-[#212120] transition-all duration-300 shadow-lg shadow-[#F6911E]/20"
                >
                  <span>Gabung Program Dreampreneur</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right: Visual Real Images */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              <div className="col-span-2 relative rounded-2xl overflow-hidden aspect-[16/10] shadow-md border border-neutral-200 group">
                <Image
                  src="/assets/maklon-parfum/academy-community.webp"
                  alt="Sesi Mentoring Komunitas Dreampreneur Dreamlab"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-sm border border-neutral-200 group">
                <Image
                  src="/assets/maklon-parfum/academy-digital-marketing.webp"
                  alt="Mentoring Digital Marketing Sunscreen"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-sm border border-neutral-200 group">
                <Image
                  src="/assets/maklon-parfum/academy-branding.webp"
                  alt="Sesi Branding Skincare Dreampreneur"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Kredibilitas & Sertifikasi Standar Industri */}
      <AdsCredibilitySection channel="google-ads" />

      {/* Social Proof Partner Logos */}
      <LogoScroll
        logos={aboutData.partnerLogos}
        headline={homepageData.trustedBrands.title}
        subHeadline="Ratusan brand kecantikan mempercayakan produksi produk tabir surya dan skincare mereka kepada fasilitas CPKB Dreamlab."
      />

      {/* =========================================================================
          6. ALUR KERJA (4 LANGKAH CEPAT & TERARAH)
          ========================================================================= */}
      <section className="bg-white py-16 md:py-24 border-t border-neutral-100">
        <div className="container-custom">
          
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-3">
            <span className="text-[11px] font-black tracking-[0.25em] text-[#F6911E] uppercase block">
              ALUR KERJA TERSTRUKTUR
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#212120] uppercase font-display leading-tight">
              4 Langkah Mudah <span className="text-[#4898D3]">Ciptakan Brand Sunscreen</span> Anda
            </h2>
            <p className="text-sm md:text-base text-neutral-500 font-medium">
              Dari tahap perumusan SPF/PA hingga produk siap didistribusikan, seluruh proses didampingi secara komprehensif.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-neutral-900 shadow-lg border border-neutral-200/80 transition-all duration-300 hover:-translate-y-1.5">
              <Image
                src="/assets/maklon-parfum/consultation.webp"
                alt="Konsultasi Maklon Sunscreen"
                fill
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11253c]/95 via-[#11253c]/50 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <span className="text-xs font-black tracking-widest text-[#F6911E] mb-2 block">
                  LANGKAH 01
                </span>
                <h3 className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display">
                  Konsultasi Konsep &amp; SPF
                </h3>
                <p className="text-xs text-neutral-200 leading-relaxed">
                  Diskusikan konsep sunscreen (Physical, Hybrid, Gel), tingkat SPF/PA, target konsumen, dan profil tekstur impian Anda.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-neutral-900 shadow-lg border border-neutral-200/80 transition-all duration-300 hover:-translate-y-1.5">
              <Image
                src="/assets/maklon-parfum/sample.webp"
                alt="Riset Formulasi R&D Sunscreen"
                fill
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11253c]/95 via-[#11253c]/50 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <span className="text-xs font-black tracking-widest text-[#F6911E] mb-2 block">
                  LANGKAH 02
                </span>
                <h3 className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display">
                  Riset &amp; Sampel R&amp;D
                </h3>
                <p className="text-xs text-neutral-200 leading-relaxed">
                  Tim formulator R&amp;D meracik formula khusus dan mengirimkan prototipe sampel untuk uji tekstur &amp; bebas white-cast.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-neutral-900 shadow-lg border border-neutral-200/80 transition-all duration-300 hover:-translate-y-1.5">
              <Image
                src="/assets/maklon-parfum/legal-design.webp"
                alt="Izin BPOM & Desain Packaging Sunscreen"
                fill
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11253c]/95 via-[#11253c]/50 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <span className="text-xs font-black tracking-widest text-[#F6911E] mb-2 block">
                  LANGKAH 03
                </span>
                <h3 className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display">
                  Legalitas &amp; Desain Kemasan
                </h3>
                <p className="text-xs text-neutral-200 leading-relaxed">
                  Pengurusan notifikasi resmi BPOM, sertifikasi Halal, serta perancangan desain kemasan tube/pump siap cetak.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-neutral-900 shadow-lg border border-neutral-200/80 transition-all duration-300 hover:-translate-y-1.5">
              <Image
                src="/assets/maklon-parfum/production.webp"
                alt="Produksi CPKB Grade A dan QC Sunscreen"
                fill
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11253c]/95 via-[#11253c]/50 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <span className="text-xs font-black tracking-widest text-[#F6911E] mb-2 block">
                  LANGKAH 04
                </span>
                <h3 className="text-lg font-black uppercase tracking-wide mb-2 leading-tight font-display">
                  Produksi &amp; Siap Kirim
                </h3>
                <p className="text-xs text-neutral-200 leading-relaxed">
                  Produksi massal di fasilitas higienis CPKB Grade A, uji stabilitas dan QC menyeluruh, siap dipasarkan ke publik.
                </p>
              </div>
            </div>

          </div>

          <div className="text-center mt-12">
            <a
              href={GOOGLE_ADS_SUNSCREEN_CTA}
              className="inline-flex items-center gap-2 px-10 py-5 bg-[#F6911E] text-white rounded-full font-black uppercase tracking-wider text-xs md:text-sm hover:bg-[#212120] hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-[#F6911E]/25"
            >
              <span>Mulai Konsultasi Maklon Sunscreen Sekarang</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

        </div>
      </section>

      {/* =========================================================================
          7. FINAL CTA & FOOTER
          ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-[#212120] text-white py-20 md:py-28">
        {/* Glow circles */}
        <div className="absolute top-1/2 left-10 w-[450px] h-[450px] bg-[#4898D3]/15 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#F6911E]/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-[#FFFFFB]">
            <Lock className="w-3.5 h-3.5 text-[#F6911E]" />
            <span>100% NON-DISCLOSURE AGREEMENT (NDA) GUARANTEED</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase font-display leading-[1.1] text-white">
            Wujudkan Brand <span className="text-[#F6911E]">Sunscreen Impian</span> Anda Bersama Dreamlab
          </h2>

          <p className="text-sm md:text-base lg:text-lg text-neutral-300 leading-relaxed font-medium max-w-2xl mx-auto">
            Diskusikan ide tekstur, proteksi SPF/PA, dan strategi peluncuran produk sunscreen Anda bersama konsultan ahli kami. Tanpa komitmen awal, kerahasiaan ide dilindungi penuh oleh hukum.
          </p>

          <div className="pt-4 flex flex-col items-center gap-4">
            <a
              href={GOOGLE_ADS_SUNSCREEN_CTA}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#F6911E] hover:bg-white hover:text-[#212120] text-white font-black py-4 px-10 rounded-full transition-all duration-300 shadow-[0_15px_30px_rgba(246,145,30,0.35)] hover:-translate-y-1 text-sm uppercase tracking-wider"
            >
              {/* WhatsApp Icon */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.019-5.117-2.875-6.976C16.592 1.899 14.116.88 11.986.88 6.548.88 2.122 5.3 2.119 10.74c-.002 1.706.452 3.37 1.312 4.848l-.994 3.629 3.73-.973zm11.366-6.726c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
              </svg>
              <span>KONSULTASIKAN FORMULA SUNSCREEN ANDA</span>
            </a>

            {/* Trust points */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4 text-xs font-bold text-neutral-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#F6911E]" />
                1-Client 1-Formula
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4898D3]" />
                CPKB Grade A &amp; BPOM
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2A5841]" />
                MOQ Fleksibel
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#F6911E]" />
                Garansi Kerahasiaan NDA
              </span>
            </div>
          </div>

        </div>

        {/* Minimalist Landing Page Footer */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center text-xs text-neutral-500 font-medium">
          <p>&copy; {new Date().getFullYear()} Dreamlab Indonesia &bull; Maklon Kosmetik Juaranya Formula. All rights reserved.</p>
        </div>
      </section>

      {/* Floating WhatsApp Action Button */}
      <a
        href={GOOGLE_ADS_SUNSCREEN_CTA}
        className="fixed bottom-6 right-6 z-50 bg-[#25d366] hover:bg-[#20ba59] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
        aria-label="Konsultasi via WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="absolute right-full mr-4 bg-[#212120] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Konsultasi Formula Sunscreen!
        </span>
      </a>
    </div>
  );
}
