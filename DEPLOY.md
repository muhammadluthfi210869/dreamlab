# Panduan Deploy

## Cara Deploy

### ✅ Cara Utama: Git Push (auto-deploy via GitHub)

```bash
git add -A
git commit -m "pesan perubahan"
git push origin master
```

Vercel akan mendeteksi commit baru, build & deploy otomatis ke `dreamlab.id`.

**Semua kolaborator GitHub bisa push — Vercel tetap auto-deploy.** Tidak perlu login Vercel.

### Opsi 2: Deploy Langsung dari CLI

```bash
npx next build
vercel --prod --scope luthfi2
```

Hanya bisa oleh **pemilik akun Vercel** (karena Hobby Plan tidak support team).

## Troubleshooting

Kalau web tidak berubah setelah deploy, coba:
1. **Hard refresh** browser (`Ctrl+F5` atau `Cmd+Shift+R`)
2. **Incognito/private window** (paling pasti)
3. **Cloudflare** — purge cache jika pakai Cloudflare
