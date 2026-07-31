"use client";

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { pushPilotEvent, resolvePilotPayload } from '@/lib/seo-pilot/tracking';
import { getLeadSource } from '@/lib/lead-source';
import { buildThankyouUrl } from '@/lib/lead-routing';

interface PilotCtaButtonProps {
  label: string;
  message: string;
  location: string;
  page: {
    pageUrl: string;
    pageTitle: string;
    pageType: 'pilot_article' | 'money_page';
    seoCluster: string;
    keywordTarget: string;
  };
  className?: string;
  href?: string;
  actionType?: 'wa' | 'scroll' | 'link';
  scrollTarget?: string;
}

export default function PilotCtaButton({ label, message, location, page, className, href, actionType = 'wa', scrollTarget }: PilotCtaButtonProps) {
  const router = useRouter();

  const handleClick = useCallback(() => {
    const payload = resolvePilotPayload(location, page);
    // actionType 'wa' → halaman thankyou sesuai channel; atribusi & conversion
    // dicatat di thankyou, lalu auto-redirect ke WA dengan pesan yang menyebut channel.
    const source = typeof window !== 'undefined' ? getLeadSource(window.location.pathname) : 'organic';
    const thankyouUrl = buildThankyouUrl({ source, msg: message });

    const ctaUrl =
      actionType === 'wa'
        ? thankyouUrl
        : actionType === 'link'
          ? href || '/biaya-maklon-skincare/'
          : `#${scrollTarget || 'brief-form'}`;

    pushPilotEvent('cta_click', {
      ...payload,
      cta_label: label,
      cta_url: ctaUrl,
    });

    if (actionType === 'wa') {
      pushPilotEvent('wa_click', {
        ...payload,
        cta_label: label,
        cta_url: ctaUrl,
      });
      window.location.assign(thankyouUrl);
      return;
    }

    if (actionType === 'link') {
      router.push(href || '/biaya-maklon-skincare/');
      return;
    }

    const target = document.getElementById(scrollTarget || 'brief-form');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [actionType, href, label, location, message, page, router, scrollTarget]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className || 'inline-flex items-center justify-center rounded-full bg-[#D98A00] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#D98A00]/20 transition hover:translate-y-[-1px] hover:bg-[#c97e00]'}
    >
      {label}
    </button>
  );
}
