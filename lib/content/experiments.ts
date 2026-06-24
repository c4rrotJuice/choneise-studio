import { supabase } from "@/lib/supabase/browser"
import { createAdminClient } from "@/lib/supabase/admin"
import type { Database } from "@/supabase/types/database"
import type { ContentResult } from "@/lib/content/projects"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ExperimentRow = Database["public"]["Tables"]["experiments"]["Row"]
type ExperimentInsert = Database["public"]["Tables"]["experiments"]["Insert"]

// ---------------------------------------------------------------------------
// Reads (anon)
// ---------------------------------------------------------------------------

export async function listExperiments(
  projectId: string,
): Promise<ContentResult<ExperimentRow[]>> {
  const { data, error } = await supabase
    .from("experiments")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (error) return { data: null, error: error.message }

  return { data, error: null }
}

// ---------------------------------------------------------------------------
// Writes (service_role – server-only)
// ---------------------------------------------------------------------------

export async function createExperiment(
  input: ExperimentInsert,
): Promise<ContentResult<ExperimentRow>> {
  const admin = createAdminClient()

  const { data, error } = await admin
    .from("experiments")
    .insert(input)
    .select("*")
    .single()

  if (error) return { data: null, error: error.message }

  return { data, error: null }
}
