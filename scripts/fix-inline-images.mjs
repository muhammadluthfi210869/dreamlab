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
        value += ch + next;
        i += 2;
      } else {
        value += ch;
        i++;
      }
    } else if (ch === '"') {
      break;
    } else {
      value += ch;
      i++;
    }
  }
  return { raw: value, endPos: i };
}

function unescapeJson(str) {
  return JSON.parse('"' + str + '"');
}

function escapeJson(str) {
  return JSON.stringify(str).slice(1, -1);
}

function countInlineImages(html) {
  const regex = /<img[^>]*bv-data-src="\/assets\/images\/blog\/[^"]*"[^>]*>/gi;
  return [...html.matchAll(regex)];
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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
    const images = countInlineImages(html);
    if (images.length === 0) continue;

    articleIndex++;
    const isOdd = articleIndex % 2 === 1;
    const legalitaFile = isOdd ? 'legalitas-a.png' : 'legalitas-b.png';

    let newHtml = html;

    if (images.length === 1) {
      const imgTag = images[0][0];
      const legalitasTag = `<img bv-data-src="/assets/images/blog/${legalitaFile}" decoding="async" src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%200%200'%3E%3C/svg%3E" alt="Dreamlab Maklon Kosmetik" class="bv-tag-attr-replace bv-lazyload-tag-img" style="width:auto;height:auto">`;
      newHtml = newHtml.replace(imgTag, legalitasTag);

      const ctaBlock = `\n\n<figure class="wp-block-image size-large"><a href="https://api.whatsapp.com/send/?phone=62881027240339&text=Hi+saya+ingin+konsultasi+untuk+brand+saya"><img bv-data-src="/assets/images/blog/cta-wa.png" decoding="async" src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%200%200'%3E%3C/svg%3E" alt="Konsultasi Gratis Dreamlab" class="bv-tag-attr-replace bv-lazyload-tag-img"></a></figure>`;
      newHtml = newHtml.replace('</div>', ctaBlock + '\n</div>');
    } else {
      const firstTag = images[0][0];
      const lastTag = images[images.length - 1][0];

      const legalitasTag = `<img bv-data-src="/assets/images/blog/${legalitaFile}" decoding="async" src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%200%200'%3E%3C/svg%3E" alt="Dreamlab Maklon Kosmetik" class="bv-tag-attr-replace bv-lazyload-tag-img" style="width:auto;height:auto">`;
      const ctaTag = `<img bv-data-src="/assets/images/blog/cta-wa.png" decoding="async" src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%200%200'%3E%3C/svg%3E" alt="Konsultasi Gratis Dreamlab" class="bv-tag-attr-replace bv-lazyload-tag-img">`;

      for (let j = images.length - 2; j >= 1; j--) {
        const midTag = images[j][0];
        const figPattern = new RegExp('<figure[^>]*>\\s*' + escapeRegex(midTag) + '\\s*</figure>', 'gs');
        const figMatch = newHtml.match(figPattern);
        if (figMatch) {
          newHtml = newHtml.replace(figMatch[0], '');
        } else {
          newHtml = newHtml.replace(midTag, '');
        }
      }

      const firstFigPattern = new RegExp('<figure[^>]*>\\s*' + escapeRegex(firstTag) + '\\s*</figure>', 'gs');
      const firstFigMatch = newHtml.match(firstFigPattern);
      if (firstFigMatch) {
        newHtml = newHtml.replace(firstFigMatch[0], firstFigMatch[0].replace(firstTag, legalitasTag));
      } else {
        newHtml = newHtml.replace(firstTag, legalitasTag);
      }

      const lastFigPattern = new RegExp('<figure[^>]*>\\s*' + escapeRegex(lastTag) + '\\s*</figure>', 'gs');
      const lastFigMatch = newHtml.match(lastFigPattern);
      if (lastFigMatch) {
        newHtml = newHtml.replace(lastFigMatch[0], lastFigMatch[0].replace(lastTag, ctaTag));
      } else {
        newHtml = newHtml.replace(lastTag, ctaTag);
      }
    }

    const prefix = line.slice(0, line.indexOf('"content": "') + '"content": "'.length);
    const suffix = line.slice(result.endPos);
    lines[i] = prefix + escapeJson(newHtml) + suffix;
    modifiedCount++;
  }

  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  console.log(`Done. Processed ${modifiedCount} articles with inline images.`);
}

main();
