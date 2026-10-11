#!/usr/bin/env bash
# Restore a previous deploy from ~/backups/etelquotes.
# Usage: bash ~/backups/etelquotes/rollback.sh [TIMESTAMP]   (default: newest backup)
# Database is NOT rolled back; restore the matching *-db.sql.gz by hand if needed.
set -euo pipefail

BASE="$HOME/domains/etelquotes.com"
B="$HOME/backups/etelquotes"
PHP="${PHP_BIN:-php}"

TS="${1:-$(ls -1t "$B"/*-public_html.tar.gz | head -1 | sed -E 's#.*/([0-9]{8}-[0-9]{6})-public_html\.tar\.gz#\1#')}"
[ -f "$B/$TS-public_html.tar.gz" ] || { echo "No backup for $TS"; ls "$B"; exit 1; }
echo "Rolling back to $TS"

# public_html: wipe then restore (backup holds the whole directory)
find "$BASE/public_html" -mindepth 1 -delete
tar -xzf "$B/$TS-public_html.tar.gz" -C "$BASE"

# laravel: restore code + vendor, keep .env and storage/
if [ -f "$B/$TS-laravel.tar.gz" ]; then
  R="$B/.restore"; rm -rf "$R"; mkdir -p "$R"
  tar -xzf "$B/$TS-laravel.tar.gz" -C "$R"
  rsync -a --delete --exclude '.env' --exclude 'storage/' "$R/laravel/" "$BASE/laravel/"
  rm -rf "$R"
  (cd "$BASE/laravel" && "$PHP" artisan config:cache && "$PHP" artisan route:cache)
fi
echo "Rollback to $TS complete."
