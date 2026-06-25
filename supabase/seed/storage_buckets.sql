-- ============================================================================
-- Storage Bucket: studio-assets
-- ============================================================================
-- Run this via Supabase SQL Editor (not via supabase db push — the migration
-- role does not own storage schema objects on hosted Supabase).
-- ============================================================================

-- 1. Create the bucket (public so upload URLs are directly accessible)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'studio-assets',
  'studio-assets',
  true,
  52428800,  -- 50 MiB
  ARRAY[
    'image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml',
    'image/bmp', 'image/x-icon',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'text/markdown', 'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow authenticated users to upload into studio-assets
DROP POLICY IF EXISTS "studio_assets_insert_auth" ON storage.objects;
CREATE POLICY "studio_assets_insert_auth"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'studio-assets');

-- 3. Allow authenticated users to delete their own uploads
DROP POLICY IF EXISTS "studio_assets_delete_auth" ON storage.objects;
CREATE POLICY "studio_assets_delete_auth"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'studio-assets');

-- 4. Allow public read access (bucket is public)
DROP POLICY IF EXISTS "studio_assets_select_public" ON storage.objects;
CREATE POLICY "studio_assets_select_public"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'studio-assets');

-- 5. service_role bypass for admin cleanup operations
DROP POLICY IF EXISTS "studio_assets_admin_all" ON storage.objects;
CREATE POLICY "studio_assets_admin_all"
  ON storage.objects FOR ALL
  TO service_role
  USING (bucket_id = 'studio-assets')
  WITH CHECK (bucket_id = 'studio-assets');
