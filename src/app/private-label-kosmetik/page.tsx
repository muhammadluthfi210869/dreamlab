import type { Metadata } from 'next';
import PilotPageRenderer from '@/components/seo-pilot/PilotPageRenderer';
import { privateLabelKosmetikMoneyPage } from '@/data/seo-pilot/batch-2';
import { buildPilotMetadata } from '@/lib/seo-pilot/metadata';

export const metadata: Metadata = buildPilotMetadata(privateLabelKosmetikMoneyPage);

export default function Page() {
  return <PilotPageRenderer page={privateLabelKosmetikMoneyPage} />;
}
