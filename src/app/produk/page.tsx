import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CtaSection from "@/components/CtaSection";
import JsonLd from "@/components/JsonLd";
import {
  DreamlabIntroSection,
  DreamlabDocumentationSection,
} from "@/components/ProdukShowcaseSections";
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
  { label: "Semua", sup: "7", href: "#katalog", active: true },
  { label: "Skincare", sup: "15+", href: "/produk/skincare/" },
  { label: "Body Care", sup: "20+", href: "/produk/bodycare/" },
  { label: "Hair Care", sup: "10+", href: "/produk/haircare/" },
  { label: "Decorative", sup: "12+", href: "/produk/decorative/" },
  { label: "Baby Care", sup: "8+", href: "/produk/babycare/" },
  { label: "Parfum", sup: "15+", href: "/produk/parfum/" },
  { label: "Foot Care", sup: "10+", href: "/produk/footcare/" },
];

const catalogCategories = [
  {
    id: "skincare",
    name: "Skincare",
    tag: "15+ FORMULA",
    image: "/assets/images/catalog/skincare.jpg",
    alt: "Maklon Skincare Dreamlab",
    variants: "Essence Toner · Face Serum · Moisturizer · Gel Cleanser · Sunscreen",
    href: "/produk/skincare/",
  },
  {
    id: "bodycare",
    name: "Body Care",
    tag: "20+ FORMULA",
    image: "/assets/images/catalog/bodycare.jpg",
    alt: "Maklon Body Care Dreamlab",
    variants: "Body Wash · Body Mask · Body Serum · Body Lotion · Body Scrub",
    href: "/produk/bodycare/",
  },
  {
    id: "haircare",
    name: "Hair Care",
    tag: "10+ FORMULA",
    image: "/assets/images/catalog/haircare.jpg",
    alt: "Maklon Hair Care Dreamlab",
    variants: "Bonding Shampoo · Hair Mask · Hair Serum · Hair Mist",
    href: "/produk/haircare/",
  },
  {
    id: "decorative",
    name: "Decorative (Makeup)",
    tag: "12+ FORMULA",
    image: "/assets/images/catalog/decorative.jpg",
    alt: "Maklon Decorative (Makeup) Dreamlab",
    variants: "Lip Treatment · Lip Matte · Lip Cream · Cushion · Foundation",
    href: "/produk/decorative/",
  },
  {
    id: "babycare",
    name: "Baby Care",
    tag: "8+ FORMULA",
    image: "/assets/images/catalog/babycare.jpg",
    alt: "Maklon Baby Care Dreamlab",
    variants: "Baby Hair & Body Wash · Baby Lotion · Baby Massage Oil",
    href: "/produk/babycare/",
  },
  {
    id: "parfum",
    name: "Parfum & Fragrance",
    tag: "15+ SIGNATURE SCENT",
    image: "/assets/images/catalog/parfum.jpg",
    alt: "Maklon Parfum & Fragrance Dreamlab",
    variants: "Extrait de Parfum · Eau de Parfum · Eau de Toilette · Body Mist",
    href: "/produk/parfum/",
  },
  {
    id: "footcare",
    name: "Foot Care",
    tag: "10+ FORMULA",
    image: "/assets/images/catalog/footcare.jpg",
    alt: "Maklon Foot Care & Special Care Dreamlab",
    variants: "Foot Scrub · Foot Serum · Cooling Foot Gel · Foot Cream",
    href: "/produk/footcare/",
  },
];

const maklonSteps = [
  {
    step: "01",
    title: "Konsultasi Konsep & Target Pasar",
    detail:
      "Bahas ide produk, target konsumen, dan kisaran HPP. Kami bantu pilih hero product pertama Anda.",
  },
  {
    step: "02",
    title: "Riset Formula & Sampel",
    detail:
      "Tim R&D meracik formula eksklusif (1 Client = 1 Formula). Anda uji tekstur, aroma, dan performanya.",
  },
  {
    step: "03",
    title: "Desain Kemasan & Legalitas",
    detail:
      "Desain kemasan plus pengurusan BPOM RI, Halal MUI, dan pendaftaran merek (HAKI).",
  },
  {
    step: "04",
    title: "Produksi CPKB Grade A",
    detail:
      "Setelah sampel disetujui, produksi massal berjalan di pabrik Dreamlab Surabaya.",
  },
  {
    step: "05",
    title: "Quality Control & Pengiriman",
    detail:
      "Setiap batch dicek kualitasnya, dikemas, lalu dikirim ke gudang Anda.",
  },
];

const produkFaqs = [
  {
    question: "Apakah Dreamlab cocok untuk beautypreneur pemula yang ingin membuat brand kosmetik sendiri?",
    answer:
      "Ya. Dreamlab adalah perusahaan maklon kosmetik dan parfum di Surabaya yang melayani beautypreneur pemula hingga brand yang sudah berjalan. Dengan MOQ fleksibel, konsultasi gratis, dan pendampingan lengkap mulai dari formula, desain kemasan, hingga BPOM dan Halal, beautypreneur bisa meluncurkan brand sendiri tanpa harus membangun pabrik.",
  },
  {
    question: "Bagaimana cara memilih produk maklon pertama untuk brand Anda?",
    answer:
      "Mulailah dari masalah utama target pasar, misalnya kulit kusam, jerawat, rambut rontok, atau parfum harian. Produk yang dipakai rutin dan cepat habis lebih mudah menghasilkan repeat order. Untuk brand yang berjualan di marketplace dan media sosial, Dreamlab menyarankan memulai dari 1–2 SKU unggulan (hero product) agar anggaran pemasaran fokus dan perputaran stok tetap sehat.",
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
    <div className="min-h-screen bg-white text-[#212120] overflow-x-clip">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <style>{`
        .prod-focus:focus-visible,
        details.prod-faq summary:focus-visible {
          outline: 2px solid #F39200;
          outline-offset: 4px;
          border-radius: 6px;
        }
        .prod-hero-overlay {
          background: linear-gradient(180deg, #ffffff 0%, #ffffff 60%, rgba(255, 255, 255, 0.6) 68%, rgba(255, 255, 255, 0) 78%);
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .prod-hero-overlay {
            background: linear-gradient(180deg, #ffffff 0%, #ffffff 48%, rgba(255, 255, 255, 0.7) 58%, rgba(255, 255, 255, 0) 72%);
          }
        }
        @media (min-width: 1025px) {
          .prod-hero-overlay {
            background:
              linear-gradient(90deg, rgba(255, 255, 255, 0.97) 0%, rgba(255, 255, 255, 0.92) 34%, rgba(255, 255, 255, 0.55) 52%, rgba(255, 255, 255, 0) 68%),
              linear-gradient(0deg, #ffffff, transparent 18%);
          }
        }
        .prod-tabs {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .prod-tabs::-webkit-scrollbar {
          display: none;
        }
        .prod-tile {
          transition: box-shadow 450ms cubic-bezier(0.22, 1, 0.36, 1), transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .prod-tile-img {
          transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .prod-tile-go {
          transition: opacity 400ms cubic-bezier(0.22, 1, 0.36, 1), transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (hover: hover) {
          .prod-card:hover .prod-tile {
            box-shadow: 0 2px 4px rgba(60, 35, 10, 0.04), 0 18px 40px -14px rgba(60, 35, 10, 0.18);
            transform: translateY(-4px);
          }
          .prod-card:hover .prod-tile-img {
            transform: scale(1.04);
          }
          .prod-card:hover .prod-tile-go {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes prod-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes prod-float {
          50% { transform: translateY(-14px) scale(1.04); }
        }
        @keyframes prod-mq {
          to { transform: translateX(calc(-50% - 10px)); }
        }
        @keyframes prod-mq-logo {
          to { transform: translateX(calc(-50% - 8px)); }
        }
        .prod-spin-slow {
          animation: prod-spin 16s linear infinite;
        }
        .prod-spin-ring {
          animation: prod-spin 40s linear infinite reverse;
        }
        .prod-float-blob {
          animation: prod-float 7s ease-in-out infinite;
        }
        .prod-mq-mask {
          -webkit-mask: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
          mask: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
        }
        .prod-mq-track {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: prod-mq 50s linear infinite;
        }
        .prod-logo-track {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: prod-mq-logo 35s linear infinite reverse;
        }
        .prod-mq-mask:hover .prod-mq-track,
        .prod-mq-mask:hover .prod-logo-track {
          animation-play-state: paused;
        }
        .prod-doc-img {
          transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .prod-doc-card:hover .prod-doc-img {
          transform: scale(1.05);
        }
        .prod-logo-img {
          transition: filter 350ms cubic-bezier(0.22, 1, 0.36, 1), opacity 350ms cubic-bezier(0.22, 1, 0.36, 1), transform 350ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .prod-logo-img:hover {
          filter: none;
          opacity: 1;
          transform: translateY(-3px);
        }
        .prod-flow-bg {
          background: radial-gradient(70% 60% at 50% 0%, #FFE9CC 0%, rgba(255, 233, 204, 0) 70%), linear-gradient(180deg, #FFF8EF 0%, #FBF4EC 100%);
        }
        .prod-step-card {
          transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 400ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .prod-step-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 2px 4px rgba(60, 35, 10, 0.04), 0 18px 40px -14px rgba(60, 35, 10, 0.18);
        }
        .prod-step-title {
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
          font-weight: 600 !important;
        }
        details.prod-faq summary {
          list-style: none;
        }
        details.prod-faq summary::-webkit-details-marker {
          display: none;
        }
        details.prod-faq[open] .prod-faq-icon {
          background-color: #F39200;
          color: #212120;
          border-color: #F39200;
          transform: rotate(45deg);
        }
        @media (prefers-reduced-motion: reduce) {
          .prod-tile,
          .prod-tile-img,
          .prod-tile-go,
          .prod-doc-img,
          .prod-logo-img,
          .prod-step-card,
          .prod-btn-p,
          .prod-faq-icon {
            transition: none !important;
          }
          .prod-spin-slow,
          .prod-spin-ring,
          .prod-float-blob,
          .prod-mq-track,
          .prod-logo-track {
            animation: none !important;
          }
          .prod-card:hover .prod-tile,
          .prod-card:hover .prod-tile-img,
          .prod-doc-card:hover .prod-doc-img,
          .prod-logo-img:hover,
          .prod-step-card:hover,
          .prod-btn-p:hover {
            transform: none !important;
          }
        }
      `}</style>

      {/* 1) HERO */}
      <section
        aria-label="Rangkaian produk maklon kosmetik Dreamlab"
        className="relative w-full min-h-0 lg:min-h-[620px] flex items-center overflow-hidden bg-[#EAF2FA] pt-[32px] pb-0 sm:pt-[56px] lg:py-[88px] lg:pt-[56px]"
      >
        <Image
          src="/assets/images/hero/hero-03.jpg"
          alt="Rangkaian produk maklon kosmetik Dreamlab"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_bottom] max-lg:!top-auto max-lg:!h-[46%] max-lg:sm:!h-[62%] lg:object-[70%_center]"
        />
        <div aria-hidden="true" className="prod-hero-overlay absolute inset-0 z-10 pointer-events-none" />

        <div className="relative z-20 mx-auto w-full max-w-[1240px] px-[16px] sm:px-[40px]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-[24px] lg:gap-[64px] items-center">
            {/* Left Column */}
            <div>
              <nav aria-label="Breadcrumb" className="text-[12px] text-[#9A958F] mb-[20px] flex items-center gap-1.5">
                <Link href="/" className="prod-focus hover:text-[#212120] transition-colors">
                  Beranda
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-[#6B6762]">Katalog Produk</span>
              </nav>

              <h1 className="font-display text-[clamp(38px,4.6vw,60px)] font-normal leading-[1.05] tracking-[-0.02em] text-[#212120]">
                Katalog Produk <span className="text-[#F39200]">Maklon</span> Dreamlab
              </h1>

              <p className="mt-[20px] text-[16.5px] sm:text-[19px] leading-[1.55] text-[#6B6762] max-w-[470px]">
                Pilih produknya, kami racik formula eksklusif untuk brand Anda. Lengkap dengan BPOM, Halal, dan desain kemasan.
              </p>

              <ul className="mt-[22px] flex flex-wrap gap-x-[16px] sm:gap-x-[22px] gap-y-[8px]">
                {["1 Client = 1 Formula", "MOQ fleksibel", "Siap jual 2–3 bulan"].map((usp) => (
                  <li key={usp} className="inline-flex items-center gap-[8px] text-[13px] sm:text-[14px] font-medium text-[#212120]">
                    <span
                      aria-hidden="true"
                      className="size-[18px] rounded-full bg-[#FFF3E2] flex items-center justify-center shrink-0"
                    >
                      <svg className="size-[11px]" viewBox="0 0 24 24" fill="none" stroke="#C86400" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    </span>
                    <span>{usp}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-[32px] flex items-center gap-[12px]">
                <Link
                  href="/thankyou/google/?source=produk-hero"
                  rel="nofollow"
                  className="prod-focus prod-btn-p flex-1 sm:flex-none whitespace-nowrap text-center rounded-full bg-[#F39200] text-[#212120] text-[13.5px] sm:text-[15px] font-semibold px-[12px] sm:px-[28px] py-[13px] sm:py-[16px] shadow-[0_10px_24px_-10px_rgba(243,146,0,0.7)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_14px_28px_-10px_rgba(243,146,0,0.8)]"
                >
                  Konsultasi Gratis →
                </Link>
                <a
                  href="#katalog"
                  className="prod-focus flex-1 sm:flex-none whitespace-nowrap text-center rounded-full bg-white text-[#212120] border border-[rgba(33,33,32,0.10)] hover:border-[#212120] text-[13.5px] sm:text-[15px] font-semibold px-[12px] sm:px-[28px] py-[13px] sm:py-[16px] transition-colors"
                >
                  Lihat Katalog
                </a>
              </div>

              <div className="mt-[36px] pt-[24px] border-t border-[rgba(33,33,32,0.10)] max-w-[470px] flex items-center gap-[16px]">
                <Image
                  src="/images/certifications/bpom.png"
                  alt="Sertifikasi BPOM RI"
                  width={90}
                  height={30}
                  priority
                  className="h-[26px] sm:h-[30px] w-auto object-contain"
                />
                <Image
                  src="/images/certifications/halal.png"
                  alt="Sertifikasi Halal MUI"
                  width={90}
                  height={30}
                  priority
                  className="h-[26px] sm:h-[30px] w-auto object-contain"
                />
                <Image
                  src="/images/certifications/cpkb.png"
                  alt="Sertifikasi CPKB Grade A"
                  width={90}
                  height={30}
                  priority
                  className="h-[26px] sm:h-[30px] w-auto object-contain"
                />
                <Image
                  src="/images/certifications/hki.png"
                  alt="Terdaftar HKI"
                  width={110}
                  height={30}
                  priority
                  className="h-[26px] sm:h-[30px] w-auto object-contain"
                />
              </div>
            </div>

            {/* Right Column: spacer over photo with 2 glass stat chips */}
            <div className="relative min-h-[300px] sm:min-h-[340px] lg:min-h-[420px] self-stretch">
              <div className="absolute left-0 bottom-[24px] lg:left-[8%] lg:top-[6%] lg:bottom-auto flex items-center gap-[12px] rounded-[16px] bg-[rgba(255,255,255,0.96)] supports-[backdrop-filter]:bg-[rgba(255,255,255,0.92)] backdrop-blur-[12px] px-[12px] py-[10px] sm:px-[18px] sm:py-[14px] shadow-[0_12px_30px_-12px_rgba(60,35,10,0.3)]">
                <b className="font-display font-normal text-[22px] lg:text-[30px] text-[#C86400] leading-none">
                  1000+
                </b>
                <span className="text-[10.5px] lg:text-[12px] leading-[1.35] text-[#6B6762]">
                  brand telah
                  <br />
                  bekerja sama
                </span>
              </div>

              <div className="absolute right-0 bottom-[24px] lg:bottom-[4%] flex items-center gap-[12px] rounded-[16px] bg-[rgba(255,255,255,0.96)] supports-[backdrop-filter]:bg-[rgba(255,255,255,0.92)] backdrop-blur-[12px] px-[12px] py-[10px] sm:px-[18px] sm:py-[14px] shadow-[0_12px_30px_-12px_rgba(60,35,10,0.3)]">
                <b className="font-display font-normal text-[22px] lg:text-[30px] text-[#C86400] leading-none">
                  7
                </b>
                <span className="text-[10.5px] lg:text-[12px] leading-[1.35] text-[#6B6762]">
                  kategori produk
                  <br />
                  dalam satu pabrik
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2) KATALOG */}
      <section id="katalog" className="bg-white pt-[56px] sm:pt-[72px] pb-[64px] sm:pb-[104px]">
        <div className="mx-auto max-w-[1240px] px-[16px] sm:px-[40px]">
          <div className="text-center max-w-[680px] mx-auto mb-[32px] sm:mb-[48px]">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C86400] mb-[12px]">
              Katalog Layanan Maklon Premium
            </span>
            <h2 className="font-display font-normal text-[clamp(28px,3.2vw,40px)] leading-[1.12] tracking-[-0.01em] text-[#212120]">
              Kategori Produk Maklon &amp; Spesialisasi Formula
            </h2>
            <p className="mt-[14px] text-[15px] sm:text-[16px] leading-[1.6] text-[#6B6762]">
              7 kategori dalam satu pabrik CPKB Grade A di Surabaya. Pilih kategorinya, tim R&amp;D Dreamlab meracik formula khusus untuk brand Anda.
            </p>
          </div>

          <nav
            aria-label="Kategori"
            className="prod-tabs -mx-[16px] px-[16px] sm:mx-0 sm:px-0 flex justify-start lg:justify-center gap-[22px] sm:gap-[28px] overflow-x-auto border-b border-[rgba(33,33,32,0.10)] mb-[28px] sm:mb-[40px]"
          >
            {catalogTabs.map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                className={`prod-focus relative shrink-0 text-[13px] font-medium uppercase tracking-[0.04em] pb-[14px] pr-[10px] whitespace-nowrap transition-colors ${
                  tab.active
                    ? "text-[#212120] after:content-[''] after:absolute after:left-0 after:right-[10px] after:bottom-0 after:h-[2px] after:bg-[#F39200]"
                    : "text-[#6B6762] hover:text-[#212120]"
                }`}
              >
                {tab.label}
                <sup className="ml-0.5 text-[9.5px] font-normal text-[#9A958F]">
                  {tab.sup}
                </sup>
              </Link>
            ))}
          </nav>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[12px] gap-y-[28px] sm:gap-x-[24px] sm:gap-y-[40px]">
            {catalogCategories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                aria-label={`Lihat katalog maklon ${cat.name}`}
                className="prod-card prod-focus block"
              >
                <span className="prod-tile block relative aspect-[4/5] bg-[#F2EEE9] rounded-[12px] sm:rounded-[16px] overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width:640px) 46vw, (max-width:1024px) 30vw, 280px"
                    className="prod-tile-img object-cover object-center"
                  />
                  <span className="absolute left-[8px] top-[8px] sm:left-[12px] sm:top-[12px] rounded-full bg-[rgba(255,255,255,0.95)] supports-[backdrop-filter]:bg-[rgba(255,255,255,0.9)] backdrop-blur-[8px] px-[8px] py-[4px] sm:px-[10px] sm:py-[5px] text-[9.5px] sm:text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#C86400]">
                    {cat.tag}
                  </span>
                  <span
                    aria-hidden="true"
                    className="prod-tile-go absolute right-[8px] bottom-[8px] sm:right-[12px] sm:bottom-[12px] size-[32px] sm:size-[38px] rounded-full bg-white grid place-items-center text-[15px] text-[#212120] opacity-100 sm:opacity-0 sm:translate-y-[6px]"
                  >
                    →
                  </span>
                </span>
                <h3 className="mt-[12px] sm:mt-[16px] font-display font-normal text-[15px] sm:text-[19px] leading-[1.2] text-[#212120]">
                  {cat.name}
                </h3>
                <p className="hidden sm:block mt-[6px] text-[13px] leading-[1.55] text-[#6B6762]">
                  {cat.variants}
                </p>
              </Link>
            ))}

            {/* 8th slot CTA tile */}
            <div className="col-span-2 lg:col-span-1 flex flex-col justify-between gap-[20px] lg:gap-0 rounded-[16px] border border-[#FBE3C2] bg-[linear-gradient(180deg,#FFF4E5_0%,#FFFFFF_100%)] p-[22px] sm:p-[28px] lg:aspect-[4/5]">
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C86400]">
                  Formula Custom
                </span>
                <h3 className="mt-[12px] font-display font-normal text-[24px] leading-[1.2] text-[#212120]">
                  Belum menemukan kategori yang pas?
                </h3>
                <p className="mt-[10px] text-[13.5px] leading-[1.6] text-[#6B6762]">
                  Tim R&amp;D kami bisa mengembangkan formula baru sesuai konsep, target pasar, dan modal brand Anda.
                </p>
              </div>
              <Link
                href="/thankyou/google/?source=produk-katalog-cta"
                rel="nofollow"
                className="prod-focus prod-btn-p self-start rounded-full bg-[#F39200] text-[#212120] text-[13px] font-semibold px-[18px] py-[12px] shadow-[0_10px_24px_-10px_rgba(243,146,0,0.7)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_14px_28px_-10px_rgba(243,146,0,0.8)]"
              >
                Konsultasi Gratis →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3) TENTANG DREAMLAB */}
      <DreamlabIntroSection ctaHref="/thankyou/google/?source=produk-tentang" />

      {/* 4) BRAND MEREKA DIMULAI DARI SINI */}
      <DreamlabDocumentationSection showLogos />

      {/* 5) ALUR MAKLON */}
      <section className="prod-flow-bg py-[64px] sm:py-[104px]">
        <div className="mx-auto max-w-[1240px] px-[16px] sm:px-[40px]">
          <div className="text-center max-w-[680px] mx-auto mb-[32px] sm:mb-[48px]">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C86400] mb-[12px]">
              Dari Ide ke Produk Siap Jual
            </span>
            <h2 className="font-display font-normal text-[clamp(28px,3.2vw,40px)] leading-[1.12] tracking-[-0.01em] text-[#212120]">
              Alur Maklon di Dreamlab
            </h2>
            <p className="mt-[14px] text-[15px] sm:text-[16px] leading-[1.6] text-[#6B6762]">
              Lima tahap terstruktur, didampingi tim Dreamlab dari konsultasi sampai produk sampai di gudang Anda.
            </p>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[12px] sm:gap-[16px]">
            {maklonSteps.map((item, idx) => (
              <li
                key={item.step}
                className={`prod-step-card grid grid-cols-[40px_1fr] sm:block gap-x-[16px] rounded-[18px] bg-[rgba(255,255,255,0.92)] supports-[backdrop-filter]:bg-[rgba(255,255,255,0.82)] backdrop-blur-[10px] border border-[rgba(255,255,255,0.9)] p-[20px] sm:px-[22px] sm:py-[26px] shadow-[0_6px_18px_-10px_rgba(60,35,10,0.18)] ${
                  idx === maklonSteps.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <span
                  aria-hidden="true"
                  className="row-span-2 sm:row-span-1 grid place-items-center size-[40px] rounded-full bg-[#FFF3E2] text-[#C86400] font-semibold text-[13px]"
                >
                  {item.step}
                </span>
                <h3 className="prod-step-title sm:mt-[18px] text-[16px] leading-[1.35] text-[#212120]">
                  {item.title}
                </h3>
                <p className="mt-[8px] text-[13.5px] leading-[1.6] text-[#6B6762]">
                  {item.detail}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-[48px] flex flex-col sm:flex-row justify-center items-center gap-[18px] sm:gap-[24px]">
            <Link
              href="/thankyou/google/?source=produk-alur"
              rel="nofollow"
              className="prod-focus prod-btn-p w-full sm:w-auto text-center rounded-full bg-[#F39200] text-[#212120] text-[15px] font-semibold px-[28px] py-[16px] shadow-[0_10px_24px_-10px_rgba(243,146,0,0.7)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_14px_28px_-10px_rgba(243,146,0,0.8)]"
            >
              Mulai Konsultasi Gratis →
            </Link>
            <Link
              href="/about-us/alur-maklon/"
              className="prod-focus text-[14px] font-medium text-[#212120] border-b border-[#F39200] pb-[2px] hover:text-[#C86400] transition-colors"
            >
              Pelajari alur maklon lengkap →
            </Link>
          </div>
        </div>
      </section>

      {/* 6) FAQ */}
      <section className="bg-white py-[64px] sm:py-[104px]">
        <div className="mx-auto max-w-[1240px] px-[16px] sm:px-[40px]">
          <div className="text-center max-w-[680px] mx-auto mb-[32px] sm:mb-[48px]">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C86400] mb-[12px]">
              FAQ
            </span>
            <h2 className="font-display font-normal text-[clamp(28px,3.2vw,40px)] leading-[1.12] tracking-[-0.01em] text-[#212120]">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p className="mt-[14px] text-[15px] sm:text-[16px] leading-[1.6] text-[#6B6762]">
              Jawaban singkat seputar maklon kosmetik di Dreamlab untuk beautypreneur.
            </p>
          </div>

          <div className="max-w-[820px] mx-auto">
            {produkFaqs.map((faq, idx) => (
              <details
                key={faq.question}
                open={idx === 0}
                className={`prod-faq border-b border-[rgba(33,33,32,0.10)] ${
                  idx === 0 ? "border-t" : ""
                }`}
              >
                <summary className="cursor-pointer flex items-center justify-between gap-[24px] py-[24px] text-[15px] sm:text-[16px] font-medium leading-[1.45] text-[#212120]">
                  <span>{faq.question}</span>
                  <span
                    aria-hidden="true"
                    className="prod-faq-icon shrink-0 size-[28px] rounded-full border border-[rgba(33,33,32,0.10)] grid place-items-center text-[16px] font-normal transition-all duration-300"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-[24px] pr-0 sm:pr-[52px] text-[14.5px] leading-[1.75] text-[#6B6762]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="text-center mt-[40px] text-[14px] text-[#6B6762]">
            Belum menemukan jawabannya?{" "}
            <Link
              href="/thankyou/google/?source=produk-faq"
              rel="nofollow"
              className="prod-focus text-[14px] font-medium text-[#212120] border-b border-[#F39200] pb-[2px] hover:text-[#C86400] transition-colors"
            >
              Chat Tim Dreamlab →
            </Link>
            <div className="flex justify-center flex-wrap gap-x-[24px] gap-y-[8px] mt-[14px]">
              <Link
                href="/panduan/"
                className="prod-focus text-[14px] font-medium text-[#212120] border-b border-[#F39200] pb-[2px] hover:text-[#C86400] transition-colors"
              >
                Panduan maklon
              </Link>
              <Link
                href="/services/"
                className="prod-focus text-[14px] font-medium text-[#212120] border-b border-[#F39200] pb-[2px] hover:text-[#C86400] transition-colors"
              >
                Layanan maklon kosmetik
              </Link>
              <Link
                href="/contact-us/"
                className="prod-focus text-[14px] font-medium text-[#212120] border-b border-[#F39200] pb-[2px] hover:text-[#C86400] transition-colors"
              >
                Kontak Dreamlab
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA (unchanged) */}
      <CtaSection
        title="Wujudkan Brand Kosmetik Impian Anda dalam 3 Bulan"
        subtitle="Konsultasi gratis dengan tim Dreamlab untuk produk maklon Anda."
      />
    </div>
  );
}
