import { NextResponse } from 'next/server';
import { getConfiguredBusdevs, getFallbackBusdev, resolveRoundRobinIndex } from '@/lib/round-robin-config';
import { getServiceClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = getServiceClient();

    const { data: index, error: rpcError } = await supabase
      .rpc('increment_rr_counter');

    if (rpcError) throw rpcError;

    const { data: busdevs, error: queryError } = await supabase
      .from('busdevs')
      .select('id, phone, name')
      .eq('is_active', true)
      .order('id', { ascending: true });

    if (queryError) throw queryError;

    const pool = getConfiguredBusdevs(busdevs ?? []);
    const assigned = pool[resolveRoundRobinIndex(index, pool.length)];

    return NextResponse.json({
      phone: assigned.phone,
      busdev_id: assigned.id,
      name: assigned.name,
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Round robin error:', error);
    const fallback = getFallbackBusdev(Date.now());

    return NextResponse.json({
      phone: fallback.phone,
      busdev_id: fallback.id,
      name: fallback.name,
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }
}
