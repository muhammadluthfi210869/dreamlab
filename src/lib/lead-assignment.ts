import { cookies } from 'next/headers';
import { getNextAgent, incrementAgentLeadCount } from './roundRobin';
import { AGENTS, getActiveAgents, Agent } from './round-robin-config';

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
    await incrementAgentLeadCount(agent.id);
    cookieStore.set(COOKIE_NAME, agent.id, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
    return { agent, source: 'rotation' };
  } catch (err) {
    console.error('[lead-assignment] getNextAgent gagal, pakai fallback random:', err);
    const active = getActiveAgents();
    const fallbackAgent = active[Math.floor(Math.random() * active.length)];
    await incrementAgentLeadCount(fallbackAgent.id);
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
