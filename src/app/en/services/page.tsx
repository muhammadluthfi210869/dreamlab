import type { Metadata } from "next";
import { PageSchema } from "@/components/PageSchema";
import ServicesPageHero from "@/components/ServicesPageHero";
import ServicesWrapper from "@/components/ServicesWrapper";
import { buildAlternates } from "@/lib/seo-lang";
import { servicesEditorialDataEn, servicesWrapperContentEn } from "@/data/en/site";

export const metadata: Metadata = {
  // Terjemahan setia dari metadata halaman Services Indonesia.
  title: {
    absolute: "DREAMLAB | The Most Complete Private Label Cosmetic Factory Services",
  },
  description:
    "Complete cosmetic manufacturing (maklon) services: skincare, body care, hair care, perfume, decorative, baby care, foot care, PKRT. BPOM, CPKB, Halal MUI.",
  alternates: buildAlternates("/en/services/"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Dreamlab",
    title: "DREAMLAB | The Most Complete Private Label Cosmetic Factory Services",
    description:
      "Complete cosmetic manufacturing (maklon) services: skincare, body care, hair care, perfume, decorative, baby care, foot care, PKRT. BPOM, CPKB, Halal MUI.",
    url: "https://dreamlab.id/en/services/",
  },
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
};

export default function EnServicesPage() {
  const { hero } = servicesEditorialDataEn;

  return (
    <main className="min-h-screen bg-brand-white">
      <PageSchema
        url="https://dreamlab.id/en/services/"
        title="Cosmetic Manufacturing Services | Dreamlab"
        description="Complete cosmetic manufacturing services: skincare, body care, hair care, perfume, decorative, baby care, foot care, PKRT."
        h1="Dreamlab Cosmetic Manufacturing Services"
        type="service"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Services" },
        ]}
      />
      <ServicesPageHero
        title={hero.title}
        description={hero.description}
        backgroundImage={hero.backgroundImage}
      />
      <ServicesWrapper content={servicesWrapperContentEn} />
    </main>
  );
}
