/**
 * Content Engine CRUD Validation Script
 *
 * Validates all CRUD operations against the local Supabase instance.
 * Uses the well-known local Supabase keys.
 */

import { createClient } from "@supabase/supabase-js"

// ---------------------------------------------------------------------------
// Config – local Supabase instance
// ---------------------------------------------------------------------------

const SUPABASE_URL = "http://127.0.0.1:54321"
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"

const anon = createClient(SUPABASE_URL, ANON_KEY)
const admin = createClient(SUPABASE_URL, SERVICE_KEY)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let passed = 0
let failed = 0

function check(label: string, ok: boolean, detail?: string): void {
  if (ok) {
    passed++
    console.log(`  ✅ ${label}`)
  } else {
    failed++
    console.log(`  ❌ ${label}${detail ? ` — ${detail}` : ""}`)
  }
}

function header(title: string): void {
  console.log(`\n━━━ ${title} ━━━`)
}

// ---------------------------------------------------------------------------
// Seed IDs (from content_seed.sql)
// ---------------------------------------------------------------------------

const P1 = "b0000000-0000-0000-0000-000000000001" // choneise-studio
const P2 = "b0000000-0000-0000-0000-000000000002" // quiet-tool
const T1 = "a0000000-0000-0000-0000-000000000001" // experimental
const T2 = "a0000000-0000-0000-0000-000000000002" // product
const T3 = "a0000000-0000-0000-0000-000000000003" // internal

// Test IDs (will be created / deleted during the run)
let testProjectId = ""
let testUpdateId = ""
let testExperimentId = ""
let testAssetId = ""

// ---------------------------------------------------------------------------
// 1. PROJECTS
// ---------------------------------------------------------------------------

async function validateProjects(): Promise<void> {
  header("PROJECTS")

  // --- Reads ---
  {
    const { data, error } = await anon.from("projects").select("*")
    check("getProjects: returns array", Array.isArray(data))
    check("getProjects: 2 seed projects", data?.length === 2)
    check("getProjects: no error", error === null)
  }

  {
    const { data, error } = await anon
      .from("projects")
      .select("*")
      .eq("slug", "choneise-studio")
      .single()
    check("getProject(slug): returns single", data !== null)
    check("getProject(slug): title matches", data?.title === "Choneise Studio")
    check("getProject(slug): no error", error === null)
  }

  {
    const { data, error } = await anon
      .from("projects")
      .select("*")
      .eq("slug", "nonexistent")
      .single()
    check("getProject(missing): returns null", data === null)
    check("getProject(missing): has error", error !== null)
  }

  // --- Create ---
  const newSlug = `test-project-${Date.now()}`
  {
    const { data, error } = await admin
      .from("projects")
      .insert({
        slug: newSlug,
        title: "Test Project",
        status: "draft",
      })
      .select("*")
      .single()
    check("createProject: returns row", data !== null)
    check("createProject: slug correct", data?.slug === newSlug)
    check("createProject: status draft", data?.status === "draft")
    check("createProject: has id", typeof data?.id === "string")
    check("createProject: no error", error === null)
    if (data) testProjectId = data.id
  }

  // Verify anon cannot create
  {
    const { error } = await anon.from("projects").insert({ slug: "bad", title: "Bad" })
    check("createProject (anon): blocked by RLS", error !== null)
  }

  // --- Update ---
  {
    const { data, error } = await admin
      .from("projects")
      .update({ title: "Updated Test Project", status: "active" })
      .eq("id", testProjectId)
      .select("*")
      .single()
    check("updateProject: title updated", data?.title === "Updated Test Project")
    check("updateProject: status active", data?.status === "active")
    check("updateProject: no error", error === null)
  }

  // Verify anon cannot update
  {
    const { error } = await anon
      .from("projects")
      .update({ title: "hacked" })
      .eq("id", testProjectId)
    check("updateProject (anon): blocked by RLS", error !== null)
  }

  // --- Delete (cleanup) ---
  {
    const { error } = await admin
      .from("projects")
      .delete()
      .eq("id", testProjectId)
    check("deleteProject: no error", error === null)
  }

  // Verify deletion
  {
    const { data } = await anon
      .from("projects")
      .select("*")
      .eq("id", testProjectId)
      .single()
    check("deleteProject: record gone", data === null)
  }
}

// ---------------------------------------------------------------------------
// 2. UPDATES
// ---------------------------------------------------------------------------

async function validateUpdates(): Promise<void> {
  header("UPDATES")

  // --- Reads ---
  {
    const { data, error } = await anon
      .from("updates")
      .select("*")
      .eq("project_id", P1)
      .order("created_at", { ascending: false })
    check("listUpdates(P1): returns array", Array.isArray(data))
    check("listUpdates(P1): 2 seed updates", data?.length === 2)
    check("listUpdates(P1): no error", error === null)
  }

  {
    const { data, error } = await anon
      .from("updates")
      .select("*")
      .eq("project_id", P2)
    check("listUpdates(P2): 2 seed updates", data?.length === 2)
  }

  // --- Create ---
  {
    const { data, error } = await admin
      .from("updates")
      .insert({
        project_id: P1,
        title: "Test Update",
        content: "Validation test update content.",
        published: false,
      })
      .select("*")
      .single()
    check("createUpdate: returns row", data !== null)
    check("createUpdate: project_id links correctly", data?.project_id === P1)
    check("createUpdate: published false", data?.published === false)
    check("createUpdate: no error", error === null)
    if (data) testUpdateId = data.id
  }

  // --- FK integrity check ---
  {
    const { data } = await anon
      .from("updates")
      .select("*")
      .eq("project_id", P1)
    check("createUpdate: P1 now has 3 updates", data?.length === 3)
  }
}

// ---------------------------------------------------------------------------
// 3. EXPERIMENTS
// ---------------------------------------------------------------------------

async function validateExperiments(): Promise<void> {
  header("EXPERIMENTS")

  // --- Reads ---
  {
    const { data, error } = await anon
      .from("experiments")
      .select("*")
      .eq("project_id", P2)
      .order("created_at", { ascending: false })
    check("listExperiments(P2): returns array", Array.isArray(data))
    check("listExperiments(P2): 2 seed experiments", data?.length === 2)
    check("listExperiments(P2): no error", error === null)
  }

  // --- Create ---
  {
    const { data, error } = await admin
      .from("experiments")
      .insert({
        project_id: P2,
        title: "Test Experiment",
        description: "Testing CRUD validation.",
        result: "Passed.",
      })
      .select("*")
      .single()
    check("createExperiment: returns row", data !== null)
    check("createExperiment: project_id links correctly", data?.project_id === P2)
    check("createExperiment: result stored", data?.result === "Passed.")
    check("createExperiment: no error", error === null)
    if (data) testExperimentId = data.id
  }
}

// ---------------------------------------------------------------------------
// 4. ASSETS
// ---------------------------------------------------------------------------

async function validateAssets(): Promise<void> {
  header("ASSETS")

  // --- Reads (all) ---
  {
    const { data, error } = await anon.from("assets").select("*")
    check("listAssets(): returns array", Array.isArray(data))
    check("listAssets(): 4 seed assets", data?.length === 4)
    check("listAssets(): no error", error === null)
  }

  // --- Reads (filtered) ---
  {
    const { data } = await anon
      .from("assets")
      .select("*")
      .eq("project_id", P1)
    check("listAssets(P1): 2 assets", data?.length === 2)
  }

  // --- Create ---
  {
    const { data, error } = await admin
      .from("assets")
      .insert({
        project_id: P1,
        url: "/assets/test.png",
        type: "image",
        meta: { alt: "test", width: 100, height: 100 },
      })
      .select("*")
      .single()
    check("createAsset: returns row", data !== null)
    check("createAsset: type image", data?.type === "image")
    check("createAsset: meta is object", typeof data?.meta === "object")
    check("createAsset: no error", error === null)
    if (data) testAssetId = data.id
  }

  // --- Asset without project (nullable FK) ---
  {
    const { data, error } = await admin
      .from("assets")
      .insert({
        url: "https://example.com/orphan",
        type: "link",
      })
      .select("*")
      .single()
    check("createAsset (no project): returns row", data !== null)
    check("createAsset (no project): project_id null", data?.project_id === null)
    check("createAsset (no project): no error", error === null)
  }
}

// ---------------------------------------------------------------------------
// 5. TAGS
// ---------------------------------------------------------------------------

async function validateTags(): Promise<void> {
  header("TAGS")

  // --- Reads ---
  {
    const { data, error } = await anon
      .from("tags")
      .select("*")
      .order("name", { ascending: true })
    check("listTags: returns array", Array.isArray(data))
    check("listTags: 3 seed tags", data?.length === 3)
    check("listTags: alphabetical order", data?.[0]?.name === "experimental")
    check("listTags: no error", error === null)
  }

  // --- Assign tag to project ---
  // P1 already has T1 and T3. Assign T2 to P1.
  {
    const { error } = await admin
      .from("project_tags")
      .insert({ project_id: P1, tag_id: T2 })
    check("assignTagToProject: no error", error === null)
  }

  // Verify assignment
  {
    const { data } = await anon
      .from("project_tags")
      .select("*")
      .eq("project_id", P1)
    check("assignTagToProject: P1 now has 3 tags", data?.length === 3)
  }

  // --- Duplicate assignment (PK violation) ---
  {
    const { error } = await admin
      .from("project_tags")
      .insert({ project_id: P1, tag_id: T2 })
    check("assignTagToProject (duplicate): rejected", error !== null)
  }

  // --- FK violation (bad tag) ---
  {
    const { error } = await admin
      .from("project_tags")
      .insert({
        project_id: P1,
        tag_id: "00000000-0000-0000-0000-000000000099",
      })
    check("assignTagToProject (bad tag): FK rejected", error !== null)
  }
}

// ---------------------------------------------------------------------------
// 6. CASCADE DELETE
// ---------------------------------------------------------------------------

async function validateCascade(): Promise<void> {
  header("CASCADE DELETE")

  // Create a temp project with children to test cascade
  const { data: proj } = await admin
    .from("projects")
    .insert({ slug: "cascade-test", title: "Cascade Test" })
    .select("*")
    .single()

  if (!proj) {
    check("cascade setup: project created", false, "could not create test project")
    return
  }

  const pid = proj.id

  await admin.from("updates").insert({ project_id: pid, title: "Cascade Update" })
  await admin.from("experiments").insert({ project_id: pid, title: "Cascade Experiment" })
  await admin.from("assets").insert({ project_id: pid, url: "/x", type: "file" })

  // Delete project — cascades to updates, experiments, and sets assets.project_id to NULL
  const { error } = await admin.from("projects").delete().eq("id", pid)
  check("cascade: project deleted", error === null)

  // Verify children cleaned up
  const { data: remUpdates } = await anon.from("updates").select("*").eq("project_id", pid)
  check("cascade: updates removed", remUpdates?.length === 0)

  const { data: remExperiments } = await anon.from("experiments").select("*").eq("project_id", pid)
  check("cascade: experiments removed", remExperiments?.length === 0)

  const { data: remAssets } = await anon.from("assets").select("*").eq("project_id", pid)
  check("cascade: assets set to NULL (ON DELETE SET NULL)", remAssets?.length === 0)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log("Content Engine CRUD Validation")
  console.log(`Target: ${SUPABASE_URL}`)
  console.time("duration")

  await validateProjects()
  await validateUpdates()
  await validateExperiments()
  await validateAssets()
  await validateTags()
  await validateCascade()

  console.timeEnd("duration")
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`RESULTS: ${passed} passed / ${failed} failed`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  if (failed > 0) process.exit(1)
}

main().catch((err) => {
  console.error("Fatal:", err)
  process.exit(1)
})
