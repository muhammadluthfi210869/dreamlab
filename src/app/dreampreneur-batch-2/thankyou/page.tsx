import type { Metadata } from 'next';
import { ThankYouRoundRobin } from '@/components/ThankYouRoundRobin';
import { buildWaMessage } from '@/lib/wa-message';

export const metadata: Metadata = {
  title: 'Terima Kasih — Dreampreneur Vol. 2 | Dreamlab',
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://dreamlab.id/dreampreneur-batch-2/thankyou/',
  },
};

export default function DreampreneurThankYou() {
  return (
    <ThankYouRoundRobin
      defaultSource="dreampreneur"
      channelLabel="Dreampreneur Vol. 2"
      ctaLabel="KONFIRMASI SEAT SAYA DI WHATSAPP"
      title="Seat Kamu Berhasil Direservasi!"
      description="Tim Dreamlab akan mengonfirmasi detail pembayaran dan kehadiran kamu di Dreampreneur Vol. 2 melalui WhatsApp. Simak pesannya sekarang."
      message={buildWaMessage("Dreampreneur Vol. 2", "dreampreneur")}
    />
  );
}