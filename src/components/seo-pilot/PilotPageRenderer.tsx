import Link from 'next/link';
import type { ReactNode } from 'react';
import JsonLd from '@/components/JsonLd';
import PilotAttribution from '@/components/seo-pilot/PilotAttribution';
import PilotBreadcrumbs from '@/components/seo-pilot/PilotBreadcrumbs';
import PilotCtaButton from '@/components/seo-pilot/PilotCtaButton';
import PilotLeadForm from '@/components/seo-pilot/PilotLeadForm';
import PilotStickyCta from '@/components/seo-pilot/PilotStickyCta';
import PilotTrackedLink from '@/components/seo-pilot/PilotTrackedLink';
import type { PilotPageData } from '@/data/seo-pilot/batch-1';
import { buildPilotSchemas } from '@/lib/seo-pilot/schema';

interface PilotPageRendererProps {
  page: PilotPageData;
}

function slugifyAnchor(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}

function pageContext(page: PilotPageData) {
  return {
    pageUrl: page.canonical,
    pageTitle: page.title,
    pageType: page.pageType,
    seoCluster: page.seoCluster,
    keywordTarget: page.keywordTarget,
  } as const;
}

function SectionCard({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 rounded-[28px] border border-[#eadfcf] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-8">
      <h2 className="text-2xl font-black tracking-tight text-[#1f1f1d]">{title}</h2>
      <div className="mt-4 space-y-4 text-[15px] leading-7 text-neutral-700">{children}</div>
    </section>
  );
}

function LabelBlock({ title, description }: { title: string; description?: string }) {
  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black tracking-tight text-[#1f1f1d]">{title}</h2>
      {description ? <p className="mt-3 text-sm leading-7 text-neutral-600">{description}</p> : null}
    </div>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-2xl border border-[#eadfcf]">
        <thead>
          <tr className="bg-[#fff3de] text-left text-sm font-black uppercase tracking-wider text-[#7a4b00]">
            {headers.map((header) => (
              <th key={header} className="border-b border-[#eadfcf] px-4 py-4">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
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
  );
}

function CtaCluster({
  page,
  title,
  description,
  primaryLabel,
  primaryMessage,
  secondaryLabel,
  secondaryMessage,
}: {
  page: PilotPageData;
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
      <LabelBlock title={title} description={description} />
      <div className="flex flex-wrap gap-3">
        <PilotCtaButton
          label={primaryLabel}
          message={primaryMessage}
          location="contextual_cta_primary"
          page={ctx}
          href="/thankyou/google/"
          actionType="link"
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
  const contentMap = [
    page.table ? { id: 'tabel-komponen-biaya', label: page.table.title } : null,
    { id: 'decision-box', label: page.decisionBox.title },
    page.checklist ? { id: 'checklist-sebelum-minta-estimasi', label: page.checklist.title } : null,
    ...page.sections
      .filter((section) => !section.title.startsWith('Skor Kesiapan Estimasi') && section.title !== page.table?.title)
      .map((section) => ({
        id: slugifyAnchor(section.title),
        label: section.title,
      })),
    { id: 'faq', label: 'FAQ' },
  ].filter(Boolean) as Array<{ id: string; label: string }>;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffdf8_0%,#fff8ef_100%)] text-[#1f1f1d]">
      <PilotAttribution page={ctx} />
      <JsonLd data={schema as never} />

      <section className="mx-auto max-w-6xl px-4 pb-28 pt-24 sm:px-6 lg:px-8">
        <PilotBreadcrumbs
          items={[
            { label: 'Home', href: '/' },
            {
              label: isArticle
                ? 'Panduan'
                : page.slug.includes('biaya') || page.slug.includes('moq') || page.slug.includes('estimasi')
                  ? 'Biaya & MOQ'
                  : 'Layanan',
              href: page.slug.includes('biaya') || page.slug.includes('moq') || page.slug.includes('estimasi')
                ? '/panduan/'
                : '/services/',
            },
            { label: page.title, href: page.slug },
          ]}
        />

        <article className="mt-5 space-y-6">
          <header className="rounded-[32px] border border-[#eadfcf] bg-[#fffaf1] p-7 text-center shadow-[0_24px_80px_rgba(0,0,0,0.05)] sm:p-10">
            <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-[#1f1f1d] sm:text-5xl">
              {page.heroHeadline}
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-neutral-600 sm:text-lg">
              {page.subheadline}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-neutral-500">
              <span className="rounded-full bg-white px-4 py-2 font-semibold text-[#4a4a48]">Last updated: {page.lastUpdated}</span>
              <span className="rounded-full bg-white px-4 py-2 font-semibold text-[#4a4a48]">{page.readingTime}</span>
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {page.heroCtas.map((cta) => (
                <PilotCtaButton
                  key={`${cta.location}-${cta.label}`}
                  label={cta.label}
                  message={cta.message}
                  location={cta.location}
                  page={ctx}
                  href={cta.href}
                  actionType={cta.tone === 'secondary' ? 'scroll' : 'link'}
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
            <LabelBlock title="Jawaban cepat" />
            <ul className="grid gap-3">
              {page.quickAnswers.map((answer) => (
                <li key={answer} className="rounded-2xl border border-[#f1e4d2] bg-[#fffdf8] p-4 text-[15px] leading-7 text-neutral-700">
                  {answer}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[28px] border border-[#eadfcf] bg-[#fffaf1] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-8">
            <LabelBlock title="Daftar isi" />
            <nav className="mt-5 rounded-[24px] border border-[#eadfcf] bg-white p-5">
              <ol className="grid gap-3 text-sm font-semibold text-[#4a4a48] md:grid-cols-2">
                {contentMap.map((item) => (
                  <li key={item.id}>
                    <Link href={`#${item.id}`} className="transition hover:text-[#D98A00]">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          </section>

          {page.table ? (
            <section id="tabel-komponen-biaya" className="scroll-mt-28 rounded-[28px] border border-[#eadfcf] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-8">
              <LabelBlock title={page.table.title} />
              <DataTable headers={page.table.headers} rows={page.table.rows} />
            </section>
          ) : null}

          <section id="decision-box" className="scroll-mt-28 rounded-[28px] border border-[#eadfcf] bg-[#FFF8EE] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-8">
            <h2 className="text-2xl font-black tracking-tight text-[#1f1f1d]">{page.decisionBox.title}</h2>
            {page.decisionBox.description ? (
              <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">{page.decisionBox.description}</p>
            ) : null}
            <ul className="mt-5 grid gap-3">
              {page.decisionBox.items.map((item) => (
                <li key={item} className="rounded-2xl border border-[#eadfcf] bg-white p-4 text-sm leading-7 text-neutral-700">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {page.checklist ? (
            <section id="checklist-sebelum-minta-estimasi" className="grid scroll-mt-28 gap-4 rounded-[28px] border border-[#eadfcf] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-8">
              <LabelBlock title={page.checklist.title} description={page.checklist.description} />
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
              <SectionCard key={section.title} id={slugifyAnchor(section.title)} title={section.title}>
                {section.body.map((paragraph) => (
                  <p key={paragraph} dangerouslySetInnerHTML={{ __html: paragraph }} />
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
                {section.table ? <DataTable headers={section.table.headers} rows={section.table.rows} /> : null}
              </SectionCard>
            ))}
          </div>

          <div id="contextual-cta" className="scroll-mt-28">
            <CtaCluster page={page} {...page.contextualCta} />
          </div>

          <section id="related-links" className="grid scroll-mt-28 gap-4 rounded-[28px] border border-[#eadfcf] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-8">
            <LabelBlock title={page.relatedSection.title} description={page.relatedSection.description} />
            <div className="grid gap-4 md:grid-cols-2">
              {page.relatedLinks.map((link, index) => (
                <PilotTrackedLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  location={`related_link_${index + 1}`}
                  page={ctx}
                  className="group rounded-[24px] border border-[#eadfcf] bg-[#fffaf1] p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <h3 className="text-lg font-black tracking-tight text-[#1f1f1d]">{link.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{link.description}</p>
                  <span className="mt-4 inline-flex text-sm font-bold text-[#D98A00] transition group-hover:translate-x-1">
                    Buka halaman
                  </span>
                </PilotTrackedLink>
              ))}
            </div>
          </section>

          <section id="faq" className="grid scroll-mt-28 gap-4 rounded-[28px] border border-[#eadfcf] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-8">
            <LabelBlock title="FAQ" />
            <div className="grid gap-3">
              {page.faq.map((item) => (
                <details key={item.question} className="rounded-2xl border border-[#f1e4d2] bg-[#fffdf8] p-4">
                  <summary className="cursor-pointer list-none text-sm font-extrabold text-[#1f1f1d]">{item.question}</summary>
                  <p className="mt-3 text-sm leading-7 text-neutral-700" dangerouslySetInnerHTML={{ __html: item.answer }} />
                </details>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-[#eadfcf] bg-[#FFF8EE] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.04)] sm:p-10">
            <h2 className="text-3xl font-black tracking-tight text-[#1f1f1d]">{page.finalCta.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600">{page.finalCta.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <PilotCtaButton
                label={page.finalCta.primaryLabel}
                message={page.finalCta.primaryMessage}
                location="final_cta_primary"
                page={ctx}
                href="/thankyou/google/"
                actionType="link"
                className="inline-flex items-center justify-center rounded-full bg-[#D98A00] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#D98A00]/20 transition hover:translate-y-[-1px] hover:bg-[#c97e00]"
              />
              <PilotCtaButton
                label={page.finalCta.secondaryLabel}
                message={page.finalCta.secondaryMessage}
                location="final_cta_secondary"
                page={ctx}
                actionType="scroll"
                scrollTarget="brief-form"
                className="inline-flex items-center justify-center rounded-full border border-[#e6dac7] bg-white px-6 py-3 text-sm font-extrabold text-[#1f1f1d] transition hover:bg-[#fff8ee]"
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
        primaryHref="/thankyou/google/"
      />
    </main>
  );
}
