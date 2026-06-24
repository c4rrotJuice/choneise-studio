-- Migration 0002: Enable Row Level Security with minimal policies
-- SELECT: anon role can read all tables
-- INSERT/UPDATE/DELETE: service_role only

-- ============================================================================
-- Enable RLS on all tables
-- ============================================================================
ALTER TABLE projects      ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates       ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets        ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags          ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tags  ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- projects
-- ============================================================================
CREATE POLICY projects_select_anon
    ON projects FOR SELECT
    TO anon
    USING (true);

CREATE POLICY projects_insert_service
    ON projects FOR INSERT
    TO service_role
    WITH CHECK (true);

CREATE POLICY projects_update_service
    ON projects FOR UPDATE
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY projects_delete_service
    ON projects FOR DELETE
    TO service_role
    USING (true);

-- ============================================================================
-- updates
-- ============================================================================
CREATE POLICY updates_select_anon
    ON updates FOR SELECT
    TO anon
    USING (true);

CREATE POLICY updates_insert_service
    ON updates FOR INSERT
    TO service_role
    WITH CHECK (true);

CREATE POLICY updates_update_service
    ON updates FOR UPDATE
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY updates_delete_service
    ON updates FOR DELETE
    TO service_role
    USING (true);

-- ============================================================================
-- experiments
-- ============================================================================
CREATE POLICY experiments_select_anon
    ON experiments FOR SELECT
    TO anon
    USING (true);

CREATE POLICY experiments_insert_service
    ON experiments FOR INSERT
    TO service_role
    WITH CHECK (true);

CREATE POLICY experiments_update_service
    ON experiments FOR UPDATE
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY experiments_delete_service
    ON experiments FOR DELETE
    TO service_role
    USING (true);

-- ============================================================================
-- assets
-- ============================================================================
CREATE POLICY assets_select_anon
    ON assets FOR SELECT
    TO anon
    USING (true);

CREATE POLICY assets_insert_service
    ON assets FOR INSERT
    TO service_role
    WITH CHECK (true);

CREATE POLICY assets_update_service
    ON assets FOR UPDATE
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY assets_delete_service
    ON assets FOR DELETE
    TO service_role
    USING (true);

-- ============================================================================
-- tags
-- ============================================================================
CREATE POLICY tags_select_anon
    ON tags FOR SELECT
    TO anon
    USING (true);

CREATE POLICY tags_insert_service
    ON tags FOR INSERT
    TO service_role
    WITH CHECK (true);

CREATE POLICY tags_update_service
    ON tags FOR UPDATE
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY tags_delete_service
    ON tags FOR DELETE
    TO service_role
    USING (true);

-- ============================================================================
-- project_tags
-- ============================================================================
CREATE POLICY project_tags_select_anon
    ON project_tags FOR SELECT
    TO anon
    USING (true);

CREATE POLICY project_tags_insert_service
    ON project_tags FOR INSERT
    TO service_role
    WITH CHECK (true);

CREATE POLICY project_tags_update_service
    ON project_tags FOR UPDATE
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY project_tags_delete_service
    ON project_tags FOR DELETE
    TO service_role
    USING (true);
