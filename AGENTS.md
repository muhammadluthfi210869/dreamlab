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
