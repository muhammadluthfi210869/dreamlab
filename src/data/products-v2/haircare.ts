import { ProductCategoryV2 } from "@/types/product-v2";

export const haircareData: ProductCategoryV2 = {
  slug: "haircare",
  name: "Hair Care",
  tagline: "Solusi Perawatan Rambut untuk Indonesia",
  description: "Layanan maklon haircare terlengkap: shampoo, conditioner, hair mask, hair serum, hair tonic, hair gel, scalp care, beard serum, pomade, dan styling products. Diformulasi khusus untuk kesehatan rambut dan kulit kepala di iklim tropis.",
  heroImage: "/assets/images/Hair-care.webp",
  bgColor: "#E7ECFE",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Produk", href: "/produk/" },
    { label: "Hair Care", href: "/produk/haircare/" },
  ],
  comparisonOptions: ["Shampoo", "Conditioner", "Hair Mask", "Hair Serum", "Hair Tonic", "Styling", "Hair Gel", "Scalp Care", "Beard Serum", "Pomade", "Hair Conditioner"],
  comparisonMatrix: {
    Shampoo: {
      konsentrasi: "Surfactant-based liquid",
      haltbarkeit: "Pembersihan Harian",
      marktposition: "Essential",
      moq: "1000 pcs",
      preisklasse: "Affordable",
      karakter: "Cleansing, hair growth support, gentle",
      bestFor: ["Daily Use", "Oily Hair", "Dandruff"],
      ingredients: ["SLES/SLES-free", "Argan Oil", "Tea Tree"],
    },
    Conditioner: {
      konsentrasi: "Cream/emulsion",
      haltbarkeit: "Pelembutan Pasca-Cuci",
      marktposition: "Essential",
      moq: "1000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Softening, detangling, smoothing",
      bestFor: ["Dry Hair", "Damaged Hair", "Long Hair"],
      ingredients: ["Silicones", "Cetyl Alcohol", "Argan Oil"],
    },
    "Hair Mask": {
      konsentrasi: "Rich cream, high treatment",
      haltbarkeit: "Perawatan Intensif Mingguan",
      marktposition: "Premium",
      moq: "1000 pcs",
      preisklasse: "Premium",
      karakter: "Deep repair, intensive treatment",
      bestFor: ["Damaged Hair", "Color-treated", "Dry/Brittle"],
      ingredients: ["Keratin", "Protein", "Deep Conditioning Agents"],
    },
    "Hair Serum": {
      konsentrasi: "Silicone-based liquid",
      haltbarkeit: "Perlindungan & Kilau Seketika",
      marktposition: "Premium",
      moq: "1000 pcs",
      preisklasse: "Premium",
      karakter: "Smoothing, heat protection, shine",
      bestFor: ["Frizz Control", "Heat Styling", "Shine"],
      ingredients: ["Dimethicone", "Argan Oil", "Vitamin E"],
    },
    "Hair Tonic": {
      konsentrasi: "Water-based liquid",
      haltbarkeit: "Nutrisi Akar Harian",
      marktposition: "Treatment",
      moq: "1000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Scalp health, hair growth stimulation",
      bestFor: ["Hair Loss", "Scalp Care", "Growth"],
      ingredients: ["Minoxidil Alternative", "Ginseng", "Redensyl"],
    },
    Styling: {
      konsentrasi: "Gel/Spray/Pomade",
      haltbarkeit: "Ketahanan Gaya Seharian",
      marktposition: "Lifestyle",
      moq: "1000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Hold, shape, texture",
      bestFor: ["Styling", "Volume", "Definition"],
      ingredients: ["Polymers", "PVP", "Natural Waxes"],
    },
    "Hair Gel": {
      konsentrasi: "Polymer gel",
      haltbarkeit: "Styling Tahan Lama",
      marktposition: "Lifestyle",
      moq: "1000 pcs",
      preisklasse: "Affordable",
      karakter: "Hold, non-flaking, alcohol-free",
      bestFor: ["Daily Styling", "Active Lifestyle", "Precision Hair"],
      ingredients: ["VP/VA Copolymer", "Glycerin", "Panthenol"],
    },
    "Scalp Care": {
      konsentrasi: "Active liquid treatment",
      haltbarkeit: "Perawatan Kulit Kepala Harian",
      marktposition: "Treatment",
      moq: "1000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Scalp health, anti-dandruff, growth",
      bestFor: ["Dandruff", "Hair Loss", "Oily Scalp"],
      ingredients: ["Zinc Pyrithione", "Salicylic Acid", "Ginseng"],
    },
    "Beard Serum": {
      konsentrasi: "Oil-based serum",
      haltbarkeit: "Perawatan Janggut Harian",
      marktposition: "Men's Grooming",
      moq: "1000 pcs",
      preisklasse: "Premium",
      karakter: "Nourishing, softening, growth",
      bestFor: ["Beard Care", "Itchy Beard", "Men's Grooming"],
      ingredients: ["Jojoba Oil", "Argan Oil", "Vitamin E"],
    },
    Pomade: {
      konsentrasi: "Wax/petrolatum base",
      haltbarkeit: "Styling Klasik Seharian",
      marktposition: "Traditional",
      moq: "1000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Hold, shine, reworkable",
      bestFor: ["Classic Styling", "Slick Back", "Pompadour"],
      ingredients: ["Beeswax", "Castor Oil", "Petrolatum"],
    },
    "Hair Conditioner": {
      konsentrasi: "Cream/emulsion",
      haltbarkeit: "Pelembutan Pasca-Cuci",
      marktposition: "Essential",
      moq: "1000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Softening, detangling, smoothing",
      bestFor: ["Dry Hair", "Damaged Hair", "Long Hair"],
      ingredients: ["Keratin", "Argan Oil", "Panthenol"],
    },
  },
  products: [
    {
      id: "shampoo",
      name: "Shampoo",
      slug: "shampoo",
      heroImage: "/assets/images/shampoo-scaled.webp",
      galleryImages: ["/assets/images/shampoo-scaled.webp"],
      tags: ["Daily", "Essential", "Cleansing"],
      shortDescription: "Maklon Shampoo untuk pembersihan rambut harian. Varian untuk oily hair, dry hair, dandruff, dan hair growth. Tersedia opsi sulfate-free.",
      story: `Shampoo yang tepat adalah fondasi dari seluruh rejimen perawatan rambut.

Bukan sekadar membersihkan, shampoo kami dirancang untuk menyeimbangkan ekosistem kulit kepala. Di Dreamlab, kami memformulasikan shampoo yang menjawab tantangan iklim tropis: kulit kepala yang mudah berminyak akibat kelembapan tinggi, rambut kering akibat polusi, dan kebutuhan akan pembersihan efektif namun lembut untuk penggunaan harian.`,
      seoParagraph: "Maklon Shampoo — jasa maklon sampo untuk rambut Indonesia: anti-ketombe, anti-rontok, perawatan kulit kepala berminyak. Tersedia sulfate-free & silicone-free. ✓ BPOM & Halal ✓ MOQ 1000 pcs. Konsultasi maklon shampoo bersama Dreamlab.",
      benefits: [
        "Varian Formula Spesifik: Berminyak, Kering, Berketombe, Rambut Rontok",
        "Bahan Aktif Premium: Tea Tree, Argan Oil, Keratin, Ginseng",
        "Opsi Sulfate-Free — lebih lembut untuk kulit kepala sensitif",
        "Perlindungan Anti-Polusi — ideal untuk gaya hidup urban",
        "Custom Aroma Eksklusif — dari fruit-based hingga floral notes",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Gentle Surfactants", origin: "Germany", function: "Effective cleansing without over-stripping" },
        { name: "Argan Oil", origin: "Morocco", function: "Moisturizing and shine enhancement" },
        { name: "Tea Tree Oil", origin: "Australia", function: "Antibacterial, dandruff control" },
      ],
      sizeOptions: ["100ml", "200ml", "350ml", "500ml"],
      bottleOptions: ["Pump Bottle", "Flip Top", "Squeeze Tube"],
      capOptions: ["Pump", "Flip Cap", "Child-proof Cap"],
      moq: "1000 pcs",
      productionTime: "2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "hair-mask",
      name: "Hair Mask",
      slug: "hair-mask",
      heroImage: "/assets/images/hair-mask-1.webp",
      galleryImages: ["/assets/images/hair-mask-1.webp"],
      tags: ["Premium", "Deep Repair", "Weekly Treatment"],
      shortDescription: "Maklon Hair Mask untuk perawatan intensif dan perbaikan kutikula. Formulasi kaya protein untuk rambut rusak dan kering akibat styling.",
      story: `Ketika conditioner harian tidak lagi cukup, hair mask adalah solusinya.

Hair mask Dreamlab dirancang untuk memberikan nutrisi mendalam hingga ke lapisan korteks rambut. Dengan konsentrasi bahan aktif yang lebih tinggi, produk ini secara efektif memperbaiki kutikula yang rusak, mengembalikan kelembapan alami, dan memperkuat serat rambut. Transformasi yang dapat dirasakan konsumen Anda hanya dalam satu kali penggunaan.`,
      seoParagraph: "Maklon Hair Mask solusi bagi brand yang ingin menawarkan perawatan rambut intensif grade salon. Dengan formula kaya protein dan agen pelembap, hair mask Dreamlab memperbaiki rambut rusak akibat proses kimia atau panas styling. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan. Tersedia varian: moisturizing, protein repair, dan color protection bersertifikasi BPOM & Halal.",
      benefits: [
        "Hidrasi Mendalam — konsentrasi agen kondisioner lebih tinggi",
        "Protein Repair — mengandung Keratin, Collagen, dan Silk Amino Acids",
        "Solusi Terarah: Kerusakan Kimia, Rambut Kering, Perlindungan Warna",
        "Perawatan Mingguan — nilai persepsi produk yang tinggi",
        "Opsi Packaging Premium: Jar atau Tube dengan Nozzle khusus",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Keratin", origin: "Germany", function: "Protein repair, strengthens hair fiber" },
        { name: "Hydrolyzed Silk Protein", origin: "Japan", function: "Smooths cuticle, adds shine" },
        { name: "Argan Oil", origin: "Morocco", function: "Deep moisturizing, anti-frizz" },
      ],
      sizeOptions: ["100ml", "200ml", "300ml"],
      bottleOptions: ["Jar", "Tube with Nozzle", "Sachet"],
      capOptions: ["Screw Lid", "Flip Cap", "Applicator Tip"],
      moq: "1000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "hair-serum",
      name: "Hair Serum",
      slug: "hair-serum",
      heroImage: "/new asset/haircare/maklon-hair-serum-dreamlab.png",
      galleryImages: ["/new asset/haircare/maklon-hair-serum-dreamlab.png"],
      tags: ["Smoothing", "Anti-Frizz", "Shine"],
      shortDescription: "Maklon Hair Serum untuk smoothing, anti-frizz, dan heat protection. Formula silicone-based untuk rambut berkilau sepanjang hari.",
      story: `Hair serum adalah produk yang mengubah rambut sulit diatur menjadi halus seketika.

Tanpa serum, rambut yang frizzy akan terus berjuang melawan kelembapan tinggi Indonesia setiap hari. Dengan serum yang tepat, Anda cukup mengaplikasikannya — dan rambut tetap halus, berkilau, dan terkendali apapun cuacanya. Ini adalah transformasi instan yang akan dirasakan langsung oleh konsumen Anda.

Di Dreamlab, kami memformulasikan serum yang memberikan: efek penghalusan instan tanpa rasa berat, perlindungan panas bagi yang sering menggunakan alat styling, kilau sehat tanpa terlihat berminyak, serta kontrol frizzy yang bertahan sepanjang hari.`,
      seoParagraph: "Maklon Hair Serum solusi untuk brand yang ingin menawarkan produk penghalus rambut dan anti-frizz untuk pasar Indonesia. Dengan formula berbasis silikon berkualitas tinggi yang memberikan kilau instan dan perlindungan panas, serum rambut Dreamlab adalah produk dengan nilai persepsi tinggi. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan. Tersedia varian: anti-frizz, perlindungan warna, dan deep repair bersertifikasi BPOM & Halal.",
      benefits: [
        "Penghalusan Instan — hasil terlihat jelas sejak penggunaan pertama",
        "Perlindungan Panas hingga 230°C untuk penggunaan alat styling panas",
        "Ketahanan Kelembapan — mengontrol rambut frizzy di iklim tropis",
        "Formula Ringan — tidak membuat rambut terasa berat atau berminyak",
        "Aman untuk Rambut Diwarnai",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Dimethicone", origin: "Germany", function: "Smoothing, frizz control, shine" },
        { name: "Argan Oil", origin: "Morocco", function: "Nourishing, anti-frizz" },
        { name: "Vitamin E", origin: "Switzerland", function: "Antioxidant protection, shine" },
      ],
      sizeOptions: ["30ml", "50ml", "100ml"],
      bottleOptions: ["Dropper", "Pump", "Spray"],
      capOptions: ["Rubber Dropper", "Pump Cap", "Spray Cap"],
      moq: "1000 pcs",
      productionTime: "2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "hair-tonic",
      name: "Hair Tonic",
      slug: "hair-tonic",
      heroImage: "/assets/images/shampoo-plan-scaled.webp",
      galleryImages: ["/assets/images/shampoo-plan-scaled.webp"],
      tags: ["Growth", "Scalp Care", "Daily Use"],
      shortDescription: "Maklon Hair Tonic untuk stimulasi pertumbuhan rambut dan kesehatan kulit kepala. Formulasi khusus untuk masalah kerontokan.",
      story: `Kulit kepala adalah fondasi dari rambut yang sehat, namun sering kali terabaikan dalam rutinitas perawatan.

Rambut yang kuat berawal dari kulit kepala yang sehat. Hair tonic yang diformulasikan dengan tepat membantu meningkatkan sirkulasi darah ke folikel rambut, memberikan nutrisi esensial yang dibutuhkan untuk pertumbuhan, mengurangi peradangan yang dapat menghambat pertumbuhan, dan menjaga lingkungan yang sehat bagi tumbuhnya rambut baru.

Di Dreamlab, kami memformulasikan hair tonic yang menggabungkan bahan tradisional (seperti ginseng dan lidah buaya) dengan bahan aktif modern (seperti Redensyl dan Procapil) untuk hasil nyata: tekstur rambut lebih tebal, kerontokan berkurang, dan pertumbuhan terlihat dalam 8-12 minggu penggunaan rutin.`,
      seoParagraph: "Maklon Hair Tonic solusi bagi brand yang ingin memasuki pasar scalp care dan produk pertumbuhan rambut. Dengan formula yang menggabungkan ekstrak alami dan bahan aktif yang teruji secara klinis, hair tonic Dreamlab efektif untuk pencegahan kerontokan dan stimulasi pertumbuhan rambut. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan. Tersedia varian: perawatan harian, perawatan intensif, dan anti-ketombe bersertifikasi BPOM & Halal.",
      benefits: [
        "Bahan Aktif Klinis: Redensyl, PROCAPIL, Anagain",
        "Ekstrak Tradisional: Ginseng, Aloe Vera, Biotin",
        "Kesehatan Kulit Kepala — mengurangi inflamasi dan memperbaiki sirkulasi",
        "Hasil Terlihat dalam 8-12 minggu penggunaan rutin",
        "Formula Tidak Lengket — tidak membuat kulit kepala berminyak",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Redensyl", origin: "Switzerland", function: "Stimulates hair follicle growth" },
        { name: "Ginseng Extract", origin: "Korea", function: "Improves blood circulation, strengthens roots" },
        { name: "Aloe Vera", origin: "Local", function: "Soothes scalp, provides nutrients" },
      ],
      sizeOptions: ["50ml", "100ml", "150ml"],
      bottleOptions: ["Dropper Bottle", "Spray Bottle", "Pump Bottle"],
      capOptions: ["Dropper", "Spray Cap", "Pump"],
      moq: "1000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "hair-gel",
      name: "Hair Gel",
      slug: "hair-gel",
      heroImage: "/new asset/haircare/hair-gel.webp",
      galleryImages: ["/new asset/haircare/hair-gel.webp"],
      tags: ["Styling", "Hold", "Daily"],
      shortDescription: "Maklon Hair Gel untuk penataan rambut dengan berbagai level hold. Formula non-flaking tanpa residu putih dengan perlindungan dari kelembapan.",
      story: `Hair gel adalah pilihan utama untuk gaya rambut yang rapi dan tahan lama sepanjang hari.

Hair Gel Dreamlab diformulasikan dengan teknologi polimer modern yang memberikan hold kuat tanpa membuat rambut kaku atau meninggalkan residu putih (flaking). Tersedia dalam berbagai level hold: light hold untuk gaya natural, medium hold untuk gaya kasual, dan strong hold untuk gaya yang presisi. Formula tahan kelembapan, cocok untuk iklim tropis Indonesia.`,
      seoParagraph: "Maklon Hair Gel — jasa maklon gel rambut dengan berbagai level hold (light, medium, strong). Formula non-flaking tanpa residu putih. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
      benefits: [
        "Pilihan Hold: Light, Medium, Strong — sesuai kebutuhan gaya",
        "Non-Flaking Formula — tanpa residu putih mengganggu",
        "Tahan Kelembapan — cocok untuk iklim tropis",
        "Cepat Kering — memudahkan proses penataan",
        "Bebas Alkohol — menjaga kelembapan alami rambut",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "VP/VA Copolymer", origin: "Germany", function: "Hold dan fleksibilitas" },
        { name: "Glycerin", origin: "Germany", function: "Melembapkan, mencegah kekeringan" },
        { name: "Panthenol", origin: "Germany", function: "Kondisioner ringan untuk rambut" },
      ],
      sizeOptions: ["50ml", "100ml", "150ml", "250ml"],
      bottleOptions: ["Tube", "Flip Top", "Pump"],
      capOptions: ["Flip Cap", "Pump", "Nozzle"],
      moq: "1000 pcs",
      productionTime: "2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "scalp-care",
      name: "Scalp Care",
      slug: "scalp-care",
      heroImage: "/new asset/haircare/sclap-care.webp",
      galleryImages: ["/new asset/haircare/sclap-care.webp"],
      tags: ["Scalp Treatment", "Growth", "Daily Care"],
      shortDescription: "Maklon Scalp Care untuk perawatan kulit kepala yang sehat. Menutrisi akar rambut, mengurangi ketombe, dan merangsang pertumbuhan rambut.",
      story: `Kulit kepala yang sehat adalah fondasi dari rambut yang kuat dan indah.

Scalp Care Dreamlab diformulasikan khusus untuk menyeimbangkan ekosistem kulit kepala. Dengan bahan aktif yang membersihkan pori-pori kulit kepala dari penumpukan sebum dan produk styling, mengurangi peradangan yang menghambat pertumbuhan rambut, serta memberikan nutrisi esensial ke folikel rambut. Cocok untuk masalah ketombe, kulit kepala berminyak, dan rambut rontok.`,
      seoParagraph: "Maklon Scalp Care — jasa maklon perawatan kulit kepala untuk mengatasi ketombe, rambut rontok, dan kulit kepala berminyak. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
      benefits: [
        "Menyeimbangkan Kulit Kepala — mengurangi produksi minyak berlebih",
        "Anti-Ketombe — formula dengan ZPT atau bahan aktif anti-jamur",
        "Merangsang Pertumbuhan — nutrisi untuk folikel rambut",
        "Formula Ringan — tidak membuat lepek atau berminyak",
        "Penggunaan Harian — aman untuk pemakaian rutin",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Zinc Pyrithione", origin: "Germany", function: "Anti-ketombe dan anti-jamur" },
        { name: "Salicylic Acid", origin: "Germany", function: "Eksfoliasi lembut kulit kepala" },
        { name: "Ginseng Extract", origin: "Korea", function: "Merangsang pertumbuhan rambut" },
      ],
      sizeOptions: ["50ml", "100ml", "150ml"],
      bottleOptions: ["Pump Bottle", "Dropper", "Spray Bottle"],
      capOptions: ["Pump", "Dropper", "Spray Cap"],
      moq: "1000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "beard-serum",
      name: "Beard Serum",
      slug: "beard-serum",
      heroImage: "/new asset/haircare/beard-serum.webp",
      galleryImages: ["/new asset/haircare/beard-serum.webp"],
      tags: ["Beard Care", "Men's Grooming", "Nourishing"],
      shortDescription: "Maklon Beard Serum untuk merawat dan menumbuhkan janggut. Formula ringan dengan minyak alami yang melembapkan dan menghaluskan.",
      story: `Janggut yang terawat adalah bagian dari penampilan maskulin yang modern.

Beard Serum Dreamlab diformulasikan dengan campuran minyak alami pilihan: Jojoba Oil yang menyerupai sebum alami kulit, Argan Oil untuk nutrisi, dan Vitamin E untuk perlindungan. Melembapkan kulit di bawah janggut, melembutkan rambut janggut yang kasar, dan merangsang pertumbuhan yang lebih lebat. Tidak berminyak dan cepat meresap.`,
      seoParagraph: "Maklon Beard Serum — jasa maklon serum janggut dengan minyak alami untuk pertumbuhan lebat dan perawatan. Formula ringan cepat meresap. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
      benefits: [
        "Minyak Alami Premium: Jojoba, Argan, Vitamin E",
        "Melembapkan Kulit — mencegah gatal dan ketombe janggut",
        "Melembutkan Janggut — membuat rambut janggut lebih halus",
        "Merangsang Pertumbuhan — nutrisi untuk folikel rambut",
        "Tidak Berminyak — cepat meresap tanpa residu",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Jojoba Oil", origin: "Israel", function: "Melembapkan, mirip sebum alami" },
        { name: "Argan Oil", origin: "Morocco", function: "Nutrisi intensif untuk rambut janggut" },
        { name: "Vitamin E", origin: "Switzerland", function: "Antioksidan dan perlindungan" },
      ],
      sizeOptions: ["30ml", "50ml", "100ml"],
      bottleOptions: ["Dropper Bottle", "Pump Bottle", "Roll-on"],
      capOptions: ["Rubber Dropper", "Pump Cap", "Roller Ball"],
      moq: "1000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "pomade",
      name: "Pomade",
      slug: "pomade",
      heroImage: "/new asset/haircare/pomade.webp",
      galleryImages: ["/new asset/haircare/pomade.webp"],
      tags: ["Styling", "Shine", "Strong Hold"],
      shortDescription: "Maklon Pomade untuk penataan rambut klasik dengan kilau alami. Tersedia basis minyak (oil-based) dan air (water-based) untuk berbagai kebutuhan.",
      story: `Pomade adalah produk styling klasik yang kembali populer di era modern.

Pomade Dreamlab tersedia dalam dua basis: water-based untuk kemudahan pembilasan dan oil-based untuk hold dan kilau yang lebih tahan lama. Formula kami memberikan tampilan rambut yang rapi dengan kilau alami (natural shine), tanpa membuat rambut terlihat kaku atau plastik. Cocok untuk gaya rambut klasik (slick back, pompadour) hingga gaya modern.`,
      seoParagraph: "Maklon Pomade — jasa maklon pomade rambut water-based dan oil-based untuk gaya klasik dan modern. Kilau alami dengan hold kuat. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
      benefits: [
        "Pilihan Basis: Water-based (mudah bilas) & Oil-based (hold tahan lama)",
        "Kilau Alami — tampilan rambut sehat tidak plastik",
        "Hold Kuat — gaya rambut bertahan seharian",
        "Aroma Maskulin — pilihan fragrance premium",
        "Mudah Diaplikasikan — tekstur creamy yang lembut",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Petrolatum/Beeswax", origin: "Germany", function: "Basis pomade untuk hold dan kilau" },
        { name: "Castor Oil", origin: "Local", function: "Melembapkan dan menutrisi rambut" },
        { name: "Fragrance Oil", origin: "France", function: "Aroma maskulin tahan lama" },
      ],
      sizeOptions: ["50g", "100g", "150g"],
      bottleOptions: ["Jar", "Tube", "Tin"],
      capOptions: ["Screw Lid", "Flip Cap", "Snap Lid"],
      moq: "1000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "hair-conditioner",
      name: "Hair Conditioner",
      slug: "hair-conditioner",
      heroImage: "/new asset/haircare/hair-conditioner.webp",
      galleryImages: ["/new asset/haircare/hair-conditioner.webp"],
      tags: ["Daily", "Conditioning", "Smoothing"],
      shortDescription: "Maklon Hair Conditioner untuk melembutkan dan merapikan rambut setelah keramas. Formula dengan bahan aktif yang menutrisi tanpa membebani rambut.",
      story: `Kondisioner adalah langkah penting setelah keramas yang tidak boleh dilewatkan.

Hair Conditioner Dreamlab diformulasikan untuk mengembalikan kelembapan rambut setelah proses pembersihan, menutup kutikula rambut yang terbuka, dan memberikan perlindungan dari kerusakan. Dengan bahan aktif seperti Keratin, Argan Oil, dan Pro-Vitamin B5, kondisioner kami membuat rambut terasa lembut, halus, dan mudah diatur tanpa membuat lepek.`,
      seoParagraph: "Maklon Hair Conditioner — jasa maklon kondisioner rambut dengan Keratin dan Argan Oil. Melembutkan, merapikan, dan menutrisi rambut. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
      benefits: [
        "Melembutkan & Merapikan — rambut mudah diatur tanpa kusut",
        "Menutup Kutikula — melindungi rambut dari kerusakan",
        "Keratin & Argan Oil — nutrisi dan perbaikan rambut",
        "Formula Ringan — tidak membuat rambut lepek atau berminyak",
        "Varian: Smoothing, Volume, Repair, Color Protection",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Cetyl Alcohol", origin: "Germany", function: "Emolien yang melembutkan rambut" },
        { name: "Argan Oil", origin: "Morocco", function: "Nutrisi dan kilau alami" },
        { name: "Panthenol", origin: "Germany", function: "Kondisioner yang memperbaiki rambut" },
      ],
      sizeOptions: ["100ml", "200ml", "350ml", "500ml"],
      bottleOptions: ["Tube", "Flip Top", "Pump Bottle"],
      capOptions: ["Flip Cap", "Pump", "Screw Cap"],
      moq: "1000 pcs",
      productionTime: "2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "hair-mist",
      name: "Hair Mist",
      slug: "hair-mist",
      heroImage: "/new asset/haircare/hair-mist.jpeg",
      galleryImages: ["/new asset/haircare/hair-mist.jpeg"],
      tags: ["Fragrance", "Refreshing", "Daily"],
      shortDescription: "Maklon Hair Mist untuk pewangi rambut ringan dan menyegarkan. Aroma yang tahan lama tanpa membuat rambut lepek.",
      story: `Hair mist adalah sentuhan akhir sempurna yang memberikan aroma segar dan kilau sehat sepanjang hari.

Di Dreamlab, kami merancang hair mist dengan formula ultra-ringan yang tidak meninggalkan residu atau membuat rambut lepek. Spray fine mist yang merata memastikan distribusi aroma yang konsisten dari akar hingga ujung rambut. Cocok untuk penggunaan harian, setelah keramas, atau sebagai refreshing spray di tengah hari.`,
      seoParagraph: "Maklon Hair Mist — jasa maklon pewangi rambut ringan dengan aroma tahan lama. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
      benefits: [
        "Aroma Tahan Lama — wangi segar yang bertahan hingga 8 jam",
        "Formula Ultra Ringan — tidak membuat rambut lepek atau kusut",
        "Spray Fine Mist — distribusi merata dari akar hingga ujung",
        "Multi-Fungsi — pewangi, refreshing, dan UV protection",
        "Varian Aroma: Floral, Fruity, Fresh, Oriental",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Fragrance Oil Blend", origin: "Grasse, France", function: "Aroma tahan lama yang halus" },
        { name: "Panthenol", origin: "Germany", function: "Melembutkan dan mengkilapkan rambut" },
        { name: "UV Filter", origin: "Switzerland", function: "Perlindungan rambut dari sinar matahari" },
      ],
      sizeOptions: ["50ml", "100ml", "150ml"],
      bottleOptions: ["Spray Bottle"],
      capOptions: ["Spray Cap", "Fine Mist Nozzle"],
      moq: "1000 pcs",
      productionTime: "2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
  ],
  trustStats: [
    { icon: "flask", value: "25+", label: "Varian Formulasi", description: "Varian formulasi lengkap dari pembersihan hingga perawatan medis kulit kepala" },
    { icon: "shield-check", value: "CPKB Grade A", label: "Certified Factory", description: "Fasilitas produksi dengan standar kebersihan dan keamanan industri global" },
    { icon: "zap", value: "Clinical", label: "Bahan Aktif", description: "Penggunaan bahan aktif yang teruji secara klinis untuk hasil yang nyata" },
    { icon: "star", value: "95%", label: "Kepuasan Klien", description: "Tingkat kepuasan mitra brand dalam kategori perawatan rambut" },
  ],
  trustCategorySpecific: [
    { icon: "zap", label: "Hasil Cepat", description: "Perbaikan yang terlihat dalam 2-4 minggu penggunaan rutin" },
    { icon: "shield", label: "Aman & Halal", description: "Jaminan keamanan BPOM dan sertifikasi Halal MUI untuk semua produk" },
  ],
  edukasi: [
    {
      title: "Kapan Anda Harus Menggunakan Conditioner vs Hair Mask?",
      content: `<p><strong>Conditioner</strong> — gunakan setelah setiap keramas:</p>
      <ul>
        <li>Memberikan pengkondisian cepat untuk mencegah rambut kusut dan kering.</li>
        <li>Diaplikasikan setelah shampoo, dibilas setelah 1-3 menit.</li>
        <li>Untuk menjaga kesehatan rambut harian secara rutin.</li>
      </ul>
      <p><strong>Hair Mask</strong> — gunakan 1-2 kali seminggu:</p>
      <ul>
        <li>Perawatan mendalam (deep treatment) untuk memperbaiki rambut yang rusak secara struktural.</li>
        <li>Diaplikasikan pada rambut lembap, dibiarkan 5-20 menit sebelum dibilas.</li>
        <li>Sangat direkomendasikan untuk rambut yang sering diwarnai, diproses kimia, atau sangat kering.</li>
      </ul>`,
    },
    {
      title: "Pentingnya Hair Tonic untuk Kesehatan Kulit Kepala",
      content: `<p>Hair tonic bekerja secara intensif pada akar rambut dan kulit kepala:</p>
      <ul>
        <li><strong>Sirkulasi Darah:</strong> Meningkatkan aliran darah ke folikel rambut untuk distribusi nutrisi yang lebih baik.</li>
        <li><strong>Mengurangi Inflamasi:</strong> Menenangkan peradangan pada kulit kepala yang dapat menghambat pertumbuhan rambut.</li>
        <li><strong>Reduksi DHT:</strong> Beberapa formula membantu mengurangi penumpukan DHT yang sering menjadi penyebab kerontokan.</li>
        <li><strong>Distribusi Nutrisi:</strong> Aplikasi topikal langsung memberikan nutrisi esensial ke area yang paling membutuhkan.</li>
      </ul>`,
    },
    {
      title: "Teknik Styling Tanpa Merusak Rambut: Praktik Terbaik",
      content: `<p>Menata rambut tidak harus berarti merusaknya jika dilakukan dengan benar:</p>
      <ul>
        <li><strong>Gunakan Pelindung Panas:</strong> Selalu gunakan serum pelindung panas sebelum menggunakan alat penata rambut suhu tinggi.</li>
        <li><strong>Berikan Jeda Istirahat:</strong> Jangan menata rambut dengan panas secara berlebihan setiap hari; berikan waktu rambut untuk pulih.</li>
        <li><strong>Pilih Produk Bebas Alkohol:</strong> Alkohol dalam produk styling dapat membuat batang rambut menjadi sangat kering.</li>
        <li><strong>Deep Conditioning Rutin:</strong> Lawan efek negatif styling dengan penggunaan masker rambut secara mingguan.</li>
      </ul>`,
    },
  ],
  testimonials: [
    {
      quote: "Masker rambut dari Dreamlab menjadi kunci bagi kami untuk mempertahankan loyalitas klien. Klien yang sebelumnya frustrasi dengan rambut rusak akhirnya menemukan solusi nyata.",
      name: "Budi",
      brand: "Brand Silk Lock Indonesia",
      avatarImage: "",
      productImage: "/assets/images/client-hair-1.webp",
    },
    {
      quote: "Hair tonic mereka memberikan hasil pertumbuhan yang terlihat nyata. Dalam 2 bulan, area rambut yang menipis mulai terisi kembali. Klien kami sangat puas.",
      name: "Sarah",
      brand: "Brand Mane Masters",
      avatarImage: "",
      productImage: "/assets/images/client-hair-2.webp",
    },
  ],
  faqs: [
    {
      question: "Berapa MOQ untuk maklon produk perawatan rambut di Dreamlab?",
      answer: "MOQ standar kami dimulai dari 1000 pcs per varian. Kami juga fleksibel untuk brand baru yang ingin meluncurkan rangkaian produk perawatan lengkap.",
    },
    {
      question: "Apakah Dreamlab bisa membuat shampoo bebas sulfat (sulfate-free)?",
      answer: "Tentu. Kami menyediakan opsi formula bebas sulfat (SLES-free) menggunakan surfaktan nabati yang jauh lebih lembut, sangat cocok untuk positioning 'Clean Beauty'.",
    },
    {
      question: "Berapa lama hasil penggunaan hair tonic mulai terlihat?",
      answer: "Dengan penggunaan harian yang konsisten, hasil yang terlihat biasanya mulai nampak dalam 8-12 minggu, termasuk pengurangan kerontokan dan peningkatan ketebalan rambut.",
    },
    {
      question: "Apakah hair serum Dreamlab cocok untuk semua jenis rambut?",
      answer: "Serum rambut dasar kami dirancang untuk memberikan kehalusan dan kilau pada semua jenis rambut. Kami juga dapat memformulasikan serum khusus untuk kebutuhan spesifik seperti rambut berwarna atau sangat keriting.",
    },
    {
      question: "Berapa lama masa simpan (shelf life) produk perawatan rambut?",
      answer: "Umumnya produk kami memiliki masa simpan 2-3 tahun dengan penyimpanan yang benar. Kami menggunakan sistem pengawet yang efektif untuk menjaga integritas produk sepanjang masa simpannya.",
    },
  ],
  relatedProducts: [
    { name: "Shampoo", slug: "shampoo", image: "/assets/images/shampoo-scaled.webp", category: "Hair Care", categorySlug: "haircare" },
    { name: "Hair Mask", slug: "hair-mask", image: "/assets/images/hair-mask-1.webp", category: "Hair Care", categorySlug: "haircare" },
    { name: "Hair Gel", slug: "hair-gel", image: "/new asset/haircare/hair-gel.webp", category: "Hair Care", categorySlug: "haircare" },
    { name: "Hair Conditioner", slug: "hair-conditioner", image: "/new asset/haircare/hair-conditioner.webp", category: "Hair Care", categorySlug: "haircare" },
    { name: "Pomade", slug: "pomade", image: "/new asset/haircare/pomade.webp", category: "Hair Care", categorySlug: "haircare" },
    { name: "Beard Serum", slug: "beard-serum", image: "/new asset/haircare/beard-serum.webp", category: "Hair Care", categorySlug: "haircare" },
  ],
};