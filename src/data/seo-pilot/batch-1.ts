export type PilotPageType = 'pilot_article' | 'money_page';

export interface PilotFaq {
  question: string;
  answer: string;
}

export interface PilotTable {
  headers: string[];
  rows: string[][];
}

export interface PilotCta {
  label: string;
  href: string;
  tone?: 'primary' | 'secondary' | 'ghost';
  location: string;
  message: string;
}

export interface PilotRelatedLink {
  label: string;
  href: string;
  description: string;
  intent: 'primary' | 'secondary';
}

export interface PilotSection {
  title: string;
  body: string[];
  bullets?: string[];
}

export interface PilotPageData {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  canonical: string;
  pageType: PilotPageType;
  seoCluster: string;
  keywordTarget: string;
  lastUpdated: string;
  readingTime: string;
  heroHeadline: string;
  subheadline: string;
  quickAnswers: string[];
  decisionBox: string[];
  table?: PilotTable;
  sections: PilotSection[];
  faq: PilotFaq[];
  primaryCtas: PilotCta[];
  relatedLinks: PilotRelatedLink[];
  leadForm?: {
    title: string;
    description: string;
  };
}

export const pilotBatch1Routes = [
  '/panduan/komponen-biaya-maklon-skincare',
  '/panduan/cara-menentukan-moq-produk-kosmetik',
  '/biaya-maklon-skincare',
  '/moq-maklon-kosmetik',
] as const;

export const komponenBiayaMaklonSkincare: PilotPageData = {
  slug: '/panduan/komponen-biaya-maklon-skincare',
  title: 'Komponen Biaya Maklon Skincare yang Perlu Dihitung Sebelum Produksi',
  metaTitle: 'Komponen Biaya Maklon Skincare yang Perlu Dihitung | Dreamlab',
  metaDescription:
    'Pahami komponen biaya maklon skincare dari formula, MOQ, kemasan, sample, desain, hingga legalitas agar kamu bisa menyiapkan budget sebelum produksi.',
  canonical: 'https://dreamlab.id/panduan/komponen-biaya-maklon-skincare/',
  pageType: 'pilot_article',
  seoCluster: 'maklon_skincare_pilot',
  keywordTarget: 'komponen biaya maklon skincare',
  lastUpdated: '6 Juli 2026',
  readingTime: '8 menit baca',
  heroHeadline: 'Komponen biaya maklon skincare yang perlu dihitung sebelum produksi',
  subheadline:
    'Panduan ini membantu brand pemula memahami struktur biaya secara praktis, supaya budget lebih siap dan keputusan konsultasi lebih cepat.',
  quickAnswers: [
    'Biaya maklon skincare biasanya bukan satu angka, tetapi gabungan beberapa komponen yang dipengaruhi formula, MOQ, kemasan, legalitas, dan scope produksi.',
    'Artikel ini fokus pada breakdown komponen biaya, bukan estimasi angka final.',
    'Jika kamu ingin angka estimasi dan arah budget, buka money page /biaya-maklon-skincare.',
    'Jika kamu belum tahu MOQ aman, gunakan money page /moq-maklon-kosmetik untuk validasi awal.',
  ],
  decisionBox: [
    'Jika kamu brand pemula, prioritaskan komponen wajib dulu: formula, sample, kemasan dasar, dan legalitas.',
    'Jika targetmu lebih premium, siapkan budget ekstra untuk desain, kemasan custom, dan quality gate yang lebih ketat.',
    'Jika masih belum jelas scope produk, jangan tebak budget sendiri. Validasi dulu dengan konsultasi agar tidak salah arah.',
  ],
  table: {
    headers: ['Komponen', 'Fungsi', 'Kenapa Berpengaruh'],
    rows: [
      ['Formula / R&D', 'Menyusun karakter produk dan klaim utama', 'Semakin spesifik brief, semakin besar effort pengembangan'],
      ['Sample / Prototype', 'Tahap validasi sebelum produksi', 'Biasanya memengaruhi waktu, revisi, dan approval'],
      ['MOQ / Kuantitas awal', 'Jumlah minimum produksi', 'Berkaitan dengan efisiensi bahan, setup mesin, dan packaging'],
      ['Kemasan', 'Wadah dan visual produk', 'Kemasan custom cenderung lebih kompleks dari kemasan standar'],
      ['Desain label / box', 'Identitas brand dan informasi wajib', 'Ada kebutuhan layout, revisi, dan penyesuaian regulasi'],
      ['Legalitas / notifikasi', 'Mendukung produk siap jual', 'Membutuhkan dokumen dan proses administrasi'],
      ['QC / stabilitas', 'Menjaga kualitas batch', 'Bisa menambah proses uji dan waktu produksi'],
    ],
  },
  sections: [
    {
      title: 'Kenapa biaya maklon tidak bisa dipukul rata',
      body: [
        'Setiap produk punya kebutuhan berbeda. Serum, toner, cream, dan sunscreen tidak bisa dihitung dengan pola biaya yang sama karena bahan aktif, jenis kemasan, dan beban legalitasnya berbeda.',
        'Itulah kenapa artikel ini memecah biaya menjadi komponen yang bisa kamu cek satu per satu sebelum bicara angka final.',
      ],
    },
    {
      title: 'Komponen biaya yang sering paling besar',
      body: [
        'Dalam banyak kasus, tiga komponen yang paling cepat menggeser budget adalah formula, kemasan, dan kuantitas awal produksi.',
        'Formula yang terlalu kompleks membuat proses R&D lebih panjang. Kemasan custom menambah detail teknis. MOQ yang terlalu kecil sering membuat biaya per unit kurang efisien.',
      ],
    },
    {
      title: 'Biaya yang sering terlupakan brand pemula',
      body: [
        'Banyak brand hanya fokus pada bahan baku, padahal ada biaya lain yang sering ikut muncul seperti sample, revisi desain, label compliance, dokumentasi, dan penyesuaian packaging.',
        'Kalau semua faktor ini tidak dihitung dari awal, budget jadi terlihat aman di atas kertas tetapi meleset saat eksekusi.',
      ],
    },
    {
      title: 'Kapan sebaiknya konsultasi langsung',
      body: [
        'Kalau kamu sudah punya target produk, target market, dan kisaran volume order, konsultasi bisa membantu menyusun prioritas biaya yang realistis.',
        'Kalau brief masih terlalu umum, konsultasi justru lebih penting supaya scope produk tidak melebar dan budget tetap terkendali.',
      ],
    },
  ],
  faq: [
    {
      question: 'Apakah artikel ini memberikan angka biaya maklon skincare?',
      answer:
        'Tidak. Artikel ini fokus pada komponen biaya dan faktor yang memengaruhi budget. Untuk estimasi angka, gunakan money page /biaya-maklon-skincare.',
    },
    {
      question: 'Kenapa biaya maklon skincare bisa berbeda antar brand?',
      answer:
        'Karena formula, ukuran produk, pilihan kemasan, MOQ, dan kebutuhan legalitas tidak selalu sama. Perbedaan scope kecil bisa berdampak besar pada budget.',
    },
    {
      question: 'Komponen mana yang biasanya paling memengaruhi biaya awal?',
      answer:
        'Biasanya formula, sample/prototype, kemasan, dan MOQ awal. Keempatnya paling cepat mengubah total budget produksi.',
    },
    {
      question: 'Bagaimana cara menyiapkan budget yang lebih aman?',
      answer:
        'Gunakan breakdown komponen, tentukan produk prioritas, dan validasi scope dengan tim produksi sebelum memutuskan angka final.',
    },
    {
      question: 'Kapan saya harus pindah ke money page estimasi biaya?',
      answer:
        'Begitu kamu sudah paham scope produk dan ingin melihat arah budget lebih konkret. Saat itu money page estimasi akan jauh lebih relevan.',
    },
  ],
  primaryCtas: [
    {
      label: 'Cek Estimasi Biaya Produkmu',
      href: '/thankyou/google/?source=pilot-article',
      tone: 'primary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin cek estimasi biaya produk skincare saya.',
    },
    {
      label: 'Kirim Brief Produk',
      href: '/thankyou/google/?source=pilot-article',
      tone: 'secondary',
      location: 'final',
      message: 'Halo Dreamlab, saya ingin kirim brief produk untuk dibantu breakdown biayanya.',
    },
  ],
  relatedLinks: [
    {
      label: '/biaya-maklon-skincare',
      href: '/biaya-maklon-skincare',
      description: 'Money page untuk estimasi, konsultasi, dan conversion.',
      intent: 'primary',
    },
    {
      label: '/moq-maklon-kosmetik',
      href: '/moq-maklon-kosmetik',
      description: 'Halaman untuk validasi MOQ aman sebelum produksi.',
      intent: 'secondary',
    },
  ],
  leadForm: {
    title: 'Kirim Brief Produk',
    description: 'Isi singkat kebutuhan produkmu agar tim bisa bantu arahkan komponen biaya yang paling relevan.',
  },
};

export const caraMenentukanMoqProdukKosmetik: PilotPageData = {
  slug: '/panduan/cara-menentukan-moq-produk-kosmetik',
  title: 'Cara Menentukan MOQ Produk Kosmetik yang Aman untuk Brand Baru',
  metaTitle: 'Cara Menentukan MOQ Produk Kosmetik | Dreamlab',
  metaDescription:
    'Pelajari cara menentukan MOQ produk kosmetik berdasarkan demand, budget, kemasan, dan risiko agar launch brand lebih aman.',
  canonical: 'https://dreamlab.id/panduan/cara-menentukan-moq-produk-kosmetik/',
  pageType: 'pilot_article',
  seoCluster: 'maklon_skincare_pilot',
  keywordTarget: 'cara menentukan moq produk kosmetik',
  lastUpdated: '6 Juli 2026',
  readingTime: '7 menit baca',
  heroHeadline: 'Cara menentukan MOQ produk kosmetik yang aman untuk brand baru',
  subheadline:
    'Panduan ini membantu brand memetakan volume awal yang masuk akal tanpa mengorbankan cashflow atau kualitas eksekusi.',
  quickAnswers: [
    'MOQ tidak bisa ditentukan hanya dari satu angka target; kamu perlu melihat demand awal, jenis produk, dan kapasitas budget.',
    'Artikel ini fokus pada cara menentukan MOQ, bukan estimasi biaya final.',
    'Jika kamu sudah ingin validasi minimum order secara lebih praktis, buka /moq-maklon-kosmetik.',
    'Kalau kamu juga butuh breakdown budget, buka /biaya-maklon-skincare.',
  ],
  decisionBox: [
    'Jika brand masih baru, jangan paksakan MOQ besar hanya demi terlihat “serius”.',
    'Jika demand awal sudah terbukti, MOQ yang sedikit lebih tinggi bisa menurunkan biaya per unit.',
    'Jika kamu belum punya data demand, gunakan konsultasi untuk menyeimbangkan risiko dan efisiensi produksi.',
  ],
  table: {
    headers: ['Faktor', 'Apa yang dicek', 'Dampaknya ke MOQ'],
    rows: [
      ['Demand awal', 'Seberapa besar minat pasar yang sudah ada', 'Menentukan apakah volume awal bisa dibuat konservatif atau perlu agresif'],
      ['Jenis produk', 'Apakah formula sederhana atau kompleks', 'Produk yang lebih kompleks biasanya butuh perencanaan MOQ lebih hati-hati'],
      ['Kemasan', 'Standar, custom, atau premium', 'Kemasan custom sering mengangkat kebutuhan minimum'],
      ['Budget launch', 'Dana yang siap dipakai untuk inventory awal', 'Semakin ketat budget, semakin penting MOQ yang realistis'],
      ['Target channel', 'Marketplace, reseller, retail, atau klinik', 'Channel berbeda punya kebutuhan stok awal berbeda'],
      ['Rencana repeat order', 'Seberapa cepat produk akan di-reorder', 'Jika repeat cepat, MOQ bisa lebih aman dinaikkan'],
    ],
  },
  sections: [
    {
      title: 'Kenapa MOQ tidak boleh asal copy brand lain',
      body: [
        'MOQ yang cocok untuk brand lain belum tentu cocok untukmu. Perbedaan demand, kapasitas stok, dan strategi launch bisa membuat volume yang sama menjadi terlalu besar atau justru terlalu kecil.',
        'Tujuan menentukan MOQ bukan hanya “bisa produksi”, tetapi membuat cashflow tetap sehat setelah launch.',
      ],
    },
    {
      title: 'Cara membaca demand sebelum menentukan MOQ',
      body: [
        'Mulailah dari indikator sederhana: apakah ada audiens yang sudah menunggu, apakah sudah ada bukti interest, dan seberapa cepat produk kemungkinan repeat order.',
        'Kalau data demand masih tipis, lebih aman mulai dari volume yang bisa diuji lebih dulu daripada mengunci stok besar.',
      ],
    },
    {
      title: 'Kesalahan umum saat menentukan MOQ',
      body: [
        'Kesalahan yang sering terjadi adalah menilai MOQ hanya dari angka paling rendah, tanpa mempertimbangkan biaya per unit, cashflow, dan risiko stok menumpuk.',
        'Kesalahan lainnya adalah menaikkan MOQ hanya untuk mengejar kesan premium, padahal pasar belum teruji.',
      ],
    },
  ],
  faq: [
    {
      question: 'Apakah MOQ selalu harus besar supaya efisien?',
      answer:
        'Tidak selalu. MOQ yang terlalu besar bisa membebani cashflow. MOQ yang tepat adalah yang seimbang antara efisiensi dan risiko stok.',
    },
    {
      question: 'Apakah produk skincare dan kosmetik punya MOQ yang sama?',
      answer:
        'Tidak. Jenis produk, formula, dan kemasan bisa mengubah kebutuhan MOQ secara signifikan.',
    },
    {
      question: 'Apa yang paling penting sebelum menetapkan MOQ?',
      answer:
        'Demand awal, budget launch, dan rencana channel penjualan. Tiga hal ini biasanya paling berpengaruh ke volume awal.',
    },
    {
      question: 'Apakah saya bisa konsultasi kalau belum punya angka pasti?',
      answer:
        'Bisa. Bahkan itu lebih aman karena tim bisa bantu menyeimbangkan volume, budget, dan risiko produksi.',
    },
    {
      question: 'Apakah artikel ini menggantikan halaman MOQ money page?',
      answer:
        'Tidak. Artikel ini hanya membantu kamu memahami cara menentukan MOQ. Untuk validasi minimum order yang lebih conversion-ready, gunakan /moq-maklon-kosmetik.',
    },
  ],
  primaryCtas: [
    {
      label: 'Cek Estimasi Biaya Produkmu',
      href: '/thankyou/google/?source=pilot-article',
      tone: 'primary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin cek estimasi biaya dan MOQ produk saya.',
    },
    {
      label: 'Kirim Brief Produk',
      href: '/thankyou/google/?source=pilot-article',
      tone: 'secondary',
      location: 'final',
      message: 'Halo Dreamlab, saya ingin kirim brief produk untuk dibantu menentukan MOQ.',
    },
  ],
  relatedLinks: [
    {
      label: '/moq-maklon-kosmetik',
      href: '/moq-maklon-kosmetik',
      description: 'Money page untuk validasi minimum order yang lebih siap conversion.',
      intent: 'primary',
    },
    {
      label: '/biaya-maklon-skincare',
      href: '/biaya-maklon-skincare',
      description: 'Estimasi budget supaya MOQ dan cashflow tetap sinkron.',
      intent: 'secondary',
    },
  ],
  leadForm: {
    title: 'Kirim Brief Produk',
    description: 'Tulis target produk dan channel penjualan agar MOQ bisa disarankan lebih aman.',
  },
};

export const biayaMaklonSkincareMoneyPage: PilotPageData = {
  slug: '/biaya-maklon-skincare',
  title: 'Biaya Maklon Skincare yang Perlu Disiapkan',
  metaTitle: 'Biaya Maklon Skincare | Estimasi dan Konsultasi Dreamlab',
  metaDescription:
    'Cari arah budget maklon skincare, validasi scope produk, dan konsultasi estimasi yang lebih realistis dengan tim Dreamlab.',
  canonical: 'https://dreamlab.id/biaya-maklon-skincare/',
  pageType: 'money_page',
  seoCluster: 'maklon_skincare_pilot',
  keywordTarget: 'biaya maklon skincare',
  lastUpdated: '6 Juli 2026',
  readingTime: '6 menit baca',
  heroHeadline: 'Cari arah budget maklon skincare yang lebih realistis',
  subheadline:
    'Halaman ini dirancang untuk membantu kamu mengecek estimasi, scope, dan langkah konsultasi agar keputusan produksi lebih cepat.',
  quickAnswers: [
    'Gunakan halaman ini jika kamu sudah ingin melihat arah budget dan bukan lagi breakdown komponen.',
    'Estimasi akhir tetap tergantung formula, kemasan, MOQ, dan scope legalitas.',
    'Kalau masih bingung MOQ, cek dulu /moq-maklon-kosmetik.',
  ],
  decisionBox: [
    'Jika produk masih baru, mulai dari scope yang sederhana agar budget tidak melebar.',
    'Jika targetmu premium, siapkan budget lebih besar untuk kemasan, desain, dan validasi kualitas.',
    'Kalau ingin cepat, kirim brief agar tim bisa bantu mengerucutkan angka dan prioritas.',
  ],
  sections: [
    {
      title: 'Apa yang menentukan estimasi biaya',
      body: [
        'Estimasi biasanya dibentuk oleh formula, kuantitas produksi, jenis kemasan, dan kebutuhan legalitas.',
        'Semakin detail brief yang kamu kirim, semakin akurat arah estimasinya.',
      ],
    },
    {
      title: 'Cara memulai konsultasi',
      body: [
        'Siapkan target produk, referensi tekstur atau hasil yang diinginkan, estimasi jumlah order, dan preferensi kemasan.',
        'Tim akan membantu menyaring mana yang wajib, mana yang bisa ditunda, dan mana yang paling memengaruhi budget.',
      ],
    },
  ],
  faq: [
    {
      question: 'Apakah halaman ini menampilkan angka pasti?',
      answer: 'Tidak. Halaman ini fokus pada estimasi dan arahan budget. Angka final tergantung scope produk yang disepakati.',
    },
    {
      question: 'Apakah saya harus tahu MOQ dulu?',
      answer: 'Tidak harus, tapi jika MOQ belum jelas sebaiknya buka /moq-maklon-kosmetik agar budget awal lebih masuk akal.',
    },
    {
      question: 'Bagaimana cara kirim brief?',
      answer: 'Gunakan CTA Kirim Brief Produk atau konsultasi via WhatsApp agar tim bisa bantu breakdown kebutuhanmu.',
    },
  ],
  primaryCtas: [
    {
      label: 'Cek Estimasi Biaya Produkmu',
      href: '/thankyou/google/?source=pilot-money-page',
      tone: 'primary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin cek estimasi biaya produk skincare saya.',
    },
    {
      label: 'Kirim Brief Produk',
      href: '/thankyou/google/?source=pilot-money-page',
      tone: 'secondary',
      location: 'final',
      message: 'Halo Dreamlab, saya ingin kirim brief produk untuk validasi budget.',
    },
  ],
  relatedLinks: [
    {
      label: '/panduan/komponen-biaya-maklon-skincare',
      href: '/panduan/komponen-biaya-maklon-skincare',
      description: 'Breakdown komponen biaya sebelum melihat estimasi.',
      intent: 'primary',
    },
    {
      label: '/moq-maklon-kosmetik',
      href: '/moq-maklon-kosmetik',
      description: 'Validasi MOQ agar budget dan volume produksi sinkron.',
      intent: 'secondary',
    },
  ],
  leadForm: {
    title: 'Kirim Brief Produk',
    description: 'Gunakan formulir singkat ini untuk memulai konsultasi estimasi.',
  },
};

export const moqMaklonKosmetikMoneyPage: PilotPageData = {
  slug: '/moq-maklon-kosmetik',
  title: 'MOQ Maklon Kosmetik yang Perlu Kamu Validasi',
  metaTitle: 'MOQ Maklon Kosmetik | Validasi Minimum Order Dreamlab',
  metaDescription:
    'Pelajari cara membaca MOQ maklon kosmetik agar budget, target produksi, dan strategi launch brand lebih aman.',
  canonical: 'https://dreamlab.id/moq-maklon-kosmetik/',
  pageType: 'money_page',
  seoCluster: 'maklon_skincare_pilot',
  keywordTarget: 'moq maklon kosmetik',
  lastUpdated: '6 Juli 2026',
  readingTime: '5 menit baca',
  heroHeadline: 'Validasi MOQ maklon kosmetik sebelum produksi',
  subheadline:
    'Gunakan halaman ini untuk menyelaraskan kebutuhan volume, budget, dan target launching produk.',
  quickAnswers: [
    'MOQ adalah faktor penting karena langsung memengaruhi efisiensi biaya per unit.',
    'Halaman ini fokus pada validasi minimum order, bukan breakdown komponen biaya.',
    'Kalau ingin lihat pembagiannya, buka /panduan/komponen-biaya-maklon-skincare.',
  ],
  decisionBox: [
    'Jika brand masih baru, hindari memaksa MOQ terlalu besar sejak awal.',
    'Jika sudah ada demand, MOQ yang tepat bisa membantu menekan biaya per unit.',
    'Gunakan konsultasi untuk menemukan titik tengah antara volume aman dan budget yang masuk akal.',
  ],
  sections: [
    {
      title: 'Kenapa MOQ perlu divalidasi lebih dulu',
      body: [
        'MOQ memengaruhi efisiensi produksi, perencanaan bahan baku, dan pilihan kemasan.',
        'Kalau volume terlalu kecil, biaya per unit bisa terasa berat. Kalau terlalu besar, cashflow bisa tertahan.',
      ],
    },
    {
      title: 'Apa yang sebaiknya kamu siapkan',
      body: [
        'Siapkan gambaran demand awal, channel penjualan, dan target launch agar tim bisa menyarankan MOQ yang lebih masuk akal.',
      ],
    },
  ],
  faq: [
    {
      question: 'Apakah MOQ selalu sama untuk semua produk?',
      answer: 'Tidak. MOQ sangat dipengaruhi jenis produk, formula, kemasan, dan kompleksitas produksinya.',
    },
    {
      question: 'Kenapa MOQ penting untuk budget?',
      answer: 'Karena MOQ menentukan efisiensi pembelian bahan, setup produksi, dan biaya per unit.',
    },
    {
      question: 'Apakah saya bisa konsultasi dulu sebelum tahu MOQ?',
      answer: 'Bisa. Bahkan itu lebih aman karena tim bisa bantu mengerucutkan scope produk sebelum menentukan volume.',
    },
  ],
  primaryCtas: [
    {
      label: 'Cek Estimasi Biaya Produkmu',
      href: '/thankyou/google/?source=pilot-moq',
      tone: 'primary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin cek estimasi biaya dan MOQ produk skincare saya.',
    },
    {
      label: 'Kirim Brief Produk',
      href: '/thankyou/google/?source=pilot-moq',
      tone: 'secondary',
      location: 'final',
      message: 'Halo Dreamlab, saya ingin kirim brief produk untuk validasi MOQ.',
    },
  ],
  relatedLinks: [
    {
      label: '/panduan/komponen-biaya-maklon-skincare',
      href: '/panduan/komponen-biaya-maklon-skincare',
      description: 'Breakdown komponen biaya yang memengaruhi MOQ.',
      intent: 'primary',
    },
    {
      label: '/biaya-maklon-skincare',
      href: '/biaya-maklon-skincare',
      description: 'Estimasi budget dan konsultasi arah produksi.',
      intent: 'secondary',
    },
  ],
  leadForm: {
    title: 'Kirim Brief Produk',
    description: 'Kirim gambaran produk untuk bantu validasi MOQ yang aman.',
  },
};
