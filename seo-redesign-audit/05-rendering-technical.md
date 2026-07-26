# Rendering and Technical

Live HTML sampling menunjukkan halaman utama dan service page mengirim title, H1, body HTML besar, canonical, robots index/follow, dan internal links pada final HTML. Ini tidak menunjukkan blank shell atau metadata client-only pada sample.

Evidence: raw-evidence/live-url-checks.csv. Service pages sample final 200: https://dreamlab.id/, https://dreamlab.id/skincare-face-care/, https://dreamlab.id/parfum/, https://dreamlab.id/body-care/, https://dreamlab.id/hair-care/, https://dreamlab.id/baby-care/, https://dreamlab.id/services/, https://dreamlab.id/news-blog/.

Kode global metadata ada di src/app/layout.tsx:27-57. TrackingScripts dirender dari src/app/layout.tsx:7 dan 70.

PageSpeed Insights API: TIDAK DAPAT DIVERIFIKASI pada run lokal karena API key/referer blocked; lihat scripts/output/pagespeed-baseline.json.
