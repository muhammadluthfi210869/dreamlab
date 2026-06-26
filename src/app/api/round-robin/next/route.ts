import { NextResponse } from 'next/server';
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

    if (!busdevs || busdevs.length === 0) {
      return NextResponse.json(
        { error: 'No active busdevs' },
        { status: 500 }
      );
    }

    const assigned = busdevs[index];

    return NextResponse.json({
      phone: assigned.phone,
      busdev_id: assigned.id,
      name: assigned.name,
    });
  } catch (error) {
    console.error('Round robin error:', error);
    return NextResponse.json(
      { error: 'Failed to assign busdev' },
      { status: 500 }
    );
  }
}
