"use client";

import { useEffect } from 'react';
import { persistPilotAttribution } from '@/lib/seo-pilot/tracking';

export default function PilotAttribution() {
  useEffect(() => {
    persistPilotAttribution();
  }, []);

  return null;
}
