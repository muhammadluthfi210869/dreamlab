interface ArticleOverride {
  excerpt?: string;
  content: string;
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

function buildOutline(headings: string[]): string {
  const items = headings
    .map((heading) => `<li><a href="#${slugifyHeading(heading)}">${heading}</a></li>`)
    .join('');

  return [
    '<nav class="article-outline">',
    '<p class="article-outline-label">Ringkasan Isi</p>',
    `<ol>${items}</ol>`,
    '</nav>',
  ].join('');
}

function buildFigure(imageName: string, alt: string): string {
  return [
    '<figure class="article-figure">',
    `<a href="/thankyou/google/"><img src="/assets/images/blog/${imageName}" alt="${alt}" class="bv-tag-attr-replace bv-lazyload-tag-img" style="width:auto;height:auto" /></a>`,
    '</figure>',
  ].join('');
}

function buildCta(title: string, body: string): string {
  return [
    '<div class="article-cta">',
    `<h3>${title}</h3>`,
    `<p>${body}</p>`,
    '<a href="/thankyou/google/" class="cta-button">Konsultasi Gratis dengan Dreamlab</a>',
    '</div>',
  ].join('');
}

function buildFaq(items: Array<{ question: string; answer: string }>): string {
  return items
    .map(
      (item) => [
        '<details class="article-faq">',
        `<summary>${item.question}</summary>`,
        `<p>${item.answer}</p>`,
        '</details>',
      ].join('')
    )
    .join('');
}

function buildComparisonTable(headers: string[], rows: string[][]): string {
  const head = headers.map((header) => `<th>${header}</th>`).join('');
  const body = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
    .join('');

  return [
    '<div class="article-table-wrap">',
    '<table class="article-comparison-table">',
    `<thead><tr>${head}</tr></thead>`,
    `<tbody>${body}</tbody>`,
    '</table>',
    '</div>',
  ].join('');
}

const parfumHeadings = [
  'Komponen biaya yang wajib dihitung sejak awal',
  'Contoh struktur modal untuk batch MOQ kecil',
  'Kesalahan yang paling sering membuat margin tipis',
  'Kapan MOQ kecil justru pilihan paling sehat',
  'Strategi positioning agar parfum lebih mudah dijual',
  'FAQ biaya maklon parfum',
  'Kesimpulan',
];

const glowHeadings = [
  'Mengapa konsep glow glass skin masih relevan',
  'Posisi cystamine dalam formula brightening modern',
  'SKU awal yang paling masuk akal untuk launch',
  'Kesalahan positioning yang sering membuat produk gagal',
  'Rencana launch yang lebih realistis untuk brand baru',
  'FAQ bisnis skincare brightening',
  'Kesimpulan',
];

const micellarHeadings = [
  'Perbedaan fungsi utama micellar water dan toner',
  'Perbedaan komposisi dan pengalaman pemakaian',
  'Kapan konsumen cukup memakai salah satunya',
  'Kategori produk yang paling menarik untuk brand owner',
  'Arah formulasi agar produk tidak generik',
  'FAQ micellar water dan toner',
  'Kesimpulan',
];

const articleOverrides: Record<string, ArticleOverride> = {
  '/biaya-maklon-parfum-moq-kecil': {
    excerpt:
      'Panduan rinci biaya maklon parfum dengan MOQ kecil, lengkap dengan struktur modal, faktor HPP, dan strategi launch yang lebih realistis untuk brand baru.',
    content: [
      '<p>Memulai brand parfum sendiri tidak harus langsung masuk ke produksi besar. Justru untuk brand baru, keputusan paling sehat biasanya dimulai dari batch kecil yang cukup untuk menguji aroma hero, respon pasar, dan kemampuan harga jual. Pendekatan ini menurunkan risiko stok mati sekaligus memberi ruang untuk memperbaiki positioning sebelum scale up.</p>',
      '<p>Masalahnya, banyak calon brand owner hanya fokus pada angka MOQ tanpa memahami struktur biaya di belakangnya. Akibatnya, harga jual terlihat menarik di atas kertas tetapi margin aktual menjadi tipis setelah biaya sample, kemasan, revisi, dan legalitas ikut dihitung. Artikel ini memecah biaya maklon parfum secara lebih operasional agar keputusan awal lebih presisi.</p>',
      buildOutline(parfumHeadings),
      buildFigure('dreamlab_maklonkosmetik_artikel_tengah.png', 'Riset biaya maklon parfum Dreamlab'),
      '<h2>Komponen biaya yang wajib dihitung sejak awal</h2>',
      '<p>Dalam proyek parfum, biaya jarang berhenti pada biaya isi botol. Ada beberapa lapisan cost yang saling berkaitan: pengembangan aroma, bahan baku, kemasan primer, box, pengisian, hingga legalitas dan koreksi desain. Jika salah satu komponen dilewatkan dari simulasi awal, keputusan harga jual akan meleset.</p>',
      '<p>Riset aroma dan sample berada di fase paling awal tetapi efeknya besar. Di sinilah karakter brand mulai dibentuk. Revisi yang terlalu banyak tidak selalu buruk, tetapi harus diantisipasi sebagai biaya waktu dan biaya pengembangan. Setelah itu, bagian yang paling menentukan HPP biasanya berpindah ke konsentrat parfum, botol, sprayer, dan finishing box.</p>',
      '<ul><li><strong>Riset dan sample:</strong> menentukan akurasi aroma, kualitas first impression, dan repeatability produksi.</li><li><strong>Konsentrat dan alkohol:</strong> langsung mempengaruhi kualitas aroma, dry down, dan daya tahan.</li><li><strong>Botol dan sprayer:</strong> menjadi komponen visual yang paling sering mengubah persepsi premium.</li><li><strong>Box, label, dan finishing:</strong> mempengaruhi biaya per unit sekaligus pengalaman unboxing.</li><li><strong>Legalitas:</strong> penting untuk keamanan penjualan jangka panjang dan kesiapan scale up.</li></ul>',
      '<h2>Contoh struktur modal untuk batch MOQ kecil</h2>',
      '<p>MOQ kecil cocok untuk soft launch, batch komunitas, atau validasi awal di marketplace. Namun, HPP per unit biasanya lebih tinggi daripada batch besar. Itu bukan masalah selama model bisnisnya memang mengutamakan pembelajaran pasar, bukan efisiensi volume sejak hari pertama.</p>',
      buildComparisonTable(
        ['Komponen', 'Fungsi dalam launch awal', 'Dampak ke margin'],
        [
          ['Sample dan revisi', 'Validasi aroma hero sebelum produksi', 'Sedang'],
          ['Isi parfum dan bahan baku', 'Menentukan kualitas utama produk', 'Tinggi'],
          ['Botol, sprayer, cap', 'Membentuk persepsi premium', 'Tinggi'],
          ['Box dan label', 'Menguatkan branding dan shelf appeal', 'Sedang'],
          ['Legalitas dan support dokumen', 'Membuat produk aman dijual', 'Sedang'],
        ]
      ),
      '<p>Secara praktis, batch kecil sebaiknya diperlakukan sebagai investasi validasi. Target utamanya bukan langsung mengejar biaya serendah mungkin, tetapi memastikan tiga hal: aroma yang benar, packaging yang masuk akal untuk target market, dan harga jual yang masih diterima pasar. Jika tiga titik ini lolos uji, scale up menjadi jauh lebih aman.</p>',
      '<h2>Kesalahan yang paling sering membuat margin tipis</h2>',
      '<p>Kesalahan paling umum adalah memilih kemasan terlalu premium sebelum brand memiliki alasan harga yang kuat. Banyak proyek parfum baru terlihat cantik secara visual, tetapi margin hancur karena botol custom, box tebal, dan aksesoris tambahan dipilih terlalu cepat. Pada tahap awal, kemasan harus tetap menarik, tetapi disiplin terhadap fungsi dan target margin.</p>',
      '<p>Kesalahan lain adalah memisahkan diskusi produk dari diskusi channel penjualan. Parfum yang akan dijual lewat komunitas, live commerce, atau reseller tidak selalu membutuhkan struktur biaya yang sama. Jika channel penjualan menuntut diskon agresif, maka HPP harus disusun lebih konservatif sejak awal.</p>',
      '<ul><li><strong>Terlalu cepat memakai kemasan custom:</strong> visual naik, tapi ruang margin turun drastis.</li><li><strong>Tidak mengunci target harga jual:</strong> membuat pemilihan bahan dan packaging melenceng.</li><li><strong>Mengabaikan biaya konten dan launch:</strong> padahal parfum sangat bergantung pada presentasi visual.</li><li><strong>Memilih terlalu banyak varian di batch awal:</strong> stok terpecah, pembacaan data penjualan jadi kabur.</li></ul>',
      buildFigure('dreamlab_maklonkosmetik_artikel_akhir.png', 'Simulasi HPP parfum untuk batch kecil'),
      '<h2>Kapan MOQ kecil justru pilihan paling sehat</h2>',
      '<p>MOQ kecil menjadi pilihan paling sehat ketika brand belum punya bukti bahwa aroma tertentu memang akan menang di pasar. Dalam kondisi ini, memaksa produksi besar hanya memperbesar risiko. Batch kecil memberi ruang untuk menguji review, konten, dan repeat order tanpa menahan terlalu banyak modal di gudang.</p>',
      '<p>Pendekatan ini juga cocok untuk brand yang ingin masuk lewat positioning niche, misalnya parfum tea-inspired, gourmand, atau oriental modern. Produk seperti ini sering butuh validasi narasi lebih dulu. Jika pembacaan pasar awal bagus, barulah volume dan varian bisa ditambah secara disiplin.</p>',
      '<h2>Strategi positioning agar parfum lebih mudah dijual</h2>',
      '<p>Parfum jarang menang hanya karena aroma enak. Ia menang karena cerita produknya jelas: siapa target pembelinya, mood apa yang dijual, dan kenapa konsumen perlu mengingat brand tersebut. Positioning yang baik membuat biaya produksi lebih terarah karena semua keputusan visual dan formula mengikuti narasi yang sama.</p>',
      '<p>Untuk memperjelas arah, Anda bisa membaca <a href="https://dreamlab.id/inspirasi-parfum-lokal-aroma-teh/">inspirasi parfum lokal aroma teh</a>, <a href="https://dreamlab.id/parfum-inspired-peluang-bisnis/">peluang parfum inspired</a>, dan <a href="https://dreamlab.id/jenis-alkohol-dalam-parfum/">jenis alkohol dalam parfum</a>. Link seperti ini penting karena membantu calon brand owner masuk ke riset yang lebih konkret, bukan sekadar estimasi modal umum.</p>',
      buildCta(
        'Butuh simulasi MOQ parfum yang realistis?',
        'Diskusikan struktur biaya, arah aroma, dan opsi kemasan yang paling aman untuk batch launch pertama Anda.'
      ),
      '<h2>FAQ biaya maklon parfum</h2>',
      buildFaq([
        {
          question: 'Apakah MOQ kecil selalu berarti modal awal lebih rendah?',
          answer:
            'Tidak selalu. Total modal bisa lebih terkendali, tetapi HPP per unit biasanya lebih tinggi. Karena itu, MOQ kecil cocok untuk validasi pasar, bukan untuk efisiensi volume.',
        },
        {
          question: 'Komponen mana yang paling sering menaikkan HPP tanpa terasa?',
          answer:
            'Botol, sprayer, box, dan finishing visual sering menjadi pemborosan paling besar karena terlihat kecil per item, tetapi dampaknya tinggi saat dikalikan jumlah produksi.',
        },
        {
          question: 'Lebih baik mulai dengan satu aroma atau beberapa aroma?',
          answer:
            'Untuk brand baru, satu aroma hero atau dua varian yang benar-benar berbeda biasanya lebih sehat. Data penjualannya lebih mudah dibaca dan modal tidak terlalu terpecah.',
        },
      ]),
      '<h2>Kesimpulan</h2>',
      '<p>Biaya maklon parfum tidak boleh dihitung hanya dari angka MOQ. Yang menentukan sehat atau tidaknya bisnis justru kombinasi antara HPP, kemasan, target harga jual, dan kekuatan positioning. Jika struktur ini rapi sejak awal, batch kecil bisa menjadi langkah paling efisien untuk membangun brand yang siap scale up.</p>',
      '<p><a href="/thankyou/google/"><strong>Konsultasikan konsep brand parfum Anda bersama Dreamlab</strong></a> untuk menghitung skema MOQ, estimasi biaya, dan arah formulasi yang lebih realistis.</p>',
    ].join(''),
  },
  '/bisnis-skincare-glow-glasskin-cystamine': {
    excerpt:
      'Panduan lebih lengkap untuk merancang bisnis skincare glow glass skin berbasis cystamine, dari positioning bahan aktif sampai struktur launch yang layak dijual.',
    content: [
      '<p>Pasar brightening tidak pernah benar-benar sepi, tetapi konsumen semakin kritis. Mereka bukan hanya mencari klaim cerah, melainkan produk yang terasa aman, relevan dengan kebutuhan kulit, dan punya narasi formula yang masuk akal. Karena itu, brand baru tidak cukup hanya mengulang headline glow. Mereka butuh diferensiasi yang bisa dijelaskan dengan tenang dan legal.</p>',
      '<p>Cystamine menarik karena memberi ruang positioning yang lebih modern. Ia bisa dimasukkan ke narasi brightening premium tanpa menempel terlalu dekat ke bahan aktif yang secara persepsi publik sudah dianggap berisiko. Untuk brand baru, ini bukan cuma isu formula, tetapi juga isu strategi komunikasi.</p>',
      buildOutline(glowHeadings),
      buildFigure('dreamlab_maklonkosmetik_artikel_tengah.png', 'Konsep produk glow glass skin dengan cystamine'),
      '<h2>Mengapa konsep glow glass skin masih relevan</h2>',
      '<p>Istilah glow glass skin masih kuat karena ia mewakili hasil visual yang mudah dipahami pasar: kulit tampak cerah, halus, dan lebih rata. Namun, brand yang berhasil biasanya tidak berhenti pada istilah itu. Mereka menerjemahkannya menjadi manfaat yang lebih spesifik seperti dukungan untuk noda hitam, tampilan kulit kusam, atau efek visual kulit yang lebih sehat.</p>',
      '<p>Bagi brand owner, relevansi glow glass skin terletak pada kemampuannya menjembatani pasar aspiratif dan pasar mass premium. Klaimnya familiar, tetapi formulanya masih bisa dibuat berbeda. Di sinilah bahan aktif dan tekstur bekerja sebagai pembeda.</p>',
      '<h2>Posisi cystamine dalam formula brightening modern</h2>',
      '<p>Cystamine menjadi menarik ketika brand ingin masuk ke area brightening yang terasa lebih serius tetapi tetap aman secara positioning kosmetik. Nilainya bukan sekadar karena disebut-sebut sebagai alternatif yang lebih modern, tetapi karena ia bisa ditempatkan bersama bahan pendukung lain untuk membuat narasi formula lebih utuh.</p>',
      '<ul><li><strong>Untuk brand premium mass:</strong> cystamine bisa dipadukan dengan niacinamide dan soothing agents agar klaim lebih ramah dipahami.</li><li><strong>Untuk brand treatment ringan:</strong> bisa diarahkan ke dark spot care dan perataan warna kulit.</li><li><strong>Untuk brand glow harian:</strong> bisa dibantu dengan humektan dan tekstur yang nyaman dipakai pagi-malam.</li></ul>',
      '<p>Yang penting, cystamine jangan dijadikan satu-satunya bahan cerita. Brand yang matang selalu menjelaskan ekosistem formulanya: bahan aktif utama, bahan pendukung, tekstur, sensasi pemakaian, dan profil konsumen yang dituju.</p>',
      '<h2>SKU awal yang paling masuk akal untuk launch</h2>',
      '<p>Banyak brand baru gagal karena langsung masuk terlalu banyak SKU. Untuk konsep glow glass skin, struktur yang paling sehat biasanya dimulai dari satu hero serum, lalu jika perlu didampingi day cream atau night cream yang memperkuat positioning. Tujuannya sederhana: narasi lebih jelas, konten lebih fokus, dan modal tidak tercecer ke terlalu banyak varian.</p>',
      buildComparisonTable(
        ['SKU', 'Peran dalam launch', 'Kapan dipilih'],
        [
          ['Serum brightening', 'Hero product dan pusat klaim', 'Saat ingin fokus pada diferensiasi formula'],
          ['Day cream', 'Mudah diterima pasar harian', 'Saat target market ingin produk praktis'],
          ['Night cream', 'Menguatkan cerita treatment', 'Saat ingin membangun bundle basic regimen'],
        ]
      ),
      '<p>Mulailah dari SKU yang paling mudah dijelaskan dan paling mudah dijual. Dalam banyak kasus, satu hero serum yang benar jauh lebih kuat daripada tiga SKU yang setengah matang.</p>',
      '<h2>Kesalahan positioning yang sering membuat produk gagal</h2>',
      '<p>Kesalahan paling umum adalah memakai bahasa promosi terlalu besar tanpa struktur manfaat yang konkret. Produk menjadi terlihat seperti semua brand brightening lain. Klaim terlalu generik seperti "glow maksimal" atau "setara bahan aktif populer" tidak cukup jika tidak diikuti penjelasan untuk siapa produk itu dibuat dan masalah kulit apa yang benar-benar disasar.</p>',
      '<ul><li><strong>Target market kabur:</strong> produk ingin bicara ke semua orang sekaligus.</li><li><strong>Tekstur tidak nyambung:</strong> terlalu berat untuk pasar humid, atau terlalu ringan untuk positioning premium treatment.</li><li><strong>Narasi formula datar:</strong> hanya menonjolkan satu bahan tanpa sistem manfaat yang jelas.</li><li><strong>Bundle terlalu cepat:</strong> launch jadi rumit dan pembacaan performa SKU melemah.</li></ul>',
      buildFigure('dreamlab_maklonkosmetik_artikel_akhir.png', 'Perencanaan launch skincare brightening Dreamlab'),
      '<h2>Rencana launch yang lebih realistis untuk brand baru</h2>',
      '<p>Launch yang sehat biasanya dimulai dari satu klaim inti, satu SKU hero, dan satu angle konten yang kuat. Setelah itu barulah brand membaca sinyal pasar: pertanyaan yang sering muncul, review pengguna awal, serta alasan pembelian yang paling dominan. Data ini jauh lebih berguna daripada menebak-nebak paket lengkap sejak awal.</p>',
      '<p>Untuk pendalaman riset, Anda bisa lanjut membaca <a href="https://dreamlab.id/pengganti-hydroquinone-flek-hitam-aman/">pengganti hydroquinone yang lebih aman</a>, <a href="https://dreamlab.id/tren-brand-kosmetik-lokal-2025/">tren brand kosmetik lokal</a>, dan <a href="https://dreamlab.id/bisnis-kosmetik-dari-nol/">panduan bisnis kosmetik dari nol</a>. Tiga artikel ini membantu menghubungkan formula, tren pasar, dan strategi bisnis dengan lebih konkret.</p>',
      buildCta(
        'Ingin konsep glow glass skin Anda lebih siap dijual?',
        'Dreamlab bisa bantu menyusun formula, struktur SKU, dan positioning brightening yang lebih rapi sejak tahap awal.'
      ),
      '<h2>FAQ bisnis skincare brightening</h2>',
      buildFaq([
        {
          question: 'Apakah brand baru harus langsung menjual paket lengkap brightening?',
          answer:
            'Tidak. Banyak launch awal justru lebih sehat jika dimulai dari satu hero SKU yang jelas, lalu dievaluasi berdasarkan data permintaan dan review.',
        },
        {
          question: 'Apa nilai jual cystamine untuk brand owner?',
          answer:
            'Nilai utamanya ada pada positioning formula brightening yang terasa modern, aman, dan lebih mudah dikemas sebagai produk premium yang tetap legal.',
        },
        {
          question: 'Apa yang paling penting selain formula?',
          answer:
            'Positioning. Formula bagus akan sulit bergerak jika target market, manfaat utama, dan angle komunikasinya tidak tajam.',
        },
      ]),
      '<h2>Kesimpulan</h2>',
      '<p>Produk glow glass skin berbasis cystamine punya peluang yang kuat jika dibangun sebagai sistem: formula yang jelas, SKU yang disiplin, dan komunikasi yang tidak berlebihan. Fokus pada manfaat yang bisa dipahami konsumen dan pengalaman produk yang nyaman dipakai rutin. Itu yang lebih mungkin menghasilkan repeat order.</p>',
      '<p><a href="/thankyou/google/"><strong>Diskusikan konsep brightening combo Anda bersama Dreamlab</strong></a> untuk menyusun formula, kemasan, dan struktur launch yang lebih siap jual.</p>',
    ].join(''),
  },
  '/perbedaan-micellar-water-dan-toner': {
    excerpt:
      'Penjelasan yang lebih lengkap tentang beda micellar water dan toner, termasuk fungsi, jenis kulit yang cocok, serta arah formulasi yang lebih menarik untuk brand owner.',
    content: [
      '<p>Micellar water dan toner sering dianggap mirip karena sama-sama cair dan sering dipakai dengan kapas. Padahal secara peran, dua produk ini bekerja di tahap yang berbeda. Micellar water berada lebih dekat ke cleansing, sedangkan toner berada di tahap persiapan dan perawatan setelah wajah dibersihkan.</p>',
      '<p>Bagi konsumen, kebingungan ini membuat pemakaian jadi tidak tepat. Bagi brand owner, kebingungan yang sama justru bisa jadi peluang. Jika perbedaan fungsinya dijelaskan dengan jelas, kategori produk menjadi jauh lebih mudah diposisikan dan dijual.</p>',
      buildOutline(micellarHeadings),
      buildFigure('dreamlab_maklonkosmetik_artikel_tengah.png', 'Perbedaan micellar water dan toner'),
      '<h2>Perbedaan fungsi utama micellar water dan toner</h2>',
      '<p>Micellar water dirancang untuk mengangkat kotoran, minyak, sunscreen, dan sisa makeup ringan dari permukaan kulit. Ia bekerja sebagai pembersihan awal yang praktis dan biasanya tidak perlu dibilas dalam konteks tertentu. Toner tidak berfokus pada pengangkatan kotoran, tetapi pada kondisi kulit setelah dibersihkan.</p>',
      '<p>Toner dipakai untuk beberapa tujuan: membantu memberi hidrasi ringan, menenangkan, menyegarkan, atau menjadi kendaraan bahan aktif yang lebih halus. Karena itu, meskipun bentuk keduanya sama-sama cair, tujuan pemakaiannya berbeda sejak awal.</p>',
      buildComparisonTable(
        ['Aspek', 'Micellar Water', 'Toner'],
        [
          ['Peran utama', 'Pembersihan ringan sebelum atau sesudah facial wash', 'Persiapan kulit dan dukungan perawatan'],
          ['Masalah yang disasar', 'Residu, minyak, makeup ringan', 'Hidrasi, soothing, balancing, active support'],
          ['Nilai jual utama', 'Praktis dan gentle cleansing', 'Spesifik manfaat sesuai formula'],
        ]
      ),
      '<h2>Perbedaan komposisi dan pengalaman pemakaian</h2>',
      '<p>Micellar water umumnya mengandalkan surfaktan lembut yang membentuk micelle untuk menarik minyak dan kotoran. Karena fokusnya cleansing, teksturnya biasanya terasa sangat ringan dan cepat hilang setelah dipakai. Toner lebih luas secara formulasi. Ia bisa berisi humektan, soothing agents, botanical extract, atau bahan aktif seperti niacinamide, AHA, dan BHA.</p>',
      '<p>Perbedaan komposisi ini berpengaruh ke pengalaman produk. Micellar water yang baik harus terasa bersih tanpa meninggalkan rasa kesat berlebihan. Toner yang baik harus terasa relevan dengan target kulitnya: hydrating, calming, exfoliating ringan, atau brightening support.</p>',
      '<h2>Kapan konsumen cukup memakai salah satunya</h2>',
      '<p>Tidak semua orang harus memakai dua-duanya. Konsumen yang hanya ingin membersihkan wajah ringan sebelum cuci muka mungkin cukup memakai micellar water. Sebaliknya, konsumen yang rutin mencuci muka dan butuh hidrasi tambahan bisa memilih toner tanpa perlu micellar water setiap saat.</p>',
      '<ul><li><strong>Kulit sensitif atau kering:</strong> biasanya lebih cocok dengan micellar water lembut dan toner yang hydrating.</li><li><strong>Kulit berminyak atau acne-prone:</strong> toner dengan active support bisa memberi nilai lebih setelah cleansing.</li><li><strong>Kulit kombinasi:</strong> kombinasi dua produk masih masuk akal selama formulanya tidak terlalu agresif.</li></ul>',
      '<h2>Kategori produk yang paling menarik untuk brand owner</h2>',
      '<p>Dari sudut pandang bisnis, dua kategori ini sama-sama menarik karena termasuk produk pemakaian rutin. Namun angle produknya berbeda. Micellar water biasanya lebih mengandalkan narasi gentle cleansing, kenyamanan, dan kemudahan pakai. Toner lebih kaya ruang diferensiasi karena bisa membawa manfaat yang lebih spesifik.</p>',
      '<p>Jika brand ingin menjual produk yang mudah dipahami pasar luas, micellar water bisa jadi pintu masuk. Jika brand ingin membangun cerita bahan aktif dan manfaat yang lebih tajam, toner sering memberi fleksibilitas yang lebih besar.</p>',
      buildFigure('dreamlab_maklonkosmetik_artikel_akhir.png', 'Arah formulasi micellar water dan toner'),
      '<h2>Arah formulasi agar produk tidak generik</h2>',
      '<p>Produk cleansing atau toner yang generik biasanya gagal bukan karena kategorinya salah, tetapi karena positioning-nya datar. Micellar water tidak cukup hanya disebut lembut. Toner tidak cukup hanya disebut menyegarkan. Brand harus menentukan target penggunaan yang jelas.</p>',
      '<ul><li><strong>Micellar water:</strong> bisa diarahkan ke sensitive skin, no-rinse convenience, atau post-sunscreen cleansing.</li><li><strong>Toner hydrating:</strong> bisa diarahkan ke barrier-friendly daily hydration.</li><li><strong>Toner active:</strong> bisa diarahkan ke brightening ringan, calming acne-prone skin, atau mild exfoliation.</li></ul>',
      '<p>Untuk riset lanjutan, Anda bisa membaca <a href="https://dreamlab.id/cara-membuat-toner-dari-cuka-apel/">ide pengembangan toner</a>, <a href="https://dreamlab.id/cara-bisnis-skincare-dari-nol/">panduan memulai bisnis skincare</a>, dan <a href="https://dreamlab.id/pengganti-hydroquinone-flek-hitam-aman/">arah bahan aktif brightening yang lebih aman</a>. Link ini membantu menyambungkan kategori produk dengan strategi brand secara praktis.</p>',
      buildCta(
        'Masih bingung pilih micellar water atau toner untuk SKU awal?',
        'Diskusikan target market, fungsi produk, dan arah formulasi yang paling tepat bersama tim Dreamlab.'
      ),
      '<h2>FAQ micellar water dan toner</h2>',
      buildFaq([
        {
          question: 'Apakah micellar water bisa menggantikan toner?',
          answer:
            'Tidak sepenuhnya. Micellar water fokus pada cleansing, sedangkan toner fokus pada kondisi kulit setelah pembersihan dan manfaat perawatan tambahan.',
        },
        {
          question: 'Kategori mana yang lebih mudah dijual untuk brand baru?',
          answer:
            'Micellar water lebih mudah dipahami pasar luas, tetapi toner biasanya memberi ruang diferensiasi yang lebih besar jika brand ingin menonjolkan manfaat spesifik.',
        },
        {
          question: 'Apakah lebih baik launch keduanya sekaligus?',
          answer:
            'Tidak harus. Jika modal dan positioning masih terbatas, pilih kategori yang paling sesuai dengan target market dan angle brand Anda terlebih dahulu.',
        },
      ]),
      '<h2>Kesimpulan</h2>',
      '<p>Micellar water dan toner bukan produk yang saling menggantikan sepenuhnya. Micellar water bekerja di pembersihan, sedangkan toner bekerja di tahap persiapan dan perawatan. Untuk brand owner, keputusan kategori harus mengikuti kebutuhan pasar dan kekuatan positioning, bukan sekadar mengikuti produk yang sedang ramai.</p>',
      '<p><a href="/thankyou/google/"><strong>Konsultasikan konsep micellar water atau toner Anda bersama Dreamlab</strong></a> untuk menentukan formula, positioning, dan target market yang lebih presisi.</p>',
    ].join(''),
  },
};

export function getArticleOverride(slug: string): ArticleOverride | null {
  const normalizedSlug = slug.startsWith('/') ? slug : `/${slug}`;
  return articleOverrides[normalizedSlug] ?? null;
}
