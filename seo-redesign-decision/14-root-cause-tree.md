# Root Cause Tree — Dreamlab Impression Loss

## Impression turun (-21.6% 28d, -8.5% 7v7)

### ├── Demand/query mix (~25%)
│   Evidence:
│   - Top loss query "/cara-meracik-handbody-pemutih-alami/" (-375) has stable position (7.9→7.7)
│   - Clicks actually increased 6→8 despite impression drop
│   - Multiple "hb dosting" queries declining across the board
│   - This suggests seasonal/trend-based demand decline for DIY skincare content
│   Affected URLs: /cara-meracik-handbody-pemutih-alami/, /perbedaan-moisturizer-gel-vs-cream/, /cara-membuat-hb-dosting-sendiri/
│   Impact: ~200-250 impressions lost
│   Confidence: Medium
│   Action: No direct fix needed; monitor trend; ensure B2B commercial path exists
│
### ├── Ranking loss (~30%)
│   ├── Content regression (partial)
│   │   Evidence: Several articles lost ranking positions (manfaat-hair-tonic 9.5→10.5, pabrik-parfum-malang 8.7→11.7)
│   │   Affected URLs: /manfaat-hair-tonic-ginseng-rambut/, /pabrik-parfum-malang-dreamlab/, /cara-membuat-lulur-ampas-kopi/
│   │   Impact: ~100-150 impressions lost
│   │   Confidence: Medium
│   │   Action: UPDATE_CONTENT freshness for declining articles
│   │
│   ├── Internal link loss (not proven)
│   │   Evidence: Category consolidation 2026-07-18/19 is a plausible risk but no pre-redesign graph
│   │   Affected URLs: Potentially all articles in consolidated categories
│   │   Impact: Cannot quantify
│   │   Confidence: Low
│   │   Action: ADD_INTERNAL_LINKS from service pages to supporting articles
│   │
│   └── Competition/unknown
│       Evidence: Unexplained position drops for specific URLs
│       Affected URLs: /parfum/ (17.9→25.1), /basic-skincare-pria-wajib/ (18.8→22.6)
│       Impact: ~50-80 impressions lost
│       Confidence: Low
│       Action: MONITOR; consider content improvement
│
### ├── Indexing loss (~20%)
│   ├── Legacy URL redirect/noindex (~15%)
│   │   Evidence: www URLs losing all impressions (/produk/skincare/sunscreen/ -47, /about-us/ -32)
│   │   Affected URLs: www.dreamlab.id subpages redirecting to dreamlab.id
│   │   Impact: ~150-200 impressions lost
│   │   Confidence: High
│   │   Action: Ensure redirects correct; non-www already canonical
│   │
│   ├── Crawled-not-indexed (~3-5%)
│   │   Evidence: 505 URLs in this category; some likely have historical impressions
│   │   Affected URLs: Multiple legacy articles
│   │   Impact: Not directly visible in top loss pages; likely small
│   │   Confidence: Low
│   │   Action: IMPORTANT PAGES need FIX_INDEXABILITY
│   │
│   └── 404 not found (~1%)
│       Evidence: 20 URLs 404; some may have backlinks
│       Affected URLs: /category/event/, /dreampreneur-beauty-academy-surabaya-2026/
│       Impact: Minimal (~5-10 impressions)
│       Confidence: Medium
│       Action: 301 if backlinks exist
│
### ├── CTR loss (~5%)
│   Evidence: CTR remained stable (2.15%→2.02%) or slightly improved (1.60%→2.00% 7v7)
│   Affected URLs: N/A - CTR not a primary issue
│   Impact: Minimal
│   Confidence: Medium
│   Action: No specific action needed
│
### └── Tracking/data issue (~5%)
│   Evidence: GSC data lag 2-3 days may affect latest numbers
│   Affected URLs: All
│   Impact: Small
│   Confidence: Low
│   Action: Ensure GSC data is complete before analysis

## Overall explained impression loss
| Root cause | Estimated contribution | Confidence |
| ---------- | ---------------------: | ---------- |
| Demand/query mix | ~25% | Medium |
| Ranking loss (content) | ~15% | Medium |
| Ranking loss (internal links) | ~10% | Low |
| Legacy URL redirect/noindex | ~15% | High |
| Crawled-not-indexed | ~5% | Low |
| Competition/unknown | ~25% | Low |
| CTR/tracking | ~5% | Medium |
| **Explained** | **~55-70%** | |
| **Unexplained** | **~30-45%** | |
