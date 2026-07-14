import { ThankYouRoundRobin } from "@/components/ThankYouRoundRobin";

export default function ThankYouMedsos() {
  return (
    <ThankYouRoundRobin
      defaultSource="medsos"
      title="Terima Kasih!"
      description="Tim Dreamlab akan segera menghubungi Anda untuk konsultasi produk lebih lanjut."
      message="Halo Dreamlab, saya mengetahui dari media sosial dan ingin konsultasi produk lebih lanjut."
      ctaLabels={["Hubungi Tim", "Konsultasi Produk", "Lihat Penawaran"]}
    />
  );
}
