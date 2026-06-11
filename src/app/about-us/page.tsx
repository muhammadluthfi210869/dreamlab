import { Metadata } from 'next';
import { aboutData } from "@/data/about-us";
import CompanyProfileWrapper from "@/components/CompanyProfileWrapper";
import { PageSchema } from "@/components/PageSchema";

export const metadata: Metadata = {
  title: "Dreamlab | Jasa Maklon Skincare & Parfum BPOM Indonesia",
  description: "Dreamlab adalah pabrik maklon kosmetik di Surabaya yang sudah dipercaya sejak 1989. Kami menyediakan One-Stop Maklon Service: konsultasi bisnis, formulasi custom oleh tim R&D, desain kemasan.",
  alternates: {
    canonical: 'https://dreamlab.id/about-us/',
  },
  openGraph: {
    title: "Dreamlab | Jasa Maklon Skincare & Parfum BPOM Indonesia",
    description: "Dreamlab adalah pabrik maklon kosmetik di Surabaya yang sudah dipercaya sejak 1989. Kami menyediakan One-Stop Maklon Service.",
    url: 'https://dreamlab.id/about-us/',
    siteName: 'Dreamlab',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Dreamlab | Jasa Maklon Skincare & Parfum BPOM Indonesia",
    description: "Dreamlab adalah pabrik maklon kosmetik di Surabaya yang sudah dipercaya sejak 1989.",
  },
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-brand-white">
      <PageSchema
        url="https://dreamlab.id/about-us/"
        title="Tentang Dreamlab | Jasa Maklon Skincare & Parfum BPOM"
        description="Dreamlab adalah pabrik maklon kosmetik di Surabaya yang sudah dipercaya sejak 1989."
        h1="About Dreamlab"
        type="service"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'About Us' },
        ]}
      />
      <CompanyProfileWrapper />
    </main>
  );
}
