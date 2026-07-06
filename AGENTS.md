<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Deploy to Vercel

Saat user minta deploy, build dulu dengan `npx next build`, lalu deploy dengan:

```
vercel --prod --token [VERCEL_TOKEN_DARI_DASHBOARD] --yes
```

Info Vercel:
- Team: dreamlabid (Dreamlab)
- Dashboard: https://vercel.com/dreamlabid/dreamlab
- Domain: dreamlab.id
- Owner: dreamlab.official2021@gmail.com

Git push ttp bisa (`git add -A && git commit -m "..." && git push origin master`) tapi GitHub belum connect ke Vercel. Kalau git push gagal minta token GitHub, pakai cara Vercel CLI di atas aja.

# Article Creation Workflow

Simpan prompt ini dan gunakan setiap kali bikin artikel baru.

## Steps (urutan wajib)

### 1. Content Preparation
- Ambil konten dari file `.md.txt` yang diberikan user
- Ambil bagian pembahasan tertentu yang user minta untuk dipertahankan (jika ada)

### 2. Data Entry — `src/data/articles.ts`
- Cari struktur artikel terakhir di file, duplikat objeknya
- Isi field:
  - `slug`: `/nama-artikel` (URL friendly)
  - `title`: H1 / judul artikel
  - `publishDate`: `YYYY-MM-DDT00:00:00+00:00`
  - `author`: `"Dreamlab Maklon Kosmetik"`
  - `categories`: sesuai topik
  - `featuredImage`: nama file gambar
  - `excerpt`: ringkasan pendek (max ~160 chars)
  - `content`: HTML konten artikel, escaped (`\\n`, `\\"`)
  - `seo.title`: meta title (50-60 chars, beda dari H1)
  - `seo.description`: meta description (max ~160 chars)

### 3. HTML Content Rules
- Container: `<div class=\"elementor-element elementor-element-4cdeffb8 elementor-widget elementor-widget-theme-post-content\">`
- Paragraphs: wrapped in `<p>`
- Headings: `<h2>` for main sections, `<h3>` for subsections
- Tables: standard HTML with inline styles (bg, border, padding)
- FAQ: `<details><summary>...</summary><p>...</p></details>`
- All escaped with `\\n` for newlines, `\\"` for quotes

### 4. Images (Tengah & Bawah)
- **Gambar tengah**: `<figure>` after intro paragraph, `bv-data-src=\"/assets/images/blog/dreamlab_maklonkosmetik_artikel_tengah.png\"`
- **Gambar bawah**: `<figure>` before CTA/FAQ, `bv-data-src=\"/assets/images/blog/dreamlab_maklonkosmetik_artikel_akhir.png\"`
- Both images link to: `https://dreamlab.id/thankyou/google/`
- Use `class=\"bv-tag-attr-replace bv-lazyload-tag-img\"` and `style=\"width:auto;height:auto\"`

### 5. Daftar Isi (Table of Contents)
- Add after intro paragraph, before first image
- `<nav>` with cream background, border, rounded corners
- Ordered list `<ol>` linking to all `<h2 id="...">` anchors
- Style: `color:#4a6fa5` for links

### 6. CTA Button
- `<div style=\"text-align:center;margin:48px 0\">`
- Button: `background:#D98A00`, `border-radius:50px`, `font-weight:800`, `box-shadow`
- Text: "Konsultasi Gratis dengan Dreamlab"
- Link: `https://dreamlab.id/thankyou/google/`
- Subtext: "Diskusikan HPP, formula, dan strategi brand serum-mu tanpa komitmen awal."

### 7. Inbound & Outbound Links
- **Inbound**: link ke artikel terkait di dreamlab.id (gunakan `<a href=\"https://dreamlab.id/{slug}/\" style=\"color:#4a6fa5\" target=\"_blank\">`)
- **Outbound**: link ke sumber eksternal otoritatif dengan `rel=\"nofollow\"`
- Minimal 4 inbound + 2 outbound

### 8. SEO Optimization
- H1: unique, keyword-rich, ~50-65 chars
- Meta title: berbeda dari H1, ~50-60 chars, pakai format berbeda
- Meta description: catch people click, max 160 chars
- Excerpt: ringkasan artikel
- Slug: URL friendly

### 9. Git
```bash
git add .
git commit -m "Auto update by OpenCode"
git push origin master
```

# GSC Issue Fix Progress

## Done
### Phase 0 — Infrastructure
- 26 × 404 URLs fixed (14 redirect + 12 410)
- Soft 404 fix deployed (generateMetadata calls notFound())
- Page bloat fix (3.3MB → ~280KB, 92%)
- 7 crawled-not-indexed articles expanded (~500 → 1,563-2,521 words)
- Schema fix (3 issues): shippingDetails inside offers, image absolute URL, priceSpec conditional — test 12/12 pass, commit 95ccc89

### Phase 1 — Anomaly Cleanup (commit 43d7953)
- proxy.ts: /product-category/, /shop/, .php → 410 Gone
- Build: 543 pages, 0 errors

### Phase 2A — proxy.ts expansion (5× more 410 patterns)
- Added: /cms_block_cat/, /cgi-sys/, /checkout/, /cart/, /my-account/, /blog/, /post-sitemap, /search/ (startsWith)
- Added: /feed/ (includes — catches 14 category feed URLs)
- Added: /juaranyaformula/, /$/, /&/ (edge case noindex URLs)
- Now covers all 65 crawled-not-indexed + 22 noindex structural URLs

### Phase 2B — Redirects (commit e799458)
- 20 new 301 redirects for legacy content without existing redirects (memunculkan-keranjang-reels → /news-blog/, pabrik-parfum-surabaya → /produk/parfum/, dll.)
- Fixed dead-end redirect: /pabrik-parfum-surabaya-biaya-2026 → /pabrik-parfum-surabaya/ (was → non-existent page)
- Fixed redirect: /pabrik-parfum-surabaya → /produk/parfum/

## Coverage Impact
| Category | Before | After (code fix) | Need deploy |
|----------|--------|------------------|-------------|
| Crawled-not-indexed | 65 | ~2 (benign non-www variants) | ⏳ deploy |
| Pages with redirect | 34 | ~0 if Vercel www redirect is active | ⏳ deploy |
| Canonical | 25 | ~25 (low priority, content overlap) | ⏳ deploy |
| Noindex | 22 | ~1-2 ($/& — caught by proxy now) | ⏳ deploy |

### Phase 3 — Sitemap Cleanup (commit 7ebc698)
- ✅ Deleted 3 spam/broken sitemaps via GSC API: `sitemap_index.xml` (errors:1), `linktree.dreamlab.id/reliccovereduae.xml`, `linktree.dreamlab.id/forcivekvq.xml`
- ✅ sitemap.ts: Added `contact-medsos/` + `about-us/alur-maklon/` static routes
- ✅ sitemap.ts: Added proxy 410 pattern filter — excludes caught slugs from sitemap
- ✅ sitemap.ts: Added current-site safelist — only includes audit CSV slugs that exist in current app
- Build: 543 pages, 0 errors

### Phase 4 — Schema Validation Baseline & Tools
- ✅ Built `scripts/validate-schema-all.mjs` — validates all product URLs' JSON-LD schema against live site
- ✅ Established baseline: **81 URLs checked, 0 passed**
  - 8 category pages: no Product schema (expected — listing pages with Service+WebPage schema)
  - 73 product detail pages: missing `price`/`priceCurrency` (B2B model — no fixed prices, handled by conditional `priceSpecification`)
  - 3 product pages (`facial-serum`, `facial-toner`, `facial-wash`): **ZERO Product schema** (only Organization) — caused by old deployed code; fixed in current codebase via `generateProductPageSchema()` in `[...slug]/page.tsx`
  - `shippingDetails` inside `offers`, image absolute URL, B2B priceSpec conditional — all fixed in current code (commit 95ccc89) but not deployed
- ✅ Discovered live site has `www.dreamlab.id → dreamlab.id` (307) — canonical is non-www
- 🔄 GSC coverage monitor (`scripts/gsc-coverage-monitor.ts`): partially run (timed out at ~180/329 URLs)
- 🚫 Indexing API (scripts/request-reindex.ts): all 16 URLs failed with `Permission denied` — service account not verified as URL owner

## Blockers
- 🚫 **Deploy ke dreamlab.id**: Vercel token dari dashboard dreamlabid team blm ada. Bisa deploy manual dari GitHub → Vercel dashboard.
- 🚫 **Indexing API**: Service account (`dreamlab-gsc@dreamlab-site.iam.gserviceaccount.com`) bukan URL owner — harus ditambahkan di GSC Settings → Users and permissions.
- 🚫 **Google recrawl**: Semua fix butuh deploy dulu, lalu Google butuh 1-4 minggu untuk recrawl.

## Post-Deploy Checklist
1. ✅ Build with `npx next build` (confirm 543 pages, 0 errors)
2. Run `scripts/validate-schema-all.mjs` against live site — expect 73+/81 passing
3. Run `scripts/gsc-coverage-monitor.ts` — establish baseline, re-run weekly
4. Fix Indexing API ownership — add service account to GSC property owners
5. Run `scripts/request-reindex.ts` — submit 14+ priority product pages
6. Monitor GSC for 1-4 weeks — let Google recrawl and recategorize
7. Evaluate 25 canonical issues (low priority, mostly content overlap on category/article pages)
