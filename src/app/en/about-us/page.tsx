import type { Metadata } from "next";
import { PageSchema } from "@/components/PageSchema";
import CompanyProfileWrapper from "@/components/CompanyProfileWrapper";
import { buildAlternates } from "@/lib/seo-lang";
import { aboutDataEn, aboutSectionContentEn, ctaContentEn } from "@/data/en/site";

export const metadata: Metadata = {
  // Terjemahan setia dari metadata halaman About Us Indonesia.
  title: {
    absolute: "Dreamlab | Skincare & Perfume Manufacturing Services BPOM Indonesia",
  },
  description:
    "Dreamlab is a cosmetic manufacturing (maklon) factory in Surabaya trusted since 1989. We provide One-Stop Manufacturing Service: business consultation, custom formulation by the R&D team, packaging design.",
  alternates: buildAlternates("/en/about-us/"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Dreamlab",
    title: "Dreamlab | Skincare & Perfume Manufacturing Services BPOM Indonesia",
    description:
      "Dreamlab is a cosmetic manufacturing (maklon) factory in Surabaya trusted since 1989. We provide One-Stop Manufacturing Service.",
    url: "https://dreamlab.id/en/about-us/",
  },
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
};

export default function EnAboutPage() {
  return (
    <main className="min-h-screen bg-brand-white">
      <PageSchema
        url="https://dreamlab.id/en/about-us/"
        title="About Dreamlab | Skincare & Parfum Manufacturing BPOM"
        description="Dreamlab is a cosmetic manufacturing (maklon) factory in Surabaya trusted since 1989."
        h1="About Dreamlab"
        type="service"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "About Us" },
        ]}
      />
      {/* CompanyProfileWrapper — komponen yang sama persis dengan versi Indonesia,
          diisi data English + konten English. */}
      <CompanyProfileWrapper
        data={aboutDataEn}
        cta={ctaContentEn}
        content={aboutSectionContentEn}
      />
    </main>
  );
}
