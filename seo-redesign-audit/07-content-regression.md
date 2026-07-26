# Content Regression

Exact old-vs-new rendered body comparison is incomplete because a full old WordPress HTML backup/Wayback crawl was not locally available. Available old metadata sources: ../seo-audit-export.csv and src/data/seo-mapping.json.

Top impacted content page in 7v7 sample is /cara-meracik-handbody-pemutih-alami/: impressions 2426 -> 2051, clicks 6 -> 8, position 7.9 -> 7.7. Because clicks and position improved, this is not proof of content regression.

Risk areas:

- Blog/category consolidation on 2026-07-18/19 can reduce internal links to older articles.
- 505 Crawled-currently-not-indexed likely includes low-value/duplicate/legacy article or taxonomy URLs.
- B2B maklon money pages should be prioritized over consumer informational articles unless article leads are proven.

Action: classify old articles by historical clicks/impressions/backlinks/business relevance before KEEP/UPDATE/MERGE/REDIRECT/NOINDEX/DELETE.
