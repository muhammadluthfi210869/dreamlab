import { processArticleContent } from '../src/lib/article-content-processor';
import { cleanWordPressHtml } from '../src/lib/clean-html';
import { optimizeArticleImages } from '../src/lib/article-image-optimizer';
import { articles } from '../src/data/articles';

const a = articles.find((x) => x.slug.includes('one-stop') || x.slug.includes('maklon-jakarta'));
const targets = ['one-stop','jakarta skala','rekomendasi'];
console.log('Articles checked:');
for (const t of targets) {
  const art = articles.filter(x => x.content.includes('article-daftar-isi'));
  console.log('  with article-daftar-isi:', art.map(x=>x.slug).slice(0,5));
  break;
}
const art = articles.find(x=>x.content.includes('article-daftar-isi'));
console.log('slug with manual toc:', art.slug);
const final = processArticleContent(optimizeArticleImages(cleanWordPressHtml(art.content)));
console.log('remains article-daftar-isi:', (final.match(/article-daftar-isi/g)||[]).length);
console.log('remains table-of-content:', (final.match(/table-of-content/g)||[]).length);
console.log('has article-outline:', /article-outline/.test(final));
