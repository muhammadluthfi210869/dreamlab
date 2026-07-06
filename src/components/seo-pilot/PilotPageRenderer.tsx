import Link from 'next/link';
import type { ReactNode } from 'react';
import JsonLd from '@/components/JsonLd';
import PilotBreadcrumbs from '@/components/seo-pilot/PilotBreadcrumbs';
import PilotCtaButton from '@/components/seo-pilot/PilotCtaButton';
import PilotLeadForm from '@/components/seo-pilot/PilotLeadForm';
import PilotAttribution from '@/components/seo-pilot/PilotAttribution';
import PilotStickyCta from '@/components/seo-pilot/PilotStickyCta';
import { buildPilotSchemas } from '@/lib/seo-pilot/schema';
import type { PilotPageData } from '@/data/seo-pilot/batch-1';

interface PilotPageRendererProps {
  page: PilotPageData;
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[28px] border border-[#eadfcf] bg-white p-6 sm:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
      <h2 className="text-2xl font-black tracking-tight text-[#1f1f1d]">{title}</h2>
      <div className="mt-4 space-y-4 text-[15px] leading-7 text-neutral-700">{children}</div>
    </section>
  );
}

export default function PilotPageRenderer({ page }: PilotPageRendererProps) {
  const schema = buildPilotSchemas(page);
  const isArticle = page.pageType === 'pilot_article';

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffdf8_0%,#fff8ef_100%)] text-[#1f1f1d]">
      <PilotAttribution />
      <JsonLd data={schema as any} />

      <section className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <PilotBreadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: isArticle ? 'Panduan' : 'Biaya & MOQ', href: isArticle ? '/panduan/' : '/' },
            { label: page.title, href: page.slug },
          ]}
        />

        <article className="mt-5 space-y-6">
          <header className="rounded-[32px] border border-[#eadfcf] bg-[#fffaf1] p-7 sm:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.05)]">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">SEO Pilot Dreamlab</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-[#1f1f1d] sm:text-5xl">
              {page.heroHeadline}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600 sm:text-lg">
              {page.subheadline}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
              <span className="rounded-full bg-white px-4 py-2 font-semibold text-[#4a4a48]">Last updated: {page.lastUpdated}</span>
              <span className="rounded-full bg-white px-4 py-2 font-semibold text-[#4a4a48]">{page.readingTime}</span>
              <span className="rounded-full bg-white px-4 py-2 font-semibold text-[#4a4a48]">{page.pageType === 'pilot_article' ? 'Pilot Article' : 'Money Page'}</span>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {page.primaryCtas.map((cta) => (
                <PilotCtaButton
                  key={`${cta.location}-${cta.label}`}
                  label={cta.label}
                  message={cta.message}
                  location={cta.location}
                  page={{
                    pageUrl: page.canonical,
                    pageTitle: page.metaTitle,
                    pageType: page.pageType,
                    seoCluster: page.seoCluster,
                    keywordTarget: page.keywordTarget,
                  }}
                />
              ))}
            </div>
          </header>

          <section className="grid gap-4 rounded-[28px] border border-[#eadfcf] bg-white p-6 sm:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">Quick Answer Box</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">Jawaban cepat</h2>
            </div>
            <ul className="grid gap-3">
              {page.quickAnswers.map((answer) => (
                <li key={answer} className="rounded-2xl border border-[#f1e4d2] bg-[#fffdf8] p-4 text-[15px] leading-7 text-neutral-700">
                  {answer}
                </li>
              ))}
            </ul>
          </section>

          {page.table && (
            <section className="rounded-[28px] border border-[#eadfcf] bg-white p-6 sm:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">Tabel komponen biaya</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">Breakdown komponen biaya</h2>
              </div>
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
                          <td key={cell} className={`border-b border-[#f1e4d2] px-4 py-4 text-sm leading-7 text-neutral-700 ${index === 0 ? 'font-semibold text-[#1f1f1d]' : ''}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className="rounded-[28px] border border-[#eadfcf] bg-[#111111] p-6 sm:p-8 text-white shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#f8c26b]">Decision Box</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">Ringkasan keputusan</h2>
            <ul className="mt-5 grid gap-3">
              {page.decisionBox.map((item) => (
                <li key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/80">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <div className="grid gap-5">
            {page.sections.map((section) => (
              <SectionCard key={section.title} title={section.title}>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul className="grid gap-2">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="rounded-2xl border border-[#f1e4d2] bg-[#fffdf8] px-4 py-3">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </SectionCard>
            ))}
          </div>

          <section className="grid gap-6 rounded-[28px] border border-[#eadfcf] bg-[#fffaf1] p-6 sm:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
            <div className="max-w-2xl">
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">Contextual CTA</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">Siap validasi budget dan scope?</h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600">
                Gunakan CTA berikut untuk cek estimasi atau kirim brief agar tim bisa bantu menyusun arah budget yang lebih realistis.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <PilotCtaButton
                label="Cek Estimasi Biaya Produkmu"
                message="Halo Dreamlab, saya ingin cek estimasi biaya produk skincare saya."
                location="contextual_cta"
                page={{
                  pageUrl: page.canonical,
                  pageTitle: page.metaTitle,
                  pageType: page.pageType,
                  seoCluster: page.seoCluster,
                  keywordTarget: page.keywordTarget,
                }}
              />
              <PilotCtaButton
                label="Kirim Brief Produk"
                message="Halo Dreamlab, saya ingin kirim brief produk untuk dibantu breakdown biayanya."
                location="contextual_cta"
                page={{
                  pageUrl: page.canonical,
                  pageTitle: page.metaTitle,
                  pageType: page.pageType,
                  seoCluster: page.seoCluster,
                  keywordTarget: page.keywordTarget,
                }}
                actionType="scroll"
                scrollTarget="brief-form"
                className="inline-flex items-center justify-center rounded-full border border-[#e6dac7] bg-white px-6 py-3 text-sm font-extrabold text-[#1f1f1d] transition hover:bg-[#fff8ee]"
              />
            </div>

            <PilotLeadForm
              page={{
                pageUrl: page.canonical,
                pageTitle: page.metaTitle,
                pageType: page.pageType,
                seoCluster: page.seoCluster,
                keywordTarget: page.keywordTarget,
              }}
              title={page.leadForm?.title || 'Kirim Brief Produk'}
              description={page.leadForm?.description || 'Isi kebutuhan produkmu agar tim bisa bantu mengerucutkan scope.'}
              submitLabel="Kirim Brief Produk"
            />
          </section>

          <section className="grid gap-4 rounded-[28px] border border-[#eadfcf] bg-white p-6 sm:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">Related Money Page Card</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">Halaman conversion yang relevan</h2>
            </div>
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

          <section className="grid gap-4 rounded-[28px] border border-[#eadfcf] bg-white p-6 sm:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b06f00]">FAQ</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">Pertanyaan yang paling sering muncul</h2>
            </div>
            <div className="grid gap-3">
              {page.faq.map((item) => (
                <details key={item.question} className="rounded-2xl border border-[#f1e4d2] bg-[#fffdf8] p-4">
                  <summary className="cursor-pointer list-none text-sm font-extrabold text-[#1f1f1d]">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-neutral-700">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-[#eadfcf] bg-[#111111] p-7 sm:p-10 text-white shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#f8c26b]">Final CTA</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">Lanjutkan ke langkah berikutnya</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">
              Kalau kamu sudah siap mengerucutkan scope, kirim brief atau cek estimasi supaya tim bisa bantu jawab lebih cepat.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <PilotCtaButton
                label="Cek Estimasi Biaya Produkmu"
                message="Halo Dreamlab, saya ingin cek estimasi biaya produk skincare saya."
                location="final_cta"
                page={{
                  pageUrl: page.canonical,
                  pageTitle: page.metaTitle,
                  pageType: page.pageType,
                  seoCluster: page.seoCluster,
                  keywordTarget: page.keywordTarget,
                }}
                className="inline-flex items-center justify-center rounded-full bg-[#D98A00] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#D98A00]/20 transition hover:translate-y-[-1px] hover:bg-[#c97e00]"
              />
              <PilotCtaButton
                label="Kirim Brief Produk"
                message="Halo Dreamlab, saya ingin kirim brief produk untuk dibantu breakdown biayanya."
                location="final_cta"
                page={{
                  pageUrl: page.canonical,
                  pageTitle: page.metaTitle,
                  pageType: page.pageType,
                  seoCluster: page.seoCluster,
                  keywordTarget: page.keywordTarget,
                }}
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-white/15"
              />
            </div>
          </section>
        </article>
      </section>

      <PilotStickyCta
        page={{
          pageUrl: page.canonical,
          pageTitle: page.metaTitle,
          pageType: page.pageType,
          seoCluster: page.seoCluster,
          keywordTarget: page.keywordTarget,
        }}
        primaryLabel="Cek Estimasi Biaya Produkmu"
        primaryMessage="Halo Dreamlab, saya ingin cek estimasi biaya produk skincare saya."
        formHref="#brief-form"
      />
    </main>
  );
}
