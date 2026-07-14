/**

 * src/lib/message-templates.ts

 *

 * Satu tempat untuk semua template pesan WA berdasarkan source/campaign.

 * Dipakai bareng oleh SEMUA 4 halaman thank you (metaads, google ads,

 * medsos, organic) supaya tidak ada logic pesan yang terduplikasi /

 * berbeda-beda tiap file redirect route.

 *

 * Kalau nanti ada campaign/source baru, cukup tambah entry di sini —

 * tidak perlu sentuh file redirect route manapun.

 */

const MESSAGES: Record<string, string> = {

  // Sumber per halaman (default kalau tidak ada query param ?source=)

  direct: 'Halo, saya tertarik dengan jasa maklon Dreamlab.',

  'google-ads': 'Halo, saya tertarik dengan jasa maklon Dreamlab dari iklan Google.',

  medsos: 'Halo, saya tertarik dengan jasa maklon Dreamlab dari media sosial.',

  organic: 'Halo, saya tertarik dengan jasa maklon Dreamlab.',

  // Varian khusus Meta Ads (dari query param ?source=meta-parfum, dst)

  'meta-parfum': 'Halo, saya tertarik dengan jasa maklon parfum Dreamlab.',

  'meta-skincare': 'Halo, saya tertarik dengan jasa maklon skincare Dreamlab.',

  'meta-haircare': 'Halo, saya tertarik dengan jasa maklon haircare Dreamlab.',

};

const DEFAULT_MESSAGE = 'Halo, saya tertarik dengan jasa maklon Dreamlab.';

export function buildMessageForSource(source: string | null | undefined): string {

  if (!source) return DEFAULT_MESSAGE;

  return MESSAGES[source] ?? DEFAULT_MESSAGE;

}
