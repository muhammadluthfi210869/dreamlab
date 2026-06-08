export interface SeoMetadata {
  original_title: string;
  original_description?: string;
  original_h1?: string;
  original_h2?: string;
}

export interface SeoMappingItem {
  source: string;
  destination: string;
  _metadata: SeoMetadata;
}

export interface Article {
  slug: string;
  title: string;
  categories: string[];
  excerpt: string;
  content: string;
  featuredImage: string | null;
  publishDate: string;
  author: string;
  seo?: {
    title: string;
    description: string;
  };
}

export interface AuditData {
  slug: string;
  url?: string;
  meta_title?: string;
  meta_description?: string;
  h1?: string;
  canonical?: string;
  word_count?: string;
  images_count?: string;
  hero_image_url?: string;
  data_table_json?: Array<{ label: string; value: string }>;
  faq_json?: Array<{ question: string; answer: string }>;
  supporting_entities?: string[];
  schema_markup?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ProductItem {
  name: string;
  image: string;
  description: string;
  subDescription?: string;
}

export interface CategoryTab {
  id: string;
  label: string;
  icon?: string;
  tabImage?: string;
  products: ProductItem[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface AboutSectionData {
  image: string;
  badge: {
    title: string;
    name: string;
  };
  title: string;
  description: string;
  cta: string;
  ctaLink: string;
}

export interface LayananMaklonData {
  title: string;
  subtitle: string;
  items: Array<{
    title: string;
    description: string;
  }>;
  image: string;
}

export interface TrustedBannerData {
  text: string;
  logos: string[];
}

export interface FinalCTAData {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

export interface AboutHeroData {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  productImage: string;
  trustBadges: Array<{
    icon: string;
    label: string;
  }>;
}

export interface AuthoritySectionData {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  badge: {
    text: string;
    subtext: string;
  };
  images: string[];
  points: Array<{
    id: number;
    title: string;
    description: string;
    certNo?: string;
    icon: string;
  }>;
  additionalCerts: Array<{
    label: string;
    certNo: string;
  }>;
}

export interface AfterSalesSectionData {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  badge: {
    text: string;
    subtext: string;
  };
  images: string[];
  points: Array<{
    id: number;
    title: string;
    description: string;
    icon: string;
  }>;
  benefits: Array<{
    label: string;
    desc: string;
  }>;
}

export interface ServicesCardsData {
  headline: string;
  subheadline: string;
  cards: Array<{
    id: number;
    step: string;
    title: string;
    description: string;
  }>;
}

export interface PartnerLogoData {
  name: string;
  path: string;
}

export interface CTASectionData {
  headline: string;
  subheadline: string;
  actions: Array<{
    id: number;
    title: string;
    icon: string;
    link: string;
  }>;
}
