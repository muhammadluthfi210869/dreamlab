export type PilotPageType = 'pilot_article' | 'money_page';

export interface PilotFaq {
  question: string;
  answer: string;
}

export interface PilotTable {
  eyebrow: string;
  title: string;
  headers: string[];
  rows: string[][];
}

export interface PilotContentList {
  eyebrow: string;
  title: string;
  description?: string;
  items: string[];
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
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export interface PilotCtaSection {
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryMessage: string;
  secondaryLabel: string;
  secondaryMessage: string;
}

export interface PilotStickyCta {
  primaryLabel: string;
  primaryMessage: string;
  secondaryLabel: string;
  secondaryMessage: string;
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
  publishedAt: string;
  updatedAt: string;
  lastUpdated: string;
  readingTime: string;
  heroHeadline: string;
  subheadline: string;
  quickAnswers: string[];
  table?: PilotTable;
  decisionBox: PilotContentList;
  checklist?: PilotContentList;
  sections: PilotSection[];
  faq: PilotFaq[];
  heroCtas: PilotCta[];
  contextualCta: PilotCtaSection;
  finalCta: PilotCtaSection;
  stickyCta: PilotStickyCta;
  relatedSection: {
    eyebrow: string;
    title: string;
    description: string;
  };
  relatedLinks: PilotRelatedLink[];
  leadForm: {
    title: string;
    description: string;
    submitLabel: string;
  };
}

export const pilotBatch1Routes = [
  '/panduan',
  '/panduan/komponen-biaya-maklon-skincare',
  '/panduan/cara-menentukan-moq-produk-kosmetik',
  '/biaya-maklon-skincare',
  '/moq-maklon-kosmetik',
  '/pabrik-kosmetik',
] as const;

export const komponenBiayaMaklonSkincare: PilotPageData = {
  slug: '/panduan/komponen-biaya-maklon-skincare',
  title: 'Checklist Komponen Biaya Maklon Skincare Sebelum Minta Estimasi',
  metaTitle: 'Checklist Biaya Maklon Skincare Sebelum Estimasi | Dreamlab',
  metaDescription:
    'Cek komponen biaya maklon skincare yang perlu disiapkan sebelum minta estimasi, mulai dari formula, MOQ, kemasan, sample, desain, legalitas, hingga QC.',
  canonical: 'https://dreamlab.id/panduan/komponen-biaya-maklon-skincare/',
  pageType: 'pilot_article',
  seoCluster: 'maklon_skincare_pilot',
  keywordTarget: 'checklist komponen biaya maklon skincare',
  publishedAt: '2026-07-06T00:00:00+07:00',
  updatedAt: '2026-07-08T00:00:00+07:00',
  lastUpdated: '8 Juli 2026',
  readingTime: '12 menit baca',
  heroHeadline: 'Checklist Komponen Biaya Maklon Skincare Sebelum Minta Estimasi',
  subheadline:
    'Ini adalah pre-estimate decision article untuk brand owner yang ingin menyiapkan scope, memilah area hemat versus area yang wajib diamankan, lalu lanjut ke estimasi yang lebih akurat.',
  quickAnswers: [
    'Sebelum minta estimasi, Anda perlu mengecek formula, sample, MOQ, kemasan, desain, legalitas, dan quality control karena semua itu memengaruhi arah biaya.',
    'Artikel ini tidak membahas rumus HPP atau simulasi harga jual, karena tahap pertama yang perlu dipahami adalah scope biaya produksi sebelum masuk ke perhitungan margin.',
    'Jika tujuan Anda sudah bergeser dari memahami komponen ke memvalidasi angka, lanjutkan ke halaman /biaya-maklon-skincare.',
    'Kalau volume awal belum jelas dan Anda takut salah menahan stok, cek juga /moq-maklon-kosmetik sebelum brief dikirim.',
  ],
  table: {
    eyebrow: 'Tabel Utama',
    title: 'Komponen biaya yang perlu dicek sebelum minta estimasi',
    headers: ['Komponen', 'Dampak ke biaya', 'Bisa dihemat?', 'Risiko jika salah ambil keputusan'],
    rows: [
      ['Formula / R&D', 'Formula standar umumnya memakan waktu 14-21 hari kerja. Custom formula aktif kompleks bisa memakan waktu 30-60 hari dan membutuhkan uji stabilitas tambahan.', 'Terbatas. Yang bisa dihemat biasanya kompleksitas brief awal, bukan fase validasinya.', 'Formula yang terlalu cepat dikunci tanpa validasi bisa memicu revisi berulang dan membuat estimasi awal meleset.'],
      ['Sample / Prototype', 'Setiap revisi di luar batas toleransi, umumnya setelah 3 kali revisi, menambah biaya bahan baku dan bisa menunda timeline 1-2 minggu.', 'Bisa, kalau brief lebih jelas sejak awal dan approval lebih disiplin.', 'Approval sample yang kabur membuat biaya dan timeline bergerak tanpa kontrol.'],
      ['MOQ / Kuantitas awal', 'MOQ memengaruhi biaya per unit, kebutuhan stok, dan tekanan cashflow. Batch terlalu kecil biasanya kurang efisien, batch terlalu besar menahan modal lebih lama.', 'Bisa dioptimalkan, bukan sekadar diperkecil.', 'MOQ yang salah membuat estimasi terlihat aman di awal tetapi berat saat stok harus diputar.'],
      ['Kemasan', 'Kemasan standar biasanya ready stock. Kemasan custom premium dari luar negeri sering mewajibkan MOQ cetak terpisah sekitar 5.000-10.000 pcs sebelum cairan diisi.', 'Bisa, terutama dengan menahan custom terlalu dini.', 'Salah pilih kemasan bisa menaikkan beban biaya jauh sebelum produk tervalidasi di pasar.'],
      ['Desain label / box', 'Revisi artwork, penyesuaian ukuran, dan area compliance sering menambah 2-5 hari kerja tiap putaran jika file awal belum matang.', 'Bisa, jika keputusan visual tidak dibuka terlalu banyak sekaligus.', 'File cetak yang belum matang bisa menahan produksi walau formula sudah siap.'],
      ['Legalitas', 'Dokumen dan kelengkapan informasi label yang belum siap bisa menambah antrean review internal sekitar 3-7 hari sebelum masuk proses lanjutan.', 'Tidak sebaiknya. Yang bisa dihemat adalah rework, bukan proses wajibnya.', 'Legalitas yang dianggap belakangan sering memaksa koreksi kemasan dan memperlambat launch.'],
      ['QC / stabilitas', 'Uji mutu dan stabilitas dasar bisa menambah 2-4 minggu tergantung kompleksitas formula dan target hasil akhir.', 'Jangan dihemat secara agresif.', 'Batch awal yang lolos tanpa quality gate memadai berisiko memukul reputasi brand saat launch pertama.'],
    ],
  },
  decisionBox: {
    eyebrow: 'Decision Box',
    title: 'Urutan keputusan sebelum konsultasi',
    description: 'Gunakan urutan ini saat budget masih ketat agar konsultasi tidak dimulai dari angka yang salah, melainkan dari scope yang benar.',
    items: [
      'Amankan dulu area inti: formula yang masuk akal, sample yang benar-benar di-approve, kemasan dasar yang rapi, dan kesiapan legalitas.',
      'Tahan keputusan custom yang terlalu dini jika positioning, channel penjualan, dan harga jual final masih belum sepenuhnya terkunci.',
      'Jangan mulai dari pertanyaan "berapa biayanya?" kalau brief produk sendiri masih kabur. Estimasi tanpa scope hanya memproduksi ekspektasi yang salah.',
    ],
  },
  checklist: {
    eyebrow: 'Checklist',
    title: 'Checklist brief sebelum minta estimasi',
    description: 'Semakin lengkap jawaban Anda untuk poin berikut, semakin kecil risiko konsultasi bergerak terlalu lebar atau estimasi berubah karena brief belum matang.',
    items: [
      'Jenis produk sudah jelas, misalnya serum, toner, facial wash, day cream, atau sunscreen.',
      'Target market dan positioning sudah mulai terkunci, misalnya mass market, mass premium, klinik, komunitas, atau brand personal.',
      'Manfaat utama dan arah formula sudah dipahami, termasuk tekstur, sensori, dan klaim yang ingin diutamakan.',
      'Range MOQ awal sudah dipikirkan agar diskusi biaya tidak terlepas dari risiko stok dan cashflow.',
      'Pilihan kemasan sudah mengerucut, minimal antara opsi standar, semi-custom, atau premium custom.',
      'Prioritas launch sudah jelas: ingin masuk pasar lebih cepat atau rela menunggu hasil yang terasa lebih premium.',
    ],
  },
  sections: [
    {
      title: 'Komponen biaya yang perlu dicek sebelum minta estimasi',
      body: [
        'Masalah paling sering muncul ketika calon brand owner langsung meminta angka tanpa membuka scope. Padahal biaya selalu mengikuti brief. Serum, facial wash, toner, sunscreen, dan body lotion tidak pernah bergerak dengan struktur biaya yang identik karena formula, kemasan, cara pakai, dan beban validasinya berbeda.',
        'Sebelum konsultasi, tujuan Anda bukan mencari nominal umum, tetapi memastikan komponen yang akan dibawa ke diskusi sudah benar. Dengan begitu, estimasi yang keluar nanti lebih dekat ke kebutuhan nyata, bukan sekadar angka pengantar yang berpotensi menyesatkan.',
      ],
    },
    {
      title: 'Area yang masih bisa dihemat',
      body: [
        'Pada batch awal, penghematan paling sehat biasanya dilakukan pada area yang tidak merusak performa inti produk. Ini bukan soal menurunkan kualitas, tetapi soal menahan elemen yang belum wajib untuk validasi pasar pertama.',
      ],
      bullets: [
        'Kemasan custom yang terlalu kompleks biasanya masih bisa diganti dulu dengan opsi standar atau semi-custom yang tetap rapi dan layak jual.',
        'Jumlah varian awal sebaiknya ditahan. Satu hero SKU yang tepat lebih berguna daripada beberapa SKU yang belum teruji.',
        'Finishing sekunder seperti box premium tebal, aksen dekoratif, atau elemen visual non-esensial bisa ditunda sampai positioning dan repeat order mulai terbukti.',
      ],
    },
    {
      title: 'Area yang tidak boleh dipotong',
      body: [
        'Ada area yang terlihat berat di depan, tetapi justru berfungsi sebagai pagar risiko. Jika komponen ini dipangkas terlalu agresif, biaya koreksinya setelah launch biasanya lebih mahal daripada biaya awalnya.',
      ],
      bullets: [
        'Formula dan sample approval tidak boleh dipercepat tanpa validasi yang cukup, karena ini menentukan pengalaman produk yang sesungguhnya diterima pasar.',
        'Legalitas, informasi label, dan area compliance tidak boleh dianggap formalitas karena ini memengaruhi keamanan jual dan kesiapan launch.',
        'QC dasar dan kestabilan produk tetap penting agar batch awal tidak justru memukul reputasi brand yang baru dibangun.',
      ],
    },
    {
      title: 'Kesalahan budget brand pemula',
      body: [
        'Brand pemula sering terjebak pada angka per unit, lalu lupa bahwa biaya launch juga dipengaruhi revisi, asset visual, ketidaksiapan brief, dan keputusan kemasan yang terlalu cepat. Akibatnya, angka di kepala tampak aman tetapi realisasi produksi terasa lebih berat.',
      ],
      bullets: [
        'Memilih kemasan premium sebelum tahu positioning, channel penjualan, dan rentang harga jual yang masuk akal.',
        'Meminta terlalu banyak benefit formula di batch pertama tanpa mempertimbangkan konsekuensi R&D dan approval sample.',
        'Menganggap MOQ paling kecil pasti paling aman, padahal volume yang terlalu kecil juga bisa membuat biaya sulit dibaca.',
        'Terjebak markup makelar atau broker. Banyak pemilik brand membayar jauh lebih mahal dari yang seharusnya karena mereka tidak memahami rincian komponen ini, sehingga mudah terbuai oleh paket biaya yang buram tetapi dibungkus presentasi digital yang rapi.',
        'Masuk konsultasi tanpa prioritas yang jelas: mana yang wajib sekarang, mana yang boleh menunggu batch berikutnya.',
      ],
    },
    {
      title: 'Skor Kesiapan Estimasi: Apakah Brief Kamu Sudah Cukup Jelas?',
      body: [
        'Bagian ini membantu Anda membaca apakah diskusi sudah siap masuk ke estimasi atau masih perlu fokus merapikan scope lebih dulu. Bukan semua brief harus lengkap sejak hari pertama, tetapi semakin jelas titik dasarnya, semakin akurat arah biaya yang bisa dibahas.',
      ],
      bullets: [
        'Jika Anda baru bisa menjawab 1-2 poin checklist, fokus konsultasi sebaiknya masih di scope, bukan di angka estimasi.',
        'Jika Anda sudah bisa menjawab 3-4 poin, estimasi awal mulai bisa diarahkan walau masih mungkin berubah saat brief dipertajam.',
        'Jika Anda sudah bisa menjawab 5-6 poin, diskusi biasanya sudah bisa masuk ke estimasi, MOQ, kemasan, dan timeline dengan jauh lebih produktif.',
      ],
    },
    {
      title: 'Produk sederhana vs premium: apa bedanya?',
      body: [
        'Perbedaan antara scope sederhana dan premium paling mudah dibaca dari area keputusan yang dipilih sejak awal. Tujuan bagian ini bukan memberi angka, tetapi memperlihatkan bagaimana struktur keputusan ikut menggeser arah biaya dan risiko launch.',
      ],
      table: {
        headers: ['Area keputusan', 'Scope sederhana', 'Scope premium'],
        rows: [
          ['Formula', 'Lebih fokus, manfaat inti jelas, revisi lebih dibatasi', 'Lebih detail, sensori lebih diperhatikan, target hasil lebih spesifik'],
          ['Kemasan', 'Standar atau semi-custom yang rapi dan cepat jalan', 'Custom yang lebih kuat secara persepsi dan sering butuh koordinasi lebih panjang'],
          ['SKU awal', 'Biasanya mulai dari satu hero SKU untuk validasi pasar', 'Bisa lebih dari satu SKU jika positioning dan kesiapan launch sudah lebih matang'],
          ['Tujuan launch', 'Masuk pasar lebih cepat dan membaca respon awal', 'Membangun persepsi brand yang lebih tinggi sejak batch pertama'],
          ['Risiko', 'Lebih aman untuk cashflow tetapi tetap butuh disiplin scope', 'Potensi biaya dan timeline lebih besar jika keputusan awal belum benar-benar terkunci'],
        ],
      },
    },
    {
      title: 'Kapan harus lanjut ke estimasi biaya?',
      body: [
        'Begitu Anda sudah bisa menyebutkan jenis produk, target positioning, range MOQ, preferensi kemasan, dan prioritas launch, artikel ini sudah menyelesaikan tugasnya. Pada titik itu, pertanyaan Anda bukan lagi "komponennya apa saja?" melainkan "arah estimasinya seperti apa?"',
        'Gunakan /biaya-maklon-skincare saat Anda ingin membawa scope tadi ke validasi estimasi yang lebih konkret. Gunakan /moq-maklon-kosmetik bila problem utamanya justru ada di volume awal, efisiensi batch, dan risiko stok.',
      ],
    },
  ],
  faq: [
    {
      question: 'Apakah halaman ini memberi nominal biaya maklon skincare?',
      answer:
        'Tidak. Halaman ini fokus pada checklist komponen biaya dan keputusan sebelum estimasi. Angka baru masuk akal setelah brief produk, target kemasan, dan MOQ lebih jelas.',
    },
    {
      question: 'Komponen mana yang paling sering menggeser arah estimasi?',
      answer:
        'Biasanya formula yang terlalu kompleks, kemasan custom yang dipilih terlalu cepat, serta MOQ yang tidak selaras dengan demand dan cashflow awal.',
    },
    {
      question: 'Apa yang masih bisa dihemat tanpa merusak kualitas inti?',
      answer:
        'Umumnya kemasan custom, jumlah varian awal, dan finishing sekunder. Area inti seperti formula, sample approval, legalitas, dan QC dasar sebaiknya tidak dipotong sembarangan.',
    },
    {
      question: 'Kapan saya perlu pindah ke halaman estimasi biaya?',
      answer:
        'Saat scope produk sudah mulai jelas dan Anda ingin memvalidasi estimasi, bukan lagi sekadar memahami daftar komponennya.',
    },
    {
      question: 'Kalau saya belum tahu MOQ aman, harus mulai dari mana?',
      answer:
        'Mulai dari artikel ini untuk memahami struktur biaya, lalu lanjut ke /moq-maklon-kosmetik agar volume awal dan risiko stok bisa diseimbangkan sebelum estimasi dikunci.',
    },
    {
      question: 'Apakah saya perlu memahami HPP dulu sebelum konsultasi biaya?',
      answer:
        'Tidak harus. Untuk tahap awal, Anda cukup mengunci scope biaya dan brief produk. Setelah ruang lingkup ini disepakati, Anda bisa <a href="/cara-hitunghpp-produk-kosmeti/" class="font-semibold text-[#D98A00] underline underline-offset-4">membedah cara menghitung HPP kosmetik</a> dengan konteks yang jauh lebih akurat.',
    },
    {
      question: 'Apakah saya bisa konsultasi kalau belum punya brief lengkap?',
      answer:
        'Bisa. Justru banyak diskusi awal dimulai ketika brief masih belum utuh. Bedanya, arah konsultasinya bukan langsung meminta angka final, tetapi membantu Anda memperjelas jenis produk, positioning, MOQ awal, dan kebutuhan kemasan agar estimasi nantinya tidak meleset terlalu jauh.',
    },
    {
      question: 'Apa saja data minimal yang perlu saya siapkan sebelum minta estimasi?',
      answer:
        'Minimal Anda sudah punya gambaran jenis produk, target market, manfaat utama yang ingin dibawa, range MOQ awal, dan preferensi kemasan dasar. Kalau lima titik ini sudah ada, tim biasanya bisa mulai mengarahkan diskusi estimasi dengan lebih produktif walau beberapa detail masih berkembang.',
    },
  ],
  heroCtas: [
    {
      label: 'Cek Estimasi Biaya Produkmu',
      href: '/biaya-maklon-skincare/',
      tone: 'primary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin cek estimasi biaya untuk produk skincare saya berdasarkan brief yang lebih jelas.',
    },
    {
      label: 'Kirim Brief Produk',
      href: '#brief-form',
      tone: 'secondary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin kirim brief produk untuk dibantu cek estimasi biaya dan scope maklonnya.',
    },
  ],
  contextualCta: {
    eyebrow: 'Contextual CTA',
    title: 'Sudah tahu komponen mana yang wajib diamankan?',
    description:
      'Kalau scope biaya mulai terlihat, langkah berikutnya adalah memvalidasi estimasi berdasarkan brief yang lebih rapi dan prioritas launch yang lebih jelas.',
    primaryLabel: 'Cek Estimasi Biaya Produkmu',
    primaryMessage: 'Halo Dreamlab, saya ingin cek estimasi biaya untuk produk skincare saya berdasarkan brief yang lebih jelas.',
    secondaryLabel: 'Kirim Brief Produk',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk untuk dibantu cek estimasi biaya dan scope maklonnya.',
  },
  finalCta: {
    eyebrow: 'Final CTA',
    title: 'Lanjutkan ke estimasi yang lebih konkret',
    description:
      'Gunakan CTA di bawah ini saat Anda sudah siap mengubah checklist komponen biaya menjadi brief konsultasi dan estimasi yang lebih relevan.',
    primaryLabel: 'Cek Estimasi Biaya Produkmu',
    primaryMessage: 'Halo Dreamlab, saya ingin cek estimasi biaya untuk produk skincare saya berdasarkan brief yang lebih jelas.',
    secondaryLabel: 'Kirim Brief Produk',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk untuk dibantu cek estimasi biaya dan scope maklonnya.',
  },
  stickyCta: {
    primaryLabel: 'Cek Estimasi Biaya Produkmu',
    primaryMessage: 'Halo Dreamlab, saya ingin cek estimasi biaya untuk produk skincare saya berdasarkan brief yang lebih jelas.',
    secondaryLabel: 'Kirim Brief Produk',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk untuk dibantu cek estimasi biaya dan scope maklonnya.',
  },
  relatedSection: {
    eyebrow: 'Related Money Page',
    title: 'Lanjutkan ke langkah berikutnya setelah scope biaya mulai jelas',
    description: 'Gunakan dua halaman ini saat Anda sudah siap menghubungkan brief biaya dengan estimasi atau keputusan MOQ yang lebih konkret.',
  },
  relatedLinks: [
    {
      label: 'Cek Estimasi Biaya Produkmu',
      href: '/biaya-maklon-skincare',
      description: 'Masuk ke money page estimasi jika Anda sudah siap memvalidasi arah budget dan scope produk dengan intent yang lebih conversion-focused.',
      intent: 'primary',
    },
    {
      label: 'Cek MOQ yang Aman untuk Produkmu',
      href: '/moq-maklon-kosmetik',
      description: 'Gunakan halaman ini jika masalah utamanya adalah volume awal, efisiensi batch, dan risiko stok saat launch pertama.',
      intent: 'secondary',
    },
  ],
  leadForm: {
    title: 'Kirim Brief Produk',
    description: 'Isi brief produk Anda agar tim bisa membaca scope, memeriksa komponen biaya, dan membantu mengarahkan estimasi dengan lebih presisi.',
    submitLabel: 'Kirim Brief Produk',
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
  publishedAt: '2026-07-06T00:00:00+07:00',
  updatedAt: '2026-07-07T00:00:00+07:00',
  lastUpdated: '7 Juli 2026',
  readingTime: '10 menit baca',
  heroHeadline: 'Cara menentukan MOQ produk kosmetik yang aman untuk brand baru',
  subheadline:
    'Fokus halaman ini adalah decision framework: bagaimana membaca demand, budget inventory, channel penjualan, risiko stok, dan repeat order sebelum mengunci volume pertama.',
  quickAnswers: [
    'MOQ yang sehat tidak ditentukan dari angka paling kecil atau paling besar, tetapi dari titik temu antara demand awal, budget inventory, dan kecepatan repeat order.',
    'Kalau demand masih tipis, MOQ kecil sering lebih aman karena fungsi utamanya adalah validasi pasar dan cashflow.',
    'Kalau demand sudah lebih terbukti dan channel penjualan siap, MOQ yang sedikit lebih besar bisa lebih efisien per unit.',
    'Saat Anda butuh validasi minimum order secara conversion-focused, lanjut ke /moq-maklon-kosmetik.',
  ],
  table: {
    eyebrow: 'Tabel Utama',
    title: 'Framework penentu MOQ untuk launch pertama',
    headers: ['Faktor', 'Apa yang dicek', 'Dampaknya ke MOQ'],
    rows: [
      ['Demand awal', 'Apakah sudah ada audiens, pre-order, atau sinyal minat nyata', 'Semakin kuat demand, semakin masuk akal MOQ sedikit lebih tinggi'],
      ['Budget inventory', 'Seberapa besar dana yang siap ditahan di stok awal', 'Budget ketat mendorong MOQ yang lebih konservatif'],
      ['Channel penjualan', 'Marketplace, reseller, klinik, komunitas, atau retail', 'Setiap channel punya ritme penjualan dan kebutuhan stok yang berbeda'],
      ['Risiko stok', 'Seberapa cepat produk bisa bergerak dan seberapa besar risiko menumpuk', 'Risiko stok tinggi mendorong volume awal yang lebih hati-hati'],
      ['Repeat order', 'Seberapa cepat produksi ulang bisa direncanakan', 'Repeat order yang cepat memberi ruang untuk MOQ awal yang lebih kecil'],
      ['Kompleksitas produk', 'Formula dan kemasan sederhana atau premium custom', 'Kompleksitas tinggi butuh perencanaan MOQ yang lebih disiplin'],
    ],
  },
  decisionBox: {
    eyebrow: 'Decision Box',
    title: 'Cara membaca keputusan MOQ secara praktis',
    description: 'MOQ aman bukan hanya soal efisiensi pabrik. Ia harus tetap masuk akal untuk cashflow, kecepatan jual, dan kemampuan Anda membaca data launch pertama.',
    items: [
      'Pilih MOQ kecil kalau demand awal belum terbukti, channel penjualan masih diuji, atau Anda ingin membaca respon pasar lebih dulu.',
      'Naikkan MOQ secara bertahap kalau produk sudah punya sinyal repeat order dan Anda ingin menekan biaya per unit tanpa membebani stok.',
      'Jangan menyalin MOQ brand lain. Volume yang terlihat efisien di luar bisa menjadi beban kalau ritme penjualan brand Anda berbeda.',
    ],
  },
  checklist: {
    eyebrow: 'Checklist',
    title: 'Checklist sebelum menentukan MOQ awal',
    description: 'Checklist ini membantu membedakan keputusan berbasis data dengan keputusan yang hanya didorong rasa takut terlalu mahal atau terlalu kecil.',
    items: [
      'Apakah sudah ada bukti interest awal, misalnya waiting list, komunitas aktif, atau sinyal kuat dari audiens?',
      'Apakah budget inventory awal masih aman jika produk bergerak lebih lambat dari perkiraan?',
      'Apakah channel penjualan utama sudah dipilih dan dipahami ritme stoknya?',
      'Apakah ada rencana repeat order yang realistis jika produk mulai bergerak cepat?',
      'Apakah volume awal sudah selaras dengan kemampuan membuat konten, edukasi, dan penjualan setelah launch?',
    ],
  },
  sections: [
    {
      title: 'Demand awal harus dibaca sebelum bicara efisiensi',
      body: [
        'Banyak brand memulai dari pertanyaan, "MOQ paling kecil berapa?" padahal pertanyaan yang lebih penting adalah, "Apakah ada permintaan yang cukup untuk menyerap stok pertama?" Demand tidak harus berarti ribuan orang. Bahkan sinyal kecil seperti komunitas yang aktif, pre-launch interest, atau data penjualan produk serupa sudah lebih berguna daripada menebak-nebak.',
        'Kalau demand masih lemah, MOQ kecil lebih aman karena fungsi batch pertama adalah belajar. Anda ingin tahu apakah pesan brand nyambung, harga jual diterima, dan repeat order mungkin terjadi. MOQ yang terlalu besar saat demand masih kabur justru mengubah validasi menjadi beban inventori.',
      ],
    },
    {
      title: 'Budget inventory dan risiko stok harus dibaca bersama',
      body: [
        'Budget inventory bukan hanya soal apakah Anda mampu membayar produksi awal, tetapi juga apakah Anda siap menahan stok tersebut sampai bergerak. Banyak keputusan MOQ terasa aman saat transfer pertama dilakukan, tetapi menjadi berat dua bulan setelah launch ketika stok masih duduk dan promosi harus terus berjalan.',
        'Itulah sebabnya risiko stok harus dilihat bersama budget. Kalau channel penjualan belum kuat dan konten belum siap menopang pergerakan barang, MOQ kecil sering lebih sehat walaupun biaya per unit belum paling efisien.',
      ],
    },
    {
      title: 'Channel penjualan mengubah kebutuhan MOQ',
      body: [
        'Produk yang dijual lewat komunitas sendiri, live commerce, reseller, atau klinik bisa membutuhkan pola stok yang sangat berbeda. Channel dengan ritme pembelian cepat mungkin membutuhkan stok lebih siap, sedangkan channel yang masih tahap edukasi bisa lebih cocok dengan batch konservatif.',
        'Kesalahan umum adalah menentukan MOQ dulu, baru memikirkan channel. Urutannya seharusnya dibalik: pahami channel, estimasi ritme penjualan, lalu tentukan volume awal yang paling aman untuk channel tersebut.',
      ],
    },
    {
      title: 'Kapan MOQ kecil lebih aman dan kapan MOQ lebih besar lebih efisien',
      body: [
        'MOQ kecil lebih aman ketika brand baru pertama kali launch, produk belum punya bukti repeat order, atau Anda ingin menjaga fleksibilitas budget untuk iklan, konten, dan iterasi positioning. Ini adalah pilihan disiplin, bukan pilihan takut.',
        'MOQ yang sedikit lebih besar baru terasa efisien ketika demand awal sudah lebih terlihat, channel penjualan sudah bergerak, dan Anda punya keyakinan bahwa stok awal akan berputar dalam ritme yang masuk akal. Efisiensi baru relevan kalau risiko bisa dikendalikan.',
      ],
      bullets: [
        'MOQ kecil cocok untuk validasi awal, membaca feedback, dan menekan risiko stok mati.',
        'MOQ lebih besar cocok ketika pasar mulai terbaca dan brand ingin menurunkan tekanan biaya per unit.',
        'Keduanya sama-sama benar jika konteks demand, budget, dan channel penjualannya jelas.',
      ],
    },
  ],
  faq: [
    {
      question: 'Apakah MOQ selalu harus besar supaya efisien?',
      answer:
        'Tidak. Efisien per unit belum tentu efisien untuk bisnis jika stoknya terlalu berat bergerak. MOQ yang tepat adalah yang seimbang antara biaya, demand, dan cashflow.',
    },
    {
      question: 'Kapan MOQ kecil justru lebih sehat?',
      answer:
        'Saat demand awal belum terbukti, channel penjualan masih diuji, dan Anda butuh ruang untuk membaca respon pasar tanpa menahan stok berlebihan.',
    },
    {
      question: 'Apa indikator bahwa MOQ bisa dinaikkan?',
      answer:
        'Biasanya ada sinyal repeat order, ritme penjualan mulai stabil, dan kapasitas promosi sudah cukup untuk mendorong perputaran stok lebih cepat.',
    },
    {
      question: 'Apakah channel penjualan benar-benar memengaruhi MOQ?',
      answer:
        'Ya. Marketplace, reseller, komunitas, dan klinik punya kebutuhan stok serta ritme penjualan yang berbeda, sehingga volume awalnya tidak bisa dipukul rata.',
    },
    {
      question: 'Kalau saya masih bingung menyeimbangkan MOQ dan budget, harus ke mana?',
      answer:
        'Lanjut ke /moq-maklon-kosmetik untuk validasi minimum order yang lebih conversion-focused, lalu gunakan lead form atau WhatsApp untuk diskusi lebih konkret.',
    },
  ],
  heroCtas: [
    {
      label: 'Cek MOQ yang Aman untuk Produkmu',
      href: '/thankyou/google/?source=pilot-article-moq',
      tone: 'primary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin cek MOQ yang aman untuk produk kosmetik saya.',
    },
    {
      label: 'Kirim Brief Produk',
      href: '/thankyou/google/?source=pilot-article-moq',
      tone: 'secondary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin kirim brief produk untuk dibantu menentukan MOQ yang lebih aman.',
    },
  ],
  contextualCta: {
    eyebrow: 'Contextual CTA',
    title: 'Sudah punya gambaran demand dan channel penjualan?',
    description:
      'Kalau indikator awalnya sudah ada, gunakan CTA berikut untuk memvalidasi MOQ yang lebih aman dan tidak membebani cashflow launch pertama.',
    primaryLabel: 'Cek MOQ yang Aman untuk Produkmu',
    primaryMessage: 'Halo Dreamlab, saya ingin cek MOQ yang aman untuk produk kosmetik saya.',
    secondaryLabel: 'Kirim Brief Produk',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk untuk dibantu menentukan MOQ yang lebih aman.',
  },
  finalCta: {
    eyebrow: 'Final CTA',
    title: 'Lanjutkan ke keputusan MOQ yang lebih konkret',
    description:
      'Gunakan langkah berikut kalau Anda sudah siap memvalidasi volume awal, risiko stok, dan kemungkinan repeat order untuk produk pertama.',
    primaryLabel: 'Cek MOQ yang Aman untuk Produkmu',
    primaryMessage: 'Halo Dreamlab, saya ingin cek MOQ yang aman untuk produk kosmetik saya.',
    secondaryLabel: 'Kirim Brief Produk',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk untuk dibantu menentukan MOQ yang lebih aman.',
  },
  stickyCta: {
    primaryLabel: 'Cek MOQ yang Aman untuk Produkmu',
    primaryMessage: 'Halo Dreamlab, saya ingin cek MOQ yang aman untuk produk kosmetik saya.',
    secondaryLabel: 'Kirim Brief Produk',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk untuk dibantu menentukan MOQ yang lebih aman.',
  },
  relatedSection: {
    eyebrow: 'Related Money Page',
    title: 'Lanjutkan ke halaman MOQ dan estimasi yang lebih conversion-focused',
    description: 'Gunakan dua halaman di bawah ini saat Anda sudah siap menghubungkan keputusan MOQ dengan kebutuhan budget dan konsultasi.',
  },
  relatedLinks: [
    {
      label: '/moq-maklon-kosmetik',
      href: '/moq-maklon-kosmetik',
      description: 'Masuk ke halaman validasi MOQ jika Anda ingin membawa framework ini ke diskusi volume yang lebih konkret.',
      intent: 'primary',
    },
    {
      label: '/biaya-maklon-skincare',
      href: '/biaya-maklon-skincare',
      description: 'Gunakan halaman ini jika Anda juga ingin menghubungkan keputusan MOQ dengan estimasi budget produk.',
      intent: 'secondary',
    },
  ],
  leadForm: {
    title: 'Kirim Brief Produk',
    description: 'Tulis target produk, channel penjualan, dan perkiraan demand agar MOQ bisa disarankan lebih aman.',
    submitLabel: 'Kirim Brief Produk',
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
  publishedAt: '2026-07-06T00:00:00+07:00',
  updatedAt: '2026-07-07T00:00:00+07:00',
  lastUpdated: '7 Juli 2026',
  readingTime: '8 menit baca',
  heroHeadline: 'Cek estimasi biaya maklon skincare dengan scope yang lebih realistis',
  subheadline:
    'Halaman ini dibuat untuk intent conversion: membantu Anda menyaring faktor estimasi, menyiapkan brief, dan mempercepat konsultasi biaya dengan tim Dreamlab.',
  quickAnswers: [
    'Gunakan halaman ini jika Anda sudah butuh arah estimasi biaya, bukan sekadar memahami daftar komponennya.',
    'Estimasi biaya baru akurat kalau formula, MOQ, kemasan, dan target positioning sudah cukup jelas.',
    'Kalau scope produk masih kabur, mulai dari artikel /panduan/komponen-biaya-maklon-skincare agar diskusi estimasi tidak melebar.',
    'Kalau yang belum jelas justru volume awalnya, lanjutkan juga ke /moq-maklon-kosmetik.',
  ],
  table: {
    eyebrow: 'Faktor Estimasi',
    title: 'Faktor yang paling cepat menggeser estimasi biaya',
    headers: ['Faktor', 'Apa yang dinilai', 'Dampak ke estimasi'],
    rows: [
      ['Jenis produk', 'Serum, toner, cream, sunscreen, atau kategori lain', 'Setiap kategori punya kebutuhan formula dan validasi berbeda'],
      ['Target formula', 'Klaim utama, bahan aktif, tekstur, dan sensori', 'Semakin kompleks target hasil, semakin besar effort pengembangan'],
      ['MOQ awal', 'Volume batch pertama yang ingin diproduksi', 'MOQ mengubah efisiensi bahan, setup produksi, dan biaya per unit'],
      ['Kemasan', 'Standar, semi-custom, atau premium custom', 'Kemasan sering menjadi pembeda besar antara skenario sederhana dan premium'],
      ['Kebutuhan legalitas', 'Dokumen dan kesiapan produk untuk dijual', 'Mempengaruhi langkah administrasi dan kesiapan launch'],
      ['Timeline launch', 'Seberapa cepat produk ingin masuk pasar', 'Timeline ketat sering menuntut prioritas keputusan yang lebih disiplin'],
    ],
  },
  decisionBox: {
    eyebrow: 'Decision Box',
    title: 'Cara membaca estimasi biaya dengan benar',
    description: 'Tujuan halaman ini bukan menjanjikan angka instan, tetapi membantu Anda menyiapkan scope agar angka yang dibahas benar-benar relevan.',
    items: [
      'Kalau target Anda adalah launch cepat, pilih scope yang lebih fokus agar estimasi lebih mudah dikendalikan.',
      'Kalau target Anda premium, siapkan ekspektasi bahwa formula, kemasan, dan quality gate akan meminta ruang budget lebih besar.',
      'Semakin jelas brief Anda, semakin kecil kemungkinan estimasi berubah liar saat diskusi berlanjut.',
    ],
  },
  checklist: {
    eyebrow: 'Checklist',
    title: 'Data yang sebaiknya Anda siapkan sebelum minta estimasi',
    description: 'Checklist ini mempercepat proses konsultasi karena tim tidak perlu menebak-nebak scope dasar produk Anda.',
    items: [
      'Kategori produk dan manfaat utama sudah ditentukan.',
      'Target market atau positioning brand sudah ada gambaran.',
      'MOQ awal sudah punya range kasar, konservatif atau agresif.',
      'Preferensi kemasan sudah disebutkan, minimal standar atau premium.',
      'Timeline launch dan tujuan awal produksi sudah jelas.',
    ],
  },
  sections: [
    {
      title: 'Estimasi biaya selalu mengikuti scope produk',
      body: [
        'Dua brand bisa sama-sama membuat serum, tetapi arah biayanya berbeda karena target hasil, kemasan, dan strategi launch-nya berbeda. Karena itu, pertanyaan "berapa biaya maklon skincare?" baru bisa dijawab dengan benar setelah scope utamanya dibuka.',
        'Halaman ini sengaja berorientasi conversion. Tujuannya adalah membantu Anda datang ke konsultasi dengan brief yang lebih rapi, sehingga tim bisa langsung memisahkan komponen wajib, komponen opsional, dan area yang paling sensitif terhadap budget.',
      ],
    },
    {
      title: 'Alur konsultasi yang paling efisien',
      body: [
        'Langkah pertama adalah menjelaskan produk yang ingin dibuat: jenis produk, hasil yang diharapkan, target market, dan kebutuhan kemasan. Langkah kedua adalah menyusun prioritas, mana yang harus aman sekarang dan mana yang masih bisa ditunda. Langkah ketiga adalah menghubungkan scope tadi ke estimasi budget dan rencana produksi awal.',
        'Dengan alur seperti ini, diskusi estimasi tidak berhenti di angka kasar, tetapi langsung menghasilkan keputusan yang bisa dipakai untuk launch.',
      ],
      bullets: [
        'Mulai dari brief produk dan positioning yang paling penting.',
        'Sinkronkan scope dengan target MOQ dan timeline launch.',
        'Gunakan hasil konsultasi untuk menilai apakah skenario awal perlu disederhanakan atau justru dinaikkan.',
      ],
    },
    {
      title: 'Objeksi yang paling sering muncul sebelum konsultasi',
      body: [
        'Sebagian calon brand owner menunda konsultasi karena merasa brief-nya belum sempurna. Padahal justru konsultasi awal dibutuhkan untuk menyederhanakan brief yang masih berantakan. Yang dibutuhkan bukan data sempurna, melainkan arah yang cukup jelas untuk mulai menyaring faktor estimasi.',
        'Objeksi lain adalah takut estimasi terlalu tinggi. Itu biasanya terjadi ketika semua elemen premium dipikirkan sekaligus. Saat scope dipecah, sering kali ada banyak area yang bisa diurutkan ulang tanpa merusak kualitas inti produk.',
      ],
    },
  ],
  faq: [
    {
      question: 'Apakah halaman ini memberikan angka biaya pasti?',
      answer:
        'Tidak. Halaman ini membantu memvalidasi faktor estimasi dan menyiapkan brief agar angka yang dibahas nanti lebih realistis dan tidak menyesatkan.',
    },
    {
      question: 'Apakah saya harus tahu MOQ dulu sebelum minta estimasi?',
      answer:
        'Tidak harus, tetapi Anda sebaiknya punya range kasar. Jika belum punya, buka /moq-maklon-kosmetik agar volume awal dan budget bisa dibaca bersama.',
    },
    {
      question: 'Kalau budget saya masih ketat, apakah tetap layak konsultasi?',
      answer:
        'Ya. Konsultasi justru membantu memisahkan mana komponen yang wajib dijaga dan mana yang masih bisa dihemat pada batch awal.',
    },
    {
      question: 'Apa yang harus saya kirim agar estimasi lebih cepat dipahami?',
      answer:
        'Minimal jenis produk, target manfaat, range MOQ, preferensi kemasan, dan timeline launch. Dengan data itu tim bisa langsung mempersempit scope.',
    },
    {
      question: 'Apakah halaman ini menggantikan artikel panduan biaya?',
      answer:
        'Tidak. Artikel /panduan/komponen-biaya-maklon-skincare membantu Anda memahami struktur biaya, sedangkan halaman ini fokus pada estimasi dan langkah konsultasi.',
    },
  ],
  heroCtas: [
    {
      label: 'Cek Estimasi Biaya Produkmu',
      href: '/thankyou/google/?source=pilot-money-biaya',
      tone: 'primary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin cek estimasi biaya produk skincare saya.',
    },
    {
      label: 'Kirim Brief Produk',
      href: '/thankyou/google/?source=pilot-money-biaya',
      tone: 'secondary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin kirim brief produk untuk validasi estimasi biaya.',
    },
  ],
  contextualCta: {
    eyebrow: 'Contextual CTA',
    title: 'Siap mengubah scope menjadi estimasi yang lebih jelas?',
    description:
      'Gunakan CTA ini saat Anda sudah ingin membawa diskusi dari artikel panduan ke langkah konsultasi yang lebih langsung.',
    primaryLabel: 'Cek Estimasi Biaya Produkmu',
    primaryMessage: 'Halo Dreamlab, saya ingin cek estimasi biaya produk skincare saya.',
    secondaryLabel: 'Kirim Brief Produk',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk untuk validasi estimasi biaya.',
  },
  finalCta: {
    eyebrow: 'Final CTA',
    title: 'Minta validasi estimasi sebelum scope makin melebar',
    description:
      'Kalau brief dasar sudah siap, langkah terbaik berikutnya adalah meminta validasi estimasi dan prioritas biaya langsung ke tim Dreamlab.',
    primaryLabel: 'Cek Estimasi Biaya Produkmu',
    primaryMessage: 'Halo Dreamlab, saya ingin cek estimasi biaya produk skincare saya.',
    secondaryLabel: 'Kirim Brief Produk',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk untuk validasi estimasi biaya.',
  },
  stickyCta: {
    primaryLabel: 'Cek Estimasi Biaya Produkmu',
    primaryMessage: 'Halo Dreamlab, saya ingin cek estimasi biaya produk skincare saya.',
    secondaryLabel: 'Kirim Brief Produk',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk untuk validasi estimasi biaya.',
  },
  relatedSection: {
    eyebrow: 'Related Article',
    title: 'Butuh konteks sebelum final minta estimasi?',
    description: 'Dua halaman berikut membantu Anda memahami struktur biaya dan keputusan MOQ sebelum masuk lebih jauh ke pembahasan angka.',
  },
  relatedLinks: [
    {
      label: '/panduan/komponen-biaya-maklon-skincare',
      href: '/panduan/komponen-biaya-maklon-skincare',
      description: 'Pelajari dulu komponen biaya yang wajib dijaga, yang masih bisa dihemat, dan kesalahan budget yang sering terjadi.',
      intent: 'primary',
    },
    {
      label: '/moq-maklon-kosmetik',
      href: '/moq-maklon-kosmetik',
      description: 'Validasi MOQ agar estimasi biaya dan kemampuan menahan stok tetap sinkron.',
      intent: 'secondary',
    },
  ],
  leadForm: {
    title: 'Kirim Brief Produk',
    description: 'Isi brief singkat agar tim bisa bantu memvalidasi estimasi biaya dan prioritas scope produkmu.',
    submitLabel: 'Kirim Brief Produk',
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
  publishedAt: '2026-07-06T00:00:00+07:00',
  updatedAt: '2026-07-07T00:00:00+07:00',
  lastUpdated: '7 Juli 2026',
  readingTime: '8 menit baca',
  heroHeadline: 'Validasi MOQ produkmu sebelum volume awal menjadi beban stok',
  subheadline:
    'Halaman ini fokus membantu Anda menilai MOQ yang aman berdasarkan demand, budget inventory, channel penjualan, risiko stok, dan kemungkinan repeat order.',
  quickAnswers: [
    'MOQ yang tepat bukan yang paling kecil atau paling besar, tetapi yang paling masuk akal untuk demand awal dan cashflow Anda.',
    'Jika demand masih belum terbukti, MOQ kecil sering lebih aman walaupun biaya per unit belum optimal.',
    'Jika channel penjualan dan repeat order sudah lebih jelas, MOQ sedikit lebih besar bisa memberi efisiensi yang lebih baik.',
    'Kalau Anda juga ingin menghubungkan keputusan MOQ dengan estimasi budget, lanjut ke /biaya-maklon-skincare.',
  ],
  table: {
    eyebrow: 'Framework MOQ',
    title: 'Faktor utama saat memvalidasi minimum order',
    headers: ['Faktor', 'Apa yang dinilai', 'Efek terhadap keputusan MOQ'],
    rows: [
      ['Demand awal', 'Kekuatan minat pasar, pre-order, atau audiens yang siap membeli', 'Demand lemah cenderung mendorong volume awal yang lebih konservatif'],
      ['Budget inventory', 'Dana yang siap ditahan di stok pertama', 'Budget ketat membuat MOQ kecil lebih aman untuk menjaga ruang napas cashflow'],
      ['Channel penjualan', 'Marketplace, reseller, komunitas, retail, atau klinik', 'Channel berbeda membutuhkan ritme stok yang berbeda'],
      ['Risiko stok', 'Kemungkinan barang bergerak lambat atau perlu diskon berat', 'Risiko tinggi berarti MOQ harus lebih disiplin'],
      ['Repeat order', 'Kecepatan produk bisa diisi ulang jika performa bagus', 'Repeat order cepat memberi fleksibilitas untuk mulai dari batch kecil'],
      ['Kompleksitas produk', 'Sederhana, treatment, atau premium custom', 'Produk lebih kompleks biasanya membutuhkan keputusan MOQ yang lebih hati-hati'],
    ],
  },
  decisionBox: {
    eyebrow: 'Decision Box',
    title: 'Cara memilih MOQ yang aman tanpa kehilangan efisiensi',
    description: 'Keputusan MOQ yang sehat harus menjaga tiga hal sekaligus: biaya per unit, kemampuan menjual, dan kemampuan menahan stok.',
    items: [
      'Pilih MOQ konservatif jika launch masih tahap membaca demand, konten penjualan belum kuat, atau channel utama masih diuji.',
      'Pilih MOQ sedikit lebih besar jika Anda sudah punya sinyal repeat order dan penjualan awal tidak sepenuhnya bergantung pada tebakan.',
      'Kalau ragu, lebih baik validasi dulu daripada memaksakan volume besar hanya karena terdengar lebih hemat per unit.',
    ],
  },
  checklist: {
    eyebrow: 'Checklist',
    title: 'Data yang perlu disiapkan sebelum validasi MOQ',
    description: 'Dengan data berikut, tim bisa lebih cepat menilai apakah volume awal Anda terlalu agresif, terlalu kecil, atau sudah seimbang.',
    items: [
      'Sudah ada gambaran demand awal dan bukti minat pasar yang paling masuk akal.',
      'Budget inventory awal masih aman jika penjualan bergerak lebih lambat dari target.',
      'Channel penjualan utama sudah dipilih dan dipahami ritmenya.',
      'Target timeline launch dan kapasitas promosi awal sudah realistis.',
      'Sudah ada gambaran apakah produk ini akan punya repeat order cepat atau butuh edukasi lebih lama.',
    ],
  },
  sections: [
    {
      title: 'MOQ harus dibaca sebagai keputusan bisnis, bukan angka pabrik semata',
      body: [
        'MOQ memang berkaitan dengan efisiensi produksi, tetapi dampaknya paling terasa di sisi bisnis: seberapa banyak stok harus Anda tahan, seberapa besar ruang iklan masih tersisa, dan seberapa cepat brand bisa beradaptasi jika respon pasar tidak sesuai dugaan.',
        'Karena itu, halaman ini tidak hanya bicara minimum order. Ia bicara tentang bagaimana volume awal harus selaras dengan ritme penjualan dan keberanian Anda menahan inventory.',
      ],
    },
    {
      title: 'Alur validasi MOQ yang lebih efisien',
      body: [
        'Mulailah dari demand dan channel penjualan. Setelah itu lihat kemampuan budget inventory. Baru kemudian hitung apakah volume awal perlu konservatif atau bisa sedikit dinaikkan untuk mengejar efisiensi.',
        'Urutan ini penting karena banyak brand melakukan kebalikannya: mereka terpikat volume besar dulu, lalu baru sadar konten, distribusi, dan cashflow belum siap menopangnya.',
      ],
      bullets: [
        'Buka target produk dan target market terlebih dahulu.',
        'Jelaskan channel penjualan utama dan seberapa cepat repeat order mungkin terjadi.',
        'Gunakan hasil validasi untuk memutuskan volume awal, bukan sekadar menebak angka yang terasa aman.',
      ],
    },
    {
      title: 'Objeksi paling umum terhadap MOQ kecil dan MOQ besar',
      body: [
        'MOQ kecil sering dianggap kurang serius, padahal dalam banyak kasus itu justru keputusan paling disiplin untuk launch pertama. Sebaliknya, MOQ besar sering dianggap lebih profesional, padahal tanpa demand yang siap ia hanya memindahkan tekanan biaya ke gudang dan promosi.',
        'Yang perlu dicari bukan citra lebih besar, tetapi struktur yang membuat produk bisa bergerak, dibaca performanya, lalu diulang dengan lebih yakin.',
      ],
    },
  ],
  faq: [
    {
      question: 'Apakah MOQ kecil berarti bisnis saya tidak serius?',
      answer:
        'Tidak. MOQ kecil bisa menjadi strategi paling sehat ketika Anda sedang memvalidasi pasar, menjaga cashflow, dan ingin membaca performa produk secara disiplin.',
    },
    {
      question: 'Kapan MOQ lebih besar mulai masuk akal?',
      answer:
        'Saat demand awal mulai terbukti, channel penjualan sudah berjalan, dan Anda punya keyakinan bahwa stok akan berputar dalam ritme yang sehat.',
    },
    {
      question: 'Apakah saya wajib tahu angka demand yang presisi?',
      answer:
        'Tidak harus presisi sempurna, tetapi Anda perlu sinyal yang cukup: komunitas, pre-order, pengalaman jual kategori serupa, atau bukti minat lain yang bisa dipertanggungjawabkan.',
    },
    {
      question: 'Bagaimana jika saya bingung antara mengejar efisiensi dan takut stok menumpuk?',
      answer:
        'Itulah fungsi validasi MOQ. Tim akan membantu menilai titik tengah antara volume aman dan efisiensi yang masih rasional untuk launch pertama.',
    },
    {
      question: 'Apakah halaman ini menggantikan artikel panduan MOQ?',
      answer:
        'Tidak. Artikel /panduan/cara-menentukan-moq-produk-kosmetik membantu Anda memahami framework, sedangkan halaman ini fokus pada validasi minimum order yang lebih siap untuk konsultasi.',
    },
  ],
  heroCtas: [
    {
      label: 'Validasi MOQ Produkmu',
      href: '/thankyou/google/?source=pilot-money-moq',
      tone: 'primary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin validasi MOQ untuk produk kosmetik saya.',
    },
    {
      label: 'Kirim Brief Produk',
      href: '/thankyou/google/?source=pilot-money-moq',
      tone: 'secondary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin kirim brief produk untuk validasi MOQ.',
    },
  ],
  contextualCta: {
    eyebrow: 'Contextual CTA',
    title: 'Sudah punya gambaran demand dan budget inventory?',
    description:
      'Gunakan langkah berikut untuk memvalidasi minimum order yang tidak terlalu agresif tetapi juga tidak membuat biaya per unit kehilangan arah.',
    primaryLabel: 'Validasi MOQ Produkmu',
    primaryMessage: 'Halo Dreamlab, saya ingin validasi MOQ untuk produk kosmetik saya.',
    secondaryLabel: 'Kirim Brief Produk',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk untuk validasi MOQ.',
  },
  finalCta: {
    eyebrow: 'Final CTA',
    title: 'Pastikan volume awal masih sehat untuk dijual',
    description:
      'Kalau demand awal, channel penjualan, dan budget inventory sudah punya gambaran, sekarang saatnya memvalidasi MOQ yang paling aman untuk launch.',
    primaryLabel: 'Validasi MOQ Produkmu',
    primaryMessage: 'Halo Dreamlab, saya ingin validasi MOQ untuk produk kosmetik saya.',
    secondaryLabel: 'Kirim Brief Produk',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk untuk validasi MOQ.',
  },
  stickyCta: {
    primaryLabel: 'Validasi MOQ Produkmu',
    primaryMessage: 'Halo Dreamlab, saya ingin validasi MOQ untuk produk kosmetik saya.',
    secondaryLabel: 'Kirim Brief Produk',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk untuk validasi MOQ.',
  },
  relatedSection: {
    eyebrow: 'Related Article',
    title: 'Butuh konteks sebelum final menentukan MOQ?',
    description: 'Buka panduan pendukung berikut jika Anda masih perlu membaca struktur biaya dan framework MOQ lebih detail.',
  },
  relatedLinks: [
    {
      label: '/panduan/cara-menentukan-moq-produk-kosmetik',
      href: '/panduan/cara-menentukan-moq-produk-kosmetik',
      description: 'Baca framework lengkap untuk memahami demand, budget inventory, risiko stok, dan repeat order sebelum mengunci MOQ.',
      intent: 'primary',
    },
    {
      label: '/biaya-maklon-skincare',
      href: '/biaya-maklon-skincare',
      description: 'Hubungkan keputusan MOQ dengan estimasi biaya agar volume dan budget tetap sejalan.',
      intent: 'secondary',
    },
  ],
  leadForm: {
    title: 'Kirim Brief Produk',
    description: 'Kirim gambaran produk, demand awal, dan channel penjualan agar tim bisa bantu validasi MOQ yang lebih aman.',
    submitLabel: 'Kirim Brief Produk',
  },
};

export const pabrikKosmetikMoneyPage: PilotPageData = {
  slug: '/pabrik-kosmetik',
  title: 'Pabrik Kosmetik | Maklon & Produksi Kosmetik BPOM Dreamlab',
  metaTitle: 'Pabrik Kosmetik | Maklon & Produksi Kosmetik BPOM Terbaik',
  metaDescription:
    'Pabrik kosmetik dengan standar CPKB Grade A, Halal MUI, dan BPOM. Jasa maklon kosmetik untuk skincare, parfum, body care, dan private label. Konsultasi gratis.',
  canonical: 'https://dreamlab.id/pabrik-kosmetik/',
  pageType: 'money_page',
  seoCluster: 'pabrik_kosmetik',
  keywordTarget: 'pabrik kosmetik',
  publishedAt: '2026-07-13T00:00:00+07:00',
  updatedAt: '2026-07-13T00:00:00+07:00',
  lastUpdated: '13 Juli 2026',
  readingTime: '7 menit baca',
  heroHeadline: 'Pabrik Kosmetik dengan Standar CPKB Grade A & BPOM',
  subheadline:
    'Dreamlab adalah pabrik kosmetik terpercaya dengan fasilitas produksi modern, sertifikasi resmi, dan layanan maklon dari formulasi hingga legalitas. Siap membantu brand Anda dari skala kecil hingga besar.',
  quickAnswers: [
    'Dreamlab adalah pabrik kosmetik bersertifikat CPKB Grade A, Halal MUI, dan BPOM di Surabaya.',
    'Melayani maklon skincare, body care, hair care, parfum, baby care, decorative, foot care, dan PKRT.',
    '500+ brand sudah memproduksi produk kosmetik mereka bersama Dreamlab.',
    'Layanan lengkap: konsultasi, formulasi custom, produksi, kemasan, hingga pengurusan BPOM.',
  ],
  decisionBox: {
    eyebrow: 'Decision Box',
    title: 'Pabrik kosmetik yang tepat untuk tahap bisnis Anda',
    description: 'Setiap brand punya kebutuhan skala dan spesifikasi berbeda. Pastikan pabrik kosmetik yang Anda pilih sesuai dengan tahap bisnis Anda saat ini.',
    items: [
      'Brand pemula: cari pabrik dengan MOQ fleksibel dan layanan BPOM lengkap.',
      'Brand berkembang: pastikan kapasitas produksi bisa scale up tanpa turun kualitas.',
      'Brand premium: butuh R&D custom, formula eksklusif, dan kemasan premium.',
    ],
  },
  sections: [
    {
      title: 'Mengapa memilih pabrik kosmetik bersertifikasi resmi',
      body: [
        'Memilih pabrik kosmetik bukan hanya soal harga per unit. Sertifikasi seperti CPKB Grade A, Halal MUI, dan BPOM adalah jaminan bahwa produk Anda diproduksi dengan standar yang diakui secara nasional. Produk kosmetik tanpa sertifikasi resmi tidak bisa mendapatkan nomor notifikasi BPOM, sehingga tidak bisa dijual di pasar Indonesia secara legal.',
        'Dreamlab sebagai pabrik kosmetik telah memiliki semua sertifikasi yang diperlukan. Setiap batch produksi melalui quality control ketat untuk memastikan konsistensi kualitas, keamanan, dan kehalalan produk Anda.',
      ],
    },
    {
      title: 'Layanan maklon dari hulu ke hilir',
      body: [
        'Sebagai pabrik kosmetik terpercaya, Dreamlab menyediakan layanan lengkap mulai dari konsultasi awal, formulasi custom oleh tim R&D berpengalaman, produksi di fasilitas CPKB Grade A, pemilihan kemasan, hingga pengurusan izin BPOM dan Halal.',
        'Pendekatan one-stop solution ini memudahkan Anda karena tidak perlu berpindah-pindah vendor. Semua proses terintegrasi dalam satu atap dengan quality control yang konsisten di setiap tahap.',
      ],
      bullets: [
        'Konsultasi produk dan target market bersama tim Business Development.',
        'Formulasi custom oleh tim R&D dengan bahan aktif berkualitas.',
        'Produksi di pabrik kosmetik bersertifikat CPKB Grade A.',
        'Bantuan pengurusan BPOM dan sertifikasi Halal.',
        'Kemasan custom dengan berbagai pilihan material dan desain.',
      ],
    },
    {
      title: 'Kategori produk yang bisa diproduksi',
      body: [
        'Pabrik kosmetik Dreamlab mampu memproduksi berbagai kategori produk. Dari skincare seperti serum, toner, moisturizer, sunscreen, hingga body care, hair care, parfum, baby care, decorative, foot care, dan PKRT.',
        'Setiap kategori memiliki tim spesialis yang memahami formulasi, regulasi, dan tren pasar masing-masing. Ini memastikan produk Anda tidak hanya berkualitas, tetapi juga relevan dengan kebutuhan konsumen saat ini.',
      ],
    },
  ],
  faq: [
    {
      question: 'Apa perbedaan pabrik kosmetik dengan jasa maklon?',
      answer:
        'Pabrik kosmetik memiliki fasilitas produksi sendiri, sedangkan jasa maklon bisa berupa perantara. Dreamlab adalah pabrik kosmetik dengan fasilitas CPKB Grade A yang memproduksi langsung produk Anda.',
    },
    {
      question: 'Apakah pabrik kosmetik Dreamlab melayani produksi skala kecil?',
      answer:
        'Ya. Kami memiliki MOQ yang fleksibel untuk brand pemula, mulai dari ratusan pcs untuk beberapa kategori produk.',
    },
    {
      question: 'Berapa lama proses produksi di pabrik kosmetik Dreamlab?',
      answer:
        'Estimasi waktu produksi bervariasi tergantung jenis produk dan kompleksitas formulasi, umumnya 4-8 minggu dari formulasi hingga produk siap distribusi.',
    },
    {
      question: 'Apakah pabrik kosmetik Dreamlab membantu pengurusan BPOM?',
      answer:
        'Ya. Kami menyediakan pendampingan penuh untuk pengurusan notifikasi BPOM dan sertifikasi Halal sebagai bagian dari layanan pabrik kosmetik kami.',
    },
  ],
  heroCtas: [
    {
      label: 'Konsultasi Produk',
      href: '/thankyou/google/?source=pabrik-kosmetik-hero',
      tone: 'primary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin konsultasi produksi di pabrik kosmetik Anda.',
    },
    {
      label: 'Kirim Brief Produk',
      href: '/thankyou/google/?source=pabrik-kosmetik-hero',
      tone: 'secondary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin kirim brief produk untuk diproduksi di pabrik kosmetik Anda.',
    },
  ],
  contextualCta: {
    eyebrow: 'Mulai Produksi',
    title: 'Siap memulai produksi di pabrik kosmetik terpercaya?',
    description:
      'Tim Dreamlab siap membantu Anda dari formulasi hingga produk siap jual. Konsultasi gratis untuk memahami kebutuhan brand Anda.',
    primaryLabel: 'Konsultasi Gratis',
    primaryMessage: 'Halo Dreamlab, saya ingin konsultasi produksi di pabrik kosmetik Anda.',
    secondaryLabel: 'Kirim Brief',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk.',
  },
  finalCta: {
    eyebrow: 'Mulai Sekarang',
    title: 'Wujudkan brand kosmetik Anda bersama pabrik kosmetik terpercaya',
    description:
      'Dari formulasi hingga legalitas, semua tersedia dalam satu atap. Mulai konsultasi gratis dan lihat sendiri kualitas pabrik kosmetik Dreamlab.',
    primaryLabel: 'Konsultasi Gratis',
    primaryMessage: 'Halo Dreamlab, saya ingin konsultasi produksi di pabrik kosmetik Anda.',
    secondaryLabel: 'Kirim Brief Produk',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk.',
  },
  stickyCta: {
    primaryLabel: 'Konsultasi Gratis',
    primaryMessage: 'Halo Dreamlab, saya ingin konsultasi produksi di pabrik kosmetik Anda.',
    secondaryLabel: 'Kirim Brief',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk.',
  },
  relatedSection: {
    eyebrow: 'Layanan Terkait',
    title: 'Jelajahi layanan pabrik kosmetik lainnya',
    description: 'Lihat kategori produk dan layanan maklon yang tersedia di pabrik kosmetik Dreamlab.',
  },
  relatedLinks: [
    {
      label: 'Pabrik Parfum',
      href: '/pabrik-parfum',
      description: 'Pabrik parfum dengan layanan custom aroma dan produksi EDP, body mist, roll on.',
      intent: 'primary',
    },
    {
      label: 'Jasa Maklon Kosmetik',
      href: '/jasa-maklon-kosmetik',
      description: 'Layanan maklon kosmetik one-stop solution dari formulasi hingga BPOM.',
      intent: 'primary',
    },
    {
      label: 'Private Label Kosmetik',
      href: '/private-label-kosmetik',
      description: 'Solusi private label cepat untuk memiliki brand kosmetik sendiri.',
      intent: 'secondary',
    },
    {
      label: 'Estimasi Biaya Maklon',
      href: '/estimasi-biaya-maklon-kosmetik',
      description: 'Cek estimasi biaya produksi kosmetik sesuai budget brand Anda.',
      intent: 'secondary',
    },
  ],
  leadForm: {
    title: 'Mulai Produksi di Pabrik Kosmetik Dreamlab',
    description: 'Kirim brief produk Anda dan tim kami akan menghubungi dengan penawaran yang sesuai.',
    submitLabel: 'Kirim Brief Produk',
  },
};
