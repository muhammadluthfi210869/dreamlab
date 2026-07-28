import { cookies } from 'next/headers';
import { getNextAgent, getNextMetaAgent, incrementAgentLeadCount } from './roundRobin';
import { AGENTS, pickEmergencyFallbackAgent, Agent } from './round-robin-config';

const COOKIE_NAME = 'dreamlab_cs';
const META_COOKIE_NAME = 'dreamlab_cs_meta';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export interface AssignmentResult {
  agent: Agent;
  source: 'sticky' | 'rotation' | 'fallback';
}

function isMetaSource(campaignSource?: string | null): boolean {
  return !!campaignSource && campaignSource.startsWith('meta-');
}

export async function getOrAssignAgent(campaignSource?: string | null): Promise<AssignmentResult> {
  const isMeta = isMetaSource(campaignSource);
  const cookieName = isMeta ? META_COOKIE_NAME : COOKIE_NAME;
  const cookieStore = await cookies();
  const existingId = cookieStore.get(cookieName)?.value;

  if (existingId) {
    const stickyAgent = AGENTS.find((a) => a.id === existingId && a.active);
    if (stickyAgent) {
      await incrementAgentLeadCount(stickyAgent.id);
      return { agent: stickyAgent, source: 'sticky' };
    }
  }

  try {
    const agent = isMeta ? await getNextMetaAgent() : await getNextAgent();
    try {
      await incrementAgentLeadCount(agent.id);
    } catch (countErr) {
      console.error('[lead-assignment] incrementAgentLeadCount gagal untuk rotation, lanjut tanpa catat:', countErr);
    }
    cookieStore.set(cookieName, agent.id, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
    return { agent, source: 'rotation' };
  } catch (err) {
    console.error('[lead-assignment] getNextAgent gagal, pakai fallback darurat:', err);
    const fallbackAgent = pickEmergencyFallbackAgent();
    try {
      await incrementAgentLeadCount(fallbackAgent.id);
    } catch (countErr) {
      console.error('[lead-assignment] incrementAgentLeadCount gagal untuk fallback, lanjut tanpa catat:', countErr);
    }
    cookieStore.set(cookieName, fallbackAgent.id, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
    return { agent: fallbackAgent, source: 'fallback' };
  }
}
