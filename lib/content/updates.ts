import { supabase } from "@/lib/supabase/browser"
import { createAdminClient } from "@/lib/supabase/admin"
import type { Database } from "@/supabase/types/database"
import type { ContentResult } from "@/lib/content/projects"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type UpdateRow = Database["public"]["Tables"]["updates"]["Row"]
type UpdateInsert = Database["public"]["Tables"]["updates"]["Insert"]

// ---------------------------------------------------------------------------
// Reads (anon)
// ---------------------------------------------------------------------------

export async function listUpdates(
  projectId: string,
): Promise<ContentResult<UpdateRow[]>> {
  const { data, error } = await supabase
    .from("updates")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (error) return { data: null, error: error.message }

  return { data, error: null }
}

// ---------------------------------------------------------------------------
// Writes (service_role – server-only)
// ---------------------------------------------------------------------------

export async function createUpdate(
  input: UpdateInsert,
): Promise<ContentResult<UpdateRow>> {
  const admin = createAdminClient()

  const { data, error } = await admin
    .from("updates")
    .insert(input)
    .select("*")
    .single()

  if (error) return { data: null, error: error.message }

  return { data, error: null }
}
