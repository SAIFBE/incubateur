# Deploiement Incubateur avec MobaXterm + Docker Compose

Cette documentation decrit le deploiement production de l'application Incubateur avec React/Vite, Laravel 12, Sanctum, MySQL, Nginx et Caddy.

## Structure serveur attendue

```txt
/opt/incubateur
|-- frontend
|   `-- deploy
|-- backend
|-- backups
|   `-- mysql
`-- mysql
```

Le fichier Compose principal se trouve dans :

```bash
/opt/incubateur/frontend/deploy/docker-compose.yml
```

Depuis ce dossier, les contextes Docker sont :

```txt
frontend: ..
backend: ../../backend
```

## Services Docker

```txt
caddy         : entree publique HTTP/HTTPS, ports 80 et 443
frontend      : Nginx interne servant le build React et proxy /api + /storage
backend-nginx : Nginx interne Laravel, sert public/ et storage public
backend       : PHP-FPM Laravel
mysql         : base MySQL interne, sans port public
phpmyadmin    : optionnel, profil tools, 127.0.0.1:8081 uniquement
```

Seul Caddy publie les ports 80 et 443. MySQL, PHP-FPM, backend-nginx et frontend restent internes au reseau Docker.

## Preparation serveur

```bash
sudo mkdir -p /opt/incubateur/backups/mysql /opt/incubateur/mysql
sudo chown -R $USER:$USER /opt/incubateur
```

Deposer ou cloner les deux projets :

```bash
/opt/incubateur/frontend
/opt/incubateur/backend
```

## Installation Docker sur Ubuntu

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

Se deconnecter puis se reconnecter apres `usermod`.

## Configuration initiale

```bash
cd /opt/incubateur/frontend/deploy
cp .env.example .env
cp env/backend.env.example env/backend.env
```

Pour un test par IP sans HTTPS, modifier `.env` :

```env
APP_DOMAIN=:80
VITE_API_URL=/api
VITE_BASE_PATH=/
COMPOSE_PROJECT_NAME=incubateur
```

Pour un vrai domaine, modifier `.env` :

```env
APP_DOMAIN=example.com
VITE_API_URL=/api
VITE_BASE_PATH=/
COMPOSE_PROJECT_NAME=incubateur
```

Modifier ensuite `env/backend.env`. Remplacer manuellement :

```env
APP_KEY=
APP_URL=https://example.com
ASSET_URL=https://example.com
FRONTEND_URL=https://example.com
DB_PASSWORD=CHANGE_ME_STRONG_PASSWORD
MYSQL_PASSWORD=CHANGE_ME_STRONG_PASSWORD
MYSQL_ROOT_PASSWORD=CHANGE_ME_ROOT_PASSWORD
SANCTUM_STATEFUL_DOMAINS=example.com,www.example.com
CORS_ALLOWED_ORIGINS=https://example.com,https://www.example.com
MAIL_FROM_ADDRESS=noreply@example.com
```

Pour un test par IP sans HTTPS :

```env
APP_URL=http://IP_DU_SERVEUR
ASSET_URL=http://IP_DU_SERVEUR
FRONTEND_URL=http://IP_DU_SERVEUR
SESSION_DOMAIN=
SESSION_SECURE_COOKIE=false
SANCTUM_STATEFUL_DOMAINS=IP_DU_SERVEUR
CORS_ALLOWED_ORIGINS=http://IP_DU_SERVEUR
```

Ne jamais commiter de vrais mots de passe, tokens ou APP_KEY.

## Generer APP_KEY

Apres avoir remplace les mots de passe dans `env/backend.env` :

```bash
docker compose --env-file .env build backend
docker compose --env-file .env run --rm --no-deps backend php artisan key:generate --show
```

Copier la valeur affichee dans `env/backend.env` :

```env
APP_KEY=base64:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Premier deploiement

```bash
cd /opt/incubateur/frontend/deploy
chmod +x scripts/*.sh
./scripts/first-deploy.sh
```

Le script verifie la configuration, construit les images, demarre MySQL, attend son etat healthy, execute les migrations, cree le lien storage, optimise Laravel, lance le seeder admin, puis demarre frontend et Caddy.

## Mise a jour normale

Frontend :

```bash
cd /opt/incubateur/frontend
git pull
```

Backend :

```bash
cd /opt/incubateur/backend
git pull
```

Redeploiement :

```bash
cd /opt/incubateur/frontend/deploy
docker compose --env-file .env config
docker compose --env-file .env up -d --build
docker compose exec backend php artisan migrate --force
docker compose exec backend php artisan optimize:clear
docker compose exec backend php artisan optimize
docker compose ps
```

## Commandes de maintenance

Demarrer :

```bash
docker compose --env-file .env up -d
```

Reconstruire :

```bash
docker compose --env-file .env up -d --build
```

Arreter sans supprimer :

```bash
docker compose stop
```

Redemarrer :

```bash
docker compose restart
```

Supprimer les conteneurs sans supprimer les volumes :

```bash
docker compose down
```

Attention production : ne jamais utiliser `docker compose down -v` sans sauvegarde verifiee. Cette commande peut supprimer les donnees persistantes MySQL et Laravel.

## Logs utiles

```bash
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f caddy
docker compose logs -f mysql
```

## phpMyAdmin optionnel

```bash
docker compose --profile tools up -d phpmyadmin
```

phpMyAdmin ecoute seulement sur `127.0.0.1:8081`. Pour y acceder depuis ton PC, creer un tunnel SSH MobaXterm :

```txt
Local port: 8081
Remote host: 127.0.0.1
Remote port: 8081
```

Puis ouvrir :

```txt
http://127.0.0.1:8081
```

## Sauvegarde MySQL

```bash
cd /opt/incubateur/frontend/deploy
./scripts/backup-db.sh
```

Les sauvegardes sont creees dans :

```txt
/opt/incubateur/backups/mysql
```

Le script conserve les 14 dernieres sauvegardes `.sql.gz`.

## Restauration MySQL

```bash
cd /opt/incubateur/frontend/deploy
./scripts/restore-db.sh ../../backups/mysql/nom_du_fichier.sql.gz
```

Le script demande de taper `RESTORE` avant de restaurer.

## Validation avant production

Frontend local :

```bash
npm run lint
npm run build
```

Backend local :

```bash
php artisan test
```

Docker depuis `/opt/incubateur/frontend/deploy` :

```bash
docker compose --env-file .env config
docker compose --env-file .env build
```

## Routes a verifier apres deploiement

```txt
/
/login
/opportunites
/evenements
/demande-compte/{token}
/api/login
/api/project-ideas
/storage/...
/up
```