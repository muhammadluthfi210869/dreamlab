import { ThankYouRoundRobin } from "@/components/ThankYouRoundRobin";

type PageProps = {
  searchParams?: {
    source?: string;
  };
};

export default function ThankYouGoogleAds({ searchParams }: PageProps) {
  const resolvedSource = searchParams?.source || "google-ads";

  return (
    <ThankYouRoundRobin
      routeKey="ads/thankyou/google-ads"
      defaultSource={resolvedSource}
      title="Terima Kasih!"
      description="Kami sudah menerima minat Anda. Sekarang, saatnya ngobrol langsung dengan tim kami."
      message="Hi Dreamlab saya mengetahui dari Google Ads. Saya ingin konsultasi untuk brand saya, apakah bisa dibantu?"
    />
  );
}
