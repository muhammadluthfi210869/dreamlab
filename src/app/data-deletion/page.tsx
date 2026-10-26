import { Metadata } from 'next';
import { PageSchema } from "@/components/PageSchema";

const PAGE_URL = 'https://dreamlab.id/data-deletion/';
const PAGE_TITLE = "Instruksi Penghapusan Data | Dreamlab Maklon Kosmetik";
const PAGE_DESCRIPTION =
  "Cara mencabut akses akun Instagram, Facebook, atau TikTok dari Dreamlab dan meminta penghapusan data Anda. Data dihapus paling lambat 30 hari setelah permintaan diterima.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: 'Dreamlab',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: "Cara mencabut akses dan meminta penghapusan data Anda dari Dreamlab.",
  },
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
};

export default function DataDeletionPage() {
  return (
    <main className="min-h-screen bg-brand-white">
      <PageSchema
        url={PAGE_URL}
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        h1="Instruksi Penghapusan Data"
        type="category"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Instruksi Penghapusan Data' },
        ]}
      />
      <section className="pt-48 pb-24 bg-brand-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-brand-dark/30" />
        <div className="container-custom relative z-10">
          <div className="max-w-4xl">
            <nav className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <a href="/" className="hover:text-brand-orange transition-colors">Home</a>
              <span>/</span>
              <span className="text-white">Instruksi Penghapusan Data</span>
            </nav>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
              Penghapusan <span className="text-brand-orange">Data</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <p>
              Halaman ini menjelaskan cara mencabut akses akun media sosial yang terhubung dengan Dreamlab dan
              cara meminta penghapusan data Anda. Data apa saja yang kami simpan dijelaskan di{' '}
              <a href="/privacy-policy/" className="text-brand-orange">Kebijakan Privasi</a>.
            </p>

            <h2>Langkah 1. Cabut akses di platform</h2>
            <ul>
              <li>
                <strong>Facebook dan Instagram:</strong> buka Pengaturan, pilih &ldquo;Aplikasi dan Situs
                Web&rdquo; (<em>Apps and Websites</em>), pilih aplikasi Dreamlab, lalu hapus.
              </li>
              <li>
                <strong>TikTok:</strong> buka Pengaturan dan privasi, pilih &ldquo;Kelola izin aplikasi&rdquo;
                (<em>Manage app permissions</em>), pilih aplikasi Dreamlab, lalu cabut izin.
              </li>
            </ul>
            <p>
              Setelah akses dicabut, Dreamlab tidak dapat lagi membaca atau menerbitkan konten melalui akun Anda.
            </p>

            <h2>Langkah 2. Kirim permintaan penghapusan</h2>
            <p>
              Kirim email ke{' '}
              <a
                href="mailto:info@dreamlab.id?subject=Permintaan%20Penghapusan%20Data"
                className="text-brand-orange"
              >
                info@dreamlab.id
              </a>{' '}
              dengan subjek <strong>&ldquo;Permintaan Penghapusan Data&rdquo;</strong>. Sertakan:
            </p>
            <ul>
              <li>nama akun (username) Instagram, Facebook, atau TikTok yang dimaksud; dan</li>
              <li>platform yang dihubungkan, serta nama Anda sebagai pemilik akun.</li>
            </ul>
            <p>
              Kami dapat meminta informasi tambahan untuk memastikan permintaan datang dari pemilik akun.
            </p>

            <h2>Langkah 3. Penghapusan dan konfirmasi</h2>
            <ul>
              <li>
                Data yang terkait dengan akun Anda kami hapus paling lambat <strong>30 hari</strong> sejak
                permintaan diterima. Data tersebut mencakup nama dan ID akun, access token, konten terjadwal atau
                terbit, dan metrik performa yang tersimpan di sistem kami.
              </li>
              <li>Setelah penghapusan selesai, kami mengirim konfirmasi melalui email.</li>
            </ul>

            <h2>Kontak</h2>
            <p>
              PT Karya Impian Laboratoris<br />
              Jl. Dukuh Kupang Timur XX. No. 77B, Kec. Sawahan, Kota Surabaya<br />
              Email: <a href="mailto:info@dreamlab.id" className="text-brand-orange">info@dreamlab.id</a>
            </p>

            <p className="text-gray-400 text-sm mt-12">Terakhir diperbarui: 26 Oktober 2026</p>
          </div>
        </div>
      </section>
    </main>
  );
}
