"use client";

import { ProductCategoryV2, ProductVariantV2 } from "@/types/product-v2";
import Image from "next/image";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { productImageAlt, productImageTitle } from "@/lib/image-utils";
import { getCardImagePath } from "@/data/product-card-images";
import Link from "next/link";

interface ProductHeroProps {
  categoryData: ProductCategoryV2;
  productData?: ProductVariantV2;
  subCategorySlug?: string;
}

interface HeroContent {
  headline: React.ReactNode;
  description: string;
  image: string;
  mobileImage: string;
  showTrustBar: boolean;
  microCTA: string | null;
  smallTitle?: string;
  ctaText?: string;
}

// ─── Vivid background colors for individual product page hero sections ───
const vividCategoryColors: Record<string, string> = {
  skincare: "#F1D2A6",
  babycare: "#B3D6E4",
  bodycare: "#D7C7B2",
  haircare: "#C4B8A1",
  parfum: "#E2BC86",
  decorative: "#F1D8B1",
  footcare: "#D7C7B2",
  pkrt: "#A3C6DA",
};

export const getProductCardImagePath = (slug: string, categorySlug: string): string | null => {
  return getCardImagePath(slug, categorySlug);
};

export default function ProductHero({ categoryData, productData, subCategorySlug }: ProductHeroProps) {
  const isProductPage = !!productData;
  const isSubCategoryPage = !!subCategorySlug && !isProductPage;
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const title = isProductPage ? productData.name : (isSubCategoryPage ? categoryData.name : categoryData.name);
  const isLightBg = true; // All categories now use soft, light editorial backgrounds matching the visual images

  const getHeroContent = (): HeroContent => {
    // 1. Special case for Parfum Category (legacy support or specific marketing needs)
    if (categoryData.slug === 'parfum') {
      return {
        headline: <>Jasa Maklon <br /> {title} <span className="text-brand-orange">Premium</span> <br /> BPOM & Halal</>,
        description: "Ingin punya brand parfum sendiri? Dreamlab adalah solusi Anda untuk mengembangkan rangkaian wewangian — dari body mist, eau de cologne, eau de toilette, eau de parfum, hingga extrait de parfum — dengan aroma custom khas brand Anda.",
        image: "/new asset/background-visual-hero-section/parfum.webp",
        mobileImage: "/new asset/background-visual-hero-section/parfum.webp",
        ctaText: "FREE KONSULTASI BISNIS",
        showTrustBar: false,
        microCTA: null
      };
    }

    // 2. Special case for Haircare Category
    if (categoryData.slug === 'haircare') {
      return {
        headline: <>Jasa Maklon <br /> {title} <span className="text-brand-orange">Premium</span> <br /> BPOM & Halal</>,
        description: isProductPage ? productData.shortDescription : (categoryData.tagline || categoryData.description),
        image: "/new asset/background-visual-hero-section/haircare.webp",
        mobileImage: "/new asset/background-visual-hero-section/haircare.webp",
        ctaText: "FREE KONSULTASI BISNIS",
        showTrustBar: false,
        microCTA: null
      };
    }

    // 2. Default Dynamic Logic for Skincare and other categories
    // Use lands/ports pattern for responsive hero images
    
    // Mapping from product slug to card number based on actual files in public/assets/produk/
    const slugToCardMap: Record<string, Record<string, string>> = {
      skincare: {
        "facial-moisturizer": "1",
        "facial-sunscreen": "3",
        "micellar-cleansing-gel": "4",
        "facial-wash": "5",
        "facial-toner": "6",
        "facial-serum": "7",
      },
      bodycare: {
        "massage-oil": "1",
        "body-butter": "2",
        "body-scrub": "3",
        "body-wash": "7",
        "body-lotion": "6",
        "body-oil": "9",
      },
      haircare: {
        "shampoo": "4",
        "hair-mask": "5",
        "hair-serum": "1",
        "hair-tonic": "3",
      },
      babycare: {
        "baby-wash": "1",
        "baby-shampoo": "2",
        "baby-lotion": "3",
        "baby-powder": "4",
        "baby-cologne": "5",
      },
      decorative: {
        "lip-matte": "3",
        "lip-gloss": "5",
        "liquid-foundation": "4",
        "cushion-foundation": "7",
        "loose-powder": "9",
      },
      parfum: {
        "body-mist": "1",
        "eau-de-cologne": "3",
        "eau-de-toilette": "2",
        "eau-de-parfum": "1",
        "minyak-atsiri": "5",
        "extrait-de-parfum": "4",
      },
      pkrt: {
        "hand-sanitizer": "1",
        "hand-wash": "2",
        "disinfectant-spray": "3",
        "floor-cleaner": "4",
        "room-spray": "3",
        "bar-soap-pkrt": "4",
      },
      footcare: {
        "foot-cream": "3",
        "foot-mask": "2",
        "foot-scrub": "5",
        "foot-soak": "4",
      },
    };

    const getCategoryHeroImage = (slug: string, isMobile: boolean, fallbackImage: string) => {
      const heroMap: Record<string, { lands: string; ports: string }> = {
        babycare: { lands: "new asset/background-visual-hero-section/babycare.webp", ports: "new asset/background-visual-hero-section/babycare.webp" },
        bodycare: { lands: "new asset/background-visual-hero-section/bodycare.webp", ports: "new asset/background-visual-hero-section/bodycare.webp" },
        decorative: { lands: "new asset/background-visual-hero-section/decorative.webp", ports: "new asset/background-visual-hero-section/decorative.webp" },
        haircare: { lands: "new asset/background-visual-hero-section/haircare.webp", ports: "new asset/background-visual-hero-section/haircare.webp" },
        pkrt: { lands: "new asset/background-visual-hero-section/pkrt.webp", ports: "new asset/background-visual-hero-section/pkrt.webp" },
        skincare: { lands: "new asset/background-visual-hero-section/skincare.webp", ports: "new asset/background-visual-hero-section/skincare.webp" },
        parfum: { lands: "new asset/background-visual-hero-section/parfum.webp", ports: "new asset/background-visual-hero-section/parfum.webp" },
        footcare: { lands: "new asset/background-visual-hero-section/bodycare.webp", ports: "new asset/background-visual-hero-section/bodycare.webp" },
      };

      const hero = heroMap[slug];
      if (hero) {
        return `/${isMobile ? hero.ports : hero.lands}`;
      }

      return fallbackImage;
    };

    const getProductHeroImage = (product: ProductVariantV2, isMobile: boolean) => {
      // Use mapping to get correct card number based on slug
      const categoryMap = slugToCardMap[categoryData.slug] || {};
      const productNum = categoryMap[product.slug] || "1";
      const basePath = categoryData.heroImage.replace(/\/[^\/]+$/, '');

      // Known bg-hero file patterns per category (based on actual files in public/assets/produk/)
      const bgHeroMap: Record<string, { lands: (n: string) => string; ports: (n: string) => string }> = {
        skincare: {
          lands: (n) => `bg-lands-card${n}.jpeg`,
          ports: (n) => Number(n) <= 2 ? `bg-port-card${n}.jpeg` : `bg-ports-card${n}.jpeg`,
        },
        bodycare: {
          lands: (n) => n === "15" ? `bg-landscard${n}.jpeg` : `bg-lands-card${n}.jpeg`,
          ports: (n) => n === "2" ? `bg-prots-card${n}.jpeg` : (n === "7" ? `bg-portss-card${n}.jpeg` : `bg-ports-card${n}.jpeg`),
        },
        haircare: {
          lands: (n) => n === "4" ? `bg-lnads-card${n}.jpeg` : `bg-lands-card${n}.jpeg`,
          ports: (n) => `bg-ports-card${n}.jpeg`,
        },
        babycare: {
          lands: (n) => `bg-lands-card${n}.jpeg`,
          ports: (n) => n === "1" ? `bg-ports-carfd1.webp` : `bg-ports-card${n}.jpeg`,
        },
        decorative: {
          lands: (n) => n === "2" ? `bg-landscard${n}.jpeg` : (n === "8" ? `bg-landscard${n}.jpeg` : `bg-lands-card${n}.jpeg`),
          ports: (n) => n === "8" ? `bg-portss-card${n}.jpeg` : `bg-ports-card${n}.jpeg`,
        },
        footcare: {
          lands: (n) => `bg-lands-card${n}.jpeg`,
          ports: (n) => Number(n) <= 4 ? `bg-port-card${n}.jpeg` : `bg-ports-card${n}.jpeg`,
        },
        pkrt: {
          lands: (n) => n === "4" ? `bg-landss-card${n}.jpeg` : `bg-lands-card${n}.jpeg`,
          ports: (n) => `bg-ports-card${n}.jpeg`,
        },
        parfum: {
          // Parfum uses special naming like bg-edp.webp, bg-cologne.webp
          lands: (n) => `bg-lands-card${n}.jpeg`,
          ports: (n) => `bg-ports-card${n}.jpeg`,
        },
      };

      const bgHero = bgHeroMap[categoryData.slug];
      if (bgHero) {
        const filename = isMobile ? bgHero.ports(productNum) : bgHero.lands(productNum);
        return `${basePath}/${filename}`;
      }

      // Default fallback
      if (isMobile) {
        return `${basePath}/bg-ports-card${productNum}.jpeg`;
      }
      return `${basePath}/bg-lands-card${productNum}.jpeg`;
    };

    if (isProductPage && productData) {
      const categorySlug = categoryData.slug;
      const productSlug = productData.slug;

      const productCopyMap: Record<string, Record<string, { smallTitle: string; headline: string | React.ReactNode; description: string }>> = {
        skincare: {
          "facial-serum": {
            smallTitle: "KATALOG MAKLON SERUM WAJAH / FACIAL SERUM",
            headline: "Jasa Maklon Serum Wajah (Facial Serum) BPOM & Halal Terlengkap",
            description: "Jasa maklon serum wajah terlengkap di Indonesia. Semua serum bisa diformulasikan custom sesuai konsep brand Anda. Diproduksi dengan standar kualitas tinggi, legalitas BPOM, dan sertifikasi Halal oleh Dreamlab."
          },
          "facial-toner": {
            smallTitle: "KATALOG MAKLON TONER WAJAH / FACIAL TONER",
            headline: "Jasa Maklon Toner Wajah (Facial Toner) BPOM & Halal Terlengkap",
            description: "Ingin punya brand facial toner sendiri? Dreamlab adalah solusi Anda untuk mengembangkan facial toner — hydrating, exfoliating, brightening, hingga calming — dengan formula pH seimbang yang menyegarkan dan mempersiapkan kulit untuk menyerap skincare berikutnya."
          },
          "facial-wash": {
            smallTitle: "KATALOG MAKLON SABUN WAJAH / FACIAL WASH",
            headline: "Jasa Maklon Sabun Wajah (Facial Wash) BPOM & Halal Terlengkap",
            description: "Jasa maklon sabun wajah dan facial wash dengan custom formula sesuai kebutuhan brand skincare Anda. Diproduksi dengan standar kualitas tinggi, legalitas BPOM, dan sertifikasi Halal."
          },
          "micellar-cleansing-gel": {
            smallTitle: "KATALOG MAKLON PEMBERSIH WAJAH / MICELLAR CLEANSING GEL",
            headline: "Jasa Maklon Cleansing BPOM & Halal Terlengkap",
            description: "Ingin punya brand cleansing series sendiri? Dreamlab adalah solusi Anda untuk mengembangkan rangkaian pembersih wajah — cleansing oil, cleansing balm, micellar water, milk cleanser, hingga makeup remover — dengan formula mild dan non-irritasi untuk sistem double cleanse yang sempurna."
          },
          "facial-sunscreen": {
            smallTitle: "KATALOG MAKLON TABIR SURYA / FACIAL SUNSCREEN",
            headline: "Jasa Maklon Sunscreen Wajah (Facial Sunscreen) BPOM & Halal Terlengkap",
            description: "Jasa maklon sunscreen terlengkap di Indonesia. Semua sunscreen bisa diformulasikan custom sesuai konsep brand Anda. Dengan bersertifikat CPKB Grade A, BPOM RI, dan Halal MUI."
          },
          "facial-moisturizer": {
            smallTitle: "MAKLON CREAM WAJAH PREMIUM / MOISTURIZER",
            headline: "Jasa Maklon Day Cream & Night Cream BPOM dan Halal",
            description: "Ingin punya brand day cream & night cream sendiri? Dreamlab adalah solusi Anda untuk mengembangkan face cream — day cream SPF, night cream repair, anti-aging, hingga brightening — dengan formula terpisah untuk kebutuhan kulit di siang dan malam hari."
          },
          "acne-cream": {
            smallTitle: "KATALOG MAKLON KRIM JERAWAT / ACNE CREAM",
            headline: "Jasa Maklon Krim Jerawat BPOM & Halal Terlengkap",
            description: "Jasa maklon acne cream terlengkap di Indonesia. Dari benzoil peroksida hingga tea tree oil — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk mengatasi jerawat ringan hingga sedang."
          },
          "moisturizing-cream": {
            smallTitle: "KATALOG MAKLON MOISTURIZING CREAM",
            headline: "Jasa Maklon Moisturizing Cream BPOM & Halal Terlengkap",
            description: "Jasa maklon moisturizing cream terlengkap di Indonesia. Dari gel-based hingga cream-based — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk hidrasi mendalam dan menjaga skin barrier."
          },
          "brightening-cream": {
            smallTitle: "KATALOG MAKLON KRIM PENCERAH / BRIGHTENING CREAM",
            headline: "Jasa Maklon Brightening Cream BPOM & Halal Terlengelap",
            description: "Jasa maklon brightening cream terlengkap di Indonesia. Dari niacinamide hingga alpha arbutin — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk kulit cerah merata dan bercahaya."
          },
          "eye-cream": {
            smallTitle: "KATALOG MAKLON EYE CREAM",
            headline: "Jasa Maklon Eye Cream BPOM & Halal Terlengelap",
            description: "Jasa maklon eye cream terlengkap di Indonesia. Diformulasikan untuk mengatasi mata panda, kantung mata, dan garis halus di area mata. Semua bisa dikustomisasi sesuai konsep brand Anda."
          }
        },
        bodycare: {
          "body-lotion": {
            smallTitle: "KATALOG MAKLON BODY LOTION / PELEMBAB TUBUH",
            headline: "Jasa Maklon Body Lotion & Body Serum BPOM & Halal Terlengkap",
            description: "Hadirkan body lotion berkinerja tinggi dengan efek mencerahkan (instant bright), menghidrasi dalam, atau wangi parfum mewah tahan lama. Dreamlab membantu kustomisasi formula lotion premium yang cepat menyerap tanpa lengket."
          },
          "body-wash": {
            smallTitle: "KATALOG MAKLON SABUN MANDI / BODY WASH",
            headline: "Jasa Maklon Sabun Mandi (Body Wash) BPOM & Halal Terlengkap",
            description: "Ingin punya brand sabun mandi sendiri? Dreamlab adalah solusi Anda untuk mengembangkan body wash — shower gel, cream wash, foaming wash, hingga antiseptic wash — dengan formula pH seimbang, keharuman premium, dan busa mewah melimpah."
          },
          "body-butter": {
            smallTitle: "KATALOG MAKLON BODY BUTTER / PELEMBAB INTENSIF",
            headline: "Jasa Maklon Body Butter Premium BPOM & Halal Terlengkap",
            description: "Jasa maklon body butter terlengkap di Indonesia. Anda dapat custom formula dengan tekstur rich dan melembapkan sesuai konsep brand Anda. Lebih dari 1.000 produk telah dikembangkan di fasilitas bersertifikat CPKB Grade A, berizin BPOM RI dan Halal MUI."
          },
          "body-scrub": {
            smallTitle: "KATALOG MAKLON LULUR TUBUH / BODY SCRUB",
            headline: "Jasa Maklon Lulur Badan (Body Scrub) BPOM & Halal Terlengkap",
            description: "Ciptakan produk lulur tradisional maupun body scrub modern berbutir halus yang efektif mengangkat sel kulit mati tanpa iritasi. Dreamlab menghadirkan formula eksfoliasi tubuh beraroma relaksasi premium."
          },
          "massage-oil": {
            smallTitle: "KATALOG MAKLON MINYAK PIJAT / MASSAGE OIL",
            headline: "Jasa Maklon Massage Oil Premium BPOM & Halal Terlengkap",
            description: "Jasa maklon massage oil terlengkap di Indonesia. Dari relaxing oil, aromatherapy oil, hingga herbal massage oil — semua bisa diformulasikan custom sesuai konsep brand Anda."
          },
          "body-oil": {
            smallTitle: "KATALOG MAKLON MINYAK TUBUH / BODY OIL",
            headline: "Jasa Maklon Body Oil Premium BPOM & Halal Terlengkap",
            description: "Hadirkan tren body oil mewah dengan kilau alami (glowing effect) yang mengunci kelembapan kulit sepanjang hari. Diformulasikan super ringan agar cepat menyerap dan meninggalkan wangi aromatik yang menenangkan."
          },
          "anti-bacterial-soap": {
            smallTitle: "KATALOG MAKLON SABUN ANTIBAKTERI",
            headline: "Jasa Maklon Sabun Antibakteri BPOM & Halal",
            description: "Anda ingin memiliki brand sabun antibakterial? Dreamlab siap membantu memformulasikan brand Anda sendiri dengan konsultasi langsung bersama Business Consultant kami. Lebih dari 1.000 produk telah dikembangkan di fasilitas bersertifikat CPKB Grade A, berizin BPOM RI dan Halal MUI."
          },
          "shower-gel": {
            smallTitle: "KATALOG MAKLON SHOWER GEL",
            headline: "Jasa Maklon Shower Gel BPOM dan Halal",
            description: "Ingin punya brand shower gel sendiri? Dreamlab adalah solusi Anda untuk mengembangkan shower gel dengan tekstur lembut, busa melimpah, dan aroma khas yang menjadikan mandi momen self-care."
          },
          "bath-salt": {
            smallTitle: "KATALOG MAKLON BATH SALT",
            headline: "Jasa Maklon Bath Salt BPOM dan Halal",
            description: "Anda ingin memiliki brand bath salt yang relaxing, aromatherapy, hingga detox yang mengubah waktu mandi menjadi ritual relaksasi. Wujudkan Brand anda bersama Dreamlab sekarang!"
          },
          "organic-soap": {
            smallTitle: "KATALOG MAKLON SABUN ORGANIK",
            headline: "Jasa Maklon Sabun Organik BPOM dan Halal",
            description: "Ingin punya brand sabun organik? Dreamlab solusi Anda untuk mengembangkan produk berbahan alami berbahan natural essential oil, hingga susu untuk brand yang mengusung konsep clean beauty."
          },
          "body-serum": {
            smallTitle: "KATALOG MAKLON BODY SERUM",
            headline: "Jasa Maklon Body Serum BPOM dan Halal",
            description: "Dreamlab memproduksi maklon body serum brightening, firming, hingga glowing dengan bahan aktif konsentrasi tinggi. Wujudkan Brand anda bersama Dreamlab sekarang!"
          },
          "transparent-soap": {
            smallTitle: "KATALOG MAKLON SABUN TRANSPARAN",
            headline: "Jasa Maklon Sabun Transparan BPOM dan Halal",
            description: "Ingin punya brand sabun transparan sendiri? Dreamlab adalah solusi Anda untuk mengembangkan sabun transparan yang lembut di kulit dan berkesan premium."
          },
          "underarm-cream": {
            smallTitle: "KATALOG MAKLON UNDERARM CREAM",
            headline: "Jasa Maklon Underarm Cream BPOM dan Halal",
            description: "Ingin punya brand underarm cream sendiri? Dreamlab adalah solusi Anda untuk mengembangkan krim perawatan ketiak yang mencerahkan, melembapkan, dan menjaga kesegaran area ketiak."
          },
          "whitening-soap": {
            smallTitle: "KATALOG MAKLON SABUN WHITENING",
            headline: "Jasa Maklon Sabun Whitening BPOM dan Halal",
            description: "Ingin punya brand sabun whitening sendiri? Dreamlab adalah solusi Anda untuk mengembangkan sabun pencerah — batang maupun cair — dengan bahan aktif yang aman dan teruji."
          },
          "bar-soap": {
            smallTitle: "KATALOG MAKLON SABUN BATANG",
            headline: "Jasa Maklon Sabun Batang BPOM dan Halal",
            description: "Ingin punya brand sabun batang sendiri? Dreamlab adalah solusi Anda untuk mengembangkan bar soap yang beauty bar, moisturizing, hingga exfoliating bar dengan formula custom dan kemasan ramah lingkungan."
          },
          "massage-cream": {
            smallTitle: "KATALOG MAKLON MASSAGE CREAM",
            headline: "Jasa Maklon Massage Cream BPOM dan Halal",
            description: "Ingin punya brand massage cream sendiri? Dreamlab adalah solusi Anda untuk mengembangkan krim pijat relaxing, warming, hingga aromatherapy dengan tekstur yang pas untuk brand spa dan wellness."
          },
          "soothing-gel": {
            smallTitle: "KATALOG MAKLON SOOTHING GEL",
            headline: "Jasa Maklon Soothing Gel BPOM dan Halal",
            description: "Ingin punya brand soothing gel sendiri? Dreamlab adalah solusi Anda untuk mengembangkan soothing gel berbahan aloe vera yang menenangkan kulit setelah aktivitas, paparan matahari, atau iritasi ringan."
          },
          "neck-cream": {
            smallTitle: "KATALOG MAKLON NECK CREAM",
            headline: "Jasa Maklon Neck Cream BPOM dan Halal",
            description: "Ingin punya brand neck cream sendiri? Dreamlab adalah solusi Anda untuk mengembangkan krim perawatan leher anti-aging, brightening, hingga firming untuk melengkapi rangkaian anti-aging brand Anda."
          }
        },
        haircare: {
          "shampoo": {
            smallTitle: "KATALOG MAKLON SHAMPOO / PEMBERSIH RAMBUT",
            headline: "Jasa Maklon Shampoo Rambut BPOM & Halal Terlengkap",
            description: "Ingin punya brand shampoo sendiri? Dreamlab adalah solusi Anda untuk mengembangkan shampoo — anti-dandruff, anti-hair fall, hair growth, sulfate-free, hingga daily care — dengan formula yang membersihkan sekaligus merawat kesehatan kulit kepala."
          },
          "hair-mask": {
            smallTitle: "KATALOG MAKLON MASKER RAMBUT / HAIR MASK",
            headline: "Jasa Maklon Masker Rambut (Hair Mask) BPOM & Halal Terlengkap",
            description: "Kembangkan produk hair mask salon-grade yang mampu merestorasi keratin rambut rusak, bercabang, dan kering. Dreamlab memformulasikan produk perawatan rambut intensif dengan nutrisi mendalam dan keharuman tahan lama."
          },
          "hair-serum": {
            smallTitle: "KATALOG MAKLON SERUM RAMBUT / HAIR SERUM",
            headline: "Jasa Maklon Serum Rambut (Hair Serum) BPOM & Halal Terlengkap",
            description: "Maklon serum rambut premium untuk perlindungan panas (heat protection), kilau instan, maupun pertumbuhan rambut (hair growth). Diformulasikan ringan, bebas lepek, dan kaya akan vitamin rambut bernutrisi tinggi."
          },
          "hair-tonic": {
            smallTitle: "KATALOG MAKLON TONIK RAMBUT / HAIR TONIC",
            headline: "Jasa Maklon Tonik Rambut (Hair Tonic) BPOM & Halal Terlengkap",
            description: "Formulasi tonic penyubur rambut berteknologi penetrasi mendalam untuk menguatkan akar rambut dan merangsang pertumbuhan rambut baru. Dreamlab memproduksi tonik rambut dengan sensasi dingin menyegarkan di kulit kepala."
          },
          "hair-conditioner": {
            smallTitle: "KATALOG MAKLON HAIR CONDITIONER",
            headline: "Jasa Maklon Hair Conditioner BPOM & Halal Terlengelap",
            description: "Ingin punya brand hair conditioner sendiri? Dreamlab adalah solusi Anda untuk mengembangkan hair conditioner — rinse-off, leave-in, smoothing, repair, hingga volume — dengan formula yang melembapkan dan memperbaiki tekstur rambut setelah keramas."
          },
          "hair-gel": {
            smallTitle: "KATALOG MAKLON HAIR GEL",
            headline: "Jasa Maklon Hair Gel BPOM & Halal Terlengelap",
            description: "Ingin punya brand hair gel sendiri? Dreamlab adalah solusi Anda untuk mengembangkan hair gel — strong hold, light hold, wet look, hingga natural shine — dengan formula non-sticky dan water soluble yang tidak meninggalkan residu putih."
          },
          "pomade": {
            smallTitle: "KATALOG MAKLON POMADE",
            headline: "Jasa Maklon Pomade BPOM & Halal Terlengelap",
            description: "Ingin punya brand pomade sendiri? Dreamlab adalah solusi Anda untuk mengembangkan pomade — water based, oil based, matte, high shine, hingga clay — dengan formula tahan lama yang mudah dibersihkan dan memberikan hasil styling sempurna."
          },
          "scalp-care": {
            smallTitle: "KATALOG MAKLON SCALP CARE",
            headline: "Jasa Maklon Scalp Care BPOM & Halal Terlengelap",
            description: "Ingin punya brand scalp care sendiri? Dreamlab adalah solusi Anda untuk mengembangkan produk perawatan kulit kepala — scalp serum, scalp treatment, scalp exfoliator, hingga soothing essence — dengan formula yang mengatasi ketombe, iritasi, dan menyehatkan akar rambut."
          },
          "beard-serum": {
            smallTitle: "KATALOG MAKLON BEARD SERUM",
            headline: "Jasa Maklon Beard Serum BPOM & Halal Terlengelap",
            description: "Ingin punya brand beard serum sendiri? Dreamlab adalah solusi Anda untuk mengembangkan beard serum — growth serum, beard oil, beard balm, hingga beard moisturizer — dengan formula non-greasy yang merawat jenggot dan kulit wajah pria."
          }
        },
        decorative: {
          "lip-cream": {
            smallTitle: "KATALOG MAKLON LIP CREAM",
            headline: "Jasa Maklon Lip Cream BPOM dan Halal",
            description: "Ingin punya brand lip cream sendiri? Dreamlab adalah solusi Anda untuk mengembangkan lip cream bertekstur ringan dan tahan lama, produk lipstik cair yang paling banyak dicari konsumen Indonesia."
          },
          "lip-matte": {
            smallTitle: "KATALOG MAKLON LIP MATTE / DEKORATIF BIBIR",
            headline: "Jasa Maklon Lip Matte & Lip Cream BPOM & Halal Terlengkapp",
            description: "Ingin punya brand lip matte sendiri? Dreamlab adalah solusi Anda untuk mengembangkan lip matte dengan hasil flawless dan tahan lama, finish yang menjadi favorit pasar lipstik."
          },
          "lip-gloss": {
            smallTitle: "KATALOG MAKLON LIP GLOSS / GLOWING LIPS",
            headline: "Jasa Maklon Lip Gloss & Lip Oil BPOM & Halal Terlengkapp",
            description: "Ingin punya brand lip gloss sendiri? Dreamlab adalah solusi Anda untuk mengembangkan lip gloss yang memberi kilau dan kesan bibir penuh, produk yang kembali populer di tren makeup terkini."
          },
          "foundation": {
            smallTitle: "KATALOG MAKLON FOUNDATION",
            headline: "Jasa Maklon Foundation BPOM dan Halal",
            description: "Ingin punya brand foundation sendiri? Dreamlab adalah solusi Anda untuk mengembangkan foundation dengan coverage dan ketahanan yang pas untuk iklim Indonesia, produk inti dalam lini makeup."
          },
          "bb-cream": {
            smallTitle: "KATALOG MAKLON BB CREAM",
            headline: "Jasa Maklon BB Cream BPOM dan Halal",
            description: "Ingin punya brand bb cream sendiri? Dreamlab adalah solusi Anda untuk mengembangkan BB cream sebagai base ringan dengan sentuhan perawatan, favorit konsumen yang menyukai makeup natural."
          },
          "face-primer": {
            smallTitle: "KATALOG MAKLON FACE PRIMER",
            headline: "Jasa Maklon Face Primer BPOM dan Halal",
            description: "Ingin punya brand face primer sendiri? Dreamlab adalah solusi Anda untuk mengembangkan face primer yang membuat makeup lebih awet dan halus, produk pelengkap penting dalam rutinitas makeup."
          },
          "foundation-serum": {
            smallTitle: "KATALOG MAKLON FOUNDATION SERUM",
            headline: "Jasa Maklon Foundation Serum BPOM dan Halal",
            description: "Ingin punya brand foundation serum sendiri? Dreamlab adalah solusi Anda untuk mengembangkan foundation serum sebagai hybrid makeup dan skincare, kategori yang sedang naik daun di pasar kecantikan."
          },
          "liquid-highlighter": {
            smallTitle: "KATALOG MAKLON LIQUID HIGHLIGHTER",
            headline: "Jasa Maklon Liquid Highlighter BPOM dan Halal",
            description: "Ingin punya brand liquid highlighter sendiri? Dreamlab adalah solusi Anda untuk mengembangkan liquid highlighter yang memberi efek glowing memikat, produk makeup yang digemari untuk tampilan dewy."
          },
          "mascara": {
            smallTitle: "KATALOG MAKLON MASCARA",
            headline: "Jasa Maklon Mascara BPOM dan Halal",
            description: "Ingin punya brand mascara sendiri? Dreamlab adalah solusi Anda untuk mengembangkan mascara yang melentikkan dan menebalkan bulu mata, produk eye makeup wajib di lini decorative."
          },
          "cream-blush": {
            smallTitle: "KATALOG MAKLON CREAM BLUSH",
            headline: "Jasa Maklon Cream Blush BPOM dan Halal",
            description: "Ingin punya brand cream blush sendiri? Dreamlab adalah solusi Anda untuk mengembangkan cream blush bertekstur lembut yang menyatu dengan kulit, memberi rona natural yang sedang digemari."
          },
          "liquid-blush": {
            smallTitle: "KATALOG MAKLON LIQUID BLUSH",
            headline: "Jasa Maklon Liquid Blush BPOM dan Halal",
            description: "Ingin punya brand liquid blush sendiri? Dreamlab adalah solusi Anda untuk mengembangkan liquid blush yang pigmented dan ringan, produk blush viral yang dicari konsumen muda."
          },
          "eyebrow-gel": {
            smallTitle: "KATALOG MAKLON EYEBROW GEL",
            headline: "Jasa Maklon Eyebrow Gel BPOM dan Halal",
            description: "Ingin punya brand eyebrow gel sendiri? Dreamlab adalah solusi Anda untuk mengembangkan eyebrow gel yang menata dan mempertegas alis, produk yang dicari seiring tren alis natural."
          },
          "lip-serum": {
            smallTitle: "KATALOG MAKLON LIP SERUM",
            headline: "Jasa Maklon Lip Serum BPOM dan Halal",
            description: "Ingin punya brand lip serum sendiri? Dreamlab adalah solusi Anda untuk mengembangkan lip serum berbasis oil untuk perawatan intensif bibir, kategori lip care premium yang sedang berkembang."
          },
          "lip-balm": {
            smallTitle: "KATALOG MAKLON LIP BALM",
            headline: "Jasa Maklon Lip Balm BPOM dan Halal",
            description: "Ingin punya brand lip balm sendiri? Dreamlab adalah solusi Anda untuk mengembangkan lip balm pelembap bibir untuk pemakaian harian, produk kebutuhan dasar dengan repeat-purchase tinggi."
          },
          "tinted-lip-balm": {
            smallTitle: "KATALOG MAKLON TINTED LIP BALM",
            headline: "Jasa Maklon Tinted Lip Balm BPOM dan Halal",
            description: "Ingin punya brand tinted lip balm sendiri? Dreamlab adalah solusi Anda untuk mengembangkan tinted lip balm yang memberi warna sekaligus melembapkan, hybrid antara perawatan dan makeup."
          },
          "lip-scrub": {
            smallTitle: "KATALOG MAKLON LIP SCRUB",
            headline: "Jasa Maklon Lip Scrub BPOM dan Halal",
            description: "Ingin punya brand lip scrub sendiri? Dreamlab adalah solusi Anda untuk mengembangkan lip scrub yang mengangkat kulit mati dan menghaluskan bibir, produk pelengkap rangkaian lip care."
          },
          "lip-blush": {
            smallTitle: "KATALOG MAKLON LIP BLUSH",
            headline: "Jasa Maklon Lip Blush BPOM dan Halal",
            description: "Ingin punya brand lip blush sendiri? Dreamlab adalah solusi Anda untuk mengembangkan lip blush atau lip tint yang memberi rona bibir natural tahan lama, produk viral di kalangan konsumen muda."
          }
        },
        footcare: {
          "foot-cream": {
            smallTitle: "KATALOG MAKLON KRIM KAKI / FOOT CREAM",
            headline: "Jasa Maklon Krim Kaki (Foot Cream) BPOM & Halal Terlengkap",
            description: "Ingin punya brand foot cream sendiri? Dreamlab adalah solusi Anda untuk mengembangkan foot cream yang merawat tumit kering dan pecah-pecah, solusi masalah kaki yang dialami banyak orang."
          },
          "foot-scrub": {
            smallTitle: "KATALOG MAKLON SCRUB KAKI / FOOT SCRUB",
            headline: "Jasa Maklon Scrub Kaki (Foot Scrub) BPOM & Halal Terlengkap",
            description: "Ingin punya brand foot scrub sendiri? Dreamlab adalah solusi Anda untuk mengembangkan foot scrub yang mengangkat kulit mati dan menghadirkan kaki halus, produk pelengkap rangkaian foot care."
          },
          "foot-mask": {
            smallTitle: "KATALOG MAKLON MASKER KAKI / FOOT MASK",
            headline: "Jasa Maklon Masker Kaki (Foot Mask) BPOM & Halal Terlengkap",
            description: "Hadirkan inovasi foot peeling mask atau hydrating foot mask untuk perawatan intensif di rumah. Diformulasikan aman, efektif meremajakan kulit kaki, dan membuat telapak kaki terasa selembut bayi."
          },
          "foot-soak": {
            smallTitle: "KATALOG MAKLON RENDAMAN KAKI / FOOT SOAK",
            headline: "Jasa Maklon Rendaman Kaki (Foot Soak) BPOM & Halal Terlengkap",
            description: "Ingin punya brand foot soak sendiri? Dreamlab adalah solusi Anda untuk mengembangkan foot soak untuk merendam dan merelaksasi kaki lelah, produk wellness pengalaman spa di rumah."
          },
          "foot-spray": {
            smallTitle: "KATALOG MAKLON FOOT SPRAY",
            headline: "Jasa Maklon Foot Spray BPOM dan Halal",
            description: "Ingin punya brand foot spray sendiri? Dreamlab adalah solusi Anda untuk mengembangkan foot spray yang mengatasi bau kaki dan memberi sensasi segar, solusi praktis yang dicari banyak konsumen."
          },
          "foot-serum": {
            smallTitle: "KATALOG MAKLON FOOT SERUM",
            headline: "Jasa Maklon Foot Serum BPOM dan Halal",
            description: "Ingin punya brand foot serum sendiri? Dreamlab adalah solusi Anda untuk mengembangkan foot serum sebagai perawatan intensif kaki, produk premium pelengkap rangkaian foot care brand Anda."
          },
          "foot-anti-bacterial": {
            smallTitle: "KATALOG MAKLON FOOT ANTI-BACTERIAL",
            headline: "Jasa Maklon Foot Anti-Bacterial BPOM & Halal Terlengellap",
            description: "Jasa maklon foot anti-bacterial terlengkap di Indonesia. Diformulasikan untuk mengatasi bau kaki, jamur, dan bakteri di area kaki. Semua bisa dikustomisasi sesuai konsep brand Anda."
          }
        },
        babycare: {
          "baby-2in1-wash": {
            smallTitle: "KATALOG MAKLON BABY 2-IN-1 WASH",
            headline: "Jasa Maklon Baby 2-in-1 Wash BPOM dan Halal",
            description: "Ingin punya brand baby 2-in-1 wash sendiri? Dreamlab adalah solusi Anda untuk mengembangkan baby 2-in-1 wash yang membersihkan rambut dan tubuh bayi sekaligus, produk praktis yang disukai para orang tua."
          },
          "baby-shampoo": {
            smallTitle: "KATALOG MAKLON SAMPO BAYI / BABY SHAMPOO",
            headline: "Jasa Maklon Sampo Bayi (Baby Shampoo) BPOM & Halal Terlengkap",
            description: "Ingin punya brand sampo bayi sendiri? Dreamlab adalah solusi Anda untuk mengembangkan baby shampoo — tear-free, gentle, hypoallergenic, hingga fragrance-free — dengan formula lembut yang membersihkan rambut tanpa mengiritasi mata dan kulit kepala bayi."
          },
          "baby-lotion": {
            smallTitle: "KATALOG MAKLON PELEMBAB BAYI / BABY LOTION",
            headline: "Jasa Maklon Pelembap Bayi (Baby Lotion) BPOM & Halal Terlengkap",
            description: "Ingin punya brand baby lotion sendiri? Dreamlab adalah solusi Anda untuk mengembangkan baby lotion — daily moisturizer, calming, nourishing, hingga soothing — dengan formula hypoallergenic yang menjaga kelembapan kulit sensitif bayi sepanjang hari."
          },
          "baby-powder": {
            smallTitle: "KATALOG MAKLON BEDAK BAYI / BABY POWDER",
            headline: "Jasa Maklon Bedak Bayi (Baby Powder) BPOM & Halal Terlengkap",
            description: "Ingin punya brand bedak bayi sendiri? Dreamlab adalah solusi Anda untuk mengembangkan baby powder — talc-free, corn starch, calming, hingga cooling — dengan formula lembut yang menjaga kulit bayi tetap kering, nyaman, dan bebas biang keringat."
          },
          "baby-cologne": {
            smallTitle: "KATALOG MAKLON PARFUM BAYI / BABY COLOGNE",
            headline: "Jasa Maklon Parfum Bayi (Baby Cologne) BPOM & Halal Terlengkap",
            description: "Ingin punya brand parfum bayi sendiri? Dreamlab adalah solusi Anda untuk mengembangkan baby cologne — alcohol-free, hypoallergenic, fresh, hingga calming — dengan wewangian lembut khas bayi yang segar dan aman untuk kulit sensitif."
          },
          "baby-oil": {
            smallTitle: "KATALOG MAKLON BABY OIL",
            headline: "Jasa Maklon Baby Oil BPOM & Halal Terlengelap",
            description: "Ingin punya brand baby oil sendiri? Dreamlab adalah solusi Anda untuk mengembangkan baby oil — massage oil, moisturizing, nourishing, hingga calming — dengan formula hypoallergenic yang melembapkan dan melindungi kulit bayi secara alami."
          },
          "baby-moisturizer-cream": {
            smallTitle: "KATALOG MAKLON BABY MOISTURIZER CREAM",
            headline: "Jasa Maklon Baby Moisturizer Cream BPOM & Halal Terlengelap",
            description: "Ingin punya brand baby moisturizer cream sendiri? Dreamlab adalah solusi Anda untuk mengembangkan krim pelembap bayi — daily moisturizer, eczema care, calming, hingga intensive — dengan formula hypoallergenic yang menutrisi dan melindungi skin barrier bayi."
          }
        },
        parfum: {
          "eau-de-parfum": {
            smallTitle: "KATALOG MAKLON EAU DE PARFUM / EDP",
            headline: "Jasa Maklon Eau de Parfum (EDP) BPOM & Halal Terlengkap",
            description: "Ingin punya brand parfum eau de parfum (EDP) sendiri? Dreamlab adalah solusi Anda untuk mengembangkan eau de parfum beraroma kuat dan tahan lama, pilihan premium untuk brand parfum kelas menengah ke atas."
          },
          "eau-de-toilette": {
            smallTitle: "KATALOG MAKLON EAU DE TOILETTE / EDT",
            headline: "Jasa Maklon Eau de Toilette (EDT) BPOM & Halal Terlengkap",
            description: "Ingin punya brand parfum eau de toilette (EDT) sendiri? Dreamlab adalah solusi Anda untuk mengembangkan eau de toilette dengan ketahanan aroma menengah, pilihan parfum paling seimbang antara harga dan performa."
          },
          "eau-de-cologne": {
            smallTitle: "KATALOG MAKLON EAU DE COLOGNE / EDC",
            headline: "Jasa Maklon Eau de Cologne (EDC) BPOM & Halal Terlengkap",
            description: "Ingin punya brand parfum eau de cologne sendiri? Dreamlab adalah solusi Anda untuk mengembangkan eau de cologne beraroma segar dan ringan, pilihan parfum harian yang disukai semua kalangan."
          },
          "extrait-de-parfum": {
            smallTitle: "KATALOG MAKLON EXTRAIT DE PARFUM / EXTRAIT",
            headline: "Jasa Maklon Extrait de Parfum BPOM & Halal Terlengkap",
            description: "Ingin punya brand parfum extrait de parfum sendiri? Dreamlab adalah solusi Anda untuk mengembangkan extrait de parfum dengan konsentrasi minyak wangi tertinggi, kelas parfum mewah untuk brand segmen luxury."
          },
          "body-mist": {
            smallTitle: "KATALOG MAKLON BODY MIST / BODY SPRAY",
            headline: "Jasa Maklon Body Mist & Body Spray BPOM & Halal Terlengkap",
            description: "Ingin punya brand body mist sendiri? Dreamlab adalah solusi Anda untuk mengembangkan body mist beraroma menyegarkan dengan harga terjangkau, produk wewangian favorit pasar anak muda."
          },
          "minyak-atsiri": {
            smallTitle: "KATALOG MAKLON MINYAK ATSIRI / ESSENTIAL OIL",
            headline: "Jasa Maklon Essential Oil & Aromatherapy BPOM & Halal Terlengkap",
            description: "Ingin punya brand minyak atsiri sendiri? Dreamlab adalah solusi Anda untuk mengembangkan minyak atsiri atau essential oil untuk aromaterapi dan wellness, kategori yang tumbuh seiring tren self-care."
          }
        },
        pkrt: {
          "hand-sanitizer": {
            smallTitle: "KATALOG MAKLON HAND SANITIZER / PKRT",
            headline: "Jasa Maklon Hand Sanitizer Kemenkes RI & Halal Terlengkap",
            description: "Ingin punya brand hand sanitizer sendiri? Dreamlab adalah solusi Anda untuk mengembangkan hand sanitizer — gel, spray, moisturizing, hingga antibacterial — dengan formula efektif membunuh kuman yang lembut di kulit dan tidak lengket."
          },
          "hand-wash": {
            smallTitle: "KATALOG MAKLON SABUN CUCI TANGAN / HAND WASH",
            headline: "Jasa Maklon Sabun Cuci Tangan Kemenkes RI & Halal Terlengkap",
            description: "Kembangkan produk sabun cuci tangan premium berformula antibakteri yang wangi dan lembut di kulit. Dreamlab memproduksi hand wash dengan busa melimpah dan tidak membuat kulit kering."
          },
          "disinfectant-spray": {
            smallTitle: "KATALOG MAKLON DISINFECTANT SPRAY / PKRT",
            headline: "Jasa Maklon Disinfectant Spray Kemenkes RI & Halal Terlengkap",
            description: "Jasa maklon semprotan disinfektan berstandar Kemenkes RI untuk membasmi kuman, bakteri, dan virus di udara maupun permukaan benda. Diformulasikan dengan aroma menyegarkan dan aman digunakan."
          },
          "floor-cleaner": {
            smallTitle: "KATALOG MAKLON PEMBERSIH LANTAI / PKRT",
            headline: "Jasa Maklon Pembersih Lantai Kemenkes RI & Halal Terlengkap",
            description: "Maklon pembersih lantai dengan daya angkat kotoran maksimal, wangi tahan lama, serta formula antibakteri yang melindungi seluruh anggota keluarga. Dreamlab memastikan produk memiliki izin edar resmi Kemenkes RI."
          },
          "room-spray": {
            smallTitle: "KATALOG MAKLON PENGHARUM RUANGAN / ROOM SPRAY",
            headline: "Jasa Maklon Pengharum Ruangan Kemenkes RI & Halal Terlengkap",
            description: "Hadirkan keharuman mewah di setiap ruangan dengan produk room spray premium. Diformulasikan dengan penyebar aroma yang merata, efektif menetralisir bau tidak sedap, dan berizin resmi Kemenkes RI."
          },
          "bar-soap": {
            smallTitle: "KATALOG MAKLON SABUN BATANG / BAR SOAP",
            headline: "Jasa Maklon Sabun Batang Kemenkes RI & Halal Terlengkap",
            description: "Maklon sabun batang premium dengan metode cold process atau saponifikasi modern. Diformulasikan dengan busa mewah, wangi tahan lama, serta bahan aktif yang disesuaikan dengan kebutuhan pasar Anda."
          },
          "bar-soap-pkrt": {
            smallTitle: "KATALOG MAKLON SABUN BATANG / BAR SOAP",
            headline: "Jasa Maklon Sabun Batang Kemenkes RI & Halal Terlengkap",
            description: "Maklon sabun batang premium dengan metode cold process atau saponifikasi modern. Diformulasikan dengan busa mewah, wangi tahan lama, serta bahan aktif yang disesuaikan dengan kebutuhan pasar Anda."
          },
          "herbal-soap": {
            smallTitle: "KATALOG MAKLON SABUN HERBAL",
            headline: "Jasa Maklon Sabun Herbal BPOM & Halal Terlengkan",
            description: "Ingin punya brand sabun herbal sendiri? Dreamlab adalah solusi Anda untuk mengembangkan sabun herbal — chamomile, tea tree, lavender, hingga calendula — dengan bahan herbal alami berkualitas untuk pembersihan yang lembut dan menyehatkan kulit."
          }
        }
      };

      const customCopy = productCopyMap[categorySlug]?.[productSlug];
      if (customCopy) {
        return {
          headline: customCopy.headline,
          description: customCopy.description,
          smallTitle: customCopy.smallTitle,
          ctaText: "FREE KONSULTASI BISNIS",
          image: getProductHeroImage(productData, false),
          mobileImage: getProductHeroImage(productData, true),
          showTrustBar: false,
          microCTA: null
        };
      }

      const isPkrt = categorySlug === "pkrt";
      const certLabel = isPkrt ? "Kemenkes RI" : "BPOM dan Halal";

      return {
        headline: `Jasa Maklon ${productData.name} ${certLabel}`,
        description: `Ingin punya brand ${productData.name.toLowerCase()} sendiri? Dreamlab adalah solusi Anda untuk mengembangkan ${productData.name.toLowerCase()} dengan formula custom sesuai kebutuhan brand Anda.`,
        smallTitle: `MAKLON ${productData.name.toUpperCase()} PREMIUM`,
        ctaText: "FREE KONSULTASI BISNIS",
        image: getProductHeroImage(productData, false),
        mobileImage: getProductHeroImage(productData, true),
        showTrustBar: false,
        microCTA: null
      };
    }

    // Special case for Skincare Category Page
    if (categoryData.slug === 'skincare') {
      return {
        headline: <>Jasa Maklon <br /> {title} <span className="text-brand-orange">Premium</span> <br /> BPOM & Halal</>,
        description: "Ingin punya brand skincare sendiri? Dreamlab adalah solusi Anda untuk mengembangkan rangkaian perawatan wajah — dari facial wash, toner, serum, moisturizer, sunscreen, hingga masker wajah — dengan formula custom sesuai konsep brand Anda. Lebih dari 1.000 produk telah dikembangkan di fasilitas bersertifikat CPKB Grade A, berizin BPOM RI dan Halal MUI.",
        image: getCategoryHeroImage(categoryData.slug, false, categoryData.heroImage),
        mobileImage: getCategoryHeroImage(categoryData.slug, true, categoryData.heroImage),
        ctaText: "FREE KONSULTASI BISNIS",
        showTrustBar: false,
        microCTA: null
      };
    }

    const categoryCopyMap: Record<string, { headline: React.ReactNode; description: string }> = {
      haircare: {
        headline: <>Jasa Maklon <br /> {title} <span className="text-brand-orange">Premium</span> <br /> BPOM & Halal</>,
        description: "Ingin punya brand haircare sendiri? Dreamlab adalah solusi Anda untuk mengembangkan rangkaian perawatan rambut — dari shampoo, conditioner, hair mask, hair tonic, hair serum, hingga styling products — dengan formula custom sesuai kebutuhan rambut konsumen Indonesia."
      },
      babycare: {
        headline: <>Jasa Maklon <br /> {title} <span className="text-brand-orange">Premium</span> <br /> BPOM & Halal</>,
        description: "Ingin punya brand baby care sendiri? Dreamlab adalah solusi Anda untuk mengembangkan rangkaian perawatan bayi — dari baby wash, baby shampoo, baby lotion, baby powder, hingga baby cologne — dengan formula hypoallergenic yang aman dan lembut untuk kulit sensitif bayi."
      },
      bodycare: {
        headline: <>Jasa Maklon <br /> {title} <span className="text-brand-orange">Premium</span> <br /> BPOM & Halal</>,
        description: "Ingin punya brand body care sendiri? Dreamlab adalah solusi Anda untuk mengembangkan rangkaian perawatan tubuh — dari body lotion, body wash, body scrub, body butter, massage oil, hingga body serum — dengan formula premium sesuai konsep brand Anda."
      },
      decorative: {
        headline: <>Jasa Maklon <br /> {title} <span className="text-brand-orange">Premium</span> <br /> BPOM & Halal</>,
        description: "Ingin punya brand makeup sendiri? Dreamlab adalah solusi Anda untuk mengembangkan rangkaian kosmetik dekoratif — dari foundation, BB cream, cushion, mascara, blush, highlighter, hingga lip product — dengan formula pigmented dan tahan lama yang pas untuk iklim Indonesia."
      },
      footcare: {
        headline: <>Jasa Maklon <br /> {title} <span className="text-brand-orange">Premium</span> <br /> BPOM & Halal</>,
        description: "Ingin punya brand foot care sendiri? Dreamlab adalah solusi Anda untuk mengembangkan rangkaian perawatan kaki — dari foot cream, foot scrub, foot spray, foot soak, hingga foot serum — dengan formula khusus yang mengatasi masalah kaki konsumen Indonesia."
      },
      pkrt: {
        headline: <>Jasa Maklon <br /> {title} <span className="text-brand-orange">Premium</span> <br /> BPOM & Halal</>,
        description: "Ingin punya brand PKRT sendiri? Dreamlab adalah solusi Anda untuk mengembangkan rangkaian produk kimia rumah tangga — dari hand sanitizer, hand wash, disinfectant spray, floor cleaner, hingga room spray — dengan formula efektif bersertifikat Kemenkes RI dan Halal."
      },
    };

    const categoryCopy = categoryCopyMap[categoryData.slug];
    if (categoryCopy) {
      return {
        headline: categoryCopy.headline,
        description: categoryCopy.description,
        image: getCategoryHeroImage(categoryData.slug, false, categoryData.heroImage),
        mobileImage: getCategoryHeroImage(categoryData.slug, true, categoryData.heroImage),
        ctaText: "FREE KONSULTASI BISNIS",
        showTrustBar: false,
        microCTA: null
      };
    }

    return {
      headline: <>Jasa Maklon <br /> {title} <span className="text-brand-orange">Premium</span> <br /> BPOM & Halal</>,
      description: categoryData.tagline || categoryData.description,
      image: getCategoryHeroImage(categoryData.slug, false, categoryData.heroImage),
      mobileImage: getCategoryHeroImage(categoryData.slug, true, categoryData.heroImage),
      ctaText: "FREE KONSULTASI BISNIS",
      showTrustBar: false,
      microCTA: null
    };
  };

  const content = getHeroContent();
  const waUrl = `/thankyou/google/`;

  // ═══════════════════════════════════════════════════════════════════
  // PRODUCT PAGE HERO — World-Class Premium Layout
  // ═══════════════════════════════════════════════════════════════════
  if (isProductPage && productData) {
    const vividBgColor = vividCategoryColors[categoryData.slug] || '#37474F';
    const productCardImage = getProductCardImagePath(productData.slug, categoryData.slug);
    const displayImage = productCardImage || content.image;

    // Generate a slightly lighter shade for gradient
    const lightenColor = (hex: string, percent: number) => {
      const num = parseInt(hex.replace('#', ''), 16);
      const r = Math.min(255, (num >> 16) + Math.round(255 * percent));
      const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(255 * percent));
      const b = Math.min(255, (num & 0x0000FF) + Math.round(255 * percent));
      return `rgb(${r}, ${g}, ${b})`;
    };

    const isPkrt = categoryData.slug === 'pkrt';
    const certLabel = isPkrt ? 'KEMENKES RI' : 'BPOM RI';

    return (
      <section 
        className="relative min-h-[650px] lg:min-h-[750px] flex items-center overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28"
        style={{ 
          background: `linear-gradient(135deg, #FAF9F6 0%, ${vividBgColor}55 50%, ${vividBgColor}77 100%)`
        }}
      >
        {/* ── Atmospheric Background Layers ── */}
        {/* Large soft glow orbs using a transparent opacity hex version of category colors */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[20%] -right-[15%] w-[600px] h-[600px] rounded-full opacity-[0.25]" 
            style={{ background: `radial-gradient(circle, ${vividBgColor}44 0%, transparent 70%)` }} />
          <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full opacity-[0.2]" 
            style={{ background: `radial-gradient(circle, ${vividBgColor}33 0%, transparent 70%)` }} />
        </div>

        {/* Subtle dot pattern overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #212120 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Diagonal accent line */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isLightBg ? 0.08 : 0.06 }}
          transition={{ delay: 1.5, duration: 1.5 }}
          className={`absolute top-0 right-0 w-[1px] h-[150%] origin-top-right rotate-[25deg] hidden lg:block ${isLightBg ? 'bg-[#212120]' : 'bg-white'}`}
          style={{ right: '42%' }}
        />

        <div className="container-custom relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-8 items-center">
            
            {/* ── Left Column: Text Content ── */}
            <div className="order-2 lg:order-1 space-y-6">
              
              {/* Category Label Pill */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-md ${
                  isLightBg 
                    ? 'bg-[#212120]/[0.05] border-[#212120]/15' 
                    : 'bg-white/[0.08] border-white/[0.15]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                <span className={`text-[9px] lg:text-[10px] font-black uppercase tracking-[0.25em] font-onest ${
                  isLightBg ? 'text-[#212120]/90' : 'text-white/90'
                }`}>
                  {"MAKLON JUARANYA FORMULA"}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className={`text-[26px] sm:text-[32px] md:text-[38px] lg:text-[44px] xl:text-[50px] font-normal leading-[1.08] tracking-tight uppercase ${
                  isLightBg ? 'text-[#212120]' : 'text-white'
                }`}
              >
                {content.headline}
              </motion.h1>

              {/* Accent Divider */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
                className="h-[3px] bg-brand-orange rounded-full"
              />

              {/* Description */}
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className={`text-[13px] sm:text-sm lg:text-[15px] xl:text-base font-medium leading-[1.7] max-w-lg ${
                  isLightBg ? 'text-[#212120]/75' : 'text-white/70'
                }`}
              >
                {content.description}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row items-start gap-4 pt-1"
              >
                <motion.a
                  href={waUrl}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className={`group relative w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-brand-orange text-white font-bold py-4 px-10 rounded-2xl transition-all duration-500 shadow-[0_8px_32px_rgba(246,145,30,0.35)] ${
                    isLightBg 
                      ? 'hover:bg-[#212120] hover:text-white hover:shadow-[0_8px_32px_rgba(33,33,32,0.15)]' 
                      : 'hover:bg-white hover:text-[#212120] hover:shadow-[0_8px_32px_rgba(255,255,255,0.25)]'
                  }`}
                >
                  <span className="uppercase tracking-[0.2em] text-[10px] font-onest">{content.ctaText || "FREE KONSULTASI BISNIS"}</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.a>
              </motion.div>


            </div>

            {/* ── Right Column: Premium Product Showcase ── */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
              
              {/* Decorative Background Shapes */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                {/* Outer soft ring */}
                <div className={`absolute w-[340px] h-[340px] sm:w-[380px] sm:h-[380px] md:w-[460px] md:h-[460px] lg:w-[500px] lg:h-[500px] xl:w-[560px] xl:h-[560px] rounded-full border ${
                  isLightBg ? 'border-[#212120]/[0.08]' : 'border-white/[0.08]'
                }`} />
                {/* Inner dashed ring */}
                <div className={`absolute w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[390px] md:h-[390px] lg:w-[420px] lg:h-[420px] xl:w-[480px] xl:h-[480px] rounded-full border border-dashed ${
                  isLightBg ? 'border-[#212120]/[0.06]' : 'border-dashed border-white/[0.06]'
                }`} />
              </motion.div>

              {/* Glow behind product */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1.5 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className={`w-[250px] h-[250px] md:w-[320px] md:h-[320px] lg:w-[360px] lg:h-[360px] rounded-full ${isLightBg ? 'opacity-[0.25]' : 'opacity-20'}`}
                  style={{ background: isLightBg ? `radial-gradient(circle, #DFD0BC 0%, transparent 70%)` : `radial-gradient(circle, white 0%, transparent 70%)` }}
                />
              </motion.div>

              {/* Product Image Container */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10"
              >
                {/* Glassmorphic backdrop card */}
                <div className={`relative w-[280px] h-[320px] sm:w-[320px] sm:h-[360px] md:w-[400px] md:h-[440px] lg:w-[430px] lg:h-[470px] xl:w-[470px] xl:h-[510px] rounded-[2.5rem] backdrop-blur-sm border shadow-[0_30px_80px_rgba(0,0,0,0.12)] overflow-hidden ${
                  isLightBg 
                    ? 'bg-white/35 border-white/45' 
                    : 'bg-white/[0.07] border-white/[0.12]'
                }`}>
                  
                  {/* Inner highlight shimmer */}
                  <div className={`absolute inset-0 bg-gradient-to-br pointer-events-none ${
                    isLightBg 
                      ? 'from-white/30 via-transparent to-white/10' 
                      : 'from-white/[0.08] via-transparent to-white/[0.03]'
                  }`} />
                  
                  {/* Product Image wrapped in breathing motion.div */}
                  <motion.div 
                    animate={{
                      y: [0, -10, 0]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 flex items-center justify-center p-8 md:p-10"
                  >
                    <div className="relative w-full h-full">
                      <Image 
                        src={displayImage}
                        alt={productImageAlt(productData?.slug || "", categoryData.slug, title)}
                        title={productImageTitle(productData?.slug || "", categoryData.slug, title)}
                        fill
                        priority
                        fetchPriority="high"
                        decoding="sync"
                        className="object-contain drop-shadow-[0_15px_40px_rgba(0,0,0,0.2)]"
                        sizes="(max-width: 768px) 320px, (max-width: 1024px) 400px, 470px"
                      />
                    </div>
                  </motion.div>

                  {/* Corner accent lines */}
                  <div className={`absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 rounded-tl-xl ${isLightBg ? 'border-[#212120]/15' : 'border-white/15'}`} />
                  <div className={`absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 rounded-br-xl ${isLightBg ? 'border-[#212120]/15' : 'border-white/15'}`} />
                </div>

                {/* Clean Image Card - Badges Removed for Elegant Focus */}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade to white */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/50 to-transparent z-10" />
      </section>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // SUB-CATEGORY PAGE HERO — Upgraded Premium Structure Match
  // ═══════════════════════════════════════════════════════════════════
  if (isSubCategoryPage) {
    const vividBgColor = categoryData.bgColor ? categoryData.bgColor : (vividCategoryColors[categoryData.slug] || '#37474F');

    const subCategoryHeroImageMap: Record<string, Record<string, string>> = {
      skincare: {
        "face-cream": "/new asset/skincare&facecare/moizturizing-cream.webp",
        "day-night-cream": "/new asset/skincare&facecare/day-and-night-cream.webp",
        "face-mask": "/new asset/skincare&facecare/brightening-mask.webp",
        "sunscreen": "/new asset/skincare&facecare/physical-sunscreen.webp",
        "cleansing": "/new asset/skincare&facecare/milk-cleanser.webp",
        "facial-wash": "/new asset/skincare&facecare/facial-wash.webp",
        "facial-toner": "/new asset/skincare&facecare/mois-facial-toner.webp",
        "facial-serum": "/new asset/skincare&facecare/serum-gel.webp",
      },
      decorative: {
        "make-up": "/new asset/make up/foundation.webp",
        "lipcare": "/new asset/lipcare/lip-matte.webp",
      },
      babycare: {
        "baby-wash": "/new asset/baby-care/baby-wash.webp",
        "baby-shampoo": "/new asset/baby-care/baby-shampoo.webp",
        "baby-lotion": "/new asset/baby-care/baby-lotion.webp",
        "baby-powder": "/new asset/baby-care/baby-powder.webp",
        "baby-cologne": "/new asset/baby-care/baby-cologne.webp",
      },
    };

    const rawImagePath = subCategoryHeroImageMap[categoryData.slug]?.[subCategorySlug!] || categoryData.heroImage || content.image;
    
    const getFormattedSubCategoryHeroImage = () => {
      if (rawImagePath) {
        if (rawImagePath.startsWith('http') || rawImagePath.startsWith('data:')) return rawImagePath;
        const encodedPath = rawImagePath.split('/').map(p => p.replace(/ /g, '%20')).join('/');
        return encodedPath.startsWith('/') ? encodedPath : `/${encodedPath}`;
      }
      return "";
    };
    const subCategoryHeroImage = getFormattedSubCategoryHeroImage();

    // Generate a slightly lighter shade for gradient
    const lightenColor = (hex: string, percent: number) => {
      const num = parseInt(hex.replace('#', ''), 16);
      const r = Math.min(255, (num >> 16) + Math.round(255 * percent));
      const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(255 * percent));
      const b = Math.min(255, (num & 0x0000FF) + Math.round(255 * percent));
      return `rgb(${r}, ${g}, ${b})`;
    };

    const certLabel = categoryData.slug === 'pkrt' ? 'KEMENKES RI' : 'BPOM RI';

    const subCategoryCopyMap: Record<string, Record<string, { smallTitle: string; headline: React.ReactNode; description: string; ctaText?: string }>> = {
      skincare: {
        // Subcategory: Face Cream
        "face-cream": {
          smallTitle: "MAKLON FACE CREAM PREMIUM",
          headline: "Jasa Maklon Face Cream BPOM dan Halal",
          description: "Jasa maklon face cream terlengkap di Indonesia. Dari day cream, night cream, moisturizing, brightening, hingga eye cream — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk hidrasi, regenerasi, dan perlindungan kulit wajah.",
          ctaText: "LIHAT PRODUCT"
        },
        "day-night-cream": {
          smallTitle: "MAKLON DAY & NIGHT CREAM BPOM & HALAL",
          headline: "Jasa Maklon Day Cream & Night Cream BPOM dan Halal",
          description: "Ingin punya brand day cream & night cream sendiri? Dreamlab adalah solusi Anda untuk mengembangkan face cream — day cream SPF, night cream repair, anti-aging, hingga brightening — dengan formula terpisah untuk kebutuhan kulit di siang dan malam hari.",
          ctaText: "LIHAT PRODUCT"
        },
        "moisturizing-cream": {
          smallTitle: "MAKLON MOISTURIZING CREAM BPOM & HALAL",
          headline: "Jasa Maklon Moisturizing Cream BPOM dan Halal",
          description: "Jasa maklon moisturizing cream terlengkap di Indonesia. Dari gel-based hingga cream-based — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk hidrasi mendalam dan menjaga skin barrier.",
          ctaText: "LIHAT PRODUCT"
        },
        "brightening-cream": {
          smallTitle: "MAKLON BRIGHTENING CREAM BPOM & HALAL",
          headline: "Jasa Maklon Brightening Cream BPOM dan Halal",
          description: "Jasa maklon brightening cream terlengkap di Indonesia. Dari niacinamide hingga alpha arbutin — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk kulit cerah merata dan bercahaya.",
          ctaText: "LIHAT PRODUCT"
        },
        "eye-cream": {
          smallTitle: "MAKLON EYE CREAM BPOM & HALAL",
          headline: "Jasa Maklon Eye Cream BPOM dan Halal",
          description: "Jasa maklon eye cream terlengkap di Indonesia. Diformulasikan untuk mengatasi mata panda, kantung mata, dan garis halus di area mata. Semua bisa dikustomisasi sesuai konsep brand Anda.",
          ctaText: "LIHAT PRODUCT"
        },
        // Subcategory: Face Mask
        "face-mask": {
          smallTitle: "MAKLON MASKER WAJAH PREMIUM",
          headline: "Jasa Maklon Masker Wajah BPOM dan Halal",
          description: "Jasa maklon masker wajah terlengkap di Indonesia. Dari sheet mask, clay mask, peel-off mask, hingga sleeping mask - semua bisa diformulasikan custom sesuai konsep brand Anda.",
          ctaText: "LIHAT PRODUCT"
        },
        "peel-off-mask": {
          smallTitle: "MAKLON PEEL OFF MASK BPOM & HALAL",
          headline: "Jasa Maklon Masker Wajah BPOM dan Halal",
          description: "Jasa maklon peel-off mask terlengkap di Indonesia. Dari brightening hingga anti-acne — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk membersihkan pori-pori dan mengangkat sel kulit mati.",
          ctaText: "LIHAT PRODUCT"
        },
        "brightening-mask": {
          smallTitle: "MAKLON BRIGHTENING MASK BPOM & HALAL",
          headline: "Jasa Maklon Masker Wajah BPOM dan Halal",
          description: "Jasa maklon brightening mask terlengkap di Indonesia. Dari sheet mask hingga wash-off mask — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk kulit cerah merata dan bercahaya.",
          ctaText: "LIHAT PRODUCT"
        },
        "wash-off-mask": {
          smallTitle: "MAKLON WASH OFF MASK BPOM & HALAL",
          headline: "Jasa Maklon Masker Wajah BPOM dan Halal",
          description: "Jasa maklon wash-off mask terlengkap di Indonesia. Dari clay mask hingga foam mask — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk membersihkan dan merawat kulit wajah secara mendalam.",
          ctaText: "LIHAT PRODUCT"
        },
        "sleeping-mask": {
          smallTitle: "MAKLON SLEEPING MASK BPOM & HALAL",
          headline: "Jasa Maklon Masker Wajah BPOM dan Halal",
          description: "Jasa maklon sleeping mask terlengkap di Indonesia. Dari hydrating hingga brightening — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk regenerasi kulit sepanjang malam.",
          ctaText: "LIHAT PRODUCT"
        },
        // Subcategory: Sunscreen
        "sunscreen": {
          smallTitle: "MAKLON SUNSCREEN PREMIUM",
          headline: "Jasa Maklon Sunscreen Wajah BPOM dan Halal",
          description: "Jasa maklon sunscreen terlengkap di Indonesia. Semua sunscreen bisa diformulasikan custom sesuai konsep brand Anda. Dengan bersertifikat CPKB Grade A, BPOM RI, dan Halal MUI.",
          ctaText: "LIHAT PRODUCT"
        },
        "physical-sunscreen": {
          smallTitle: "MAKLON PHYSICAL SUNSCREEN BPOM & HALAL",
          headline: "Jasa Maklon Sunscreen Wajah BPOM dan Halal",
          description: "Jasa maklon physical sunscreen terlengkap di Indonesia. Dari zinc oxide hingga titanium dioxide — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk perlindungan aktif tanpa iritasi.",
          ctaText: "LIHAT PRODUCT"
        },
        "chemical-sunscreen": {
          smallTitle: "MAKLON CHEMICAL SUNSCREEN BPOM & HALAL",
          headline: "Jasa Maklon Sunscreen Wajah BPOM dan Halal",
          description: "Jasa maklon chemical sunscreen terlengkap di Indonesia. Dari SPF 30 hingga SPF 50+ — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan dengan tekstur ringan dan nyaman di kulit.",
          ctaText: "LIHAT PRODUCT"
        },
        "hybrid-sunscreen": {
          smallTitle: "MAKLON HYBRID SUNSCREEN BPOM & HALAL",
          headline: "Jasa Maklon Sunscreen Wajah BPOM dan Halal",
          description: "Jasa maklon hybrid sunscreen terlengkap di Indonesia. Kombinasi physical dan chemical filter — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk perlindungan optimal dengan tekstur nyaman.",
          ctaText: "LIHAT PRODUCT"
        },
        "tone-up-sunscreen": {
          smallTitle: "MAKLON TONE UP SUNSCREEN BPOM & HALAL",
          headline: "Jasa Maklon Sunscreen Wajah BPOM dan Halal",
          description: "Jasa maklon tone up sunscreen terlengkap di Indonesia. Dari pink hingga green — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk skin tone up effect tanpa white cast.",
          ctaText: "LIHAT PRODUCT"
        },
        "sunscreen-gel": {
          smallTitle: "MAKLON SUNSCREEN GEL BPOM & HALAL",
          headline: "Jasa Maklon Sunscreen Wajah BPOM dan Halal",
          description: "Jasa maklon sunscreen gel terlengkap di Indonesia. Tekstur ringan dan cepat menyerap — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk penggunaan sehari-hari tanpa efek lengket.",
          ctaText: "LIHAT PRODUCT"
        },
        // Subcategory: Cleansing
        "cleansing": {
          smallTitle: "MAKLON PEMBERSIH WAJAH PREMIUM",
          headline: "Jasa Maklon Cleansing BPOM dan Halal",
          description: "Ingin punya brand cleansing series sendiri? Dreamlab adalah solusi Anda untuk mengembangkan rangkaian pembersih wajah — cleansing oil, cleansing balm, micellar water, milk cleanser, hingga makeup remover — dengan formula mild dan non-irritasi untuk sistem double cleanse yang sempurna.",
          ctaText: "LIHAT PRODUCT"
        },
        "face-cleansing-oil": {
          smallTitle: "MAKLON FACE CLEANSING OIL BPOM & HALAL",
          headline: "Jasa Maklon Cleansing BPOM dan Halal",
          description: "Jasa maklon face cleansing oil terlengkap di Indonesia. Dari oil-based hingga balmy — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk membersihkan makeup dan kotoran tanpa mengeringkan kulit.",
          ctaText: "LIHAT PRODUCT"
        },
        "milk-cleanser": {
          smallTitle: "MAKLON MILK CLEANSER BPOM & HALAL",
          headline: "Jasa Maklon Cleansing BPOM dan Halal",
          description: "Jasa maklon milk cleanser terlengkap di Indonesia. Dari micellar hingga creamy cleanser — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk membersihkan lembut tanpa merusak skin barrier.",
          ctaText: "LIHAT PRODUCT"
        },
        "cleansing-balm": {
          smallTitle: "MAKLON CLEANSING BALM BPOM & HALAL",
          headline: "Jasa Maklon Cleansing BPOM dan Halal",
          description: "Jasa maklon cleansing balm terlengkap di Indonesia. Tekstur padat meleleh jadi minyak — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk membersihkan waterproof makeup hingga skincare heaviest.",
          ctaText: "LIHAT PRODUCT"
        },
        "cleansing-oil": {
          smallTitle: "MAKLON CLEANSING OIL BPOM & HALAL",
          headline: "Jasa Maklon Cleansing BPOM dan Halal",
          description: "Jasa maklon cleansing oil terlengkap di Indonesia. Dari double cleanse hingga oil cleanser — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk cleansing dan hidrasi seimbang.",
          ctaText: "LIHAT PRODUCT"
        },
        // Subcategory: Facial Wash
        "facial-wash": {
          smallTitle: "MAKLON SABUN WAJAH PREMIUM",
          headline: "Jasa Maklon Sabun Wajah BPOM dan Halal",
          description: "Jasa maklon facial wash terlengkap di Indonesia. Semua facial wash bisa diformulasikan custom sesuai konsep brand Anda. Diproduksi dengan standar kualitas tinggi, legalitas BPOM, dan sertifikasi Halal.",
          ctaText: "LIHAT PRODUCT"
        },
        "acne-facial-wash": {
          smallTitle: "MAKLON ACNE FACIAL WASH BPOM & HALAL",
          headline: "Jasa Maklon Sabun Wajah BPOM dan Halal",
          description: "Jasa maklon acne facial wash terlengkap di Indonesia. Dari salicylic acid hingga tea tree oil — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk mengatasi jerawat dan mengontrol sebum.",
          ctaText: "LIHAT PRODUCT"
        },
        "brightening-facial-wash": {
          smallTitle: "MAKLON BRIGHTENING FACIAL WASH BPOM & HALAL",
          headline: "Jasa Maklon Sabun Wajah BPOM dan Halal",
          description: "Jasa maklon brightening facial wash terlenglop di Indonesia. Dari vitamin C hingga niacinamide — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk kulit cerah dan berseri.",
          ctaText: "LIHAT PRODUCT"
        },
        "moisturizing-facial-wash": {
          smallTitle: "MAKLON MOISTURIZING FACIAL WASH BPOM & HALAL",
          headline: "Jasa Maklon Sabun Wajah BPOM dan Halal",
          description: "Jasa maklon moisturizing facial wash terlengkap di Indonesia. Formula gentle dan rendah surfactant — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk membersihkan tanpa mengeringkan kulit.",
          ctaText: "LIHAT PRODUCT"
        },
        // Subcategory: Facial Toner
        "facial-toner": {
          smallTitle: "MAKLON TONER WAJAH PREMIUM",
          headline: "Jasa Maklon Toner Wajah BPOM dan Halal",
          description: "Jasa maklon facial toner dengan custom formula sesuai kebutuhan brand skincare Anda. Diproduksi dengan standar kualitas tinggi, legalitas BPOM, dan sertifikasi Halal.",
          ctaText: "LIHAT PRODUCT"
        },
        "acne-facial-toner": {
          smallTitle: "MAKLON ACNE FACIAL TONER BPOM & HALAL",
          headline: "Jasa Maklon Toner Wajah BPOM dan Halal",
          description: "Jasa maklon acne facial toner terlengkap di Indonesia. Dari BHA hingga niacinamide — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk mengontrol sebum dan mengecilkan pori.",
          ctaText: "LIHAT PRODUCT"
        },
        "moisturizing-facial-toner": {
          smallTitle: "MAKLON MOISTURIZING FACIAL TONER BPOM & HALAL",
          headline: "Jasa Maklon Toner Wajah BPOM dan Halal",
          description: "Jasa maklon moisturizing facial toner terlengkap di Indonesia. Dari hyaluronic acid hingga aloe vera — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk hidrasi tambahan setelah cleansing.",
          ctaText: "LIHAT PRODUCT"
        },
        "brightening-facial-toner": {
          smallTitle: "MAKLON BRIGHTENING FACIAL TONER BPOM & HALAL",
          headline: "Jasa Maklon Toner Wajah BPOM dan Halal",
          description: "Jasa maklon brightening facial toner terlengkap di Indonesia. Dari vitamin C hingga tranexamic acid — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk menyamarkan noda dan brightening kulit.",
          ctaText: "LIHAT PRODUCT"
        },
        // Subcategory: Facial Serum
        "facial-serum": {
          smallTitle: "MAKLON SERUM WAJAH PREMIUM",
          headline: "Jasa Maklon Serum Wajah BPOM dan Halal",
          description: "Jasa maklon serum wajah dengan custom formula sesuai kebutuhan brand skincare Anda. Diproduksi dengan standar kualitas tinggi, legalitas BPOM, dan sertifikasi Halal.",
          ctaText: "LIHAT PRODUCT"
        },
        "serum-gel": {
          smallTitle: "MAKLON SERUM GEL BPOM & HALAL",
          headline: "Jasa Maklon Serum Wajah BPOM dan Halal",
          description: "Jasa maklon serum gel terlengkap di Indonesia. Tekstur ringan cepat menyerap — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan dengan bahan aktif konsentrasi tinggi untuk hasil nyata.",
          ctaText: "LIHAT PRODUCT"
        },
        "radiant-advance-serum": {
          smallTitle: "MAKLON ADVANCE SERUM BPOM & HALAL",
          headline: "Jasa Maklon Serum Wajah BPOM dan Halal",
          description: "Jasa maklon advance serum terlengkap di Indonesia. Dari anti-aging hingga brightening — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan dengan teknologi canggih untuk hasil premium.",
          ctaText: "LIHAT PRODUCT"
        },
        "acne-serum": {
          smallTitle: "MAKLON ACNE SERUM BPOM & HALAL",
          headline: "Jasa Maklon Serum Wajah BPOM dan Halal",
          description: "Jasa maklon acne serum terlengkap di Indonesia. Dari niacinamide hingga salicylic acid — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk mengatasi jerawat dan bekas jerawat.",
          ctaText: "LIHAT PRODUCT"
        },
        "peeling-serum": {
          smallTitle: "MAKLON PEELING SERUM BPOM & HALAL",
          headline: "Jasa Maklon Serum Wajah BPOM dan Halal",
          description: "Jasa maklon peeling serum (AHA/BHA) terlengkap di Indonesia. Dari mild hingga strong exfoliation — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk regenerasi kulit dan mengatasi tekstur tidak rata.",
          ctaText: "LIHAT PRODUCT"
        },
        // Standalone skincare products
        "acne-cream": {
          smallTitle: "MAKLON KRIM JERAWAT BPOM & HALAL",
          headline: "Jasa Maklon Krim Jerawat BPOM dan Halal",
          description: "Jasa maklon acne cream terlengkap di Indonesia. Dari benzoil peroksida hingga tea tree oil — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk mengatasi jerawat ringan hingga sedang.",
          ctaText: "LIHAT PRODUCT"
        },
      },
      decorative: {
        "make-up": {
          smallTitle: "MAKLON MAKE UP PREMIUM",
          headline: "Jasa Maklon Make Up BPOM dan Halal",
          description: "Ingin punya brand make up sendiri? Dreamlab adalah solusi Anda untuk mengembangkan rangkaian kosmetik dekoratif — dari foundation, cushion, mascara, cream blush, liquid blush, hingga highlighter — dengan formula pigmented dan tahan lama yang pas untuk iklim Indonesia.",
          ctaText: "LIHAT PRODUCT"
        },
        "lipcare": {
          smallTitle: "MAKLON PERAWATAN BIBIR PREMIUM",
          headline: "Jasa Maklon Perawatan Bibir BPOM dan Halal",
          description: "Ingin punya brand perawatan bibir sendiri? Dreamlab adalah solusi Anda untuk mengembangkan rangkaian lip care — dari lip matte, lip gloss, lip cream, lip balm, lip serum, hingga lip scrub — dengan formula moisturizing dan long-lasting yang aman di bibir.",
          ctaText: "LIHAT PRODUCT"
        },
        // Decorative sub-products
        "liquid-foundation": {
          smallTitle: "MAKLON LIQUID FOUNDATION BPOM & HALAL",
          headline: "Jasa Maklon Foundation BPOM dan Halal",
          description: "Jasa maklon liquid foundation terlengkap di Indonesia. Dari sheer hingga full coverage — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan dengan coverage dan ketahanan yang pas untuk iklim Indonesia.",
          ctaText: "LIHAT PRODUCT"
        },
        "cushion-foundation": {
          smallTitle: "MAKLON CUSHION FOUNDATION BPOM & HALAL",
          headline: "Jasa Maklon Foundation BPOM dan Halal",
          description: "Jasa maklon cushion foundation terlengkap di Indonesia. Format praktis dan mudah dibawa — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk aplikasi ringan dan natural finish.",
          ctaText: "LIHAT PRODUCT"
        },
        "loose-powder": {
          smallTitle: "MAKLON LOOSE POWDER BPOM & HALAL",
          headline: "Jasa Maklon Make Up BPOM dan Halal",
          description: "Jasa maklon loose powder terlengkap di Indonesia. Dari setting hingga finishing — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan untuk tampilan matte atau dewy sesuai kebutuhan.",
          ctaText: "LIHAT PRODUCT"
        },
        "bb-cream": {
          smallTitle: "MAKLON BB CREAM BPOM & HALAL",
          headline: "Jasa Maklon BB Cream BPOM dan Halal",
          description: "Jasa maklon BB cream terlengkap di Indonesia. Dari tinted moisturizer hingga coverage enhancer — semua bisa diformulasikan custom sesuai konsep brand Anda. Diformulasikan sebagai base ringan dengan sentuhan perawatan.",
          ctaText: "LIHAT PRODUCT"
        },
      },
    };

    const subCategoryCopy = subCategoryCopyMap[categoryData.slug]?.[subCategorySlug!] || {
      smallTitle: `MAKLON ${categoryData.name.toUpperCase()} PREMIUM`,
      headline: `Jasa Maklon ${categoryData.name} BPOM dan Halal`,
      description: `Ingin punya brand ${categoryData.name.toLowerCase()} sendiri? Dreamlab adalah solusi Anda untuk mengembangkan produk ${categoryData.name.toLowerCase()} dengan formula custom sesuai kebutuhan brand Anda.`,
      ctaText: "LIHAT PRODUCT"
    };

    const subData = categoryData.subCategories?.find(s => s.slug === subCategorySlug);
    const variantCount = subData?.products?.length || categoryData.products?.length || 0;

    return (
      <section 
        className="relative min-h-[650px] lg:min-h-[750px] flex items-center overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28"
        style={{ 
          background: `linear-gradient(135deg, #FAF9F6 0%, ${vividBgColor}55 50%, ${vividBgColor}77 100%)`
        }}
      >
        {/* ── Atmospheric Background Layers ── */}
        {/* Large soft glow orbs using a transparent opacity hex version of category colors */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[20%] -right-[15%] w-[600px] h-[600px] rounded-full opacity-[0.25]" 
            style={{ background: `radial-gradient(circle, ${vividBgColor}44 0%, transparent 70%)` }} />
          <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full opacity-[0.2]" 
            style={{ background: `radial-gradient(circle, ${vividBgColor}33 0%, transparent 70%)` }} />
        </div>

        {/* Subtle dot pattern overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #212120 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Diagonal accent line */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isLightBg ? 0.08 : 0.06 }}
          transition={{ delay: 1.5, duration: 1.5 }}
          className={`absolute top-0 right-0 w-[1px] h-[150%] origin-top-right rotate-[25deg] hidden lg:block ${isLightBg ? 'bg-[#212120]' : 'bg-white'}`}
          style={{ right: '42%' }}
        />

        <div className="container-custom relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-8 items-center">
            
            {/* ── Left Column: Text Content ── */}
            <div className="order-2 lg:order-1 space-y-6">
              
              {/* Category Label Pill */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-md ${
                  isLightBg 
                    ? 'bg-[#212120]/[0.05] border-[#212120]/15' 
                    : 'bg-white/[0.08] border-white/[0.15]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                <span className={`text-[9px] lg:text-[10px] font-black uppercase tracking-[0.25em] font-onest ${
                  isLightBg ? 'text-[#212120]/90' : 'text-white/90'
                }`}>
                  {"MAKLON JUARANYA FORMULA"}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className={`text-[26px] sm:text-[32px] md:text-[38px] lg:text-[44px] xl:text-[50px] font-normal leading-[1.08] tracking-tight uppercase ${
                  isLightBg ? 'text-[#212120]' : 'text-white'
                }`}
              >
                {subCategoryCopy.headline}
              </motion.h1>

              {/* Accent Divider */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
                className="h-[3px] bg-brand-orange rounded-full"
              />

              {/* Description */}
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className={`text-[13px] sm:text-sm lg:text-[15px] xl:text-base font-medium leading-[1.7] max-w-lg ${
                  isLightBg ? 'text-[#212120]/75' : 'text-white/70'
                }`}
              >
                {subCategoryCopy.description}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row items-start gap-4 pt-1"
              >
                <motion.a
                  href={waUrl}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className={`group relative w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-brand-orange text-white font-bold py-4 px-10 rounded-2xl transition-all duration-500 shadow-[0_8px_32px_rgba(246,145,30,0.35)] ${
                    isLightBg 
                      ? 'hover:bg-[#212120] hover:text-white hover:shadow-[0_8px_32px_rgba(33,33,32,0.15)]' 
                      : 'hover:bg-white hover:text-[#212120] hover:shadow-[0_8px_32px_rgba(255,255,255,0.25)]'
                  }`}
                >
                  <span className="uppercase tracking-[0.2em] text-[10px] font-onest">{subCategoryCopy.ctaText || "LIHAT PRODUCT"}</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.a>
              </motion.div>
            </div>

            {/* ── Right Column: Premium Product Showcase ── */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
              
              {/* Decorative Background Shapes */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                {/* Outer soft ring */}
                <div className={`absolute w-[340px] h-[340px] sm:w-[380px] sm:h-[380px] md:w-[460px] md:h-[460px] lg:w-[500px] lg:h-[500px] xl:w-[560px] xl:h-[560px] rounded-full border ${
                  isLightBg ? 'border-[#212120]/[0.08]' : 'border-white/[0.08]'
                }`} />
                {/* Inner dashed ring */}
                <div className={`absolute w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[390px] md:h-[390px] lg:w-[420px] lg:h-[420px] xl:w-[480px] xl:h-[480px] rounded-full border border-dashed ${
                  isLightBg ? 'border-[#212120]/[0.06]' : 'border-dashed border-white/[0.06]'
                }`} />
              </motion.div>

              {/* Glow behind product */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1.5 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className={`w-[250px] h-[250px] md:w-[320px] md:h-[320px] lg:w-[360px] lg:h-[360px] rounded-full ${isLightBg ? 'opacity-[0.25]' : 'opacity-20'}`}
                  style={{ background: isLightBg ? `radial-gradient(circle, #DFD0BC 0%, transparent 70%)` : `radial-gradient(circle, white 0%, transparent 70%)` }}
                />
              </motion.div>

              {/* Product Image Container */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10"
              >
                {/* Glassmorphic backdrop card */}
                <div className={`relative w-[280px] h-[320px] sm:w-[320px] sm:h-[360px] md:w-[400px] md:h-[440px] lg:w-[430px] lg:h-[470px] xl:w-[470px] xl:h-[510px] rounded-[2.5rem] backdrop-blur-sm border shadow-[0_30px_80px_rgba(0,0,0,0.12)] overflow-hidden ${
                  isLightBg 
                    ? 'bg-white/35 border-white/45' 
                    : 'bg-white/[0.07] border-white/[0.12]'
                }`}>
                  
                  {/* Inner highlight shimmer */}
                  <div className={`absolute inset-0 bg-gradient-to-br pointer-events-none ${
                    isLightBg 
                      ? 'from-white/30 via-transparent to-white/10' 
                      : 'from-white/[0.08] via-transparent to-white/[0.03]'
                  }`} />
                  
                  {/* Product Image wrapped in breathing motion.div */}
                  <motion.div 
                    animate={{
                      y: [0, -10, 0]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 flex items-center justify-center p-8 md:p-10"
                  >
                    <div className="relative w-full h-full">
                      {subCategoryHeroImage ? (
                        <Image 
                          src={subCategoryHeroImage}
                          alt={productImageAlt(categoryData.slug, categoryData.slug, categoryData.name)}
                          title={productImageTitle(categoryData.slug, categoryData.slug, categoryData.name)}
                          fill
                          priority
                          fetchPriority="high"
                          decoding="sync"
                          className="object-contain drop-shadow-[0_15px_40px_rgba(0,0,0,0.2)]"
                          sizes="(max-width: 768px) 320px, (max-width: 1024px) 400px, 470px"

                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100/50 rounded-xl" />
                      )}
                    </div>
                  </motion.div>

                  {/* Corner accent lines */}
                  <div className={`absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 rounded-tl-xl ${isLightBg ? 'border-[#212120]/15' : 'border-white/15'}`} />
                  <div className={`absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 rounded-br-xl ${isLightBg ? 'border-[#212120]/15' : 'border-white/15'}`} />
                </div>

                {/* Clean Image Card - Badges Removed for Elegant Focus */}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY PAGE HERO — Original fullscreen background image layout
  // ═══════════════════════════════════════════════════════════════════
  return (
    <section className="relative min-h-[600px] lg:min-h-screen xl:min-h-[800px] flex items-center overflow-hidden bg-white pt-24 pb-16 lg:pt-36 lg:pb-24">
      {/* 1. Cinematic Background Visual - Optimized for 100% Crystal Sharpness */}
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
          src={isMobile && content.mobileImage ? content.mobileImage : content.image}
          alt={productImageAlt(categoryData.slug, categoryData.slug, title)}
          title={productImageTitle(categoryData.slug, categoryData.slug, title)}
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
        
        {/* 2. Surgical White Halo - Soft gradients to protect visual clarity while maintaining text legibility */}
        {/* Desktop: Elegant left-to-right gradient overlay that completely leaves the right-side visual crisp and clean */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.0 }}
          className="absolute inset-0 bg-gradient-to-r from-white/55 via-white/20 to-transparent z-10 hidden lg:block" 
        />
        {/* Mobile: Ultra-soft radial center to prevent "foggy" effect on background products */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.0 }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.45)_0%,transparent_95%)] lg:hidden z-10" 
        />
      </motion.div>

      <div className="container-custom relative z-20 w-full">
        <div className="max-w-2xl lg:max-w-3xl">

          {/* 3. Authority Badge - Staggered */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="inline-flex items-center gap-3 px-3 py-1 bg-brand-orange/5 rounded-full mb-2.5 md:mb-4 border border-brand-orange/20 backdrop-blur-sm"
          >
            <span className="w-1 h-1 rounded-full bg-brand-orange" />
            <span className="text-[9px] lg:text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] font-onest">
              {"MAKLON JUARANYA FORMULA"}
            </span>
          </motion.div>

          {/* 4. Headline - Staggered with subtle text-lift and adaptive font-size based on product page */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={`font-normal text-[#212120] mb-3 md:mb-4 leading-[1.1] tracking-tight uppercase ${
              isProductPage 
                ? "text-[24px] sm:text-[32px] md:text-[40px] lg:text-[44px] xl:text-[48px]" 
                : "text-[28px] sm:text-[38px] md:text-[48px] lg:text-[64px] xl:text-[72px]"
            }`}
            style={{ textShadow: '0 0 30px rgba(255,255,255,0.8)' }}
          >
            {content.headline}
          </motion.h1>

          {/* 5. Subheadline - Staggered and scaled dynamically */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
            className={`text-xs sm:text-sm text-[#212120]/80 lg:text-[#212120]/70 font-medium leading-relaxed mb-6 md:mb-8 max-w-xl ${
              isProductPage 
                ? "lg:text-[14px] xl:text-[16px]" 
                : "lg:text-[18px] xl:text-[20px]"
            }`}
            style={{ textShadow: '0 0 20px rgba(255,255,255,0.5)' }}
          >
            {content.description}
          </motion.p>

          {/* 6. CTA - Staggered */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6"
          >
            <a
              href={waUrl}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-brand-orange hover:bg-[#212120] text-white font-bold py-4 px-10 rounded-xl transition-all duration-500 shadow-[0_15px_30px_rgba(246,145,30,0.15)] hover:-translate-y-1"
            >
                  <span className="uppercase tracking-[0.2em] text-[10px] font-onest">{content.ctaText || "FREE KONSULTASI BISNIS"}</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

            {content.microCTA && (
              <button className="text-[10px] font-black text-[#212120] uppercase tracking-[0.3em] hover:text-brand-orange transition-colors border-b-2 border-brand-orange/30 pb-1">
                {content.microCTA}
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Subtle Bottom Fade */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 1 }}
        className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F9F7F2] to-transparent z-10" 
      />
    </section>
  );
}