# Redirect Canonical Sitemap

## Current production

- Live sitemap: 331 URLs.
- Legacy patterns yang sebelumnya bermasalah tidak ditemukan di live sitemap.
- Priority live checks: 94; final 404: 1; redirect initial: 40; noindex: 3.

## Code evidence

- src/app/sitemap.ts:10 imports URL policy; src/app/sitemap.ts:203-209 filters non-indexable paths.
- src/lib/seo-url-policy.ts:3 starts redirect-only policy; :131-143 exposes redirect/noindex/indexable checks.
- src/lib/seo-service.ts:44 blocks SEO data for redirect-only slugs; :57-63 and :105-118 sanitize canonical/schema URL fallbacks.
- next.config.ts:122 starts redirects; :162 starts legacyRedirects; :224 applies them.

## Critical samples

| URL | HTTP | Destination/final | Canonical | Action |
|---|---|---|---|---|
| https://dreamlab.id/category/maklon-skincare/ | 308->200 | /category/maklon-kosmetik/ | https://dreamlab.id/category/maklon-kosmetik/ | Review relevance; do not include in sitemap |
| https://dreamlab.id/category/event/ | 404->404 | https://dreamlab.id/category/event/ |  | OK exclusion unless backlink value |
| https://dreamlab.id/maklon-parfum/ | 308->200 | /google-ads/maklon-parfum/ |  | Review relevance; do not include in sitemap |
| https://dreamlab.id/pabrik-parfum-surabaya/ | 308->200 | /produk/parfum/ | https://dreamlab.id/produk/parfum/ | Review relevance; do not include in sitemap |
| https://dreamlab.id/tips-sukses-bisnis-parfum/ | 308->200 | /bisnis-parfum-merk-sendiri/ | https://dreamlab.id/bisnis-parfum-merk-sendiri/ | Review relevance; do not include in sitemap |
| https://dreamlab.id/bahan-aktif-untuk-mengatasi-jerawat/ | 308->200 | /bahan-aktif-skincare-jerawat/ | https://dreamlab.id/bahan-aktif-skincare-jerawat/ | Review relevance; do not include in sitemap |
| https://dreamlab.id/cara-bisnis-skincare-dari-nol/ | 308->200 | /bisnis-kosmetik-dari-nol/ | https://dreamlab.id/bisnis-kosmetik-dari-nol/ | Review relevance; do not include in sitemap |
| https://dreamlab.id/academy-beautypreneur/ | 308->200 | /category/dreampreneur-beauty-academy/ | https://dreamlab.id/category/dreampreneur-beauty-academy/ | Review relevance; do not include in sitemap |
| https://dreamlab.id/author/admin/page/5/ | 308->200 | /author/admin/ | https://dreamlab.id/author/admin/ | Review relevance; do not include in sitemap |
| https://dreamlab.id/author/admin/page/7/ | 308->200 | /author/admin/ | https://dreamlab.id/author/admin/ | Review relevance; do not include in sitemap |
| https://dreamlab.id/author/admin/page/8/ | 308->200 | /author/admin/ | https://dreamlab.id/author/admin/ | Review relevance; do not include in sitemap |
| https://dreamlab.id/author/admin/page/9/ | 308->200 | /author/admin/ | https://dreamlab.id/author/admin/ | Review relevance; do not include in sitemap |
| https://dreamlab.id/category/bisnis-men-grooming/ | 308->200 | /category/maklon-kosmetik/ | https://dreamlab.id/category/maklon-kosmetik/ | Review relevance; do not include in sitemap |
| https://dreamlab.id/category/dreamlabpedia/page/2/ | 308->200 | /category/dreamlabpedia/ | https://dreamlab.id/category/dreamlabpedia/ | Review relevance; do not include in sitemap |
| https://dreamlab.id/category/dreampreneur-beauty-academy/ | 200->200 | https://dreamlab.id/category/dreampreneur-beauty-academy/ | https://dreamlab.id/category/dreampreneur-beauty-academy/ | Review relevance; do not include in sitemap |
| https://dreamlab.id/category/maklon-parfum/page/2/ | 308->200 | /category/maklon-parfum/ | https://dreamlab.id/category/maklon-kosmetik/ | Review relevance; do not include in sitemap |
| https://dreamlab.id/cms_block_cat/pop-up-form/ | 308->200 | / | https://dreamlab.id/ | Review relevance; do not include in sitemap |
| https://dreamlab.id/contact-form-dreamlab/ | 308->200 | /contact-us/ | https://dreamlab.id/contact-us/ | Review relevance; do not include in sitemap |
| https://dreamlab.id/e-floating-buttons/popup-website/ | 308->200 | / | https://dreamlab.id/ | Review relevance; do not include in sitemap |
| https://dreamlab.id/flywheel-marketing-brand-skincare/ | 308->200 | /news-blog/ | https://dreamlab.id/news-blog/ | Review relevance; do not include in sitemap |
| https://dreamlab.id/https-dreamlab-id-dreamlab-visit-ici-2026/ | 308->200 | / | https://dreamlab.id/ | Review relevance; do not include in sitemap |
| https://dreamlab.id/jasa-maklon-sabun-mandi-batang/ | 308->200 | /jasa-maklon-bar-soap-merek-sendiri/ | https://dreamlab.id/jasa-maklon-bar-soap-merek-sendiri/ | Review relevance; do not include in sitemap |
| https://dreamlab.id/maklon-face-mist/ | 308->200 | /produk/skincare/ | https://dreamlab.id/produk/skincare/ | Review relevance; do not include in sitemap |
| https://dreamlab.id/maklon-kosmetik-jakarta-dreamlab-2026/ | 308->200 | /maklon-jakarta-terbaik/ | https://dreamlab.id/maklon-jakarta-terbaik/ | Review relevance; do not include in sitemap |
| https://dreamlab.id/maklon-kosmetik-parfum-tangerang/ | 308->200 | /maklon-kosmetik-tangerang-terpercaya/ | https://dreamlab.id/maklon-kosmetik-tangerang-terpercaya/ | Review relevance; do not include in sitemap |
