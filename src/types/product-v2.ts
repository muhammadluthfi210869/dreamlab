export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface QuickStat {
  icon: string;
  label: string;
  value: string;
}

export interface StoryContent {
  headline: string;
  body: string;
  callToAction: string;
}

export interface IngredientV2 {
  name: string;
  origin: string;
  function: string;
}

export interface NotesPyramid {
  top: string[];
  heart: string[];
  base: string[];
}

export interface ProductVariantV2 {
  id: string;
  name: string;
  slug: string;
  heroImage: string;
  galleryImages: string[];
  tags: string[];
  shortDescription: string;
  story: string;
  seoParagraph: string;
  benefits: string[];
  ingredients: IngredientV2[];
  notesPyramid?: NotesPyramid;
  sizeOptions: string[];
  bottleOptions: string[];
  capOptions: string[];
  moq: string;
  productionTime: string;
  certifications: string[];
}

export interface ComparisonRow {
  konsentrasi: string;
  haltbarkeit: string;
  marktposition: string;
  moq: string;
  preisklasse: string;
  karakter: string;
  bestFor: string[];
  ingredients: string[];
}

export interface TrustStatV2 {
  icon: string;
  value: string;
  label: string;
  description: string;
}

export interface TrustCategoryItem {
  icon: string;
  label: string;
  description: string;
}

export interface EdukasiItemV2 {
  title: string;
  content: string;
}

export interface TestimonialV2 {
  quote: string;
  name: string;
  brand: string;
  avatarImage: string;
  productImage: string;
}

export interface FAQItemV2 {
  question: string;
  answer: string;
}

export interface RelatedProductV2 {
  name: string;
  slug: string;
  image: string;
  category: string;
  categorySlug: string;
  subCategorySlug?: string;
}

export interface ProductCard {
  id: string;
  name: string;
  slug: string;
  image: string;
  size: string;
  tags: string[];
  isVariant: boolean;
  parentSlug?: string;
}

export interface SubCategoryV2 {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  bgColor: string;
  products: ProductVariantV2[];
}

export interface ProductCategoryV2 {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  bgColor: string;
  breadcrumb: BreadcrumbItem[];
  comparisonOptions: string[];
  comparisonMatrix: Record<string, ComparisonRow>;
  products: ProductVariantV2[];
  subCategories?: SubCategoryV2[];
  trustStats: TrustStatV2[];
  trustCategorySpecific: TrustCategoryItem[];
  edukasi: EdukasiItemV2[];
  testimonials: TestimonialV2[];
  faqs: FAQItemV2[];
  relatedProducts: RelatedProductV2[];
}