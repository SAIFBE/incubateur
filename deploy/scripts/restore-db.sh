#!/usr/bin/env bash
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: ./scripts/restore-db.sh ../../backups/mysql/file.sql.gz"
  exit 1
fi

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
cd "$DEPLOY_DIR"

COMPOSE="docker compose --env-file .env"
RESTORE_FILE="$1"

if [ ! -f .env ]; then
  echo "Missing deploy/.env. Run: cp .env.example .env"
  exit 1
fi

if [ ! -f env/backend.env ]; then
  echo "Missing deploy/env/backend.env. Run: cp env/backend.env.example env/backend.env"
  exit 1
fi

if [ ! -f "$RESTORE_FILE" ]; then
  echo "Restore file not found: $RESTORE_FILE"
  exit 1
fi

echo "This will restore the database from: $RESTORE_FILE"
echo "Type RESTORE to continue:"
read -r confirmation

if [ "$confirmation" != "RESTORE" ]; then
  echo "Restore cancelled."
  exit 1
fi

case "$RESTORE_FILE" in
  *.sql.gz)
    gzip -dc "$RESTORE_FILE" | $COMPOSE exec -T mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"'
    ;;
  *.sql)
    $COMPOSE exec -T mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' < "$RESTORE_FILE"
    ;;
  *)
    echo "Unsupported file type. Use a .sql or .sql.gz file."
    exit 1
    ;;
esac

echo "Database restored from: $RESTORE_FILE"