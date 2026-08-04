import type { Metadata } from "next";
import { PageSchema } from "@/components/PageSchema";
import { ContactHero, LocationDetails, ContactFAQ } from "@/components/ContactSections";
import CtaSection from "@/components/CtaSection";
import { buildAlternates } from "@/lib/seo-lang";
import { contactContentEn } from "@/data/en/site";

export const metadata: Metadata = {
  // Terjemahan setia dari metadata halaman Contact Us Indonesia.
  title: {
    absolute: "DREAMLAB | Cosmetic Manufacturing Services Surabaya, East Java",
  },
  description:
    "Free Consultation. The most complete cosmetic factory in East Java. Start your cosmetic & skincare brand now. Make your skincare business a reality now.",
  alternates: buildAlternates("/en/contact-us/"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Dreamlab",
    title: "DREAMLAB | Cosmetic Manufacturing Services Surabaya, East Java",
    description:
      "Free Consultation. The most complete cosmetic factory in East Java. Start your cosmetic & skincare brand now.",
    url: "https://dreamlab.id/en/contact-us/",
  },
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
};

export default function EnContactPage() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen">
      <PageSchema
        url="https://dreamlab.id/en/contact-us/"
        title="Contact Dreamlab | Cosmetic Manufacturing Surabaya"
        description="Free cosmetic manufacturing consultation. The most complete cosmetic factory in East Java."
        h1="Contact Dreamlab"
        type="service"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Contact Us" },
        ]}
      />
      <ContactHero content={contactContentEn.hero} />
      <LocationDetails content={contactContentEn} />
      <ContactFAQ content={contactContentEn.faq} />
      <CtaSection
        title="Create Your Dream Cosmetic Brand Together with Dreamlab"
        subtitle="Start a free product formulation consultation with our experienced R&D formulators today. Make your dream brand a reality in no time!"
        buttonText="CONSULT TODAY !"
      />
    </main>
  );
}
