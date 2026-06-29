<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Deploy to Vercel

Saat user minta deploy, build dulu dengan `npx next build`, lalu deploy dengan:

```
vercel --prod --token [VERCEL_TOKEN_DARI_DASHBOARD] --yes
```

Info Vercel:
- Team: dreamlabid (Dreamlab)
- Dashboard: https://vercel.com/dreamlabid/dreamlab
- Domain: dreamlab.id
- Owner: dreamlab.official2021@gmail.com

Git push ttp bisa (`git add -A && git commit -m "..." && git push origin master`) tapi GitHub belum connect ke Vercel. Kalau git push gagal minta token GitHub, pakai cara Vercel CLI di atas aja.

# GSC Issue Fix Progress

## Done
- 26 × 404 URLs fixed (14 redirect + 12 410)
- Soft 404 fix deployed (generateMetadata calls notFound())
- Page bloat fix (3.3MB → ~280KB, 92%)
- 7 crawled-not-indexed articles expanded (~500 → 1,563-2,521 words)
- Schema fix (3 issues): shippingDetails inside offers, image absolute URL, priceSpec conditional — test 12/12 pass
- Fase 1: proxy.ts anomaly cleanup — 410 untuk /product-category/, /shop/, .php

## Blocked — butuh deploy ke dreamlab.id
- Vercel token dari dashboard dreamlabid team blm ada
- Bisa deploy manual dari GitHub → Vercel dashboard

## Next
- Fase 2: Export CSV per-URL dari GSC (65 crawled-not-indexed, 34 redirect, 25 canonical, 22 noindex)
- Fase 3: Sitemap cleanup (sitemap_index.xml + linktree spam)
- Fase 4: Monitoring + re-index via Indexing API
