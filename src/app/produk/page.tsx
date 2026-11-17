import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { homepageData } from "@/data/homepage";
import CtaSection from "@/components/CtaSection";
import JsonLd from "@/components/JsonLd";
import { buildAlternates } from "@/lib/seo-lang";

const KatalogProduk = dynamic(() => import("@/components/KatalogProduk"));

export const metadata: Metadata = {
  title: "Katalog Produk Maklon Kosmetik | Dreamlab",
  description:
    "Katalog produk maklon kosmetik Dreamlab: skincare, body care, hair care, makeup, baby care, parfum & foot care. BPOM, CPKB Grade A, Halal MUI.",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  alternates: buildAlternates("/produk/"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Dreamlab",
    title: "Katalog Produk Maklon Kosmetik | Dreamlab",
    description:
      "Katalog produk maklon kosmetik Dreamlab: skincare, body care, hair care, makeup, baby care, parfum & foot care. BPOM, CPKB Grade A, Halal MUI.",
    url: "https://dreamlab.id/produk/",
  },
};

const categorySummaries = [
  {
    name: "Skincare & Face Care",
    href: "/produk/skincare/",
    description:
      "Rangkaian perawatan wajah harian hingga perawatan intensif seperti facial wash, essence toner, facial serum, moisturizer cream, dan sunscreen. Cocok untuk brand baru, klinik estetika, maupun lini perawatan kulit yang ingin menonjolkan bahan aktif spesifik dengan klaim aman berizin BPOM.",
  },
  {
    name: "Body Care",
    href: "/produk/bodycare/",
    description:
      "Produk perawatan tubuh mulai dari body wash, body scrub, body lotion, body serum, hingga body butter dengan tekstur dan aroma khas. Ideal bagi brand yang menyasar kebutuhan perawatan kulit tubuh harian dengan tingkat pembelian ulang yang tinggi.",
  },
  {
    name: "Hair Care",
    href: "/produk/haircare/",
    description:
      "Solusi perawatan rambut dan kulit kepala seperti bonding shampoo, hair conditioner, hair mask, hair serum, dan hair mist. Tepat untuk brand personal care, salon profesional, atau lini perawatan rambut rontok dan rusak.",
  },
  {
    name: "Decorative (Makeup)",
    href: "/produk/decorative/",
    description:
      "Kosmetik dekoratif modern meliputi lip cream, lip matte, peptide lip treatment, cushion, dan foundation dengan pilihan shade yang dapat disesuaikan. Cocok untuk brand kecantikan yang membidik segmen tren warna dan riasan praktis.",
  },
  {
    name: "Baby Care",
    href: "/produk/babycare/",
    description:
      "Formulasi lembut khusus kulit bayi dan anak, antara lain baby 2-in-1 wash, baby shampoo, baby lotion, dan baby cologne. Dirancang bagi brand keluarga dan ibu-anak yang memprioritaskan keamanan formula serta kenyamanan pemakaian.",
  },
  {
    name: "Parfum & Fragrance",
    href: "/produk/parfum/",
    description:
      "Lini wewangian mulai dari Eau de Parfum, Extrait de Parfum, body mist, hingga signature scent eksklusif untuk merek Anda sendiri. Sangat pas untuk brand lifestyle, fashion, maupun kreator yang ingin menghadirkan karakter aroma unik.",
  },
  {
    name: "Foot Care",
    href: "/produk/footcare/",
    description:
      "Produk perawatan kaki seperti foot cream dan foot care treatment untuk membantu melembapkan serta merawat area tumit yang kering. Cocok sebagai produk pelengkap lini body care atau segmen perawatan khusus di klinik dan spa.",
  },
];

const maklonSteps = [
  {
    step: "01",
    title: "Konsultasi Konsep & Target Pasar",
    detail:
      "Diskusikan ide produk, target konsumen, kisaran HPP, serta kategori kosmetik yang paling sesuai dengan positioning brand Anda bersama tim Business Development kami.",
  },
  {
    step: "02",
    title: "Riset Formula & Pembuatan Sampel",
    detail:
      "Tim R&D Dreamlab meracik custom formula (1 Client = 1 Formula) dan menyiapkan sampel awal untuk Anda uji tekstur, aroma, serta performanya sebelum lanjut ke tahap produksi.",
  },
  {
    step: "03",
    title: "Desain Kemasan & Pendaftaran Legalitas",
    detail:
      "Kami membantu visualisasi desain kemasan sekaligus mengurus registrasi izin edar BPOM RI, sertifikasi Halal MUI, serta pendampingan pendaftaran merek (HAKI).",
  },
  {
    step: "04",
    title: "Produksi Massal di Pabrik CPKB Grade A",
    detail:
      "Setelah sampel disetujui dan legalitas berjalan, produksi massal dilakukan di fasilitas berstandar CPKB Grade A di Surabaya dengan kontrol mutu yang terukur.",
  },
  {
    step: "05",
    title: "Quality Control & Pengiriman Produk",
    detail:
      "Setiap batch melalui pemeriksaan kualitas dan pengemasan akhir sebelum dikirim ke gudang atau lokasi distribusi Anda agar siap dipasarkan.",
  },
];

const produkFaqs = [
  {
    question: "Berapa Minimum Order Quantity (MOQ) maklon kosmetik di Dreamlab?",
    answer:
      "Dreamlab menerapkan MOQ yang fleksibel dan menyesuaikan dengan kategori produk, jenis kemasan, serta kompleksitas bahan aktif yang dipilih. Skema ini dirancang agar brand pemula maupun brand yang sudah berjalan dapat melakukan uji pasar tanpa terbebani stok awal yang terlalu besar.",
  },
  {
    question: "Berapa lama estimasi proses maklon hingga izin BPOM terbit?",
    answer:
      "Secara umum, keseluruhan proses memakan waktu sekitar 2 hingga 3 bulan. Rinciannya mencakup riset dan pengembangan formula di laboratorium R&D (sekitar 2–4 minggu), proses registrasi izin edar BPOM RI (sekitar 4–8 minggu), pengurusan sertifikasi Halal, dan produksi massal (sekitar 2–3 minggu).",
  },
  {
    question: "Apakah formula produk di Dreamlab bersifat eksklusif untuk satu brand?",
    answer:
      "Ya. Dreamlab menerapkan prinsip 1 Client = 1 Formula. Formula yang diracik bersama tim R&D dirancang khusus sesuai brief dan karakter brand Anda, sehingga tidak diduplikasi secara identik untuk klien lain.",
  },
  {
    question: "Apakah Dreamlab membantu pengurusan sertifikat Halal MUI dan HAKI?",
    answer:
      "Ya, sebagai layanan maklon one-stop service, tim regulasi dan kepatuhan Dreamlab mendampingi pengurusan legalitas produk mulai dari notifikasi BPOM RI, sertifikasi Halal MUI, hingga pendaftaran merek (HAKI).",
  },
  {
    question: "Bagaimana cara mengajukan sampel formula sebelum produksi massal?",
    answer:
      "Anda dapat memulai dengan konsultasi gratis melalui tim kami untuk menyampaikan referensi produk, tekstur, dan target harga. Tim R&D akan membuatkan sampel awal untuk Anda evaluasi dan revisi hingga sesuai sebelum masuk ke lini produksi massal.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: produkFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function ProdukPage() {
  return (
    <main className="min-h-screen bg-white">
      <JsonLd data={faqSchema} />

      <section className="py-16 bg-brand-black">
        <div className="container-custom text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-5">
            Katalog Produk Maklon Dreamlab
          </h1>
          <p className="text-white/80 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
            Dreamlab adalah perusahaan maklon kosmetik dan parfum di Surabaya yang memproduksi rangkaian skincare, body care, hair care, kosmetik dekoratif, baby care, wewangian, hingga foot care dalam satu ekosistem layanan terpadu. Katalog ini dirancang untuk membantu pemilik brand baru, klinik kecantikan, reseller, hingga beautypreneur yang ingin membangun lini produk bermerek sendiri tanpa harus membangun pabrik. Setiap produk dikembangkan melalui sistem custom formula (1 Client = 1 Formula) di fasilitas berstandar CPKB Grade A, lengkap dengan pendampingan registrasi izin edar BPOM RI dan sertifikasi Halal MUI.
          </p>
        </div>
      </section>

      <KatalogProduk title={homepageData.katalog.title} categories={homepageData.katalog.categories} />

      <section className="py-16 bg-[#FAF9F6] border-t border-neutral-100">
        <div className="container-custom">
          <div className="max-w-3xl mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-black mb-3">
              Kategori Produk Maklon &amp; Spesialisasi Formula
            </h2>
            <p className="text-neutral-600 text-sm md:text-base leading-relaxed">
              Pilih kategori produk yang paling relevan dengan target audiens dan strategi distribusi bisnis Anda. Klik setiap kategori untuk melihat daftar varian produk dan opsi formulasi yang tersedia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorySummaries.map((cat) => (
              <div
                key={cat.href}
                className="bg-white rounded-2xl border border-neutral-200/80 p-6 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <h3 className="text-lg font-bold text-brand-black mb-2">{cat.name}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>
                <Link
                  href={cat.href}
                  className="inline-flex items-center text-sm font-bold text-brand-orange hover:underline"
                >
                  Lihat Katalog {cat.name} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-neutral-100">
        <div className="container-custom max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-black mb-4">
            Cara Memilih Produk Maklon untuk Brand Anda
          </h2>
          <div className="space-y-4 text-sm md:text-base text-neutral-600 leading-relaxed">
            <p>
              Menentukan produk pertama (<em>hero product</em>) merupakan langkah krusial sebelum memulai produksi batch awal. Mulailah dengan memetakan masalah utama yang dialami target pasar Anda, misalnya kulit kusam, jerawat, perawatan rambut rontok, atau kebutuhan parfum harian dengan karakter aroma tertentu. Produk dengan tingkat pemakaian rutin dan masa habis pakai yang jelas umumnya lebih mudah menghasilkan pembelian ulang (<em>repeat order</em>).
            </p>
            <p>
              Selanjutnya, sesuaikan pilihan kategori dan kemasan dengan struktur modal serta saluran penjualan utama Anda. Brand yang berjualan melalui marketplace dan media sosial sering memulai dari satu atau dua SKU unggulan agar anggaran pemasaran lebih fokus dan perputaran stok tetap sehat. Anda juga dapat mempelajari perhitungan komponen modal serta penentuan kuantitas order melalui halaman{" "}
              <Link href="/panduan/" className="text-brand-orange font-semibold hover:underline">
                panduan maklon Dreamlab
              </Link>{" "}
              atau melihat cakupan pendampingan lengkap di halaman{" "}
              <Link href="/services/" className="text-brand-orange font-semibold hover:underline">
                layanan maklon kosmetik
              </Link>
              . Jika Anda sudah memiliki gambaran konsep atau ingin berdiskusi langsung mengenai kesiapan batch pertama, silakan kunjungi halaman{" "}
              <Link href="/contact-us/" className="text-brand-orange font-semibold hover:underline">
                kontak Dreamlab
              </Link>{" "}
              untuk menjadwalkan sesi konsultasi.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#FAF9F6] border-t border-neutral-100">
        <div className="container-custom max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-brand-black mb-2">
                Alur Maklon di Dreamlab
              </h2>
              <p className="text-sm md:text-base text-neutral-600">
                Tahapan terstruktur dari penyusunan konsep hingga produk siap edar di pasaran.
              </p>
            </div>
            <Link
              href="/about-us/alur-maklon/"
              className="text-sm font-bold text-brand-orange hover:underline shrink-0"
            >
              Pelajari Alur Maklon Lengkap →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {maklonSteps.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm"
              >
                <span className="text-xs font-black tracking-widest text-brand-orange">
                  TAHAP {item.step}
                </span>
                <h3 className="text-base font-bold text-brand-black mt-2 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-neutral-100">
        <div className="container-custom max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-black mb-8">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <div className="space-y-4">
            {produkFaqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-2xl border border-neutral-200 bg-[#FAF9F6] p-5"
              >
                <summary className="cursor-pointer font-bold text-brand-black text-sm md:text-base">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        title="Wujudkan Brand Kosmetik Impian Anda dalam 3 Bulan"
        subtitle="Konsultasi gratis dengan tim Dreamlab untuk produk maklon Anda."
      />
    </main>
  );
}
