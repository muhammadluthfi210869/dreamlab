const globalKeywords = [
  "maklon kosmetik",
  "jasa maklon kosmetik",
  "pabrik maklon kosmetik",
  "perusahaan maklon kosmetik",
  "maklon kosmetik bpom",
  "maklon kosmetik halal",
  "maklon kosmetik terbaik",
  "dreamlab maklon",
  "dreamlab kosmetik",
  "maklon kosmetik terpercaya",
  "maklon kosmetik berpengalaman",
  "rekomendasi pabrik maklon kosmetik",
  "review maklon kosmetik",
  "maklon kosmetik murah",
  "maklon kosmetik moq rendah",
  "maklon kosmetik moq 100",
  "harga maklon kosmetik",
  "biaya maklon skincare",
  "modal maklon kosmetik",
  "syarat maklon kosmetik",
  "lama proses maklon kosmetik",
  "cpkb grade a",
  "bisnis skincare modal kecil",
  "skincare halal",
  "cara daftar bpom kosmetik",
  "cara mendapatkan sertifikat halal",
  "perbedaan maklon dan oem",
  "apa itu maklon kosmetik",
  "tips memilih pabrik maklon kosmetik",
];

const locationKeywordsMap: Record<string, string[]> = {
  surabaya: [
    "maklon kosmetik surabaya",
    "pabrik maklon kosmetik surabaya",
    "maklon skincare surabaya",
    "maklon kosmetik jawa timur",
  ],
  jakarta: [
    "maklon kosmetik jakarta",
    "pabrik maklon kosmetik jakarta",
  ],
  bandung: [
    "maklon kosmetik bandung",
    "pabrik maklon kosmetik bandung",
  ],
};

const blogKeywords = [
  "cara memulai bisnis skincare",
  "cara membuat brand skincare sendiri",
  "cara bikin brand kosmetik",
  "bisnis skincare untuk pemula",
  "modal bisnis skincare",
  "maklon serum vitamin c",
  "maklon toner brightening",
  "maklon acne treatment",
  "maklon facial wash",
  "maklon kosmetik korea style",
  "maklon skincare natural",
  "maklon kosmetik organik",
  "maklon parfum private label",
  "tren skincare 2026",
  "produk kosmetik viral 2026",
  "skincare laki laki",
  "skincare lokal indonesia",
];

const pageSpecificKeywords: Record<string, string[]> = {
  "tentang-kami": [
    "pabrik maklon kosmetik",
    "perusahaan maklon kosmetik",
    "maklon kosmetik terpercaya",
    "maklon kosmetik berpengalaman",
  ],
  "maklon-kosmetik-surabaya": locationKeywordsMap.surabaya,
  "maklon-kosmetik-jakarta": locationKeywordsMap.jakarta,
  "maklon-kosmetik-bandung": locationKeywordsMap.bandung,
};

const productKeywordsMap: Record<string, string[]> = {
  "skincare-facial-serum": ["maklon serum wajah", "jasa maklon serum", "maklon serum brightening", "maklon serum anti aging", "maklon serum BPOM", "pabrik maklon serum"],
  "skincare-facial-toner": ["maklon toner wajah", "jasa maklon toner", "maklon hydrating toner", "maklon toner BPOM", "maklon skincare toner"],
  "skincare-facial-wash": ["maklon facial wash", "jasa maklon facial wash", "maklon sabun cuci muka", "maklon pembersih wajah", "maklon face wash BPOM"],
  "skincare-micellar-cleansing-gel": ["maklon micellar", "jasa maklon micellar", "maklon cleansing gel", "maklon pembersih makeup", "maklon micellar water BPOM"],
  "skincare-facial-sunscreen": ["maklon sunscreen", "jasa maklon sunscreen", "maklon SPF", "maklon tabir surya", "maklon sun protection BPOM"],
  "skincare-facial-moisturizer": ["maklon moisturizer", "jasa maklon moisturizer", "maklon pelembab wajah", "maklon day cream", "maklon night cream BPOM"],

  "parfum-eau-de-parfum": ["maklon parfum EDP", "jasa maklon parfum", "maklon wewangian premium", "maklon parfum tahan lama", "maklon parfum BPOM"],
  "parfum-eau-de-toilette": ["maklon parfum EDT", "jasa maklon EDT", "maklon wewangian daily", "maklon parfum segar"],
  "parfum-eau-de-cologne": ["maklon parfum EDC", "jasa maklon cologne", "maklon wewangian sport", "maklon cologne"],
  "parfum-extrait-de-parfum": ["maklon extrait", "maklon parfum konsentrasi tinggi", "maklon parfum luxury", "maklon parfum 24 jam"],
  "parfum-body-mist": ["maklon body mist", "jasa maklon body mist", "maklon wewangian ringan", "maklon body spray"],
  "parfum-minyak-atsiri": ["maklon minyak atsiri", "jasa maklon essential oil", "maklon aroma terapi", "maklon essential oil"],

  "bodycare-body-lotion": ["maklon body lotion", "jasa maklon body lotion", "maklon pelembab tubuh", "maklon body care", "maklon lotion BPOM"],
  "bodycare-body-wash": ["maklon body wash", "jasa maklon body wash", "maklon sabun mandi", "maklon shower gel", "maklon body wash BPOM"],
  "bodycare-body-butter": ["maklon body butter", "jasa maklon body butter", "maklon pelembab intensif", "maklon shea butter"],
  "bodycare-body-scrub": ["maklon body scrub", "jasa maklon body scrub", "maklon lulur", "maklon exfoliating body"],
  "bodycare-massage-oil": ["maklon massage oil", "jasa maklon minyak pijat", "maklon aromatherapy oil", "maklon minyak pijat spa"],
  "bodycare-body-oil": ["maklon body oil", "jasa maklon body oil", "maklon minyak tubuh", "maklon body oil glow"],
  "bodycare-deodorant": ["maklon deodorant", "jasa maklon deodorant", "maklon deodorant spray", "maklon deodorant roll on", "maklon deodorant dry serum", "maklon anti bau ketiak"],

  "haircare-shampoo": ["maklon shampoo", "jasa maklon shampoo", "maklon sampo", "maklon shampo", "pabrik maklon shampoo", "maklon shampoo BPOM"],
  "haircare-hair-mask": ["maklon hair mask", "jasa maklon hair mask", "maklon masker rambut", "maklon hair treatment"],
  "haircare-hair-serum": ["maklon hair serum", "jasa maklon hair serum", "maklon serum rambut", "maklon serum rambut keratin"],
  "haircare-hair-tonic": ["maklon hair tonic", "jasa maklon hair tonic", "maklon tonik rambut", "maklon hair growth"],


  "babycare-baby-lotion": ["maklon baby lotion", "jasa maklon baby lotion", "maklon lotion bayi", "maklon baby lotion hypoallergenic"],
  "babycare-baby-shampoo": ["maklon baby shampoo", "jasa maklon baby shampoo", "maklon sampo bayi", "maklon baby shampoo tear free"],
  "babycare-baby-wash": ["maklon baby wash", "jasa maklon baby wash", "maklon sabun bayi", "maklon baby wash tear free"],
  "babycare-baby-powder": ["maklon baby powder", "jasa maklon baby powder", "maklon bedak bayi", "maklon bedak bayi talc free"],
  "babycare-baby-cologne": ["maklon baby cologne", "jasa maklon baby cologne", "maklon parfum bayi", "maklon cologne bayi"],

  "decorative-lip-matte": ["maklon lip cream", "jasa maklon lip cream", "maklon lipstik", "maklon lipstick matte", "maklon lip cream BPOM"],
  "decorative-lip-gloss": ["maklon lip gloss", "jasa maklon lip gloss", "maklon lip tint", "maklon lip gloss non sticky"],
  "decorative-liquid-foundation": ["maklon foundation", "jasa maklon foundation", "maklon liquid foundation", "maklon foundation BPOM"],
  "decorative-cushion-foundation": ["maklon cushion", "jasa maklon cushion", "maklon cushion compact", "maklon cushion dewy"],
  "decorative-loose-powder": ["maklon loose powder", "jasa maklon loose powder", "maklon bedak tabur", "maklon setting powder"],

  "footcare-foot-cream": ["maklon foot cream", "jasa maklon foot cream", "maklon krim kaki", "maklon cream anti pecah kaki"],
  "footcare-foot-scrub": ["maklon foot scrub", "jasa maklon foot scrub", "maklon scrub kaki", "maklon foot scrub callus"],
  "footcare-foot-mask": ["maklon foot mask", "jasa maklon foot mask", "maklon masker kaki", "maklon foot mask serum"],
  "footcare-foot-soak": ["maklon foot soak", "jasa maklon foot soak", "maklon rendam kaki", "maklon spa kaki"],

  "pkrt-hand-sanitizer": ["maklon hand sanitizer", "jasa maklon hand sanitizer", "pabrik hand sanitizer", "maklon hand sanitizer gel"],
  "pkrt-hand-wash": ["maklon hand wash", "jasa maklon hand wash", "maklon sabun cuci tangan", "maklon hand wash foam"],
  "pkrt-disinfectant-spray": ["maklon disinfectant", "jasa maklon disinfectant", "maklon pembersih", "maklon disinfectant spray"],
  "pkrt-floor-cleaner": ["maklon floor cleaner", "jasa maklon floor cleaner", "maklon pembersih lantai", "maklon pembersih lantai wangi"],
  "pkrt-room-spray": ["maklon room spray", "jasa maklon room spray", "maklon pewangi ruangan", "maklon pewangi ruangan premium"],
  "pkrt-bar-soap-pkrt": ["maklon sabun batang", "jasa maklon sabun batang", "pabrik sabun batang", "maklon sabun batang herbal"],
};

const categoryKeywordsMap: Record<string, string[]> = {
  skincare: [
    "maklon skincare",
    "jasa maklon skincare",
    "pabrik maklon skincare",
    "maklon skincare BPOM",
    "maklon skincare halal",
    "jasa maklon kosmetik skincare",
    "contract manufacturing skincare Indonesia",
    "maklon skincare Indonesia",
    "maklon skincare terpercaya",
    "maklon skincare Surabaya",
    "maklon skincare Jakarta",
    "maklon skincare terbaik",
    "jasa maklon kosmetik",
    ...(locationKeywordsMap.surabaya || []),
    ...(locationKeywordsMap.jakarta || []),
    ...(locationKeywordsMap.bandung || []),
  ],
  parfum: [
    "maklon parfum",
    "jasa maklon parfum",
    "pabrik maklon parfum",
    "maklon parfum BPOM",
    "maklon wewangian",
    "jasa maklon parfum premium",
    "contract manufacturing parfum Indonesia",
    "maklon parfum Indonesia",
    "maklon parfum terpercaya",
    "maklon parfum Jakarta",
  ],
  bodycare: [
    "maklon body care",
    "jasa maklon body care",
    "pabrik maklon body care",
    "maklon body care BPOM",
    "maklon perawatan tubuh",
    "jasa maklon kosmetik body care",
    "maklon body care Indonesia",
    "maklon body care terpercaya",
  ],
  haircare: [
    "maklon hair care",
    "jasa maklon hair care",
    "pabrik maklon hair care",
    "maklon hair care BPOM",
    "maklon perawatan rambut",
    "jasa maklon kosmetik hair care",
    "maklon hair care Indonesia",
    "maklon hair care terpercaya",
  ],
  babycare: [
    "maklon baby care",
    "jasa maklon baby care",
    "pabrik maklon baby care",
    "maklon baby care BPOM",
    "maklon perawatan bayi",
    "jasa maklon kosmetik baby care",
    "maklon baby care Indonesia",
    "maklon baby care terpercaya",
  ],
  decorative: [
    "maklon makeup",
    "jasa maklon makeup",
    "pabrik maklon makeup",
    "maklon kosmetik dekoratif",
    "maklon decorative makeup",
    "maklon makeup BPOM",
    "jasa maklon kosmetik dekoratif",
    "maklon makeup Indonesia",
    "maklon makeup terpercaya",
  ],
  footcare: [
    "maklon foot care",
    "jasa maklon foot care",
    "pabrik maklon foot care",
    "maklon perawatan kaki",
    "maklon foot care BPOM",
    "maklon foot care Indonesia",
    "maklon foot care terpercaya",
  ],
  pkrt: [
    "maklon PKRT",
    "jasa maklon PKRT",
    "pabrik maklon PKRT",
    "maklon household",
    "maklon pembersih",
    "maklon produk kimia rumah tangga",
    "maklon PKRT Indonesia",
    "maklon PKRT terpercaya",
  ],
};

const categoryTitleMap: Record<string, string> = {
  skincare: "DREAMLAB | Jasa maklon Skincare Free Custom Formula",
  parfum: "Maklon Parfum Custom & Private Label",
  bodycare: "Jasa Maklon Body Care BPOM & Halal Terlengkap | Dreamlab",
  haircare: "Jasa Maklon Haircare BPOM & Halal Terdekat | Dreamlab",
  babycare: "Jasa Maklon Skincare Bayi BPOM & Halal Terlengkap | Dreamlab",
  decorative: "Jasa Maklon Decorative Makeup Terbaik BPOM & Halal | Dreamlab",
  footcare: "Jasa Maklon Perawatan Kaki Terbaik BPOM | Dreamlab",
  pkrt: "Jasa Maklon PKRT BPOM & Halal Terlengkap | Dreamlab",
};

const categoryMetaDescriptionMap: Record<string, string> = {
  skincare: "Jasa maklon skincare BPOM & Halal: facial wash, toner, serum, moisturizer, sunscreen. Formula custom, MOQ fleksibel Konsultasi gratis",
  bodycare: "Jasa maklon body care BPOM, CPKB & Halal: body butter, scrub, shower gel, massage oil & lainnya. Formula custom, MOQ fleksibel. Konsultasi gratis Dreamlab",
  babycare: "Jasa maklon Skincare Bayi BPOM, CPKB & Halal: baby lotion, baby oil, baby wash, baby cologne & lainnya. Formula hypoallergenic, MOQ fleksibel. Konsultasi gratis",
  haircare: "Jasa maklon haircare BPOM, CPKB & Halal: shampoo, conditioner, hair tonic, hair mask & pomade. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab",
  footcare: "Jasa maklon foot care BPOM, CPKB & Halal: foot cream, scrub, spray, soak & serum. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab",
  parfum: "Dreamlab Adalah pabrik parfum extrait de parfum, body mist, cologne, hingga parfum refill. Produksi di pabrik Halal, CPKB, BPOM.",
  decorative: "Jasa maklon decorative makeup BPOM & Halal dengan formula custom dan MOQ fleksibel. Konsultasi gratis bersama Dreamlab.",
};

const subCategoryMetaDescriptionMap: Record<string, string> = {
  "skincare-face-cream": "Jasa maklon face cream BPOM, CPKB & Halal: day cream, night cream, moisturizing, brightening & eye cream. Formula custom, MOQ fleksibel. Wujudkan brand cream wajah Anda. Konsultasi gratis!",
  "skincare-face-mask": "Jasa maklon masker wajah / face mask BPOM, CPKB & Halal: sheet mask, clay mask, peel-off & lainnya. Formula custom, MOQ fleksibel. Konsultasi gratis di Dreamlab!",
  "skincare-sunscreen": "Jasa maklon sunscreen BPOM, CPKB & Halal: physical, chemical & hybrid, SPF 30-50+. Formula custom, uji SPF, MOQ fleksibel. Konsultasi gratis di Dreamlab!",
  "skincare-cleansing": "Jasa maklon cleansing series BPOM, CPKB & Halal: cleansing oil, balm, micellar water & lainnya. Formula custom, MOQ fleksibel. Konsultasi gratis Dreamlab!",
  "skincare-facial-wash": "Jasa maklon Sabun wajah BPOM, CPKB & Halal: gentle wash, low-pH, brightening & acne wash. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab!",
  "skincare-facial-toner": "Jasa maklon facial toner BPOM, CPKB & Halal: hydrating, exfoliating & brightening toner. Formula custom, MOQ fleksibel. Konsultasi gratis di Dreamlab!",
  "skincare-facial-serum": "Jasa maklon serum wajah BPOM, CPKB & Halal: serum vitamin C, niacinamide, retinol & lainnya. Formula custom, MOQ fleksibel. Konsultasi gratis Dreamlab!",
  "decorative-lipcare": "Jasa maklon lip care BPOM & Halal untuk lip balm, lip serum, lip gloss, dan tinted lip balm. MOQ fleksibel dan konsultasi gratis.",
  "decorative-make-up": "Jasa maklon makeup BPOM & Halal dengan formula custom, warna trendi, dan MOQ fleksibel bersama Dreamlab.",
};

const productTitleMap: Record<string, string> = {
  "skincare-facial-serum": "Jasa Maklon Serum Wajah & Facial Serum | Dreamlab",
  "skincare-facial-toner": "Jasa Maklon Facial Toner BPOM & Halal | Dreamlab",
  "skincare-facial-wash": "Jasa Maklon Sabun Wajah BPOM dan Halal",
  "skincare-micellar-cleansing-gel": "Jasa Maklon Micellar Cleansing BPOM & Halal | Dreamlab",
  "skincare-facial-sunscreen": "Jasa Maklon Sunscreen BPOM & Halal Terlengkap | Dreamlab",
  "skincare-facial-moisturizer": "Jasa Maklon Moisturizer BPOM & Halal | Dreamlab",
  "skincare-day-night-cream": "Jasa Maklon Day Cream & Night Cream BPOM & Halal | Dreamlab",
  "skincare-face-mask": "Jasa Maklon Masker Wajah & Face Mask BPOM Halal | Dreamlab",
  "skincare-cleansing": "Jasa Maklon Cleansing Series BPOM & Halal Terlengkap",
  "parfum-eau-de-parfum": "Jasa Maklon Eau de Parfum (EDP) BPOM Free Custom Aroma | Dreamlab",
  "parfum-eau-de-toilette": "Jasa Maklon Eau de Toilette (EDT) BPOM Free Custom Aroma | Dreamlab",
  "parfum-eau-de-cologne": "Jasa Maklon Eau de Cologne Free Custom Aroma BPOM | Dreamlab",
  "parfum-extrait-de-parfum": "Jasa Maklon Extrait de Parfum Free Custom MOQ fleksibel | Dreamlab",
  "parfum-body-mist": "Jasa Maklon Body Mist Custom Aroma BPOM dan Halal | Dreamlab",
  "parfum-minyak-atsiri": "Jasa Maklon Minyak Atsiri (Essential Oil) MOQ fleksibel | Dreamlab",
  "bodycare-body-lotion": "Jasa Maklon Body Lotion BPOM & Halal | Dreamlab",
  "bodycare-body-wash": "Jasa Maklon Body Wash BPOM & Halal | Dreamlab",
  "bodycare-body-butter": "Jasa Maklon Body Butter BPOM & Halal | Dreamlab",
  "bodycare-body-scrub": "Jasa Maklon Body Scrub BPOM & Halal | Dreamlab",
  "bodycare-massage-oil": "Jasa Maklon Massage Oil BPOM & Halal | Dreamlab",
  "bodycare-body-oil": "Jasa Maklon Body Oil BPOM & Halal | Dreamlab",
  "bodycare-sabun-antibakteri": "Jasa Maklon Sabun Antibakteri (Anti-Bacterial) | Dreamlab",
  "bodycare-shower-gel": "Jasa Maklon Shower Gel & Body Wash BPOM | Dreamlab",
  "bodycare-bath-salt": "Jasa Maklon Bath Salt BPOM & Halal | Dreamlab",
  "bodycare-sabun-organik": "Jasa Maklon Sabun Organik (Organic Soap) | Dreamlab",
  "bodycare-sabun-transparan": "Jasa Maklon Sabun Transparan (Transparent Soap) | Dreamlab",
  "bodycare-sabun-whitening": "Jasa Maklon Sabun Whitening & Pemutih | Dreamlab",
  "bodycare-sabun-batang": "Jasa Maklon Sabun Batang (Bar Soap) | Dreamlab",
  "bodycare-massage-cream": "Jasa Maklon Massage Cream BPOM & Halal | Dreamlab",
  "bodycare-soothing-gel": "Jasa Maklon Soothing Gel & Aloe Vera Gel | Dreamlab",
  "bodycare-neck-cream": "Jasa Maklon Neck Cream (Krim Leher) | Dreamlab",
  "bodycare-deodorant": "Maklon Deodorant BPOM & Halal | Dreamlab",
  "haircare-shampoo": "Jasa Maklon Shampoo BPOM & Halal | Dreamlab",
  "haircare-hair-mask": "Jasa Maklon Hair Mask BPOM & Halal | Dreamlab",
  "haircare-hair-serum": "Jasa Maklon Hair Serum BPOM & Halal | Dreamlab",
  "haircare-hair-tonic": "Jasa Maklon Hair Tonic BPOM & Halal | Dreamlab",
  "haircare-hair-gel": "Jasa Maklon Hair Gel BPOM & Halal | Dreamlab",
  "haircare-pomade": "Jasa Maklon Pomade BPOM & Halal | Dreamlab",
  "haircare-scalp-care": "Jasa Maklon Scalp Care BPOM & Halal | Dreamlab",
  "haircare-beard-serum": "Jasa Maklon Beard Serum BPOM & Halal | Dreamlab",
  "haircare-hair-conditioner": "Jasa Maklon Hair Conditioner BPOM & Halal | Dreamlab",
  "haircare-hair-mist": "Maklon Hair Mist BPOM Terbaik | Dreamlab",
  "babycare-baby-lotion": "Jasa Maklon Baby Lotion BPOM & Halal | Dreamlab",
  "babycare-baby-shampoo": "Jasa Maklon shampoo Bayi BPOM & Halal | Dreamlab",
  "babycare-baby-wash": "Jasa Maklon Baby Wash BPOM & Halal | Dreamlab",
  "babycare-baby-powder": "Jasa Maklon Baby Powder BPOM & Halal | Dreamlab",
  "babycare-baby-cologne": "Jasa Maklon parfum cologne bayi Free Custom Aroma",
  "babycare-baby-oil": "Jasa Maklon Baby Oil BPOM & Halal | Dreamlab",
  "decorative-lip-matte": "Jasa Maklon Lip Matte BPOM & Halal | Dreamlab",
  "decorative-lip-gloss": "Jasa Maklon Lip Gloss BPOM & Halal | Dreamlab",
  "decorative-lip-cream": "Jasa Maklon Lip Cream BPOM & Halal | Dreamlab",
  "decorative-lip-serum": "Jasa Maklon Lip Serum BPOM & Halal | Dreamlab",
  "decorative-lip-balm": "Jasa Maklon Lip Balm BPOM & Halal | Dreamlab",
  "decorative-tinted-lip-balm": "Jasa Maklon Tinted Lip Balm BPOM & Halal | Dreamlab",
  "decorative-lip-scrub": "Jasa Maklon Lip Scrub BPOM & Halal | Dreamlab",
  "decorative-lip-blush": "Jasa Maklon Lip Blush BPOM & Halal | Dreamlab",
  "decorative-liquid-highlighter": "Jasa Maklon Highlighter BPOM & Halal | Dreamlab",
  "decorative-mascara": "Jasa Maklon Mascara BPOM & Halal | Dreamlab",
  "decorative-cream-blush": "Jasa Maklon Cream Blush BPOM & Halal | Dreamlab",
  "decorative-foundation-serum": "Jasa Maklon Foundation Serum BPOM & Halal | Dreamlab",
  "decorative-liquid-blush": "Jasa Maklon Liquid Blush BPOM & Halal | Dreamlab",
  "decorative-eyebrow-gel": "Jasa Maklon Eyebrow Gel BPOM & Halal | Dreamlab",
  "decorative-foundation": "Jasa Maklon Foundation BPOM & Halal | Dreamlab",
  "decorative-bb-cream": "Jasa Maklon BB Cream BPOM & Halal | Dreamlab",
  "decorative-face-primer": "Jasa Maklon Face Primer BPOM & Halal | Dreamlab",
  "footcare-foot-cream": "Jasa Maklon Foot Cream BPOM & Halal | Dreamlab",
  "footcare-foot-scrub": "Jasa Maklon Foot Scrub BPOM & Halal | Dreamlab",
  "footcare-foot-mask": "Jasa Maklon Foot Mask BPOM & Halal | Dreamlab",
  "footcare-foot-soak": "Jasa Maklon Foot Soak BPOM & Halal | Dreamlab",
  "footcare-foot-spray": "Jasa Maklon Foot Spray BPOM & Halal | Dreamlab",
  "footcare-foot-serum": "Jasa Maklon Foot Serum BPOM & Halal | Dreamlab",
  "pkrt-hand-sanitizer": "Jasa Maklon Hand Sanitizer BPOM & Halal | Dreamlab",
  "pkrt-hand-wash": "Jasa Maklon Hand Wash BPOM & Halal | Dreamlab",
  "pkrt-disinfectant-spray": "Jasa Maklon Disinfectant Spray BPOM & Halal | Dreamlab",
  "pkrt-floor-cleaner": "Jasa Maklon Floor Cleaner BPOM & Halal | Dreamlab",
  "pkrt-room-spray": "Jasa Maklon Room Spray BPOM & Halal | Dreamlab",
  "pkrt-bar-soap-pkrt": "Jasa Maklon Sabun Batang (Bar Soap) BPOM | Dreamlab",
  "pkrt-herbal-soap": "Jasa Maklon Sabun Herbal BPOM & Halal | Dreamlab",
};

const productMetaDescriptionMap: Record<string, string> = {
  "skincare-facial-serum": "Jasa maklon serum wajah BPOM, CPKB & Halal: serum vitamin C, niacinamide, retinol & lainnya. Formula custom, MOQ fleksibel. Konsultasi gratis Dreamlab!",
  "skincare-facial-toner": "Jasa maklon facial toner BPOM, CPKB & Halal: hydrating, exfoliating & brightening toner. Formula custom, MOQ fleksibel. Konsultasi gratis di Dreamlab!",
  "skincare-facial-wash": "Jasa maklon Sabun wajah BPOM, CPKB & Halal: gentle wash, low-pH, brightening & acne wash. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab!",
  "skincare-facial-sunscreen": "Jasa maklon sunscreen BPOM, CPKB & Halal: physical, chemical & hybrid, SPF 30-50+. Formula custom, uji SPF, MOQ fleksibel. Konsultasi gratis di Dreamlab!",
  "skincare-day-night-cream": "Jasa maklon day cream & night cream BPOM, CPKB & Halal. Formula custom teruji klinis, MOQ fleksibel. Wujudkan brand cream wajah Anda. Konsultasi gratis!",
  "skincare-face-mask": "Jasa maklon masker wajah / face mask BPOM, CPKB & Halal: sheet mask, clay mask, peel-off & lainnya. Formula custom, MOQ fleksibel. Konsultasi gratis di Dreamlab!",
  "bodycare-body-lotion": "Jasa maklon body lotion BPOM, CPKB & Halal: daily lotion, whitening, firming & deep moisturizing. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab!",
  "bodycare-body-wash": "Jasa maklon body wash BPOM, CPKB & Halal: shower gel, cream wash & foaming wash. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab!",
  "bodycare-body-butter": "Jasa maklon body butter BPOM, CPKB & Halal: shea & cocoa butter, whipped & scented. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab!",
  "bodycare-body-scrub": "Jasa maklon body scrub BPOM, CPKB & Halal: sugar, salt, coffee & oatmeal scrub. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab",
  "bodycare-anti-bacterial-soap": "Jasa maklon sabun antibakteri (anti-bacterial soap) BPOM & Halal: sabun batang & cair. Formula custom, MOQ fleksibel. Konsultasi gratis Dreamlab!",
  "bodycare-massage-oil": "Jasa maklon massage oil BPOM, CPKB & Halal relaxing, aromatherapy & herbal oil. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab",
  "bodycare-shower-gel": "Jasa maklon shower gel & body wash BPOM, CPKB & Halal. Formula custom dengan aroma khas brand Anda, MOQ fleksibel. Konsultasi gratis di Dreamlab",
  "bodycare-bath-salt": "Jasa maklon bath salt BPOM & Halal: garam mandi relaksasi, aromatherapy & detox. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab!",
  "bodycare-organic-soap": "Jasa maklon sabun organik BPOM & Halal: sabun natural, herbal & essential oil. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab",
  "bodycare-body-serum": "Jasa maklon body serum BPOM, CPKB & Halal: serum tubuh brightening, firming & nourishing. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab",
  "bodycare-transparent-soap": "Jasa maklon sabun transparan BPOM & Halal: glycerin soap, herbal & brightening. Formula custom, MOQ fleksibel. Konsultasi gratis Dreamlab",
  "bodycare-whitening-soap": "Jasa maklon sabun whitening BPOM & Halal: sabun batang & cair pemutih. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab",
  "bodycare-bar-soap": "Jasa maklon sabun batang (bar soap) BPOM & Halal: beauty bar, moisturizing & exfoliating. Formula custom, MOQ fleksibel. Konsultasi gratis Dreamlab",
  "bodycare-massage-cream": "Jasa maklon massage cream BPOM & Halal: relaxing, warming & aromatherapy cream. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab!",
  "bodycare-soothing-gel": "Jasa maklon soothing gel BPOM, CPKB & Halal: aloe vera, after-sun & calming gel. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab",
  "bodycare-neck-cream": "Jasa maklon neck cream (krim leher) BPOM & Halal: anti-aging, brightening & firming. Formula custom, MOQ fleksibel. Konsultasi gratis Dreamlab",
  "bodycare-deodorant": "Jasa maklon deodorant BPOM & Halal — pilih varian spray, roll on, atau dry serum. Formula eksklusif 1 klien 1 formula, konsultasi gratis Dreamlab.",
  "babycare-baby-lotion": "Jasa maklon Baby Lotion BPOM & Halal | Dreamlab",
  "babycare-baby-wash": "Jasa maklon sabun bayi baby BPOM & Halal, sabun & sampo bayi hypoallergenic. Formula custom, MOQ fleksibel. Konsultasi gratis Dreamlab",
  "babycare-baby-shampoo": "Jasa maklon sampo bayi BPOM & Halal, formula lembut & aman untuk bayi. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab",
  "babycare-baby-cologne": "Jasa maklon parfum bayi BPOM & Halal, wewangian segar & lembut untuk si kecil. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab",
  "footcare-foot-cream": "Jasa maklon foot cream BPOM & Halal, perawatan tumit kering & pecah. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab",
  "footcare-foot-scrub": "Jasa maklon foot scrub BPOM & Halal, eksfoliasi & perawatan kaki halus. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab!",
  "footcare-foot-spray": "Jasa maklon foot spray BPOM & Halal, anti-bau & menyegarkan kaki. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab",
  "footcare-foot-soak": "Jasa maklon foot soak BPOM & Halal, rendaman kaki relaksasi. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab",
  "footcare-foot-serum": "Jasa maklon foot serum BPOM & Halal, perawatan intensif kaki. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab",
  "haircare-shampoo": "Jasa maklon shampoo BPOM, CPKB & Halal: anti-ketombe, anti-rontok, hair growth & lainnya. Formula custom, MOQ fleksibel. Konsultasi gratis Dreamlab",
  "haircare-hair-conditioner": "Jasa maklon hair conditioner BPOM, CPKB & Halal, pelembut & perawatan rambut. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab!",
  "haircare-hair-mask": "Jasa maklon hair mask BPOM, CPKB & Halal, perawatan intensif rambut rusak. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab!",
  "haircare-hair-tonic": "Jasa maklon hair tonic BPOM, CPKB & Halal, anti-rontok & penyubur rambut. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab!",
  "haircare-hair-gel": "Jasa maklon hair gel BPOM & Halal, styling rambut tahan lama. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab!",
  "haircare-pomade": "Jasa maklon pomade BPOM & Halal, water based & oil based. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab",
  "haircare-scalp-care": "Jasa maklon scalp care BPOM & Halal, perawatan kulit kepala sehat. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab",
  "haircare-beard-serum": "Jasa maklon beard serum BPOM & Halal, perawatan & penyubur jenggot. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab",
  "haircare-hair-mist": "Jasa maklon hair mist BPOM & Halal, pewangi rambut ringan dengan aroma tahan lama. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab",
  "parfum-body-mist": "Jasa maklon body mist BPOM & Halal, Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab",
  "parfum-eau-de-cologne": "Jasa maklon eau de cologne BPOM & Halal, parfum cologne aroma segar. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab",
  "parfum-eau-de-toilette": "Jasa maklon eau de toilette (EDT) BPOM & Halal, parfum tahan menengah. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab!",
  "parfum-eau-de-parfum": "Jasa maklon eau de parfum (EDP) BPOM & Halal, parfum premium tahan lama. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab",
  "parfum-extrait-de-parfum": "Jasa maklon extrait de parfum BPOM & Halal, parfum konsentrasi tertinggi. Formula custom, MOQ fleksibel. Konsultasi gratis dengan Dreamlab!",
  "parfum-minyak-atsiri": "Jasa maklon minyak atsiri (essential oil) BPOM & Halal, aromaterapi & wellness. Formula custom, MOQ fleksibel. Konsultasi gratis Dreamlab",
  "decorative-lip-cream": "Jasa maklon lip cream BPOM & Halal dengan formula tahan lama dan warna custom. MOQ fleksibel dan konsultasi gratis.",
  "decorative-lip-serum": "Jasa maklon lip serum BPOM & Halal dengan formula oil based premium. MOQ fleksibel dan konsultasi gratis.",
  "decorative-lip-balm": "Jasa maklon lip balm BPOM & Halal untuk pelembap bibir harian. Formula custom dan MOQ fleksibel bersama Dreamlab.",
  "decorative-tinted-lip-balm": "Jasa maklon tinted lip balm BPOM & Halal dengan warna natural dan formula custom. MOQ fleksibel dan konsultasi gratis.",
  "decorative-lip-gloss": "Jasa maklon lip gloss BPOM & Halal dengan efek glossy dan formula custom. MOQ fleksibel dan konsultasi gratis.",
  "decorative-lip-scrub": "Jasa maklon lip scrub BPOM & Halal untuk eksfoliasi bibir halus. Formula custom dan MOQ fleksibel bersama Dreamlab.",
  "decorative-lip-matte": "Jasa maklon lip matte BPOM & Halal dengan hasil transferproof dan nyaman digunakan. MOQ fleksibel dan konsultasi gratis.",
  "decorative-lip-blush": "Jasa maklon lip blush BPOM & Halal dengan warna natural tahan lama. MOQ fleksibel dan konsultasi gratis.",
  "decorative-liquid-highlighter": "Jasa maklon highlighter BPOM & Halal dengan efek glowing dan formula custom. MOQ fleksibel dan konsultasi gratis.",
  "decorative-mascara": "Jasa maklon mascara BPOM & Halal dengan formula waterproof dan tahan lama. MOQ fleksibel dan konsultasi gratis.",
  "decorative-cream-blush": "Jasa maklon cream blush BPOM & Halal dengan hasil natural dan formula custom. MOQ fleksibel dan konsultasi gratis.",
  "decorative-foundation-serum": "Jasa maklon foundation serum BPOM & Halal dengan formula hybrid makeup dan skincare. MOQ fleksibel dan konsultasi gratis.",
  "decorative-liquid-blush": "Jasa maklon liquid blush BPOM & Halal dengan formula pigmented dan natural. MOQ fleksibel dan konsultasi gratis.",
  "decorative-eyebrow-gel": "Jasa maklon eyebrow gel BPOM & Halal dengan formula custom dan hasil natural. MOQ fleksibel dan konsultasi gratis.",
  "decorative-foundation": "Jasa maklon foundation BPOM & Halal dengan coverage tahan lama dan formula custom. MOQ fleksibel dan konsultasi gratis.",
  "decorative-bb-cream": "Jasa maklon BB cream BPOM & Halal dengan formula ringan dan natural. MOQ fleksibel dan konsultasi gratis.",
  "decorative-face-primer": "Jasa maklon face primer BPOM & Halal dengan hasil flawless dan formula custom. MOQ fleksibel dan konsultasi gratis.",
};

export function getCategoryTitle(slug: string): string {
  return categoryTitleMap[slug] || `Maklon ${slug.charAt(0).toUpperCase() + slug.slice(1)} | Dreamlab`;
}

export function getProductTitle(categorySlug: string, productSlug: string): string {
  const key = `${categorySlug}-${productSlug}`;
  return productTitleMap[key] || `Maklon ${productSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())} | Dreamlab`;
}

export function getMetaKeywords(slug: string, productSlug?: string): string {
  const allKeywords: string[] = [...globalKeywords];

  if (productSlug) {
    const key = `${slug}-${productSlug}`;
    const mapped = productKeywordsMap[key];
    if (mapped) {
      allKeywords.push(...mapped);
      allKeywords.push(...(categoryKeywordsMap[slug] || []));
      return [...new Set(allKeywords)].join(", ");
    }
  }

  const catKws = categoryKeywordsMap[slug];
  if (catKws) {
    allKeywords.push(...catKws);
    return [...new Set(allKeywords)].join(", ");
  }

  const pageKws = pageSpecificKeywords[slug];
  if (pageKws) {
    allKeywords.push(...pageKws);
    return [...new Set(allKeywords)].join(", ");
  }

  allKeywords.push(...blogKeywords);
  return [...new Set(allKeywords)].join(", ");
}

export function getCategoryMetaDescription(categoryName: string, description: string, categorySlug?: string): string {
  if (categorySlug) {
    const mapped = categoryMetaDescriptionMap[categorySlug];
    if (mapped) return mapped;
  }
  const clean = description.length > 155
    ? description.substring(0, description.lastIndexOf(" ", 152)) + "..."
    : description;
  return clean;
}

export function getSubCategoryMetaDescription(categorySlug: string, subCategorySlug: string): string | null {
  const key = `${categorySlug}-${subCategorySlug}`;
  return subCategoryMetaDescriptionMap[key] || null;
}

export function getProductMetaDescription(productName: string, categoryName: string, shortDescription: string, moq: string, productionTime: string, certifications: string[], categorySlug?: string, productSlug?: string): string {
  if (categorySlug && productSlug) {
    const key = `${categorySlug}-${productSlug}`;
    const mapped = productMetaDescriptionMap[key];
    if (mapped) return mapped;
  }
  const certs = certifications.length > 0 ? certifications.join(" & ") : "BPOM";
  const desc = `Jasa maklon ${productName.toLowerCase()} — layanan maklon ${categoryName.toLowerCase()} profesional. ${shortDescription} ✓ ${certs} ✓ MOQ ${moq} ✓ Produksi ${productionTime}. Konsultasi gratis.`;

  if (desc.length <= 160) return desc;

  const truncated = shortDescription.length > 120
    ? shortDescription.substring(0, shortDescription.lastIndexOf(" ", 117)) + "..."
    : shortDescription;

  const fallback = `Jasa maklon ${productName.toLowerCase()}. ${truncated} ✓ ${certs} ✓ MOQ ${moq}. Konsultasi gratis.`;
  return fallback.length > 160
    ? fallback.substring(0, fallback.lastIndexOf(" ", 157)) + "..."
    : fallback;
}
