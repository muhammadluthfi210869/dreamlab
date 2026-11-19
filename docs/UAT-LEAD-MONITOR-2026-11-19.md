# UAT Lead Monitor / CRM — dreamlab.id (tenggat 23 November 2026)

Alamat: `https://dreamlab.id/lead-monitor`. Masuk dengan nama akun + `password123` bila belum pernah mengganti
(Admin, Annisa, Jessica). Head dan Diaz memakai kata sandi sendiri.

## Sudah diuji otomatis (bukti)
| Perintah | Isi | Hasil 19 Nov |
|---|---|---|
| `npm run test:crm-all` | login, tahap, Warm dua arah, penangkap pesan, reminder, SQL (Postgres sungguhan di memori) | semua lulus (SEMUA LOLOS + 10 + 9 + 11 + 21) |
| `npm run test:rr-live` | round robin di fungsi database produksi, dalam transaksi yang di-rollback | 7 kelompok lulus, rollback terbukti |
| `node scripts/e2e-live-crm.mjs` | alur nyata di dreamlab.id: klik → nomor → balasan → Warm → reminder, data uji dihapus sesudahnya | 27 lulus, 0 gagal |

Yang TIDAK bisa diuji otomatis: pesan WhatsApp sungguhan dari nomor lead. Langkah di bawah dikerjakan manual.

## Checklist UAT manual
**2.1 Bubble chat balasan**
1. Buka *Chat WABA* sebagai PIC. Dari HP lead (nomor lain), klik tombol WhatsApp di landing page lalu kirim pesan berkode.
2. Biarkan halaman Chat WABA terbuka, balas dari HP lead 2–3 kali (teks, lalu foto).
3. Harapan: dalam ±8 detik balasan muncul di percakapan nomor itu (foto tampil sebagai "[Gambar]"), tanpa membuka ulang halaman, tidak ada percakapan ganda.

**2.2 Reminder follow-up**: menu *Pengingat*. PIC melihat lead Warm dan Hot miliknya dengan tanggal, status (Terlambat / Hari ini / Mendatang). Coba *Jadwalkan*, *Tunda 1 hari*, *Sudah follow-up*. Head memfilter per PIC.

**2.3 Otomasi Warm**: lead baru (Traffic/Cold) → total 5 pesan dua arah (lead + sales) → otomatis masuk Warm (cek *Sales Pipeline*). Lead yang sudah Hot/Sample tidak mundur.

**2.4 Nomor di entri klik**: Dashboard → tabel: entri klik tampil dengan label *Landing Page – Klik WhatsApp* dan belum ada nomor; setelah pesan masuk, nomor tampil (sumber "WA").

**2.5 Round robin**: 6+ klik tombol WA dari perangkat/browser berbeda berturut-turut → PIC bergiliran Annisa → Diaz → Jessica; sales nonaktif (Irma, Pak Bagir) dilewati; satu lead = satu PIC.

## Keputusan bawaan yang masih perlu disetujui atasan
1. **Warm 500 vs Warm Up 500**: MOQ ≤ 500 atau belum diketahui → *Warm 500*; 501–999 → *Warm Up 500*; ≥ 1.000 → *Warm 1.000+*. MOQ diambil dari isian manual, lalu dari form.
2. **Selang reminder**: Warm 3 hari, Hot 1 hari sejak aktivitas terakhir (pesan terakhir / "sudah follow-up" / pindah tahap). Ubah di `src/lib/crm-reminders.ts` (`FOLLOWUP_INTERVAL_DAYS`).

## Perlu diketahui
- Otomasi Warm hanya berjalan untuk **pesan baru**. Lead lama yang sudah punya ≥ 5 pesan belum otomatis dipindah (perlu keputusan: jalankan sekali untuk lead yang ada?).
- Pesan **keluar** hanya tercatat bila sales membalas lewat kotak Chat WABA, atau webhook WhatsApp Business (echo) / Convia mengirimnya. Balasan sales dari aplikasi WhatsApp biasa belum masuk sampai webhook itu aktif; sampai itu, hitungan "dua arah" mayoritas masih pesan masuk.
- Webhook Convia baru menerima 2 uji coba (16 Nov), belum ada pesan nyata.
