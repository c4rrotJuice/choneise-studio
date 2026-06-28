-- Migration 0006: Project Registry data model extension
-- Adds hosting_stack, tech_stack, and updates_future_plans columns to projects.

-- 1. hosting_stack — structured hosting metadata
--    Expected shape: { frontend, backend, database, auth, server, deployed_url }
ALTER TABLE projects
  ADD COLUMN hosting_stack jsonb;

COMMENT ON COLUMN projects.hosting_stack IS
  'Hosting infrastructure details: { frontend, backend, database, auth, server, deployed_url }';

-- 2. tech_stack — array of technologies used
ALTER TABLE projects
  ADD COLUMN tech_stack jsonb;

COMMENT ON COLUMN projects.tech_stack IS
  'Array of technology names used in the project, e.g. ["Next.js", "Tailwind CSS", "Supabase"]';

-- 3. updates_future_plans — forward-looking roadmap notes
ALTER TABLE projects
  ADD COLUMN updates_future_plans text;

COMMENT ON COLUMN projects.updates_future_plans IS
  'Future plans, roadmap notes, and upcoming work for the project';
