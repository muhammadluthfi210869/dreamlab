import { Metadata } from 'next';
import { ThankYouRoundRobin } from "@/components/ThankYouRoundRobin";
import { buildWaMessage } from "@/lib/wa-message";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://dreamlab.id/ads/thankyou/promo-kemerdekaan/',
  },
};

const WA_MSGS: Record<string, string> = {
  "promo-kemerdekaan": buildWaMessage("promo kemerdekaan Dreamlab", "ads"),
  "promo-kemerdekaan-kidscare": buildWaMessage("paket kidscare promo kemerdekaan", "ads"),
  "promo-kemerdekaan-haircare-growth": buildWaMessage("paket haircare growth promo kemerdekaan", "ads"),
  "promo-kemerdekaan-haircare-smooth": buildWaMessage("paket haircare smooth promo kemerdekaan", "ads"),
  "promo-kemerdekaan-parfum": buildWaMessage("paket parfum promo kemerdekaan", "ads"),
};

export default function ThankYouPromoKemerdekaan() {
  return (
    <ThankYouRoundRobin
      defaultSource="ads"
      title="Terima Kasih!"
      description="Kami sudah menerima minat Anda pada Promo Kemerdekaan. Sekarang, saatnya ngobrol langsung dengan tim kami."
      message={buildWaMessage("promo kemerdekaan Dreamlab", "ads")}
      messageMap={WA_MSGS}
    />
  );
}