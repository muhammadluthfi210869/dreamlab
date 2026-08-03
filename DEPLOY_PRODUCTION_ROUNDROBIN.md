# DEPLOY PRODUCTION — Round-Robin & Lead Capture (PostgreSQL Dedicated)

> Tanggal: 2026-07-31
> Status: **siap deploy** — tinggal eksekusi langkah di bawah.

## Ringkasan arsitektur baru

```
Tombol WA (4 komponen)
   │  getNextRoundRobinAgent() → GET  /api/lead-capture/next
   │  trackLead()              → POST /api/lead-capture/track
   ▼
Vercel (serverless, Next.js)
   │  src/lib/round-robin-db.ts
   ▼
PostgreSQL dedicated `dreamlab`  ← TERPISAH dari server ERP
   ├─ busdevs      (6 nomor CS)
   ├─ rr_counter   (rotasi atomik)
   └─ leads        (histori lead + tracking code)
```

- Tombol WA **tidak lagi** bergantung pada server ERP (nexerp.id).
- Kalau DB error → klien otomatis fallback ke 6 nomor (WA tetap terbuka).
- Sinkron ke ERP/Kommo tetap berjalan best-effort (fire-and-forget).

---

## 0. Opsi Paling Direkomendasikan (traffic tinggi): Server yang Sama dengan ERP

> Karena traffic lead kamu tinggi, rekomendasi utama: **jalankan DB lead di VPS
> yang sama dengan ERP, TAPI sebagai compose project TERPISAH** (`dreamlab-lead`).
> Ini full terisolasi dari ERP — push ERP tidak menyentuh DB lead, dan sebaliknya.

Folder siap pakai: **`infra/lead-db/`** di repo ini.

```
infra/lead-db/
├── docker-compose-lead.yml      # project "dreamlab-lead" (db-lead + pgbouncer)
├── .env.production.example      # env template (wajib isi LEAD_DB_PASSWORD)
└── deploy-lead.sh               # deploy + backup + health check (project terpisah)
```

**Di server VPS:**
```bash
# 1. Salin folder deploy ke server (lewat git pull, atau scp)
# 2. Masuk ke folder
cd /opt/dreamlab-lead

# 3. Buat .env (sekali saja)
cp .env.production.example .env
nano .env            # isi LEAD_DB_PASSWORD dengan password kuat (beda dari lokal)

# 4. Deploy (TIDAK menyentuh ERP)
bash deploy-lead.sh
```

**Hasil:**
| Service | Port host | Akses |
|---|---|---|
| `db-lead` (PostgreSQL 17) | `127.0.0.1:5433` | Maintenance (hanya di server) |
| `pgbouncer` | `0.0.0.0:6432` | **Vercel** (buka di firewall) |

**Lalu:**
1. Firewall buka port `6432` untuk IP Vercel.
2. `DATABASE_URL` di Vercel → `postgresql://dreamlab1:PASSWORD@IP_VPS:6432/dreamlab?sslmode=require`
3. Jalankan migration: `DATABASE_URL='...' npm run db:migrate`
4. Deploy website ke Vercel seperti biasa.

**⚠️ Satu perbaikan kecil di ERP:** `deploy.sh` ERP memakai
`docker ps | grep 'db' | head -1` untuk backup — bisa ketuker ambil container
`db-lead`. Ganti baris itu menjadi (cari container service `db` di project ERP):
```bash
DB_CONTAINER=$(docker compose ps -q db 2>/dev/null || echo "")
```

---

## 1. Pilih di mana PostgreSQL production ditaruh

### Opsi A — VPS sendiri (paling direkomendasikan untuk kontrol penuh)
Contoh: VPS Ubuntu + PostgreSQL + **PgBouncer**.

**A1. Install & siapkan PostgreSQL di VPS**
```bash
sudo apt update && sudo apt install -y postgresql pgbouncer
sudo -u postgres psql -c "CREATE ROLE dreamlab1 LOGIN PASSWORD 'GANTI-PASSWORD-KUAT';"
sudo -u postgres psql -c "CREATE DATABASE dreamlab OWNER dreamlab1;"
```

**A2. Izinkan koneksi (wajib password, bukan trust)**
Edit `/etc/postgresql/*/main/pg_hba.conf`:
```
host    all   all   0.0.0.0/0   scram-sha-256
```
Edit `/etc/postgresql/*/main/postgresql.conf`:
```
listen_addresses = '*'
```
Restart: `sudo systemctl restart postgresql`

**A3. Pasang PgBouncer di depan PostgreSQL** (WAJIB untuk Vercel serverless,
karena Vercel bisa membuka banyak koneksi sekaligus dan PG mentah hanya ±100 koneksi).
Contoh `/etc/pgbouncer/pgbouncer.ini`:
```
[databases]
dreamlab = host=127.0.0.1 port=5432 dbname=dreamlab

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
auth_type = scram-sha-256
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 20
```
File `/etc/pgbouncer/userlist.txt`:
```
"dreamlab1" "GANTI-PASSWORD-KUAT"
```
Restart: `sudo systemctl restart pgbouncer`

**A4. Firewall** — buka port PgBouncer (6432) hanya untuk IP yang perlu:
```bash
sudo ufw allow from <IP_KANTOR_KAMU> to any port 6432 proto tcp
# Jangan buka 5432 ke publik
```

### Opsi B — Managed service (paling cepat, sudah ada pooler)
- **Neon** (disarankan): `DATABASE_URL` langsung dengan `?sslmode=require`, pooler built-in.
- **Railway / Supabase paid**: sama, tidak perlu setup PgBouncer.
- Setelah buat, cukup ambil connection string → langsung lanjut ke langkah 2.

### Opsi C — Mesin lokal ini (TIDAK disarankan untuk production)
Localhost tidak bisa dijangkau Vercel. Untuk production butuh public IP + firewall
+ PgBouncer + risiko keamanan. Hanya untuk development/testing.

---

## 2. Set DATABASE_URL di Vercel

Vercel Dashboard → **Project `dreamlab-site`** → **Settings → Environment Variables**:

| Variable | Nilai production | Env |
|---|---|---|
| `DATABASE_URL` | `postgresql://dreamlab1:PASSWORD@HOST:PORT/dreamlab?sslmode=require` (sesuaikan host/port) | Production |

Contoh untuk Opsi A (PgBouncer): `postgresql://dreamlab1:PASSWORD@VPS_IP:6432/dreamlab`
Contoh untuk Opsi B (Neon): `postgresql://user:pass@ep-xxx.aws.neon.tech/dreamlab?sslmode=require`

> ⚠️ Password berisi `@`/`!`/`#` → tulis polos di URL; `src/lib/db.ts` sudah
> meng-encode-nya otomatis saat dipakai.

---

## 3. Daftar lengkap env vars yang harus ada di Vercel (Production)

Cek semua sudah ada (yang sudah ada biarkan):

| Variable | Nilai production |
|---|---|
| `DATABASE_URL` | **(BARU)** connection string PostgreSQL dedicated |
| `NEXT_PUBLIC_NEXERP_API_URL` | `https://nexerp.id/api` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://djxfhckpsdeizlsrptrb.supabase.co` (SEO data) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key Supabase (SEO data) |
| `SUPABASE_SERVICE_ROLE_KEY` | service role key Supabase |
| `UPSTASH_REDIS_REST_KV_REST_API_URL` | URL Upstash Redis (round-robin lama/statistik) |
| `UPSTASH_REDIS_REST_KV_REST_API_TOKEN` | token Upstash Redis |
| `KOMMO_SUBDOMAIN` | subdomain Kommo |
| `KOMMO_API_TOKEN` | token Kommo |
| `INTERNAL_STATS_KEY` | key proteksi endpoint statistik |
| `REVALIDATION_SECRET` | secret revalidate |
| `PSI_API_KEY` | API key PageSpeed |
| `BING_API_KEY` | API key Bing |

---

## 4. Apply migration ke database production

Dari repo `dreamlab-site`, jalankan (setelah `DATABASE_URL` production diisi):
```bash
DATABASE_URL="postgresql://dreamlab1:PASSWORD@HOST:PORT/dreamlab?sslmode=require" npm run db:migrate
```
Output yang benar:
```
✓ 00001_init_round_robin_leads.sql
✅ Semua migration selesai.
```
Verifikasi: `SELECT count(*) FROM busdevs WHERE is_active;` harus = **7**.

---

## 5. Deploy ke Vercel

```bash
vercel --prod
```
(atau push ke branch main → auto-deploy kalau sudah terhubung)

---

## 6. Verifikasi pasca-deploy

```bash
# 1. Endpoint ambil CS (harus balik JSON, bukan 404/500)
curl -s https://dreamlab.id/api/lead-capture/next

# 2. Simpan lead test
curl -s -X POST https://dreamlab.id/api/lead-capture/track \
  -H "Content-Type: application/json" \
  -d '{"intent":"PROD TEST","pageUrl":"https://dreamlab.id/prod-test","assignedName":"CS 1","assignedPhone":"6287712232389"}'

# 3. Cek di database
#    SELECT * FROM leads ORDER BY id DESC LIMIT 5;
```

- Tombol WA di halaman mana pun → harus langsung buka wa.me ke salah satu dari 6 nomor.
- Matikan server ERP sementara → tombol WA **tetap jalan** (ini tujuan utamanya).

---

## 7. Rollback

Kalau ada masalah setelah deploy:
1. **Kode**: git revert / deploy commit sebelumnya di Vercel.
2. **Database**: data di tabel `leads` tidak dipakai kode lama → aman. Kode lama
   (ERP-backed) tidak membaca tabel ini.
3. **Env**: hapus `DATABASE_URL` dari Vercel kalau mau kembali 100% ke ERP.

---

## Catatan keamanan

- Jangan expose port 5432 langsung ke internet tanpa PgBouncer + firewall.
- Password role `dreamlab1` untuk production **WAJIB beda** dari password lokal.
- Back up database rutin: `pg_dump -h HOST -U dreamlab1 dreamlab > backup.sql`.
