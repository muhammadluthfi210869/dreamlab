import { ProductCategoryV2 } from "@/types/product-v2";

export const parfumData: ProductCategoryV2 = {
  slug: "parfum",
  name: "Parfum",
  tagline: "Wewangian Premium dengan Presisi Olfaktori",
  description: "Layanan maklon parfum eksklusif: Extrait de Parfum, Eau de Parfum, hingga Body Mist. Menggabungkan seni wewangian Grasse dengan teknologi fiksasi modern untuk ketahanan maksimal di iklim tropis.",
  heroImage: "/assets/images/aromatic-perfume-bottles-background-scaled.webp",
  bgColor: "#EAD7CD",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Produk", href: "/produk/" },
    { label: "Parfum", href: "/produk/parfum/" },
  ],
  comparisonOptions: ["EDP", "EDT", "EDC", "Extrait", "Body Mist", "Minyak Atsiri"],
  comparisonMatrix: {
    EDP: {
      konsentrasi: "15-20% fragrance oil",
      haltbarkeit: "Ketahanan 8-12 Jam",
      marktposition: "Premium",
      moq: "1000 pcs",
      preisklasse: "Mid-Premium",
      karakter: "Elegant, intens, sillage kuat",
      bestFor: ["Daily Premium", "Formal Event", "Signature Scent"],
      ingredients: ["Bergamot", "Jasmine", "Patchouli", "Sandalwood"],
    },
    EDT: {
      konsentrasi: "8-15% fragrance oil",
      haltbarkeit: "Ketahanan 4-6 Jam",
      marktposition: "Daily Wear",
      moq: "1000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Segar, ringan, energik",
      bestFor: ["Daily Use", "Office", "Outdoor"],
      ingredients: ["Citrus", "Lavender", "Marine Notes"],
    },
    EDC: {
      konsentrasi: "3-8% fragrance oil",
      haltbarkeit: "Ketahanan 2-4 Jam",
      marktposition: "Mass Market",
      moq: "1000 pcs",
      preisklasse: "Affordable",
      karakter: "Segar, modern, clean",
      bestFor: ["Sport", "Casual", "After Shower"],
      ingredients: ["Lemon", "Mint", "Green Tea"],
    },
    Extrait: {
      konsentrasi: "20-40% fragrance oil",
      haltbarkeit: "Ketahanan 24 Jam+",
      marktposition: "Luxury",
      moq: "500 pcs",
      preisklasse: "Ultra Premium",
      karakter: "Intense, sophisticated, eksklusif",
      bestFor: ["Luxury Brand", "Collector", "Night Event"],
      ingredients: ["Oud", "Amber", "Leather", "Rose Absolute"],
    },
    "Body Mist": {
      konsentrasi: "1-3% fragrance oil",
      haltbarkeit: "Kesegaran Instan",
      marktposition: "Lifestyle",
      moq: "3000 pcs",
      preisklasse: "Affordable",
      karakter: "Ringan, praktis, menyegarkan",
      bestFor: ["Daily Refresh", "Teen Market", "Souvenir"],
      ingredients: ["Aloe Vera", "Rose Water", "Jasmine"],
    },
    "Minyak Atsiri": {
      konsentrasi: "100% Pure Essential Oil",
      haltbarkeit: "Tergantung Penggunaan",
      marktposition: "Wellness / Spa",
      moq: "1000 pcs",
      preisklasse: "Mid-Premium",
      karakter: "Natural, therapeutic, potent",
      bestFor: ["Aromatherapy", "Wellness Brand", "Diffuser"],
      ingredients: ["Patchouli", "Cananga", "Vetiver"],
    },
  },
  products: [
    {
      id: "edp",
      name: "Eau de Parfum",
      slug: "eau-de-parfum",
      heroImage: "/assets/images/edpp.webp",
      galleryImages: [
        "/assets/images/edpp.webp",
        "/assets/images/edpp.webp",
        "/assets/images/edpp.webp",
      ],
      tags: ["Premium", "Tahan Lama", "Best Seller"],
      shortDescription: "Ingin punya brand Parfum EDP sendiri? Dreamlab adalah solusi untuk mengembangkan eau de parfum beraroma kuat dan tahan lama, pilihan premium untuk brand parfum kelas menengah ke atas.",
      story: `Identitas sebuah brand sering kali ditentukan oleh aroma yang ditinggalkannya.

Eau de Parfum (EDP) adalah standar emas bagi brand yang ingin menonjolkan kualitas dan eksklusivitas. Di Dreamlab, kami memformulasikan EDP dengan teknik fiksasi canggih yang memastikan aroma berkembang secara sempurna dari top, heart, hingga base notes. Produk ini dirancang khusus untuk memberikan performa maksimal di tengah kelembapan iklim tropis Indonesia.`,
      seoParagraph: "Maklon Eau de Parfum (EDP) — jasa maklon parfum premium fragrance oil 15-20% untuk ketahanan 8-12 jam di iklim tropis. ✓ BPOM & Halal ✓ MOQ 1000 pcs ✓ 500+ varian aroma. Konsultasi maklon parfum bersama Dreamlab.",
      benefits: [
        "Konsentrasi Tinggi — 15-20% fragrance oil premium grade A",
        "Ketahanan 8-12 Jam — formula stabil dan tahan lama",
        "Sillage & Projection Kuat — memberikan jejak aroma yang elegan",
        "Library Aroma Luas — akses ke 500+ varian aroma tren global",
        "Kemasan Eksklusif — berbagai pilihan botol kaca premium",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Bergamot", origin: "Italy", function: "Top note — kesegaran citrus yang cerah" },
        { name: "Jasmine Absolute", origin: "India", function: "Heart note — keanggunan floral yang intens" },
        { name: "Patchouli", origin: "Indonesia", function: "Base note — kedalaman dan fiksasi aroma" },
        { name: "Sandalwood", origin: "India", function: "Base note — kehangatan kayu yang lembut" },
      ],
      notesPyramid: {
        top: ["Bergamot", "Citrus", "Green Apple"],
        heart: ["Jasmine", "Rose", "Ylang-Ylang"],
        base: ["Patchouli", "Sandalwood", "Musk"],
      },
      sizeOptions: ["30ml", "50ml", "100ml"],
      bottleOptions: ["Glass Parfum Bottle", "Roll-On Parfum Bottle", "Spray Parfum Bottle", "Custom Exclusive Packaging"],
      capOptions: ["Spray Cap", "Magnetic Cap", "Crystal Cap"],
      moq: "1000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "edt",
      name: "Eau de Toilette",
      slug: "eau-de-toilette",
      heroImage: "/assets/images/edt.webp",
      galleryImages: ["/assets/images/edt.webp"],
      tags: ["Daily Wear", "Segar", "Populer"],
      shortDescription: "Ingin punya brand parfum EDT sendiri? Dreamlab adalah solusi untuk mengembangkan eau de toilette dengan ketahanan aroma menengah, pilihan paling seimbang antara harga dan performa.",
      story: `Kesegaran yang mengiringi produktivitas harian Anda tanpa terasa berlebihan.

Eau de Toilette (EDT) dirancang untuk memberikan impresi yang bersih dan menyegarkan. Di Dreamlab, kami mengkurasi formula EDT yang memiliki karakteristik "airy" dan "uplifting". Sangat cocok bagi brand yang menyasar pasar profesional muda yang aktif, di mana wewangian menjadi bagian dari rutinitas harian yang meningkatkan kepercayaan diri.`,
      seoParagraph: "Maklon Eau de Toilette (EDT) pilihan tepat bagi brand yang menargetkan pasar gaya hidup aktif. Dengan konsentrasi fragrance oil 8-15%, EDT Dreamlab memberikan keseimbangan antara harga dan kualitas. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan. Cocok untuk koleksi wewangian harian pria maupun wanita bersertifikasi BPOM & Halal.",
      benefits: [
        "Konsentrasi 8-15% — ideal untuk penggunaan harian",
        "Aroma Ringan & Segar — citrus, marine, dan green notes",
        "Ketahanan 4-6 Jam — memberikan kesegaran sepanjang hari kerja",
        "Harga Kompetitif — margin yang baik untuk target pasar luas",
        "Pilihan Botol Modern — desain minimalis yang sesuai tren",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Citrus Blend", origin: "Mediterranean", function: "Top note — kesegaran instan" },
        { name: "Lavender", origin: "France", function: "Heart note — aroma yang menenangkan" },
        { name: "Marine Accord", origin: "Lab", function: "Top note — sensasi udara laut yang segar" },
      ],
      notesPyramid: {
        top: ["Lemon", "Bergamot", "Marine"],
        heart: ["Lavender", "Green Tea", "Violet"],
        base: ["Cedar", "Musk", "Amber"],
      },
      sizeOptions: ["30ml", "50ml", "100ml"],
      bottleOptions: ["Glass Parfum Bottle", "Roll-On Parfum Bottle", "Spray Parfum Bottle", "Custom Exclusive Packaging"],
      capOptions: ["Spray Cap", "Magnetic Cap", "Screw Cap"],
      moq: "1000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "edc",
      name: "Eau de Cologne",
      slug: "eau-de-cologne",
      heroImage: "/assets/images/edc-scaled.webp",
      galleryImages: ["/assets/images/edc-scaled.webp"],
      tags: ["Fresh", "Affordable", "Sport"],
      shortDescription: "Ingin punya brand parfum cologne sendiri? Dreamlab adalah solusi untuk mengembangkan eau de cologne beraroma segar dan ringan, pilihan parfum harian yang disukai semua kalangan.",
      story: `Kesegaran instan dalam setiap semprotan untuk mengawali hari yang penuh energi.

Eau de Cologne (EDC) adalah pilihan populer bagi konsumen yang mencari wewangian ringan pasca mandi atau setelah berolahraga. Di Dreamlab, kami menciptakan EDC dengan basis citrus dan herba yang memberikan efek "cooling" seketika. Ini adalah produk entry-level yang sangat efektif untuk membangun basis konsumen setia bagi brand baru Anda.`,
      seoParagraph: "Maklon Eau de Cologne (EDC) solusi bagi brand yang ingin menjangkau pasar masal dengan produk yang menyegarkan. Dengan konsentrasi fragrance oil 3-8%, EDC Dreamlab menawarkan harga produksi yang sangat kompetitif dengan kualitas aroma yang tetap terjaga. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan bersertifikasi BPOM & Halal.",
      benefits: [
        "Konsentrasi 3-8% — harga produksi yang paling efisien",
        "Efek Menyegarkan — dominasi aroma citrus, mint, dan green tea",
        "Ketahanan 2-4 Jam — ideal untuk pemakaian berulang (re-spray)",
        "MOQ Fleksibel — memudahkan peluncuran brand parfum baru",
        "Varian Aroma Luas — tersedia lebih dari 200 pilihan aroma segar",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Lemon Oil", origin: "Sicily, Italy", function: "Top note — kesegaran energi yang cerah" },
        { name: "Mint", origin: "USA", function: "Top note — efek mendinginkan (cooling effect)" },
        { name: "Green Tea", origin: "Japan", function: "Heart note — aroma segar yang natural" },
      ],
      notesPyramid: {
        top: ["Lemon", "Mint", "Grapefruit"],
        heart: ["Green Tea", "Neroli", "Basil"],
        base: ["Cedar", "White Musk", "Light Woods"],
      },
      sizeOptions: ["50ml", "100ml", "150ml"],
      bottleOptions: ["Glass Parfum Bottle", "Roll-On Parfum Bottle", "Spray Parfum Bottle", "Custom Exclusive Packaging"],
      capOptions: ["Spray Cap", "Screw Cap"],
      moq: "1000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "extrait",
      name: "Extrait de Parfum",
      slug: "extrait-de-parfum",
      heroImage: "/assets/images/extrait-de-parfum-scaled.webp",
      galleryImages: ["/assets/images/extrait-de-parfum-scaled.webp"],
      tags: ["Luxury", "Intensive", "Premium"],
      shortDescription: "Ingin punya brand extrait de parfum sendiri? Dreamlab adalah solusi untuk mengembangkan parfum dengan konsentrasi minyak wangi tertinggi, kelas mewah untuk brand segmen luxury.",
      story: `Puncak dari seni olfaktori yang didedikasikan untuk mereka yang menginginkan kesempurnaan.

Extrait de Parfum bukan sekadar parfum, melainkan pernyataan kemewahan. Dengan konsentrasi fragrance oil tertinggi, setiap semprotan memberikan kedalaman aroma yang luar biasa dan daya tahan yang melampaui ekspektasi. Di Dreamlab, kami mengolah Extrait dengan bahan baku grade tertinggi untuk menciptakan mahakarya yang akan menjadi kebanggaan setiap kolektor.`,
      seoParagraph: "Maklon Extrait de Parfum layanan eksklusif bagi brand luxury yang menargetkan pasar ultra-premium. Dengan konsentrasi 20-40%, Extrait Dreamlab memberikan daya tahan aroma hingga 24 jam dengan sillage yang sangat berwibawa. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan bersertifikasi BPOM & Halal.",
      benefits: [
        "Konsentrasi Tertinggi — 20-40% fragrance oil untuk intensitas maksimal",
        "Ketahanan 24 Jam+ — wangi yang bertahan meski setelah seharian beraktivitas",
        "Bahan Baku Langka — akses ke Oud, Amber murni, dan Rose Absolute premium",
        "Formulasi Eksklusif — desain aroma khusus yang unik untuk brand Anda",
        "Packaging Ultra-Premium — botol kristal dan kotak eksklusif",
        "Margin Keuntungan Tinggi — produk dengan nilai jual premium",
      ],
      ingredients: [
        { name: "Oud (Gaharu)", origin: "Indonesia", function: "Base note — bahan baku prestisius yang intens" },
        { name: "Amber", origin: "Middle East", function: "Base note — memberikan kehangatan dan kedalaman" },
        { name: "Rose Absolute", origin: "Bulgaria", function: "Heart note — aroma bunga mawar yang mewah" },
        { name: "Leather Accord", origin: "Lab", function: "Base note — memberikan karakter yang kuat dan maskulin" },
      ],
      notesPyramid: {
        top: ["Saffron", "Cardamom", "Bergamot"],
        heart: ["Rose Absolute", "Oud", "Jasmine"],
        base: ["Amber", "Leather", "Musk", "Vanilla"],
      },
      sizeOptions: ["30ml", "50ml", "100ml"],
      bottleOptions: ["Glass Parfum Bottle", "Roll-On Parfum Bottle", "Spray Parfum Bottle", "Custom Exclusive Packaging"],
      capOptions: ["Crystal Stopper", "Magnetic Cap"],
      moq: "1000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "body-mist",
      name: "Body Mist",
      slug: "body-mist",
      heroImage: "/assets/images/body-mist-scaled.webp",
      galleryImages: ["/assets/images/body-mist-scaled.webp"],
      tags: ["Trending", "Social Media", "Teen Market"],
      shortDescription: "Ingin punya brand body mist sendiri? Dreamlab adalah solusi untuk mengembangkan body mist beraroma menyegarkan dengan harga terjangkau, produk wewangian favorit pasar anak muda.",
      story: `Kesegaran instan yang menjadi bagian dari ekspresi diri generasi muda.

Body Mist adalah produk yang paling cepat berputar di pasar karena kepraktisannya. Di Dreamlab, kami memastikan Body Mist brand Anda memiliki kualitas yang melampaui produk masal lainnya. Kami memformulasikan mist yang tidak hanya harum, tetapi juga lembut di kulit, menjadikannya pilihan sempurna untuk melengkapi koleksi lifestyle brand Anda.`,
      seoParagraph: "Maklon Body Mist solusi cerdas bagi brand yang ingin memasuki pasar parfum massal dengan volume tinggi. Dengan konsentrasi 1-3% dan harga produksi yang efisien, Body Mist Dreamlab sangat kompetitif untuk retail. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan. Tersedia ratusan pilihan aroma tren di media sosial bersertifikasi BPOM & Halal.",
      benefits: [
        "Formula Ringan — aman digunakan langsung pada kulit berkali-kali",
        "Harga Produksi Efisien — memungkinkan harga retail yang sangat menarik",
        "MOQ Strategis — mempermudah penetrasi pasar secara luas",
        "Tren Media Sosial — produk yang sangat mudah dipasarkan secara digital",
        "Varian Aroma Beragam — dari aroma manis (gourmand) hingga segar",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Aloe Vera Extract", origin: "Local", function: "Menjaga kelembapan kulit saat penyemprotan" },
        { name: "Rose Water", origin: "Turkey", function: "Memberikan sentuhan floral yang halus" },
        { name: "Jasmine Absolute", origin: "India", function: "Memberikan karakter wangi yang feminin" },
      ],
      sizeOptions: ["60ml", "100ml", "150ml"],
      bottleOptions: ["Glass Parfum Bottle", "Roll-On Parfum Bottle", "Spray Parfum Bottle", "Custom Exclusive Packaging"],
      capOptions: ["Spray Cap", "Fine Mist Nozzle", "Screw Cap"],
      moq: "1000 pcs",
      productionTime: "2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "essential-oil",
      name: "Minyak Atsiri",
      slug: "minyak-atsiri",
      heroImage: "/assets/images/Essential-Oil-scaled.webp",
      galleryImages: ["/assets/images/Essential-Oil-scaled.webp"],
      tags: ["Aromaterapi", "Natural", "Wellness"],
      shortDescription: "Ingin punya brand minyak atsiri sendiri? Dreamlab adalah solusi untuk mengembangkan essential oil untuk aromaterapi dan wellness, kategori yang tumbuh seiring tren self-care.",
      story: `Kembali ke alam dengan kemurnian wewangian yang memiliki manfaat terapi.

Minyak atsiri (Essential Oil) adalah jiwa dari industri aromaterapi. Dreamlab menyediakan akses ke bahan-bahan atsiri terbaik dari seluruh nusantara dan mancanegara. Kami memastikan setiap tetes minyak atsiri yang kami produksi memiliki profil kimia yang stabil dan kemurnian yang terjamin, memberikan nilai tambah bagi brand wellness Anda.`,
      seoParagraph: "Maklon Minyak Atsiri solusi bagi brand di segmen wellness, spa, dan home care. Kami menyediakan lebih dari 50 varian minyak atsiri murni seperti Patchouli, Cananga, dan Vetiver dengan standar kualitas farmasi. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan bersertifikasi BPOM & Halal.",
      benefits: [
        "100% Murni & Alami — tanpa campuran minyak mineral atau sintetis",
        "Kualitas Farmasi — aman untuk kebutuhan terapi dan wellness",
        "Multi-Purpose — cocok untuk diffuser, minyak pijat, atau bahan kosmetik",
        "Traceable Origin — bahan baku dari sumber yang dapat dilacak kemurniannya",
        "Custom Blend — jasa peracikan aroma khusus oleh pakar aromaterapi",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Patchouli Oil", origin: "Sulawesi", function: "Base note — aroma tanah yang dalam dan menenangkan" },
        { name: "Cananga Oil", origin: "Java", function: "Heart note — aroma floral eksotis khas Indonesia" },
        { name: "Vetiver Oil", origin: "Yogyakarta", function: "Base note — memberikan efek grounding dan relaksasi" },
      ],
      sizeOptions: ["10ml", "30ml", "50ml", "100ml"],
      bottleOptions: ["Amber Glass", "Blue Glass", "Roll-on"],
      capOptions: ["Dropper", "Orifice Reducer", "Roller Ball"],
      moq: "1000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
  ],
  trustStats: [
    { icon: "building", value: "127+", label: "Brand Parfum", description: "Telah dipercaya memproduksi lebih dari 127 brand parfum premium di Indonesia" },
    { icon: "shield-check", value: "CPKB Grade A", label: "Certified Factory", description: "Pabrik bersertifikat Cara Pembuatan Kosmetika Baik dengan standar internasional" },
    { icon: "flask", value: "500+", label: "Fragrance Library", description: "Koleksi konsentrat parfum premium dari supplier terkemuka di Grasse, Prancis" },
    { icon: "star", value: "97%", label: "Client Satisfaction", description: "Tingkat kepuasan tinggi dari mitra brand dalam kategori wewangian" },
  ],
  trustCategorySpecific: [
    { icon: "beaker", label: "Fiksasi Unggul", description: "Teknologi pengunci aroma untuk ketahanan maksimal di iklim tropis yang lembap" },
    { icon: "package", label: "Kustomisasi Total", description: "Pilihan botol, sprayer, dan tutup yang luas untuk estetika brand yang ikonik" },
    { icon: "clock", label: "Produksi Tepat Waktu", description: "Manajemen timeline produksi yang transparan dan disiplin tanpa kompromi kualitas" },
    { icon: "award", label: "Legalitas Terjamin", description: "Layanan satu pintu untuk pengurusan izin BPOM dan sertifikasi Halal MUI" },
  ],
  edukasi: [
    {
      title: "Memahami Konsentrasi Parfum untuk Kesuksesan Brand Anda",
      content: `<p>Pemilihan jenis parfum sangat menentukan positioning harga dan target konsumen:</p>
      <ul>
        <li><strong>Extrait de Parfum:</strong> Untuk pasar mewah yang mengutamakan prestise dan ketahanan ekstrem (24 jam).</li>
        <li><strong>Eau de Parfum (EDP):</strong> Pilihan paling aman untuk brand premium harian (8-12 jam).</li>
        <li><strong>Eau de Toilette (EDT):</strong> Sempurna untuk produk lifestyle yang digunakan saat beraktivitas pagi hingga siang.</li>
        <li><strong>Body Mist:</strong> Strategi volume tinggi untuk menjangkau pasar massal dan generasi muda.</li>
      </ul>`,
    },
    {
      title: "Tren 'Niche Fragrance' di Pasar Indonesia",
      content: `<p>Konsumen Indonesia kini mulai mencari aroma yang lebih unik dan personal:</p>
      <ul>
        <li><strong>Gourmand & Spices:</strong> Aroma manis seperti vanila atau rempah mulai menggeser dominasi aroma floral murni.</li>
        <li><strong>Unisex Appeal:</strong> Semakin banyak brand yang meluncurkan aroma netral gender yang bisa digunakan siapa saja.</li>
        <li><strong>Bahan Baku Lokal:</strong> Penggunaan Nilam (Patchouli) dan Gaharu (Oud) lokal memberikan nilai tambah 'Local Pride' yang kuat.</li>
      </ul>`,
    },
    {
      title: "Pentingnya Uji Stabilitas Parfum dalam Botol",
      content: `<p>Dreamlab memastikan kualitas parfum Anda tidak berubah seiring waktu:</p>
      <ul>
        <li><strong>Uji Sinar UV:</strong> Memastikan warna cairan parfum tidak berubah saat terpapar cahaya matahari.</li>
        <li><strong>Uji Interaksi Kemasan:</strong> Memastikan formula parfum tidak bereaksi negatif dengan bahan botol atau selang sprayer.</li>
        <li><strong>Uji Oksidasi:</strong> Menjamin aroma tetap stabil dari botol pertama hingga penggunaan terakhir oleh konsumen.</li>
      </ul>`,
    },
  ],
  testimonials: [
    {
      quote: "Bekerja sama dengan Dreamlab memberikan kami kepercayaan diri. Aroma EDP kami sangat stabil dan sillage-nya diakui pelanggan setara brand internasional.",
      name: "Nadia",
      brand: "Brand Fleur Indonesia",
      avatarImage: "",
      productImage: "/assets/images/client-product-1.webp",
    },
    {
      quote: "Tim R&D Dreamlab sangat sabar membantu kami menemukan signature scent yang unik. Launching pertama kami langsung sold out dalam satu minggu.",
      name: "Raka",
      brand: "Brand Aromatic Co.",
      avatarImage: "",
      productImage: "/assets/images/client-product-2.webp",
    },
    {
      quote: "Yang bikin saya stay sama Dreamlab adalah transparency-nya. Kalau ada masalah di production, mereka langsung inform dan punya solusi. Bukan hidden cost macam-macam.",
      name: "Anisa",
      brand: "Brand Essence Jakarta",
      avatarImage: "",
      productImage: "/assets/images/client-product-3.webp",
    },
  ],
  faqs: [
    {
      question: "Berapa MOQ untuk maklon parfum di Dreamlab?",
      answer: "MOQ untuk maklon parfum di Dreamlab mulai dari 500 pcs untuk Extrait de Parfum, dan 1000 pcs untuk EDP, EDT, dan EDC. Untuk Body Mist, MOQ dimulai dari 3000 pcs per varian.",
    },
    {
      question: "Apakah saya bisa request aroma khusus yang tidak ada di katalog?",
      answer: "Tentu! Tim fragrance specialist kami bisa meracik aroma eksklusif (signature scent) yang hanya dimiliki oleh brand Anda. Kami punya akses ke 500+ fragrance compounds dan bisa combine sesuai konsep Anda.",
    },
    {
      question: "Berapa lama daya tahan aroma parfum Dreamlab?",
      answer: "Daya tahan tergantung pada konsentrasi: EDC (2-4 jam), EDT (3-5 jam), EDP (6-12 jam), Extrait (12-24 jam). Semua formula kami sudah dioptimasi untuk iklim tropis Indonesia.",
    },
    {
      question: "Apakah Dreamlab membantu dengan legalitas BPOM dan Halal?",
      answer: "Ya! Sebagai layanan one-stop, kami handle semua dari formulasi, produksi, hingga pengurusan legalitas. BPOM notification dan Halal certification sudah termasuk dalam paket layanan kami.",
    },
    {
      question: "Berapa lama proses produksi dari awal hingga siap distribusi?",
      answer: "Timeline standar adalah 2-3 bulan dari sample approval hingga ready-to-ship. Untuk Extrait atau formula kompleks, bisa 3-4 bulan. BPOM registration process biasanya parallel 1-2 bulan.",
    },
    {
      question: "Apakah ada biaya tersembunyi dalam maklon parfum?",
      answer: "Tidak ada biaya tersembunyi. Kami berikan quotation detail termasuk biaya formula, packaging, labeling, BPOM registration, dan production. Tidak ada hidden charge setelah quotation disetujui.",
    },
  ],
  relatedProducts: [
    { name: "Body Mist", slug: "body-mist", image: "/assets/images/body-mist-scaled.webp", category: "Parfum", categorySlug: "parfum" },
    { name: "Eau de Toilette", slug: "eau-de-toilette", image: "/assets/images/edt.webp", category: "Parfum", categorySlug: "parfum" },
    { name: "Extrait de Parfum", slug: "extrait-de-parfum", image: "/assets/images/extrait-de-parfum-scaled.webp", category: "Parfum", categorySlug: "parfum" },
    { name: "Minyak Atsiri", slug: "minyak-atsiri", image: "/assets/images/Essential-Oil-scaled.webp", category: "Parfum", categorySlug: "parfum" },
  ],
};