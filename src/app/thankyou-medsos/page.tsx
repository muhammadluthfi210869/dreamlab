import { ThankYouRoundRobin } from "@/components/ThankYouRoundRobin";
import { buildWaMessage } from "@/lib/wa-message";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ThankYouMedsos() {
  return (
    <ThankYouRoundRobin
      defaultSource="medsos"
      title="Terima Kasih!"
      description="Tim Dreamlab akan segera menghubungi Anda untuk konsultasi produk lebih lanjut."
      message={buildWaMessage("produk kosmetik", "medsos")}
    />
  );
}
