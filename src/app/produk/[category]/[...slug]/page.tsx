import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getProductDataV2, getSubCategory, getAllSubCategories, getFlatCategoryProductPages, getAllSubCategoryProductPages, getAllCategories } from "@/data/products-v2";
import { getCardImagePath } from "@/data/product-card-images";
import { getProductTitle, getProductMetaDescription, getCategoryTitle, getCategoryMetaDescription, getSubCategoryMetaDescription } from "@/data/keywords";
import ProductHero from "@/components/ProductPageV2/ProductHero";
import ProductAbout from "@/components/ProductPageV2/ProductAbout";
import ProductGrid from "@/components/ProductPageV2/ProductGrid";
import SubCategoryGrid from "@/components/ProductPageV2/SubCategoryGrid";
import IndividualProductPage from "@/components/ProductPageV2/IndividualProductPage";
import JsonLd from "@/components/JsonLd";
import { generateProductPageSchema } from "@/lib/schema-generator";
import ProductPackagingGrid from "@/components/ProductPageV2/ProductPackagingGrid";
import ProductSubCategoryFormula from "@/components/ProductPageV2/ProductSubCategoryFormula";
import { aboutData } from "@/data/about-us";

const AdvantagesGrid = dynamic(() => import("@/components/AdvantagesGrid"));
const ProductProcess = dynamic(() => import("@/components/ProductPageV2/ProductProcess"));
const ProductFAQ = dynamic(() => import("@/components/ProductPageV2/ProductFAQ"));
const CtaSection = dynamic(() => import("@/components/CtaSection"));
const LogoScroll = dynamic(() => import("@/components/LogoScroll"));
const OurCertification = dynamic(() => import("@/components/OurCertification"));

type Props = {
  params: Promise<{ category: string; slug: string[] }>;
};

export default async function CatchAllPage({ params }: Props) {
  const { category, slug } = await params;
  const categoryData = getProductDataV2(category);

  if (!categoryData) notFound();

  const hasSubCategories = categoryData.subCategories && categoryData.subCategories.length > 0;

  // Single segment: /produk/skincare/serum/ OR /produk/skincare/acne-cream/ OR /produk/bodycare/body-lotion/
  if (slug.length === 1) {
    const segment = slug[0];

    // Check if it's a sub-category
    if (hasSubCategories) {
      const subData = getSubCategory(category, segment);
      if (subData) {
        const enrichedData = {
          ...categoryData,
          slug: category,
          name: subData.name,
          tagline: subData.description,
          heroImage: subData.heroImage,
          bgColor: subData.bgColor,
          products: subData.products,
          breadcrumb: [
            ...categoryData.breadcrumb,
            { label: subData.name, href: `/produk/${category}/${segment}/` },
          ],
        };
        return (
          <main className="min-h-screen bg-white">
            <ProductHero categoryData={enrichedData} subCategorySlug={segment} />
            {category === "skincare" || category === "decorative" ? (
              <ProductSubCategoryFormula categorySlug={category} subCategoryName={subData.name} />
            ) : (
              <ProductAbout categoryName={subData.name} />
            )}
            <ProductGrid products={subData.products} categorySlug={category} subCategorySlug={segment} />
            <ProductPackagingGrid categorySlug={category} subCategorySlug={segment} />
            <AdvantagesGrid title="8 Keuntungan Maklon" />
            <LogoScroll logos={aboutData.partnerLogos} />
            <OurCertification />
            <ProductProcess />
            <CtaSection title={`Wujudkan Brand ${subData.name} Impian Anda dalam 3 Bulan`} />
            <ProductFAQ categorySlug={category} categoryName={subData.name} subCategorySlug={segment} />
          </main>
        );
      }
    }

    // Check if it's a top-level product (works for both flat and hybrid categories)
    const productData = categoryData.products.find(p => p.slug === segment);
    if (productData) {
      const currentUrl = `https://dreamlab.id/produk/${category}/${segment}/`;
      const productFaqKey = `${category}-${segment}`;
      const productFaqMap: Record<string, { question: string; answer: string }[]> = {
        "bodycare-deodorant-spray": [
          { question: "Apa itu maklon deodorant spray?", answer: "Maklon deodorant spray adalah layanan produksi deodorant spray dengan brand Anda sendiri. Dreamlab membantu dari formulasi, produksi, kemasan, hingga legalitas BPOM dan Halal." },
          { question: "Bahan aktif apa saja yang bisa diformulasikan pada deodorant spray?", answer: "Deodorant spray dapat diformulasikan dengan bahan aktif anti-bau (natural deo actives), antiperspirant, dan fragrance premium dengan pilihan aroma sesuai konsep brand Anda." },
          { question: "Berapa biaya, MOQ, dan lama proses maklon deodorant spray?", answer: "Biaya menyesuaikan formula dan kemasan. MOQ fleksibel untuk brand pemula, estimasi proses sekitar 3 bulan hingga produk siap edar." },
          { question: "Apakah sudah termasuk BPOM & Halal, dan bagaimana cara memulai?", answer: "Ya, Dreamlab menyediakan layanan One Stop Service termasuk BPOM dan Halal. Mulai dengan konsultasi gratis via WhatsApp." },
        ],
        "bodycare-deodorant-roll-on": [
          { question: "Apa itu maklon deodorant roll on?", answer: "Maklon deodorant roll on adalah layanan produksi deodorant roll on dengan brand Anda sendiri, dari formulasi hingga legalitas BPOM dan Halal." },
          { question: "Apa bedanya roll on dengan deodorant spray untuk kulit sensitif?", answer: "Roll on memiliki tekstur lebih lembut, tidak menyebar ke udara seperti spray, dan memberikan aplikasi lebih tepat — cocok untuk kulit sensitif." },
          { question: "Berapa biaya dan MOQ maklon deodorant roll on?", answer: "Biaya menyesuaikan formula dan kemasan. MOQ fleksibel sehingga brand pemula bisa memulai dari jumlah lebih terjangkau." },
          { question: "Apakah maklon deodorant roll on di Dreamlab sudah termasuk BPOM dan Halal?", answer: "Ya, Dreamlab menyediakan layanan One Stop Service yang membantu pengurusan BPOM dan sertifikasi Halal." },
        ],
        "bodycare-deodorant-dry-serum": [
          { question: "Apa itu maklon deodorant dry serum dan apa bedanya dengan deodorant biasa?", answer: "Maklon deodorant dry serum adalah layanan produksi deodorant format serum. Bedanya dengan deodorant biasa, dry serum memiliki tekstur ringan yang cepat kering dan tidak lengket." },
          { question: "Manfaat apa saja yang bisa diformulasikan pada deodorant dry serum?", answer: "Dry serum dapat diformulasikan untuk anti-bau, mencerahkan area ketiak dengan niacinamide, melembapkan dengan hyaluronic acid, dan memberikan sensasi segar tahan lama." },
          { question: "Berapa biaya, MOQ, dan lama proses maklon deodorant dry serum?", answer: "Biaya menyesuaikan formula dan kemasan. MOQ fleksibel dengan estimasi proses sekitar 3 bulan hingga siap edar." },
          { question: "Apakah format dry serum ini sedang tren dan cocok untuk pasar Indonesia?", answer: "Ya, format dry serum sedang tren dari Korea. Teksturnya yang ringan, cepat kering, dan tidak lengket sangat cocok untuk iklim tropis Indonesia." },
        ],
      };
      const productFaqs = productFaqMap[productFaqKey] || [];
      const schemaData = {
        url: currentUrl,
        productName: productData.name,
        categoryName: categoryData.name,
        tagline: categoryData.tagline,
        description: productData.seoParagraph,
        heroImage: productData.heroImage,
        breadcrumbs: [
          ...categoryData.breadcrumb,
          { label: productData.name, href: currentUrl },
        ],
        faqs: [...(categoryData.faqs || []), ...productFaqs],
        moq: productData.moq,
        productionTime: productData.productionTime,
        certifications: productData.certifications,
      };
      const schema = generateProductPageSchema(schemaData);
      return (
        <>
          <JsonLd data={schema} />
          <IndividualProductPage categoryData={categoryData} productData={productData} />
        </>
      );
    }

    notFound();
  }

  // Two segments: /produk/skincare/serum/facial-serum/
  if (slug.length === 2) {
    const [subCategorySlug, productSlug] = slug;

    if (!hasSubCategories) notFound();

    const subData = getSubCategory(category, subCategorySlug);
    if (!subData) notFound();

    const productData = subData.products.find(p => p.slug === productSlug);
    if (!productData) notFound();

    const currentUrl = `https://dreamlab.id/produk/${category}/${subCategorySlug}/${productSlug}/`;
    const schemaData = {
      url: currentUrl,
      productName: productData.name,
      categoryName: categoryData.name,
      tagline: categoryData.tagline,
      description: productData.seoParagraph || productData.shortDescription,
      heroImage: productData.heroImage,
      breadcrumbs: [
        ...categoryData.breadcrumb,
        { label: subData.name, href: `/produk/${category}/${subCategorySlug}/` },
        { label: productData.name, href: currentUrl },
      ],
      faqs: categoryData.faqs || [],
      moq: productData.moq,
      productionTime: productData.productionTime,
      certifications: productData.certifications,
    };
    const schema = generateProductPageSchema(schemaData);

    // Build subcategory-specific related products from sibling products
    const subCategoryRelatedProducts = subData.products
      .filter(p => p.slug !== productSlug)
      .slice(0, 4)
      .map(p => ({
        name: p.name,
        slug: p.slug,
        image: getCardImagePath(p.slug, category) || p.heroImage,
        category: categoryData.name,
        categorySlug: category,
        subCategorySlug: subCategorySlug,
      }));

    return (
      <>
        <JsonLd data={schema} />
        <IndividualProductPage
          categoryData={{
            ...categoryData,
            heroImage: subData.heroImage,
            bgColor: subData.bgColor,
            breadcrumb: [
              ...categoryData.breadcrumb,
              { label: subData.name, href: `/produk/${category}/${subCategorySlug}/` },
            ],
            relatedProducts: subCategoryRelatedProducts.length > 0 ? subCategoryRelatedProducts : categoryData.relatedProducts,
          }}
          productData={productData}
        />
      </>
    );
  }

  notFound();
}

export async function generateStaticParams() {
  const subCategoryParams = getAllSubCategories().map(({ category, subCategory }) => ({
    category,
    slug: [subCategory],
  }));

  const subCategoryProductParams = getAllSubCategoryProductPages().map(({ category, subCategory, product }) => ({
    category,
    slug: [subCategory, product],
  }));

  const flatProductParams = getFlatCategoryProductPages().map(({ category, product }) => ({
    category,
    slug: [product],
  }));

  // Also include top-level products from categories that have BOTH sub-categories and top-level products
  const topLevelProductParams = getAllCategories()
    .filter(cat => cat.subCategories && cat.subCategories.length > 0 && cat.products.length > 0)
    .flatMap(cat => cat.products.map(p => ({
      category: cat.slug,
      slug: [p.slug],
    })));

  return [...subCategoryParams, ...subCategoryProductParams, ...flatProductParams, ...topLevelProductParams];
}

export async function generateMetadata({ params }: Props) {
  const { category, slug } = await params;
  const categoryData = getProductDataV2(category);

  if (!categoryData) {
    return { title: "Halaman Tidak Ditemukan", robots: "noindex" };
  }

  const hasSubCategories = categoryData.subCategories && categoryData.subCategories.length > 0;

  // Single segment
  if (slug.length === 1) {
    const segment = slug[0];

    // Sub-category
    if (hasSubCategories) {
      const subData = getSubCategory(category, segment);
      if (subData) {
        const canonicalUrl = `https://dreamlab.id/produk/${category}/${segment}/`;
        const title = `Jasa Maklon ${subData.name} ${categoryData.name} BPOM & Halal | Dreamlab`;
        const mappedDesc = getSubCategoryMetaDescription(category, subData.slug);
        const description = mappedDesc || `Jasa maklon ${subData.name.toLowerCase()} ${categoryData.name.toLowerCase()} BPOM & Halal. ${subData.description} ✓ MOQ Fleksibel. Konsultasi gratis.`;
        return {
          title,
          description,
          alternates: { canonical: canonicalUrl },
          robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
          openGraph: {
            title, description, url: canonicalUrl,
            images: [{ url: subData.heroImage, width: 1200, height: 630, alt: title }],
            locale: "id_ID", type: "website", siteName: "Dreamlab Indonesia",
          },
          twitter: { card: "summary_large_image", title, description, images: [subData.heroImage] },
        };
      }
    }

    // Top-level product (works for both flat and hybrid categories)
    const productData = categoryData.products.find(p => p.slug === segment);
    if (productData) {
      const canonicalUrl = `https://dreamlab.id/produk/${category}/${segment}/`;
      const title = getProductTitle(category, productData.slug);
      const description = getProductMetaDescription(
        productData.name, categoryData.name, productData.shortDescription,
        productData.moq, productData.productionTime, productData.certifications,
        category, productData.slug
      );
      return {
        title, description, alternates: { canonical: canonicalUrl },
        robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
        openGraph: {
          title, description, url: canonicalUrl,
          images: [{ url: productData.heroImage, width: 1200, height: 630, alt: title }],
          locale: "id_ID", type: "website", siteName: "Dreamlab Indonesia",
        },
        twitter: { card: "summary_large_image", title, description, images: [productData.heroImage] },
      };
    }
  }

  // Two segments: product under sub-category
  if (slug.length === 2) {
    const [subCategorySlug, productSlug] = slug;
    const subData = getSubCategory(category, subCategorySlug);
    if (subData) {
      const productData = subData.products.find(p => p.slug === productSlug);
      if (productData) {
        const canonicalUrl = `https://dreamlab.id/produk/${category}/${subCategorySlug}/${productSlug}/`;
        const title = getProductTitle(category, productData.slug);
        const description = getProductMetaDescription(
          productData.name, categoryData.name, productData.shortDescription,
          productData.moq, productData.productionTime, productData.certifications,
          category, productData.slug
        );
        return {
          title, description, alternates: { canonical: canonicalUrl },
          robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
          openGraph: {
            title, description, url: canonicalUrl,
            images: [{ url: productData.heroImage, width: 1200, height: 630, alt: title }],
            locale: "id_ID", type: "website", siteName: "Dreamlab Indonesia",
          },
          twitter: { card: "summary_large_image", title, description, images: [productData.heroImage] },
        };
      }
    }
  }

  return { title: "Halaman Tidak Ditemukan", robots: "noindex" };
}
