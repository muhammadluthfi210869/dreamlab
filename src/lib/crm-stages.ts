/**
 * Tahap sales pipeline. Dipakai server (validasi) dan klien (kolom kanban), jadi tanpa dependensi server.
 * Urutan di sini = urutan kolom dari kiri ke kanan. Semua lead baru otomatis berada di 'traffic'.
 */
export const PIPELINE_STAGES = [
  { id: 'traffic', label: 'Traffic (Umum)', hint: 'Klik baru & chat yang belum terkualifikasi form MOQ', tone: '#64748B' },
  { id: 'traffic_below_500', label: 'Traffic MOQ < 500', hint: 'Kualifikasi form/manual dengan rencana produksi di bawah 500 pcs', tone: '#E11D48' },
  { id: 'traffic_500', label: 'Traffic MOQ 500', hint: 'Kualifikasi skala Starter (500 pcs)', tone: '#D97706' },
  { id: 'traffic_1000', label: 'Traffic MOQ 1.000+', hint: 'Kualifikasi skala Growth (1.000), Scale (5.000), Enterprise (10.000+ pcs)', tone: '#2563EB' },
  { id: 'cold', label: 'Cold', hint: 'Calon klien, belum menunjukkan minat nyata', tone: '#0EA5E9' },
  { id: 'warm', label: 'Warm', hint: 'Sudah berdiskusi dan tertarik', tone: '#F59E0B' },
  { id: 'hot', label: 'Hot', hint: 'Siap memutuskan, tinggal negosiasi', tone: '#EF4444' },
  { id: 'sample', label: 'Sample', hint: 'Sedang proses sampel', tone: '#8B5CF6' },
  { id: 'deal', label: 'Deal', hint: 'Sepakat dan berjalan', tone: '#16A34A' },
  { id: 'loker', label: 'Traffic Loker / Supplier', hint: 'Pencari kerja atau penawar jasa/supplier, bukan calon klien', tone: '#7C3AED' },
  { id: 'tidak_jelas', label: 'Traffic Tidak Jelas', hint: 'Tidak bisa dinilai: iseng, salah nomor, tanpa maksud jelas', tone: '#94A3B8' },
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number]['id'];

export const STAGE_IDS: readonly string[] = PIPELINE_STAGES.map((s) => s.id);
export const DEFAULT_STAGE: PipelineStage = 'traffic';

export const isStage = (v: unknown): v is PipelineStage => typeof v === 'string' && STAGE_IDS.includes(v);

export const stageLabel = (id: string | null | undefined): string =>
  PIPELINE_STAGES.find((s) => s.id === id)?.label ?? PIPELINE_STAGES[0].label;

export function resolveTrafficStageByMoq(moq: number | null | undefined): PipelineStage {
  if (typeof moq !== 'number' || moq <= 0) return 'traffic';
  if (moq < 500) return 'traffic_below_500';
  if (moq < 1000) return 'traffic_500';
  return 'traffic_1000';
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

