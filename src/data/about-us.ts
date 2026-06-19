export const aboutData = {
  hero: {
    title: "Wujudkan Brand Kosmetik dalam 3 Bulan",
    subtitle: "Dari Ide Sampai Siap Jual",
    description: "Formulasi eksklusif, produksi bersertifikat CPKB, BPOM & Halal diurus. Satu partner, semua beres.",
    ctaText: "Konsultasi Gratis Sekarang",
    ctaLink: "Hi Dreamlab, saya ingin konsultasi membuat brand kosmetik",
    backgroundImage: "/assets/images/about-hero-bg.webp",
    productImage: "/assets/images/PrdSunscreenfront.webp",
    trustBadges: [
      { icon: "shield", label: "Sertifikasi CPKB Grade A" },
      { icon: "check", label: "BPOM & Halal Terjamin" },
      { icon: "users", label: "150+ Brand Partner" },
      { icon: "heart", label: "After-Sales Support" }
    ]
  },
  authority: {
    headline: "Kenali Dreamlab. Lebih Dalam.",
    subheadline: "Pabrik aseptik tersertifikasi, apoteker berlisensi, dan jaminan legalitas lengkap.",
    ctaText: "Lihat Selengkapnya",
    ctaLink: "/services",
    badge: {
      text: "CPKB",
      subtext: "GRADE A"
    },
    images: [
      "/new%20asset/people/17.webp",
      "/new asset/people/Busdev-dreamlab.png",
      "/new%20asset/people/20.webp"
    ],
    points: [
      {
        id: 1,
        title: "Sertifikasi CPKB Golongan A",
        description: "No. CPKB/2023/18260-A — Standar kebersihan selevel internasional untuk produksi kosmetik.",
        certNo: "CPKB/2023/18260-A",
        icon: "shield"
      },
      {
        id: 2,
        title: "Izin Edar Resmi BPOM RI",
        description: "Verifikasi server BPOM aktif — setiap produk terdaftar dan legal secara hukum.",
        certNo: "Verifikasi BPOM Aktif",
        icon: "check"
      }
    ],
    additionalCerts: [
      { label: "Halal MUI", certNo: "ID00410000219461221" },
      { label: "STRA Apoteker", certNo: "1991/STRA-Apoteker/1827361" },
      { label: "HKI Kemenkumham", certNo: "Terverifikasi" }
    ]
  },
  afterSales: {
    headline: "KAMI TIDAK TINGGALKAN SETELAH PRODUK JADI.",
    subheadline: "Komitmen kualitas berkelanjutan dengan harga produksi kompetitif — karena brand Anda adalah bisnis jangka panjang.",
    ctaText: "Pelajari After-Sales Kami",
    ctaLink: "Hi Dreamlab, saya ingin tahu lebih lanjut tentang after-sales support",
    badge: {
      text: "QUALITY",
      subtext: "GUARANTEED"
    },
    images: [
      "/new%20asset/people/dsc00997.webp",
      "/new%20asset/people/dsc01435.webp"
    ],
    points: [
      {
        id: 1,
        title: "Garansi Konsistensi Batch-to-Batch",
        description: "Kualitas setiap produksi tetap sama — formula, tekstur, dan performa tidak berubah dari batch pertama hingga seterusnya.",
        icon: "refresh"
      },
      {
        id: 2,
        title: "Dukungan Reformulasi Gratis",
        description: "Produk perlu penyesuaian berdasarkan feedback pasar? Tim R&D kami siap bantu tanpa biaya tambahan.",
        icon: "flask"
      }
    ],
    benefits: [
      { label: "Harga Produksi Kompetitif", desc: "Margin maksimal untuk brand owner" },
      { label: "Konsultasi Pasca-Produksi", desc: "Tim R&D tetap tersedia setelah launching" },
      { label: "Quality Control Ketat", desc: "Setiap batch melewati uji stabilitas" }
    ]
  },
  services: {
    headline: "PROSES SIMPEL. HASIL MAKSIMAL.",
    subheadline: "Empat langkah mudah dari konsultasi hingga produk siap jual.",
    cards: [
      {
        id: 1,
        step: "01",
        title: "Konsultasi & Ideasi",
        description: "Diskusi konsep brand, target pasar, dan jenis produk yang sesuai dengan visi Anda."
      },
      {
        id: 2,
        step: "02",
        title: "Riset & Formulasi",
        description: "Tim apoteker meracik formula eksklusif dengan bahan aktif berkualitas tinggi."
      },
      {
        id: 3,
        step: "03",
        title: "Produksi & Legalitas",
        description: "Produksi massal di pabrik CPKB Grade A + pengurusan BPOM & Halal secara bersamaan."
      },
      {
        id: 4,
        step: "04",
        title: "After-Sales Support",
        description: "Dukungan berkelanjutan pasca-launching: reformulasi, konsultasi, dan quality assurance."
      }
    ]
  },
  partnerLogos: [
    { name: "Tazzi", path: "/assets/images/Tazzi-300x300.webp" },
    { name: "Sense Soul", path: "/assets/images/Sense-Soul-300x300.webp" },
    { name: "Jilly Daily", path: "/assets/images/Jilly-Daily-300x300.webp" },
    { name: "Labbol", path: "/assets/images/Labbol-300x300.webp" },
    { name: "Itnob", path: "/assets/images/Itnob-300x300.webp" },
    { name: "Bebiboster", path: "/assets/images/Bebiboster-300x300.webp" }
  ],
  cta: {
    headline: "MULAI BANGUN BRAND ANDA SEKARANG.",
    subheadline: "Pilih langkah konkrit menuju dominasi pasar kecantikan.",
    actions: [
      { id: 1, title: "Request Sampel Formula Gratis", icon: "beaker", link: "Hi Dreamlab, saya tertarik request sampel formula skincare" },
      { id: 2, title: "Jadwalkan Kunjungan Pabrik", icon: "mapPin", link: "https://maps.google.com/?q=SIER+Surabaya" },
      { id: 3, title: "Konsultasi R&D Bersama Apoteker", icon: "messageSquare", link: "Hi Dreamlab, saya ingin berkonsultasi teknis dengan tim R&D apoteker Dreamlab" }
    ]
  }
};

export type AboutData = typeof aboutData;
