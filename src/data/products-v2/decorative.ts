import { ProductCategoryV2 } from "@/types/product-v2";

export const decorativeData: ProductCategoryV2 = {
  slug: "decorative",
  name: "Decorative",
  tagline: "Ultra-Pigmentasi dengan Keamanan Terjamin",
  description: "Layanan maklon kosmetik dekoratif (makeup) berkualitas tinggi: liquid highlighter, mascara, cream blush, foundation serum, liquid blush, eyebrow gel, foundation, BB cream, face primer, lip matte, lip gloss, cushion, dan loose powder. Menggabungkan estetika tren global dengan standar keamanan grade industri.",
  heroImage: "/assets/images/decorative-hero.webp",
  bgColor: "#FFF5F5",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Produk", href: "/produk/" },
    { label: "Decorative", href: "/produk/decorative/" },
  ],
  comparisonOptions: ["Lip Cream", "Cushion", "Foundation", "Loose Powder", "Eye Makeup", "Liquid Highlighter", "Mascara", "Cream Blush", "Foundation Serum", "Liquid Blush", "Eyebrow Gel", "BB Cream", "Face Primer"],
  comparisonMatrix: {
    "Lip Cream": {
      konsentrasi: "High pigment, matte/satin",
      haltbarkeit: "Ketahanan 6-8 jam",
      marktposition: "Essential",
      moq: "2000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Long-wear, transfer-proof, bold",
      bestFor: ["Daily Wear", "Social Events", "Statement Look"],
      ingredients: ["High-Hue Pigments", "Silicone Wax", "Vitamin E"],
    },
    "Lip Tint": {
      konsentrasi: "Water/oil based tint",
      haltbarkeit: "Ketahanan 4-6 jam",
      marktposition: "Natural",
      moq: "2000 pcs",
      preisklasse: "Affordable",
      karakter: "Natural, gradient, tint-based",
      bestFor: ["Daily Look", "Gradient Lips", "Minimalist"],
      ingredients: ["Staining Agents", "Glycerin", "Botanical Extracts"],
    },
    Foundation: {
      konsentrasi: "Full coverage, buildable",
      haltbarkeit: "Ketahanan 8-10 jam",
      marktposition: "Essential",
      moq: "2000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Coverage, skin tone matching, seamless",
      bestFor: ["Daily Base", "Full Makeup Look", "Pro Use"],
      ingredients: ["Pigments", "Humectants", "Skin-like Emollients"],
    },
    Cushion: {
      konsentrasi: "Light-medium coverage, dewy",
      haltbarkeit: "Ketahanan 6-8 jam",
      marktposition: "Trending",
      moq: "2000 pcs",
      preisklasse: "Premium",
      karakter: "Dewy, effortless, touch-up friendly",
      bestFor: ["On-the-go", "Korean Look", "Light Coverage"],
      ingredients: ["Niacinamide", "Essence Infusion", "UV Filters"],
    },
    "Eye Product": {
      konsentrasi: "High pigment, varied finishes",
      haltbarkeit: "Ketahanan 6-12 jam",
      marktposition: "Specialty",
      moq: "2000 pcs",
      preisklasse: "Mid-Premium",
      karakter: "Precision, pigment, multi-finish",
      bestFor: ["Full Eye Look", "Artistry", "Drama"],
      ingredients: ["Pressed Pigments", "Mica", "Setting Polymers"],
    },
    "Liquid Highlighter": {
      konsentrasi: "Liquid pearl pigment",
      haltbarkeit: "Glow Tahan Lama",
      marktposition: "Trending",
      moq: "2000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Natural glow, blendable, buildable",
      bestFor: ["Everyday Glow", "Glass Skin", "Special Events"],
      ingredients: ["Mica", "Squalane", "Vitamin E"],
    },
    Mascara: {
      konsentrasi: "Cream wax formula",
      haltbarkeit: "Tahan 12 Jam Non-Smudge",
      marktposition: "Essential",
      moq: "2000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Volumizing, lengthening, waterproof",
      bestFor: ["Full Lashes", "Waterproof", "Daily Wear"],
      ingredients: ["Carnauba Wax", "Panthenol", "Iron Oxides"],
    },
    "Cream Blush": {
      konsentrasi: "Cream emollient base",
      haltbarkeit: "Natural Flush 6-8 Jam",
      marktposition: "Trending",
      moq: "2000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Natural, blendable, dewy",
      bestFor: ["Natural Look", "No-Makeup Makeup", "Dry Skin"],
      ingredients: ["Jojoba Oil", "Iron Oxides", "Vitamin E"],
    },
    "Foundation Serum": {
      konsentrasi: "Serum-based coverage",
      haltbarkeit: "Coverage + Skincare Seharian",
      marktposition: "Premium",
      moq: "2000 pcs",
      preisklasse: "Premium",
      karakter: "Lightweight, skincare-infused, buildable",
      bestFor: ["Daily Office", "Natural Look", "Skinimalism"],
      ingredients: ["Niacinamide", "Hyaluronic Acid", "Lightweight Silicones"],
    },
    "Liquid Blush": {
      konsentrasi: "Water-gel stain",
      haltbarkeit: "Stain Tahan Lama",
      marktposition: "Trending",
      moq: "2000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Stain, dewy, multi-use",
      bestFor: ["Daily Wear", "Layering", "Cheek & Lip"],
      ingredients: ["Water-based Gel", "Iron Oxides", "Glycerin"],
    },
    "Eyebrow Gel": {
      konsentrasi: "Tinted wax gel",
      haltbarkeit: "Hold & Tint Seharian",
      marktposition: "Essential",
      moq: "2000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Tinting, shaping, waterproof",
      bestFor: ["Brow Definition", "Natural Look", "Daily Routine"],
      ingredients: ["Natural Waxes", "Iron Oxides", "Panthenol"],
    },
    "BB Cream": {
      konsentrasi: "Multi-benefit cream",
      haltbarkeit: "All-in-One Seharian",
      marktposition: "Essential",
      moq: "2000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Coverage, SPF, skincare combined",
      bestFor: ["Quick Routine", "Travel", "Natural Look"],
      ingredients: ["Niacinamide", "SPF 30", "Hyaluronic Acid"],
    },
    "Face Primer": {
      konsentrasi: "Silicone-based primer",
      haltbarkeit: "Makeup Extender",
      marktposition: "Essential",
      moq: "2000 pcs",
      preisklasse: "Mid-Range",
      karakter: "Pore blurring, oil control, smoothing",
      bestFor: ["Makeup Prep", "Oily Skin", "Pore Care"],
      ingredients: ["Dimethicone", "Silica", "Niacinamide"],
    },
  },
  products: [
    {
      id: "liquid-highlighter",
      name: "Liquid Highlighter",
      slug: "liquid-highlighter",
      heroImage: "/new asset/make up/liquid-highlighter1.webp",
      galleryImages: ["/new asset/make up/liquid-highlighter1.webp"],
      tags: ["Glow", "Trending"],
      shortDescription: "Maklon Liquid Highlighter dengan pearl pigments untuk efek glow natural dari dalam. Tekstur cair mudah di-blend untuk hasil yang bercahaya.",
      story: `Liquid Highlighter adalah cara paling natural untuk memberikan dimensi pada wajah.

Liquid Highlighter Dreamlab diformulasikan dengan micro-fine pearl pigments yang memberikan efek glow dari dalam (lit-from-within). Tekstur cair yang mudah di-blend dengan jari atau sponge, bisa diaplikasikan di atas atau di bawah foundation. Cocok untuk highlighter di cheekbone, bridge hidung, dan cupid's bow.`,
      seoParagraph: "Maklon Liquid Highlighter — jasa maklon highlighter cair dengan pearl pigments untuk efek glow natural dari dalam. ✓ BPOM & Halal ✓ MOQ 2000 pcs.",
      benefits: ["Micro-fine Pearl Pigments", "Lit-from-Within Glow", "Blendable with Fingers", "Above or Below Foundation", "Cocok semua skin tone", "Sertifikasi BPOM & Halal"],
      ingredients: [{ name: "Mica", origin: "India", function: "Natural shimmer" }, { name: "Squalane", origin: "Spain", function: "Lightweight base, skin-compatible" }, { name: "Vitamin E", origin: "Switzerland", function: "Antioxidant protection" }],
          sizeOptions: ["15ml", "20ml"], bottleOptions: ["Pump Bottle", "Dropper Bottle", "Custom Exclusive Packaging"], capOptions: ["Rubber Dropper", "Flip Cap"],
      moq: "2000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "mascara",
      name: "Mascara",
      slug: "mascara",
      heroImage: "/new asset/make up/mascara.webp",
      galleryImages: ["/new asset/make up/mascara.webp"],
      tags: ["Volumizing", "Long Lasting"],
      shortDescription: "Maklon Mascara dengan formula volumizing dan tahan lama tanpa smudge. Brush ergonomis untuk bulu mata lentik dan bervolume.",
      story: `Mascara adalah produk makeup yang paling sering digunakan dan paling terlihat.

Mascara Dreamlab diformulasikan dengan polymers premium yang memberikan volume, length, dan curl dalam satu aplikasi. Brush design yang ergonomis menjangkau setiap helai bulu mata dari akar hingga ujung. Formula waterproof yang tahan seharian tanpa smudge atau flaking, namun mudah dibersihkan dengan makeup remover.`,
      seoParagraph: "Maklon Mascara — jasa maklon mascara volumizing waterproof tahan lama tanpa smudge. Brush ergonomis untuk bulu mata lentik. ✓ BPOM & Halal ✓ MOQ 2000 pcs.",
      benefits: ["Volumizing + Lengthening", "Waterproof, No Smudge", "Ergonomic Brush Design", "Easy to Remove", "Ophthalmologist tested", "Sertifikasi BPOM & Halal"],
      ingredients: [{ name: "Carnauba Wax", origin: "Brazil", function: "Film-forming, volume" }, { name: "Panthenol", origin: "Germany", function: "Lash conditioning" }, { name: "Iron Oxides", origin: "Germany", function: "Pigment, deep black color" }],
          sizeOptions: ["8ml", "10ml"], bottleOptions: ["Mascara Tube", "Custom Exclusive Packaging"], capOptions: ["Screw Cap with Brush"],
      moq: "2000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "cream-blush",
      name: "Cream Blush",
      slug: "cream-blush",
      heroImage: "/new asset/make up/cream-blush.webp",
      galleryImages: ["/new asset/make up/cream-blush.webp"],
      tags: ["Natural", "Blendable"],
      shortDescription: "Maklon Cream Blush dengan tekstur krim yang meleleh sempurna di kulit. Hasil natural dengan warna yang buildable.",
      story: `Cream blush memberikan hasil paling natural dibanding blush format lainnya.

Cream Blush Dreamlab diformulasikan dengan emollient ringan yang meleleh sempurna di kulit, memberikan warna yang buildable dan mudah di-blend dengan jari. Tekstur cream yang menyatu dengan foundation dan skincare di bawahnya, memberikan efek flushed-from-within yang natural. Tersedia dalam range shade dari nude hingga bold.`,
      seoParagraph: "Maklon Cream Blush — jasa maklon blush on cream dengan hasil natural dan buildable. Tekstur meleleh sempurna di kulit. ✓ BPOM & Halal ✓ MOQ 2000 pcs.",
      benefits: ["Buildable, Natural Color", "Melts into Skin", "Blendable with Fingers", "Works with Foundation", "Range: Nude to Bold", "Sertifikasi BPOM & Halal"],
      ingredients: [{ name: "Jojoba Oil", origin: "Israel", function: "Lightweight emollient base" }, { name: "Iron Oxides", origin: "Germany", function: "Natural color pigments" }, { name: "Vitamin E", origin: "Switzerland", function: "Antioxidant, skin nourishment" }],
          sizeOptions: ["5g", "8g"], bottleOptions: ["Jar", "Stick", "Tube", "Custom Exclusive Packaging"], capOptions: ["Screw Lid", "Cap"],
      moq: "2000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "lip-matte",
      name: "Lip Matte",
      slug: "lip-matte",
      heroImage: "/assets/images/LIP-MATTE.webp",
      galleryImages: ["/assets/images/LIP-MATTE.webp"],
      tags: ["Trending", "Long Lasting", "Instagram"],
      shortDescription: "Maklon Lip Matte dengan formula pigmentasi tinggi dan hasil akhir matte. Tahan 6-8 jam tanpa transfer — ideal untuk tampilan harian yang rapi.",
      story: `Lip matte adalah tentang pernyataan diri: Berani, percaya diri, dan tegas.

Bukan sekadar pewarna bibir, lip matte memberikan warna yang intens yang tetap bertahan dari pagi hingga malam. Di Dreamlab, kami memformulasikan lip matte yang tidak hanya memberikan hasil akhir matte yang sempurna, tetapi juga menjaga kenyamanan bibir. Tanpa rasa kering, tanpa pecah-pecah (cakey), dan tanpa rasa berat. Sebuah perpaduan antara estetika warna dan teknologi kenyamanan kulit.`,
      seoParagraph: "Maklon Lip Matte — jasa maklon lipstik matte tahan lama 6-8 jam tidak transfer. Pilihan 50+ warna dari nude hingga bold. ✓ BPOM & Halal ✓ MOQ 1000 pcs. Konsultasi maklon lip matte bersama Dreamlab.",
      benefits: [
        "High Pigment — saturasi warna maksimal dalam satu kali oles",
        "Long-Wear 6-8 Jam — minim touch-up sepanjang hari",
        "Transfer-Proof — tidak menempel pada masker atau gelas",
        "Non-Drying Formula — diperkaya pelembap agar bibir tetap nyaman",
        "Range Warna Luas — mulai dari nude, bold red, hingga tren mauve",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "High-Hue Pigments", origin: "Germany", function: "Warna yang intens dan coverage penuh" },
        { name: "Silicone Wax", origin: "Germany", function: "Ketahanan lama dan aplikasi yang halus" },
        { name: "Vitamin E", origin: "Switzerland", function: "Nutrisi bibir dan mencegah kekeringan" },
      ],
      sizeOptions: ["3ml", "4ml", "5ml"],
      bottleOptions: ["Lip Cream Tube", "Lipstick Case", "Custom Exclusive Packaging"],
      capOptions: ["Snap Cap", "Magnetic Cap", "Weighted Cap"],
      moq: "2000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "lip-gloss",
      name: "Lip Gloss",
      slug: "lip-gloss",
      heroImage: "/assets/images/LIP-GLOSS.webp",
      galleryImages: ["/assets/images/LIP-GLOSS.webp"],
      tags: ["Glossy", "Plumping", "Youth"],
      shortDescription: "Maklon Lip Gloss dengan hasil akhir berkilau dan efek plumping. Memberikan tampilan bibir yang lebih segar, sehat, dan tampak lebih penuh.",
      story: `Tren bibir berkilau kembali menjadi primadona dalam dunia kecantikan global.

Ada kesan abadi dari tampilan bibir yang 'glossy'. Hal ini memberikan kesan wajah yang lebih hidup, muda, dan mudah didekati. Di Dreamlab, kami menciptakan lip gloss yang memberikan kilau maksimal tanpa rasa lengket atau berat yang mengganggu. Dengan tambahan efek plumping untuk volume ekstra, produk ini adalah pilihan tepat untuk audiens yang menginginkan tampilan bibir sehat alami.`,
      seoParagraph: "Maklon Lip Gloss solusi bagi brand yang ingin menawarkan produk bibir yang relevan dengan tren kecantikan Korea (K-Beauty) yang sangat populer di Indonesia. Dengan formula non-sticky dan efek plumping, lip gloss Dreamlab disukai oleh pasar generasi muda. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan bersertifikasi BPOM & Halal.",
      benefits: [
        "Non-Sticky Formula — nyaman dipakai tanpa rasa lengket yang mengganggu",
        "Plumping Effect — memberikan kesan bibir lebih penuh dan bervolume",
        "Pilihan Finish — tersedia dalam format bening, warna sheer, hingga glitter",
        "Kustomisasi Kilau — tingkat kecemerlangan yang dapat diatur sesuai konsep brand",
        "Tekstur Ringan — tidak terasa berat meski diaplikasikan berulang",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Hydrogenated Polyisobutene", origin: "Germany", function: "Tekstur berkilau tanpa rasa lengket" },
        { name: "Hyaluronic Acid Spheres", origin: "Korea", function: "Plumping — memberikan volume sementara" },
        { name: "Vitamin E", origin: "Switzerland", function: "Nutrisi dan menjaga kelembapan bibir" },
      ],
      sizeOptions: ["5ml", "8ml", "10ml"],
      bottleOptions: ["Lip Gloss Tube", "Applicator Tube", "Custom Exclusive Packaging"],
      capOptions: ["Wand Cap", "Doe-foot Cap", "Magnetic Cap"],
      moq: "2000 pcs",
      productionTime: "2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "liquid-foundation",
      name: "Liquid Foundation",
      slug: "liquid-foundation",
      heroImage: "/assets/images/foundation-scaled.webp",
      galleryImages: ["/assets/images/foundation-scaled.webp"],
      tags: ["Essential", "Coverage", "Base"],
      shortDescription: "Maklon Liquid Foundation dengan coverage yang dapat diatur. Diformulasikan khusus untuk kulit Indonesia dan tahan di iklim tropis.",
      story: `Foundation adalah titik di mana seni merias bertemu dengan sains perawatan kulit.

Bukan hanya untuk menyamarkan ketidaksempurnaan, foundation modern juga harus merawat kulit selama pemakaian. Foundation ideal harus mampu menyatu sempurna dengan warna kulit asli, tahan terhadap kelembapan udara Indonesia, tidak mengalami oksidasi, dan memberikan kepercayaan diri sepanjang hari.

Di Dreamlab, kami memformulasikan foundation yang bekerja harmonis dengan karakteristik kulit tropis: pilihan warna yang sesuai dengan undertone hangat (warm undertone) dan tekstur yang tidak menyumbat pori-pori.`,
      seoParagraph: "Maklon Liquid Foundation solusi bagi brand yang ingin menawarkan produk dasar makeup (base) yang esensial. Dengan pilihan warna yang disesuaikan untuk kulit Indonesia dan formula yang tahan lama di iklim lembap, liquid foundation Dreamlab memberikan dasar riasan yang sempurna sepanjang hari. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan bersertifikasi BPOM & Halal.",
      benefits: [
        "Warna Kustom untuk Kulit Indonesia — ramah terhadap warm undertone",
        "Pilihan Coverage — tersedia dalam format Sheer, Medium, hingga Full",
        "Pilihan Finish — hasil akhir Dewy, Natural, Matte, atau Satin",
        "Anti-Oksidasi — warna tetap stabil dan tidak menggelap sepanjang hari",
        "Kandungan Skincare — diperkaya Niacinamide dan Hyaluronic Acid",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Bismuth Oxychloride", origin: "USA", function: "Memberikan efek soft-focus dan hasil akhir sempurna" },
        { name: "Niacinamide", origin: "Korea", function: "Membantu mengecilkan tampilan pori-pori" },
        { name: "Hyaluronic Acid", origin: "Germany", function: "Hidrasi dan menjaga kelembutan kulit" },
      ],
      sizeOptions: ["20ml", "30ml", "50ml"],
      bottleOptions: ["Pump Bottle", "Dropper Bottle", "Squeeze Tube"],
      capOptions: ["Pump Cap", "Screw Cap", "Luxury Lid"],
      moq: "2000 pcs",
      productionTime: "2-3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "cushion-foundation",
      name: "Cushion Foundation",
      slug: "cushion-foundation",
      heroImage: "/assets/images/decorative-hero.webp",
      galleryImages: ["/assets/images/decorative-hero.webp"],
      tags: ["Trending", "Dewy", "Easy Application"],
      shortDescription: "Maklon Cushion Foundation untuk aplikasi praktis dengan hasil dewy. Ideal untuk penggunaan on-the-go dan tren K-Beauty.",
      story: `Cushion merevolusi cara kita mengaplikasikan dasar riasan di mana saja dan kapan saja.

Kepraktisan adalah kunci kesuksesan produk ini. Dengan format compact yang sudah dilengkapi puff khusus, konsumen dapat mencapai hasil akhir yang sempurna hanya dengan gerakan menepuk ringan (tap). Dreamlab memformulasikan cushion yang memberikan hasil dewy yang sehat tanpa kesan berminyak berlebih, menjadikannya produk favorit untuk pasar modern yang dinamis.`,
      seoParagraph: "Maklon Cushion Foundation solusi bagi brand yang ingin mengikuti tren kecantikan praktis. Dengan formula yang ringan namun memberikan coverage yang merata, cushion Dreamlab menawarkan kemudahan aplikasi dan portabilitas tinggi. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan. Sangat diminati oleh target pasar milenial dan Gen Z bersertifikasi BPOM & Halal.",
      benefits: [
        "Aplikasi Praktis — cepat dan mudah diaplikasikan di mana saja",
        "Dewy Finish — memberikan kesan kulit sehat dan bercahaya alami",
        "Formula Ringan — tidak terasa berat meski digunakan seharian",
        "SPF Infused — memberikan perlindungan tambahan dari sinar UV",
        "Kustomisasi Packaging — desain compact yang elegan dan modern",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Niacinamide", origin: "Korea", function: "Mencerahkan kulit saat pemakaian" },
        { name: "Essence Infusion", origin: "Germany", function: "Menjaga kelembapan kulit di dalam foundation" },
        { name: "UV Filters", origin: "Switzerland", function: "Perlindungan kulit dari sinar matahari" },
      ],
      sizeOptions: ["15g"],
      bottleOptions: ["Cushion Case", "Refill Pack", "Custom Exclusive Packaging"],
      capOptions: ["Snap Lid", "Luxury Metal Finish"],
      moq: "2000 pcs",
      productionTime: "3 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
    {
      id: "loose-powder",
      name: "Loose Powder",
      slug: "loose-powder",
      heroImage: "/assets/images/decorative-hero.webp",
      galleryImages: ["/assets/images/decorative-hero.webp"],
      tags: ["Face", "Setting", "Oil Control"],
      shortDescription: "Maklon Loose Powder ultra-halus untuk mengunci makeup dan mengontrol minyak. Memberikan efek blur pada pori-pori dan tekstur kulit.",
      story: `Sentuhan akhir yang menentukan daya tahan seluruh tampilan makeup Anda.

Loose powder Dreamlab diproses dengan teknologi "micro-milling" untuk menghasilkan butiran bedak yang sangat halus (ultra-fine). Produk ini secara efektif mengunci foundation, menyerap kelebihan minyak, dan memberikan efek "soft-focus" yang menyamarkan pori-pori tanpa membuat wajah terlihat kusam (cakey). Esensial untuk tampilan makeup yang rapi sepanjang hari.`,
      seoParagraph: "Maklon Loose Powder solusi bagi brand yang ingin menawarkan produk setting powder kualitas tinggi. Dengan butiran bedak ultra-halus, bedak tabur Dreamlab memberikan hasil akhir matte yang ringan dan halus. MOQ mulai 1000 pcs dengan waktu produksi 2-3 bulan. Tersedia varian translucent dan tinted shade bersertifikasi BPOM & Halal.",
      benefits: [
        "Ultra-Fine Particles — butiran sangat halus untuk hasil yang rata",
        "Oil Control — menjaga wajah bebas kilap sepanjang hari",
        "Pore Blurring Effect — menyamarkan tekstur dan pori-pori wajah",
        "Lightweight Feel — terasa ringan seperti tidak menggunakan bedak",
        "Talc-Free Option — tersedia pilihan tanpa talc untuk pasar clean beauty",
        "Sertifikasi BPOM & Halal",
      ],
      ingredients: [
        { name: "Mica", origin: "India", function: "Memberikan kilau alami dan tekstur halus" },
        { name: "Kaolin Clay", origin: "USA", function: "Menyerap minyak berlebih secara alami" },
        { name: "Corn Starch", origin: "Local/Import", function: "Alternatif talc yang aman dan lembut" },
      ],
      sizeOptions: ["10g", "20g", "30g"],
      bottleOptions: ["Sifter Jar", "Compact Case", "Custom Exclusive Packaging"],
      capOptions: ["Screw Lid", "Mirror Lid", "Luxury Metal Lid"],
      moq: "1000 pcs",
      productionTime: "2 bulan",
      certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
    },
  ],
  subCategories: [
    {
      id: "make-up",
      name: "Make Up",
      slug: "make-up",
      description: "Produk makeup berkualitas tinggi: foundation, blush, mascara, dan lainnya. Ultra-pigmentasi dengan formula yang nyaman seharian.",
      heroImage: "/assets/images/decorative-hero.webp",
      bgColor: "#FFF0F5",
      products: [
        {
          id: "liquid-highlighter", name: "Liquid Highlighter", slug: "liquid-highlighter",
          heroImage: "/assets/images/decorative-hero.webp", galleryImages: ["/assets/images/decorative-hero.webp"],
          tags: ["Glow", "Trending"],
          shortDescription: "Highlighter cair untuk efek glow natural.",
          story: `Liquid Highlighter adalah cara paling natural untuk memberikan dimensi pada wajah.

Liquid Highlighter Dreamlab diformulasikan dengan micro-fine pearl pigments yang memberikan efek glow dari dalam (lit-from-within). Tekstur cair yang mudah di-blend dengan jari atau sponge, bisa diaplikasikan di atas atau di bawah foundation. Cocok untuk highlighter di cheekbone, bridge hidung, dan cupid's bow.`,
          seoParagraph: "Maklon Liquid Highlighter — jasa maklon highlighter cair dengan pearl pigments untuk efek glow natural. ✓ BPOM & Halal ✓ MOQ 2000 pcs.",
          benefits: ["Micro-fine Pearl Pigments", "Lit-from-Within Glow", "Blendable with Fingers", "Above or Below Foundation", "Cocok semua skin tone", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Mica", origin: "India", function: "Natural shimmer" }, { name: "Squalane", origin: "Spain", function: "Lightweight base, skin-compatible" }, { name: "Vitamin E", origin: "Switzerland", function: "Antioxidant protection" }],
      sizeOptions: ["15ml", "20ml"], bottleOptions: ["Pump Bottle", "Dropper Bottle", "Custom Exclusive Packaging"], capOptions: ["Rubber Dropper", "Flip Cap"],
          moq: "2000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "mascara", name: "Mascara", slug: "mascara",
          heroImage: "/assets/images/decorative-hero.webp", galleryImages: ["/assets/images/decorative-hero.webp"],
          tags: ["Volumizing", "Long Lasting"],
          shortDescription: "Mascara volumizing tahan lama tanpa smudge.",
          story: `Mascara adalah produk makeup yang paling sering digunakan dan paling terlihat.

Mascara Dreamlab diformulasikan dengan polymers premium yang memberikan volume, length, dan curl dalam satu aplikasi. Brush design yang ergonomis menjangkau setiap helai bulu mata dari akar hingga ujung. Formula waterproof yang tahan seharian tanpa smudge atau flaking, namun mudah dibersihkan dengan makeup remover.`,
          seoParagraph: "Maklon Mascara — jasa maklon mascara volumizing waterproof tahan lama tanpa smudge. ✓ BPOM & Halal ✓ MOQ 2000 pcs.",
          benefits: ["Volumizing + Lengthening", "Waterproof, No Smudge", "Ergonomic Brush Design", "Easy to Remove", "Ophthalmologist tested", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Carnauba Wax", origin: "Brazil", function: "Film-forming, volume" }, { name: "Panthenol", origin: "Germany", function: "Lash conditioning" }, { name: "Iron Oxides", origin: "Germany", function: "Pigment, deep black color" }],
      sizeOptions: ["8ml", "10ml"], bottleOptions: ["Mascara Tube", "Custom Exclusive Packaging"], capOptions: ["Screw Cap with Brush"],
          moq: "2000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "cream-blush", name: "Cream Blush", slug: "cream-blush",
          heroImage: "/assets/images/decorative-hero.webp", galleryImages: ["/assets/images/decorative-hero.webp"],
          tags: ["Natural", "Blendable"],
          shortDescription: "Blush on cream dengan hasil natural dan mudah di-blend.",
          story: `Cream blush memberikan hasil paling natural dibanding blush format lainnya.

Cream Blush Dreamlab diformulasikan dengan emollient ringan yang meleleh sempurna di kulit, memberikan warna yang buildable dan mudah di-blend dengan jari. Tekstur cream yang menyatu dengan foundation dan skincare di bawahnya, memberikan efek flushed-from-within yang natural. Tersedia dalam range shade dari nude hingga bold.`,
          seoParagraph: "Maklon Cream Blush — jasa maklon blush on cream dengan hasil natural dan buildable. ✓ BPOM & Halal ✓ MOQ 2000 pcs.",
          benefits: ["Buildable, Natural Color", "Melts into Skin", "Blendable with Fingers", "Works with Foundation", "Range: Nude to Bold", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Jojoba Oil", origin: "Israel", function: "Lightweight emollient base" }, { name: "Iron Oxides", origin: "Germany", function: "Natural color pigments" }, { name: "Vitamin E", origin: "Switzerland", function: "Antioxidant, skin nourishment" }],
      sizeOptions: ["5g", "8g"], bottleOptions: ["Jar", "Stick", "Tube", "Custom Exclusive Packaging"], capOptions: ["Screw Lid", "Cap"],
          moq: "2000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "foundation-serum", name: "Foundation Serum", slug: "foundation-serum",
          heroImage: "/assets/images/foundation-scaled.webp", galleryImages: ["/assets/images/foundation-scaled.webp"],
          tags: ["Skincare-Makeup", "Lightweight"],
          shortDescription: "Foundation ringan dengan kandungan skincare.",
          story: `Foundation Serum adalah inovasi yang menggabungkan coverage foundation dengan manfaat skincare.

Foundation Serum Dreamlab diformulasikan dengan basis serum yang ultra-ringan, diperkaya Niacinamide dan Hyaluronic Acid yang merawat kulit saat Anda memakai makeup. Coverage medium yang buildable, finish natural dewy yang membuat kulit terlihat sehat dan bercahaya. Makeup yang merawat, bukan sekadar menutupi.`,
          seoParagraph: "Maklon Foundation Serum — jasa maklon foundation ringan dengan Niacinamide dan Hyaluronic Acid, makeup yang merawat. ✓ BPOM & Halal ✓ MOQ 2000 pcs.",
          benefits: ["Niacinamide + Hyaluronic Acid", "Ultra-lightweight Serum Base", "Medium Buildable Coverage", "Natural Dewy Finish", "Makeup that Skincare", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Niacinamide", origin: "Korea", function: "Brightening, pore minimizing" }, { name: "Hyaluronic Acid", origin: "Germany", function: "Hydration, plumping" }, { name: "Lightweight Silicones", origin: "Germany", function: "Smooth application, blurring" }],
          sizeOptions: ["20ml", "30ml"], bottleOptions: ["Pump Bottle", "Dropper Bottle", "Custom Exclusive Packaging"], capOptions: ["Rubber Dropper", "Pump Cap"],
          moq: "2000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "liquid-blush", name: "Liquid Blush", slug: "liquid-blush",
          heroImage: "/assets/images/decorative-hero.webp", galleryImages: ["/assets/images/decorative-hero.webp"],
          tags: ["Dewy", "Long Wear"],
          shortDescription: "Blush cair dengan hasil dewy dan tahan lama.",
          story: `Liquid blush memberikan warna yang paling natural dan tahan lama di kulit.

Liquid Blush Dreamlab diformulasikan dengan water-gel base yang memberikan warna stain natural yang menyatu dengan kulit. Tekstur cair yang mudah diaplikasikan dan di-blend, memberikan efek dewy yang sehat. Tahan seharian tanpa perlu touch-up, dan bisa digunakan di pipi maupun bibir untuk look yang kohesif.`,
          seoParagraph: "Maklon Liquid Blush — jasa maklon blush cair dengan hasil dewy dan stain tahan lama. ✓ BPOM & Halal ✓ MOQ 2000 pcs.",
          benefits: ["Water-Gel Stain Formula", "Dewy, Healthy Finish", "Long-wearing Stain", "Cheek + Lip Multi-use", "Easy to Blend", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Water-based Gel", origin: "Laboratory", function: "Lightweight, breathable base" }, { name: "Iron Oxides", origin: "Germany", function: "Natural color pigments" }, { name: "Glycerin", origin: "Germany", function: "Humectant, dewy finish" }],
          sizeOptions: ["15ml", "20ml"], bottleOptions: ["Dropper Bottle", "Pump Bottle", "Custom Exclusive Packaging"], capOptions: ["Flip Cap", "Rubber Dropper"],
          moq: "2000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "eyebrow-gel", name: "Eyebrow Gel", slug: "eyebrow-gel",
          heroImage: "/assets/images/decorative-hero.webp", galleryImages: ["/assets/images/decorative-hero.webp"],
          tags: ["Tinting", "Hold"],
          shortDescription: "Gel alis dengan efek tint dan hold seharian.",
          story: `Eyebrow gel adalah solusi cepat untuk alis yang rapi dan terdefinisi.

Eyebrow Gel Dreamlab menggabungkan formula tint yang memberikan warna natural pada bulu alis dengan hold yang menjaga bentuk alis seharian. Brush applicator yang presisi memudahkan aplikasi, dan formula waterproof yang tahan terhadap keringat dan kelembapan. Hasil: alis yang terlihat full, rapi, dan natural.`,
          seoParagraph: "Maklon Eyebrow Gel — jasa maklon gel alis dengan efek tint dan hold tahan seharian. ✓ BPOM & Halal ✓ MOQ 2000 pcs.",
          benefits: ["Tint + Hold in One", "Precise Brush Applicator", "Waterproof Formula", "Natural, Full-looking Brows", "All-day Hold", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Natural Waxes", origin: "Germany", function: "Hold and shaping" }, { name: "Iron Oxides", origin: "Germany", function: "Natural tint color" }, { name: "Panthenol", origin: "Germany", function: "Brow conditioning" }],
          sizeOptions: ["5ml", "8ml"], bottleOptions: ["Jar", "Custom Exclusive Packaging"], capOptions: ["Screw Cap with Brush"],
          moq: "2000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "foundation", name: "Foundation", slug: "foundation",
          heroImage: "/assets/images/foundation-scaled.webp", galleryImages: ["/assets/images/foundation-scaled.webp"],
          tags: ["Full Coverage", "Essential"],
          shortDescription: "Foundation full coverage untuk kulit flawless.",
          story: `Foundation full coverage adalah dasar makeup yang memberikan hasil flawless dan percaya diri.

Foundation Dreamlab diformulasikan dengan pigmen tinggi yang memberikan coverage full namun tetap terasa ringan di kulit. Formula long-wear yang tahan hingga 12 jam tanpa oksidasi atau cakey. Tersedia dalam range shade yang disesuaikan untuk undertone kulit Indonesia — dari fair hingga deep dengan warm dan neutral undertones.`,
          seoParagraph: "Maklon Foundation — jasa maklon foundation full coverage long-wear dengan shade untuk kulit Indonesia. ✓ BPOM & Halal ✓ MOQ 2000 pcs.",
          benefits: ["Full Coverage, Lightweight", "12-Hour Long-wear", "Anti-Oxidation Formula", "Shades for Indonesian Skin", "Buildable Coverage", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Bismuth Oxychloride", origin: "USA", function: "Soft-focus, smooth finish" }, { name: "Niacinamide", origin: "Korea", function: "Brightening during wear" }, { name: "Silicone Elastomers", origin: "Germany", function: "Long-wear, blurring" }],
          sizeOptions: ["20ml", "30ml", "50ml"], bottleOptions: ["Pump Bottle", "Cushion Case", "Stick", "Custom Exclusive Packaging"], capOptions: ["Pump Cap", "Screw Cap"],
          moq: "2000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "bb-cream", name: "BB Cream", slug: "bb-cream",
          heroImage: "/assets/images/decorative-hero.webp", galleryImages: ["/assets/images/decorative-hero.webp"],
          tags: ["Multi-Benefit", "SPF"],
          shortDescription: "BB cream dengan SPF dan coverage ringan.",
          story: `BB Cream adalah produk all-in-one yang menggabungkan skincare, makeup, dan sun protection.

BB Cream Dreamlab memberikan coverage ringan yang menyamarkan ketidaksempurnaan, SPF 30 untuk perlindungan UV, dan bahan skincare seperti Niacinamide dan Hyaluronic Acid yang merawat kulit sepanjang hari. Sempurna untuk konsumen yang ingin tampilan natural dengan langkah minimal — satu produk untuk semuanya.`,
          seoParagraph: "Maklon BB Cream — jasa maklon BB cream multi-benefit dengan SPF 30 dan Niacinamide. ✓ BPOM & Halal ✓ MOQ 2000 pcs.",
          benefits: ["Coverage + SPF 30 + Skincare", "Niacinamide + Hyaluronic Acid", "Lightweight, Natural Finish", "One Product, Multi-Benefit", "Cocok daily use", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Niacinamide", origin: "Korea", function: "Brightening, pore care" }, { name: "SPF 30 Filters", origin: "Germany", function: "UV protection" }, { name: "Hyaluronic Acid", origin: "Germany", function: "Hydration, plumping" }],
          sizeOptions: ["20ml", "30ml"], bottleOptions: ["Tube", "Pump Bottle", "Custom Exclusive Packaging"], capOptions: ["Flip Cap", "Pump Cap"],
          moq: "2000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "face-primer", name: "Face Primer", slug: "face-primer",
          heroImage: "/assets/images/decorative-hero.webp", galleryImages: ["/assets/images/decorative-hero.webp"],
          tags: ["Base", "Pore Blurring"],
          shortDescription: "Primer wajah untuk makeup tahan lama dan pori tersamarkan.",
          story: `Face Primer adalah langkah krusial yang menentukan seberapa baik makeup Anda menempel dan bertahan.

Face Primer Dreamlab diformulasikan dengan silicone elastomers yang mengisi pori-pori dan garis halus, menciptakan canvas yang sempurna untuk foundation. Formula yang memperpanjang daya tahan makeup hingga 2x lebih lama, mengontrol minyak berlebih, dan memberikan efek blurring yang menyamarkan tekstur kulit.`,
          seoParagraph: "Maklon Face Primer — jasa maklon primer wajah untuk makeup tahan lama dan pore blurring. ✓ BPOM & Halal ✓ MOQ 2000 pcs.",
          benefits: ["Pore Blurring Effect", "2x Makeup Longevity", "Oil Control", "Smooth Canvas for Foundation", "Lightweight, Invisible", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Dimethicone", origin: "Germany", function: "Pore filling, smoothing" }, { name: "Silica", origin: "Germany", function: "Oil absorption, blurring" }, { name: "Niacinamide", origin: "Korea", function: "Pore minimizing, brightening" }],
          sizeOptions: ["20ml", "30ml"], bottleOptions: ["Tube", "Pump Bottle", "Custom Exclusive Packaging"], capOptions: ["Flip Cap", "Pump Cap"],
          moq: "2000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
      ],
    },
    {
      id: "lipcare",
      name: "Lipcare",
      slug: "lipcare",
      description: "Perawatan dan pewarna bibir: lip matte, lip gloss, lip balm, dan lainnya. Formula nyaman dengan pigmentasi tinggi.",
      heroImage: "/assets/images/LIP-MATTE.webp",
      bgColor: "#FCE4EC",
      products: [
        {
          id: "lip-cream", name: "Lip Cream", slug: "lip-cream",
          heroImage: "/assets/images/LIP-MATTE.webp", galleryImages: ["/assets/images/LIP-MATTE.webp"],
          tags: ["Creamy", "Long Lasting"],
          shortDescription: "Lip cream dengan tekstur creamy dan warna intens.",
          story: `Lip cream menggabungkan pigmentasi lipstik dengan kenyamanan krim.

Lip Cream Dreamlab diformulasikan dengan tekstur creamy yang mudah diaplikasikan, memberikan warna intens yang buildable. Formula long-wear yang tahan 6-8 jam tanpa transfer, namun tetap nyaman di bibir tanpa rasa kering atau cracking. Diperkaya Vitamin E dan Shea Butter untuk menjaga kelembapan bibir sepanjang hari.`,
          seoParagraph: "Maklon Lip Cream — jasa maklon lip cream creamy dengan warna intens dan long-wear 6-8 jam. ✓ BPOM & Halal ✓ MOQ 2000 pcs.",
          benefits: ["Creamy, Easy Application", "Intense, Buildable Color", "6-8 Hour Long-wear", "Transfer-Resistant", "Vitamin E + Shea Butter", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "High-Hue Pigments", origin: "Germany", function: "Intense color payoff" }, { name: "Shea Butter", origin: "Africa", function: "Moisturizing, comfortable wear" }, { name: "Vitamin E", origin: "Switzerland", function: "Lip nourishment" }],
          sizeOptions: ["3ml", "4ml", "5ml"], bottleOptions: ["Lip Roll Bottle", "Doe Foot Applicator Bottle"], capOptions: ["Snap Cap", "Magnetic Cap"],
          moq: "2000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "lip-serum", name: "Lip Serum", slug: "lip-serum",
          heroImage: "/assets/images/LIP-MATTE.webp", galleryImages: ["/assets/images/LIP-MATTE.webp"],
          tags: ["Treatment", "Plumping"],
          shortDescription: "Serum bibir untuk perawatan dan efek plumping.",
          story: `Lip Serum adalah treatment intensif untuk bibir yang kering, tipis, atau tidak merata.

Lip Serum Dreamlab diformulasikan dengan Hyaluronic Acid Spheres yang memberikan efek plumping sementara, Peptide yang merangsang kolagen bibir, dan Ceramide yang memperbaiki skin barrier bibir. Gunakan sebagai treatment malam hari atau sebagai base di bawah lipstik untuk hasil yang lebih smooth dan full.`,
          seoParagraph: "Maklon Lip Serum — jasa maklon serum bibir dengan Hyaluronic Acid dan Peptide untuk plumping dan perawatan. ✓ BPOM & Halal ✓ MOQ 2000 pcs.",
          benefits: ["Hyaluronic Acid Plumping", "Peptide Collagen Boost", "Ceramide Barrier Repair", "Overnight Treatment", "Smooth Lip Base", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Hyaluronic Acid Spheres", origin: "Korea", function: "Plumping, volume" }, { name: "Peptide Complex", origin: "Switzerland", function: "Collagen stimulation" }, { name: "Ceramide NP", origin: "Germany", function: "Lip barrier repair" }],
          sizeOptions: ["5ml", "10ml"], bottleOptions: ["Lip Roll Bottle", "Doe Foot Applicator Bottle"], capOptions: ["Rubber Dropper", "Flip Cap"],
          moq: "2000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "lip-balm", name: "Lip Balm", slug: "lip-balm",
          heroImage: "/assets/images/LIP-MATTE.webp", galleryImages: ["/assets/images/LIP-MATTE.webp"],
          tags: ["Moisturizing", "Daily"],
          shortDescription: "Lip balm pelembap bibir untuk penggunaan harian.",
          story: `Lip balm adalah produk esensial yang setiap orang butuhkan di tas mereka.

Lip Balm Dreamlab diformulasikan dengan campuran beeswax, Shea Butter, dan Jojoba Oil yang memberikan perlindungan dan kelembapan optimal untuk bibir. Tekstur yang tidak terlalu berat, tidak terlalu ringan — sempurna untuk penggunaan harian. Tersedia dalam varian unscented dan berbagai aroma alami.`,
          seoParagraph: "Maklon Lip Balm — jasa maklon lip balm pelembap dengan beeswax dan Shea Butter untuk perlindungan harian. ✓ BPOM & Halal ✓ MOQ 2000 pcs.",
          benefits: ["Beeswax + Shea Butter", "All-Day Moisture Protection", "Lightweight, Non-Sticky", "Unscented + Flavored Options", "Essential Daily Product", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Beeswax", origin: "Local", function: "Protective barrier" }, { name: "Shea Butter", origin: "Africa", function: "Deep moisturizing" }, { name: "Jojoba Oil", origin: "Israel", function: "Skin-compatible hydration" }],
          sizeOptions: ["4g", "5g"], bottleOptions: ["Lip Roll Bottle", "Doe Foot Applicator Bottle"], capOptions: ["Twist Cap", "Screw Lid"],
          moq: "2000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "tinted-lip-balm", name: "Tinted Lip Balm", slug: "tinted-lip-balm",
          heroImage: "/assets/images/LIP-MATTE.webp", galleryImages: ["/assets/images/LIP-MATTE.webp"],
          tags: ["Tinted", "Natural"],
          shortDescription: "Lip balm berwarna untuk tampilan natural seharian.",
          story: `Tinted Lip Balm adalah solusi bagi yang ingin warna natural tanpa effort makeup penuh.

Tinted Lip Balm Dreamlab menggabungkan kelembapan lip balm dengan sentuhan warna sheer yang natural. Memberikan hint of color yang menyempurnakan tampilan tanpa terlihat berlebihan. Formula yang melembapkan sambil memberikan warna, sempurna untuk no-makeup makeup look.`,
          seoParagraph: "Maklon Tinted Lip Balm — jasa maklon lip balm berwarna dengan hint of color natural dan kelembapan. ✓ BPOM & Halal ✓ MOQ 2000 pcs.",
          benefits: ["Sheer, Natural Color", "Moisturizing + Tinted", "No-Makeup Makeup Look", "Buildable Coverage", "Multiple Natural Shades", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Beeswax", origin: "Local", function: "Protective barrier" }, { name: "Shea Butter", origin: "Africa", function: "Deep moisturizing" }, { name: "Iron Oxides", origin: "Germany", function: "Natural tint pigments" }],
          sizeOptions: ["4g", "5g"], bottleOptions: ["Lip Roll Bottle", "Doe Foot Applicator Bottle"], capOptions: ["Twist Cap", "Screw Lid"],
          moq: "2000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "lip-gloss", name: "Lip Gloss", slug: "lip-gloss",
          heroImage: "/assets/images/LIP-GLOSS.webp", galleryImages: ["/assets/images/LIP-GLOSS.webp"],
          tags: ["Glossy", "Plumping"],
          shortDescription: "Lip gloss berkilau dengan efek plumping.",
          story: `Lip gloss adalah produk yang memberikan kesan bibir penuh, sehat, dan bercahaya.

Lip Gloss Dreamlab diformulasikan dengan non-sticky formula yang memberikan kilau maksimal tanpa rasa lengket yang mengganggu. Ditambah Hyaluronic Acid Spheres untuk efek plumping sementara yang membuat bibir terlihat lebih penuh. Tersedia dalam format bening, warna sheer, hingga glitter.`,
          seoParagraph: "Maklon Lip Gloss — jasa maklon lip gloss non-sticky dengan efek plumping dan kilau maksimal. ✓ BPOM & Halal ✓ MOQ 2000 pcs.",
          benefits: ["Non-Sticky Formula", "Maximum Shine", "Hyaluronic Acid Plumping", "Clear, Sheer, Glitter Options", "Youthful, Full-looking Lips", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Hydrogenated Polyisobutene", origin: "Germany", function: "Non-sticky shine" }, { name: "Hyaluronic Acid Spheres", origin: "Korea", function: "Plumping effect" }, { name: "Vitamin E", origin: "Switzerland", function: "Lip nourishment" }],
          sizeOptions: ["5ml", "8ml", "10ml"], bottleOptions: ["Lip Roll Bottle", "Doe Foot Applicator Bottle"], capOptions: ["Wand Cap", "Doe-foot Cap"],
          moq: "2000 pcs", productionTime: "2 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "lip-scrub", name: "Lip Scrub", slug: "lip-scrub",
          heroImage: "/assets/images/LIP-MATTE.webp", galleryImages: ["/assets/images/LIP-MATTE.webp"],
          tags: ["Exfoliating", "Smooth"],
          shortDescription: "Lip scrub untuk mengangkat kulit mati bibir.",
          story: `Lip scrub adalah langkah persiapan yang sering dilupakan namun krusial untuk hasil lipstik yang sempurna.

Lip Scrub Dreamlab menggunakan gula halus sebagai eksfoliator alami yang lembut mengangkat sel kulit mati dan kulit kering di bibir. Diperkaya dengan minyak kelapa dan Vitamin E yang melembapkan saat proses eksfoliasi. Hasil: bibir yang halus, lembut, dan siap menerima warna lipstik dengan sempurna.`,
          seoParagraph: "Maklon Lip Scrub — jasa maklon lip scrub eksfoliator lembut untuk bibir halus dan smooth. ✓ BPOM & Halal ✓ MOQ 2000 pcs.",
          benefits: ["Fine Sugar Exfoliation", "Coconut Oil Moisturizing", "Removes Dead Skin", "Preps for Lipstick", "Smooth, Soft Lips", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Fine Sugar", origin: "Local", function: "Gentle physical exfoliant" }, { name: "Coconut Oil", origin: "Local", function: "Moisturizing during scrub" }, { name: "Vitamin E", origin: "Switzerland", function: "Lip nourishment" }],
          sizeOptions: ["10g", "15g"], bottleOptions: ["Pot", "Custom Exclusive Packaging"], capOptions: ["Screw Lid", "Flip Cap"],
          moq: "2000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "lip-matte", name: "Lip Matte", slug: "lip-matte",
          heroImage: "/assets/images/LIP-MATTE.webp", galleryImages: ["/assets/images/LIP-MATTE.webp"],
          tags: ["Trending", "Long Lasting"],
          shortDescription: "Lip matte tahan lama dengan hasil akhir matte sempurna.",
          story: `Lip matte adalah pernyataan diri: berani, percaya diri, dan tegas.

Lip Matte Dreamlab diformulasikan dengan pigmentasi tinggi yang memberikan warna intens dalam satu kali oles. Formula transfer-proof yang tahan 6-8 jam tanpa perlu touch-up, namun tetap nyaman di bibir tanpa rasa kering atau pecah-pecah. Range warna luas dari nude hingga bold red dan tren mauve.`,
          seoParagraph: "Maklon Lip Matte — jasa maklon lipstik matte tahan lama 6-8 jam tidak transfer, 50+ warna. ✓ BPOM & Halal ✓ MOQ 2000 pcs.",
          benefits: ["High Pigment, One-Swipe Coverage", "6-8 Hour Transfer-Proof", "Non-Drying Formula", "Wide Color Range", "Bold, Confident Finish", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "High-Hue Pigments", origin: "Germany", function: "Intense color saturation" }, { name: "Silicone Wax", origin: "Germany", function: "Long-wear, smooth application" }, { name: "Vitamin E", origin: "Switzerland", function: "Prevents drying, nourishment" }],
          sizeOptions: ["3ml", "4ml", "5ml"], bottleOptions: ["Lip Roll Bottle", "Doe Foot Applicator Bottle"], capOptions: ["Snap Cap", "Magnetic Cap"],
          moq: "2000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
        {
          id: "lip-blush", name: "Lip Blush", slug: "lip-blush",
          heroImage: "/assets/images/LIP-MATTE.webp", galleryImages: ["/assets/images/LIP-MATTE.webp"],
          tags: ["Tint", "Natural"],
          shortDescription: "Lip tint dengan hasil natural seperti bibir sehat.",
          story: `Lip blush memberikan warna natural yang terlihat seperti bibir sehat alami.

Lip Blush Dreamlab diformulasikan dengan water-based tint yang memberikan warna stain natural yang menyatu dengan bibir. Tekstur ringan yang tidak terasa seperti memakai makeup, memberikan efek 'my lips but better'. Tahan seharian dan memudar secara merata tanpa patchy.`,
          seoParagraph: "Maklon Lip Blush — jasa maklon lip tint dengan hasil natural seperti bibir sehat. ✓ BPOM & Halal ✓ MOQ 2000 pcs.",
          benefits: ["Water-based Tint", "Natural 'My Lips But Better'", "Lightweight, No Makeup Feel", "Fades Evenly", "All-day Wear", "Sertifikasi BPOM & Halal"],
          ingredients: [{ name: "Water-based Gel", origin: "Laboratory", function: "Lightweight tint base" }, { name: "Natural Red Pigments", origin: "Germany", function: "Natural lip color" }, { name: "Aloe Vera", origin: "Local", function: "Soothing, moisturizing" }],
          sizeOptions: ["3ml", "5ml"], bottleOptions: ["Lip Roll Bottle", "Doe Foot Applicator Bottle"], capOptions: ["Snap Cap", "Magnetic Cap"],
          moq: "2000 pcs", productionTime: "2-3 bulan", certifications: ["BPOM", "Halal MUI", "CPKB Grade A"],
        },
      ],
    },
  ],
  trustStats: [
    { icon: "palette", value: "1000+", label: "Custom Shades", description: "Kemampuan menciptakan shade warna tak terbatas untuk setiap jenis kulit" },
    { icon: "shield-check", value: "CPKB Grade A", label: "Certified Factory", description: "Fasilitas produksi dengan standar kebersihan kosmetik internasional" },
    { icon: "zap", value: "High", label: "Pigmentation", description: "Pigmentasi intens yang kompetitif dengan brand global ternama" },
    { icon: "star", value: "94%", label: "Client Satisfaction", description: "Tingkat kepuasan mitra brand dalam kategori kosmetik dekoratif" },
  ],
  trustCategorySpecific: [
    { icon: "droplet", label: "Waterproof Tech", description: "Teknologi ketahanan air dan keringat untuk performa jangka panjang" },
    { icon: "eye", label: "Ophthalmology Tested", description: "Opsi uji keamanan khusus untuk produk riasan area mata" },
    { icon: "shield", label: "Skin-Friendly Makeup", description: "Kosmetik yang diformulasi dengan tambahan nutrisi perawatan kulit" },
    { icon: "zap", label: "Instant Payoff", description: "Warna intens yang keluar dalam satu kali aplikasi tanpa usaha berlebih" },
  ],
  edukasi: [
    {
      title: "Lip Matte vs Lip Gloss: Kapan Memilih yang Tepat?",
      content: `<p><strong>Lip Matte</strong> adalah pilihan utama saat:</p>
      <ul>
        <li>Anda menginginkan warna yang berani (bold) dan tegas.</li>
        <li>Membutuhkan ketahanan warna yang lama tanpa perlu sering touch-up.</li>
        <li>Menghadiri acara formal atau kegiatan harian yang padat.</li>
        <li>Lebih menyukai gaya yang canggih dan tidak terlalu berkilau.</li>
      </ul>
      <p><strong>Lip Gloss</strong> lebih tepat digunakan ketika:</p>
      <ul>
        <li>Menginginkan tampilan yang lebih muda, segar, dan bercahaya.</li>
        <li>Makeup mata sudah cukup berat dan butuh penyeimbang yang lembut.</li>
        <li>Mengikuti tren kecantikan Korea yang mengutamakan hidrasi.</li>
        <li>Menginginkan efek bibir yang tampak lebih penuh (plumping).</li>
      </ul>`,
    },
    {
      title: "Mengapa Cushion Menjadi Produk 'Wajib' bagi Brand Modern?",
      content: `<p>Beberapa alasan mengapa cushion sangat populer di pasar Indonesia:</p>
      <ul>
        <li><strong>Kemudahan:</strong> Tanpa kuas atau spons terpisah, cukup tap dan ratakan.</li>
        <li><strong>Portabilitas:</strong> Kemasan compact yang mudah dibawa di dalam tas kecil.</li>
        <li><strong>Finish Alami:</strong> Memberikan 'healthy glow' yang tampak seperti kulit asli.</li>
        <li><strong>Multifungsi:</strong> Sering kali sudah mengandung pelembap, pencerah, dan perlindungan UV.</li>
      </ul>`,
    },
    {
      title: "Tips Mencocokkan Shade Foundation untuk Kulit Indonesia",
      content: `<p>Mempertimbangkan karakteristik kulit tropis sangat penting:</p>
      <ul>
        <li><strong>Undertone:</strong> Mayoritas kulit Indonesia memiliki warm atau neutral undertone. Hindari shade dengan pink undertone yang terlalu kuat.</li>
        <li><strong>Oksidasi:</strong> Selalu tes shade di area rahang dan tunggu 1-2 jam untuk melihat perubahan warna produk setelah bereaksi dengan udara.</li>
        <li><strong>Kesesuaian Leher:</strong> Pilih shade yang paling mendekati warna leher agar riasan tidak tampak seperti topeng.</li>
      </ul>`,
    },
  ],
  testimonials: [
    {
      quote: "Lip matte saya dari Dreamlab menjadi best seller di toko online kami. Warnanya vibrant dan sama sekali tidak membuat bibir kering. Pelanggan kami sangat puas.",
      name: "Putri",
      brand: "Brand Luxe Lips Indonesia",
      avatarImage: "",
      productImage: "/assets/images/client-deco-1.webp",
    },
    {
      quote: "Cushion mereka sangat sesuai dengan kebutuhan pasar saya. Pilihan shade untuk kulit sawo matang tersedia lengkap, dan hasilnya dewy alami tanpa kesan berminyak.",
      name: "Amel",
      brand: "Brand Glow Beauty",
      avatarImage: "",
      productImage: "/assets/images/client-deco-2.webp",
    },
  ],
  faqs: [
    {
      question: "Berapa MOQ untuk maklon kosmetik dekoratif di Dreamlab?",
      answer: "MOQ standar kami mulai dari 2000 pcs per shade. Untuk koleksi dengan banyak varian warna, tim kami dapat memberikan opsi konsultasi volume produksi yang fleksibel sesuai kebutuhan brand Anda.",
    },
    {
      question: "Apakah Dreamlab bisa melakukan 'Color Matching' sesuai sampel?",
      answer: "Tentu. Tim R&D kami memiliki kemampuan color matching tingkat lanjut berdasarkan sampel fisik, nomor Pantone, atau referensi visual untuk memastikan warna produk sesuai dengan visi Anda.",
    },
    {
      question: "Bagaimana stabilitas warna pada produk kosmetik dekoratif?",
      answer: "Kami melakukan uji stabilitas intensif untuk memastikan pigmen tidak berubah warna, tekstur tidak memisah, dan produk tetap aman digunakan selama masa simpannya (2-3 tahun).",
    },
    {
      question: "Apakah Dreamlab menyediakan formulasi 'Clean Beauty'?",
      answer: "Ya, kami dapat merancang formula yang bebas dari bahan-bahan kontroversial, menggunakan alternatif alami (seperti corn starch sebagai pengganti talc), dan tetap memberikan performa warna yang tinggi.",
    },
    {
      question: "Berapa lama proses pengembangan shade baru?",
      answer: "Proses pencocokan warna dan pengembangan sampel awal biasanya memakan waktu 2-4 minggu hingga mencapai shade yang sempurna sesuai persetujuan Anda.",
    },
  ],
  relatedProducts: [
    { name: "Liquid Highlighter", slug: "liquid-highlighter", image: "/new asset/make up/liquid-highlighter1.webp", category: "Decorative", categorySlug: "decorative" },
    { name: "Foundation", slug: "foundation", image: "/new asset/make up/foundation.webp", category: "Decorative", categorySlug: "decorative" },
    { name: "BB Cream", slug: "bb-cream", image: "/new asset/make up/bb-cream.webp", category: "Decorative", categorySlug: "decorative" },
    { name: "Face Primer", slug: "face-primer", image: "/new asset/make up/face-primer.webp", category: "Decorative", categorySlug: "decorative" },
    { name: "Mascara", slug: "mascara", image: "/new asset/make up/mascara.webp", category: "Decorative", categorySlug: "decorative" },
    { name: "Cream Blush", slug: "cream-blush", image: "/new asset/make up/cream-blush.webp", category: "Decorative", categorySlug: "decorative" },
  ],
};