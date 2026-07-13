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
  updatedAt: '2026-07-13T00:00:00+07:00',
  lastUpdated: '13 Juli 2026',
  readingTime: '7 menit baca',
  heroHeadline: 'Pabrik Parfum dengan Layanan Maklon Aroma Custom',
  subheadline:
    'Dreamlab adalah pabrik parfum terpercaya yang melayani produksi eau de parfum, body mist, roll on, minyak atsiri, dan custom aroma untuk brand parfum Anda.',
  quickAnswers: [
    'Dreamlab adalah pabrik parfum bersertifikat CPKB Grade A, Halal MUI, dan BPOM.',
    'Melayani maklon parfum: EDP, EDT, body mist, roll on, extrait de parfum, minyak atsiri.',
    'R&D parfum dengan perfumer berpengalaman untuk custom aroma eksklusif.',
    'MOQ fleksibel untuk brand pemula hingga produksi skala besar.',
  ],
  decisionBox: {
    eyebrow: 'Decision Box',
    title: 'Pilih skala produksi parfum yang sesuai',
    description: 'Setiap brand parfum punya kebutuhan skala dan positioning berbeda. Sesuaikan pilihan dengan target pasar Anda.',
    items: [
      'Brand baru: mulai dengan 1-3 varian aroma, MOQ kecil untuk validasi pasar.',
      'Brand berkembang: scale varian aroma dan ukuran kemasan berdasarkan data penjualan.',
      'Brand premium: custom aroma eksklusif, kemasan premium, dan sertifikasi lengkap.',
    ],
  },
  table: {
    eyebrow: 'Tipe Produk',
    title: 'Format parfum yang bisa diproduksi',
    headers: ['Tipe', 'Konsentrasi', 'Daya Tahan', 'Target Pasar'],
    rows: [
      ['Eau de Parfum (EDP)', '15-20%', '6-8 jam', 'Premium, dewasa'],
      ['Eau de Toilette (EDT)', '8-15%', '4-6 jam', 'Mass market, daily wear'],
      ['Body Mist', '3-8%', '2-4 jam', 'Remaja, casual'],
      ['Extrait de Parfum', '20-40%', '8-12+ jam', 'Luxury, niche'],
      ['Roll On Parfum', '10-20%', '4-6 jam', 'Praktis, on-the-go'],
      ['Minyak Atsiri', '100% oil', 'Variatif', 'Aromaterapi, natural'],
    ],
  },
  sections: [
    {
      title: 'Pabrik parfum dengan standar internasional',
      body: [
        'Memilih pabrik parfum yang tepat adalah keputusan krusial untuk brand Anda. Dreamlab sebagai pabrik parfum telah memiliki sertifikasi CPKB Grade A, Halal MUI, dan BPOM yang menjamin produk Anda diproduksi sesuai standar tertinggi.',
        'Tim R&D kami yang berpengalaman dalam meracik berbagai jenis aroma siap membantu Anda menciptakan signature scent yang membedakan brand Anda dari kompetitor.',
      ],
    },
    {
      title: 'Layanan maklon parfum dari konsep hingga launch',
      body: [
        'Pabrik parfum Dreamlab menyediakan layanan lengkap mulai dari konsultasi aroma, pengembangan formula oleh perfumer profesional, produksi di fasilitas CPKB Grade A, pemilihan kemasan botol dan box, hingga pengurusan BPOM.',
        'Dengan pendekatan one-stop solution, Anda tidak perlu berpindah vendor. Semua proses terintegrasi untuk memastikan konsistensi kualitas dari batch pertama hingga seterusnya.',
      ],
      bullets: [
        'Konsultasi aroma dan target market bersama tim Business Development.',
        'Custom formulasi oleh perfumer berpengalaman.',
        'Produksi di pabrik parfum bersertifikat CPKB Grade A.',
        'Pilihan kemasan: botol spray, roll on, decant, box custom.',
        'Bantuan pengurusan BPOM dan sertifikasi Halal.',
      ],
    },
  ],
  faq: [
    {
      question: 'Apakah pabrik parfum Dreamlab melayani custom aroma?',
      answer: 'Ya. Kami memiliki perfumer profesional yang bisa menciptakan aroma custom eksklusif sesuai brief brand Anda.',
    },
    {
      question: 'Berapa MOQ minimum di pabrik parfum Dreamlab?',
      answer: 'MOQ bervariasi tergantung jenis produk dan kemasan. Untuk brand baru, tersedia MOQ yang fleksibel.',
    },
    {
      question: 'Apakah pabrik parfum Dreamlab membantu pengurusan BPOM?',
      answer: 'Ya. Kami memberikan pendampingan penuh untuk pengurusan notifikasi BPOM dan sertifikasi Halal.',
    },
    {
      question: 'Berapa lama proses produksi parfum?',
      answer: 'Estimasi waktu produksi 4-8 minggu tergantung kompleksitas aroma, kemasan, dan kebutuhan legalitas.',
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
  updatedAt: '2026-07-13T00:00:00+07:00',
  lastUpdated: '13 Juli 2026',
  readingTime: '8 menit baca',
  heroHeadline: 'Jasa Maklon Kosmetik One-Stop Solution untuk Brand Anda',
  subheadline:
    'Dreamlab menyediakan jasa maklon kosmetik lengkap: formulasi custom, produksi CPKB Grade A, kemasan premium, dan pengurusan BPOM & Halal. 500+ brand telah mempercayakan produksi mereka kepada kami.',
  quickAnswers: [
    'Jasa maklon kosmetik Dreamlab melayani 8+ kategori: skincare, bodycare, haircare, parfum, baby care, decorative, foot care, PKRT.',
    'Sertifikasi lengkap: CPKB Grade A, Halal MUI, dan terdaftar BPOM.',
    'Custom formulasi oleh tim R&D profesional dengan bahan aktif berkualitas.',
    'MOQ fleksibel cocok untuk brand pemula hingga bisnis skala besar.',
  ],
  decisionBox: {
    eyebrow: 'Decision Box',
    title: 'Jasa maklon kosmetik untuk setiap tahap bisnis',
    description: 'Pilih jasa maklon kosmetik yang sesuai dengan tahap dan kebutuhan brand Anda.',
    items: [
      'Brand pemula: butuh jasa maklon dengan MOQ rendah, pendampingan BPOM, dan formula siap pakai.',
      'Brand berkembang: butuh kapasitas produksi lebih besar dan variasi formula custom.',
      'Brand premium: butuh R&D eksklusif, bahan aktif premium, dan kemasan mewah.',
    ],
  },
  table: {
    eyebrow: 'Kategori Produk',
    title: 'Kategori produk yang bisa diproduksi',
    headers: ['Kategori', 'Contoh Produk', 'Sertifikasi'],
    rows: [
      ['Skincare', 'Serum, toner, moisturizer, sunscreen, facial wash', 'BPOM, Halal'],
      ['Body Care', 'Body butter, lotion, scrub, shower gel, massage oil', 'BPOM, Halal'],
      ['Hair Care', 'Shampoo, hair mask, hair tonic, hair serum', 'BPOM, Halal'],
      ['Parfum', 'EDP, EDT, body mist, roll on, minyak atsiri', 'BPOM, Halal'],
      ['Baby Care', 'Baby lotion, baby wash, baby powder, baby oil', 'BPOM, Halal'],
      ['Decorative', 'Lip cream, cushion, mascara, blush, foundation', 'BPOM, Halal'],
    ],
  },
  sections: [
    {
      title: 'Mengapa memilih jasa maklon kosmetik Dreamlab',
      body: [
        'Jasa maklon kosmetik Dreamlab menawarkan solusi lengkap untuk brand kosmetik Anda. Dengan fasilitas produksi bersertifikat CPKB Grade A, tim R&D profesional, dan pengalaman melayani 500+ brand, kami siap membantu mewujudkan produk kosmetik impian Anda.',
        'Kami memahami bahwa setiap brand memiliki kebutuhan yang berbeda. Oleh karena itu, jasa maklon kosmetik kami dirancang fleksibel, dari skala kecil untuk brand pemula hingga produksi massal untuk brand besar.',
      ],
    },
    {
      title: 'Keunggulan jasa maklon kosmetik Dreamlab',
      body: [
        'Sebagai jasa maklon kosmetik terpercaya, Dreamlab memberikan layanan lengkap dari konsultasi awal hingga produk siap jual. Tim kami akan mendampingi Anda di setiap tahap untuk memastikan hasil sesuai ekspektasi.',
      ],
      bullets: [
        'Free custom formula dan konsultasi produk',
        'Fasilitas produksi CPKB Grade A dengan quality control ketat',
        'Bantuan pengurusan BPOM dan sertifikasi Halal',
        'Kemasan custom dengan berbagai pilihan material',
        'Tim R&D berpengalaman dari berbagai kategori kosmetik',
      ],
    },
  ],
  faq: [
    {
      question: 'Apa saja layanan yang termasuk dalam jasa maklon kosmetik Dreamlab?',
      answer: 'Layanan meliputi konsultasi, formulasi custom, produksi, pengurusan BPOM & Halal, dan pengemasan produk.',
    },
    {
      question: 'Berapa MOQ minimum untuk jasa maklon kosmetik?',
      answer: 'MOQ bervariasi tergantung kategori produk dan kompleksitas formulasi. Tersedia opsi MOQ kecil untuk brand pemula.',
    },
    {
      question: 'Apakah jasa maklon kosmetik Dreamlab membantu pengurusan BPOM?',
      answer: 'Ya, pendampingan BPOM dan Halal termasuk dalam layanan jasa maklon kosmetik kami.',
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
    'Jasa private label kosmetik dengan formulasi siap pakai, kemasan custom, dan BPOM. Solusi cepat untuk memiliki brand kosmetik sendiri. MOQ fleksibel. Konsultasi gratis.',
  canonical: 'https://dreamlab.id/private-label-kosmetik/',
  pageType: 'money_page',
  seoCluster: 'private_label_kosmetik',
  keywordTarget: 'private label kosmetik',
  publishedAt: '2026-07-13T00:00:00+07:00',
  updatedAt: '2026-07-13T00:00:00+07:00',
  lastUpdated: '13 Juli 2026',
  readingTime: '7 menit baca',
  heroHeadline: 'Private Label Kosmetik — Cepat Punya Brand Sendiri',
  subheadline:
    'Ingin memiliki brand kosmetik sendiri tanpa ribet urus formulasi dari nol? Private label kosmetik Dreamlab adalah solusinya: formula siap pakai, kemasan eksklusif, dan BPOM siap jual.',
  quickAnswers: [
    'Private label kosmetik: formula siap pakai, tinggal pilih kemasan dan branding.',
    'Cocok untuk brand pemula yang ingin cepat launching tanpa proses R&D panjang.',
    'Tersedia untuk skincare, bodycare, haircare, parfum, dan baby care.',
    'Proses lebih cepat dibanding custom formulasi karena formula sudah teruji.',
  ],
  decisionBox: {
    eyebrow: 'Decision Box',
    title: 'Private label vs custom formula — mana yang tepat?',
    description: 'Pilih private label jika Anda ingin cepat launching dengan formula yang sudah teruji. Pilih custom jika ingin formula eksklusif.',
    items: [
      'Private label: cocok untuk brand pemula, launch cepat, budget lebih terkendali.',
      'Custom formula: cocok untuk brand yang ingin diferensiasi unik dan formula eksklusif.',
      'Dreamlab menyediakan kedua opsi — konsultasi untuk menentukan yang paling sesuai.',
    ],
  },
  sections: [
    {
      title: 'Private label kosmetik — jalan cepat memiliki brand sendiri',
      body: [
        'Private label kosmetik adalah solusi tercepat untuk memiliki produk kosmetik dengan brand Anda sendiri. Berbeda dengan custom formulasi yang memerlukan waktu R&D panjang, private label menggunakan formula siap pakai yang sudah teruji kualitasnya.',
        'Anda tinggal memilih produk, menentukan kemasan, dan menambahkan logo brand. Prosesnya bisa 2-3 kali lebih cepat dibanding custom formulasi.',
      ],
    },
    {
      title: 'Keunggulan private label kosmetik Dreamlab',
      body: [
        'Dreamlab sebagai pabrik kosmetik berpengalaman menyediakan berbagai pilihan produk private label yang sudah teruji dan bersertifikat.',
      ],
      bullets: [
        'Formula siap pakai yang sudah teruji dan bersertifikat BPOM.',
        'Pilihan kemasan custom dengan MOQ fleksibel.',
        'Proses lebih cepat — dari brief ke produk siap jual.',
        'Bantuan pengurusan BPOM notifikasi kosmetik.',
        'Kualitas konsisten karena sudah melalui riset dan pengembangan.',
      ],
    },
  ],
  faq: [
    {
      question: 'Apa perbedaan private label dengan maklon biasa?',
      answer: 'Private label menggunakan formula siap pakai, sedangkan maklon custom mengembangkan formula baru sesuai keinginan Anda. Private label lebih cepat dan ekonomis.',
    },
    {
      question: 'Apakah produk private label kosmetik bisa pakai merk sendiri?',
      answer: 'Ya. Seluruh produk private label akan menggunakan brand dan kemasan eksklusif Anda.',
    },
    {
      question: 'Berapa lama proses private label kosmetik di Dreamlab?',
      answer: 'Estimasi 3-6 minggu tergantung produk dan kompleksitas kemasan yang dipilih.',
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
  title: 'Estimasi Biaya Maklon Kosmetik | Cek Budget Produksi',
  metaTitle: 'Estimasi Biaya Maklon Kosmetik | Cek Budget Produksi Brand',
  metaDescription:
    'Cek estimasi biaya maklon kosmetik untuk skincare, parfum, body care, dan lainnya. Dapatkan gambaran budget produksi yang realistis untuk brand kosmetik Anda.',
  canonical: 'https://dreamlab.id/estimasi-biaya-maklon-kosmetik/',
  pageType: 'money_page',
  seoCluster: 'estimasi_biaya_maklon',
  keywordTarget: 'estimasi biaya maklon kosmetik',
  publishedAt: '2026-07-13T00:00:00+07:00',
  updatedAt: '2026-07-13T00:00:00+07:00',
  lastUpdated: '13 Juli 2026',
  readingTime: '7 menit baca',
  heroHeadline: 'Estimasi Biaya Maklon Kosmetik untuk Brand Anda',
  subheadline:
    'Dapatkan gambaran estimasi biaya maklon kosmetik yang realistis berdasarkan jenis produk, MOQ, dan kebutuhan kemasan. Konsultasi gratis dengan tim Dreamlab.',
  quickAnswers: [
    'Biaya maklon kosmetik dipengaruhi oleh: jenis produk, formula, MOQ, kemasan, dan legalitas.',
    'Estimasi biaya untuk produk skincare mulai dari puluhan juta tergantung skala dan kompleksitas.',
    'Dreamlab menyediakan konsultasi gratis untuk membantu Anda menyusun budget produksi.',
    'Halaman ini memberi gambaran umum — untuk estimasi akurat, konsultasi langsung dengan tim kami.',
  ],
  decisionBox: {
    eyebrow: 'Decision Box',
    title: 'Faktor utama penentu biaya maklon',
    description: 'Pahami komponen biaya sebelum memulai produksi agar budget lebih terencana.',
    items: [
      'Formula dan bahan aktif: semakin kompleks dan premium, semakin tinggi biaya R&D.',
      'MOQ dan volume produksi: volume lebih besar = biaya per unit lebih rendah.',
      'Kemasan: standar vs custom sangat memengaruhi total biaya produksi.',
      'Legalitas: biaya pengurusan BPOM dan Halal perlu dianggarkan sejak awal.',
    ],
  },
  sections: [
    {
      title: 'Komponen biaya maklon kosmetik',
      body: [
        'Biaya maklon kosmetik terdiri dari beberapa komponen yang perlu dianggarkan sejak awal. Memahami struktur biaya ini membantu Anda membuat keputusan bisnis yang lebih tepat.',
        'Setiap komponen bisa dioptimasi tanpa mengorbankan kualitas produk. Tim Dreamlab akan membantu Anda menemukan keseimbangan antara budget dan kualitas.',
      ],
    },
    {
      title: 'Cara mendapatkan estimasi biaya yang akurat',
      body: [
        'Estimasi biaya baru bisa akurat ketika scope produk sudah jelas. Siapkan informasi berikut sebelum konsultasi untuk mempercepat proses estimasi.',
      ],
      bullets: [
        'Kategori produk yang ingin dibuat (skincare, parfum, body care, dll).',
        'Target formula dan klaim utama produk.',
        'Perkiraan MOQ dan volume produksi awal.',
        'Preferensi kemasan (standar atau custom).',
        'Target harga jual dan channel penjualan.',
      ],
    },
  ],
  faq: [
    {
      question: 'Berapa biaya minimum untuk maklon kosmetik?',
      answer: 'Biaya minimum bervariasi tergantung jenis produk dan MOQ. Konsultasi gratis untuk mendapatkan gambaran sesuai kebutuhan Anda.',
    },
    {
      question: 'Apakah biaya maklon kosmetik sudah termasuk BPOM?',
      answer: 'Biaya pengurusan BPOM biasanya terpisah dari biaya produksi. Tim Dreamlab akan memberikan rincian lengkap saat konsultasi.',
    },
    {
      question: 'Bagaimana cara mendapatkan estimasi biaya yang akurat?',
      answer: 'Hubungi tim Dreamlab dengan informasi produk, target MOQ, dan preferensi kemasan. Kami akan memberikan estimasi yang sesuai dengan kebutuhan Anda.',
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
