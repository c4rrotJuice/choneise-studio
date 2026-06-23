#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-$PWD}"
AI_DIR="$ROOT/.ai"

mkdir -p "$AI_DIR"

timestamp() {
  date -u +"%Y-%m-%dT%H:%M:%SZ"
}

rel() {
  local path="$1"
  printf '%s\n' "${path#$ROOT/}"
}

git_head=""
git_dirty="unknown"
if git -C "$ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git_head="$(git -C "$ROOT" rev-parse HEAD 2>/dev/null || true)"
  if [ -n "$(git -C "$ROOT" status --porcelain 2>/dev/null)" ]; then
    git_dirty="true"
  else
    git_dirty="false"
  fi
fi

detect_stack() {
  local found=false

  for file in \
    package.json \
    pnpm-lock.yaml \
    yarn.lock \
    package-lock.json \
    bun.lockb \
    pyproject.toml \
    requirements.txt \
    uv.lock \
    Cargo.toml \
    go.mod \
    Gemfile \
    composer.json \
    deno.json \
    deno.jsonc \
    tsconfig.json \
    vite.config.ts \
    next.config.js \
    next.config.mjs \
    svelte.config.js \
    astro.config.mjs \
    tailwind.config.js \
    tailwind.config.ts \
    prisma/schema.prisma
  do
    if [ -e "$ROOT/$file" ]; then
      printf -- '- `%s`\n' "$file"
      found=true
    fi
  done

  if [ "$found" = false ]; then
    printf 'Unknown. Inspect repository files before assuming stack.\n'
  fi
}

list_dirs() {
  find "$ROOT" -maxdepth 2 -type d \
    ! -path "$ROOT/.git" \
    ! -path "$ROOT/.git/*" \
    ! -path "$ROOT/.ai" \
    ! -path "$ROOT/.ai/*" \
    ! -path "$ROOT/.continue" \
    ! -path "$ROOT/.continue/*" \
    ! -path "$ROOT/node_modules" \
    ! -path "$ROOT/node_modules/*" \
    ! -path "$ROOT/vendor" \
    ! -path "$ROOT/vendor/*" \
    ! -path "$ROOT/dist" \
    ! -path "$ROOT/dist/*" \
    ! -path "$ROOT/build" \
    ! -path "$ROOT/build/*" \
    ! -path "$ROOT/.next" \
    ! -path "$ROOT/.next/*" \
    ! -path "$ROOT/target" \
    ! -path "$ROOT/target/*" \
    | sort \
    | while IFS= read -r dir; do
        [ "$dir" = "$ROOT" ] && continue
        printf -- '- `%s/`\n' "$(rel "$dir")"
      done
}

list_key_files() {
  find "$ROOT" -maxdepth 3 -type f \
    ! -path "$ROOT/.git/*" \
    ! -path "$ROOT/.ai/*" \
    ! -path "$ROOT/.continue/*" \
    ! -path "$ROOT/node_modules/*" \
    ! -path "$ROOT/vendor/*" \
    ! -path "$ROOT/dist/*" \
    ! -path "$ROOT/build/*" \
    ! -path "$ROOT/.next/*" \
    ! -path "$ROOT/target/*" \
    \( \
      -name 'README*' \
      -o -name 'package.json' \
      -o -name 'pyproject.toml' \
      -o -name 'Cargo.toml' \
      -o -name 'go.mod' \
      -o -name 'tsconfig.json' \
      -o -name 'vite.config.*' \
      -o -name 'next.config.*' \
      -o -name 'svelte.config.*' \
      -o -name 'astro.config.*' \
      -o -name 'tailwind.config.*' \
      -o -name 'drizzle.config.*' \
      -o -name 'schema.prisma' \
      -o -name '.env.example' \
      -o -name 'docker-compose.*' \
      -o -name 'Dockerfile' \
    \) \
    | sort \
    | while IFS= read -r file; do
        printf -- '- `%s`\n' "$(rel "$file")"
      done
}

write_commands() {
  {
    echo "# Project Commands Cache"
    echo
    echo "Generated: $(timestamp)"
    echo
    echo "Use this as a command index only. Verify against source config before relying on a command."
    echo
    echo "## PACKAGE SCRIPTS"
    echo
    if [ -f "$ROOT/package.json" ]; then
      node -e '
const fs = require("fs");
const path = process.argv[1];
try {
  const pkg = JSON.parse(fs.readFileSync(path, "utf8"));
  const scripts = pkg.scripts || {};
  const names = Object.keys(scripts).sort();
  if (names.length === 0) {
    console.log("No package scripts declared.");
  } else {
    for (const name of names) {
      console.log(`- \`${name}\`: \`${scripts[name]}\``);
    }
  }
} catch (err) {
  console.log("package.json could not be parsed. Inspect it directly.");
}
' "$ROOT/package.json" 2>/dev/null || echo "Node is unavailable. Inspect package.json directly."
    else
      echo "No package.json detected."
    fi
    echo
    echo "## LIKELY VERIFICATION"
    echo
    for cmd in test lint typecheck check build; do
      if [ -f "$ROOT/package.json" ] && grep -q "\"$cmd\"" "$ROOT/package.json"; then
        printf -- '- Package script: `%s`\n' "$cmd"
      fi
    done
    if [ -f "$ROOT/pyproject.toml" ]; then
      echo "- Python project detected. Inspect \`pyproject.toml\` for test/lint/type commands."
    fi
    if [ -f "$ROOT/Cargo.toml" ]; then
      echo "- Rust project detected. Consider \`cargo test\` and \`cargo check\`."
    fi
    if [ -f "$ROOT/go.mod" ]; then
      echo "- Go project detected. Consider \`go test ./...\`."
    fi
  } > "$AI_DIR/commands.md"
}

write_state() {
  {
    echo "# Project State Cache"
    echo
    echo "Generated: $(timestamp)"
    echo
    echo "Routing cache only. Inspect real source files before editing or making behavioral claims."
    echo
    echo "## CURRENT STATE"
    echo
    if [ -f "$ROOT/README.md" ]; then
      echo "README present at \`README.md\`. Inspect it for product purpose and setup details."
    else
      echo "No README.md detected at repository root."
    fi
    echo
    echo "## STACK SIGNALS"
    echo
    detect_stack
    echo
    echo "## ARCHITECTURE SIGNALS"
    echo
    list_dirs
    echo
    echo "## IMPORTANT FLOWS"
    echo
    echo "Unknown. Fill this in after an agent or maintainer inspects the application flows."
    echo
    echo "## RISKS"
    echo
    echo "- Cache may be stale; verify with source files and config before edits."
  } > "$AI_DIR/state.md"
}

write_file_map() {
  {
    echo "# Project File Map Cache"
    echo
    echo "Generated: $(timestamp)"
    echo
    echo "Use this to route inspection. It is not source truth."
    echo
    echo "## DIRECTORIES"
    echo
    list_dirs
    echo
    echo "## KEY FILES"
    echo
    list_key_files
    echo
    echo "## GENERATED OR HEAVY PATHS TO AVOID"
    echo
    echo "- \`node_modules/\`"
    echo "- \`vendor/\`"
    echo "- \`dist/\`"
    echo "- \`build/\`"
    echo "- \`.next/\`"
    echo "- \`target/\`"
  } > "$AI_DIR/file-map.md"
}

write_manifest() {
  {
    echo "{"
    printf '  "generatedAt": "%s",\n' "$(timestamp)"
    if [ -n "$git_head" ]; then
      printf '  "gitHead": "%s",\n' "$git_head"
    else
      echo '  "gitHead": null,'
    fi
    printf '  "gitDirty": "%s",\n' "$git_dirty"
    echo '  "generator": "skim-cache.sh",'
    echo '  "files": ['
    echo '    ".ai/state.md",'
    echo '    ".ai/file-map.md",'
    echo '    ".ai/commands.md"'
    echo '  ]'
    echo "}"
  } > "$AI_DIR/cache-manifest.json"
}

write_state
write_file_map
write_commands
write_manifest

echo "Project skim cache refreshed in $AI_DIR"
