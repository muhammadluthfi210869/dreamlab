/**
 * Jadwal reminder follow-up (tugas Web Developer Dreamlab #2.2).
 *
 * Kriteria: PIC Business Development dapat melihat jadwal reminder untuk lead di SEMUA stage Warm dan Hot.
 *
 * Aturan jadwal (asumsi awal, ubah di FOLLOWUP_INTERVAL_DAYS bila tim menghendaki selang lain):
 *  - Tahap Warm (Warm 500 / Warm Up 500 / Warm 1.000+): follow-up berikutnya 3 hari setelah aktivitas terakhir.
 *  - Tahap Hot: 1 hari setelah aktivitas terakhir.
 *  - "Aktivitas terakhir" = yang terbaru dari: pesan terakhir (masuk atau keluar), catatan "sudah follow-up", dan
 *    waktu lead pindah ke tahap itu. Jadi jadwal otomatis maju sendiri begitu ada percakapan baru.
 *  - Reminder manual (dijadwalkan sales) menggantikan jadwal otomatis selama masih terbuka.
 *
 * Murni (tanpa I/O) supaya mudah dites. Hari dihitung menurut WIB (UTC+7).
 */
import { normalizeStage } from './crm-stages';

export const REMINDER_STAGES = ['warm_500', 'warm_up_500', 'warm_1000', 'hot'] as const;
export type ReminderStage = (typeof REMINDER_STAGES)[number];

/** Nilai kolom stage di database (termasuk nama lama yang masih sah) yang masuk daftar reminder. */
export const REMINDER_DB_STAGES: readonly string[] = [
  'warm', 'warm_500', 'warm_below_500', 'warm_up_500', 'warm_below_1000', 'warm_up_1000', 'warm_1000', 'hot',
];

export const FOLLOWUP_INTERVAL_DAYS: Record<ReminderStage, number> = {
  warm_500: 3,
  warm_up_500: 3,
  warm_1000: 3,
  hot: 1,
};

export type ReminderState = 'overdue' | 'today' | 'upcoming';
export type ReminderSource = 'otomatis' | 'manual';

export interface Reminder {
  stage: ReminderStage;
  dueAt: Date;
  source: ReminderSource;
  state: ReminderState;
  intervalDays: number;
}

const DAY_MS = 86_400_000;
const WIB_MS = 7 * 3_600_000;

/** Tanggal kalender WIB (YYYY-MM-DD) dari sebuah waktu. */
export const wibDate = (d: Date): string => new Date(d.getTime() + WIB_MS).toISOString().slice(0, 10);

export function isReminderStage(stage: string | null | undefined): boolean {
  return (REMINDER_STAGES as readonly string[]).includes(normalizeStage(stage));
}

export function reminderState(dueAt: Date, now: Date): ReminderState {
  const d = wibDate(dueAt);
  const t = wibDate(now);
  if (d < t) return 'overdue';
  if (d === t) return 'today';
  return 'upcoming';
}

/** Hitung jadwal reminder satu lead. Null bila tahapnya bukan Warm/Hot. */
export function computeReminder(input: {
  stage: string | null | undefined;
  lastActivityAt: Date | null | undefined;
  manualDueAt?: Date | null;
  now?: Date;
}): Reminder | null {
  const now = input.now ?? new Date();
  const stage = normalizeStage(input.stage);
  if (!(REMINDER_STAGES as readonly string[]).includes(stage)) return null;
  const st = stage as ReminderStage;
  const intervalDays = FOLLOWUP_INTERVAL_DAYS[st];

  const validManual = input.manualDueAt instanceof Date && !Number.isNaN(input.manualDueAt.getTime());
  if (validManual) {
    const dueAt = input.manualDueAt as Date;
    return { stage: st, dueAt, source: 'manual', state: reminderState(dueAt, now), intervalDays };
  }
  const base = input.lastActivityAt instanceof Date && !Number.isNaN(input.lastActivityAt.getTime()) ? input.lastActivityAt : now;
  const dueAt = new Date(base.getTime() + intervalDays * DAY_MS);
  return { stage: st, dueAt, source: 'otomatis', state: reminderState(dueAt, now), intervalDays };
}

/** Urutan tampilan: terlambat dulu (paling lama di atas), lalu hari ini, lalu mendatang. */
export function compareReminders(a: { dueAt: Date }, b: { dueAt: Date }): number {
  return a.dueAt.getTime() - b.dueAt.getTime();
}

/** Parse tanggal jadwal dari klien: "YYYY-MM-DD" (jam 09:00 WIB) atau ISO penuh. Null bila tidak sah / di luar jangkauan. */
export function parseDueInput(v: unknown, now: Date = new Date()): Date | null {
  if (typeof v !== 'string' || !v.trim()) return null;
  const s = v.trim();
  let d: Date;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) d = new Date(`${s}T09:00:00+07:00`);
  else d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  // Boleh mundur sampai kemarin (mencatat yang terlewat), maksimal 1 tahun ke depan.
  if (d.getTime() < now.getTime() - 2 * DAY_MS || d.getTime() > now.getTime() + 366 * DAY_MS) return null;
  return d;
}
