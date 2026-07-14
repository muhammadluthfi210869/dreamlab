"use client";

import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { pushPilotEvent, resolvePilotPayload } from '@/lib/seo-pilot/tracking';

interface PilotLeadFormProps {
  page: {
    pageUrl: string;
    pageTitle: string;
    pageType: 'pilot_article' | 'money_page';
    seoCluster: string;
    keywordTarget: string;
  };
  title: string;
  description: string;
  submitLabel: string;
}

export default function PilotLeadForm({ page, title, description, submitLabel }: PilotLeadFormProps) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [need, setNeed] = useState('');
  const [timeline, setTimeline] = useState('');

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

  const message = useMemo(() => {
    const lines = [
      'Halo Dreamlab, saya ingin kirim brief produk.',
      name ? `Nama: ${name}` : null,
      brand ? `Brand: ${brand}` : null,
      need ? `Kebutuhan: ${need}` : null,
      timeline ? `Target launch: ${timeline}` : null,
    ].filter(Boolean);

    return lines.join('\n');
  }, [name, brand, need, timeline]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!phone) return;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    const payload = resolvePilotPayload('lead_form', page);

    pushPilotEvent('form_submit', {
      ...payload,
      cta_label: submitLabel,
      form_name: 'pilot_brief_form',
      form_fields: {
        name,
        brand,
        need,
        timeline,
      },
      form_target: whatsappUrl,
    });

    pushPilotEvent('cta_click', {
      ...payload,
      cta_label: submitLabel,
      cta_url: whatsappUrl,
    });

    pushPilotEvent('wa_click', {
      ...payload,
      cta_label: submitLabel,
      cta_url: whatsappUrl,
    });

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="brief-form" className="rounded-[28px] border border-[#eadfcf] bg-[#fffaf1] p-6 sm:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-black tracking-tight text-[#1f1f1d]">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-[#2a2a28]">
            Nama
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-2xl border border-[#e6dac7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D98A00]"
              placeholder="Nama kamu"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#2a2a28]">
            Brand
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="rounded-2xl border border-[#e6dac7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D98A00]"
              placeholder="Nama brand"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-semibold text-[#2a2a28]">
          Kebutuhan produk
          <textarea
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            rows={4}
            className="rounded-2xl border border-[#e6dac7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D98A00]"
            placeholder="Misalnya: serum brightening, packaging premium, dan target launch 3 bulan."
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-[#2a2a28]">
          Target launch
          <input
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className="rounded-2xl border border-[#e6dac7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D98A00]"
            placeholder="Misalnya: 1-3 bulan"
          />
        </label>

        <button
          type="submit"
          disabled={!phone}
          className="inline-flex items-center justify-center rounded-full bg-[#D98A00] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#D98A00]/20 transition hover:translate-y-[-1px] hover:bg-[#c97e00] sm:w-fit"
        >
          {submitLabel}
        </button>
      </form>
    </section>
  );
}
