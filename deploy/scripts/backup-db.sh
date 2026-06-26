#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
cd "$DEPLOY_DIR"

COMPOSE="docker compose --env-file .env"
BACKUP_DIR="../../backups/mysql"
BACKUP_FILE="$BACKUP_DIR/incubateur_$(date +%Y%m%d_%H%M%S).sql.gz"

if [ ! -f .env ]; then
  echo "Missing deploy/.env. Run: cp .env.example .env"
  exit 1
fi

if [ ! -f env/backend.env ]; then
  echo "Missing deploy/env/backend.env. Run: cp env/backend.env.example env/backend.env"
  exit 1
fi

mkdir -p "$BACKUP_DIR"

$COMPOSE exec -T mysql sh -c 'mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --single-transaction --quick --triggers --routines --events "$MYSQL_DATABASE"' | gzip -c > "$BACKUP_FILE"

if [ ! -s "$BACKUP_FILE" ]; then
  echo "Backup failed: empty file created at $BACKUP_FILE"
  exit 1
fi

gzip -t "$BACKUP_FILE"

find "$BACKUP_DIR" -type f -name 'incubateur_*.sql.gz' -printf '%T@ %p\n' | sort -rn | awk 'NR>14 {print substr($0, index($0,$2))}' | xargs -r rm --

echo "Database backup created: $BACKUP_FILE"