import { NextRequest, NextResponse } from 'next/server';
import { getAgentLeadCounts } from '@/lib/roundRobin';
import { getAllPipelineLeadCounts, KOMMO_PIPELINE_MAPPING } from '@/lib/kommo-client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const days = Number(req.nextUrl.searchParams.get('days') ?? '30');
  const dateTo = Math.floor(Date.now() / 1000);
  const dateFrom = dateTo - days * 24 * 60 * 60;

  const [internalCounts, kommoCounts] = await Promise.all([
    getAgentLeadCounts(),
    getAllPipelineLeadCounts(dateFrom, dateTo),
  ]);

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

  const rataRataKecocokan =
    comparison.filter((c) => c.kecocokanPersen !== null).reduce((sum, c) => sum + (c.kecocokanPersen ?? 0), 0) /
    (comparison.filter((c) => c.kecocokanPersen !== null).length || 1);

  const kesimpulan =
    rataRataKecocokan >= 90
      ? 'Data internal dan Kommo SANGAT COCOK — round-robin terbukti akurat.'
      : rataRataKecocokan >= 75
      ? 'Data internal dan Kommo CUKUP COCOK — selisih wajar (kemungkinan ada lead yang tidak lanjut chat, atau lead dari sumber lain di Kommo).'
      : 'Data internal dan Kommo SELISIH CUKUP BESAR — perlu ditelusuri lebih lanjut, kemungkinan ada lead di luar sistem round-robin atau masalah mapping pipeline.';

  return NextResponse.json({
    rentangHari: days,
    dibandingkanPada: new Date().toISOString(),
    ringkasan: {
      rataRataKecocokanPersen: Math.round(rataRataKecocokan * 10) / 10,
      kesimpulan,
    },
    distribusiPersentase: distribusi,
    comparison,
  });
}
