-- Migration 0003: Add summary and body columns to projects.
-- Also align status constraint with the studio editor terminology.

-- 1. Add new columns
ALTER TABLE projects
  ADD COLUMN summary text,
  ADD COLUMN body    text;

-- 2. Migrate existing status values: 'active' → 'published'
UPDATE projects SET status = 'published' WHERE status = 'active';

-- 3. Replace the status CHECK constraint
ALTER TABLE projects
  DROP CONSTRAINT IF EXISTS projects_status_check;

ALTER TABLE projects
  ADD CONSTRAINT projects_status_check
  CHECK (status IN ('draft', 'published', 'archived'));
