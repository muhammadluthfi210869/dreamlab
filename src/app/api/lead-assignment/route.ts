/**

 * src/app/api/lead-assignment/route.ts

 *

 * Endpoint tunggal yang dipanggil oleh useLeadAssignment() (client hook)

 * untuk menampilkan nomor CS di halaman thank you — dipakai bareng oleh

 * SEMUA 4 halaman (metaads, google ads, medsos, organic).

 *

 * PENTING #1: endpoint ini dan redirect route WA SAMA-SAMA memanggil

 * getOrAssignAgent() dari lead-assignment.ts. Karena cookie dicek duluan

 * di sana, memanggil endpoint ini untuk "preview" nomor TIDAK akan

 * menghabiskan slot rotasi ekstra saat user benar-benar klik tombol WA

 * setelahnya — keduanya akan dapat CS yang sama (dari cookie yang sama).

 *

 * PENTING #2: endpoint ini menerima query param ?campaignSource= dari

 * client SEMATA-MATA untuk ditampilkan balik ke layar ("Sumber: X").

 * Parameter ini TIDAK mempengaruhi CS mana yang dipilih — assignment

 * tetap dari satu pool gabungan yang sama.

 *

 * Nama field response sengaja dipisah biar tidak ambigu:

 * - assignmentMethod = cara CS ini didapat ('sticky' | 'rotation' | 'fallback')

 * - campaignSource   = dari halaman/campaign mana lead ini datang

 */

import { NextRequest, NextResponse } from 'next/server';

import { getOrAssignAgent } from '@/lib/lead-assignment';

export const dynamic = 'force-dynamic'; // jangan di-cache oleh Next.js/CDN

export async function GET(req: NextRequest) {

  const { agent, source: assignmentMethod } = await getOrAssignAgent();

  const campaignSource = req.nextUrl.searchParams.get('campaignSource');

  return NextResponse.json({

    phone: agent.phone,

    agentId: agent.id,

    assignmentMethod,

    campaignSource,

  });

}
