import { ProductCategoryV2 } from "@/types/product-v2";
import { parfumData } from "./parfum";
import { bodycareData } from "./bodycare";
import { haircareData } from "./haircare";
import { babycareData } from "./babycare";
import { decorativeData } from "./decorative";
import { footcareData } from "./footcare";
import { pkrtData } from "./pkrt";

export const skincareData: ProductCategoryV2 = {
  slug: "skincare",
  name: "Skincare",
  tagline: "Dermatologi Klinis untuk Kulit Indonesia — Bukti Hasil Nyata",
  description: "Layanan maklon skincare untuk brand modern Indonesia. Menggabungkan science-backed ingredients dengan manufaktur grade farmasi bersertifikat CPKB dan Halal BPOM. Tersedia 50+ bahan aktif teruji klinis untuk mengatasi berbagai masalah kulit.",
  heroImage: "/new asset/produk/skincare/hero-section.webp",
  bgColor: "#EADBC8",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Produk", href: "/produk/" },
    { label: "Skincare", href: "/produk/skincare/" },
  ],
  comparisonOptions: ["Serum", "Toner", "Facial Wash", "Cleanser", "Sunscreen", "Moisturizer"],
  comparisonMatrix: {
    Serum: {
      konsentrasi: "Aktif tinggi (>10%)",
      haltbarkeit: "Stabilitas Tinggi (Daily Use)",
      marktposition: "Premium",
      moq: "1000 pcs",
      preisklasse: "Premium",
      karakter: "Targeted solution, fast absorption",
      bestFor: ["Anti-aging", "Brightening", "Acne"],
      ingredients: ["Niacinamide", "Vitamin C", "Hyaluronic Acid"],
    },
    Toner: {
      konsentrasi: "Aktif rendah (<5%)",
      haltbarkeit: "Penetrasi Cepat",
      marktposition: "Entry-Level",
      moq: "1000 pcs",
      preisklasse: "Mid-Range",
      karakter: "pH balancing, hydration",
      bestFor: ["Daily Prep", "Hydration", "Sensitive Skin"],
      ingredients: ["Aloe Vera", "Witch Hazel", "Centella"],
    },
    "Facial Wash": {
      konsentrasi: "Surfactant-based",
      haltbarkeit: "Pembersihan Instan",
      marktposition: "Mass Market",
      moq: "1000 pcs",
      preisklasse: "Affordable",
      karakter: "Deep cleanse, gentle",
      bestFor: ["Daily Cleansing", "Oily Skin", "Combination"],
      ingredients: ["Salicylic Acid", "Tea Tree", "Charcoal"],
    },
    Cleanser: {
      konsentrasi: "Micellar/Mild surfactant",
      haltbarkeit: "Residue-free",
      marktposition: "Mass Market",
      moq: "1000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Pembersihan Tanpa Bilas",
      bestFor: ["Sensitive", "Dry Skin", "Travel"],
      ingredients: ["Micelles", "Glycerin", "Cucumber"],
    },
    Sunscreen: {
      konsentrasi: "SPF 30-50+",
      haltbarkeit: "Perlindungan Jangka Panjang",
      marktposition: "Essential",
      moq: "1000 pcs",
      preisklasse: "Mid-Range",
      karakter: "UV protection, non-greasy",
      bestFor: ["Daily Protection", "Outdoor", "Makeup Base"],
      ingredients: ["Zinc Oxide", "Titanium Dioxide", "Avobenzone"],
    },
    Moisturizer: {
      konsentrasi: "Emollient-rich",
      haltbarkeit: "Hidrasi 8-12 Jam",
      marktposition: "Essential",
      moq: "1000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Hydration, barrier repair",
      bestFor: ["Dry Skin", "Combination", "Sensitive"],
      ingredients: ["Squalane", "Ceramides", "Shea Butter"],
    },
  },
  products: [
    {
      id: "acne-cream",
      name: "Acne Cream",
      slug: "acne-cream",
      heroImage: "/new asset/produk/skincare/bg-lands-card1.webp",
      galleryImages: ["/new asset/produk/skincare/bg-lands-card1.webp"],
      tags: ["Acne Treatment", "Targeted", "Best Seller"],
      shortDescription: "Maklon Acne Cream untuk mengatasi jerawat secara efektif. Formula dengan Salicylic Acid dan Tea Tree Oil yang membantu meredakan jerawat dan mengontrol minyak.",
      story: `Di dunia skincare, krim jerawat adalah solusi pertama yang dicari konsumen.

Acne Cream Dreamlab diformulasikan dengan bahan aktif yang terbukti klinis: Salicylic Acid untuk membersihkan pori, Tea Tree Oil sebagai antibakteri alami, dan Niacinamide untuk mengontrol minyak berlebih. Kami memastikan formula yang kuat namun tetap lembut di kulit, tanpa menyebabkan iritasi atau kekeringan berlebihan.`,
      seoParagraph: "Maklon Acne Cream — jasa maklon krim jerawat dengan Salicylic Acid dan Tea Tree Oil. Formula BPOM & Halal untuk mengatasi jerawat secara efektif. ✓ MOQ 1000 pcs ✓ Produksi 2-3 bulan.",
      benefits: [
        "Salicylic Acid 2% — membersihkan pori dan eksfoliasi",
        "Tea Tree Oil — antibakteri alami untuk jerawat",
        "Niacinamide — mengontrol minyak dan mencerahkan",
        "Non-comedogenic — tidak menyumbat pori",
        "Formula lembut tanpa iritasi berlebihan",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Salicylic Acid 2%", origin: "Germany", function: "Exfoliate, unclog pores" },
        { name: "Tea Tree Oil", origin: "Australia", function: "Antibacterial, acne control" },
        { name: "Niacinamide", origin: "Korea", function: "Oil control, brightening" },
      ],
      sizeOptions: ["15g", "20g", "30g"],
      bottleOptions: ["Tube", "Jar", "Airless Pump"],
      capOptions: ["Flip Cap", "Screw Lid", "Pump Cap"],
      moq: "1000 pcs",
      productionTime: "2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "moisturizing-cream",
      name: "Moisturizing Cream",
      slug: "moisturizing-cream",
      heroImage: "/new asset/produk/skincare/bg-lands-card1.webp",
      galleryImages: ["/new asset/produk/skincare/bg-lands-card1.webp"],
      tags: ["Hydration", "Daily Use", "Essential"],
      shortDescription: "Maklon Moisturizing Cream untuk hidrasi mendalam dan perbaikan skin barrier. Cocok untuk semua jenis kulit dengan tekstur ringan.",
      story: `Pelembap adalah langkah penutup yang mengunci seluruh nutrisi dalam kulit.

Moisturizing Cream Dreamlab tidak hanya memberikan kelembapan di permukaan, tetapi juga memperkuat struktur lipid kulit dengan Ceramide dan Squalane. Kami menciptakan produk yang membuat kulit terasa kenyal, sehat, dan terlindungi tanpa rasa berat.`,
      seoParagraph: "Maklon Moisturizing Cream — jasa maklon krim pelembap dengan Ceramide dan Squalane. Hidrasi 12 jam untuk semua jenis kulit. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
      benefits: [
        "Hidrasi 12 Jam — menjaga kelembapan sepanjang hari",
        "Ceramide Complex — memperkuat skin barrier",
        "Squalane — emollient alami yang ringan",
        "Non-comedogenic — aman untuk kulit berjerawat",
        "Tekstur ringan, cepat meresap",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Ceramide Complex", origin: "Germany", function: "Restore skin barrier" },
        { name: "Squalane", origin: "Spain", function: "Natural emollient" },
        { name: "Hyaluronic Acid", origin: "Germany", function: "Deep hydration" },
      ],
      sizeOptions: ["30g", "50g", "100g"],
      bottleOptions: ["Jar", "Airless Pump", "Tube"],
      capOptions: ["Screw Lid", "Pump Cap", "Flip Top"],
      moq: "1000 pcs",
      productionTime: "2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "brightening-cream",
      name: "Brightening Cream",
      slug: "brightening-cream",
      heroImage: "/new asset/produk/skincare/bg-lands-card1.webp",
      galleryImages: ["/new asset/produk/skincare/bg-lands-card1.webp"],
      tags: ["Brightening", "Premium", "Best Seller"],
      shortDescription: "Maklon Brightening Cream untuk mencerahkan kulit dan meratakan warna wajah. Formula dengan Niacinamide dan Vitamin C.",
      story: `Krim pencerah adalah produk yang paling dicari di pasar skincare Indonesia.

Brightening Cream Dreamlab diformulasikan dengan Niacinamide, Vitamin C, dan Alpha Arbutin untuk mencerahkan kulit secara bertahap dan aman. Kami memastikan formula yang efektif tanpa menyebabkan iritasi atau sensitivitas terhadap matahari.`,
      seoParagraph: "Maklon Brightening Cream — jasa maklon krim pencerah dengan Niacinamide dan Vitamin C. Mencerahkan kulit secara aman dan efektif. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
      benefits: [
        "Niacinamide 5% — mencerahkan dan meratakan warna kulit",
        "Vitamin C — antioxidant dan collagen boost",
        "Alpha Arbutin — mencerahkan secara alami",
        "SPF-friendly — bisa digunakan siang hari",
        "Formula lembut untuk semua jenis kulit",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Niacinamide 5%", origin: "Korea", function: "Brightening, pores minimizing" },
        { name: "Vitamin C", origin: "Swiss", function: "Antioxidant, collagen boost" },
        { name: "Alpha Arbutin", origin: "Japan", function: "Natural brightening" },
      ],
      sizeOptions: ["20g", "30g", "50g"],
      bottleOptions: ["Jar", "Airless Pump", "Tube"],
      capOptions: ["Screw Lid", "Pump Cap", "Flip Top"],
      moq: "1000 pcs",
      productionTime: "2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "eye-cream",
      name: "Eye Cream",
      slug: "eye-cream",
      heroImage: "/new asset/produk/skincare/bg-lands-card1.webp",
      galleryImages: ["/new asset/produk/skincare/bg-lands-card1.webp"],
      tags: ["Eye Care", "Anti-aging", "Premium"],
      shortDescription: "Maklon Eye Cream untuk merawat area mata yang sensitif. Mengurangi kantung mata, garis halus, dan lingkaran hitam.",
      story: `Area mata adalah bagian kulit paling tipis dan paling rentan menunjukkan tanda penuaan.

Eye Cream Dreamlab diformulasikan khusus untuk area sensitif di sekitar mata. Dengan Peptide, Caffeine, dan Hyaluronic Acid, krim ini membantu mengurangi kantung mata, menyamarkan garis halus, dan mencerahkan lingkaran hitam.`,
      seoParagraph: "Maklon Eye Cream — jasa maklon krim mata dengan Peptide dan Caffeine. Mengurangi kantung mata dan garis halus. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
      benefits: [
        "Peptide — mengurangi garis halus dan kerutan",
        "Caffeine — mengurangi kantung mata dan puffiness",
        "Hyaluronic Acid — hidrasi area mata",
        "Formula ultra-lembut untuk area sensitif",
        "Ophthalmologist tested",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Peptide Complex", origin: "Switzerland", function: "Anti-wrinkle, firming" },
        { name: "Caffeine", origin: "Germany", function: "Reduce puffiness, dark circles" },
        { name: "Hyaluronic Acid", origin: "Germany", function: "Deep hydration" },
      ],
      sizeOptions: ["15ml", "20ml", "30ml"],
      bottleOptions: ["Tube", "Airless Pump", "Jar"],
      capOptions: ["Flip Cap", "Pump Cap", "Screw Lid"],
      moq: "1000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "facial-serum",
      name: "Facial Serum",
      slug: "facial-serum",
      heroImage: "/new asset/produk/skincare/bg-lands-card2.webp",
      galleryImages: ["/new asset/produk/skincare/bg-lands-card2.webp"],
      tags: ["Premium", "Targeted", "Best Seller"],
      shortDescription: "Maklon Facial Serum dengan konsentrasi aktif tinggi untuk solusi kulit spesifik. Target market premium dengan efikasi nyata.",
      story: `Di dunia skincare, serum adalah titik di mana sains bertemu dengan ekspektasi konsumen.

Bukan sekadar melembapkan — tetapi benar-benar mentransformasi. Konsentrasi aktif yang lebih tinggi berarti hasil yang lebih cepat dan terukur. Di Dreamlab, kami memformulasikan serum yang bekerja secara presisi: konsentrasi aktif yang tepat, penetrasi optimal, dan stabilitas formula yang menjamin hasil nyata. Kami memastikan setiap tetes serum Anda memberikan nilai kompetitif yang kuat di pasar.`,
      seoParagraph: "Maklon Facial Serum — jasa maklon serum wajah konsentrasi aktif >10% untuk brightening anti-aging. Bahan baku Korea/Swiss grade farmasi. ✓ BPOM & Halal ✓ MOQ 1000 pcs ✓ Produksi 2-3 bulan. Konsultasi maklon serum gratis bersama Dreamlab.",
      benefits: [
        "Konsentrasi aktif tinggi (>10%) untuk hasil nyata",
        "Target spesifik: Brightening, Anti-aging, Acne, Hydration",
        "Tekstur Penetrasi Cepat — nyaman untuk iklim tropis",
        "Basis yang dapat dikustomisasi: Water-based, Oil-based, atau Silicone-based",
        "Sertifikasi BPOM & Halal untuk pasar Indonesia",
        "Opsi packaging premium: Dropper, Airless Pump, Sachet",
      ],
      ingredients: [
        { name: "Niacinamide 10%", origin: "Import (Korea/Japan)", function: "Brightening, pores minimizing" },
        { name: "Vitamin C 15%", origin: "Import (Swiss)", function: "Antioxidant, collagen boost" },
        { name: "Hyaluronic Acid", origin: "Germany", function: "Deep hydration, plumping" },
      ],
      sizeOptions: ["15ml", "30ml", "50ml"],
      bottleOptions: ["Dropper", "Airless Pump", "Sachet"],
      capOptions: ["Rubber Dropper", "Pump Cap", "Screw Cap"],
      moq: "1000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "facial-toner",
      name: "Facial Toner",
      slug: "facial-toner",
      heroImage: "/new asset/produk/skincare/bg-lands-card4.webp",
      galleryImages: ["/new asset/produk/skincare/bg-lands-card4.webp"],
      tags: ["Daily Use", "Hydration", "pH Balance"],
      shortDescription: "Maklon Facial Toner untuk menyeimbangkan pH kulit dan mempersiapkan kulit untuk tahap perawatan selanjutnya. Formula ringan tanpa alkohol.",
      story: `Toner adalah fondasi krusial bagi skin barrier yang sehat.

Fungsi utama toner kami bukan sekadar menyegarkan, tetapi menormalkan kembali pH kulit setelah pembersihan. pH kulit yang seimbang berarti barrier berfungsi optimal dan penyerapan bahan aktif selanjutnya menjadi lebih efektif. Di Dreamlab, kami memformulasikan toner tanpa alkohol dan pewangi berlebih yang dapat mengiritasi kulit sensitif.`,
      seoParagraph: "Maklon Facial Toner solusi bagi brand yang ingin menawarkan ritual skincare lengkap. Dengan konsentrasi aktif yang terukur, toner Dreamlab memberikan hidrasi dan keseimbangan pH tanpa membebani kulit. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan. Tersedia berbagai formula: hydrating, brightening, acne-control, dan soothing bersertifikasi BPOM & Halal.",
      benefits: [
        "Keseimbangan pH — menormalkan kondisi kulit setelah pembersihan",
        "Optimasi Penyerapan — mempersiapkan kulit untuk penyerapan serum",
        "Varian Lengkap: Hydrating, Brightening, Acne-control, Soothing",
        "Tekstur Ringan — cepat meresap dan tidak lengket",
        "Formula Tanpa Alkohol — menjaga kelembapan alami kulit",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Aloe Vera Extract", origin: "Local", function: "Soothing, hydration" },
        { name: "Centella Asiatica", origin: "Korea", function: "Calming, repair barrier" },
        { name: "Witch Hazel", origin: "USA", function: "Tightening, oil control" },
      ],
      sizeOptions: ["100ml", "150ml", "200ml"],
      bottleOptions: ["Boston Round", "Pump Bottle", "Misting Spray"],
      capOptions: ["Pump", "Spray Cap", "Flip Top"],
      moq: "1000 pcs",
      productionTime: "2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "facial-wash",
      name: "Facial Wash",
      slug: "facial-wash",
      heroImage: "/new asset/produk/skincare/bg-lands-card5.webp",
      galleryImages: ["/new asset/produk/skincare/bg-lands-card5.webp"],
      tags: ["Daily", "Deep Cleanse", "Populer"],
      shortDescription: "Maklon Facial Wash untuk pembersihan mendalam tanpa merusak kelembapan alami. Tersedia untuk berbagai jenis kulit.",
      story: `Pembersihan adalah tahap yang menentukan kesehatan kulit sepanjang hari.

Facial wash yang terlalu keras akan mengikis minyak alami kulit, sementara yang terlalu lembut dapat menyisakan residu penyumbat pori. Di Dreamlab, kami menciptakan keseimbangan yang tepat: pembersihan efektif tanpa sensasi tertarik, cukup lembut untuk penggunaan harian, namun tangguh melawan polutan lingkungan.`,
      seoParagraph: "Maklon Facial Wash solusi bisnis bagi brand yang ingin memasuki pasar skincare harian dengan produk berkualitas. Dengan formula yang disesuaikan untuk tipe kulit Indonesia, Dreamlab membantu brand menciptakan pembersih wajah yang relevan: kontrol minyak, perlindungan polusi, dan efek mencerahkan. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan dan sertifikasi BPOM & Halal.",
      benefits: [
        "Formula multi-tipe kulit: Berminyak, Kering, Sensitif, Kombinasi",
        "Pembersihan Mendalam tanpa mengikis kelembapan alami",
        "pH Seimbang untuk kesehatan skin barrier",
        "Bahan Aktif Pilihan: Salicylic Acid, Tea Tree, Charcoal, Vitamin C",
        "Opsi Tekstur: Gel, Foam, Cream, Low-foam",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Salicylic Acid 2%", origin: "Germany", function: "Exfoliate, unclog pores" },
        { name: "Tea Tree Oil", origin: "Australia", function: "Antibacterial, acne control" },
        { name: "Activated Charcoal", origin: "USA", function: "Deep cleanse, toxin absorption" },
      ],
      sizeOptions: ["50ml", "100ml", "150ml"],
      bottleOptions: ["Tube", "Pump Bottle", "Squeeze Tube"],
      capOptions: ["Flip Cap", "Pump", "Snap Cap"],
      moq: "1000 pcs",
      productionTime: "2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "micellar-cleansing-gel",
      name: "Micellar Cleansing Gel",
      slug: "micellar-cleansing-gel",
      heroImage: "/new asset/produk/skincare/bg-lands-card1.webp",
      galleryImages: ["/new asset/produk/skincare/bg-lands-card1.webp"],
      tags: ["Gentle", "No-Rinse", "Travel Friendly"],
      shortDescription: "Maklon Micellar Cleansing Gel — pembersih wajah praktis tanpa perlu bilas. Cocok untuk sensitive skin dan daily use yang gentle.",
      story: `Teknologi Micellar: bagaimana molekul pembersih cerdas bekerja tanpa perlu dibilas.

Konsepnya sederhana namun kuat: misel — molekul kecil yang menarik dan menjebak minyak, kotoran, dan sisa makeup — bekerja seperti magnet untuk mengangkat kotoran tanpa merusak pelindung alami kulit. Tidak perlu dibilas karena tidak meninggalkan residu berbahaya, dan tidak perlu digosok keras karena misel melakukan tugasnya dengan lembut.`,
      seoParagraph: "Maklon Micellar Cleansing Gel solusi bagi brand skincare yang ingin menawarkan produk pembersih yang praktis dan lembut. Formula micellar Dreamlab tidak memerlukan proses bilas, sangat ideal untuk gaya hidup aktif dan perjalanan. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan. Kami memformulasikan micellar gel dengan bahan aktif seperti Aloe Vera, Mentimun, dan Hyaluronic Acid bersertifikasi BPOM & Halal.",
      benefits: [
        "Teknologi Micellar — pembersihan efektif tanpa bilas",
        "Sangat Lembut — aman untuk semua jenis kulit termasuk sensitif",
        "Praktis & Efisien — ideal untuk profesional sibuk dan pelancong",
        "Bahan Aktif: Aloe Vera, Cucumber, Hyaluronic Acid",
        "Formula Bebas Alkohol dan Pewangi",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Micelles", origin: "Laboratory", function: "Attract and trap impurities" },
        { name: "Aloe Vera", origin: "Local", function: "Soothing, moisturizing" },
        { name: "Cucumber Extract", origin: "Local", function: "Cooling, refreshing" },
      ],
      sizeOptions: ["100ml", "150ml", "200ml"],
      bottleOptions: ["Pump Bottle", "Tube", "Jar", "Dropper Bottle", "Custom Exclusive Packaging"],
      capOptions: ["Pump", "Spray Cap", "Flip Top"],
      moq: "1000 pcs",
      productionTime: "2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "facial-sunscreen",
      name: "Facial Sunscreen",
      slug: "facial-sunscreen",
      heroImage: "/new asset/produk/skincare/bg-lands-card3.webp",
      galleryImages: ["/new asset/produk/skincare/bg-lands-card3.webp"],
      tags: ["Essential", "Protection", "Daily"],
      shortDescription: "Maklon Facial Sunscreen dengan perlindungan UV spektrum luas. Formula ringan, non-greasy, dan tanpa white cast, ideal untuk iklim tropis.",
      story: `Perlindungan matahari bukan lagi opsi, melainkan kebutuhan dasar kesehatan kulit.

Di iklim tropis Indonesia, sunscreen adalah investasi terbaik untuk mencegah penuaan dini dan hiperpigmentasi. Tantangan utamanya adalah menciptakan formula yang nyaman: tidak lengket, tidak menyebabkan jerawat, dan tidak meninggalkan noda putih (white cast). Sunscreen Dreamlab dirancang untuk memberikan perlindungan maksimal sekaligus kenyamanan sepanjang hari.`,
      seoParagraph: "Maklon Facial Sunscreen solusi bagi brand yang ingin menawarkan produk perlindungan esensial. Dengan pilihan SPF 30 hingga 50+ dan perlindungan PA++++, sunscreen Dreamlab melindungi kulit dari sinar UVA dan UVB. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan. Formula kami dirancang khusus agar stabil di suhu tinggi dan nyaman digunakan sebagai dasar makeup bersertifikasi BPOM & Halal.",
      benefits: [
        "Broad Spectrum Protection — melindungi dari sinar UVA & UVB",
        "Pilihan SPF 30, SPF 50, dan SPF 50+ PA++++",
        "Tekstur Non-Greasy — ringan dan nyaman di bawah sinar matahari",
        "Zero White Cast — tidak meninggalkan noda putih pada kulit",
        "Opsi Physical, Hybrid, atau Chemical sesuai target pasar",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Zinc Oxide", origin: "USA", function: "Physical UV filter, safe for sensitive skin" },
        { name: "Avobenzone", origin: "Germany", function: "Chemical UV filter, UVA protection" },
        { name: "Niacinamide", origin: "Korea", function: "Brightening, reduces UV damage" },
      ],
      sizeOptions: ["30ml", "40ml", "50ml"],
      bottleOptions: ["Jar", "Tube", "Airless Pump Bottle", "Stick", "Pump Bottle"],
      capOptions: ["Screw Cap", "Pump", "Click Lid"],
      moq: "1000 pcs",
      productionTime: "2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "facial-moisturizer",
      name: "Facial Moisturizer",
      slug: "facial-moisturizer",
      heroImage: "/new asset/produk/skincare/bg-lands-card1.webp",
      galleryImages: ["/new asset/produk/skincare/bg-lands-card1.webp"],
      tags: ["Essential", "Barrier Repair", "Moisturizing"],
      shortDescription: "Maklon Facial Moisturizer untuk hidrasi mendalam dan perbaikan skin barrier. Tersedia dalam tekstur gel-cream yang ringan untuk kulit Indonesia.",
      story: `Pelembap adalah langkah penutup yang mengunci seluruh nutrisi dalam kulit.

Tanpa hidrasi yang cukup, barrier kulit akan melemah dan rentan terhadap iritasi. Moisturizer Dreamlab tidak hanya memberikan kelembapan di permukaan, tetapi juga memperkuat struktur lipid kulit dengan bahan-bahan seperti Ceramide dan Squalane. Kami menciptakan produk yang membuat kulit terasa kenyal, sehat, dan terlindungi tanpa rasa berat.`,
      seoParagraph: "Maklon Facial Moisturizer solusi bagi brand yang ingin memberikan perawatan barrier kulit yang kuat. Dengan formula kaya emolien dan humektan, pelembap Dreamlab menjaga hidrasi kulit hingga 12 jam. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan. Cocok untuk semua jenis kulit bersertifikasi BPOM & Halal.",
      benefits: [
        "Hidrasi 12 Jam — menjaga kelembapan kulit sepanjang hari",
        "Barrier Repair — memperkuat pertahanan alami kulit",
        "Pilihan Tekstur: Light Gel, Creamy, Gel-Cream",
        "Bahan Aktif Premium: Ceramides, Squalane, Centella Asiatica",
        "Non-Comedogenic — tidak menyumbat pori-pori",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Ceramide Complex", origin: "Germany", function: "Restore skin barrier, moisture lock" },
        { name: "Squalane (Olive-derived)", origin: "Spain", function: "Natural emollient, skin softening" },
        { name: "Panthenol", origin: "Germany", function: "Soothing, healing support" },
      ],
      sizeOptions: ["30ml", "50ml", "100ml"],
      bottleOptions: ["Jar", "Airless Pump", "Tube"],
      capOptions: ["Screw Lid", "Pump Cap", "Flip Top"],
      moq: "1000 pcs",
      productionTime: "2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
  ],
  subCategories: [
    {
      id: "face-cream",
      name: "Face Cream",
      slug: "face-cream",
      description: "Face cream untuk perawatan kulit harian. Formula yang disesuaikan untuk hidrasi, perlindungan, dan nutrisi kulit sepanjang hari.",
      heroImage: "/new asset/produk/skincare/bg-lands-card1.webp",
      bgColor: "#EADBC8",
      products: [
        {
          id: "day-night-cream", name: "Day & Night Cream", slug: "day-night-cream",
          heroImage: "/new asset/produk/skincare/bg-lands-card1.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card1.webp"],
          tags: ["Daily Use", "Protection"],
          shortDescription: "Krim wajah dengan SPF dan perlindungan polusi.",
          story: `Face cream adalah lini pertahanan pertama kulit Anda.

Di Dreamlab, kami memformulasikan face cream yang tidak hanya melembapkan, tetapi juga memberikan perlindungan aktif terhadap polusi, sinar UV, dan radikal bebas. Dengan kombinasi SPF ringan, antioksidan, dan bahan pelembap yang cepat meresap, face cream kami menjaga kulit tetap sehat dan terlindungi sepanjang hari.`,
          seoParagraph: "Maklon Face Cream — jasa maklon krim wajah dengan SPF dan perlindungan polusi. Formula ringan, cepat meresap, cocok untuk iklim tropis Indonesia. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: [
            "Perlindungan SPF — melindungi dari sinar UV harian",
            "Anti-Polusi — shield terhadap partikel berbahaya",
            "Tekstur Ringan — cepat meresap tanpa rasa berat",
            "Antioksidan — Vitamin C dan E untuk perlindungan radikal bebas",
            "Cocok untuk semua jenis kulit",
            "Sertifikasi BPOM & Halal",
          ],
          ingredients: [
            { name: "SPF 15", origin: "Germany", function: "UV protection" },
            { name: "Vitamin E", origin: "Switzerland", function: "Antioxidant, skin protection" },
            { name: "Niacinamide", origin: "Korea", function: "Brightening, pore minimizing" },
          ],
          sizeOptions: ["30g", "50g"], bottleOptions: ["Jar", "Tube", "Airless Pump"], capOptions: ["Screw Lid", "Flip Cap", "Pump Cap"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "moisturizing-cream", name: "Moisturizing Cream", slug: "moisturizing-cream",
          heroImage: "/new asset/produk/skincare/bg-lands-card1.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card1.webp"],
          tags: ["Hydration", "Deep Moisture"],
          shortDescription: "Krim pelembap dengan Ceramide dan Squalane.",
          story: `Kulit Anda membutuhkan hidrasi optimal setiap saat.

Moisturizing Cream Dreamlab diformulasikan khusus untuk memberikan hidrasi mendalam dan mendukung perbaikan skin barrier. Dengan Ceramide Complex yang memperkuat skin barrier dan Squalane yang mengunci kelembapan, krim ini memberikan nutrisi intensif tanpa rasa lengket. Hasilnya: kulit yang terasa kenyal, lembut, dan terhidrasi sempurna.`,
          seoParagraph: "Maklon Moisturizing Cream — jasa maklon krim pelembap dengan Ceramide dan Squalane untuk hidrasi dan regenerasi kulit optimal. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: [
            "Deep Hydration Formula — mendukung regenerasi dan hidrasi kulit",
            "Ceramide Complex — memperkuat dan memperbaiki skin barrier",
            "Squalane — mengunci kelembapan sepanjang hari",
            "Tekstur Kaya — nutrisi intensif tanpa rasa lengket",
            "Cocok untuk kulit kering dan normal",
            "Sertifikasi BPOM & Halal",
          ],
          ingredients: [
            { name: "Ceramide Complex", origin: "Germany", function: "Restore skin barrier" },
            { name: "Squalane", origin: "Spain", function: "Moisture lock, emollient" },
            { name: "Hyaluronic Acid", origin: "Germany", function: "Deep hydration" },
          ],
          sizeOptions: ["30g", "50g"], bottleOptions: ["Jar", "Tube", "Airless Pump"], capOptions: ["Screw Lid", "Flip Cap", "Pump Cap"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "brightening-cream", name: "Brightening Cream", slug: "brightening-cream",
          heroImage: "/new asset/produk/skincare/bg-lands-card1.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card1.webp"],
          tags: ["Brightening", "Premium"],
          shortDescription: "Krim pencerah dengan Niacinamide dan Vitamin C.",
          story: `Krim pencerah adalah produk yang paling dicari di pasar skincare Indonesia.

Brightening Cream Dreamlab menggabungkan kekuatan Niacinamide 5% dan Vitamin C stabil untuk mencerahkan kulit secara bertahap dan aman. Formula kami bekerja menghambat produksi melanin berlebih sambil memberikan hidrasi mendalam. Hasilnya: kulit yang lebih cerah, merata, dan bercahaya alami tanpa iritasi.`,
          seoParagraph: "Maklon Brightening Cream — jasa maklon krim pencerah dengan Niacinamide dan Vitamin C untuk kulit cerah merata. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: [
            "Niacinamide 5% — mencerahkan dan meratakan warna kulit",
            "Vitamin C Stabil — antioxidant dan collagen boost",
            "Alpha Arbutin — menghambat produksi melanin",
            "Hasil Terlihat — kulit lebih cerah dalam 4-6 minggu",
            "Aman untuk penggunaan siang dan malam",
            "Sertifikasi BPOM & Halal",
          ],
          ingredients: [
            { name: "Niacinamide 5%", origin: "Korea", function: "Brightening, even skin tone" },
            { name: "Vitamin C (Ascorbyl Glucoside)", origin: "Swiss", function: "Antioxidant, collagen synthesis" },
            { name: "Alpha Arbutin", origin: "Japan", function: "Melanin inhibition" },
          ],
          sizeOptions: ["20g", "30g"], bottleOptions: ["Jar", "Tube", "Airless Pump"], capOptions: ["Screw Lid", "Flip Cap", "Pump Cap"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "eye-cream", name: "Eye Cream", slug: "eye-cream",
          heroImage: "/new asset/produk/skincare/bg-lands-card1.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card1.webp"],
          tags: ["Eye Care", "Anti-aging"],
          shortDescription: "Krim mata dengan Peptide dan Caffeine.",
          story: `Area mata adalah bagian kulit paling tipis dan paling rentan menunjukkan tanda penuaan.

Eye Cream Dreamlab diformulasikan khusus untuk area sensitif di sekitar mata. Dengan Peptide Complex yang merangsang produksi kolagen, Caffeine yang mengurangi puffiness dan lingkaran hitam, serta Hyaluronic Acid untuk hidrasi intensif. Krim mata ini membantu menyamarkan garis halus, kantung mata, dan tanda-tanda kelelahan.`,
          seoParagraph: "Maklon Eye Cream — jasa maklon krim mata dengan Peptide dan Caffeine untuk mengurangi kantung mata dan garis halus. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: [
            "Peptide Complex — mengurangi garis halus dan kerutan",
            "Caffeine — mengurangi puffiness dan dark circles",
            "Hyaluronic Acid — hidrasi intensif area mata",
            "Ultra-lembut — aman untuk area sensitif",
            "Ophthalmologist tested",
            "Sertifikasi BPOM & Halal",
          ],
          ingredients: [
            { name: "Peptide Complex (Matrixyl 3000)", origin: "Switzerland", function: "Anti-wrinkle, collagen stimulation" },
            { name: "Caffeine", origin: "Germany", function: "Reduce puffiness, dark circles" },
            { name: "Hyaluronic Acid", origin: "Germany", function: "Deep hydration, plumping" },
          ],
          sizeOptions: ["15ml", "20ml"], bottleOptions: ["Tube", "Airless Pump"], capOptions: ["Flip Cap", "Pump Cap"],
          moq: "1000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
      ],
    },
    {
      id: "face-mask",
      name: "Face Mask",
      slug: "face-mask",
      description: "Masker wajah dengan berbagai formula untuk perawatan intensif. Dari peel-off hingga sleeping mask untuk hasil spa di rumah.",
      heroImage: "/new asset/produk/skincare/bg-lands-card1.webp",
      bgColor: "#EADBC8",
      products: [
        {
          id: "peel-off-mask", name: "Peel Off Mask", slug: "peel-off-mask",
          heroImage: "/new asset/produk/skincare/bg-lands-card1.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card1.webp"],
          tags: ["Deep Cleanse", "Pore Care"],
          shortDescription: "Masker peel-off untuk mengangkat komedo dan membersihkan pori.",
          story: `Peel-off mask adalah cara paling memuaskan untuk membersihkan pori-pori secara mendalam.

Peel Off Mask Dreamlab diformulasikan dengan activated charcoal dan bamboo extract yang bekerja seperti magnet untuk menarik keluar kotoran, minyak berlebih, dan komedo dari dalam pori. Setelah masker mengering dan dikelupas, kulit terasa bersih, pori-pori terlihat lebih kecil, dan wajah tampak lebih cerah seketika.`,
          seoParagraph: "Maklon Peel Off Mask — jasa maklon masker peel-off dengan charcoal untuk deep cleanse dan komedo. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["Deep Pore Cleansing", "Blackhead Removal", "Activated Charcoal Formula", "Instant Brightening", "Cocok untuk kulit berminyak", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Activated Charcoal", origin: "Japan", function: "Deep pore cleansing" }, { name: "Bamboo Extract", origin: "Korea", function: "Gentle exfoliation" }, { name: "Tea Tree Oil", origin: "Australia", function: "Antibacterial" }],
          sizeOptions: ["50ml", "100ml"], bottleOptions: ["Jar", "Tube", "Airless Pump Bottle", "Stick", "Sheet Mask"], capOptions: ["Screw Lid", "Flip Cap", "Pump Cap", "Twist Cap"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "brightening-mask", name: "Brightening Mask", slug: "brightening-mask",
          heroImage: "/new asset/produk/skincare/bg-lands-card1.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card1.webp"],
          tags: ["Brightening", "Glow"],
          shortDescription: "Masker pencerah dengan Vitamin C dan Niacinamide.",
          story: `Brightening Mask adalah treatment intensif untuk kulit kusam dan tidak merata.

Masker pencerah Dreamlab menggabungkan Vitamin C stabil, Niacinamide, dan Licorice Extract dalam formula yang memberikan dosis tinggi bahan pencerah langsung ke kulit. Gunakan 2-3 kali seminggu untuk hasil maksimal: kulit yang lebih cerah, glowing, dan warna wajah yang merata.`,
          seoParagraph: "Maklon Brightening Mask — jasa maklon masker pencerah dengan Vitamin C dan Niacinamide untuk kulit glow. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["Vitamin C + Niacinamide", "Intensive Brightening Treatment", "Licorice Extract", "Hasil dalam 2-4 minggu", "Cocok untuk semua jenis kulit", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Vitamin C (Sodium Ascorbyl Phosphate)", origin: "Swiss", function: "Brightening, antioxidant" }, { name: "Niacinamide", origin: "Korea", function: "Even skin tone" }, { name: "Licorice Extract", origin: "China", function: "Natural brightening" }],
          sizeOptions: ["50ml", "100ml"], bottleOptions: ["Jar", "Tube", "Airless Pump Bottle", "Stick", "Sheet Mask"], capOptions: ["Screw Lid", "Flip Cap", "Pump Cap", "Twist Cap"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "wash-off-mask", name: "Wash Off Mask", slug: "wash-off-mask",
          heroImage: "/new asset/produk/skincare/bg-lands-card1.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card1.webp"],
          tags: ["Detox", "Clay"],
          shortDescription: "Masker lumpur yang dibilas untuk detoksifikasi kulit.",
          story: `Wash-off mask dengan clay adalah treatment detoksifikasi paling efektif untuk kulit.

Masker lumpur Dreamlab menggunakan kombinasi Kaolin Clay dan Bentonite Clay yang menyerap kelebihan minyak, menarik keluar toksin dari pori-pori, dan mengangkat sel kulit mati. Ditambah dengan Tea Tree Oil untuk efek antibakteri dan Aloe Vera untuk menenangkan kulit setelah detoksifikasi.`,
          seoParagraph: "Maklon Wash Off Mask — jasa maklon masker clay untuk detoksifikasi dan oil control. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["Kaolin + Bentonite Clay", "Deep Detoxification", "Oil Control", "Tea Tree Antibacterial", "Cocok untuk kulit berminyak & berjerawat", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Kaolin Clay", origin: "USA", function: "Gentle oil absorption" }, { name: "Bentonite Clay", origin: "USA", function: "Deep detox, impurity removal" }, { name: "Tea Tree Oil", origin: "Australia", function: "Antibacterial, acne control" }],
          sizeOptions: ["50g", "100g"], bottleOptions: ["Jar", "Tube", "Stick", "Sheet Mask"], capOptions: ["Screw Lid", "Flip Cap", "Twist Cap"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "sleeping-mask", name: "Sleeping Mask", slug: "sleeping-mask",
          heroImage: "/new asset/produk/skincare/bg-lands-card1.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card1.webp"],
          tags: ["Overnight", "Repair"],
          shortDescription: "Masker tidur untuk regenerasi kulit semalaman.",
          story: `Sleeping mask adalah treatment overnight yang bekerja saat Anda tidur.

Sleeping Mask Dreamlab diformulasikan dengan Hyaluronic Acid, Centella Asiatica, dan Ceramide yang memberikan hidrasi intensif dan perbaikan skin barrier sepanjang malam. Cukup aplikasikan sebagai langkah terakhir dalam rutinitas malam, biarkan meresap, dan bangun dengan kulit yang terasa kenyal, lembap, dan segar.`,
          seoParagraph: "Maklon Sleeping Mask — jasa maklon masker tidur untuk regenerasi dan hidrasi kulit semalaman. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["Overnight Hydration", "Centella Asiatica Repair", "Ceramide Barrier Support", "Bangun dengan kulit kenyal", "Cocok untuk semua jenis kulit", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Hyaluronic Acid", origin: "Germany", function: "Deep overnight hydration" }, { name: "Centella Asiatica", origin: "Korea", function: "Skin repair, soothing" }, { name: "Ceramide NP", origin: "Germany", function: "Barrier restoration" }],
          sizeOptions: ["50ml", "80ml"], bottleOptions: ["Jar", "Tube", "Airless Pump Bottle", "Pump Bottle"], capOptions: ["Screw Lid", "Flip Cap", "Pump Cap", "Pump"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
      ],
    },
    {
      id: "sunscreen",
      name: "Sunscreen",
      slug: "sunscreen",
      description: "Tabir surya dengan perlindungan UV spektrum luas. Formula ringan, non-greasy, tanpa white cast untuk iklim tropis.",
      heroImage: "/new asset/produk/skincare/bg-lands-card3.webp",
      bgColor: "#EADBC8",
      products: [
        {
          id: "physical-sunscreen", name: "Physical Sunscreen", slug: "physical-sunscreen",
          heroImage: "/new asset/produk/skincare/bg-lands-card3.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card3.webp"],
          tags: ["Mineral", "Sensitive Skin"],
          shortDescription: "Sunscreen mineral dengan Zinc Oxide untuk kulit sensitif.",
          story: `Physical sunscreen menggunakan filter mineral yang memantulkan sinar UV langsung dari kulit.

Physical Sunscreen Dreamlab diformulasikan dengan Zinc Oxide dan Titanium Dioxide yang memberikan perlindungan broad spectrum tanpa risiko iritasi kimia. Sangat ideal untuk kulit sensitif, rosacea, dan pasca-treatment. Formula kami juga diformulasikan tanpa white cast agar nyaman digunakan sehari-hari.`,
          seoParagraph: "Maklon Physical Sunscreen — jasa maklon sunscreen mineral Zinc Oxide untuk kulit sensitif, tanpa white cast. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["Zinc Oxide + Titanium Dioxide", "Broad Spectrum SPF 50 PA++++", "Zero White Cast Formula", "Ideal untuk kulit sensitif", "Langsung bekerja tanpa wait time", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Zinc Oxide", origin: "USA", function: "Physical UV filter" }, { name: "Titanium Dioxide", origin: "Germany", function: "Physical UV filter, UVA/UVB" }, { name: "Niacinamide", origin: "Korea", function: "Brightening, UV damage repair" }],
          sizeOptions: ["30ml", "40ml", "50ml"], bottleOptions: ["Jar", "Tube", "Airless Pump Bottle", "Pump Bottle"], capOptions: ["Screw Lid", "Flip Cap", "Pump Cap", "Pump"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "hybrid-sunscreen", name: "Hybrid Sunscreen", slug: "hybrid-sunscreen",
          heroImage: "/new asset/produk/skincare/bg-lands-card3.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card3.webp"],
          tags: ["Best Seller", "Dual Protection"],
          shortDescription: "Sunscreen hybrid gabungan filter mineral dan kimia.",
          story: `Hybrid sunscreen menggabungkan keunggulan filter mineral dan kimia dalam satu formula.

Hybrid Sunscreen Dreamlab menawarkan perlindungan terbaik dari kedua dunia: keamanan Zinc Oxide untuk kulit sensitif dan tekstur ringan dari filter kimia modern. Hasilnya: sunscreen yang nyaman dipakai, memberikan perlindungan maksimal, tanpa white cast, dan cocok untuk semua jenis kulit.`,
          seoParagraph: "Maklon Hybrid Sunscreen — jasa maklon sunscreen hybrid mineral+kimia, perlindungan maksimal tanpa white cast. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["Mineral + Chemical Filters", "SPF 50 PA++++", "Ringan tanpa white cast", "Cocok semua jenis kulit", "Tahan air dan keringat", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Zinc Oxide", origin: "USA", function: "Physical UV protection" }, { name: "Uvinul A Plus", origin: "Germany", function: "Chemical UVA filter" }, { name: "Tinosorb S", origin: "Germany", function: "Broad spectrum filter" }],
          sizeOptions: ["30ml", "40ml", "50ml"], bottleOptions: ["Jar", "Tube", "Airless Pump Bottle", "Pump Bottle"], capOptions: ["Screw Lid", "Flip Cap", "Pump Cap", "Pump"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "chemical-sunscreen", name: "Chemical Sunscreen", slug: "chemical-sunscreen",
          heroImage: "/new asset/produk/skincare/bg-lands-card3.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card3.webp"],
          tags: ["Lightweight", "No White Cast"],
          shortDescription: "Sunscreen kimia dengan tekstur ultra-ringan tanpa white cast.",
          story: `Chemical sunscreen menyerap sinar UV dan mengubahnya menjadi panas yang dilepaskan dari kulit.

Chemical Sunscreen Dreamlab menggunakan filter generasi terbaru (Uvinul, Tinosorb) yang memberikan perlindungan broad spectrum dengan tekstur ultra-ringan. Tanpa white cast, tanpa rasa berat, dan sangat nyaman di bawah makeup. Pilihan sempurna untuk konsumen yang ingin sunscreen yang terasa seperti tidak memakai apa-apa.`,
          seoParagraph: "Maklon Chemical Sunscreen — jasa maklon sunscreen kimia filter generasi terbaru, ultra-ringan tanpa white cast. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["Filter Generasi Terbaru", "Ultra-ringan, invisible finish", "SPF 50 PA++++", "Cocok di bawah makeup", "Tahan air", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Uvinul A Plus", origin: "Germany", function: "UVA filter, photostable" }, { name: "Tinosorb S", origin: "Germany", function: "Broad spectrum, photostable" }, { name: "Octocrylene", origin: "Germany", function: "UVB filter, stabilizer" }],
          sizeOptions: ["30ml", "40ml", "50ml"], bottleOptions: ["Jar", "Tube", "Airless Pump Bottle", "Pump Bottle"], capOptions: ["Screw Lid", "Flip Cap", "Pump Cap", "Pump"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "tone-up-sunscreen", name: "Tone Up Sunscreen", slug: "tone-up-sunscreen",
          heroImage: "/new asset/produk/skincare/bg-lands-card3.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card3.webp"],
          tags: ["Brightening", "K-Beauty"],
          shortDescription: "Sunscreen dengan efek tone-up untuk kulit lebih cerah instan.",
          story: `Tone-up sunscreen adalah tren K-Beauty yang menggabungkan perlindungan UV dengan efek mencerahkan instan.

Tone Up Sunscreen Dreamlab memberikan perlindungan SPF 50 PA++++ sekaligus efek brightening seketika berkat Niacinamide dan pearl pigments halus. Kulit terlihat lebih cerah, merata, dan bercahaya alami sejak aplikasi pertama. Cocok untuk konsumen yang ingin sunscreen sekaligus primer makeup.`,
          seoParagraph: "Maklon Tone Up Sunscreen — jasa maklon sunscreen dengan efek tone-up cerah instan, tren K-Beauty. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["SPF 50 PA++++", "Instant Brightening Effect", "Niacinamide + Pearl Pigments", "Bisa sebagai primer makeup", "K-Beauty Inspired", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Niacinamide", origin: "Korea", function: "Brightening, tone correction" }, { name: "Zinc Oxide", origin: "USA", function: "Physical UV protection" }, { name: "Pearl Pigments", origin: "Japan", function: "Instant glow effect" }],
          sizeOptions: ["30ml", "40ml", "50ml"], bottleOptions: ["Jar", "Tube", "Airless Pump Bottle", "Pump Bottle"], capOptions: ["Screw Lid", "Flip Cap", "Pump Cap", "Pump"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "sunscreen-gel", name: "Sunscreen Gel", slug: "sunscreen-gel",
          heroImage: "/new asset/produk/skincare/bg-lands-card3.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card3.webp"],
          tags: ["Oil-Free", "Refreshing"],
          shortDescription: "Sunscreen gel berbasis air untuk kulit berminyak.",
          story: `Sunscreen gel adalah solusi untuk mereka yang tidak tahan dengan tekstur krim sunscreen.

Sunscreen Gel Dreamlab diformulasikan dengan basis air yang memberikan sensasi cooling saat diaplikasikan. Oil-free, non-comedogenic, dan sangat ringan — sempurna untuk kulit berminyak dan berjerawat yang butuh perlindungan UV tanpa rasa berat atau berminyak.`,
          seoParagraph: "Maklon Sunscreen Gel — jasa maklon sunscreen gel oil-free berbasis air untuk kulit berminyak. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["Water-based Gel Formula", "Oil-Free, Non-comedogenic", "Cooling Sensation", "Cocok kulit berminyak & berjerawat", "SPF 50 PA++++", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Chemical UV Filters", origin: "Germany", function: "Lightweight UV protection" }, { name: "Hyaluronic Acid", origin: "Germany", function: "Hydration without oil" }, { name: "Aloe Vera", origin: "Local", function: "Soothing, cooling" }],
          sizeOptions: ["30ml", "40ml", "50ml"], bottleOptions: ["Jar", "Tube", "Airless Pump Bottle", "Pump Bottle"], capOptions: ["Screw Lid", "Flip Cap", "Pump Cap", "Pump"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
      ],
    },
    {
      id: "cleansing",
      name: "Cleansing",
      slug: "cleansing",
      description: "Pembersih wajah dari micellar gel hingga cleansing oil. Membersihkan efektif tanpa merusak skin barrier.",
      heroImage: "/new asset/produk/skincare/bg-lands-card1.webp",
      bgColor: "#EADBC8",
      products: [
        {
          id: "micellar-cleansing-gel", name: "Micellar Cleansing Gel", slug: "micellar-cleansing-gel",
          heroImage: "/new asset/produk/skincare/bg-lands-card1.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card1.webp"],
          tags: ["Gentle", "No-Rinse"],
          shortDescription: "Pembersih micellar tanpa perlu bilas.",
          story: `Teknologi Micellar: molekul pembersih cerdas yang bekerja seperti magnet untuk kotoran.

Micellar Cleansing Gel Dreamlab menggunakan misel — molekul kecil yang menarik dan menjebak minyak, kotoran, dan sisa makeup — tanpa perlu dibilas. Sangat praktis untuk gaya hidup aktif dan perjalanan. Formula kami juga diperkaya Aloe Vera dan Hyaluronic Acid agar kulit tetap terhidrasi setelah pembersihan.`,
          seoParagraph: "Maklon Micellar Cleansing Gel — jasa maklon pembersih micellar praktis tanpa bilas. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["Micellar Technology", "No-Rinse Formula", "Aloe Vera + Hyaluronic Acid", "Praktis untuk travel", "Cocok semua jenis kulit", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Micelles", origin: "Laboratory", function: "Attract and trap impurities" }, { name: "Aloe Vera", origin: "Local", function: "Soothing, moisturizing" }, { name: "Hyaluronic Acid", origin: "Germany", function: "Hydration" }],
          sizeOptions: ["100ml", "150ml"], bottleOptions: ["Jar", "Tube", "Airless Pump Bottle", "Pump Bottle"], capOptions: ["Pump", "Flip Cap", "Pump Cap"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "face-cleansing-oil", name: "Face Cleansing Oil", slug: "face-cleansing-oil",
          heroImage: "/new asset/produk/skincare/bg-lands-card1.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card1.webp"],
          tags: ["Double Cleanse", "Makeup Remover"],
          shortDescription: "Cleansing oil untuk mengangkat makeup dan sunscreen.",
          story: `Cleansing oil adalah langkah pertama dalam double cleansing yang efektif.

Face Cleansing Oil Dreamlab menggunakan campuran minyak nabati ringan (Jojoba, Grape Seed) yang melarutkan makeup, sunscreen, dan sebum berlebih tanpa membuat kulit berminyak. Formula emulsifying yang berubah menjadi susu saat terkena air, membilas bersih tanpa residu.`,
          seoParagraph: "Maklon Face Cleansing Oil — jasa maklon cleansing oil untuk double cleanse dan makeup remover. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["Jojoba + Grape Seed Oil", "Emulsifying Formula", "Effective Makeup Remover", "No Oily Residue", "Double Cleansing Step 1", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Jojoba Oil", origin: "Israel", function: "Lightweight cleansing oil" }, { name: "Grape Seed Oil", origin: "France", function: "Dissolves makeup, sebum" }, { name: "Vitamin E", origin: "Switzerland", function: "Antioxidant protection" }],
          sizeOptions: ["100ml", "150ml"], bottleOptions: ["Jar", "Tube", "Airless Pump Bottle", "Pump Bottle"], capOptions: ["Pump", "Flip Cap", "Pump Cap"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "milk-cleanser", name: "Milk Cleanser", slug: "milk-cleanser",
          heroImage: "/new asset/produk/skincare/bg-lands-card1.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card1.webp"],
          tags: ["Gentle", "Dry Skin"],
          shortDescription: "Pembersih susu lembut untuk kulit kering dan sensitif.",
          story: `Milk cleanser adalah pembersih paling lembut yang bisa Anda gunakan.

Milk Cleanser Dreamlab memiliki tekstur krim-susu yang kaya namun sangat lembut. Membersihkan kotoran dan makeup ringan sambil memberikan hidrasi tambahan. Sangat ideal untuk kulit kering, sensitif, dan mature yang tidak tahan dengan pembersih berbusa.`,
          seoParagraph: "Maklon Milk Cleanser — jasa maklon pembersih susu lembut untuk kulit kering dan sensitif. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["Creamy Milk Texture", "Ultra-Gentle Formula", "Hydrating While Cleansing", "Ideal untuk kulit kering & sensitif", "No Foam, No Tightness", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Milk Proteins", origin: "Germany", function: "Gentle cleansing, nourishing" }, { name: "Glycerin", origin: "Germany", function: "Humectant, moisture retention" }, { name: "Cucumber Extract", origin: "Local", function: "Cooling, soothing" }],
          sizeOptions: ["100ml", "150ml"], bottleOptions: ["Jar", "Tube", "Airless Pump Bottle", "Pump Bottle"], capOptions: ["Pump", "Flip Cap", "Pump Cap"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "cleansing-balm", name: "Cleansing Balm", slug: "cleansing-balm",
          heroImage: "/new asset/produk/skincare/bg-lands-card1.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card1.webp"],
          tags: ["Premium", "Melting"],
          shortDescription: "Cleansing balm yang meleleh mengangkat makeup membandel.",
          story: `Cleansing balm adalah pembersih premium yang berubah dari balm padat menjadi minyak saat menyentuh kulit.

Cleansing Balm Dreamlab diformulasikan dengan Shea Butter dan minyak esensial yang meleleh sempurna untuk melarutkan makeup waterproof, sunscreen, dan kotoran seharian. Sensasi spa yang mewah di rumah, dengan hasil pembersihan yang mendalam namun tetap lembut.`,
          seoParagraph: "Maklon Cleansing Balm — jasa maklon balm pembersih premium yang meleleh mengangkat makeup waterproof. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["Shea Butter Base", "Melts on Contact", "Waterproof Makeup Remover", "Spa-like Experience", "Emulsifying, rinses clean", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Shea Butter", origin: "Africa", function: "Rich cleansing base" }, { name: "Sweet Almond Oil", origin: "Spain", function: "Dissolves makeup" }, { name: "Vitamin E", origin: "Switzerland", function: "Antioxidant, skin nourishment" }],
          sizeOptions: ["50g", "100g"], bottleOptions: ["Jar", "Tube", "Stick", "Pump Bottle"], capOptions: ["Screw Lid", "Flip Cap", "Twist Cap", "Pump"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "cleansing-oil", name: "Cleansing Oil", slug: "cleansing-oil",
          heroImage: "/new asset/produk/skincare/bg-lands-card1.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card1.webp"],
          tags: ["Deep Cleanse", "Emulsifying"],
          shortDescription: "Cleansing oil emulsifying untuk double cleansing sempurna.",
          story: `Cleansing oil emulsifying adalah kunci double cleansing yang efektif.

Cleansing Oil Dreamlab menggunakan campuran minyak nabati premium yang melarutkan makeup dan sunscreen, lalu berubah menjadi emulsi susu saat terkena air untuk membilas bersih tanpa residu berminyak. Langkah pertama yang sempurna untuk rutinitas skincare malam hari.`,
          seoParagraph: "Maklon Cleansing Oil — jasa maklon cleansing oil emulsifying untuk double cleansing sempurna. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["Premium Oil Blend", "Self-Emulsifying", "Deep Cleansing Power", "No Oily After-feel", "Double Cleansing Essential", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Sunflower Seed Oil", origin: "Spain", function: "Lightweight cleansing base" }, { name: "Polyglyceryl-4 Oleate", origin: "Germany", function: "Emulsifier" }, { name: "Jojoba Oil", origin: "Israel", function: "Skin-compatible oil" }],
          sizeOptions: ["100ml", "150ml", "200ml"], bottleOptions: ["Jar", "Tube", "Airless Pump Bottle", "Pump Bottle"], capOptions: ["Pump", "Flip Cap", "Pump Cap"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
      ],
    },
    {
      id: "facial-wash",
      name: "Facial Wash",
      slug: "facial-wash",
      description: "Pembersih wajah berbusa untuk berbagai jenis kulit. Formula pH seimbang yang membersihkan tanpa mengeringkan.",
      heroImage: "/new asset/produk/skincare/bg-lands-card5.webp",
      bgColor: "#EADBC8",
      products: [
        {
          id: "brightening-facial-wash", name: "Brightening Facial Wash", slug: "brightening-facial-wash",
          heroImage: "/new asset/produk/skincare/bg-lands-card5.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card5.webp"],
          tags: ["Brightening", "Vitamin C"],
          shortDescription: "Facial wash pencerah dengan Vitamin C dan Niacinamide.",
          story: `Facial wash pencerah adalah langkah pertama dalam rutinitas brightening.

Brightening Facial Wash Dreamlab menggabungkan Vitamin C stabil dan Niacinamide dalam formula pembersih berbusa lembut. Membersihkan kotoran dan minyak berlebih sambil memberikan sentuhan pencerah di setiap cuci muka. Kulit terasa bersih, segar, dan tampak lebih cerah secara bertahap.`,
          seoParagraph: "Maklon Brightening Facial Wash — jasa maklon sabun wajah pencerah dengan Vitamin C dan Niacinamide. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["Vitamin C + Niacinamide", "Gentle Foaming Formula", "Brightening with Every Wash", "pH Balanced", "Cocok semua jenis kulit", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Vitamin C (Ascorbyl Glucoside)", origin: "Swiss", function: "Brightening" }, { name: "Niacinamide", origin: "Korea", function: "Even skin tone" }, { name: "Gentle Surfactants", origin: "Germany", function: "Mild cleansing" }],
          sizeOptions: ["50ml", "100ml", "150ml"], bottleOptions: ["Tube", "Airless Pump Bottle", "Flip Top Bottle", "Soft Matte Tube", "Pump Bottle"], capOptions: ["Flip Cap", "Pump Cap", "Pump"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "acne-facial-wash", name: "Acne Facial Wash", slug: "acne-facial-wash",
          heroImage: "/new asset/produk/skincare/bg-lands-card5.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card5.webp"],
          tags: ["Acne Control", "Salicylic Acid"],
          shortDescription: "Facial wash anti-jerawat dengan Salicylic Acid dan Tea Tree.",
          story: `Facial wash anti-jerawat adalah pertahanan pertama melawan breakout.

Acne Facial Wash Dreamlab diformulasikan dengan Salicylic Acid 2% yang menembus pori-pori untuk membersihkan sebum dan sel kulit mati penyebab jerawat, ditambah Tea Tree Oil sebagai antibakteri alami. Membersihkan secara mendalam tanpa membuat kulit terlalu kering atau tertarik.`,
          seoParagraph: "Maklon Acne Facial Wash — jasa maklon sabun wajah anti-jerawat dengan Salicylic Acid dan Tea Tree Oil. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["Salicylic Acid 2%", "Tea Tree Oil Antibacterial", "Deep Pore Cleansing", "Non-Drying Formula", "Cocok kulit berjerawat", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Salicylic Acid 2%", origin: "Germany", function: "BHA, unclog pores" }, { name: "Tea Tree Oil", origin: "Australia", function: "Antibacterial, acne control" }, { name: "Zinc PCA", origin: "Germany", function: "Oil control, anti-inflammatory" }],
          sizeOptions: ["50ml", "100ml", "150ml"], bottleOptions: ["Tube", "Airless Pump Bottle", "Flip Top Bottle", "Soft Matte Tube", "Pump Bottle"], capOptions: ["Flip Cap", "Pump Cap", "Pump"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "moisturizing-facial-wash", name: "Moisturizing Facial Wash", slug: "moisturizing-facial-wash",
          heroImage: "/new asset/produk/skincare/bg-lands-card5.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card5.webp"],
          tags: ["Hydrating", "Gentle"],
          shortDescription: "Facial wash melembapkan dengan Hyaluronic Acid dan Ceramide.",
          story: `Facial wash melembapkan membersihkan tanpa mengorbankan hidrasi kulit.

Moisturizing Facial Wash Dreamlab menggunakan surfaktan ultra-lembut yang membersihkan tanpa mengikis minyak alami kulit. Diperkaya Hyaluronic Acid dan Ceramide yang memberikan hidrasi saat mencuci muka. Hasilnya: kulit bersih, lembut, dan tidak terasa kencang atau kering setelah cuci muka.`,
          seoParagraph: "Maklon Moisturizing Facial Wash — jasa maklon sabun wajah melembapkan dengan Hyaluronic Acid dan Ceramide. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["Hyaluronic Acid + Ceramide", "Ultra-Gentle Surfactants", "Hydrating While Cleansing", "No Tight After-feel", "Cocok kulit kering & sensitif", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Hyaluronic Acid", origin: "Germany", function: "Hydration during cleanse" }, { name: "Ceramide NP", origin: "Germany", function: "Barrier support" }, { name: "Amino Acid Surfactants", origin: "Japan", function: "Ultra-gentle cleansing" }],
          sizeOptions: ["50ml", "100ml", "150ml"], bottleOptions: ["Tube", "Airless Pump Bottle", "Flip Top Bottle", "Soft Matte Tube", "Pump Bottle"], capOptions: ["Flip Cap", "Pump Cap", "Pump"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
      ],
    },
    {
      id: "facial-toner",
      name: "Facial Toner",
      slug: "facial-toner",
      description: "Toner wajah untuk menyeimbangkan pH dan mempersiapkan kulit menerima serum. Formula tanpa alkohol.",
      heroImage: "/new asset/produk/skincare/bg-lands-card4.webp",
      bgColor: "#EADBC8",
      products: [
        {
          id: "acne-facial-toner", name: "Acne Facial Toner", slug: "acne-facial-toner",
          heroImage: "/new asset/produk/skincare/bg-lands-card4.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card4.webp"],
          tags: ["Acne Control", "BHA"],
          shortDescription: "Toner anti-jerawat dengan BHA dan Centella Asiatica.",
          story: `Toner anti-jerawat adalah langkah krusial setelah pembersihan untuk kulit berjerawat.

Acne Facial Toner Dreamlab mengandung BHA (Beta Hydroxy Acid) yang menembus pori-pori untuk membersihkan sebum dan mencegah komedo, ditambah Centella Asiatica yang menenangkan inflamasi dan kemerahan. Formula alcohol-free yang tidak mengiritasi kulit sensitif berjerawat.`,
          seoParagraph: "Maklon Acne Facial Toner — jasa maklon toner anti-jerawat dengan BHA dan Centella Asiatica. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["BHA (Salicylic Acid)", "Centella Asiatica Soothing", "Alcohol-Free", "Pore Minimizing", "Cocok kulit berjerawat", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Salicylic Acid (BHA)", origin: "Germany", function: "Unclog pores, acne prevention" }, { name: "Centella Asiatica", origin: "Korea", function: "Soothing, anti-inflammatory" }, { name: "Witch Hazel", origin: "USA", function: "Pore tightening" }],
          sizeOptions: ["100ml", "150ml", "200ml"], bottleOptions: ["Spray Bottle", "Flip Top Bottle", "Frosted Bottle", "Pump Bottle", "Clear PET Bottle"], capOptions: ["Spray Cap", "Flip Cap", "Pump Cap", "Pump"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "moisturizing-facial-toner", name: "Moisturizing Facial Toner", slug: "moisturizing-facial-toner",
          heroImage: "/new asset/produk/skincare/bg-lands-card4.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card4.webp"],
          tags: ["Hydration", "Daily Use"],
          shortDescription: "Toner pelembap dengan Hyaluronic Acid dan Aloe Vera.",
          story: `Toner pelembap memberikan hidrasi awal yang mempersiapkan kulit untuk serum.

Moisturizing Facial Toner Dreamlab diformulasikan dengan multi-weight Hyaluronic Acid yang memberikan hidrasi berlapis — dari permukaan hingga lapisan dalam kulit. Ditambah Aloe Vera yang menenangkan dan Allantoin yang memperbaiki skin barrier. Kulit terasa kenyal dan siap menyerap produk selanjutnya.`,
          seoParagraph: "Maklon Moisturizing Facial Toner — jasa maklon toner pelembap dengan Hyaluronic Acid dan Aloe Vera. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["Multi-weight Hyaluronic Acid", "Aloe Vera Soothing", "Allantoin Barrier Support", "Prepares skin for serum", "Cocok semua jenis kulit", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Hyaluronic Acid (3 weights)", origin: "Germany", function: "Multi-layer hydration" }, { name: "Aloe Vera", origin: "Local", function: "Soothing, moisturizing" }, { name: "Allantoin", origin: "Germany", function: "Skin healing, barrier support" }],
          sizeOptions: ["100ml", "150ml", "200ml"], bottleOptions: ["Spray Bottle", "Flip Top Bottle", "Frosted Bottle", "Pump Bottle", "Clear PET Bottle"], capOptions: ["Spray Cap", "Flip Cap", "Pump Cap", "Pump"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "brightening-facial-toner", name: "Brightening Facial Toner", slug: "brightening-facial-toner",
          heroImage: "/new asset/produk/skincare/bg-lands-card4.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card4.webp"],
          tags: ["Brightening", "Niacinamide"],
          shortDescription: "Toner pencerah dengan Niacinamide dan Licorice Extract.",
          story: `Toner pencerah adalah langkah pertama dalam rutinitas brightening yang efektif.

Brightening Facial Toner Dreamlab menggabungkan Niacinamide 3% dan Licorice Extract yang bekerja menghambat produksi melanin berlebih sejak tahap toner. Formula ringan yang memberikan hidrasi sekaligus pencerahan, mempersiapkan kulit untuk menerima serum dan moisturizer dengan lebih efektif.`,
          seoParagraph: "Maklon Brightening Facial Toner — jasa maklon toner pencerah dengan Niacinamide dan Licorice Extract. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["Niacinamide 3%", "Licorice Extract", "Melanin Inhibition", "Hydrating + Brightening", "Cocok semua jenis kulit", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Niacinamide 3%", origin: "Korea", function: "Brightening, pore minimizing" }, { name: "Licorice Extract", origin: "China", function: "Natural brightening, anti-inflammatory" }, { name: "Glycerin", origin: "Germany", function: "Humectant, hydration" }],
          sizeOptions: ["100ml", "150ml", "200ml"], bottleOptions: ["Spray Bottle", "Flip Top Bottle", "Frosted Bottle", "Pump Bottle", "Clear PET Bottle"], capOptions: ["Spray Cap", "Flip Cap", "Pump Cap", "Pump"],
          moq: "1000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
      ],
    },
    {
      id: "facial-serum",
      name: "Facial Serum",
      slug: "facial-serum",
      description: "Serum wajah dengan konsentrasi aktif tinggi untuk solusi kulit spesifik. Target market premium dengan efikasi nyata.",
      heroImage: "/new asset/produk/skincare/bg-lands-card2.webp",
      bgColor: "#EADBC8",
      products: [
        {
          id: "serum-gel", name: "Serum Gel", slug: "serum-gel",
          heroImage: "/new asset/produk/skincare/bg-lands-card2.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card2.webp"],
          tags: ["Lightweight", "Hydrating"],
          shortDescription: "Serum gel berbasis air dengan Hyaluronic Acid.",
          story: `Serum gel adalah inovasi tekstur yang menggabungkan efikasi serum dengan kenyamanan gel.

Serum Gel Dreamlab diformulasikan dengan basis air yang ultra-ringan dan cepat meresap, diperkaya Hyaluronic Acid multi-weight untuk hidrasi berlapis. Cocok untuk iklim tropis Indonesia yang lembap — memberikan nutrisi intensif tanpa rasa lengket atau berat di kulit.`,
          seoParagraph: "Maklon Serum Gel — jasa maklon serum gel berbasis air dengan Hyaluronic Acid, ultra-ringan untuk iklim tropis. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["Water-based Gel Formula", "Multi-weight Hyaluronic Acid", "Ultra-lightweight, Fast Absorbing", "Ideal untuk iklim tropis", "Non-sticky, Non-greasy", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Hyaluronic Acid (3 weights)", origin: "Germany", function: "Multi-layer hydration" }, { name: "Panthenol", origin: "Germany", function: "Soothing, barrier support" }, { name: "Allantoin", origin: "Germany", function: "Skin healing" }],
          sizeOptions: ["15ml", "30ml", "50ml"], bottleOptions: ["Dropper", "Airless Pump"], capOptions: ["Rubber Dropper", "Pump Cap"],
          moq: "1000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "radiant-advance-serum", name: "Radiant Advance Serum", slug: "radiant-advance-serum",
          heroImage: "/new asset/produk/skincare/bg-lands-card2.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card2.webp"],
          tags: ["Premium", "Brightening"],
          shortDescription: "Serum pencerah premium dengan Vitamin C dan Glutathione.",
          story: `Radiant Advance Serum adalah serum pencerah paling premium dalam portofolio Dreamlab.

Menggabungkan Vitamin C stabil (Ascorbyl Tetraisopalmitate) yang menembus kulit lebih dalam, Glutathione sebagai master antioxidant pencerah, dan Niacinamide untuk efek brightening sinergis. Hasilnya: kulit yang lebih cerah, merata, dan bercahaya dalam 4-6 minggu penggunaan rutin.`,
          seoParagraph: "Maklon Radiant Advance Serum — jasa maklon serum pencerah premium dengan Vitamin C dan Glutathione. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["Vitamin C (ATIP) + Glutathione", "Triple Brightening Action", "Premium Grade Ingredients", "Hasil dalam 4-6 minggu", "Cocok semua jenis kulit", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Ascorbyl Tetraisopalmitate (VC-IP)", origin: "Swiss", function: "Deep-penetrating Vitamin C" }, { name: "Glutathione", origin: "Japan", function: "Master antioxidant, brightening" }, { name: "Niacinamide", origin: "Korea", function: "Even skin tone, pore minimizing" }],
          sizeOptions: ["15ml", "30ml", "50ml"], bottleOptions: ["Dropper", "Airless Pump"], capOptions: ["Rubber Dropper", "Pump Cap"],
          moq: "1000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "acne-serum", name: "Acne Serum", slug: "acne-serum",
          heroImage: "/new asset/produk/skincare/bg-lands-card2.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card2.webp"],
          tags: ["Acne Treatment", "BHA"],
          shortDescription: "Serum anti-jerawat dengan Salicylic Acid dan Zinc.",
          story: `Acne Serum adalah treatment intensif untuk kulit berjerawat yang membutuhkan solusi cepat.

Acne Serum Dreamlab diformulasikan dengan Salicylic Acid 2% yang menembus pori-pori untuk membersihkan sebum dan mencegah komedo, ditambah Zinc PCA yang mengontrol minyak berlebih dan Centella Asiatica yang menenangkan inflamasi. Formula yang efektif melawan jerawat tanpa mengeringkan kulit.`,
          seoParagraph: "Maklon Acne Serum — jasa maklon serum anti-jerawat dengan Salicylic Acid dan Zinc PCA. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["Salicylic Acid 2% (BHA)", "Zinc PCA Oil Control", "Centella Asiatica Soothing", "Non-Drying Formula", "Cocok kulit berjerawat", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Salicylic Acid 2%", origin: "Germany", function: "BHA, unclog pores" }, { name: "Zinc PCA", origin: "Germany", function: "Sebum regulation" }, { name: "Centella Asiatica", origin: "Korea", function: "Soothing, anti-inflammatory" }],
          sizeOptions: ["15ml", "30ml", "50ml"], bottleOptions: ["Dropper", "Airless Pump"], capOptions: ["Rubber Dropper", "Pump Cap"],
          moq: "1000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "peeling-serum", name: "Peeling Serum", slug: "peeling-serum",
          heroImage: "/new asset/produk/skincare/bg-lands-card2.webp", galleryImages: ["/new asset/produk/skincare/bg-lands-card2.webp"],
          tags: ["Exfoliating", "AHA/BHA"],
          shortDescription: "Serum peeling dengan AHA/BHA untuk eksfoliasi kimiawi.",
          story: `Peeling Serum adalah eksfoliasi kimiawi yang bisa dilakukan di rumah tanpa perlu ke klinik.

Peeling Serum Dreamlab menggabungkan Glycolic Acid (AHA) untuk mengangkat sel kulit mati di permukaan dan Salicylic Acid (BHA) untuk membersihkan pori-pori dari dalam. Formula yang memberikan efek resurfacing: kulit lebih halus, cerah, dan tekstur merata. Gunakan 2-3 kali seminggu di malam hari.`,
          seoParagraph: "Maklon Peeling Serum — jasa maklon serum peeling AHA/BHA untuk eksfoliasi kimiawi di rumah. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
          benefits: ["Glycolic Acid (AHA) + Salicylic Acid (BHA)", "Chemical Exfoliation", "Skin Resurfacing", "Smoother, Brighter Skin", "Gunakan 2-3x seminggu malam", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Glycolic Acid 7%", origin: "France", function: "AHA, surface exfoliation" }, { name: "Salicylic Acid 2%", origin: "Germany", function: "BHA, pore cleansing" }, { name: "Aloe Vera", origin: "Local", function: "Soothing, post-peel calming" }],
          sizeOptions: ["15ml", "30ml", "50ml"], bottleOptions: ["Dropper", "Airless Pump"], capOptions: ["Rubber Dropper", "Pump Cap"],
          moq: "1000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
      ],
    },
  ],
  trustStats: [
    { icon: "flask", value: "50+", label: "Bahan Aktif", description: "Portofolio bahan aktif teruji klinis untuk berbagai solusi kulit" },
    { icon: "shield-check", value: "CPKB Grade A", label: "Certified Factory", description: "Pabrik bersertifikat standar industri kosmetik internasional" },
    { icon: "award", value: "100%", label: "BPOM Compliance", description: "Jaminan legalitas penuh untuk setiap produk yang diproduksi" },
    { icon: "star", value: "98%", label: "Kepuasan Klien", description: "Tingkat kepuasan tinggi dari pemilik brand skincare nasional" },
    { icon: "test-tube", value: "Derma", label: "Dermatologist Tested", description: "Formulasi telah diuji keamanan oleh dokter kulit" },
  ],
  trustCategorySpecific: [
    { icon: "microscope", label: "R&D Eksklusif", description: "Formulasi unik yang dirancang khusus untuk identitas brand Anda" },
    { icon: "leaf", label: "Bahan Baku Pilihan", description: "Sourcing global bahan aktif dengan efikasi klinis teruji" },
    { icon: "zap", label: "Penetrasi Cepat", description: "Tekstur yang dioptimalkan untuk kenyamanan maksimal di iklim tropis" },
    { icon: "shield", label: "Uji Stabilitas", description: "Setiap produk melalui tes stabilitas ketat untuk kualitas jangka panjang" },
    { icon: "heart", label: "Non-Comedogenic", description: "Tidak menyumbat pori — aman untuk kulit berjerawat" },
  ],
  edukasi: [
    {
      title: "Memahami Peran Toner dan Serum dalam Ritual Skincare",
      content: `<p><strong>Toner</strong> digunakan setelah pembersihan untuk:</p>
      <ul>
        <li>Menormalkan pH kulit (kulit biasanya cenderung basa setelah dibersihkan).</li>
        <li>Memberikan hidrasi awal dan mempersiapkan kulit untuk menerima serum.</li>
        <li>Mengangkat sisa residu pembersih yang mungkin tertinggal.</li>
      </ul>
      <p><strong>Serum</strong> digunakan setelah toner untuk:</p>
      <ul>
        <li>Memberikan bahan aktif konsentrasi tinggi langsung ke masalah kulit.</li>
        <li>Target masalah spesifik: mencerahkan, jerawat, atau penuaan dini.</li>
        <li>Langkah perawatan intensif — bukan sekadar hidrasi dasar.</li>
      </ul>
      <p><strong>Urutan yang benar:</strong> Pembersih → Toner → Serum → Pelembap → Tabir Surya (Pagi).</p>`,
    },
    {
      title: "Kenapa Physical Sunscreen Cocok untuk Kulit Indonesia?",
      content: `<p>Beberapa alasan mengapa physical (mineral) sunscreen sangat direkomendasikan:</p>
      <ul>
        <li><strong>Perlindungan Instan:</strong> Tidak perlu menunggu 20 menit, langsung bekerja saat diaplikasikan.</li>
        <li><strong>Minim Iritasi:</strong> Tidak diserap ke dalam aliran darah, sehingga lebih aman untuk kulit sensitif.</li>
        <li><strong>Stabil di Suhu Panas:</strong> Tidak mudah terurai oleh panas matahari seperti filter kimiawi.</li>
        <li><strong>Ramah Kulit Berjerawat:</strong> Umumnya bersifat non-komedogenik dan tidak menyumbat pori-pori.</li>
      </ul>
      <p>Di Dreamlab, semua physical sunscreen kami diformulasi tanpa white cast agar cocok untuk semua warna kulit Indonesia.</p>`,
    },
    {
      title: "Strategi Memilih Antara Serum dan Krim untuk Brand Anda",
      content: `<p>Keputusan antara mengembangkan serum atau krim tergantung pada beberapa faktor:</p>
      <ul>
        <li><strong>Target Masalah Kulit:</strong> Jika memprioritaskan efek mencerahkan atau anti-aging, serum memberikan hasil yang lebih nyata.</li>
        <li><strong>Titik Harga:</strong> Serum biasanya memiliki harga jual lebih tinggi karena konsentrasi bahan aktif dan nilai persepsinya.</li>
        <li><strong>Kebutuhan Penggunaan:</strong> Serum untuk perawatan target, krim untuk perlindungan dan hidrasi harian.</li>
      </ul>`,
    },
    {
      title: "Cara Memilih SPF yang Tepat untuk Iklim Tropis Indonesia",
      content: `<p>Di Indonesia dengan intensitas matahari tinggi, pemilihan SPF sangat penting:</p>
      <ul>
        <li><strong>SPF 30:</strong> Cukup untuk aktivitas indoor dan outdoor ringan. Blok 97% sinar UVB.</li>
        <li><strong>SPF 50:</strong> Direkomendasikan untuk aktivitas outdoor langsung. Blok 98% sinar UVB.</li>
        <li><strong>SPF 50+:</strong> Untuk perlindungan maksimal, terutama bagi kulit sensitif atau pasca-treatment.</li>
        <li><strong>PA Rating:</strong> Pilih yang memiliki PA++++ untuk perlindungan UVA yang maksimal.</li>
      </ul>
      <p><strong>Tips:</strong> Aplikasikan ulang setiap 2-3 jam saat berada di bawah sinar matahari langsung.</p>`,
    },
    {
      title: "Vitamin C vs Niacinamide — Mana yang Lebih Cocok untuk Anda?",
      content: `<p>Kedua bahan aktif ini sangat populer, tapi memiliki fungsi berbeda:</p>
      <ul>
        <li><strong>Vitamin C:</strong>
          <ul>
            <li>Best for: Brightening, mengatasi hiperpigmentasi, antioxidant</li>
            <li>Tekstur: Biasanya oil-based atau water-based</li>
            <li>Pagi hari (sebelum sunscreen)</li>
          </ul>
        </li>
        <li><strong>Niacinamide:</strong>
          <ul>
            <li>Best for: Mengurangi pori, oil control, soothing</li>
            <li>Tekstur: Water-based, ringan</li>
            <li>Pagi atau malam</li>
          </ul>
        </li>
      </ul>
      <p><strong>Bisa digunakan bersamaan:</strong> Gunakan Vitamin C di pagi hari, Niacinamide di malam hari.</p>`,
    },
    {
      title: "Rutinitas Skincare Pagi dan Malam yang Benar",
      content: `<p><strong>Rutinitas Pagi (Protection):</strong></p>
      <ol>
        <li>Cleanser — bilas wajah dengan air atau cleanser ringan</li>
        <li>Toner — hydrated dan prepare skin</li>
        <li>Serum — Vitamin C untuk antioxidant</li>
        <li>Moisturizer — kunci hidrasi</li>
        <li>Sunscreen — langkah paling penting!</li>
      </ol>
      <p><strong>Rutinitas Malam (Repair):</strong></p>
      <ol>
        <li>Makeup Remover / Cleansing Oil — untuk remove makeup</li>
        <li>Cleanser — deep cleanse</li>
        <li>Toner — balance pH</li>
        <li>Serum — Retinol, AHA/BHA, atau hydrating serum</li>
        <li>Moisturizer / Sleeping Mask — repair dan locking</li>
      </ol>`,
    },
  ],
  testimonials: [
    {
      quote: "Brand saya mulai berkembang pesat setelah meluncurkan serum Niacinamide dari Dreamlab. Konsumen sangat menyukai hasilnya yang nyata dalam 2 minggu.",
      name: "Jessica",
      brand: "Brand GlowUp Beauty",
      avatarImage: "",
      productImage: "/assets/images/client-skincare-1.webp",
    },
    {
      quote: "Sunscreen-nya sama sekali tidak lengket meskipun di tengah kelembapan Jakarta. Ini menjadi produk paling laku di lini skincare kami.",
      name: "David",
      brand: "Brand Shield Skin",
      avatarImage: "",
      productImage: "/assets/images/client-skincare-2.webp",
    },
  ],
  faqs: [
    {
      question: "Berapa MOQ untuk maklon produk skincare di Dreamlab?",
      answer: "MOQ standar kami dimulai dari 1000 pcs per varian. Untuk kemasan tertentu seperti botol airless atau dropper kaca premium, MOQ dapat menyesuaikan.",
    },
    {
      question: "Apakah saya bisa menentukan bahan aktif tertentu dalam formula?",
      answer: "Tentu. Tim R&D kami akan bekerja dengan bahan aktif pilihan Anda. Kami memiliki lebih dari 50 bahan aktif teruji klinis yang bisa kami rekomendasikan sesuai konsep brand Anda, mulai dari Niacinamide, Vitamin C, Hyaluronic Acid, hingga Retinol.",
    },
    {
      question: "Berapa lama proses uji stabilitas untuk produk skincare?",
      answer: "Uji stabilitas standar memakan waktu 4-8 minggu tergantung pada kompleksitas formula. Tersedia opsi uji dipercepat (accelerated) untuk peluncuran yang lebih cepat.",
    },
    {
      question: "Apakah layanan maklon sudah termasuk pengurusan izin BPOM?",
      answer: "Ya, layanan kami bersifat 'All-in'. Kami menangani pendaftaran notifikasi BPOM, sertifikasi Halal MUI, hingga pemenuhan standar CPKB.",
    },
    {
      question: "Berapa estimasi biaya untuk memulai brand skincare baru?",
      answer: "Biaya sangat bervariasi tergantung jenis produk dan kemasan. Sebagai gambaran, untuk 1000 pcs serum wajah dengan kemasan standar, estimasi budget mulai dari Rp 40-60 juta termasuk pendaftaran legalitas.",
    },
    {
      question: "Apakah produk skincare Dreamlab aman untuk kulit sensitif?",
      answer: "Ya, semua formulasi skincare Dreamlab telah melalui uji dermatologi (Dermatologist Tested) dan diformulasikan dengan bahan-bahan yang lembut. Kami juga menawarkan opsi hypoallergenic dan non-comedogenic untuk konsumen dengan kulit sensitif atau berjerawat.",
    },
  ],
  relatedProducts: [
    { name: "Facial Toner", slug: "facial-toner", image: "/new asset/skincare&facecare/mois-facial-toner.webp", category: "Skincare", categorySlug: "skincare" },
    { name: "Facial Wash", slug: "facial-wash", image: "/new asset/skincare&facecare/facial-wash.webp", category: "Skincare", categorySlug: "skincare" },
    { name: "Facial Sunscreen", slug: "facial-sunscreen", image: "/new asset/skincare&facecare/physical-sunscreen.webp", category: "Skincare", categorySlug: "skincare" },
    { name: "Micellar Cleansing Gel", slug: "micellar-cleansing-gel", image: "/new asset/skincare&facecare/micellar-cleansing-gel.webp", category: "Skincare", categorySlug: "skincare" },
  ],
};

export function getProductBySlug(category: string, productSlug: string) {
  const allData: Record<string, ProductCategoryV2> = {
    parfum: parfumData,
    skincare: skincareData,
    bodycare: bodycareData,
    haircare: haircareData,
    babycare: babycareData,
    decorative: decorativeData,
    footcare: footcareData,
    pkrt: pkrtData,
  };

  const categoryData = allData[category];
  if (!categoryData) return null;
  
  const product = categoryData.products.find(p => p.slug === productSlug);
  return product || null;
}