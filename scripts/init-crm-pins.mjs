/**
 * scripts/init-crm-pins.mjs
 *
 * Script sekali jalan untuk membuat PIN sementara acak (6 digit) per user CRM:
 *   - Head    -> role: admin
 *   - Annisa  -> role: busdev
 *   - Diaz    -> role: busdev
 *   - Jessica -> role: busdev
 *
 * Keamanan:
 *   - PIN digenerate secara acak kriptografis (`crypto.randomInt`) saat script dijalankan.
 *   - Di database HANYA disimpan hash scrypt (`scrypt$<salt>$<hash>`) + `must_change_password = TRUE`.
 *   - PIN teks biasa HANYA dicetak sekali di terminal stdout Anda, tidak pernah ditulis ke file/log/kode.
 *
 * Cara pakai:
 *   node scripts/init-crm-pins.mjs             # Mode dry-run (simulasi, tidak mengubah DB)
 *   node scripts/init-crm-pins.mjs --apply     # Menulis hash PIN baru ke DB & mencetak PIN di terminal
 */
import crypto from 'node:crypto';
import path from 'node:path';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const apply = process.argv.includes('--apply');

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.database_DATABASE_URL;

if (!connectionString) {
  console.error('Gagal: DATABASE_URL belum diatur.');
  process.exit(1);
}

function hashPassword(pw) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(pw, salt, 32, { N: 16384, r: 8, p: 1 });
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

function generatePin() {
  while (true) {
    const pin = String(crypto.randomInt(100_000, 1_000_000));
    if (
      !/^(.)\1+$/.test(pin) &&
      !'01234567890'.includes(pin) &&
      !'9876543210'.includes(pin)
    ) {
      return pin;
    }
  }
}

const TARGET_USERS = [
  { name: 'Head', role: 'admin', legacyRole: 'head' },
  { name: 'Annisa', role: 'busdev', legacyRole: 'sales' },
  { name: 'Diaz', role: 'busdev', legacyRole: 'sales' },
  { name: 'Jessica', role: 'busdev', legacyRole: 'sales' },
];

const u = new URL(connectionString);
const sslMode = u.searchParams.get('sslmode') ?? '';
const ssl =
  sslMode === 'require'
    ? { rejectUnauthorized: false }
    : sslMode === 'verify-ca' || sslMode === 'verify-full'
      ? { rejectUnauthorized: true }
      : undefined;

const pool = new pg.Pool({
  host: u.hostname,
  port: Number(u.port || 5432),
  database: decodeURIComponent(u.pathname.replace(/^\//, '')),
  user: decodeURIComponent(u.username),
  password: decodeURIComponent(u.password),
  ssl,
  max: 1,
  connectionTimeoutMillis: 10000,
});

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const chk = await client.query(
      `SELECT pg_get_constraintdef(oid) AS def FROM pg_constraint WHERE conname = 'crm_users_role_check'`
    );
    const def = String(chk.rows[0]?.def || '');
    const supportsNewRoles = def.includes("'admin'");

    const outputRows = [];

    for (const target of TARGET_USERS) {
      const pin = generatePin();
      const pwHash = hashPassword(pin);
      const dbRole = supportsNewRoles ? target.role : target.legacyRole;

      const res = await client.query(
        `INSERT INTO crm_users (name, role, password_hash, must_change_password, is_active, failed_attempts, locked_until, updated_at)
         VALUES ($1, $2, $3, TRUE, TRUE, 0, NULL, NOW())
         ON CONFLICT ((lower(name))) DO UPDATE SET
           role = EXCLUDED.role,
           password_hash = EXCLUDED.password_hash,
           must_change_password = TRUE,
           is_active = TRUE,
           failed_attempts = 0,
           locked_until = NULL,
           updated_at = NOW()
         RETURNING id, name, role`,
        [target.name, dbRole, pwHash]
      );

      const row = res.rows[0];
      await client.query(`DELETE FROM crm_sessions WHERE user_id = $1`, [row.id]);
      await client
        .query(
          `UPDATE sales SET password_hash = $2, must_change_password = TRUE, updated_at = NOW() WHERE lower(name) = lower($1)`,
          [target.name, pwHash]
        )
        .catch(() => {});

      outputRows.push({
        ID: row.id,
        Nama: row.name,
        Role: target.role,
        'PIN Sementara (Sekali Pakai)': pin,
        'Wajib Ganti Saat Login': 'YA',
      });
    }

    if (apply) {
      await client.query('COMMIT');
      console.log('\n====================================================================');
      console.log(' KREDENSIAL PIN SEMENTARA CRM DREAMLAB (TERSIMPAN DALAM BENTUK HASH)');
      console.log('====================================================================');
      console.table(outputRows);
      console.log('PENTING: Catat PIN di atas sekarang. PIN tidak disimpan dalam bentuk');
      console.log('teks biasa di mana pun dan wajib diganti pada saat login pertama.\n');
    } else {
      await client.query('ROLLBACK');
      console.log('\n[DRY-RUN] Simulasi pembuatan PIN sementara (ROLLBACK — belum disimpan ke DB):');
      console.table(outputRows);
      console.log('Jalankan dengan flag `--apply` untuk menyimpan hash ke database:');
      console.log('  node scripts/init-crm-pins.mjs --apply\n');
    }
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Gagal menginisialisasi PIN:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
