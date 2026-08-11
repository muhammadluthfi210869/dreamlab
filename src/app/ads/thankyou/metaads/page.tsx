import { Metadata } from 'next';
import { ThankYouRoundRobin } from "@/components/ThankYouRoundRobin";
import { buildWaMessage } from "@/lib/wa-message";

export const metadata: Metadata = {
  robots: "noindex, follow",
  alternates: {
    canonical: 'https://dreamlab.id/ads/thankyou/metaads/',
  },
};

const WA_MSGS: Record<string, string> = {
  "meta-parfum": buildWaMessage("produk parfum", "metaads"),
  "meta-skincare": buildWaMessage("produk skincare", "metaads"),
  "meta-haircare": buildWaMessage("produk haircare", "metaads"),
  "meta-deodorant": buildWaMessage("produk deodorant", "metaads"),
  "meta-babycare": buildWaMessage("produk baby care", "metaads"),
};

export default function ThankYouMetaAds() {
  return (
    <ThankYouRoundRobin
      defaultSource="metaads"
      title="Terima Kasih!"
      description="Kami sudah menerima minat Anda. Sekarang, saatnya ngobrol langsung dengan tim kami."
      message={buildWaMessage("produk kosmetik", "metaads")}
      messageMap={WA_MSGS}
    />
  );
}
