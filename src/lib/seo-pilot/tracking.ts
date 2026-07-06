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
}

const ATTR_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'pilot_referrer', 'pilot_landing_page'] as const;

function getSessionStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function persistPilotAttribution() {
  if (typeof window === 'undefined') return;
  const storage = getSessionStorage();
  if (!storage) return;

  const url = new URL(window.location.href);
  const referrer = document.referrer || '';

  if (url.searchParams.get('utm_source')) storage.setItem('utm_source', url.searchParams.get('utm_source') || '');
  if (url.searchParams.get('utm_medium')) storage.setItem('utm_medium', url.searchParams.get('utm_medium') || '');
  if (url.searchParams.get('utm_campaign')) storage.setItem('utm_campaign', url.searchParams.get('utm_campaign') || '');
  if (referrer) storage.setItem('pilot_referrer', referrer);
  storage.setItem('pilot_landing_page', window.location.pathname + window.location.search);
}

export function getPilotAttribution() {
  const storage = getSessionStorage();
  return {
    utm_source: storage?.getItem('utm_source') || 'organic',
    utm_medium: storage?.getItem('utm_medium') || 'organic',
    utm_campaign: storage?.getItem('utm_campaign') || 'pilot_batch_1',
    referrer: storage?.getItem('pilot_referrer') || document?.referrer || '',
    landing_page: storage?.getItem('pilot_landing_page') || '',
  };
}

export function buildPilotPayload(base: Omit<PilotTrackingContext, 'utm_source' | 'utm_medium' | 'utm_campaign' | 'referrer'> & Partial<Pick<PilotTrackingContext, 'utm_source' | 'utm_medium' | 'utm_campaign' | 'referrer'>>) {
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

export function resolvePilotPayload(location: string, page: {
  pageUrl: string;
  pageTitle: string;
  pageType: 'pilot_article' | 'money_page';
  seoCluster: string;
  keywordTarget: string;
}) {
  return buildPilotPayload({
    page_url: page.pageUrl,
    page_title: page.pageTitle,
    page_type: page.pageType,
    seo_cluster: page.seoCluster,
    keyword_target: page.keywordTarget,
    cta_location: location,
  });
}
