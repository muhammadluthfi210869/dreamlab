# Fix Broken Inline Article Images — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all broken inline images in 173 article bodies with 3 new asset images (2 legalitas + 1 CTA).

**Architecture:** Single Node.js script mutates `src/data/articles.ts` in-place, replacing `bv-data-src` references to nonexistent images with references to 3 prepared images. Image files are copied from `public\new asset\artikel\` to `public\assets\images\blog\`.

**Tech Stack:** Node.js (fs), Next.js build for verification

---

### Task 1: Prepare Images

**Files:**
- Modify: `public\new asset\artikel\dreamlab_legalitas_cta.png.png`
- Create: `public\assets\images\blog\legalitas-a.png`
- Create: `public\assets\images\blog\legalitas-b.png`
- Create: `public\assets\images\blog\cta-wa.png`
- (optional) Create: webp variants

- [ ] **Step 1: Rename + copy files to blog folder**

```bash
# Create the destination if needed
$src = "C:\GAWE\Web Dev\Porto Aureon\CRAWL WEBSITE DREAMLAB\dreamlab-site\public\new asset\artikel"
$dst = "C:\GAWE\Web Dev\Porto Aureon\CRAWL WEBSITE DREAMLAB\dreamlab-site\public\assets\images\blog"

Copy-Item -LiteralPath "$src\dreamlab_legalitas.png" -Destination "$dst\legalitas-a.png"
Copy-Item -LiteralPath "$src\Dreamlab_Maklonkosmetik_skincare_terlengkap.png" -Destination "$dst\legalitas-b.png"
Copy-Item -LiteralPath "$src\dreamlab_legalitas_cta.png.png" -Destination "$dst\cta-wa.png"
```

---

### Task 2: Create Fix Script

**Files:**
- Create: `scripts/fix-inline-images.mjs`

- [ ] **Step 1: Write the fix script**

The script reads `src/data/articles.ts` line by line. Each article's `content` field is on a single line containing JSON-escaped HTML. The script:
1. Finds lines with `"content": "`
2. Extracts the raw string value (handling `\"` escape sequences)
3. Unescapes it to get real HTML using JSON.parse
4. Counts/replaces inline `<img>` tags
5. Re-escapes and writes back

```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function extractContentValue(line) {
  // Find the content value between "content": "  and the closing ", or "
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
      // Single image: replace with legalitas
      const imgTag = images[0][0];
      const legalitasTag = `<img bv-data-src="/assets/images/blog/${legalitaFile}" decoding="async" src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%200%200'%3E%3C/svg%3E" alt="Dreamlab Maklon Kosmetik" class="bv-tag-attr-replace bv-lazyload-tag-img" style="width:auto;height:auto">`;
      newHtml = newHtml.replace(imgTag, legalitasTag);

      // Inject CTA figure before the closing </div>
      const ctaBlock = `\n\n<figure class="wp-block-image size-large"><a href="https://api.whatsapp.com/send/?phone=62881027240339&text=Hi+saya+ingin+konsultasi+untuk+brand+saya"><img bv-data-src="/assets/images/blog/cta-wa.png" decoding="async" src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%200%200'%3E%3C/svg%3E" alt="Konsultasi Gratis Dreamlab" class="bv-tag-attr-replace bv-lazyload-tag-img"></a></figure>`;
      newHtml = newHtml.replace('</div>', ctaBlock + '\n</div>');
    } else {
      // Multiple images: first -> legalitas, last -> CTA, remove middle
      const firstTag = images[0][0];
      const lastTag = images[images.length - 1][0];

      const legalitasTag = `<img bv-data-src="/assets/images/blog/${legalitaFile}" decoding="async" src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%200%200'%3E%3C/svg%3E" alt="Dreamlab Maklon Kosmetik" class="bv-tag-attr-replace bv-lazyload-tag-img" style="width:auto;height:auto">`;
      const ctaTag = `<img bv-data-src="/assets/images/blog/cta-wa.png" decoding="async" src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%200%200'%3E%3C/svg%3E" alt="Konsultasi Gratis Dreamlab" class="bv-tag-attr-replace bv-lazyload-tag-img">`;

      // Remove middle images (replace entire <figure> blocks, or just <img>)
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

      // Replace first with legalitas
      const firstFigPattern = new RegExp('<figure[^>]*>\\s*' + escapeRegex(firstTag) + '\\s*</figure>', 'gs');
      const firstFigMatch = newHtml.match(firstFigPattern);
      if (firstFigMatch) {
        newHtml = newHtml.replace(firstFigMatch[0], firstFigMatch[0].replace(firstTag, legalitasTag));
      } else {
        newHtml = newHtml.replace(firstTag, legalitasTag);
      }

      // Replace last with CTA
      const lastFigPattern = new RegExp('<figure[^>]*>\\s*' + escapeRegex(lastTag) + '\\s*</figure>', 'gs');
      const lastFigMatch = newHtml.match(lastFigPattern);
      if (lastFigMatch) {
        newHtml = newHtml.replace(lastFigMatch[0], lastFigMatch[0].replace(lastTag, ctaTag));
      } else {
        newHtml = newHtml.replace(lastTag, ctaTag);
      }
    }

    // Rebuild the line
    const prefix = line.slice(0, line.indexOf('"content": "') + '"content": "'.length);
    const suffix = line.slice(result.endPos);
    lines[i] = prefix + escapeJson(newHtml) + suffix;
    modifiedCount++;
  }

  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  console.log(`Done. Processed ${modifiedCount} articles with inline images.`);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

main();
```

- [ ] **Step 2: Run the script**

```bash
cd "C:\GAWE\Web Dev\Porto Aureon\CRAWL WEBSITE DREAMLAB\dreamlab-site"
node scripts/fix-inline-images.mjs
```

Expected: `Done. Processed 173 articles.`

---

### Task 3: Verify with Build

**Files:** none (verification only)

- [ ] **Step 1: Run Next.js build**

```bash
cd "C:\GAWE\Web Dev\Porto Aureon\CRAWL WEBSITE DREAMLAB\dreamlab-site"
npx next build
```

Expected: Build succeeds with no errors. Check for any image-related warnings.

- [ ] **Step 2: Spot-check a few articles**

```bash
# Check that images exist in blog folder
Get-ChildItem "C:\GAWE\Web Dev\Porto Aureon\CRAWL WEBSITE DREAMLAB\dreamlab-site\public\assets\images\blog\legalitas-*"
Get-ChildItem "C:\GAWE\Web Dev\Porto Aureon\CRAWL WEBSITE DREAMLAB\dreamlab-site\public\assets\images\blog\cta-wa*"
```

Check 2-3 articles in `src/data/articles.ts` to confirm:
- Legalitas image references alternate between `legalitas-a.png` and `legalitas-b.png`
- CTA image `cta-wa.png` appears once per article
- No remaining references to broken files like `4-11-1024x576.webp`
