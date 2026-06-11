export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  subDescription?: string;
  category: string;
  cardImage: string;
  heroImages: {
    lands: string;
    ports: string;
  };
  bgImages: {
    lands: string;
    ports: string;
  };
}

export interface Category {
  slug: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage?: string;
  heroBgColor?: string;
  heroImages?: {
    lands: string;
    ports: string;
  };
  categories: {
    id: string;
    label: string;
    tabImage?: string;
    products: Product[];
  }[];
  faqs: { question: string; answer: string }[];
}

export const productData: Record<string, Category> = {
  skincare: {
    slug: "skincare",
    name: "Skincare",
    title: "Maklon Skincare",
    subtitle: "BPOM & Halal",
    description: "Jasa maklon skincare solusi mudahkanmu mewujudkan brandmu tanpa ribet. Dengan formula premium, aman, dan BPOM",
    backgroundImage: "/assets/images/Face-Care-2.webp",
    heroImages: {
      lands: "/assets/produk/skincare/hero-section.webp",
      ports: "/assets/produk/skincare/hero-section.webp"
    },
    categories: [
      {
        id: "face-cream",
        label: "Face Cream Series",
        tabImage: "/assets/images/Slimming-Cream-1.webp",
        products: [
          {
            id: "skincare-1",
            slug: "face-cream",
            name: "Day & Night Cream Series",
            description: "Pelembap wajah untuk pagi dan malam hari dengan formula khusus yang merawat kulit sepanjang hari. Mengandung bahan aktif untuk melembapkan, brighten, dan melindungi kulit dari radikal bebas.",
            subDescription: "Yuk, konsultasi sekarang dan wujudkan brand skincareimpian kamu!",
            category: "skincare",
            cardImage: "/assets/produk/skincare/card1-dayandnightcreame.webp",
            heroImages: {
              lands: "/assets/produk/skincare/bg-lands-card1.jpeg",
              ports: "/assets/produk/skincare/bg-port-card1.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/skincare/bg-lands-card1.jpeg",
              ports: "/assets/produk/skincare/bg-port-card1.jpeg"
            }
          }
        ]
      },
      {
        id: "face-mask",
        label: "Face Mask Series",
        tabImage: "/assets/images/hair-mask-1.webp",
        products: [
          {
            id: "skincare-2",
            slug: "face-mask",
            name: "Face Mask Series",
            description: "Masker wajah dengan berbagai variant untuk membersihkan, mengecilkan pori, dan merawat kulit. Efektif mengangkat kotoran, sel kulit mati, dan komedo.",
            subDescription: "Pilihan populer: Charcoal untuk detox, Green Tea untuk soothe, Gold & Collagen untuk brighten.",
            category: "skincare",
            cardImage: "/assets/produk/skincare/card2-face-mask.webp",
            heroImages: {
              lands: "/assets/produk/skincare/bg-lands-card2.jpeg",
              ports: "/assets/produk/skincare/bg-port-card2.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/skincare/bg-lands-card2.jpeg",
              ports: "/assets/produk/skincare/bg-port-card2.jpeg"
            }
          }
        ]
      },
      {
        id: "sunscreen",
        label: "Sunscreen Series",
        tabImage: "/assets/images/body-wash-1.webp",
        products: [
          {
            id: "skincare-3",
            slug: "sunscreen",
            name: "Sunscreen",
            description: "Physical Sunscreen dengan Zinc Oxide dan Titanium Dioxide yang efektif melindungi dari UVA dan UVB. Cocok untuk kulit sensitif.",
            subDescription: "Formula disesuaikan agar tidak white cast, nyaman dipakai harian, dan ringan di kulit.",
            category: "skincare",
            cardImage: "/assets/produk/skincare/card3-sunscreen.webp",
            heroImages: {
              lands: "/assets/produk/skincare/bg-lands-card3.jpeg",
              ports: "/assets/produk/skincare/bg-ports-card3.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/skincare/bg-lands-card3.jpeg",
              ports: "/assets/produk/skincare/bg-ports-card3.jpeg"
            }
          }
        ]
      },
      {
        id: "cleansing",
        label: "Cleansing Series",
        tabImage: "/assets/images/body-wash-1.webp",
        products: [
          {
            id: "skincare-4",
            slug: "cleansing",
            name: "Cleansing",
            description: "Micellar Cleansing Gel adalah pembersih wajah praktis yang mengangkat kotoran, minyak, dan sisa makeup tanpa membuat kulit kering.",
            subDescription: "Mengandung Aloe Vera, Cucumber Extract, atau Hyaluronic Acid yang membersihkan sambil menjaga kelembapan kulit.",
            category: "skincare",
            cardImage: "/assets/produk/skincare/card4.webp",
            heroImages: {
              lands: "/assets/produk/skincare/bg-lands-card4.webp",
              ports: "/assets/produk/skincare/bg-ports-card4.webp"
            },
            bgImages: {
              lands: "/assets/produk/skincare/bg-lands-card4.webp",
              ports: "/assets/produk/skincare/bg-ports-card4.webp"
            }
          }
        ]
      },
      {
        id: "facial-wash",
        label: "Facial Wash Series",
        tabImage: "/assets/images/acne-facial-wash-1.webp",
        products: [
          {
            id: "skincare-5",
            slug: "facial-wash",
            name: "Facial Wash",
            description: "Brightening Facial Wash yang tidak hanya membersihkan tetapi juga membantu brighten kulit secara alami.",
            subDescription: "Dengan Niacinamide, Vitamin C, Alpha Arbutin, atau Licorice Extract. Tekstur bisa soft gel, creamy foam, atau low-foam.",
            category: "skincare",
            cardImage: "/assets/produk/skincare/card5-facial-wash.webp",
            heroImages: {
              lands: "/assets/produk/skincare/bg-lands-card5.jpeg",
              ports: "/assets/produk/skincare/bg-ports-card5.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/skincare/bg-lands-card5.jpeg",
              ports: "/assets/produk/skincare/bg-ports-card5.jpeg"
            }
          }
        ]
      },
      {
        id: "facial-toner",
        label: "Facial Toner Series",
        tabImage: "/assets/images/body-wash-1.webp",
        products: [
          {
            id: "skincare-6",
            slug: "facial-toner",
            name: "Facial Toner",
            description: "Acne Facial Toner adalah treatment setelah Cuci wajah yang membantu membersihkan sisa kotoran, mengontrol minyak, dan mengatasi kulit berjerawat.",
            subDescription: "Dengan Salicylic Acid, Tea Tree Oil, Witch Hazel, plus Aloe Vera atau Centella Asiatica.",
            category: "skincare",
            cardImage: "/assets/produk/skincare/card6-toner.webp",
            heroImages: {
              lands: "/assets/produk/skincare/bg-lands-card6.jpeg",
              ports: "/assets/produk/skincare/bg-ports-card6.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/skincare/bg-lands-card6.jpeg",
              ports: "/assets/produk/skincare/bg-ports-card6.jpeg"
            }
          }
        ]
      },
      {
        id: "facial-serum",
        label: "Facial Serum Series",
        tabImage: "/assets/images/body-wash-1.webp",
        products: [
          {
            id: "skincare-7",
            slug: "facila-serum",
            name: "Facial Serum",
            description: "Radiant Serum dengan formula sangat concentrate untuk hasil maksimal. Dirancang menembus lapisan kulit lebih dalam.",
            subDescription: "Various formula choices: brightening, anti-aging, hingga soothing serum.",
            category: "skincare",
            cardImage: "/assets/produk/skincare/card7-serum.webp",
            heroImages: {
              lands: "/assets/produk/skincare/bg-lands-card7.jpeg",
              ports: "/assets/produk/skincare/bg-ports-card7.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/skincare/bg-lands-card7.jpeg",
              ports: "/assets/produk/skincare/bg-ports-card7.jpeg"
            }
          }
        ]
      }
    ],
    faqs: [
      {
        question: "How much is the MOQ for skincare toll manufacturing?",
        answer: "MOQ (Minimum Order Quantity) at Dreamlab is very competitive and flexible, starting from 1000 pcs per product variant."
      },
      {
        question: "Is BPOM handling included?",
        answer: "Yes, our service is a One Stop Solution covering formulation, packaging design, to BPOM & Halal legality handling."
      }
    ]
  },

  bodycare: {
    slug: "bodycare",
    name: "Body Care",
    title: "MAKLON BODY CARE",
    subtitle: "DREAMLAB INDONESIA",
    description: "Most complete body care toll manufacturing solution. Production of lotion, scrub, to body wash with luxurious scents and textures comfortable on the skin.",
    backgroundImage: "/assets/images/Body-Care-1.webp",
    heroImages: {
      lands: "/assets/produk/bodycare/hero-lands.webp",
      ports: "/assets/produk/bodycare/hero-port.webp"
    },
    categories: [
      {
        id: "massage-oil",
        label: "Massage Oil",
        tabImage: "/assets/images/body-wash-1.webp",
        products: [
          {
            id: "bodycare-1",
            slug: "massage-oil",
            name: "Massage Oil",
            description: "Massage Oil adalah produk body care yang membantu relaksasi otot, melancarkan sirkulasi darah, dan memberikan efek hangat atau soothe.",
            subDescription: "Dengan Olive Oil, Coconut, Eucalyptus, Peppermint, atau Ginger alami.",
            category: "bodycare",
            cardImage: "/assets/produk/bodycare/card1-message-oil.webp",
            heroImages: {
              lands: "/assets/produk/bodycare/bg-lands-card1.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card1.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/bodycare/bg-lands-card1.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card1.jpeg"
            }
          }
        ]
      },
      {
        id: "body-butter",
        label: "Body Butter",
        tabImage: "/assets/images/body-butter-1.webp",
        products: [
          {
            id: "bodycare-2",
            slug: "body-butter",
            name: "Body Butter",
            description: "Body Butter adalah pelembap tubuh kaya nutrisi untuk kulit kering dan kasar. Melembapkan dan membuat kulit lembut setiap hari.",
            subDescription: "Dengan Shea Butter, Cocoa Butter, Almond Oil, dan Vitamin E.",
            category: "bodycare",
            cardImage: "/assets/produk/bodycare/card2-body-butter.webp",
            heroImages: {
              lands: "/assets/produk/bodycare/bg-lands-card2.jpeg",
              ports: "/assets/produk/bodycare/bg-prots-card2.webp"
            },
            bgImages: {
              lands: "/assets/produk/bodycare/bg-lands-card2.jpeg",
              ports: "/assets/produk/bodycare/bg-prots-card2.webp"
            }
          }
        ]
      },
      {
        id: "body-scrub",
        label: "Body Scrub",
        tabImage: "/assets/images/body-scrub-1.webp",
        products: [
          {
            id: "bodycare-3",
            slug: "body-scrub",
            name: "Body Scrub",
            description: "Body Scrub mengangkat sel kulit mati, brighten, dan membuat kulit halus dan segar. Cocok untuk treatment mingguan.",
            subDescription: "Dengan Rice Extract, Coffee, Milk, Charcoal, atau Turmeric.",
            category: "bodycare",
            cardImage: "/assets/produk/bodycare/card3-bodyscrub.webp",
            heroImages: {
              lands: "/assets/produk/bodycare/bg-lands-card3.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card3.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/bodycare/bg-lands-card3.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card3.jpeg"
            }
          }
        ]
      },
      {
        id: "anti-bacterial-soap",
        label: "Anti-Bacterial Soap",
        tabImage: "/assets/images/body-wash-1.webp",
        products: [
          {
            id: "bodycare-4",
            slug: "anti-bacterial-soap",
            name: "Anti Bacterial Soap",
            description: "Anti-Bacterial Soap membersihkan tubuh sambil melindungi kulit dari kuman dan bakteri. Cocok untuk penggunaan harian.",
            subDescription: "Dengan Tea Tree Oil, Triclosan, atau Chlorhexidine, plus Aloe Vera atau Glycerin.",
            category: "bodycare",
            cardImage: "/assets/produk/bodycare/card4-soap.webp",
            heroImages: {
              lands: "/assets/produk/bodycare/bg-lands-card4.webp",
              ports: "/assets/produk/bodycare/bg-ports-card4.webp"
            },
            bgImages: {
              lands: "/assets/produk/bodycare/bg-lands-card4.webp",
              ports: "/assets/produk/bodycare/bg-ports-card4.webp"
            }
          }
        ]
      },
      {
        id: "shower-gel",
        label: "Shower Gel",
        tabImage: "/assets/images/body-wash-1.webp",
        products: [
          {
            id: "bodycare-5",
            slug: "shower-gel",
            name: "Shower Gel",
            description: "Shower Gel adalah sabun mandi cair dengan tekstur lembut dan aroma segar untuk pengalaman shower yang nyaman.",
            subDescription: "Variant: Aloe Vera, Milk & Honey, Tea Tree, atau Charcoal.",
            category: "bodycare",
            cardImage: "/assets/produk/bodycare/card5-showergel.webp",
            heroImages: {
              lands: "/assets/produk/bodycare/bg-lands-card5.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card5.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/bodycare/bg-lands-card5.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card5.jpeg"
            }
          }
        ]
      },
      {
        id: "bath-salt",
        label: "Bath Salt",
        tabImage: "/assets/images/body-scrub-1.webp",
        products: [
          {
            id: "bodycare-6",
            slug: "bath-salt",
            name: "Bath Salt",
            description: "Bath Salt membantu relaksasi otot, melembutkan kulit, dan memberikan sensasi spa di rumah.",
            subDescription: "Dengan Epsom Salt, Dead Sea Salt, Himalayan Salt, plus essential oils Lavender, Peppermint, atau Rose.",
            category: "bodycare",
            cardImage: "/assets/produk/bodycare/card6-bath-salt.webp",
            heroImages: {
              lands: "/assets/produk/bodycare/bg-lands-card6.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card6.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/bodycare/bg-lands-card6.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card6.jpeg"
            }
          }
        ]
      },
      {
        id: "body-wash",
        label: "Body Wash",
        tabImage: "/assets/images/body-wash-1.webp",
        products: [
          {
            id: "bodycare-7",
            slug: "body-wash",
            name: "Body Wash",
            description: "Body Wash adalah sabun mandi cair yang lembut, mudah dibilas, dan membuat shower terasa segar.",
            subDescription: "Variant: Moisturizing (Aloe Vera & Glycerin), Brightening (Niacinamide & Vitamin C), atau Refreshing (Peppermint & Tea Tree Oil).",
            category: "bodycare",
            cardImage: "/assets/produk/bodycare/card7-bodywash.webp",
            heroImages: {
              lands: "/assets/produk/bodycare/bg-lands-card7.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card7.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/bodycare/bg-lands-card7.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card7.jpeg"
            }
          }
        ]
      },
      {
        id: "organic-soap",
        label: "Organic Soap",
        tabImage: "/assets/images/Body-Care-1.webp",
        products: [
          {
            id: "bodycare-8",
            slug: "organic-soap",
            name: "Organic Soap",
            description: "Organic Soap adalah sabun tubuh dari bahan alami tanpa deterjen keras, pewarna sintetis, atau parfum berlebihan.",
            subDescription: "Dengan Coconut Oil, Olive Oil, Shea Butter, dan Essential Oils. Variant: Charcoal, Calendula, Coffee, Oat.",
            category: "bodycare",
            cardImage: "/assets/produk/bodycare/card8-organic-soap.webp",
            heroImages: {
              lands: "/assets/produk/bodycare/bg-lands-card7.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card7.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/bodycare/bg-lands-card7.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card7.jpeg"
            }
          }
        ]
      },
      {
        id: "body-serum",
        label: "Body Serum",
        tabImage: "/assets/images/body-wash-1.webp",
        products: [
          {
            id: "bodycare-9",
            slug: "body-serum",
            name: "Body Serum",
            description: "Body Serum adalah treatment tubuh ringan dengan bahan aktif tinggi untuk brighten, melembapkan, dan mengencangkan kulit.",
            subDescription: "Dengan Niacinamide, Vitamin C, Hyaluronic Acid, dan Collagen.",
            category: "bodycare",
            cardImage: "/assets/produk/bodycare/card9-body-serum.webp",
            heroImages: {
              lands: "/assets/produk/bodycare/bg-lands-card9.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card9.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/bodycare/bg-lands-card9.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card9.jpeg"
            }
          }
        ]
      },
      {
        id: "transparent-soap",
        label: "Transparent Soap",
        tabImage: "/assets/images/Body-Care-1.webp",
        products: [
          {
            id: "bodycare-10",
            slug: "transparent-soap",
            name: "Transparent Soap",
            description: "Transparent Soap adalah sabun batangan bening yang lembut dan efektif membersihkan. Cocok untuk yang menginginkan sabun yang cantik dan wangi.",
            subDescription: "Dengan Glycerin, Coconut Oil, dan Essential Oil. Bisa tambah Niacinamide, Charcoal, atau Goat Milk.",
            category: "bodycare",
            cardImage: "/assets/produk/bodycare/card10-trasnparant-soap.webp",
            heroImages: {
              lands: "/assets/produk/bodycare/bg-lands-card10.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card10.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/bodycare/bg-lands-card10.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card10.jpeg"
            }
          }
        ]
      },
      {
        id: "underarm-cream",
        label: "Underarm Cream",
        tabImage: "/assets/images/body-butter-1.webp",
        products: [
          {
            id: "bodycare-11",
            slug: "underarm-cream",
            name: "Underarm Cream",
            description: "Underarm Cream adalah krim ketiak yang brighten, melembapkan, dan mengurangi bau tidak sedap.",
            subDescription: "Dengan Niacinamide, Alpha Arbutin, Licorice Extract, dan Allantoin. Cepat meresap, tidak lengket.",
            category: "bodycare",
            cardImage: "/assets/produk/bodycare/card11-underarm.webp",
            heroImages: {
              lands: "/assets/produk/bodycare/bg-lands-card11.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card11.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/bodycare/bg-lands-card11.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card11.jpeg"
            }
          }
        ]
      },
      {
        id: "whitening-soap",
        label: "Whitening Soap",
        tabImage: "/assets/images/Body-Care-1.webp",
        products: [
          {
            id: "bodycare-12",
            slug: "whitening-soap",
            name: "Whitening Soap",
            description: "Whitening Soap membantu brighten kulit agar halus, bersih, dan glowing. Cocok untuk treatment shower harian.",
            subDescription: "Dengan Niacinamide, Glutathione, Vitamin C, Alpha Arbutin, atau Licorice Extract.",
            category: "bodycare",
            cardImage: "/assets/produk/bodycare/card12-whitening-soap.webp",
            heroImages: {
              lands: "/assets/produk/bodycare/bg-lands-card12.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card12.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/bodycare/bg-lands-card12.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card12.jpeg"
            }
          }
        ]
      },
      {
        id: "bar-soap",
        label: "Bar Soap",
        tabImage: "/assets/images/Body-Care-1.webp",
        products: [
          {
            id: "bodycare-13",
            slug: "bar-soap",
            name: "Bar Soap",
            description: "Bar Soap adalah produk klasik yang praktis dan tahan lama. Cocok untuk brand yang menginginkan sabun multifungsi.",
            subDescription: "Dengan Coconut Oil, Palm Oil, Shea Butter, dan active ingredients Charcoal, Goat Milk, Coffee, atau Rice Extract.",
            category: "bodycare",
            cardImage: "/assets/produk/bodycare/card13-barsoap.webp",
            heroImages: {
              lands: "/assets/produk/bodycare/bg-lands-card13.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card13.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/bodycare/bg-lands-card13.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card13.jpeg"
            }
          }
        ]
      },
      {
        id: "massage-cream",
        label: "Massage Cream",
        tabImage: "/assets/images/Massage-Cream-1.webp",
        products: [
          {
            id: "bodycare-14",
            slug: "massage-cream",
            name: "Massage Cream",
            description: "Massage Cream adalah krim massage lembut yang memfasilitasi pijat, melembapkan kulit, dan memberikan efek relaksasi.",
            subDescription: "Dengan Shea Butter, Aloe Vera, Peppermint Oil, atau Ginger Extract.",
            category: "bodycare",
            cardImage: "/assets/produk/bodycare/card14-message-cream.webp",
            heroImages: {
              lands: "/assets/produk/bodycare/bg-lands-card14.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card14.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/bodycare/bg-lands-card14.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card14.jpeg"
            }
          }
        ]
      },
      {
        id: "soothing-gel",
        label: "Soothing Gel",
        tabImage: "/assets/images/body-butter-1.webp",
        products: [
          {
            id: "bodycare-15",
            slug: "soothing-gel",
            name: "Soothing Gel",
            description: "Soothing Gel adalah gel ringan yang menenangkan dan melembapkan kulit, cocok untuk kulit sensitif atau setelah terkena matahari.",
            subDescription: "Dengan Aloe Vera, Centella Asiatica, dan Chamomile. Cepat meresap dan tidak lengket.",
            category: "bodycare",
            cardImage: "/assets/produk/bodycare/card15-soothing-gel.webp",
            heroImages: {
              lands: "/assets/produk/bodycare/bg-landscard15.webp",
              ports: "/assets/produk/bodycare/bg-ports-card15.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/bodycare/bg-landscard15.webp",
              ports: "/assets/produk/bodycare/bg-ports-card15.jpeg"
            }
          }
        ]
      },
      {
        id: "neck-cream",
        label: "Neck Cream",
        tabImage: "/assets/images/body-butter-1.webp",
        products: [
          {
            id: "bodycare-16",
            slug: "neck-cream",
            name: "Neck Cream",
            description: "Neck Cream membantu menjaga kekencangan kulit leher dan menyamarkan garis halus.",
            subDescription: "Dengan formula khusus untuk area leher yang sensitif.",
            category: "bodycare",
            cardImage: "/assets/produk/bodycare/card16-neck-cream.webp",
            heroImages: {
              lands: "/assets/produk/bodycare/bg-lands-card16.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card16.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/bodycare/bg-lands-card16.jpeg",
              ports: "/assets/produk/bodycare/bg-ports-card16.jpeg"
            }
          }
        ]
      }
    ],
    faqs: [
      {
        question: "How long is the body care production process?",
        answer: "The production process takes about 1-2 months after the sample is approved and packaging design is completed."
      }
    ]
  },

  haircare: {
    slug: "haircare",
    name: "Hair Care",
    title: "Maklon Hair Care",
    subtitle: "Premium BPOM",
    description: "Dreamlab, a hair care toll manufacturing service that helps you create quality hair care products—a hassle-free business solution.",
    backgroundImage: "/assets/images/Hair-care.webp",
    heroImages: {
      lands: "/assets/produk/haircare/hero-lands.webp",
      ports: "/assets/produk/haircare/hero-ports.webp"
    },
    categories: [
      {
        id: "beard-serum",
        label: "Beard Serum",
        tabImage: "/assets/images/beard-serum-scaled.webp",
        products: [
          {
            id: "haircare-1",
            slug: "beard-serum",
            name: "Beard Serum",
            description: "Beard Serum membantu merawat dan pertumbuhan jenggot agar lebih tebal dan sehat. Melembapkan kulit, mencegah kekeringan.",
            subDescription: "Dengan Biotin, Argan Oil, dan Vitamin E. Formula ringan, cepat meresap, tidak lengket.",
            category: "haircare",
            cardImage: "/assets/produk/haircare/card1-beardserum.webp",
            heroImages: {
              lands: "/assets/produk/haircare/bg-lands-card1.jpeg",
              ports: "/assets/produk/haircare/bg-ports-card1.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/haircare/bg-lands-card1.jpeg",
              ports: "/assets/produk/haircare/bg-ports-card1.jpeg"
            }
          }
        ]
      },
      {
        id: "hair-gel",
        label: "Hair Gel",
        tabImage: "/assets/images/hair-gel-scaled.webp",
        products: [
          {
            id: "haircare-2",
            slug: "hair-gel",
            name: "Hair Gel",
            description: "Hair Gel adalah produk styling yang memberikan styling tahan lama tanpa membuat rambut kaku atau lengket.",
            subDescription: "Dengan Aloe Vera, Vitamin E, dan Panthenol. Warna, aroma, dan hold level bisa disesuaikan.",
            category: "haircare",
            cardImage: "/assets/produk/haircare/card2-hairgel.webp",
            heroImages: {
              lands: "/assets/produk/haircare/bg-lands-card2.jpeg",
              ports: "/assets/produk/haircare/bg-ports-card2.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/haircare/bg-lands-card2.jpeg",
              ports: "/assets/produk/haircare/bg-ports-card2.jpeg"
            }
          }
        ]
      },
      {
        id: "scalp-care",
        label: "Scalp Care",
        tabImage: "/assets/images/arrangement-natural-argan-oil-dropper-scaled.webp",
        products: [
          {
            id: "haircare-3",
            slug: "scalp-care",
            name: "Scalp Care",
            description: "Scalp Care adalah produk wajib untuk mengatasi ketombe dan mengontrol minyak kepala. Formula lembut dan aman digunakan harian.",
            subDescription: "Dengan Tea Tree Oil dan Salicylic Acid.",
            category: "haircare",
            cardImage: "/assets/produk/haircare/card3-scalp-care.webp",
            heroImages: {
              lands: "/assets/produk/haircare/bg-lands-card3.jpeg",
              ports: "/assets/produk/haircare/bg-ports-card3.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/haircare/bg-lands-card3.jpeg",
              ports: "/assets/produk/haircare/bg-ports-card3.jpeg"
            }
          }
        ]
      },
      {
        id: "shampoo",
        label: "Shampoo",
        tabImage: "/assets/images/shampoo-scaled.webp",
        products: [
          {
            id: "haircare-4",
            slug: "shampoo",
            name: "Shampoo",
            description: "Shampoo membersihkan dan merawat rambut dan kulit kepala, menjaga kesehatan, mengurangi ketombe, dan membuat rambut halus berkilau.",
            subDescription: "Dengan Argan Oil, Tea Tree Oil, dan Aloe Vera berkualitas tinggi.",
            category: "haircare",
            cardImage: "/assets/produk/haircare/card4-shampo.webp",
            heroImages: {
              lands: "/assets/produk/haircare/bg-lnads-card4.webp",
              ports: "/assets/produk/haircare/bg-ports-card4.webp"
            },
            bgImages: {
              lands: "/assets/produk/haircare/bg-lnads-card4.webp",
              ports: "/assets/produk/haircare/bg-ports-card4.webp"
            }
          }
        ]
      },
      {
        id: "hair-mask",
        label: "Hair Mask",
        tabImage: "/assets/images/hair-mask-1.webp",
        products: [
          {
            id: "haircare-5",
            slug: "hair-mask",
            name: "Hair Mask",
            description: "Intensive treatment untuk rambut rusak dan kering. Dirancang menembus batang rambut dan memberikan nutrisi mendalam.",
            subDescription: "Cocok untuk treatment mingguan. Membantu mengembalikan elastisitas dan kilau alami rambut.",
            category: "haircare",
            cardImage: "/assets/produk/haircare/card5-hairmask.webp",
            heroImages: {
              lands: "/assets/produk/haircare/bg-lands-card5.jpeg",
              ports: "/assets/produk/haircare/bg-ports-card5.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/haircare/bg-lands-card5.jpeg",
              ports: "/assets/produk/haircare/bg-ports-card5.jpeg"
            }
          }
        ]
      },
      {
        id: "pomade",
        label: "Pomade",
        tabImage: "/assets/images/pomade-1.webp",
        products: [
          {
            id: "haircare-6",
            slug: "pomade",
            name: "Pomade",
            description: "Produk styling rambut dengan berbagai level hold dan shine. Cocok untuk pasar pria modern.",
            subDescription: "Tersedia variant water-based yang mudah dibersihkan dan oil-based untuk ketahanan maksimal.",
            category: "haircare",
            cardImage: "/assets/produk/haircare/card6-pomade.webp",
            heroImages: {
              lands: "/assets/produk/haircare/bg-lands-card6.jpeg",
              ports: "/assets/produk/haircare/bg-ports-card6.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/haircare/bg-lands-card6.jpeg",
              ports: "/assets/produk/haircare/bg-ports-card6.jpeg"
            }
          }
        ]
      },
      {
        id: "hair-conditioner",
        label: "Hair Conditioner",
        tabImage: "/assets/images/hair-conditioner-scaled.webp",
        products: [
          {
            id: "haircare-7",
            slug: "hair-conditioner",
            name: "Hair Conditioner",
            description: "Memberikan kelembutan ekstra untuk rambut konsumen dengan conditioner kaya nutrisi. Formula mudah dibilas dan tidak membuat rambut layu.",
            subDescription: "Pilihan bahan aktif premium seperti keratin, argan oil, dan biotin untuk hasil maksimal.",
            category: "haircare",
            cardImage: "/assets/produk/haircare/card7-hair-conditioner.webp",
            heroImages: {
              lands: "/assets/produk/haircare/bg-lands-card7.jpeg",
              ports: "/assets/produk/haircare/bg-ports-card7.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/haircare/bg-lands-card7.jpeg",
              ports: "/assets/produk/haircare/bg-ports-card7.jpeg"
            }
          }
        ]
      }
    ],
    faqs: [
      {
        question: "How much is the MOQ for hair care toll manufacturing?",
        answer: "MOQ for hair care products at Dreamlab is very competitive, starting from 1000 pcs per variant depending on product type and packaging."
      },
      {
        question: "Is Dreamlab's hair care formula safe for sensitive scalps?",
        answer: "Yes, we provide hypoallergenic and sulfate-free formula options safe for sensitive scalps."
      },
      {
        question: "How long is the BPOM registration process for hair care products?",
        answer: "The BPOM registration process usually takes about 1-3 months after all documents and product samples are complete."
      }
    ]
  },

  babycare: {
    slug: "babycare",
    name: "Baby Care",
    title: "MAKLON BABY CARE BPOM & HALAL",
    subtitle: "DREAMLAB INDONESIA",
    description: "Baby care toll manufacturing service, a hassle-free dream product solution—with safe, dermatologically tested, and baby-friendly formulas.",
    backgroundImage: "/assets/images/baby-care.webp",
    heroImages: {
      lands: "/assets/produk/babycare/hero-lands.webp",
      ports: "/assets/produk/babycare/hero-ports.webp"
    },
    categories: [
      {
        id: "baby-essentials",
        label: "Baby Essentials",
        products: [
          {
            id: "babycare-1",
            slug: "shampoo-baby",
            name: "Shampoo Baby",
            description: "Formula lembut yang tidak pedih di mata, menjaga rambut bayi tetap bersih, halus, dan mudah disisir.",
            subDescription: "Baby shampoo dengan pH balanced dan bahan alami yang aman untuk kulit sensitif bayi.",
            category: "babycare",
            cardImage: "/assets/produk/babycare/card1-baby-shampoo.webp",
            heroImages: {
              lands: "/assets/produk/babycare/bg-lands-card1.jpeg",
              ports: "/assets/produk/babycare/bg-ports-card1.webp"
            },
            bgImages: {
              lands: "/assets/produk/babycare/bg-lands-card1.jpeg",
              ports: "/assets/produk/babycare/bg-ports-card1.webp"
            }
          },
          {
            id: "babycare-2",
            slug: "baby-oil",
            name: "Baby Oil",
            description: "Menjaga kelembapan kulit bayi agar tetap halus dan lembut, ideal untuk pijat bayi dan perawatan kulit kering.",
            subDescription: "Baby oil dengan bahan alami yang lembut dan aman untuk kulit bayi.",
            category: "babycare",
            cardImage: "/assets/produk/babycare/card2-babyoil.webp",
            heroImages: {
              lands: "/assets/produk/babycare/bg-lands-card2.jpeg",
              ports: "/assets/produk/babycare/bg-ports-card2.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/babycare/bg-lands-card2.jpeg",
              ports: "/assets/produk/babycare/bg-ports-card2.jpeg"
            }
          },
          {
            id: "babycare-3",
            slug: "moisturizer-cream",
            name: "Moisturizer Cream",
            description: "Krim pelembap untuk bayi yang menjaga kelembapan kulit sensitif dan melindungi dari kekeringan.",
            subDescription: "Dengan hypoallergenic formula yang lembut dan dermatologically tested.",
            category: "babycare",
            cardImage: "/assets/produk/babycare/card3-mois-cream.webp",
            heroImages: {
              lands: "/assets/produk/babycare/bg-lands-card3.jpeg",
              ports: "/assets/produk/babycare/bg-ports-card3.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/babycare/bg-lands-card3.jpeg",
              ports: "/assets/produk/babycare/bg-ports-card3.jpeg"
            }
          },
          {
            id: "babycare-4",
            slug: "baby-body-wash",
            name: "Baby Body Wash",
            description: "Membersihkan kulit bayi dengan lembut tanpa menyebabkan iritasi, menjaga pH kulit tetap seimbang.",
            subDescription: "Baby body wash dengan formula lembut yang tidak membuat kulit kering.",
            category: "babycare",
            cardImage: "/assets/produk/babycare/card4-baby-body-wash.webp",
            heroImages: {
              lands: "/assets/produk/babycare/bg-lands-card4.webp",
              ports: "/assets/produk/babycare/bg-ports-card4.webp"
            },
            bgImages: {
              lands: "/assets/produk/babycare/bg-lands-card4.webp",
              ports: "/assets/produk/babycare/bg-ports-card4.webp"
            }
          },
          {
            id: "babycare-5",
            slug: "baby-cologne",
            name: "Baby Cologne",
            description: "Aroma lembut yang menyegarkan untuk bayi sepanjang hari, memberikan kenyamanan dan keharuman khas bayi.",
            subDescription: "Baby cologne dengan alkohol rendah dan hypoallergenic.",
            category: "babycare",
            cardImage: "/assets/produk/babycare/card5-cologne.webp",
            heroImages: {
              lands: "/assets/produk/babycare/bg-lands-card5.jpeg",
              ports: "/assets/produk/babycare/bg-ports-card5.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/babycare/bg-lands-card5.jpeg",
              ports: "/assets/produk/babycare/bg-ports-card5.jpeg"
            }
          }
        ]
      }
    ],
    faqs: [
      {
        question: "Baby Care Toll Manufacturing Products at Dreamlab?",
        answer: "Dreamlab serves toll manufacturing for various baby care products such as lotion, body wash, shampoo, telon oil, baby oil, to diaper rash cream."
      },
      {
        question: "How much is the Baby Care Product MOQ at Dreamlab?",
        answer: "MOQ for baby care toll manufacturing at Dreamlab is very competitive, starting from 1000 - 3000 pcs depending on the type of product and packaging."
      },
      {
        question: "How long is the toll manufacturing production at Dreamlab?",
        answer: "The production process takes about 1-2 months after the sample is approved and packaging design is completed."
      },
      {
        question: "Does Dreamlab provide custom formulas?",
        answer: "Yes, we have an R&D team ready to help create unique and exclusive formulas for your brand."
      },
      {
        question: "Does Dreamlab.id help with the baby care product legality process?",
        answer: "Of course. We help process BPOM permits, Halal Certification, to HKI brand registration for your brand."
      },
      {
        question: "How much is the baby care toll manufacturing cost at Dreamlab?",
        answer: "Toll manufacturing costs are variable and can be adjusted with the budget and product specifications you want."
      },
      {
        question: "Where is Dreamlab located?",
        answer: "Dreamlab's headquarters and production facilities are located in a strategic area in East Java that is easily accessible."
      },
      {
        question: "Are the raw materials used really safe for babies?",
        answer: "We only use high-quality raw materials that have been tested for safety (hypoallergenic) and are friendly to sensitive baby skin."
      }
    ]
  },

  decorative: {
    slug: "decorative",
    name: "Decorative",
    title: "Maklon Dekoratif",
    subtitle: "Lengkap BPOM",
    description: "Jasa maklon kosmetik dekoratif terl lengkap, solusi produk impianmu tanpa ribet dengan formula premium, warna yang presisi, dan hasil akhir yang nyaman di kulit.",
    backgroundImage: "/assets/images/decorative-hero.webp",
    heroBgColor: "#F5EDE4",
    heroImages: {
      lands: "/assets/produk/decorative/hero-lands.webp",
      ports: "/assets/produk/decorative/hero-port.webp"
    },
    categories: [
      {
        id: "makeup",
        label: "Makeup",
        tabImage: "/assets/images/foundation-scaled.webp",
        products: [
          {
            id: "decorative-1",
            slug: "mascara",
            name: "Mascara",
            description: "Mascara adalah produk make-up penting yang membantu menebalkan dan memanjangkan bulu mata untuk tampilan mata yang lebih menarik dan ekspresif.",
            subDescription: "Formula tahan lama, mudah dibersihkan, dan aman untuk mata sensitif. Warna dan efek dapat disesuaikan.",
            category: "decorative",
            cardImage: "/assets/produk/decorative/card1-mascara.webp",
            heroImages: {
              lands: "/assets/produk/decorative/bg-lands-card1.jpeg",
              ports: "/assets/produk/decorative/bg-ports-card1.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/decorative/bg-lands-card1.jpeg",
              ports: "/assets/produk/decorative/bg-ports-card1.jpeg"
            }
          },
          {
            id: "decorative-2",
            slug: "cream-blush",
            name: "Cream Blush",
            description: "Cream Blush adalah produk makeup yang memberikan rona segar dan natural pada pipi dengan tekstur lembut dan mudah dibaurkan.",
            subDescription: "Formula ringan dan tahan lama, warna bisa disesuaikan sesuai brand.",
            category: "decorative",
            cardImage: "/assets/produk/decorative/card2-cream-blush.webp",
            heroImages: {
              lands: "/assets/produk/decorative/bg-landscard2.webp",
              ports: "/assets/produk/decorative/bg-ports-card2.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/decorative/bg-landscard2.webp",
              ports: "/assets/produk/decorative/bg-ports-card2.jpeg"
            }
          },
          {
            id: "decorative-3",
            slug: "liquid-highlighter",
            name: "Liquid Highlighter",
            description: "Liquid Highlighter adalah produk make-up fast-selling yang menciptakan efek glowing alami dan kilau sehat tanpa terlihat cakey.",
            subDescription: "Formula ringan, tahan lama, dan shimmer yang dapat disesuaikan 100% dengan tren brand.",
            category: "decorative",
            cardImage: "/assets/produk/decorative/card3-liquid-highlighter.webp",
            heroImages: {
              lands: "/assets/produk/decorative/bg-lands-card3.jpeg",
              ports: "/assets/produk/decorative/bg-ports-card3.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/decorative/bg-lands-card3.jpeg",
              ports: "/assets/produk/decorative/bg-ports-card3.jpeg"
            }
          },
          {
            id: "decorative-4",
            slug: "foundation",
            name: "Foundation",
            description: "Foundation adalah produk makeup dasar yang menyamarkan noda dan meratakan warna kulit untuk tampilan halus dan natural.",
            subDescription: "Formula ringan, tahan lama, dan berbagai pilihan warna sesuai brand.",
            category: "decorative",
            cardImage: "/assets/produk/decorative/card4-foundation.webp",
            heroImages: {
              lands: "/assets/produk/decorative/bg-lands-card4.webp",
              ports: "/assets/produk/decorative/bg-ports-card4.webp"
            },
            bgImages: {
              lands: "/assets/produk/decorative/bg-lands-card4.webp",
              ports: "/assets/produk/decorative/bg-ports-card4.webp"
            }
          },
          {
            id: "decorative-5",
            slug: "liquid-blush",
            name: "Liquid Blush",
            description: "Liquid Blush adalah produk makeup cair yang memberikan rona segar dan natural pada pipi dengan hasil akhir yang lembut dan tahan lama.",
            subDescription: "Formula ringan dan warna yang bisa disesuaikan sesuai konsep brand.",
            category: "decorative",
            cardImage: "/assets/produk/decorative/card5-liquid-blush.webp",
            heroImages: {
              lands: "/assets/produk/decorative/bg-lands-card5.jpeg",
              ports: "/assets/produk/decorative/bg-ports-card5.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/decorative/bg-lands-card5.jpeg",
              ports: "/assets/produk/decorative/bg-ports-card5.jpeg"
            }
          },
          {
            id: "decorative-6",
            slug: "eyebrow-gel",
            name: "Eyebrow Gel",
            description: "Eyebrow Gel adalah produk untuk merapikan dan menata alis dengan hasil natural dan tahan lama.",
            subDescription: "Formula ringan dan warna yang bisa disesuaikan sesuai konsep brand.",
            category: "decorative",
            cardImage: "/assets/produk/decorative/card6-eyebrow.webp",
            heroImages: {
              lands: "/assets/produk/decorative/bg-lands-card6.jpeg",
              ports: "/assets/produk/decorative/bg-ports-card6.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/decorative/bg-lands-card6.jpeg",
              ports: "/assets/produk/decorative/bg-ports-card6.jpeg"
            }
          },
          {
            id: "decorative-7",
            slug: "foundation-serum",
            name: "Foundation Serum",
            description: "Foundation Serum adalah produk makeup multifungsi yang menyatukan manfaat foundation dan serum, memberikan coverage ringan sekaligus nutritrisi kulit.",
            subDescription: "Formula ringan, melembapkan, dan tahan lama. Warna dan tekstur bisa disesuaikan.",
            category: "decorative",
            cardImage: "/assets/produk/decorative/card7-foundation.webp",
            heroImages: {
              lands: "/assets/produk/decorative/bg-lands-card7.jpeg",
              ports: "/assets/produk/decorative/bg-ports-card7.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/decorative/bg-lands-card7.jpeg",
              ports: "/assets/produk/decorative/bg-ports-card7.jpeg"
            }
          },
          {
            id: "decorative-8",
            slug: "bb-cream",
            name: "BB Cream",
            description: "BB Cream adalah produk multifungsi yang menyamarkan noda, melembapkan kulit, dan memberikan perlindungan ringan. Cocok untuk tampilan natural sehari-hari.",
            subDescription: "Formula ringan dan berbagai pilihan warna sesuai brand.",
            category: "decorative",
            cardImage: "/assets/produk/decorative/card8-bb-cream.webp",
            heroImages: {
              lands: "/assets/produk/decorative/bg-lands-card7.jpeg",
              ports: "/assets/produk/decorative/bg-ports-card7.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/decorative/bg-lands-card7.jpeg",
              ports: "/assets/produk/decorative/bg-ports-card7.jpeg"
            }
          },
          {
            id: "decorative-9",
            slug: "face-primer",
            name: "Face Primer",
            description: "Face Primer adalah produk dasar makeup yang membantu menyamarkan pori, meratakan tekstur kulit, dan membuat makeup lebih tahan lama.",
            subDescription: "Formula ringan dan nyaman, sesuai konsep brand.",
            category: "decorative",
            cardImage: "/assets/produk/decorative/card9-face-primer.webp",
            heroImages: {
              lands: "/assets/produk/decorative/bg-lands-card9.jpeg",
              ports: "/assets/produk/decorative/bg-ports-card9.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/decorative/bg-lands-card9.jpeg",
              ports: "/assets/produk/decorative/bg-ports-card9.jpeg"
            }
          }
        ]
      },
      {
        id: "lipcare",
        label: "Lipcare",
        tabImage: "/assets/images/LIP-CARE-1.webp",
        products: [
          {
            id: "decorative-10",
            slug: "lip-care",
            name: "Lip Care",
            description: "Lip Care adalah produk perawatan bibir yang melembapkan, melindungi, dan membuat bibir tampak sehat dan lembut.",
            subDescription: "Formula ringan dan bahan alami sesuai konsep brand.",
            category: "decorative",
            cardImage: "/assets/images/lip-care.webp",
            heroImages: {
              lands: "/assets/images/lip-care.webp",
              ports: "/assets/images/lip-care.webp"
            },
            bgImages: {
              lands: "/assets/images/lip-care.webp",
              ports: "/assets/images/lip-care.webp"
            }
          },
          {
            id: "decorative-11",
            slug: "lip-cream",
            name: "Lip Cream",
            description: "Lip Cream adalah produk makeup bibir dengan warna intens dan tekstur lembut yang tahan lama.",
            subDescription: "Formula ringan dan berbagai pilihan warna sesuai konsep brand.",
            category: "decorative",
            cardImage: "/assets/images/lip-cream.webp",
            heroImages: {
              lands: "/assets/images/lip-cream.webp",
              ports: "/assets/images/lip-cream.webp"
            },
            bgImages: {
              lands: "/assets/images/lip-cream.webp",
              ports: "/assets/images/lip-cream.webp"
            }
          },
          {
            id: "decorative-12",
            slug: "lip-serum",
            name: "Lip Serum (Oil Based)",
            description: "Lip Serum (Oil-Based) adalah perawatan bibir dengan formula minyak yang melembapkan, nutritrisi, dan membuat bibir tampak sehat dan berkilau alami.",
            subDescription: "Bahan berkualitas dan tekstur ringan sesuai konsep brand.",
            category: "decorative",
            cardImage: "/assets/images/lip-serum.webp",
            heroImages: {
              lands: "/assets/images/lip-serum.webp",
              ports: "/assets/images/lip-serum.webp"
            },
            bgImages: {
              lands: "/assets/images/lip-serum.webp",
              ports: "/assets/images/lip-serum.webp"
            }
          },
          {
            id: "decorative-13",
            slug: "lip-balm",
            name: "Lip Balm",
            description: "Lip Balm adalah produk perawatan bibir yang melembapkan dan melindungi bibir dari kekeringan serta pecah-pecah.",
            subDescription: "Formula lembut dan bahan alami sesuai konsep brand.",
            category: "decorative",
            cardImage: "/assets/images/lip-balm.webp",
            heroImages: {
              lands: "/assets/images/lip-balm.webp",
              ports: "/assets/images/lip-balm.webp"
            },
            bgImages: {
              lands: "/assets/images/lip-balm.webp",
              ports: "/assets/images/lip-balm.webp"
            }
          },
          {
            id: "decorative-14",
            slug: "tinted-lip-balm",
            name: "Tinted Lip Balm",
            description: "Tinted Lip Balm adalah produk perawatan bibir yang melembapkan sekaligus memberikan warna natural yang segar dan tahan lama.",
            subDescription: "Formula lembut dan berbagai pilihan warna sesuai konsep brand.",
            category: "decorative",
            cardImage: "/assets/images/tinted-lip-balm.webp",
            heroImages: {
              lands: "/assets/images/tinted-lip-balm.webp",
              ports: "/assets/images/tinted-lip-balm.webp"
            },
            bgImages: {
              lands: "/assets/images/tinted-lip-balm.webp",
              ports: "/assets/images/tinted-lip-balm.webp"
            }
          },
          {
            id: "decorative-15",
            slug: "lip-gloss",
            name: "Lip Gloss",
            description: "Lip Gloss adalah produk makeup bibir yang memberikan kilau cerah dan tampilan segar dengan tekstur ringan dan tahan lama.",
            subDescription: "Formula lembut dengan berbagai pilihan warna dan efek sesuai konsep brand.",
            category: "decorative",
            cardImage: "/assets/images/LIP-GLOSS.webp",
            heroImages: {
              lands: "/assets/images/LIP-GLOSS.webp",
              ports: "/assets/images/LIP-GLOSS.webp"
            },
            bgImages: {
              lands: "/assets/images/LIP-GLOSS.webp",
              ports: "/assets/images/LIP-GLOSS.webp"
            }
          },
          {
            id: "decorative-16",
            slug: "lip-scrub",
            name: "Lip Scrub",
            description: "Lip Scrub adalah produk exfoliasi lembut yang membantu mengangkat sel kulit mati dan membuat bibir terasa halus dan lembut.",
            subDescription: "Formula alami dan tekstur nyaman sesuai konsep brand.",
            category: "decorative",
            cardImage: "/assets/images/LIP-SCRUB.webp",
            heroImages: {
              lands: "/assets/images/LIP-SCRUB.webp",
              ports: "/assets/images/LIP-SCRUB.webp"
            },
            bgImages: {
              lands: "/assets/images/LIP-SCRUB.webp",
              ports: "/assets/images/LIP-SCRUB.webp"
            }
          },
          {
            id: "decorative-17",
            slug: "lip-matte",
            name: "Lip Matte",
            description: "Lip Matte adalah produk makeup bibir dengan hasil akhir matte yang tahan lama dan warna intens.",
            subDescription: "Formula ringan dan pilihan warna sesuai konsep brand.",
            category: "decorative",
            cardImage: "/assets/images/LIP-MATTE.webp",
            heroImages: {
              lands: "/assets/images/LIP-MATTE.webp",
              ports: "/assets/images/LIP-MATTE.webp"
            },
            bgImages: {
              lands: "/assets/images/LIP-MATTE.webp",
              ports: "/assets/images/LIP-MATTE.webp"
            }
          },
          {
            id: "decorative-18",
            slug: "lip-blush",
            name: "Lip Blush",
            description: "Lip Blush adalah produk makeup bibir dengan warna natural yang memberikan tampilan segar dan cerah sepanjang hari.",
            subDescription: "Formula ringan dan pilihan warna sesuai konsep brand.",
            category: "decorative",
            cardImage: "/assets/images/lip-blush.webp",
            heroImages: {
              lands: "/assets/images/lip-blush.webp",
              ports: "/assets/images/lip-blush.webp"
            },
            bgImages: {
              lands: "/assets/images/lip-blush.webp",
              ports: "/assets/images/lip-blush.webp"
            }
          }
        ]
      }
    ],
    faqs: [
      {
        question: "How much is the MOQ for decorative cosmetic toll manufacturing?",
        answer: "MOQ for decorative products starts from 2000 pcs per color variant, depending on the product type and packaging."
      },
      {
        question: "Can colors be customized as desired?",
        answer: "Of course. Our R&D team can do color matching according to the sample or color reference you provide."
      },
      {
        question: "Does Dreamlab provide special packaging for lipstick?",
        answer: "Yes, we have various exclusive packaging choices starting from standard lipstick tubes to premium lip cream bottles."
      }
    ]
  },

  parfum: {
    slug: "parfum",
    name: "Parfum",
    title: "Jasa Maklon Parfum & Body Mist",
    subtitle: "BPOM & HALAL Formula Eksklusif Anda",
    description: "Dreamlab menyediakan layanan maklon parfum lengkap tanpa repot urus produksi, legalitas, dan formulasi.",
    backgroundImage: "/assets/images/aromatic-perfume-bottles-background-scaled.webp",
    heroBgColor: "#EAD7CD",
    heroImages: {
      lands: "/assets/produk/parfum/bg-bodymist.webp",
      ports: "/assets/produk/parfum/bg-bodymist.webp"
    },
    categories: [
      {
        id: "perfume-collection",
        label: "Perfume Collection",
        products: [
          {
            id: "parfum-1",
            slug: "body-mist",
            name: "Body Mist",
            description: "Body Mist adalah tren tercepat di pasar parfum. Dengan formula ringan yang tidak meninggalkan noda dan aman di kulit.",
            subDescription: "Aroma premium dengan ribuan pilihan fragrance yang dapat disesuaikan 100% dengan konsep brand Anda.",
            category: "parfum",
            cardImage: "/assets/produk/parfum/card1_wcu.webp",
            heroImages: {
              lands: "/assets/produk/parfum/bg-bodymist.webp",
              ports: "/assets/produk/parfum/bg-bodymist.webp"
            },
            bgImages: {
              lands: "/assets/produk/parfum/bg-bodymist.webp",
              ports: "/assets/produk/parfum/bg-bodymist.webp"
            }
          },
          {
            id: "parfum-2",
            slug: "eau-de-cologne",
            name: "Eau de Cologne",
            description: "Ciptakan Eau de Cologne dengan aroma ringan, segar, dan elegan untuk pemakaian sehari-hari.",
            subDescription: "Cocok untuk brand yang menargetkan audiens muda dan dinamis.",
            category: "parfum",
            cardImage: "/assets/produk/parfum/card2-wcu.webp",
            heroImages: {
              lands: "/assets/produk/parfum/bg-cologne.webp",
              ports: "/assets/produk/parfum/bg-cologne.webp"
            },
            bgImages: {
              lands: "/assets/produk/parfum/bg-cologne.webp",
              ports: "/assets/produk/parfum/bg-cologne.webp"
            }
          },
          {
            id: "parfum-3",
            slug: "eau-de-toilette",
            name: "Eau de Toilette",
            description: "Maklon Parfum Eau de Toilette adalah pilihan ideal untuk brand Anda. Ciptakan aroma segar dan elegan.",
            subDescription: "Ketahanan sedang (3-5 jam), sempurna untuk pemakaian harian yang luas.",
            category: "parfum",
            cardImage: "/assets/produk/parfum/card3-wcu.webp",
            heroImages: {
              lands: "/assets/produk/parfum/bg-edt.webp",
              ports: "/assets/produk/parfum/bg-edt.webp"
            },
            bgImages: {
              lands: "/assets/produk/parfum/bg-edt.webp",
              ports: "/assets/produk/parfum/bg-edt.webp"
            }
          },
          {
            id: "parfum-4",
            slug: "eau-de-parfum",
            name: "Eau de Parfum",
            description: "Eau de Parfum adalah kategori parfum dengan aroma tahan lama dan intens—ideal untuk brand yang menargetkan segmen premium.",
            subDescription: "Fragrance oil pilihan grade A dan formula yang disesuaikan untuk ketahanan maksimal.",
            category: "parfum",
            cardImage: "/assets/produk/parfum/card4-wcu.webp",
            heroImages: {
              lands: "/assets/produk/parfum/bg-edp.webp",
              ports: "/assets/produk/parfum/bg-edp.webp"
            },
            bgImages: {
              lands: "/assets/produk/parfum/bg-edp.webp",
              ports: "/assets/produk/parfum/bg-edp.webp"
            }
          },
          {
            id: "parfum-5",
            slug: "minyak-atsiri",
            name: "Minyak Atsiri",
            description: "Minyak Atsiri adalah ekstrak alami dari tumbuhan yang digunakan untuk aromaterapi, perawatan kulit, dan berbagai produk wellness.",
            subDescription: "Kualitas tinggi dan variasi aroma yang sesuai konsep brand Anda.",
            category: "parfum",
            cardImage: "/assets/produk/parfum/bg-minyakatsiri.webp",
            heroImages: {
              lands: "/assets/produk/parfum/bg-minyakatsiri.webp",
              ports: "/assets/produk/parfum/bg-minyakatsiri.webp"
            },
            bgImages: {
              lands: "/assets/produk/parfum/bg-minyakatsiri.webp",
              ports: "/assets/produk/parfum/bg-minyakatsiri.webp"
            }
          },
          {
            id: "parfum-6",
            slug: "extrait-de-parfum",
            name: "Extrait de Parfum",
            description: "Extrait de Parfum adalah kategori parfum konsentrasi aroma tertinggi (20%-40%) yang memberikan wangi intens dan tahan lama.",
            subDescription: "Produk niche dengan margin keuntungan tertinggi. Fragrance oil premium dan pengujian stabilitas aroma yang ketat.",
            category: "parfum",
            cardImage: "/assets/produk/parfum/bg-extrait.webp",
            heroImages: {
              lands: "/assets/produk/parfum/bg-extrait.webp",
              ports: "/assets/produk/parfum/bg-extrait.webp"
            },
            bgImages: {
              lands: "/assets/produk/parfum/bg-extrait.webp",
              ports: "/assets/produk/parfum/bg-extrait.webp"
            }
          }
        ]
      }
    ],
    faqs: [
      {
        question: "Berapa MOQ untuk maklon parfum di Dreamlab?",
        answer: "MOQ untuk maklon parfum mulai dari 1000 - 3000 pcs per varian, tergantung pada jenis botol dan kemasan yang digunakan."
      },
      {
        question: "Apakah saya bisa request aroma khusus?",
        answer: "Tentu. Tim fragrance specialist kami dapat membantu meracik aroma eksklusif (signature scent) yang hanya dimiliki oleh brand Anda."
      },
      {
        question: "Apakah Dreamlab menyediakan pilihan botol parfum?",
        answer: "Ya, kami memiliki katalog botol parfum premium dengan berbagai bentuk dan ukuran, lengkap dengan pilihan tutup (cap) dan sprayer berkualitas."
      },
      {
        question: "Berapa lama daya tahan aroma parfum Dreamlab?",
        answer: "Daya tahan aroma bergantung pada konsentrasi (EDP, EDT, dll), namun secara umum produk kami dirancang untuk bertahan 6-12 jam."
      }
    ]
  },

  pkrt: {
    slug: "pkrt",
    name: "PKRT",
    title: "Maklon PKRT",
    subtitle: "Produk Kimia Rumah Tangga",
    description: "Jasa maklon produk kimia rumah tangga BPOM dan Halal. Wujudkan brand produk pembersih dan perawatan diri Anda.",
    backgroundImage: "/assets/images/Body-Care-1.webp",
    heroImages: {
      lands: "/assets/produk/pkrt/hero-landss.webp",
      ports: "/assets/produk/pkrt/hero-port.webp"
    },
    categories: [
      {
        id: "hand-sanitizer",
        label: "Hand Sanitizer",
        products: [
          {
            id: "pkrt-1",
            slug: "hand-sanitizer",
            name: "Hand Sanitizer",
            description: "Hand Sanitizer adalah produk pembersih tangan yang membunuh kuman dan bakteri tanpa perlu bilas dengan air.",
            subDescription: "Formula lembut, tidak lengket, dan mengandung pelembap agar tangan tidak kering.",
            category: "pkrt",
            cardImage: "/assets/produk/pkrt/card1-hand-s.webp",
            heroImages: {
              lands: "/assets/produk/pkrt/bg-lands-card1.jpeg",
              ports: "/assets/produk/pkrt/bg-ports-card1.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/pkrt/bg-lands-card1.jpeg",
              ports: "/assets/produk/pkrt/bg-ports-card1.jpeg"
            }
          }
        ]
      },
      {
        id: "hand-wash",
        label: "Hand Wash",
        products: [
          {
            id: "pkrt-2",
            slug: "hand-wash",
            name: "Hand Wash",
            description: "Hand Wash adalah sabun cair untuk mencuci tangan yang efektif membunuh kuman dan menjaga kebersihan.",
            subDescription: "Variant dengan berbagai aroma dan formula pelembap.",
            category: "pkrt",
            cardImage: "/assets/produk/pkrt/card2-handwash.webp",
            heroImages: {
              lands: "/assets/produk/pkrt/bg-lands-card2.jpeg",
              ports: "/assets/produk/pkrt/bg-ports-card2.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/pkrt/bg-lands-card2.jpeg",
              ports: "/assets/produk/pkrt/bg-ports-card2.jpeg"
            }
          }
        ]
      },
      {
        id: "herbal-soap",
        label: "Herbal Soap",
        products: [
          {
            id: "pkrt-3",
            slug: "herbal-soap",
            name: "Herbal Soap",
            description: "Herbal Soap adalah sabun dengan ekstrak herbal alami yang merawat kulit dan memberikan manfaat terapi.",
            subDescription: "Dengan ekstrak tanaman herbal seperti aloevera, teh hijau, lavender, atau jahe.",
            category: "pkrt",
            cardImage: "/assets/produk/pkrt/card3-herbalsoap.webp",
            heroImages: {
              lands: "/assets/produk/pkrt/bg-lands-card3.jpeg",
              ports: "/assets/produk/pkrt/bg-ports-card3.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/pkrt/bg-lands-card3.jpeg",
              ports: "/assets/produk/pkrt/bg-ports-card3.jpeg"
            }
          }
        ]
      },
      {
        id: "bar-soap-pkrt",
        label: "Bar Soap",
        products: [
          {
            id: "pkrt-4",
            slug: "bar-soap-pkrt",
            name: "Bar Soap",
            description: "Bar Soap adalah sabun batangan klasik yang praktis dan efektif untuk membersihkan tubuh.",
            subDescription: "Cocok untuk brand dengan konsep natural, tradisional, atau modern.",
            category: "pkrt",
            cardImage: "/assets/produk/pkrt/card4-barsoap.webp",
            heroImages: {
              lands: "/assets/produk/pkrt/bg-landss-card4.webp",
              ports: "/assets/produk/pkrt/bg-ports-card4.webp"
            },
            bgImages: {
              lands: "/assets/produk/pkrt/bg-landss-card4.webp",
              ports: "/assets/produk/pkrt/bg-ports-card4.webp"
            }
          }
        ]
      }
    ],
    faqs: [
      {
        question: "Berapa MOQ untuk maklon PKRT di Dreamlab?",
        answer: "MOQ untuk maklon PKRT mulai dari 1000 pcs per varian, tergantung pada jenis produk dan packaging."
      },
      {
        question: "Apakah produk PKRT Dreamlab sudah BPOM?",
        answer: "Ya, Dreamlab membantu proses BPOM untuk semua produk PKRT."
      }
    ]
  },

  footcare: {
    slug: "footcare",
    name: "Foot Care",
    title: "Jasa Maklon Perawatan Kaki",
    subtitle: "BPOM & HALAL Solusi Bisnis Kosmetik",
    description: "Wujudkan Brand Footcare Anda. Dreamlab menyediakan maklon perawatan kaki BPOM solusi bisnis kosmetik tanpa ribet.",
    backgroundImage: "/assets/images/maklon_produk_perawatankaki.webp",
    heroImages: {
      lands: "/assets/produk/footcare/hero-lands.webp",
      ports: "/assets/produk/footcare/hero-port.webp"
    },
    categories: [
      {
        id: "anti-bacterial",
        label: "Anti Bacterial",
        products: [
          {
            id: "footcare-1",
            slug: "anti-bacterial",
            name: "Anti Bacterial",
            description: "Produk perawatan kaki dengan formula antibakteri untuk mengatasi bau kaki dan menjaga kebersihan.",
            subDescription: "Efektif membunuh bakteri penyebab bau dan menjaga kaki tetap segar.",
            category: "footcare",
            cardImage: "/assets/produk/footcare/anti-bacterial.webp",
            heroImages: {
              lands: "/assets/produk/footcare/bg-lands-card1.jpeg",
              ports: "/assets/produk/footcare/bg-port-card1.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/footcare/bg-lands-card1.jpeg",
              ports: "/assets/produk/footcare/bg-port-card1.jpeg"
            }
          }
        ]
      },
      {
        id: "foot-mask",
        label: "Foot Mask",
        products: [
          {
            id: "footcare-2",
            slug: "foot-mask",
            name: "Foot Mask",
            description: "Foot Mask adalah masker khusus kaki yang membantu melembutkan, memutihkan, dan merawat kulit kaki.",
            subDescription: "Cocok untuk treatment mingguan agar kaki tetap halus dan terawat.",
            category: "footcare",
            cardImage: "/assets/produk/footcare/card2-footmask.webp",
            heroImages: {
              lands: "/assets/produk/footcare/bg-lands-card2.jpeg",
              ports: "/assets/produk/footcare/bg-port-card2.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/footcare/bg-lands-card2.jpeg",
              ports: "/assets/produk/footcare/bg-port-card2.jpeg"
            }
          }
        ]
      },
      {
        id: "foot-cream",
        label: "Foot Cream",
        products: [
          {
            id: "footcare-3",
            slug: "foot-cream",
            name: "Foot Cream",
            description: "Foot Cream adalah krim pelembap khusus kaki yang membantu melembutkan, menghaluskan, dan mengatasi kaki kering.",
            subDescription: "Mengandung bahan aktif seperti urea, shea butter, atau aloe vera.",
            category: "footcare",
            cardImage: "/assets/produk/footcare/card3-footcream.webp",
            heroImages: {
              lands: "/assets/produk/footcare/bg-lands-card3.jpeg",
              ports: "/assets/produk/footcare/bg-port-card3.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/footcare/bg-lands-card3.jpeg",
              ports: "/assets/produk/footcare/bg-port-card3.jpeg"
            }
          }
        ]
      },
      {
        id: "foot-spray",
        label: "Foot Spray",
        products: [
          {
            id: "footcare-4",
            slug: "foot-spray",
            name: "Foot Spray",
            description: "Foot Spray adalah semprotan untuk kaki yang memberikan kesegaran, membantu mengatasi bau, dan menjaga kelembapan.",
            subDescription: "Praktis digunakan kapan saja untuk kaki segar sepanjang hari.",
            category: "footcare",
            cardImage: "/assets/produk/footcare/card4-footspray.webp",
            heroImages: {
              lands: "/assets/produk/footcare/bg-lands-card4.webp",
              ports: "/assets/produk/footcare/bg-port-card4.webp"
            },
            bgImages: {
              lands: "/assets/produk/footcare/bg-lands-card4.webp",
              ports: "/assets/produk/footcare/bg-port-card4.webp"
            }
          }
        ]
      },
      {
        id: "foot-scrub",
        label: "Foot Scrub",
        products: [
          {
            id: "footcare-5",
            slug: "foot-scrub",
            name: "Foot Scrub",
            description: "Foot Scrub adalah produk exfoliasi khusus kaki yang mengangkat sel kulit mati dan membuat kaki halus.",
            subDescription: "Cocok untuk treatment mingguan agar kaki tetap lembut dan terawat.",
            category: "footcare",
            cardImage: "/assets/produk/footcare/card5-foot-scrub.webp",
            heroImages: {
              lands: "/assets/produk/footcare/bg-lands-card5.jpeg",
              ports: "/assets/produk/footcare/bg-ports-card5.jpeg"
            },
            bgImages: {
              lands: "/assets/produk/footcare/bg-lands-card5.jpeg",
              ports: "/assets/produk/footcare/bg-ports-card5.jpeg"
            }
          }
        ]
      }
    ],
    faqs: [
      {
        question: "Produk maklon Foot Care apa saja yang tersedia?",
        answer: "Kami melayani maklon Foot Cream, Foot Spray, Foot Mask, hingga Foot Scrub dengan berbagai pilihan formula premium."
      },
      {
        question: "Berapa MOQ untuk maklon footcare?",
        answer: "MOQ untuk maklon perawatan kaki mulai dari 1000 - 3000 pcs per varian, tergantung pada jenis kemasan yang dipilih."
      }
    ]
  }
};