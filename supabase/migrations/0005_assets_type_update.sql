-- Migration 0005: Update assets.type constraint
-- Replaces ('image', 'video', 'file', 'link') with ('image', 'document')
-- to match the uploader's supported categories.

-- 1a. Drop the old CHECK constraint
ALTER TABLE assets
  DROP CONSTRAINT IF EXISTS assets_type_check;

-- 1b. Migrate existing rows to conform to the new constraint
UPDATE assets SET type = 'document' WHERE type NOT IN ('image', 'document');

-- 1c. Add the new CHECK constraint
ALTER TABLE assets
  ADD CONSTRAINT assets_type_check
  CHECK (type IN ('image', 'document'));
