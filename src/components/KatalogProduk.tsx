import type { ReactNode } from "react";
import KatalogFloatingCarousel, {
  type KatalogCarouselItem,
} from "./KatalogFloatingCarousel";

interface KatalogProps {
  title?: string;
  categories?: {
    id: string;
    name: string;
    items: { name: string; src: string }[];
  }[];
  content?: {
    eyebrow: string;
    title: ReactNode;
    description: string;
    categories: typeof visualCategories;
  };
}

const visualCategories = [
  {
    id: "skincare",
    name: "Skincare",
    tag: "15+ Formula Premium",
    image: "/assets/images/catalog/skincare.jpg",
    subcategories: "Essence Toner • Face Serum • Moisturizer Cream • Gel Cleanser • Sunscreen",
    link: "/produk/skincare",
  },
  {
    id: "bodycare",
    name: "Body Care",
    tag: "20+ Formula Premium",
    image: "/assets/images/catalog/bodycare.jpg",
    subcategories: "Body Wash • Body Mask • Body Serum • Body Lotion • Body Scrub",
    link: "/produk/bodycare",
  },
  {
    id: "haircare",
    name: "Hair Care",
    tag: "10+ Formula Premium",
    image: "/assets/images/catalog/haircare.jpg",
    subcategories: "Bonding Shampoo • Hair Mask • Hair Serum • Hair Mist • No Wash Treatment",
    link: "/produk/haircare",
  },
  {
    id: "decorative",
    name: "Decorative (Makeup)",
    tag: "12+ Formula Premium",
    image: "/assets/images/catalog/decorative.jpg",
    subcategories: "Peptide Lip Treatment • Lip Matte • Lip Cream • Cushion • Foundation",
    link: "/produk/decorative",
  },
  {
    id: "babycare",
    name: "Baby Care",
    tag: "8+ Formula Premium",
    image: "/assets/images/catalog/babycare.jpg",
    subcategories: "Baby Hair & Body Wash • Baby Lotion • Baby Massage Oil • Baby Face Cream",
    link: "/produk/babycare",
  },
  {
    id: "parfum",
    name: "Parfum & Fragrance",
    tag: "15+ Signature Scent",
    image: "/assets/images/catalog/parfum.jpg",
    subcategories: "Extrait de Parfum • Eau de Parfum • Eau de Toilette • Body Mist",
    link: "/produk/parfum",
  },
  {
    id: "footcare",
    name: "Foot Care & Special Care",
    tag: "10+ Formula Premium",
    image: "/assets/images/catalog/footcare.jpg",
    subcategories: "Hydrating Foot Scrub • Foot Serum • Cooling Foot Gel • Foot Cream",
    link: "/produk/footcare",
  },
];

const CATEGORY_TAGLINES_ID: Record<string, string> = {
  skincare: "Formula glowing untuk brand skincare-mu",
  bodycare: "Perawatan tubuh dengan sensasi spa",
  haircare: "Solusi rambut sehat dari akar",
  decorative: "Warna yang jadi signature brand-mu",
  babycare: "Lembut & aman untuk kulit si kecil",
  parfum: "Aroma khas yang mudah diingat",
  footcare: "Perawatan kaki & produk spesial",
};

const CATEGORY_TAGLINES_EN: Record<string, string> = {
  skincare: "Glowing formulas for your skincare brand",
  bodycare: "Spa-inspired daily body care",
  haircare: "Healthy hair solutions from the root",
  decorative: "Signature shades for your makeup line",
  babycare: "Gentle & safe for delicate baby skin",
  parfum: "Memorable signature fragrances",
  footcare: "Specialized foot & targeted care",
};

export default function KatalogProduk({ content }: KatalogProps) {
  const categories = content?.categories || visualCategories;
  const isEn = Boolean(content);
  const taglines = isEn ? CATEGORY_TAGLINES_EN : CATEGORY_TAGLINES_ID;

  const carouselItems: KatalogCarouselItem[] = categories.map((category) => {
    const subItems = category.subcategories
      .split(/[•·]/)
      .map((s) => s.trim())
      .filter(Boolean);

    return {
      id: category.id,
      name: category.name,
      tag: category.tag,
      tagline: taglines[category.id] || "",
      image: category.image,
      variantsText: subItems.join(" · "),
      link: category.link,
      alt: isEn
        ? `${category.name} manufacturing service`
        : `Maklon ${category.name} Dreamlab`,
      title: isEn
        ? `${category.name} manufacturing service - Dreamlab`
        : `Maklon ${category.name} - Dreamlab Indonesia`,
      ariaLabel: isEn
        ? `View category ${category.name}`
        : `Lihat kategori ${category.name}`,
    };
  });

  return (
    <section
      id="katalog"
      className="pt-[72px] pb-[64px] lg:py-28 bg-[#FAF8F5] relative overflow-x-clip"
    >
      {/* Section Header (max-width 1280px, identical styling & copy) */}
      <div className="container-custom max-w-[1280px] relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-14 lg:mb-18">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-[#C86400] uppercase bg-[#FFF5E9] px-4 py-1.5 rounded-full mb-4 border border-[#F39200]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F39200]" />
            {content?.eyebrow || "Formulasi Eksklusif & CPKB Grade A"}
          </span>

          <h2 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight text-brand-black mb-5 uppercase">
            {content?.title || (
              <>
                Katalog Layanan <span className="text-brand-orange">Maklon Premium</span>
              </>
            )}
          </h2>

          <div className="h-1 w-16 bg-brand-orange mx-auto mb-5 rounded-full" />

          <p className="text-sm md:text-base text-neutral-600 leading-relaxed font-medium">
            {content?.description ||
              "Dari formulasi riset laboratorium (R&D) kustom, visualisasi desain branding eksklusif, hingga pendaftaran legalitas resmi BPOM, Halal, & HKI — kami mewujudkan brand kecantikan juara Anda."}
          </p>
        </div>
      </div>

      {/* Floating Panel Carousel */}
      <KatalogFloatingCarousel
        items={carouselItems}
        catalogHref={isEn ? "/en/produk/" : "/produk/"}
        viewAllLabel={isEn ? "View all catalog →" : "Lihat semua katalog →"}
      />
    </section>
  );
}
