#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v npm >/dev/null 2>&1; then
  echo "Hata: npm bulunamadı. Lütfen Node.js 20+ kurun: https://nodejs.org"
  exit 1
fi

cp -n .env.example .env 2>/dev/null || true
npm install
npm run db:setup
echo ""
echo "Kurulum tamam. Çalıştırmak için: npm run dev"
echo "Demo: student@uni.edu / president@uni.edu / admin@uni.edu — şifre: 123456"
