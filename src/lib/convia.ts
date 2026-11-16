import 'server-only';

/**
 * src/lib/convia.ts
 *
 * Klien resmi Convia API untuk server-side Next.js ('server-only').
 * Menggunakan CONVIA_API_KEY dan CONVIA_API_BASE.
 * Nilai API key TIDAK PERNAH di-log atau dikirim ke browser.
 *
 * Aturan:
 * - Timeout 10 detik.
 * - Retry 1x untuk network error atau 5xx.
 * - Error diformat jelas tanpa membocorkan key.
 */

const DEFAULT_BASE_URL = 'https://api.convia.id/api/v1/public';
const TIMEOUT_MS = 10_000;

function getConviaConfig() {
  const apiKey = (process.env.CONVIA_API_KEY || '').trim();
  const rawBase = (process.env.CONVIA_API_BASE || DEFAULT_BASE_URL).trim();
  const baseUrl = rawBase.replace(/\/+$/, '');
  return { apiKey, baseUrl };
}

async function fetchWithRetry(url: string, options: RequestInit, retryCount = 1): Promise<Response> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= retryCount; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.status >= 500 && attempt < retryCount) {
        // Retry pada 5xx
        await new Promise((r) => setTimeout(r, 600));
        continue;
      }
      return res;
    } catch (err: any) {
      clearTimeout(timer);
      lastError = err;
      if (attempt < retryCount) {
        await new Promise((r) => setTimeout(r, 600));
        continue;
      }
    }
  }
  throw lastError || new Error('Request timeout atau kegagalan jaringan ke Convia');
}

export interface ConviaHealthResult {
  ok: boolean;
  status: string;
  statusCode?: number;
  checkedAt: string;
  error?: string;
}

export interface ConviaPhoneNumberItem {
  id: string;
  phone_number_id?: string;
  display_phone_number: string;
  verified_name?: string;
  quality_rating: 'GREEN' | 'YELLOW' | 'RED' | 'UNKNOWN';
  is_primary?: boolean;
  waba_id?: string;
  business_name?: string;
}

export interface SendTextMessageParams {
  to: string; // nomor tujuan format 62, tanpa +, tanpa spasi
  content: string;
  phoneId: string; // id nomor Convia pengirim
}

export interface UpsertCustomerParams {
  phone_number: string; // 628xxx
  name?: string;
  email?: string;
  tags?: string[]; // maks 20 tags, per tag maks 50 karakter
  whatsapp_phone_number_id?: string;
}

function cleanPhone62(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    digits = '62' + digits.slice(1);
  } else if (digits.startsWith('8')) {
    digits = '62' + digits;
  }
  return digits;
}

export const convia = {
  /**
   * GET /health -> cek status koneksi API Convia
   */
  async health(): Promise<ConviaHealthResult> {
    const { apiKey, baseUrl } = getConviaConfig();
    const checkedAt = new Date().toISOString();
    if (!apiKey) {
      return { ok: false, status: 'error', checkedAt, error: 'CONVIA_API_KEY belum di-set di environment' };
    }

    try {
      const res = await fetchWithRetry(`${baseUrl}/health`, {
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
          status: 'error',
          statusCode: res.status,
          checkedAt,
          error: (data as any)?.message || `Convia health check gagal (${res.status})`,
        };
      }

      return {
        ok: true,
        status: (data as any)?.status || 'ok',
        statusCode: res.status,
        checkedAt,
      };
    } catch (err: any) {
      return {
        ok: false,
        status: 'error',
        checkedAt,
        error: err?.message || 'Gagal menghubungi server Convia (timeout / network error)',
      };
    }
  },

  /**
   * GET /phone-numbers -> daftar nomor WhatsApp resmi Convia
   */
  async listPhoneNumbers(): Promise<{ ok: boolean; phoneNumbers: ConviaPhoneNumberItem[]; error?: string }> {
    const { apiKey, baseUrl } = getConviaConfig();
    if (!apiKey) {
      return { ok: false, phoneNumbers: [], error: 'CONVIA_API_KEY belum di-set di environment' };
    }

    try {
      const res = await fetchWithRetry(`${baseUrl}/phone-numbers`, {
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

      const phoneNumbers: ConviaPhoneNumberItem[] = rawList.map((item: any) => {
        const rawQuality = String(item.quality_rating || item.quality || '').toUpperCase();
        const quality_rating: 'GREEN' | 'YELLOW' | 'RED' | 'UNKNOWN' =
          rawQuality === 'GREEN' || rawQuality === 'YELLOW' || rawQuality === 'RED'
            ? rawQuality
            : rawQuality === 'GOOD'
            ? 'GREEN'
            : rawQuality === 'FAIR'
            ? 'YELLOW'
            : rawQuality === 'POOR'
            ? 'RED'
            : 'UNKNOWN';

        return {
          id: String(item.id || item.phone_number_id || ''),
          phone_number_id: item.phone_number_id ? String(item.phone_number_id) : undefined,
          display_phone_number: String(item.display_phone_number || item.phone || item.wa_number || ''),
          verified_name: item.verified_name || item.name || undefined,
          quality_rating,
          is_primary: Boolean(item.is_primary),
          waba_id: item.waba_id ? String(item.waba_id) : undefined,
          business_name: item.business_name || undefined,
        };
      });

      return { ok: true, phoneNumbers };
    } catch (err: any) {
      return {
        ok: false,
        phoneNumbers: [],
        error: err?.message || 'Gagal menghubungi Convia API (timeout / network error)',
      };
    }
  },

  /**
   * POST /messages/send -> kirim pesan teks WhatsApp resmi
   * Body: { phone_number: "628xxx", channel: "whatsapp", message_type: "text", content: "...", whatsapp_phone_number_id: "" }
   */
  async sendText(params: SendTextMessageParams): Promise<{ ok: boolean; messageId?: string; error?: string }> {
    const { apiKey, baseUrl } = getConviaConfig();
    if (!apiKey) {
      return { ok: false, error: 'CONVIA_API_KEY belum di-set di environment' };
    }

    const cleanedTo = cleanPhone62(params.to);
    if (!cleanedTo || cleanedTo.length < 9) {
      return { ok: false, error: 'Nomor tujuan tidak valid (wajib format 62...)' };
    }

    if (!params.content || !params.content.trim()) {
      return { ok: false, error: 'Isi pesan tidak boleh kosong' };
    }

    if (!params.phoneId) {
      return { ok: false, error: 'whatsapp_phone_number_id wajib diisi' };
    }

    try {
      const payload = {
        phone_number: cleanedTo,
        channel: 'whatsapp',
        message_type: 'text',
        content: params.content.trim(),
        whatsapp_phone_number_id: params.phoneId,
      };

      const res = await fetchWithRetry(`${baseUrl}/messages/send`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        return {
          ok: false,
          error: (json as any)?.message || `Gagal mengirim pesan via Convia (${res.status})`,
        };
      }

      const messageId =
        (json as any)?.data?.id ||
        (json as any)?.data?.message_id ||
        (json as any)?.message_id ||
        (json as any)?.id ||
        undefined;

      return { ok: true, messageId };
    } catch (err: any) {
      return {
        ok: false,
        error: err?.message || 'Gagal mengirim pesan via Convia (timeout / network error)',
      };
    }
  },

  /**
   * POST /customers -> simpan atau perbarui kontak pelanggan
   */
  async upsertCustomer(params: UpsertCustomerParams): Promise<{ ok: boolean; customerId?: string; error?: string }> {
    const { apiKey, baseUrl } = getConviaConfig();
    if (!apiKey) {
      return { ok: false, error: 'CONVIA_API_KEY belum di-set di environment' };
    }

    const cleanedPhone = cleanPhone62(params.phone_number);
    const sanitizedTags = (params.tags || [])
      .map((t) => t.trim().slice(0, 50))
      .filter(Boolean)
      .slice(0, 20);

    const payload: Record<string, unknown> = {
      phone_number: cleanedPhone,
    };
    if (params.name) payload.name = params.name.trim();
    if (params.email) payload.email = params.email.trim();
    if (sanitizedTags.length > 0) payload.tags = sanitizedTags;
    if (params.whatsapp_phone_number_id) payload.whatsapp_phone_number_id = params.whatsapp_phone_number_id;

    try {
      const res = await fetchWithRetry(`${baseUrl}/customers`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        return {
          ok: false,
          error: (json as any)?.message || `Gagal upsert customer via Convia (${res.status})`,
        };
      }

      return {
        ok: true,
        customerId: (json as any)?.data?.id || (json as any)?.id || undefined,
      };
    } catch (err: any) {
      return {
        ok: false,
        error: err?.message || 'Gagal menghubungi Convia customer endpoint (timeout / network error)',
      };
    }
  },
};
