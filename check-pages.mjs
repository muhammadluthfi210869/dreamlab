import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load mapping
const mapping = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/seo-mapping.json'), 'utf-8'));

// Load articles
const articlesPath = path.join(__dirname, 'src/data/articles.ts');
// Read as text and parse
const content = fs.readFileSync(articlesPath, 'utf-8');
const articlesMatch = content.match(/export const articles: Article\[\] = ([\s\S]*?);\nexport/);
let articles = [];
if (articlesMatch) {
  try {
    articles = eval('(' + articlesMatch[1] + ')');
  } catch(e) {
    console.log('Cannot eval articles, will search by slug pattern');
  }
}

const pagesToCheck = [
  { url: '/perusahaan-maklon-kosmetik', note: 'about company' },
  { url: '/bisnis-kosmetik-dari-nol', note: 'article' },
  { url: '/category/bisnis-men-grooming', note: 'category' },
  { url: '/ide-bisnis-kosmetik', note: 'old article' },
  { url: '/atur‑kosmetik‑halal‑dreamlab', note: 'special chars in URL' },
  { url: '/babycare-masa-kini-sentuhan-lembut-dan-ilmu-pengetahuan', note: 'old article' },
  { url: '/maklon-kosmetik-terbaik', note: 'old article' },
  { url: '/state-of-beauty-2025-tren-kecantikan-pertumbuhan-industri', note: 'old article 2025' },
  { url: '/maklon-skinacre-lptiktok', note: 'typo in URL (skinacre)' },
  { url: '/tentang-dreamlab/alur-maklon', note: 'old URL structure' },
  { url: '/contact-form-dreamlab', note: 'should redirect' },
  { url: '/maklon-parfum/eau-de-cologne', note: 'product page' },
  { url: '/produk/decorative/lipcare', note: 'product page' },
  { url: '/produk/footcare', note: 'product category' },
  { url: '/maklon-foot-care/foot-cream', note: 'product page' },
  { url: '/maklon-skincare/cleansing-series', note: 'product page' },
  { url: '/produk/babycare/baby-2in1-wash', note: 'product page' },
];

console.log('=== CHECKING PAGES STATUS ===\n');

for (const p of pagesToCheck) {
  const page = p.url;
  // Check mapping
  const inMapping = mapping.find(m => 
    m.source === page || m.destination === page || 
    m.source === page + '/' || m.destination === page + '/'
  );
  
  // Check articles by slug
  const matchingArticle = articles.find(a => {
    const aSlug = '/' + a.slug.replace(/^\//, '').replace(/\/$/, '');
    return aSlug === page || aSlug === page + '/';
  });
  
  const status = inMapping ? 'REDIRECT → ' + inMapping.destination : (matchingArticle ? 'ARTICLE EXISTS' : 'NOT IN SYSTEM');
  const title = matchingArticle ? matchingArticle.title.substring(0, 50) : (inMapping ? inMapping._metadata?.original_title?.substring(0, 50) || '' : '');
  
  console.log(`${page}`);
  console.log(`  Status: ${status}`);
  if (title) console.log(`  Title: ${title}`);
  console.log(`  Note: ${p.note}`);
  console.log();
}
