// Next.js API route handler for /api/projects
//
// Mirrors Cloudflare Pages Functions at functions/api/projects.ts for local
// development (next dev). Uses the admin client directly so the route remains
// compatible with static export builds where it produces a stub response.
// In production, Cloudflare Functions handle the route.
//
// Architecture: mirrors functions/api/projects.ts — direct admin client.

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import type { Json, TablesUpdate } from "@/supabase/types/database"
import { z } from "zod"

// ── Route segment config ────────────────────────────────────────────────────

export const dynamic = "force-static"

// ── Helpers ─────────────────────────────────────────────────────────────────

function json(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data, { status })
}

// ── Auth guard ──────────────────────────────────────────────────────────────

async function requireAuth(): Promise<NextResponse | null> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) {
    return json({ ok: false, errors: { root: ["Unauthorized"] } }, 401)
  }
  return null
}

// ── Zod schemas ────────────────────────────────────────────────────────────

const projectStatuses = [
  "draft",
  "published",
  "archived",
  "Live",
  "Building",
  "Experiment",
  "Dormant",
] as const

const createProjectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be under 200 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200, "Slug must be under 200 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase letters, numbers, and hyphens only",
    ),
  summary: z
    .string()
    .max(500, "Summary must be under 500 characters")
    .optional()
    .or(z.literal("")),
  body: z.string().optional().or(z.literal("")),
  description: z
    .string()
    .max(1000, "Description must be under 1000 characters")
    .optional()
    .or(z.literal("")),
  status: z.enum(projectStatuses).optional().default("draft"),
  kind: z.string().max(100).optional().or(z.literal("")),
  version: z.string().max(50).optional().or(z.literal("")),
  hosting_stack: z.record(z.string(), z.unknown()).nullable().optional(),
  tech_stack: z.array(z.unknown()).nullable().optional(),
  updates_future_plans: z.string().nullable().optional().or(z.literal("")),
})

const updateProjectSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be under 200 characters")
    .optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200, "Slug must be under 200 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase letters, numbers, and hyphens only",
    )
    .optional(),
  summary: z
    .string()
    .max(500, "Summary must be under 500 characters")
    .optional()
    .or(z.literal("")),
  body: z.string().optional().or(z.literal("")),
  description: z
    .string()
    .max(1000, "Description must be under 1000 characters")
    .optional()
    .or(z.literal("")),
  status: z.enum(projectStatuses).optional(),
  kind: z.string().max(100).optional().or(z.literal("")),
  version: z.string().max(50).optional().or(z.literal("")),
  hosting_stack: z.record(z.string(), z.unknown()).nullable().optional(),
  tech_stack: z.array(z.unknown()).nullable().optional(),
  updates_future_plans: z.string().nullable().optional().or(z.literal("")),
})

const deleteProjectSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
})

// ── Response helpers ────────────────────────────────────────────────────────

function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const acc: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "root"
    if (!acc[key]) acc[key] = []
    acc[key].push(issue.message)
  }
  return acc
}

// ── GET /api/projects[?id=...] ──────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  const admin = createAdminClient()

  const id = request.nextUrl.searchParams.get("id")
  if (id) {
    const { data, error } = await admin
      .from("projects")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return json({ ok: false, errors: { root: ["Project not found"] } }, 404)
      }
      return json({ ok: false, errors: { root: ["Failed to fetch project"] } }, 500)
    }

    return json({ ok: true, data })
  }

  const { data, error } = await admin
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false })

  if (error) {
    return json({ ok: false, errors: { root: ["Failed to fetch projects"] } }, 500)
  }

  return json({ ok: true, data: data ?? [] })
}

// ── POST /api/projects ──────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, errors: { root: ["Invalid JSON body"] } }, 400)
  }

  const parsed = createProjectSchema.safeParse(body)
  if (!parsed.success) {
    return json({ ok: false, errors: formatZodErrors(parsed.error) }, 422)
  }

  const {
    title,
    slug,
    summary,
    body: projectBody,
    description,
    status,
    kind,
    version,
    hosting_stack,
    tech_stack,
    updates_future_plans,
  } = parsed.data

  const admin = createAdminClient()

  const { data, error } = await admin
    .from("projects")
    .insert({
      title,
      slug,
      summary: summary || null,
      body: projectBody || null,
      description: description || null,
      status,
      kind: kind || null,
      version: version || null,
      hosting_stack: (hosting_stack as Json) ?? null,
      tech_stack: (tech_stack as Json) ?? null,
      updates_future_plans: updates_future_plans || null,
    })
    .select("*")
    .single()

  if (error) {
    if (error.code === "23505") {
      return json(
        { ok: false, errors: { slug: ["A project with this slug already exists"] } },
        409,
      )
    }
    return json(
      { ok: false, errors: { root: ["Failed to create project"] } },
      500,
    )
  }

  return json({ ok: true, data }, 201)
}

// ── PUT /api/projects ───────────────────────────────────────────────────────

export async function PUT(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, errors: { root: ["Invalid JSON body"] } }, 400)
  }

  const parsed = updateProjectSchema.safeParse(body)
  if (!parsed.success) {
    return json({ ok: false, errors: formatZodErrors(parsed.error) }, 422)
  }

  const { id, ...fields } = parsed.data

  const payload: TablesUpdate<"projects"> = {}
  if (fields.title !== undefined) payload.title = fields.title
  if (fields.slug !== undefined) payload.slug = fields.slug
  if (fields.summary !== undefined)
    payload.summary = fields.summary === "" ? null : fields.summary
  if (fields.body !== undefined)
    payload.body = fields.body === "" ? null : fields.body
  if (fields.description !== undefined)
    payload.description = fields.description === "" ? null : fields.description
  if (fields.status !== undefined) payload.status = fields.status
  if (fields.kind !== undefined)
    payload.kind = fields.kind === "" ? null : fields.kind
  if (fields.version !== undefined)
    payload.version = fields.version === "" ? null : fields.version
  if (fields.hosting_stack !== undefined)
    payload.hosting_stack = fields.hosting_stack as Json
  if (fields.tech_stack !== undefined)
    payload.tech_stack = fields.tech_stack as Json
  if (fields.updates_future_plans !== undefined)
    payload.updates_future_plans =
      fields.updates_future_plans === "" ? null : fields.updates_future_plans

  if (Object.keys(payload).length === 0) {
    return json({ ok: false, errors: { root: ["No changes to save"] } }, 422)
  }

  const admin = createAdminClient()

  const { data, error } = await admin
    .from("projects")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single()

  if (error) {
    if (error.code === "23505") {
      return json(
        { ok: false, errors: { slug: ["A project with this slug already exists"] } },
        409,
      )
    }
    return json(
      { ok: false, errors: { root: ["Failed to update project"] } },
      500,
    )
  }

  return json({ ok: true, data })
}

// ── DELETE /api/projects ────────────────────────────────────────────────────

export async function DELETE(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, errors: { root: ["Invalid JSON body"] } }, 400)
  }

  const parsed = deleteProjectSchema.safeParse(body)
  if (!parsed.success) {
    return json({ ok: false, errors: formatZodErrors(parsed.error) }, 422)
  }

  const admin = createAdminClient()

  // Cascade: delete associated assets first (best-effort)
  try {
    await admin.from("assets").delete().eq("project_id", parsed.data.id)
  } catch {
    // Best-effort cascade
  }

  const { error } = await admin
    .from("projects")
    .delete()
    .eq("id", parsed.data.id)

  if (error) {
    return json(
      { ok: false, errors: { root: ["Failed to delete project"] } },
      500,
    )
  }

  return json({ ok: true, data: undefined })
}
