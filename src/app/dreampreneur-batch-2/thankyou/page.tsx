import type { Metadata } from "next";
import DreampreneurThankYou from "@/components/dreampreneur/DreampreneurThankYou";

export const metadata: Metadata = {
  title: "Terima Kasih — Dreampreneur Batch 2 | Dreamlab",
  description:
    "Kamu sedang diarahkan ke WhatsApp untuk melanjutkan pendaftaran Dreampreneur Batch 2.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "https://dreamlab.id/dreampreneur-batch-2/thankyou/",
  },
};

export default function DreampreneurThankYouPage() {
  return <DreampreneurThankYou />;
}