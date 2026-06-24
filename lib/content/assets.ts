import { supabase } from "@/lib/supabase/browser"
import { createAdminClient } from "@/lib/supabase/admin"
import type { Database } from "@/supabase/types/database"
import type { ContentResult } from "@/lib/content/projects"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AssetRow = Database["public"]["Tables"]["assets"]["Row"]
type AssetInsert = Database["public"]["Tables"]["assets"]["Insert"]

// ---------------------------------------------------------------------------
// Reads (anon)
// ---------------------------------------------------------------------------

export async function listAssets(
  projectId?: string,
): Promise<ContentResult<AssetRow[]>> {
  let query = supabase.from("assets").select("*")

  if (projectId) {
    query = query.eq("project_id", projectId)
  }

  const { data, error } = await query.order("created_at", {
    ascending: false,
  })

  if (error) return { data: null, error: error.message }

  return { data, error: null }
}

// ---------------------------------------------------------------------------
// Writes (service_role – server-only)
// ---------------------------------------------------------------------------

export async function createAsset(
  input: AssetInsert,
): Promise<ContentResult<AssetRow>> {
  const admin = createAdminClient()

  const { data, error } = await admin
    .from("assets")
    .insert(input)
    .select("*")
    .single()

  if (error) return { data: null, error: error.message }

  return { data, error: null }
}
