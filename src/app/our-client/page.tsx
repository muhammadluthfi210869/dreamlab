import { Metadata } from 'next';
import { PartnerTrustSection } from "@/components/ClientSections";
import AdvantagesGrid from "@/components/AdvantagesGrid";
import Testimonials from "@/components/Testimonials";
import CtaSection from "@/components/CtaSection";
import { homepageData } from "@/data/homepage";
import { PageSchema } from "@/components/PageSchema";

export const metadata: Metadata = {
  title: "DREAMLAB | Berikut 500++ Client Percaya produksi di Dreamlab",
  description: "Lihat brand-brand kosmetik & skincare yang sudah bekerja sama dengan Dreamlab.Jadi bagian dari mereka dan menjadi partner kami.",
  alternates: {
    canonical: 'https://dreamlab.id/our-client/',
  },
  openGraph: {
    title: "DREAMLAB | Berikut 500++ Client Percaya produksi di Dreamlab",
    description: "Lihat brand-brand kosmetik & skincare yang sudah bekerja sama dengan Dreamlab.",
    url: 'https://dreamlab.id/our-client/',
    siteName: 'Dreamlab',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "DREAMLAB | Berikut 500++ Client Percaya produksi di Dreamlab",
    description: "Lihat brand-brand kosmetik & skincare yang sudah bekerja sama dengan Dreamlab.",
  },
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
};

export default function OurClientPage() {
  const { testimonials } = homepageData;

  return (
    <main className="min-h-screen bg-brand-white pt-20 md:pt-28">
      <PageSchema
        url="https://dreamlab.id/our-client/"
        title="Client Dreamlab | 500+ Brand Percaya Produksi"
        description="Lihat brand-brand kosmetik & skincare yang sudah bekerja sama dengan Dreamlab."
        h1="Our Clients"
        type="category"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Our Clients' },
        ]}
      />
      <PartnerTrustSection />
      <AdvantagesGrid title="8 Keuntungan Maklon" />
      <CtaSection />
    </main>
  );
}
