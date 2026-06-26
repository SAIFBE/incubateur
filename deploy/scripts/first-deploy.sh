#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
cd "$DEPLOY_DIR"

COMPOSE="docker compose --env-file .env"
BACKUP_DIR="../../backups/mysql"

if [ ! -f .env ]; then
  echo "Missing deploy/.env. Run: cp .env.example .env"
  exit 1
fi

if [ ! -f env/backend.env ]; then
  echo "Missing deploy/env/backend.env. Run: cp env/backend.env.example env/backend.env"
  exit 1
fi

if grep -Eq '^APP_KEY=(|""|base64:CHANGE_ME|CHANGE_ME)' env/backend.env; then
  echo "APP_KEY is empty or still a placeholder. Generate one with:"
  echo "docker compose --env-file .env run --rm --no-deps backend php artisan key:generate --show"
  exit 1
fi

if grep -q "CHANGE_ME" env/backend.env; then
  echo "Please edit deploy/env/backend.env and replace every CHANGE_ME value before deploying."
  exit 1
fi

mkdir -p "$BACKUP_DIR"

$COMPOSE config >/dev/null
$COMPOSE build
$COMPOSE up -d mysql

echo "Waiting for MySQL healthcheck..."
for attempt in {1..60}; do
  mysql_container="$($COMPOSE ps -q mysql)"
  mysql_health="$(docker inspect -f '{{.State.Health.Status}}' "$mysql_container" 2>/dev/null || true)"

  if [ "$mysql_health" = "healthy" ]; then
    break
  fi

  if [ "$attempt" -eq 60 ]; then
    echo "MySQL did not become healthy in time. Check logs with: docker compose logs -f mysql"
    exit 1
  fi

  sleep 2
done

$COMPOSE up -d backend backend-nginx
$COMPOSE exec -T backend php artisan migrate --force
$COMPOSE exec -T backend php artisan storage:link || true
$COMPOSE exec -T backend php artisan optimize:clear
$COMPOSE exec -T backend php artisan optimize
$COMPOSE exec -T backend php artisan db:seed --class=AdminUserSeeder --force
$COMPOSE up -d frontend caddy

$COMPOSE ps

echo "Deployment completed. Useful logs:"
echo "docker compose logs -f"
echo "docker compose logs -f backend"
echo "docker compose logs -f frontend"
echo "docker compose logs -f caddy"
echo "docker compose logs -f mysql"