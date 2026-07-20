import { Metadata } from "next";
import { alurMaklonData } from "@/data/alur-maklon";
import AlurHero from "@/components/AlurHero";
import OneStopSection from "@/components/OneStopSection";
import CenteredTitle from "@/components/CenteredTitle";
import AlurInfographic from "@/components/AlurInfographic";
import AlurFAQ from "@/components/AlurFAQ";

export const metadata: Metadata = {
  title: "Alur Maklon | Dreamlab Indonesia",
  description: "Pelajari alur maklon kosmetik di Dreamlab Indonesia.",
  alternates: {
    canonical: "https://dreamlab.id/about-us/alur-maklon/",
  },
};

export default function AlurMaklonPage() {
  const { hero, wujudkan, oneStop, infographic, faqs } = alurMaklonData;

  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <AlurHero 
        title={hero.title}
        description={hero.description}
        image={hero.image}
        marquee={hero.marquee}
      />

      {/* 2. SECTION TITLE (WUJUDKAN BRAND...) */}
      <CenteredTitle 
        title={wujudkan.title}
        subtitle={wujudkan.subtitle}
        className="py-24 md:py-36"
      />

      {/* 3. ONE STOP SECTION */}
      <OneStopSection 
        title={oneStop.title}
        subtitle={oneStop.subtitle}
        description={oneStop.description}
        image={oneStop.image}
        cta={oneStop.cta}
        ctaLink={oneStop.ctaLink}
      />

      {/* 4. SECTION TITLE (PROSES MAKLON) */}
      <CenteredTitle 
        title="PROSES MAKLON"
        subtitle="Tahapan praktis dan mudah untuk brand kosmetik anda"
        className="pt-0 pb-12"
        light={false}
      />

      {/* 5. INFOGRAPHIC SECTION */}
      <AlurInfographic 
        image={infographic.image}
        alt={infographic.alt || "Alur Praktis Maklon"}
      />

      {/* 6. FAQ SECTION */}
      <AlurFAQ 
        title={faqs.title}
        items={faqs.items}
      />
    </main>
  );
}
