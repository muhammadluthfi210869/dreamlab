import type { Metadata } from 'next';
import PilotPageRenderer from '@/components/seo-pilot/PilotPageRenderer';
import { moqMaklonKosmetikMoneyPage } from '@/data/seo-pilot/batch-1';
import { buildPilotMetadata } from '@/lib/seo-pilot/metadata';

export const metadata: Metadata = buildPilotMetadata(moqMaklonKosmetikMoneyPage);

export default function Page() {
  return <PilotPageRenderer page={moqMaklonKosmetikMoneyPage} />;
}
