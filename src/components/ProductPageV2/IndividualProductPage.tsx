"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Award,
  CheckCircle2,
  Clock,
  FlaskConical,
  Package,
  PackageCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import ProductHero from "./ProductHero";
import ProductPackagingGrid from "./ProductPackagingGrid";
import { ProductCategoryV2, ProductVariantV2 } from "@/types/product-v2";
import { getProductCardImagePath } from "./ProductHero";
import StrategicMarketPotential from "./Strategic/StrategicMarketPotential";
import { aboutData } from "@/data/about-us";
import ProductFAQ from "./ProductFAQ";
import ProductRelated from "./ProductRelated";
import LogoScroll from "@/components/LogoScroll";
import OurCertification from "@/components/OurCertification";
import CtaSection from "@/components/CtaSection";
import AdvantagesGrid from "@/components/AdvantagesGrid";
import {
  HaircareMarqueeBand,
  HaircareValueSection,
  getHaircareIngredientImage,
} from "./HaircareSections";

interface IndividualProductPageProps {
  categoryData: ProductCategoryV2;
  productData: ProductVariantV2;
}

export default function IndividualProductPage({ 
  categoryData, 
  productData 
}: IndividualProductPageProps) {
  
  const getStrategicContent = () => {
    // Default Content (Fallback)
    let content = {
      marketPotential: {
        headline: `BUAT BRAND ${productData.name.toUpperCase()} DENGAN CUSTOM FORMULA`,
        points: [
          {
            title: "FREE Custom Formula",
            description: "Anda menentukan bahan aktif (anti-aging/pencerah) dan tekstur krim."
          },
          {
            title: "FREE Pengurusan Legalitas",
            description: "BPOM, HKI, dan Halal diurus sampai tuntas oleh tim kami."
          },
          {
            title: "FREE Desain Logo & Kemasan",
            description: "dibantu tim kreatif Dreamlab."
          },
          {
            title: "1 Client, 1 Formula",
            description: "formula eksklusif milik brand Anda, tidak dipakai brand lain."
          }
        ]
      },
      executionEngine: {
        headline: "Arsitektur Produksi & Sourcing Terpadu.",
        points: [
          { title: "Sillage & Longevity", description: "Fokus pada sillage tajam, longevity optimal, dan formula bebas noda pada pakaian." },
          { title: "Premium Design", description: "Akses botol dan desain wadah yang premium serta eksklusif untuk brand Anda." },
          { title: "End-to-End Service", description: "100% terima beres termasuk kepengurusan legalitas dan izin edar resmi." },
          { title: "Exclusive Formula", description: "Formula DNA produk Anda unik dan tidak akan pernah diduplikasi." }
        ]
      },
      closing: {
        headline: "Waktunya Menguji Visi Anda.",
        subheadline: "Jadwalkan pembuatan sampel (prototipe) untuk Anda tes dan evaluasi sebelum masuk produksi massal.",
        ctaText: "Jadwalkan Pembuatan Sampel"
      }
    };

    // Category Specific Overrides
    const categorySlug = categoryData.slug;

    if (categorySlug === 'skincare') {
      content.executionEngine.points = [
        { title: "Bio-Efikasi Terukur", description: "Uji klinis dan efikasi bahan aktif untuk hasil kulit maksimal." },
        { title: "Sourcing Grade Farmasi", description: "Bahan baku kualitas tertinggi bersertifikat standar farmasi." },
        { title: "Standar CPKB Grade A", description: "Fasilitas produksi tersertifikasi CPKB Grade A, BPOM, dan Halal MUI." },
        { title: "Proteksi Inovasi", description: "Perlindungan formula dan hak kekayaan intelektual (HAKI) brand Anda." }
      ];
    } else if (categorySlug === 'bodycare') {
      content.executionEngine.points = [
        { title: "Bio-Nutrisi Mendalam", description: "Formula kaya vitamin dan lipid untuk hidrasi kulit tubuh maksimal." },
        { title: "Sourcing Bahan Alami", description: "Bahan alami pilihan nusantara dengan aroma terapeutik menenangkan." },
        { title: "Standar CPKB Grade A", description: "Diproduksi di pabrik bersertifikat CPKB Grade A, BPOM, dan Halal." },
        { title: "Proteksi DNA Formulasi", description: "Kerahasiaan dan eksklusivitas formula produk menjaga keunikan sepenuhnya." }
      ];
    } else if (categorySlug === 'haircare') {
      content.executionEngine.points = [
        { title: "Restorasi Keratin", description: "Nutrisi mendalam untuk menguatkan akar dan merestorasi batang rambut." },
        { title: "Sourcing Bahan Aktif", description: "Bahan aktif teruji klinis untuk mengatasi ketombe dan rambut rontok." },
        { title: "Standar CPKB Grade A", description: "Fasilitas produksi bersertifikat CPKB Grade A dengan kontrol mutu ketat." },
        { title: "Proteksi Intelektual", description: "Hak paten formula eksklusif untuk keunggulan kompetitif brand Anda." }
      ];
    } else if (categorySlug === 'decorative') {
      content.executionEngine.points = [
        { title: "Ultra-Pigmentasi", description: "Pigmen warna intens, tahan lama, dan ramah untuk kulit wajah." },
        { title: "Sourcing Pigment Global", description: "Bahan baku pewarna premium standar kosmetik global." },
        { title: "Standar CPKB Grade A", description: "Proses produksi bersertifikat CPKB Grade A menjamin produk bebas kontaminasi." },
        { title: "Proteksi DNA Identitas", description: "Formulasi warna unik yang disesuaikan dengan tren pasar modern." }
      ];
    } else if (categorySlug === 'babycare') {
      content.executionEngine.points = [
        { title: "Hypoallergenic", description: "Formula ultra-lembut yang aman dan tidak mengiritasi kulit sensitif bayi." },
        { title: "Sourcing Alami Lembut", description: "Ekstrak tumbuhan pilihan dengan tingkat kemurnian tertinggi." },
        { title: "Standar CPKB Grade A", description: "Kontrol sterilitas ketat setara standar CPKB Grade A untuk produk bayi." },
        { title: "Proteksi Inovasi", description: "Keamanan formula teruji klinis dan dilindungi hak kekayaan intelektual." }
      ];
    } else if (categorySlug === 'footcare') {
      content.executionEngine.points = [
        { title: "Bio-Repair Intensif", description: "Formula keratolitik efektif mengatasi tumit pecah-pecah dan kasar." },
        { title: "Sourcing Bahan Terapi", description: "Minyak atsiri alami untuk deodorizing dan relaksasi kaki lelah." },
        { title: "Standar CPKB Grade A", description: "Jaminan mutu produksi bersertifikat CPKB Grade A, BPOM, dan Halal." },
        { title: "Proteksi DNA Formulasi", description: "Eksklusivitas formula menjamin produk Anda tiada duanya." }
      ];
    } else if (categorySlug === 'pkrt') {
      content.executionEngine.points = [
        { title: "Kemenkes RI Resmi", description: "100% berizin edar resmi Kementerian Kesehatan RI." },
        { title: "Uji Koefisien Fenol", description: "Formula teruji klinis membunuh 99.9% bakteri dan kuman berbahaya." },
        { title: "Sourcing Grade Higienis", description: "Bahan aktif pilihan aman untuk kulit dan permukaan perabotan rumah." },
        { title: "Tangki Stainless Steel", description: "Diproduksi menggunakan tangki stainless steel standar industri." }
      ];
    }

    // Specific Overrides for Parfum (keep original user request for parfum)
    if (categorySlug === 'parfum') {
      content.executionEngine.points = [
        { title: "Sillage & Longevity", description: "Fokus pada sillage tajam, longevity bekerja secara optimal and bebas noda pada pakaian." },
        { title: "Akses Wadah Premium", description: "Akses botol dan desain wadah yang premium serta eksklusif untuk brand Anda." },
        { title: "Full Legal Compliance", description: "100 persen terima beres termasuk legalitas and BPOM." },
        { title: "Eksklusivitas Formula", description: "Formula DNA tidak pernah diduplikasi pada brand kosmetik lainnya." }
      ];
    }

    // Product-specific "FREE Custom Formula" descriptions (from CSV brief)
    const productCustomFormulaDesc: Record<string, string> = {
      // Body Care
      "bodycare:massage-oil": "Anda bisa menentukan sendiri ingredient, base oil, dan aroma produk.",
      "bodycare:body-butter": "Anda bisa menentukan sendiri ingredient, base oil, dan aroma produk.",
      "bodycare:body-scrub": "Anda bisa menentukan sendiri ingredient, base oil, dan aroma produk.",
      "bodycare:anti-bacterial-soap": "Anda bisa menentukan sendiri ingredient, base oil, dan aroma produk.",
      "bodycare:shower-gel": "Anda bisa menentukan sendiri ingredient, base oil, dan aroma produk.",
      "bodycare:bath-salt": "Anda menentukan jenis garam, campuran herbal, warna, dan aroma.",
      "bodycare:body-serum": "Anda menentukan bahan aktif, klaim produk, dan tekstur serum.",
      "bodycare:transparent-soap": "Anda menentukan kandungan, warna transparan, dan aroma produk.",
      "bodycare:underarm-cream": "Anda menentukan bahan aktif (pencerah/deodorizing) dan tekstur krim.",
      "bodycare:whitening-soap": "Anda menentukan bahan aktif pencerah, bentuk (batang/cair), dan aroma.",
      "bodycare:bar-soap": "Anda menentukan bahan, bentuk cetakan, warna, dan aroma sabun.",
      "bodycare:massage-cream": "Anda menentukan tekstur, tingkat slip, dan aroma krim pijat.",
      "bodycare:soothing-gel": "Anda menentukan bahan aktif menenangkan, tekstur gel, dan klaim produk.",
      "bodycare:neck-cream": "Anda menentukan bahan aktif (anti-aging/pencerah) dan tekstur krim.",
      "bodycare:deodorant": "Anda menentukan varian (spray, roll on, atau dry serum), bahan aktif, dan aroma sesuai konsep brand Anda.",
      "bodycare:deodorant-spray": "Anda menentukan bahan aktif (anti-bau/antiperspirant) dan aroma deodorant spray.",
      "bodycare:deodorant-roll-on": "Anda menentukan bahan aktif (soothing/anti-bau) dan tekstur roll on.",
      "bodycare:deodorant-dry-serum": "Anda menentukan bahan aktif (pencerah/anti-bau) dan tekstur serum.",
      "bodycare:deodorant-balm": "Anda menentukan bahan aktif dan aroma deodorant balm stick.",
      // Foot Care
      "footcare:foot-cream": "Anda menentukan bahan aktif dan tekstur foot cream.",
      "footcare:foot-scrub": "Anda menentukan jenis butiran scrub dan aroma produk.",
      "footcare:foot-spray": "Anda menentukan bahan aktif dan aroma foot spray.",
      "footcare:foot-mask": "Anda menentukan bahan aktif dan tekstur foot mask.",
      "footcare:foot-anti-bacterial": "Anda menentukan bahan aktif dan aroma produk.",
      // Baby Care
      "babycare:baby-wash": "Anda menentukan bahan lembut hypoallergenic, tekstur, dan aroma yang aman untuk bayi.",
      "babycare:baby-shampoo": "Anda menentukan bahan lembut hypoallergenic, tekstur, dan aroma yang aman untuk bayi.",
      "babycare:baby-lotion": "Anda menentukan bahan lembut hypoallergenic, tekstur, dan aroma yang aman untuk kulit bayi.",
      "babycare:baby-powder": "Anda menentukan bahan alami lembut, tekstur, dan aroma yang aman untuk bayi.",
      "babycare:baby-cologne": "Anda menentukan aroma lembut khas bayi yang aman untuk kulit sensitif.",
      // Parfum
      "parfum:body-mist": "Anda menentukan karakter aroma dan tingkat keharuman.",
      "parfum:eau-de-cologne": "Anda menentukan karakter aroma cologne.",
      "parfum:eau-de-toilette": "Anda menentukan karakter aroma eau de toilette.",
      "parfum:eau-de-parfum": "Anda menentukan karakter aroma eau de parfum.",
      "parfum:extrait-de-parfum": "Anda menentukan karakter aroma extrait de parfum.",
      "parfum:minyak-atsiri": "Anda menentukan jenis dan campuran minyak atsiri.",
      // Decorative — Lip Care
      "decorative:lip-cream": "Anda menentukan shade dan finish lip cream.",
      "decorative:lip-matte": "Anda menentukan shade dan tekstur lip matte.",
      "decorative:lip-balm": "Anda menentukan bahan aktif dan aroma lip balm.",
      "decorative:tinted-lip-balm": "Anda menentukan shade dan bahan pelembap tinted lip balm.",
      "decorative:lip-gloss": "Anda menentukan warna, kilau, dan efek lip gloss.",
      "decorative:lip-serum": "Anda menentukan bahan aktif dan klaim lip serum.",
      "decorative:lip-scrub": "Anda menentukan jenis butiran dan aroma lip scrub.",
      "decorative:lip-blush": "Anda menentukan shade dan finish lip blush.",
      // Decorative — Makeup
      "decorative:foundation": "Anda menentukan shade, coverage, dan finish foundation.",
      "decorative:bb-cream": "Anda menentukan shade, coverage, dan finish BB cream.",
      "decorative:face-primer": "Anda menentukan fungsi dan finish face primer.",
      "decorative:foundation-serum": "Anda menentukan shade, coverage, dan bahan perawatan.",
      "decorative:liquid-highlighter": "Anda menentukan shade dan tingkat shimmer highlighter.",
      "decorative:mascara": "Anda menentukan efek, warna, dan formula mascara.",
      "decorative:cream-blush": "Anda menentukan shade dan finish cream blush.",
      "decorative:liquid-blush": "Anda menentukan shade dan finish liquid blush.",
      "decorative:eyebrow-gel": "Anda menentukan warna dan tingkat hold eyebrow gel.",
    };

    const formulaKey = `${categorySlug}:${productData.slug}`;
    const customDesc = productCustomFormulaDesc[formulaKey];
    if (customDesc) {
      content.marketPotential.points[0].description = customDesc;
    }

    return content;
  };

  const strategic = getStrategicContent();
  const pathname = usePathname() || "";
  const segments = pathname.split('/').filter(Boolean);
  const subCategorySlug = segments.length > 3 ? segments[2] : undefined;
  const isHaircare = categoryData.slug === "haircare";
  const variantsList = productData.variants && productData.variants.length > 0
    ? productData.variants
    : productData.tags.filter((t) => t !== "Baru");

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Section */}
      <ProductHero 
        categoryData={categoryData}
        productData={productData}
      />

      {isHaircare && <HaircareMarqueeBand />}

      {/* 2. Strategic Market Potential */}
      <StrategicMarketPotential 
        headline={strategic.marketPotential.headline}
        points={strategic.marketPotential.points}
        image={getProductCardImagePath(productData.slug, categoryData.slug) || productData.heroImage}
      />

      {/* 2b. Spesifikasi, Ukuran, Waktu Produksi, Bahan Aktif & Detail Produk (SSR HTML) */}
      {!isHaircare && (
      <section className="py-14 md:py-20 bg-gradient-to-b from-[#F5F9FE] via-[#FAF9F6] to-white border-y border-blue-100/60">
        <div className="container-custom">
          <div className="max-w-3xl mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#D97706] mb-3">
              <Sparkles className="h-3.5 w-3.5 text-[#F39200]" />
              Spesifikasi &amp; Formulasi
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A2558]">
              Detail Maklon {productData.name}
            </h2>
          </div>

          {/* Info Bar: Pilihan Ukuran, Estimasi Produksi, MOQ Fleksibel, Sertifikasi Resmi */}
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-[#EAF4FC] via-[#F4F9FE] to-white p-5 shadow-[0_8px_24px_rgba(10,37,88,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#0A2558] shadow-xs border border-blue-100">
                  <Package className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Pilihan Ukuran
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-[#0A2558]">
                {(productData.sizeOptions || []).join(", ")}
              </h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Ukuran kemasan dapat disesuaikan dengan target pasar &amp; positioning brand Anda.
              </p>
            </div>

            <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-[#EAF4FC] via-[#F4F9FE] to-white p-5 shadow-[0_8px_24px_rgba(10,37,88,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#F39200] shadow-xs border border-blue-100">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Estimasi Produksi
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-[#0A2558]">
                {productData.productionTime || "2–3 Bulan"}
              </h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Mencakup riset formula R&amp;D, uji stabilitas, pengurusan BPOM/Halal, hingga siap edar.
              </p>
            </div>

            <div className="rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 via-white to-white p-5 shadow-[0_8px_24px_rgba(243,146,0,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F39200]/15 text-[#E67E00] border border-amber-200">
                  <PackageCheck className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D97706]">
                  Minimum Order (MOQ)
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-[#0A2558]">
                MOQ Fleksibel / menyesuaikan kebutuhan brand
              </h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Skala produksi &amp; HPP dapat dikonsultasikan sesuai tahap pertumbuhan dan modal brand.
              </p>
            </div>

            <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-[#EAF4FC] via-[#F4F9FE] to-white p-5 shadow-[0_8px_24px_rgba(10,37,88,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-xs border border-blue-100">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Sertifikasi Resmi
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-[#0A2558]">
                {(productData.certifications || ["BPOM", "Halal MUI", "CPKB Grade A"]).join(", ")}
              </h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Diproduksi di pabrik berstandar CPKB Grade A; izin BPOM &amp; Halal diurus tuntas oleh tim kami.
              </p>
            </div>
          </div>

          {/* Side-by-Side Layout (Referensi Visual Bersih & Terstruktur): Varian & Keunggulan + Bahan Aktif Bergambar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* LEFT: Varian Formula Dikemas Elegan + Keunggulan & Penjelasan */}
            <div className="lg:col-span-6 rounded-3xl border border-blue-100 bg-gradient-to-b from-[#EAF4FC] via-[#F5FAFF] to-white p-6 sm:p-8 shadow-[0_12px_36px_rgba(10,37,88,0.06)] flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0A2558] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                    <Sparkles className="h-3 w-3 text-[#FBB03B]" />
                    Custom Formula · 1 Klien 1 Formula
                  </span>
                  <span className="text-xs font-bold text-[#E67E00]">
                    Siap Dikustomisasi
                  </span>
                </div>

                {variantsList.length > 0 && (
                  <div>
                    <h3 className="font-display text-xl font-extrabold text-[#0A2558] mb-3">
                      Varian Formula {productData.name}
                    </h3>
                    <div className="grid grid-cols-1 min-[440px]:grid-cols-2 gap-2.5">
                      {variantsList.map((v, idx) => (
                        <div
                          key={v}
                          className="flex items-center gap-2.5 rounded-2xl border border-blue-100/90 bg-white/95 px-3.5 py-2.5 shadow-2xs transition-all duration-200 hover:border-[#F39200]/50 hover:shadow-xs"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EAF4FC] text-[11px] font-extrabold text-[#0A2558]">
                            {idx + 1}
                          </span>
                          <span className="text-xs sm:text-[13px] font-bold text-[#0A2558] leading-snug">
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-white bg-white/85 p-5 shadow-2xs space-y-3">
                  <h4 className="font-display text-base font-extrabold text-[#0A2558]">
                    Keunggulan &amp; Penjelasan Formula
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {productData.story}
                  </p>
                  {productData.benefits && productData.benefits.length > 0 && (
                    <ul className="space-y-2 pt-1">
                      {productData.benefits.map((b) => (
                        <li key={b} className="text-xs sm:text-sm text-[#0A2558] font-medium flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#F39200] mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* 3-Icon Summary Strip (mengikuti gaya referensi) */}
              <div className="grid grid-cols-3 gap-3 border-t border-blue-100/80 pt-5 text-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0A2558] shadow-xs border border-blue-100">
                    <FlaskConical className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-bold text-[#0A2558] leading-tight">
                    R&amp;D Teruji
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#F39200] shadow-xs border border-blue-100">
                    <Award className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-bold text-[#0A2558] leading-tight">
                    Formula Eksklusif
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-600 shadow-xs border border-blue-100">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-bold text-[#0A2558] leading-tight">
                    BPOM &amp; Halal
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: Penjelasan Bahan Aktif Unggulan dengan Visual Bulat Ingredient */}
            <div className="lg:col-span-6 rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-[0_12px_36px_rgba(10,37,88,0.05)] flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#F39200]">
                      Active Ingredients
                    </span>
                    <h3 className="font-display text-xl font-extrabold text-[#0A2558]">
                      Bahan Aktif Unggulan {productData.name}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {(productData.ingredients || []).map((ing) => (
                    <div
                      key={ing.name}
                      className="group flex items-center gap-4 rounded-2xl border border-blue-100/70 bg-gradient-to-r from-[#F4F9FE] to-white p-3.5 transition-all duration-200 hover:border-[#F39200]/40 hover:shadow-sm"
                    >
                      {isHaircare && (
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white bg-white shadow-md">
                          <Image
                            src={getHaircareIngredientImage(ing.name)}
                            alt={ing.name}
                            fill
                            sizes="64px"
                            className="object-cover scale-[1.12] transition-transform duration-300 group-hover:scale-[1.18]"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-[#0A2558]">
                            {ing.name}
                          </span>
                          <span className="rounded-full bg-amber-50 border border-amber-200/70 px-2 py-0.5 text-[10px] font-bold text-[#D97706]">
                            Active
                          </span>
                        </div>
                        <p className="text-xs sm:text-[13px] text-slate-600 mt-1 leading-relaxed">
                          {ing.function}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-[#F8FAFC] border border-slate-200/70 px-4 py-3 text-xs text-slate-600 flex items-center justify-between gap-3">
                <span>
                  Ingin kombinasi bahan aktif khusus? Tim apoteker &amp; R&amp;D kami siap memformulasikannya.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 3. Packaging Design Grid */}
      <ProductPackagingGrid 
        categorySlug={categoryData.slug}
        subCategorySlug={subCategorySlug}
        productSlug={productData.slug}
        bottleOptions={productData.bottleOptions}
      />

      {/* 4. Value / Keuntungan Maklon */}
      {isHaircare ? (
        <>
          <HaircareValueSection />
          <OurCertification />
        </>
      ) : (
        <>
          <AdvantagesGrid title="8 Keuntungan Maklon" />
          <LogoScroll logos={aboutData.partnerLogos} />
          <OurCertification />
        </>
      )}

      {/* 6. Product FAQ */}
      <ProductFAQ 
        categorySlug={categoryData.slug} 
        categoryName={categoryData.name}
        subCategorySlug={subCategorySlug}
        productSlug={productData.slug}
        productName={productData.name}
      />
      
      {/* 7. Related Products */}
      <ProductRelated 
        products={categoryData.relatedProducts}
        currentProductSlug={productData.slug}
      />

      {/* 8. CTA Section */}
      <CtaSection title={`Wujudkan Brand ${productData.name} Impian Anda dalam 3 Bulan`} />
    </main>
  );
}