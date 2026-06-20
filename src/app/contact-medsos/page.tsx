import { Metadata } from "next";
import { getSEOData } from "@/lib/seo-service";
import LinktreePage from "@/components/LinktreePage";

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSEOData("/contact-medsos");
  const canonicalUrl = "https://dreamlab.id/contact-medsos/";
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

export default function ContactMedsos() {
  return (
    <LinktreePage
      waMessage="Saya mengetahui dari media sosial dan ingin konsultasi produk lebih lanjut."
      waThankyouUrl="/ads/thankyou-medsos/?skip_wa=1"
    />
  );
}
