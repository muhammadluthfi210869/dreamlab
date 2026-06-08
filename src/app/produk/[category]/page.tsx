import { notFound } from "next/navigation";
import { getProductDataV2 } from "@/data/products-v2";
import { getCategoryTitle, getCategoryMetaDescription } from "@/data/keywords";
import { ProductPageV2 } from "@/components/ProductPageV2";

type Props = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const data = getProductDataV2(category);

  if (!data) {
    notFound();
  }

  return <ProductPageV2 data={data} />;
}

export async function generateStaticParams() {
  return [
    { category: "parfum" },
    { category: "skincare" },
    { category: "bodycare" },
    { category: "haircare" },
    { category: "babycare" },
    { category: "decorative" },
    { category: "footcare" },
    { category: "pkrt" },
  ];
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const data = getProductDataV2(category);

  if (!data) {
    return {
      title: "Kategori Tidak Ditemukan",
      robots: "noindex",
    };
  }

  const canonicalUrl = `https://dreamlab.id/produk/${category}/`;
  const description = getCategoryMetaDescription(data.name, data.description, category);
  const title = getCategoryTitle(category);

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [{
        url: data.heroImage,
        width: 1200,
        height: 630,
        alt: title,
      }],
      locale: "id_ID",
      type: "website",
      siteName: "Dreamlab Indonesia",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [data.heroImage],
    },
  };
}
