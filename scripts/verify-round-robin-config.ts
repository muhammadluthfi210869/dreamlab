/**
 * verify-round-robin-config.ts
 *
 * Validasi STATIS (tanpa server hidup, tanpa Redis, tanpa network) untuk
 * konfigurasi round-robin lead distribution. Didesain untuk masuk ke
 * `npm run verify:all` / `npm run preflight` supaya kesalahan konfigurasi
 * ketahuan SEBELUM deploy, bukan setelah beberapa hari testing manual.
 *
 * Yang divalidasi:
 * 1. AGENTS tidak kosong dan minimal 1 agent berstatus active — kalau
 *    tidak, lead-assignment.ts akan jatuh ke fallback darurat setiap
 *    request (lihat pickEmergencyFallbackAgent di round-robin-config.ts).
 * 2. Tidak ada agent ID duplikat (dipakai sebagai key cookie & Redis,
 *    duplikat bisa bikin dua CS "berbagi" hitungan yang sama).
 * 3. Nomor telepon tidak kosong dan formatnya masuk akal.
 * 4. Simulasi murni matematika rotasi (tanpa Redis sungguhan) untuk
 *    memastikan modulo index selalu menghasilkan agent yang valid dan
 *    distribusinya idealnya rata untuk N kelipatan jumlah agent aktif.
 */

import assert from 'node:assert/strict';
import { AGENTS, getActiveAgents } from '../src/lib/round-robin-config';

function verifyAgentsNotEmpty() {
  assert(AGENTS.length > 0, 'AGENTS tidak boleh kosong di round-robin-config.ts');
  console.log(`✅ AGENTS terisi (${AGENTS.length} agent terdaftar)`);
}

function verifyAtLeastOneActive() {
  let active: ReturnType<typeof getActiveAgents>;
  try {
    active = getActiveAgents();
  } catch (err) {
    throw new Error(
      'Tidak ada agent aktif (active: true) di AGENTS! Semua request akan jatuh ke fallback darurat. ' +
        `Detail: ${(err as Error).message}`
    );
  }
  assert(active.length > 0, 'getActiveAgents() harus mengembalikan minimal 1 agent');
  console.log(`✅ Minimal 1 agent aktif (${active.length} agent aktif: ${active.map((a) => a.id).join(', ')})`);
}

function verifyNoDuplicateIds() {
  const ids = AGENTS.map((a) => a.id);
  const uniqueIds = new Set(ids);
  assert.equal(uniqueIds.size, ids.length, `Ada agent ID duplikat di AGENTS: ${ids.join(', ')}`);
  console.log('✅ Tidak ada agent ID duplikat');
}

function verifyPhoneNumbers() {
  for (const agent of AGENTS) {
    assert(agent.phone && agent.phone.trim().length > 0, `Agent ${agent.id} tidak punya nomor telepon`);
    const digitsOnly = agent.phone.replace(/\D/g, '');
    assert(
      digitsOnly.length >= 9 && digitsOnly.length <= 15,
      `Nomor telepon agent ${agent.id} (${agent.phone}) kelihatan tidak valid (${digitsOnly.length} digit)`
    );
  }
  console.log('✅ Semua nomor telepon agent lolos validasi format dasar');
}

/**
 * Simulasi murni index rotasi — REPLIKA logic getNextAgent() di
 * roundRobin.ts tapi tanpa Redis sungguhan (counter lokal in-memory).
 * Ini menguji matematikanya, bukan konektivitas Redis (yang divalidasi
 * terpisah lewat scripts/simulate-lead-distribution.ts saat server hidup).
 */
function verifyRotationMathIsFair() {
  const active = getActiveAgents();
  const rounds = active.length * 20; // beberapa putaran penuh
  const counts: Record<string, number> = {};

  let counter = 0;
  for (let i = 0; i < rounds; i += 1) {
    counter += 1;
    const index = (counter - 1) % active.length;
    const agent = active[index];
    assert(agent, `Index rotasi ${index} menghasilkan agent undefined — cek panjang array active`);
    counts[agent.id] = (counts[agent.id] ?? 0) + 1;
  }

  const values = Object.values(counts);
  const expectedPerAgent = rounds / active.length;
  for (const [agentId, count] of Object.entries(counts)) {
    assert.equal(
      count,
      expectedPerAgent,
      `Rotasi tidak rata untuk ${agentId}: dapat ${count}, harusnya tepat ${expectedPerAgent} ` +
        `(modulo seharusnya SELALU rata persis untuk kelipatan penuh jumlah agent)`
    );
  }

  console.log(
    `✅ Matematika rotasi rata sempurna untuk ${rounds} panggilan (${expectedPerAgent} per agent, ${values.length} agent)`
  );
}

function main() {
  console.log('=== Verifikasi Konfigurasi Round-Robin (statis, tanpa server) ===\n');
  verifyAgentsNotEmpty();
  verifyAtLeastOneActive();
  verifyNoDuplicateIds();
  verifyPhoneNumbers();
  verifyRotationMathIsFair();
  console.log('\n✅ Semua verifikasi konfigurasi round-robin lolos.');
}

main();
