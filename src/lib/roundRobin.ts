import { Redis } from '@upstash/redis';
import { Agent, getActiveAgents } from './round-robin-config';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_KV_REST_API_URL!,
  token: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN!,
});

const COUNTER_KEY = 'dreamlab:leadpool:counter';

export async function getNextAgent(): Promise<Agent> {
  const activeAgents = getActiveAgents();
  const count = await redis.incr(COUNTER_KEY);
  const index = (count - 1) % activeAgents.length;
  return activeAgents[index];
}

export async function getRoundRobinStats() {
  const count = (await redis.get<number>(COUNTER_KEY)) ?? 0;
  return {
    totalAssigned: count,
    activeAgents: getActiveAgents().map((a) => a.id),
  };
}

export async function incrementAgentLeadCount(agentId: string): Promise<void> {
  await redis.incr(`dreamlab:leadpool:count:${agentId}`);
}

export async function getAgentLeadCounts(): Promise<Record<string, number>> {
  const activeAgents = getActiveAgents();
  const counts: Record<string, number> = {};
  for (const agent of activeAgents) {
    const count = (await redis.get<number>(`dreamlab:leadpool:count:${agent.id}`)) ?? 0;
    counts[agent.id] = count;
  }
  return counts;
}

export async function resetRoundRobinCounter() {
  await redis.set(COUNTER_KEY, 0);
}
