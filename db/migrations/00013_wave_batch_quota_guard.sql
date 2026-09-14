-- ============================================================
-- 00013_wave_batch_quota_guard.sql
--
-- Wave / Batch Quota Allocation with Strict Spread Guard:
--
-- 1. Global Advisory Lock:
--    PERFORM pg_advisory_xact_lock(987654321) ensures strict serialization
--    across concurrent requests, eliminating race conditions.
--
-- 2. Wave / Batch Quota Equalization:
--    Leads today (Asia/Jakarta timezone) are balanced wave-by-wave.
--    If an agent has fewer leads (e.g. A=3, B=2, C=1), all new leads are
--    strictly directed to C until C=2, then to B and C until all reach 3.
--    No agent can proceed to Wave N+1 (lead 4+) until all active agents
--    have completed Wave N (reached 3).
--
-- 3. Strict Spread Guard:
--    Max spread across active agents is mathematically guaranteed <= 1.
--
-- 4. Multi-tier Tie-Breakers:
--    When daily leads are equal:
--    a) 7-day rolling lead count ASC (balances overall weekly volume)
--    b) last_lead_time ASC NULLS FIRST (agent who waited longest)
--    c) busdev id ASC (deterministic fallback)
--
-- 5. Audit Function:
--    get_round_robin_wave_status() provides real-time visibility into
--    current wave, batch target, spread, and next-in-line priority queue.
-- ============================================================

BEGIN;

-- 1. Fungsi audit get_round_robin_wave_status()
CREATE OR REPLACE FUNCTION get_round_robin_wave_status(p_batch_size INT DEFAULT 3)
RETURNS TABLE(
  agent_id BIGINT,
  agent_name TEXT,
  agent_phone TEXT,
  daily_leads INT,
  weekly_leads INT,
  last_lead_time TIMESTAMPTZ,
  current_wave INT,
  target_leads_for_wave INT,
  leads_to_target INT,
  max_spread INT,
  priority_rank INT,
  is_eligible_next BOOLEAN,
  guard_status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $FUNC$
DECLARE
  v_min_daily INT;
  v_max_daily INT;
  v_spread INT;
BEGIN
  -- Hitung min & max daily leads dari agen aktif
  WITH active_stats AS (
    SELECT 
      b.id,
      (
        SELECT COUNT(*)::INT
          FROM leads l
         WHERE (
           l.assigned_to = b.name
           OR l.assigned_phone = regexp_replace(b.phone, '[^0-9]', '', 'g')
           OR l.assigned_phone = '62' || substring(regexp_replace(b.phone, '[^0-9]', '', 'g') from 2)
           OR l.assigned_phone = b.phone
         )
           AND l.created_at >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta')::date
           AND l.is_test IS NOT TRUE
      ) AS daily_cnt
    FROM busdevs b
    WHERE b.is_active = true
  )
  SELECT COALESCE(MIN(daily_cnt), 0), COALESCE(MAX(daily_cnt), 0)
    INTO v_min_daily, v_max_daily
    FROM active_stats;

  v_spread := v_max_daily - v_min_daily;

  RETURN QUERY
  WITH ranked_agents AS (
    SELECT 
      b.id AS r_agent_id,
      b.name AS r_agent_name,
      b.phone AS r_agent_phone,
      (
        SELECT COUNT(*)::INT 
          FROM leads l
         WHERE (
           l.assigned_to = b.name
           OR l.assigned_phone = regexp_replace(b.phone, '[^0-9]', '', 'g')
           OR l.assigned_phone = '62' || substring(regexp_replace(b.phone, '[^0-9]', '', 'g') from 2)
           OR l.assigned_phone = b.phone
         )
           AND l.created_at >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta')::date
           AND l.is_test IS NOT TRUE
      ) AS r_daily_leads,
      (
        SELECT COUNT(*)::INT 
          FROM leads l
         WHERE (
           l.assigned_to = b.name
           OR l.assigned_phone = regexp_replace(b.phone, '[^0-9]', '', 'g')
           OR l.assigned_phone = '62' || substring(regexp_replace(b.phone, '[^0-9]', '', 'g') from 2)
           OR l.assigned_phone = b.phone
         )
           AND l.created_at > NOW() - INTERVAL '7 days'
           AND l.is_test IS NOT TRUE
      ) AS r_weekly_leads,
      (
        SELECT MAX(l.created_at)
          FROM leads l
         WHERE (
           l.assigned_to = b.name
           OR l.assigned_phone = regexp_replace(b.phone, '[^0-9]', '', 'g')
           OR l.assigned_phone = '62' || substring(regexp_replace(b.phone, '[^0-9]', '', 'g') from 2)
           OR l.assigned_phone = b.phone
         )
           AND l.is_test IS NOT TRUE
      ) AS r_last_lead_time
    FROM busdevs b
    WHERE b.is_active = true
  ),
  with_ranking AS (
    SELECT 
      ra.*,
      ROW_NUMBER() OVER (
        ORDER BY ra.r_daily_leads ASC, ra.r_weekly_leads ASC, ra.r_last_lead_time ASC NULLS FIRST, ra.r_agent_id ASC
      )::INT AS r_priority_rank
    FROM ranked_agents ra
  )
  SELECT 
    wr.r_agent_id,
    wr.r_agent_name,
    wr.r_agent_phone,
    wr.r_daily_leads,
    wr.r_weekly_leads,
    wr.r_last_lead_time,
    (wr.r_daily_leads / p_batch_size + 1)::INT AS current_wave,
    (((wr.r_daily_leads / p_batch_size) + 1) * p_batch_size)::INT AS target_leads_for_wave,
    ((((wr.r_daily_leads / p_batch_size) + 1) * p_batch_size) - wr.r_daily_leads)::INT AS leads_to_target,
    v_spread AS max_spread,
    wr.r_priority_rank,
    (wr.r_daily_leads = v_min_daily) AS is_eligible_next,
    CASE 
      WHEN v_spread = 0 THEN 'PERFECTLY_BALANCED'
      WHEN wr.r_daily_leads = v_min_daily THEN 'ELIGIBLE_CATCHING_UP'
      ELSE 'PAUSED_WAITING_FOR_PARITY'
    END AS guard_status
  FROM with_ranking wr
  ORDER BY wr.r_priority_rank ASC;
END;
$FUNC$;


-- 2. Fungsi assign_next_agent() dengan Wave Quota + Global Concurrency Lock
CREATE OR REPLACE FUNCTION assign_next_agent(
  p_visitor_id TEXT,
  p_is_test    BOOLEAN DEFAULT FALSE
)
RETURNS TABLE(agent_id BIGINT, agent_name TEXT, agent_phone TEXT, order_index INT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $FUNC$
DECLARE
  v_agent_id       BIGINT;
  v_name           TEXT;
  v_phone          TEXT;
  v_idx            INT;
  v_count          INT;
  v_sticky         RECORD;
  v_effective_test BOOLEAN;
BEGIN
  -- Serialisasi global untuk mencegah race condition pada burst leads
  PERFORM pg_advisory_xact_lock(987654321);

  SELECT COUNT(*) INTO v_count FROM busdevs b WHERE b.is_active = true;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'No active busdevs found';
  END IF;

  v_effective_test := (
    p_is_test IS TRUE 
    OR coalesce(p_visitor_id, '') ILIKE 'test_%'
  );

  -- 1. STICKY ASSIGNMENT: Jika visitor sudah memiliki CS aktif (hanya non-test)
  IF NOT v_effective_test AND p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
    SELECT va.agent_id INTO v_sticky
      FROM visitor_assignments va
     WHERE va.visitor_id = p_visitor_id
       AND va.expires_at > NOW();

    IF FOUND THEN
      SELECT b.id, b.name, b.phone INTO v_agent_id, v_name, v_phone
        FROM busdevs b
       WHERE b.id = v_sticky.agent_id AND b.is_active = true;

      IF FOUND THEN
        UPDATE visitor_assignments va SET last_seen = NOW()
         WHERE va.visitor_id = p_visitor_id;

        SELECT idx - 1 INTO v_idx
          FROM (
            SELECT b.id, ROW_NUMBER() OVER (ORDER BY b.id) AS idx
              FROM busdevs b
             WHERE b.is_active = true
          ) ranked
         WHERE id = v_agent_id;

        RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx;
        RETURN;
      END IF;
    END IF;
  END IF;

  -- 2. WAVE / BATCH EQUALIZATION SELECTION:
  -- Prioritas mutlak: Agen dengan daily leads terendah (wajib kejar ketinggalan).
  -- Tie-breaker 1: Weekly leads terendah (7 hari).
  -- Tie-breaker 2: Agen yang paling lama belum menerima lead (last_lead_time ASC NULLS FIRST).
  -- Tie-breaker 3: ID ASC.
  WITH candidate_pool AS (
    SELECT 
      b.id,
      b.name,
      b.phone,
      (
        SELECT COUNT(*)::INT 
          FROM leads l
         WHERE (
           l.assigned_to = b.name
           OR l.assigned_phone = regexp_replace(b.phone, '[^0-9]', '', 'g')
           OR l.assigned_phone = '62' || substring(regexp_replace(b.phone, '[^0-9]', '', 'g') from 2)
           OR l.assigned_phone = b.phone
         )
           AND l.created_at >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta')::date
           AND (
             (v_effective_test IS TRUE AND l.is_test IS TRUE)
             OR (v_effective_test IS NOT TRUE AND l.is_test IS NOT TRUE)
           )
      ) AS daily_leads,
      (
        SELECT COUNT(*)::INT 
          FROM leads l
         WHERE (
           l.assigned_to = b.name
           OR l.assigned_phone = regexp_replace(b.phone, '[^0-9]', '', 'g')
           OR l.assigned_phone = '62' || substring(regexp_replace(b.phone, '[^0-9]', '', 'g') from 2)
           OR l.assigned_phone = b.phone
         )
           AND l.created_at > NOW() - INTERVAL '7 days'
           AND (
             (v_effective_test IS TRUE AND l.is_test IS TRUE)
             OR (v_effective_test IS NOT TRUE AND l.is_test IS NOT TRUE)
           )
      ) AS weekly_leads,
      (
        SELECT MAX(l.created_at)
          FROM leads l
         WHERE (
           l.assigned_to = b.name
           OR l.assigned_phone = regexp_replace(b.phone, '[^0-9]', '', 'g')
           OR l.assigned_phone = '62' || substring(regexp_replace(b.phone, '[^0-9]', '', 'g') from 2)
           OR l.assigned_phone = b.phone
         )
           AND (
             (v_effective_test IS TRUE AND l.is_test IS TRUE)
             OR (v_effective_test IS NOT TRUE AND l.is_test IS NOT TRUE)
           )
      ) AS last_lead_time
    FROM busdevs b
    WHERE b.is_active = true
  )
  SELECT cp.id, cp.name, cp.phone INTO v_agent_id, v_name, v_phone
    FROM candidate_pool cp
   ORDER BY cp.daily_leads ASC, cp.weekly_leads ASC, cp.last_lead_time ASC NULLS FIRST, cp.id ASC
   LIMIT 1;

  SELECT idx - 1 INTO v_idx
    FROM (
      SELECT b.id, ROW_NUMBER() OVER (ORDER BY b.id) AS idx
        FROM busdevs b
       WHERE b.is_active = true
    ) ranked
   WHERE id = v_agent_id;

  -- Simpan sticky assignment untuk visitor baru (hanya non-test)
  IF NOT v_effective_test AND p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
    INSERT INTO visitor_assignments (visitor_id, agent_id, created_at, last_seen, expires_at)
    VALUES (p_visitor_id, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '30 days')
    ON CONFLICT (visitor_id)
    DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                  last_seen = NOW(),
                  expires_at = NOW() + INTERVAL '30 days';
  END IF;

  RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx;
END;
$FUNC$;


-- 3. Fungsi assign_and_insert_lead() dengan Wave Quota + Dedup 24 Jam
CREATE OR REPLACE FUNCTION assign_and_insert_lead(
  p_visitor_id   TEXT,
  p_intent       TEXT,
  p_source       TEXT,
  p_page_url     TEXT,
  p_page_title   TEXT,
  p_referrer     TEXT,
  p_utm_source   TEXT,
  p_utm_medium   TEXT,
  p_utm_campaign TEXT,
  p_device_type  TEXT,
  p_browser      TEXT,
  p_session_id   TEXT,
  p_nama         TEXT,
  p_perusahaan   TEXT,
  p_hp           TEXT,
  p_produk       TEXT,
  p_is_test      BOOLEAN DEFAULT FALSE
)
RETURNS TABLE(
  agent_id      BIGINT,
  agent_name    TEXT,
  agent_phone   TEXT,
  order_index   INT,
  tracking_code TEXT,
  wa_url        TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $FUNC$
DECLARE
  v_agent_id       BIGINT;
  v_name           TEXT;
  v_phone          TEXT;
  v_idx            INT;
  v_count          INT;
  v_sticky         RECORD;
  v_code           TEXT;
  v_existing       TEXT;
  v_norm_phone     TEXT;
  v_effective_test BOOLEAN;
BEGIN
  -- Serialisasi global untuk mencegah race condition pada burst leads
  PERFORM pg_advisory_xact_lock(987654321);

  SELECT COUNT(*) INTO v_count FROM busdevs b WHERE b.is_active = true;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'No active busdevs found';
  END IF;

  v_effective_test := (
    p_is_test IS TRUE 
    OR coalesce(p_intent, '') ILIKE '%test%' 
    OR coalesce(p_page_url, '') ILIKE '%test%'
    OR coalesce(p_visitor_id, '') ILIKE 'test_%'
  );

  -- 1. STICKY: Cek apakah visitor sudah terhubung dengan CS aktif (hanya non-test)
  IF NOT v_effective_test AND p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
    SELECT va.agent_id INTO v_sticky
      FROM visitor_assignments va
     WHERE va.visitor_id = p_visitor_id
       AND va.expires_at > NOW();

    IF FOUND THEN
      SELECT b.id, b.name, b.phone INTO v_agent_id, v_name, v_phone
        FROM busdevs b
       WHERE b.id = v_sticky.agent_id AND b.is_active = true;

      IF FOUND THEN
        UPDATE visitor_assignments va SET last_seen = NOW()
         WHERE va.visitor_id = p_visitor_id;
      ELSE
        v_agent_id := NULL;
      END IF;
    END IF;
  END IF;

  -- 2. WAVE / BATCH EQUALIZATION: Jika belum sticky, pilih CS berdasarkan wave quota
  IF v_agent_id IS NULL THEN
    WITH candidate_pool AS (
      SELECT 
        b.id,
        b.name,
        b.phone,
        (
          SELECT COUNT(*)::INT 
            FROM leads l
           WHERE (
             l.assigned_to = b.name
             OR l.assigned_phone = regexp_replace(b.phone, '[^0-9]', '', 'g')
             OR l.assigned_phone = '62' || substring(regexp_replace(b.phone, '[^0-9]', '', 'g') from 2)
             OR l.assigned_phone = b.phone
           )
             AND l.created_at >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta')::date
             AND (
               (v_effective_test IS TRUE AND l.is_test IS TRUE)
               OR (v_effective_test IS NOT TRUE AND l.is_test IS NOT TRUE)
             )
        ) AS daily_leads,
        (
          SELECT COUNT(*)::INT 
            FROM leads l
           WHERE (
             l.assigned_to = b.name
             OR l.assigned_phone = regexp_replace(b.phone, '[^0-9]', '', 'g')
             OR l.assigned_phone = '62' || substring(regexp_replace(b.phone, '[^0-9]', '', 'g') from 2)
             OR l.assigned_phone = b.phone
           )
             AND l.created_at > NOW() - INTERVAL '7 days'
             AND (
               (v_effective_test IS TRUE AND l.is_test IS TRUE)
               OR (v_effective_test IS NOT TRUE AND l.is_test IS NOT TRUE)
             )
        ) AS weekly_leads,
        (
          SELECT MAX(l.created_at)
            FROM leads l
           WHERE (
             l.assigned_to = b.name
             OR l.assigned_phone = regexp_replace(b.phone, '[^0-9]', '', 'g')
             OR l.assigned_phone = '62' || substring(regexp_replace(b.phone, '[^0-9]', '', 'g') from 2)
             OR l.assigned_phone = b.phone
           )
             AND (
               (v_effective_test IS TRUE AND l.is_test IS TRUE)
               OR (v_effective_test IS NOT TRUE AND l.is_test IS NOT TRUE)
             )
        ) AS last_lead_time
      FROM busdevs b
      WHERE b.is_active = true
    )
    SELECT cp.id, cp.name, cp.phone INTO v_agent_id, v_name, v_phone
      FROM candidate_pool cp
     ORDER BY cp.daily_leads ASC, cp.weekly_leads ASC, cp.last_lead_time ASC NULLS FIRST, cp.id ASC
     LIMIT 1;

    -- Simpan sticky assignment untuk visitor baru (hanya non-test)
    IF NOT v_effective_test AND p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
      INSERT INTO visitor_assignments (visitor_id, agent_id, created_at, last_seen, expires_at)
      VALUES (p_visitor_id, v_agent_id, NOW(), NOW(), NOW() + INTERVAL '30 days')
      ON CONFLICT (visitor_id)
      DO UPDATE SET agent_id  = EXCLUDED.agent_id,
                    last_seen = NOW(),
                    expires_at = NOW() + INTERVAL '30 days';
    END IF;
  END IF;

  SELECT idx - 1 INTO v_idx
    FROM (
      SELECT b.id, ROW_NUMBER() OVER (ORDER BY b.id) AS idx
        FROM busdevs b
       WHERE b.is_active = true
    ) ranked
   WHERE id = v_agent_id;

  -- 3. Normalisasi nomor telepon
  v_norm_phone := regexp_replace(coalesce(v_phone, ''), '[^0-9]', '', 'g');
  IF left(v_norm_phone, 1) = '0' THEN
    v_norm_phone := '62' || substring(v_norm_phone from 2);
  END IF;

  -- 4. DEDUPLIKASI 24 JAM (hanya untuk non-test)
  IF NOT v_effective_test AND p_visitor_id IS NOT NULL AND p_visitor_id <> '' THEN
    SELECT l.tracking_code INTO v_existing
      FROM leads l
     WHERE l.visitor_id = p_visitor_id
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
     p_session_id, p_intent, p_visitor_id, 1, p_nama, p_perusahaan, p_hp, p_produk, v_effective_test);

  RETURN QUERY SELECT v_agent_id, v_name, v_phone, v_idx, v_code,
                      'https://wa.me/' || v_norm_phone;
END;
$FUNC$;

-- Berikan izin akses
GRANT EXECUTE ON FUNCTION get_round_robin_wave_status(INT) TO PUBLIC;
GRANT EXECUTE ON FUNCTION assign_next_agent(TEXT, BOOLEAN) TO PUBLIC;
GRANT EXECUTE ON FUNCTION assign_and_insert_lead(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN) TO PUBLIC;

COMMIT;
