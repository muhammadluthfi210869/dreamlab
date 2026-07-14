/**

 * src/hooks/useLeadAssignment.ts

 *

 * Hook client-side yang dipakai <ThankYouRoundRobin> di SEMUA 4 halaman

 * untuk menampilkan nomor CS aktif di layar. Cuma manggil

 * /api/lead-assignment (satu-satunya sumber kebenaran). Cache

 * sessionStorage tetap dipakai supaya tidak fetch berulang kali kalau

 * komponen re-render.

 *

 * Hook ini membaca ?source= dari URL halaman saat ini, dan mengirimkannya

 * ke API sebagai ?campaignSource= SEMATA-MATA supaya teks "Sumber: X" di

 * layar tetap benar. Ini TIDAK mempengaruhi CS mana yang dipilih.

 */

'use client';

import { useEffect, useState } from 'react';

const CACHE_KEY_PREFIX = 'dreamlab_lead_assignment';

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 menit

interface LeadAssignmentState {

  phone: string | null;

  agentId: string | null;

  campaignSource: string | null;

  loading: boolean;

  assignmentMethod: 'sticky' | 'rotation' | 'fallback' | 'cache' | null;

}

function getCampaignSourceFromUrl(defaultSource: string): string {

  if (typeof window === 'undefined') return defaultSource;

  const params = new URLSearchParams(window.location.search);

  return params.get('source') ?? defaultSource;

}

/**

 * @param defaultSource - source default untuk halaman ini kalau tidak ada

 *   ?source= di URL.

 */

export function useLeadAssignment(defaultSource: string = 'direct'): LeadAssignmentState {

  const [state, setState] = useState<LeadAssignmentState>({

    phone: null,

    agentId: null,

    campaignSource: null,

    loading: true,

    assignmentMethod: null,

  });

  useEffect(() => {

    const campaignSource = getCampaignSourceFromUrl(defaultSource);

    const cacheKey = `${CACHE_KEY_PREFIX}:${campaignSource}`;

    const cachedRaw = sessionStorage.getItem(cacheKey);

    if (cachedRaw) {

      try {

        const cached = JSON.parse(cachedRaw);

        if (Date.now() - cached.ts < CACHE_TTL_MS) {

          setState({

            phone: cached.phone,

            agentId: cached.agentId,

            campaignSource: cached.campaignSource,

            loading: false,

            assignmentMethod: 'cache',

          });

          return;

        }

      } catch {

      }

    }

    let cancelled = false;

    fetch(`/api/lead-assignment?campaignSource=${encodeURIComponent(campaignSource)}`)

      .then((res) => res.json())

      .then((data) => {

        if (cancelled) return;

        sessionStorage.setItem(

          cacheKey,

          JSON.stringify({

            phone: data.phone,

            agentId: data.agentId,

            campaignSource: data.campaignSource,

            ts: Date.now(),

          })

        );

        setState({

          phone: data.phone,

          agentId: data.agentId,

          campaignSource: data.campaignSource,

          loading: false,

          assignmentMethod: data.assignmentMethod,

        });

      })

      .catch((err) => {

        console.error('[useLeadAssignment] fetch gagal:', err);

        if (!cancelled) setState((s) => ({ ...s, loading: false }));

      });

    return () => {

      cancelled = true;

    };

  }, [defaultSource]);

  return state;

}
