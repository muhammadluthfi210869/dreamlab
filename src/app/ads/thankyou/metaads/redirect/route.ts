import { NextResponse } from 'next/server';
import { getConfiguredBusdevs, getFallbackBusdev, resolveRoundRobinIndex } from '@/lib/round-robin-config';
import { getServiceClient } from '@/lib/supabase-server';

const WA_MESSAGE = "Halo Dreamlab, saya lihat iklan di meta ads dan ingin konsultasi buat brand saya. Bisa dibantu?";

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

    const pool = getConfiguredBusdevs(busdevs ?? []);
    const phone = pool[resolveRoundRobinIndex(index, pool.length)].phone;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(WA_MESSAGE)}`;

    return NextResponse.redirect(url, {
      status: 302,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Round robin redirect error:', error);
    const fallback = getFallbackBusdev(Date.now());
    const url = `https://wa.me/${fallback.phone}?text=${encodeURIComponent(WA_MESSAGE)}`;

    return NextResponse.redirect(url, {
      status: 302,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }
}
