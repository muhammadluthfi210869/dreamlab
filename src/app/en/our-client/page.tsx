import type { Metadata } from "next";
import { PageSchema } from "@/components/PageSchema";
import { PartnerTrustSection } from "@/components/ClientSections";
import AdvantagesGrid from "@/components/AdvantagesGrid";
import CtaSection from "@/components/CtaSection";
import { buildAlternates } from "@/lib/seo-lang";
import { clientContentEn, advantagesContentEn, ctaContentEn } from "@/data/en/site";

export const metadata: Metadata = {
  // Terjemahan setia dari metadata halaman Our Client Indonesia.
  title: {
    absolute: "DREAMLAB | Here Are 500++ Clients Who Trust Production at Dreamlab",
  },
  description:
    "See the cosmetic & skincare brands that have worked with Dreamlab. Become part of them and become our partner.",
  alternates: buildAlternates("/en/our-client/"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Dreamlab",
    title: "DREAMLAB | Here Are 500++ Clients Who Trust Production at Dreamlab",
    description:
      "See the cosmetic & skincare brands that have worked with Dreamlab. Become part of them and become our partner.",
    url: "https://dreamlab.id/en/our-client/",
  },
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
};

export default function EnOurClientPage() {
  return (
    <main className="min-h-screen bg-brand-white pt-20 md:pt-28">
      <PageSchema
        url="https://dreamlab.id/en/our-client/"
        title="Dreamlab Clients | 500+ Brands Trust Our Production"
        description="See the cosmetic & skincare brands that have worked with Dreamlab."
        h1="Our Clients"
        type="category"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Our Clients" },
        ]}
      />
      <PartnerTrustSection content={clientContentEn} />
      <AdvantagesGrid title="8 Advantages of Manufacturing at Dreamlab" content={advantagesContentEn} />
      <CtaSection {...ctaContentEn} />
    </main>
  );
}
