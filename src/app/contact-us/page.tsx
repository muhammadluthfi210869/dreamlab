import { Metadata } from 'next';
import { ContactHero, LocationDetails, ContactFAQ } from "@/components/ContactSections";
import CtaSection from "@/components/CtaSection";
import { PageSchema } from "@/components/PageSchema";

export const metadata: Metadata = {
  title: "DREAMLAB | Jasa Maklon Kosmetik Surabaya Jawa Timur",
  description: "Konsultasi Gratis. Pabrik kosmetik Terlengkap Jawa Timur. Mulai brand kosmetik & skincare-mu sekarang. Wujudkan Bisinis Skincaremu Sekarang",
  alternates: {
    canonical: 'https://dreamlab.id/contact-us/',
  },
  openGraph: {
    title: "DREAMLAB | Jasa Maklon Kosmetik Surabaya Jawa Timur",
    description: "Konsultasi Gratis. Pabrik kosmetik Terlengkap Jawa Timur. Mulai brand kosmetik & skincare-mu sekarang.",
    url: 'https://dreamlab.id/contact-us/',
    siteName: 'Dreamlab',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "DREAMLAB | Jasa Maklon Kosmetik Surabaya Jawa Timur",
    description: "Konsultasi Gratis. Pabrik kosmetik Terlengkap Jawa Timur.",
  },
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
};

export default function ContactPage() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen">
      <PageSchema
        url="https://dreamlab.id/contact-us/"
        title="Hubungi Dreamlab | Maklon Kosmetik Surabaya"
        description="Konsultasi gratis maklon kosmetik. Pabrik kosmetik terlengkap Jawa Timur."
        h1="Hubungi Dreamlab"
        type="service"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contact Us' },
        ]}
      />
      <ContactHero />
      <LocationDetails />
      <ContactFAQ />
      <CtaSection 
        title="Wujudkan Brand Kosmetik Impian Anda Bersama Dreamlab"
        subtitle="Mulai konsultasi gratis formulasi produk dengan formulator R&D berpengalaman kami hari ini. Wujudkan brand impian Anda dalam waktu singkat!"
      />
    </main>
  );
}
