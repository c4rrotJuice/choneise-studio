#!/usr/bin/env bash
set -euo pipefail

ACTION="${1:-help}"
ROOT="${2:-$PWD}"
LOG_DIR="$ROOT/.continue/db-agent-logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/$(date +%Y%m%d-%H%M%S)-${ACTION}.log"

run_logged() {
  echo "+ $*" | tee -a "$LOG_FILE"
  "$@" 2>&1 | tee -a "$LOG_FILE"
  return "${PIPESTATUS[0]}"
}

print_usage() {
  cat <<'USAGE'
Usage:
  db-agent.sh context [repo-root]
  db-agent.sh validate [repo-root]
  db-agent.sh latest [repo-root]
  db-agent.sh new [repo-root] <name>
  db-agent.sh push-dry-run [repo-root]
  db-agent.sh push [repo-root]

Rules:
  - Inspect schema before code changes.
  - Avoid destructive migrations.
  - Prefer additive and backward-compatible changes.
  - Do not run raw migration commands directly; use this script.
USAGE
}

schema_sources() {
  find "$ROOT" \( \
    -path "$ROOT/.continue/migration.sql" -o \
    -path "$ROOT/.continue/schema.sql" -o \
    -path "$ROOT/.continue/supabase.sql" -o \
    -path "$ROOT/.continue/db.ts" -o \
    -path "$ROOT/supabase/schema.sql" -o \
    -path "$ROOT/prisma/schema.prisma" -o \
    -path "$ROOT/supabase/migrations/*.sql" -o \
    -name 'drizzle.config.*' \
  \) -type f -print 2>/dev/null | sort
}

context() {
  echo "Database schema sources:"
  schema_sources | sed "s#^$ROOT/##" | tee -a "$LOG_FILE"
}

latest() {
  if [ -d "$ROOT/supabase/migrations" ]; then
    find "$ROOT/supabase/migrations" -maxdepth 1 -type f -name '*.sql' -printf '%f\n' | sort | tail -n 1
  else
    echo "No supabase/migrations directory found" >&2
    return 1
  fi
}

validate() {
  local migration_dir="$ROOT/supabase/migrations"
  if [ ! -d "$migration_dir" ]; then
    echo "No supabase/migrations directory found; validation skipped"
    return 0
  fi

  if grep -R -n -E '\bDROP[[:space:]]+TABLE\b|\bTRUNCATE\b' "$migration_dir" >/dev/null; then
    echo "Destructive SQL detected:" | tee -a "$LOG_FILE"
    grep -R -n -E '\bDROP[[:space:]]+TABLE\b|\bTRUNCATE\b' "$migration_dir" | tee -a "$LOG_FILE"
    return 1
  fi

  grep -R -n -E '\bDROP[[:space:]]+COLUMN\b|\bDELETE[[:space:]]+FROM\b|\bDROP[[:space:]]+(POLICY|FUNCTION|TRIGGER)\b' "$migration_dir" | tee -a "$LOG_FILE" || true
  echo "Database validation complete"
}

require_supabase() {
  if ! command -v npx >/dev/null 2>&1; then
    echo "npx is required for Supabase migration commands" >&2
    return 1
  fi
}

case "$ACTION" in
  context)
    context
    ;;
  validate)
    validate
    ;;
  latest)
    latest
    ;;
  new)
    NAME="${3:-}"
    if [ -z "$NAME" ]; then
      echo "Migration name required" >&2
      exit 1
    fi
    require_supabase
    run_logged npx supabase migration new "$NAME"
    ;;
  push-dry-run)
    require_supabase
    validate
    run_logged npx supabase db push --dry-run
    ;;
  push)
    require_supabase
    validate
    run_logged npx supabase db push
    ;;
  help|-h|--help)
    print_usage
    ;;
  *)
    print_usage
    exit 1
    ;;
esac

