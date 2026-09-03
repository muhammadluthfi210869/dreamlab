import { Metadata } from "next";
import { ThankYouRoundRobin } from "@/components/ThankYouRoundRobin";
import { buildWaMessage } from "@/lib/wa-message";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  alternates: {
    canonical: "https://dreamlab.id/ads/thankyou/google/",
  },
};

export default function ThankYouGoogle() {
  return (
    <ThankYouRoundRobin
      defaultSource="google-ads"
      title="Terima Kasih!"
      description="Kami sudah menerima minat Anda. Sekarang, saatnya ngobrol langsung dengan tim kami."
      message={buildWaMessage("produk kosmetik", "google-ads")}
    />
  );
}
