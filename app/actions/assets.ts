"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import type { Database, Json } from "@/supabase/types/database"

// ── Types ───────────────────────────────────────────────────────────────────

type AssetRow = Database["public"]["Tables"]["assets"]["Row"]

type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string }

// ── List ────────────────────────────────────────────────────────────────────

export async function listAssets(projectId?: string): Promise<ActionResult<AssetRow[]>> {
  try {
    const admin = createAdminClient()

    let query = admin.from("assets").select("*").order("created_at", { ascending: false })

    if (projectId) {
      query = query.eq("project_id", projectId)
    }

    const { data, error } = await query

    if (error) return { ok: false, error: error.message }

    return { ok: true, data: data as AssetRow[] }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to list assets" }
  }
}

// ── Create ──────────────────────────────────────────────────────────────────

export async function createAssetRecord(payload: {
  url: string
  type: "image" | "document"
  project_id?: string | null
  meta?: Json | null
}): Promise<ActionResult<AssetRow>> {
  try {
    const admin = createAdminClient()

    const { data, error } = await admin
      .from("assets")
      .insert({
        url: payload.url,
        type: payload.type,
        project_id: payload.project_id ?? null,
        meta: (payload.meta ?? null) as unknown as Json | null,
      })
      .select("*")
      .single()

    if (error) return { ok: false, error: error.message }

    return { ok: true, data: data as AssetRow }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create asset" }
  }
}

// ── Delete ──────────────────────────────────────────────────────────────────

export async function deleteAssetRecord(id: string): Promise<ActionResult> {
  try {
    const admin = createAdminClient()

    // Fetch the asset to get its storage URL
    const { data: asset } = await admin
      .from("assets")
      .select("url")
      .eq("id", id)
      .single()

    const { error } = await admin.from("assets").delete().eq("id", id)

    if (error) return { ok: false, error: error.message }

    // Best-effort storage cleanup
    if (asset?.url) {
      const marker = "/storage/v1/object/public/studio-assets/"
      const idx = asset.url.indexOf(marker)
      if (idx !== -1) {
        const path = asset.url.slice(idx + marker.length)
        try {
          await admin.storage.from("studio-assets").remove([path])
        } catch {
          // Storage cleanup is best-effort
        }
      }
    }

    return { ok: true, data: undefined }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to delete asset" }
  }
}
