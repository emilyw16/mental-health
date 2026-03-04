#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${1:-.env.local}"
ENVIRONMENT="${2:-production}"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE not found"
  exit 1
fi

echo "Syncing env vars from $ENV_FILE to EAS ($ENVIRONMENT environment)..."

while IFS= read -r line || [ -n "$line" ]; do
  # Skip empty lines and comments
  [[ -z "$line" || "$line" =~ ^# ]] && continue

  # Parse KEY="VALUE" or KEY=VALUE
  key="${line%%=*}"
  value="${line#*=}"
  # Strip surrounding quotes
  value="${value%\"}"
  value="${value#\"}"

  echo "  Setting $key..."
  eas env:create \
    --name "$key" \
    --value "$value" \
    --environment "$ENVIRONMENT" \
    --visibility sensitive \
    --type string \
    --force 2>/dev/null || \
  eas env:update \
    --name "$key" \
    --value "$value" \
    --environment "$ENVIRONMENT" \
    --visibility sensitive \
    --type string 2>/dev/null || \
  echo "  Warning: Failed to set $key"
done < "$ENV_FILE"

echo "Done."
