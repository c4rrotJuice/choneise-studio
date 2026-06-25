import { z } from "zod"
import { createFunctionsClient, type FunctionsEnv } from "../_lib/supabase"
import { createAdminClient } from "../_lib/admin"
import type { TablesInsert } from "../../supabase/types/database"

// ── Env ─────────────────────────────────────────────────────────────────────

interface ApiEnv extends FunctionsEnv {
  SUPABASE_SERVICE_ROLE_KEY: string
}

// ── Zod schemas ────────────────────────────────────────────────────────────

const allowedTypes = ["image", "document"] as const

const createAssetSchema = z.object({
  url: z.string().min(1, "URL is required"),
  type: z.enum(allowedTypes),
  project_id: z.string().uuid().optional().or(z.literal("").transform(() => undefined)),
  meta: z.record(z.unknown()).optional(),
})

const deleteAssetSchema = z.object({
  id: z.string().min(1, "Asset ID is required"),
})

// Build-time guard: ensures Zod schema keys are a valid subset of DB columns.
type _ZodInsertKeysValid = keyof z.infer<typeof createAssetSchema> extends keyof TablesInsert<"assets">
  ? true
  : ["Zod createAssetSchema has keys not in DB — check for a renamed column:", Exclude<keyof z.infer<typeof createAssetSchema>, keyof TablesInsert<"assets">>]

// ── Response helpers ────────────────────────────────────────────────────────

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const acc: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "root"
    if (!acc[key]) acc[key] = []
    acc[key].push(issue.message)
  }
  return acc
}

// ── Auth guard ──────────────────────────────────────────────────────────────

async function requireAuth(
  request: Request,
  env: FunctionsEnv,
): Promise<Response | null> {
  const { supabase } = createFunctionsClient(request, env)
  const { data } = await supabase.auth.getUser()
  if (!data.user) {
    return json({ errors: { root: ["Unauthorized"] } }, 401)
  }
  return null
}

// ── Storage helper ──────────────────────────────────────────────────────────

/**
 * Derives the storage object path from a full Supabase Storage URL.
 * Example URL: https://<project>.supabase.co/storage/v1/object/public/studio-assets/abc/file.png
 * Returns: abc/file.png
 */
function storagePathFromUrl(url: string, bucketName: string): string | null {
  const marker = `/storage/v1/object/public/${bucketName}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return url.slice(idx + marker.length)
}

// ── Route handlers ──────────────────────────────────────────────────────────

export async function onRequestGet(
  context: { request: Request; env: ApiEnv },
): Promise<Response> {
  const { request, env } = context

  const authError = await requireAuth(request, env)
  if (authError) return authError

  const admin = createAdminClient(env)

  const url = new URL(request.url)
  const projectId = url.searchParams.get("project_id")

  let query = admin.from("assets").select("*").order("created_at", { ascending: false })

  if (projectId) {
    query = query.eq("project_id", projectId)
  }

  const { data, error } = await query

  if (error) {
    return json({ errors: { root: ["Failed to fetch assets"] } }, 500)
  }

  return json({ ok: true, data: data ?? [] })
}

export async function onRequestPost(
  context: { request: Request; env: ApiEnv },
): Promise<Response> {
  const { request, env } = context

  const authError = await requireAuth(request, env)
  if (authError) return authError

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ errors: { root: ["Invalid JSON body"] } }, 400)
  }

  const parsed = createAssetSchema.safeParse(body)
  if (!parsed.success) {
    return json({ ok: false, errors: formatZodErrors(parsed.error) }, 422)
  }

  const { url: assetUrl, type, project_id, meta } = parsed.data
  const admin = createAdminClient(env)

  const { data, error } = await admin
    .from("assets")
    .insert({
      url: assetUrl,
      type,
      project_id: project_id || null,
      meta: meta ?? null,
    })
    .select("*")
    .single()

  if (error) {
    return json({ ok: false, errors: { root: ["Failed to create asset"] } }, 500)
  }

  return json({ ok: true, data }, 201)
}

export async function onRequestDelete(
  context: { request: Request; env: ApiEnv },
): Promise<Response> {
  const { request, env } = context

  const authError = await requireAuth(request, env)
  if (authError) return authError

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ errors: { root: ["Invalid JSON body"] } }, 400)
  }

  const parsed = deleteAssetSchema.safeParse(body)
  if (!parsed.success) {
    return json({ ok: false, errors: formatZodErrors(parsed.error) }, 422)
  }

  const admin = createAdminClient(env)

  // Fetch the asset first to get its URL for storage cleanup
  const { data: asset } = await admin
    .from("assets")
    .select("url")
    .eq("id", parsed.data.id)
    .single()

  // Delete from the database
  const { error } = await admin
    .from("assets")
    .delete()
    .eq("id", parsed.data.id)

  if (error) {
    return json({ ok: false, errors: { root: ["Failed to delete asset"] } }, 500)
  }

  // Attempt storage cleanup (best-effort, don't fail the request)
  if (asset?.url) {
    const path = storagePathFromUrl(asset.url, "studio-assets")
    if (path) {
      try {
        await admin.storage.from("studio-assets").remove([path])
      } catch {
        // Storage cleanup is best-effort
      }
    }
  }

  return json({ ok: true, data: undefined })
}
