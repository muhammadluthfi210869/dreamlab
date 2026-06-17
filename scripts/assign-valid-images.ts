import * as fs from 'fs';

let content = fs.readFileSync('src/data/articles.ts', 'utf-8');

// Available images that exist on disk
const availableImages = [
  'Dreamlab_bahan-aktif-skincare-paling-dicari-.webp',
  'Dreamlab-Maklon-Parfum.webp',
  'Maklon-Skincare-Anti-Flek-Profesional-di-Dreamlab.webp',
  'Pabrik-shampoo-untuk-merek-sendiri-1-1.webp',
  'Buat-Brand-Deodorant_Balm.webp',
  'panduan-bikin-brand-skincare-dreamlab.png',
  'jasa-maklon-sabun-mandi.jpg',
];

// Map article slug -> available image
const slugImageMap: Record<string, string> = {
  '/maklon-kosmetik-skincare-medan-dreamlab': 'Dreamlab_bahan-aktif-skincare-paling-dicari-.webp',
  '/maklon-parfum-custom-dreamlab': 'Dreamlab-Maklon-Parfum.webp',
  '/tren-cleanical-beauty-produk-skincare-paling-dicari-tahun-2026': 'Maklon-Skincare-Anti-Flek-Profesional-di-Dreamlab.webp',
  '/jasa-maklon-sunscreen-terbaik': 'panduan-bikin-brand-skincare-dreamlab.png',
  '/maklon-all-day-cream': 'Buat-Brand-Deodorant_Balm.webp',
  '/pabrik-parfum-surabaya-biaya-2026': 'Dreamlab-Maklon-Parfum.webp',
  '/tren-parfum-arab-bisnis-maklon-dreamlab': 'Dreamlab-Maklon-Parfum.webp',
};

for (const [slug, image] of Object.entries(slugImageMap)) {
  const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const articleRegex = new RegExp(
    `("slug":\\s*"${escapedSlug}"[\\s\\S]*?"featuredImage":\\s*)null`,
    'g'
  );
  
  const beforeCount = (content.match(articleRegex) || []).length;
  content = content.replace(articleRegex, `$1"${image}"`);
  const afterCount = (content.match(articleRegex) || []).length;
  
  if (beforeCount > 0) {
    console.log(`Fixed: ${slug} -> ${image}`);
  } else {
    console.log(`NOT FOUND: ${slug}`);
  }
}

fs.writeFileSync('src/data/articles.ts', content, 'utf-8');
console.log('\nDone assigning valid images.');
