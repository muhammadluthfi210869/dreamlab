-- 00033 — Reminder follow-up lead Warm & Hot (Tugas Web Developer Dreamlab #2.2)
--
-- Jadwal OTOMATIS tidak disimpan: dihitung dari aktivitas terakhir lead + selang per tahap (lihat src/lib/crm-reminders.ts).
-- Tabel ini hanya menyimpan:
--   * reminder MANUAL (due_at diisi sales, completed_at NULL = masih terbuka; maksimal satu terbuka per lead)
--   * catatan "sudah follow-up" (completed_at terisi) yang me-restart jadwal otomatis
-- Idempoten: aman dijalankan ulang.
BEGIN;

CREATE TABLE IF NOT EXISTS crm_followups (
  id            BIGSERIAL PRIMARY KEY,
  tracking_code TEXT NOT NULL,
  due_at        TIMESTAMPTZ NOT NULL,
  note          TEXT,
  created_by    TEXT NOT NULL,
  completed_at  TIMESTAMPTZ,
  completed_by  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Satu reminder terbuka per lead.
CREATE UNIQUE INDEX IF NOT EXISTS crm_followups_one_open_per_lead ON crm_followups (tracking_code) WHERE completed_at IS NULL;
CREATE INDEX IF NOT EXISTS crm_followups_code_idx ON crm_followups (tracking_code, completed_at);

COMMIT;
