# Backup DNS Dreamlab — Cloudflare sebagai cadangan Qwords

Tugas Web Developer #1 (tenggat 20 November 2026). Dokumen ini = inventaris record, cara mengaktifkan backup, cara
mengembalikan, dan jawaban soal hosting. Disusun 19 November 2026 dari pencarian DNS publik.

## 1. Kondisi sekarang (terukur)

| Hal | Hasil |
|---|---|
| Nameserver aktif (di Qwords) | `dnsiix1.qwords.net`, `dns1.qwords.id`, `dnsiix2.qwords.net`, `dns2.qwords.id` |
| DNSSEC | **Tidak aktif** (tidak ada record DS) — mengganti nameserver aman, tidak perlu mematikan apa pun |
| Website (`@` dan `www`) | **Vercel** (A `216.198.79.1`; `www` CNAME `20b97db936799998.vercel-dns-017.com`) |
| Email | **Google Workspace** (MX `0 smtp.google.com`, SPF, DKIM `google._domainkey`, DMARC `p=reject`) |
| Hosting Qwords | **Tidak ada record yang menunjuk ke hosting Qwords** (lihat §5) |
| Subdomain lain aktif | Tidak ditemukan (dicoba 40 nama umum + semua nama di kode; hanya `@` dan `www` yang punya record web) |

## 2. Record yang HARUS disalin ke Cloudflare

| Nama | Tipe | Isi | Proxy Cloudflare |
|---|---|---|---|
| `@` (dreamlab.id) | A | `216.198.79.1` | **DNS only** (awan abu-abu) |
| `www` | CNAME | `20b97db936799998.vercel-dns-017.com` | **DNS only** |
| `@` | MX | prioritas `0` → `smtp.google.com` | — |
| `@` | TXT | `v=spf1 include:_spf.google.com ~all` | — |
| `@` | TXT | `google-site-verification=xbEDjXMgxa8PqdCWCHtZ9-7xbPIgRcxc2azHdOLUBCE` | — |
| `@` | TXT | `google-site-verification=tTM2F7rbEPYHDU-674JtMurcH1LuAtSnM1u9jpBbVQE` | — |
| `@` | TXT | `google-site-verification=JpbwtS1RwvIk1AoQ-BDYdbCGl6-B3IQQVznp8mFdvH8` | — |
| `_dmarc` | TXT | `v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s; pct=100` | — |
| `google._domainkey` | TXT | kunci DKIM (2 potongan, panjang) — **salin dari panel Qwords**, jangan diketik ulang | — |
| `_acme-challenge` | TXT | `eMTQFFcihBe-OigS9rvVIvo1Jwx23J0tGcKfl6jFMLU` dan `r272r-UoavCvh-mkR3h-ed95I74enDbqJg5DLIkR9r4` (2 record) | — |

Catatan penting:
- **Awan harus abu-abu (DNS only)** untuk `@` dan `www`. Vercel menerbitkan sertifikat HTTPS sendiri; proxy Cloudflare di depannya bisa merusak sertifikat dan menimbulkan pengalihan berulang.
- Alamat IPv6 `64:ff9b::...` yang muncul di beberapa pencarian adalah **hasil sintetis jaringan**, bukan record asli. Jangan disalin.
- Daftar ini dari pencarian publik; record yang tidak tampak dari luar (mis. subdomain rahasia) hanya bisa ditemukan dari **panel DNS Qwords**. Saat menyalin, pakai fitur ekspor/zone file Qwords bila ada, lalu bandingkan dengan tabel ini.

## 3. Menyiapkan backup (sekali, tanpa mengganggu situs)

1. Masuk dashboard Cloudflare (akun milik Dreamlab) → **Add a site** → `dreamlab.id` → paket **Free**.
2. Cloudflare memindai record otomatis. **Hapus yang tidak ada di tabel §2**, tambahkan yang kurang, pastikan awan `@` dan `www` abu-abu. Tambahkan DKIM dari panel Qwords.
3. Cloudflare menampilkan dua nameserver (mis. `xxx.ns.cloudflare.com`). **Catat** — itu dipakai saat pengaktifan. **Jangan ganti nameserver di registrar sekarang**: zona dibiarkan berstatus *Pending*, situs tetap memakai Qwords.
4. Verifikasi isi zona Cloudflare sama dengan Qwords (menjawab walau masih *Pending*):
   ```
   node scripts/dns-compare.mjs dnsiix1.qwords.net <nameserver-cloudflare-1>
   ```
   Harapan: `0 berbeda`. Ulangi ke nameserver Cloudflare ke-2. Tambahkan `--extra=sub1,sub2` bila ada subdomain lain.
5. Simpan salinan zona (ekspor Cloudflare → file `.txt`) di tempat aman, mis. folder tim.

## 4. Mengaktifkan backup saat Qwords DNS gangguan

1. Buka panel **registrar** domain (tempat nameserver diatur) → ubah nameserver dari 4 milik Qwords menjadi **2 milik Cloudflare**.
2. Di Cloudflare tekan **Check nameservers**. Status berubah *Active* setelah Cloudflare mendeteksi.
3. Cek: `nslookup dreamlab.id` memberi `216.198.79.1`; buka `https://dreamlab.id` dan `https://www.dreamlab.id`; kirim email uji ke alamat @dreamlab.id.
4. **Perkiraan waktu: beberapa jam sampai 24–48 jam** (TTL nameserver di registri .id). Karena itu ini cadangan *bencana*, bukan *failover* instan.

Pengembalian (setelah Qwords pulih): ubah nameserver kembali ke 4 milik Qwords, tunggu rambat, lalu cek hal yang sama. Sebelum mengembalikan, pastikan **perubahan record yang dibuat selama di Cloudflare** juga disalin ke Qwords.

## 5. Jawaban: apakah gangguan juga mencakup hosting Qwords?

**Dari bukti DNS: tidak — hosting Qwords tidak dipakai untuk website atau email.**
- Website di **Vercel** (A/CNAME ke Vercel). Gangguan DNS Qwords membuat nama domain tidak terjawab, tetapi isi situs aman di Vercel dan pulih begitu DNS menjawab (atau setelah beralih ke Cloudflare).
- Email di **Google Workspace**, bukan hosting Qwords.
- Tidak ada record (A/MX/CNAME) yang menunjuk ke server hosting Qwords.

**Yang tidak bisa dipastikan dari luar (perlu dicek di panel Qwords oleh pemilik akun):** apakah masih ada paket hosting/cPanel Qwords yang aktif untuk keperluan lain (arsip WordPress lama, email lama, file). Bila ada, itu **butuh backup terpisah** (backup file + database dari cPanel), karena Cloudflare DNS tidak menyimpan isi hosting. Bila tidak ada, tidak ada yang perlu dibackup di sisi hosting.

## 6. Yang masih menunggu pemilik (tidak bisa dikerjakan tanpa akses akun)

- [ ] Login Cloudflare dan menambahkan situs `dreamlab.id` (langkah §3.1–3.3) — perubahan akun, dilakukan pemilik.
- [ ] Mengambil isi DKIM dari panel Qwords dan mengecek record tersembunyi (§2).
- [ ] Mengecek paket hosting Qwords yang masih aktif (§5).
- [ ] Menjalankan `dns-compare` (§3.4) dan melaporkan hasilnya.
