-- Migration 0005: Update assets.type constraint
-- Replaces ('image', 'video', 'file', 'link') with ('image', 'document')
-- to match the uploader's supported categories.

-- 1. Drop the old CHECK constraint
ALTER TABLE assets
  DROP CONSTRAINT IF EXISTS assets_type_check;

-- 2. Add the new CHECK constraint
ALTER TABLE assets
  ADD CONSTRAINT assets_type_check
  CHECK (type IN ('image', 'document'));

-- 3. Optionally migrate existing rows:
--    - 'video', 'file' → 'document'
--    - 'link'           → keep as is only if it already passes the new check
--    (Uncomment if migrating from a populated database):
--
-- UPDATE assets SET type = 'document' WHERE type IN ('video', 'file');
--
-- For 'link' assets, decide whether to convert or handle separately:
-- UPDATE assets SET type = 'document' WHERE type = 'link';
