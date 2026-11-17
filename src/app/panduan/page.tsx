import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';

const hubCards = [
  {
    type: 'Panduan 01 · Biaya',
    href: '/panduan/komponen-biaya-maklon-skincare/',
    title: 'Checklist Komponen Biaya Maklon Skincare',
    description:
      'Checklist komponen biaya, area yang masih bisa dihemat, dan brief sebelum minta estimasi.',
    summary:
      'Anda akan mempelajari pos-pos biaya utama dari formulasi R&D, kemasan, legalitas BPOM, hingga produksi batch pertama agar anggaran lebih terukur.',
  },
  {
    type: 'Panduan 02 · MOQ',
    href: '/panduan/cara-menentukan-moq-produk-kosmetik/',
    title: 'Cara Menentukan MOQ Produk Kosmetik',
    description:
      'Framework untuk membaca demand, budget inventory, channel penjualan, dan risiko stok.',
    summary:
      'Pembaca akan memahami cara menghitung kuantitas order awal yang sehat sesuai kapasitas modal dan target perputaran stok di channel penjualan.',
  },
  {
    type: 'Panduan 03 · Estimasi Biaya',
    href: '/biaya-maklon-skincare/',
    title: 'Biaya Maklon Skincare',
    description:
      'Halaman validasi estimasi biaya, scope produk, dan brief konsultasi sebelum produksi.',
    summary:
      'Berisi simulasi kebutuhan modal batch pertama serta panduan menyusun brief produk sebelum berdiskusi dengan tim Business Development Dreamlab.',
  },
  {
    type: 'Panduan 04 · Validasi MOQ',
    href: '/moq-maklon-kosmetik/',
    title: 'MOQ Maklon Kosmetik',
    description:
      'Halaman validasi minimum order yang aman sebelum produksi pertama.',
    summary:
      'Membantu Anda membandingkan fleksibilitas minimum order antar kategori produk dan menyiapkan strategi peluncuran yang minim risiko stok mati.',
  },
];

const learningSteps = [
  {
    number: '1',
    title: 'Pahami Struktur Biaya & HPP Sejak Awal',
    href: '/panduan/komponen-biaya-maklon-skincare/',
    cta: 'Baca Checklist Komponen Biaya →',
    body: 'Mulailah dengan memetakan seluruh komponen biaya maklon, mulai dari riset formula, kemasan primer dan sekunder, hingga registrasi legalitas. Langkah ini mencegah pembengkakan biaya tak terduga saat masuk tahap produksi, dan dapat Anda lengkapi dengan menyimak simulasi pada halaman biaya maklon skincare.',
  },
  {
    number: '2',
    title: 'Tentukan MOQ yang Sesuai dengan Kapasitas Modal',
    href: '/panduan/cara-menentukan-moq-produk-kosmetik/',
    cta: 'Pelajari Cara Menentukan MOQ →',
    body: 'Setelah mengetahui kisaran HPP, sesuaikan jumlah produksi awal dengan kemampuan distribusi dan anggaran promosi Anda. Gunakan framework penentuan MOQ agar stok batch pertama terserap sehat, lalu validasikan opsinya di halaman MOQ maklon kosmetik.',
  },
  {
    number: '3',
    title: 'Siapkan Legalitas BPOM, Halal MUI & Merek (HAKI)',
    href: '/jasa-maklon-kosmetik-bpom-panduan-lengkap/',
    cta: 'Baca Panduan Legalitas BPOM →',
    body: 'Pastikan nama merek, klaim produk, serta dokumen izin edar BPOM RI dan sertifikasi Halal MUI sudah direncanakan sejak awal. Proses perizinan berjalan paralel dengan persiapan kemasan sehingga produk dapat segera dipasarkan begitu selesai diproduksi.',
  },
  {
    number: '4',
    title: 'Masuk ke Tahap Sampel R&D & Produksi Batch Pertama',
    href: '/about-us/alur-maklon/',
    cta: 'Lihat Alur Maklon Lengkap →',
    body: 'Ketika brief produk, estimasi biaya, dan MOQ sudah matang, Anda siap menguji sampel formula dari tim R&D Dreamlab hingga disetujui untuk produksi massal di pabrik berstandar CPKB Grade A.',
  },
];

const panduanFaqs = [
  {
    question: 'Siapa yang sebaiknya membaca panduan maklon ini?',
    answer:
      'Panduan ini disusun khusus untuk calon pemilik brand kosmetik pemula, reseller yang ingin naik kelas memiliki merek sendiri, klinik kecantikan, maupun kreator yang sedang merencanakan produksi batch pertama bersama pabrik maklon.',
  },
  {
    question: 'Dalam urutan apa saya harus membaca panduan di halaman ini?',
    answer:
      'Sebaiknya baca secara berurutan mulai dari pemahaman komponen biaya dan HPP, dilanjutkan dengan cara menentukan MOQ yang aman, lalu persiapan legalitas BPOM & Halal, hingga memahami alur produksi massal.',
  },
  {
    question: 'Apakah saya harus menyiapkan formula sendiri sebelum konsultasi?',
    answer:
      'Tidak harus. Anda cukup membawa referensi produk, target pasar, dan kisaran harga jual yang diinginkan. Tim R&D Dreamlab akan membantu meracik custom formula (1 Client = 1 Formula) dan menyiapkan sampel awal untuk Anda uji.',
  },
  {
    question: 'Berapa lama waktu yang dibutuhkan dari konsultasi hingga produk siap jual?',
    answer:
      'Secara umum proses maklon hingga produk siap edar membutuhkan waktu sekitar 2 hingga 3 bulan, mencakup tahap riset formula dan sampel (2–4 minggu), pendaftaran izin edar BPOM RI (4–8 minggu), serta produksi massal (2–3 minggu).',
  },
  {
    question: 'Di mana saya bisa melihat daftar kategori produk yang bisa dibuat di Dreamlab?',
    answer:
      'Anda dapat menelusuri seluruh kategori mulai dari skincare, body care, hair care, makeup, baby care, hingga parfum di halaman katalog produk maklon Dreamlab.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: panduanFaqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export const metadata: Metadata = {
  title: 'Panduan Maklon Skincare dan Kosmetik | Dreamlab',
  description:
    'Panduan maklon skincare dan kosmetik untuk pemilik brand batch pertama: rincian biaya, cara menentukan MOQ, alur BPOM, dan kesiapan produksi.',
  alternates: {
    canonical: 'https://dreamlab.id/panduan/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Panduan Maklon Skincare dan Kosmetik | Dreamlab',
    description:
      'Panduan maklon skincare dan kosmetik untuk pemilik brand batch pertama: rincian biaya, cara menentukan MOQ, alur BPOM, dan kesiapan produksi.',
    url: 'https://dreamlab.id/panduan/',
    siteName: 'Dreamlab',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Panduan Maklon Skincare dan Kosmetik | Dreamlab',
    description:
      'Panduan maklon skincare dan kosmetik untuk pemilik brand batch pertama: rincian biaya, cara menentukan MOQ, alur BPOM, dan kesiapan produksi.',
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffdf8_0%,#fff8ef_100%)] px-4 py-16 text-[#1f1f1d] sm:px-6 lg:px-8">
      <JsonLd data={faqSchema} />

      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-[32px] border border-[#eadfcf] bg-white p-8 text-center shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-10">
          <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">
            Panduan Maklon Dreamlab
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Panduan maklon skincare dan kosmetik untuk batch pertama
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-neutral-600 sm:text-lg">
            Halaman panduan ini disusun khusus bagi calon pemilik brand kosmetik, pengelola klinik estetika, dan pebisnis pemula yang sedang menyiapkan produksi batch pertama bersama pabrik maklon. Agar keputusan bisnis lebih matang dan minim risiko stok mati, gunakan seluruh materi di sini secara berurutan: mulai dari memahami komponen biaya dan HPP, menentukan MOQ sesuai modal, menyiapkan legalitas BPOM dan Halal MUI, hingga memahami alur produksi massal di fasilitas CPKB Grade A.
          </p>
        </section>

        <section className="rounded-[28px] border border-[#eadfcf] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-8">
          <div className="max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">
              Daftar Panduan Utama
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">
              Mulai dari panduan, lanjut ke validasi biaya &amp; MOQ
            </h2>
            <p className="mt-3 text-sm leading-7 text-neutral-600">
              Pilih panduan di bawah ini untuk membangun pemahaman menyeluruh sebelum menyusun brief produk dan berkonsultasi dengan tim Dreamlab.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {hubCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-[24px] border border-[#eadfcf] bg-[#fffaf1] p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b06f00]">
                  {card.type}
                </p>
                <h3 className="mt-2 text-xl font-black tracking-tight text-[#1f1f1d]">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{card.description}</p>
                <p className="mt-2 text-xs leading-5 text-neutral-500">{card.summary}</p>
                <span className="mt-4 inline-flex text-sm font-bold text-[#D98A00] transition group-hover:translate-x-1">
                  Buka panduan →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-[#eadfcf] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-8">
          <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">
            Roadmap Persiapan
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight">
            Urutan Belajar Maklon untuk Batch Pertama
          </h2>
          <p className="mt-3 text-sm leading-7 text-neutral-600">
            Ikuti empat langkah terstruktur berikut agar transisi dari ide produk menuju produksi pertama berjalan lancar tanpa revisi anggaran yang melelahkan.
          </p>

          <ol className="mt-6 space-y-4">
            {learningSteps.map((step) => (
              <li
                key={step.number}
                className="rounded-[20px] border border-[#eadfcf] bg-[#fffaf1] p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D98A00] text-sm font-black text-white">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-[#1f1f1d]">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">{step.body}</p>
                    <Link
                      href={step.href}
                      className="mt-3 inline-flex text-sm font-bold text-[#D98A00] hover:underline"
                    >
                      {step.cta}
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-[28px] border border-[#eadfcf] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-8">
          <h2 className="text-2xl font-black tracking-tight">
            Referensi Lanjutan &amp; Eksplorasi Produk
          </h2>
          <p className="mt-3 text-sm leading-7 text-neutral-600">
            Setelah memahami kerangka biaya dan MOQ, eksplorasi lini produk yang tersedia di{' '}
            <Link href="/produk/" className="font-bold text-[#D98A00] hover:underline">
              katalog produk maklon Dreamlab
            </Link>{' '}
            atau pelajari tahapan produksinya di halaman{' '}
            <Link href="/about-us/alur-maklon/" className="font-bold text-[#D98A00] hover:underline">
              alur maklon kosmetik
            </Link>
            . Anda juga dapat membaca artikel pendukung seperti{' '}
            <Link href="/cara-mulai-bisnis-skincare-dari-nol/" className="font-bold text-[#D98A00] hover:underline">
              cara mulai bisnis skincare dari nol
            </Link>
            ,{' '}
            <Link href="/bongkar-biaya-maklon-skincare-lengkap/" className="font-bold text-[#D98A00] hover:underline">
              rincian biaya maklon skincare lengkap
            </Link>
            , dan{' '}
            <Link href="/moq-maklon-skincare-untuk-pemula/" className="font-bold text-[#D98A00] hover:underline">
              panduan MOQ maklon untuk pemula
            </Link>
            .
          </p>
        </section>

        <section className="rounded-[28px] border border-[#eadfcf] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-8">
          <h2 className="text-2xl font-black tracking-tight">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <div className="mt-5 space-y-3">
            {panduanFaqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-2xl border border-[#eadfcf] bg-[#fffaf1] p-4"
              >
                <summary className="cursor-pointer text-sm font-bold text-[#1f1f1d] sm:text-base">
                  {faq.question}
                </summary>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
