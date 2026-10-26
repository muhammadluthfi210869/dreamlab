import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const inquiryReference = body.inquiryReference || body.reference;

    if (inquiryReference && typeof inquiryReference === 'string') {
      await pool.query(
        `UPDATE leads 
         SET wa_clicked_at = NOW() 
         WHERE inquiry_reference = $1 OR tracking_code = $1`,
        [inquiryReference.trim()]
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[WA Click Route] Error logging WhatsApp click:', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
