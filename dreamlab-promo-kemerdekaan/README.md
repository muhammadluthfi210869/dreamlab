# Landing Page — Promo Kemerdekaan Dreamlab

Static landing page (1 file HTML, no build step). Siap dibuka di VS Code, di-push ke Git, dan di-deploy ke Vercel.

## Struktur folder

```
dreamlab-promo-kemerdekaan/
├── index.html          <- landing page utama
├── assets/
│   ├── promo-skincare-bodycare.png   (dipakai untuk Paket Kidscare)
│   ├── promo-haircare.png            (dipakai untuk Paket Haircare Growth & Smooth)
│   └── promo-parfum.png              (dipakai untuk Paket Parfum)
├── vercel.json
├── .gitignore
└── README.md
```

## Sebelum push — checklist wajib

Semua item ini ditandai juga di komentar paling atas `index.html`:

1. **Round robin WhatsApp** — semua tombol CTA sekarang mengarah ke:
   ```
   https://dreamlab.id/ads/thankyou/promo-kemerdekaan/?msg=Ambil+Promo+Kemerdekaan
   https://dreamlab.id/ads/thankyou/promo-kemerdekaan-kidscare/?msg=Ambil+Promo+Kemerdekaan
   https://dreamlab.id/ads/thankyou/promo-kemerdekaan-haircare-growth/?msg=Ambil+Promo+Kemerdekaan
   https://dreamlab.id/ads/thankyou/promo-kemerdekaan-haircare-smooth/?msg=Ambil+Promo+Kemerdekaan
   https://dreamlab.id/ads/thankyou/promo-kemerdekaan-parfum/?msg=Ambil+Promo+Kemerdekaan
   ```
   Cek ke tim dev/ads Dreamlab: apakah param `?msg=` itu yang dibaca script round robin kamu (atau perlu diganti nama param-nya), dan apakah slug per paket (`-kidscare`, `-haircare-growth`, dst.) sudah terdaftar di sistem round robin — kalau belum, perlu dibuatkan dulu di backend supaya tidak 404.

2. **Ganti nama brand di 2 tempat placeholder:**
   - `[INSERT: jumlah brand yang sudah dibantu Dreamlab]` — kalau ada angka real.
   - `[INSERT: berapa hari proses produksi rata-rata]` (di bagian FAQ/Process) — isi angka dari tim produksi.

3. **Domain final** — ganti placeholder `https://promo-kemerdekaan.dreamlab.id/` di `<link rel="canonical">`, `og:url`, dan `og:image` (bagian `<head>`) dengan domain asli setelah kamu tahu URL final di Vercel/custom domain.

## Deploy ke Vercel via VS Code

```bash
cd dreamlab-promo-kemerdekaan
git init
git add .
git commit -m "Landing page promo kemerdekaan Dreamlab"

# push ke GitHub dulu (opsional tapi direkomendasikan)
git remote add origin <URL_REPO_GITHUB_KAMU>
git branch -M main
git push -u origin main

# deploy ke Vercel
npx vercel        # login & link project (sekali saja)
npx vercel --prod # deploy ke production
```

Atau tanpa CLI: import repo GitHub-nya langsung dari dashboard vercel.com → "Add New Project" → pilih repo ini → Deploy (tidak perlu build command, karena ini static HTML).

Setelah dapat URL Vercel (atau custom domain kamu pasang), balik lagi ke checklist poin 3 di atas untuk update canonical/OG URL, lalu redeploy.
