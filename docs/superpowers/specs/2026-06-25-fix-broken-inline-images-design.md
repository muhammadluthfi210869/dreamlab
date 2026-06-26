# Fix Broken Inline Article Images — Design Spec

## Problem
173 blog articles have broken inline images in the `content` HTML body. Hero images (`featuredImage`) work because their files exist in `public/assets/images/blog/`, but inline images reference filenames (e.g., `4-11-1024x576.webp`) that don't exist on disk — only the filename text appears.

There are 3 orphaned PNG files in `public\new asset\artikel\` — not referenced by any article.

## Solution: Batch Replace with Script

### Image Preparation
| Old File | New Name | Format | Purpose |
|----------|----------|--------|---------|
| `dreamlab_legalitas.png` | `legalitas-a.png` + `legalitas-a.webp` | Legalitas | Distributed to odd-indexed articles |
| `Dreamlab_Maklonkosmetik_skincare_terlengkap.png` | `legalitas-b.png` + `legalitas-b.webp` | Legalitas | Distributed to even-indexed articles |
| `dreamlab_legalitas_cta.png.png` | `cta-wa.png` + `cta-wa.webp` | CTA (WhatsApp) | Every article gets one |

All copied to `public/assets/images/blog/`.

### Replacement Strategy (per article in articles.ts)
1. Count all `<img>` tags in `content` with `bv-data-src="/assets/images/blog/...`
2. **1 inline image** → replace with legalitas (A/B alternating) + inject a new `<figure>CTA</figure>` at end of content
3. **2 inline images** → first → legalitas, second → CTA
4. **3+ inline images** → first → legalitas, last → CTA, remove middle ones (whole `<figure>` blocks)
5. **Distribution**: article index odd → legalitas-a, even → legalitas-b

The `<figure>` + `<a href="https://api.whatsapp.com/send/?phone=62881027240339&text=...">` wrapper structure is preserved. For injected CTA figures, generate a standard WhatsApp link `https://api.whatsapp.com/send/?phone=62881027240339&text=Hi+saya+ingin+konsultasi+untuk+brand+saya`.

### Unchanged
- `featuredImage` (hero) — untouched
- React components (`ArticleTemplate.tsx`, `InteractiveArticleBody.tsx`)
- Styles and layout

### Execution
- Single Node.js script (`scripts/fix-inline-images.mjs`)
- Reads articles.ts, replaces inline content per article, writes back
- Copies + converts images to blog folder
- Verify with `npx next build`
