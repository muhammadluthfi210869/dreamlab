interface CSAgent {
  id: string;
  name: string;
  number: string;
}

interface LeadStats {
  [id: string]: number;
}

const CS_POOL: CSAgent[] = [
  { id: "cs1", name: "CS 1", number: "087712232389" },
  { id: "cs2", name: "CS 2", number: "081952417051" },
  { id: "cs3", name: "CS 3", number: "087776550657" },
];

class RoundRobinPool {
  private agents: CSAgent[];
  private counter: number;
  private stats: LeadStats;

  constructor(agents: CSAgent[]) {
    this.agents = agents;
    this.counter = 0;
    this.stats = {};
    for (const a of agents) {
      this.stats[a.id] = 0;
    }
  }

  normalizePhoneNumber(raw: string): string {
    let s = raw.replace(/[\s\-\(\)]/g, "");
    if (s.startsWith("+")) {
      s = s.slice(1);
    }
    if (s.startsWith("0")) {
      s = "62" + s.slice(1);
    }
    return s;
  }

  next(): { agent: CSAgent; phone: string } {
    const index = this.counter % this.agents.length;
    const agent = this.agents[index];
    this.counter++;
    this.stats[agent.id] = (this.stats[agent.id] ?? 0) + 1;
    return { agent, phone: this.normalizePhoneNumber(agent.number) };
  }

  getAgent(id: string): CSAgent | undefined {
    return this.agents.find((a) => a.id === id);
  }

  getStats(): LeadStats {
    return { ...this.stats };
  }

  reset(): void {
    this.counter = 0;
    for (const id of Object.keys(this.stats)) {
      this.stats[id] = 0;
    }
  }
}

const pool = new RoundRobinPool(CS_POOL);

export default pool;
