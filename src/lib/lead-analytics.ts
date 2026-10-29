/**
 * lead-analytics.ts
 *
 * Tracking events for Paid Ads Lead Qualification Funnel (November 2026).
 * Follows strict privacy constraints: NO PII (name, phone, budget) sent to ad networks.
 */

export interface QualificationTrackingData {
  source?: string;
  channel?: 'metaads' | 'google-ads' | 'other';
  step?: number;
  category?: string;
  quantityRange?: string;
  productionTier?: string;
  quantityPcs?: number;
  leadSegment?: string;
  inquiryReference?: string;
  campaign?: string;
  location?: string;
}

export function trackLeadEvent(
  eventName:
    | 'consultation_cta_clicked'
    | 'qualification_started'
    | 'qualification_step_completed'
    | 'qualification_submitted'
    | 'qualification_completed'
    | 'whatsapp_clicked'
    | 'crm_sync_succeeded'
    | 'crm_sync_failed',
  data: QualificationTrackingData = {}
) {
  if (typeof window === 'undefined') return;

  const sanitizedData = {
    event: eventName,
    source: data.source || 'paid-ads',
    channel: data.channel || 'paid-ads',
    step: data.step,
    category: data.category,
    quantity_range: data.quantityRange,
    lead_segment: data.leadSegment,
    inquiry_reference: data.inquiryReference,
    campaign: data.campaign,
    timestamp: new Date().toISOString(),
  };

  // 1. Google Tag Manager dataLayer
  const win = window as any;
  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push(sanitizedData);

  // 2. Google Analytics 4 (gtag)
  if (typeof win.gtag === 'function') {
    win.gtag('event', eventName, {
      event_category: 'lead_qualification',
      event_label: data.leadSegment || data.source || 'ads',
      channel: data.channel,
      lead_segment: data.leadSegment,
      inquiry_reference: data.inquiryReference,
    });
  }

  // 3. Meta Pixel (fbq) - Custom event with non-PII properties
  if (typeof win.fbq === 'function') {
    if (eventName === 'qualification_submitted') {
      // Standard Lead event on form completion
      win.fbq('track', 'Lead', {
        content_name: 'Lead Qualification Form',
        content_category: data.category,
        lead_segment: data.leadSegment,
      });
    } else {
      win.fbq('trackCustom', eventName, {
        step: data.step,
        channel: data.channel,
        lead_segment: data.leadSegment,
      });
    }
  }

  // 4. TikTok Pixel (ttq)
  if (win.ttq && typeof win.ttq.track === 'function') {
    if (eventName === 'qualification_submitted') {
      win.ttq.track('SubmitForm', {
        content_name: 'Lead Qualification',
      });
    }
  }
}
