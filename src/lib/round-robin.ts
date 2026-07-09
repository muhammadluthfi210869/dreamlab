import { getFallbackBusdev } from '@/lib/round-robin-config';

interface RoundRobinResult {
  phone: string;
  busdev_id: number;
  name: string;
}

export async function getNextBusdev(): Promise<RoundRobinResult> {
  try {
    const res = await fetch('/api/round-robin/next');
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch {
    const fallback = getFallbackBusdev(Date.now());
    return {
      phone: fallback.phone,
      busdev_id: fallback.id,
      name: fallback.name,
    };
  }
}
