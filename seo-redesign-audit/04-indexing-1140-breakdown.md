# Indexing 1.140 Breakdown

Angka reason berasal dari GSC UI yang diberikan user. GSC API tidak menyediakan ekspor penuh Page Indexing reason, jadi daftar lengkap semua 1.140 URL: TIDAK DAPAT DIVERIFIKASI tanpa export CSV UI.

| GSC status | Jumlah | Sample URL | Harus diindeks? | Normal/problem | Pattern | Root cause | Action |
|---|---:|---|---|---|---|---|---|
| Not found (404) | 20 | see GSC UI/export; samples in url-inspection-samples.csv | depends | needs triage | legacy/categories/articles | see below | triage by traffic + sitemap + canonical |
| Duplicate without user-selected canonical | 10 | see GSC UI/export; samples in url-inspection-samples.csv | depends | needs triage | legacy/categories/articles | see below | triage by traffic + sitemap + canonical |
| Crawled - currently not indexed | 505 | see GSC UI/export; samples in url-inspection-samples.csv | depends | needs triage | legacy/categories/articles | see below | triage by traffic + sitemap + canonical |
| Page with redirect | 338 | see GSC UI/export; samples in url-inspection-samples.csv | depends | mostly normal if legacy/duplicate | legacy/categories/articles | see below | triage by traffic + sitemap + canonical |
| Alternate page with proper canonical | 173 | see GSC UI/export; samples in url-inspection-samples.csv | depends | mostly normal if legacy/duplicate | legacy/categories/articles | see below | triage by traffic + sitemap + canonical |
| Excluded by noindex | 73 | see GSC UI/export; samples in url-inspection-samples.csv | depends | mostly normal if legacy/duplicate | legacy/categories/articles | see below | triage by traffic + sitemap + canonical |
| Discovered - currently not indexed | 19 | see GSC UI/export; samples in url-inspection-samples.csv | depends | needs triage | legacy/categories/articles | see below | triage by traffic + sitemap + canonical |
| Duplicate, Google chose different canonical | 3 | see GSC UI/export; samples in url-inspection-samples.csv | depends | needs triage | legacy/categories/articles | see below | triage by traffic + sitemap + canonical |
| Blocked due to other 4xx | 0 | see GSC UI/export; samples in url-inspection-samples.csv | depends | needs triage | legacy/categories/articles | see below | triage by traffic + sitemap + canonical |
| Redirect error | 0 | see GSC UI/export; samples in url-inspection-samples.csv | depends | needs triage | legacy/categories/articles | see below | triage by traffic + sitemap + canonical |

## Klasifikasi agregat sementara

| Bucket | Count | Confidence |
|---|---:|---:|
| Total non-indexed | 1141 | 4 |
| Expected exclusions | 584 | 3 |
| Technical problems | 20-60 | 3 |
| Legacy URLs | 338+ | 4 |
| Duplicate URLs | 186 | 4 |
| Quality/low-value URLs | 524 | 3 |
| Important URLs non-indexed | TIDAK DAPAT DIVERIFIKASI | 2 |
| Unknown | remainder until full GSC export | 2 |

Sample URL Inspection 2026-07-13: Submitted and indexed: 172; Page with redirect: 32; Not found (404): 1; URL is unknown to Google: 106; Excluded by ‘noindex’ tag: 12; Crawled - currently not indexed: 5.
