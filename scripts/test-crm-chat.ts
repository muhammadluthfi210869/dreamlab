/**
 * test-crm-chat.ts
 * Uji API dan alur crm_chat_messages
 */
import pool from '../src/lib/db';

async function main() {
  console.log('--- TEST CRM CHAT ---');

  // 1. Cek tabel crm_chat_messages
  const countRes = await pool.query('SELECT count(*) FROM crm_chat_messages');
  console.log('Total messages in DB:', countRes.rows[0].count);
  if (parseInt(countRes.rows[0].count, 10) < 1) {
    throw new Error('Table crm_chat_messages should have seeded rows');
  }

  // 2. Insert test outbound message
  const testPhone = '628999999999';
  const insRes = await pool.query(
    `INSERT INTO crm_chat_messages (
      tracking_code, phone, sender_type, sender_name, message_text, direction, channel, busdev_name, is_read
    ) VALUES ($1, $2, 'busdev', 'Annisa', 'Halo ini pesan uji coba outbound', 'outbound', 'whatsapp', 'Annisa', true)
    RETURNING id, phone, message_text, direction`,
    ['TEST_TRACK_123', testPhone]
  );
  console.log('Inserted outbound message:', insRes.rows[0]);

  // 3. Query thread
  const threadRes = await pool.query(
    `SELECT id, phone, message_text, direction FROM crm_chat_messages WHERE phone = $1 ORDER BY created_at ASC`,
    [testPhone]
  );
  if (threadRes.rows.length === 0) {
    throw new Error('Thread query failed');
  }
  console.log('Thread query passed, total messages for test phone:', threadRes.rows.length);

  // 4. Bersihkan pesan uji
  await pool.query('DELETE FROM crm_chat_messages WHERE phone = $1', [testPhone]);
  console.log('Cleaned up test message');

  console.log('SEMUA TEST CRM CHAT BERHASIL!');
  process.exit(0);
}

main().catch((err) => {
  console.error('TEST CRM CHAT GAGAL:', err);kepke