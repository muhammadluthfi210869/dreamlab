import { ProductCategoryV2 } from "@/types/product-v2";

export const footcareData: ProductCategoryV2 = {
  slug: "footcare",
  name: "Foot Care",
  tagline: "Restorasi Kaki dengan Efikasi Tinggi",
  description: "Layanan maklon perawatan kaki spesialis: foot cream (anti-pecah), foot spray (penghilang bau), foot scrub, foot mask, dan foot anti-bacterial. Diformulasi dengan konsentrasi bahan aktif tinggi untuk hasil nyata.",
  heroImage: "/assets/images/foot-care-1.webp",
  bgColor: "#F1F1F1",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Produk", href: "/produk/" },
    { label: "Foot Care", href: "/produk/footcare/" },
  ],
  comparisonOptions: ["Foot Cream", "Foot Spray", "Foot Scrub", "Foot Mask", "Foot Soak", "Foot Serum", "Foot Anti-Bacterial"],
  comparisonMatrix: {
    "Foot Cream": {
      konsentrasi: "Rich cream, high urea",
      haltbarkeit: "Hidrasi 24 Jam",
      marktposition: "Treatment",
      moq: "1000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Deep moisturizing, healing",
      bestFor: ["Cracked Heels", "Very Dry Skin", "Daily Care"],
      ingredients: ["Urea", "Shea Butter", "Allantoin"],
    },
    "Foot Spray": {
      konsentrasi: "Light liquid, refreshing",
      haltbarkeit: "Efek Anti-perspirant",
      marktposition: "Refreshment",
      moq: "1000 pcs",
      preisklasse: "Affordable",
      karakter: "Cooling, deodorizing, anti-bacterial",
      bestFor: ["Foot Odor", "Active Lifestyle", "Office Shoes"],
      ingredients: ["Menthol", "Tea Tree", "Witch Hazel"],
    },
    "Foot Scrub": {
      konsentrasi: "Cream/gel with particles",
      haltbarkeit: "Eksfoliasi Instan",
      marktposition: "Essential Treatment",
      moq: "1000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Exfoliating, smoothing",
      bestFor: ["Rough Skin", "Calluses", "Weekly Care"],
      ingredients: ["Pumice", "Sea Salt", "Peppermint Oil"],
    },
    "Foot Mask": {
      konsentrasi: "Serum-rich booties",
      haltbarkeit: "Treatment Intensif (30-60 min)",
      marktposition: "Premium",
      moq: "1000 pcs",
      preisklasse: "Premium",
      karakter: "Deep treatment, visible results",
      bestFor: ["Spa Treatment", "Intensive Care", "Special Occasion"],
      ingredients: ["Hyaluronic Acid", "Collagen", "Niacinamide"],
    },
    "Foot Soak": {
      konsentrasi: "Salt/gel soak",
      haltbarkeit: "Relaksasi Instan",
      marktposition: "Wellness",
      moq: "1000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Relaxing, aromatherapy, detox",
      bestFor: ["Spa Experience", "Tired Feet", "Relaxation"],
      ingredients: ["Epsom Salt", "Essential Oils", "Herbal Extracts"],
    },
    "Foot Serum": {
      konsentrasi: "Concentrated serum",
      haltbarkeit: "Perawatan Intensif",
      marktposition: "Premium",
      moq: "1000 pcs",
      preisklasse: "Premium",
      karakter: "Intensive treatment, repairing",
      bestFor: ["Daily Care", "Intensive Repair", "Premium Line"],
      ingredients: ["Hyaluronic Acid", "Peptides", "Ceramides"],
    },
    "Foot Anti-Bacterial": {
      konsentrasi: "Antiseptic liquid/spray",
      haltbarkeit: "Perlindungan 24 Jam",
      marktposition: "Hygiene",
      moq: "1000 pcs",
      preisklasse: "Affordable",
      karakter: "Antibacterial, antifungal, refreshing",
      bestFor: ["Foot Hygiene", "Post-Sport", "Daily Protection"],
      ingredients: ["Tea Tree Oil", "Benzalkonium Chloride", "Aloe Vera"],
    },
  },
  products: [
    {
      id: "foot-cream",
      name: "Foot Cream",
      slug: "foot-cream",
      heroImage: "/assets/images/footcare-scaled.webp",
      galleryImages: ["/assets/images/footcare-scaled.webp"],
      tags: ["Best Seller", "Moisturizing", "Repair"],
      shortDescription: "Maklon Foot Cream dengan formula kaya nutrisi untuk mengatasi kaki kering, pecah-pecah, dan tumit kasar. Hasil nyata dengan penggunaan rutin.",
      story: `Kaki bekerja keras setiap hari — namun sering kali menjadi bagian tubuh yang paling terabaikan dalam rutinitas perawatan.

Kita sering fokus pada wajah, rambut, dan tubuh, namun kaki yang menopang seluruh beban kita jarang mendapatkan perhatian yang layak hingga masalah seperti tumit pecah-pecah muncul. Foot cream yang diformulasikan dengan benar memberikan hidrasi mendalam, eksfoliasi lembut untuk mengangkat sel kulit mati, serta perlindungan untuk mencegah kerusakan lebih lanjut.

Di Dreamlab, kami menciptakan foot cream yang benar-benar menjawab akar masalah: Urea untuk hidrasi mendalam, AHA untuk eksfoliasi kimiawi, dan Shea Butter untuk perlindungan skin barrier.`,
      seoParagraph: "Maklon Foot Cream solusi bagi brand yang ingin memasuki pasar perawatan kaki yang masih memiliki potensi besar di Indonesia. Dengan formula yang mengatasi kaki kering, pecah-pecah, dan tumit kasar (cracked heels), foot cream Dreamlab memberikan hasil nyata dalam 1-2 minggu penggunaan rutin. Tersedia varian perawatan harian dan perawatan intensif malam hari.",
      benefits: [
        "Konsentrasi Urea Tinggi (10-20%) untuk hidrasi mendalam",
        "AHA untuk eksfoliasi kimiawi sel kulit mati secara lembut",
        "Allantoin untuk perbaikan kulit dan penyembuhan luka ringan",
        "Formula Tidak Lengket — cepat meresap dan nyaman digunakan",
        "Kandungan Anti-jamur untuk menjaga kesehatan kaki",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Urea 15%", origin: "Germany", function: "Hidrasi mendalam dan retensi kelembapan" },
        { name: "Glycolic Acid 5%", origin: "USA", function: "Eksfoliasi kulit mati dan menghaluskan tekstur" },
        { name: "Allantoin", origin: "Germany", function: "Perbaikan kulit dan menenangkan iritasi" },
      ],
      sizeOptions: ["50ml", "80ml", "100ml", "150ml"],
      bottleOptions: ["Tube", "Jar", "Custom Exclusive Packaging", "Spray Bottle"],
      capOptions: ["Flip Cap", "Screw Cap", "Nozzle"],
      moq: "1000 pcs",
      productionTime: "2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "foot-scrub",
      name: "Foot Scrub",
      slug: "foot-scrub",
      heroImage: "/new asset/produk/footcare/card5-foot-scrub.webp",
      galleryImages: ["/new asset/produk/footcare/card5-foot-scrub.webp"],
      tags: ["Exfoliate", "Smooth", "Weekly Treatment"],
      shortDescription: "Maklon Foot Scrub untuk mengangkat sel kulit mati dan menghaluskan area yang kasar. Eksfoliasi fisik dengan butiran alami dan minyak penutrisi.",
      story: `Eksfoliasi bagi kaki sama pentingnya dengan masker bagi wajah.

Kaki menanggung beban literal dari seluruh tubuh: tekanan, gesekan, hingga penumpukan kapalan. Tanpa eksfoliasi rutin, sel kulit mati menumpuk dan menciptakan area kasar yang tidak hanya mengganggu estetika tetapi juga kenyamanan. Foot scrub yang efektif memerlukan keseimbangan: cukup kuat untuk mengangkat kulit mati, namun tetap lembut agar tidak melukai kulit sehat di bawahnya.

Di Dreamlab, kami memformulasikan foot scrub yang memberikan pengalaman eksfoliasi memuaskan: tekstur yang bekerja efektif, kulit terasa halus seketika, dan aroma menyegarkan yang merelaksasi.`,
      seoParagraph: "Maklon Foot Scrub solusi bagi brand yang ingin menawarkan produk eksfoliasi khusus kaki. Dengan formula yang menggabungkan eksfoliasi fisik (butiran alami) dengan minyak penutrisi, foot scrub Dreamlab menjadikan kaki halus dan siap tampil menawan. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan bersertifikasi BPOM & Halal.",
      benefits: [
        "Agen Eksfoliasi Alami: Pumice (Batu Apung), Gula, atau Garam Bambu",
        "Minyak Penutrisi untuk mencegah kulit kering setelah eksfoliasi",
        "Sifat Antiseptik dari Tea Tree untuk higienitas kaki",
        "Pilihan Aroma: Peppermint (menyegarkan), Lavender (menenangkan)",
        "Pilihan Tekstur: Halus, Sedang, hingga Kasar sesuai kebutuhan",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Pumice Powder", origin: "USA", function: "Eksfoliasi fisik untuk area kulit yang tebal" },
        { name: "Sweet Almond Oil", origin: "Spain", function: "Melembapkan selama proses eksfoliasi" },
        { name: "Tea Tree Oil", origin: "Australia", function: "Anti-jamur dan anti-bakteri alami" },
      ],
      sizeOptions: ["50ml", "100ml", "150ml"],
      bottleOptions: ["Jar", "Tube", "Standing Pouch", "Custom Exclusive Packaging"],
      capOptions: ["Screw Lid", "Flip Cap", "Spatula Included"],
      moq: "1000 pcs",
      productionTime: "2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "foot-mask",
      name: "Foot Mask",
      slug: "foot-mask",
      heroImage: "/new asset/footcare/footmask-maklonkosmetik-dreamlab .png",
      galleryImages: ["/new asset/footcare/footmask-maklonkosmetik-dreamlab .png"],
      tags: ["Premium", "Spa", "Intensive"],
      shortDescription: "Maklon Foot Mask untuk perawatan intensif dan pengalaman spa di rumah. Format sheet mask atau cream mask untuk hasil tingkat profesional.",
      story: `Foot mask adalah perawatan spa yang dapat dilakukan di rumah tanpa perlu membuat janji temu.

Format masker kaki dalam bentuk 'booties' memastikan bahan aktif meresap jauh lebih dalam dibanding penggunaan krim biasa. Hasilnya: hidrasi yang jauh lebih efektif dan instan. Gunakan secara mingguan selama 20-30 menit sambil bersantai, dan rasakan perubahan tekstur kaki yang menjadi jauh lebih lembut dan sehat.`,
      seoParagraph: "Maklon Foot Mask solusi bagi brand yang ingin menawarkan produk perawatan kaki premium dengan pengalaman spa. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan. Tersedia dalam format sheet mask (booties), cream mask, dan peel-off mask bersertifikasi BPOM & Halal.",
      benefits: [
        "Format Sheet Mask (Booties) untuk aplikasi yang mudah dan bersih",
        "Konsentrasi Bahan Aktif Tinggi: Hyaluronic Acid, Collagen, Vitamin E",
        "Penyerapan Mendalam berkat efek oklusi dari masker",
        "Hasil Nyata dalam Satu Kali Pakai: kaki lebih lembut dan terhidrasi",
        "Pengalaman Spa yang Merelaksasi dengan aromaterapi pilihan",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Hyaluronic Acid", origin: "Japan", function: "Hidrasi instan dan mengunci kelembapan" },
        { name: "Collagen", origin: "Germany", function: "Meningkatkan elastisitas kulit kaki" },
        { name: "Niacinamide", origin: "Korea", function: "Mencerahkan dan memperbaiki tekstur kulit" },
      ],
      sizeOptions: ["1 pair (20ml)", "Cream 50ml"],
      bottleOptions: ["Sachet (Booties)", "Tube", "Jar"],
      capOptions: ["Sealable Sachet", "Flip Top", "Screw Cap"],
      moq: "1000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "foot-spray",
      name: "Foot Spray",
      slug: "foot-spray",
      heroImage: "/assets/images/footcare-scaled.webp",
      galleryImages: ["/assets/images/footcare-scaled.webp"],
      tags: ["Refreshing", "Deodorizing", "Cooling"],
      shortDescription: "Maklon Foot Spray untuk menyegarkan kaki dan menghilangkan bau tidak sedap. Formula dengan antibakteri dan aroma segar yang tahan lama.",
      story: `Foot spray adalah solusi cepat untuk kaki yang lelah dan bau — masalah yang sering dialami oleh mereka yang aktif sepanjang hari.

Foot Spray Dreamlab diformulasikan dengan agen antibakteri yang membunuh bakteri penyebab bau kaki, menthol untuk efek pendinginan (cooling) yang menyegarkan, dan wewangian yang memberikan kesegaran tahan lama. Cukup semprotkan ke kaki setelah beraktivitas atau sebelum memakai sepatu untuk perlindungan maksimal.`,
      seoParagraph: "Maklon Foot Spray — jasa maklon semprotan kaki antibakteri untuk menghilangkan bau dan menyegarkan. Efek cooling instan dengan aroma tahan lama. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
      benefits: [
        "Antibakteri Aktif — membunuh bakteri penyebab bau kaki",
        "Efek Cooling — menthol alami memberikan sensasi segar instan",
        "Aroma Tahan Lama — wewangian yang menyegarkan sepanjang hari",
        "Praktis & Cepat — semprot dan pergi tanpa perlu bilas",
        "Ukuran Travel Friendly — mudah dibawa ke mana saja",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Benzalkonium Chloride", origin: "Germany", function: "Agen antibakteri" },
        { name: "Menthol", origin: "USA", function: "Efek pendinginan alami" },
        { name: "Fragrance Oil", origin: "France", function: "Aroma segar tahan lama" },
      ],
      sizeOptions: ["50ml", "100ml", "150ml"],
      bottleOptions: ["Spray Bottle", "Custom Exclusive Packaging"],
      capOptions: ["Spray Cap", "Flip Cap", "Screw Cap"],
      moq: "1000 pcs",
      productionTime: "2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "foot-soak",
      name: "Foot Soak",
      slug: "foot-soak",
      heroImage: "/new asset/footcare/maklon-soak-cream.png",
      galleryImages: ["/new asset/footcare/maklon-soak-cream.png"],
      tags: ["Relaxing", "Spa", "Detox"],
      shortDescription: "Maklon Foot Soak untuk merendam dan merelaksasi kaki lelah. Dipadukan dengan garam, herbal, dan aroma yang mengubah waktu mandi menjadi ritual relaksasi.",
      story: `Foot soak adalah produk wellness yang mengubah pengalaman merendam kaki menjadi ritual spa di rumah.

Dreamlab memformulasikan foot soak dengan campuran garam alami (Epsom salt, sea salt), ekstrak herbal, dan minyak atsiri yang bekerja sinergis untuk merelaksasi otot kaki yang lelah, mendetoksifikasi, dan mengharumkan kaki. Cukup larutkan dalam air hangat dan rendam kaki selama 15-20 menit untuk merasakan relaksasi total setelah hari yang panjang.`,
      seoParagraph: "Maklon Foot Soak — jasa maklon rendaman kaki relaksasi dengan garam alami, herbal, dan aromaterapi. Pengalaman spa di rumah. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
      benefits: [
        "Epsom Salt — merelaksasi otot kaki yang tegang dan lelah",
        "Essential Oils — aromaterapi menenangkan pikiran dan tubuh",
        "Herbal Extracts — detoksifikasi dan menyegarkan kaki",
        "Mudah Digunakan — larutkan dalam air hangat, rendam 15-20 menit",
        "Pengalaman Spa — mengubah rutinitas mandi menjadi ritual relaksasi",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Epsom Salt (Magnesium Sulfate)", origin: "USA", function: "Merelaksasi otot dan mengurangi pembengkakan" },
        { name: "Lavender Essential Oil", origin: "France", function: "Aromaterapi menenangkan" },
        { name: "Chamomile Extract", origin: "Germany", function: "Menenangkan iritasi kulit kaki" },
      ],
      sizeOptions: ["200g", "500g", "1kg"],
      bottleOptions: ["Jar", "Standing Pouch", "Custom Exclusive Packaging"],
      capOptions: ["Screw Lid", "Resealable Zipper", "Scoop Included"],
      moq: "1000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "foot-serum",
      name: "Foot Serum",
      slug: "foot-serum",
      heroImage: "/new%20asset/footcare/foot-serum.jpeg",
      galleryImages: ["/new%20asset/footcare/foot-serum.jpeg"],
      tags: ["Premium", "Intensive", "Treatment"],
      shortDescription: "Maklon Foot Serum untuk perawatan intensif kaki dengan konsentrasi bahan aktif tinggi. Produk premium pelengkap rangkaian foot care brand Anda.",
      story: `Foot serum adalah evolusi terbaru dalam perawatan kaki — konsentrat bahan aktif dalam basis ringan yang meresap cepat.

Tidak seperti krim kaki yang lebih bersifat melembapkan, foot serum Dreamlab diformulasikan dengan konsentrasi bahan aktif tinggi (Peptide Complex, Hyaluronic Acid, Ceramide) yang ditargetkan untuk masalah kulit spesifik: mencerahkan kulit kaki yang gelap di area lutut dan siku, mengencangkan kulit yang mulai kendur, atau memberikan hidrasi intensif. Tekstur ringan yang cepat meresap tanpa rasa lengket, ideal untuk perawatan sebelum tidur.`,
      seoParagraph: "Maklon Foot Serum — jasa maklon serum perawatan kaki konsentrasi aktif tinggi untuk brightening, firming, dan hydrating. Formula ringan cepat meresap. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
      benefits: [
        "Konsentrasi Bahan Aktif Tinggi — Peptide, Hyaluronic Acid, Ceramide",
        "Tekstur Ringan — cepat meresap tanpa rasa lengket",
        "Targeted Treatment — brightening, firming, hydrating",
        "Daily Intensive Care — hasil nyata dengan pemakaian rutin",
        "Premium Positioning — produk dengan margin tinggi",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Peptide Complex", origin: "Switzerland", function: "Merangsang produksi kolagen, mengencangkan kulit" },
        { name: "Hyaluronic Acid", origin: "Germany", function: "Hidrasi intensif dan mengunci kelembapan" },
        { name: "Ceramide NP", origin: "Germany", function: "Memperbaiki skin barrier kaki" },
      ],
      sizeOptions: ["30ml", "50ml", "100ml"],
      bottleOptions: ["Dropper Bottle", "Tube", "Custom Exclusive Packaging"],
      capOptions: ["Rubber Dropper", "Flip Cap", "Airless Pump"],
      moq: "1000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "foot-anti-bacterial",
      name: "Foot Anti-Bacterial",
      slug: "foot-anti-bacterial",
      heroImage: "/assets/images/footcare-scaled.webp",
      galleryImages: ["/assets/images/footcare-scaled.webp"],
      tags: ["Anti-Bacterial", "Protection", "Hygiene"],
      shortDescription: "Maklon Foot Anti-Bacterial untuk perlindungan ekstra dari bakteri dan jamur kaki. Formula antiseptik yang aman untuk penggunaan harian.",
      story: `Kaki rentan terhadap infeksi bakteri dan jamur karena sering berada dalam lingkungan lembap (sepatu tertutup).

Foot Anti-Bacterial Dreamlab diformulasikan untuk memberikan perlindungan optimal dari bakteri dan jamur penyebab infeksi kaki. Dengan bahan aktif antimikroba yang membunuh kuman sekaligus menjaga kesehatan kulit kaki. Cocok untuk penggunaan setelah olahraga, sebelum memakai sepatu, atau sebagai perawatan kaki harian.`,
      seoParagraph: "Maklon Foot Anti-Bacterial — jasa maklon pelindung kaki antibakteri dan antijamur untuk higienitas maksimal. Aman untuk penggunaan harian. ✓ BPOM & Halal ✓ MOQ 1000 pcs.",
      benefits: [
        "Perlindungan Antibakteri & Antijamur — melawan infeksi kaki",
        "Formula Antiseptik Lembut — aman untuk kulit kaki",
        "Mencegah Bau Kaki — menghambat pertumbuhan bakteri penyebab bau",
        "Cocok untuk Aktifitas Olahraga & Sehari-hari",
        "Kemasan Praktis — mudah diaplikasikan",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Tea Tree Oil", origin: "Australia", function: "Antiseptik dan antijamur alami" },
        { name: "Benzalkonium Chloride", origin: "Germany", function: "Agen antibakteri aktif" },
        { name: "Aloe Vera Extract", origin: "Local", function: "Menenangkan dan melembapkan" },
      ],
      sizeOptions: ["50ml", "100ml", "200ml"],
      bottleOptions: ["Spray Bottle", "Pump Bottle", "Lotion Tube"],
      capOptions: ["Spray Cap", "Pump Cap", "Flip Cap"],
      moq: "1000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
  ],
  trustStats: [
    { icon: "flask", value: "10+", label: "Varian Formulasi", description: "Formulasi khusus untuk masalah kaki dari kekeringan hingga bau tidak sedap" },
    { icon: "shield-check", value: "CPKB Grade A", label: "Certified Factory", description: "Fasilitas produksi dengan standar kebersihan dan keamanan industri global" },
    { icon: "zap", value: "20%", label: "Urea Max Content", description: "Konsentrasi bahan aktif maksimal untuk efikasi restorasi kulit nyata" },
    { icon: "star", value: "97%", label: "Kepuasan Klien", description: "Tingkat kepuasan mitra brand dalam kategori perawatan kaki" },
  ],
  trustCategorySpecific: [
    { icon: "microscope", label: "Teknologi Keratolitik", description: "Teknologi pengelupasan sel kulit mati yang tebal secara aman dan efektif" },
    { icon: "wind", label: "Anti-Odor System", description: "Sistem penetral bau yang bekerja pada sumber bakteri" },
    { icon: "shield", label: "Aman untuk Kulit Sensitif", description: "Opsi formulasi lembut yang dirancang khusus untuk berbagai jenis kulit" },
    { icon: "zap", label: "Hasil Terlihat", description: "Perbaikan tumit pecah-pecah yang terlihat dalam 3-7 hari penggunaan rutin" },
  ],
  edukasi: [
    {
      title: "Kapan Harus Menggunakan Foot Cream vs Foot Scrub?",
      content: `<p><strong>Foot Scrub</strong> — digunakan 1-2 kali seminggu untuk:</p>
      <ul>
        <li>Mengangkat penumpukan sel kulit mati yang menebal.</li>
        <li>Sebelum melakukan perawatan mandiri (pedicure).</li>
        <li>Mengatasi area kulit yang mulai mengeras atau berkapalan.</li>
        <li><strong>Catatan:</strong> Tidak disarankan untuk penggunaan harian karena dapat mengiritasi kulit sehat.</li>
      </ul>
      <p><strong>Foot Cream</strong> — digunakan setiap hari (terutama malam hari):</p>
      <ul>
        <li>Menjaga kelembapan dan mencegah kekeringan di masa mendatang.</li>
        <li>Perawatan intensif saat tidur dengan efek hidrasi yang lama.</li>
        <li>Menjaga elastisitas kulit agar tidak mudah pecah-pecah kembali.</li>
        <li>Langkah proaktif untuk pemeliharaan kesehatan kaki jangka panjang.</li>
      </ul>`,
    },
    {
      title: "Mengapa Perawatan Kaki Sering Terabaikan?",
      content: `<p>Beberapa alasan mengapa perawatan kaki sering tidak menjadi prioritas:</p>
      <ul>
        <li><strong>Jauh dari Pandangan:</strong> Kaki berada di area yang jarang kita perhatikan secara detail setiap saat.</li>
        <li><strong>Fokus pada Area Tampak:</strong> Kita lebih banyak berinvestasi pada wajah dan rambut yang terlihat langsung di cermin.</li>
        <li><strong>Anggapan Kemewahan:</strong> Sering dianggap sebagai 'manjakan diri' daripada sebuah kebutuhan kesehatan.</li>
      </ul>
      <p>Padahal, kaki yang sehat dan halus meningkatkan kepercayaan diri secara signifikan, terutama saat menggunakan sandal terbuka atau bertelanjang kaki.</p>`,
    },
    {
      title: "Tips Hasil Maksimal untuk Rutinitas Perawatan Kaki",
      content: `<p>Untuk hasil optimal dalam merawat kaki:</p>
      <ul>
        <li><strong>Setelah Mandi:</strong> Gunakan scrub terlebih dahulu untuk mengangkat kulit mati, kemudian segera aplikasikan krim saat kulit masih lembap.</li>
        <li><strong>Perawatan Malam Hari:</strong> Oleskan foot cream dalam lapisan tebal sebelum tidur, gunakan kaus kaki katun untuk mengunci kelembapan sepanjang malam.</li>
        <li><strong>Konsistensi:</strong> Penggunaan harian yang rutin jauh lebih efektif daripada perawatan intensif yang hanya sesekali.</li>
        <li><strong>Perhatikan Sela Jari:</strong> Jangan hanya fokus pada tumit, sela-sela jari juga membutuhkan perhatian untuk menjaga kebersihan dan kesehatan.</li>
      </ul>`,
    },
  ],
  testimonials: [
    {
      quote: "Foot mask dari Dreamlab menjadi pembeda bagi brand saya. Tidak banyak brand lokal yang memilikinya, dan pelanggan yang mencoba sekali langsung melakukan pembelian ulang.",
      name: "Lina",
      brand: "Brand Sole Luxe",
      avatarImage: "",
      productImage: "/assets/images/client-foot-1.webp",
    },
    {
      quote: "Foot cream-nya benar-benar menyelamatkan saya dari masalah tumit pecah-pecah yang sudah bertahun-tahun saya alami. Dalam 3 minggu, kulit kaki saya kembali mulus.",
      name: "Sari",
      brand: "Pelanggan (Bandung)",
      avatarImage: "",
      productImage: "/assets/images/client-foot-2.webp",
    },
  ],
  faqs: [
    {
      question: "Berapa MOQ untuk maklon foot care di Dreamlab?",
      answer: "MOQ standar kami mulai dari 1000 pcs per varian. Untuk format masker kaki (booties), MOQ biasanya menyesuaikan dengan volume produksi kemasan sachet.",
    },
    {
      question: "Apakah bisa membuat paket bundling foot scrub dan foot cream?",
      answer: "Sangat bisa. Kami merekomendasikan paket bundling sebagai rangkaian perawatan lengkap yang memberikan nilai tambah bagi brand dan hasil yang lebih baik bagi konsumen.",
    },
    {
      question: "Seberapa cepat hasil penggunaan foot cream terlihat?",
      answer: "Untuk tumit yang sangat kering, perbaikan tekstur biasanya mulai terlihat dalam 3-7 hari penggunaan rutin setiap malam. Hasil maksimal dicapai setelah 2 minggu.",
    },
    {
      question: "Apakah produk perawatan kaki Dreamlab aman untuk penderita diabetes?",
      answer: "Kami dapat memformulasikan produk yang aman bagi kulit sensitif penderita diabetes, namun kami selalu menyarankan untuk berkonsultasi dengan tim ahli kami untuk formulasi khusus tersebut.",
    },
    {
      question: "Apakah foot scrub bisa digunakan setiap hari?",
      answer: "Tidak disarankan. Eksfoliasi fisik sebaiknya dilakukan maksimal 2 kali seminggu untuk menghindari penipisan lapisan kulit yang berlebihan dan iritasi.",
    },
  ],
  relatedProducts: [
    { name: "Foot Cream", slug: "foot-cream", image: "/new asset/footcare/Footcream-maklon .png", category: "Foot Care", categorySlug: "footcare" },
    { name: "Foot Scrub", slug: "foot-scrub", image: "/new asset/footcare/footscrub-maklonkosmetik-dreamlab.png", category: "Foot Care", categorySlug: "footcare" },
    { name: "Foot Mask", slug: "foot-mask", image: "/new asset/footcare/footmask-maklonkosmetik-dreamlab .png", category: "Foot Care", categorySlug: "footcare" },
    { name: "Foot Soak", slug: "foot-soak", image: "/new asset/footcare/maklon-soak-cream.png", category: "Foot Care", categorySlug: "footcare" },
    { name: "Foot Serum", slug: "foot-serum", image: "/new%20asset/footcare/foot-serum.jpeg", category: "Foot Care", categorySlug: "footcare" },
    { name: "Foot Spray", slug: "foot-spray", image: "/new asset/footcare/footspray-dreamlab-maklonkosmetik .png", category: "Foot Care", categorySlug: "footcare" },
    { name: "Foot Anti-Bacterial", slug: "foot-anti-bacterial", image: "/new asset/footcare/foot antibacterial-maklon ksometik.png", category: "Foot Care", categorySlug: "footcare" },
  ],
};
