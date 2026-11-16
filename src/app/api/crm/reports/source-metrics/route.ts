import { NextRequest } from "next/server";
import { getMonitorPool } from "@/lib/db";
import { isAuthFailure, json, requireUser } from "@/lib/crm-auth";
import { isAdminRole } from "@/lib/crm-stages";
import { ensureDailyMetricsTable } from "@/lib/crm-daily-metrics";

export const dynamic = "force-dynamic";

const ALLOWED_CHANNELS = new Set([
  "meta_ads",
  "google_ads",
  "google_organic",
  "social_media",
  "other",
]);

export async function PUT(req: NextRequest) {
  const auth = await requireUser(req, { write: true });
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;

  if (!isAdminRole(user.role)) {
    return json({ success: false, error: "Hanya Head dan Admin yang dapat mengubah data source manual" }, 403);
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return json({ success: false, error: "Payload tidak valid" }, 400);
  }

  const periodKey = typeof body.periodKey === "string" ? body.periodKey.trim() : "";
  if (!periodKey || periodKey.length > 40) {
    return json({ success: false, error: "periodKey tidak valid" }, 400);
  }

  try {
    await ensureDailyMetricsTable();
    const pool = getMonitorPool();

    if (body.action === "reset") {
      await pool.query(`DELETE FROM crm_source_manual_metrics WHERE period_key = $1`, [periodKey]);
      return json({ success: true, reset: true });
    }

    const entries = Array.isArray(body.entries) ? body.entries : [];
    if (entries.length === 0 || entries.length > 10) {
      return json({ success: false, error: "Data entri source tidak valid" }, 400);
    }

    const cleanInt = (v: unknown) => {
      const n = typeof v === "number" ? v : parseInt(String(v || "0"), 10);
      return Number.isFinite(n) && n >= 0 ? Math.min(1_000_000, Math.round(n)) : 0;
    };

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const e of entries) {
        const ch = typeof e?.channel === "string" ? e.channel.trim() : "";
        if (!ALLOWED_CHANNELS.has(ch)) continue;
        await client.query(
          `
          INSERT INTO crm_source_manual_metrics
            (period_key, channel, traffic, prospecting, sample, updated_by, updated_at)
          VALUES
            ($1, $2, $3, $4, $5, $6, NOW())
          ON CONFLICT (period_key, channel)
          DO UPDATE SET
            traffic     = EXCLUDED.traffic,
            prospecting = EXCLUDED.prospecting,
            sample      = EXCLUDED.sample,
            updated_by  = EXCLUDED.updated_by,
            updated_at  = NOW()
          `,
          [periodKey, ch, cleanInt(e.traffic), cleanInt(e.prospecting), cleanInt(e.sample), user.name]
        );
      }
      await client.query("COMMIT");
    } catch (txErr) {
      await client.query("ROLLBACK").catch(() => undefined);
      throw txErr;
    } finally {
      client.release();
    }

    return json({ success: true, periodKey });
  } catch (err: any) {
    console.error("[source-metrics] PUT error:", err?.message);
    return json({ success: false, error: "Gagal menyimpan data source manual" }, 500);
  }
}
