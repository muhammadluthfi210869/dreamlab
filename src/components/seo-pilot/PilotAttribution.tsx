"use client";

import { useEffect } from 'react';
import { persistPilotAttribution, pushPilotEvent, resolvePilotPayload } from '@/lib/seo-pilot/tracking';

interface PilotAttributionProps {
  page: {
    pageUrl: string;
    pageTitle: string;
    pageType: 'pilot_article' | 'money_page';
    seoCluster: string;
    keywordTarget: string;
  };
}

export default function PilotAttribution({ page }: PilotAttributionProps) {
  useEffect(() => {
    persistPilotAttribution();

    pushPilotEvent('pilot_page_view', {
      ...resolvePilotPayload('page_view', page),
    });
  }, [page]);

  return null;
}
