import type { PilotPageData } from './batch-1';

export const pilotBatch2Routes = [
  '/pabrik-parfum',
  '/jasa-maklon-kosmetik',
  '/private-label-kosmetik',
  '/estimasi-biaya-maklon-kosmetik',
] as const;

// ========================================
// PABRIK PARFUM
// ========================================
export const pabrikParfumMoneyPage: PilotPageData = {
  slug: '/pabrik-parfum',
  title: 'Pabrik Parfum | Maklon Parfum BPOM & Halal Dreamlab',
  metaTitle: 'Pabrik Parfum | Maklon Parfum BPOM & Halal Terbaik Indonesia',
  metaDescription:
    'Pabrik parfum dengan layanan maklon parfum BPOM, Halal MUI & CPKB Grade A. Produksi eau de parfum, body mist, roll on, custom aroma. Konsultasi gratis.',
  canonical: 'https://dreamlab.id/pabrik-parfum/',
  pageType: 'money_page',
  seoCluster: 'pabrik_parfum',
  keywordTarget: 'pabrik parfum',
  publishedAt: '2026-07-13T00:00:00+07:00',
  updatedAt: '2026-07-17T00:00:00+07:00',
  lastUpdated: '17 Juli 2026',
  readingTime: '10 menit baca',
  heroHeadline: 'Pabrik Parfum dengan Layanan Maklon Aroma Custom',
  subheadline:
    'Dreamlab adalah pabrik parfum terpercaya yang melayani produksi eau de parfum, body mist, roll on, minyak atsiri, dan custom aroma untuk brand parfum Anda. Sudah dipercaya 500+ brand kosmetik dan parfum di Indonesia.',
  quickAnswers: [
    'Dreamlab adalah pabrik parfum bersertifikat CPKB Grade A, Halal MUI, dan BPOM — menjamin kualitas produk parfum brand Anda.',
    'Melayani maklon parfum: EDP, EDT, body mist, roll on, extrait de parfum, parfum padat, dan minyak atsiri.',
    'R&D parfum dengan perfumer profesional berpengalaman untuk menciptakan aroma custom eksklusif brand Anda.',
    'MOQ fleksibel dari 500 pcs untuk brand pemula hingga 10.000+ pcs untuk produksi massal skala besar.',
    'Free konsultasi aroma dan target market — tanpa komitmen, tanpa biaya awal.',
  ],
  decisionBox: {
    eyebrow: 'Decision Box',
    title: 'Pilih skala produksi parfum yang sesuai',
    description: 'Setiap brand parfum punya kebutuhan skala dan positioning berbeda. Sesuaikan pilihan dengan target pasar dan budget Anda.',
    items: [
      'Brand baru / indie: mulai dengan 1-3 varian aroma, MOQ kecil (500-1000 pcs) untuk validasi pasar dan menguji respons konsumen.',
      'Brand berkembang: scale hingga 5-10 varian aroma dengan variasi ukuran kemasan, tingkatkan kapasitas produksi berdasarkan data penjualan.',
      'Brand premium / niche: custom aroma eksklusif dari perfumer senior, kemasan premium dengan finishing khusus, dan sertifikasi lengkap untuk positioning high-end.',
      'Brand private label: pilih dari katalog aroma siap pakai Dreamlab, tambahkan sentuhan branding sendiri — lebih cepat dan ekonomis.',
    ],
  },
  table: {
    eyebrow: 'Tipe Produk',
    title: 'Format parfum yang bisa diproduksi di pabrik Dreamlab',
    headers: ['Tipe', 'Konsentrasi', 'Daya Tahan', 'Target Pasar', 'Harga Jual Rata-rata'],
    rows: [
      ['Eau de Parfum (EDP)', '15-20%', '6-8 jam', 'Premium, dewasa 25-45 tahun', 'Rp150.000 – Rp400.000'],
      ['Eau de Toilette (EDT)', '8-15%', '4-6 jam', 'Mass market, daily wear', 'Rp80.000 – Rp200.000'],
      ['Body Mist', '3-8%', '2-4 jam', 'Remaja, casual, first parfum', 'Rp40.000 – Rp100.000'],
      ['Extrait de Parfum', '20-40%', '8-12+ jam', 'Luxury, niche, collector', 'Rp350.000 – Rp800.000+'],
      ['Roll On Parfum', '10-20%', '4-6 jam', 'Praktis, on-the-go, travel size', 'Rp50.000 – Rp120.000'],
      ['Minyak Atsiri (Essential Oil)', '100% oil', 'Variatif', 'Aromaterapi, natural, wellness', 'Rp60.000 – Rp150.000'],
      ['Parfum Padat (Solid)', '30-50% wax blend', '4-8 jam', 'Eco-conscious, travel-friendly', 'Rp70.000 – Rp180.000'],
    ],
  },
  sections: [
    {
      title: 'Mengapa memilih pabrik parfum Dreamlab untuk brand Anda',
      body: [
        'Memilih pabrik parfum yang tepat adalah keputusan krusial yang menentukan kualitas produk, kredibilitas brand, dan kepuasan pelanggan Anda. Dreamlab sebagai pabrik parfum telah memiliki sertifikasi CPKB Grade A (Cara Pembuatan Kosmetik yang Baik), Halal MUI, dan terdaftar BPOM — tiga sertifikasi utama yang menjamin produk parfum Anda diproduksi sesuai standar tertinggi industri kosmetik Indonesia.',
        'Tim R&D kami terdiri dari perfumer profesional yang telah berpengalaman bertahun-tahun dalam meracik berbagai jenis aroma, dari floral, fruity, woody, oriental, hingga fragrance kompleks untuk niche market. Setiap formula diuji stabilitas dan ketahanannya sebelum diproduksi massal.',
        'Kami memahami bahwa setiap brand parfum memiliki DNA aroma yang berbeda. Oleh karena itu, pabrik parfum Dreamlab memberikan fleksibilitas penuh dalam pengembangan produk — Anda tidak perlu menerima formula standar yang itu-itu saja.',
      ],
      bullets: [
        'Sertifikasi CPKB Grade A — standar tertinggi produksi kosmetik di Indonesia.',
        'Sertifikasi Halal MUI — produk parfum halal tanpa alkohol berbahaya.',
        'Terdaftar BPOM RI — setiap produk memiliki notifikasi BPOM resmi.',
        'Perfumer profesional dengan pengalaman internasional dalam meracik fragrance.',
        'Lab R&D internal untuk pengujian stabilitas, keamanan, dan ketahanan aroma.',
        'Sudah dipercaya oleh 500+ brand kosmetik dan parfum di seluruh Indonesia.',
      ],
    },
    {
      title: 'Layanan maklon parfum dari konsep hingga launch',
      body: [
        'Pabrik parfum Dreamlab menyediakan layanan maklon parfum one-stop solution mulai dari konsultasi awal, pengembangan formula oleh perfumer profesional, produksi di fasilitas CPKB Grade A, pemilihan kemasan botol dan box, hingga pengurusan notifikasi BPOM dan sertifikasi Halal.',
        'Dengan pendekatan one-stop solution, Anda tidak perlu berpindah-pindah vendor. Semua proses terintegrasi dalam satu atap untuk memastikan konsistensi kualitas dari batch pertama hingga seterusnya. Ini menghemat waktu, biaya koordinasi, dan mengurangi risiko miskomunikasi antar vendor.',
        'Kami melayani berbagai skala bisnis: dari founder brand indie yang baru launching dengan 1 varian aroma, hingga perusahaan besar yang membutuhkan kapasitas produksi ribuan pcs per bulan untuk distribusi nasional.',
      ],
      bullets: [
        'Free konsultasi awal: analisis target market, kompetitor, dan tren aroma terkini bersama tim Business Development.',
        'Custom formulasi oleh perfumer: aroma eksklusif yang tidak bisa ditiru kompetitor, dengan sesi sniffing dan revisi.',
        'Produksi di pabrik CPKB Grade A: fasilitas steril, quality control ketat di setiap tahap produksi.',
        'Pilihan kemasan fleksibel: botol spray (aluminium, kaca, plastik), roll on, decant, roll ball, box custom dengan MOQ sesuai skala bisnis.',
        'Bantuan legalitas: pengurusan notifikasi BPOM dan sertifikasi Halal MUI tanpa ribet.',
        'Flexible MOQ: mulai dari 500 pcs untuk brand pemula, hingga 10.000+ pcs untuk distribusi skala besar.',
      ],
    },
    {
      title: 'Proses produksi parfum di pabrik Dreamlab — step by step',
      body: [
        'Bingung bagaimana proses produksi parfum dari awal hingga jadi? Berikut adalah tahapan lengkap yang akan Anda lalui ketika bekerja sama dengan pabrik parfum Dreamlab. Seluruh proses dirancang transparan sehingga Anda bisa memantau perkembangan produk di setiap tahap.',
        'Dari konsultasi awal hingga produk siap jual, rata-rata memakan waktu 6-10 minggu tergantung kompleksitas aroma dan kemasan. Untuk private label (formula siap pakai), proses bisa lebih cepat hingga 3-4 minggu.',
      ],
      bullets: [
        'Konsultasi awal (hari 1-3): diskusi konsep aroma, target market, budget, dan timeline produksi. Tim Business Development akan membantu Anda menentukan arah produk.',
        'Brief aroma (hari 3-7): Anda mengisi brief aroma — mood board, referensi parfum favorit, target demografi. Perfumer mulai bekerja berdasarkan brief ini.',
        'Pengembangan formula (minggu 2-4): perfumer meracik 2-3 sampel aroma. Anda melakukan sesi sniffing, memberikan feedback, dan memilih aroma final. Revisi maksimal 3 sesi.',
        'Uji stabilitas & keamanan (minggu 4-5): formula final diuji stabilitasnya dalam berbagai suhu dan kondisi penyimpanan. Juga dilakukan uji iritasi untuk keamanan penggunaan.',
        'Produksi massal (minggu 6-8): setelah formula disetujui dan uji selesai, produksi berjalan di fasilitas CPKB Grade A dengan pengawasan quality control ketat.',
        'Pengurusan BPOM & Halal (minggu 6-9): paralel dengan produksi, tim legalitas kami mengurus notifikasi BPOM dan sertifikasi Halal produk Anda.',
        'Pengepakan & pengiriman (minggu 8-10): produk jadi dikemas dengan kemasan yang sudah disetujui, siap dikirim ke alamat tujuan.',
      ],
    },
  ],
  checklist: {
    eyebrow: 'Checklist',
    title: 'Checklist persiapan sebelum produksi parfum',
    description: 'Agar proses produksi parfum berjalan lancar, siapkan hal-hal berikut sebelum konsultasi dengan tim pabrik parfum Dreamlab.',
    items: [
      'Tentukan konsep brand parfum: nama brand, target pasar (usia, gender, gaya hidup), dan positioning harga.',
      'Kumpulkan referensi aroma: minimal 3-5 parfum favorit yang mendekati aroma yang Anda inginkan (bisa dari brand lokal atau internasional).',
      'Siapkan budget estimasi: tentukan range budget untuk produksi, kemasan, dan legalitas. Tim Dreamlab akan membantu menyesuaikan dengan kebutuhan.',
      'Tentukan kanal penjualan: online (Shopee, Tokopedia, TikTok Shop, website) atau offline (distribusi toko, reseller) — ini memengaruhi jenis kemasan dan volume produksi.',
      'Pertimbangkan musim dan tren: apakah target launch bertepatan dengan momen tertentu (Lebaran, tahun baru, musim liburan) untuk memaksimalkan penjualan.',
      'Cek regulasi: pastikan Anda memahami regulasi BPOM untuk produk parfum yang berlaku di Indonesia.',
    ],
  },
  faq: [
    {
      question: 'Apakah pabrik parfum Dreamlab melayani custom aroma?',
      answer: 'Ya. Kami memiliki perfumer profesional yang bisa menciptakan aroma custom eksklusif sesuai brief brand Anda. Prosesnya dimulai dari konsultasi aroma, pembuatan sampel (biasanya 2-3 varian), sesi sniffing, revisi, hingga approval formula final.',
    },
    {
      question: 'Berapa MOQ minimum di pabrik parfum Dreamlab?',
      answer: 'MOQ bervariasi tergantung jenis produk dan kemasan yang dipilih. Untuk brand pemula, tersedia MOQ fleksibel mulai dari 500 pcs untuk body mist atau roll on. Untuk EDP dengan botol kaca premium, MOQ mulai 1.000 pcs. Konsultasi gratis untuk detail MOQ sesuai kebutuhan Anda.',
    },
    {
      question: 'Apakah pabrik parfum Dreamlab membantu pengurusan BPOM?',
      answer: 'Ya. Kami memberikan pendampingan penuh untuk pengurusan notifikasi BPOM kosmetik dan sertifikasi Halal MUI. Tim legalitas kami yang berpengalaman akan mengurus dokumen dan persyaratan yang diperlukan agar produk Anda legal dan siap dipasarkan di Indonesia.',
    },
    {
      question: 'Berapa lama proses produksi parfum di pabrik Dreamlab?',
      answer: 'Estimasi waktu produksi 6-10 minggu tergantung kompleksitas aroma, jenis kemasan, dan kebutuhan legalitas. Untuk private label (formula siap pakai), proses bisa lebih cepat sekitar 3-4 minggu karena tidak perlu pengembangan formula dari awal.',
    },
    {
      question: 'Apakah ada jaminan kualitas untuk produk parfum yang diproduksi?',
      answer: 'Setiap batch produksi di pabrik parfum Dreamlab melalui quality control ketat meliputi uji organoleptik (warna, aroma, penampakan), uji stabilitas (suhu ruang, 40°C, 4°C, cycling), uji pH, uji berat jenis, dan uji mikroba. Hasil QC terdokumentasi dan bisa diakses oleh klien.',
    },
    {
      question: 'Apakah bisa produksi parfum dengan alkohol halal?',
      answer: 'Ya. Dreamlab menggunakan bahan baku yang telah tersertifikasi Halal MUI, termasuk alternatif alkohol yang diizinkan untuk produk kosmetik dan parfum. Kami juga melayani produksi parfum tanpa alkohol (oil-based) untuk kebutuhan spesifik.',
    },
    {
      question: 'Apakah pabrik parfum Dreamlab bisa melayani ekspor?',
      answer: 'Ya. Dreamlab melayani produksi untuk kebutuhan ekspor dengan dokumentasi lengkap dan spesifikasi produk yang sesuai regulasi negara tujuan. Konsultasikan kebutuhan ekspor Anda dengan tim kami untuk informasi lebih lanjut.',
    },
  ],
  heroCtas: [
    {
      label: 'Konsultasi Aroma',
      href: '/thankyou/google/?source=pabrik-parfum-hero',
      tone: 'primary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin konsultasi produksi parfum di pabrik parfum Anda.',
    },
    {
      label: 'Kirim Brief Parfum',
      href: '/thankyou/google/?source=pabrik-parfum-hero',
      tone: 'secondary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin kirim brief untuk produksi parfum.',
    },
  ],
  contextualCta: {
    eyebrow: 'Mulai Produksi',
    title: 'Siap memproduksi parfum di pabrik parfum terpercaya?',
    description: 'Tim Dreamlab siap membantu Anda dari konsep aroma hingga produk siap jual.',
    primaryLabel: 'Konsultasi Gratis',
    primaryMessage: 'Halo Dreamlab, saya ingin konsultasi produksi parfum.',
    secondaryLabel: 'Kirim Brief',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk parfum.',
  },
  finalCta: {
    eyebrow: 'Mulai Sekarang',
    title: 'Wujudkan brand parfum Anda bersama pabrik parfum Dreamlab',
    description: 'Dari custom aroma hingga legalitas BPOM, semua tersedia dalam satu atap.',
    primaryLabel: 'Konsultasi Gratis',
    primaryMessage: 'Halo Dreamlab, saya ingin konsultasi produksi parfum.',
    secondaryLabel: 'Kirim Brief',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk parfum.',
  },
  stickyCta: {
    primaryLabel: 'Konsultasi Gratis',
    primaryMessage: 'Halo Dreamlab, saya ingin konsultasi produksi parfum.',
    secondaryLabel: 'Kirim Brief',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk parfum.',
  },
  relatedSection: {
    eyebrow: 'Layanan Terkait',
    title: 'Jelajahi layanan pabrik parfum lainnya',
    description: 'Lihat kategori produk dan layanan maklon yang tersedia.',
  },
  relatedLinks: [
    {
      label: 'Maklon Parfum',
      href: '/maklon-parfum',
      description: 'Layanan maklon parfum lengkap dari pabrik parfum Dreamlab.',
      intent: 'primary',
    },
    {
      label: 'Produk Parfum',
      href: '/produk/parfum',
      description: 'Lihat berbagai jenis produk parfum yang bisa diproduksi.',
      intent: 'secondary',
    },
  ],
  leadForm: {
    title: 'Mulai Produksi Parfum',
    description: 'Kirim brief aroma dan target pasar Anda. Tim kami akan menghubungi dengan solusi yang tepat.',
    submitLabel: 'Kirim Brief',
  },
};

// ========================================
// JASA MAKLON KOSMETIK
// ========================================
export const jasaMaklonKosmetikMoneyPage: PilotPageData = {
  slug: '/jasa-maklon-kosmetik',
  title: 'Jasa Maklon Kosmetik | Produksi BPOM & Halal Dreamlab',
  metaTitle: 'Jasa Maklon Kosmetik | Produksi BPOM, Halal & CPKB Grade A',
  metaDescription:
    'Jasa maklon kosmetik terpercaya dengan CPKB Grade A, Halal MUI & BPOM. Produksi skincare, bodycare, haircare, parfum, baby care & kosmetik lainnya. Konsultasi gratis.',
  canonical: 'https://dreamlab.id/jasa-maklon-kosmetik/',
  pageType: 'money_page',
  seoCluster: 'jasa_maklon_kosmetik',
  keywordTarget: 'jasa maklon kosmetik',
  publishedAt: '2026-07-13T00:00:00+07:00',
  updatedAt: '2026-07-17T00:00:00+07:00',
  lastUpdated: '17 Juli 2026',
  readingTime: '11 menit baca',
  heroHeadline: 'Jasa Maklon Kosmetik One-Stop Solution untuk Brand Anda',
  subheadline:
    'Dreamlab menyediakan jasa maklon kosmetik lengkap: formulasi custom, produksi CPKB Grade A, kemasan premium, dan pengurusan BPOM & Halal. 500+ brand telah mempercayakan produksi skincare, bodycare, haircare, parfum, dan baby care kepada kami sejak 2021.',
  quickAnswers: [
    'Jasa maklon kosmetik Dreamlab melayani 8+ kategori: skincare, body care, hair care, parfum, baby care, decorative, foot care, dan PKRT.',
    'Sertifikasi lengkap: CPKB Grade A (nilai tertinggi), Halal MUI, dan terdaftar resmi di BPOM RI.',
    'Custom formulasi oleh tim R&D profesional — dari bahan aktif skincare hingga formula parfum kompleks.',
    'MOQ fleksibel: mulai dari 500 pcs untuk produk standar, cocok untuk brand pemula hingga enterprise.',
    'Free konsultasi awal: analisis produk, target market, dan estimasi biaya tanpa komitmen.',
  ],
  decisionBox: {
    eyebrow: 'Decision Box',
    title: 'Jasa maklon kosmetik untuk setiap tahap bisnis',
    description: 'Setiap brand punya kebutuhan berbeda. Pilih jasa maklon kosmetik yang sesuai dengan tahap bisnis Anda saat ini.',
    items: [
      'Brand pemula: butuh jasa maklon dengan MOQ rendah (500-1000 pcs), pendampingan BPOM penuh, dan formula yang sudah teruji. Dreamlab menyediakan paket starter khusus untuk founder baru.',
      'Brand berkembang: butuh kapasitas produksi 2000-10.000 pcs/bulan, variasi formula custom (2-5 varian), dan kemasan lebih premium untuk bersaing di pasar yang lebih luas.',
      'Brand premium / established: butuh R&D eksklusif dengan bahan aktif premium (peptide, ceramide, retinal, gold), kemasan mewah (double wall, frosted glass, hot stamping), dan sertifikasi lengkap.',
      'Brand private label: solusi tercepat untuk brand yang ingin launch tanpa proses R&D panjang. Pilih dari katalog formula siap pakai Dreamlab dan tambahkan identitas brand Anda.',
    ],
  },
  table: {
    eyebrow: 'Kategori Produk',
    title: 'Kategori produk kosmetik yang bisa diproduksi',
    headers: ['Kategori', 'Contoh Produk', 'Sertifikasi', 'Estimasi Waktu Produksi'],
    rows: [
      ['Skincare', 'Serum, toner, moisturizer, sunscreen SPF, facial wash, masker', 'BPOM, Halal', '6-10 minggu'],
      ['Body Care', 'Body butter, body lotion, body scrub, shower gel, massage oil', 'BPOM, Halal', '5-8 minggu'],
      ['Hair Care', 'Shampoo, hair mask, hair tonic, hair serum, conditioner', 'BPOM, Halal', '5-8 minggu'],
      ['Parfum', 'EDP, EDT, body mist, roll on, extrait de parfum, minyak atsiri', 'BPOM, Halal', '6-10 minggu'],
      ['Baby Care', 'Baby lotion, baby wash, baby powder, baby oil, diaper cream', 'BPOM, Halal', '6-8 minggu'],
      ['Decorative', 'Lip cream, cushion, mascara, blush on, foundation, eyeliner', 'BPOM, Halal', '8-12 minggu'],
      ['Foot Care', 'Foot cream, foot spray, foot scrub, foot mask', 'BPOM, Halal', '5-7 minggu'],
      ['PKRT', 'Antiseptik, hand sanitizer, disinfektan, pembersih wajah', 'BPOM, Halal', '4-6 minggu'],
    ],
  },
  sections: [
    {
      title: 'Mengapa memilih jasa maklon kosmetik Dreamlab',
      body: [
        'Jasa maklon kosmetik Dreamlab menawarkan solusi lengkap untuk brand kosmetik Anda, baik Anda seorang founder pemula yang baru ingin memiliki produk pertama, maupun pebisnis kosmetik yang ingin scale up produksi. Dengan fasilitas produksi bersertifikat CPKB Grade A (peringkat tertinggi dari BPOM), tim R&D profesional, serta pengalaman melayani 500+ brand sejak 2021, kami siap membantu mewujudkan produk kosmetik impian Anda.',
        'Apa yang membedakan jasa maklon kosmetik Dreamlab dari yang lain? Kami tidak hanya menerima pesanan produksi. Kami mendampingi Anda dari nol — mulai dari konsultasi konsep produk, pemilihan bahan aktif yang tepat dan sesuai budget, pengembangan formula oleh tim R&D, pengurusan legalitas BPOM dan Halal MUI, hingga produk jadi siap jual. Semua dalam satu atap, tanpa perlu koordinasi dengan belasan vendor berbeda.',
        'Kami memahami bahwa setiap brand memiliki DNA, target pasar, dan budget yang berbeda. Oleh karena itu, jasa maklon kosmetik kami dirancang fleksibel — tidak ada pendekatan one-size-fits-all. Dari skala kecil untuk brand pemula dengan MOQ 500 pcs, hingga produksi massal puluhan ribu pcs untuk brand besar yang sudah memiliki distribusi nasional.',
      ],
      bullets: [
        'CPKB Grade A — sertifikasi tertinggi yang dikeluarkan BPOM untuk fasilitas produksi kosmetik.',
        'Halal MUI — seluruh produk menggunakan bahan baku halal dan diproses sesuai standar syariah.',
        'Terdaftar BPOM RI — setiap produk mendapatkan izin edar resmi dari Badan POM.',
        'Tim R&D internal dengan spesialisasi per kategori produk (skincare, haircare, parfum, dll).',
        'Lab pengujian stabilitas, keamanan, dan efektivitas produk terintegrasi.',
        'Flexible MOQ — mulai 500 pcs untuk produk standar, tanpa tekanan minimal order.',
        'Pendampingan BPOM penuh — tim legalitas kami yang urus dokumen, Anda tinggal tanda tangan.',
      ],
    },
    {
      title: 'Layanan lengkap jasa maklon kosmetik Dreamlab',
      body: [
        'Jasa maklon kosmetik Dreamlab mencakup seluruh aspek produksi dari hulu ke hilir. Berikut adalah detail layanan yang akan Anda dapatkan ketika bekerja sama dengan kami. Tidak perlu mencari vendor terpisah untuk formulasi, produksi, kemasan, dan legalitas — semua terintegrasi dan terkoordinasi oleh satu tim.',
        'Setiap layanan memiliki timeline dan milestone yang jelas. Anda akan mendapatkan project manager khusus yang akan menjadi satu pintu komunikasi selama proses produksi berlangsung. Ini memastikan tidak ada miskomunikasi dan Anda selalu tahu posisi produk Anda.',
      ],
      bullets: [
        'Konsultasi & Briefing: analisis konsep produk, target pasar, kompetitor, tren terkini, dan penyusunan spesifikasi produk awal — GRATIS tanpa biaya.',
        'Formulasi & R&D: tim R&D mengembangkan formula sesuai brief. Untuk custom formula, disediakan 2-3 sampel awal. Proses revisi maksimal 3 sesi hingga formula approved.',
        'Produksi: dilaksanakan di fasilitas CPKB Grade A dengan pengawasan ketat. Setiap tahap produksi didokumentasikan untuk traceability.',
        'Quality Control: uji organoleptik, uji stabilitas, uji iritasi, uji mikroba, dan uji pH. Sertifikat QC diberikan untuk setiap batch produksi.',
        'Kemasan: bantuan pemilihan supplier kemasan (botol, jar, tube, box, label) dengan harga kompetitif. Tersedia pilihan kemasan standar dan custom.',
        'Legalitas: pengurusan notifikasi BPOM, sertifikasi Halal MUI, dan dokumen pendukung lainnya. Tim legalitas berpengalaman akan mengurus seluruh proses.',
        'Logistik: pengemasan produk jadi dan pengiriman ke alamat tujuan menggunakan mitra logistik terpercaya.',
      ],
    },
    {
      title: 'Industri yang cocok menggunakan jasa maklon kosmetik Dreamlab',
      body: [
        'Jasa maklon kosmetik Dreamlab melayani berbagai jenis bisnis dan industri. Apapun latar belakang Anda, jika ingin memiliki produk kosmetik dengan brand sendiri, kami siap membantu. Berikut adalah profil klien yang paling sering menggunakan jasa kami.',
        'Tidak peduli Anda sudah punya pengalaman di industri kosmetik atau benar-benar baru pertama kali — tim Dreamlab akan mendampingi Anda dari awal hingga produk jadi. Bahkan sebagian besar klien kami adalah first-timer yang sebelumnya tidak memiliki latar belakang di industri kosmetik.',
      ],
      bullets: [
        'Founder brand kosmetik baru: ingin memulai brand sendiri tapi bingung proses produksi dan legalitas.',
        'Influencer / content creator: ingin monetisasi audiens dengan brand kosmetik pribadi.',
        'Klinik kecantikan & spa: ingin memiliki produk private label untuk menunjang bisnis klinik.',
        'Distributor & reseller: ingin memiliki produk eksklusif dengan margin lebih baik.',
        'Pengusaha Muslim: butuh jaminan kehalalan produk untuk segmen pasar spesifik.',
        'Eksportir: produksi kosmetik dengan standar internasional untuk pasar luar negeri.',
      ],
    },
  ],
  checklist: {
    eyebrow: 'Checklist',
    title: 'Checklist persiapan sebelum menggunakan jasa maklon kosmetik',
    description: 'Agar proses produksi berjalan lancar dan efisien, siapkan dokumen dan informasi berikut sebelum konsultasi pertama dengan tim Dreamlab.',
    items: [
      'Tentukan konsep brand: nama brand, identitas visual dasar, dan unique selling proposition (USP) produk Anda.',
      'Identifikasi target pasar: usia, jenis kelamin, gaya hidup, lokasi geografis, dan daya beli konsumen ideal Anda.',
      'Pilih kategori produk: fokus pada 1-2 kategori dulu (misal: serum wajah + moisturizer) untuk memudahkan proses produksi awal.',
      'Tentukan budget: siapkan estimasi budget produksi (formula, kemasan, legalitas) agar tim Dreamlab bisa menyesuaikan rekomendasi. Konsultasi gratis untuk membantu Anda menentukan budget realistis.',
      'Riset kompetitor: analisis produk kompetitor langsung — cek formula, kemasan, harga jual, dan ulasan pelanggan untuk menemukan celih pasar.',
      'Siapkan timeline: tentukan target launch produk. Idealnya beri waktu 3-4 bulan untuk proses produksi dan legalitas.',
      'Pertimbangkan kanal distribusi: online (marketplace, website, sosial media) vs offline (toko, klinik, spa) — ini memengaruhi jenis kemasan dan volume produksi.',
    ],
  },
  faq: [
    {
      question: 'Apa saja layanan yang termasuk dalam jasa maklon kosmetik Dreamlab?',
      answer: 'Layanan lengkap meliputi: (1) konsultasi awal dan analisis produk, (2) formulasi custom oleh tim R&D, (3) produksi di fasilitas CPKB Grade A, (4) quality control setiap batch, (5) bantuan pemilihan dan pengadaan kemasan, (6) pengurusan notifikasi BPOM, (7) pengurusan sertifikasi Halal MUI, (8) pengemasan dan pengiriman produk jadi. Satu atap, tanpa ribet koordinasi antar vendor.',
    },
    {
      question: 'Berapa MOQ minimum untuk jasa maklon kosmetik di Dreamlab?',
      answer: 'MOQ minimum bervariasi tergantung kategori produk dan kompleksitas formulasi. Untuk produk standar seperti body lotion atau body mist, MOQ mulai 500 pcs. Untuk produk dengan formula kompleks seperti serum atau krim wajah, MOQ mulai 1000 pcs. Tersedia paket starter untuk brand pemula dengan MOQ lebih fleksibel.',
    },
    {
      question: 'Apakah jasa maklon kosmetik Dreamlab membantu pengurusan BPOM?',
      answer: 'Ya, pendampingan BPOM dan Halal MUI termasuk dalam layanan jasa maklon kosmetik kami. Tim legalitas kami yang berpengalaman akan mengurus seluruh dokumen persyaratan, mengajukan notifikasi BPOM, dan memastikan produk Anda mendapatkan izin edar resmi. Anda cukup menyediakan dokumen perusahaan dan tanda tangan.',
    },
    {
      question: 'Berapa lama proses produksi dengan jasa maklon kosmetik Dreamlab?',
      answer: 'Estimasi waktu bervariasi: untuk produk private label (formula siap pakai) sekitar 4-6 minggu, untuk custom formula baru 8-12 minggu, untuk produk decorative kosmetik (lip cream, cushion) 10-14 minggu. Timeline detail akan diberikan saat konsultasi awal sesuai dengan kompleksitas produk Anda.',
    },
    {
      question: 'Apakah bisa minta sampel produk sebelum memutuskan produksi?',
      answer: 'Ya. Kami menyediakan sesi konsultasi awal gratis di kantor marketing Dreamlab Surabaya. Anda bisa datang, diskusi dengan tim Business Development, melihat portofolio produk, dan mendapatkan gambaran jelas tentang produk yang ingin Anda buat. Untuk sampel formula, akan dibuat setelah brief produk disepakati.',
    },
    {
      question: 'Apa perbedaan jasa maklon kosmetik Dreamlab dengan maklon lainnya?',
      answer: 'Perbedaan utama: (1) satu atap — dari konsep hingga legalitas, tidak perlu vendor terpisah, (2) CPKB Grade A — standar tertinggi produksi kosmetik, (3) tim R&D multi-kategori — bukan generalis, (4) MOQ fleksibel tanpa tekanan minimal order, (5) free konsultasi awal — analisis bisnis sebelum produksi, (6) 500+ brand telah menggunakan jasa kami.',
    },
    {
      question: 'Apakah Dreamlab melayani produksi untuk ekspor?',
      answer: 'Ya. Dreamlab melayani produksi kosmetik untuk kebutuhan ekspor. Kami dapat menyesuaikan formula dan kemasan sesuai regulasi negara tujuan. Konsultasikan rencana ekspor Anda dengan tim kami untuk informasi lebih detail mengenai persyaratan dan dokumentasi yang diperlukan.',
    },
  ],
  heroCtas: [
    {
      label: 'Konsultasi Gratis',
      href: '/thankyou/google/?source=jasa-maklon-hero',
      tone: 'primary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin konsultasi jasa maklon kosmetik.',
    },
    {
      label: 'Kirim Brief Produk',
      href: '/thankyou/google/?source=jasa-maklon-hero',
      tone: 'secondary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin kirim brief untuk jasa maklon kosmetik.',
    },
  ],
  contextualCta: {
    eyebrow: 'Mulai Produksi',
    title: 'Siap memulai dengan jasa maklon kosmetik terpercaya?',
    description: 'Tim Dreamlab siap membantu dari formulasi hingga legalitas.',
    primaryLabel: 'Konsultasi Gratis',
    primaryMessage: 'Halo Dreamlab, saya ingin konsultasi jasa maklon kosmetik.',
    secondaryLabel: 'Kirim Brief',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk.',
  },
  finalCta: {
    eyebrow: 'Mulai Sekarang',
    title: 'Wujudkan brand kosmetik Anda dengan jasa maklon kosmetik Dreamlab',
    description: 'Satu atap untuk semua kebutuhan produksi kosmetik Anda.',
    primaryLabel: 'Konsultasi Gratis',
    primaryMessage: 'Halo Dreamlab, saya ingin konsultasi jasa maklon kosmetik.',
    secondaryLabel: 'Kirim Brief',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk.',
  },
  stickyCta: {
    primaryLabel: 'Konsultasi Gratis',
    primaryMessage: 'Halo Dreamlab, saya ingin konsultasi jasa maklon kosmetik.',
    secondaryLabel: 'Kirim Brief',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk.',
  },
  relatedSection: {
    eyebrow: 'Layanan Terkait',
    title: 'Jelajahi layanan jasa maklon kosmetik lainnya',
    description: 'Lihat berbagai layanan dan kategori produk yang tersedia.',
  },
  relatedLinks: [
    {
      label: 'Pabrik Kosmetik',
      href: '/pabrik-kosmetik',
      description: 'Informasi fasilitas dan sertifikasi pabrik kosmetik Dreamlab.',
      intent: 'primary',
    },
    {
      label: 'Private Label Kosmetik',
      href: '/private-label-kosmetik',
      description: 'Solusi private label untuk brand kosmetik Anda.',
      intent: 'secondary',
    },
  ],
  leadForm: {
    title: 'Mulai dengan Jasa Maklon Kosmetik',
    description: 'Kirim brief produk Anda dan tim kami akan menghubungi dengan penawaran yang sesuai.',
    submitLabel: 'Kirim Brief',
  },
};

// ========================================
// PRIVATE LABEL KOSMETIK
// ========================================
export const privateLabelKosmetikMoneyPage: PilotPageData = {
  slug: '/private-label-kosmetik',
  title: 'Private Label Kosmetik | Brand Kosmetik Sendiri Dreamlab',
  metaTitle: 'Private Label Kosmetik | Buat Brand Kosmetik Sendiri | Dreamlab',
  metaDescription:
    'Jasa private label kosmetik dengan formulasi siap pakai, kemasan custom, dan BPOM. Solusi cepat untuk memiliki brand kosmetik sendiri. MOQ fleksibel dari 500 pcs. Konsultasi gratis.',
  canonical: 'https://dreamlab.id/private-label-kosmetik/',
  pageType: 'money_page',
  seoCluster: 'private_label_kosmetik',
  keywordTarget: 'private label kosmetik',
  publishedAt: '2026-07-13T00:00:00+07:00',
  updatedAt: '2026-07-17T00:00:00+07:00',
  lastUpdated: '17 Juli 2026',
  readingTime: '10 menit baca',
  heroHeadline: 'Private Label Kosmetik — Cepat Punya Brand Sendiri Tanpa Ribet',
  subheadline:
    'Ingin memiliki brand kosmetik sendiri tanpa urus formulasi dari nol? Private label kosmetik Dreamlab adalah solusinya: formula siap pakai yang sudah teruji BPOM dan Halal, tinggal pilih kemasan dan tambahkan logo brand Anda. Proses 2-3× lebih cepat dari maklon custom.',
  quickAnswers: [
    'Private label kosmetik: formula siap pakai yang sudah teruji dan bersertifikat — Anda tinggal pilih produk, kemasan, dan branding.',
    'Proses 2-3× lebih cepat dibanding custom formulasi karena tidak perlu R&D dari awal.',
    'Tersedia untuk skincare, bodycare, haircare, parfum, baby care, dan foot care — 20+ pilihan produk siap pakai.',
    'MOQ mulai 500 pcs — cocok untuk brand pemula yang ingin testing pasar tanpa investasi besar.',
    'Free konsultasi: lihat katalog produk private label dan dapatkan rekomendasi sesuai target market Anda.',
  ],
  decisionBox: {
    eyebrow: 'Decision Box',
    title: 'Private label vs custom formula — mana yang tepat untuk Anda?',
    description: 'Keduanya punya kelebihan masing-masing. Pilih berdasarkan prioritas bisnis Anda: kecepatan launch atau eksklusivitas formula.',
    items: [
      'Private label: cocok untuk brand pemula yang ingin cepat launch (3-6 minggu), budget lebih terkendali karena tidak ada biaya R&D, dan formula sudah teruji ribuan kali. Kekurangan: formula tidak eksklusif — brand lain bisa punya produk serupa.',
      'Custom formula: cocok untuk brand yang ingin diferensiasi unik, formula eksklusif yang tidak bisa ditiru, dan punya klaim spesifik (misal: peptide 10%, retinal 0.5%). Kekurangan: waktu lebih lama (8-16 minggu), biaya R&D lebih tinggi.',
      'Solusi hybrid Dreamlab: Anda bisa mulai dengan private label untuk 3-5 produk pertama (cepat launch, validasi pasar), lalu lanjut dengan custom formula untuk produk flagship 1-2 varian setelah brand terbukti laku.',
      'Tim Dreamlab akan membantu Anda menentukan strategi produk yang paling tepat sesuai budget, timeline, dan target pasar — konsultasi gratis tanpa komitmen.',
    ],
  },
  table: {
    eyebrow: 'Perbandingan',
    title: 'Perbandingan private label vs maklon custom formula',
    headers: ['Aspek', 'Private Label', 'Custom Formula'],
    rows: [
      ['Waktu produksi', '3-6 minggu', '8-16 minggu'],
      ['Biaya R&D', 'Tidak ada (gratis)', 'Ada (free untuk 500+ pcs)'],
      ['Eksklusivitas formula', 'Tidak eksklusif', 'Eksklusif milik brand Anda'],
      ['MOQ minimum', '500 pcs', '1000 pcs'],
      ['Cocok untuk', 'Brand baru, testing pasar', 'Brand established, premium'],
      ['Biaya per unit', 'Lebih rendah', 'Slightly higher'],
      ['Sertifikasi', 'BPOM & Halal', 'BPOM & Halal'],
    ],
  },
  sections: [
    {
      title: 'Private label kosmetik — jalan tercepat memiliki brand sendiri',
      body: [
        'Private label kosmetik adalah solusi tercepat untuk memiliki produk kosmetik dengan brand Anda sendiri. Konsepnya sederhana: Dreamlab telah mengembangkan puluhan formula kosmetik yang sudah teruji kualitas, stabilitas, dan keamanannya. Anda tinggal memilih produk yang paling sesuai dengan target pasar Anda, menentukan kemasan, menambahkan logo dan identitas brand, maka produk siap jual.',
        'Berbeda dengan jasa maklon custom yang memerlukan waktu riset dan pengembangan formula baru dari awal (bisa memakan waktu 2-4 bulan hanya untuk R&D), private label memangkas waktu tersebut secara drastis karena formula sudah jadi dan teruji. Prosesnya bisa 2-3 kali lebih cepat — ideal untuk brand yang ingin memanfaatkan momen pasar tertentu.',
        'Private label juga jauh lebih ekonomis untuk brand pemula. Anda tidak perlu mengeluarkan biaya R&D, biaya uji stabilitas, atau biaya pengembangan formula. Cukup fokus pada branding, kemasan, dan strategi pemasaran. Inilah mengapa 70% klien baru Dreamlab memulai dengan private label sebelum beralih ke custom formula untuk produk flagship mereka.',
      ],
      bullets: [
        'Proses lebih cepat: dari brief ke produk jadi dalam 3-6 minggu (vs 8-16 minggu custom).',
        'Biaya lebih hemat: tidak ada biaya R&D dan uji stabilitas — budget fokus ke branding dan marketing.',
        'Formula sudah teruji: setiap formula telah melalui uji stabilitas, uji iritasi, dan uji mikroba.',
        'BPOM lebih cepat: pengurusan notifikasi lebih mudah karena formula sudah memiliki track record.',
        'Risiko lebih rendah: Anda sudah tahu hasil akhir produk sebelum memulai produksi.',
        'Fleksibel upgrade: setelah brand terbukti laku, Anda bisa migrasi ke custom formula untuk varian berikutnya.',
      ],
    },
    {
      title: 'Pilihan produk private label yang tersedia di Dreamlab',
      body: [
        'Dreamlab memiliki katalog produk private label yang terus diperbarui mengikuti tren kecantikan terkini. Setiap produk telah melalui serangkaian uji untuk memastikan kualitas dan keamanannya. Berikut adalah kategori produk private label yang paling banyak dipilih oleh klien kami.',
        'Setiap kategori memiliki beberapa varian formula yang bisa disesuaikan dengan kebutuhan brand Anda. Tim Business Development Dreamlab akan membantu Anda memilih produk yang paling sesuai dengan target pasar dan positioning brand.',
      ],
      bullets: [
        'Skincare: serum wajah (vitamin C, hyaluronic acid, brightening, anti-aging), toner, moisturizer, sunscreen SPF 30/50, facial wash — 15+ varian siap pakai.',
        'Body Care: body lotion (whitening, moisturizing, glow), body scrub, body butter, shower gel, hand body cream — 10+ varian.',
        'Hair Care: shampoo (anti-dandruff, hair growth, moisturizing), hair serum, hair mask, hair tonic — 8+ varian.',
        'Parfum: EDP, body mist (floral, fruity, woody, sweet) dalam berbagai aroma populer — 12+ varian aroma siap pakai.',
        'Baby Care: baby lotion, baby wash, baby powder, baby oil, baby cream — formula gentle aman untuk bayi.',
        'Foot Care: foot cream, foot spray, foot scrub — solusi perawatan kaki praktis.',
      ],
    },
    {
      title: 'Proses private label kosmetik di Dreamlab',
      body: [
        'Proses private label kosmetik di Dreamlab dirancang simpel dan transparan. Anda tidak perlu memiliki latar belakang di industri kosmetik — tim kami akan memandu setiap langkah. Berikut adalah tahapan yang akan Anda lalui.',
        'Setiap tahap memiliki timeline yang jelas dan Anda akan mendapatkan project manager khusus yang menjadi satu pintu komunikasi. Ini memastikan Anda selalu update perkembangan produk tanpa perlu mengejar-ngejar tim produksi.',
      ],
      bullets: [
        'Konsultasi (hari 1-3): tim Business Development menunjukkan katalog produk, diskusi target pasar dan budget, rekomendasi produk yang paling sesuai.',
        'Pilih produk & kemasan (hari 3-7): tentukan produk yang akan diproduksi, pilih kemasan (botol, jar, tube, box) dan bahan label dari pilihan yang tersedia.',
        'Desain branding (hari 5-14): Anda menyiapkan desain logo, artwork kemasan, dan informasi produk (INCI, klaim, deskripsi). Tim Dreamlab bisa membantu review desain.',
        'Produksi (minggu 3-5): setelah semua spesifikasi final, produksi dijalankan di fasilitas CPKB Grade A dengan QC ketat.',
        'Legalitas (minggu 3-6): paralel dengan produksi, tim legalitas mengurus notifikasi BPOM produk Anda.',
        'Pengiriman (minggu 5-7): produk jadi, BPOM terbit, siap dikirim dan dipasarkan.',
      ],
    },
  ],
  checklist: {
    eyebrow: 'Checklist',
    title: 'Checklist memulai private label kosmetik',
    description: 'Persiapkan hal-hal berikut agar proses private label berjalan lancar dan hasilnya maksimal.',
    items: [
      'Tentukan nama brand — pastikan belum terdaftar di Kementerian Hukum & HAM (cek di SIPP PATEN) dan tersedia sebagai username di marketplace & sosial media.',
      'Siapkan desain logo dan identitas visual — ini bisa dilakukan paralel dengan proses produksi untuk menghemat waktu.',
      'Pilih 2-3 produk untuk varian awal — fokus pada produk yang paling sesuai dengan target pasar Anda, jangan terlalu banyak varian di awal.',
      'Tentukan target harga jual — hitung margin setelah biaya produksi, kemasan, ongkir, dan pajak. Rule of thumb: HPP max 30% dari harga jual.',
      'Riset kompetitor langsung — beli produk kompetitor, cek kualitas, kemasan, dan harga. Temukan celih yang bisa Anda isi.',
      'Siapkan anggaran legalitas — biaya notifikasi BPOM, sertifikasi Halal, dan dokumen perusahaan (NIB, SKU). Tim Dreamlab bisa memberikan estimasi detail.',
      'Tentukan kanal penjualan — online vs offline? Marketplace vs website sendiri? Ini memengaruhi strategi kemasan dan volume produksi.',
    ],
  },
  faq: [
    {
      question: 'Apa perbedaan private label dengan jasa maklon kosmetik biasa?',
      answer: 'Private label menggunakan formula siap pakai yang sudah dikembangkan dan teruji oleh pabrik — Anda tinggal memilih produk dan menambahkan brand Anda. Jasa maklon custom mengembangkan formula baru dari awal sesuai keinginan spesifik Anda. Private label lebih cepat (3-6 minggu) dan lebih ekonomis karena tidak ada biaya R&D. Maklon custom memberi Anda formula eksklusif tapi butuh waktu lebih lama (8-16 minggu).',
    },
    {
      question: 'Apakah produk private label kosmetik bisa menggunakan merek sendiri?',
      answer: 'Ya. Seluruh produk private label akan menggunakan brand dan kemasan eksklusif Anda. Nama brand, logo, desain kemasan, dan identitas visual sepenuhnya milik Anda. Tidak ada label "Dreamlab" di produk Anda — kami adalah mitra produksi di belakang layar.',
    },
    {
      question: 'Berapa lama proses private label kosmetik di Dreamlab?',
      answer: 'Estimasi 3-6 minggu tergantung produk yang dipilih dan kompleksitas kemasan. Untuk produk dengan kemasan standar (botol atau tube polos dengan label sticker), proses bisa selesai dalam 3-4 minggu. Untuk kemasan custom (cetakan khusus, box, hot stamping), estimasi 5-7 minggu.',
    },
    {
      question: 'Berapa MOQ untuk private label kosmetik di Dreamlab?',
      answer: 'MOQ mulai dari 500 pcs per varian produk untuk kemasan standar. Untuk produk dengan kemasan khusus atau custom printing, MOQ bisa lebih tinggi (1000-2000 pcs). Konsultasi dengan tim kami untuk detail MOQ sesuai produk yang Anda minati.',
    },
    {
      question: 'Apakah produk private label sudah termasuk BPOM?',
      answer: 'Ya. Setiap produk private label Dreamlab sudah diformulasikan sesuai standar BPOM dan bisa diurus notifikasinya. Biaya pengurusan BPOM terpisah dari biaya produksi. Tim legalitas Dreamlab akan membantu mengurus seluruh proses notifikasi BPOM atas nama brand Anda.',
    },
    {
      question: 'Bisakah saya mulai dengan private label lalu beralih ke custom formula nantinya?',
      answer: 'Tentu. Ini adalah strategi yang paling banyak dilakukan klien Dreamlab. Mulai dengan 2-3 produk private label untuk membangun brand dan validasi pasar. Setelah brand terbukti laku, Anda bisa beralih ke custom formula untuk varian flagship atau produk eksklusif. Tim Dreamlab akan mendampingi Anda di setiap tahap.',
    },
    {
      question: 'Apakah ada garansi kualitas untuk produk private label?',
      answer: 'Ya. Setiap batch produksi melalui quality control ketat meliputi uji organoleptik, uji pH, uji stabilitas, dan uji mikroba. Kami memberikan sertifikat analisis untuk setiap batch. Jika ada ketidaksesuaian spesifikasi, kami akan melakukan perbaikan tanpa biaya tambahan.',
    },
  ],
  heroCtas: [
    {
      label: 'Lihat Katalog Produk',
      href: '/thankyou/google/?source=private-label-hero',
      tone: 'primary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin lihat katalog private label kosmetik.',
    },
    {
      label: 'Konsultasi Gratis',
      href: '/thankyou/google/?source=private-label-hero',
      tone: 'secondary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin konsultasi private label kosmetik.',
    },
  ],
  contextualCta: {
    eyebrow: 'Mulai Brand',
    title: 'Siap memiliki brand kosmetik sendiri dengan private label?',
    description: 'Tim Dreamlab siap membantu Anda memilih produk dan kemasan yang tepat.',
    primaryLabel: 'Konsultasi Gratis',
    primaryMessage: 'Halo Dreamlab, saya ingin konsultasi private label kosmetik.',
    secondaryLabel: 'Lihat Katalog',
    secondaryMessage: 'Halo Dreamlab, saya ingin lihat katalog private label.',
  },
  finalCta: {
    eyebrow: 'Mulai Sekarang',
    title: 'Wujudkan brand kosmetik Anda dengan private label Dreamlab',
    description: 'Proses cepat, kualitas terjamin, BPOM siap jual.',
    primaryLabel: 'Konsultasi Gratis',
    primaryMessage: 'Halo Dreamlab, saya ingin konsultasi private label kosmetik.',
    secondaryLabel: 'Lihat Katalog',
    secondaryMessage: 'Halo Dreamlab, saya ingin lihat katalog private label.',
  },
  stickyCta: {
    primaryLabel: 'Konsultasi Gratis',
    primaryMessage: 'Halo Dreamlab, saya ingin konsultasi private label kosmetik.',
    secondaryLabel: 'Lihat Katalog',
    secondaryMessage: 'Halo Dreamlab, saya ingin lihat katalog private label.',
  },
  relatedSection: {
    eyebrow: 'Layanan Terkait',
    title: 'Bandingkan dengan opsi lain',
    description: 'Private label vs custom formula — pilih yang paling sesuai.',
  },
  relatedLinks: [
    {
      label: 'Jasa Maklon Kosmetik',
      href: '/jasa-maklon-kosmetik',
      description: 'Lihat layanan jasa maklon kosmetik Dreamlab secara lengkap.',
      intent: 'primary',
    },
    {
      label: 'Pabrik Kosmetik',
      href: '/pabrik-kosmetik',
      description: 'Informasi fasilitas dan sertifikasi pabrik kosmetik.',
      intent: 'secondary',
    },
  ],
  leadForm: {
    title: 'Mulai Private Label',
    description: 'Kirim preferensi produk dan target market Anda. Tim kami akan mengirimkan katalog dan penawaran.',
    submitLabel: 'Kirim',
  },
};

// ========================================
// ESTIMASI BIAYA MAKLON KOSMETIK
// ========================================
export const estimasiBiayaMaklonMoneyPage: PilotPageData = {
  slug: '/estimasi-biaya-maklon-kosmetik',
  title: 'Estimasi Biaya Maklon Kosmetik | Cek Budget Produksi Brand Anda',
  metaTitle: 'Estimasi Biaya Maklon Kosmetik | Cek Budget Produksi Brand',
  metaDescription:
    'Cek estimasi biaya maklon kosmetik untuk skincare, parfum, body care, dan lainnya. Dapatkan gambaran budget produksi yang realistis mulai dari puluhan juta untuk brand kosmetik Anda.',
  canonical: 'https://dreamlab.id/estimasi-biaya-maklon-kosmetik/',
  pageType: 'money_page',
  seoCluster: 'estimasi_biaya_maklon',
  keywordTarget: 'estimasi biaya maklon kosmetik',
  publishedAt: '2026-07-13T00:00:00+07:00',
  updatedAt: '2026-07-17T00:00:00+07:00',
  lastUpdated: '17 Juli 2026',
  readingTime: '10 menit baca',
  heroHeadline: 'Estimasi Biaya Maklon Kosmetik — Rencanakan Budget Produksi Brand Anda',
  subheadline:
    'Dapatkan gambaran estimasi biaya maklon kosmetik yang realistis berdasarkan jenis produk, MOQ, dan kebutuhan kemasan. Konsultasi gratis dengan tim Dreamlab untuk menyusun rencana anggaran produksi yang tepat.',
  quickAnswers: [
    'Biaya maklon kosmetik dipengaruhi oleh 5 faktor utama: jenis produk, formula, MOQ, kemasan, dan legalitas.',
    'Estimasi total investasi awal untuk brand kosmetik baru mulai dari Rp30-150 juta tergantung skala dan kompleksitas produk.',
    'Dreamlab menyediakan konsultasi gratis untuk membantu Anda menyusun budget produksi yang realistis dan efisien.',
    'Biaya produksi per unit semakin murah seiring meningkatnya volume — hitung HPP dengan cermat sebelum menentukan harga jual.',
    'Halaman ini memberi gambaran umum — untuk estimasi akurat sesuai produk Anda, konsultasi langsung dengan tim Dreamlab (gratis).',
  ],
  decisionBox: {
    eyebrow: 'Decision Box',
    title: 'Faktor utama penentu biaya maklon kosmetik',
    description: 'Memahami 5 komponen utama biaya maklon kosmetik akan membantu Anda merencanakan budget dengan lebih akurat dan menghindari biaya tak terduga di tengah jalan.',
    items: [
      'Formula & bahan aktif: biaya R&D untuk custom formula, pemilihan bahan aktif (dari basic hingga premium seperti peptide, ceramide, retinal), dan uji stabilitas. Semakin kompleks formula, semakin tinggi biaya.',
      'MOQ & volume produksi: ini yang paling signifikan memengaruhi biaya per unit. Volume 500 pcs vs 5000 pcs bisa memiliki selisih HPP hingga 30-50% per unit karena efisiensi produksi.',
      'Kemasan: dari tube/botol standar polos (Rp3.000-8.000/pcs) hingga custom double wall dengan hot stamping (Rp15.000-40.000/pcs). Kemasan bisa mencapai 30-50% dari total biaya produksi.',
      'Legalitas: biaya pengurusan notifikasi BPOM kosmetik, sertifikasi Halal MUI, dan dokumen pendukung lainnya. Estimasi Rp5-15 juta tergantung jenis dan jumlah produk.',
      'Logistik & distribusi: biaya pengemasan (box, label, insert), pengiriman bahan baku, dan distribusi produk jadi ke alamat tujuan. Jangan lupa anggarkan 5-10% untuk kontinjensi.',
    ],
  },
  table: {
    eyebrow: 'Estimasi Budget Produksi',
    title: 'Estimasi rentang biaya produksi per kategori produk',
    headers: ['Kategori Produk', 'Investasi Awal (Est.)', 'HPP per Unit (Est.)', 'MOQ Min', 'Waktu Produksi'],
    rows: [
      ['Skincare (serum, moisturizer)', 'Rp40-120 juta', 'Rp20.000-60.000', '1000 pcs', '8-12 minggu'],
      ['Body Care (lotion, butter)', 'Rp30-80 juta', 'Rp15.000-35.000', '500 pcs', '6-10 minggu'],
      ['Hair Care (shampoo, serum)', 'Rp35-90 juta', 'Rp18.000-40.000', '500 pcs', '6-10 minggu'],
      ['Parfum EDP / Body Mist', 'Rp25-70 juta', 'Rp12.000-45.000', '500 pcs', '6-10 minggu'],
      ['Baby Care', 'Rp30-75 juta', 'Rp15.000-38.000', '500 pcs', '6-8 minggu'],
      ['Decorative (lip cream, cushion)', 'Rp50-150 juta', 'Rp25.000-70.000', '2000 pcs', '10-14 minggu'],
      ['Private Label (formula siap)', 'Rp15-40 juta', 'Rp10.000-30.000', '500 pcs', '3-6 minggu'],
    ],
  },
  sections: [
    {
      title: 'Komponen biaya maklon kosmetik secara detail',
      body: [
        'Biaya maklon kosmetik bukan sekadar "biaya produksi per pcs". Ada beberapa komponen yang perlu Anda pahami dan anggarkan sejak awal agar tidak ada kejutan di tengah jalan. Berikut adalah rincian komponen biaya yang perlu Anda ketahui sebelum memulai produksi brand kosmetik.',
        'Penting untuk diingat: biaya terendah belum tentu yang terbaik. Banyak brand pemula tergiur harga maklon murah, tapi kemudian bermasalah dengan kualitas tidak konsisten, BPOM sulit terbit, atau produk tidak stabil. Investasi di kualitas sejak awal akan menghemat biaya jangka panjang.',
        'Tim Dreamlab selalu transparan dalam struktur biaya. Tidak ada biaya tersembunyi — semua komponen biaya dijelaskan di awal sehingga Anda bisa membuat keputusan bisnis yang tepat. Konsultasi awal gratis untuk membahas budget dan kebutuhan produk Anda.',
      ],
      bullets: [
        'Biaya R&D formula: free untuk custom formula dengan MOQ 500+ pcs (produk standar). Untuk formula kompleks (peptide, retinal, gold) ada biaya riset tambahan.',
        'Biaya bahan baku: tergantung jenis dan kualitas bahan aktif yang dipilih. Bahan dasar vs premium bisa berbeda 2-5× lipat.',
        'Biaya produksi & QC: meliputi biaya produksi per unit, tenaga kerja, listrik, quality control setiap batch, dan sertifikat analisis.',
        'Biaya kemasan primer: botol, tube, jar, roll on — tergantung material (plastik, kaca, aluminium), bentuk (standar vs custom), dan finishing (printing, hot stamp, label).',
        'Biaya kemasan sekunder: box, insert, karton pengiriman — untuk perlindungan produk dan branding tambahan.',
        'Biaya legalitas: notifikasi BPOM kosmetik (Rp2-5 juta per produk via jasa), sertifikasi Halal MUI (Rp5-10 juta per produk atau sesuai skema baru), dokumen perusahaan (NIB, SKU, NPWP).',
        'Biaya kontinjensi: siapkan 10% dari total budget untuk hal tak terduga seperti revisi formula tambahan, perubahan kemasan, atau perpanjangan waktu produksi.',
      ],
    },
    {
      title: 'Cara menghitung estimasi biaya maklon kosmetik secara mandiri',
      body: [
        'Sebelum konsultasi dengan tim Dreamlab, Anda bisa menghitung estimasi kasar biaya maklon kosmetik secara mandiri menggunakan rumus sederhana. Ini akan memberi Anda gambaran awal tentang besaran investasi yang dibutuhkan.',
        'Rumus sederhana: Total Biaya = (Biaya Formula + Biaya Bahan Baku per unit × MOQ) + (Biaya Kemasan per unit × MOQ) + Biaya Legalitas + Biaya Logistik + Kontinjensi 10%. Meski sederhana, rumus ini sudah mencakup komponen utama yang biasanya diperlukan.',
        'Contoh simulasi: produk body lotion MOQ 1000 pcs dengan kemasan standar. Biaya formula (free karena sudah termasuk), bahan baku Rp8.000/unit × 1000 = Rp8.000.000, kemasan @Rp5.000 × 1000 = Rp5.000.000, legalitas Rp7.000.000, logistik Rp2.000.000, kontinjensi 10% = Rp2.200.000. Total estimasi: sekitar Rp24.200.000 atau Rp24.200/unit.',
      ],
      bullets: [
        'Langkah 1: tentukan kategori produk dan MOQ — ini menentukan baseline biaya.',
        'Langkah 2: hitung biaya bahan baku per unit × MOQ (minta estimasi dari tim Dreamlab).',
        'Langkah 3: hitung biaya kemasan per unit × MOQ (dari supplier kemasan atau tim Dreamlab).',
        'Langkah 4: tambahkan biaya legalitas (BPOM + Halal) — estimasi Rp7-15 juta tergantung jumlah produk.',
        'Langkah 5: tambahkan biaya logistik dan distribusi (Rp2-5 juta tergantung lokasi).',
        'Langkah 6: tambahkan 10% kontinjensi untuk antisipasi biaya tak terduga.',
        'Langkah 7: bagi total biaya dengan MOQ untuk mendapatkan HPP per unit — pastikan HPP ≤ 30% dari target harga jual.',
      ],
    },
    {
      title: 'Tips mengoptimasi budget produksi kosmetik tanpa mengorbankan kualitas',
      body: [
        'Memulai brand kosmetik tidak harus mahal. Dengan strategi yang tepat, Anda bisa mengoptimasi budget produksi tanpa mengorbankan kualitas produk. Berikut adalah tips yang sering kami rekomendasikan kepada klien Dreamlab yang baru memulai brand kosmetik pertama mereka.',
        'Kuncinya ada di prioritas: alokasikan budget terbesar pada aspek yang paling dilihat dan dirasakan konsumen. Jangan habiskan budget untuk hal-hal yang tidak memberikan nilai tambah signifikan di mata target pasar Anda.',
      ],
      bullets: [
        'Mulai dengan private label: dari pada langsung custom formula yang mahal, gunakan private label untuk 2-3 produk pertama. Uji pasar dulu, baru investasi di custom formula setelah brand terbukti laku.',
        'Pilih kemasan standar dengan label premium: kemasan standar (botol/tube polos) jauh lebih murah, tapi dengan desain label yang bagus, hasilnya tetap terlihat premium. Ini bisa menghemat 30-50% biaya kemasan.',
        'Optimasi MOQ: hitung dengan cermat. Jangan terlalu kecil (HPP mahal, margin tipis) dan jangan terlalu besar (risiko stok menumpuk). Mulai dengan MOQ 500-1000 pcs untuk produk pertama.',
        'Gunakan bahan aktif yang tepat: tidak perlu semua produk pakai bahan premium. Buat 1-2 varian flagship dengan bahan premium, sisanya dengan bahan standar yang tetap berkualitas.',
        'Urus legalitas sendiri: biaya pengurusan BPOM sebenarnya bisa diurus sendiri tanpa jasa perantara. Tapi jika budget memungkinkan, menggunakan jasa tim Dreamlab akan menghemat waktu dan tenaga Anda.',
        'Negosiasi payment term: Dreamlab menawarkan skema pembayaran bertahap (DP 50%, pelunasan setelah produk jadi) untuk memudahkan cash flow brand baru.',
      ],
    },
  ],
  checklist: {
    eyebrow: 'Checklist',
    title: 'Checklist persiapan konsultasi estimasi biaya maklon',
    description: 'Siapkan informasi berikut sebelum konsultasi agar tim Dreamlab bisa memberikan estimasi biaya yang akurat dan sesuai kebutuhan Anda.',
    items: [
      'Kategori produk yang ingin dibuat (skincare, body care, parfum, dll) — semakin spesifik semakin baik.',
      'Target jumlah varian produk di awal (1 varian vs 3 varian akan beda estimasi biaya).',
      'Estimasi MOQ per varian — tentukan range realistis berdasarkan budget dan target penjualan.',
      'Preferensi kemasan: standar (botol/tube polos + label) atau custom (bentuk khusus, cetakan, finishing premium).',
      'Target harga jual — ini penting untuk menghitung apakah HPP produksi masuk akal dengan margin yang diinginkan.',
      'Kanal penjualan (online marketplace, website sendiri, reseller, distribusi toko, dll) — memengaruhi desain kemasan dan volume.',
      'Target launch date — timeline yang ketat bisa memengaruhi biaya produksi (rush charge).',
      'Budget maksimal yang sudah disiapkan — tim Dreamlab akan membantu menyesuaikan strategi produksi dengan budget Anda.',
    ],
  },
  faq: [
    {
      question: 'Berapa biaya minimum untuk memulai maklon kosmetik di Dreamlab?',
      answer: 'Biaya minimum sangat bervariasi tergantung jenis produk dan MOQ. Untuk private label (formula siap pakai), estimasi mulai dari Rp15-40 juta untuk 1 varian produk dengan MOQ 500 pcs dan kemasan standar. Untuk custom formula, estimasi mulai dari Rp30-80 juta. Konsultasi gratis untuk mendapatkan gambaran sesuai kebutuhan spesifik Anda.',
    },
    {
      question: 'Apakah biaya maklon kosmetik sudah termasuk pengurusan BPOM?',
      answer: 'Biaya pengurusan BPOM tidak termasuk dalam biaya produksi dan dipisahkan. Tim legalitas Dreamlab menyediakan jasa pengurusan BPOM dengan biaya terpisah yang kompetitif. Kami akan memberikan rincian lengkap seluruh biaya — produksi, kemasan, dan legalitas — saat konsultasi sehingga tidak ada biaya tersembunyi.',
    },
    {
      question: 'Kenapa ada selisih harga estimasi di halaman ini dengan penawaran dari tim Dreamlab?',
      answer: 'Estimasi di halaman ini bersifat umum berdasarkan pengalaman rata-rata klien kami. Harga aktual bisa berbeda tergantung formula spesifik, fluktuasi harga bahan baku, kompleksitas kemasan, dan kebutuhan legalitas masing-masing produk. Konsultasi gratis untuk mendapatkan penawaran harga yang akurat sesuai produk Anda.',
    },
    {
      question: 'Apakah ada biaya tersembunyi yang perlu saya waspadai?',
      answer: 'Tidak. Dreamlab berkomitmen pada transparansi biaya. Seluruh komponen biaya akan dijelaskan di awal dalam quotation tertulis. Yang perlu dianggarkan terpisah biasanya: biaya pengurusan BPOM, biaya sertifikasi Halal, biaya desain kemasan (jika pakai desainer eksternal), dan biaya pengiriman. Tim Dreamlab akan menjelaskan semua ini saat konsultasi.',
    },
    {
      question: 'Bagaimana cara menekan biaya produksi maklon kosmetik?',
      answer: 'Beberapa cara: (1) pilih private label daripada custom formula untuk produk pertama, (2) gunakan kemasan standar dengan desain label premium, (3) optimasi MOQ — jangan terlalu kecil atau terlalu besar, (4) pilih bahan aktif yang tepat sesuai target harga jual, (5) produksi beberapa varian sekaligus untuk efisiensi biaya produksi. Konsultasi dengan tim Dreamlab untuk strategi optimalisasi budget Anda.',
    },
    {
      question: 'Apakah ada paket khusus untuk brand pemula dengan budget terbatas?',
      answer: 'Ya. Dreamlab memiliki paket starter untuk brand pemula yang mencakup produk private label pilihan, kemasan standar, dan bantuan pengurusan BPOM dengan harga khusus. Paket ini dirancang untuk founder yang ingin memulai brand dengan investasi minimal. Konsultasi gratis untuk detail paket dan penyesuaian dengan budget Anda.',
    },
    {
      question: 'Bagaimana sistem pembayaran untuk produksi maklon di Dreamlab?',
      answer: 'Sistem pembayaran bertahap: DP 50% di awal sebagai tanda jadi produksi, dan pelunasan 50% setelah produk selesai diproduksi dan siap dikirim. Pembayaran dapat dilakukan via transfer bank ke rekening perusahaan PT Karya Impian Laboratoris. Untuk proyek skala besar, tersedia skema pembayaran termin yang bisa didiskusikan.',
    },
  ],
  heroCtas: [
    {
      label: 'Cek Estimasi',
      href: '/thankyou/google/?source=estimasi-biaya-hero',
      tone: 'primary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin cek estimasi biaya maklon kosmetik.',
    },
    {
      label: 'Konsultasi Gratis',
      href: '/thankyou/google/?source=estimasi-biaya-hero',
      tone: 'secondary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin konsultasi estimasi biaya maklon.',
    },
  ],
  contextualCta: {
    eyebrow: 'Butuh Estimasi?',
    title: 'Dapatkan estimasi biaya yang sesuai dengan produk Anda',
    description: 'Tim Dreamlab siap membantu Anda menghitung estimasi biaya produksi.',
    primaryLabel: 'Cek Estimasi',
    primaryMessage: 'Halo Dreamlab, saya ingin cek estimasi biaya maklon kosmetik.',
    secondaryLabel: 'Konsultasi',
    secondaryMessage: 'Halo Dreamlab, saya ingin konsultasi estimasi biaya.',
  },
  finalCta: {
    eyebrow: 'Mulai Sekarang',
    title: 'Dapatkan estimasi biaya maklon kosmetik yang akurat',
    description: 'Konsultasi gratis untuk menyusun budget produksi brand Anda.',
    primaryLabel: 'Cek Estimasi',
    primaryMessage: 'Halo Dreamlab, saya ingin cek estimasi biaya maklon kosmetik.',
    secondaryLabel: 'Konsultasi',
    secondaryMessage: 'Halo Dreamlab, saya ingin konsultasi estimasi biaya.',
  },
  stickyCta: {
    primaryLabel: 'Cek Estimasi',
    primaryMessage: 'Halo Dreamlab, saya ingin cek estimasi biaya maklon kosmetik.',
    secondaryLabel: 'Konsultasi',
    secondaryMessage: 'Halo Dreamlab, saya ingin konsultasi estimasi biaya.',
  },
  relatedSection: {
    eyebrow: 'Layanan Terkait',
    title: 'Informasi pendukung estimasi biaya',
    description: 'Baca juga panduan biaya dan MOQ untuk brand kosmetik Anda.',
  },
  relatedLinks: [
    {
      label: 'Biaya Maklon Skincare',
      href: '/biaya-maklon-skincare',
      description: 'Estimasi biaya spesifik untuk produk skincare.',
      intent: 'primary',
    },
    {
      label: 'Panduan MOQ',
      href: '/panduan/cara-menentukan-moq-produk-kosmetik',
      description: 'Panduan menentukan MOQ yang aman untuk brand baru.',
      intent: 'secondary',
    },
  ],
  leadForm: {
    title: 'Cek Estimasi Biaya',
    description: 'Kirim informasi produk Anda untuk mendapatkan estimasi biaya yang akurat.',
    submitLabel: 'Kirim',
  },
};
