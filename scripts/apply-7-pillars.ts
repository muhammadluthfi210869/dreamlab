import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { articles } from '../src/data/articles';
import { cityArticles } from '../src/data/city-articles';

const citySlugs = new Set(cityArticles.map((c) => c.slug));
const mainArticles = articles.filter((a) => !citySlugs.has(a.slug));

export const PILLARS = [
  'Maklon Kosmetik',
  'Panduan Bisnis',
  'Formula & R&D',
  'Legalitas & Regulasi',
  'Tren & Inovasi',
  'AIpreneur',
  'Event & Aktivitas',
] as const;

export function classify(a: any): { pillar: string; reason: string } {
  const t = (a.title || '').toLowerCase();
  const s = (a.slug || '').toLowerCase();
  const c = a.categories || [];

  // 1. Event & Aktivitas
  if (
    c.includes('Event') ||
    s.includes('beautypreneur-batch') ||
    s.includes('event') ||
    t.includes('beautypreneur batch') ||
    t.includes('pameran')
  ) {
    return { pillar: 'Event & Aktivitas', reason: 'Event keywords / existing Event category' };
  }

  // 2. AIpreneur
  if (
    s.includes('ai-data') ||
    s.includes('aipreneur') ||
    t.includes('ai & data') ||
    t.includes('artificial intelligence')
  ) {
    return { pillar: 'AIpreneur', reason: 'AI / Data topic' };
  }

  // 3. Legalitas & Regulasi
  const regPattern =
    /(bpom|cpkb|halal|izin edar|izin-edar|hki|hak paten|hak-paten|merek dagang|regulasi|legalitas|uji lab|uji-lab|notifikasi bpom|notifikasi-bpom|dokumen informasi produk|dip bpom)/;
  if (
    regPattern.test(s) ||
    /^(apakah.*bpom|cara.*bpom|syarat.*bpom|panduan.*bpom|aturan.*bpom|biaya.*bpom|legalitas.*)/.test(t)
  ) {
    if (
      !s.startsWith('/jasa-maklon-kosmetik-') &&
      !s.startsWith('/maklon-kosmetik-') &&
      !s.startsWith('/jasa-maklon-skincare-')
    ) {
      return { pillar: 'Legalitas & Regulasi', reason: 'Regulatory / BPOM / CPKB / Halal / HKI focus' };
    }
  }

  // 4. Formula & R&D
  const formPattern =
    /(formula|kandungan|bahan-aktif|bahan aktif|ekstrak|niacinamide|retinol|ceramide|salicylic|peptide|centella|hyaluronic|kolagen|asam-traneksamat|tranexamic|arbutin|kojic|aha-bha|bakuchiol|pdrn|glutathione|vitamin-c|symwhite|redensyl|fragrance oil|minyak atsiri|essential oil)/;
  if (c.includes('Formula Kosmetik') || formPattern.test(s) || formPattern.test(t)) {
    if (
      !s.startsWith('/jasa-maklon-kosmetik-') &&
      !s.startsWith('/maklon-kosmetik-') &&
      !s.startsWith('/jasa-maklon-skincare-')
    ) {
      return { pillar: 'Formula & R&D', reason: 'Ingredients / Formulation / R&D focus' };
    }
  }

  // 5. Tren & Inovasi
  const trendPattern =
    /(tren|trend|viral|inovasi|masa depan|prediksi|clean beauty|sustainable|ramah lingkungan|hybrid)/;
  if (trendPattern.test(s) || trendPattern.test(t)) {
    if (
      !s.startsWith('/jasa-maklon-kosmetik-') &&
      !s.startsWith('/maklon-kosmetik-') &&
      !s.startsWith('/jasa-maklon-skincare-')
    ) {
      return { pillar: 'Tren & Inovasi', reason: 'Trend / Market innovation / Viral beauty' };
    }
  }

  // 6. Panduan Bisnis
  const bizPattern =
    /(bisnis|modal|biaya|budget|hpp|harga jual|harga-jual|omset|omzet|reseller|distributor|marketing|pemasaran|jualan|strategi|usp|afiliasi|affiliate|kol|target pasar|keuntungan|meracik.*dijual)/;
  if (
    c.some((x: string) => x.includes('Bisnis') || x.includes('Panduan')) ||
    bizPattern.test(s) ||
    bizPattern.test(t)
  ) {
    if (
      !s.startsWith('/jasa-maklon-kosmetik-') &&
      !s.startsWith('/maklon-kosmetik-') &&
      !s.startsWith('/jasa-maklon-skincare-')
    ) {
      return { pillar: 'Panduan Bisnis', reason: 'Business strategy / Cost / Marketing / HPP' };
    }
  }

  // 7. Maklon Kosmetik
  return { pillar: 'Maklon Kosmetik', reason: 'Core manufacturing / OEM service / City page' };
}

console.log(`Processing ${mainArticles.length} main articles...`);

const updatedMainArticles = mainArticles.map((article) => {
  const { pillar } = classify(article);
  const oldCats = article.categories || [];
  const currentTags = article.tags || [];

  // Preserve any old categories in tags if not already present
  const mergedTags = [...currentTags];
  for (const cat of oldCats) {
    if (cat !== pillar && !mergedTags.includes(cat)) {
      mergedTags.push(cat);
    }
  }

  return {
    ...article,
    categories: [pillar],
    tags: mergedTags,
  };
});

const fileHeader = `
export interface Article {
  slug: string;
  title: string;
  publishDate: string;
  author: string;
  categories: string[];
  tags?: string[];
  featuredImage: string | null;
  excerpt: string;
  content: string;
  faqs?: { question: string; answer: string }[];
  seo: {
    title: string;
    description: string;
  };
}

import { cityArticles } from './city-articles';

export const articles: Article[] = `;

const fileFooter = `;

// City pages are maintained separately to keep their commercial intent and local
// distinctions auditable. Jember replaces its existing URL; the other two are new.
for (const cityArticle of cityArticles) {
  const existingIndex = articles.findIndex((article) => article.slug === cityArticle.slug);
  if (existingIndex >= 0) articles[existingIndex] = cityArticle;
  else articles.push(cityArticle);
}
`;

const targetFile = path.resolve(__dirname, '../src/data/articles.ts');
const newContent = fileHeader + JSON.stringify(updatedMainArticles, null, 2) + fileFooter;

writeFileSync(targetFile, newContent, 'utf-8');
console.log(`Successfully updated ${targetFile}`);
