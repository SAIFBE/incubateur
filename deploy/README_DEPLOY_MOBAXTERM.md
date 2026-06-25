# Déploiement Incubateur avec MobaXterm + Docker

Cette architecture déploie l'application Laravel + React avec Docker Compose sur un serveur Linux.

## Architecture finale sur le serveur

```txt
/opt/incubateur
├── backend                 # copie de C:\xampp\htdocs\incubateur-backend
├── frontend                # copie de C:\Users\saif\Desktop\incubateur
│   └── deploy              # ce dossier de déploiement
└── backups
    └── mysql
```

Les conteneurs créés :

```txt
caddy          : entrée publique HTTP/HTTPS, ports 80 et 443
frontend       : Nginx qui sert React et proxy /api + /storage
backend-nginx  : Nginx Laravel interne
backend        : PHP-FPM Laravel
mysql          : base de données interne
phpmyadmin     : optionnel, profil tools, exposé seulement sur 127.0.0.1:8081
```

## Préparation locale avant envoi

Les fichiers déjà ajoutés :

Frontend :

```txt
C:\Users\saif\Desktop\incubateur\Dockerfile.production
C:\Users\saif\Desktop\incubateur\.dockerignore
C:\Users\saif\Desktop\incubateur\deploy\...
```

Backend :

```txt
C:\xampp\htdocs\incubateur-backend\Dockerfile.production
C:\xampp\htdocs\incubateur-backend\Dockerfile.nginx
C:\xampp\htdocs\incubateur-backend\.dockerignore
C:\xampp\htdocs\incubateur-backend\docker\...
```

## Envoi avec MobaXterm

1. Ouvrir une session SSH vers le serveur.
2. Créer le dossier :

```bash
sudo mkdir -p /opt/incubateur
sudo chown -R $USER:$USER /opt/incubateur
```

3. Avec le panneau SFTP de MobaXterm, envoyer :

```txt
C:\xampp\htdocs\incubateur-backend  -> /opt/incubateur/backend
C:\Users\saif\Desktop\incubateur    -> /opt/incubateur/frontend
```

Important : sur le serveur, le dossier doit s'appeler exactement `backend` et `frontend`.

## Installation Docker sur Ubuntu

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

Déconnecte-toi puis reconnecte-toi à SSH après `usermod`.

## Configuration production

```bash
cd /opt/incubateur/frontend/deploy
cp .env.example .env
cp env/backend.env.example env/backend.env
```

Modifier les fichiers :

```bash
nano .env
nano env/backend.env
```

Dans `.env` :

```env
APP_DOMAIN=ton-domaine.com
VITE_API_URL=/api
VITE_BASE_PATH=/
```

Si tu n'as pas encore de domaine et tu veux tester avec l'IP :

```env
APP_DOMAIN=:80
VITE_API_URL=/api
VITE_BASE_PATH=/
```

Dans `env/backend.env`, remplacer :

```env
APP_URL=https://ton-domaine.com
ASSET_URL=https://ton-domaine.com
DB_PASSWORD=mot_de_passe_fort
MYSQL_PASSWORD=mot_de_passe_fort
MYSQL_ROOT_PASSWORD=mot_de_passe_root_fort
SANCTUM_STATEFUL_DOMAINS=ton-domaine.com,www.ton-domaine.com
SESSION_DOMAIN=.ton-domaine.com
CORS_ALLOWED_ORIGINS=https://ton-domaine.com,https://www.ton-domaine.com
```

Si tu testes par IP sans HTTPS :

```env
APP_URL=http://IP_DU_SERVEUR
ASSET_URL=http://IP_DU_SERVEUR
SESSION_DOMAIN=null
SESSION_SECURE_COOKIE=false
SANCTUM_STATEFUL_DOMAINS=IP_DU_SERVEUR
CORS_ALLOWED_ORIGINS=http://IP_DU_SERVEUR
```

## Générer APP_KEY

Après avoir remplacé les mots de passe, lance :

```bash
docker compose --env-file .env build backend
docker compose --env-file .env run --rm backend php artisan key:generate --show
```

Copie la valeur affichée dans `env/backend.env` :

```env
APP_KEY=base64:xxxxxxxxxxxxxxxxxxxxxxxx
```

## Premier déploiement

```bash
cd /opt/incubateur/frontend/deploy
chmod +x scripts/*.sh
./scripts/first-deploy.sh
```

L'application sera disponible sur :

```txt
https://ton-domaine.com
```

ou, en test IP :

```txt
http://IP_DU_SERVEUR
```

## Commandes utiles

Voir les conteneurs :

```bash
docker compose ps
```

Voir les logs :

```bash
docker compose logs -f
```

Redémarrer :

```bash
docker compose restart
```

Reconstruire après modification du code :

```bash
docker compose --env-file .env up -d --build
```

Lancer les migrations :

```bash
docker compose exec backend php artisan migrate --force
```

Créer ou mettre à jour les comptes admin :

```bash
docker compose exec backend php artisan db:seed --class=AdminUserSeeder --force
```

## phpMyAdmin optionnel

Démarrer phpMyAdmin :

```bash
docker compose --profile tools up -d phpmyadmin
```

Puis créer un tunnel SSH avec MobaXterm :

```txt
Local port: 8081
Remote host: 127.0.0.1
Remote port: 8081
```

Ensuite ouvrir localement :

```txt
http://127.0.0.1:8081
```

## Sauvegarde MySQL

```bash
cd /opt/incubateur/frontend/deploy
./scripts/backup-db.sh
```

Restaurer une sauvegarde :

```bash
./scripts/restore-db.sh ../backups/mysql/nom_du_fichier.sql
```

## Ports à ouvrir sur le serveur

```txt
80/tcp
443/tcp
22/tcp pour SSH
```

Ne pas exposer MySQL publiquement.