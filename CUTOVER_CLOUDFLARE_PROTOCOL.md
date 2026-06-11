# PROTOKOL CUTOVER CLOUDFLARE — Dreamlab ID Migration

## Prasyarat
- [ ] Domain `dreamlab.id` sudah di-rutekan melalui Cloudflare (NS diubah ke Cloudflare)
- [ ] Cloudflare Proxy (Orange Cloud) **AKTIF** pada A Record / CNAME
- [ ] SSL/TLS mode: **Full (strict)** — Cloudflare ↔ Netlify
- [ ] Netlify site sudah live dengan custom domain `dreamlab.id` terkonfigurasi
- [ ] Build Netlify terakhir **lolos dengan status OK**

---

## FASE 0: PRA-CUTOVER (H-1)

### 0.1 Cloudflare DNS Setup (SAAT INI, sebelum cutover)
```
Type: A
Name: dreamlab.id
Content: <IP VPS WORDPRESS SAAT INI>
Proxy: ON (Orange Cloud)
TTL: Auto
```

### 0.2 Netlify Custom Domain
Pastikan Netlify sudah terkonfigurasi menerima `dreamlab.id`:
- Netlify Dashboard → Domain settings → Add custom domain `dreamlab.id`
- Netlify akan memberikan verification TXT record → tambahkan di Cloudflare

### 0.3 Backup WordPress
- Full backup VPS: filesystem + database
- Ekspor sitemap terakhir (simpan CSV URL)

---

## FASE 1: CUTOVER (DETIK EKSEKUSI)

### 1.1 Switch A Record di Cloudflare
```
HAPUS: A dreamlab.id → <IP VPS WORDPRESS>
TAMBAH: CNAME dreamlab.id → <nama-netlify-site>.netlify.app
Proxy: ON (Orange Cloud) — WAJIB
TTL: Auto
```

> **Kenapa CNAME ke Netlify, bukan A Record?**
> Netlify menggunakan load-balancing dinamis. IP mereka berubah tanpa pemberitahuan.
> CNAME memastikan resolusi selalu mengarah ke edge node yang benar.

### 1.2 Verifikasi 30 Detik
```bash
curl -sI https://dreamlab.id/ | head -5
# Harus return HTTP/2 200 + server: Netlify
```

---

## FASE 2: ROLLBACK 1-MILISECOND (JIKA GAGAL)

> **Ini keunggulan Cloudflare Proxy:** DNS record berubah **instant** karena traffic user selalu ke Cloudflare edge dulu (bukan ke origin langsung).

### 2.1 Trigger Rollback
Jika dalam **60 detik pertama** terjadi salah satu:
- [ ] HTTP 5xx beruntun dari Netlify
- [ ] Halaman utama tidak merender konten
- [ ] JavaScript fatal exception (blank page)
- [ ] Sitemap return error

### 2.2 Eksekusi Rollback
```
HAPUS: CNAME dreamlab.id → *.netlify.app
TAMBAH: A dreamlab.id → <IP VPS WORDPRESS LAMA>
Proxy: ON (Orange Cloud)
```

**Waktu propagasi: 0 detik.** Traffic langsung kembali ke WordPress.
Googlebot dan pengguna tidak akan mendeteksi downtime.

---

## FASE 3: POST-CUTOVER MONITORING (72 JAM)

### 3.1 Google Search Console (24/7)
- **Coverage report**: pantau "Submitted and indexed" — tidak boleh turun
- **Core Web Vitals**: pantau LCP/INP/CLS per page
- **Security & Manual Actions**: pantau setiap jam

### 3.2 Crawl Monitoring
```bash
# Screaming Frog atau Sitebulb, crawl full site
# Pastikan 0 redirect chain, 0 soft 404
```

### 3.3 Sitemap Resubmission
- Submit `https://dreamlab.id/sitemap.xml` ke GSC
- Pantau "Discovered URLs" vs "Indexed URLs"

### 3.4 Analytics
- GA4: bandingkan real-time users vs baseline
- Pantau bounce rate spike (indikasi broken UX)

---

## FASE 4: DEKLARASI SUKSES (H+7)

- [ ] 0 penurunan indexed pages di GSC
- [ ] Organic traffic stabil ±5% dari baseline
- [ ] Core Web Vitals ≥ WordPress baseline
- [ ] 0 broken internal links
- [ ] Semua 301 redirect berfungsi

### 4.1 Hapus WordPress (H+30)
Setelah 30 hari zero issue:
- Matikan VPS WordPress
- Hapus A Record backup dari Cloudflare

---

## Catatan Kritis

1. **JANGAN PERNAH mengganti Name Server** — Cloudflare NS tetap. Kita hanya ubah record di dalamnya.
2. **Orange Cloud WAJIB ON** — Tanpa proxy, DNS propagation bisa 24-48 jam (malapetaka SEO).
3. **SSL/TLS = Full (strict)** — Cloudflare memvalidasi sertifikat Netlify. Bukan "Flexible".
4. **Always Use HTTPS** — ON di Cloudflare.
5. **Caching Rules**: Set Cache Level = "Standard", Browser Cache TTL = 4 hours, Crawler Hints = ON.
