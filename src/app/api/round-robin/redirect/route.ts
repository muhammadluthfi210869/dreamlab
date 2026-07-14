import { NextResponse } from 'next/server';
import { getOrAssignAgent } from '@/lib/lead-assignment';
import { buildWhatsAppUrl } from '@/lib/lead-routing';

export const dynamic = 'force-dynamic';

const WA_MSG = "Halo Dreamlab, saya ingin konsultasi maklon. Bisa dibantu?";

export async function GET() {
  try {
    const { agent } = await getOrAssignAgent();
    const url = buildWhatsAppUrl(agent.phone, WA_MSG);
    return NextResponse.redirect(url, {
      status: 302,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('Round robin redirect error:', error);
    return NextResponse.json({ error: 'Redirect failed' }, { status: 500 });
  }
}
