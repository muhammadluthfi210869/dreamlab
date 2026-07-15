const KOMMO_SUBDOMAIN = process.env.KOMMO_SUBDOMAIN!;
const KOMMO_API_TOKEN = process.env.KOMMO_API_TOKEN!;

function getBaseUrl(): string {
  return `https://${KOMMO_SUBDOMAIN}.kommo.com/api/v4`;
}

export async function getLeadCountForPipeline(
  pipelineId: number,
  dateFromUnix: number,
  dateToUnix: number
): Promise<number> {
  let total = 0;
  let page = 1;
  const limit = 250;

  while (true) {
    const url = new URL(`${getBaseUrl()}/leads`);
    url.searchParams.set('filter[pipeline_id]', String(pipelineId));
    url.searchParams.set('filter[created_at][from]', String(dateFromUnix));
    url.searchParams.set('filter[created_at][to]', String(dateToUnix));
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', String(limit));

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${KOMMO_API_TOKEN}`,
      },
      cache: 'no-store',
    });

    if (res.status === 204) {
      break;
    }

    if (!res.ok) {
      throw new Error(`Kommo API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const leads = data?._embedded?.leads ?? [];
    total += leads.length;

    if (leads.length < limit) {
      break;
    }
    page++;

    if (page > 200) {
      console.error('[kommo-client] Pagination melebihi 200 halaman, dihentikan paksa.');
      break;
    }
  }

  return total;
}

export interface PipelineMapping {
  agentId: string;
  agentName: string;
  pipelineId: number;
}

export const KOMMO_PIPELINE_MAPPING: PipelineMapping[] = [
  { agentId: 'cs1', agentName: 'Jessica', pipelineId: 14079143 },
  { agentId: 'cs2', agentName: 'Annisa', pipelineId: 11175859 },
  { agentId: 'cs3', agentName: 'Ami', pipelineId: 13616255 },
];

export async function getAllPipelineLeadCounts(
  dateFromUnix: number,
  dateToUnix: number
): Promise<Record<string, number>> {
  const results: Record<string, number> = {};

  for (const mapping of KOMMO_PIPELINE_MAPPING) {
    try {
      results[mapping.agentId] = await getLeadCountForPipeline(
        mapping.pipelineId,
        dateFromUnix,
        dateToUnix
      );
    } catch (err) {
      console.error(`[kommo-client] Gagal ambil data pipeline ${mapping.agentName}:`, err);
      results[mapping.agentId] = -1;
    }
  }

  return results;
}
