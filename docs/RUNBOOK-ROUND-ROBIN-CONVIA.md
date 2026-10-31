# Runbook: Pembagian Sales Berdasarkan Chat Masuk + Convia

Dokumen operasi untuk tiga hal yang dikirim bersamaan: webhook Convia, lead monitor baru, dan
pembagian sales berdasarkan chat masuk. Semua bahasa Indonesia, urut dari yang paling sering dipakai.

## 1. Ringkasan sistem

| Bagian | Lokasi | Catatan |
|---|---|---|
| Webhook Convia | `src/app/api/lead-capture/convia/route.ts`, `src/lib/convia-webhook.ts` | Memverifikasi tanda tangan, meneruskan ke logika `confirm` yang sama dengan jalur Meta |
| Lead monitor | `src/app/lead-monitor/page.tsx`, `src/app/api/lead-monitor/stats/route.ts`, `src/lib/lead-monitor-stats.ts` | Satu sumber hitung: kartu = grafik = tabel |
| Pembagian sales | `db/migrations/00024_confirmed_balance_round_robin.sql` | Default `sequential` (perilaku lama). Tidak berubah sampai saklar dibalik |
| Referensi algoritma + tes | `src/lib/round-robin-balance.ts`, `scripts/test-round-robin-balance.ts` | SQL meniru file ini |

## 2. Variabel lingkungan (Vercel, Production)

| Nama | Fungsi |
|---|---|
| `CONVIA_WEBHOOK_SECRET` | Signing secret dari Convia (Developers > Webhooks). **Wajib.** Kalau kosong, endpoint Convia membalas 500 dan menolak semua event |
| `CONVIA_API` | API key Convia (`sk_live_...`). Hanya untuk pengecekan dari server/skrip; tidak dibaca situs |

Setelah mengubah variabel di Vercel, **redeploy** supaya terbaca.

## 3. Mengaktifkan webhook Convia

1. Pastikan `CONVIA_WEBHOOK_SECRET` sudah ada di Vercel dan situs sudah ter-deploy.
2. Di Convia: Developers > Webhooks > buat/aktifkan webhook ke `https://dreamlab.id/api/lead-capture/convia`.
   Events: **Message > Received** saja. Channels: **WhatsApp** saja.
   Convia **menonaktifkan webhook otomatis** setelah gagal beruntun, jadi aktifkan ulang bila sempat mendapat 404/500.
3. Klik **Test** di Convia. Balasan yang benar: HTTP 200 dengan `"ignored": true`.
4. Kirim chat berkode (`[Kode: DL-...]`) ke nomor Jessica. Lead berubah jadi `confirmed` di Lead Monitor.

Perilaku endpoint: pesan riwayat Coexistence (`is_history_message`), pesan keluar, event status, revoke/edit/reaksi,
dan channel selain WhatsApp dilewati dengan balasan 200. Dedup memakai `wamid`, jadi pesan yang sama dari dua jalur
(Meta/ERP dan Convia) tidak terhitung dua kali.

## 4. Menyalakan pembagian berdasarkan chat masuk

> Jangan melompati urutan ini. Alasannya ada di bagian 6.

### 4.1 Pasang migrasi (perilaku tidak berubah)
```bash
node scripts/run-migration.mjs db/migrations/00024_confirmed_balance_round_robin.sql --dry-run   # cek dulu, dibatalkan
node scripts/run-migration.mjs db/migrations/00024_confirmed_balance_round_robin.sql             # terapkan
```
Jalankan di jam sepi. Migrasi mengganti `assign_next_agent` dan `assign_and_insert_lead` (salinan fungsi live,
hanya blok pemilihan sales yang berubah) dan menambah `rr_choose_agent`, `rr_settings`, `rr_shadow_log`.
Default `rr_mode = 'sequential'`.

Uji ulang kapan saja (selalu di-ROLLBACK, tidak menyimpan apa pun): `npm run verify:rr-sql`.

### 4.2 Mode bayangan (1–2 hari)
```sql
UPDATE rr_settings SET value='shadow', updated_at=NOW() WHERE key='rr_mode';
```
Pembagian tetap giliran berurutan. Pilihan balancer dicatat di `rr_shadow_log`. Lihat apakah masuk akal:
```sql
SELECT reason, COUNT(*) FROM rr_shadow_log WHERE at > NOW() - INTERVAL '1 day' GROUP BY 1;
SELECT balanced_agent, COUNT(*) FROM rr_shadow_log WHERE at > NOW() - INTERVAL '1 day' AND reason='balanced' GROUP BY 1;
```
Bila hampir semua `reason` adalah `fallback-not-ready` atau `fallback-stale`, artinya belum cukup nomor yang
chatnya tertangkap. Lihat baris "klik -> chat (x%)" di kartu **Chat Masuk per BusDev** (merah = banyak klik tapi
hampir tidak ada chat). Perbaiki jalurnya dulu, jangan dinyalakan.

### 4.3 Nyalakan
```sql
UPDATE rr_settings SET value=NOW()::text, updated_at=NOW() WHERE key='balance_since';   -- hitungan chat mulai nol
UPDATE rr_settings SET value='confirmed_balance', updated_at=NOW() WHERE key='rr_mode';
```

### 4.4 SAKLAR DARURAT (tanpa deploy)
```sql
UPDATE rr_settings SET value='sequential', updated_at=NOW() WHERE key='rr_mode';
```
Berlaku pada klik berikutnya.

## 5. Cara kerja balancer (aturan batas putaran)

Murni **chat masuk berkode**; klik yang belum chat tidak ikut dihitung.

1. Hitung chat masuk tiap sales **hari ini** (reset tengah malam WIB, atau sejak `balance_since` bila lebih akhir).
2. **Batas putaran** = (chat sales terendah / Q + 1) x Q, dengan Q = `round_size` (default **2**).
   Contoh Q=5: Annisa 5, Jessica 3, Diaz 3 -> batas 5 -> Annisa berhenti dapat klik sampai Jessica dan Diaz
   juga 5; setelah itu batas naik jadi 10.
3. Klik baru -> sales yang masih di bawah batas dan chatnya paling sedikit. Seri: yang paling lama tidak
   kebagian klik, lalu urutan giliran.

Sticky nomor (180 hari), sticky browser (30 hari), dedup 24 jam, dan lock advisory tidak berubah.
Sales yang dinonaktifkan (`busdevs.is_active = false`, mis. Irma sejak 31 Okt 2026) tidak ikut sama sekali.

| Pengaman | Aturan |
|---|---|
| Macet | Sales dengan >= `stuck_clicks` (default 40) klik sejak chat terakhir, nol chat hari ini, dan tidak ada chat 6 jam dikeluarkan dari hitungan batas: sales sehat **tidak ikut menunggu**. Sales macet tetap dapat 1 dari 8 klik (klik uji) agar bisa pulih |
| Data basi | Jam kerja 08.00–21.00 WIB dan tidak ada chat masuk dari siapa pun 6 jam: giliran berurutan |
| Belum siap | Kurang dari 2 sales yang tidak macet: giliran berurutan |
| Tanpa kandidat | Semua terblokir: giliran berurutan. **Lead tidak pernah tertahan** |

Mengubah pengaturan tanpa deploy:
```sql
UPDATE rr_settings SET value='5',  updated_at=NOW() WHERE key='round_size';    -- naikkan saat volume chat > 15/hari
UPDATE rr_settings SET value='40', updated_at=NOW() WHERE key='stuck_clicks';
```

**Konsekuensi yang harus dipahami.** Klik ditugaskan *sebelum* pelanggan chat, jadi klik yang sudah dibagikan ke
sales yang kemudian mencapai batas masih bisa menjadi chat dan membuatnya melewati batas satu-dua chat.
Selisih akhir hari antar sales kecil (simulasi: <= 6), bukan nol. Selama satu sales tertinggal jauh, hanya sales
yang tertinggal itu yang menerima klik, jadi sales lain tampak "sepi" sementara; itu disengaja.
Nomor yang penangkapnya rusak kehilangan sekitar 40 klik sebelum terdeteksi macet (sekali), lalu hanya klik uji.

## 6. Kenapa balancer tidak boleh dinyalakan sebelum semua nomor terbukti menangkap chat

Balancer hanya melihat chat yang *tertangkap*. Per 24–31 Okt 2026: Annisa 30 chat, Diaz 13, Jessica 0, Irma 0
(dari ~135–140 klik masing-masing). Tanpa bukti jalur chat, sales dengan jalur rusak tampak "paling sedikit chat"
dan akan menyedot klik (Black Hole Loop di migrasi 00021). Pengaman "macet" menahan itu setelah ~40 klik, tetapi
syarat sebenarnya: **tiap sales aktif sudah punya minimal satu chat nyata tertangkap dari klik CTA**.
Irma tidak punya jalur penangkap dan dinonaktifkan dari rotasi (31 Okt 2026). Jessica via Convia: tes webhook
berhasil (31 Okt), tetapi belum ada chat nyata dari klik yang ditugaskan ke Jessica.

## 7. Memeriksa merata atau tidak

Lead Monitor > kartu **Chat Masuk per BusDev**: lencana kemerataan (selisih porsi chat terbesar dan terkecil:
<= 10 poin Merata, <= 20 Agak timpang, selebihnya Timpang). Target dengan 3 sales aktif: tiap sales 25–42% chat dalam 7 hari.
Rollback bila satu sales menerima > 50% klik baru dalam 2 jam atau chat berhenti tercatat.

## 8. Tes

```bash
npm run test:convia        # tanda tangan + normalisasi payload Convia
npm run test:lead-monitor  # kartu = tabel, merge, skor Top Leads, peringkat halaman asal
npm run test:rr-balance    # simulasi pembagian + pengaman
npm run verify:rr-sql      # migrasi di DB sungguhan dalam transaksi yang di-rollback
npm run verify:waba        # webhook Meta end-to-end (menulis lalu menghapus lead uji di live)
```
