---
name: Project runtime overlay loader
alwaysApply: true
---

# Project Runtime Overlay

Before planning or editing in this repository, inspect these files when present:

1. `.ai/project.md`
2. `.ai/rules.md`
3. `.ai/state.md`
4. `.ai/file-map.md`
5. `.ai/commands.md`
6. `.ai/database.md`

Treat `.ai/project.md` and `.ai/rules.md` as repository-specific instructions.

Treat `.ai/state.md`, `.ai/file-map.md`, `.ai/commands.md`, and `.ai/cache-manifest.json` as routing cache only. Use them to choose targeted files and commands to inspect, not as source truth. Before editing, testing, or making behavioral claims, inspect the actual relevant source files and tool configuration.

If `.ai/cache-manifest.json` is stale against the current git HEAD, dirty state, or relevant config/schema files, refresh with `.continue/skim-cache.sh` or distrust the cache.

If database work is involved, inspect `.ai/database.md` and use `.continue/db-agent.sh` or `~/.continue-runtime/scripts/db-agent.sh` for migration workflows.
