-- ============================================================
-- 00024_confirmed_balance_round_robin.sql
--
-- PEMBAGIAN SALES BERDASARKAN CHAT MASUK (bukan klik), dengan pengaman.
--
-- Latar: sales dipilih saat KLIK (nomor tujuan WA harus sudah diketahui), padahal
-- chat baru terjadi menit kemudian. Maka klik baru diberikan ke sales dengan
-- "skor proyeksi" terendah:
--
--     skor = chat_masuk_sejak_balance_since + 0.4 x klik_menggantung_30_menit
--
-- Pengaman (belajar dari "Black Hole Loop" di migrasi 00021, saat satu sales yang HP-nya
-- offline terlihat "paling sedikit chat" lalu memonopoli lead):
--   1. Batas tumpukan : > 5 klik menggantung DAN > 1,5x rata-rata semua sales -> dilewati
--   2. Batas beruntun : 3 klik terakhir ke sales yang sama -> klik berikut ke sales lain
--   3. Cek kesehatan  : jam kerja (08-21 WIB), tanpa chat 3 jam padahal sales lain ada chat
--                       = "degraded", hanya dapat 1 dari 8 klik (klik uji, bergiliran)
--   4. Fallback       : tanpa kandidat / tidak ada chat sama sekali 60 menit di jam kerja /
--                       BELUM SIAP (di jam kerja kurang dari mayoritas sales yang terbukti
--                       menangkap chat) -> giliran berurutan seperti sebelumnya
--   5. Saklar mode    : rr_settings.rr_mode = 'sequential' | 'shadow' | 'confirmed_balance'
--
-- DEFAULT 'sequential' => perilaku TIDAK berubah sampai saklar dibalik.
-- Yang dipertahankan persis dari fungsi live: sticky nomor (180 hari), sticky browser
-- (30 hari), dedup 24 jam, pg_advisory_xact_lock(987654321), pengecualian is_test.
-- Logika memutuskan meniru src/lib/round-robin-balance.ts (diuji scripts/test-round-robin-balance.ts).
--
-- CARA OPERASI (semua tanpa deploy):
--   Mode bayangan : UPDATE rr_settings SET value='shadow', updated_at=NOW() WHERE key='rr_mode';
--                   -> tetap giliran berurutan, pilihan balancer dicatat di rr_shadow_log
--   Nyalakan      : UPDATE rr_settings SET value=NOW()::text, updated_at=NOW() WHERE key='balance_since';
--                   UPDATE rr_settings SET value='confirmed_balance', updated_at=NOW() WHERE key='rr_mode';
--   SAKLAR DARURAT: UPDATE rr_settings SET value='sequential', updated_at=NOW() WHERE key='rr_mode';
--
-- Sales "aktif" tetap ditentukan busdevs.is_active (tidak diubah oleh migrasi ini).
-- ============================================================

BEGIN;

SET LOCAL lock_timeout = '5s';

CREATE TABLE IF NOT EXISTS rr_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO rr_settings (key, value) VALUES
  ('rr_mode', 'sequential'),
  ('balance_since', NOW()::text)
ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS rr_shadow_log (
  id               BIGSERIAL PRIMARY KEY,
  at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  counter          INT,
  sequential_agent TEXT,
  balanced_agent   TEXT,
  reason           TEXT,
  snapshot         JSONB
);
CREATE INDEX IF NOT EXISTS rr_shadow_log_at_idx ON rr_shadow_log (at DESC);

-- ----------------------------------------------------------------------------
-- rr_choose_agent: memilih sales untuk klik baru (hanya dipanggil bila tidak ada sticky).
--   p_counter  : index giliran berurutan (hasil rr_counter), 0-based
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION rr_choose_agent(p_counter INT, p_is_test BOOLEAN DEFAULT FALSE)
RETURNS TABLE(agent_id BIGINT, agent_name TEXT, agent_phone TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $FN$
DECLARE
  v_mode      TEXT;
  v_since     TIMESTAMPTZ;
  v_window    TIMESTAMPTZ;
  v_n         INT := 0;
  v_i         INT := 0;
  r           RECORD;
  v_ids       BIGINT[] := '{}';
  v_names     TEXT[]   := '{}';
  v_chats     INT[]    := '{}';
  v_pend      INT[]    := '{}';
  v_last      TIMESTAMPTZ[] := '{}';
  v_degraded  BOOLEAN[] := '{}';
  v_eligible  BOOLEAN[] := '{}';
  v_hour      INT;
  v_working   BOOLEAN;
  v_recent    BOOLEAN;
  v_any_recent BOOLEAN := FALSE;
  v_healthy   INT := 0;
  v_stale     BOOLEAN := TRUE;
  v_probe     BOOLEAN;
  v_mean      NUMERIC;
  v_streak    TEXT;
  v_streak_n  INT;
  v_elig_n    INT := 0;
  v_probe_ids INT[] := '{}';
  v_seq_pos   INT;
  v_pick      INT := NULL;
  v_reason    TEXT := 'balanced';
  v_best      NUMERIC;
  v_score     NUMERIC;
  v_k         INT;
  v_best_k    INT;
BEGIN
  v_mode := COALESCE((SELECT s.value FROM rr_settings s WHERE s.key = 'rr_mode'), 'sequential');

  -- Sales yang AKAN dipilih giliran berurutan (perilaku lama): urutan Annisa, Diaz, Jessica, Irma.
  SELECT x.id, x.name INTO r
    FROM (
      SELECT b.id, b.name,
             ROW_NUMBER() OVER (
               ORDER BY CASE
                 WHEN b.name ILIKE '%Annisa%' THEN 1
                 WHEN b.name ILIKE '%Diaz%' THEN 2
                 WHEN b.name ILIKE '%Jessica%' THEN 3
                 WHEN b.name ILIKE '%Irma%' THEN 4
                 ELSE 99 END, b.id ASC) - 1 AS row_idx
        FROM busdevs b WHERE b.is_active = true
    ) x
   WHERE x.row_idx = p_counter;

  IF p_is_test OR v_mode NOT IN ('shadow', 'confirmed_balance') THEN
    RETURN QUERY SELECT b.id, b.name, b.phone FROM busdevs b WHERE b.id = r.id;
    RETURN;
  END IF;

  v_since  := COALESCE((SELECT s.value FROM rr_settings s WHERE s.key = 'balance_since')::timestamptz, NOW() - INTERVAL '1 day');
  v_window := GREATEST(v_since, NOW() - INTERVAL '14 days');

  -- Statistik tiap sales aktif (urutan sama dengan giliran berurutan).
  FOR r IN
    SELECT x.id, x.name, x.chats, x.pending, x.last_chat
      FROM (
        SELECT b.id, b.name,
               ROW_NUMBER() OVER (
                 ORDER BY CASE
                   WHEN b.name ILIKE '%Annisa%' THEN 1
                   WHEN b.name ILIKE '%Diaz%' THEN 2
                   WHEN b.name ILIKE '%Jessica%' THEN 3
                   WHEN b.name ILIKE '%Irma%' THEN 4
                   ELSE 99 END, b.id ASC) AS pos,
               COUNT(l.id) FILTER (
                 WHERE l.status = 'confirmed' AND l.source IS DISTINCT FROM 'wa-direct'
                   AND l.confirmed_at >= v_window
                   AND COALESCE(l.wa_message, '') !~* 'memeriksa pesan baru|legalitas sertifikasi bpom')::INT AS chats,
               COUNT(l.id) FILTER (
                 WHERE l.created_at > NOW() - INTERVAL '30 minutes'
                   AND l.status IS DISTINCT FROM 'confirmed'
                   AND l.source IS DISTINCT FROM 'wa-direct')::INT AS pending,
               MAX(l.confirmed_at) FILTER (
                 WHERE l.status = 'confirmed' AND l.source IS DISTINCT FROM 'wa-direct'
                   AND COALESCE(l.wa_message, '') !~* 'memeriksa pesan baru|legalitas sertifikasi bpom') AS last_chat
          FROM busdevs b
          LEFT JOIN leads l
            ON l.assigned_to = b.name
           AND l.is_test IS NOT TRUE
           AND l.created_at > NOW() - INTERVAL '14 days'
         WHERE b.is_active = true
         GROUP BY b.id, b.name
      ) x
     ORDER BY x.pos
  LOOP
    v_n := v_n + 1;
    v_ids   := v_ids   || r.id;
    v_names := v_names || r.name;
    v_chats := v_chats || r.chats;
    v_pend  := v_pend  || r.pending;
    v_last  := v_last  || r.last_chat;
  END LOOP;

  IF v_n = 0 THEN RAISE EXCEPTION 'No active busdevs found'; END IF;
  v_seq_pos := (p_counter % v_n) + 1;           -- posisi giliran berurutan (1-based)

  v_hour    := EXTRACT(HOUR FROM (NOW() AT TIME ZONE 'Asia/Jakarta'))::INT;
  v_working := v_hour >= 8 AND v_hour < 21;
  v_probe   := (p_counter % 8) = 0;

  v_mean := 0;
  FOR v_i IN 1..v_n LOOP
    v_mean := v_mean + v_pend[v_i];
    IF v_last[v_i] IS NOT NULL AND NOW() - v_last[v_i] < INTERVAL '3 hours' THEN v_any_recent := TRUE; v_healthy := v_healthy + 1; END IF;
    IF v_last[v_i] IS NOT NULL AND NOW() - v_last[v_i] <= INTERVAL '60 minutes' THEN v_stale := FALSE; END IF;
  END LOOP;
  v_mean := v_mean / v_n;
  v_stale := v_working AND v_stale;              -- data basi hanya dinilai di jam kerja

  -- Beruntun: 3 klik terakhir (non-test, non wa-direct) semua ke sales yang sama?
  SELECT MIN(t.assigned_to), COUNT(*) INTO v_streak, v_streak_n
    FROM (SELECT l.assigned_to FROM leads l
           WHERE l.is_test IS NOT TRUE AND l.source IS DISTINCT FROM 'wa-direct'
           ORDER BY l.id DESC LIMIT 3) t;
  IF v_streak_n < 3 OR EXISTS (
       SELECT 1 FROM (SELECT l.assigned_to FROM leads l
                       WHERE l.is_test IS NOT TRUE AND l.source IS DISTINCT FROM 'wa-direct'
                       ORDER BY l.id DESC LIMIT 3) t WHERE t.assigned_to IS DISTINCT FROM v_streak) THEN
    v_streak := NULL;
  END IF;

  FOR v_i IN 1..v_n LOOP
    v_recent := v_last[v_i] IS NOT NULL AND NOW() - v_last[v_i] < INTERVAL '3 hours';
    v_degraded := v_degraded || (v_working AND NOT v_recent AND v_any_recent);
    v_eligible := v_eligible || (
      NOT (v_pend[v_i] > 5 AND v_pend[v_i] > 1.5 * v_mean)
      AND (v_streak IS NULL OR v_names[v_i] <> v_streak)
      AND NOT (v_degraded[v_i] AND NOT v_probe)
    );
    IF v_eligible[v_i] THEN v_elig_n := v_elig_n + 1; END IF;
  END LOOP;

  IF v_stale THEN
    v_pick := v_seq_pos; v_reason := 'fallback-stale';
  ELSIF v_working AND v_healthy * 2 <= v_n THEN
    v_pick := v_seq_pos; v_reason := 'fallback-not-ready';
  ELSIF v_elig_n = 0 THEN
    v_pick := v_seq_pos; v_reason := 'fallback-no-candidate';
  ELSE
    -- Giliran uji: beri ke sales degraded yang layak, bergiliran antar mereka.
    IF v_probe THEN
      FOR v_i IN 1..v_n LOOP
        IF v_eligible[v_i] AND v_degraded[v_i] THEN v_probe_ids := v_probe_ids || v_i; END IF;
      END LOOP;
      IF COALESCE(array_length(v_probe_ids, 1), 0) > 0 THEN
        v_pick := v_probe_ids[((p_counter / 8) % array_length(v_probe_ids, 1)) + 1];
      END IF;
    END IF;

    IF v_pick IS NULL THEN
      v_best := NULL;
      FOR v_i IN 1..v_n LOOP
        IF v_eligible[v_i] THEN
          v_score := v_chats[v_i] + 0.4 * v_pend[v_i];
          v_k := ((v_i - 1) - (p_counter % v_n) + v_n) % v_n;      -- pemutus seri: urutan mulai dari penghitung
          IF v_best IS NULL OR v_score < v_best OR (v_score = v_best AND v_k < v_best_k) THEN
            v_best := v_score; v_best_k := v_k; v_pick := v_i;
          END IF;
        END IF;
      END LOOP;
    END IF;
  END IF;

  IF v_mode = 'shadow' THEN
    INSERT INTO rr_shadow_log (counter, sequential_agent, balanced_agent, reason, snapshot)
    VALUES (p_counter, v_names[v_seq_pos], v_names[v_pick], v_reason,
            jsonb_build_object('chats', to_jsonb(v_chats), 'pending', to_jsonb(v_pend), 'names', to_jsonb(v_names)));
    v_pick := v_seq_pos;
  END IF;

  RETURN QUERY SELECT b.id, b.name, b.phone FROM busdevs b WHERE b.id = v_ids[v_pick];
END;
$FN$;

-- ----------------------------------------------------------------------------
-- assign_next_agent: salinan fungsi live, hanya langkah 3 yang memakai rr_choose_agent
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.assign_next_agent(p_visitor_id text, p_is_test boolean DEFAULT false, p_intent text DEFAULT NULL::text, p_page_url text DEFAULT NULL::text, p_phone text DEFAULT NULL::text)
 RETURNS TABLE(agent_id bigint, agent_name text, agent_phone text, order_index integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_agent_id          BIGINT;
  v_name              TEXT;
  v_phone             TEXT;
  v_idx               INT;
  v_count             INT;
  v_sticky            RECORD;
  v_effective_test    BOOLEAN;
  v_norm_client_phone TEXT;
BEGIN
  PERFORM pg_advisory_xact_lock(987654321);

  SELECT COUNT(*) INTO v_count FROM busdevs b WHERE b.is_active = true;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'No active busdevs found';
  END IF;

  v_effective_test := (
    p_is_test IS TRUE
    OR coalesce(p_intent, '')   ILIKE '%test%'
    OR coalesce(p_page_url, '') ILIKE '%test%'
    OR coalesce(p_visitor_id, '') ILIKE 'test_%'
  );

  -- 1. PHONE STICKY (O(1) Primary Key Lookup di phone_assignments)
  IF NOT v_effective_test AND p_phone IS NOT NULL AND p_phone <> '' THEN
    v_norm_client_phone := regexp_replace(p_phone, '[^0-9]', '', 'g');
    IF left(v_norm_client_phone, 1) = '0' THEN
      v_norm_client_phone := '62' || substring(v_norm_client_phone from 2);
    END IF;

    IF length(v_norm_client_phone) >= 9 THEN
      SELECT pa.agent_id INTO v_sticky
        FROM phone_assignments pa
       WHERE pa.phone_number = v_norm_client_phone
         AND pa.expires_at > NOW();

      IF NOT FOUND THEN
        SELECT b.id AS agent_id INTO v_sticky
          FROM leads l
          JOIN busdevs b ON b.name = l.assigned_to
         WHERE (l.hp = v_norm_client_phone OR l.wa_phone = v_norm_client_phone)
           AND b.is_active = true
           AND l.is_test IS NOT TRUE
         ORDER BY l.id DESC
         LIMIT 1;
      END IF;

      IF v_sticky.agent_id IS NOT NULL THEN
        SELECT b.id, b.name, b.phone INTO v_agent_id, v_name, v_phone
          FROM busdevs b
         WHERE b.id = v_sticky.agent_id AND b.is_active = true;

        IF FOUND THEN
          INSERT INTO phone_assignments (phone_number, agent_id, created_at, last_seen, expires_at)
          VALUES (v_norm_client_phone, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '180 days')
          ON CONFLICT (phone_number)
          DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                        last_seen = NOW(),
                        expires_at = NOW() + INTERVAL '180 days';

          IF p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
            INSERT INTO visitor_assignments (visitor_id, agent_id, created_at, last_seen, expires_at)
            VALUES (p_visitor_id, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '30 days')
            ON CONFLICT (visitor_id)
            DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                          last_seen = NOW(),
                          expires_at = NOW() + INTERVAL '30 days';
          END IF;
        ELSE
          v_agent_id := NULL;
        END IF;
      END IF;
    END IF;
  END IF;

  -- 2. BROWSER STICKY
  IF v_agent_id IS NULL AND NOT v_effective_test AND p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
    SELECT va.agent_id INTO v_sticky
      FROM visitor_assignments va
     WHERE va.visitor_id = p_visitor_id
       AND va.expires_at > NOW();

    IF FOUND THEN
      SELECT b.id, b.name, b.phone INTO v_agent_id, v_name, v_phone
        FROM busdevs b
       WHERE b.id = v_sticky.agent_id AND b.is_active = true;

      IF FOUND THEN
        UPDATE visitor_assignments va SET last_seen = NOW(), expires_at = NOW() + INTERVAL '30 days'
         WHERE va.visitor_id = p_visitor_id;

        IF v_norm_client_phone IS NOT NULL AND length(v_norm_client_phone) >= 9 THEN
          INSERT INTO phone_assignments (phone_number, agent_id, created_at, last_seen, expires_at)
          VALUES (v_norm_client_phone, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '180 days')
          ON CONFLICT (phone_number)
          DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                        last_seen = NOW(),
                        expires_at = NOW() + INTERVAL '180 days';
        END IF;
      ELSE
        v_agent_id := NULL;
      END IF;
    END IF;
  END IF;

  -- 3. STRICT SEQUENTIAL MODULO ROTATION (4 BusDev: Annisa -> Diaz -> Jessica -> Irma)
  IF v_agent_id IS NULL THEN
    UPDATE rr_counter
       SET current_index = (current_index + 1) % v_count,
           updated_at = NOW()
     WHERE id = 1
     RETURNING current_index INTO v_idx;

    -- Pemilihan sales: giliran berurutan (default) atau berdasarkan chat masuk.
    -- Mode dibaca dari rr_settings; lihat rr_choose_agent() di atas.
    SELECT c.agent_id, c.agent_name, c.agent_phone INTO v_agent_id, v_name, v_phone
      FROM rr_choose_agent(v_idx, v_effective_test) c;

    IF NOT v_effective_test AND p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
      INSERT INTO visitor_assignments (visitor_id, agent_id, created_at, last_seen, expires_at)
      VALUES (p_visitor_id, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '30 days')
      ON CONFLICT (visitor_id)
      DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                    last_seen = NOW(),
                    expires_at = NOW() + INTERVAL '30 days';
    END IF;

    IF NOT v_effective_test AND v_norm_client_phone IS NOT NULL AND length(v_norm_client_phone) >= 9 THEN
      INSERT INTO phone_assignments (phone_number, agent_id, created_at, last_seen, expires_at)
      VALUES (v_norm_client_phone, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '180 days')
      ON CONFLICT (phone_number)
      DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                    last_seen = NOW(),
                    expires_at = NOW() + INTERVAL '180 days';
    END IF;
  END IF;

  SELECT idx - 1 INTO v_idx
    FROM (
      SELECT b.id,
             ROW_NUMBER() OVER (
               ORDER BY
                 CASE
                   WHEN b.name ILIKE '%Annisa%' THEN 1
                   WHEN b.name ILIKE '%Diaz%' THEN 2
                   WHEN b.name ILIKE '%Jessica%' THEN 3
                   WHEN b.name ILIKE '%Irma%' THEN 4
                   ELSE 99
                 END,
                 b.id ASC
             ) AS idx
        FROM busdevs b
       WHERE b.is_active = true
    ) ranked
   WHERE id = v_agent_id;

  RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx;
END;
$function$;

-- ----------------------------------------------------------------------------
-- assign_and_insert_lead: salinan fungsi live, hanya langkah 3 yang memakai rr_choose_agent
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.assign_and_insert_lead(p_visitor_id text, p_intent text, p_source text, p_page_url text, p_page_title text, p_referrer text, p_utm_source text, p_utm_medium text, p_utm_campaign text, p_device_type text, p_browser text, p_session_id text, p_nama text, p_perusahaan text, p_hp text, p_produk text, p_is_test boolean DEFAULT false)
 RETURNS TABLE(agent_id bigint, agent_name text, agent_phone text, order_index integer, tracking_code text, wa_url text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_agent_id          BIGINT;
  v_name              TEXT;
  v_phone             TEXT;
  v_idx               INT;
  v_count             INT;
  v_sticky            RECORD;
  v_code              TEXT;
  v_existing          TEXT;
  v_norm_phone        TEXT;
  v_effective_test    BOOLEAN;
  v_norm_client_phone TEXT;
BEGIN
  PERFORM pg_advisory_xact_lock(987654321);

  SELECT COUNT(*) INTO v_count FROM busdevs b WHERE b.is_active = true;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'No active busdevs found';
  END IF;

  v_effective_test := (
    p_is_test IS TRUE
    OR coalesce(p_intent, '')   ILIKE '%test%'
    OR coalesce(p_page_url, '') ILIKE '%test%'
    OR coalesce(p_visitor_id, '') ILIKE 'test_%'
  );

  -- 1. PHONE STICKY
  IF NOT v_effective_test AND p_hp IS NOT NULL AND p_hp <> '' THEN
    v_norm_client_phone := regexp_replace(p_hp, '[^0-9]', '', 'g');
    IF left(v_norm_client_phone, 1) = '0' THEN
      v_norm_client_phone := '62' || substring(v_norm_client_phone from 2);
    END IF;

    IF length(v_norm_client_phone) >= 9 THEN
      SELECT pa.agent_id INTO v_sticky
        FROM phone_assignments pa
       WHERE pa.phone_number = v_norm_client_phone
         AND pa.expires_at > NOW();

      IF NOT FOUND THEN
        SELECT b.id AS agent_id INTO v_sticky
          FROM leads l
          JOIN busdevs b ON b.name = l.assigned_to
         WHERE (l.hp = v_norm_client_phone OR l.wa_phone = v_norm_client_phone)
           AND b.is_active = true
           AND l.is_test IS NOT TRUE
         ORDER BY l.id DESC
         LIMIT 1;
      END IF;

      IF v_sticky.agent_id IS NOT NULL THEN
        SELECT b.id, b.name, b.phone INTO v_agent_id, v_name, v_phone
          FROM busdevs b
         WHERE b.id = v_sticky.agent_id AND b.is_active = true;

        IF FOUND THEN
          INSERT INTO phone_assignments (phone_number, agent_id, created_at, last_seen, expires_at)
          VALUES (v_norm_client_phone, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '180 days')
          ON CONFLICT (phone_number)
          DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                        last_seen = NOW(),
                        expires_at = NOW() + INTERVAL '180 days';

          IF p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
            INSERT INTO visitor_assignments (visitor_id, agent_id, created_at, last_seen, expires_at)
            VALUES (p_visitor_id, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '30 days')
            ON CONFLICT (visitor_id)
            DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                          last_seen = NOW(),
                          expires_at = NOW() + INTERVAL '30 days';
          END IF;
        ELSE
          v_agent_id := NULL;
        END IF;
      END IF;
    END IF;
  END IF;

  -- 2. BROWSER STICKY
  IF v_agent_id IS NULL AND NOT v_effective_test AND p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
    SELECT va.agent_id INTO v_sticky
      FROM visitor_assignments va
     WHERE va.visitor_id = p_visitor_id
       AND va.expires_at > NOW();

    IF FOUND THEN
      SELECT b.id, b.name, b.phone INTO v_agent_id, v_name, v_phone
        FROM busdevs b
       WHERE b.id = v_sticky.agent_id AND b.is_active = true;

      IF FOUND THEN
        UPDATE visitor_assignments va SET last_seen = NOW(), expires_at = NOW() + INTERVAL '30 days'
         WHERE va.visitor_id = p_visitor_id;

        IF v_norm_client_phone IS NOT NULL AND length(v_norm_client_phone) >= 9 THEN
          INSERT INTO phone_assignments (phone_number, agent_id, created_at, last_seen, expires_at)
          VALUES (v_norm_client_phone, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '180 days')
          ON CONFLICT (phone_number)
          DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                        last_seen = NOW(),
                        expires_at = NOW() + INTERVAL '180 days';
        END IF;
      ELSE
        v_agent_id := NULL;
      END IF;
    END IF;
  END IF;

  -- 3. STRICT SEQUENTIAL MODULO ROTATION (4 BusDev: Annisa -> Diaz -> Jessica -> Irma)
  IF v_agent_id IS NULL THEN
    UPDATE rr_counter
       SET current_index = (current_index + 1) % v_count,
           updated_at = NOW()
     WHERE id = 1
     RETURNING current_index INTO v_idx;

    -- Pemilihan sales: giliran berurutan (default) atau berdasarkan chat masuk.
    -- Mode dibaca dari rr_settings; lihat rr_choose_agent() di atas.
    SELECT c.agent_id, c.agent_name, c.agent_phone INTO v_agent_id, v_name, v_phone
      FROM rr_choose_agent(v_idx, v_effective_test) c;

    IF NOT v_effective_test AND p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
      INSERT INTO visitor_assignments (visitor_id, agent_id, created_at, last_seen, expires_at)
      VALUES (p_visitor_id, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '30 days')
      ON CONFLICT (visitor_id)
      DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                    last_seen = NOW(),
                    expires_at = NOW() + INTERVAL '30 days';
    END IF;

    IF NOT v_effective_test AND v_norm_client_phone IS NOT NULL AND length(v_norm_client_phone) >= 9 THEN
      INSERT INTO phone_assignments (phone_number, agent_id, created_at, last_seen, expires_at)
      VALUES (v_norm_client_phone, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '180 days')
      ON CONFLICT (phone_number)
      DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                    last_seen = NOW(),
                    expires_at = NOW() + INTERVAL '180 days';
    END IF;
  END IF;

  SELECT idx - 1 INTO v_idx
    FROM (
      SELECT b.id,
             ROW_NUMBER() OVER (
               ORDER BY
                 CASE
                   WHEN b.name ILIKE '%Annisa%' THEN 1
                   WHEN b.name ILIKE '%Diaz%' THEN 2
                   WHEN b.name ILIKE '%Jessica%' THEN 3
                   WHEN b.name ILIKE '%Irma%' THEN 4
                   ELSE 99
                 END,
                 b.id ASC
             ) AS idx
        FROM busdevs b
       WHERE b.is_active = true
    ) ranked
   WHERE id = v_agent_id;

  v_norm_phone := regexp_replace(coalesce(v_phone, ''), '[^0-9]', '', 'g');
  IF left(v_norm_phone, 1) = '0' THEN
    v_norm_phone := '62' || substring(v_norm_phone from 2);
  END IF;

  -- 4. DEDUPLIKASI 24 JAM
  IF NOT v_effective_test THEN
    SELECT l.tracking_code INTO v_existing
      FROM leads l
     WHERE (
       (p_visitor_id IS NOT NULL AND p_visitor_id <> '' AND l.visitor_id = p_visitor_id)
       OR
       (v_norm_client_phone IS NOT NULL AND (l.hp = v_norm_client_phone OR l.wa_phone = v_norm_client_phone))
     )
       AND l.created_at > NOW() - INTERVAL '24 hours'
       AND l.is_test IS NOT TRUE
     ORDER BY l.id DESC
     LIMIT 1;

    IF v_existing IS NOT NULL THEN
      UPDATE leads SET visit_count = visit_count + 1 WHERE leads.tracking_code = v_existing;
      RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx, v_existing,
                          'https://wa.me/' || v_norm_phone;
      RETURN;
    END IF;
  END IF;

  -- 5. Insert Lead Baru
  IF v_effective_test THEN
    v_code := 'DL-TEST-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(md5(random()::text), 1, 6));
  ELSE
    v_code := 'DL-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(md5(random()::text), 1, 6));
  END IF;

  INSERT INTO leads
    (tracking_code, assigned_to, assigned_phone, source, page_url, page_title,
     referrer, utm_source, utm_medium, utm_campaign, device_type, browser,
     session_id, intent, visitor_id, visit_count, nama, perusahaan, hp, produk, is_test)
  VALUES
    (v_code, v_name, v_norm_phone, p_source, p_page_url, p_page_title,
     p_referrer, p_utm_source, p_utm_medium, p_utm_campaign, p_device_type, p_browser,
     p_session_id, p_intent, p_visitor_id, 1, p_nama, p_perusahaan, COALESCE(v_norm_client_phone, p_hp), p_produk, v_effective_test);

  RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx, v_code,
                      'https://wa.me/' || v_norm_phone;
END;
$function$;

GRANT EXECUTE ON FUNCTION rr_choose_agent(INT, BOOLEAN) TO PUBLIC;
GRANT EXECUTE ON FUNCTION assign_next_agent(TEXT, BOOLEAN, TEXT, TEXT, TEXT) TO PUBLIC;
GRANT EXECUTE ON FUNCTION assign_and_insert_lead(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN) TO PUBLIC;

COMMIT;
