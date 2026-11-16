/**
 * src/lib/convia-client.ts
 *
 * Klien resmi Convia API untuk server-side Next.js.
 * Menggunakan CONVIA_API_KEY dan CONVIA_API_BASE.
 * Nilai API key TIDAK PERNAH di-log atau dikirim ke browser.
 */

const DEFAULT_BASE_URL = 'https://api.convia.id/api/v1/public';

function getConviaConfig() {
  const apiKey = (process.env.CONVIA_API_KEY || '').trim();
  const rawBase = (process.env.CONVIA_API_BASE || DEFAULT_BASE_URL).trim();
  const baseUrl = rawBase.replace(/\/+$/, '');
  return { apiKey, baseUrl };
}

export interface ConviaHealthResponse {
  ok: boolean;
  configured: boolean;
  status?: string;
  statusCode?: number;
  error?: string;
}

export interface ConviaPhoneNumber {
  id: string;
  display_phone_number?: string;
  verified_name?: string;
  quality_rating?: string;
  code_verification_status?: string;
  status?: string;
  raw?: Record<string, unknown>;
}

export async function checkConviaHealth(): Promise<ConviaHealthResponse> {
  const { apiKey, baseUrl } = getConviaConfig();
  if (!apiKey) {
    return { ok: false, configured: false, error: 'CONVIA_API_KEY belum di-set di environment' };
  }

  try {
    const res = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        configured: true,
        statusCode: res.status,
        error: (data as any)?.message || `Convia health check gagal (${res.status})`,
      };
    }

    return {
      ok: true,
      configured: true,
      status: (data as any)?.status || 'ok',
      statusCode: res.status,
    };
  } catch (err: any) {
    return {
      ok: false,
      configured: true,
      error: err?.message || 'Gagal menghubungi server Convia',
    };
  }
}

export async function fetchConviaPhoneNumbers(): Promise<{
  ok: boolean;
  phoneNumbers: ConviaPhoneNumber[];
  error?: string;
}> {
  const { apiKey, baseUrl } = getConviaConfig();
  if (!apiKey) {
    return { ok: false, phoneNumbers: [], error: 'CONVIA_API_KEY belum di-set di environment' };
  }

  try {
    const res = await fetch(`${baseUrl}/phone-numbers`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        phoneNumbers: [],
        error: (json as any)?.message || `Gagal mengambil daftar nomor (${res.status})`,
      };
    }

    const rawList = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json?.data?.phone_numbers)
      ? json.data.phone_numbers
      : [];

    const phoneNumbers: ConviaPhoneNumber[] = rawList.map((item: any) => ({
      id: String(item.id || item.phone_number_id || item.whatsapp_phone_number_id || ''),
      display_phone_number: item.display_phone_number || item.phone || item.wa_number || null,
      verified_name: item.verified_name || item.name || null,
      quality_rating: item.quality_rating || item.quality || 'UNKNOWN',
      code_verification_status: item.code_verification_status || item.verification_status || null,
      status: item.status || null,
      raw: item,
    }));

    return { ok: true, phoneNumbers };
  } catch (err: any) {
    return {
      ok: false,
      phoneNumbers: [],
      error: err?.message || 'Gagal menghubungi Convia API',
    };
  }
}
