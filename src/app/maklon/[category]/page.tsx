import { notFound } from "next/navigation";
import { getProductDataV2 } from "@/data/products-v2";
import { getCategoryTitle, getCategoryMetaDescription } from "@/data/keywords";
import { getMaklonPage, getMaklonPageTitle, getMaklonPageDescription, maklonPages, type MaklonPageConfig } from "@/data/maklon-pages";
import { ProductPageV2 } from "@/components/ProductPageV2";
import ProductFAQ from "@/components/ProductPageV2/ProductFAQ";
import CtaSection from "@/components/CtaSection";
import Image from "next/image";
import JsonLd from "@/components/JsonLd";

// ═══════════════════════════════════════════════════════════════
// SEO CONTENT GENERATOR — Produces 800+ words of unique content
// per maklon page using existing page data (name, features, etc.)
// ═══════════════════════════════════════════════════════════════
function generateSeoContent(page: MaklonPageConfig): Array<{ title: string; paragraphs: string[] }> {
  const cat = page.category || "Produk";
  const name = pageNameToTitle(page.pageName);
  const productList = page.productTypes?.join(", ") || cat;
  const featureList = page.features?.join(", ") || "kualitas terjamin";
  const certList = page.certifications?.join(", ") || "BPOM, Halal, CPKB Grade A";

  return [
    {
      title: `Pendahuluan: Industri ${cat} di Indonesia`,
      paragraphs: [
        `Industri ${cat.toLowerCase()} di Indonesia terus mengalami pertumbuhan yang signifikan dalam beberapa tahun terakhir. Meningkatnya kesadaran masyarakat akan pentingnya perawatan diri dan kecantikan telah mendorong permintaan akan produk ${cat.toLowerCase()} berkualitas tinggi. Hal ini membuka peluang besar bagi para pengusaha dan brand owner untuk memulai atau mengembangkan bisnis ${cat.toLowerCase()} mereka sendiri.`,
        `Dreamlab hadir sebagai solusi maklon ${cat.toLowerCase()} terpercaya yang telah membantu lebih dari 500 brand dalam mewujudkan produk impian mereka. Dengan pengalaman bertahun-tahun di industri manufaktur kosmetik, kami memahami betul apa yang dibutuhkan untuk menciptakan produk ${cat.toLowerCase()} yang kompetitif dan disukai pasar.`,
        `Artikel ini akan membahas secara mendalam tentang layanan ${name.toLowerCase()}, manfaatnya untuk bisnis Anda, serta mengapa memilih Dreamlab sebagai mitra produksi adalah keputusan yang tepat.`
      ]
    },
    {
      title: `Apa Itu ${name}?`,
      paragraphs: [
        `${name} adalah layanan jasa maklon produk ${cat.toLowerCase()} yang ditawarkan oleh Dreamlab, perusahaan manufaktur kosmetik berstandar CPKB Grade A di Surabaya. Kami menyediakan layanan produksi berbagai jenis produk ${cat.toLowerCase()}, termasuk ${productList}.`,
        `Setiap produk yang diproduksi melalui layanan ${name.toLowerCase()} diformulasikan oleh tim Research & Development (R&D) kami yang berpengalaman. Kami menggunakan bahan aktif berkualitas tinggi dengan konsentrasi yang tepat untuk memastikan efektivitas produk. Tim R&D kami selalu mengikuti perkembangan tren dan inovasi terbaru di industri kecantikan global.`,
        `Keunggulan utama dari layanan ini adalah fleksibilitas formula. Anda dapat mengkustomisasi formula sesuai dengan kebutuhan brand, mulai dari pemilihan bahan aktif, aroma, tekstur, hingga warna produk. Kami juga menyediakan layanan free custom formula bagi klien yang membutuhkan formulasi eksklusif.`
      ]
    },
    {
      title: `Manfaat ${name} untuk Bisnis Anda`,
      paragraphs: [
        `Memulai bisnis ${cat.toLowerCase()} dengan sistem maklon memberikan banyak keuntungan dibandingkan harus membangun pabrik sendiri. Pertama, Anda tidak perlu mengeluarkan investasi besar untuk mesin produksi dan fasilitas manufaktur. Kedua, Anda bisa fokus pada pengembangan brand, pemasaran, dan penjualan sementara proses produksi ditangani oleh ahlinya.`,
        `Beberapa manfaat utama menggunakan layanan ${name.toLowerCase()} di Dreamlab:`,
        `✓ **Biaya produksi efisien** — Dengan sistem maklon, Anda hanya membayar untuk produk yang diproduksi. Tidak ada biaya overhead pabrik yang memberatkan.\n✓ **MOQ fleksibel** — Kami menawarkan minimum order quantity yang terjangkau, mulai dari 500 pcs. Ini memungkinkan brand pemula untuk memulai dengan skala kecil.\n✓ **Waktu produksi cepat** — Dengan sistem produksi yang terstandarisasi, lead time produksi kami hanya 45-60 hari kerja.\n✓ **Sertifikasi lengkap** — Setiap produk dilengkapi dengan izin BPOM, sertifikat Halal, dan diproduksi di fasilitas CPKB Grade A.`
      ]
    },
    {
      title: `Pilihan Produk ${name}`,
      paragraphs: [
        `Kami menawarkan berbagai pilihan produk dalam layanan ${name.toLowerCase()}. Berikut adalah tipe produk yang dapat Anda produksi:`,
        page.productTypes?.map((t, i) => `${i + 1}. **${t}** — Diformulasikan dengan bahan aktif pilihan dan standar kualitas tertinggi. Tersedia dalam berbagai varian sesuai kebutuhan brand Anda.`).join("\n") || `Kami menyediakan berbagai varian produk ${cat.toLowerCase()} yang dapat disesuaikan dengan kebutuhan brand Anda.`
      ]
    },
    {
      title: `Mengapa Memilih Dreamlab untuk ${name}?`,
      paragraphs: [
        `Dreamlab bukan sekadar pabrik maklon biasa. Kami adalah mitra strategis yang berkomitmen untuk membantu brand Anda sukses di pasar ${cat.toLowerCase()} Indonesia yang kompetitif. Berikut adalah alasan mengapa lebih dari 500 brand mempercayakan produksi mereka kepada Dreamlab:`,
        `**Pengalaman & Keahlian —** Dengan pengalaman bertahun-tahun di industri manufaktur kosmetik, tim Dreamlab memiliki pemahaman mendalam tentang formulasi, regulasi, dan tren pasar. Kami telah membantu berbagai brand, dari pemula hingga established brand, dalam menciptakan produk yang sukses di pasar.\n\n**Fasilitas CPKB Grade A —** Pabrik kami bersertifikat CPKB Grade A, standar tertinggi untuk fasilitas produksi kosmetik di Indonesia. Ini menjamin bahwa setiap produk diproduksi dalam lingkungan yang bersih, steril, dan terkontrol.\n\n**Sertifikasi Lengkap —** Kami mengurus seluruh perizinan, termasuk BPOM dan Halal. Anda tidak perlu repot mengurus birokrasi yang rumit.\n\n**Tim R&D Profesional —** Tim Research & Development kami selalu siap mengembangkan formula eksklusif sesuai dengan brief brand Anda. Kami juga terus melakukan riset untuk menghadirkan inovasi terbaru.`,
        `Dengan memilih Dreamlab, Anda tidak hanya mendapatkan produk berkualitas, tetapi juga partner bisnis yang peduli dengan kesuksesan brand Anda.`
      ]
    },
    {
      title: `Sertifikasi & Jaminan Kualitas ${name}`,
      paragraphs: [
        `Kualitas adalah prioritas utama kami. Setiap produk yang diproduksi melalui layanan ${name.toLowerCase()} melalui serangkaian quality control yang ketat:`,
        `✅ **BPOM** — Semua produk terdaftar di Badan Pengawas Obat dan Makanan, menjamin keamanan dan kelayakan edar.\n✅ **Halal MUI** — Sertifikasi halal dari Majelis Ulama Indonesia, memberikan ketenangan bagi konsumen Muslim.\n✅ **CPKB Grade A** — Fasilitas produksi dengan standar Cara Pembuatan Kosmetik yang Baik (CPKB) Grade A.\n✅ **Uji Klinis** — Produk diuji secara klinis untuk memastikan keamanan dan efektivitas.\n✅ **Uji Stabilitas** — Setiap formula diuji stabilitasnya untuk memastikan kualitas produk terjaga selama masa simpan.`,
        `Komitmen kami terhadap kualitas telah membuat Dreamlab dipercaya oleh berbagai brand ternama di Indonesia.`
      ]
    },
    {
      title: `Cara Memulai ${name} di Dreamlab`,
      paragraphs: [
        `Memulai produksi ${cat.toLowerCase()} dengan Dreamlab sangat mudah. Berikut adalah langkah-langkahnya:`,
        `1. **Konsultasi Gratis** — Hubungi tim Dreamlab untuk konsultasi gratis mengenai produk yang ingin Anda buat. Diskusikan visi, target pasar, dan kebutuhan brand Anda.\n\n2. **Pengembangan Formula** — Tim R&D kami akan mengembangkan formula sesuai brief Anda. Kami menyediakan free custom formula untuk klien baru.\n\n3. **Produksi** — Setelah formula disetujui, kami akan memproses produksi dengan standar kualitas tertinggi di fasilitas CPKB Grade A.\n\n4. **Pengurusan Izin** — Kami mengurus perizinan BPOM dan Halal untuk produk Anda.\n\n5. **Pengiriman** — Produk jadi dikirim ke alamat Anda, siap untuk dipasarkan.`,
        `Tunggu apa lagi? Wujudkan brand ${cat.toLowerCase()} impian Anda bersama Dreamlab. Hubungi kami sekarang untuk konsultasi gratis!`
      ]
    }
  ];
}

function pageNameToTitle(name: string): string {
  // Convert "MAKLON DAY & NIGHT CREAM" → "Maklon Day & Night Cream"
  return name
    .toLowerCase()
    .replace(/\bmaklon\b/gi, "Maklon")
    .replace(/\b(?:bpom|halal|cpkb|moq|spf|r&d)\b/gi, m => m.toUpperCase())
    .replace(/\b\w/g, c => c.toUpperCase());
}

type Props = {
  params: Promise<{ category: string }>;
};

const maklonCategoryMap: Record<string, { categorySlug: string; subCategorySlug?: string; productSlug?: string }> = {
  // Skincare
  "day-night-cream": { categorySlug: "skincare", subCategorySlug: "day-night-cream" },
  "masker-wajah": { categorySlug: "skincare", subCategorySlug: "face-mask" },
  "sunscreen": { categorySlug: "skincare", subCategorySlug: "sunscreen" },
  "cleansing-series": { categorySlug: "skincare", subCategorySlug: "cleansing" },
  "facial-wash": { categorySlug: "skincare", subCategorySlug: "facial-wash" },
  "facial-toner": { categorySlug: "skincare", subCategorySlug: "facial-toner" },
  "serum-wajah": { categorySlug: "skincare", subCategorySlug: "facial-serum" },
  // Body Care
  "massage-oil": { categorySlug: "bodycare", productSlug: "massage-oil" },
  "body-butter": { categorySlug: "bodycare", productSlug: "body-butter" },
  "body-scrub": { categorySlug: "bodycare", productSlug: "body-scrub" },
  "anti-bacterial-soap": { categorySlug: "bodycare", productSlug: "anti-bacterial-soap" },
  "shower-gel": { categorySlug: "bodycare", productSlug: "shower-gel" },
  "bath-salt": { categorySlug: "bodycare", productSlug: "bath-salt" },
  "sabun-organik": { categorySlug: "bodycare", productSlug: "sabun-organik" },
  "body-serum": { categorySlug: "bodycare", productSlug: "body-serum" },
  "sabun-transparan": { categorySlug: "bodycare", productSlug: "sabun-transparan" },
  "sabun-whitening": { categorySlug: "bodycare", productSlug: "sabun-whitening" },
  "sabun-batang": { categorySlug: "bodycare", productSlug: "sabun-batang" },
  "massage-cream": { categorySlug: "bodycare", productSlug: "massage-cream" },
  "soothing-gel": { categorySlug: "bodycare", productSlug: "soothing-gel" },
  "neck-cream": { categorySlug: "bodycare", productSlug: "neck-cream" },
  // Baby Care
  "baby-2in1-wash": { categorySlug: "babycare", productSlug: "baby-2in1-wash" },
  "baby-moisturizer": { categorySlug: "babycare", productSlug: "baby-moisturizer" },
  "baby-shampoo": { categorySlug: "babycare", productSlug: "baby-shampoo" },
  "baby-cologne": { categorySlug: "babycare", productSlug: "baby-cologne" },
  // Foot Care
  "foot-cream": { categorySlug: "footcare", productSlug: "foot-cream" },
  "foot-scrub": { categorySlug: "footcare", productSlug: "foot-scrub" },
  "foot-spray": { categorySlug: "footcare", productSlug: "foot-spray" },
  "foot-soak": { categorySlug: "footcare", productSlug: "foot-soak" },
  "foot-serum": { categorySlug: "footcare", productSlug: "foot-serum" },
  // Hair Care
  "shampoo": { categorySlug: "haircare", productSlug: "shampoo" },
  "hair-conditioner": { categorySlug: "haircare", productSlug: "hair-conditioner" },
  "hair-mask": { categorySlug: "haircare", productSlug: "hair-mask" },
  "hair-tonic": { categorySlug: "haircare", productSlug: "hair-tonic" },
  "hair-gel": { categorySlug: "haircare", productSlug: "hair-gel" },
  "pomade": { categorySlug: "haircare", productSlug: "pomade" },
  "scalp-care": { categorySlug: "haircare", productSlug: "scalp-care" },
  "beard-serum": { categorySlug: "haircare", productSlug: "beard-serum" },
  // Parfum
  "body-mist": { categorySlug: "parfum", productSlug: "body-mist" },
  "eau-de-cologne": { categorySlug: "parfum", productSlug: "eau-de-cologne" },
  "eau-de-toilette": { categorySlug: "parfum", productSlug: "eau-de-toilette" },
  "eau-de-parfum": { categorySlug: "parfum", productSlug: "eau-de-parfum" },
  "extrait-de-parfum": { categorySlug: "parfum", productSlug: "extrait-de-parfum" },
  "minyak-atsiri": { categorySlug: "parfum", productSlug: "minyak-atsiri" },
  // Decorative Makeup
  "highlighter": { categorySlug: "decorative", productSlug: "highlighter" },
  "mascara": { categorySlug: "decorative", productSlug: "mascara" },
  "cream-blush": { categorySlug: "decorative", productSlug: "cream-blush" },
  "foundation-serum": { categorySlug: "decorative", productSlug: "foundation-serum" },
  "liquid-blush": { categorySlug: "decorative", productSlug: "liquid-blush" },
  "eyebrow-gel": { categorySlug: "decorative", productSlug: "eyebrow-gel" },
  "foundation": { categorySlug: "decorative", productSlug: "foundation" },
  "bb-cream": { categorySlug: "decorative", productSlug: "bb-cream" },
  "face-primer": { categorySlug: "decorative", productSlug: "face-primer" },
  // Lip Care
  "lip-cream": { categorySlug: "decorative", subCategorySlug: "lip-care", productSlug: "lip-cream" },
  "lip-serum": { categorySlug: "decorative", subCategorySlug: "lip-care", productSlug: "lip-serum" },
  "lip-balm": { categorySlug: "decorative", subCategorySlug: "lip-care", productSlug: "lip-balm" },
  "tinted-lip-balm": { categorySlug: "decorative", subCategorySlug: "lip-care", productSlug: "tinted-lip-balm" },
  "lip-gloss": { categorySlug: "decorative", subCategorySlug: "lip-care", productSlug: "lip-gloss" },
  "lip-scrub": { categorySlug: "decorative", subCategorySlug: "lip-care", productSlug: "lip-scrub" },
  "lip-matte": { categorySlug: "decorative", subCategorySlug: "lip-care", productSlug: "lip-matte" },
  "lip-blush": { categorySlug: "decorative", subCategorySlug: "lip-care", productSlug: "lip-blush" },
};

export default async function MaklonCategoryPage({ params }: Props) {
  const { category } = await params;
  const data = getProductDataV2(category);

  if (data) {
    return <ProductPageV2 data={data} />;
  }

  const maklonPage = getMaklonPage(category);
  if (!maklonPage) notFound();

  const mapped = maklonCategoryMap[category];
  const pageName = maklonPage.pageName;

  // Build schema for maklon page
  const maklonSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://dreamlab.id/#organization',
        name: 'Dreamlab Indonesia',
        url: 'https://dreamlab.id/',
      },
      {
        '@type': 'Service',
        '@id': `https://dreamlab.id/maklon/${category}/#service`,
        name: `Jasa Maklon ${pageName}`,
        description: maklonPage.description,
        provider: { '@id': 'https://dreamlab.id/#organization' },
        serviceType: 'Kontrak Manufaktur Kosmetik',
        areaServed: 'Indonesia',
        offers: {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: `Maklon ${pageName}`,
          },
        },
        ...(maklonPage.certifications ? {
          hasCertification: maklonPage.certifications.map((c: string) => ({
            '@type': 'Certification',
            name: c,
          })),
        } : {}),
      },
      {
        '@type': 'WebPage',
        '@id': `https://dreamlab.id/maklon/${category}/#webpage`,
        url: `https://dreamlab.id/maklon/${category}/`,
        name: `Jasa Maklon ${pageName} BPOM & Halal | Dreamlab`,
        description: maklonPage.description,
        isPartOf: { '@id': 'https://dreamlab.id/#website' },
        breadcrumb: { '@id': `https://dreamlab.id/maklon/${category}/#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://dreamlab.id/maklon/${category}/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dreamlab.id/' },
          { '@type': 'ListItem', position: 2, name: `Maklon ${pageName}` },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <JsonLd data={maklonSchema} />
      <section className="relative bg-gradient-to-b from-[#FDF8F3] to-white pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-onest text-[#1A1A1A] leading-tight">
            {pageName}
          </h1>
          <p className="mt-4 text-base md:text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            {maklonPage.description}
          </p>
        </div>
      </section>

      {/* SEO Content Sections — rendered from maklonPage.sections data */}
      {maklonPage.sections && maklonPage.sections.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
              {maklonPage.sections.map((section, i) => {
                switch (section.type) {
                  case 'header':
                    return (
                      <div key={i}>
                        <h2 className="text-2xl md:text-3xl font-bold font-onest text-[#1A1A1A] mb-6">
                          {section.content}
                        </h2>
                      </div>
                    );
                  case 'product':
                    return (
                      <div key={i} className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                        <p>{section.content}</p>
                      </div>
                    );
                  case 'kemasan':
                    return (
                      <div key={i} className="bg-gradient-to-br from-[#FDF8F3] to-white rounded-2xl p-8 border border-gray-100">
                        <h3 className="text-xl font-bold text-[#1A1A1A] mb-4 flex items-center gap-3">
                          <svg className="w-6 h-6 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          Opsi Kemasan
                        </h3>
                        <p className="text-gray-600 leading-relaxed">{section.content}</p>
                      </div>
                    );
                  default:
                    return (
                      <div key={i} className="text-gray-600 leading-relaxed">
                        <p>{section.content}</p>
                      </div>
                    );
                }
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* SEO CONTENT — 800+ words unique per page */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white" id="seo-content">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            {generateSeoContent(maklonPage).map((section, i) => (
              <div key={i} className="mb-16 last:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold font-onest text-[#1A1A1A] mb-8 leading-tight">
                  {section.title}
                </h2>
                <div className="space-y-6">
                  {section.paragraphs.map((para, j) => (
                    <div key={j} className="text-gray-600 leading-relaxed text-base md:text-lg [&_strong]:text-[#1A1A1A] [&_strong]:font-semibold whitespace-pre-line">
                      <p>{para}</p>
                    </div>
                  ))}
                </div>
                {i < generateSeoContent(maklonPage).length - 1 && (
                  <div className="mt-12 border-t border-gray-100" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features & Product Types Grid */}
      {maklonPage.features && maklonPage.features.length > 0 && (
        <section className="py-12 bg-[#FAFAFA]">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8">
            <h2 className="text-2xl md:text-3xl font-bold font-onest text-[#1A1A1A] text-center mb-10">
              Keunggulan Layanan Maklon {maklonPage.category || "Kami"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {maklonPage.features.map((feature, i) => (
                <div key={i} className="bg-white rounded-xl p-6 text-center border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="font-semibold text-sm text-[#1A1A1A]">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product Types */}
      {maklonPage.productTypes && maklonPage.productTypes.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8">
            <h2 className="text-2xl md:text-3xl font-bold font-onest text-[#1A1A1A] text-center mb-10">
              Tipe Produk {maklonPage.category || "Kami"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {maklonPage.productTypes.map((type, i) => (
                <div key={i} className="bg-[#FAFAFA] rounded-lg px-4 py-3 text-center">
                  <span className="text-sm font-medium text-gray-700">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <ProductFAQ
        categorySlug={mapped?.categorySlug || "skincare"}
        categoryName={pageName}
        subCategorySlug={mapped?.subCategorySlug}
        productSlug={mapped?.productSlug}
      />
      <CtaSection title={`Wujudkan Brand ${pageName} Impian Anda dalam 3 Bulan`} />
    </main>
  );
}

export async function generateStaticParams() {
  return [
    { category: "skincare-face-care" },
    ...maklonPages.map((p) => ({ category: p.slug })),
  ];
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const data = getProductDataV2(category);

  if (data) {
    const canonicalUrl = `https://dreamlab.id/maklon/${category}/`;
    const description = getCategoryMetaDescription(data.name, data.description, category);
    const title = getCategoryTitle(category);

    return {
      title: { absolute: title },
      description,
      alternates: { canonical: canonicalUrl },
      robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        images: [{ url: data.heroImage, width: 1200, height: 630, alt: title }],
        locale: "id_ID", type: "website", siteName: "Dreamlab Indonesia",
      },
      twitter: { card: "summary_large_image", title, description, images: [data.heroImage] },
    };
  }

  const maklonPage = getMaklonPage(category);
  if (!maklonPage) return { title: "Halaman Tidak Ditemukan", robots: "noindex" };

  const canonicalUrl = `https://dreamlab.id/maklon/${category}/`;
  const title = getMaklonPageTitle(category);
  const description = getMaklonPageDescription(category);

  // Auto-detect thin content: pages without sections data are too thin to index
  const isThinContent = !maklonPage.sections || maklonPage.sections.length === 0;
  // Also flag decorative sub-pages with very limited content (only header + product)
  const isMinimalContent = maklonPage.sections && maklonPage.sections.length <= 2;
  const robotsDirective = (isThinContent || isMinimalContent)
    ? "noindex, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalUrl },
    robots: robotsDirective,
    openGraph: {
      title, description, url: canonicalUrl,
      images: [{ url: "/assets/images/og-maklon.jpg", width: 1200, height: 630, alt: title }],
      locale: "id_ID", type: "website", siteName: "Dreamlab Indonesia",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
