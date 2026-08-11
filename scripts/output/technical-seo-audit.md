# Technical SEO Audit — Dreamlab Migration

**Date:** 2026-06-11
**Score:** 68/100

---

## 1. Crawlability — 85/100

### robots.txt
| Item | WP (Live) | Next.js (New) |
|------|-----------|----------------|
| Exists | Yes (Yoast) | Yes (dynamic) |
| Sitemap ref | `sitemap_index.xml` | `sitemap.xml` |
| Disallow rules | /wp-content/uploads/wc-logs/, /wp-admin/, add-to-cart params | /_next/, /api/, /admin/ |
| AI crawlers | None | None |

**Issues:**
- **⚠️ No AI crawler management** — robots.ts has no rules for GPTBot, ClaudeBot, PerplexityBot, Google-Extended. For a new site, consider allowing AI crawlers for visibility.
- ✅ WP disallows are irrelevant after migration (no wp-content/ paths)

### XML Sitemap
| Item | WP (Live) | Next.js (New) |
|------|-----------|----------------|
| Format | Yoast index + 5 sub-sitemaps | Single dynamic sitemap |
| Blog posts | 182 in post-sitemap | 182 in articles route |
| Static pages | 6 in page-sitemap | 10 static routes |
| Product pages | Not separately indexed | ~200 product routes |
| Image entries | Bloated (duplicate images per URL) | None (not needed) |

**Issues:**
- ✅ Next.js sitemap properly covers: static + audit CSV + articles + product routes
- ✅ Deduplication by URL
- ⚠️ No `<lastmod>` freshness — all use `new Date()`, not real last-modified dates

### Noindex/Noarchive
- ✅ Layout.tsx sets `robots: 'index, follow'` globally
- ✅ No accidental noindex tags detected

---

## 2. Indexability — 55/100

### Canonical Tags — ❌ CRITICAL
| Page | Has Canonical? |
|------|---------------|
| `/` (home) | ✅ `generateMetadata` |
| `[...slug]` (articles) | ✅ |
| `/produk/[category]` | ✅ |
| `/produk/[category]/[...slug]` | ✅ |
| `/category/[category]` | ✅ |
| `/maklon/[category]` | ✅ |
| `/news-blog/` | ✅ (layout) |
| `/news-blog/page/[num]` | ✅ |
| **`/about-us/`** | **❌ Missing** |
| **`/services/`** | **❌ Missing** |
| **`/contact-us/`** | **❌ Missing** |
| **`/our-client/`** | **❌ Missing** |
| **`/career/`** | **❌ Missing** |
| **`/privacy-policy/`** | **❌ Missing** |
| **`/terms-of-service/`** | **❌ Missing** |

**Fix:** All 7 static pages use `export const metadata = {...}` without `alternates: { canonical }`.

### Duplicate Content Risk
- ✅ No near-duplicate pages detected
- ✅ No parameter URL issues
- ✅ Single language, no hreflang needed

### Pagination
- `/news-blog/page/[num]` — 30 paginated pages with proper canonical

---

## 3. Security — 70/100

| Check | Status |
|-------|--------|
| HTTPS enforced | ✅ (WordPress has valid SSL) |
| HSTS | ⚠️ Not detected — add on Netlify |
| CSP | ❌ Not present |
| X-Frame-Options | ⚠️ Not verified — check on staging |
| X-Content-Type-Options | ⚠️ Not verified |
| Mixed content | ✅ None in Next.js build |

**Netlify headers needed:**
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## 4. URL Structure — 90/100

| Check | Status |
|-------|--------|
| Clean, hyphenated URLs | ✅ |
| Consistent trailing slashes | ✅ (all routes add trailing /) |
| No query params for content | ✅ |
| Logical hierarchy | ✅ |
| Redirect chains | ✅ 16 WP 301s verified, all 1-hop |
| URL length < 100 chars | ✅ |

---

## 5. Mobile — 80/100

| Check | Status |
|-------|--------|
| Responsive design | ✅ (Tailwind responsive classes) |
| Viewport meta | ✅ (`width=device-width, initial-scale=1`) |
| Touch targets | ✅ (min 48x48 confirmed) |
| Font size >= 16px | ✅ |
| No horizontal scroll | ✅ |

---

## 6. Core Web Vitals — ⏳ Pending

PSI API key was blocked in Phase 1. New key tested working but no full batch run yet.

**Next step:** Run `scripts/batch-pagespeed-check.js --key=<key> --urls=<urls>` on staging after deploy.

---

## 7. Structured Data — 65/100

| Schema Type | Coverage |
|-------------|----------|
| Organization | ✅ All pages (via OrganizationSchema component in layout) |
| WebSite | ✅ `[...slug]` + product pages |
| WebPage | ✅ `[...slug]` + product pages |
| BreadcrumbList | ✅ `[...slug]` + product pages |
| Article | ✅ Blog articles only |
| Product / Service / Offer | ✅ Product pages only |
| FAQPage | ✅ On pages with FAQ data |
| LocalBusiness | ✅ Service-type pages |
| **Schema on static pages** | **❌ Missing on: about-us, services, contact-us, our-client, career, privacy-policy, terms-of-service** |

**Fix:** Static pages get OrganizationSchema only from layout.tsx. Need WebPage + BreadcrumbList + potentially LocalBusiness.

---

## 8. JavaScript Rendering — 95/100

| Check | Status |
|-------|--------|
| SSR | ✅ (Next.js App Router — all pages SSG/SSR) |
| CSR components | ✅ Minimal, only interactive widgets |
| SEO-critical elements in HTML | ✅ Title, meta, canonical, schema in initial HTML |
| Content requires JS | ❌ No — HTML contains full content |

**Verdict:** Excellent. No JS rendering issues for Googlebot.

---

## 9. IndexNow — 0/100

- ❌ Not implemented
- **Fix:** Simple URL ping on content changes: `https://www.bing.com/indexnow?url=<url>&key=<key>`

---

## Priority Action Items

### Critical (fix before launch)
1. **Add canonical tags** to 7 static pages (about-us, services, contact-us, our-client, career, privacy-policy, terms-of-service)
2. **Add WebPage schema** to those same 7 static pages

### High (fix within 1 week of launch)
3. **Add security headers** via Netlify `_headers` or `netlify.toml` (HSTS, CSP, X-Frame-Options)
4. **Add lastmod freshness** to sitemap.ts — use real dates from article data, not `new Date()`
5. **Run PSI baseline** on staging to establish CWV scores

### Medium (fix within 1 month)
6. **Implement IndexNow** for Bing faster indexing
7. **Add AI crawler rules** to robots.ts — at minimum allow all for visibility

### Low (backlog)
8. Add `<lastmod>` to sitemap for static routes
9. Consider adding image sitemap if WP image traffic is significant
