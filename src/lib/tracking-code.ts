/**
 * tracking-code.ts — Batch 2.
 *
 * Single source of truth on the website for building the customer-facing
 * `[Kode: ...]` fragment used in WhatsApp messages. Mirrors the ERP helper
 * in `backend/src/common/helpers/tracking-code.ts`. Keeps the website's
 * message format and ERP's inbound parser in lock-step.
 *
 * The ERP canonical tracking code format is `DL[0-9A-F]{8}`. We never
 * embed the legacy website code (DL-YYYYMMDD-XXXXXX) into the message —
 * it is for internal idempotency only.
 */

export function buildTrackingCodeFragment(trackingCode: string): string {
  return `[Kode: ${trackingCode}]`;
}