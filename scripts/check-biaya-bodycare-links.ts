import assert from 'node:assert/strict';
import { articles } from '../src/data/articles';
import { cleanWordPressHtml } from '../src/lib/clean-html';
import { optimizeArticleImages } from '../src/lib/article-image-optimizer';
import { processArticleContent } from '../src/lib/article-content-processor';

async function main() {
  const article = articles.find(
    (a) => a.slug === '/biaya-maklon-bodycare-target-hpp'
  );
  assert.ok(article, 'Article /biaya-maklon-bodycare-target-hpp not found');

  const processed = processArticleContent(
    optimizeArticleImages(cleanWordPressHtml(article.content))
  );

  // 1. Assert no /thankyou/ links and no double-slash // links in internal hrefs
  const hrefMatches = Array.from(processed.matchAll(/href="([^"]+)"/g)).map(
    (m) => m[1]
  );
  const internalLinks = Array.from(
    new Set(hrefMatches.filter((h) => h.startsWith('/')))
  );

  for (const href of internalLinks) {
    assert.ok(
      !href.includes('/thankyou/'),
      `Found forbidden /thankyou/ link in article: ${href}`
    );
    assert.ok(
      !href.includes('//'),
      `Found double-slash link in article: ${href}`
    );
  }

  // 2. Assert calculator quick mode mount and checklist mount exist
  assert.ok(
    processed.includes('id="hpp-calculator-root"') &&
      processed.includes('data-default-mode="quick"'),
    'Missing #hpp-calculator-root with data-default-mode="quick"'
  );
  assert.ok(
    processed.includes('id="bodycare-checklist-root"') &&
      processed.includes('data-checklist-variant="biaya"'),
    'Missing #bodycare-checklist-root with data-checklist-variant="biaya"'
  );

  // 3. Verify all internal links return 200 on https://dreamlab.id
  console.log(`Checking ${internalLinks.length} unique internal links against https://dreamlab.id...\n`);
  const results: Array<{ path: string; status: number; finalUrl: string }> = [];

  for (const path of internalLinks) {
    const url = `https://dreamlab.id${path}`;
    const res = await fetch(url, { redirect: 'follow' });
    results.push({ path, status: res.status, finalUrl: res.url });
    console.log(
      `${res.status === 200 ? '✅' : '❌'} [${res.status}] ${path} -> ${res.url}`
    );
    assert.equal(res.status, 200, `Expected 200 for ${path}, got ${res.status}`);
  }

  console.log(
    `\n[check-biaya-bodycare-links] PASS: All ${results.length} internal links returned HTTP 200.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

