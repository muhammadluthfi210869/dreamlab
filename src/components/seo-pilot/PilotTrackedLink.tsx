"use client";

import Link from 'next/link';
import type { ReactNode } from 'react';
import { pushPilotEvent, resolvePilotPayload } from '@/lib/seo-pilot/tracking';

interface PilotTrackedLinkProps {
  href: string;
  label: string;
  location: string;
  className?: string;
  children: ReactNode;
  page: {
    pageUrl: string;
    pageTitle: string;
    pageType: 'pilot_article' | 'money_page';
    seoCluster: string;
    keywordTarget: string;
  };
}

export default function PilotTrackedLink({ href, label, location, className, children, page }: PilotTrackedLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        const payload = resolvePilotPayload(location, page);
        pushPilotEvent('cta_click', {
          ...payload,
          cta_label: label,
          cta_url: href,
        });
      }}
    >
      {children}
    </Link>
  );
}
