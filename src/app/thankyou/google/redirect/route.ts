/**

 * src/app/thankyou/google/redirect/route.ts

 *

 * Redirect WA untuk halaman thank you organic (bukan under /ads/).

 * Manggil getOrAssignAgent() yang SAMA (satu pool gabungan). Default source: 'organic'.

 */

import { NextRequest, NextResponse } from 'next/server';

import { getOrAssignAgent } from '@/lib/lead-assignment';

import { buildWhatsAppUrl } from '@/lib/lead-routing';

import { buildMessageForSource } from '@/lib/message-templates';

export const dynamic = 'force-dynamic';

const DEFAULT_SOURCE = 'organic';

export async function GET(req: NextRequest) {

  const { agent } = await getOrAssignAgent();

  const source = req.nextUrl.searchParams.get('source') ?? DEFAULT_SOURCE;

  const message = buildMessageForSource(source);

  const waUrl = buildWhatsAppUrl(agent.phone, message);

  return NextResponse.redirect(waUrl);

}
