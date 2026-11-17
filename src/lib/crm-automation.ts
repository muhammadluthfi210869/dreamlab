import { getWarmStageMoq } from './crm-stages';

export const STAGE_RANK: Record<string, number> = {
  lead_masuk: 1,
  traffic: 1,
  cold: 2,
  warm_below_500: 3,
  warm_up_500: 3,
  warm_below_1000: 3,
  warm_up_1000: 3,
  hot: 4,
  sample: 5,
  deal: 6,
  lost: 6,
};

export function pickWarmStageFromMoq(moq: number | null | undefined): string {
  const n = Number(moq || 0);
  if (n >= 1000) return 'warm_up_1000';
  if (n >= 800) return 'warm_below_1000';
  if (n >= 500) return 'warm_up_500';
  return 'warm_below_500';
}

export interface ParsedFormData {
  nama?: string;
  brand?: string;
  produk?: string;
  moq?: number;
  address?: string;
}

/**
 * Parser pesan form baris "Kunci: nilai" (Nama, Brand, Produk/Jenis produk, Qty/Jumlah/MOQ, Alamat/Alamat kirim).
 */
export function parseFormMessage(text: string): ParsedFormData {
  const out: ParsedFormData = {};
  const lines = String(text || '').split(/\r?\n/);
  for (const line of lines) {
    const idx = line.indexOf(':');
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    const val = line.slice(idx + 1).trim();
    if (!val) continue;

    if (/^(nama|name)$/.test(key)) out.nama = val.slice(0, 60);
    else if (/^(brand|merek)$/.test(key)) out.brand = val.slice(0, 80);
    else if (/^(produk|jenis produk|product)$/.test(key)) out.produk = val.slice(0, 80);
    else if (/^(qty|jumlah|moq|quantity)$/.test(key)) {
      const digits = parseInt(val.replace(/\D/g, ''), 10);
      if (Number.isInteger(digits) && digits > 0) out.moq = digits;
    } else if (/^(alamat|alamat kirim|address)$/.test(key)) out.address = val.slice(0, 240);
  }
  return out;
}

export interface TriggerRule {
  phrase: string;
  label: string;
  target_stage: string;
  is_active: boolean;
}

export interface AutomationRulesConfig {
  form_to_cold: boolean;
  reply_to_warm: boolean;
  chat_count_to_warm: boolean;
  first_sales_reply_to_cold: boolean;
  chat_threshold: number;
}

/**
 * Evaluasi aturan perpindahan stage otomatis (hanya bergerak MAJU, tidak pernah mundur,
 * tidak menyentuh Deal/Lost, dan tidak memindah antar sesama kolom Warm).
 */
export function evaluateStageAutomation(input: {
  currentStage: string;
  direction: 'inbound' | 'outbound';
  messageText: string;
  totalBubbles: number;
  hasSalesRepliedBefore: boolean;
  moq?: number | null;
  rules: AutomationRulesConfig;
  triggers: TriggerRule[];
}): { nextStage: string | null; reason: string | null } {
  const cur = input.currentStage || 'lead_masuk';
  const curRank = STAGE_RANK[cur] ?? 1;

  // Jangan sentuh Deal / Lost
  if (cur === 'deal' || cur === 'lost' || curRank >= 6) {
    return { nextStage: null, reason: null };
  }

  const warmStage = pickWarmStageFromMoq(input.moq);
  const candidates: Array<{ stage: string; rank: number; reason: string }> = [];

  if (input.direction === 'inbound') {
    const lowerText = input.messageText.toLowerCase();

    // 1. Custom trigger frasa
    for (const t of input.triggers) {
      if (!t.is_active) continue;
      const parts = t.phrase
        .split('|')
        .map((p) => p.trim().toLowerCase())
        .filter(Boolean);
      const hit = parts.find((p) => lowerText.includes(p));
      if (hit) {
        const target = t.target_stage === 'warm' ? warmStage : t.target_stage;
        const r = STAGE_RANK[target] ?? 0;
        if (r > curRank) {
          candidates.push({ stage: target, rank: r, reason: `Trigger "${t.label}" (frasa: ${hit})` });
        }
      }
    }

    // 2. Isi form -> Cold
    if (input.rules.form_to_cold && lowerText.includes('data form klien') && curRank < 2) {
      candidates.push({ stage: 'cold', rank: 2, reason: 'Aturan: Isi form -> Cold' });
    }

    // 3. Membalas lagi setelah busdev membalas di Cold -> Warm
    if (input.rules.reply_to_warm && cur === 'cold' && input.hasSalesRepliedBefore) {
      candidates.push({ stage: warmStage, rank: 3, reason: 'Aturan: Pelanggan membalas lagi di Cold -> Warm' });
    }
  } else if (input.direction === 'outbound') {
    // Opsional: balasan pertama busdev -> Cold
    if (input.rules.first_sales_reply_to_cold && curRank < 2) {
      candidates.push({ stage: 'cold', rank: 2, reason: 'Aturan: Balasan pertama sales -> Cold' });
    }
  }

  // 4. Total bubble > threshold (default 5) -> Warm
  if (input.rules.chat_count_to_warm && input.totalBubbles > (input.rules.chat_threshold || 5) && curRank < 3) {
    candidates.push({
      stage: warmStage,
      rank: 3,
      reason: `Aturan: Total chat > ${input.rules.chat_threshold || 5} -> Warm`,
    });
  }

  if (candidates.length === 0) return { nextStage: null, reason: null };

  // Ambil target dengan rank tertinggi (paling maju)
  candidates.sort((a, b) => b.rank - a.rank);
  return { nextStage: candidates[0].stage, reason: candidates[0].reason };
}

/**
 * Menghitung detik kerja antara `startIso` dan `endIso` di zona Asia/Jakarta
 * hanya dalam jam kerja [workStart, workEnd] (default 08:00 - 20:00 WIB).
 */
export function computeBusinessSeconds(
  startDate: Date,
  endDate: Date,
  workStart = '08:00',
  workEnd = '20:00'
): number {
  const startMs = startDate.getTime();
  const endMs = endDate.getTime();
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) return 0;

  const [sh, sm] = workStart.split(':').map(Number);
  const [eh, em] = workEnd.split(':').map(Number);
  const startMinOfDay = (sh || 8) * 60 + (sm || 0);
  const endMinOfDay = (eh || 20) * 60 + (em || 0);
  if (endMinOfDay <= startMinOfDay) return 0;

  // Geser ke WIB (+7 jam) untuk iterasi hari kalender WIB
  const WIB_OFFSET = 7 * 3600_000;
  const startWib = startMs + WIB_OFFSET;
  const endWib = endMs + WIB_OFFSET;

  const startDayMs = Math.floor(startWib / 86_400_000) * 86_400_000;
  const endDayMs = Math.floor(endWib / 86_400_000) * 86_400_000;

  let totalMs = 0;
  for (let dayMs = startDayMs; dayMs <= endDayMs; dayMs += 86_400_000) {
    const winStart = dayMs + startMinOfDay * 60_000;
    const winEnd = dayMs + endMinOfDay * 60_000;
    const overlapStart = Math.max(startWib, winStart);
    const overlapEnd = Math.min(endWib, winEnd);
    if (overlapEnd > overlapStart) {
      totalMs += overlapEnd - overlapStart;
    }
  }

  return Math.round(totalMs / 1000);
}

/**
 * Menghitung status Follow-Up (FU 1 / FU 2 / Saran Lost) per hari kalender Asia/Jakarta.
 * Hanya berlaku untuk stage Warm (4 kolom) atau Hot yang pesan terakhirnya dari SALES.
 */
export function computeFuStatus(input: {
  stage: string;
  lastMessageDirection: 'inbound' | 'outbound' | null;
  lastSalesMsgAt: Date | null;
  now?: Date;
  fu1Days?: number;
  fu2Days?: number;
  lostDays?: number;
}): 'FU 1' | 'FU 2' | 'Saran Lost' | null {
  const warmOrHot = new Set([
    'warm_below_500',
    'warm_up_500',
    'warm_below_1000',
    'warm_up_1000',
    'hot',
  ]);
  if (!warmOrHot.has(input.stage)) return null;
  if (input.lastMessageDirection !== 'outbound' || !input.lastSalesMsgAt) return null;

  const now = input.now || new Date();
  const WIB_OFFSET = 7 * 3600_000;
  const msgDay = Math.floor((input.lastSalesMsgAt.getTime() + WIB_OFFSET) / 86_400_000);
  const nowDay = Math.floor((now.getTime() + WIB_OFFSET) / 86_400_000);
  const diffDays = nowDay - msgDay;

  if (diffDays >= (input.lostDays ?? 7)) return 'Saran Lost';
  if (diffDays >= (input.fu2Days ?? 3)) return 'FU 2';
  if (diffDays >= (input.fu1Days ?? 1)) return 'FU 1';
  return null;
}

export function isOptOutMessage(text: string): boolean {
  return /\b(stop|berhenti)\b/i.test(String(text || '').trim());
}
