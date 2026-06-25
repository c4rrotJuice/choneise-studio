-- Migration 0004: Add kind and version columns to projects.
-- Expand status constraint to include frontend-facing status values
-- while preserving backward compatibility with existing values.

-- 1. Add new columns
ALTER TABLE projects
  ADD COLUMN kind    text,
  ADD COLUMN version text;

-- 2. Drop the old CHECK constraint first so we can expand status values
ALTER TABLE projects
  DROP CONSTRAINT IF EXISTS projects_status_check;

-- 3. Add the expanded CHECK constraint
--    Old values (draft, published, archived) preserved for backward compatibility.
--    New values (Live, Building, Experiment, Dormant) match the frontend ProjectCard.
ALTER TABLE projects
  ADD CONSTRAINT projects_status_check
  CHECK (status IN (
    'draft',
    'published',
    'archived',
    'Live',
    'Building',
    'Experiment',
    'Dormant'
  ));
