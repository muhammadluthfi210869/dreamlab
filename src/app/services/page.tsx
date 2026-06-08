import { servicesEditorialData } from "@/data/services-editorial";
import ServicesPageHero from "@/components/ServicesPageHero";
import ServicesWrapper from "@/components/ServicesWrapper";

export const metadata = {
  title: "DREAMLAB | Layanan Pabrik Kosmetik Private Label Terlengkap",
  description: "Jasa maklon kosmetik lengkap: skincare, body care, hair care, parfum, decorative, baby care, foot care, PKRT. BPOM, CPKB, Halal MUI.",
};

export default function ServicesPage() {
  const { hero } = servicesEditorialData;

  return (
    <main className="min-h-screen bg-brand-white">
      {/* 1. Stunning Hero Header with Breadcrumb (BeauTen-style) */}
      <ServicesPageHero 
        title={hero.title}
        description={hero.description}
        backgroundImage={hero.backgroundImage}
      />

      {/* 2. Unified 6-Step Services Editorial Journey */}
      <ServicesWrapper />
    </main>
  );
}

