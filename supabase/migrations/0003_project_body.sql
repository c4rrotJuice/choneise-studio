-- Migration 0003: Add summary and body columns to projects.
-- Also align status constraint with the studio editor terminology.

-- 1. Add new columns
ALTER TABLE projects
  ADD COLUMN summary text,
  ADD COLUMN body    text;

-- 2. Drop the old CHECK constraint first so we can migrate status values
ALTER TABLE projects
  DROP CONSTRAINT IF EXISTS projects_status_check;

-- 3. Migrate existing status values: 'active' → 'published'
UPDATE projects SET status = 'published' WHERE status = 'active';

-- 4. Add the new CHECK constraint
ALTER TABLE projects
  ADD CONSTRAINT projects_status_check
  CHECK (status IN ('draft', 'published', 'archived'));

