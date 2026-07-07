import Link from 'next/link';
import type { ReactNode } from 'react';
import JsonLd from '@/components/JsonLd';
import PilotAttribution from '@/components/seo-pilot/PilotAttribution';
import PilotBreadcrumbs from '@/components/seo-pilot/PilotBreadcrumbs';
import PilotCtaButton from '@/components/seo-pilot/PilotCtaButton';
import PilotLeadForm from '@/components/seo-pilot/PilotLeadForm';
import PilotStickyCta from '@/components/seo-pilot/PilotStickyCta';
import type { PilotPageData } from '@/data/seo-pilot/batch-1';
import { buildPilotSchemas } from '@/lib/seo-pilot/schema';

interface PilotPageRendererProps {
  page: PilotPageData;
}

function pageContext(page: PilotPageData) {
  return {
    pageUrl: page.canonical,
    pageTitle: page.metaTitle,
    pageType: page.pageType,
    seoCluster: page.seoCluster,
    keywordTarget: page.keywordTarget,
  } as const;
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[28px] border border-[#eadfcf] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-8">
      <h2 className="text-2xl font-black tracking-tight text-[#1f1f1d]">{title}</h2>
      <div className="mt-4 space-y-4 text-[15px] leading-7 text-neutral-700">{children}</div>
    </section>
  );
}

function LabelBlock({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-[#1f1f1d]">{title}</h2>
      {description ? <p className="mt-3 text-sm leading-7 text-neutral-600">{description}</p> : null}
    </div>
  );
}

function CtaCluster({
  page,
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryMessage,
  secondaryLabel,
  secondaryMessage,
}: {
  page: PilotPageData;
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryMessage: string;
  secondaryLabel: string;
  secondaryMessage: string;
}) {
  const ctx = pageContext(page);

  return (
    <section className="grid gap-6 rounded-[28px] border border-[#eadfcf] bg-[#fffaf1] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-8">
      <LabelBlock eyebrow={eyebrow} title={title} description={description} />
      <div className="flex flex-wrap gap-3">
        <PilotCtaButton
          label={primaryLabel}
          message={primaryMessage}
          location="contextual_cta_primary"
          page={ctx}
        />
        <PilotCtaButton
          label={secondaryLabel}
          message={secondaryMessage}
          location="contextual_cta_secondary"
          page={ctx}
          actionType="scroll"
          scrollTarget="brief-form"
          className="inline-flex items-center justify-center rounded-full border border-[#e6dac7] bg-white px-6 py-3 text-sm font-extrabold text-[#1f1f1d] transition hover:bg-[#fff8ee]"
        />
      </div>
      <PilotLeadForm
        page={ctx}
        title={page.leadForm.title}
        description={page.leadForm.description}
        submitLabel={page.leadForm.submitLabel}
      />
    </section>
  );
}

export default function PilotPageRenderer({ page }: PilotPageRendererProps) {
  const schema = buildPilotSchemas(page);
  const ctx = pageContext(page);
  const isArticle = page.pageType === 'pilot_article';

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffdf8_0%,#fff8ef_100%)] text-[#1f1f1d]">
      <PilotAttribution page={ctx} />
      <JsonLd data={schema as never} />

      <section className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <PilotBreadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: isArticle ? 'Panduan' : 'Biaya & MOQ', href: isArticle ? '/panduan/' : '/panduan/' },
            { label: page.title, href: page.slug },
          ]}
        />

        <article className="mt-5 space-y-6">
          <header className="rounded-[32px] border border-[#eadfcf] bg-[#fffaf1] p-7 text-center shadow-[0_24px_80px_rgba(0,0,0,0.05)] sm:p-10">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">SEO Pilot Dreamlab</p>
            <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-black tracking-tight text-[#1f1f1d] sm:text-5xl">
              {page.heroHeadline}
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-neutral-600 sm:text-lg">
              {page.subheadline}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-neutral-500">
              <span className="rounded-full bg-white px-4 py-2 font-semibold text-[#4a4a48]">Last updated: {page.lastUpdated}</span>
              <span className="rounded-full bg-white px-4 py-2 font-semibold text-[#4a4a48]">{page.readingTime}</span>
              <span className="rounded-full bg-white px-4 py-2 font-semibold text-[#4a4a48]">
                {isArticle ? 'Pilot Article' : 'Money Page'}
              </span>
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {page.heroCtas.map((cta) => (
                <PilotCtaButton
                  key={`${cta.location}-${cta.label}`}
                  label={cta.label}
                  message={cta.message}
                  location={cta.location}
                  page={ctx}
                  actionType={cta.tone === 'secondary' ? 'scroll' : 'wa'}
                  scrollTarget={cta.tone === 'secondary' ? 'brief-form' : undefined}
                  className={
                    cta.tone === 'secondary'
                      ? 'inline-flex items-center justify-center rounded-full border border-[#e6dac7] bg-white px-6 py-3 text-sm font-extrabold text-[#1f1f1d] transition hover:bg-[#fff8ee]'
                      : undefined
                  }
                />
              ))}
            </div>
          </header>

          <section className="grid gap-4 rounded-[28px] border border-[#eadfcf] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-8">
            <LabelBlock eyebrow="Quick Answer Box" title="Jawaban cepat" />
            <ul className="grid gap-3">
              {page.quickAnswers.map((answer) => (
                <li key={answer} className="rounded-2xl border border-[#f1e4d2] bg-[#fffdf8] p-4 text-[15px] leading-7 text-neutral-700">
                  {answer}
                </li>
              ))}
            </ul>
          </section>

          {page.table ? (
            <section className="rounded-[28px] border border-[#eadfcf] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-8">
              <LabelBlock eyebrow={page.table.eyebrow} title={page.table.title} />
              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-2xl border border-[#eadfcf]">
                  <thead>
                    <tr className="bg-[#fff3de] text-left text-sm font-black uppercase tracking-wider text-[#7a4b00]">
                      {page.table.headers.map((header) => (
                        <th key={header} className="border-b border-[#eadfcf] px-4 py-4">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {page.table.rows.map((row) => (
                      <tr key={row[0]} className="align-top even:bg-[#fffdf8]">
                        {row.map((cell, index) => (
                          <td
                            key={`${row[0]}-${index}`}
                            className={`border-b border-[#f1e4d2] px-4 py-4 text-sm leading-7 text-neutral-700 ${index === 0 ? 'font-semibold text-[#1f1f1d]' : ''}`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          <section className="rounded-[28px] border border-[#eadfcf] bg-[#111111] p-6 text-white shadow-[0_18px_50px_rgba(0,0,0,0.08)] sm:p-8">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#f8c26b]">{page.decisionBox.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">{page.decisionBox.title}</h2>
            {page.decisionBox.description ? (
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/75">{page.decisionBox.description}</p>
            ) : null}
            <ul className="mt-5 grid gap-3">
              {page.decisionBox.items.map((item) => (
                <li key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/80">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {page.checklist ? (
            <section className="grid gap-4 rounded-[28px] border border-[#eadfcf] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-8">
              <LabelBlock eyebrow={page.checklist.eyebrow} title={page.checklist.title} description={page.checklist.description} />
              <ul className="grid gap-3 md:grid-cols-2">
                {page.checklist.items.map((item) => (
                  <li key={item} className="rounded-2xl border border-[#f1e4d2] bg-[#fffdf8] p-4 text-sm leading-7 text-neutral-700">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="grid gap-5">
            {page.sections.map((section) => (
              <SectionCard key={section.title} title={section.title}>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets ? (
                  <ul className="grid gap-2">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="rounded-2xl border border-[#f1e4d2] bg-[#fffdf8] px-4 py-3">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </SectionCard>
            ))}
          </div>

          <CtaCluster page={page} {...page.contextualCta} />

          <section className="grid gap-4 rounded-[28px] border border-[#eadfcf] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-8">
            <LabelBlock
              eyebrow={page.relatedSection.eyebrow}
              title={page.relatedSection.title}
              description={page.relatedSection.description}
            />
            <div className="grid gap-4 md:grid-cols-2">
              {page.relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group rounded-[24px] border border-[#eadfcf] bg-[#fffaf1] p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b06f00]">{link.intent}</p>
                  <h3 className="mt-2 text-lg font-black tracking-tight text-[#1f1f1d]">{link.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{link.description}</p>
                  <span className="mt-4 inline-flex text-sm font-bold text-[#D98A00] transition group-hover:translate-x-1">
                    Buka halaman
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="grid gap-4 rounded-[28px] border border-[#eadfcf] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-8">
            <LabelBlock eyebrow="FAQ" title="Pertanyaan yang paling sering muncul" />
            <div className="grid gap-3">
              {page.faq.map((item) => (
                <details key={item.question} className="rounded-2xl border border-[#f1e4d2] bg-[#fffdf8] p-4">
                  <summary className="cursor-pointer list-none text-sm font-extrabold text-[#1f1f1d]">{item.question}</summary>
                  <p className="mt-3 text-sm leading-7 text-neutral-700">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-[#eadfcf] bg-[#111111] p-7 text-white shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-10">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#f8c26b]">{page.finalCta.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">{page.finalCta.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">{page.finalCta.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <PilotCtaButton
                label={page.finalCta.primaryLabel}
                message={page.finalCta.primaryMessage}
                location="final_cta_primary"
                page={ctx}
                className="inline-flex items-center justify-center rounded-full bg-[#D98A00] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#D98A00]/20 transition hover:translate-y-[-1px] hover:bg-[#c97e00]"
              />
              <PilotCtaButton
                label={page.finalCta.secondaryLabel}
                message={page.finalCta.secondaryMessage}
                location="final_cta_secondary"
                page={ctx}
                actionType="scroll"
                scrollTarget="brief-form"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-white/15"
              />
            </div>
          </section>
        </article>
      </section>

      <PilotStickyCta
        page={ctx}
        primaryLabel={page.stickyCta.primaryLabel}
        primaryMessage={page.stickyCta.primaryMessage}
        secondaryLabel={page.stickyCta.secondaryLabel}
        secondaryMessage={page.stickyCta.secondaryMessage}
        formHref="#brief-form"
      />
    </main>
  );
}
