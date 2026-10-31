-- ============================================================
-- 00025_crm_login_pipeline.sql
--
-- Login per orang (nama + kata sandi) + data CRM internal Lead Monitor:
--   crm_users          akun (Head + sales); kata sandi disimpan ter-hash (scrypt), tidak pernah plaintext
--   crm_sessions       sesi login (token acak; yang disimpan hanya hash SHA-256-nya)
--                      "ingat saya" = 30 hari, tanpa itu = 12 jam
--   crm_lead_state     tahap pipeline + Produk/MOQ/catatan isian manual busdev, per kode klik
--   crm_stage_history  riwayat perpindahan tahap (siapa, kapan)
--
-- KATA SANDI AWAL: password_hash NULL = belum pernah diganti, artinya kata sandinya = nama akun
-- (huruf besar/kecil tidak dibedakan). must_change_password = TRUE memaksa penggantian pada login pertama.
--
-- HANYA MENAMBAH: tidak ada kolom/tabel yang sudah ada diubah, termasuk tabel `leads`.
-- Aman dijalankan ulang (IF NOT EXISTS / ON CONFLICT DO NOTHING).
-- ============================================================

BEGIN;

SET LOCAL lock_timeout = '5s';

CREATE TABLE IF NOT EXISTS crm_users (
  id                   BIGSERIAL PRIMARY KEY,
  name                 TEXT NOT NULL,
  role                 TEXT NOT NULL CHECK (role IN ('head', 'sales')),
  password_hash        TEXT,
  must_change_password BOOLEAN NOT NULL DEFAULT TRUE,
  password_changed_at  TIMESTAMPTZ,
  is_active            BOOLEAN NOT NULL DEFAULT TRUE,
  failed_attempts      INT NOT NULL DEFAULT 0,
  locked_until         TIMESTAMPTZ,
  last_login_at        TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS crm_users_name_lower_uniq ON crm_users (lower(name));

CREATE TABLE IF NOT EXISTS crm_sessions (
  token_hash   TEXT PRIMARY KEY,
  user_id      BIGINT NOT NULL REFERENCES crm_users (id) ON DELETE CASCADE,
  remember     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at   TIMESTAMPTZ NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent   TEXT
);
CREATE INDEX IF NOT EXISTS crm_sessions_user_idx ON crm_sessions (user_id);
CREATE INDEX IF NOT EXISTS crm_sessions_expires_idx ON crm_sessions (expires_at);

CREATE TABLE IF NOT EXISTS crm_lead_state (
  tracking_code    TEXT PRIMARY KEY,
  stage            TEXT NOT NULL DEFAULT 'traffic'
                   CHECK (stage IN ('traffic', 'loker', 'tidak_jelas', 'cold', 'warm', 'hot', 'sample', 'deal')),
  produk_manual    TEXT,
  moq_manual       INT CHECK (moq_manual IS NULL OR moq_manual >= 0),
  note             TEXT,
  owner            TEXT,
  stage_changed_at TIMESTAMPTZ,
  updated_by       TEXT,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS crm_lead_state_stage_idx ON crm_lead_state (stage);

CREATE TABLE IF NOT EXISTS crm_stage_history (
  id            BIGSERIAL PRIMARY KEY,
  tracking_code TEXT NOT NULL,
  from_stage    TEXT,
  to_stage      TEXT NOT NULL,
  changed_by    TEXT NOT NULL,
  changed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS crm_stage_history_code_idx ON crm_stage_history (tracking_code, changed_at DESC);

-- Akun awal. Nama sales HARUS sama dengan busdevs.name (dipakai untuk menentukan "lead milik siapa").
-- Kata sandi awal = nama akun; wajib diganti pada login pertama.
INSERT INTO crm_users (name, role) VALUES
  ('Head', 'head'),
  ('Annisa', 'sales'),
  ('Diaz', 'sales'),
  ('Jessica', 'sales')
ON CONFLICT ((lower(name))) DO NOTHING;

COMMIT;
