# Panduan Deploy

Ada 2 cara:

## Opsi 1: Git Push (auto-deploy via GitHub)

```bash
git add -A
git commit -m "pesan perubahan"
git push origin master
```

Vercel akan mendeteksi commit baru, build & deploy otomatis. Domain `dreamlab.id` akan terupdate.

## Opsi 2: Deploy Langsung dari CLI (lebih cepat)

```bash
npx next build
vercel --prod --scope luthfi2
```

## Troubleshooting

Kalau web tidak berubah setelah deploy, coba:
1. **Hard refresh** browser (`Ctrl+F5` atau `Cmd+Shift+R`)
2. **Incognito/private window** (paling pasti)
3. **Cloudflare** — purge cache jika pakai Cloudflare

Deploy dari CLI lebih disarankan karena build di mesin lokal (lebih cepat) dan langsung di-*alias* ke `dreamlab.id`.
