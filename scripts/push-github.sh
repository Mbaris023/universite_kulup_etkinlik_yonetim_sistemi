#!/usr/bin/env bash
# sevvalculcuu hesabına repo oluşturup push eder.
# Önce: gh auth login
set -euo pipefail
cd "$(dirname "$0")/.."

REPO_NAME="Yazilim-Muhendisligi-Universite-Kulup-Etkinlik-Yonetim-Sistemi"
DESC="Yazılım Mühendisliği - Üniversite Kulüp Etkinlik Yönetim Sistemi"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI kurulu değil. https://cli.github.com"
  exit 1
fi

gh auth status

if ! git remote get-url origin >/dev/null 2>&1; then
  gh repo create "sevvalculcuu/${REPO_NAME}" \
    --public \
    --description "${DESC}" \
    --source=. \
    --remote=origin \
    --push
else
  git push -u origin main
fi

echo "Tamam: https://github.com/sevvalculcuu/${REPO_NAME}"
