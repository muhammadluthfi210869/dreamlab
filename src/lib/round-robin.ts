const BUSDEV_FALLBACK = ['6287776550657', '6281952417051'];

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
    const idx = Math.floor(Math.random() * BUSDEV_FALLBACK.length);
    return {
      phone: BUSDEV_FALLBACK[idx],
      busdev_id: idx + 1,
      name: `Busdev ${idx + 1}`,
    };
  }
}
