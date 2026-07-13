"use client";

import { useEffect, useState } from "react";
import { getNextBusdev } from "@/lib/round-robin";
import { getFallbackBusdev } from "@/lib/round-robin-config";
import {
  buildLeadAssignmentKey,
  createLeadAssignmentRecord,
  getSessionLeadAssignment,
  type LeadAssignmentRecord,
  writeLeadAssignment,
} from "@/lib/lead-routing";

type UseLeadAssignmentOptions = {
  routeKey: string;
  source: string;
  ttlMs?: number;
  fetcher?: typeof getNextBusdev;
};

export function useLeadAssignment({
  routeKey,
  source,
  ttlMs,
  fetcher = getNextBusdev,
}: UseLeadAssignmentOptions) {
  const fallback = getFallbackBusdev(Date.now());
  const storageKey = buildLeadAssignmentKey(routeKey, source);

  const [assignment, setAssignment] = useState<LeadAssignmentRecord>(() =>
    createLeadAssignmentRecord(fallback, {
      source,
      routeKey,
      origin: "fallback",
    })
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cached = getSessionLeadAssignment(window.sessionStorage, storageKey, ttlMs);
    if (cached) {
      setAssignment(cached);
      return;
    }

    let cancelled = false;

    fetcher()
      .then((busdev) => {
        if (cancelled) return;

        const nextAssignment = createLeadAssignmentRecord(
          {
            id: busdev.busdev_id,
            phone: busdev.phone,
            name: busdev.name,
          },
          {
          source,
          routeKey,
          origin: "api",
          }
        );

        setAssignment(nextAssignment);
        writeLeadAssignment(window.sessionStorage, storageKey, nextAssignment);
      })
      .catch(() => {
        if (cancelled) return;

        const fallbackAssignment = createLeadAssignmentRecord(fallback, {
          source,
          routeKey,
          origin: "fallback",
        });

        setAssignment(fallbackAssignment);
        writeLeadAssignment(window.sessionStorage, storageKey, fallbackAssignment);
      });

    return () => {
      cancelled = true;
    };
  }, [fallback, fetcher, routeKey, source, storageKey, ttlMs]);

  return assignment;
}
