"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Database, Json, TablesUpdate } from "@/supabase/types/database";

// ── Types ───────────────────────────────────────────────────────────────────

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type ProjectUpdate = TablesUpdate<"projects">;

type ActionResult<T = void> =
  { ok: true; data: T } | { ok: false; error: string };

// ── List ────────────────────────────────────────────────────────────────────

export async function listProjects(): Promise<ActionResult<ProjectRow[]>> {
  try {
    const admin = createAdminClient();

    const { data, error } = await admin
      .from("projects")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) return { ok: false, error: error.message };

    return { ok: true, data: data as ProjectRow[] };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to list projects",
    };
  }
}

// ── Get by ID ──────────────────────────────────────────────────────────────

export async function getProjectById(
  id: string,
): Promise<ActionResult<ProjectRow>> {
  try {
    const admin = createAdminClient();

    const { data, error } = await admin
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return { ok: false, error: error.message };

    return { ok: true, data: data as ProjectRow };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to fetch project",
    };
  }
}

// ── Create ──────────────────────────────────────────────────────────────────

export async function createProjectRecord(payload: {
  title: string;
  slug: string;
  summary?: string | null;
  body?: string | null;
  description?: string | null;
  status?: string;
  kind?: string | null;
  version?: string | null;
  hosting_stack?: Json | null;
  tech_stack?: Json | null;
  updates_future_plans?: string | null;
}): Promise<ActionResult<ProjectRow>> {
  try {
    const admin = createAdminClient();

    const { data, error } = await admin
      .from("projects")
      .insert({
        title: payload.title,
        slug: payload.slug,
        summary: payload.summary ?? null,
        body: payload.body ?? null,
        description: payload.description ?? null,
        status: payload.status ?? "draft",
        kind: payload.kind ?? null,
        version: payload.version ?? null,
        hosting_stack: (payload.hosting_stack ?? null) as Json,
        tech_stack: (payload.tech_stack ?? null) as Json,
        updates_future_plans: payload.updates_future_plans ?? null,
      })
      .select("*")
      .single();

    if (error) return { ok: false, error: error.message };

    return { ok: true, data: data as ProjectRow };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to create project",
    };
  }
}

// ── Update ──────────────────────────────────────────────────────────────────

export async function updateProjectRecord(
  id: string,
  payload: {
    title?: string;
    slug?: string;
    summary?: string | null;
    body?: string | null;
    description?: string | null;
    status?: string;
    kind?: string | null;
    version?: string | null;
    hosting_stack?: Json | null;
    tech_stack?: Json | null;
    updates_future_plans?: string | null;
  },
): Promise<ActionResult<ProjectRow>> {
  try {
    const admin = createAdminClient();

    const updatePayload: ProjectUpdate = {};
    if (payload.title !== undefined) updatePayload.title = payload.title;
    if (payload.slug !== undefined) updatePayload.slug = payload.slug;
    if (payload.summary !== undefined) updatePayload.summary = payload.summary;
    if (payload.body !== undefined) updatePayload.body = payload.body;
    if (payload.description !== undefined)
      updatePayload.description = payload.description;
    if (payload.status !== undefined) updatePayload.status = payload.status;
    if (payload.kind !== undefined) updatePayload.kind = payload.kind;
    if (payload.version !== undefined) updatePayload.version = payload.version;
    if (payload.hosting_stack !== undefined)
      updatePayload.hosting_stack = payload.hosting_stack as Json;
    if (payload.tech_stack !== undefined)
      updatePayload.tech_stack = payload.tech_stack as Json;
    if (payload.updates_future_plans !== undefined)
      updatePayload.updates_future_plans = payload.updates_future_plans;

    const { data, error } = await admin
      .from("projects")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) return { ok: false, error: error.message };

    return { ok: true, data: data as ProjectRow };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update project",
    };
  }
}

// ── Delete ──────────────────────────────────────────────────────────────────

export async function deleteProjectRecord(id: string): Promise<ActionResult> {
  try {
    const admin = createAdminClient();

    // Cascade: delete associated assets first (best-effort)
    try {
      await admin.from("assets").delete().eq("project_id", id);
    } catch {
      // Best-effort cascade
    }

    const { error } = await admin.from("projects").delete().eq("id", id);

    if (error) return { ok: false, error: error.message };

    return { ok: true, data: undefined };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to delete project",
    };
  }
}

// ── Publish / status helpers ────────────────────────────────────────────────

export async function publishProject(
  id: string,
): Promise<ActionResult<ProjectRow>> {
  return updateProjectRecord(id, { status: "published" });
}

export async function unpublishProject(
  id: string,
): Promise<ActionResult<ProjectRow>> {
  return updateProjectRecord(id, { status: "draft" });
}

export async function archiveProject(
  id: string,
): Promise<ActionResult<ProjectRow>> {
  return updateProjectRecord(id, { status: "archived" });
}
