import { aboutData } from "@/data/about-us";
import CompanyProfileWrapper from "@/components/CompanyProfileWrapper";

export const metadata = {
  title: "Dreamlab | Jasa Maklon Skincare & Parfum BPOM Indonesia",
  description: "Dreamlab adalah pabrik maklon kosmetik di Surabaya yang sudah dipercaya sejak 1989. Kami menyediakan One-Stop Maklon Service: konsultasi bisnis, formulasi custom oleh tim R&D, desain kemasan.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-brand-white">
      <CompanyProfileWrapper />
    </main>
  );
}
