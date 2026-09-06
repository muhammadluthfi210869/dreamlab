import { Metadata } from "next";
import MaklonBodyCareLanding from "@/components/landing-pages/MaklonBodyCareLanding";

export const metadata: Metadata = {
  title: "Maklon Body Care Custom Formula & Signature Scent | Dreamlab",
  description: "Wujudkan brand body care dengan custom formula bersama Dreamlab. Didampingi dari formulasi, legalitas, produksi hingga pemasaran.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function MetaAdsMaklonBodyCare() {
  return <MaklonBodyCareLanding source="meta_ads" />;
}
