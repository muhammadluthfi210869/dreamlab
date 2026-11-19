/**
 * Uji jadwal reminder follow-up (murni):  npx tsx scripts/test-crm-reminders.ts
 * Kriteria #2.2: PIC dapat melihat jadwal reminder untuk lead di SEMUA stage Warm dan Hot.
 */
import assert from 'node:assert/strict';
import { computeReminder, FOLLOWUP_INTERVAL_DAYS, isReminderStage, parseDueInput, reminderState, REMINDER_DB_STAGES, REMINDER_STAGES, wibDate } from '../src/lib/crm-reminders';
import { PIPELINE_STAGES } from '../src/lib/crm-stages';

let n = 0;
const t = (name: string, fn: () => void) => { fn(); n++; console.log(`ok  ${name}`); };
const NOW = new Date('2026-11-19T05:00:00Z'); // 12:00 WIB
const H = 3_600_000;
const D = 24 * H;

t('semua stage Warm (500, Up 500, 1.000+) dan Hot punya reminder', () => {
  for (const st of ['warm_500', 'warm_up_500', 'warm_1000', 'hot']) {
    assert.ok(isReminderStage(st), st);
    assert.ok(computeReminder({ stage: st, lastActivityAt: NOW, now: NOW }), st);
  }
  assert.deepEqual([...REMINDER_STAGES].sort(), ['hot', 'warm_1000', 'warm_500', 'warm_up_500']);
});
t('nama tahap Warm versi lama juga dapat reminder', () => {
  for (const st of ['warm', 'warm_below_500', 'warm_below_1000', 'warm_up_1000']) assert.ok(isReminderStage(st), st);
});
t('tahap lain (traffic, cold, sample, deal, loker, kosong) TIDAK dapat reminder', () => {
  for (const st of ['traffic', 'cold', 'sample', 'deal', 'loker', 'tidak_jelas', '', null, undefined]) {
    assert.equal(computeReminder({ stage: st as never, lastActivityAt: NOW, now: NOW }), null, String(st));
  }
});
t('daftar stage query DB mencakup semua Warm & Hot yang ada di pipeline', () => {
  const warmHot = PIPELINE_STAGES.filter((s) => s.id.startsWith('warm') || s.id === 'hot').map((s) => s.id);
  for (const id of warmHot) assert.ok(REMINDER_DB_STAGES.includes(id), id);
});
t('Warm: follow-up 3 hari setelah aktivitas terakhir; Hot: 1 hari', () => {
  const last = new Date(NOW.getTime() - 1 * H);
  const w = computeReminder({ stage: 'warm_500', lastActivityAt: last, now: NOW })!;
  assert.equal(w.dueAt.getTime(), last.getTime() + 3 * D);
  assert.equal(w.source, 'otomatis');
  const h = computeReminder({ stage: 'hot', lastActivityAt: last, now: NOW })!;
  assert.equal(h.dueAt.getTime(), last.getTime() + 1 * D);
  assert.equal(FOLLOWUP_INTERVAL_DAYS.hot, 1);
});
t('status: terlambat / hari ini / mendatang menurut tanggal WIB', () => {
  assert.equal(reminderState(new Date(NOW.getTime() - 2 * D), NOW), 'overdue');
  assert.equal(reminderState(new Date(NOW.getTime() - 1 * H), NOW), 'today');
  assert.equal(reminderState(new Date(NOW.getTime() + 2 * H), NOW), 'today');
  assert.equal(reminderState(new Date(NOW.getTime() + 2 * D), NOW), 'upcoming');
});
t('batas hari memakai WIB, bukan UTC (23:30 WIB masih hari yang sama)', () => {
  const late = new Date('2026-11-19T16:30:00Z'); // 23:30 WIB 19 Nov
  assert.equal(wibDate(late), '2026-11-19');
  assert.equal(reminderState(late, NOW), 'today');
  const afterMidnight = new Date('2026-11-19T17:30:00Z'); // 00:30 WIB 20 Nov
  assert.equal(wibDate(afterMidnight), '2026-11-20');
  assert.equal(reminderState(afterMidnight, NOW), 'upcoming');
});
t('lead lama tanpa aktivitas selama berminggu-minggu = terlambat', () => {
  const r = computeReminder({ stage: 'hot', lastActivityAt: new Date(NOW.getTime() - 20 * D), now: NOW })!;
  assert.equal(r.state, 'overdue');
});
t('reminder manual menggantikan jadwal otomatis', () => {
  const manual = new Date(NOW.getTime() + 5 * D);
  const r = computeReminder({ stage: 'warm_up_500', lastActivityAt: new Date(NOW.getTime() - 30 * D), manualDueAt: manual, now: NOW })!;
  assert.equal(r.source, 'manual');
  assert.equal(r.dueAt.getTime(), manual.getTime());
  assert.equal(r.state, 'upcoming');
});
t('tanpa aktivitas tercatat: jadwal dihitung dari sekarang (bukan kesalahan)', () => {
  const r = computeReminder({ stage: 'warm_1000', lastActivityAt: null, now: NOW })!;
  assert.equal(r.dueAt.getTime(), NOW.getTime() + 3 * D);
});
t('parseDueInput: tanggal polos = 09:00 WIB; di luar jangkauan / sampah ditolak', () => {
  assert.equal(parseDueInput('2026-11-25', NOW)!.toISOString(), '2026-11-25T02:00:00.000Z');
  assert.ok(parseDueInput('2026-11-18', NOW)); // kemarin masih boleh
  assert.equal(parseDueInput('2026-11-10', NOW), null); // terlalu lampau
  assert.equal(parseDueInput('2028-01-01', NOW), null); // > 1 tahun
  for (const bad of ['', 'abc', null, undefined, 123, {}, '2026-13-45']) assert.equal(parseDueInput(bad, NOW), null, String(bad));
});

console.log(`\n${n}/${n} lulus`);
