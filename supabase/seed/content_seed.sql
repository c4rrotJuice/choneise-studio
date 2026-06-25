-- Content Engine: Baseline Seed Data
-- Theme: studio workshop — experimental, calm, product-focused
--
-- Insert order follows FK dependency chain:
--   1. tags
--   2. projects
--   3. project_tags
--   4. updates
--   5. experiments
--   6. assets

BEGIN;

-- ============================================================================
-- 1. TAGS (5)
-- ============================================================================
INSERT INTO tags (id, name)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'experimental'),
    ('a0000000-0000-0000-0000-000000000002', 'product'),
    ('a0000000-0000-0000-0000-000000000003', 'internal'),
    ('a0000000-0000-0000-0000-000000000004', 'tool'),
    ('a0000000-0000-0000-0000-000000000005', 'public')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 2. PROJECTS (6)
-- ============================================================================
INSERT INTO projects (id, slug, title, description, status, kind, version)
VALUES
    (
        'b0000000-0000-0000-0000-000000000001',
        'choneise-studio',
        'Choneise Studio',
        'The internal studio runtime — a calm, intentional workspace for building, tracking, and publishing digital products. Serves as both the operational backbone and the public surface of the studio.',
        'published',
        'Platform',
        'v1.0.0'
    ),
    (
        'b0000000-0000-0000-0000-000000000002',
        'quiet-tool',
        'Quiet Tool',
        'A focused, minimal writing environment for long-form thinking. Strips away distraction and keeps the cursor moving. Currently in quiet alpha with a small circle of early users.',
        'draft',
        'Tool',
        'v0.1.0'
    ),
    (
        'b0000000-0000-0000-0000-000000000003',
        'grade-converter',
        'Grade Converter',
        'Convert grades across different systems. Simple, accurate, useful.',
        'Live',
        'Tool',
        'v1.0.2'
    ),
    (
        'b0000000-0000-0000-0000-000000000004',
        'fee-calculator',
        'Mobile Money Fee Calculator',
        'Estimate mobile money transfer costs before sending everyday payments.',
        'Building',
        'Tool',
        'v0.4.0'
    ),
    (
        'b0000000-0000-0000-0000-000000000005',
        'multilingual-explorer',
        'Multilingual Explorer',
        'Explore meanings across languages, contexts, and translation paths.',
        'Experiment',
        'Experiment',
        'v0.3.1'
    ),
    (
        'b0000000-0000-0000-0000-000000000006',
        'quiet-journal',
        'Quiet Journal',
        'A minimal writing space for quiet notes, drafts, and public thinking.',
        'Dormant',
        'Experiment',
        'v0.1.0'
    )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 3. PROJECT_TAGS (relationships)
-- ============================================================================
INSERT INTO project_tags (project_id, tag_id)
VALUES
    -- Choneise Studio: experimental + internal
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003'),
    -- Quiet Tool: experimental + product
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002'),
    -- Grade Converter: tool + public + product
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000004'),
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000005'),
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002'),
    -- Fee Calculator: tool + public + product
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004'),
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000005'),
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002'),
    -- Multilingual Explorer: experimental + public
    ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005'),
    -- Quiet Journal: experimental
    ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001')
ON CONFLICT (project_id, tag_id) DO NOTHING;

-- ============================================================================
-- 4. UPDATES (2 per project = 4)
-- ============================================================================
INSERT INTO updates (id, project_id, title, content, published, created_at)
VALUES
    -- Choneise Studio updates
    (
        'c0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000001',
        'Studio runtime goes live',
        'Shipped the first internal build of the Choneise Studio runtime. Projects, updates, experiments, and assets are all wired together. The data model is intentionally flat — no over-engineering, just enough structure to keep things calm and findable.',
        true,
        '2025-06-01 10:00:00+00'
    ),
    (
        'c0000000-0000-0000-0000-000000000002',
        'b0000000-0000-0000-0000-000000000001',
        'Content engine schema stabilised',
        'Locked in the core schema after a few weeks of quiet use. The tag system turned out to be the right level of relational flexibility. No new tables needed yet — the current set handles every workflow without friction.',
        true,
        '2025-06-15 14:30:00+00'
    ),
    -- Quiet Tool updates
    (
        'c0000000-0000-0000-0000-000000000003',
        'b0000000-0000-0000-0000-000000000002',
        'First-alpha typing surface complete',
        'Built the core typing surface in a single weekend sprint. No formatting toolbar, no toolbar at all — just a blinking cursor and clean monospace. The calmness is already noticeable compared to mainstream editors.',
        true,
        '2025-07-01 09:00:00+00'
    ),
    (
        'c0000000-0000-0000-0000-000000000004',
        'b0000000-0000-0000-0000-000000000002',
        'Three early users, zero complaints',
        'Handed out alpha access to three trusted writers. After two weeks of daily use, the only feedback was a request for dark mode — which was already the default. That kind of quiet satisfaction is exactly what we were aiming for.',
        false,
        '2025-07-14 11:00:00+00'
    )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. EXPERIMENTS (2 per project = 4)
-- ============================================================================
INSERT INTO experiments (id, project_id, title, description, result, created_at)
VALUES
    -- Choneise Studio experiments
    (
        'd0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000001',
        'Static-first rendering strategy',
        'Tested whether the entire studio surface could render statically at build time without sacrificing the feeling of live data. Used incremental static regeneration as a middle ground.',
        'ISR with a 60-second revalidation window hits the sweet spot. Pages feel fresh but the build stays fast. No client-side fetching needed for the public surface.',
        '2025-05-20 08:00:00+00'
    ),
    (
        'd0000000-0000-0000-0000-000000000002',
        'b0000000-0000-0000-0000-000000000001',
        'Tag-first navigation pattern',
        'Prototyped a navigation model where tags are the primary entry point instead of a project list. The idea was to surface connections between projects organically.',
        'Works well as a secondary path but confusing as the default. Keeping project list as primary and adding tag filters as an overlay. Filed for later.',
        '2025-06-05 16:00:00+00'
    ),
    -- Quiet Tool experiments
    (
        'd0000000-0000-0000-0000-000000000003',
        'b0000000-0000-0000-0000-000000000002',
        'Zero-UI cursor mode',
        'Experimented with hiding the cursor after 3 seconds of typing to eliminate even that tiny visual anchor. The text just appears, with no blinking distraction.',
        'Surprisingly pleasant once you trust that your input is landing. Two of three testers preferred it on. Adding as an optional toggle in the next build.',
        '2025-06-28 12:00:00+00'
    ),
    (
        'd0000000-0000-0000-0000-000000000004',
        'b0000000-0000-0000-0000-000000000002',
        'Ambient soundscape integration',
        'Tested whether a subtle generative ambient layer (rain, room tone, distant hum) would enhance the writing experience or just add cognitive noise.',
        'Mixed. One tester loved it, two found it distracting but appreciated the intent. Shelving for now — might revisit as an optional plugin later.',
        '2025-07-10 07:00:00+00'
    )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 6. ASSETS (2 per project = 4)
-- ============================================================================
INSERT INTO assets (id, project_id, url, type, meta)
VALUES
    -- Choneise Studio assets
    (
        'e0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000001',
        '/assets/studio-runtime-screenshot.png',
        'image',
        '{"alt": "Choneise Studio dashboard — dark editorial interface with project list and tag sidebar", "width": 1440, "height": 900}'
    ),
    (
        'e0000000-0000-0000-0000-000000000002',
        'b0000000-0000-0000-0000-000000000001',
        'https://github.com/choneise/studio-runtime',
        'link',
        '{"label": "Studio Runtime repository", "description": "Internal monorepo for the Choneise platform"}'
    ),
    -- Quiet Tool assets
    (
        'e0000000-0000-0000-0000-000000000003',
        'b0000000-0000-0000-0000-000000000002',
        '/assets/quiet-tool-typing-surface.png',
        'image',
        '{"alt": "Quiet Tool writing surface — minimal monospace text area with no chrome", "width": 1440, "height": 900}'
    ),
    (
        'e0000000-0000-0000-0000-000000000004',
        'b0000000-0000-0000-0000-000000000002',
        '/assets/quiet-tool-dark-mode.png',
        'image',
        '{"alt": "Quiet Tool in default dark mode — soft amber text on deep charcoal background", "width": 1440, "height": 900}'
    )
ON CONFLICT DO NOTHING;

COMMIT;
