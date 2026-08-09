import { processArticleContent } from '../src/lib/article-content-processor';
import { cleanWordPressHtml } from '../src/lib/clean-html';
import { optimizeArticleImages } from '../src/lib/article-image-optimizer';
import { articles } from '../src/data/articles';

function preview(label: string, s: string, max = 500) {
  console.log(`\n===== ${label} =====`);
  console.log(s.slice(0, max).replace(/\n+/g, '\n'));
}

function checkCount(label: string, haystack: string, needle: string) {
  const n = haystack.split(needle).length - 1;
  console.log(`[${label}] count '${needle}': ${n}`);
  return n;
}

const sample = articles.find((a) => a.slug.includes('maklon-kosmetik-bandar-lampung'));

const TOTAL = processArticleContent;
(async () => {
  const picked = sample || articles.find((a) => a.content.includes('1a1a2e')) || articles[0];
  const rawContent = picked.content;

  console.log('Slug: ', picked.slug);
  console.log('Raw length:', rawContent.length);

  const cleaned = cleanWordPressHtml(rawContent);
  const optimized = optimizeArticleImages(cleaned);
  const final = processArticleContent(optimized);

  preview('FINAL (first 900)', final, 900);

  // Sanity checks
  check('has .article-outline (auto ToC)', /class="article-outline"/.test(final));
  check('has h2 with id', /<h2\b[^>]*id="/.test(final));
  check('has .article-cta', /class="article-cta"/.test(final));
  check('has THANKYOU url', final.includes('/thankyou/google/'));
  check('no bv-data-src', !/bv-data-src/.test(final));
  check('no ez-toc', !/ez-toc/i.test(final));
  check('no manual daftar-isi double', (final.match(/Daftar Isi/g) || []).length <= 2, `count=${(final.match(/Daftar Isi/g)||[]).length}`);
  check('balanced divs (open===close roughly)', (final.match(/<div\b/g)||[]).length === (final.match(/<\/div>/g)||[]).length, `open=${(final.match(/<div\b/g)||[]).length} close=${(final.match(/<\/div>/g)||[]).length}`);
  check('no loading=lazy loading=lazy', !/loading="lazy"\s+loading="lazy"/.test(final));
  check('img with /_next/image has width', !/\/_next\/image[^>]*>/.test(final.replace(/(\/_next\/image[^>]*width="\d+")/g, '')) ? true : final.split('src="/_next/image').length - 1 === final.split('width=').length - 1);
  console.log('\nDONE');
  function check(name: string, cond: boolean, extra?: string) {
    console.log(`${cond ? 'PASS' : 'FAIL'} — ${name}${extra ? ` (${extra})` : ''}`);
  }
})();