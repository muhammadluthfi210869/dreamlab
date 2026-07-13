import type { Metadata } from 'next';
import PilotPageRenderer from '@/components/seo-pilot/PilotPageRenderer';
import { estimasiBiayaMaklonMoneyPage } from '@/data/seo-pilot/batch-2';
import { buildPilotMetadata } from '@/lib/seo-pilot/metadata';

export const metadata: Metadata = buildPilotMetadata(estimasiBiayaMaklonMoneyPage);

export default function Page() {
  return <PilotPageRenderer page={estimasiBiayaMaklonMoneyPage} />;
}
