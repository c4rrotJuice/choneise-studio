import { supabase } from "@/lib/supabase/browser"
import { createAdminClient } from "@/lib/supabase/admin"
import type { Database } from "@/supabase/types/database"
import type { ContentResult } from "@/lib/content/projects"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TagRow = Database["public"]["Tables"]["tags"]["Row"]

// ---------------------------------------------------------------------------
// Reads (anon)
// ---------------------------------------------------------------------------

export async function listTags(): Promise<ContentResult<TagRow[]>> {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .order("name", { ascending: true })

  if (error) return { data: null, error: error.message }

  return { data, error: null }
}

// ---------------------------------------------------------------------------
// Writes (service_role – server-only)
// ---------------------------------------------------------------------------

export async function assignTagToProject(
  projectId: string,
  tagId: string,
): Promise<ContentResult<null>> {
  const admin = createAdminClient()

  const { error } = await admin
    .from("project_tags")
    .insert({ project_id: projectId, tag_id: tagId })

  if (error) return { data: null, error: error.message }

  return { data: null, error: null }
}
