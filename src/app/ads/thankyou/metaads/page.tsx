import { ThankYouRoundRobin } from "@/components/ThankYouRoundRobin";

const WA_MSGS: Record<string, string> = {
  "meta-parfum":
    "Halo Dreamlab, saya lihat iklan di meta ads parfum dan ingin konsultasi buat brand parfum saya. Bisa dibantu?",
  "meta-skincare":
    "Halo Dreamlab, saya lihat iklan di meta ads skincare dan ingin konsultasi buat brand skincare saya. Bisa dibantu?",
  "meta-haircare":
    "Halo Dreamlab, saya lihat iklan di meta ads haircare dan ingin konsultasi buat brand haircare saya. Bisa dibantu?",
};

type PageProps = {
  searchParams?: {
    source?: string;
  };
};

export default function ThankYouMetaAds({ searchParams }: PageProps) {
  const source = searchParams?.source || "direct";

  return (
    <ThankYouRoundRobin
      routeKey="ads/thankyou/metaads"
      defaultSource={source}
      title="Terima Kasih!"
      description="Kami sudah menerima minat Anda. Sekarang, saatnya ngobrol langsung dengan tim kami."
      message="Halo Dreamlab, saya lihat iklan di meta ads dan ingin konsultasi buat brand saya. Bisa dibantu?"
      messageMap={WA_MSGS}
    />
  );
}
