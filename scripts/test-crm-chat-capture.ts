/**
 * Uji penangkap pesan chat (murni):  npx tsx scripts/test-crm-chat-capture.ts
 */
import assert from 'node:assert/strict';
import { chatDisplayText, extractMetaText, isNonChatType, normalizeChatPhone, recordChatMessage } from '../src/lib/crm-chat-capture';

let n = 0;
const t = (name: string, fn: () => void | Promise<void>) => Promise.resolve(fn()).then(() => { n++; console.log(`ok  ${name}`); });

async function main() {
  await t('teks biasa disimpan apa adanya', () => {
    assert.equal(chatDisplayText('  halo kak  ', 'text'), 'halo kak');
    assert.deepEqual(extractMetaText({ type: 'text', text: { body: 'Halo' } }), { text: 'Halo', type: 'text' });
  });
  await t('balasan lead berupa gambar/suara/dokumen tanpa teks tetap tampil dengan penanda', () => {
    assert.equal(chatDisplayText(null, 'image'), '[Gambar]');
    assert.equal(chatDisplayText('', 'audio'), '[Pesan suara]');
    assert.equal(chatDisplayText(undefined, 'document'), '[Dokumen]');
    assert.equal(chatDisplayText(null, 'sticker'), '[Stiker]');
    assert.equal(chatDisplayText(null, 'location'), '[Lokasi]');
    assert.equal(chatDisplayText(null, 'aneh'), '[aneh]');
  });
  await t('gambar BERTEKS: teks (caption) yang dipakai', () => {
    assert.deepEqual(extractMetaText({ type: 'image', image: { caption: 'foto produk' } }), { text: 'foto produk', type: 'image' });
    assert.equal(chatDisplayText('foto produk', 'image'), 'foto produk');
  });
  await t('tombol & daftar interaktif terbaca', () => {
    assert.equal(extractMetaText({ type: 'button', button: { text: 'Ya' } }).text, 'Ya');
    assert.equal(extractMetaText({ type: 'interactive', interactive: { button_reply: { title: 'Lanjut' } } }).text, 'Lanjut');
    assert.equal(extractMetaText({ type: 'interactive', interactive: { list_reply: { title: 'Skincare' } } }).text, 'Skincare');
  });
  await t('reaksi, edit, hapus, tidak didukung BUKAN percakapan (tidak disimpan)', () => {
    for (const ty of ['reaction', 'edit', 'revoke', 'unsupported', 'system']) {
      assert.ok(isNonChatType(ty));
      assert.equal(chatDisplayText('x', ty), null);
      assert.equal(chatDisplayText(null, ty), null);
    }
  });
  await t('teks kosong tanpa jenis -> tidak disimpan', () => {
    assert.equal(chatDisplayText(null, null), null);
    assert.equal(chatDisplayText('   ', 'text'), null);
  });
  await t('normalisasi nomor: 0812.. / +62 / spasi -> 62812..; terlalu pendek -> null', () => {
    assert.equal(normalizeChatPhone('0812-3456-7890'), '6281234567890');
    assert.equal(normalizeChatPhone('+62 812 3456 7890'), '6281234567890');
    assert.equal(normalizeChatPhone('6281234567890'), '6281234567890');
    assert.equal(normalizeChatPhone('123'), null);
    assert.equal(normalizeChatPhone(null), null);
  });
  await t('recordChatMessage: masuk = customer/is_read false; keluar = busdev/is_read true', async () => {
    const calls: any[] = [];
    const fake = { query: async (_sql: string, p: unknown[]) => { calls.push(p); return { rowCount: 1, rows: [{ id: 1 }] }; } } as any;
    assert.equal(await recordChatMessage(fake, { phone: '628111111111', direction: 'inbound', text: 'hai', wamid: 'w1', trackingCode: 'DL-1', senderName: 'Budi', busdevName: 'Diaz' }), true);
    assert.equal(await recordChatMessage(fake, { phone: '628111111111', direction: 'outbound', text: 'siap kak', wamid: 'w2', busdevName: 'Unassigned' }), true);
    // [tracking_code, phone, sender_type, sender_name, text, wamid, direction, busdev_name, is_read]
    assert.deepEqual(calls[0], ['DL-1', '628111111111', 'customer', 'Budi', 'hai', 'w1', 'inbound', 'Diaz', false]);
    assert.deepEqual(calls[1], [null, '628111111111', 'busdev', null, 'siap kak', 'w2', 'outbound', null, true]);
  });
  await t('recordChatMessage: wamid kembar (dedup) -> false', async () => {
    const fake = { query: async () => ({ rowCount: 0, rows: [] }) } as any;
    assert.equal(await recordChatMessage(fake, { phone: '628111111111', direction: 'inbound', text: 'hai', wamid: 'w1' }), false);
  });
  console.log(`\n${n}/${n} lulus`);
}
main().catch((e) => { console.error('GAGAL', e); process.exit(1); });
