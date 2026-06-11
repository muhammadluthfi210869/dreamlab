import { Metadata } from 'next';
import { servicesEditorialData } from "@/data/services-editorial";
import ServicesPageHero from "@/components/ServicesPageHero";
import ServicesWrapper from "@/components/ServicesWrapper";
import { PageSchema } from "@/components/PageSchema";

export const metadata: Metadata = {
  title: "DREAMLAB | Layanan Pabrik Kosmetik Private Label Terlengkap",
  description: "Jasa maklon kosmetik lengkap: skincare, body care, hair care, parfum, decorative, baby care, foot care, PKRT. BPOM, CPKB, Halal MUI.",
  alternates: {
    canonical: 'https://dreamlab.id/services/',
  },
  openGraph: {
    title: "DREAMLAB | Layanan Pabrik Kosmetik Private Label Terlengkap",
    description: "Jasa maklon kosmetik lengkap: skincare, body care, hair care, parfum, decorative, baby care, foot care, PKRT. BPOM, CPKB, Halal MUI.",
    url: 'https://dreamlab.id/services/',
    siteName: 'Dreamlab',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "DREAMLAB | Layanan Pabrik Kosmetik Private Label Terlengkap",
    description: "Jasa maklon kosmetik lengkap: skincare, body care, hair care, parfum, decorative, baby care, foot care, PKRT. BPOM, CPKB, Halal MUI.",
  },
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
};

export default function ServicesPage() {
  const { hero } = servicesEditorialData;

  return (
    <main className="min-h-screen bg-brand-white">
      <PageSchema
        url="https://dreamlab.id/services/"
        title="Layanan Maklon Kosmetik | Dreamlab"
        description="Jasa maklon kosmetik lengkap: skincare, body care, hair care, parfum, decorative, baby care, foot care, PKRT."
        h1="Layanan Maklon Kosmetik Dreamlab"
        type="service"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Services' },
        ]}
      />
      <ServicesPageHero 
        title={hero.title}
        description={hero.description}
        backgroundImage={hero.backgroundImage}
      />
      <ServicesWrapper />
    </main>
  );
}

