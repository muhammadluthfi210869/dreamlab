import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import CtaSection from "@/components/CtaSection";
import JsonLd from "@/components/JsonLd";
import { buildAlternates } from "@/lib/seo-lang";

export const metadata: Metadata = {
  title: "Katalog Produk Maklon Kosmetik | Dreamlab",
  description:
    "Katalog produk maklon kosmetik Dreamlab: skincare, body care, hair care, makeup, baby care, parfum & foot care. BPOM, CPKB Grade A, Halal MUI.",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  alternates: buildAlternates("/produk/"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Dreamlab",
    title: "Katalog Produk Maklon Kosmetik | Dreamlab",
    description:
      "Katalog produk maklon kosmetik Dreamlab: skincare, body care, hair care, makeup, baby care, parfum & foot care. BPOM, CPKB Grade A, Halal MUI.",
    url: "https://dreamlab.id/produk/",
  },
};

const catalogTabs = [
  { label: "SEMUA", sup: "7", href: "#katalog", active: true },
  { label: "SKINCARE", sup: "15+", href: "/produk/skincare/" },
  { label: "BODY CARE", sup: "20+", href: "/produk/bodycare/" },
  { label: "HAIR CARE", sup: "10+", href: "/produk/haircare/" },
  { label: "DECORATIVE", sup: "12+", href: "/produk/decorative/" },
  { label: "BABY CARE", sup: "8+", href: "/produk/babycare/" },
  { label: "PARFUM & FRAGRANCE", sup: "15+", href: "/produk/parfum/" },
  { label: "FOOT CARE", sup: "10+", href: "/produk/footcare/" },
];

const catalogCategories = [
  {
    id: "skincare",
    name: "Skincare",
    eyebrow: "15+ FORMULA PREMIUM",
    countLabel: "15+ formula",
    image: "/assets/images/catalog/skincare.jpg",
    alt: "Maklon Skincare Dreamlab",
    variants: "Essence Toner · Face Serum · Moisturizer Cream · Gel Cleanser · Sunscreen",
    href: "/produk/skincare/",
    isParfum: false,
  },
  {
    id: "bodycare",
    name: "Body Care",
    eyebrow: "20+ FORMULA PREMIUM",
    countLabel: "20+ formula",
    image: "/assets/images/catalog/bodycare.jpg",
    alt: "Maklon Body Care Dreamlab",
    variants: "Body Wash · Body Mask · Body Serum · Body Lotion · Body Scrub",
    href: "/produk/bodycare/",
    isParfum: false,
  },
  {
    id: "haircare",
    name: "Hair Care",
    eyebrow: "10+ FORMULA PREMIUM",
    countLabel: "10+ formula",
    image: "/assets/images/catalog/haircare.jpg",
    alt: "Maklon Hair Care Dreamlab",
    variants: "Bonding Shampoo · Hair Mask · Hair Serum · Hair Mist · No Wash Treatment",
    href: "/produk/haircare/",
    isParfum: false,
  },
  {
    id: "decorative",
    name: "Decorative (Makeup)",
    eyebrow: "12+ FORMULA PREMIUM",
    countLabel: "12+ formula",
    image: "/assets/images/catalog/decorative.jpg",
    alt: "Maklon Decorative (Makeup) Dreamlab",
    variants: "Peptide Lip Treatment · Lip Matte · Lip Cream · Cushion · Foundation",
    href: "/produk/decorative/",
    isParfum: false,
  },
  {
    id: "babycare",
    name: "Baby Care",
    eyebrow: "8+ FORMULA PREMIUM",
    countLabel: "8+ formula",
    image: "/assets/images/catalog/babycare.jpg",
    alt: "Maklon Baby Care Dreamlab",
    variants: "Baby Hair & Body Wash · Baby Lotion · Baby Massage Oil · Baby Face Cream",
    href: "/produk/babycare/",
    isParfum: false,
  },
  {
    id: "parfum",
    name: "Parfum & Fragrance",
    eyebrow: "15+ SIGNATURE SCENT",
    countLabel: "15+ aroma",
    image: "/assets/images/catalog/parfum.jpg",
    alt: "Maklon Parfum & Fragrance Dreamlab",
    variants: "Extrait de Parfum · Eau de Parfum · Eau de Toilette · Body Mist",
    href: "/produk/parfum/",
    isParfum: true,
  },
  {
    id: "footcare",
    name: "Foot Care & Special Care",
    eyebrow: "10+ FORMULA PREMIUM",
    countLabel: "10+ formula",
    image: "/assets/images/catalog/footcare.jpg",
    alt: "Maklon Foot Care & Special Care Dreamlab",
    variants: "Hydrating Foot Scrub · Foot Serum · Cooling Foot Gel · Foot Cream",
    href: "/produk/footcare/",
    isParfum: false,
  },
];

const categorySummaries = [
  {
    num: "01",
    name: "Skincare & Face Care",
    href: "/produk/skincare/",
    description:
      "Rangkaian perawatan wajah harian hingga perawatan intensif seperti facial wash, essence toner, facial serum, moisturizer cream, dan sunscreen. Cocok untuk brand baru, klinik estetika, maupun lini perawatan kulit yang ingin menonjolkan bahan aktif spesifik dengan klaim aman berizin BPOM.",
  },
  {
    num: "02",
    name: "Body Care",
    href: "/produk/bodycare/",
    description:
      "Produk perawatan tubuh mulai dari body wash, body scrub, body lotion, body serum, hingga body butter dengan tekstur dan aroma khas. Ideal bagi brand yang menyasar kebutuhan perawatan kulit tubuh harian dengan tingkat pembelian ulang yang tinggi.",
  },
  {
    num: "03",
    name: "Hair Care",
    href: "/produk/haircare/",
    description:
      "Solusi perawatan rambut dan kulit kepala seperti bonding shampoo, hair conditioner, hair mask, hair serum, dan hair mist. Tepat untuk brand personal care, salon profesional, atau lini perawatan rambut rontok dan rusak.",
  },
  {
    num: "04",
    name: "Decorative (Makeup)",
    href: "/produk/decorative/",
    description:
      "Kosmetik dekoratif modern meliputi lip cream, lip matte, peptide lip treatment, cushion, dan foundation dengan pilihan shade yang dapat disesuaikan. Cocok untuk brand kecantikan yang membidik segmen tren warna dan riasan praktis.",
  },
  {
    num: "05",
    name: "Baby Care",
    href: "/produk/babycare/",
    description:
      "Formulasi lembut khusus kulit bayi dan anak, antara lain baby 2-in-1 wash, baby shampoo, baby lotion, dan baby cologne. Dirancang bagi brand keluarga dan ibu-anak yang memprioritaskan keamanan formula serta kenyamanan pemakaian.",
  },
  {
    num: "06",
    name: "Parfum & Fragrance",
    href: "/produk/parfum/",
    description:
      "Lini wewangian mulai dari Eau de Parfum, Extrait de Parfum, body mist, hingga signature scent eksklusif untuk merek Anda sendiri. Sangat pas untuk brand lifestyle, fashion, maupun kreator yang ingin menghadirkan karakter aroma unik.",
  },
  {
    num: "07",
    name: "Foot Care",
    href: "/produk/footcare/",
    description:
      "Produk perawatan kaki seperti foot cream dan foot care treatment untuk membantu melembapkan serta merawat area tumit yang kering. Cocok sebagai produk pelengkap lini body care atau segmen perawatan khusus di klinik dan spa.",
  },
];

const maklonSteps = [
  {
    step: "01",
    title: "Konsultasi Konsep & Target Pasar",
    detail:
      "Diskusikan ide produk, target konsumen, kisaran HPP, serta kategori kosmetik yang paling sesuai dengan positioning brand Anda bersama tim Business Development kami.",
  },
  {
    step: "02",
    title: "Riset Formula & Pembuatan Sampel",
    detail:
      "Tim R&D Dreamlab meracik custom formula (1 Client = 1 Formula) dan menyiapkan sampel awal untuk Anda uji tekstur, aroma, serta performanya.",
  },
  {
    step: "03",
    title: "Desain Kemasan & Pendaftaran Legalitas",
    detail:
      "Visualisasi desain kemasan sekaligus registrasi izin edar BPOM RI, sertifikasi Halal MUI, serta pendampingan pendaftaran merek (HAKI).",
  },
  {
    step: "04",
    title: "Produksi Massal di Pabrik CPKB Grade A",
    detail:
      "Setelah sampel disetujui dan legalitas berjalan, produksi massal dilakukan di fasilitas berstandar CPKB Grade A di Surabaya.",
  },
  {
    step: "05",
    title: "Quality Control & Pengiriman Produk",
    detail:
      "Setiap batch melalui pemeriksaan kualitas dan pengemasan akhir sebelum dikirim ke gudang atau lokasi distribusi Anda.",
  },
];

const produkFaqs = [
  {
    question: "Apakah Dreamlab cocok untuk beautypreneur pemula yang ingin membuat brand kosmetik sendiri?",
    answer:
      "Ya. Dreamlab adalah perusahaan maklon kosmetik dan parfum di Surabaya yang melayani beautypreneur pemula hingga brand yang sudah berjalan. Dengan MOQ fleksibel, konsultasi gratis, dan pendampingan lengkap mulai dari formula, desain kemasan, hingga BPOM dan Halal, beautypreneur bisa meluncurkan brand sendiri tanpa harus membangun pabrik.",
  },
  {
    question: "Berapa Minimum Order Quantity (MOQ) maklon kosmetik di Dreamlab?",
    answer:
      "Dreamlab menerapkan MOQ yang fleksibel dan menyesuaikan dengan kategori produk, jenis kemasan, serta kompleksitas bahan aktif yang dipilih. Skema ini dirancang agar beautypreneur pemula maupun brand yang sudah berjalan dapat melakukan uji pasar tanpa terbebani stok awal yang terlalu besar.",
  },
  {
    question: "Produk apa saja yang bisa dimaklonkan beautypreneur di Dreamlab?",
    answer:
      "Dreamlab memproduksi 7 kategori produk dalam satu pabrik: skincare, body care, hair care, kosmetik dekoratif (makeup), baby care, parfum & fragrance, serta foot care. Setiap kategori memiliki formula dasar yang dapat disesuaikan bahan aktif, aroma, dan kemasannya untuk brand beautypreneur.",
  },
  {
    question: "Berapa lama proses maklon di Dreamlab hingga izin BPOM terbit?",
    answer:
      "Di Dreamlab, keseluruhan proses umumnya memakan waktu sekitar 2 hingga 3 bulan. Rinciannya mencakup riset dan pengembangan formula di laboratorium R&D (sekitar 2–4 minggu), registrasi izin edar BPOM RI (sekitar 4–8 minggu), pengurusan sertifikasi Halal, dan produksi massal (sekitar 2–3 minggu).",
  },
  {
    question: "Apakah formula produk di Dreamlab bersifat eksklusif untuk satu brand?",
    answer:
      "Ya. Dreamlab menerapkan prinsip 1 Client = 1 Formula. Formula yang diracik bersama tim R&D Dreamlab dirancang khusus sesuai brief dan karakter brand Anda, sehingga tidak diduplikasi secara identik untuk klien lain.",
  },
  {
    question: "Apakah Dreamlab membantu pengurusan BPOM, sertifikat Halal MUI, dan HAKI?",
    answer:
      "Ya. Sebagai layanan maklon one-stop service, tim regulasi dan kepatuhan Dreamlab mendampingi beautypreneur dalam pengurusan legalitas produk, mulai dari notifikasi BPOM RI, sertifikasi Halal MUI, hingga pendaftaran merek (HAKI).",
  },
  {
    question: "Bagaimana cara beautypreneur memulai maklon dan mengajukan sampel di Dreamlab?",
    answer:
      "Mulailah dengan konsultasi gratis bersama tim Dreamlab untuk menyampaikan ide produk, referensi tekstur, dan target harga. Tim R&D Dreamlab kemudian membuatkan sampel awal untuk Anda evaluasi dan revisi hingga sesuai, sebelum masuk ke produksi massal.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Beranda",
      item: "https://dreamlab.id/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Katalog Produk",
      item: "https://dreamlab.id/produk/",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: produkFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function ProdukPage() {
  return (
    <main className="min-h-screen bg-white text-[#212120] overflow-x-clip">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <style>{`
        .prod-focus:focus-visible {
          outline: 2px solid #F39200;
          outline-offset: 4px;
        }
        .prod-hero-bg {
          background-color: #EAF2FA;
        }
        .prod-hero-overlay {
          background: linear-gradient(180deg, #ffffff 0%, #ffffff 50%, rgba(255, 255, 255, 0.75) 66%, rgba(255, 255, 255, 0) 82%);
        }
        @media (min-width: 1025px) {
          .prod-hero-overlay {
            background:
              linear-gradient(90deg, rgba(255, 255, 255, 0.97) 0%, rgba(255, 255, 255, 0.92) 34%, rgba(255, 255, 255, 0.55) 52%, rgba(255, 255, 255, 0) 68%),
              linear-gradient(0deg, rgba(255, 255, 255, 0.6), transparent 22%);
          }
        }
        .prod-tabs {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .prod-tabs::-webkit-scrollbar {
          display: none;
        }
        .prod-tile-img {
          transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .prod-tile {
          transition: box-shadow 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (hover: hover) {
          .prod-card:hover .prod-tile {
            box-shadow: 0 2px 4px rgba(60, 35, 10, 0.04), 0 18px 40px -14px rgba(60, 35, 10, 0.18);
          }
          .prod-card:hover .prod-tile-img {
            transform: scale(1.04);
          }
          .prod-card:hover .prod-tile-arrow {
            opacity: 1;
          }
        }
        .prod-index-row {
          transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (hover: hover) {
          .prod-index-row:hover {
            transform: translateX(8px);
          }
        }
        .prod-choose-overlay {
          background: linear-gradient(180deg, #F7F6F4 0%, #F7F6F4 58%, rgba(247, 246, 244, 0.72) 76%, rgba(247, 246, 244, 0.1) 100%);
        }
        @media (min-width: 1025px) {
          .prod-choose-overlay {
            background: linear-gradient(90deg, #F7F6F4 0%, rgba(247, 246, 244, 0.96) 38%, rgba(247, 246, 244, 0.6) 54%, rgba(247, 246, 244, 0) 70%);
          }
        }
        details.prod-faq summary {
          list-style: none;
        }
        details.prod-faq summary::-webkit-details-marker {
          display: none;
        }
        details.prod-faq[open] .prod-faq-icon {
          background-color: #212120;
          color: #ffffff;
          transform: rotate(45deg);
        }
        @media (prefers-reduced-motion: reduce) {
          .prod-tile,
          .prod-tile-img,
          .prod-index-row,
          .prod-btn-primary,
          .prod-faq-icon {
            transition: none !important;
          }
          .prod-card:hover .prod-tile-img,
          .prod-index-row:hover,
          .prod-btn-primary:hover {
            transform: none !important;
          }
        }
      `}</style>

      {/* 2) HERO: full-bleed photo background */}
      <section className="prod-hero-bg relative w-full min-h-0 lg:min-h-[640px] flex items-center overflow-hidden border-b border-[rgba(33,33,32,0.08)]">
        <Image
          src="/assets/images/hero/hero-03.jpg"
          alt="Rangkaian produk maklon kosmetik Dreamlab"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_bottom] max-lg:!top-auto max-lg:!h-[340px] max-lg:sm:!h-[390px] lg:object-[70%_center]"
        />
        <div aria-hidden="true" className="prod-hero-overlay absolute inset-0 z-10 pointer-events-none" />

        <div className="relative z-20 mx-auto w-full max-w-[1240px] px-[16px] lg:px-[40px] pt-8 pb-0 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-6 lg:gap-10 items-center">
            {/* Left Column */}
            <div>
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="text-[12px] text-[#9A958F] mb-4 flex items-center gap-1.5">
                <Link href="/" className="prod-focus hover:text-[#212120] transition-colors">
                  Beranda
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-[#6B6762]">Katalog Produk</span>
              </nav>

              {/* Eyebrow Pill */}
              <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF3E2] px-3.5 py-1.5 text-[12px] font-medium text-[#C86400] mb-5">
                <span className="h-[7px] w-[7px] rounded-full bg-[#F39200] ring-4 ring-[#F39200]/20" />
                Maklon Kosmetik BPOM &amp; Halal · Surabaya
              </span>

              {/* H1 */}
              <h1 className="font-display text-[38px] sm:text-[46px] lg:text-[58px] font-normal leading-[1.05] tracking-[-0.02em] text-[#212120] mb-5">
                Katalog Produk <span className="text-[#F39200]">Maklon</span> Dreamlab
              </h1>

              {/* Lead */}
              <p className="text-[16.5px] lg:text-[19px] text-[#6B6762] leading-relaxed max-w-[480px] mb-5">
                Pilih produknya, kami racik formula eksklusif untuk brand Anda. Lengkap dengan BPOM, Halal, dan desain kemasan.
              </p>

              {/* USP Row */}
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[14px] font-medium text-[#212120] mb-7">
                {["1 Client = 1 Formula", "MOQ fleksibel", "Siap jual 2–3 bulan"].map((usp) => (
                  <li key={usp} className="inline-flex items-center gap-2">
                    <span className="size-[18px] rounded-full bg-[#FFF3E2] text-[#C86400] flex items-center justify-center shrink-0">
                      <Check className="size-3 stroke-[2.5]" />
                    </span>
                    <span>{usp}</span>
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="flex items-center gap-2.5 sm:gap-3 mb-7">
                <Link
                  href="/thankyou/google/?source=produk-hero"
                  rel="nofollow"
                  className="prod-focus prod-btn-primary flex-1 sm:flex-none whitespace-nowrap inline-flex items-center justify-center rounded-full bg-[#F39200] text-[#212120] text-[13.5px] sm:text-[15px] font-semibold px-[14px] sm:px-[28px] py-[13px] sm:py-[16px] shadow-[0_10px_24px_-10px_rgba(243,146,0,0.7)] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Konsultasi Gratis →
                </Link>
                <a
                  href="#katalog"
                  className="prod-focus flex-1 sm:flex-none whitespace-nowrap inline-flex items-center justify-center rounded-full bg-white text-[#212120] border border-[rgba(33,33,32,0.10)] hover:border-[#212120] text-[13.5px] sm:text-[15px] font-semibold px-[14px] sm:px-[28px] py-[13px] sm:py-[16px] transition-colors"
                >
                  Lihat Katalog
                </a>
              </div>

              {/* Cert Logos Row */}
              <div className="border-t border-[rgba(33,33,32,0.10)] pt-[20px] sm:pt-[24px] grid grid-cols-4 sm:flex items-center gap-3 sm:gap-7">
                <Image
                  src="/images/certifications/bpom.png"
                  alt="Sertifikasi BPOM RI"
                  width={90}
                  height={30}
                  className="h-[26px] sm:h-[30px] w-auto object-contain"
                />
                <Image
                  src="/images/certifications/halal.png"
                  alt="Sertifikasi Halal MUI"
                  width={90}
                  height={30}
                  className="h-[26px] sm:h-[30px] w-auto object-contain"
                />
                <Image
                  src="/images/certifications/cpkb.png"
                  alt="Sertifikasi CPKB Grade A"
                  width={90}
                  height={30}
                  className="h-[26px] sm:h-[30px] w-auto object-contain"
                />
                <Image
                  src="/images/certifications/hki.png"
                  alt="Terdaftar HKI"
                  width={110}
                  height={30}
                  className="h-[26px] sm:h-[30px] w-auto object-contain"
                />
              </div>
            </div>

            {/* Right Column (spacer on mobile/tablet, stat chips over photo) */}
            <div className="relative h-[300px] sm:h-[340px] lg:h-[460px] flex items-end justify-between lg:block pb-6 lg:pb-0 gap-3">
              {/* Chip 1 */}
              <div className="lg:absolute lg:left-[8%] lg:top-[6%] rounded-[16px] bg-[rgba(255,255,255,0.95)] supports-[backdrop-filter]:bg-[rgba(255,255,255,0.92)] backdrop-blur-[12px] px-[14px] py-[12px] sm:px-[18px] sm:py-[14px] shadow-[0_12px_30px_-12px_rgba(60,35,10,0.3)] flex-1 lg:flex-none">
                <div className="font-display text-[22px] lg:text-[30px] text-[#C86400] leading-none">
                  1000+
                </div>
                <div className="text-[10.5px] lg:text-[12px] text-[#6B6762] mt-1">
                  brand telah bekerja sama
                </div>
              </div>

              {/* Chip 2 */}
              <div className="lg:absolute lg:right-0 lg:bottom-0 rounded-[16px] bg-[rgba(255,255,255,0.95)] supports-[backdrop-filter]:bg-[rgba(255,255,255,0.92)] backdrop-blur-[12px] px-[14px] py-[12px] sm:px-[18px] sm:py-[14px] shadow-[0_12px_30px_-12px_rgba(60,35,10,0.3)] flex-1 lg:flex-none">
                <div className="font-display text-[22px] lg:text-[30px] text-[#C86400] leading-none">
                  7
                </div>
                <div className="text-[10.5px] lg:text-[12px] text-[#6B6762] mt-1">
                  kategori produk dalam satu pabrik
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3) KATALOG LAYANAN MAKLON PREMIUM (IKKARI-style) */}
      <section id="katalog" className="bg-white py-[64px] lg:py-[96px]">
        <div className="mx-auto max-w-[1240px] px-[16px] lg:px-[40px]">
          {/* Small Left Header */}
          <div className="mb-8">
            <h2 className="font-display text-[22px] font-normal text-[#212120] mb-2">
              Katalog Layanan Maklon Premium
            </h2>
            <p className="text-[14px] text-[#6B6762] leading-relaxed max-w-[620px]">
              Dari formulasi riset laboratorium (R&amp;D) kustom, visualisasi desain branding eksklusif, hingga pendaftaran legalitas resmi BPOM, Halal, &amp; HKI — kami mewujudkan brand kecantikan juara Anda.
            </p>
          </div>

          {/* Tabs Row */}
          <nav
            aria-label="Navigasi kategori katalog"
            className="prod-tabs -mx-[16px] px-[16px] lg:mx-0 lg:px-0 flex items-center gap-5 lg:gap-6 overflow-x-auto border-b border-[rgba(33,33,32,0.10)] mb-8 lg:mb-10"
          >
            {catalogTabs.map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                className={`prod-focus shrink-0 pb-3.5 text-[13px] font-medium uppercase tracking-[0.04em] transition-colors border-b-2 -mb-[1px] ${
                  tab.active
                    ? "text-[#212120] border-[#212120]"
                    : "text-[#6B6762] border-transparent hover:text-[#212120]"
                }`}
              >
                {tab.label}
                <sup className="ml-0.5 text-[9.5px] text-[#9A958F] font-normal">
                  {tab.sup}
                </sup>
              </Link>
            ))}
          </nav>

          {/* 4-Column Editorial Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-[28px] lg:gap-y-[40px] gap-x-[12px] lg:gap-x-[24px]">
            {catalogCategories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                aria-label={`Lihat katalog maklon ${cat.name}`}
                className="prod-card prod-focus group block"
              >
                <span
                  className={`block text-[9.5px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.14em] mb-1.5 sm:mb-2 truncate ${
                    cat.isParfum ? "text-[#C86400]" : "text-[#6B6762]"
                  }`}
                >
                  {cat.eyebrow}
                </span>

                <div className="prod-tile relative aspect-[4/5] rounded-[6px] overflow-hidden bg-[#F2EEE9] mb-3.5">
                  <Image
                    src={cat.image}
                    alt={cat.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width:640px) 46vw, (max-width:1024px) 30vw, 280px"
                    className="prod-tile-img object-cover object-center"
                  />
                  <span
                    aria-hidden="true"
                    className="prod-tile-arrow absolute bottom-3 right-3 size-[32px] lg:size-[38px] rounded-full bg-white text-[#212120] flex items-center justify-center shadow-sm opacity-100 lg:opacity-0 transition-opacity duration-300"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-[14px] font-semibold uppercase tracking-[0.02em] text-[#212120]">
                    {cat.name}
                  </h3>
                  <span className="hidden sm:inline text-[12px] text-[#9A958F] shrink-0">
                    {cat.countLabel}
                  </span>
                </div>
                <p className="hidden sm:block text-[13px] text-[#6B6762] leading-snug mt-1">
                  {cat.variants}
                </p>
              </Link>
            ))}

            {/* 8th Slot: CTA Tile */}
            <div className="col-span-2 lg:col-span-1 flex flex-col justify-between rounded-[6px] bg-[#F7F5F2] p-[22px] sm:p-[28px] lg:aspect-[4/5]">
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C86400] mb-3">
                  FORMULA CUSTOM
                </span>
                <h3 className="font-display text-[22px] sm:text-[24px] font-normal text-[#212120] leading-[1.2] mb-3">
                  Belum menemukan kategori yang pas?
                </h3>
                <p className="text-[13.5px] text-[#6B6762] leading-relaxed mb-6">
                  Tim R&amp;D kami bisa mengembangkan formula baru sesuai konsep, target pasar, dan modal brand Anda.
                </p>
              </div>
              <Link
                href="/thankyou/google/?source=produk-katalog-cta"
                rel="nofollow"
                className="prod-focus prod-btn-primary inline-flex items-center justify-center rounded-full bg-[#F39200] text-[#212120] text-[14px] font-semibold px-[22px] py-[13px] shadow-[0_10px_24px_-10px_rgba(243,146,0,0.7)] transition-transform duration-300 hover:-translate-y-0.5 w-full sm:w-fit"
              >
                Konsultasi Gratis →
              </Link>
            </div>
          </div>

          {/* SEO Block: TENTANG KATALOG INI */}
          <div className="mt-[72px] pt-[32px] border-t border-[rgba(33,33,32,0.10)] grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4 lg:gap-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A958F]">
              TENTANG KATALOG INI
            </span>
            <p className="text-[14px] text-[#6B6762] leading-[1.8] max-w-[820px]">
              Dreamlab adalah perusahaan maklon kosmetik dan parfum di Surabaya yang memproduksi rangkaian skincare, body care, hair care, kosmetik dekoratif, baby care, wewangian, hingga foot care dalam satu ekosistem layanan terpadu. Katalog ini dirancang untuk membantu pemilik brand baru, klinik kecantikan, reseller, hingga beautypreneur yang ingin membangun lini produk bermerek sendiri tanpa harus membangun pabrik. Setiap produk dikembangkan melalui sistem custom formula (1 Client = 1 Formula) di fasilitas berstandar CPKB Grade A, lengkap dengan pendampingan registrasi izin edar BPOM RI dan sertifikasi Halal MUI.
            </p>
          </div>
        </div>
      </section>

      {/* 4) KATEGORI PRODUK MAKLON & SPESIALISASI FORMULA: editorial index */}
      <section className="bg-white py-[64px] lg:py-[96px] border-t border-[rgba(33,33,32,0.10)]">
        <div className="mx-auto max-w-[1240px] px-[16px] lg:px-[40px]">
          <div className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-10 lg:gap-[64px] items-start">
            {/* Left Sticky */}
            <div className="lg:sticky lg:top-[104px]">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C86400] mb-3">
                SPESIALISASI FORMULA
              </span>
              <h2 className="font-display text-[28px] lg:text-[34px] font-normal text-[#212120] leading-[1.15] mb-4">
                Kategori Produk Maklon &amp; Spesialisasi Formula
              </h2>
              <p className="text-[15px] text-[#6B6762] leading-relaxed">
                Pilih kategori produk yang paling relevan dengan target audiens dan strategi distribusi bisnis Anda. Klik setiap kategori untuk melihat daftar varian produk dan opsi formulasi yang tersedia.
              </p>
            </div>

            {/* Right Editorial Index Rows */}
            <div className="border-t border-[rgba(33,33,32,0.10)]">
              {categorySummaries.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  aria-label={`Lihat Katalog ${cat.name}`}
                  className="prod-index-row prod-focus group grid grid-cols-[32px_1fr_20px] sm:grid-cols-[48px_1fr_28px] gap-4 items-start py-6 border-b border-[rgba(33,33,32,0.10)]"
                >
                  <span className="text-[12px] text-[#9A958F] pt-1 font-medium">
                    {cat.num}
                  </span>
                  <div>
                    <h3 className="font-display text-[19px] sm:text-[22px] font-normal text-[#212120] group-hover:text-[#C86400] transition-colors mb-1.5">
                      {cat.name}
                    </h3>
                    <p className="text-[14.5px] text-[#6B6762] leading-relaxed max-w-[620px]">
                      {cat.description}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#212120] group-hover:text-[#C86400] group-hover:translate-x-1 transition-all mt-1.5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5) CARA MEMILIH PRODUK MAKLON UNTUK BRAND ANDA */}
      <section className="relative bg-[#F6F5F3] overflow-hidden pt-[64px] pb-0 lg:py-[104px] border-t border-[rgba(33,33,32,0.10)]">
        <Image
          src="/new asset/new-icon-packing-design/sampul-web-2.webp"
          alt="Produk maklon kosmetik Dreamlab"
          fill
          loading="lazy"
          sizes="(max-width:1024px) 100vw, 60vw"
          className="object-cover object-[80%_bottom] max-lg:!top-auto max-lg:!h-[240px] lg:object-right"
        />
        <div aria-hidden="true" className="prod-choose-overlay absolute inset-0 z-10 pointer-events-none" />

        <div className="relative z-20 mx-auto max-w-[1240px] px-[16px] lg:px-[40px]">
          <div className="max-w-[560px] pb-[220px] lg:pb-0">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C86400] mb-3">
              PANDUAN MEMULAI
            </span>
            <h2 className="font-display text-[28px] lg:text-[34px] font-normal text-[#212120] leading-[1.15] mb-3">
              Cara Memilih Produk Maklon untuk Brand Anda
            </h2>
            <p className="text-[17px] text-[#212120] leading-relaxed mb-6">
              Menentukan produk pertama (hero product) adalah langkah paling penting sebelum produksi batch awal.
            </p>

            {/* 2 Numbered Tip Cards */}
            <ol className="space-y-[18px]">
              <li className="rounded-[14px] bg-[rgba(255,255,255,0.92)] supports-[backdrop-filter]:bg-[rgba(255,255,255,0.85)] backdrop-blur-[10px] border border-[rgba(33,33,32,0.06)] p-[18px_20px] shadow-[0_6px_18px_-10px_rgba(60,35,10,0.18)] grid grid-cols-[40px_1fr] gap-3.5 items-start">
                <span className="size-[40px] rounded-full bg-[#FFF3E2] text-[#C86400] font-display text-[15px] flex items-center justify-center shrink-0">
                  01
                </span>
                <div>
                  <h3 className="text-[15.5px] font-semibold text-[#212120] mb-1">
                    Mulai dari masalah target pasar
                  </h3>
                  <p className="text-[14px] text-[#6B6762] leading-relaxed">
                    Petakan kebutuhan utama konsumen Anda, misalnya kulit kusam, jerawat, rambut rontok, atau parfum harian. Produk yang dipakai rutin dan cepat habis lebih mudah menghasilkan repeat order.
                  </p>
                </div>
              </li>

              <li className="rounded-[14px] bg-[rgba(255,255,255,0.92)] supports-[backdrop-filter]:bg-[rgba(255,255,255,0.85)] backdrop-blur-[10px] border border-[rgba(33,33,32,0.06)] p-[18px_20px] shadow-[0_6px_18px_-10px_rgba(60,35,10,0.18)] grid grid-cols-[40px_1fr] gap-3.5 items-start">
                <span className="size-[40px] rounded-full bg-[#FFF3E2] text-[#C86400] font-display text-[15px] flex items-center justify-center shrink-0">
                  02
                </span>
                <div>
                  <h3 className="text-[15.5px] font-semibold text-[#212120] mb-1">
                    Sesuaikan dengan modal &amp; saluran jualan
                  </h3>
                  <p className="text-[14px] text-[#6B6762] leading-relaxed">
                    Brand yang berjualan di marketplace dan media sosial sebaiknya mulai dari 1–2 SKU unggulan agar anggaran pemasaran fokus dan perputaran stok tetap sehat.
                  </p>
                </div>
              </li>
            </ol>

            {/* CTA Row */}
            <div className="mt-[28px] flex flex-col sm:flex-row gap-[12px]">
              <Link
                href="/thankyou/google/?source=produk-cara-memilih"
                rel="nofollow"
                className="prod-focus prod-btn-primary w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#F39200] text-[#212120] text-[15px] font-semibold px-[28px] py-[16px] shadow-[0_10px_24px_-10px_rgba(243,146,0,0.7)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Konsultasi Pilih Produk Gratis →
              </Link>
              <a
                href="#katalog"
                className="prod-focus w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white text-[#212120] border border-[rgba(33,33,32,0.10)] hover:border-[#212120] text-[15px] font-semibold px-[28px] py-[16px] transition-colors"
              >
                Lihat Katalog
              </a>
            </div>

            {/* Internal Links Row */}
            <div className="mt-[22px] flex flex-wrap items-center gap-x-4 gap-y-2 text-[13.5px] font-medium text-[#212120]">
              <Link href="/panduan/" className="prod-focus border-b border-[#F39200] pb-0.5 hover:text-[#C86400] transition-colors">
                Panduan maklon Dreamlab →
              </Link>
              <span aria-hidden="true" className="text-[#9A958F]">·</span>
              <Link href="/services/" className="prod-focus border-b border-[#F39200] pb-0.5 hover:text-[#C86400] transition-colors">
                Layanan maklon kosmetik →
              </Link>
              <span aria-hidden="true" className="text-[#9A958F]">·</span>
              <Link href="/contact-us/" className="prod-focus border-b border-[#F39200] pb-0.5 hover:text-[#C86400] transition-colors">
                Kontak Dreamlab →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6) ALUR MAKLON DI DREAMLAB: horizontal timeline */}
      <section className="bg-white py-[64px] lg:py-[96px] border-t border-[rgba(33,33,32,0.10)]">
        <div className="mx-auto max-w-[1240px] px-[16px] lg:px-[40px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="font-display text-[28px] lg:text-[34px] font-normal text-[#212120] mb-2">
                Alur Maklon di Dreamlab
              </h2>
              <p className="text-[14px] text-[#6B6762]">
                Tahapan terstruktur dari penyusunan konsep hingga produk siap edar di pasaran.
              </p>
            </div>
            <Link
              href="/about-us/alur-maklon/"
              className="prod-focus text-[13px] font-medium text-[#212120] underline underline-offset-4 hover:text-[#C86400] transition-colors shrink-0"
            >
              Pelajari Alur Maklon Lengkap →
            </Link>
          </div>

          <div className="relative">
            {/* Desktop horizontal connector line */}
            <div
              aria-hidden="true"
              className="hidden lg:block absolute top-[20px] left-0 right-0 h-[1px] bg-[rgba(33,33,32,0.10)]"
            />
            {/* Mobile/tablet vertical connector line */}
            <div
              aria-hidden="true"
              className="lg:hidden absolute top-[20px] bottom-[20px] left-[19.5px] w-[1px] bg-[rgba(33,33,32,0.10)]"
            />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-6">
              {maklonSteps.map((item) => (
                <div
                  key={item.step}
                  className="group relative pl-[56px] lg:pl-0"
                >
                  <div className="absolute left-0 top-0 lg:static size-[40px] rounded-full bg-white border border-[rgba(33,33,32,0.15)] group-hover:bg-[#F39200] group-hover:border-[#F39200] text-[#212120] font-display text-[14px] flex items-center justify-center relative z-10 transition-colors mb-4">
                    {item.step}
                  </div>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A958F] mb-1.5">
                    TAHAP {item.step}
                  </span>
                  <h3 className="text-[16px] font-semibold text-[#212120] leading-snug mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[13.5px] text-[#6B6762] leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7) FAQ: entity-rich (Dreamlab + beautypreneur) */}
      <section className="bg-[#F7F5F2] py-[64px] lg:py-[96px] border-t border-[rgba(33,33,32,0.10)]">
        <div className="mx-auto max-w-[1240px] px-[16px] lg:px-[40px]">
          <div className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-10 lg:gap-16 items-start">
            {/* Left Sticky */}
            <div className="lg:sticky lg:top-[104px]">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C86400] mb-3">
                FAQ
              </span>
              <h2 className="font-display text-[28px] lg:text-[34px] font-normal text-[#212120] leading-[1.15] mb-4">
                Pertanyaan yang Sering Diajukan (FAQ)
              </h2>
              <p className="text-[14.5px] text-[#6B6762] leading-relaxed mb-6">
                Jawaban singkat seputar maklon kosmetik di Dreamlab untuk beautypreneur. Belum menemukan jawabannya? Tim Dreamlab siap membantu.
              </p>
              <Link
                href="/thankyou/google/?source=produk-faq"
                rel="nofollow"
                className="prod-focus inline-flex items-center justify-center rounded-full bg-white text-[#212120] border border-[rgba(33,33,32,0.15)] hover:border-[#212120] text-[14px] font-semibold px-6 py-3 transition-colors"
              >
                Chat Tim Dreamlab →
              </Link>
            </div>

            {/* Right Accordion */}
            <div className="border-t border-[rgba(33,33,32,0.10)]">
              {produkFaqs.map((faq, idx) => (
                <details
                  key={faq.question}
                  open={idx === 0}
                  className="prod-faq border-b border-[rgba(33,33,32,0.10)] py-5"
                >
                  <summary className="prod-focus cursor-pointer flex items-center justify-between gap-4 text-[15px] sm:text-[16px] font-medium text-[#212120] leading-snug">
                    <span>{faq.question}</span>
                    <span
                      aria-hidden="true"
                      className="prod-faq-icon size-[28px] rounded-full border border-[rgba(33,33,32,0.18)] flex items-center justify-center text-[16px] leading-none shrink-0 transition-all duration-300"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 pr-2 sm:pr-10 text-[14.5px] text-[#6B6762] leading-[1.75]">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaSection
        title="Wujudkan Brand Kosmetik Impian Anda dalam 3 Bulan"
        subtitle="Konsultasi gratis dengan tim Dreamlab untuk produk maklon Anda."
      />
    </main>
  );
}
