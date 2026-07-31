#!/bin/bash
# ═══════════════════════════════════════════════════════════
#  Dreamlab Lead DB — Deploy (project TERPISAH dari ERP)
# ═══════════════════════════════════════════════════════════
#  Cara pakai di SERVER (folder ini):
#    cd /opt/dreamlab-lead
#    cp .env.production.example .env   # sekali saja, isi password
#    bash deploy-lead.sh
#
#  Tidak menyentuh project ERP sama sekali.
# ═══════════════════════════════════════════════════════════
set -euo pipefail

echo ""
echo "═══════════════════════════════════════════"
echo "  🚀 DREAMLAB LEAD DB DEPLOY"
echo "  $(date)"
echo "═══════════════════════════════════════════"

# ── 1. Cek .env ──
if [ ! -f .env ]; then
  echo "❌ File .env tidak ditemukan!"
  echo "   cp .env.production.example .env"
  echo "   lalu isi LEAD_DB_PASSWORD."
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env
set +a

COMPOSE_FILE="docker-compose-lead.yml"

# ── 2. Backup database lead (sebelum perubahan apa pun) ──
echo ""
echo "📦 Backup database lead..."
mkdir -p backups
LEAD_DB_CONTAINER=$(docker ps --filter "name=dreamlab-lead-db-lead" --format '{{.Names}}' | head -1 || echo "")
if [ -n "$LEAD_DB_CONTAINER" ]; then
  BACKUP_FILE="backups/lead-$(date +%Y%m%d-%H%M%S).sql"
  docker exec "$LEAD_DB_CONTAINER" pg_dump -U "${LEAD_DB_USER:-dreamlab1}" "${LEAD_DB_NAME:-dreamlab}" > "$BACKUP_FILE" 2>/dev/null \
    && echo "  ✅ Backup: $BACKUP_FILE ($(wc -c < "$BACKUP_FILE") bytes)" \
    || echo "  ⚠️  Backup gagal (lanjut deploy)"
else
  echo "  ⚠️  Belum ada container db-lead (fresh deploy)"
fi

# ── 3. Build & Deploy (project terpisah, tidak menyentuh ERP) ──
echo ""
echo "🏗️  Build & Deploy..."
docker compose -f "$COMPOSE_FILE" up -d --build

# ── 4. Health Check ──
echo ""
echo "⏳ Health check (max 60 detik)..."
HEALTHY=false
for i in $(seq 1 30); do
  sleep 2
  if docker compose -f "$COMPOSE_FILE" exec -T db-lead pg_isready -U "${LEAD_DB_USER:-dreamlab1}" -d "${LEAD_DB_NAME:-dreamlab}" >/dev/null 2>&1; then
    HEALTHY=true
    echo "  ✅ Database lead sehat!"
    break
  fi
done

if [ "$HEALTHY" != "true" ]; then
  echo "  ❌ Health check gagal! Cek log:"
  docker compose -f "$COMPOSE_FILE" logs --tail 30 db-lead
  exit 1
fi

# ── 5. Info akses ──
echo ""
echo "═══════════════════════════════════════════"
echo "  ✅ DEPLOY DB LEAD BERHASIL!"
echo "  PgBouncer:  port 6432 (untuk Vercel)"
echo "  db-lead:    port 5433 (localhost server)"
echo ""
echo "  LANGKAH BERIKUTNYA (dari mesin lokal):"
echo "  1) Set DATABASE_URL di Vercel:"
echo "     postgresql://${LEAD_DB_USER:-dreamlab1}:<PASSWORD>@IP_VPS:6432/dreamlab?sslmode=require"
echo "  2) Jalankan migration:"
echo "     DATABASE_URL='...di atas...' npm run db:migrate"
echo "═══════════════════════════════════════════"
