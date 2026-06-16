import { Metadata } from "next";
import { getSEOData } from "@/lib/seo-service";
import LinktreePage from "@/components/LinktreePage";

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSEOData("/links");
  const canonicalUrl = "https://dreamlab.id/links/";
  const title = seoData?.meta_title || "Dreamlab Indonesia | Layanan Maklon Kosmetik & Parfum Premium";
  const description = seoData?.meta_description || "Hubungi kami via WhatsApp untuk konsultasi maklon kosmetik gratis dan cepat, serta temukan layanan maklon skincare, parfum, hair care, dan body care premium.";

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalUrl },
    robots: "index, follow",
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      locale: "id_ID",
      type: "website",
      siteName: "Dreamlab Indonesia",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function Links() {
  return <LinktreePage />;
}
