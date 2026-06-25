#!/usr/bin/env sh
set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
cd "$DEPLOY_DIR"

set -a
. ./env/backend.env
set +a

mkdir -p ../backups/mysql
BACKUP_FILE="../backups/mysql/incubateur_$(date +%Y%m%d_%H%M%S).sql"

docker compose exec -T mysql mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" > "$BACKUP_FILE"

echo "Database backup created: $BACKUP_FILE"