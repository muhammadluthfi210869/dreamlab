import type { Metadata } from 'next';
import Link from 'next/link';

const hubCards = [
  {
    type: 'Pilot Article',
    href: '/panduan/komponen-biaya-maklon-skincare',
    title: 'Checklist Komponen Biaya Maklon Skincare',
    description: 'Checklist komponen biaya, area yang masih bisa dihemat, dan brief sebelum minta estimasi.',
  },
  {
    type: 'Pilot Article',
    href: '/panduan/cara-menentukan-moq-produk-kosmetik',
    title: 'Cara Menentukan MOQ Produk Kosmetik',
    description: 'Framework untuk membaca demand, budget inventory, channel penjualan, dan risiko stok.',
  },
  {
    type: 'Money Page',
    href: '/biaya-maklon-skincare',
    title: 'Biaya Maklon Skincare',
    description: 'Halaman conversion untuk validasi estimasi biaya, scope produk, dan brief konsultasi.',
  },
  {
    type: 'Money Page',
    href: '/moq-maklon-kosmetik',
    title: 'MOQ Maklon Kosmetik',
    description: 'Halaman conversion untuk validasi minimum order yang aman sebelum produksi pertama.',
  },
];

export const metadata: Metadata = {
  title: 'Panduan Maklon Skincare dan Kosmetik | Dreamlab',
  description: 'Hub utama batch 1 Dreamlab untuk artikel panduan, estimasi biaya, dan validasi MOQ yang lebih siap conversion.',
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
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-[32px] border border-[#eadfcf] bg-white p-8 text-center shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-10">
          <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">Panduan Batch 1</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Panduan maklon skincare dan kosmetik untuk batch pertama</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-neutral-600 sm:text-lg">
            Hub ini mengikat 2 artikel pilot dan 2 money page agar intent edukasi, estimasi, dan validasi MOQ tetap terhubung dalam satu cluster yang aman.
          </p>
        </section>

        <section className="rounded-[28px] border border-[#eadfcf] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-8">
          <div className="max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">Struktur Cluster</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">Mulai dari panduan, lanjut ke halaman conversion</h2>
            <p className="mt-3 text-sm leading-7 text-neutral-600">
              Gunakan artikel pilot saat Anda masih membangun konteks. Pindah ke money page saat Anda sudah siap menghubungkan scope dengan estimasi biaya atau minimum order.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {hubCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-[24px] border border-[#eadfcf] bg-[#fffaf1] p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b06f00]">{card.type}</p>
                <h2 className="mt-2 text-xl font-black tracking-tight text-[#1f1f1d]">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{card.description}</p>
                <span className="mt-4 inline-flex text-sm font-bold text-[#D98A00] transition group-hover:translate-x-1">Buka halaman</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
