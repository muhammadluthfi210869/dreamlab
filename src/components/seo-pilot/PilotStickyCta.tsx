"use client";

import PilotCtaButton from '@/components/seo-pilot/PilotCtaButton';

interface PilotStickyCtaProps {
  page: {
    pageUrl: string;
    pageTitle: string;
    pageType: 'pilot_article' | 'money_page';
    seoCluster: string;
    keywordTarget: string;
  };
  primaryLabel: string;
  primaryMessage: string;
  secondaryLabel: string;
  secondaryMessage: string;
  formHref: string;
  primaryHref?: string;
}

export default function PilotStickyCta({
  page,
  primaryLabel,
  primaryMessage,
  secondaryLabel,
  secondaryMessage,
  formHref,
  primaryHref = '/biaya-maklon-skincare/',
}: PilotStickyCtaProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#eadfcf] bg-white/96 px-3 py-3 shadow-[0_-12px_40px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden">
      <div className="mx-auto grid max-w-2xl grid-cols-2 gap-2">
        <PilotCtaButton
          label={primaryLabel}
          message={primaryMessage}
          location="sticky_mobile_primary"
          page={page}
          href={primaryHref}
          actionType="link"
          className="inline-flex items-center justify-center rounded-2xl bg-[#D98A00] px-3 py-3 text-[12px] font-black text-white shadow-lg shadow-[#D98A00]/20 transition active:scale-[0.98]"
        />
        <PilotCtaButton
          label={secondaryLabel}
          message={secondaryMessage}
          location="sticky_mobile_secondary"
          page={page}
          actionType="scroll"
          scrollTarget={formHref.replace('#', '')}
          className="inline-flex items-center justify-center rounded-2xl border border-[#e6dac7] bg-[#fffaf1] px-3 py-3 text-[12px] font-black text-[#1f1f1d] transition active:scale-[0.98]"
        />
      </div>
    </div>
  );
}
