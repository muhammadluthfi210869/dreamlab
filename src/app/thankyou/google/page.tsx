import { Metadata } from "next";
import { ThankYouRoundRobin } from "@/components/ThankYouRoundRobin";
import { buildWaMessage } from "@/lib/wa-message";

export const metadata: Metadata = {
  robots: "noindex, follow",
  alternates: {
    canonical: "https://dreamlab.id/thankyou/google/",
  },
};

export default function ThankYouOrganic() {
  return (
    <ThankYouRoundRobin
      defaultSource="organic"
      title="Terima Kasih!"
      description="Kami sudah menerima minat Anda. Sekarang, saatnya ngobrol langsung dengan tim kami."
      message={buildWaMessage("produk kosmetik", "organic")}
    />
  );
}
