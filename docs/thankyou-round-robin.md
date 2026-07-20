# Thank You Round Robin Flow

## Tujuan

Menggunakan halaman `thankyou` sebagai trigger distribusi lead WhatsApp ke 3 nomor business development secara round robin.

## Alur

1. User masuk ke halaman thankyou setelah submit form atau klik CTA.
2. Halaman memanggil endpoint `GET /api/round-robin/next`.
3. API mengambil nomor berikutnya dari rotasi 3 nomor aktif.
4. Semua tombol WhatsApp di halaman itu memakai nomor yang sama.
5. Jika user tidak klik apa pun, halaman otomatis redirect ke WhatsApp setelah 3 detik.

## Prinsip Distribusi

- 3 nomor mendapat lead secara merata karena nomor dipilih sekali saat halaman dimuat.
- Satu halaman thankyou hanya memakai satu nomor aktif.
- Semua CTA di halaman yang sama harus mengarah ke nomor aktif yang sama.

## File Yang Dipakai

- `src/lib/round-robin-config.ts`
- `src/lib/round-robin.ts`
- `src/app/api/round-robin/next/route.ts`
- `src/components/ThankYouRoundRobin.tsx`
- `src/app/thankyou/google/page.tsx`
- `src/app/thankyou-medsos/page.tsx`
- `src/app/ads/thankyou/google/page.tsx`
- `src/app/ads/thankyou/metaads/page.tsx`
- `src/app/ads/thankyou-medsos/page.tsx`

## Catatan Implementasi

- Auto redirect default: 3000 ms.
- Query `skip_wa=1` menonaktifkan auto redirect.
- Query `source` dipakai untuk tracking conversion.
- Redirect dilakukan dengan nomor yang sudah dipilih, bukan memilih ulang saat tombol diklik.

## Sticky Cookie 30 Hari (PENTING untuk testing manual)

Sejak commit `9862ec3` (2026-07-15), assignment CS memakai cookie
`dreamlab_cs` yang bertahan **30 hari**. Alurnya di `getOrAssignAgent()`
(`src/lib/lead-assignment.ts`):

1. Kalau browser/device sudah punya cookie `dreamlab_cs` yang valid →
   **selalu** dapat CS yang sama, TIDAK lewat rotasi lagi.
2. Kalau belum ada cookie → baru ambil slot berikutnya dari rotasi Redis
   (`getNextAgent()` di `roundRobin.ts`) dan cookie di-set.

Ini disengaja (support retargeting campaign — user yang balik lagi tetap
ketemu CS yang sama). Konsekuensinya:

- **Testing manual dari browser yang sama berkali-kali TIDAK akan
  menunjukkan rotasi** — Anda akan terus dapat CS yang sama sampai cookie
  dihapus atau 30 hari lewat. Ini normal, bukan bug. Untuk tes rotasi
  murni, pakai incognito/private window baru setiap kali, atau hapus
  cookie `dreamlab_cs` sebelum tiap test.
- Statistik di `/api/round-robin-stats` (`totalLeads`) dan
  `/api/kommo-comparison` menghitung SEMUA assignment termasuk repeat
  visit sticky — bisa terlihat tidak merata meski rotasi Redis di
  baliknya (`totalRotations`) tetap adil. Field `stickyRatePercent` di
  `/api/round-robin-stats` menunjukkan berapa persen dari total itu
  berasal dari sticky, bukan rotasi baru.
- Untuk simulasi yang merepresentasikan kondisi ini, jalankan
  `npx tsx scripts/simulate-lead-distribution.ts` — script ini punya dua
  mode: rotasi murni (tanpa cookie) dan traffic realistis (sebagian
  visitor repeat & bawa cookie, seperti kondisi asli).
