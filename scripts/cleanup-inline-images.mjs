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

    // Count images that need fixing
    const allImages = [...newHtml.matchAll(/<img[^>]*(?:bv-data-src|src)="(?:https:\/\/dreamlab\.id)?\/?(?:assets\/images\/blog|wp-content\/uploads\/[^\/]+)\/[^"]*"[^>]*>/gi)];

    const brokenOnes = allImages.filter(m => {
      const tag = m[0];
      const srcMatch = tag.match(/(?:bv-data-src|src)="([^"]+)"/i);
      if (!srcMatch) return false;
      const path2 = srcMatch[1];
      // Skip hero images and existing good images
      if (path2.includes('legalitas') || path2.includes('placeholder')) return false;
      // Broken patterns: numbered files like 4-11, 5-12, cta-wa, or WordPress URLs
      return (
        path2.includes('cta-wa.png') ||
        /\/[45]-\d+(?:-\d+)?(?:x\d+)?\.(?:webp|png)/.test(path2) ||
        path2.includes('wp-content/uploads')
      );
    });

    if (brokenOnes.length === 0) continue;

    articleIndex++;
    const isOdd = articleIndex % 2 === 1;
    const legalitaFile = isOdd ? 'legalitas-a.png' : 'legalitas-b.png';

    for (const match of brokenOnes) {
      const oldTag = match[0];
      const newTag = oldTag.replace(
        /(?:bv-data-src|src)="[^"]*"/gi,
        `bv-data-src="/assets/images/blog/${legalitaFile}"`
      );
      newHtml = newHtml.replace(oldTag, newTag);
    }

    const prefix = line.slice(0, line.indexOf('"content": "') + '"content": "'.length);
    const suffix = line.slice(result.endPos);
    lines[i] = prefix + escapeJson(newHtml) + suffix;
    modifiedCount++;
  }

  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  console.log(`Done. Fixed ${modifiedCount} articles (${articleIndex} had broken images).`);
}

main();
