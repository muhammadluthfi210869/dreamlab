# Priority Recovery Roadmap

## Scoring Formula

Priority Score = (Business value × 4) + (Historical traffic × 3) + (Current loss × 3) + (Lead potential × 4) + (Technical severity × 3) + (Confidence × 2) - (Effort × 2)

Where each component is 0-5.

## P0: Active loss on money pages (24 hours)

| # | Priority | Task | Exact URLs | Exact files | Owner | Effort | Evidence | KPI | Validation date | Rollback |
|---| -------- | ---- | ---------- | ----------- | ----- | ------ | -------- | --- | --------------- | -------- |
| 1 | P0 | Fix redirect /maklon-parfum/ destination from /google-ads/maklon-parfum/ to /parfum/ or restore standalone page | /maklon-parfum/ → change destination | next.config.ts:122-224 (redirects section), src/lib/seo-url-policy.ts | Developer | 1 hour | live-url-checks.csv row 12: 308 to /google-ads/maklon-parfum/ with no canonical | GSC URL Inspection shows correct destination after recrawl | 3 days | Revert to previous destination |
| 2 | P0 | Fix redirect /maklon-face-mist/ destination from /produk/skincare/ to dedicated page | /maklon-face-mist/ → change destination | next.config.ts redirects | Developer | 1 hour | live-url-checks.csv row 39: 308 to /produk/skincare/ | URL Inspection shows correct destination | 3 days | Revert to previous destination |
| 3 | P0 | Fix redirect /pabrik-parfum-surabaya/ from /produk/parfum/ to location-specific page | /pabrik-parfum-surabaya/ → change destination | next.config.ts redirects | Developer | 1 hour | live-url-checks.csv row 13: 308 to /produk/parfum/ | URL Inspection shows correct destination | 3 days | Revert to previous destination |
| 4 | P0 | Request indexing for 5 new service pages not appearing in GSC | /pabrik-parfum/, /pabrik-kosmetik/, /jasa-maklon-kosmetik/, /private-label-kosmetik/, /estimasi-biaya-maklon-kosmetik/ | GSC URL Inspection tool | SEO | 30 min | sitemap inclusion verified; pages return 200 but not in GSC performance | Pages appear as "Submitted and indexed" | 7 days | N/A |
| 5 | P0 | Export GA4 organic landing pages + lead events for 28d before/after | N/A - data request | GA4 Admin | Marketing | 2 hours | GA4 data unavailable in audit | CSV exported with sessions, leads by source/medium | 1 day | N/A |

## P1: Recovery opportunities (Days 2-7)

| # | Priority | Task | Exact URLs | Exact files | Owner | Effort | Evidence | KPI | Validation | Rollback |
|---| -------- | ---- | ---------- | ----------- | ----- | ------ | -------- | --- | ---------- | ------- |
| 6 | P1 | Add self-canonical to product category pages missing it | /produk/skincare/, /produk/bodycare/ | src/app/produk/[category]/page.tsx | Developer | 2 hours | Google-selected canonical may differ from declared | URL Inspection shows correct self-canonical | 7 days | Revert canonical code change |
| 7 | P1 | Add internal links from service pages to supporting articles | See internal-link-actions.csv rows 1-24 | Various article page.tsx files | Developer | 4 hours | Current graph shows service pages have low outbound links | Crawl report shows 3+ links from each service page | 3 days | Remove added links |
| 8 | P1 | Fix /maklon-moisturizer-bpom-dreamlab/ redirect destination | /maklon-moisturizer-bpom-dreamlab/ → better destination | next.config.ts redirects | Developer | 1 hour | live-url-checks.csv: redirects to generic /produk/skincare/ | URL Inspection correct | 3 days | Revert |
| 9 | P1 | Update content freshness for top declining B2B pages | /pabrik-parfum-malang-dreamlab/, /pabrik-maklon-kosmetik-surabaya-terlengkap/ | article content in src/data/ | Content team | 4 hours | ranking decline 8.7→11.7 and 10.0→8.3 | Position recovery in 28 days | 28 days | N/A (content update) |
| 10 | P1 | Request indexing for 15+ crawled-not-indexed articles with historical traffic | /dupe-parfum-nagita-slavina-tahan-lama/, /hero-ingredients-2025/, /potensi-bisnis-babycare/, others | GSC URL Inspection | SEO | 2 hours | URLs have historical impressions but now crawled-not-indexed | Indexed status changes to "Submitted and indexed" | 14 days | N/A |

## P2: Quality, consolidation, and internal linking (Week 2)

| # | Priority | Task | Exact URLs | Exact files | Owner | Effort | KPI | Validation |
|---| -------- | ---- | ---------- | ----------- | ----- | ------ | --- | ---------- |
| 11 | P2 | Consolidate duplicate article clusters | /ide-bisnis-kosmetik-2026/ + /ide-bisnis-kosmetik/, /maklon-kosmetik-terbaik/ + /perusahaan-maklon-kosmetik/ | next.config.ts + article data | Developer + Content | 4 hours | 301 redirect destination content match verified | URL Inspection |
| 12 | P2 | Add canonical tags to www subpages currently missing | 24 URLs in canonical-decisions.csv | src/app layout or SEO component | Developer | 2 hours | All www URLs have self-referential canonical | URL Inspection |
| 13 | P2 | Review /blog/ path noindex (potential accidental noindex) | /blog/foot-care..., /blog/pabrik-maklon..., /blog/maklon-hair-care... | Source code or GSC | SEO | 2 hours | Decide to keep noindex or remove noindex for /blog/ articles | URL Inspection |
| 14 | P2 | Add internal links from blog hub to B2B money pages | /news-blog/ → add links to top B2B pages | src/app/news-blog/page.tsx | Developer | 2 hours | Inbound links to B2B pages increase | Crawl report |
| 15 | P2 | Submit updated sitemap if new pages added | N/A - verify current sitemap includes all new pages | src/app/sitemap.ts | Developer | 1 hour | Sitemap includes all 330+ indexable URLs | GSC sitemap status |
| 16 | P2 | Audit /blog/ subdirectory articles for content overlap with /news-blog/ | 6 URLs from noindex decisions | Content comparison | Content team | 2 hours | No duplicate content between /blog/ and /news-blog/ paths | Manual comparison |

## P3: Maintenance and cleanup (Weeks 3-4)

| # | Priority | Task | Expected outcome | Effort |
|---| -------- | ---- | ---------------- | ------ |
| 17 | P3 | Return 410 for deprecated CMS block URLs | /cms_block_cat/pop-up-form/, /e-floating-buttons/popup-website/ | 1 hour |
| 18 | P3 | Remove author pagination from sitemap if present | /author/admin/page/* URLs | 30 min |
| 19 | P3 | Review and cleanup legacy feed URLs in GSC | All /feed/ URLs should naturally drop from index | 30 min |
| 20 | P3 | Monitor GSC crawled-not-indexed count decrease | Expected to decrease as sitemap cleanup takes effect | Ongoing |
| 21 | P3 | Verify noindex is correctly applied to system pages | /cart/, /my-account/, /checkout/, search results | 1 hour |

## Monitoring & Measurement

| KPI | Baseline | Target | Measurement cadence |
| --- | -------- | ------ | ------------------ |
| GSC 28d impressions | 35,958 (latest 28d) | 40,000+ | Weekly |
| Money pages indexed | ~20 verified indexed | All 25+ money pages indexed | Weekly |
| Crawled-not-indexed | 505 | <400 | Weekly |
| GSC clicks | 725 (latest 28d) | 900+ | Weekly |
| /parfum/ position | 25.1 | <15 | Weekly |
| New service pages indexed | 0/5 | 5/5 | Weekly |
| GA4 organic sessions | DATA MISSING | Restore baseline | After GA4 export |
| GA4 organic leads | DATA MISSING | Restore baseline | After GA4 export |
