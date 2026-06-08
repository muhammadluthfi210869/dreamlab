import { ProductCategoryV2 } from "@/types/product-v2";

export const pkrtData: ProductCategoryV2 = {
  slug: "pkrt",
  name: "PKRT",
  tagline: "Kesehatan Keluarga dengan Standar Farmasi",
  description: "Layanan maklon PKRT (Produk Kimia Rumah Tangga) terlengkap: hand sanitizer, hand wash, disinfectant, pembersih lantai, dan pewangi ruangan. Diformulasi dengan standar keamanan BPOM untuk menjaga kesehatan keluarga Indonesia.",
  heroImage: "/assets/produk/pkrt/hero-landss.webp",
  bgColor: "#E8F5E9",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Produk", href: "/produk/" },
    { label: "PKRT", href: "/produk/pkrt/" },
  ],
  comparisonOptions: ["Hand Sanitizer", "Hand Wash", "Disinfectant", "Floor Cleaner", "Room Spray", "Bar Soap", "Herbal Soap"],
  comparisonMatrix: {
    "Hand Sanitizer": {
      konsentrasi: "Alcohol 60-70%",
      haltbarkeit: "Kill Kuman Instan",
      marktposition: "Essential",
      moq: "3000 pcs",
      preisklasse: "Affordable",
      karakter: "Quick-dry, non-sticky, portable",
      bestFor: ["Daily Carry", "Office", "Public Places"],
      ingredients: ["Alcohol 70%", "Aloe Vera", "Glycerin"],
    },
    "Hand Wash": {
      konsentrasi: "Surfactant-based",
      haltbarkeit: "Pembersihan Harian",
      marktposition: "Essential",
      moq: "2000 pcs",
      preisklasse: "Affordable",
      karakter: "Gentle cleansing, moisturizing, fragrant",
      bestFor: ["Home Use", "Office", "Public Facility"],
      ingredients: ["Gentle Surfactants", "Triclosan Alternative", "Aloe Vera"],
    },
    "Disinfectant": {
      konsentrasi: "Active agents 0.5-1%",
      haltbarkeit: "Perlindungan Jangka Panjang",
      marktposition: "Professional",
      moq: "2000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Multi-surface, kill 99.9% bacteria",
      bestFor: ["Home", "Hospital", "Office", "School"],
      ingredients: ["Benzalkonium Chloride", "Citrus Oil", "Essential Oils"],
    },
    "Floor Cleaner": {
      konsentrasi: "Concentrated formula",
      haltbarkeit: "Pembersihan Mendalam",
      marktposition: "Household",
      moq: "2000 pcs",
      preisklasse: "Affordable",
      karakter: "Multi-purpose, degreasing, fragrant",
      bestFor: ["Home", "Hotel", "Restaurant", "Office"],
      ingredients: ["Surfactants", "Citrus Extract", "Fragrance"],
    },
    "Room Spray": {
      konsentrasi: "Fragrance oil 1-3%",
      haltbarkeit: "Aroma 2-4 Jam",
      marktposition: "Lifestyle",
      moq: "3000 pcs",
      preisklasse: "Affordable",
      karakter: "Instant freshening, long-lasting scent",
      bestFor: ["Home", "Car", "Office", "Bathroom"],
      ingredients: ["Fragrance Oil", "Alcohol", "Water"],
    },
    "Bar Soap": {
      konsentrasi: "Soap base with active",
      haltbarkeit: "Pembersihan Dasar",
      marktposition: "Mass Market",
      moq: "3000 pcs",
      preisklasse: "Affordable",
      karakter: "Cleansing, affordable, multiple use",
      bestFor: ["Household", "Industrial", "Hospital"],
      ingredients: ["Soap Base", "Active Agent", "Fragrance"],
    },
    "Herbal Soap": {
      konsentrasi: "Herbal soap base",
      haltbarkeit: "Perawatan Herbal",
      marktposition: "Natural",
      moq: "3000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Natural, traditional, therapeutic",
      bestFor: ["Family Use", "Traditional Care", "Daily Hygiene"],
      ingredients: ["Herbal Extracts", "Turmeric", "Lemongrass Oil"],
    },
  },
  products: [
    {
      id: "hand-sanitizer",
      name: "Hand Sanitizer",
      slug: "hand-sanitizer",
      heroImage: "/new asset/pkrt/hand-sanis.webp",
      galleryImages: ["/new asset/pkrt/hand-sanis.webp"],
      tags: ["Best Seller", "Essential", "Anti-Bacterial"],
      shortDescription: "Maklon Hand Sanitizer dengan alkohol 70% yang efektif membunuh 99.9% kuman dan bakteri. Formulasi lembut dengan Aloe Vera agar tidak membuat kulit tangan kering.",
      story: `Hand sanitizer telah menjadi kebutuhan utama sejak pandemi. Bukan lagi produkOpsional, tetapi telah menjadi bagian dari gaya hidup sehari-hari yang disebut "new normal".

Di Dreamlab, kami memformulasikan hand sanitizer yang tidak hanya efektif membunuh kuman, tetapi juga lembut di kulit. Kami menggunakan alkohol berkualitas farmasi dengan konsentrasi 70% yang terbukti efektif membunuh bakteri dan virus, sambil menambahkan Aloe Vera dan Glycerin untuk menjaga kelembapan kulit.

Produk ini dirancang untuk penggunaan berulang throughout hari tanpa menyebabkan iritasi atau kekeringan pada kulit. Tekstur yang cepat meresap (quick-dry) dan tidak lengket menjadikannya nyaman digunakan kapan saja dan di mana saja.`,
      seoParagraph: "Maklon Hand Sanitizer — jasa maklon handsanitizer alkohol 70% kill rate 99.9% kuman. Tersedia varian gel & spray dengan aroma segar. ✓ BPOM & Halal ✓ MOQ 1000 pcs. Konsultasi maklon PKRT bersama Dreamlab.",
      benefits: [
        "Alcohol 70% — Efektif membunuh 99.9% bakteri dan virus",
        "Quick-Dry Formula — Tidak lengket, langsung meresap",
        "Moisturizing — Mengandung Aloe Vera dan Glycerin agar tidak membuat kulit kering",
        "Multi-Size Options — Pocket (50ml), Travel (100ml), Family (500ml)",
        "Various Scents — Lavender, Fresh Citrus, Mild, Unscented",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Alcohol 70%", origin: "Pharmaceutical Grade", function: "Aktif membunuh kuman dan bakteri" },
        { name: "Aloe Vera Extract", origin: "Local", function: "Melembapkan dan menenangkan kulit" },
        { name: "Glycerin", origin: "Germany", function: "Humektan — menjaga kelembapan kulit" },
        { name: "Hydrogen Peroxide", origin: "Laboratory", function: "Menambah efektivitas membunuh kuman" },
      ],
      sizeOptions: ["50ml", "100ml", "250ml", "500ml"],
      bottleOptions: ["Spray Bottle", "Flip Top Bottle", "Custom Exclusive Packaging"],
      capOptions: ["Pump Cap", "Flip Cap", "Spray Cap", "Push Cap"],
      moq: "3000 pcs",
      productionTime: "1-2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "hand-wash",
      name: "Hand Wash",
      slug: "hand-wash",
      heroImage: "/new asset/pkrt/hand-wash.webp",
      galleryImages: ["/new asset/pkrt/hand-wash.webp"],
      tags: ["Daily Use", "Hygiene", "Refreshing"],
      shortDescription: "Maklon Hand Wash (liquid soap) untuk pembersihan tangan harian. Formula lembut dengan pH seimbang yang membersihkan efektif sambil merawat kulit.",
      story: `Cuci tangan dengan sabun adalah langkah pertama dan paling efektif dalam mencegah penyebaran penyakit. Bukan hanya tentang membunuh kuman, tetapi juga tentang mengangkat kotoran, minyak, dan bakteri yang menempel pada tangan throughout hari.

Di Dreamlab, kami menciptakan hand wash yang memberikan pengalaman membersihkan yang menyenangkan. Formula kami menggunakan surfaktan lembut yang efektif mengangkat kotoran tanpa merusak lapisan pelindung kulit alami. Dengan pH yang disesuaikan dengan kulit manusia, hand wash kami aman untuk penggunaan berulang.

Kami juga menambahkan bahan-bahan seringkutan seperti Aloe Vera, Vitamin E, dan minyak esensial untuk memberikan manfaat tambahan: kelembapan, nutrisi, dan aroma yang menyegarkan.`,
      seoParagraph: "Maklon Hand Wash solusi bagi brand yang ingin memasuki pasar produk kebersihan rumah tangga. Dengan formula gentle yang efektif membersihkan dan merawat kulit, hand wash Dreamlab cocok untuk penggunaan di rumah, kantor, dan fasilitas publik. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan. Tersedia dalam berbagai varian aroma dan ukuran bersertifikasi BPOM & Halal.",
      benefits: [
        "Gentle Formula — Surfaktan lembut yang tidak mengiritasi kulit",
        "pH Balanced — Sesuai dengan pH kulit manusia",
        "Antibacterial Option — Tersedia dengan atau tanpa agen antibakteri",
        "Rich Lather — Busa halus untuk pengalaman membersihkan yang memuaskan",
        "Moisturizing — Mengandung Aloe Vera dan Vitamin E",
        "Various Scents — Fruit, Floral, Fresh, Classic",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Gentle Surfactants", origin: "Germany", function: "Pembersihan efektif tanpa mengiritasi" },
        { name: "Aloe Vera Extract", origin: "Local", function: "Melembapkan dan menenangkan kulit" },
        { name: "Vitamin E", origin: "Switzerland", function: "Nutrisi dan perlindungan kulit" },
        { name: "Citric Acid", origin: "Laboratory", function: "Menyeimbangkan pH dan mengangkat mineral" },
      ],
      sizeOptions: ["200ml", "250ml", "500ml", "1000ml"],
      bottleOptions: ["Pump Bottle", "Refill Pouch", "Dispenser", "Flip Top"],
      capOptions: ["Pump Cap", "Flip Cap", "Dispenser Cap"],
      moq: "2000 pcs",
      productionTime: "1-2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "disinfectant-spray",
      name: "Disinfectant Spray",
      slug: "disinfectant-spray",
      heroImage: "/new asset/pkrt/hand-sanis.webp",
      galleryImages: ["/new asset/pkrt/hand-sanis.webp"],
      tags: ["Professional", "Multi-Surface", "Anti-Bacterial"],
      shortDescription: "Maklon Disinfectant Spray untuk membunuh kuman di permukaan rumah. Efektif untuk dapur, kamar mandi, dan area-area yang sering disentuh.",
      story: `Disinfectant bukan hanya untuk saat pandemi — ini adalah bagian penting dari menjaga kebersihan rumah sehari-hari. Permukaan-permukaan yang sering disentuh seperti gagang pintu, remote TV, keyboard, dan meja dapur menjadi tempat berkembang biaknya bakteri dan virus.

Di Dreamlab, kami memformulasikan disinfectant spray yang efektif membunuh 99.9% kuman pada permukaan keras sambil tetap aman digunakan di sekitar anak-anak dan hewan peliharaan. Kami menggunakan bahan aktif yang telah teruji secara klinis dan memastikan bahwa formula kami tidak meninggalkan residu berbahaya.

Produk ini sangat versatile — dapat digunakan pada berbagai permukaan termasuk plastik, metal, kaca, keramik, dan kayu. Dengan aroma segar yang tersisa setelah penyemburan, ruangan Anda tidak hanya bersih dari kuman tetapi juga harum.`,
      seoParagraph: "Maklon Disinfectant Spray solusi bagi brand yang ingin menawarkan produk pembersih profesional untuk rumah dan kantor. Dengan kemampuan membunuh 99.9% bakteri pada berbagai permukaan, disinfectant spray Dreamlab adalah investasi kebersihan yang tepat. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan. Tersedia dalam formula regular dan eco-friendly bersertifikasi BPOM & Halal.",
      benefits: [
        "Kill 99.9% Bacteria — Efektif membunuh bakteri, virus, dan jamur",
        "Multi-Surface — Aman untuk plastik, metal, kaca, keramik, kayu",
        "Quick Action — Kerja cepat dalam hitungan detik",
        "No Rinse Formula — Tidak perlu dibilas setelah aplikasi",
        "Safe for Home — Aman digunakan di rumah dengan anak dan hewan",
        "Long-Lasting Protection — Perlindungan hingga 24 jam pada permukaan",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Benzalkonium Chloride 0.1%", origin: "Laboratory", function: "Agen aktif membunuh kuman" },
        { name: "Citrus Oil Extract", origin: "Local", function: "Pembersih alami dan pewangi" },
        { name: "Isopropyl Alcohol", origin: "Pharmaceutical", function: "Pembawa dan antiseptik" },
        { name: "Essential Oils", origin: "Natural", function: "Aroma segar dan sifat antimikroba" },
      ],
      sizeOptions: ["100ml", "250ml", "500ml", "1000ml"],
      bottleOptions: ["Spray Bottle", "Trigger Spray", "Refill Pouch"],
      capOptions: ["Spray Cap", "Trigger Cap", "Flip Cap"],
      moq: "2000 pcs",
      productionTime: "1-2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "floor-cleaner",
      name: "Floor Cleaner",
      slug: "floor-cleaner",
      heroImage: "/new asset/pkrt/hand-wash.webp",
      galleryImages: ["/new asset/pkrt/hand-wash.webp"],
      tags: ["Household", "Deep Clean", "Multi-Purpose"],
      shortDescription: "Maklon Floor Cleaner untuk pembersihan lantai rumah yang efektif. Able mengangkat noda, lemak, dan kotoran membandel sekaligus memberikan aroma segar.",
      story: `Lantai adalah permukaan terbesar di rumah yang menanggung beban tertinggi: debu, kotoran, lemak dari masakan, noda dari hewan peliharaan, dan masih banyak lagi. Bukan hanya tentang penampilan, tetapi juga tentang kesehatan keluarga karena lantai yang kotor dapat menjadi tempat berkembang biaknya bakteri dan allergen.

Di Dreamlab, kami menciptakan floor cleaner yang mampu mengatasi berbagai jenis kotoran pada lantai. Formula concentrated kami dapat diencerkan sesuai kebutuhan, memberikan fleksibilitas dari pembersihan harian hingga perawatan intensif.

Kami menggunakan kombinasi surfaktan yang efektif mengangkat lemak, agen pembersih yang aman untuk berbagai jenis lantai (keramik, parket, marmer, ubin), dan pewangi alami yang memberikan aroma segar yang tahan lama. Produk ini juga aman untuk anak-anak karena menggunakan bahan-bahan yang ramah lingkungan.`,
      seoParagraph: "Maklon Floor Cleaner solusi bagi brand yang ingin memasuki pasar produk pembersih rumah tangga. Dengan formula concentrated yang efektif mengangkat kotoran dan lemak, floor cleaner Dreamlab memberikan hasil pembersihan yang memuaskan. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan. Tersedia dalam berbagai varian aroma yang segar bersertifikasi BPOM & Halal.",
      benefits: [
        "Concentrated Formula — Dapat diencerkan untuk penggunaan ekonomis",
        "Multi-Surface — Aman untuk keramik, parket, marmer, ubin",
        "Degreasing Power — Efektif mengangkat lemak dan noda membandel",
        "Anti-Bacterial — Membunuh kuman pada permukaan lantai",
        "Fresh Fragrance — Aroma segar yang tahan lama",
        "Child & Pet Safe — Aman untuk rumah dengan anak dan hewan",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Anionic Surfactants", origin: "Germany", function: "Pembersih utama untuk lemak dan kotoran" },
        { name: "Non-ionic Surfactants", origin: "Germany", function: "Pembersih yang lembut dan efektif" },
        { name: "Citrus Extract", origin: "Local", function: "Pembersih alami dan pewangi" },
        { name: "Sodium Lauryl Sulfate", origin: "Laboratory", function: "Agen berbusa dan pembersih" },
      ],
      sizeOptions: ["500ml", "750ml", "1000ml", "2000ml"],
      bottleOptions: ["Refill Pouch", "Trigger Bottle", "Jerigen"],
      capOptions: ["Flip Cap", "Trigger Cap", "Screw Cap"],
      moq: "2000 pcs",
      productionTime: "1-2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "room-spray",
      name: "Room Spray",
      slug: "room-spray",
      heroImage: "/new asset/pkrt/hand-sanis.webp",
      galleryImages: ["/new asset/pkrt/hand-sanis.webp"],
      tags: ["Aromatherapy", "Freshening", "Home Fragrance"],
      shortDescription: "Maklon Room Spray untuk menyegarkan aroma ruangan. Tersedia dalam berbagai varian wewangian dari fresh citrus hingga floral yang menenangkan.",
      story: `Aroma ruangan mempengaruhi suasana hati dan kesehatan secara signifikan. Ruangan dengan aroma segar memberikan kesan bersih dan nyaman, sementara aroma yang tidak sedap dapat membuat tidak nyaman dan mempengaruhi produktivitas.

Di Dreamlab, kami menciptakan room spray yang tidak hanya menyegarkan ruangan tetapi juga memberikan manfaat aromaterapi. Kami menggunakan fragrance oil berkualitas tinggi yang telah dikurasi untuk memberikan aroma yang tahan lama namun tidak terlalu kuat.

Produk ini sangat versatile — dapat digunakan di ruang tamu, kamar tidur, kamar mandi, dapur, bahkan di dalam mobil. Dengan desain packaging yang estetik, room spray juga dapat menjadi elemen dekoratif yang menambah keindahan ruangan.`,
      seoParagraph: "Maklon Room Spray solusi bagi brand yang ingin menawarkan produk pewangi ruangan berkualitas. Dengan berbagai pilihan aroma yang menarik, room spray Dreamlab memberikan kesegaran yang tahan lama untuk rumah, kantor, dan kendaraan. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan bersertifikasi BPOM & Halal.",
      benefits: [
        "Long-Lasting Fragrance — Aroma tahan hingga 4-6 jam",
        "Multiple Scents — Lebih dari 50 pilihan aroma (Citrus, Floral, Woody, Fresh)",
        "Instant Freshening — Segarkan ruangan dalam semprotan",
        "Alcohol-Based — Cepat menguap dan tidak meninggalkan noda",
        "Multi-Room Use — Untuk rumah, kantor, mobil, kamar hotel",
        "Custom Bottle — Pilihan packaging yang dapat dikustomisasi",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Fragrance Oil", origin: "Grasse, France / Local", function: "Aroma utama yang tahan lama" },
        { name: "Alcohol 95%", origin: "Pharmaceutical Grade", function: "Pembawa dan bahan penguap cepat" },
        { name: "Distilled Water", origin: "Laboratory", function: "Pengencer" },
        { name: "Fixative", origin: "Laboratory", function: "Memperpanjang ketahanan aroma" },
      ],
      sizeOptions: ["50ml", "100ml", "200ml", "300ml"],
      bottleOptions: ["Spray Bottle", "Custom Exclusive Packaging"],
      capOptions: ["Spray Cap", "Trigger Cap", "Magnetic Cap"],
      moq: "3000 pcs",
      productionTime: "1-2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "bar-soap",
      name: "Bar Soap",
      slug: "bar-soap-pkrt",
      heroImage: "/new asset/pkrt/bar-soap.webp",
      galleryImages: ["/new asset/pkrt/bar-soap.webp"],
      tags: ["Traditional", "Affordable", "Multi-Purpose"],
      shortDescription: "Maklon Bar Soap untuk pembersihan tubuh dan tangan. Tersedia dalam formula basic hingga herbal dengan berbagai ukuran dan bentuk.",
      story: `Bar soap mungkin adalah bentuk pembersih tertua yang digunakan manusia, namun hingga kini tetap relevan dan menjadi pilihan utama bagi banyak konsumen. Kelebihannya yang jelas: ekonomis, mudah disimpan, dan efektif untuk berbagai keperluan pembersihan.

Di Dreamlab, kami memproduksi bar soap dengan kualitas yang konsisten dan berbagai variasi. Dari basic cleaning soap hingga herbal soap dengan manfaat tambahan, kami menggunakan bahan-bahan berkualitas yang menghasilkan busa yang kaya dan membersihkan dengan efektif.

Kami juga menawarkan opsi untuk produk herbal yang menggunakan ekstrak tanaman lokal Indonesia seperti绿茶, kunyit, dan buah-buahan tropis yang memberikan manfaat tambahan seperti moisturizing, brightening, atau antibakteri.`,
      seoParagraph: "Maklon Bar Soap solusi bagi brand yang ingin menawarkan produk pembersih yang ekonomis dan terpercaya. Dengan berbagai pilihan formula dari basic hingga premium, bar soap Dreamlab cocok untuk pasar mass market hingga premium. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan bersertifikasi BPOM & Halal.",
      benefits: [
        "Economical — Harga terjangkau dengan hasil pembersihan yang baik",
        "Long-Lasting — Lebih tahan lama dibandingkan produk cair",
        "Multiple Uses — Untuk mandi, Cuci tangan,Cuci pakaian",
        "Eco-Friendly — Less plastic packaging, lebih ramah lingkungan",
        "Customizable Shape — Berbagai bentuk (oval, round, rectangle) dan emboss",
        "Herbal Options — Tersedia variant dengan ekstrak herbal lokal",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Soap Base", origin: "Local / Import", function: "Bahan dasar pembersih" },
        { name: "Coconut Oil", origin: "Local Indonesia", function: "Melembutkan dan berbusa" },
        { name: "Glycerin", origin: "Germany", function: "Melembapkan kulit" },
        { name: "Herbal Extracts", origin: "Local", function: "Manfaat tambahan (anti-bacterial, brightening)" },
      ],
      sizeOptions: ["50g", "75g", "100g", "125g", "150g"],
      bottleOptions: ["Wrapper", "Paper Box", "Shrink Wrap"],
      capOptions: ["N/A"],
      moq: "5000 pcs",
      productionTime: "1-2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "herbal-soap",
      name: "Herbal Soap",
      slug: "herbal-soap",
      heroImage: "/new asset/pkrt/herbal-soap.webp",
      galleryImages: ["/new asset/pkrt/herbal-soap.webp"],
      tags: ["Herbal", "Natural", "Traditional"],
      shortDescription: "Maklon Herbal Soap dengan ekstrak tanaman herbal Indonesia untuk manfaat kesehatan tradisional. Membersihkan sekaligus merawat kulit dengan bahan alami.",
      story: `Sabun herbal adalah warisan tradisi Indonesia yang kini dikemas dalam formula modern.

Herbal Soap Dreamlab menggabungkan kearifan lokal dengan teknologi manufaktur modern. Diformulasikan dengan ekstrak tanaman herbal pilihan seperti kunyit (anti-inflamasi), jahe (menghangatkan), sereh (antibakteri), dan atau绿茶 (antioksidan). Setiap batang sabun memberikan manfaat kesehatan tradisional yang telah teruji secara turun-temurun dalam kemasan yang higienis dan modern.`,
      seoParagraph: "Maklon Herbal Soap — jasa maklon sabun herbal dengan ekstrak tanaman tradisional Indonesia. Manfaat alami untuk kesehatan kulit keluarga. ✓ BPOM & Halal ✓ MOQ 3000 pcs.",
      benefits: [
        "Ekstrak Herbal Asli Indonesia: Kunyit, Jahe, Sereh,绿茶",
        "Anti-inflamasi Alami — menenangkan iritasi kulit",
        "Antibakteri — melindungi dari infeksi kulit",
        "Aroma Herbal Khas — wewangian alami yang menenangkan",
        "Kemasan Higienis — shrink wrap dan paper box",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Soap Base", origin: "Local/Import", function: "Basis sabun berkualitas" },
        { name: "Turmeric Extract", origin: "Local Indonesia", function: "Anti-inflamasi dan antiseptik" },
        { name: "Lemongrass Oil", origin: "Local", function: "Antibakteri dan aroma segar" },
      ],
      sizeOptions: ["50g", "75g", "100g", "125g"],
      bottleOptions: ["Wrapper", "Paper Box", "Shrink Wrap"],
      capOptions: ["N/A"],
      moq: "3000 pcs",
      productionTime: "1-2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
  ],
  trustStats: [
    { icon: "shield-check", value: "100%", label: "BPOM Compliance", description: "Semua produk PKRT telah terdaftar dan mendapat persetujuan BPOM" },
    { icon: "sparkles", value: "70%+", label: "Alcohol Content", description: "Konsentrasi alkohol optimal untuk membunuh kuman efektif" },
    { icon: "droplet", value: "6", label: "Product Variants", description: "Rangkaian lengkap produk kebersihan untuk rumah tangga" },
    { icon: "star", value: "98%", label: "Client Satisfaction", description: "Tingkat kepuasan tinggi dari mitra brand PKRT" },
  ],
  trustCategorySpecific: [
    { icon: "shield", label: "Kill 99.9% Kuman", description: "Formulasi yang terbukti efektif membunuh bakteri dan virus" },
    { icon: "heart", label: "Skin Friendly", description: "Mengandung pelembap agar tidak membuat kulit kering" },
    { icon: "leaf", label: "Natural Ingredients", description: "Pilihan bahan alami dan ekstrak tanaman lokal" },
    { icon: "home", label: "Home Safe", description: "Aman digunakan di rumah dengan anak dan hewan peliharaan" },
  ],
  edukasi: [
    {
      title: "Kapan Harus Menggunakan Hand Sanitizer vs Hand Wash?",
      content: `<p><strong>Hand Sanitizer</strong> cocok digunakan saat:</p>
      <ul>
        <li>Tidak ada akses ke air dan sabun (di perjalanan, di tempat umum).</li>
        <li>Setelah menyentuh permukaan yang sering disentuh orang lain ( gagang pintu, tombol lift).</li>
        <li>Saat bepergian dan tidak memungkinkan untuk mencuci tangan.</li>
        <li>Setelah dari tempat ramai seperti mall, transportasi umum.</li>
      </ul>
      <p><strong>Hand Wash</strong> lebih tepat digunakan saat:</p>
      <ul>
        <li>Setelah dari toilet — tangan jelas kotor dan butuh pembersihan maksimal.</li>
        <li>Sebelum dan sesudah makan — terutama saat makan dengan tangan.</li>
        <li>Setelah memasak —特に setelah menyentuh daging mentah.</li>
        <li>Saat tangan terlihat kotor atau berminyak.</li>
      </ul>`,
    },
    {
      title: "Cara Mencuci Tangan yang Benar sesuai Standar WHO",
      content: `<p>Ikuti 6 langkah mencuci tangan yang benar:</p>
      <ol>
        <li><strong>Basahi tangan</strong> dengan air bersih mengalir.</li>
        <li><strong>Tuangkan sabun</strong> secukupnya di telapak tangan.</li>
        <li><strong>Gosok telapak tangan</strong> satu sama lain.</li>
        <li><strong>Gosok punggung tangan</strong> kiri dengan telapak kanan, dan sebaliknya.</li>
        <li><strong>Gosok antar jari</strong> dan bersihkan area kuku.</li>
        <li><strong>Bilas dengan air bersih</strong> dan keringkan dengan handuk atau tissue.</li>
      </ol>
      <p>Lakukan selama minimal 20 detik untuk hasil maksimal.</p>`,
    },
    {
      title: "Perbedaan Disinfectant dan Antiseptic",
      content: `<p><strong>Disinfectant</strong> digunakan pada permukaan benda mati:</p>
      <ul>
        <li>Untuk lantai, meja, gagang pintu, permukaan keras lainnya.</li>
        <li>Konsentrasi bahan aktif lebih tinggi.</li>
        <li>Tidak aman digunakan langsung pada kulit.</li>
      </ul>
      <p><strong>Antiseptic</strong> digunakan pada jaringan hidup (kulit):</p>
      <ul>
        <li>Untuk tangan, luka kecil, area tubuh manusia.</li>
        <li>Konsentrasi lebih rendah dan lebih lembut.</li>
        <li>Aman untuk kulit manusia.</li>
      </ul>
      <p><strong>Contoh:</strong> Hand sanitizer adalah antiseptic, sementara floor cleaner adalah disinfectant.</p>`,
    },
    {
      title: "Tips Menjaga Kebersihan Rumah dari Kuman",
      content: `<p>Strategi pembersihan yang efektif:</p>
      <ul>
        <li><strong>Fokus pada area high-touch:</strong> Gagang pintu, remote, smartphone, keyboard — bersihkan lebih sering.</li>
        <li><strong>Gunakan produk yang tepat:</strong> Disinfectant untuk permukaan, hand wash untuk tangan.</li>
        <li><strong>Buat jadwal rutin:</strong> Pembersihan mingguan untuk area kurang sering disentuh.</li>
        <li><strong>Ventilasi ruangan:</strong> Udara segar membantu mengurangi konsentrasi patogen di udara.</li>
        <li><strong>Cuci tangan dengan konsisten:</strong> Langkah paling efektif mencegah penyebaran penyakit.</li>
      </ul>`,
    },
  ],
  testimonials: [
    {
      quote: "Hand sanitizer dari Dreamlab menjadi produk paling laris selama pandemi. Kualitasnya setara dengan brand internasional dengan harga yang lebih kompetitif.",
      name: "Budi",
      brand: "Brand Hygiene Plus",
      avatarImage: "",
      productImage: "/assets/images/client-pkrt-1.webp",
    },
    {
      quote: "Kami sangat puas dengan floor cleaner Dreamlab. Aroma segarnya tahan lama dan efektif membersihkan noda lemak di dapur kami.",
      name: "Siti",
      brand: "Brand Clean Home",
      avatarImage: "",
      productImage: "/assets/images/client-pkrt-2.webp",
    },
    {
      quote: "Room spray mereka memiliki wewangian yang sangat premium. Pelanggan kami sangat menyukai variasi aroma yang tersedia.",
      name: "Rina",
      brand: "Brand Aroma Segar",
      avatarImage: "",
      productImage: "/assets/images/client-pkrt-3.webp",
    },
  ],
  faqs: [
    {
      question: "Berapa MOQ untuk maklon produk PKRT di Dreamlab?",
      answer: "MOQ standar mulai dari 2000 pcs untuk hand wash dan disinfectant, 3000 pcs untuk hand sanitizer dan room spray, serta 5000 pcs untuk bar soap. Kami juga fleksibel untuk brand baru yang ingin memulai dengan volume lebih kecil.",
    },
    {
      question: "Apakah hand sanitizer Dreamlab aman untuk kulit sensitif?",
      answer: "Ya! Kami menambahkan Aloe Vera dan Glycerin dalam formula hand sanitizer untuk menjaga kelembapan kulit. Tersedia juga opsi formula tanpa alkohol untuk konsumen dengan sensitivitas tinggi.",
    },
    {
      question: "Apakah bisa membuat produk disinfectant dengan aroma khusus?",
      answer: "Tentu. Kami memiliki library fragrance dengan lebih dari 50 varian aroma yang bisa Anda pilih. Tim kami juga dapat membantu menciptakan aroma custom yang sesuai dengan identitas brand Anda.",
    },
    {
      question: "Berapa lama daya tahan produk PKRT?",
      answer: "Produk PKRT Dreamlab memiliki shelf life 2-3 tahun tergantung jenis produk. Kami menggunakan sistem pengawetan yang efektif untuk menjaga kualitas produk sepanjang masa simpannya.",
    },
    {
      question: "Apakah Dreamlab bisa membantu desain packaging produk PKRT?",
      answer: "Ya, tim desain kami dapat membantu menciptakan packaging yang menarik dan fungsional. Tersedia berbagai pilihan botol, label, dan desain yang dapat disesuaikan dengan branding Anda.",
    },
  ],
  relatedProducts: [
    { name: "Hand Sanitizer", slug: "hand-sanitizer", image: "/new asset/pkrt/hand-sanis.webp", category: "PKRT", categorySlug: "pkrt" },
    { name: "Hand Wash", slug: "hand-wash", image: "/new asset/pkrt/hand-wash.webp", category: "PKRT", categorySlug: "pkrt" },
    { name: "Bar Soap", slug: "bar-soap-pkrt", image: "/new asset/pkrt/bar-soap.webp", category: "PKRT", categorySlug: "pkrt" },
    { name: "Herbal Soap", slug: "herbal-soap", image: "/new asset/pkrt/herbal-soap.webp", category: "PKRT", categorySlug: "pkrt" },
  ],
};