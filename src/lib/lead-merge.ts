/**
 * lead-merge.ts
 *
 * Menggabungkan baris `leads` yang sebenarnya orang yang sama supaya lead monitor
 * menampilkan 1 baris per prospek. Aturannya sengaja SAMA dengan dedup di sistem:
 * nomor telepon yang sama dalam 24 jam = 1 prospek (lihat ATURAN 3 di
 * api/lead-capture/confirm dan "DEDUPLIKASI 24 JAM" di assign_and_insert_lead).
 *
 * Murni tampilan: tidak menulis ke database dan tidak mempengaruhi round robin.
 * Baris tanpa nomor (klik yang belum chat) tidak punya identitas, jadi tidak
 * digabung.
 */

export const MERGE_WINDOW_MS = 24 * 60 * 60 * 1000;

export interface MergeableLead {
  id: number;
  tracking_code: string;
  assigned_to: string | null;
  source: string | null;
  status: string | null;
  created_at: string;
  confirmed_at: string | null;
  display_phone?: string | null;
  wa_phone?: string | null;
  hp?: string | null;
  is_form_lead?: boolean;
  [key: string]: unknown;
}

export type MergedLead<T extends MergeableLead> = T & {
  /** Jumlah baris lain yang digabung ke baris ini (0 = tidak ada duplikat). */
  duplicate_count: number;
  /** tracking_code baris-baris yang digabung (selain baris utama). */
  merged_tracking_codes: string[];
  /** Semua BusDev yang pernah menerima prospek ini. Lebih dari 1 = konflik penugasan. */
  busdevs: string[];
  /** Waktu terbaru di antara semua baris yang digabung, dipakai untuk urutan tampilan. */
  last_seen_at: string;
};

// Field hasil form / konfirmasi chat yang boleh "dipinjam" dari baris lain di kelompok yang sama.
const BORROWABLE_FIELDS = [
  'nama',
  'hp',
  'wa_phone',
  'wa_profile_name',
  'wa_message',
  'produk',
  'production_tier_name',
  'lead_segment',
  'requested_quantity_pcs',
  'inquiry_reference',
  'qualification_status',
  'crm_sync_status',
  'wa_clicked_at',
  'whatsapp_phone_e164',
  'phone_country_iso2',
] as const;

/** Kunci nomor: hanya digit, awalan 0 diubah ke 62. Null bila terlalu pendek untuk dipercaya. */
export function phoneKey(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let digits = String(raw).replace(/\D/g, '');
  if (digits.startsWith('0')) digits = '62' + digits.slice(1);
  return digits.length >= 9 ? digits : null;
}

function leadPhoneKey(l: MergeableLead): string | null {
  return phoneKey(l.wa_phone) || phoneKey(l.hp) || phoneKey(l.display_phone);
}

const time = (iso: string | null | undefined): number => (iso ? new Date(iso).getTime() : 0);

/** Makin besar makin layak jadi baris utama: chat asli > chat langsung > hasil form > klik biasa. */
function priority(l: MergeableLead): number {
  if (l.status === 'confirmed' && l.source !== 'wa-direct') return 3;
  if (l.status === 'confirmed') return 2;
  if (l.is_form_lead) return 1;
  return 0;
}

function hasValue(v: unknown): boolean {
  return v !== null && v !== undefined && v !== '';
}

export function mergeLeads<T extends MergeableLead>(rows: T[], windowMs = MERGE_WINDOW_MS): MergedLead<T>[] {
  const ordered = [...rows].sort((a, b) => time(a.created_at) - time(b.created_at));

  const clusters: T[][] = [];
  const open = new Map<string, T[]>(); // kunci nomor -> kelompok yang masih dalam jendela 24 jam

  for (const row of ordered) {
    const key = leadPhoneKey(row);
    if (!key) {
      clusters.push([row]);
      continue;
    }
    const current = open.get(key);
    // Jendela bergulir: dibandingkan dengan interaksi TERAKHIR di kelompok, sama seperti dedup sistem.
    if (current && time(row.created_at) - time(current[current.length - 1].created_at) <= windowMs) {
      current.push(row);
    } else {
      const fresh = [row];
      open.set(key, fresh);
      clusters.push(fresh);
    }
  }

  const merged = clusters.map((group): MergedLead<T> => {
    if (group.length === 1) {
      const only = group[0];
      return {
        ...only,
        duplicate_count: 0,
        merged_tracking_codes: [],
        busdevs: only.assigned_to ? [only.assigned_to] : [],
        last_seen_at: only.created_at,
      };
    }

    // Baris utama: prioritas tertinggi; kalau sama, yang paling awal.
    const primary = [...group].sort(
      (a, b) => priority(b) - priority(a) || time(a.created_at) - time(b.created_at)
    )[0];

    const out: Record<string, unknown> = { ...primary };

    // Pinjam field kosong dari baris lain di kelompok yang sama.
    for (const field of BORROWABLE_FIELDS) {
      if (hasValue(out[field])) continue;
      const donor = group.find((g) => hasValue(g[field]));
      if (donor) out[field] = donor[field];
    }

    const anyConfirmed = group.find((g) => g.status === 'confirmed');
    const earliest = group[0].created_at; // group sudah urut naik
    out.created_at = earliest;
    out.status = anyConfirmed ? 'confirmed' : primary.status;
    out.confirmed_at = primary.confirmed_at || anyConfirmed?.confirmed_at || null;
    out.is_form_lead = group.some((g) => g.is_form_lead);
    out.latency_seconds = out.confirmed_at
      ? Math.max(0, Math.round((time(out.confirmed_at as string) - time(earliest)) / 1000))
      : null;

    const busdevs = Array.from(new Set(group.map((g) => g.assigned_to).filter((n): n is string => !!n)));
    const lastSeen = group.reduce(
      (max, g) => Math.max(max, time(g.created_at), time(g.confirmed_at)),
      0
    );

    return {
      ...(out as T),
      duplicate_count: group.length - 1,
      merged_tracking_codes: group.filter((g) => g !== primary).map((g) => g.tracking_code),
      busdevs,
      last_seen_at: new Date(lastSeen).toISOString(),
    };
  });

  return merged.sort((a, b) => time(b.last_seen_at) - time(a.last_seen_at));
}

export type LeadStatusView = 'all' | 'valid' | 'confirmed' | 'dropoff';

/**
 * 'valid'     = chat masuk ATAU hasil form (form yang belum chat tetap tampil)
 * 'confirmed' = hanya chat masuk
 * 'dropoff'   = klik/form yang belum chat
 */
export function matchesStatusView(l: MergeableLead, view: string): boolean {
  switch (view) {
    case 'valid':
      return l.status === 'confirmed' || !!l.is_form_lead;
    case 'confirmed':
      return l.status === 'confirmed';
    case 'dropoff':
      return l.status !== 'confirmed' && l.source !== 'wa-direct';
    default:
      return true;
  }
}
