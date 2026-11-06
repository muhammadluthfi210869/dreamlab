/**
 * meta-capi.ts
 *
 * Reusable Meta Conversions API (CAPI) client for Dreamlab.
 * Sends server-side conversion events to Meta Graph API with a 3s timeout per request.
 * Hashes PII with SHA-256 (never logs raw phone numbers or access tokens).
 * Records each attempt in `capi_events` table with up to 3 retries with backoff.
 */

import crypto from 'node:crypto';
import pool from '@/lib/db';
import type { LeadTier, LeadSegment } from '@/lib/lead-qualification';

export const META_PIXEL_DATASET_ID = '1178862663474674';
export const META_GRAPH_VERSION = 'v21.0';
export const META_REQUEST_TIMEOUT_MS = 3000;

export interface MetaUserDataInput {
  inquiryReference: string;
  fullName: string;
  phoneE164: string; // e.g. +6281234567890
  fbc?: string | null;
  fbp?: string | null;
  clientIp?: string | null;
  userAgent?: string | null;
}

export interface MetaCapiEventInput {
  leadId?: number | null;
  eventName: 'qualification_completed' | 'Lead' | 'QualifiedLeadForm' | string;
  eventId: string;
  eventTime: number; // unix seconds of the submit
  eventSourceUrl: string; // full landing page URL the visitor submitted from
  actionSource?: 'website';
  userData: MetaUserDataInput;
  customData: Record<string, unknown>;
}

export interface MetaLeadPayload {
  leadId?: number | null;
  inquiryCode: string;
  fullName: string;
  phoneE164: string;
  landingUrl?: string | null;
  clientIp?: string | null;
  userAgent?: string | null;
  fbc?: string | null;
  fbp?: string | null;
  tier: LeadTier;
  leadSegment: LeadSegment;
  category: string;
  value: number;
  currency?: string;
}

export interface MetaExtraData {
  eventId?: string;
  eventTime?: number;
  customData?: Record<string, unknown>;
  actionSource?: 'website';
}

export interface MetaEventResult {
  success: boolean;
  httpStatus?: number;
  metaResponseBody?: string;
  errorMessage?: string;
  retryCount: number;
}

export function sha256Hex(val: string): string {
  return crypto.createHash('sha256').update(val).digest('hex');
}

function scrubSensitive(text: string, token?: string): string {
  let out = text || '';
  if (token && token.trim()) {
    out = out.split(token.trim()).join('[REDACTED_TOKEN]');
    out = out.split(encodeURIComponent(token.trim())).join('[REDACTED_TOKEN]');
  }
  return out;
}

/**
 * Prepares hashed user_data according to Meta Conversions API requirements:
 * - ph: SHA-256 of E.164 number without + (e.g. 628…)
 * - fn, ln: SHA-256 of lowercase trimmed first / last name
 * - country: SHA-256 of "id"
 * - external_id: SHA-256 of inquiryReference
 * - fbc, fbp, client_ip_address, client_user_agent
 */
export function buildMetaUserData(input: MetaUserDataInput): Record<string, unknown> {
  const cleanPhone = input.phoneE164.replace(/^\+/, '').replace(/[^0-9]/g, '');
  const nameParts = input.fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = (nameParts[0] || '').trim().toLowerCase();
  const lastName =
    nameParts.length > 1 ? nameParts.slice(1).join(' ').trim().toLowerCase() : '';

  const userData: Record<string, unknown> = {
    ph: sha256Hex(cleanPhone),
    fn: sha256Hex(firstName),
    country: sha256Hex('id'),
    external_id: sha256Hex(input.inquiryReference.trim()),
  };

  if (lastName) {
    userData.ln = sha256Hex(lastName);
  }

  if (input.fbc && input.fbc.trim()) {
    userData.fbc = input.fbc.trim();
  }

  if (input.fbp && input.fbp.trim()) {
    userData.fbp = input.fbp.trim();
  }

  if (input.clientIp && input.clientIp.trim()) {
    userData.client_ip_address = input.clientIp.trim();
  }

  if (input.userAgent && input.userAgent.trim()) {
    userData.client_user_agent = input.userAgent.trim();
  }

  return userData;
}

async function recordCapiEventAttempt(
  leadId: number | null | undefined,
  eventName: string,
  eventId: string,
  httpStatus: number | null,
  responseBody: string | null,
  errorMessage: string | null,
  retryCount: number
) {
  try {
    await pool.query(
      `INSERT INTO capi_events
         (lead_id, event_name, event_id, http_status, response_body, meta_response_body, error_message, retry_count, sent_at)
       VALUES ($1, $2, $3, $4, $5, $5, $6, $7, NOW())`,
      [
        leadId ?? null,
        eventName,
        eventId,
        httpStatus,
        responseBody,
        errorMessage,
        retryCount,
      ]
    );
  } catch (dbErr: any) {
    // Fallback if migration 00031 (response_body column) has not been applied yet on DB
    try {
      await pool.query(
        `INSERT INTO capi_events
           (lead_id, event_name, event_id, http_status, meta_response_body, error_message, retry_count, sent_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [
          leadId ?? null,
          eventName,
          eventId,
          httpStatus,
          responseBody,
          errorMessage,
          retryCount,
        ]
      );
    } catch {
      console.error('[meta-capi] Failed to record capi_events row');
    }
  }
}

/**
 * Sends one or more server-side Meta Conversions API events to Meta Graph API.
 * Logs every attempt in `capi_events` and retries failures up to 3 times with backoff.
 */
export async function sendMetaEvents(
  events: MetaCapiEventInput[]
): Promise<MetaEventResult> {
  if (!events || events.length === 0) {
    return { success: true, retryCount: 0 };
  }

  const token = process.env.META_CAPI_TOKEN;
  const testEventCode = process.env.META_TEST_EVENT_CODE;

  if (!token || !token.trim()) {
    const errorMsg = 'META_CAPI_TOKEN is not configured in environment variables.';
    console.warn(`[meta-capi] Skipped sending ${events.length} event(s): ${errorMsg}`);
    await Promise.all(
      events.map((ev) =>
        recordCapiEventAttempt(ev.leadId, ev.eventName, ev.eventId, null, errorMsg, errorMsg, 0)
      )
    );
    return {
      success: false,
      errorMessage: errorMsg,
      retryCount: 0,
    };
  }

  const dataPayload = events.map((ev) => ({
    event_name: ev.eventName,
    event_time: ev.eventTime,
    event_id: ev.eventId,
    action_source: ev.actionSource || 'website',
    event_source_url: ev.eventSourceUrl,
    user_data: buildMetaUserData(ev.userData),
    custom_data: ev.customData,
  }));

  const bodyPayload: Record<string, unknown> = {
    data: dataPayload,
  };

  if (testEventCode && testEventCode.trim()) {
    bodyPayload.test_event_code = testEventCode.trim();
  }

  const endpoint = `https://graph.facebook.com/${META_GRAPH_VERSION}/${META_PIXEL_DATASET_ID}/events?access_token=${encodeURIComponent(
    token.trim()
  )}`;

  let lastStatus: number | null = null;
  let lastBody = '';
  let lastError = '';
  const maxRetries = 3;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(bodyPayload),
        signal: AbortSignal.timeout(META_REQUEST_TIMEOUT_MS),
      });

      lastStatus = response.status;
      const rawBody = await response.text();
      lastBody = scrubSensitive(rawBody, token);

      if (response.ok) {
        await Promise.all(
          events.map((ev) =>
            recordCapiEventAttempt(
              ev.leadId,
              ev.eventName,
              ev.eventId,
              lastStatus,
              lastBody,
              null,
              attempt
            )
          )
        );
        return {
          success: true,
          httpStatus: lastStatus,
          metaResponseBody: lastBody,
          retryCount: attempt,
        };
      }

      lastError = `HTTP ${response.status}: ${lastBody.slice(0, 300)}`;
      await Promise.all(
        events.map((ev) =>
          recordCapiEventAttempt(
            ev.leadId,
            ev.eventName,
            ev.eventId,
            lastStatus,
            lastBody,
            lastError,
            attempt
          )
        )
      );
    } catch (networkErr: any) {
      lastStatus = null;
      lastError = scrubSensitive(
        networkErr?.message || 'Network or timeout error sending to Meta CAPI',
        token
      );
      lastBody = lastError;

      await Promise.all(
        events.map((ev) =>
          recordCapiEventAttempt(
            ev.leadId,
            ev.eventName,
            ev.eventId,
            null,
            lastBody,
            lastError,
            attempt
          )
        )
      );
    }

    if (attempt < maxRetries) {
      // Backoff: 500ms, 1000ms, 2000ms
      const delayMs = Math.pow(2, attempt) * 500;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return {
    success: false,
    httpStatus: lastStatus ?? undefined,
    metaResponseBody: lastBody || undefined,
    errorMessage: lastError,
    retryCount: maxRetries,
  };
}

/**
 * Single-event convenience wrapper around sendMetaEvents.
 */
export async function sendMetaEvent(
  lead: MetaLeadPayload,
  eventName: string = 'QualifiedLeadForm',
  extra?: MetaExtraData
): Promise<MetaEventResult> {
  const eventId = extra?.eventId || `${lead.inquiryCode}-qf`;
  const eventTime = extra?.eventTime || Math.floor(Date.now() / 1000);
  const eventSourceUrl = lead.landingUrl || 'https://dreamlab.id/';

  const customData: Record<string, unknown> = extra?.customData
    ? { ...extra.customData }
    : {
        lead_segment: lead.leadSegment,
        tier: lead.tier,
        category: lead.category,
        value: lead.value,
        currency: lead.currency || 'IDR',
      };

  return sendMetaEvents([
    {
      leadId: lead.leadId,
      eventName,
      eventId,
      eventTime,
      eventSourceUrl,
      actionSource: extra?.actionSource || 'website',
      userData: {
        inquiryReference: lead.inquiryCode,
        fullName: lead.fullName,
        phoneE164: lead.phoneE164,
        fbc: lead.fbc,
        fbp: lead.fbp,
        clientIp: lead.clientIp,
        userAgent: lead.userAgent,
      },
      customData,
    },
  ]);
}
