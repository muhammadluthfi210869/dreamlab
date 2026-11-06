/**
 * lead-qualification.ts
 *
 * Server-side qualification logic for Paid Ads lead capture funnel.
 * Determines lead tier, qualification status, and disqualify reasons strictly on the server.
 * Never trusts any client-submitted tier or qualification flags.
 */

import pool from '@/lib/db';

export type LeadTier = 'A' | 'B' | 'C' | 'D';
export type LeadSegment = 'Starter' | 'Growth' | 'Scale' | 'Enterprise';
export type DisqualifyReason =
  | 'below_min_tier'
  | 'invalid_phone'
  | 'duplicate'
  | 'test_or_internal';

export interface TierInfo {
  tier: LeadTier;
  leadSegment: LeadSegment;
  value: number;
}

const TIER_RANKS: Record<LeadTier, number> = {
  D: 1,
  C: 2,
  B: 3,
  A: 4,
};

/**
 * Computes tier, lead segment, and monetary value directly from budgetRange.
 *
 * budgetRange               tier  lead_segment  value
 * < 25 Juta                 D     Starter       1
 * 25–50 Juta                C     Growth        3
 * 50–100 Juta, 100–250 Juta B     Scale         6
 * 250–500 Juta, > 500 Juta  A     Enterprise    10
 */
export function resolveTierFromBudget(budgetRange?: string | null): TierInfo {
  const b = (budgetRange || '').trim().toLowerCase();

  // Tier A: 250–500 Juta, > 500 Juta
  if (
    b.includes('> 500') ||
    b.includes('>500') ||
    b.includes('250–500') ||
    b.includes('250 - 500') ||
    b.includes('250-500')
  ) {
    return { tier: 'A', leadSegment: 'Enterprise', value: 10 };
  }

  // Tier B: 50–100 Juta, 100–250 Juta
  if (
    b.includes('50–100') ||
    b.includes('50 - 100') ||
    b.includes('50-100') ||
    b.includes('100–250') ||
    b.includes('100 - 250') ||
    b.includes('100-250')
  ) {
    return { tier: 'B', leadSegment: 'Scale', value: 6 };
  }

  // Tier C: 25–50 Juta
  if (
    b.includes('25–50') ||
    b.includes('25 - 50') ||
    b.includes('25-50')
  ) {
    return { tier: 'C', leadSegment: 'Growth', value: 3 };
  }

  // Tier D: < 25 Juta or fallback
  return { tier: 'D', leadSegment: 'Starter', value: 1 };
}

/**
 * Validates whether the phone number is a valid E.164 number.
 * For Indonesian numbers (+62), enforces mobile prefix (+628..., 9–13 digits after +62).
 */
export function validateQualificationPhone(phoneE164: string): boolean {
  if (!phoneE164 || !phoneE164.startsWith('+')) return false;
  if (phoneE164.startsWith('+62')) {
    const digitsAfter62 = phoneE164.slice(3);
    if (!digitsAfter62.startsWith('8')) return false;
    if (digitsAfter62.length < 9 || digitsAfter62.length > 13) return false;
    return /^[0-9]+$/.test(digitsAfter62);
  }
  const digits = phoneE164.slice(1);
  return digits.length >= 8 && digits.length <= 15 && /^[0-9]+$/.test(digits);
}

export const validateIndonesianMobilePhone = validateQualificationPhone;

/**
 * Checks if the lead name or phone matches test values or internal team numbers.
 * Name not a test value: test, tes , coba, asdf
 * Phone not in INTERNAL_PHONES (env list)
 */
export function isTestOrInternalLead(fullName: string, cleanDigits: string): boolean {
  const rawLowerName = (fullName || '').toLowerCase();
  const trimmedLowerName = rawLowerName.trim();

  if (
    rawLowerName.includes('test') ||
    rawLowerName.includes('tes ') ||
    trimmedLowerName === 'tes' ||
    rawLowerName.includes('coba') ||
    rawLowerName.includes('asdf')
  ) {
    return true;
  }

  const internalPhonesRaw = process.env.INTERNAL_PHONES || '';
  if (internalPhonesRaw.trim()) {
    const list = internalPhonesRaw
      .split(',')
      .map((p) => p.trim().replace(/[^0-9]/g, ''))
      .filter(Boolean);

    const targetDigits = cleanDigits.replace(/^\+/, '').replace(/^0/, '62');
    for (const internal of list) {
      const normInternal = internal.replace(/^0/, '62');
      if (normInternal === targetDigits) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks database for duplicate submissions with the same phone in the last 30 days.
 */
export async function findDuplicateLeadIn30Days(
  phoneE164: string,
  localHp: string
): Promise<{ id: number } | null> {
  try {
    const zeroHp = localHp.startsWith('62') ? '0' + localHp.slice(2) : localHp;
    const res = await pool.query(
      `SELECT id FROM leads
       WHERE (whatsapp_phone_e164 = $1 OR hp = $2 OR hp = $3)
         AND created_at >= (NOW() - INTERVAL '30 days')
         AND is_test IS NOT TRUE
       ORDER BY id ASC
       LIMIT 1`,
      [phoneE164, localHp, zeroHp]
    );

    if (res.rows.length > 0) {
      return { id: Number(res.rows[0].id) };
    }
    return null;
  } catch (err) {
    console.error('[lead-qualification] Failed to check duplicate lead in 30 days:', err);
    return null;
  }
}

export interface EvaluateQualificationParams {
  fullName: string;
  phoneE164: string;
  localHp: string;
  budgetRange?: string | null;
}

export interface QualificationEvaluation {
  tier: LeadTier;
  leadSegment: LeadSegment;
  value: number;
  qualified: boolean;
  disqualifyReason: DisqualifyReason | null;
  isDuplicate: boolean;
  duplicateOfId: number | null;
}

/**
 * Evaluates full server-side qualification rules:
 * Qualified when:
 * - tier >= QUALIFIED_MIN_TIER (env, default C)
 * - phone valid
 * - same phone not submitted in the last 30 days
 * - name not a test value (test, tes , coba, asdf)
 * - phone not in INTERNAL_PHONES (env list)
 */
export async function evaluateLeadQualification(
  params: EvaluateQualificationParams
): Promise<QualificationEvaluation> {
  const { fullName, phoneE164, localHp, budgetRange } = params;

  // 1. Resolve Tier & Segment strictly from budgetRange on server
  const tierInfo = resolveTierFromBudget(budgetRange);
  const minTier = (process.env.QUALIFIED_MIN_TIER || 'C').trim().toUpperCase() as LeadTier;
  const minRank = TIER_RANKS[minTier] ?? 2;
  const leadRank = TIER_RANKS[tierInfo.tier] ?? 1;

  // 2. Always check 30-day duplicate upfront (so duplicates are known even for < 25 Juta)
  const duplicate = await findDuplicateLeadIn30Days(phoneE164, localHp);
  const isDuplicate = Boolean(duplicate);
  const duplicateOfId = duplicate?.id ?? null;

  // 3. Check Phone Validity
  if (!validateQualificationPhone(phoneE164)) {
    return {
      ...tierInfo,
      qualified: false,
      disqualifyReason: 'invalid_phone',
      isDuplicate,
      duplicateOfId,
    };
  }

  // 4. Check Test or Internal Phone
  if (isTestOrInternalLead(fullName, localHp)) {
    return {
      ...tierInfo,
      qualified: false,
      disqualifyReason: 'test_or_internal',
      isDuplicate,
      duplicateOfId,
    };
  }

  // 5. Check Duplicate in Last 30 Days
  if (isDuplicate) {
    return {
      ...tierInfo,
      qualified: false,
      disqualifyReason: 'duplicate',
      isDuplicate: true,
      duplicateOfId,
    };
  }

  // 6. Check Minimum Tier (default C)
  if (leadRank < minRank) {
    return {
      ...tierInfo,
      qualified: false,
      disqualifyReason: 'below_min_tier',
      isDuplicate: false,
      duplicateOfId: null,
    };
  }

  // All qualification conditions met
  return {
    ...tierInfo,
    qualified: true,
    disqualifyReason: null,
    isDuplicate: false,
    duplicateOfId: null,
  };
}
