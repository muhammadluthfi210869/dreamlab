import type { Metadata } from 'next';
import PilotPageRenderer from '@/components/seo-pilot/PilotPageRenderer';
import { biayaMaklonSkincareMoneyPage } from '@/data/seo-pilot/batch-1';
import { buildPilotMetadata } from '@/lib/seo-pilot/metadata';

export const metadata: Metadata = buildPilotMetadata(biayaMaklonSkincareMoneyPage);

export default function Page() {
  return <PilotPageRenderer page={biayaMaklonSkincareMoneyPage} />;
}
