import { aboutData } from "@/data/about-us";
import { homepageData } from "@/data/homepage";
import { servicesEditorialData } from "@/data/services-editorial";
import { clientLogos } from "@/data/clients";

export const homepageDataEn = {
  ...homepageData,
  hero: {
    ...homepageData.hero,
    smallTitle: "The Champion of Formulas",
    title: "Trusted Cosmetic & Skincare Manufacturing Services in Indonesia",
    subtitle: "Behind every great brand is A STRONG FORMULA. A trusted manufacturing solution for THE CHAMPION OF FORMULAS.",
    ctaText: "Free Formula Consultation",
    ctaLink: "Hi Dreamlab, I would like to consult about my brand",
  },
  trustedBrands: {
    ...homepageData.trustedBrands,
    title: "DREAMLAB HAS BEEN TRUSTED BY 500+ BRANDS",
    subtitle: "More than 500+ brands have chosen Dreamlab as their main cosmetic manufacturer. Dreamlab is committed to delivering quality products, as well as professional and satisfying after-sales service.",
  },
  advantages: {
    title: "8 Advantages of Manufacturing at Dreamlab",
    items: [
      { title: "Price", desc: "COGS pricing that can be adjusted.", icon: "Price-1-150x150.webp" },
      { title: "Innovative", desc: "Highly innovative product formulations from a young R&D team.", icon: "inovatif-1-150x150.webp" },
      { title: "Creative", desc: "A creative design team ready to visualize your brand.", icon: "kreatif-1-150x150.webp" },
      { title: "Branding", desc: "Building a strong identity so the brand is easy to recognize in the marketing process.", icon: "branding-1-150x150.webp" },
      { title: "Digital Marketing", desc: "The digital marketing team is ready to reach the brand's target audience much more effectively and efficiently.", icon: "digimar-1-150x150.webp" },
      { title: "Exclusive Formula", desc: "1 client 1 formula. Create your dream formula and be different.", icon: "personalisasi-formula-1-150x150.webp" },
      { title: "Product Formulation", desc: "A young R&D team that is highly innovative.", icon: "formulasi-produk-1-150x150.webp" },
      { title: "Adjustable MOQ", desc: "MOQ is adjusted according to client needs.", icon: "MOQ-1-150x150.webp" },
    ],
  },
  katalog: {
    ...homepageData.katalog,
    title: "DREAMLAB MANUFACTURING PRODUCT CATALOG",
  },
  media: {
    ...homepageData.media,
    title: "Media Coverage About Dreamlab **Cosmetic Factory**",
  },
  blog: {
    ...homepageData.blog,
    title: "Discover Beauty Business Insights",
  },
};

export const catalogContentEn = {
  eyebrow: "Exclusive Formulation & CPKB Grade A",
  title: <>Premium <span className="text-brand-orange">Manufacturing Service</span> Catalog</>,
  description: "From custom laboratory research (R&D) formulation, exclusive branding design visualization, to official BPOM, Halal, & HKI legal registration - we bring your champion beauty brand to life without limits.",
  categories: [
    {
      id: "skincare",
      name: "Skincare",
      tag: "15+ Premium Formulas",
      image: "/new asset/skincare&facecare/cleansing-oill.webp",
      subcategories: "Day & Night Cream - Sunscreen - Facial Wash - Face Serum - Mask",
      link: "/produk/skincare",
    },
    {
      id: "bodycare",
      name: "Body Care",
      tag: "20+ Premium Formulas",
      image: "/new asset/bodycare/body-scrub.webp",
      subcategories: "Body Scrub - Body Lotion - Body Butter - Shower Gel - Bath Salt",
      link: "/produk/bodycare",
    },
    {
      id: "haircare",
      name: "Hair Care",
      tag: "10+ Premium Formulas",
      image: "/new asset/haircare/shampoo.webp",
      subcategories: "Shampoo - Conditioner - Hair Mask - Pomade - Beard Serum",
      link: "/produk/haircare",
    },
    {
      id: "decorative",
      name: "Decorative (Makeup)",
      tag: "12+ Premium Formulas",
      image: "/new asset/lipcare/lip-cream.webp",
      subcategories: "Lip Matte - Lip Cream - Foundation - Cushion - Face Primer",
      link: "/produk/decorative",
    },
    {
      id: "babycare",
      name: "Baby Care",
      tag: "8+ Premium Formulas",
      image: "/new asset/baby-care/baby-cologne.webp",
      subcategories: "Baby Oil - Baby Cologne - Baby Shampoo - Baby Wash - Lotion",
      link: "/produk/babycare",
    },
    {
      id: "parfum",
      name: "Perfume & Fragrance",
      tag: "15+ Signature Scents",
      image: "/new asset/parfum/edpp.webp",
      subcategories: "Extrait de Parfum - Eau de Parfum - Eau de Toilette - Body Mist",
      link: "/produk/parfum",
    },
    {
      id: "footcare",
      name: "Foot Care & Special Care",
      tag: "10+ Premium Formulas",
      image: "/new asset/footcare/Footcream-maklon .png",
      subcategories: "Foot Cream - Foot Scrub - Underarm Cream - Soothing Gel",
      link: "/produk/footcare",
    },
  ],
};

export const trustBarContentEn = [
  {
    title: "The Champion of Formulas",
    description: "Exclusive custom formulation from an expert R&D team",
  },
  {
    title: "Flexible MOQ",
    description: "Production scale friendly for beginners & scale-up brands",
  },
  {
    title: "Free Packaging Design",
    description: "Exclusive logo & packaging design, ready for printing",
  },
  {
    title: "Free Marketing Support",
    description: "Comprehensive branding & social media guidance",
  },
];

export const brandShowcaseContentEn = {
  productsDevelopedLabel: "Products Developed",
  certifiedFacility: "CPKB Grade A certified production facility",
  innovationText: "500+ formulations for brands in 15+ countries",
  eyebrow: "Dreamlab #CHAMPION OF FORMULAS",
  title: <>Create Your Brand <span className="text-brand-orange text-glow">with Dreamlab</span></>,
  description: <>Dreamlab is a cosmetic manufacturing company with complete end-to-end services. We offer <strong className="text-brand-black">One Stop Manufacturing Service</strong>, from consultation, formula creation, packaging design, production, to BPOM and Halal permit handling.</>,
  primaryCta: "FREE CONSULTATION (WA)",
  secondaryCta: "LEARN THE MANUFACTURING FLOW",
  secondaryHref: "/en/services/",
};

export const advantagesContentEn = {
  eyebrow: "Dreamlab Advantages",
  title: <>8 Advantages of <span className="text-brand-orange font-bold">Manufacturing at Dreamlab</span></>,
  description: "Dreamlab's commitment to delivering comprehensive, exclusive, and world-quality upstream-to-downstream cosmetic manufacturing solutions.",
  points: [
    { index: "01", title: "Exclusive Formula", desc: "1 client 1 formula. Create your dream formula and be different." },
    { index: "02", title: "Product Formulation", desc: "A young R&D team that is highly innovative." },
    { index: "03", title: "Innovative", desc: "Highly innovative product formulations from a young R&D team." },
    { index: "04", title: "Adjustable MOQ", desc: "MOQ is adjusted according to client needs." },
    { index: "05", title: "Price", desc: "COGS pricing that can be adjusted." },
    { index: "06", title: "Creative", desc: "A creative design team ready to visualize your brand." },
    { index: "07", title: "Branding", desc: "Building a strong identity so the brand is easy to recognize in the marketing process." },
    { index: "08", title: "Digital Marketing", desc: "The digital marketing team is ready to reach the brand's target audience much more effectively and efficiently." },
  ],
};

export const aboutDataEn = {
  ...aboutData,
  hero: {
    ...aboutData.hero,
    title: "Create a Cosmetic Brand in 3 Months",
    subtitle: "From Idea to Ready to Sell",
    description: "Exclusive formulation, CPKB-certified production, BPOM & Halal handled. One partner, everything done.",
    ctaText: "Free Consultation Now",
    ctaLink: "Hi Dreamlab, I would like to consult about creating a cosmetic brand",
    trustBadges: [
      { icon: "shield", label: "CPKB Grade A Certification" },
      { icon: "check", label: "BPOM & Halal Guaranteed" },
      { icon: "users", label: "150+ Brand Partners" },
      { icon: "heart", label: "After-Sales Support" },
    ],
  },
  authority: {
    ...aboutData.authority,
    headline: "Get to Know Dreamlab. Deeper.",
    subheadline: "Certified aseptic factory, licensed pharmacists, and complete legality guarantee.",
    ctaText: "See More",
    points: [
      {
        ...aboutData.authority.points[0],
        title: "CPKB Grade A Certification",
        description: "No. CPKB/2023/18260-A - international-level hygiene standards for cosmetic production.",
      },
      {
        ...aboutData.authority.points[1],
        title: "Official BPOM RI Distribution Permit",
        description: "Active BPOM server verification - every product is registered and legally compliant.",
        certNo: "Active BPOM Verification",
      },
    ],
    additionalCerts: [
      { label: "Halal MUI", certNo: "ID00410000219461221" },
      { label: "Pharmacist STRA", certNo: "1991/STRA-Apoteker/1827361" },
      { label: "HKI Kemenkumham", certNo: "Verified" },
    ],
  },
  afterSales: {
    ...aboutData.afterSales,
    headline: "WE DO NOT LEAVE AFTER THE PRODUCT IS DONE.",
    subheadline: "A commitment to continuous quality with competitive production costs - because your brand is a long-term business.",
    ctaText: "Learn About Our After-Sales",
    ctaLink: "Hi Dreamlab, I would like to know more about after-sales support",
    points: [
      {
        ...aboutData.afterSales.points[0],
        title: "Batch-to-Batch Consistency Guarantee",
        description: "The quality of every production remains the same - formula, texture, and performance do not change from the first batch onward.",
      },
      {
        ...aboutData.afterSales.points[1],
        title: "Free Reformulation Support",
        description: "Does the product need adjustment based on market feedback? Our R&D team is ready to help at no additional cost.",
      },
    ],
    benefits: [
      { label: "Competitive Production Price", desc: "Maximum margin for brand owners" },
      { label: "Post-Production Consultation", desc: "The R&D team remains available after launch" },
      { label: "Strict Quality Control", desc: "Every batch passes stability testing" },
    ],
  },
  services: {
    headline: "SIMPLE PROCESS. MAXIMUM RESULT.",
    subheadline: "Four easy steps from consultation to ready-to-sell product.",
    cards: [
      {
        id: 1,
        step: "01",
        title: "Consultation & Ideation",
        description: "Discussion of brand concept, target market, and product type that fits your vision.",
      },
      {
        id: 2,
        step: "02",
        title: "Research & Formulation",
        description: "The pharmacist team creates an exclusive formula with high-quality active ingredients.",
      },
      {
        id: 3,
        step: "03",
        title: "Production & Legality",
        description: "Mass production in a CPKB Grade A factory plus BPOM & Halal handling at the same time.",
      },
      {
        id: 4,
        step: "04",
        title: "After-Sales Support",
        description: "Continuous post-launch support: reformulation, consultation, and quality assurance.",
      },
    ],
  },
  cta: {
    headline: "START BUILDING YOUR BRAND NOW.",
    subheadline: "Choose a concrete step toward beauty market domination.",
    actions: [
      { id: 1, title: "Request a Free Formula Sample", icon: "beaker", link: "Hi Dreamlab, I am interested in requesting a skincare formula sample" },
      { id: 2, title: "Schedule a Factory Visit", icon: "mapPin", link: "https://maps.google.com/?q=SIER+Surabaya" },
      { id: 3, title: "Consult R&D with a Pharmacist", icon: "messageSquare", link: "Hi Dreamlab, I would like a technical consultation with Dreamlab's pharmacist R&D team" },
    ],
  },
};

export const aboutSectionContentEn = {
  authority: {
    eyebrow: "Authority & Certification",
    productsDevelopedLabel: "Products Developed",
    certifiedFacility: "CPKB Grade A certified production facility",
    innovationText: "500+ formulations for brands in 15+ countries",
  },
  afterSales: {
    eyebrow: "[ PREMIUM SERVICES ]",
    title: <>The Most Complete <span className="text-brand-orange italic font-normal">Cosmetic Manufacturing</span> Service, From Zero to Market Ready</>,
    imageAlt: "Dreamlab Complete Cosmetic Manufacturing",
    cards: [
      {
        title: "One Stop Service",
        description: "Services cover trademark, packaging design, BPOM, and HALAL certification.",
      },
      {
        title: "Quality Is Number 1",
        description: "Supported by an expert R&D team, we deliver quality custom and ready stock products.",
      },
      {
        title: "After Sales",
        description: "We are committed to quality with competitive production costs to support your brand growth.",
      },
      {
        title: "Certified",
        description: "Products are guaranteed safe and legal with BPOM RI, CPKB Grade A, and Halal MUI standards.",
      },
    ],
    cta: "Start Manufacturing Now",
  },
  timeline: {
    eyebrow: "practical and easy steps for your cosmetic brand",
    title: "MANUFACTURING PROCESS",
    steps: [
      { id: "01", title: "IDEA CONSULTATION", description: "Consult your dream cosmetic idea with us" },
      { id: "02", title: "RIGHT FORMULATION", description: "If you do not have a formulation yet, we prepare the right formulation according to your wishes" },
      { id: "03", title: "SAMPLE CREATION", description: "Sample creation" },
      { id: "04", title: "RESULT DISCUSSION", description: "Sample result discussion" },
      { id: "05", title: "LEGALITY & DESIGN", description: "Creation of legality and certificates and preparation of packaging design" },
      { id: "06", title: "PRODUCTION", description: "Production" },
      { id: "07", title: "PROMOTIONAL MEDIA", description: "Prepare promotional media" },
      { id: "08", title: "MARKETING", description: "Online marketing or offline marketing" },
    ],
  },
};

export const servicesEditorialDataEn = {
  ...servicesEditorialData,
  hero: {
    ...servicesEditorialData.hero,
    title: "One Stop Manufacturing Services Solution for Your Brand",
    description: "Free brand concept consultation - Custom formula - Custom logo & packaging design - Legality handling - Free digital marketing support",
    subtitle: "From Idea to Ready to Sell",
    primaryCta: "Start Free Consultation",
    secondaryCta: "See How It Works",
  },
};

export const servicesWrapperContentEn = {
  eyebrow: "[ PREMIUM SERVICES ]",
  title: <>The Best Place to <span className="text-brand-orange italic font-normal">Create</span> Your Dream Brand</>,
  cards: [
    {
      title: "One Stop Service",
      description: "Services cover trademark, packaging design, BPOM, and HALAL certification.",
    },
    {
      title: "Quality is Number 1",
      description: "Supported by an expert R&D team, we deliver quality custom and ready stock products.",
    },
    {
      title: "After Sales",
      description: "We are committed to quality with competitive production costs to support your brand growth.",
    },
    {
      title: "Certified",
      description: "Products are guaranteed safe and legal with BPOM RI, CPKB Grade A, and Halal MUI standards.",
    },
  ],
  advantagesTitle: "8 Manufacturing Advantages",
  advantagesContent: advantagesContentEn,
  cta: {
    title: "Create Your Dream Cosmetic Brand in 3 Months",
    buttonText: "CONSULT TODAY !",
  },
};

export const contactContentEn = {
  hero: {
    title: <>Create <br /><span className="text-brand-orange font-bold italic">Your Dream Brand</span></>,
    description: "Dreamlab is a trusted manufacturing partner in East Java ready to accompany you at every step of creating cosmetic, skincare, bodycare, and perfume manufacturing products.",
    cta: "Start Free Consultation",
    imageAlt: "Create Your Dream Cosmetic Brand",
  },
  locationsHeader: {
    eyebrow: "Our Location",
    title: <>Visit Our Office <span className="text-brand-orange font-bold italic">& Factory</span></>,
    description: "We warmly welcome your visit for direct offline consultation with our business team.",
  },
  locations: [
    {
      title: "Surabaya Marketing Office",
      address: "Dukuh Kupang Timur XX No.77B, Pakis, Kec. Sawahan, Surabaya, East Java 60256",
      maps: "https://maps.app.goo.gl/UDWzjzsL9ZjTPzLJ6",
      type: "HEAD MARKETING OFFICE",
      hours: "Monday - Friday | 08:00 - 17:00 WIB",
    },
    {
      title: "Pasuruan Production Factory",
      address: "Gang Mindi, RT.04/RW.03, Kolursari, Sidowayah, Kec. Beji, Pasuruan, East Java 67154",
      maps: "https://maps.app.goo.gl/ZPA1xX3CEvY6qNvz6",
      type: "MAIN PRODUCTION PLANT",
      hours: "Monday - Saturday | 08:00 - 16:00 WIB",
    },
  ],
  mapsButton: "Maps Direction",
  faq: {
    eyebrow: "Manufacturing Q&A",
    title: <>Know the Manufacturing Process <span className="text-brand-orange font-bold italic">Further</span></>,
    description: "Get quick answers to common questions about initial capital, BPOM regulation, formula ownership, and the working flow.",
    items: [
      {
        question: "How much initial capital (MOQ) is needed to create your own cosmetic brand?",
        answer: "Dreamlab applies a friendly and flexible MOQ (Minimum Order Quantity). We are committed to supporting new entrepreneurs from micro to large scale, with special programs that make it possible to launch cosmetic products without billions of rupiah in capital.",
      },
      {
        question: "How long does the manufacturing process take from start until ready to sell?",
        answer: "Generally, all stages take around 2 to 3 months. The details include the custom R&D formula research process (2-4 weeks), BPOM distribution permit registration (4-8 weeks), Halal certification, and mass production at the factory (2-3 weeks).",
      },
      {
        question: "Is my product formula guaranteed to be unique and not the same as another brand?",
        answer: "Yes, 100% exclusive. Our expert R&D formulators design each formula custom and uniquely for every client based on the agreed product concept. We guarantee the confidentiality of your formula through a formal non-disclosure agreement (NDA).",
      },
      {
        question: "Does Dreamlab help with BPOM, Halal, and HAKI registration?",
        answer: "Of course. As a One-Stop Service manufacturer, our regulatory compliance team will fully handle all your legality administration - from trademark Intellectual Property Rights (HAKI) registration, laboratory test certification, to the issuance of BPOM numbers and Halal MUI certificates.",
      },
      {
        question: "What if I do not have packaging design yet?",
        answer: "Do not worry! We provide free packaging design services. Our in-house graphic designer team will help design the visual concept of the logo, container/bottle label, and outer box of your product according to the brand character you want to build.",
      },
    ],
  },
};

export const faqHomeContentEn = {
  title: <>Learn More About Dreamlab <span className="text-brand-orange font-bold">Cosmetic</span> Manufacturing</>,
  items: [
    {
      question: "How does Dreamlab guarantee the exclusivity of my product formula?",
      answer: "Every formula created by our in-house R&D team is 100% exclusive and bound by legal protection contract (NDA). We apply a strict policy: one special formula is designed only for one brand partner. Dreamlab guarantees there is no formula cloning or use of the same recipe for your competitors in the market.",
    },
    {
      question: "What is the Minimum Order Quantity (MOQ) limit at Dreamlab?",
      answer: "We support the acceleration of new brands by offering a very flexible and friendly MOQ. The minimum order limit is dynamically adjusted to the product category and active ingredient specifications used. This allows you to test the market without excessive inventory risk or overly large initial capital pressure.",
    },
    {
      question: "Are all BPOM, Halal, and HAKI permits handled by Dreamlab?",
      answer: "Yes, completely. Dreamlab's compliance and legality team oversees the entire bureaucracy process from beginning to completion, including Halal MUI certification, HAKI (trademark) registration, and issuance of the official BPOM Notification Number. You only need to focus on sales strategy, while we handle the product legality aspects cleanly and transparently.",
    },
    {
      question: "How does the formula sample creation process work and what does it cost?",
      answer: "The initial process of product concept consultation and first sample creation in our R&D laboratory is 100% free. If the sample requires sensory adjustment (texture, aroma, efficacy), we provide formula revision facilities until the product truly meets your feasibility standards and absolute satisfaction before entering the mass production line.",
    },
    {
      question: "What support do I get after the production process is finished?",
      answer: "Our partnership is long term. After the production process is completed, Dreamlab provides exclusive Go-To-Market Support in the form of digital promotional assets, professional studio product photo packages, ready-to-use technical catalogs, and online and offline marketing strategy consultation sessions to help ensure your brand launch succeeds.",
    },
  ],
};

export const clientContentEn = {
  eyebrow: "Trusted Partners",
  title: <>Build Your Cosmetic Brand with a <br className="hidden md:inline" /><span className="text-brand-orange font-bold italic">Trusted Partner</span></>,
  description: "More than 5,000 brands have chosen Dreamlab as their main cosmetic manufacturer. Your satisfaction is our top priority. Dreamlab is committed to delivering quality products, as well as professional and satisfying after-sales service.",
  logos: clientLogos,
};

export const ctaContentEn = {
  title: "Create Your Dream Cosmetic Brand in 3 Months",
  buttonText: "CONSULT TODAY !",
};

// Versi English dari section blog home (setara spotlight posts di home Indonesia).
// Artikel aslinya tetap berbahasa Indonesia, jadi kartu ini menampilkan terjemahan
// judul/excerpt dan menautkan ke halaman artikel yang sama.
export const homeBlogContentEn = {
  title: "Discover Beauty Business Insights",
  seeAllText: "View All Articles",
  readMoreText: "READ MORE",
  posts: [
    {
      title: "Build Your Own Perfume Brand: Complete Cost Breakdown & Requirements",
      date: "January 26, 2026",
      category: "Cosmetic Manufacturing",
      image: "/assets/images/blog/803584-1.webp",
      excerpt:
        "Want to create your own perfume brand? See the perfume manufacturing cost breakdown, requirements, and capital estimate. Dreamlab is ready to help with small MOQ and free BPOM.",
      link: "/biaya-maklon-parfum-moq-kecil/",
    },
    {
      title: "Glow Glasskin Skincare Business Innovation: Hydroquinone-Level Effect",
      date: "December 17, 2025",
      category: "Cosmetic Business Guide",
      image: "/assets/images/blog/Sampul-WEB-1.webp",
      excerpt:
        "Build a Glow Glasskin skincare business with a hydroquinone-equivalent effect using the safe and BPOM-approved Cystamine formula.",
      link: "/bisnis-skincare-glow-glasskin-cystamine/",
    },
  ],
};
