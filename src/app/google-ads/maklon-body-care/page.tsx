import { Metadata } from "next";
import MaklonBodyCareLanding from "@/components/landing-pages/MaklonBodyCareLanding";

export const metadata: Metadata = {
  title: "Maklon Body Care Custom Formula & Signature Scent | Dreamlab",
  description: "Wujudkan brand body care dengan custom formula bersama Dreamlab. Didampingi dari formulasi, legalitas, produksi hingga pemasaran.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Maklon Body Care Custom Formula & Signature Scent | Dreamlab",
    description: "Wujudkan brand body care dengan custom formula bersama Dreamlab. Didampingi dari formulasi, legalitas, produksi hingga pemasaran.",
    images: [{ url: "https://dreamlab.id/new%20asset/background-visual-hero-section/bodycare.webp" }],
    type: "website",
    locale: "id_ID",
    siteName: "Dreamlab",
  },
  alternates: {
    canonical: "https://dreamlab.id/google-ads/maklon-body-care/",
  },
};

export default function GoogleAdsMaklonBodyCare() {
  return <MaklonBodyCareLanding source="google_ads" />;
}
