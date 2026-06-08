import { notFound } from "next/navigation";
import { getProductDataV2 } from "@/data/products-v2";
import { getCategoryTitle, getCategoryMetaDescription } from "@/data/keywords";
import { getMaklonPage, getMaklonPageTitle, getMaklonPageDescription, maklonPages } from "@/data/maklon-pages";
import { ProductPageV2 } from "@/components/ProductPageV2";
import ProductFAQ from "@/components/ProductPageV2/ProductFAQ";
import CtaSection from "@/components/CtaSection";

type Props = {
  params: Promise<{ category: string }>;
};

const maklonCategoryMap: Record<string, { categorySlug: string; subCategorySlug?: string; productSlug?: string }> = {
  // Skincare
  "day-night-cream": { categorySlug: "skincare", subCategorySlug: "day-night-cream" },
  "masker-wajah": { categorySlug: "skincare", subCategorySlug: "face-mask" },
  "sunscreen": { categorySlug: "skincare", subCategorySlug: "sunscreen" },
  "cleansing-series": { categorySlug: "skincare", subCategorySlug: "cleansing" },
  "facial-wash": { categorySlug: "skincare", subCategorySlug: "facial-wash" },
  "facial-toner": { categorySlug: "skincare", subCategorySlug: "facial-toner" },
  "serum-wajah": { categorySlug: "skincare", subCategorySlug: "facial-serum" },
  // Body Care
  "massage-oil": { categorySlug: "bodycare", productSlug: "massage-oil" },
  "body-butter": { categorySlug: "bodycare", productSlug: "body-butter" },
  "body-scrub": { categorySlug: "bodycare", productSlug: "body-scrub" },
  "anti-bacterial-soap": { categorySlug: "bodycare", productSlug: "anti-bacterial-soap" },
  "shower-gel": { categorySlug: "bodycare", productSlug: "shower-gel" },
  "bath-salt": { categorySlug: "bodycare", productSlug: "bath-salt" },
  "sabun-organik": { categorySlug: "bodycare", productSlug: "sabun-organik" },
  "body-serum": { categorySlug: "bodycare", productSlug: "body-serum" },
  "sabun-transparan": { categorySlug: "bodycare", productSlug: "sabun-transparan" },
  "sabun-whitening": { categorySlug: "bodycare", productSlug: "sabun-whitening" },
  "sabun-batang": { categorySlug: "bodycare", productSlug: "sabun-batang" },
  "massage-cream": { categorySlug: "bodycare", productSlug: "massage-cream" },
  "soothing-gel": { categorySlug: "bodycare", productSlug: "soothing-gel" },
  "neck-cream": { categorySlug: "bodycare", productSlug: "neck-cream" },
  // Baby Care
  "baby-2in1-wash": { categorySlug: "babycare", productSlug: "baby-2in1-wash" },
  "baby-moisturizer": { categorySlug: "babycare", productSlug: "baby-moisturizer" },
  "baby-shampoo": { categorySlug: "babycare", productSlug: "baby-shampoo" },
  "baby-cologne": { categorySlug: "babycare", productSlug: "baby-cologne" },
  // Foot Care
  "foot-cream": { categorySlug: "footcare", productSlug: "foot-cream" },
  "foot-scrub": { categorySlug: "footcare", productSlug: "foot-scrub" },
  "foot-spray": { categorySlug: "footcare", productSlug: "foot-spray" },
  "foot-soak": { categorySlug: "footcare", productSlug: "foot-soak" },
  "foot-serum": { categorySlug: "footcare", productSlug: "foot-serum" },
  // Hair Care
  "shampoo": { categorySlug: "haircare", productSlug: "shampoo" },
  "hair-conditioner": { categorySlug: "haircare", productSlug: "hair-conditioner" },
  "hair-mask": { categorySlug: "haircare", productSlug: "hair-mask" },
  "hair-tonic": { categorySlug: "haircare", productSlug: "hair-tonic" },
  "hair-gel": { categorySlug: "haircare", productSlug: "hair-gel" },
  "pomade": { categorySlug: "haircare", productSlug: "pomade" },
  "scalp-care": { categorySlug: "haircare", productSlug: "scalp-care" },
  "beard-serum": { categorySlug: "haircare", productSlug: "beard-serum" },
  // Parfum
  "body-mist": { categorySlug: "parfum", productSlug: "body-mist" },
  "eau-de-cologne": { categorySlug: "parfum", productSlug: "eau-de-cologne" },
  "eau-de-toilette": { categorySlug: "parfum", productSlug: "eau-de-toilette" },
  "eau-de-parfum": { categorySlug: "parfum", productSlug: "eau-de-parfum" },
  "extrait-de-parfum": { categorySlug: "parfum", productSlug: "extrait-de-parfum" },
  "minyak-atsiri": { categorySlug: "parfum", productSlug: "minyak-atsiri" },
  // Decorative Makeup
  "highlighter": { categorySlug: "decorative", productSlug: "highlighter" },
  "mascara": { categorySlug: "decorative", productSlug: "mascara" },
  "cream-blush": { categorySlug: "decorative", productSlug: "cream-blush" },
  "foundation-serum": { categorySlug: "decorative", productSlug: "foundation-serum" },
  "liquid-blush": { categorySlug: "decorative", productSlug: "liquid-blush" },
  "eyebrow-gel": { categorySlug: "decorative", productSlug: "eyebrow-gel" },
  "foundation": { categorySlug: "decorative", productSlug: "foundation" },
  "bb-cream": { categorySlug: "decorative", productSlug: "bb-cream" },
  "face-primer": { categorySlug: "decorative", productSlug: "face-primer" },
  // Lip Care
  "lip-cream": { categorySlug: "decorative", subCategorySlug: "lip-care", productSlug: "lip-cream" },
  "lip-serum": { categorySlug: "decorative", subCategorySlug: "lip-care", productSlug: "lip-serum" },
  "lip-balm": { categorySlug: "decorative", subCategorySlug: "lip-care", productSlug: "lip-balm" },
  "tinted-lip-balm": { categorySlug: "decorative", subCategorySlug: "lip-care", productSlug: "tinted-lip-balm" },
  "lip-gloss": { categorySlug: "decorative", subCategorySlug: "lip-care", productSlug: "lip-gloss" },
  "lip-scrub": { categorySlug: "decorative", subCategorySlug: "lip-care", productSlug: "lip-scrub" },
  "lip-matte": { categorySlug: "decorative", subCategorySlug: "lip-care", productSlug: "lip-matte" },
  "lip-blush": { categorySlug: "decorative", subCategorySlug: "lip-care", productSlug: "lip-blush" },
};

export default async function MaklonCategoryPage({ params }: Props) {
  const { category } = await params;
  const data = getProductDataV2(category);

  if (data) {
    return <ProductPageV2 data={data} />;
  }

  const maklonPage = getMaklonPage(category);
  if (!maklonPage) notFound();

  const mapped = maklonCategoryMap[category];
  const pageName = maklonPage.pageName;

  return (
    <main className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-b from-[#FDF8F3] to-white pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-onest text-[#1A1A1A] leading-tight">
            {pageName}
          </h1>
          <p className="mt-4 text-base md:text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            {maklonPage.description}
          </p>
        </div>
      </section>
      <ProductFAQ
        categorySlug={mapped?.categorySlug || "skincare"}
        categoryName={pageName}
        subCategorySlug={mapped?.subCategorySlug}
        productSlug={mapped?.productSlug}
      />
      <CtaSection title={`Wujudkan Brand ${pageName} Impian Anda dalam 3 Bulan`} />
    </main>
  );
}

export async function generateStaticParams() {
  return [
    { category: "skincare-face-care" },
    ...maklonPages.map((p) => ({ category: p.slug })),
  ];
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const data = getProductDataV2(category);

  if (data) {
    const canonicalUrl = `https://dreamlab.id/maklon/${category}/`;
    const description = getCategoryMetaDescription(data.name, data.description, category);
    const title = getCategoryTitle(category);

    return {
      title: { absolute: title },
      description,
      alternates: { canonical: canonicalUrl },
      robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        images: [{ url: data.heroImage, width: 1200, height: 630, alt: title }],
        locale: "id_ID", type: "website", siteName: "Dreamlab Indonesia",
      },
      twitter: { card: "summary_large_image", title, description, images: [data.heroImage] },
    };
  }

  const maklonPage = getMaklonPage(category);
  if (!maklonPage) return { title: "Halaman Tidak Ditemukan", robots: "noindex" };

  const canonicalUrl = `https://dreamlab.id/maklon/${category}/`;
  const title = getMaklonPageTitle(category);
  const description = getMaklonPageDescription(category);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalUrl },
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    openGraph: {
      title, description, url: canonicalUrl,
      images: [{ url: "/assets/images/og-maklon.jpg", width: 1200, height: 630, alt: title }],
      locale: "id_ID", type: "website", siteName: "Dreamlab Indonesia",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
