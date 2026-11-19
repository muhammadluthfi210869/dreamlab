-- 00032 — Login Lead Monitor dipermudah (keputusan pemilik 2026-11-19)
--   * Akun yang BELUM menetapkan kata sandinya sendiri (must_change_password = TRUE, atau tanpa hash) dikembalikan ke
--     kata sandi bawaan: password_hash NULL => website menerima password123 (lihat DEFAULT_PASSWORD di src/lib/crm-auth.ts).
--   * Akun yang SUDAH ganti (must_change_password = FALSE dan punya hash) TIDAK disentuh.
--   * Akun "Admin" (peran head = kelola akun + edit semua) dengan kata sandi bawaan password123.
-- Idempoten: aman dijalankan ulang.
BEGIN;

UPDATE crm_users
   SET password_hash = NULL, must_change_password = FALSE, password_changed_at = NULL,
       failed_attempts = 0, locked_until = NULL, updated_at = NOW()
 WHERE must_change_password = TRUE OR password_hash IS NULL;

INSERT INTO crm_users (name, role, must_change_password)
SELECT 'Admin', 'head', FALSE
 WHERE NOT EXISTS (SELECT 1 FROM crm_users WHERE lower(name) = 'admin');

COMMIT;
