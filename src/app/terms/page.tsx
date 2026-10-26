import { Metadata } from 'next';
import { PageSchema } from "@/components/PageSchema";

const PAGE_URL = 'https://dreamlab.id/terms/';
const PAGE_TITLE = "Syarat dan Ketentuan | Dreamlab Maklon Kosmetik";
const PAGE_DESCRIPTION =
  "Syarat dan ketentuan penggunaan website dreamlab.id dan layanan terkait dari PT Karya Impian Laboratoris (Dreamlab): ruang lingkup layanan, penggunaan yang diizinkan, kekayaan intelektual, dan batasan tanggung jawab.";

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
    description: "Syarat dan ketentuan penggunaan website dan layanan Dreamlab.",
  },
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-brand-white">
      <PageSchema
        url={PAGE_URL}
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        h1="Syarat dan Ketentuan"
        type="category"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Syarat dan Ketentuan' },
        ]}
      />
      <section className="pt-48 pb-24 bg-brand-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-brand-dark/30" />
        <div className="container-custom relative z-10">
          <div className="max-w-4xl">
            <nav className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <a href="/" className="hover:text-brand-orange transition-colors">Home</a>
              <span>/</span>
              <span className="text-white">Syarat dan Ketentuan</span>
            </nav>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
              Syarat dan <span className="text-brand-orange">Ketentuan</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <p>
              Dengan mengakses website dreamlab.id atau menggunakan layanan terkait, Anda menyetujui syarat dan
              ketentuan berikut. Bila Anda tidak setuju, mohon hentikan penggunaan website ini.
            </p>

            <h2>1. Penyedia Layanan</h2>
            <p>
              Website dan layanan ini disediakan oleh <strong>PT Karya Impian Laboratoris</strong> (&ldquo;Dreamlab&rdquo;),
              beralamat di Jl. Dukuh Kupang Timur XX. No. 77B, Kec. Sawahan, Kota Surabaya. Kontak:{' '}
              <a href="mailto:info@dreamlab.id" className="text-brand-orange">info@dreamlab.id</a>.
            </p>

            <h2>2. Ruang Lingkup Layanan</h2>
            <ul>
              <li>
                <strong>Website dreamlab.id:</strong> menyediakan informasi tentang jasa maklon kosmetik Dreamlab,
                artikel, dan formulir atau tautan untuk meminta konsultasi.
              </li>
              <li>
                <strong>Sistem internal penjadwalan konten:</strong> alat internal yang dipakai tim Dreamlab untuk
                menjadwalkan, menerbitkan, dan menganalisis konten di akun media sosial milik Dreamlab sendiri.
                Sistem ini tidak terbuka untuk umum. Penanganan data pada sistem ini dijelaskan di{' '}
                <a href="/privacy-policy/" className="text-brand-orange">Kebijakan Privasi</a>.
              </li>
            </ul>

            <h2>3. Penggunaan yang Diizinkan</h2>
            <p>Anda boleh menggunakan website ini untuk mencari informasi dan menghubungi Dreamlab. Anda tidak boleh:</p>
            <ul>
              <li>memberikan data palsu atau milik orang lain melalui formulir atau saluran kontak kami;</li>
              <li>mengganggu, memindai secara berlebihan, atau mencoba mengakses sistem tanpa izin;</li>
              <li>menyalin, mengambil data (<em>scraping</em>), atau memperbanyak isi website secara massal tanpa izin tertulis;</li>
              <li>menggunakan website untuk tujuan melanggar hukum atau merugikan pihak lain.</li>
            </ul>

            <h2>4. Kekayaan Intelektual</h2>
            <p>
              Nama Dreamlab, logo, teks, gambar, infografik, dan materi lain di website ini adalah milik Dreamlab
              atau digunakan dengan izin pemiliknya. Anda tidak boleh menggunakannya untuk keperluan komersial
              tanpa persetujuan tertulis dari Dreamlab. Merek dan logo pihak ketiga, termasuk Meta, Instagram,
              Facebook, TikTok, dan WhatsApp, adalah milik masing-masing pemiliknya.
            </p>

            <h2>5. Informasi dan Estimasi</h2>
            <p>
              Informasi di website, termasuk estimasi biaya, tier produksi, dan jangka waktu, bersifat umum dan
              tidak mengikat. Penawaran dan perjanjian produksi baru berlaku setelah disepakati secara tertulis
              antara Anda dan Dreamlab.
            </p>

            <h2>6. Layanan Pihak Ketiga</h2>
            <p>
              Website dan layanan kami dapat terhubung dengan layanan pihak ketiga seperti WhatsApp, Instagram,
              Facebook, dan TikTok. Penggunaan layanan tersebut tunduk pada syarat dan kebijakan privasi masing-masing
              penyedia. Dreamlab tidak bertanggung jawab atas isi atau praktik layanan pihak ketiga.
            </p>

            <h2>7. Batasan Tanggung Jawab</h2>
            <p>
              Website disediakan &ldquo;sebagaimana adanya&rdquo;. Kami berupaya menjaga keakuratan dan
              ketersediaan website, tetapi tidak menjamin bahwa website selalu bebas gangguan atau kesalahan.
              Sejauh diizinkan hukum, Dreamlab tidak bertanggung jawab atas kerugian tidak langsung yang timbul
              dari penggunaan atau ketidakmampuan menggunakan website. Ketentuan ini tidak membatasi tanggung
              jawab yang menurut hukum tidak dapat dibatasi.
            </p>

            <h2>8. Perubahan Ketentuan</h2>
            <p>
              Kami dapat memperbarui syarat dan ketentuan ini. Versi terbaru berlaku sejak dipublikasikan di
              halaman ini, disertai tanggal pembaruan.
            </p>

            <h2>9. Hukum yang Berlaku</h2>
            <p>
              Syarat dan ketentuan ini tunduk pada hukum Republik Indonesia. Sengketa diselesaikan terlebih dahulu
              secara musyawarah. Bila tidak tercapai kesepakatan, sengketa diselesaikan melalui pengadilan yang
              berwenang di Indonesia.
            </p>

            <h2>10. Kontak</h2>
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
