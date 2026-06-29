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

## Blocked — butuh deploy ke dreamlab.id
- Vercel token dari dashboard dreamlabid team blm ada
- Bisa deploy manual dari GitHub → Vercel dashboard

## Remaining (post-deploy)
- Fase 3: Sitemap cleanup (sitemap_index.xml error + linktree spam sitemaps)
- Fase 4: Monitoring via gsc-coverage-monitor.ts + re-index priority pages via Indexing API
- Canonical category (25): Evaluate if self-referencing canonical needed
- Blocked: All fixes need deploy → Google recrawl (1-4 weeks) to reflect in GSC
