import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Panduan Maklon Skincare dan Kosmetik | Dreamlab',
  description: 'Hub utama untuk artikel panduan pilot Dreamlab yang fokus pada intent buyer, estimasi, dan keputusan produksi.',
  alternates: {
    canonical: 'https://dreamlab.id/panduan/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffdf8_0%,#fff8ef_100%)] px-4 py-16 text-[#1f1f1d] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6 rounded-[32px] border border-[#eadfcf] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">Panduan</p>
        <h1 className="text-4xl font-black tracking-tight">Panduan Maklon Skincare dan Kosmetik</h1>
        <p className="max-w-2xl text-base leading-7 text-neutral-600">
          Hub ini dipakai sebagai pintu masuk aman untuk cluster pilot Dreamlab. Fokusnya tetap pada intent buyer, estimasi, dan keputusan produksi.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/panduan/komponen-biaya-maklon-skincare" className="rounded-[24px] border border-[#eadfcf] bg-[#fffaf1] p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b06f00]">Pilot Article</p>
            <h2 className="mt-2 text-xl font-black">Komponen Biaya Maklon Skincare</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Breakdown komponen biaya sebelum masuk ke estimasi.</p>
          </Link>
          <Link href="/biaya-maklon-skincare" className="rounded-[24px] border border-[#eadfcf] bg-[#fffaf1] p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b06f00]">Money Page</p>
            <h2 className="mt-2 text-xl font-black">Biaya Maklon Skincare</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Estimasi, konsultasi, dan conversion intent.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
