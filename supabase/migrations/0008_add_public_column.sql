-- Migration 0008: Add `public` boolean column to projects.
-- This column controls visibility on the /projects discovery page.
-- Previously visibility was coupled to `status = 'published'`.
-- Now `public = true` makes a project visible regardless of its status value.

ALTER TABLE projects
  ADD COLUMN public boolean DEFAULT false;

-- Set existing "published" projects to public so no data is lost.
UPDATE projects
  SET public = true
  WHERE status = 'published';
