# Recovery Plan

| Priority | Action | Affected URLs | Evidence | Expected outcome | Validation | Rollback |
|---|---|---|---|---|---|---|
| P0 | Export full GSC Page Indexing URL lists for all reasons | 1,141 non-indexed | GSC UI counts; API unavailable | Know exact important vs expected exclusions | CSV imported to audit sheet | None; read-only |
| P0 | Validate and resubmit current sitemap | 331 live sitemap URLs | live-sitemap-urls.txt; sitemap.ts policy | Google stops seeing legacy/noindex/redirect URLs as submitted | GSC sitemap success + verify:sitemap pass | Revert sitemap policy only if important URL missing |
| P0 | GA4/GTM lead tracking audit | all organic landing pages/leads | GA4 unavailable in audit | Separate SEO traffic loss from tracking/conversion loss | DebugView/Data API events match leads | Restore previous tags/container version |
| P1 | Review redirect relevance for money legacy URLs | /maklon-parfum/, parfum/city/service URLs | live-url-checks.csv 308 samples | Preserve commercial intent equity | URL Inspection canonical + GSC page/query recovery | Change redirect destination back |
| P1 | Inspect top 50 page/query losses | top losses in raw CSV | gsc-page-loss-7v7.csv | Find pages where rank/indexing actually fell | URL Inspection + SERP + content diff | No code rollback; update content/linking |
| P2 | Crawl current internal link graph | 331 sitemap URLs | current link_count sample only | Detect orphan/low-link important pages | crawl report inbound links | Remove added links if UX issue |
| P2 | Classify 179/182 old articles | old mapping/articles | seo-mapping + GSC performance | Reduce index bloat without killing traffic | KEEP/UPDATE/MERGE/REDIRECT/NOINDEX matrix | Undo noindex/redirect if traffic loss |

## Roadmap

### 24 jam
Export GSC Page Indexing lengkap, validate sitemap production, run URL Inspection untuk service pages dan top loss pages, audit GA4/GTM conversion events.

### Hari 2-3
Putuskan redirect destination untuk legacy money URLs; fix only if evidence shows irrelevant destination. Buat internal link report current.

### Hari 4-7
Content diff top 20 historical pages; update pages yang kehilangan intent/H1/title/coverage. Submit only final canonical URLs.

### Minggu 2
Triage 505 crawled-not-indexed by traffic/business relevance. Merge/noindex/delete only low-value proven URLs.

### Minggu 3-4
Rebuild supporting content clusters around maklon kosmetik, skincare, parfum, bodycare, haircare with links to service pages.

### Bulan 2-3
Growth work: new content, schema refinements, backlinks/local authority after migration regression stabilizes.

## Yang tidak boleh dilakukan dahulu

Jangan menghapus/noindex massal 1.140 URL, jangan redirect semua 404 ke homepage, jangan request indexing untuk redirect/noindex/duplicate URLs, jangan mengukur sukses dari turunnya total excluded URL.
