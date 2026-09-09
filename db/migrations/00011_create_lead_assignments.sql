-- ============================================================
-- 00011_create_lead_assignments.sql
-- Migration: Lead assignment audit log for Neon PostgreSQL
-- ============================================================

CREATE TABLE IF NOT EXISTS lead_assignments (
  id UUID PRIMARY KEY,
  event_id VARCHAR(100) NOT NULL UNIQUE,
  source VARCHAR(50) NOT NULL,
  landing_page TEXT,
  referrer TEXT,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  message_key VARCHAR(100),
  sales_id VARCHAR(50) NOT NULL,
  sales_name VARCHAR(100) NOT NULL,
  sales_phone VARCHAR(30) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'assigned',
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent TEXT,
  ip_hash VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_lead_assignments_source
ON lead_assignments(source);

CREATE INDEX IF NOT EXISTS idx_lead_assignments_sales
ON lead_assignments(sales_id);

CREATE INDEX IF NOT EXISTS idx_lead_assignments_date
ON lead_assignments(assigned_at);
