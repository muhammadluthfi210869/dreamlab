import { cookies } from 'next/headers';
import { getNextAgent, incrementAgentLeadCount } from './roundRobin';
import { AGENTS, pickEmergencyFallbackAgent, Agent } from './round-robin-config';

const COOKIE_NAME = 'dreamlab_cs';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export interface AssignmentResult {
  agent: Agent;
  source: 'sticky' | 'rotation' | 'fallback';
}

export async function getOrAssignAgent(): Promise<AssignmentResult> {
  const cookieStore = await cookies();
  const existingId = cookieStore.get(COOKIE_NAME)?.value;

  if (existingId) {
    const stickyAgent = AGENTS.find((a) => a.id === existingId && a.active);
    if (stickyAgent) {
      await incrementAgentLeadCount(stickyAgent.id);
      return { agent: stickyAgent, source: 'sticky' };
    }
  }

  try {
    const agent = await getNextAgent();
    try {
      await incrementAgentLeadCount(agent.id);
    } catch (countErr) {
      // Gagal catat statistik TIDAK BOLEH menggagalkan assignment itu
      // sendiri — lead tetap harus disalurkan meski counternya meleset.
      console.error('[lead-assignment] incrementAgentLeadCount gagal untuk rotation, lanjut tanpa catat:', countErr);
    }
    cookieStore.set(COOKIE_NAME, agent.id, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
    return { agent, source: 'rotation' };
  } catch (err) {
    console.error('[lead-assignment] getNextAgent gagal, pakai fallback darurat:', err);
    // pickEmergencyFallbackAgent() SELALU mengembalikan Agent selama
    // AGENTS tidak kosong total — beda dengan getActiveAgents() yang bisa
    // throw lagi di sini kalau semua agent kebetulan nonaktif, yang
    // sebelumnya bikin request ini crash 500 tanpa fallback sama sekali.
    const fallbackAgent = pickEmergencyFallbackAgent();
    try {
      await incrementAgentLeadCount(fallbackAgent.id);
    } catch (countErr) {
      console.error('[lead-assignment] incrementAgentLeadCount gagal untuk fallback, lanjut tanpa catat:', countErr);
    }
    cookieStore.set(COOKIE_NAME, fallbackAgent.id, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
    return { agent: fallbackAgent, source: 'fallback' };
  }
}
