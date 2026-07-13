import type { Metadata } from 'next';
import PilotPageRenderer from '@/components/seo-pilot/PilotPageRenderer';
import { jasaMaklonKosmetikMoneyPage } from '@/data/seo-pilot/batch-2';
import { buildPilotMetadata } from '@/lib/seo-pilot/metadata';

export const metadata: Metadata = buildPilotMetadata(jasaMaklonKosmetikMoneyPage);

export default function Page() {
  return <PilotPageRenderer page={jasaMaklonKosmetikMoneyPage} />;
}
