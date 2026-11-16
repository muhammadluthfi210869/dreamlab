import { getMonitorPool } from "@/lib/db";
import type { AdChannel } from "@/lib/lead-monitor-stats";

export interface DailyBusdevCounts {
  traffic: number;
  cold: number;
  warm: number;
  hot: number;
  sample: number;
}

export interface DailyBusdevEntry {
  auto: DailyBusdevCounts;
  manual: (DailyBusdevCounts & { updatedBy: string | null; updatedAt: string }) | null;
  effective: DailyBusdevCounts;
}

export interface DailyMetricRow {
  date: string;
  byBusdev: Record<string, DailyBusdevEntry>;
}

export interface SourceOverviewRow {
  channel: AdChannel;
  label: string;
  traffic: number;
  prospecting: number;
  prospectingPct: number;
  sample: number;
  samplePct: number;
  isTopScaleUp: boolean;
}

let dailyTableEnsured = false;

export async function ensureDailyMetricsTable() {
  if (dailyTableEnsured) return;
  const pool = getMonitorPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS crm_daily_busdev_metrics (
      metric_date DATE NOT NULL,
      busdev_name TEXT NOT NULL,
      traffic     INTEGER NOT NULL DEFAULT 0 CHECK (traffic >= 0),
      cold        INTEGER NOT NULL DEFAULT 0 CHECK (cold >= 0),
      warm        INTEGER NOT NULL DEFAULT 0 CHECK (warm >= 0),
      hot         INTEGER NOT NULL DEFAULT 0 CHECK (hot >= 0),
      sample      INTEGER NOT NULL DEFAULT 0 CHECK (sample >= 0),
      updated_by  TEXT,
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (metric_date, busdev_name)
    )
  `);
  dailyTableEnsured = true;
}

