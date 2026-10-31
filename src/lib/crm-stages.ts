/**
 * Tahap sales pipeline sesuai alur Dreamlab:
 * TRAFFIC | COLD | WARM 500PCS | WARM UP 500PCS | WARM 1000 | HOT | SAMPLE
 * Urutan di sini = urutan kolom Kanban dari kiri ke kanan.
 */
export const PIPELINE_STAGES = [
  { id: 'traffic', label: 'Traffic', hint: 'Klik baru & chat yang belum terkualifikasi form MOQ', tone: '#64748B' },
  { id: 'cold', label: 'Cold', hint: 'Prospek dingin / rencana produksi di bawah MOQ 500 pcs', tone: '#0EA5E9' },
  { id: 'warm_500', label: 'Warm 500 pcs', hint: 'Tertarik dengan rencana produksi skala Starter (500 pcs)', tone: '#D97706' },
  { id: 'warm_up_500', label: 'Warm Up 500 pcs', hint: 'Tertarik dengan rencana produksi di atas 500 pcs (> 500 pcs)', tone: '#F59E0B' },
  { id: 'warm_1000', label: 'Warm 1.000+', hint: 'Tertarik dengan rencana produksi skala besar (1.000+ pcs)', tone: '#2563EB' },
  { id: 'hot', label: 'Hot', hint: 'Prospek panas, siap memutuskan / negosiasi', tone: '#EF4444' },
  { id: 'sample', label: 'Sample', hint: 'Sedang proses formulasi & pembuatan sampel produk', tone: '#16A34A' },
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number]['id'];

export const STAGE_IDS: readonly string[] = PIPELINE_STAGES.map((s) => s.id);
export const DEFAULT_STAGE: PipelineStage = 'traffic';

export const isStage = (v: unknown): v is PipelineStage => typeof v === 'string' && STAGE_IDS.includes(v);

export const stageLabel = (id: string | null | undefined): string =>
  PIPELINE_STAGES.find((s) => s.id === id)?.label ?? PIPELINE_STAGES[0].label;

export function normalizeStage(st: string | null | undefined): PipelineStage {
  if (!st) return 'traffic';
  if (st === 'traffic_below_500') return 'cold';
  if (st === 'traffic_500' || st === 'warm') return 'warm_500';
  if (st === 'traffic_1000') return 'warm_1000';
  if (st === 'deal') return 'sample';
  if (STAGE_IDS.includes(st)) return st as PipelineStage;
  return 'traffic';
}

export function resolveTrafficStageByMoq(moq: number | null | undefined): PipelineStage {
  if (typeof moq !== 'number' || moq <= 0) return 'traffic';
  if (moq < 500) return 'cold';
  if (moq === 500) return 'warm_500';
  if (moq < 1000) return 'warm_up_500';
  return 'warm_1000';
}

export type CrmRole = 'head' | 'sales';

export interface CrmUserInfo {
  id: number;
  name: string;
  role: CrmRole;
}

/** Aturan edit: Head boleh semua; sales hanya lead yang `assigned_to`-nya namanya sendiri. */
export function canEditLead(user: Pick<CrmUserInfo, 'name' | 'role'>, assignedTo: string | null | undefined): boolean {
  if (user.role === 'head') return true;
  return !!assignedTo && assignedTo.trim().toLowerCase() === user.name.trim().toLowerCase();
}

export const PRODUK_MAX = 120;
export const NOTE_MAX = 500;
export const MOQ_MAX = 10_000_000;

/**
 * Format link wa.me dengan sapaan pembuka personalisasi nama, sales, dan produk
 */
export function formatWaChatLink(
  phone: string | null | undefined,
  name?: string | null,
  sales?: string | null,
  produk?: string | null
): string | null {
  if (!phone) return null;
  let clean = String(phone).replace(/\D/g, '');
  if (!clean) return null;
  if (clean.startsWith('0')) clean = '62' + clean.slice(1);
  if (!clean.startsWith('62')) clean = '62' + clean;

  const sName = sales ? sales : 'tim BusDev';
  const kName = name ? `Kak ${name}` : 'Kak';
  const pName = produk ? `maklon ${produk}` : 'maklon kosmetik';

  const text = `Halo ${kName}, saya ${sName} dari Dreamlab Kosmetik.\nTerima kasih sudah menghubungi kami mengenai rencana ${pName}. Ada yang bisa saya bantu diskusikan?`;
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}

