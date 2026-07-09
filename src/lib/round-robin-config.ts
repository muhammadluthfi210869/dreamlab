export interface BusdevContact {
  id: number;
  phone: string;
  name: string;
}

interface SupabaseBusdevContact {
  id?: number;
  phone?: string | null;
  name?: string | null;
}

export const ROUND_ROBIN_BUSDEVS: BusdevContact[] = [
  {
    id: 1,
    phone: '6287776550657',
    name: 'Busdev 1',
  },
  {
    id: 2,
    phone: '6281952417051',
    name: 'Busdev 2',
  },
  {
    id: 3,
    phone: '6287712232389',
    name: 'Busdev 3',
  },
];

export function normalizePhone(phone: string | null | undefined): string {
  if (!phone) return '';

  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('62')) return digits;
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;

  return digits;
}

export function getConfiguredBusdevs(overrides: SupabaseBusdevContact[] = []): BusdevContact[] {
  const overridesByPhone = new Map(
    overrides
      .map((contact) => {
        const phone = normalizePhone(contact.phone);
        if (!phone) return null;

        return [phone, contact] as const;
      })
      .filter((entry): entry is readonly [string, SupabaseBusdevContact] => entry !== null)
  );

  return ROUND_ROBIN_BUSDEVS.map((contact) => {
    const match = overridesByPhone.get(contact.phone);

    return {
      id: match?.id ?? contact.id,
      phone: contact.phone,
      name: match?.name?.trim() || contact.name,
    };
  });
}

export function resolveRoundRobinIndex(rawIndex: unknown, total: number): number {
  if (total <= 0) return 0;

  const numericIndex = Number(rawIndex);
  if (!Number.isFinite(numericIndex)) return 0;

  const normalized = Math.trunc(numericIndex) % total;
  return normalized >= 0 ? normalized : normalized + total;
}

export function getFallbackBusdev(rawIndex?: unknown): BusdevContact {
  const index = rawIndex === undefined
    ? 0
    : resolveRoundRobinIndex(rawIndex, ROUND_ROBIN_BUSDEVS.length);
  return ROUND_ROBIN_BUSDEVS[index];
}
