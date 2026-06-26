import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function extractContentValue(line) {
  const prefix = '"content": "';
  const startIdx = line.indexOf(prefix);
  if (startIdx === -1) return null;
  let i = startIdx + prefix.length;
  let value = '';
  while (i < line.length) {
    const ch = line[i];
    if (ch === '\\') {
      const next = line[i + 1] || '';
      if (next === '"' || next === '\\' || next === '/' || next === 'n' || next === 't') {
        value += ch + next; i += 2;
      } else { value += ch; i++; }
    } else if (ch === '"') { break; }
    else { value += ch; i++; }
  }
  return { raw: value, endPos: i };
}

function unescapeJson(str) { return JSON.parse('"' + str + '"'); }
function escapeJson(str) { return JSON.stringify(str).slice(1, -1); }

function escapeRegex(str) { return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function main() {
  const filePath = path.resolve(__dirname, '../src/data/articles.ts');
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  let articleIndex = 0;
  let modifiedCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes('"content": "')) continue;

    const result = extractContentValue(line);
    if (!result) continue;

    const html = unescapeJson(result.raw);
    let newHtml = html;

    // Find all inline images in the content (bv-data-src or src pointing to /assets/images/blog/)
    const allImages = [...newHtml.matchAll(/<img[^>]*(?:bv-data-src|src)="\/assets\/images\/blog\/[^"]*"[^>]*>/gi)];

    // Filter to images we need to handle (our legalitas placeholders)
    const ourImages = allImages.filter(m => {
      const src = m[0].match(/(?:bv-data-src|src)="([^"]+)"/i)?.[1] || '';
      return src.includes('legalitas') || src.includes('artikel-mid') || src.includes('artikel-cta');
    });

    if (ourImages.length === 0) continue;

    articleIndex++;
    const isOdd = articleIndex % 2 === 1;
    const midFile = isOdd ? 'artikel-mid-a.png' : 'artikel-mid-b.png';

    if (ourImages.length === 1) {
      // Replace single image with mid
      const oldTag = ourImages[0][0];
      const newTag = oldTag.replace(
        /(?:bv-data-src|src)="[^"]*"/i,
        `bv-data-src="/assets/images/blog/${midFile}"`
      );
      newHtml = newHtml.replace(oldTag, newTag);

      // Inject CTA figure at end
      const ctaBlock = `\n\n<figure class="wp-block-image size-large"><a href="https://api.whatsapp.com/send/?phone=62881027240339&text=Hi+saya+ingin+konsultasi+untuk+brand+saya"><img bv-data-src="/assets/images/blog/artikel-cta.png" decoding="async" src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%200%200'%3E%3C/svg%3E" alt="Dreamlab Maklon Kosmetik" class="bv-tag-attr-replace bv-lazyload-tag-img"></a></figure>`;
      const closeDivPos = newHtml.lastIndexOf('</div>');
      if (closeDivPos !== -1) {
        newHtml = newHtml.slice(0, closeDivPos) + ctaBlock + '\n' + newHtml.slice(closeDivPos);
      } else {
        newHtml += ctaBlock;
      }
    } else {
      // Multiple images: first -> mid, last -> CTA, remove middle ones
      const firstTag = ourImages[0][0];
      const lastTag = ourImages[ourImages.length - 1][0];

      // Remove middle ones
      for (let j = ourImages.length - 2; j >= 1; j--) {
        const midTag = ourImages[j][0];
        // Try to remove the enclosing figure block
        const figureRe = new RegExp('<figure[^>]*>\\s*' + escapeRegex(midTag) + '\\s*</figure>', 'gs');
        const figMatch = newHtml.match(figureRe);
        if (figMatch) {
          newHtml = newHtml.replace(figMatch[0], '');
        } else if (newHtml.includes(midTag)) {
          newHtml = newHtml.replace(midTag, '');
        }
      }

      // Replace first with mid image
      const firstFigRe = new RegExp('<figure[^>]*>\\s*' + escapeRegex(firstTag) + '\\s*</figure>', 'gs');
      const firstFigMatch = newHtml.match(firstFigRe);
      if (firstFigMatch) {
        newHtml = newHtml.replace(firstFigMatch[0], firstFigMatch[0].replace(
          /(?:bv-data-src|src)="[^"]*"/i,
          `bv-data-src="/assets/images/blog/${midFile}"`
        ));
      } else if (newHtml.includes(firstTag)) {
        newHtml = newHtml.replace(firstTag, firstTag.replace(
          /(?:bv-data-src|src)="[^"]*"/i,
          `bv-data-src="/assets/images/blog/${midFile}"`
        ));
      }

      // Replace last with CTA
      const lastFigRe = new RegExp('<figure[^>]*>\\s*' + escapeRegex(lastTag) + '\\s*</figure>', 'gs');
      const lastFigMatch = newHtml.match(lastFigRe);
      if (lastFigMatch) {
        newHtml = newHtml.replace(lastFigMatch[0], lastFigMatch[0].replace(
          /(?:bv-data-src|src)="[^"]*"/i,
          `bv-data-src="/assets/images/blog/artikel-cta.png"`
        ));
      } else if (newHtml.includes(lastTag)) {
        newHtml = newHtml.replace(lastTag, lastTag.replace(
          /(?:bv-data-src|src)="[^"]*"/i,
          `bv-data-src="/assets/images/blog/artikel-cta.png"`
        ));
      }
    }

    // Clean up empty figure blocks
    newHtml = newHtml.replace(/<figure[^>]*>\s*<\/figure>/gi, '');

    const prefix = line.slice(0, line.indexOf('"content": "') + '"content": "'.length);
    const suffix = line.slice(result.endPos);
    lines[i] = prefix + escapeJson(newHtml) + suffix;
    modifiedCount++;
  }

  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  console.log(`Done. Updated ${modifiedCount} articles.`);
}

main();
