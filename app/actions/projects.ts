"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"
import { requireAuth } from "@/lib/auth/guards"
import type { TablesInsert, TablesUpdate } from "@/supabase/types/database"

// ── Zod schemas ────────────────────────────────────────────────────────────

const projectStatuses = ["draft", "published", "archived"] as const

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
  status: z.enum(projectStatuses).optional().default("draft"),
})

const updateProjectSchema = z.object({
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
  status: z.enum(projectStatuses).optional(),
})

// ── Result types ────────────────────────────────────────────────────────────

type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; errors: Record<string, string[]> }

export type ProjectRow = {
  id: string
  slug: string
  title: string
  summary: string | null
  body: string | null
  status: string
  created_at: string
  updated_at: string
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const acc: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "root"
    if (!acc[key]) acc[key] = []
    acc[key].push(issue.message)
  }
  return acc
}

function mapRow(row: Record<string, unknown>): ProjectRow {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    summary: (row.summary as string) ?? null,
    body: (row.body as string) ?? null,
    status: row.status as string,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  }
}

// ── Actions ─────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<ProjectRow[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("getProjects error:", error)
    return []
  }

  return (data ?? []).map(mapRow)
}

export async function getProject(id: string): Promise<ProjectRow | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("getProject error:", error)
    return null
  }

  return data ? mapRow(data) : null
}

export async function createProject(
  _prev: ActionResult<ProjectRow> | null,
  formData: FormData,
): Promise<ActionResult<ProjectRow>> {
  await requireAuth()

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    body: formData.get("body"),
    status: formData.get("status"),
  }

  const parsed = createProjectSchema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, errors: formatZodErrors(parsed.error) }
  }

  const { title, slug, summary, body, status } = parsed.data

  const supabase = createAdminClient()

  // Cast: summary/body not yet in generated types (pending migration 0003 + gen:types)
  const insertPayload = {
    title,
    slug,
    summary: summary || null,
    body: body || null,
    status,
  } as TablesInsert<"projects">

  const { data, error } = await supabase
    .from("projects")
    .insert(insertPayload)
    .select("*")
    .single()

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        errors: { slug: ["A project with this slug already exists"] },
      }
    }
    console.error("createProject error:", error)
    return { ok: false, errors: { root: ["Failed to create project"] } }
  }

  revalidatePath("/console/projects")
  return { ok: true, data: mapRow(data) }
}

export async function updateProject(
  _prev: ActionResult<ProjectRow> | null,
  formData: FormData,
): Promise<ActionResult<ProjectRow>> {
  await requireAuth()

  const id = formData.get("id")
  if (!id || typeof id !== "string") {
    return { ok: false, errors: { root: ["Project ID is required"] } }
  }

  const raw = {
    title: formData.get("title") || undefined,
    slug: formData.get("slug") || undefined,
    summary: formData.get("summary"),
    body: formData.get("body"),
    status: formData.get("status") || undefined,
  }

  const parsed = updateProjectSchema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, errors: formatZodErrors(parsed.error) }
  }

  const supabase = createAdminClient()

  // Build update payload excluding undefined fields
  const payload: Record<string, string | null> = {}
  for (const [key, value] of Object.entries(parsed.data)) {
    if (value !== undefined) {
      payload[key] = value === "" ? null : (value as string)
    }
  }

  if (Object.keys(payload).length === 0) {
    return { ok: false, errors: { root: ["No changes to save"] } }
  }

  // Cast: summary/body not yet in generated types (pending migration 0003 + gen:types)
  const { data, error } = await supabase
    .from("projects")
    .update(payload as TablesUpdate<"projects">)
    .eq("id", id)
    .select("*")
    .single()

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        errors: { slug: ["A project with this slug already exists"] },
      }
    }
    console.error("updateProject error:", error)
    return { ok: false, errors: { root: ["Failed to update project"] } }
  }

  revalidatePath("/console/projects")
  return { ok: true, data: mapRow(data) }
}

export async function deleteProject(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth()

  const id = formData.get("id")
  if (!id || typeof id !== "string") {
    return { ok: false, errors: { root: ["Project ID is required"] } }
  }

  const supabase = createAdminClient()

  const { error } = await supabase.from("projects").delete().eq("id", id)

  if (error) {
    console.error("deleteProject error:", error)
    return { ok: false, errors: { root: ["Failed to delete project"] } }
  }

  revalidatePath("/console/projects")
  return { ok: true, data: undefined }
}
