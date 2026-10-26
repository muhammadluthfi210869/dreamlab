import { Metadata } from 'next';
import { PageSchema } from "@/components/PageSchema";

const PAGE_URL = 'https://dreamlab.id/privacy-policy/';
const PAGE_TITLE = "Kebijakan Privasi | Dreamlab Maklon Kosmetik";
const PAGE_DESCRIPTION =
  "Kebijakan privasi Dreamlab (PT Karya Impian Laboratoris): data apa yang kami kumpulkan dari formulir konsultasi dan website, untuk apa digunakan, dengan siapa dibagikan, serta hak Anda sesuai UU Pelindungan Data Pribadi.";

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
    description: "Kebijakan privasi Dreamlab. Bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
  },
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-brand-white">
      <PageSchema
        url={PAGE_URL}
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        h1="Kebijakan Privasi"
        type="category"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Kebijakan Privasi' },
        ]}
      />
      <section className="pt-48 pb-24 bg-brand-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-brand-dark/30" />
        <div className="container-custom relative z-10">
          <div className="max-w-4xl">
            <nav className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <a href="/" className="hover:text-brand-orange transition-colors">Home</a>
              <span>/</span>
              <span className="text-white">Kebijakan Privasi</span>
            </nav>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
              Kebijakan <span className="text-brand-orange">Privasi</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <p>
              Kebijakan Privasi ini menjelaskan bagaimana PT Karya Impian Laboratoris (&ldquo;Dreamlab&rdquo;,
              &ldquo;kami&rdquo;) mengumpulkan, menggunakan, membagikan, dan melindungi data pribadi Anda saat
              Anda mengunjungi dreamlab.id, mengisi formulir konsultasi, atau menghubungi kami melalui WhatsApp.
              Kami memproses data pribadi sesuai Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data
              Pribadi (UU PDP) dan peraturan terkait, termasuk UU ITE.
            </p>

            <h2>1. Pengendali Data</h2>
            <p>
              Pengendali data pribadi adalah PT Karya Impian Laboratoris, penyedia jasa maklon kosmetik dengan merek
              dagang Dreamlab. Pertanyaan tentang privasi dapat dikirim ke{' '}
              <a href="mailto:info@dreamlab.id" className="text-brand-orange">info@dreamlab.id</a>.
            </p>

            <h2>2. Data yang Kami Kumpulkan</h2>
            <h3>Data yang Anda berikan</h3>
            <p>Saat mengisi formulir konsultasi produksi di halaman iklan kami, kami meminta:</p>
            <ul>
              <li>rencana kuantitas produksi (pilihan tier: 300, 500, 1.000, atau 5.000 pcs);</li>
              <li>jenis produk yang ingin dibuat (misalnya parfum, skincare, bodycare, atau haircare);</li>
              <li>nama lengkap; dan</li>
              <li>nomor WhatsApp aktif, termasuk kode negara bila Anda menggunakan nomor internasional.</li>
            </ul>
            <p>
              Pada jalur kontak lain, kami juga dapat menerima alamat email, nama perusahaan atau brand, dan
              kebutuhan proyek yang Anda tulis sendiri. Bila Anda mengirim pesan WhatsApp kepada tim kami, kami
              menerima nomor, nama profil WhatsApp, dan isi pesan Anda.
            </p>
            <h3>Data yang terkumpul otomatis</h3>
            <ul>
              <li>halaman yang Anda buka, halaman asal (referrer), serta waktu kunjungan;</li>
              <li>parameter kampanye iklan (UTM) dan pengenal klik iklan dari Google (gclid) atau Meta (fbclid);</li>
              <li>jenis perangkat dan browser, serta alamat IP;</li>
              <li>pengenal pengunjung anonim (cookie <code>dreamlab_vid</code>) untuk mengaitkan kunjungan dengan permintaan konsultasi.</li>
            </ul>

            <h2>3. Tujuan Penggunaan Data</h2>
            <ul>
              <li>menghubungi Anda melalui WhatsApp untuk konsultasi, penawaran, sampel, dan estimasi produksi;</li>
              <li>meneruskan permintaan Anda ke tim Business Development yang bertugas dan mengatur pembagian lead secara adil;</li>
              <li>mengelompokkan permintaan berdasarkan rencana kuantitas agar tim dapat menyiapkan penawaran yang sesuai;</li>
              <li>mengukur efektivitas iklan dan halaman website, serta meningkatkan layanan kami;</li>
              <li>memenuhi kewajiban hukum dan menjaga keamanan sistem kami.</li>
            </ul>

            <h2>4. Dasar Pemrosesan</h2>
            <p>
              Kami memproses data formulir berdasarkan persetujuan Anda, yaitu dengan mencentang persetujuan kontak
              sebelum mengirim formulir. Pengukuran kunjungan dan iklan dilakukan berdasarkan kepentingan yang sah
              dan, bila diwajibkan, persetujuan Anda atas cookie. Pemrosesan lain dilakukan untuk memenuhi kewajiban
              hukum atau menindaklanjuti permintaan Anda.
            </p>

            <h2>5. Dengan Siapa Data Dibagikan</h2>
            <p>Kami tidak menjual data pribadi Anda. Data dapat dibagikan hanya kepada:</p>
            <ul>
              <li>tim Business Development Dreamlab yang menangani permintaan Anda;</li>
              <li>Kommo, sistem CRM yang kami gunakan untuk mencatat dan menindaklanjuti lead;</li>
              <li>WhatsApp (Meta), sebagai kanal percakapan antara Anda dan tim kami;</li>
              <li>Google dan Meta, untuk pengukuran dan optimasi iklan. Kami tidak mengirim nama atau nomor telepon Anda ke jaringan iklan, hanya peristiwa konversi dan data kampanye;</li>
              <li>penyedia layanan analitik, hosting, dan basis data cloud yang membantu kami mengoperasikan website;</li>
              <li>mitra yang diperlukan untuk menjalankan layanan Anda (misalnya lembaga perizinan BPOM dan sertifikasi Halal, atau mitra logistik), hanya sebatas yang dibutuhkan; serta</li>
              <li>pihak berwenang bila diwajibkan oleh hukum.</li>
            </ul>

            <h2>6. Penyimpanan di Luar Indonesia</h2>
            <p>
              Sebagian penyedia layanan di atas memproses data di server di luar Indonesia. Kami hanya menggunakan
              penyedia yang menerapkan perlindungan data yang memadai dan memastikan pemrosesannya sesuai Kebijakan
              Privasi ini.
            </p>

            <h2>7. Lama Penyimpanan</h2>
            <p>
              Data permintaan konsultasi disimpan selama diperlukan untuk menindaklanjuti permintaan Anda dan paling
              lama 24 bulan sejak kontak terakhir, kecuali Anda menjadi klien (data disimpan selama hubungan kerja
              dan kewajiban hukum yang berlaku) atau hukum mewajibkan jangka waktu yang lebih lama. Setelah itu data
              dihapus atau dianonimkan.
            </p>

            <h2>8. Cookie dan Teknologi Pelacakan</h2>
            <p>Website ini menggunakan cookie dan skrip pihak ketiga berikut:</p>
            <ul>
              <li>Google Analytics 4 dan Google Tag Manager untuk statistik kunjungan;</li>
              <li>Google Ads untuk mengukur konversi iklan;</li>
              <li>Meta Pixel untuk mengukur konversi iklan Facebook dan Instagram;</li>
              <li>Microsoft Clarity untuk memahami cara pengunjung menggunakan halaman (rekaman sesi dan peta panas);</li>
              <li>cookie <code>dreamlab_vid</code> milik kami untuk pengenal pengunjung anonim.</li>
            </ul>
            <p>
              Anda dapat menolak atau menghapus cookie melalui pengaturan browser, dan menonaktifkan personalisasi
              iklan melalui pengaturan akun Google dan Meta Anda. Sebagian fitur website dapat berjalan kurang
              optimal bila cookie dinonaktifkan.
            </p>

            <h2>9. Hak Anda</h2>
            <p>Sesuai UU PDP, Anda berhak untuk:</p>
            <ul>
              <li>mengetahui dan mengakses data pribadi Anda yang kami simpan;</li>
              <li>memperbaiki data yang tidak akurat;</li>
              <li>meminta penghapusan atau pemusnahan data Anda;</li>
              <li>menarik persetujuan yang pernah diberikan;</li>
              <li>mengajukan keberatan atas pemrosesan tertentu dan meminta pembatasannya.</li>
            </ul>
            <p>
              Ajukan permintaan melalui <a href="mailto:info@dreamlab.id" className="text-brand-orange">info@dreamlab.id</a>{' '}
              atau WhatsApp resmi Dreamlab. Kami dapat meminta verifikasi identitas sebelum memproses permintaan,
              dan akan menanggapi dalam jangka waktu yang ditetapkan peraturan.
            </p>

            <h2>10. Keamanan Data</h2>
            <p>
              Kami menerapkan langkah teknis dan organisasi yang wajar untuk melindungi data pribadi dari akses,
              perubahan, pengungkapan, atau penghancuran yang tidak sah, antara lain pembatasan akses internal dan
              koneksi terenkripsi. Tidak ada sistem yang sepenuhnya bebas risiko. Bila terjadi kegagalan
              pelindungan data yang berdampak pada Anda, kami akan memberitahu Anda dan pihak berwenang sesuai
              ketentuan yang berlaku.
            </p>

            <h2>11. Anak di Bawah Umur</h2>
            <p>
              Layanan kami ditujukan bagi pelaku usaha dan calon pemilik brand dewasa. Kami tidak dengan sengaja
              mengumpulkan data anak di bawah umur.
            </p>

            <h2>12. Perubahan Kebijakan</h2>
            <p>
              Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Versi terbaru selalu tersedia di halaman
              ini beserta tanggal pembaruannya.
            </p>

            <h2>13. Hubungi Kami</h2>
            <p>
              Untuk pertanyaan atau permintaan terkait privasi, hubungi kami di{' '}
              <a href="mailto:info@dreamlab.id" className="text-brand-orange">info@dreamlab.id</a> atau melalui
              halaman <a href="/contact-us/" className="text-brand-orange">Kontak</a>.
            </p>

            <p className="text-gray-400 text-sm mt-12">Terakhir diperbarui: Oktober 2026</p>
          </div>
        </div>
      </section>
    </main>
  );
}
