-- Content Engine: Core Schema
-- Migration 0001: Base tables for projects, updates, experiments, assets, tags

-- ============================================================================
-- 1. projects
-- ============================================================================
CREATE TABLE projects (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        text NOT NULL UNIQUE,
    title       text NOT NULL,
    description text,
    status      text NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft', 'active', 'archived')),
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. updates
-- ============================================================================
CREATE TABLE updates (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title       text NOT NULL,
    content     text NOT NULL DEFAULT '',
    published   boolean NOT NULL DEFAULT false,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 3. experiments
-- ============================================================================
CREATE TABLE experiments (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title       text NOT NULL,
    description text NOT NULL DEFAULT '',
    result      text,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 4. assets
-- ============================================================================
CREATE TABLE assets (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  uuid REFERENCES projects(id) ON DELETE SET NULL,
    url         text NOT NULL,
    type        text NOT NULL
                CHECK (type IN ('image', 'video', 'file', 'link')),
    meta        jsonb,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 5. tags
-- ============================================================================
CREATE TABLE tags (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name        text NOT NULL UNIQUE,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 6. project_tags (join)
-- ============================================================================
CREATE TABLE project_tags (
    project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    tag_id      uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, tag_id)
);

-- ============================================================================
-- Indexes
-- ============================================================================
CREATE INDEX idx_updates_project_id     ON updates(project_id);
CREATE INDEX idx_experiments_project_id ON experiments(project_id);
CREATE INDEX idx_assets_project_id      ON assets(project_id);
CREATE INDEX idx_project_tags_tag_id    ON project_tags(tag_id);

-- ============================================================================
-- updated_at trigger (auto-set on row update)
-- ============================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_updates_updated_at
    BEFORE UPDATE ON updates
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_experiments_updated_at
    BEFORE UPDATE ON experiments
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_assets_updated_at
    BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_tags_updated_at
    BEFORE UPDATE ON tags
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
