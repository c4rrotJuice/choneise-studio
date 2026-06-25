import { createAuthClient } from "@/lib/auth/client"
import { createAdminClient } from "@/lib/supabase/admin"
import type { Database } from "@/supabase/types/database"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"]
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"]
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"]

export type ContentResult<T> = { data: T | null; error: string | null }

// ---------------------------------------------------------------------------
// Reads (anon – browser / server compatible)
// ---------------------------------------------------------------------------

export async function getProjects(): Promise<ContentResult<ProjectRow[]>> {
  const supabase = createAuthClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return { data: null, error: error.message }

  return { data, error: null }
}

export async function getProject(
  slug: string,
): Promise<ContentResult<ProjectRow>> {
  const supabase = createAuthClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error) return { data: null, error: error.message }

  return { data, error: null }
}

// ---------------------------------------------------------------------------
// Writes (service_role – server-only)
// ---------------------------------------------------------------------------

export async function createProject(
  input: ProjectInsert,
): Promise<ContentResult<ProjectRow>> {
  const admin = createAdminClient()

  const { data, error } = await admin
    .from("projects")
    .insert(input)
    .select("*")
    .single()

  if (error) return { data: null, error: error.message }

  return { data, error: null }
}

export async function updateProject(
  id: string,
  input: ProjectUpdate,
): Promise<ContentResult<ProjectRow>> {
  const admin = createAdminClient()

  const { data, error } = await admin
    .from("projects")
    .update(input)
    .eq("id", id)
    .select("*")
    .single()

  if (error) return { data: null, error: error.message }

  return { data, error: null }
}
