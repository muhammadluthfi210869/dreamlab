import { ThankYouRoundRobin } from "@/components/ThankYouRoundRobin";

type PageProps = {
  searchParams?: {
    source?: string;
  };
};

export default function ThankYouMedsos({ searchParams }: PageProps) {
  const resolvedSource = searchParams?.source || "medsos";

  return (
    <ThankYouRoundRobin
      routeKey="thankyou-medsos"
      defaultSource={resolvedSource}
      title="Terima Kasih!"
      description="Tim Dreamlab akan segera menghubungi Anda untuk konsultasi produk lebih lanjut."
      message="Halo Dreamlab, saya mengetahui dari media sosial dan ingin konsultasi produk lebih lanjut."
      ctaLabels={["Hubungi Tim", "Konsultasi Produk", "Lihat Penawaran"]}
    />
  );
}
