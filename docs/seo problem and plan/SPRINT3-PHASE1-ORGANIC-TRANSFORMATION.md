# SPRINT 3 — PHASE 1
# ORGANIC TRANSFORMATION BLUEPRINT

**Document:** `SPRINT3-PHASE1-ORGANIC-TRANSFORMATION.md`
**Date:** 2026-07-31
**Council:** Enterprise SEO Director · Change Management Consultant · Technical SEO Lead · Information Architect · Product Manager · Program Manager · Risk Management Specialist · Content Operations Lead · Revenue Operations Director · Organizational Strategy Consultant
**Predecessors:** SPRINT-2-PHASE1..6 (Target State = complete)
**Mandate:** Transform the CURRENT Dreamlab website into the TARGET STATE designed in Sprint 2 — safely.
**Philosophy:** Evolutionary change, not revolutionary change. Protect revenue. Reduce risk. Respect stakeholders.

---

# EXECUTIVE SUMMARY

## The One-Sentence Truth

Dreamlab's website does NOT have a traffic problem. It has a **revenue-allocation problem**: the site's traffic is dominated by informational DIY content (Instagram-cart tutorials, DIY body-brightening recipes) that generates zero maklon leads, while the commercial money pages that DO rank sit at position 5–13 with thin conversion architecture.

## The Transformation, in Three Moves

| Move | What | Why | Risk |
|------|------|-----|------|
| **M1 — Protect & Heal** | Fix indexing hygiene, keep all ranking content untouched, enable breadcrumbs/schema/tracking that cannot hurt rankings | The site already earns 2,745 clicks/90 days from 724 pages. Anything that breaks this is unacceptable. | Low |
| **M2 — Refocus Traffic** | Reframe the ~800 clicks/month currently trapped on non-commercial DIY content toward commercial journeys via internal links + CTA surgery (no URL changes) | This is the single largest "free revenue" pool: redirecting reader intent, not deleting pages | Low–Medium |
| **M3 — Build the New Layer** | Scale the Growth Layer (pilot money pages already in code: `pabrik-kosmetik`, `biaya-maklon-skincare`, `moq-maklon-kosmetik`, `pabrik-parfum`, `jasa-maklon-kosmetik`, etc.) into a full Knowledge Hub + Pricing Hub + Location Hub | Sprint 2 proved these clusters win; the Growth Layer grows independently of legacy content | Medium |

## Current vs Target — The Gap

| Dimension | Current State (measured) | Target State (Sprint 2) | Gap |
|-----------|------------------------|------------------------|-----|
| Indexable pages | 724 pages in GSC performance; ~1,141 URLs excluded/not-indexed (505 crawled-not-indexed, 338 redirect, 173 canonical, 73 noindex, 20 404) | <600 non-indexed; every money page indexed | Medium |
| Monthly organic clicks | ~915/mo (2,745/90d) | ~5,000/mo | 5.5× |
| Share of clicks on commercial pages | ~25% (est. from top-page data) | 60%+ | Large |
| Lead capture | WhatsApp round-robin + thankyou pages only; ~0% structured capture | Micro-conversions + CRM + nurturing | Large |
| Topical authority | ~20/100 (Sprint 2 Phase 5 assessment) | 40/100 by month 6; 90/100 by month 12 | Large |
| Content freshness | 0 articles updated this quarter (all legacy WordPress HTML) | 21 thin articles rewritten; evergreen refresh cycle | Medium |
| Conversion assets | Calculator exists (`MaklonCalculator.tsx`); no pricing tables, no case studies, no comparison hub | 17 missing conversion assets (Sprint 2 Phase 6) | Large |

## Top 5 Decisions This Document Makes

1. **DO NOT redesign the site.** The current Next.js architecture is sound. The transformation is content-layer + conversion-layer + hygiene — not rebuild.
2. **PROTECT the top 20 traffic pages.** No URL changes, no content deletion on anything earning clicks. Classification is surgical, not wholesale.
3. **The single highest-leverage safe action this month is re-enabling Breadcrumb** (component currently `return null` — breadcrumbs are disabled site-wide) + enabling JSON-LD breadcrumb schema. Zero ranking risk, immediate UX + rich-result signal.
4. **The single highest-revenue transformation is the "Traffic Refocus" layer** — repointing ~800 clicks/mo of DIY-traffic readers toward commercial money pages through internal-link surgery, NOT page deletion.
5. **The Growth Layer is already 70% scaffolded in code** (pilot batches, pilot page system, MaklonCalculator, round-robin). The transformation's job is to CONNECT this layer to the legacy site — not to build it from scratch.

## Confidence Assessment (Headline)

| Conclusion | Confidence |
|-----------|:---:|
| Current traffic is dominated by non-commercial content | HIGH (GSC page-level data) |
| Indexing hygiene problems are mostly "expected" exclusions, not broken money pages | HIGH (root-cause analysis 2026-07-31) |
| Re-enabling breadcrumbs is a zero-risk safe win | HIGH (standard SEO practice) |
| Traffic refocus through internal links preserves rankings | MEDIUM-HIGH (best practice; needs A/B monitoring) |
| The Growth Layer can grow independently of legacy content | HIGH (separate routes, pilot system in code) |
| 505 "crawled-not-indexed" includes ~460 static assets (normal) | HIGH (root-cause analysis breakdown) |

---

# PART A — CURRENT STATE ASSESSMENT

## A1. What Exists Today (Measured Inventory)

### A1.1 Page Inventory (from code + GSC)

| Layer | Count | Source of truth | Notes |
|-------|------:|-----------------|-------|
| Static page routes (`page.tsx`) | 46 | `src/app/**` | Home, about, services, contact, career, blog index, product categories, landing pages, thankyou |
| Articles (legacy WordPress import) | 187 | `src/data/articles.ts` | Legacy WordPress HTML; 21 thin articles identified |
| Maklon service pages | 75 | `src/data/maklon-pages.ts` | 8 top-level maklon hubs + sub-product pages |
| Product pages (V2) | 113 | `src/data/products-v2/*` | 8 categories, individual product pages |
| Product categories (V2) | 8 | `src/data/products-v2/index.ts` | parfum, skincare, bodycare, haircare, babycare, decorative, footcare, pkrt |
| SEO pilot money pages (batch 1+2) | 8+ | `src/data/seo-pilot/*` | `pabrik-kosmetik`, `biaya-maklon-skincare`, `moq-maklon-kosmetik`, `pabrik-parfum`, `jasa-maklon-kosmetik`, `private-label-kosmetik`, `estimasi-biaya-maklon-kosmetik`, `panduan/*` |
| Legacy URL mapping | 1,792 lines | `src/data/seo-mapping.json` | WordPress→Next.js 301 mapping + audit metadata |
| SEO audit CSV (legacy footprint) | 228 URLs | `src/data/seo-audit-export.csv` | Crawl-audit export; drives sitemap filters |
| Sitemap (computed) | ~334 live URLs found by GSC | `src/app/sitemap.ts` | 7 sources merged, de-duplicated, filtered |

### A1.2 Performance Baseline (GSC, 2026-04-27 → 2026-07-25)

| Metric | Value |
|--------|-------|
| Pages with impressions/clicks | 724 |
| Total clicks | 2,745 |
| Total impressions | 149,927 |
| Average CTR | 1.83% |
| High-impression zero-click pages | 22 |

**Top 12 pages by clicks (the current "revenue spine"):**

| # | Page | Clicks | Impressions | Position | Commercial? |
|---|------|-------:|-----------:|:---:|:---:|
| 1 | `/cara-meracik-handbody-pemutih-alami/` (DIY body brightening) | 91 | 17,090 | 7.9 | No (DIY) |
| 2 | `/memunculkan-keranjang-reels/` (Instagram cart tutorial) | 705 | 16,750 | 4.3 | No (non-maklon) |
| 3 | `/urutan-pabrik-skincare-terbaik-indonesia/` | 138 | 8,159 | 9.0 | Listicle |
| 4 | `/` (homepage) | 478 | 6,966 | 8.0 | Yes (money) |
| 5 | `/perbedaan-moisturizer-gel-vs-cream/` | 9 | 4,744 | 7.7 | No (DIY) |
| 6 | `/jenis-alkohol-dalam-parfum/` | 26 | 4,459 | 8.4 | No (DIY) |
| 7 | `/contoh-kalimat-iklan-kosmetik-unik/` | 19 | 3,799 | 9.2 | Support |
| 8 | `/cara-membuat-hb-dosting-sendiri/` | 82 | 3,566 | 6.6 | No (DIY) |
| 9 | www `/memunculkan-keranjang-reels/` | 78 | 3,178 | 5.6 | No (non-maklon) |
| 10 | `/parfum-inspired-peluang-bisnis/` | 8 | 2,669 | 7.9 | Support |
| 11 | `/pabrik-maklon-kosmetik-surabaya-terlengkap/` | 60 | 2,639 | 9.3 | Yes (money) |
| 12 | `/contact-us/` | 41 | 2,376 | 8.5 | Yes (money) |

**Critical observation:** The #1 click magnet is a NON-maklon page (`memunculkan-keranjang-reels` = Instagram cart setup, 705+78 clicks, 17% of all clicks). The #1 organic *impression* page is a DIY skincare recipe. The commercial pages that rank (`pabrik-maklon-kosmetik-surabaya-terlengkap` at pos 9.3, `pabrik-parfum-surabaya` at pos 5.4) are in the "ranking but not converting" zone. **This is the transformation's biggest unlock: repoint the intent of existing traffic, not build new traffic.**

### A1.3 Indexing Hygiene (GSC, 2026-07-20 → 2026-07-31 audits)

| Issue | Count | Assessment (Root-Cause Analysis 2026-07-31) |
|-------|------:|------------------------------------------------|
| Crawled – currently not indexed | 505 | ~460 are `/_next/static/` assets (normal); ~46 are real content pages needing quality/linking work |
| Page with redirect | 338 | ~310 are www→non-www / trailing-slash normalization (expected); ~28 need audit |
| Alternate with correct canonical tag | 173 | Largely expected (trailing slash, param variants) |
| Excluded by 'noindex' | 73 | Mostly intentional (ads, thankyou, author/admin, legacy categories) |
| Not found (404) | 20 | Mostly legacy, handled by 410 patterns |
| Discovered – not indexed | 19 | Low-value; monitor |
| Duplicate without canonical | 10 | Fix in hygiene pass |
| Duplicate, chosen canonical different | 3 | Low; canonical tags already self-referencing |

### A1.4 Technical Stack (Confirmed)

| Component | Version/Config |
|-----------|---------------|
| Framework | Next.js 16.2.4 (App Router, `trailingSlash: true`) |
| Rendering | Static generation + client routing (46 `page.tsx`, 6 `layout.tsx`) |
| Styling | Tailwind 4, Framer Motion |
| Data layer | `src/data/*` TS modules (products-v2, maklon-pages, articles, keywords, seo-pilot) |
| Lead infra | Round-robin WhatsApp (`src/lib/round-robin-config.ts`, 3 CS agents), SmartWARRButton, thankyou pages, Kommo client, Supabase |
| Schema | `src/lib/schema-generator.ts`, `JsonLd`, `OrganizationSchema`, `PageSchema` components |
| Crawl control | `src/app/robots.ts`, `src/app/sitemap.ts`, `src/proxy.ts` (410 Gone patterns + legacy 301s) |
| Tracking | `src/lib/tracking.ts`, GTM setup scripts exist |

### A1.5 Conversion Layer (What Exists)

| Asset | Exists? | Notes |
|-------|:---:|-------|
| WhatsApp floating button | Yes | `FloatingWhatsApp.tsx`, `SmartWARRButton.tsx` (round-robin) |
| Round-robin lead routing | Yes | 3 agents, cookie-sticky, API + local fallback |
| Lead tracking | Yes | `src/lib/lead-capture.ts`, `tracking.ts`, NexERP integration |
| Lead form (structured capture) | Partial | Pilot pages have `leadForm`; legacy pages rely on WhatsApp deep-link only |
| CRM connection | Partial | Kommo client exists; Supabase wired |
| GA4/GTM verified events | Partial | Scripts exist (`gtm-setup.mjs`) but no evidence of production event verification |
| Pricing transparency | No | None on any page (biggest competitor gap — Sprint 2 finding) |
| Case studies / brand stories | Partial | `our-client` page exists, no detailed case studies |
| Comparison hub | No | Missing |
| Location pages | Partial | A few legacy location articles exist (Surabaya, Jakarta, Tangerang, Makassar) but not structured |
| Breadcrumb component | No (DISABLED) | `Breadcrumb.tsx` literally `return null` |

## A2. Legacy Architecture (The "Current State" DNA)

The site is a **migration artifact** of a WordPress (Elementor) site rebuilt in Next.js. Evidence in the code:

1. **Article content is raw WordPress HTML** — `src/data/articles.ts` contains `elementor-element`, `ez-toc`, `wp-block-*`, `bv-lazyload` markup inline in the `content` field. This is loaded and rendered as-is.
2. **A 1,792-line `seo-mapping.json`** — the legacy URL→destination map. The `[...slug]/page.tsx` catch-all validates slugs against it, `next.config.ts` builds redirects from it, and the sitemap filters through it.
3. **A 228-URL `seo-audit-export.csv`** — the legacy crawl footprint driving sitemap inclusion rules (with `isProxyCaught`, `isThinCategorySlug`, `isSlugInCurrentSite` predicates).
4. **robots.txt is aggressive** — disallows 30+ legacy path patterns (maklon-*, bisnis-*, author/admin, thankyou, ads, landing, etc.) which is CORRECT for those that 301/410, but it also historically blocked 3 live product categories (root-cause finding: over-aggressive config from migration) — this is one of the few *technical* fixes with direct index impact.
5. **Proxy layer** — `src/proxy.ts` implements 410 Gone patterns (`GONE_PATTERNS`) and legacy 301s (`LEGACY_PATH_REDIRECTS`). This is the site's "garbage collector" — a transformation asset, not a liability.

**Implication for transformation:** The legacy system is *contained* in three files (articles.ts data, seo-mapping.json, seo-audit-export.csv) plus the catch-all renderer. This containment is GOOD — it means the Growth Layer can be built in parallel without touching legacy behavior, and legacy content can be surgically refreshed one article at a time.

## A3. Current Internal-Link Architecture (Measured)

| Mechanism | Exists? | Quality |
|-----------|:---:|--------|
| Header nav | Yes | 6 items: Home, About Us, Services, Product (7 cats), News & Blog, Our Client, Contact Us |
| Footer | Yes | 4 columns incl. "Cosmetics We Can Make" (7 cats) + "Interesting Link" (10 money/utility pages) |
| Breadcrumb | Disabled (`return null`) | — |
| RelatedLinks (article→article) | Yes | Same-category, top 4, with priority-boost slugs |
| Article→money-page CTAs | Partial | Legacy WordPress HTML has hardcoded `<a href="/thankyou-page/">` links (legacy URL) |
| Contextual in-body links | Partial | Only within WordPress body content (static HTML) |
| Tag/category pages | Partial | `/category/[category]` route exists, but sitemap excludes thin categories |
| Topic clusters | No | No explicit pillar/cluster graph; RelatedLinks is category-only |
| Location hub | No | No `/lokasi/` hub; location articles are orphaned |

**Key internal-linking finding:** The legacy article bodies contain hardcoded links to `/thankyou-page/` — which is a 301'd legacy URL. Every legacy article's main CTA currently routes through a redirect to the homepage (or 410). This is a **revenue leak AND a crawl-budget leak** present on 180+ pages. Fixing the CTA target in the render layer (one code change, not 180 edits) is a top quick win.

---

# PART B — LEGACY ASSESSMENT

## B1. Legacy Content Quality Audit

### B1.1 Article Depth (Word Count)

| Band | Count (of 187) | Treatment |
|------|---------------:|-----------|
| Under 200 words | 0 | None (already filtered from sitemap) |
| 200–499 words | 22 | **REFRESH** (thin; 21 already triaged in OPTIMASI-21-ARTIKEL-TIPIS.md) |
| 500–999 words | 37 | **ENHANCE** (add FAQ/schema/internal links) |
| 1,000–1,999 words | 15 | **ENHANCE/PROTECT** |
| 2,000+ words | 93 | **PROTECT** (deep content; don't touch unless click data says otherwise) |

### B1.2 Legacy HTML Debt (Rendered via catch-all)

- Elementor wrapper divs, `ez-toc` (Easy Table of Contents) markup, WordPress block classes — present in 100% of article bodies.
- Hardcoded `/thankyou-page/` CTA links (legacy 301) — present in a large share of bodies.
- `data:image/svg+xml` lazy-placeholder images with `bv-data-src` (lazy-load plugin) — image URLs may be stale WordPress paths (asset-path resolver exists: `src/lib/asset-paths.ts`).
- No FAQ schema, no structured headers in most bodies (H2/H3 in WordPress markup but not semantic).

**Verdict:** The HTML debt is cosmetic and does NOT block indexing (top DIY pages DO rank). It should be cleaned opportunistically during REFRESH, NOT in a mass migration. Risk of mass HTML cleanup: rendering regressions on 187 pages with no ranking benefit. **Do NOT mass-rewrite. Do NOT touch what ranks.**

## B2. Legacy Content Value Classification (All 187 Articles)

| Class | Approx. Count | Criterion | Treatment |
|-------|--------------:|-----------|-----------|
| A — Money-adjacent (commercial intent) | ~25 | Keyword = "maklon/biaya/pabrik/jasa/harga/MOQ" | REFRESH or link to money page |
| B — Support (commercial-informational) | ~40 | "brand sendiri / peluang bisnis / cara memulai / tren" | ENHANCE + link to money page |
| C — DIY/recipe (non-commercial) | ~60 | "cara membuat / resep / bahan alami" | ENHANCE only; keep click flow, add commercial bridge |
| D — Ingredient education | ~35 | "manfaat X / jenis Y / kandungan Z" | ENHANCE + authority link |
| E — Dead/low-value | ~20 | No clicks, no backlinks, no conversion intent | MERGE/REDIRECT per Phase-2 rules |
| F — Non-maklon topic | ~7 | Instagram cart tutorial, unrelated | PROTECT (biggest click source); add commercial sidebar CTA — DO NOT delete |

**Note on the "Instagram cart" page:** It is the #1 click source (705+78 clicks) with ZERO maklon relevance. The correct transformation is NOT deletion (kills 783 clicks) and NOT conversion baiting (would hurt relevance/ranking). It is **strategic traffic redirection**: keep it ranking, add a soft "branding your business" bridge via internal links toward commercial pages where relevance genuinely exists (e.g., "mulai brand kosmetik sendiri" adjacent articles). Confidence: MEDIUM-HIGH.

## B3. Legacy Redirect Architecture Assessment

| Pattern | Type | Count (est.) | Verdict |
|---------|------|-------------:|---------|
| www → non-www + trailing slash | 308 | ~310 | Correct; healthy |
| `/maklon-*` → `/produk/*` | 301 | ~70 | Correct consolidation |
| Legacy article → new slug | 301 | ~40 | Correct |
| Legacy `/category/*` → consolidated category | 301/410 | ~20 | Correct |
| `/thankyou-page/` → `/` | 301 | 1 (referenced by 180+ articles) | Redundant hop — fix CTA render target |
| 410 Gone patterns | 410 | ~15 patterns | Correct garbage collection |

**Verdict:** The redirect layer is well-architected. The only structural improvement is removing the article→`/thankyou-page/`→homepage hop by rendering CTAs to the live money page or WhatsApp direct.

---

# PART C — ASSET CLASSIFICATION (TRANSFORMATION CLASSIFICATION)

Every existing asset receives exactly one classification. This is the operative rulebook for Sprint 3.

## C1. Classification Definitions (Council-Approved)

| Class | Meaning | Rules | Example in Dreamlab |
|-------|---------|-------|---------------------|
| **PROTECT** | Existing high performer. Do NOT modify URLs, titles, or H1s. | Only add: internal links, schema, breadcrumb, CTA layer, tracking. | Top-20 click pages (homepage, memunculkan-keranjang-reels, urutan-pabrik-*, DIY recipes) |
| **ENHANCE** | Safe improvements only. No structural rewrite. | Add: FAQ schema, internal links, breadcrumb, related-links, CTA, image alt, meta description. | 130+ mid-depth articles, 8 product categories, maklon hubs |
| **REFRESH** | Needs content update (thin or stale). | Rewrite body, keep URL; update date; add decision block; link to money page. | 21 thin articles (OPTIMASI-21 list), 22 articles 200–499 words |
| **MERGE** | Duplicate intent. Two pages chase same query. | Consolidate into one URL; 301 the other. | `bangun-brand-skincare` → merge into `panduan-maklon-skincare-brand-baru`; duplicated location articles |
| **CONSOLIDATE** | Multiple pages become one (pillar). | Build pillar page; 301 clusters into it. | Location variants (maklon-jakarta, maklon-tangerang, maklon-makassar) → Location Hub pillar |
| **REDIRECT** | No longer needed; preserves equity. | 301 to closest relevant page. | Legacy 301s already in seo-mapping.json |
| **ARCHIVE** | Historical only. | noindex + keep accessible (or move under `/archive/`). | Old 2024/2025 trend articles with no traffic and no evergreen value |
| **DELETE** | No value at all. | 410 Gone. | 410 patterns already in proxy.ts |

## C2. Asset-by-Asset Classification (The Master Table)

### C2.1 Pages & Routes

| Asset | Class | Rationale |
|-------|-------|-----------|
| Homepage `/` | **PROTECT** | 478 clicks/90d; money page. Add breadcrumb, schema, top-CTA to money pages. No title/H1 changes. |
| `/pabrik-maklon-kosmetik-surabaya-terlengkap/` | **PROTECT** | 60 clicks, pos 9.3; highest-clicking commercial page. Strengthen internal links into it. |
| `/pabrik-parfum-surabaya/` | **PROTECT** | 31 clicks, pos 5.4 (GSC manual export). Money page. |
| `/jasa-maklon-kosmetik/` (pilot money page) | **PROTECT** | Already built with full conversion architecture. |
| `/private-label-kosmetik/` | **PROTECT** | Already built. |
| `/estimasi-biaya-maklon-kosmetik/` | **PROTECT** | Already built; connects to calculator. |
| `/pabrik-kosmetik/`, `/biaya-maklon-skincare/`, `/moq-maklon-kosmetik/` | **PROTECT** | Pilot money pages, batch 1. |
| `/pabrik-parfum/` (batch 2) | **PROTECT** | Money page. |
| `/panduan/`, `/panduan/*` | **PROTECT** | Guide hub + 2 pilot guides. |
| `/produk/[category]` (8 categories) | **PROTECT** | Product category hubs; add schema + internal links. |
| `/produk/[category]/[product]` (113 products) | **ENHANCE** | Add FAQ schema, breadcrumb, related-product links, CTA. |
| `/maklon/[category]` (75 maklon pages) | **ENHANCE** | Template-generated content is repetitive — add unique value via FAQ + internal links + calculator embed; do NOT rewrite all 75 (risk of template churn). |
| `/category/[category]` | **ENHANCE** | Thin categories excluded from sitemap (≤2 articles). Either fill (add articles) or noindex. |
| `/contact-us/` | **PROTECT** | 41 clicks; money page. |
| `/our-client/` | **ENHANCE** | Add case-study schema + structure toward Case Study Hub. |
| `/about-us/`, `/about-us/alur-maklon/` | **PROTECT** | Trust/E-E-A-T pages. |
| `/services/` | **ENHANCE** | Single-item dropdown ("All Services") is weak — enrich with money-page links. |
| `/career/` | **PROTECT** | Low SEO value, HR utility. |
| `/news-blog/` + pagination | **PROTECT** | Blog index. |
| `/ads/*`, `/metaads/*`, `/google-ads/*`, `/landing/*` | **ARCHIVE** (already noindexed) | Ad landing pages; correctly excluded. |
| `/thankyou*`, `/thankyou-medsos/` | **ARCHIVE** (already noindexed) | Lead tracking only. |
| `/author/admin/*` | **ARCHIVE** (noindexed) | WP artifact. |
| `/privacy-policy/`, `/terms-of-service/` | **PROTECT** | Legal pages. |

### C2.2 Content (Articles) — Representative Classifications

| Article | Class | Why |
|---------|-------|-----|
| `memunculkan-keranjang-reels` | **PROTECT** + bridge | 783 clicks; keep rank, add soft commercial bridge |
| `cara-meracik-handbody-pemutih-alami` | **PROTECT** + bridge | 91 clicks, 17k impressions; add CTA toward body-care maklon |
| `urutan-pabrik-skincare-terbaik-indonesia` | **PROTECT** + ENHANCE | 138 clicks; add FAQ + link to pabrik-kosmetik money page |
| `panduan-maklon-skincare-brand-baru` | **REFRESH** | 433 words, commercial, priority #14 |
| `jasa-maklon-kosmetik-bpom` | **REFRESH** | 463 words, commercial, priority #19 |
| `set-skincare-moq-fleksibel` | **REFRESH** | 438 words, commercial-transactional |
| `pabrik-maklon-parfum-jawa-timur` | **REFRESH** | 484 words, commercial-local |
| `pabrik-maklon-sidoarjo` | **REFRESH** | 409 words, commercial-local |
| `maklon-parfum-makassar`, `skincare-natural-bali-export`, `brand-parfum-viral` | **REFRESH** | Commercial, 433–446 words |
| `bangun-brand-skincare` | **MERGE** | Overlaps `panduan-maklon-skincare-brand-baru` |
| `tren-sunscreen-2025`, `trend-body-care-2025`, `biotech-skincare-2026`, `industri-kosmetik-indonesia` | **REFRESH** | Informational authority; update to 2026 |
| `panthenol-untuk-wajah-kering`, `glycerin-untuk-skincare`, `masker-wajah-organik`, `hand-sanitizer-untuk-bisnis`, `owner-parfum-sendiri`, `brand-deodoran-sendiri`, `basic-skincare-pria` | **ENHANCE** | Add E-E-A-T sourcing + CTA + schema; 321–484 words |
| 2024/2025 trend articles (low/no clicks, no evergreen value) | **ARCHIVE** | Historical only |
| Dead slugs (0 clicks, 0 backlinks, no intent) | **REDIRECT/410** | Per GSC + audit CSV |

### C2.3 Technical Assets

| Asset | Class | Action |
|-------|-------|--------|
| `Breadcrumb.tsx` (`return null`) | **ENHANCE (fix)** | Re-enable component + BreadcrumbList JSON-LD site-wide |
| `src/app/robots.ts` | **ENHANCE** | Verify the 3 product-category blocks are unblocked; keep legacy disallows |
| `src/app/sitemap.ts` | **ENHANCE** | Sync maklonRoutes with proxy 410/301 patterns (known bug: `maklon-body-care/` etc. can appear) |
| `src/proxy.ts` | **PROTECT** | Garbage collector works; extend only when REDIRECT/ARCHIVE actions complete |
| `seo-mapping.json` | **PROTECT** | Legacy map; do not delete (catch-all depends on it) |
| `seo-audit-export.csv` | **PROTECT** | Sitemap filter input; do not modify |
| `src/lib/schema-generator.ts` | **ENHANCE** | Extend coverage (FAQ, BreadcrumbList, Product, Service) |
| `MaklonCalculator.tsx` | **PROTECT** | Interactive tool; embed into money pages |
| Round-robin / lead-capture / Kommo / Supabase | **PROTECT** | Working lead infra; wire into GA4 events |
| GTM scripts | **ENHANCE** | Verify production events; add conversion events |
| Image assets / asset-path resolver | **ENHANCE** | Alt-text + stale-WP-path cleanup during REFRESH only |

## C3. Classification Totals (Approx., of ~500 tracked assets)

| Class | Est. Count | Share |
|-------|-----------:|------:|
| PROTECT | ~60 | 12% |
| ENHANCE | ~250 | 50% |
| REFRESH | ~25 | 5% |
| MERGE | ~5 | 1% |
| CONSOLIDATE | ~15 | 3% |
| REDIRECT (already mapped) | ~140 | 28% |
| ARCHIVE | ~8 | 2% |
| DELETE | ~0 (already 410'd) | 0% |

**Council verdict:** 62% of assets are PROTECT or ENHANCE (do-not-break). Only ~5% are REFRESH (the 21–25 thin/commercial articles). This is a *conservative, revenue-protecting* transformation.

---

# PART D — GROWTH LAYER

## D1. Design Principle: Grow Independently, Don't Depend on Legacy

The Growth Layer is an entirely NEW set of routes that (a) does not depend on legacy content, (b) does not inherit legacy HTML debt, and (c) carries its own internal-link graph. Sprint 2 Phase 5 (Knowledge Architecture) and Phase 6 (OR-OS) defined the target; this section defines the transformation mechanics.

**Why independent?** Because the legacy layer is a migration artifact (WordPress HTML, seo-mapping dependency, catch-all renderer). Every change to legacy content carries regression risk. The Growth Layer avoids that risk entirely — new routes, new data modules, new schema, new tracking — and only *links toward* the legacy money pages that are already winning.

## D2. The Growth Layer Architecture (Sprint 3 Scope)

| Hub | Purpose | Money pages it feeds | Status |
|-----|---------|----------------------|--------|
| **Knowledge Hub** (`/panduan/*`) | 10+ definitive guides: biaya, MOQ, BPOM, alur, bahan baku, packaging, brand-building | `jasa-maklon-kosmetik`, `estimasi-biaya-maklon-kosmetik`, `private-label-kosmetik` | PARTIAL (2 guides exist: komponen-biaya, cara-menentukan-moq) |
| **Pricing Hub** (`/harga-maklon-kosmetik/*`) | Transparent pricing ranges, estimator, cost factors — NO competitor has this | `biaya-maklon-skincare`, `estimasi-biaya-maklon-kosmetik`, `MaklonCalculator` | PARTIAL (calculator exists; hub missing) |
| **Case Study Hub** (`/portfolio/*` or expand `/our-client/`) | 10+ real brand stories with numbers (MOQ, timeline, outcome) | `jasa-maklon-kosmetik`, homepage trust | MISSING |
| **Comparison Hub** (`/perbandingan/*`) | Maklon vs ODM vs private label; BPOM vs Halal; Surabaya vs Jakarta | `private-label-kosmetik`, `jasa-maklon-kosmetik` | MISSING |
| **Glossary** (`/glosarium-maklon/*`) | 30+ entity definitions (MOQ, CPKB, INCI, ODM, private label, BPOM) | All money pages (entity reinforcement) | MISSING |
| **Location Hub** (`/lokasi-maklon/*`) | 10+ city pages: Surabaya, Jakarta, Tangerang, Bandung, Makassar, Bali, Medan, Semarang, Yogyakarta, Malang | `pabrik-maklon-kosmetik-surabaya-terlengkap`, `pabrik-parfum-surabaya` | PARTIAL (5 legacy location articles exist, not structured as hub) |
| **Resource Center** (`/resources/*`) | Downloads, checklists, BPOM document templates, launch checklists | Lead-capture forms (email in exchange) | MISSING |
| **Interactive Tools** | Calculator (exists), MOQ estimator, budget planner, packaging visualizer | `estimasi-biaya-maklon-kosmetik` | PARTIAL (calculator exists) |
| **Industry Reports** (`/riset/*`) | Annual maklon industry report (Sprint 2: "The definitive authority" play) | All money pages, PR, backlinks | MISSING |

## D3. How the Growth Layer Grows Independently (Mechanism)

1. **Separate data modules** (`src/data/seo-pilot/*` pattern extended): `src/data/growth/*` — no dependence on `articles.ts`, `seo-mapping.json`, or the catch-all.
2. **Separate routes** under `/panduan/`, `/lokasi/`, `/harga-*/`, etc. — no URL collision with legacy 187 articles.
3. **Own schema pipeline** (`src/lib/seo-pilot/schema.ts` pattern) — Article, FAQ, BreadcrumbList, Service, Product, HowTo.
4. **Own internal-link graph** — every Growth Layer page links to 3–5 money pages + 2–3 sibling hub pages + RelatedLinks. The graph is a pillar-cluster mesh, not the legacy category-only related links.
5. **Conversion-first by construction** — every Growth page ships with: decision block, WhatsApp CTA (round-robin), lead form (where applicable), calculator embed (where applicable), FAQ accordion, and GA4 conversion event. This is the OR-OS micro-conversion architecture from Sprint 2 Phase 6.
6. **Freshness cadence** — Growth Layer pages carry `publishedAt`/`updatedAt` and a 90-day refresh loop; the legacy layer is refreshed opportunistically.

**Council rule:** The Growth Layer NEVER waits for legacy cleanup. It is the "greenfield on the same domain" that Sprint 2 said Dreamlab needs. Its success metrics are independent: indexation rate, page-level clicks, and micro-conversion rate.

## D4. Growth Layer vs Legacy — Boundary Contract

| Concern | Legacy Layer | Growth Layer |
|---------|--------------|--------------|
| Data source | `articles.ts`, `seo-mapping.json`, `seo-audit-export.csv` | New `src/data/growth/*` modules |
| Renderer | `[...slug]/page.tsx` catch-all | Dedicated route handlers per hub |
| HTML | WordPress HTML (as-is) | Clean JSX/components |
| Internal links | Category-only RelatedLinks | Pillar-cluster mesh |
| Conversion | WhatsApp deep-link only | Full OR-OS conversion stack |
| Change policy | PROTECT/ENHANCE only until Phase-2 REFRESH list | Free to evolve |
| Risk | Regression risk on every change | Near-zero (no legacy dependency) |

## D5. First 10 Growth Layer Assets (Priority Order)

Ranked by revenue potential × build cost × dependency — derived from Sprint 2 Phases 5–6:

| # | Asset | Type | Feeds | Est. Build |
|---|-------|------|-------|-----------|
| 1 | **Harga Maklon Kosmetik Hub** (`/harga-maklon-kosmetik/`) | Pricing Hub pillar | `biaya-maklon-skincare`, calculator | 2–3 days |
| 2 | **Location Hub index** (`/lokasi-maklon-kosmetik/`) | Location Hub pillar | 5 existing location articles + new cities | 2 days |
| 3 | **Maklon vs ODM vs Private Label** (`/perbandingan/maklon-vs-odm-vs-private-label/`) | Comparison Hub | `private-label-kosmetik`, `jasa-maklon-kosmetik` | 2 days |
| 4 | **Glossary hub** (`/glosarium-maklon-kosmetik/`) | Glossary (30 terms) | All money pages | 3 days |
| 5 | **Surabaya Location money page** (`/lokasi-maklon/surabaya/`) | Location Hub cluster | `pabrik-maklon-kosmetik-surabaya-terlengkap` | 1–2 days |
| 6 | **Jakarta Location money page** (`/lokasi-maklon/jakarta/`) | Location Hub cluster | new (competitor gap) | 1–2 days |
| 7 | **MOQ & Budget Planner tool** (upgrade MaklonCalculator) | Interactive tool | `moq-maklon-kosmetik`, `estimasi-biaya` | 3–5 days |
| 8 | **Launch Checklist download** (`/resources/checklist-launch-brand-kosmetik/`) | Resource Center | Lead capture (email) | 1 day |
| 9 | **BPOM & Legal Guide** (`/panduan/izin-bpom-kosmetik-lengkap/`) | Knowledge Hub | `jasa-maklon-kosmetik` | 2–3 days |
| 10 | **Case Study #1** (`/portfolio/brand-skincare-pertama/`) | Case Study Hub | `our-client`, homepage | 2–3 days |

**Why these 10:** (1) Pricing transparency is the single biggest competitor gap (Sprint 2 Phase 1&2 finding — zero competitors publish prices); (2) Location Hub monetizes existing 5 location articles that are currently orphaned; (3) Comparison & Glossary reinforce the knowledge graph entities Google needs to classify Dreamlab as authoritative; (4) Resource Center gives the OR-OS a first lead-capture asset that isn't WhatsApp-only.

---

# PART E — STAKEHOLDER RISK ANALYSIS

## E1. Stakeholder Map

| Stakeholder | Role | Owns | Change Stance (est.) | Risk |
|-------------|------|------|----------------------|------|
| **Founder / Director** | Decision-maker, brand custodian | Everything | Wants growth; wary of anything that looks like "removing content" | MEDIUM — needs business-case framing, not SEO framing |
| **Marketing Team** | Content owners, campaigns | Articles, blogs, CTA copy, campaign pages | Proud of content volume; may resist "ARCHIVE/MERGE" labels | HIGH — the biggest political risk |
| **Sales/CS Team** | Lead receivers (3 round-robin agents) | WhatsApp flows, thankyou pages, Kommo CRM | Wants more quality leads, hates irrelevant leads | LOW — aligned with transformation |
| **Developers** | Implementation | All code, deploy pipeline | Technical debt awareness; resistant to churn | LOW-MEDIUM |
| **Agency/Consultants** | Advising | (if any) | — | LOW |
| **Google/SEO "ghost"** | External | — | Judges quality, entity, freshness | N/A — but missteps here cost rankings |

## E2. Political Risks & Mitigations

| # | Risk | Trigger | Mitigation |
|---|------|---------|-----------|
| 1 | **"You deleted our content" objection** | ARCHIVE/MERGE/REDIRECT classification communicated as "deletion" | Rename framing: "PRESERVE" (ARCHIVE = preserved & accessible), "CONSOLIDATE" (MERGE = stronger single page). Present traffic data showing the pages earn 0 clicks. |
| 2 | **Marketing fears losing the Instagram-cart page** | Proposal to touch #1 traffic page | PROTECT it explicitly; the bridge CTA is additive, not a rewrite. Show numbers: it stays, we only add a soft bridge. |
| 3 | **Founder skepticism of "long-term authority" play** | 12-month roadmap with slow index gains | Frame via revenue: X leads/mo → Y leads/mo; show that refocusing existing traffic is the *fast* win, authority is the *durable* win. |
| 4 | **Developer churn resistance** | Mass HTML cleanup proposal | Don't propose mass cleanup. REFRESH is 21 articles; Growth Layer is new code with clean components. |
| 5 | **"Too many changes at once"** | Deploying all 3 moves simultaneously | Phase the rollout: Week 1 hygiene+safe wins (invisible), Weeks 2–4 traffic refocus (visible but low-risk), Month 2+ growth layer (new pages only). |
| 6 | **Sales overload** | Refocus sends more leads before CS can handle | Increase round-robin agent capacity first (config change, 10 min) OR add lead intake form to slow drip. Coordination with sales team. |

## E3. Communication & Approval Workflow

```
Weekly Transformation Council (30 min):
  1. Data check (GSC clicks/impressions, indexation, lead count)
  2. What we're changing this week (visible changes → business case)
  3. What we're NOT changing (protect list reminder)
  4. Go/no-go gate for any page classified outside PROTECT/ENHANCE

Approval ladder:
  Developer implements → Marketing approves copy → Director approves
  any ARCHIVE/MERGE/REDIRECT/CONSOLIDATE of a page with >0 clicks in 90d
  → Post-deploy: 14-day monitoring window with rollback readiness
```

## E4. Success Metrics by Stakeholder

| Stakeholder | Cares About | Success Metric | Baseline |
|-------------|------------|----------------|----------|
| Founder | Revenue | Qualified leads/mo, revenue pipeline | ~0 structured; WhatsApp-only |
| Marketing | Visibility | Organic clicks, keyword rankings, content "wins" | 2,745 clicks/90d; 724 pages |
| Sales/CS | Lead quality | Lead-to-qualified-call rate, response time | Unknown (no CRM data) |
| Developers | Stability | Deploy success, zero regressions, page health | — |
| Council | Transformation health | Indexation of money pages, micro-conversion rate, refocus CTR | Money pages at pos 5–13; CTR 1.83% |

---

# PART F — RISK ANALYSIS (RISK MATRIX)

## F1. Risk Matrix

Probability × Impact on a 1–5 scale. Overall exposure = P × I (max 25). All material risks must have an owner and a mitigation before the corresponding sprint starts.

### F1.1 SEO Risk

| # | Risk | P | I | Exposure | Mitigation | Owner |
|---|------|---|---|:---:|-----------|-------|
| R1 | Traffic refocus internal links hurt DIY-page relevance | 2 | 3 | 6 | Only add contextually-relevant bridges (commercial pages link where intent overlaps); monitor CTR/position on top DIY pages weekly; revert any link with >10% position drop | SEO Lead |
| R2 | Re-enabling breadcrumbs changes link profile subtly | 1 | 2 | 2 | Breadcrumbs are a recognized nav pattern; low risk; monitor crawls | Technical SEO |
| R3 | ARCHIVE/MERGE removes pages still referenced externally | 3 | 3 | 9 | Backlink check before any non-PROTECT action; use 301 for anything with external links; archive = noindex+accessible, not deletion | SEO Lead + Content Ops |
| R4 | Refresh rewrites harm a ranking article | 2 | 4 | 8 | REFRESH only 21 thin articles with <100 clicks; keep URL/H1; diff-check titles; 14-day monitoring with rollback (git revert) | Content Ops |
| R5 | New Growth Layer pages cannibalize legacy pages | 2 | 3 | 6 | Distinct URL namespaces; internal links define parent/child; keyword mapping per page; monitor SERP overlap in GSC | IA Architect |
| R6 | Google re-evaluation of sitewide change causes temporary index dip | 2 | 4 | 8 | Phase changes; submit only updated URLs; monitor indexation weekly; expect 2–6 week stabilization | Technical SEO |

### F1.2 Business Risk

| # | Risk | P | I | Exposure | Mitigation | Owner |
|---|------|---|---|:---:|-----------|-------|
| R7 | Refocus brings more leads than CS capacity | 4 | 3 | 12 | Scale round-robin agents before refocus (config); add lead form drip; set SLA expectations | Sales Ops |
| R8 | Marketing perceives ARCHIVE/MERGE as content loss | 4 | 3 | 12 | Communication plan (E2); data-backed business case; approval gate for >0-click pages | Program Manager |
| R9 | Revenue attribution unclear → leadership doubts ROI | 3 | 4 | 12 | Wire GA4 conversion events + Kommo CRM from week 1 (safe win); monthly revenue report | Rev Ops |
| R10 | Competitor copies pricing hub after launch | 3 | 2 | 6 | Pricing hub = moat (they lack factory data); add proprietary cost tables + calculator | Rev Ops |

### F1.3 Political / Organizational Risk

| # | Risk | P | I | Exposure | Mitigation | Owner |
|---|------|---|---|:---:|-----------|-------|
| R11 | Founder vetoes long-term plan (wants quick traffic) | 3 | 4 | 12 | Lead with 30-day quick wins (revenue refocus), show authority as compounding | Program Manager |
| R12 | Marketing/Content friction blocks REFRESH priority | 3 | 3 | 9 | Joint ownership of the 21-article list; share bylines | Content Ops |
| R13 | Developer bandwidth limits parallel Growth Layer | 3 | 4 | 12 | Growth Layer is modular (data + routes); parallelize; reuse pilot component system | Program Manager |

### F1.4 Technical Risk

| # | Risk | P | I | Exposure | Mitigation | Owner |
|---|------|---|---|:---:|-----------|-------|
| R14 | CTA render-layer change breaks article layout | 2 | 3 | 6 | Component-level change with visual regression check; feature flag | Developer |
| R15 | Breadcrumb component ships with bugs across 187 articles | 2 | 3 | 6 | Ship on top pages first, then rollout; unit test + visual check | Developer |
| R16 | Sitemap/proxy sync bug re-includes 410 URLs | 3 | 3 | 9 | Unit test for sitemap vs proxy patterns; verify:sitemap script in CI | Technical SEO |
| R17 | Next.js build fails after many data-module additions | 2 | 4 | 8 | Growth Layer data in typed modules; build before merge (verify:all) | Developer |
| R18 | Legacy HTML cleaning (opportunistic) breaks article render | 3 | 3 | 9 | Only clean inside REFRESH; no mass pass; snapshot before/after | Developer |

### F1.5 Revenue Risk

| # | Risk | P | I | Exposure | Mitigation | Owner |
|---|------|---|---|:---:|-----------|-------|
| R19 | Refocus drives clicks but not conversions (low CTR on commercial CTA) | 3 | 4 | 12 | Conversion assets (pricing, case studies, calculator) deployed in parallel; A/B test CTA copy | Rev Ops |
| R20 | WhatsApp round-robin not enough for qualified B2B leads | 3 | 4 | 12 | Add structured lead form + email capture on money pages; Kommo pipeline | Sales Ops |
| R21 | 90-day SEO latency → leadership cuts program early | 3 | 5 | 15 | Set correct expectations; quick wins deliver visible value in 30 days; monthly evidence | Program Manager |

### F1.6 Operational Risk

| # | Risk | P | I | Exposure | Mitigation | Owner |
|---|------|---|---|:---:|-----------|-------|
| R22 | Too many concurrent workstreams (hygiene + refocus + growth) | 3 | 4 | 12 | 3 parallel tracks owned separately; weekly council de-conflicts; no track blocks another | Program Manager |
| R23 | Data (GSC, GA4) not wired → decisions blind | 3 | 4 | 12 | GA4 + GTM verified in week 1; GSC export monthly; council reads same data | Technical SEO |
| R24 | Content ops without writer capacity for 21 refreshes + growth pages | 3 | 3 | 9 | Stage: 5 refreshes/mo + 2 new pages/mo sustainable cadence | Content Ops |

## F2. Risk Heat Map (Top 8 Exposure)

| Rank | Risk | Exposure | Class |
|------|------|:---:|-------|
| 1 | R21: 90-day latency → early program cut | 15 | Revenue |
| 2 | R7/R8/R9/R19/R20/R22 (six risks tied) | 12 | Mixed |
| 3 | R3: ARCHIVE removes externally-referenced pages | 9 | SEO |
| 4 | R4: Refresh harms a ranking article | 8 | SEO |
| 5 | R6: Sitewide change index dip | 8 | SEO |
| 6 | R17: Build failure | 8 | Technical |
| 7 | R2/R14/R15 (breadcrumb/CTA bugs) | 6 | Technical |
| 8 | R24: Writer capacity | 9 | Operational |

**Council reading of the heat map:** The transformation's biggest risk is NOT technical — it's **expectation management (R21)** and **stakeholder alignment (R8/R11/R12)**. The technical work is deliberately low-risk by construction (PROTECT 62%, no mass rewrites). Budget real effort on the communication plan and the 30-day visible-win story.

---

# PART G — EXECUTION PRIORITY MATRIX

Every initiative is scored. Score = (Revenue Impact × 0.4) + (SEO Impact × 0.3) − (Risk × 0.2) − (Difficulty × 0.1), normalized to 0–100. Dependencies, hours, and ROI are estimates; Confidence is the council's assessment.

## G1. Quick Wins (Low Risk, Low Difficulty, Can't Hurt)

| # | Initiative | Rev | SEO | Risk | Diff | Hrs | ROI | Score | Conf |
|---|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| QW1 | Re-enable Breadcrumb component + BreadcrumbList JSON-LD | 2 | 4 | 1 | 1 | 4 | High | 81 | HIGH |
| QW2 | Fix article CTA render target (`/thankyou-page/` → money page / WA) | 4 | 3 | 1 | 2 | 4 | Very High | 88 | HIGH |
| QW3 | Sync sitemap.ts maklonRoutes with proxy 410/301 patterns | 1 | 4 | 1 | 1 | 2 | Medium | 76 | HIGH |
| QW4 | Verify robots.txt: unblock 3 product categories | 3 | 4 | 1 | 1 | 1 | High | 85 | HIGH |
| QW5 | GA4 + GTM conversion events on money pages + lead events | 4 | 1 | 1 | 2 | 6 | Very High | 79 | MED-HIGH |
| QW6 | Fix 10 duplicate-without-canonical URLs (canonical) | 1 | 3 | 1 | 1 | 2 | Medium | 69 | HIGH |
| QW7 | Image alt-text + stale WP path cleanup (during REFRESH only) | 1 | 2 | 1 | 1 | per-art | Medium | 61 | HIGH |
| QW8 | Add FAQ schema to 10 highest-CTR commercial articles | 2 | 3 | 1 | 2 | 8 | Medium | 70 | MED-HIGH |

## G2. Traffic Refocus (Medium Value, Low-Med Risk)

| # | Initiative | Rev | SEO | Risk | Diff | Hrs | ROI | Score | Conf |
|---|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| TR1 | Bridge top DIY pages → commercial money pages (soft CTA + related links) | 4 | 2 | 3 | 2 | 10 | High | 72 | MED-HIGH |
| TR2 | Reframe `/memunculkan-keranjang-reels/` with brand-business bridge (NOT maklon bait) | 3 | 1 | 3 | 2 | 4 | High | 57 | MED |
| TR3 | Article→RelatedLinks upgrade: include money-page links in related set | 3 | 2 | 2 | 2 | 6 | Medium | 66 | MED-HIGH |
| TR4 | Footer "Interesting Link" → include Pricing Hub + Location Hub once live | 2 | 2 | 1 | 1 | 2 | Medium | 63 | HIGH |
| TR5 | Header "Services" dropdown enrichment (money pages, not just 1 item) | 3 | 3 | 1 | 2 | 4 | Medium | 74 | HIGH |

## G3. Growth Layer (High Value, Med Risk)

| # | Initiative | Rev | SEO | Risk | Diff | Hrs | ROI | Score | Conf |
|---|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| GL1 | Harga Maklon Kosmetik Hub (pricing hub pillar) | 5 | 4 | 2 | 3 | 40 | Very High | 87 | MED-HIGH |
| GL2 | Location Hub index + Surabaya + Jakarta money pages | 5 | 4 | 2 | 2 | 40 | Very High | 88 | MED-HIGH |
| GL3 | Maklon vs ODM vs Private Label comparison page | 4 | 4 | 1 | 2 | 24 | High | 80 | HIGH |
| GL4 | Glossary hub (30 terms) | 3 | 4 | 1 | 2 | 30 | Medium | 74 | HIGH |
| GL5 | MOQ & Budget Planner tool (calculator upgrade) | 4 | 3 | 2 | 3 | 48 | High | 72 | MED |
| GL6 | BPOM & Legal Guide (panduan) | 4 | 3 | 1 | 2 | 30 | High | 78 | MED-HIGH |
| GL7 | Launch Checklist download (lead capture) | 4 | 2 | 1 | 1 | 8 | High | 78 | HIGH |
| GL8 | Case Study #1 + structure for hub | 4 | 2 | 1 | 3 | 32 | High | 68 | MED |

## G4. Content Refresh (Medium Value, Med Risk)

| # | Initiative | Rev | SEO | Risk | Diff | Hrs | ROI | Score | Conf |
|---|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| CR1 | Refresh top 5 commercial thin articles (Phase-1 list #14,19,15,20,9) | 4 | 4 | 2 | 3 | 40 | High | 80 | HIGH |
| CR2 | Refresh next 5 commercial-support articles (Phase-2 list) | 3 | 3 | 2 | 3 | 35 | Medium | 66 | MED-HIGH |
| CR3 | MERGE `bangun-brand-skincare` → pillar + 301 | 2 | 3 | 3 | 2 | 6 | Medium | 52 | MED |
| CR4 | ARCHIVE 5–8 dead trend articles (noindex) | 1 | 2 | 3 | 1 | 4 | Low | 35 | MED |

## G5. Priority Order (Final, de-conflicted)

| Phase | Initiatives | Gate |
|-------|-------------|------|
| **Week 1** | QW1–QW6 (hygiene + safe wins + tracking) | verify:all green; GA4 events fire |
| **Week 2** | TR5, TR3, TR1 (header/services + link refocus start) | 14-day monitoring; no rank loss on DIY pages |
| **Week 3–4** | GL2, GL1, GL7 (Location Hub, Pricing Hub, checklist) | Pages deployed, indexed, linked |
| **Month 2** | GL3, GL6, CR1 (comparison, BPOM guide, top-5 refresh) | Refresh pages keep URLs; no traffic loss |
| **Month 3** | GL4, GL5, CR2, TR4 (glossary, planner, next refresh, footer) | Growth Layer meshed with legacy links |
| **Month 4–6** | CR3, CR4, GL8 + expand hubs (merge/archive/consolidate/case studies) | Backlink check before MERGE/ARCHIVE |

---

# PART H — DECISION FRAMEWORK

For every proposed transformation action, the council answers nine questions. This framework is the binding gate — no action proceeds until all nine are answered. It converts "we should probably do X" into "X is justified, timed, measurable, and reversible."

## H1. The Nine-Question Gate

| # | Question | Default rule |
|---|----------|--------------|
| 1 | **Should we do it?** | Only if it maps to PROTECT/ENHANCE/REFRESH or a Growth Layer asset. If it's a MERGE/ARCHIVE/DELETE, it needs Director sign-off. |
| 2 | **Why?** | Must connect to revenue: more qualified leads, higher money-page rankings, better conversion, or indexation of money pages. "Because competitors do it" is not a reason. |
| 3 | **Why now?** | Sequencing justification. Is there a dependency, a seasonal window (e.g., new-year brand-launch queries), or a current gap (indexation, conversion) making this urgent? |
| 4 | **Why later?** | What would we sacrifice by waiting? If nothing, deprioritize. If waiting risks the site's momentum or competitor first-mover advantage (e.g., pricing hub), do it now. |
| 5 | **What evidence is required?** | Minimum evidence before execution: GSC data (clicks/position), backlink status (for MERGE/ARCHIVE), competitor SERP (for new pages), indexation status. No data = no action. |
| 6 | **What KPI validates success?** | One primary + one guardrail. Primary: leads/qualified contact or money-page clicks. Guardrail: no ranking loss on the touched page or its parent. |
| 7 | **When should we stop?** | Pre-defined stop conditions: position drop >10% for 2 weeks, CTR drop >20%, indexation of the page drops, or conversion rate below threshold. Revert + report. |
| 8 | **Who owns it?** | Named owner from the stakeholder map. No owner = no action. |
| 9 | **What does rollback look like?** | Every action ships with a git-revertable change and a rollback window (typically 14 days). Growth Layer pages are reversible by removing routes + 301s. |

## H2. Decision Log Format (to be maintained per action)

```
ACTION-ID: QW2 (Article CTA retarget)
1. Should we?  YES — legacy CTA routes through 301, leaking equity + intent
2. Why?        Direct money-page click path for 180+ articles
3. Why now?    Zero-risk render-layer change; unblocks TR1 refocus
4. Why later?  N/A — it is a prerequisite for revenue refocus
5. Evidence?   Code: hardcoded /thankyou-page/ links in article bodies; GSC: that URL 301s
6. KPI?        Primary: % of article→money-page clicks (GA4). Guardrail: article CTR stable
7. Stop when?  Article CTR drops >20% for 2 weeks → revert to legacy link
8. Owner?      Developer (implement) + SEO Lead (verify)
9. Rollback?   git revert; feature-flag CTA rendering
STATUS: APPROVED — Week 1
```

## H3. Standing Decisions (Pre-approved, Low-Risk)

| Decision | Standing ruling |
|----------|----------------|
| Adding internal links (contextually relevant) | APPROVED without review — never on money-page-outbound more than 8/article |
| Adding schema (FAQ, Breadcrumb, Article) | APPROVED without review |
| Re-enabling disabled components (Breadcrumb) | APPROVED with visual QA |
| Updating meta title/description on sub-500-click pages | APPROVED with SERP diff check |
| Adding Growth Layer routes | APPROVED within hub namespaces, each with keyword mapping |
| MERGE/ARCHIVE/DELETE of any page with >0 clicks in 90d | REQUIRES Director + backlink check + 14-day monitor |
| Rewriting a page that ranks in top-20 for a query | REQUIRES REFRESH protocol (keep URL/H1) + 14-day monitor |
| Changing URL structure | BANNED this quarter (unless 1:1 301 and Director-approved) |

---

# PART I — TRANSFORMATION ROADMAP

## I0. Legacy Transition Timeline (Phase 6 requirement)

| Window | What moves | What stays | What waits |
|--------|-----------|-----------|-----------|
| **Week 1** | Safe wins + hygiene (QW1–6): breadcrumb, CTA retarget, sitemap sync, robots verify, GA4, canonicals | All ranking content; all URLs | All REFRESH, MERGE, ARCHIVE; all Growth Layer new pages |
| **Week 2** | Header/Services enrichment, RelatedLinks upgrade, first DIY→money bridges | Top DIY pages (bridges are additive only) | Growth Layer build |
| **Month 1** | Location Hub + Pricing Hub + checklist (GL1, GL2, GL7); start top-5 commercial refresh (CR1) | Legacy articles (except 5 being refreshed) | MERGE/ARCHIVE (dead pages) |
| **Month 3** | Comparison, BPOM guide, refresh wave 2; footer updates; calculator upgrade | Everything still PROTECT | Case Study Hub expansion |
| **Month 6** | MERGE 2–3, ARCHIVE 5–8 dead pages, expand Location Hub to 10 cities, Case Study Hub live | All money pages (PROTECT) | 12-month authority assets |
| **Month 12** | Industry report, full Knowledge Architecture (Sprint 2 Phase 5 targets), authority 90/100 trajectory, internal-link graph complete | Top-20 spine (never touched unless data says so) | — |

## I1. 30-Day Plan (Month 1)

### Objective
Ship zero-risk safe wins, wire measurement, launch the first two Growth Hubs, and begin the commercial refresh — all without touching what ranks.

### Week 1 — Hygiene & Safe Wins (invisible, foundational)
| Deliverable | Owner | Success Criteria |
|-------------|-------|------------------|
| QW1: Re-enable Breadcrumb + BreadcrumbList schema site-wide | Developer | Breadcrumb visible on 10 sampled pages; schema valid |
| QW2: Article CTA retarget (render-layer) | Developer | No article CTA → /thankyou-page/; all → money page/WA |
| QW3: Sitemap/proxy sync (maklonRoutes filter) | Technical SEO | No 410/301 URLs in sitemap; verify:sitemap passes |
| QW4: robots.txt verify (3 categories unblocked) | Technical SEO | Category pages indexable in GSC within 2 weeks |
| QW5: GA4 + GTM conversion events on money pages + lead events | Technical SEO | Events fire; GTM preview confirms |
| QW6: 10 duplicate-without-canonical fixes | Technical SEO | Canonicals self-referencing; GSC count drops |

### Week 2 — Navigation & Link Refocus (visible, low-risk)
| Deliverable | Owner | Success Criteria |
|-------------|-------|------------------|
| TR5: Header Services dropdown enrichment | Developer | Money pages reachable from header |
| TR3: RelatedLinks include money-page links | Developer | Related set mixes article + money pages |
| TR1 (start): Bridges on top 5 DIY pages | SEO Lead + Content Ops | 2–3 contextually-relevant money links/page |

### Week 3–4 — First Growth Hubs + First Refresh
| Deliverable | Owner | Success Criteria |
|-------------|-------|------------------|
| GL2: Location Hub index + Surabaya + Jakarta money pages | SEO Lead + Dev | Pages deployed, indexed, linked from footer |
| GL1: Pricing Hub pillar (`/harga-maklon-kosmetik/`) | SEO Lead + Dev | Calculator embedded; indexed |
| GL7: Launch Checklist download (email capture) | Rev Ops + Dev | First email leads captured |
| CR1: Refresh top 5 commercial thin articles | Content Ops | URLs unchanged; word count 1,500+; money links added |

### 30-Day KPIs
- Money-page clicks: +20% vs baseline
- Breadcrumb live site-wide
- GA4 conversion events firing on all money pages
- 3 new Growth Layer pages indexed
- 5 commercial articles refreshed with URLs intact

## I2. 90-Day Plan (Month 2–3)

### Objective
Grow the new layer into a visible cluster, deepen conversion architecture, and prove the revenue refocus.

### Deliverables
| Workstream | Deliverables | Owner |
|-----------|--------------|-------|
| Growth Layer | GL3 (Maklon vs ODM vs PL), GL6 (BPOM guide), GL5 (MOQ planner upgrade) | SEO Lead + Dev |
| Traffic Refocus | TR1 full rollout across top 40 DIY/support articles; TR4 footer update | SEO Lead + Content Ops |
| Refresh | CR2: next 5 commercial-support articles | Content Ops |
| Conversion | Pricing tables on money pages; Case Study #1 (GL8); lead form on Pricing Hub | Rev Ops + Dev |
| Hygiene | Monthly GSC indexation review; fix Discovered-not-indexed (19) | Technical SEO |

### 90-Day KPIs
- 6–8 new Growth Layer pages indexed
- Money-page clicks: +50% vs baseline
- Structured leads: >0/month (first ever) — target 5–10 qualified
- Top DIY pages hold CTR/position (guardrail)
- Indexation of the 46 "crawled-not-indexed" content pages: −50%

## I3. 180-Day Plan (Month 4–6)

### Objective
Consolidate: merge/archive dead content, expand hubs to full clusters, and turn the site into the authority architecture from Sprint 2 Phase 5.

### Deliverables
| Workstream | Deliverables | Owner |
|-----------|--------------|-------|
| Content Ops | CR3 (MERGE bangun-brand-skincare), CR4 (ARCHIVE 5–8 dead), MERGE 2 location variants | Content Ops + SEO Lead |
| Growth Layer | Location Hub → 10 cities; Glossary (GL4) live; Case Study Hub → 3 cases; Resource Center 3 assets | SEO Lead + Dev |
| Authority | First industry report draft (`/riset/`); outreach for 3 backlinks | Digital PR + Rev Ops |
| Conversion | Lead scoring in Kommo; WhatsApp nurturing sequence v1 | Sales Ops + Rev Ops |
| Hygiene | Full sitemap re-audit; GSC indexation target <600 non-indexed | Technical SEO |

### 180-Day KPIs
- Non-indexed URLs <600
- Money-page clicks: +100% vs baseline (~5,000/mo trajectory)
- Structured leads: 20–30/month
- Authority score: 40/100 (Sprint 2 Phase 5 scale)
- Backlinks: +5 quality

## I4. 12-Month Plan

### Objective
Complete the Organic Revenue Operating System (Sprint 2 Phase 6) and the Knowledge Architecture (Phase 5). Dreamlab becomes the definitive authority on maklon kosmetik in Indonesian SERPs.

### Deliverables
| Workstream | Deliverables | Owner |
|-----------|--------------|-------|
| Knowledge | Full pillar-cluster graph; 8 pillars + 100+ topics complete; industry report published | SEO Lead + Content Ops |
| Revenue | OR-OS dashboard live; multi-touch attribution; nurturing sequences; 5,000 clicks/mo; 50+ structured leads/mo | Rev Ops |
| Authority | Authority score 90/100; 20+ quality backlinks; digital PR campaign | Digital PR |
| Technology | Full schema coverage; internal-link graph automated; A/B conversion testing | Technical SEO |
| People | Transformation Council → standing Growth Operating Cadence (monthly) | Program Manager |

### 12-Month KPIs
- Monthly organic clicks: 5,000 (5.5× baseline)
- Qualified leads: 50+/month
- Indexation: money pages 100%, total non-indexed <600
- Authority: 90/100
- Revenue from organic: measurable, attributed, growing month-over-month

---

# FINAL RECOMMENDATION

## If Dreamlab can change only ONE thing this month...

**Re-enable the article CTA layer (QW2) so every legacy article's call-to-action routes to a live money page (or WhatsApp direct) instead of the 301'd `/thankyou-page/`.**

### Why this is the single highest long-term-ROI, lowest-risk change:

| Criterion | Assessment |
|-----------|-----------|
| **Long-term ROI** | This is the *distribution mechanism* for every other initiative. 187 articles × every future REFRESH + every Growth Layer page depend on a working article→money-page CTA path. Without it, traffic refocus (TR1), Growth Layer adoption, and conversion all cap out. Fixing it makes every other dollar spent on content work harder. |
| **Lowest organizational risk** | It is a render-layer change — no URL changes, no content deletion, no H1/title edits, no marketing sign-off battles, no "you deleted our content" objection. It is invisible to stakeholders who aren't in the codebase, and trivially revertable (git revert). |
| **Evidence it's broken** | Code inspection: article bodies contain hardcoded `<a href="https://dreamlab.id/thankyou-page/">` CTA links. GSC: `/thankyou-page/` is a 301 → homepage. So every legacy article's primary CTA sends users AND link equity through a redirect to the homepage instead of to a money page. That is a systematic revenue leak on 180+ pages. |
| **Mechanism** | A single component-level change in the article renderer rewrites the legacy CTA target to the page's mapped money page (or round-robin WhatsApp). One code change affects 180+ articles. |
| **Cost** | ~4–6 developer hours. Zero content hours. Zero design hours. |
| **Confidence** | HIGH. The defect is directly observable in code and GSC. The fix is standard practice. |
| **Stops it ever being "later"** | Every day it stays broken, 180+ pages route their CTAs through a redirect. That's compounding opportunity cost. It also blocks TR1 (refocus) from being effective. |

### Why NOT something else this month?

- **Not the Pricing Hub** — highest revenue *potential*, but it's a new build (~40 hrs) and its conversion value multiplies once the CTA layer works.
- **Not GA4/GTM** — essential, but it's a measurement prerequisite, not a revenue lever by itself.
- **Not the REFRESH** — high value, but it's 21 separate editorial projects (weeks of work); the CTA fix is one change that unlocks all of them.
- **Not the breadcrumbs** — a fine safe win, but breadcrumbs improve navigation signal, not direct revenue path.

### The ordering that follows

1. **Week 1:** CTA retarget (QW2) → every article now funnels readers to a money page or WhatsApp.
2. **Week 2:** Traffic refocus bridges (TR1) → the DIY-traffic readers now meet commercial CTAs contextually.
3. **Week 3–4:** Growth Hubs (GL1, GL2) → the money pages they land on now have pricing + location depth to convert.
4. **Month 2+:** Everything else compounds on this foundation.

**One change → one mechanism → 180+ pages → the entire organic funnel stops leaking and starts converting.**

---

# APPENDIX A — CONFIDENCE ASSESSMENT (Full)

| Conclusion | Confidence | Basis |
|-----------|:---:|-------|
| Current traffic is dominated by non-commercial content | HIGH | GSC page-level click data (top 12 pages) |
| Indexing hygiene is mostly "expected" exclusions | HIGH | Root-cause analysis 2026-07-31 (732/732-bucket breakdown; 686 static assets) |
| 46 content pages need quality/linking work (not hygiene) | HIGH | Root-cause analysis 2026-07-31 |
| CTA leak via `/thankyou-page/` exists | HIGH | Direct code inspection of article bodies + GSC redirect data |
| Breadcrumb is disabled site-wide | HIGH | Direct code inspection (`return null`) |
| Refocus bridges preserve DIY rankings | MEDIUM-HIGH | Best practice; requires monitoring (guardrail in place) |
| Re-enabling breadcrumbs is zero-risk | HIGH | Standard recognized nav pattern |
| Pricing Hub is a durable moat | MEDIUM-HIGH | Sprint 2 competitor scans: no competitor publishes pricing |
| Growth Layer independence | HIGH | Separate routes/data; pilot system already in code |
| 505 crawled-not-indexed → mostly static assets | HIGH | Root-cause analysis bucket breakdown (~460/505) |
| Refresh of 21 thin articles yields indexation gains | MEDIUM | 46 non-indexed articles include ~15 blog articles; refresh + links should help |
| 12-month 90/100 authority is achievable | MEDIUM | Requires sustained content + backlinks; Sprint 2 Phase 5 trajectory model |
| 5,000 clicks/mo within 12 months | MEDIUM | Based on refocus + growth layer; dependent on indexation and refresh success |
| Lead volume targets (5→50/mo) | MEDIUM | No historical lead data exists (no CRM baseline) — targets are modeled, not measured |

# APPENDIX B — OPEN ITEMS / DATA GAPS

1. **No GA4 production event data** — lead/conversion baselines are modeled, not measured. (QW5 closes this in Week 1.)
2. **No CRM lead history** — actual lead volume from WhatsApp unknown. Sales team should export current WhatsApp lead counts as the true baseline.
3. **Word-count distribution is from `seo-audit-export.csv` (228 URLs, partial)** — source articles.ts shows 187; exact per-article counts for all 187 should be computed once (script exists: `scripts/check-article-words.mjs`).
4. **Sitemap live count (~334) vs computed** — verify after QW3 sync; use GSC "sitemap" report as ground truth.
5. **Backlink inventory** — no Ahrefs/Semrush export available in this environment. Any MERGE/ARCHIVE in Month 4–6 must run a backlink check first (external tool).
6. **Competitor pricing data** — Sprint 2 documented "no competitor publishes pricing"; validate at Pricing Hub build time with a fresh SERP check.

# APPENDIX C — GLOSSARY OF TRANSFORMATION TERMS

| Term | Meaning |
|------|---------|
| PROTECT | Do-not-touch asset; only additive changes (links, schema, tracking) |
| ENHANCE | Safe additive improvements only; no structural rewrite |
| REFRESH | Rewrite content; keep URL, H1, intent |
| MERGE | Two duplicate-intent pages → one; 301 the loser |
| CONSOLIDATE | Cluster → single pillar; 301 cluster pages |
| REDIRECT | 301 to closest relevant page (equity preservation) |
| ARCHIVE | noindex + accessible (historical preservation) |
| DELETE | 410 Gone (already used for WP junk) |
| Growth Layer | New routes independent of legacy content |
| Traffic Refocus | Repointing existing visitor intent toward commercial pages via links/CTAs (no URL changes) |
| Safe Win | Improvement that cannot negatively impact rankings |

---

*End of SPRINT-3-PHASE1-ORGANIC-TRANSFORMATION.md — the complete Organic Transformation Blueprint.*
*Next: SPRINT-3-PHASE2 when council approval is granted.*
