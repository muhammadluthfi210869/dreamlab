"use client";

import { usePathname } from "next/navigation";
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
  HaircareCertificationsSection,
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
      <section className="py-14 md:py-20 bg-[#FAF9F6] border-y border-gray-100">
        <div className="container-custom">
          <div className="max-w-3xl mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-brand-blue mb-2">
              Spesifikasi &amp; Formulasi
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-normal text-brand-black">
              Detail Maklon {productData.name}
            </h2>
          </div>

          {/* Info Bar: Ukuran, Produksi, MOQ Fleksibel, Sertifikasi */}
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Pilihan Ukuran
              </span>
              <h3 className="font-display text-base text-brand-black">
                {(productData.sizeOptions || []).join(", ")}
              </h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Estimasi Produksi
              </span>
              <h3 className="font-display text-base text-brand-black">
                {productData.productionTime}
              </h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Minimum Order (MOQ)
              </span>
              <h3 className="font-display text-base text-brand-blue">
                MOQ Fleksibel / menyesuaikan kebutuhan brand
              </h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Sertifikasi Resmi
              </span>
              <h3 className="font-display text-base text-brand-black">
                {(productData.certifications || ["BPOM", "Halal MUI", "CPKB Grade A"]).join(", ")}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Varian & Bahan Aktif */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200/80 space-y-5">
              {variantsList.length > 0 && (
                <div>
                  <h3 className="font-display text-lg text-brand-black mb-2.5">
                    Varian Formula {productData.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {variantsList.map((v) => (
                      <span
                        key={v}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F1F7FC] text-brand-blue border border-brand-blue/20"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-display text-lg text-brand-black mb-3">
                  Bahan Aktif Unggulan
                </h3>
                <div className="space-y-2.5">
                  {(productData.ingredients || []).map((ing) => (
                    <div
                      key={ing.name}
                      className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-gray-100"
                    >
                      <div className="font-bold text-xs sm:text-sm text-brand-black">
                        {ing.name}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{ing.function}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Keunggulan & Deskripsi Lengkap */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200/80 space-y-4">
              <h3 className="font-display text-lg text-brand-black">
                Keunggulan Formula {productData.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {productData.story}
              </p>
              {productData.benefits && productData.benefits.length > 0 && (
                <ul className="space-y-2 pt-2">
                  {productData.benefits.map((b) => (
                    <li key={b} className="text-xs sm:text-sm text-brand-black flex items-start gap-2">
                      <span className="text-brand-blue font-bold">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

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
          <HaircareCertificationsSection />
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