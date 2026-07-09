import { ThankYouRoundRobin } from "@/components/ThankYouRoundRobin";

type PageProps = {
  searchParams?: {
    source?: string;
  };
};

export default function ThankYouOrganic({ searchParams }: PageProps) {
  const resolvedSource = searchParams?.source || "organic";

  return (
    <ThankYouRoundRobin
      routeKey="thankyou/google"
      defaultSource={resolvedSource}
      title="Terima Kasih!"
      description="Kami sudah menerima minat Anda. Sekarang, saatnya ngobrol langsung dengan tim kami."
      message="Hi Dreamlab saya mengetahui dari Google saya ingin konsultasi untuk brand saya, apakah bisa dibantu?"
    />
  );
}
