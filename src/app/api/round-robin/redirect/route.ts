import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase-server';

const WA_MSG = "Halo Dreamlab, saya ingin konsultasi maklon. Bisa dibantu?";

export async function GET() {
  try {
    const supabase = getServiceClient();

    const { data: index, error: rpcError } = await supabase
      .rpc('increment_rr_counter');

    if (rpcError) throw rpcError;

    const { data: busdevs, error: queryError } = await supabase
      .from('busdevs')
      .select('phone')
      .eq('is_active', true)
      .order('id', { ascending: true });

    if (queryError) throw queryError;
    if (!busdevs || busdevs.length === 0) {
      return NextResponse.json({ error: 'No active busdevs' }, { status: 500 });
    }

    const phone = busdevs[index].phone;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(WA_MSG)}`;

    return NextResponse.redirect(url, { status: 302 });
  } catch (error) {
    console.error('Round robin redirect error:', error);
    return NextResponse.json({ error: 'Failed to redirect' }, { status: 500 });
  }
}
