# Open Questions Requiring Resolution

## Critical (Blocking Implementation)

| # | Question | Why it matters | Who can answer |
|---| -------- | -------------- | -------------- |
| 1 | Apakah GA4 Data API credential atau export organic landing page + lead events tersedia? | Tanpa ini, lead impact tidak dapat diukur; recovery success tidak dapat dievaluasi | Marketing/GA4 Admin |
| 2 | Apakah ada backlink profile data (Ahrefs/Moz/ Semrush) untuk legacy URLs? | Memengaruhi keputusan redirect vs 404 vs restore untuk 20 URL 404 dan legacy redirects | SEO team |
| 3 | Apakah /blog/ path intentionally noindexed? Jika ya, apakah kontennya duplikat dengan /news-blog/? | 6+ URLs di noindex decisions perlu klarifikasi sebelum aksi | Developer/Content team |

## High Priority (Needed for Phase 2)

| # | Question | Why it matters | Who can answer |
|---| -------- | -------------- | -------------- |
| 4 | Siapa pemilik/penulis konten artikel lama? Perlu koordinasi untuk content updates | Content update tasks butuh writer assignment | Content/Project manager |
| 5 | Apakah ada GA4 goals/key events yang terdefinisi untuk lead tracking (form submit, WhatsApp click)? | Verifikasi tracking regression | Developer/Marketing |
| 6 | Apakah ada rencana untuk membuat dedicated landing pages untuk /maklon-face-mist/, /pabrik-parfum-surabaya/, dll? | Memengaruhi keputusan redirect: restore vs redirect vs create new | Product/Business owner |

## Medium Priority

| # | Question | Why it matters |
|---| -------- | -------------- |
| 7 | Apakah struktur URL /produk/[category]/[...slug]/ akan dipertahankan atau ada rencana migrasi ke /maklon/ prefix? | Memengaruhi canonical dan redirect strategy jangka panjang |
| 8 | Apakah ada rencana untuk menghidupkan kembali event category atau kategori lain yang sekarang 404? | Memengaruhi 404 vs 410 decision |
| 9 | Apakah Google Search Console ownership sudah diverifikasi untuk semua varian (dreamlab.id, www.dreamlab.id, http://)? | Memengaruhi kemampuan request indexing dan diagnosis |

## Data Gaps

| # | Missing data | Impact | How to resolve |
|---| ------------ | ------ | -------------- |
| 10 | Full GSC Page Indexing export (505 crawled-not-indexed, 338 redirect, 173 canonical, 73 noindex, 20 404) | Cannot triage all 1,141 excluded URLs individually | Export from GSC UI manually and provide CSV |
| 11 | GA4 organic landing pages + lead events 28d before/after | Cannot quantify lead impact | Export from GA4 |
| 12 | Backlink profile | Cannot assess legacy URL value | Export from Ahrefs/Semrush/Moz |
| 13 | Pre-redesign internal link graph | Cannot measure link equity loss | Cannot recover; focus on current graph improvement |
| 14 | PageSpeed/Core Web Vitals data | Cannot assess technical performance regression | Run PageSpeed Insights on top 10 pages |
