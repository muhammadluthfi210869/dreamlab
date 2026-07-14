"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  href?: string;
  actionType?: 'wa' | 'scroll' | 'link';
  scrollTarget?: string;
}

export default function PilotCtaButton({ label, message, location, page, className, href, actionType = 'wa', scrollTarget }: PilotCtaButtonProps) {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  useEffect(() => {
    let mounted = true;
    fetch('/api/lead-assignment')
      .then((res) => res.json())
      .then((data) => {
        if (mounted && data?.phone) setPhone(data.phone);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const url = useMemo(() => {
    if (!phone) return '';
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }, [phone, message]);

  const handleClick = () => {
    const payload = resolvePilotPayload(location, page);
    const ctaUrl =
      actionType === 'wa'
        ? url
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
      if (!phone) {
        const target = document.getElementById(scrollTarget || 'brief-form');
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (actionType === 'link') {
      router.push(href || '/biaya-maklon-skincare/');
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
