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
  publishedAt: '2026-07-06T00:00:00+07:00',
  updatedAt: '2026-07-07T00:00:00+07:00',
  lastUpdated: '7 Juli 2026',
  readingTime: '11 menit baca',
  heroHeadline: 'Komponen biaya maklon skincare yang perlu dihitung sebelum produksi',
  subheadline:
    'Halaman ini membantu brand pemula memisahkan komponen biaya yang wajib diamankan, yang masih bisa dihemat, dan checklist sebelum minta estimasi resmi.',
  quickAnswers: [
    'Biaya maklon skincare bukan satu angka tunggal. Budget dibentuk oleh formula, sample, MOQ, kemasan, desain, legalitas, dan quality control.',
    'Artikel ini tidak memberi angka harga final karena tanpa brief resmi hasilnya mudah menyesatkan. Fokus halaman ini adalah struktur biaya dan keputusan yang lebih aman.',
    'Kalau Anda sudah ingin validasi estimasi berdasarkan brief produk, lanjut ke /biaya-maklon-skincare.',
    'Kalau MOQ belum jelas, cek juga /moq-maklon-kosmetik agar volume awal dan budget tidak saling bertabrakan.',
  ],
  table: {
    eyebrow: 'Tabel Utama',
    title: 'Komponen biaya yang paling sering menentukan arah budget',
    headers: ['Komponen', 'Fungsi', 'Kenapa Berpengaruh'],
    rows: [
      ['Formula / R&D', 'Menyusun karakter produk, tekstur, dan klaim utama', 'Semakin spesifik target hasil dan bahan aktif, semakin besar effort pengembangan'],
      ['Sample / Prototype', 'Tahap validasi sebelum produksi massal', 'Revisi sample memengaruhi waktu, approval, dan kesiapan launch'],
      ['MOQ / Kuantitas awal', 'Menentukan skala produksi pertama', 'MOQ kecil menjaga risiko stok, tetapi biaya per unit sering lebih tinggi'],
      ['Kemasan', 'Wadah utama dan tampilan visual produk', 'Kemasan custom biasanya menambah kompleksitas sourcing dan finishing'],
      ['Desain label / box', 'Identitas brand sekaligus area compliance', 'Perubahan layout dan revisi file cetak sering menambah waktu dan biaya'],
      ['Legalitas / notifikasi', 'Membuat produk siap jual secara lebih aman', 'Dokumen dan proses administrasi harus disiapkan sejak awal'],
      ['QC / stabilitas', 'Menjaga konsistensi batch dan mutu produk', 'Menambah waktu validasi tetapi penting untuk menekan risiko kualitas'],
    ],
  },
  decisionBox: {
    eyebrow: 'Decision Box',
    title: 'Prioritas keputusan untuk brand pemula',
    description: 'Gunakan urutan ini saat budget masih ketat agar biaya tidak habis di area yang belum memberi dampak besar ke keberhasilan launch.',
    items: [
      'Amankan komponen wajib lebih dulu: formula yang layak, sample yang lolos approval, kemasan dasar yang rapi, dan legalitas.',
      'Tahan keinginan custom berlebihan kalau positioning brand dan harga jual masih belum benar-benar terkunci.',
      'Kalau brief masih kabur, validasi scope dulu sebelum minta angka. Estimasi tanpa scope hanya membuat ekspektasi salah.',
    ],
  },
  checklist: {
    eyebrow: 'Checklist',
    title: 'Checklist sebelum minta estimasi biaya',
    description: 'Semakin lengkap jawaban Anda untuk poin berikut, semakin cepat tim bisa memberi arah budget yang realistis.',
    items: [
      'Jenis produk sudah jelas, misalnya serum, toner, day cream, atau sunscreen.',
      'Target market dan positioning sudah ada, misalnya mass premium, klinik, atau first launch brand baru.',
      'Gambaran formula atau hasil akhir sudah ditentukan, termasuk tekstur dan manfaat utama.',
      'Range MOQ awal sudah dipikirkan, minimal konservatif versus target optimistis.',
      'Preferensi kemasan sudah ada, apakah standar, semi-custom, atau premium custom.',
      'Prioritas launch sudah jelas: cepat masuk pasar atau menunggu hasil lebih premium.',
    ],
  },
  sections: [
    {
      title: 'Kenapa biaya maklon tidak bisa dipukul rata',
      body: [
        'Serum brightening, facial wash, body lotion, dan sunscreen tidak pernah berjalan dengan struktur biaya yang identik. Formula, material kemasan, cara penggunaan, dan beban validasinya berbeda. Karena itu, dua produk dengan ukuran mirip pun bisa punya arah budget yang jauh berbeda.',
        'Masalah paling sering muncul ketika brand meminta satu angka patokan tanpa menjelaskan scope. Padahal biaya selalu mengikuti brief. Artikel ini sengaja memecah faktor biaya agar Anda bisa melihat komponen mana yang benar-benar menggerakkan budget dan mana yang sekadar mempercantik tampilan.',
      ],
    },
    {
      title: 'Komponen yang masih boleh dihemat',
      body: [
        'Pada fase awal, penghematan paling sehat biasanya dilakukan pada area yang tidak merusak performa inti produk. Bukan berarti memilih kualitas rendah, tetapi menunda elemen yang belum wajib untuk validasi pasar pertama.',
      ],
      bullets: [
        'Kemasan custom yang terlalu kompleks biasanya bisa diganti dulu dengan opsi standar yang tetap rapi dan layak jual.',
        'Varian terlalu banyak sebaiknya ditahan. Satu hero SKU yang tepat lebih berguna daripada tiga SKU yang belum teruji.',
        'Finishing sekunder seperti box premium tebal atau aksen dekoratif bisa ditunda sampai positioning dan repeat order mulai terbukti.',
      ],
    },
    {
      title: 'Komponen yang tidak boleh dipotong sembarangan',
      body: [
        'Ada area yang terlihat mahal di depan, tetapi justru berfungsi sebagai pagar risiko. Jika komponen ini dipangkas terlalu agresif, biaya koreksinya setelah launch bisa lebih besar.',
      ],
      bullets: [
        'Formula dan sample approval tidak boleh dipercepat tanpa validasi yang cukup, karena ini menentukan pengalaman produk sebenarnya.',
        'Legalitas, informasi label, dan area compliance tidak boleh dianggap formalitas semata.',
        'QC dasar dan kestabilan produk tetap penting agar batch awal tidak memukul reputasi brand sendiri.',
      ],
    },
    {
      title: 'Kesalahan budget yang paling sering dilakukan brand pemula',
      body: [
        'Brand pemula sering mengunci pikiran pada harga per unit, lalu lupa bahwa biaya launch juga dipengaruhi oleh revisi, aset visual, dan ketidaksiapan brief. Akibatnya, angka di kepala tampak aman tetapi realisasi produksi terasa jauh lebih berat.',
      ],
      bullets: [
        'Memilih kemasan premium sebelum tahu harga jual final yang masuk akal.',
        'Minta terlalu banyak benefit formula di batch pertama tanpa mempertimbangkan kompleksitas R&D.',
        'Menganggap MOQ paling kecil pasti paling aman, padahal biaya per unit bisa terlalu menekan margin.',
        'Tidak menyiapkan keputusan prioritas: mana yang wajib sekarang, mana yang bisa menunggu batch berikutnya.',
      ],
    },
    {
      title: 'Contoh skenario produk sederhana vs premium',
      body: [
        'Produk sederhana biasanya berangkat dari formula yang lebih fokus, kemasan standar yang rapi, dan target launch yang cepat. Tujuannya bukan tampil biasa saja, tetapi menguji pasar dengan struktur biaya yang masih terkendali.',
        'Produk premium cenderung membutuhkan alignment yang lebih ketat antara formula, sensori, kemasan, dan persepsi harga jual. Brief seperti ini wajar membutuhkan effort pengembangan lebih besar. Karena belum ada data resmi harga yang dikunci di halaman ini, contoh skenario disajikan dalam bentuk arah keputusan, bukan angka nominal.',
      ],
      bullets: [
        'Skenario sederhana: satu hero serum, kemasan standar yang bersih, fokus pada klaim utama yang mudah dipahami pasar.',
        'Skenario premium: formula lebih detail, kemasan lebih kuat secara persepsi, dan quality gate lebih ketat agar pengalaman produk konsisten.',
        'Pilihan terbaik bergantung pada target market, channel penjualan, dan seberapa cepat Anda ingin membaca sinyal pasar pertama.',
      ],
    },
    {
      title: 'Kapan sebaiknya pindah dari artikel ke money page',
      body: [
        'Begitu Anda sudah bisa menyebutkan jenis produk, target positioning, range MOQ, dan preferensi kemasan, artikel ini sudah menyelesaikan tugasnya. Titik itu adalah saat yang tepat untuk pindah ke halaman estimasi.',
        'Gunakan /biaya-maklon-skincare saat Anda ingin tim membantu mengerucutkan angka, prioritas biaya, dan langkah konsultasi berikutnya. Gunakan /moq-maklon-kosmetik bila masalah utama justru ada di volume awal dan risiko stok.',
      ],
    },
  ],
  faq: [
    {
      question: 'Apakah artikel ini memberikan angka biaya maklon skincare?',
      answer:
        'Tidak. Halaman ini fokus pada struktur biaya dan prioritas keputusan. Angka final baru masuk akal jika brief produk, target kemasan, dan MOQ sudah lebih jelas.',
    },
    {
      question: 'Komponen mana yang paling sering membuat budget membengkak?',
      answer:
        'Biasanya formula yang terlalu kompleks, kemasan custom yang terlalu cepat dipilih, dan MOQ yang tidak selaras dengan kemampuan cashflow awal.',
    },
    {
      question: 'Apa yang masih bisa dihemat tanpa merusak kualitas inti?',
      answer:
        'Umumnya kemasan custom, jumlah varian awal, dan finishing sekunder. Area inti seperti formula, sample approval, legalitas, dan QC dasar sebaiknya tidak dipotong sembarangan.',
    },
    {
      question: 'Kapan saya perlu pindah ke halaman estimasi biaya?',
      answer:
        'Saat scope produk sudah mulai jelas dan Anda ingin memvalidasi arah budget, bukan lagi sekadar memahami komponennya.',
    },
    {
      question: 'Kalau saya belum tahu MOQ aman, harus mulai dari mana?',
      answer:
        'Mulai dari artikel ini untuk memahami struktur biaya, lalu lanjut ke /moq-maklon-kosmetik agar volume awal dan risiko stok bisa diseimbangkan.',
    },
  ],
  heroCtas: [
    {
      label: 'Cek Komponen Biaya Produkmu',
      href: '/thankyou/google/?source=pilot-article-biaya',
      tone: 'primary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin cek komponen biaya untuk produk skincare saya.',
    },
    {
      label: 'Kirim Brief Produk',
      href: '/thankyou/google/?source=pilot-article-biaya',
      tone: 'secondary',
      location: 'hero',
      message: 'Halo Dreamlab, saya ingin kirim brief produk untuk dibantu breakdown komponen biayanya.',
    },
  ],
  contextualCta: {
    eyebrow: 'Contextual CTA',
    title: 'Sudah tahu area biaya yang paling kritis?',
    description:
      'Kalau struktur biaya mulai terlihat, langkah berikutnya adalah memvalidasi komponen mana yang paling relevan untuk produk Anda dan brief seperti apa yang perlu disiapkan.',
    primaryLabel: 'Cek Komponen Biaya Produkmu',
    primaryMessage: 'Halo Dreamlab, saya ingin cek komponen biaya untuk produk skincare saya.',
    secondaryLabel: 'Kirim Brief Produk',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk untuk dibantu breakdown komponen biayanya.',
  },
  finalCta: {
    eyebrow: 'Final CTA',
    title: 'Lanjutkan ke validasi budget yang lebih konkret',
    description:
      'Gunakan CTA di bawah ini kalau Anda sudah siap mengubah gambaran biaya menjadi arah diskusi yang lebih spesifik dengan tim Dreamlab.',
    primaryLabel: 'Cek Komponen Biaya Produkmu',
    primaryMessage: 'Halo Dreamlab, saya ingin cek komponen biaya untuk produk skincare saya.',
    secondaryLabel: 'Kirim Brief Produk',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk untuk dibantu breakdown komponen biayanya.',
  },
  stickyCta: {
    primaryLabel: 'Cek Komponen Biaya Produkmu',
    primaryMessage: 'Halo Dreamlab, saya ingin cek komponen biaya untuk produk skincare saya.',
    secondaryLabel: 'Kirim Brief Produk',
    secondaryMessage: 'Halo Dreamlab, saya ingin kirim brief produk untuk dibantu breakdown komponen biayanya.',
  },
  relatedSection: {
    eyebrow: 'Related Money Page',
    title: 'Lanjutkan ke halaman conversion yang paling relevan',
    description: 'Gunakan money page berikut saat Anda sudah siap memvalidasi estimasi biaya atau volume produksi awal.',
  },
  relatedLinks: [
    {
      label: '/biaya-maklon-skincare',
      href: '/biaya-maklon-skincare',
      description: 'Masuk ke halaman estimasi biaya jika Anda sudah ingin mengerucutkan arah budget dan scope produk.',
      intent: 'primary',
    },
    {
      label: '/moq-maklon-kosmetik',
      href: '/moq-maklon-kosmetik',
      description: 'Gunakan halaman ini jika masalah utamanya adalah volume awal, efisiensi, dan risiko stok.',
      intent: 'secondary',
    },
  ],
  leadForm: {
    title: 'Kirim Brief Produk',
    description: 'Isi kebutuhan produkmu agar tim bisa bantu memetakan komponen biaya yang paling relevan.',
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
