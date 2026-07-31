import { Metadata } from 'next';
import { ThankYouRoundRobin } from "@/components/ThankYouRoundRobin";

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://dreamlab.id/ads/thankyou/metaads/',
  },
};

const WA_MSGS: Record<string, string> = {
  "meta-parfum":
    "Halo Dreamlab, saya lihat iklan di meta ads parfum dan ingin konsultasi buat brand parfum saya. Bisa dibantu?",
  "meta-skincare":
    "Halo Dreamlab, saya lihat iklan di meta ads skincare dan ingin konsultasi buat brand skincare saya. Bisa dibantu?",
  "meta-haircare":
    "Halo Dreamlab, saya lihat iklan di meta ads haircare dan ingin konsultasi buat brand haircare saya. Bisa dibantu?",
  "meta-deodorant":
    "Halo Dreamlab, saya lihat iklan di meta ads deodorant dan ingin konsultasi buat brand deodorant saya. Bisa dibantu?",
  "meta-babycare":
    "Halo Dreamlab, saya lihat iklan di meta ads baby care dan ingin konsultasi buat brand baby care saya. Bisa dibantu?",
};

export default function ThankYouMetaAds() {
  return (
    <ThankYouRoundRobin
      defaultSource="direct"
      title="Terima Kasih!"
      description="Kami sudah menerima minat Anda. Sekarang, saatnya ngobrol langsung dengan tim kami."
      message="Halo Dreamlab, saya lihat iklan di meta ads dan ingin konsultasi buat brand saya. Bisa dibantu?"
      messageMap={WA_MSGS}
    />
  );
}
