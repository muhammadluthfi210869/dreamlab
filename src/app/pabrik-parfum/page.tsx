import type { Metadata } from 'next';
import PilotPageRenderer from '@/components/seo-pilot/PilotPageRenderer';
import { pabrikParfumMoneyPage } from '@/data/seo-pilot/batch-2';
import { buildPilotMetadata } from '@/lib/seo-pilot/metadata';

export const metadata: Metadata = buildPilotMetadata(pabrikParfumMoneyPage);

export default function Page() {
  return <PilotPageRenderer page={pabrikParfumMoneyPage} />;
}
