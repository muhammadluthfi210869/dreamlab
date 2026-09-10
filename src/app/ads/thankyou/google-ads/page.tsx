import { Metadata } from "next";
import { ThankYouRoundRobin } from "@/components/ThankYouRoundRobin";
import { buildWaMessage } from "@/lib/wa-message";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  alternates: {
    canonical: "https://dreamlab.id/ads/thankyou/google-ads/",
  },
};

const WA_MSGS: Record<string, string> = {
  "google-parfum": buildWaMessage("produk parfum", "google-ads"),
  "google-skincare": buildWaMessage("produk skincare", "google-ads"),
  "google-haircare": buildWaMessage("produk haircare", "google-ads"),
  "google-deodorant": buildWaMessage("produk deodorant", "google-ads"),
  "google-kosmetik": buildWaMessage("produk kosmetik", "google-ads"),
  "google-bodycare": buildWaMessage("produk body care", "google-ads"),
};

export default function ThankYouGoogleAds() {
  return (
    <ThankYouRoundRobin
      defaultSource="google-ads"
      title="Terima Kasih!"
      description="Kami sudah menerima minat Anda. Sekarang, saatnya ngobrol langsung dengan tim kami."
      message={buildWaMessage("produk kosmetik", "google-ads")}
      messageMap={WA_MSGS}
    />
  );
}
