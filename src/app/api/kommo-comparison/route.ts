import { NextRequest, NextResponse } from 'next/server';
import { getDbLeadStats } from '@/lib/round-robin-db';
import { getAllPipelineLeadCounts, KOMMO_PIPELINE_MAPPING } from '@/lib/kommo-client';
import { isInternalRequestAuthorized } from '@/lib/internal-auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/kommo-comparison
 * Bandingkan jumlah lead internal (PostgreSQL) vs lead di pipeline Kommo.
 * CATATAN: mapping pipeline (Jessica/Annisa/Ami) harus diverifikasi tim —
 * hanya 3 pipeline yang terdaftar; 4 CS baru (Bu Irma dkk) belum ada.
 */
export async function GET(req: NextRequest) {
  if (!isInternalRequestAuthorized(req)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }

  const days = Number(req.nextUrl.searchParams.get('days') ?? '30');
  const dateTo = Math.floor(Date.now() / 1000);
  const dateFrom = dateTo - days * 24 * 60 * 60;

  const [stats, kommoCounts] = await Promise.all([
    getDbLeadStats(),
    getAllPipelineLeadCounts(dateFrom, dateTo),
  ]);

  const internalCounts = stats.countsByAgentId;

  const comparison = KOMMO_PIPELINE_MAPPING.map((mapping) => {
    const internal = internalCounts[mapping.agentId] ?? 0;
    const kommo = kommoCounts[mapping.agentId] ?? 0;
    const selisih = kommo >= 0 ? internal - kommo : null;
    const kecocokanPersen =
      kommo >= 0 && internal > 0
        ? Math.round((1 - Math.abs(internal - kommo) / Math.max(internal, kommo, 1)) * 1000) / 10
        : null;

    return {
      agentId: mapping.agentId,
      agentName: mapping.agentName,
      internalCount: internal,
      kommoCount: kommo === -1 ? null : kommo,
      selisih,
      kecocokanPersen,
      catatan: kommo === -1 ? 'Gagal ambil data dari Kommo, cek log server' : undefined,
    };
  });

  const totalInternal = comparison.reduce((sum, c) => sum + c.internalCount, 0);
  const totalKommo = comparison.reduce((sum, c) => sum + (c.kommoCount ?? 0), 0);

  const distribusi = comparison.map((c) => ({
    agentName: c.agentName,
    persenInternal: totalInternal > 0 ? Math.round((c.internalCount / totalInternal) * 1000) / 10 : 0,
    persenKommo:
      totalKommo > 0 && c.kommoCount !== null ? Math.round((c.kommoCount / totalKommo) * 1000) / 10 : null,
  }));

  const rataRataKecocokan = (() => {
    const vals: number[] = comparison
      .filter((c) => c.kecocokanPersen !== null)
      .map((c) => c.kecocokanPersen as number);
    if (vals.length === 0) return null;
    const sum = vals.reduce((acc, v) => acc + v, 0);
    return Math.round((sum / vals.length) * 10) / 10;
  })();

  const kesimpulan =
    rataRataKecocokan === null
      ? 'Belum ada data pembanding.'
      : rataRataKecocokan >= 90
      ? 'Data internal dan Kommo SANGAT COCOK — round-robin terbukti akurat.'
      : rataRataKecocokan >= 70
      ? 'Data internal dan Kommo CUKUP COCOK — selisih wajar (kemungkinan ada lead yang tidak lanjut chat, atau lead dari sumber lain di Kommo).'
      : 'Data internal dan Kommo SELISIH CUKUP BESAR — perlu ditelusuri lebih lanjut, kemungkinan ada lead di luar sistem round-robin atau masalah mapping pipeline.';

  return NextResponse.json(
    {
      days,
      totalInternal,
      totalKommo,
      rataRataKecocokan,
      kesimpulan,
      comparison,
      distribusi,
      catatan:
        'Internal count dari PostgreSQL (tabel leads). Mapping pipeline Kommo hanya 3 CS (Jessica/Annisa/Ami) — verifikasi dengan tim.',
    },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}
