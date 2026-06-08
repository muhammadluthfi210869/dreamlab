import { ContactHero, LocationDetails, ContactFAQ } from "@/components/ContactSections";
import CtaSection from "@/components/CtaSection";

export const metadata = {
  title: "DREAMLAB | Jasa Maklon Kosmetik Surabaya Jawa Timur",
  description: "Konsultasi Gratis. Pabrik kosmetik Terlengkap Jawa Timur. Mulai brand kosmetik & skincare-mu sekarang. Wujudkan Bisinis Skincaremu Sekarang",
};

export default function ContactPage() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen">
      {/* Hero Section (Split Layout with Interactive Lead Form) */}
      <ContactHero />

      {/* Detailed Locations Bento Grid */}
      <LocationDetails />

      {/* Interactive FAQ Accordion */}
      <ContactFAQ />

      {/* Final Visual Background CTA */}
      <CtaSection 
        title="Wujudkan Brand Kosmetik Impian Anda Bersama Dreamlab"
        subtitle="Mulai konsultasi gratis formulasi produk dengan formulator R&D berpengalaman kami hari ini. Wujudkan brand impian Anda dalam waktu singkat!"
      />
    </main>
  );
}
