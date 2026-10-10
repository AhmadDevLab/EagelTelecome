# Deploying EtelQuotes to Hostinger

Push to `main` -> GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys over SSH.

## Server layout

```
/home/u597965665/domains/etelquotes.com/
├── public_html/      React build + .htaccess + backend.php   (web-accessible)
└── laravel/          Laravel app, vendor/, .env, storage/    (NOT web-accessible)
~/backups/etelquotes/ last 5 public_html / laravel / DB dumps + rollback.sh
```

`/api/*` and `/up` are routed by `public_html/.htaccess` to `backend.php`, which boots `../laravel`.
Same domain for site and API, so no CORS issues.

## One-time setup

1. **hPanel > Advanced > PHP Configuration**: set PHP **8.3** for etelquotes.com.
2. **hPanel > Databases > MySQL**: create a database + user; note the three values.
3. **hPanel > Advanced > SSH Access**: enable SSH, add the **public** key.
4. Generate an app key locally: `cd backend && php artisan key:generate --show`
5. Create `/home/u597965665/domains/etelquotes.com/laravel/.env` on the server (File Manager or SSH):

   ```
   APP_NAME=EtelQuotes
   APP_ENV=production
   APP_KEY=<from step 4>
   APP_DEBUG=false
   APP_URL=https://etelquotes.com
   LOG_LEVEL=warning

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=<from hPanel>
   DB_USERNAME=<from hPanel>
   DB_PASSWORD=<from hPanel>

   SESSION_DRIVER=database
   CACHE_STORE=database
   QUEUE_CONNECTION=sync

   FRONTEND_URL=https://etelquotes.com
   ADMIN_PASSWORD=<long random password>
   FAKE_EMAIL_DOMAIN=gmail.com
   ```
   The deploy never touches this file and aborts if it is missing.
6. Add the GitHub secrets below, then push to `main` (or run the workflow manually).

## GitHub secrets (Settings > Secrets and variables > Actions)

| Name | Value |
| --- | --- |
| `SSH_PRIVATE_KEY` | full private key (incl. BEGIN/END lines) |
| `SSH_HOST` | `195.179.238.141` |
| `SSH_PORT` | `65002` |
| `SSH_USER` | `u597965665` |
| `SSH_KNOWN_HOSTS` | *(optional)* output of `ssh-keyscan -p 65002 195.179.238.141`, pins the host key |

Optional repository **variable** `PHP_BIN`: path to PHP 8.3 CLI (e.g. `/opt/alt/php83/usr/bin/php`) if plain `php` on the server is older. The preflight step fails with a clear message if so.

No application env vars live in GitHub: runtime config is the server-side `.env`; the frontend only needs the public `VITE_API_BASE_URL` in `frontend/.env.production`.

## What each deploy does

1. Build frontend (lint + Vite), install backend with `composer --no-dev`.
2. **Preflight + backup**: checks PHP >= 8.3 and `.env`, then tars `public_html` and `laravel`, dumps the DB. Aborts before touching the live site if anything fails.
3. rsync backend to `laravel/` (keeps `.env`, `storage/`), rsync frontend to `public_html/`.
4. `artisan migrate --force`, `config:cache`, `route:cache`.
5. Smoke test the live site.

## Verify

- `https://etelquotes.com/` loads the landing page; `/admin` loads the login (not a 404).
- `https://etelquotes.com/up` returns 200.
- `https://etelquotes.com/api/admin/submissions` returns `{"message":"Unauthenticated."}` with 401 (Laravel is running).
- Submit the form, then log in at `/admin` with `ADMIN_PASSWORD` and confirm the row appears.
- Green check on the Actions run (it runs the same checks).

## Roll back

```sh
ssh -p 65002 u597965665@195.179.238.141
bash ~/backups/etelquotes/rollback.sh              # newest backup
bash ~/backups/etelquotes/rollback.sh 20261011-1430  # specific one (ls ~/backups/etelquotes)
```

Code is restored automatically. The database is not: if a migration must be undone, restore the matching dump:
`gunzip -c ~/backups/etelquotes/<TS>-db.sql.gz | mysql -u <user> -p <db>`.
