"use client";

import { useEffect, useMemo, useState } from 'react';
import { getNextBusdev } from '@/lib/round-robin';
import { pushPilotEvent, resolvePilotPayload } from '@/lib/seo-pilot/tracking';

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
  actionType?: 'wa' | 'scroll';
  scrollTarget?: string;
}

export default function PilotCtaButton({ label, message, location, page, className, actionType = 'wa', scrollTarget }: PilotCtaButtonProps) {
  const [phone, setPhone] = useState('6287776550657');

  useEffect(() => {
    let mounted = true;
    getNextBusdev().then((busdev) => {
      if (mounted && busdev?.phone) setPhone(busdev.phone);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const url = useMemo(() => {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }, [phone, message]);

  const handleClick = () => {
    const payload = resolvePilotPayload(location, page);
    const ctaUrl = actionType === 'wa' ? url : `#${scrollTarget || 'brief-form'}`;

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
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    const target = document.getElementById(scrollTarget || 'brief-form');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
