#!/usr/bin/env bash
# Quality Gate — runs all checks that must pass before merge.
set -euo pipefail

echo "========================================="
echo "  RIOS Quality Gate"
echo "========================================="

echo ""
echo "[1/5] Linting..."
pnpm turbo lint

echo ""
echo "[2/5] Formatting check..."
pnpm prettier --check .

echo ""
echo "[3/5] TypeScript compilation..."
pnpm turbo typecheck

echo ""
echo "[4/5] Unit tests..."
pnpm turbo test

echo ""
echo "[5/5] Build..."
pnpm turbo build

echo ""
echo "========================================="
echo "  All quality gates passed!"
echo "========================================="