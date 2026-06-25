#!/usr/bin/env sh
set -eu

if [ $# -ne 1 ]; then
  echo "Usage: ./scripts/restore-db.sh ../backups/mysql/file.sql"
  exit 1
fi

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
cd "$DEPLOY_DIR"

set -a
. ./env/backend.env
set +a

docker compose exec -T mysql mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" < "$1"

echo "Database restored from: $1"