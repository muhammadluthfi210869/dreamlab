/**
 * Tahap sales pipeline. Dipakai server (validasi) dan klien (kolom kanban), jadi tanpa dependensi server.
 * Urutan di sini = urutan kolom dari kiri ke kanan. Semua lead baru otomatis berada di 'traffic'.
 */
export const PIPELINE_STAGES = [
  { id: 'traffic', label: 'Traffic', hint: 'Semua klik dan lead baru masuk ke sini', tone: '#64748B' },
  { id: 'loker', label: 'Traffic Loker / Supplier', hint: 'Pencari kerja atau penawar jasa/supplier, bukan calon klien', tone: '#7C3AED' },
  { id: 'tidak_jelas', label: 'Traffic Tidak Jelas', hint: 'Tidak bisa dinilai: iseng, salah nomor, tanpa maksud jelas', tone: '#94A3B8' },
  { id: 'cold', label: 'Cold', hint: 'Calon klien, belum menunjukkan minat nyata', tone: '#0EA5E9' },
  { id: 'warm', label: 'Warm', hint: 'Sudah berdiskusi dan tertarik', tone: '#F59E0B' },
  { id: 'hot', label: 'Hot', hint: 'Siap memutuskan, tinggal negosiasi', tone: '#EF4444' },
  { id: 'sample', label: 'Sample', hint: 'Sedang proses sampel', tone: '#8B5CF6' },
  { id: 'deal', label: 'Deal', hint: 'Sepakat dan berjalan', tone: '#16A34A' },
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number]['id'];

export const STAGE_IDS: readonly string[] = PIPELINE_STAGES.map((s) => s.id);
export const DEFAULT_STAGE: PipelineStage = 'traffic';

export const isStage = (v: unknown): v is PipelineStage => typeof v === 'string' && STAGE_IDS.includes(v);

export const stageLabel = (id: string | null | undefined): string =>
  PIPELINE_STAGES.find((s) => s.id === id)?.label ?? PIPELINE_STAGES[0].label;

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
