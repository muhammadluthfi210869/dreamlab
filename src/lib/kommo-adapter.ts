/**
 * kommo-adapter.ts
 *
 * Kommo CRM Server-Side Integration Adapter for Dreamlab.
 * Manages lead & contact synchronization, field mapping, deduplication,
 * and preserves Round Robin / BD assignments.
 */

export interface LeadQualificationPayload {
  inquiryReference: string;
  category: string;
  quantityRange: string;
  budgetRange: string;
  productionTimeline: string;
  businessStatus: string;
  leadSegment: string;
  fullName: string;
  whatsappPhone: string;
  brandOrCompany?: string;
  sourceChannel: string;
  campaign?: string;
  landingPage: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  assignedSalesId?: string;
  assignedSalesName?: string;
}

export interface KommoSyncResult {
  success: boolean;
  status: 'synced' | 'pending_configuration' | 'failed';
  contactId?: number | string;
  leadId?: number | string;
  error?: string;
  message?: string;
}

const KOMMO_SUBDOMAIN = process.env.KOMMO_SUBDOMAIN;
const KOMMO_API_TOKEN = process.env.KOMMO_API_TOKEN;

function getBaseUrl(): string {
  if (!KOMMO_SUBDOMAIN) return '';
  return `https://${KOMMO_SUBDOMAIN}.kommo.com/api/v4`;
}

function cleanPhoneNumber(phone: string): string {
  let cleaned = (phone || '').replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  return cleaned;
}

/**
 * Sync lead data into Kommo CRM.
 * If credentials are not set, durably returns pending_configuration
 * so the database and BDs know it needs manual or deferred sync.
 */
export async function syncLeadToKommo(
  data: LeadQualificationPayload
): Promise<KommoSyncResult> {
  if (!KOMMO_SUBDOMAIN || !KOMMO_API_TOKEN) {
    console.warn(
      '[Kommo Adapter] KOMMO_SUBDOMAIN or KOMMO_API_TOKEN is not configured on this server. Lead marked as pending_configuration.'
    );
    return {
      success: false,
      status: 'pending_configuration',
      message: 'Kommo CRM credentials (KOMMO_SUBDOMAIN, KOMMO_API_TOKEN) not configured in server environment.',
    };
  }

  const phone = cleanPhoneNumber(data.whatsappPhone);
  const baseUrl = getBaseUrl();

  try {
    // 1. Search for existing contact by phone to avoid duplicates & preserve existing BD ownership
    let contactId: number | null = null;
    let existingOwnerId: number | null = null;

    const searchUrl = `${baseUrl}/contacts?query=${encodeURIComponent(phone)}`;
    const searchRes = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${KOMMO_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (searchRes.ok && searchRes.status !== 204) {
      const searchData = await searchRes.json();
      const existingContacts = searchData?._embedded?.contacts;
      if (Array.isArray(existingContacts) && existingContacts.length > 0) {
        contactId = existingContacts[0].id;
        existingOwnerId = existingContacts[0].responsible_user_id || null;
      }
    }

    // 2. Create contact if not exists
    if (!contactId) {
      const createContactRes = await fetch(`${baseUrl}/contacts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${KOMMO_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            name: data.fullName,
            custom_fields_values: [
              {
                field_code: 'PHONE',
                values: [{ value: `+${phone}`, enum_code: 'WORK' }],
              },
            ],
          },
        ]),
        cache: 'no-store',
      });

      if (!createContactRes.ok) {
        const errText = await createContactRes.text();
        console.error('[Kommo Adapter] Failed to create contact:', errText);
        return {
          success: false,
          status: 'failed',
          error: `Failed to create Kommo contact: ${createContactRes.status} ${errText}`,
        };
      }

      const createContactData = await createContactRes.json();
      contactId = createContactData?._embedded?.contacts?.[0]?.id;
    }

    // 3. Prepare notes and tags
    const leadTitle = `[${data.leadSegment}] ${data.category} - ${data.fullName}${
      data.brandOrCompany ? ` (${data.brandOrCompany})` : ''
    }`;

    const leadNoteContent = [
      `=== FORM KUALIFIKASI PAID ADS DREAMLAB ===`,
      `Kode Konsultasi: ${data.inquiryReference}`,
      `Kategori Produk: ${data.category}`,
      `Estimasi Produksi: ${data.quantityRange}`,
      `Lead Segment: ${data.leadSegment}`,
      `Estimasi Budget: ${data.budgetRange}`,
      `Timeline Produksi: ${data.productionTimeline}`,
      `Status Bisnis: ${data.businessStatus}`,
      `Nama Brand/PT: ${data.brandOrCompany || '-'}`,
      `Channel: ${data.sourceChannel}`,
      `Campaign: ${data.campaign || '-'}`,
      `Landing Page: ${data.landingPage}`,
      `Assigned BD: ${data.assignedSalesName || '-'}`,
      `Attribution: utm_source=${data.utmSource || '-'}, utm_medium=${data.utmMedium || '-'}, utm_campaign=${data.utmCampaign || '-'}`,
      `GCLID: ${data.gclid || '-'} | FBCLID: ${data.fbclid || '-'}`,
      `Waktu Submit: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB`,
    ].join('\n');

    // 4. Create Lead associated with contact
    const createLeadPayload: any = {
      name: leadTitle,
      price: 0,
      _embedded: {
        contacts: contactId ? [{ id: contactId }] : [],
        tags: [
          { name: data.leadSegment },
          { name: data.sourceChannel },
          { name: 'Paid Ads Qualification' },
          { name: data.category },
        ],
      },
    };

    // If contact already had an owner, keep it to preserve existing BD ownership
    if (existingOwnerId) {
      createLeadPayload.responsible_user_id = existingOwnerId;
    }

    const createLeadRes = await fetch(`${baseUrl}/leads`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KOMMO_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([createLeadPayload]),
      cache: 'no-store',
    });

    if (!createLeadRes.ok) {
      const errText = await createLeadRes.text();
      console.error('[Kommo Adapter] Failed to create lead:', errText);
      return {
        success: false,
        status: 'failed',
        contactId: contactId ?? undefined,
        error: `Failed to create Kommo lead: ${createLeadRes.status} ${errText}`,
      };
    }

    const createLeadData = await createLeadRes.json();
    const leadId = createLeadData?._embedded?.leads?.[0]?.id;

    // 5. Append full qualification details as lead note
    if (leadId) {
      try {
        await fetch(`${baseUrl}/leads/${leadId}/notes`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${KOMMO_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([
            {
              note_type: 'common',
              params: {
                text: leadNoteContent,
              },
            },
          ]),
          cache: 'no-store',
        });
      } catch (noteErr) {
        console.warn('[Kommo Adapter] Could not append note to lead:', noteErr);
      }
    }

    return {
      success: true,
      status: 'synced',
      contactId: contactId ?? undefined,
      leadId: leadId ?? undefined,
    };
  } catch (err: any) {
    console.error('[Kommo Adapter] Unexpected error during sync:', err);
    return {
      success: false,
      status: 'failed',
      error: err?.message || 'Unknown network error during Kommo sync',
    };
  }
}
