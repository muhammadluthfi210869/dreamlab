import { ProductCategoryV2 } from "@/types/product-v2";

export const babycareData: ProductCategoryV2 = {
  slug: "babycare",
  name: "Baby Care",
  tagline: "Keamanan Tertinggi untuk Buah Hati — Aman Sejak Lahir (0+ Bulan)",
  description: "Layanan maklon perawatan bayi yang hipoalergenik dan aman: baby 2-in-1 wash, baby shampoo, baby lotion, baby powder, dan baby cologne. Diformulasi dengan standar keamanan grade farmasi untuk kulit bayi yang sensitif. Semua produk aman untuk newborn (0+ bulan).",
  heroImage: "/new asset/background-visual-hero-section/babycare.webp",
  bgColor: "#F0F9FF",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Produk", href: "/produk/" },
    { label: "Baby Care", href: "/produk/babycare/" },
  ],
  comparisonOptions: ["Baby 2-in-1 Wash", "Baby Shampoo", "Baby Lotion", "Baby Powder", "Baby Cologne", "Baby Oil", "Baby Moisturizer Cream"],
  comparisonMatrix: {
    "Baby 2-in-1 Wash": {
      konsentrasi: "Tear-free, gentle surfactant",
      haltbarkeit: "Pembersihan Harian",
      marktposition: "Essential",
      moq: "2000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Tear-free, mild, soothing",
      bestFor: ["Daily Bath", "Sensitive Scalp", "Newborn"],
      ingredients: ["Oat Extract", "Calendula", "Glycerin"],
    },
    "Baby Shampoo": {
      konsentrasi: "Tear-free, hair nourishing",
      haltbarkeit: "Perawatan Rambut Harian",
      marktposition: "Essential",
      moq: "2000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Tear-free, hair growth, soothing",
      bestFor: ["Daily Hair Wash", "Cradle Cap", "Hair Growth"],
      ingredients: ["Kemiri Extract", "Aloe Vera", "Seledri"],
    },
    "Baby Lotion": {
      konsentrasi: "Light emulsion",
      haltbarkeit: "Hidrasi Harian",
      marktposition: "Essential",
      moq: "2000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Gentle, hypoallergenic, moisturizing",
      bestFor: ["Daily Use", "Sensitive Skin", "Newborn"],
      ingredients: ["Ceramide NP", "Chamomile", "Avocado Oil"],
    },
    "Baby Powder": {
      konsentrasi: "Fine powder, talc-free",
      haltbarkeit: "Kering Sepanjang Hari",
      marktposition: "Traditional",
      moq: "3000 pcs",
      preisklasse: "Affordable",
      karakter: "Absorbing moisture, soothing",
      bestFor: ["Diaper Rash Prevention", "Skin Fold Moisture", "After Bath"],
      ingredients: ["Cornstarch", "Kaolin", "Aloe Vera"],
    },
    "Baby Cologne": {
      konsentrasi: "Alcohol-free fragrance",
      haltbarkeit: "Kesegaran Sepanjang Hari",
      marktposition: "Traditional",
      moq: "2000 pcs",
      preisklasse: "Affordable",
      karakter: "Long-lasting freshness, non-drying",
      bestFor: ["Post-Bath Freshness", "Daily Fragrance", "Newborn safe"],
      ingredients: ["Chamomile", "Castor Oil", "Mild Fragrance"],
    },
    "Baby Oil": {
      konsentrasi: "Pure plant oil base",
      haltbarkeit: "Hidrasi & Pijat",
      marktposition: "Essential",
      moq: "2000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Moisturizing, soothing, non-greasy",
      bestFor: ["Baby Massage", "Dry Skin", "Cradle Cap"],
      ingredients: ["Mineral Oil", "Chamomile", "Vitamin E"],
    },
    "Baby Moisturizer Cream": {
      konsentrasi: "Rich cream with Ceramide",
      haltbarkeit: "Hidrasi Intensif 12 Jam",
      marktposition: "Premium Care",
      moq: "2000 pcs",
      preisklasse: "Mid-Premium",
      karakter: "Deep moisturizing, barrier protection",
      bestFor: ["Sensitive Skin", "Newborn", "Daily Protection"],
      ingredients: ["Ceramide NP", "Shea Butter", "Chamomile"],
    },
  },
  products: [
    {
      id: "baby-wash",
      name: "Baby 2-in-1 Wash",
      slug: "baby-2in1-wash",
      heroImage: "/new asset/baby-care/baby-wash.webp",
      galleryImages: ["/new asset/baby-care/baby-wash.webp"],
      tags: ["Tear-Free", "Gentle", "Newborn Safe"],
      shortDescription: "Maklon Baby 2-in-1 Wash (Top-to-Toe) dengan formula tear-free yang tidak perih di mata. Membersihkan secara efektif tanpa mengiritasi kulit sensitif bayi.",
      story: `Waktu mandi bisa menjadi momen yang menyenangkan atau sumber stres — tergantung pada produk yang digunakan.

Bagi bayi, sabun yang masuk ke mata bisa menjadi pengalaman yang menimbulkan trauma. Momen di mana mereka menyadari bahwa mandi bukan lagi hal yang menyenangkan. Baby 2-in-1 wash yang diformulasikan dengan benar harus membersihkan secara efektif tanpa perlu gesekan keras, serta memiliki standar tear-free yang tidak memicu perih di mata.

Di Dreamlab, kami menciptakan baby 2-in-1 wash dengan surfaktan berbasis asam amino alami yang sangat ringan, menjaga kelembapan alami kulit bayi baru lahir tanpa memicu iritasi.`,
      seoParagraph: "Maklon Baby 2-in-1 Wash solusi bagi brand baby care yang ingin menawarkan produk pembersih lembut. Dengan formula tear-free dan bahan yang aman untuk newborn, baby 2-in-1 wash Dreamlab membantu menciptakan waktu mandi yang menyenangkan. MOQ mulai 2000 pcs bersertifikasi BPOM & Halal.",
      benefits: [
        "Formula Tear-Free — tidak perih di mata bayi",
        "Surfaktan Lembut — membersihkan tanpa menghilangkan minyak alami kulit",
        "pH Seimbang — sesuai dengan tingkat keasaman alami kulit bayi",
        "Bahan Penenang: Oat Extract dan Calendula",
        "Bebas SLS/SLES dan Paraben",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Oat Extract", origin: "USA", function: "Menenangkan dan melindungi kulit sensitif" },
        { name: "Calendula", origin: "France", function: "Anti-inflamasi alami untuk kulit bayi" },
        { name: "Glycerin", origin: "Germany", function: "Humektan — menjaga kelembapan pasca mandi" },
      ],
      sizeOptions: ["100ml", "200ml", "500ml"],
      bottleOptions: ["Pump Bottle", "Flip Top Bottle", "Custom Exclusive Packaging"],
      capOptions: ["Pump", "Flip Cap", "Screw Cap"],
      moq: "2000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A", "Dermatology Tested"],
    },
    {
      id: "baby-shampoo",
      name: "Baby Shampoo",
      slug: "baby-shampoo",
      heroImage: "/new asset/baby-care/baby-shampoo.webp",
      galleryImages: ["/new asset/baby-care/baby-shampoo.webp"],
      tags: ["Tear-Free", "Hair Growth", "Nourishing"],
      shortDescription: "Maklon Baby Shampoo dengan ekstrak kemiri dan seledri alami untuk menutrisi kulit kepala, merangsang rambut tumbuh lebat, sehat, dan lembut.",
      story: `Kesehatan rambut bayi dimulai dari perawatan kulit kepala yang lembut.

Rambut bayi membutuhkan perhatian khusus karena akar rambut dan kulit kepala mereka masih berkembang. Formula sampo bayi harus sangat ringan, membantu membersihkan kerak kepala (cradle cap) dengan aman, serta memberikan nutrisi alami untuk mendukung pertumbuhan rambut yang lebat dan tebal.

Di Dreamlab, kami memformulasikan sampo bayi dengan kombinasi Kemiri, Seledri, dan Lidah Buaya yang dipercaya secara turun-temurun untuk melebatkan rambut, dibalut dalam formula modern tear-free yang aman untuk mata.`,
      seoParagraph: "Maklon Baby Shampoo premium dengan ekstrak kemiri dan seledri alami. Menutrisi kulit kepala bayi secara aman, melembutkan rambut, dan merangsang pertumbuhan rambut tebal berkilau. ✓ Formula Tear-Free ✓ Hipoalergenik. Hubungi jasa maklon baby care Dreamlab.",
      benefits: [
        "Merangsang pertumbuhan rambut lebat, tebal, dan hitam berkilau",
        "Formula Tear-Free — tidak perih di mata",
        "Membantu membersihkan kerak kepala (cradle cap) secara lembut",
        "Menjaga pH kulit kepala tetap seimbang",
        "Mengandung Ekstrak Kemiri, Aloe Vera, dan Seledri",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Kemiri Extract", origin: "Local", function: "Melebatkan dan memperkuat akar rambut" },
        { name: "Aloe Vera", origin: "Local", function: "Melembapkan kulit kepala dan melembutkan rambut" },
        { name: "Seledri Extract", origin: "Local", function: "Merangsang pertumbuhan rambut sehat" },
      ],
      sizeOptions: ["100ml", "200ml"],
      bottleOptions: ["Pump Bottle", "Flip Top", "Tube"],
      capOptions: ["Pump", "Flip Cap", "Screw Cap"],
      moq: "2000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "baby-lotion",
      name: "Baby Lotion",
      slug: "baby-lotion",
      heroImage: "/new asset/baby-care/baby-lotion.webp",
      galleryImages: ["/new asset/baby-care/baby-lotion.webp"],
      tags: ["24H Hydration", "Hypoallergenic", "Skin Barrier"],
      shortDescription: "Maklon Baby Lotion dengan formula aman dan hipoalergenik untuk kulit sensitif bayi. Cukup lembut untuk bayi baru lahir (newborn).",
      story: `Kulit bayi berbeda dari kulit dewasa — 50% lebih tipis, lebih berpori, dan jauh lebih sensitif.

Baby lotion tidak bisa menggunakan bahan yang sama seperti pelembap dewasa. Formulasi harus jauh lebih lembut, pengawet yang digunakan harus ringan, dan aroma dikurangi atau ditiadakan sama sekali. Namun, efektivitas tetap menjadi kunci — bayi membutuhkan hidrasi yang cukup untuk menjaga skin barrier mereka.

Di Dreamlab, kami memformulasikan baby lotion dengan Ceramide NP, Chamomile, dan Avocado Oil yang cukup aman untuk bayi baru lahir (0+ bulan) namun tetap efektif memberikan kelembapan mendalam.`,
      seoParagraph: "Maklon Baby Lotion — jasa maklon lotion bayi formula hipoalergenik aman untuk newborn (0+ bulan). Dermatologically tested, bebas paraben & pewangi buatan. ✓ BPOM & Halal ✓ MOQ 2000 pcs. Konsultasi maklon baby care bersama Dreamlab.",
      benefits: [
        "Formula Hipoalergenik — aman untuk bayi baru lahir (0+ bulan)",
        "Dermatologically Tested — aman untuk kulit yang sangat sensitif",
        "Bebas Pewangi Buatan — pilihan tanpa aroma atau aroma alami ringan",
        "Penyerapan Cepat — tidak lengket, nyaman untuk penggunaan harian",
        "Kandungan Premium: Ceramide NP, Chamomile, dan Avocado Oil",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Ceramide NP", origin: "Korea", function: "Memperkuat dan melindungi skin barrier" },
        { name: "Chamomile Extract", origin: "Germany", function: "Menenangkan kulit dan anti-iritasi" },
        { name: "Avocado Oil", origin: "Spain", function: "Memberikan kelembapan mendalam dan menutrisi" },
      ],
      sizeOptions: ["50ml", "100ml", "200ml"],
      bottleOptions: ["Pump Bottle", "Flip Top", "Tube"],
      capOptions: ["Pump", "Flip Cap", "Screw Cap"],
      moq: "2000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A", "Dermatologically Tested"],
    },
    {
      id: "baby-powder",
      name: "Baby Powder",
      slug: "baby-powder",
      heroImage: "/new asset/baby-care/baby-powder.webp",
      galleryImages: ["/new asset/baby-care/baby-powder.webp"],
      tags: ["Talc-free", "Freshness", "Essential"],
      shortDescription: "Maklon Baby Powder bebas talc (talc-free) untuk kesegaran kulit bayi. Menyerap keringat berlebih secara aman tanpa risiko pernapasan.",
      story: `Keamanan pernapasan bayi adalah prioritas utama kami dalam memproduksi bedak.

Di Dreamlab, kami sepenuhnya meninggalkan penggunaan talc dan menggantinya dengan bahan nabati yang aman seperti pati jagung (corn starch). Bedak bayi kami memiliki butiran ultra-halus yang efektif menyerap kelembapan di lipatan kulit, mencegah iritasi akibat gesekan, dan memberikan aroma segar yang ikonik bagi bayi tanpa risiko debu yang berbahaya.`,
      seoParagraph: "Maklon Baby Powder solusi bagi brand yang mengedepankan keamanan dan inovasi produk bayi. Dengan formula talc-free berbasis pati jagung, bedak bayi Dreamlab aman untuk pernapasan dan kulit sensitif. MOQ mulai 3000 pcs bersertifikasi BPOM & Halal.",
      benefits: [
        "100% Talc-Free — aman untuk pernapasan dan kesehatan bayi",
        "Absorbent Formula — efektif menyerap keringat dan kelembapan berlebih",
        "Mencegah Biang Keringat — menjaga kulit tetap kering di area lipatan",
        "Tekstur Ultra-Halus — tidak menyebabkan gesekan kasar pada kulit",
        "Aroma Klasik Bayi — memberikan sensasi segar sepanjang hari",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Corn Starch", origin: "USA", function: "Penyerap kelembapan alami dan aman" },
        { name: "Zinc Oxide", origin: "Germany", function: "Pelindung kulit, anti-iritasi" },
        { name: "Allantoin", origin: "Germany", function: "Menenangkan, mendukung penyembuhan kulit" },
      ],
      sizeOptions: ["50g", "100g", "150g"],
      bottleOptions: ["Shaker Bottle", "Puff Case", "Refill Pouch"],
      capOptions: ["Sifter Cap", "Screw Cap", "Flip Sifter"],
      moq: "3000 pcs",
      productionTime: "2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "baby-cologne",
      name: "Baby Cologne",
      slug: "baby-cologne",
      heroImage: "/new asset/baby-care/baby-cologne.webp",
      galleryImages: ["/new asset/baby-care/baby-cologne.webp"],
      tags: ["Alcohol-Free", "Long-Lasting", "Gentle"],
      shortDescription: "Maklon Baby Cologne bebas alkohol dengan keharuman lembut klasik yang menenangkan, aman digunakan untuk kulit bayi sehari-hari.",
      story: `Memberikan keharuman khas bayi yang lembut dan segar tanpa khawatir merusak kulit sensitifnya.

Kulit bayi sangat rentan terhadap efek pengeringan alkohol. Oleh karena itu, Dreamlab memformulasikan baby cologne yang 100% bebas alkohol (alcohol-free). Memanfaatkan basis air dan minyak jarak terhidrogenasi untuk melarutkan wewangian lembut hypoallergenic secara sempurna, cologne ini memberikan aroma segar tahan lama setelah mandi tanpa menimbulkan iritasi.`,
      seoParagraph: "Maklon Baby Cologne bebas alkohol dengan wewangian hypoallergenic yang aman untuk kulit sensitif bayi. Memberikan aroma segar klasik sepanjang hari. ✓ Bebas Alkohol ✓ Aman untuk pakaian & kulit bayi. MOQ mulai 2000 pcs bersertifikasi BPOM & Halal.",
      benefits: [
        "100% Alcohol-Free — tidak membuat kulit bayi kering atau iritasi",
        "Aroma Klasik Bayi Lembut — keharuman segar yang tahan lama",
        "Aman untuk Pakaian & Kulit — tidak meninggalkan noda",
        "Hypoallergenic Fragrance — dirancang khusus untuk meminimalkan alergi",
        "Memberikan kesegaran instan sepanjang hari",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Mild Hypoallergenic Fragrance", origin: "Switzerland", function: "Wewangian lembut aman untuk kulit bayi" },
        { name: "PEG-40 Hydrogenated Castor Oil", origin: "Germany", function: "Emulgator alami pelarut parfum" },
        { name: "Chamomile Water", origin: "France", function: "Menyegarkan dan menenangkan kulit" },
      ],
      sizeOptions: ["50ml", "100ml", "150ml"],
      bottleOptions: ["Spray Bottle", "Splash Bottle"],
      capOptions: ["Spray Pump", "Screw Cap", "Flip Cap"],
      moq: "2000 pcs",
      productionTime: "2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "baby-oil",
      name: "Baby Oil",
      slug: "baby-oil",
      heroImage: "/new asset/baby-care/baby-oil.webp",
      galleryImages: ["/new asset/baby-care/baby-oil.webp"],
      tags: ["Moisturizing", "Massage", "Newborn Safe"],
      shortDescription: "Maklon Baby Oil dengan formula 100% minyak nabati yang aman untuk pijat bayi dan perawatan kulit kering. Lembut dan nyaman di kulit sensitif bayi.",
      story: `Baby oil adalah bagian penting dari ritual perawatan bayi yang tidak hanya melembapkan tetapi juga mempererat ikatan antara orang tua dan buah hati.

Baby Oil Dreamlab diformulasikan dengan minyak nabati murni yang ringan dan mudah meresap. Sangat ideal untuk pijat bayi yang menstimulasi pertumbuhan dan relaksasi, mengatasi bercak kulit kering, dan membersihkan cradle cap (kerak kepala) secara lembut. 100% aman untuk bayi baru lahir (0+ bulan) dengan formula hypoallergenic tanpa pewangi buatan.`,
      seoParagraph: "Maklon Baby Oil — jasa maklon minyak bayi 100% nabati untuk pijat dan perawatan kulit kering. Hypoallergenic, aman untuk newborn (0+ bulan). ✓ BPOM & Halal ✓ MOQ 2000 pcs.",
      benefits: [
        "100% Minyak Nabati — ringan dan mudah meresap",
        "Aman untuk Newborn — formula hypoallergenic 0+ bulan",
        "Multi-fungsi: Pijat bayi, kulit kering, cradle cap",
        "Bebas Pewangi Buatan — mengurangi risiko alergi",
        "Mempererat Bonding — mendukung pijat bayi rutin",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Mineral Oil (Pharma Grade)", origin: "Germany", function: "Basis minyak ringan yang aman" },
        { name: "Chamomile Extract", origin: "Germany", function: "Menenangkan kulit dan anti-iritasi" },
        { name: "Vitamin E", origin: "Switzerland", function: "Antioksidan dan nutrisi kulit" },
      ],
      sizeOptions: ["50ml", "100ml", "200ml"],
      bottleOptions: ["Pump Bottle", "Dropper Bottle", "Splash Bottle"],
      capOptions: ["Pump", "Dropper", "Screw Cap"],
      moq: "2000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "baby-moisturizer-cream",
      name: "Baby Moisturizer Cream",
      slug: "baby-moisturizer-cream",
      heroImage: "/new asset/baby-care/baby-moisturizer-cream.webp",
      galleryImages: ["/new asset/baby-care/baby-moisturizer-cream.webp"],
      tags: ["Moisturizing", "Skin Barrier", "Daily Care"],
      shortDescription: "Maklon Baby Moisturizer Cream dengan formula kaya untuk melindungi dan melembapkan kulit sensitif bayi. Tekstur lembut dengan Ceramide dan Shea Butter.",
      story: `Kulit bayi membutuhkan perlindungan ekstra karena lebih tipis dan lebih rentan dibandingkan kulit dewasa.

Baby Moisturizer Cream Dreamlab diformulasikan untuk memberikan hidrasi intensif sekaligus memperkuat skin barrier bayi. Dengan Ceramide NP yang memperbaiki lapisan pelindung kulit, Shea Butter yang melembutkan, dan Chamomile yang menenangkan. Tekstur krim yang lembut dan mudah diratakan, cocok untuk penggunaan setelah mandi sebagai pelembap harian.`,
      seoParagraph: "Maklon Baby Moisturizer Cream — jasa maklon krim pelembap bayi dengan Ceramide dan Shea Butter. Hipoalergenik, aman untuk newborn (0+ bulan). ✓ BPOM & Halal ✓ MOQ 2000 pcs.",
      benefits: [
        "Ceramide NP — memperkuat dan melindungi skin barrier bayi",
        "Shea Butter — melembutkan dan melembapkan secara alami",
        "Formula Hipoalergenik — aman untuk kulit newborn",
        "Tekstur Krim Lembut — mudah diratakan, nyaman dipakai",
        "Bebas Pewarna & Pewangi Buatan",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Ceramide NP", origin: "Germany", function: "Memperkuat skin barrier bayi" },
        { name: "Shea Butter", origin: "Africa", function: "Melembutkan dan melembapkan" },
        { name: "Chamomile Extract", origin: "Germany", function: "Menenangkan iritasi dan kemerahan" },
      ],
      sizeOptions: ["30g", "50g", "100g"],
      bottleOptions: ["Tube", "Jar", "Pump Jar"],
      capOptions: ["Flip Cap", "Screw Lid", "Pump"],
      moq: "2000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
  ],
  trustStats: [
    { icon: "award", value: "98%", label: "Dermatology Score", description: "Tingkat persetujuan dari audit dermatologis independen" },
    { icon: "shield-check", value: "CPKB Grade A", label: "Certified Factory", description: "Fasilitas produksi dengan standar keamanan grade farmasi" },
    { icon: "heart", value: "0+", label: "Safe Age Range", description: "Diformulasi aman untuk bayi baru lahir hingga anak-anak" },
    { icon: "star", value: "95%", label: "Trust Rate", description: "Tingkat kepercayaan mitra brand pada kategori perawatan bayi" },
  ],
  trustCategorySpecific: [
    { icon: "leaf", label: "Bahan Alami", description: "Chamomile, Aloe Vera, dan Oat — bahan alami yang sangat lembut" },
    { icon: "shield", label: "Hipoalergenik", description: "Formulasi yang diuji untuk meminimalkan reaksi alergi" },
    { icon: "test-tube", label: "Dermatologically Tested", description: "Telah diuji secara independen untuk keamanan dan efikasi" },
    { icon: "star", label: "Pediatrician Reviewed", description: "Formulasi yang telah ditinjau keamanannya untuk anak-anak" },
    { icon: "cross", label: "Paraben Free", description: "Tanpa paraben yang berpotensi membahayakan kulit sensitif bayi" },
    { icon: "droplet", label: "SLS/SLES Free", description: "Tanpa surfaktan keras yang dapat mengiritasi kulit bayi" },
  ],
  edukasi: [
    {
      title: "Apa Perbedaan Baby Oil dan Baby Lotion?",
      content: `<p><strong>Baby Oil</strong> — lebih tepat digunakan untuk:</p>
      <ul>
        <li>Pijat bayi (baby massage) untuk stimulasi motorik.</li>
        <li>Mengatasi bercak kulit kering yang spesifik.</li>
        <li>Mencegah dan membersihkan cradle cap (kerak kepala).</li>
        <li>Setelah mandi, diaplikasikan pada kulit lembap untuk mengunci hidrasi.</li>
      </ul>
      <p><strong>Baby Lotion</strong> — lebih tepat digunakan untuk:</p>
      <ul>
        <li>Pelembap harian seluruh tubuh setelah mandi.</li>
        <li>Penggunaan harian yang ringan dan cepat meresap.</li>
        <li>Menjaga elastisitas kulit bayi secara rutin.</li>
        <li>Bagi orang tua yang lebih menyukai tekstur yang tidak berminyak.</li>
      </ul>`,
    },
    {
      title: "Kapan Buah Hati Mulai Bisa Menggunakan Produk Perawatan?",
      content: `<p>Produk baby care dapat digunakan dari usia bayi baru lahir (0+ bulan) dengan formula yang tepat:</p>
      <ul>
        <li><strong>0-3 Bulan (Newborn):</strong> Gunakan hanya produk dengan label "Suitable for Newborn" atau "0+ Months".</li>
        <li><strong>3-6 Bulan:</strong> Bayi mulai lebih aktif; oil untuk pijat dan wash untuk mandi rutin sangat disarankan.</li>
        <li><strong>6+ Bulan:</strong> Dapat menggunakan rangkaian lengkap mulai dari lotion, cream, hingga powder.</li>
      </ul>
      <p><strong>Tips:</strong> Selalu lakukan patch test di area kecil kulit sebelum penggunaan menyeluruh.</p>`,
    },
    {
      title: "Mengapa Baby 2-in-1 Wash Harus 'Tear-Free'?",
      content: `<p>Formulasi tear-free menggunakan surfaktan khusus yang berbeda dari sabun biasa. Meskipun membersihkan dengan efektif, bahan ini tidak menimbulkan rasa perih jika secara tidak sengaja masuk ke mata bayi.</p>
      <p>Di Dreamlab, kami menggunakan sistem surfaktan lembut yang telah terbukti tear-free melalui pengujian klinis, tanpa mengorbankan daya bersih produk.</p>`,
    },
  ],
  testimonials: [
    {
      quote: "Baby 2-in-1 wash-nya tidak membuat kulit bayi saya kering. Sebelumnya kami mencoba beberapa brand dan selalu muncul iritasi. Sekarang buah hati kami nyaman setiap kali mandi.",
      name: "Dewi",
      brand: "Orang Tua (Jakarta)",
      avatarImage: "",
      productImage: "/assets/images/client-baby-1.webp",
    },
    {
      quote: "Baby lotion-nya sangat sempurna untuk melembapkan kulit kering. Wanginya lembut, teksturnya pas, dan bayi saya terlihat sangat menikmati setiap sesinya.",
      name: "Andi",
      brand: "Orang Tua (Surabaya)",
      avatarImage: "",
      productImage: "/assets/images/client-baby-2.webp",
    },
  ],
  faqs: [
    {
      question: "Apakah produk baby care Dreamlab aman untuk newborn?",
      answer: "Ya! Semua produk baby care Dreamlab diformulasi aman digunakan sejak bayi baru lahir (0+ bulan). Kami menggunakan bahan dengan profil keamanan tinggi dan telah melalui uji dermatologis.",
    },
    {
      question: "Berapa MOQ untuk maklon produk perawatan bayi?",
      answer: "MOQ standar kami dimulai dari 2000-3000 pcs per varian. MOQ menyesuaikan dengan jenis kemasan yang dipilih untuk brand Anda.",
    },
    {
      question: "Apakah bisa membuat produk bayi tanpa pewangi (fragrance-free)?",
      answer: "Tentu. Kami sangat menyarankan opsi tanpa pewangi atau pewangi alami yang sangat ringan untuk meminimalkan risiko sensitisasi pada kulit bayi.",
    },
    {
      question: "Bagaimana standar pengujian produk bayi di Dreamlab?",
      answer: "Produk bayi melalui pengujian yang lebih ketat, meliputi challenge testing, patch testing, dan accelerated stability testing untuk menjamin keamanan produk selama masa simpan.",
    },
    {
      question: "Apakah Dreamlab bisa membantu desain kemasan yang ramah anak?",
      answer: "Ya, kami dapat membantu merancang kemasan yang fungsional bagi orang tua dan aman bagi anak-anak, termasuk pilihan botol dengan pompa pengunci atau material yang tidak mudah pecah.",
    },
    {
      question: "Apa saja bahan-bahan yang TIDAK digunakan dalam produk baby care Dreamlab?",
      answer: "Produk baby care Dreamlab diformulasikan tanpa: Paraben, SLS/SLES, Pewangi Buatan (opsional), Phthalates, Formaldehyde, dan pewarna sintetis. Kami menggunakan bahan-bahan alami yang lembut dan aman untuk kulit sensitif bayi termasuk newborn.",
    },
  ],
  relatedProducts: [
    { name: "Baby 2-in-1 Wash", slug: "baby-wash", image: "/new asset/baby-care/baby-wash.webp", category: "Baby Care", categorySlug: "babycare" },
    { name: "Baby Shampoo", slug: "baby-shampoo", image: "/new asset/baby-care/baby-shampoo.webp", category: "Baby Care", categorySlug: "babycare" },
    { name: "Baby Lotion", slug: "baby-lotion", image: "/new asset/baby-care/baby-lotion.webp", category: "Baby Care", categorySlug: "babycare" },
    { name: "Baby Cologne", slug: "baby-cologne", image: "/new asset/baby-care/baby-cologne.webp", category: "Baby Care", categorySlug: "babycare" },
    { name: "Baby Oil", slug: "baby-oil", image: "/new asset/baby-care/baby-oil.webp", category: "Baby Care", categorySlug: "babycare" },
  ],
};