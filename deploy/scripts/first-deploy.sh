#!/usr/bin/env sh
set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
cd "$DEPLOY_DIR"

if [ ! -f .env ]; then
  echo "Missing deploy/.env. Run: cp .env.example .env"
  exit 1
fi

if [ ! -f env/backend.env ]; then
  echo "Missing deploy/env/backend.env. Run: cp env/backend.env.example env/backend.env"
  exit 1
fi

if grep -q "CHANGE_ME" env/backend.env; then
  echo "Please edit deploy/env/backend.env and replace every CHANGE_ME value before deploying."
  exit 1
fi

if grep -q "example.com" env/backend.env; then
  echo "Please replace example.com in deploy/env/backend.env with your real domain or server URL."
  exit 1
fi

docker compose --env-file .env up -d --build

docker compose exec backend php artisan migrate --force
docker compose exec backend php artisan db:seed --class=AdminUserSeeder --force
docker compose exec backend php artisan storage:link || true

echo "Deployment completed."