export interface PilotTrackingContext {
  page_url: string;
  page_title: string;
  page_type: 'pilot_article' | 'money_page';
  seo_cluster: string;
  keyword_target: string;
  cta_location: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  referrer: string;
  landing_page: string;
  first_touch_source: string;
  session_id: string;
}

function getSessionStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function resolveFirstTouchSource(url: URL, referrer: string): string {
  const utmSource = url.searchParams.get('utm_source');
  if (utmSource) return utmSource;
  if (!referrer) return 'direct';

  try {
    return new URL(referrer).hostname;
  } catch {
    return referrer;
  }
}

function createSessionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `pilot-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function persistPilotAttribution() {
  if (typeof window === 'undefined') return;

  const storage = getSessionStorage();
  if (!storage) return;

  const url = new URL(window.location.href);
  const referrer = document.referrer || '';
  const landingPage = window.location.pathname + window.location.search;
  const utmSource = url.searchParams.get('utm_source') || storage.getItem('utm_source') || 'organic';
  const utmMedium = url.searchParams.get('utm_medium') || storage.getItem('utm_medium') || 'organic';
  const utmCampaign = url.searchParams.get('utm_campaign') || storage.getItem('utm_campaign') || 'pilot_batch_1';

  storage.setItem('utm_source', utmSource);
  storage.setItem('utm_medium', utmMedium);
  storage.setItem('utm_campaign', utmCampaign);

  if (referrer && !storage.getItem('pilot_referrer')) {
    storage.setItem('pilot_referrer', referrer);
  }

  if (!storage.getItem('pilot_landing_page')) {
    storage.setItem('pilot_landing_page', landingPage);
  }

  if (!storage.getItem('pilot_first_touch_source')) {
    storage.setItem('pilot_first_touch_source', resolveFirstTouchSource(url, referrer));
  }

  if (!storage.getItem('pilot_session_id')) {
    storage.setItem('pilot_session_id', createSessionId());
  }
}

export function getPilotAttribution() {
  const storage = getSessionStorage();

  return {
    utm_source: storage?.getItem('utm_source') || 'organic',
    utm_medium: storage?.getItem('utm_medium') || 'organic',
    utm_campaign: storage?.getItem('utm_campaign') || 'pilot_batch_1',
    referrer: storage?.getItem('pilot_referrer') || (typeof document !== 'undefined' ? document.referrer : '') || '',
    landing_page: storage?.getItem('pilot_landing_page') || '',
    first_touch_source: storage?.getItem('pilot_first_touch_source') || 'direct',
    session_id: storage?.getItem('pilot_session_id') || '',
  };
}

export function buildPilotPayload(
  base: Omit<
    PilotTrackingContext,
    'utm_source' | 'utm_medium' | 'utm_campaign' | 'referrer' | 'landing_page' | 'first_touch_source' | 'session_id'
  > &
    Partial<
      Pick<
        PilotTrackingContext,
        'utm_source' | 'utm_medium' | 'utm_campaign' | 'referrer' | 'landing_page' | 'first_touch_source' | 'session_id'
      >
    >
) {
  const attribution = getPilotAttribution();

  return {
    page_url: base.page_url,
    page_title: base.page_title,
    page_type: base.page_type,
    seo_cluster: base.seo_cluster,
    keyword_target: base.keyword_target,
    cta_location: base.cta_location,
    utm_source: base.utm_source || attribution.utm_source,
    utm_medium: base.utm_medium || attribution.utm_medium,
    utm_campaign: base.utm_campaign || attribution.utm_campaign,
    referrer: base.referrer || attribution.referrer,
    landing_page: base.landing_page || attribution.landing_page,
    first_touch_source: base.first_touch_source || attribution.first_touch_source,
    session_id: base.session_id || attribution.session_id,
  };
}

export function pushPilotEvent(event: string, payload: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const target = window as Window & { dataLayer?: unknown[] };
  target.dataLayer = target.dataLayer || [];
  target.dataLayer.push({
    event,
    ...payload,
  });
}

export function resolvePilotPayload(
  location: string,
  page: {
    pageUrl: string;
    pageTitle: string;
    pageType: 'pilot_article' | 'money_page';
    seoCluster: string;
    keywordTarget: string;
  }
) {
  return buildPilotPayload({
    page_url: page.pageUrl,
    page_title: page.pageTitle,
    page_type: page.pageType,
    seo_cluster: page.seoCluster,
    keyword_target: page.keywordTarget,
    cta_location: location,
  });
}
