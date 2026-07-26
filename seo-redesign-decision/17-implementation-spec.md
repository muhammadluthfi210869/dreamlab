# Implementation Specification

## Change ID: REDIRECT-001

**Problem:** `/maklon-parfum/` redirects to `/google-ads/maklon-parfum/` (ads landing page) instead of the organic service page `/parfum/`.
**Evidence:** live-url-checks.csv row 12: `https://dreamlab.id/maklon-parfum/` → 308 → `/google-ads/maklon-parfum/` → 200, no canonical tag on destination.
**Affected URLs:** https://dreamlab.id/maklon-parfum/
**Affected file:** `next.config.ts` (redirects section)
**Current behavior:** 308 redirect from `/maklon-parfum/` to `/google-ads/maklon-parfum/`
**Required change:** Change redirect destination from `/google-ads/maklon-parfum/` to `/parfum/`
**Do not change:** Do not delete the `/google-ads/maklon-parfum/` page; it serves ads traffic. Do not change the status code (keep 308).
**Acceptance criteria:** `curl -I https://dreamlab.id/maklon-parfum/` returns 308 with `Location: /parfum/`. `/parfum/` returns 200 with self-canonical.
**Validation:** URL Inspection in GSC after recrawl shows correct canonical and destination.
**Rollback:** Revert to previous destination `/google-ads/maklon-parfum/`.

## Change ID: REDIRECT-002

**Problem:** `/maklon-face-mist/` redirects to `/produk/skincare/` (generic category) instead of a face-mist-specific page.
**Evidence:** live-url-checks.csv row 39: `https://dreamlab.id/maklon-face-mist/` → 308 → `/produk/skincare/`
**Affected URLs:** https://dreamlab.id/maklon-face-mist/
**Affected file:** `next.config.ts` (redirects section)
**Current behavior:** 308 redirect to `/produk/skincare/`
**Required change:** Change redirect to `/produk/skincare/facial-toner/` if that matches intent, or create a dedicated face mist page and redirect there.
**Do not change:** Do not delete the `/produk/skincare/` page. Do not change status code.
**Acceptance criteria:** Redirect lands on a page specifically about face mist/skincare products.
**Validation:** URL Inspection in GSC.
**Rollback:** Revert to previous destination.

## Change ID: REDIRECT-003

**Problem:** `/pabrik-parfum-surabaya/` redirects to `/produk/parfum/` losing Surabaya location intent.
**Evidence:** live-url-checks.csv row 13
**Affected URLs:** https://dreamlab.id/pabrik-parfum-surabaya/
**Affected file:** `next.config.ts` (redirects section)
**Current behavior:** 308 redirect to `/produk/parfum/`
**Required change:** Redirect to a Surabaya-specific parfum page if it exists, or to `/parfum/` with location context preserved.
**Do not change:** Do not remove the `/produk/parfum/` page.
**Acceptance criteria:** URL Inspection shows appropriate destination with location intent.
**Validation:** GSC query performance for "pabrik parfum surabaya" should show new destination.
**Rollback:** Revert to `/produk/parfum/`.

## Change ID: CANONICAL-001

**Problem:** www subpages (24 URLs) lack self-referential canonical tags.
**Evidence:** tag-kanonis.csv shows Google selected non-www as canonical but www pages don't declare it.
**Affected URLs:** www.dreamlab.id/* (24+ URLs)
**Affected file:** `src/app/layout.tsx` (canonical URL logic) or SEO component
**Current behavior:** www pages have no declared canonical tag
**Required change:** Add `<link rel="canonical" href="https://www.dreamlab.id/..."/>` to all www pages, or ensure the non-www version is consistently declared as canonical across all page variants.
**Do not change:** Do not change the sitemap to include www URLs.
**Acceptance criteria:** All www pages now declare `rel="canonical"` pointing to the correct version.
**Validation:** URL Inspection shows "User declared canonical" matches expected.
**Rollback:** Remove the added canonical tags.

## Change ID: INDEXING-001

**Problem:** New service pages (`/pabrik-parfum/`, `/pabrik-kosmetik/`, `/jasa-maklon-kosmetik/`, `/private-label-kosmetik/`, `/estimasi-biaya-maklon-kosmetik/`) are in sitemap but not yet indexed or not appearing in GSC performance.
**Evidence:** Sitemap includes these URLs; GSC performance data doesn't show them.
**Affected URLs:** 5 new service pages
**Affected file:** N/A (GSC action only)
**Current behavior:** Pages return 200, in sitemap, but not indexed or no performance data.
**Required change:** Use GSC URL Inspection to request indexing for each URL.
**Do not change:** Do not add these URLs to sitemap multiple times. Do not change internal linking structure without verifying content quality.
**Acceptance criteria:** All 5 pages show "Submitted and indexed" in GSC within 14 days.
**Validation:** GSC URL Inspection status + Performance data showing impressions.
**Rollback:** N/A

## Change ID: INTERNAL-LINK-001

**Problem:** Service pages (parfum, skincare-face-care, body-care, hair-care, baby-care) have low outbound internal links to supporting B2B articles.
**Evidence:** live-url-checks.csv shows service pages with ~41 links but predominantly navigation, not contextual content links.
**Affected URLs:** Service pages → B2B articles (see internal-link-actions.csv)
**Affected file:** Various `page.tsx` in service page components
**Current behavior:** No contextual links from service pages to related articles
**Required change:** Add contextual links (2-4 per service page) to relevant B2B articles
**Do not change:** Do not add excessive links (>10 per page). Do not use exact-match anchor text repeatedly.
**Acceptance criteria:** Each service page has 2-4 relevant contextual links to B2B articles.
**Validation:** Crawl report shows new internal links. GSC performance for linked articles shows improvement within 28 days.
**Rollback:** Remove added links.

## Change ID: CONTENT-001

**Problem:** B2B location articles `/pabrik-parfum-malang-dreamlab/` and `/pabrik-maklon-kosmetik-surabaya-terlengkap/` are declining in position despite clicks holding or increasing.
**Evidence:** gsc-page-loss-7v7.csv shows position drop from 8.7→11.7 and 10.0→8.3 respectively.
**Affected URLs:** /pabrik-parfum-malang-dreamlab/, /pabrik-maklon-kosmetik-surabaya-terlengkap/
**Affected file:** Article content in src/data/ or CMS
**Current behavior:** Content may be stale, missing freshness signals, or lacking depth.
**Required change:** Update content with current year information, add new stats, improve formatting, add internal links to service pages.
**Do not change:** Do not change the URL slug. Do not add noindex. Do not redirect.
**Acceptance criteria:** Position improves or impressions recover within 28 days.
**Validation:** GSC position tracking for primary queries.
**Rollback:** Restore previous content version.

## Change ID: NOINDEX-REVIEW-001

**Problem:** `/blog/` subdirectory articles are noindexed but contain potentially valuable content that overlaps with `/news-blog/`.
**Evidence:** Dikecualikan oleh tag 'noindex'.csv shows 6+ /blog/ URLs
**Affected URLs:** /blog/* articles
**Affected file:** Source code controlling /blog/ path indexing policy
**Current behavior:** /blog/ path returns noindex
**Required change:** Review whether /blog/ articles should be: (a) merged with /news-blog/ equivalents, (b) redirected to /news-blog/, or (c) have noindex removed if unique content
**Do not change:** Do not mass-remove noindex without content review. Do not create duplicate content between /blog/ and /news-blog/.
**Acceptance criteria:** Each /blog/ URL has a clear decision (keep noindex, merge, or remove noindex).
**Validation:** Manual content comparison between /blog/ and /news-blog/ equivalents.
**Rollback:** Re-apply noindex if needed.
