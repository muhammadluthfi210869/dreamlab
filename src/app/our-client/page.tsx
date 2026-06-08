import { PartnerTrustSection } from "@/components/ClientSections";
import AdvantagesGrid from "@/components/AdvantagesGrid";
import Testimonials from "@/components/Testimonials";
import CtaSection from "@/components/CtaSection";
import { homepageData } from "@/data/homepage";

export const metadata = {
  title: "DREAMLAB | Berikut 500++ Client Percaya produksi di Dreamlab",
  description: "Lihat brand-brand kosmetik & skincare yang sudah bekerja sama dengan Dreamlab.Jadi bagian dari mereka dan menjadi partner kami.",
};

export default function OurClientPage() {
  const { testimonials } = homepageData;

  return (
    <main className="min-h-screen bg-brand-white pt-20 md:pt-28">

      {/* 1. Partner Terpercaya & Marquee (Customized UI) */}
      <PartnerTrustSection />

      {/* 2. Keuntungan Menggunakan Jasa Maklon (8 Keuntungan Bento Grid) */}
      <AdvantagesGrid title="8 Keuntungan Maklon" />

      {/* 3. Testimonial Naratif */}
      {/* TODO: Re-enable testimonials slider when content is ready */}
      {/* <Testimonials 
        title={testimonials.title}
        items={testimonials.items}
      /> */}

      {/* 4. Final CTA (Wujudkan Brand Impian dengan Background Visual) */}
      <CtaSection />

    </main>
  );
}
