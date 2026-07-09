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
