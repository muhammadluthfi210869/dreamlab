import { Metadata } from "next";
import { ThankYouRoundRobin } from "@/components/ThankYouRoundRobin";
import { buildWaMessage } from "@/lib/wa-message";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://dreamlab.id/ads/thankyou/google-ads/",
  },
};

export default function ThankYouGoogleAds() {
  return (
    <ThankYouRoundRobin
      defaultSource="google-ads"
      title="Terima Kasih!"
      description="Kami sudah menerima minat Anda. Sekarang, saatnya ngobrol langsung dengan tim kami."
      message={buildWaMessage("produk kosmetik", "google-ads")}
    />
  );
}
