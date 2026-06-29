// Next.js API route handler for /api/assets
//
// This mirrors the Cloudflare Pages Functions at functions/api/assets.ts
// for local development (next dev). Uses the admin client directly (not
// server actions) so the route remains compatible with static export builds
// where it produces a stub response. In production, Cloudflare Functions
// handle the route instead.
//
// Architecture: mirrors functions/api/assets.ts — direct admin client,
// no server actions.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/supabase/types/database";

// ── Route segment config ────────────────────────────────────────────────────

export const dynamic = "force-static";

// ── Helpers ─────────────────────────────────────────────────────────────────

function json(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

function errors(messages: string[], status = 400): NextResponse {
  return json({ ok: false, errors: { root: messages } }, status);
}

// ── Auth guard ──────────────────────────────────────────────────────────────

async function requireAuth(): Promise<NextResponse | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return json({ ok: false, errors: { root: ["Unauthorized"] } }, 401);
  }
  return null;
}

// ── Storage helper ──────────────────────────────────────────────────────────

function storagePathFromUrl(url: string, bucketName: string): string | null {
  const marker = `/storage/v1/object/public/${bucketName}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

// ── GET /api/assets[?project_id=...] ────────────────────────────────────────

export async function GET(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const admin = createAdminClient();
  const projectId = request.nextUrl.searchParams.get("project_id") ?? undefined;

  let query = admin.from("assets").select("*");

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    return json(
      { ok: false, errors: { root: ["Failed to fetch assets"] } },
      500,
    );
  }

  return json({ ok: true, data: data ?? [] });
}

// ── POST /api/assets ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errors(["Invalid JSON body"]);
  }

  if (!body || typeof body !== "object") {
    return errors(["Request body must be a JSON object"]);
  }

  const { url, type, project_id, meta } = body as Record<string, unknown>;

  if (!url || typeof url !== "string") {
    return json({ ok: false, errors: { url: ["URL is required"] } }, 422);
  }

  if (type !== "image" && type !== "document") {
    return json(
      { ok: false, errors: { type: ['Type must be "image" or "document"'] } },
      422,
    );
  }

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("assets")
    .insert({
      url,
      type,
      project_id: (project_id as string) ?? null,
      meta: (meta ?? null) as Json,
    })
    .select("*")
    .single();

  if (error) {
    return json(
      { ok: false, errors: { root: ["Failed to create asset"] } },
      500,
    );
  }

  return json({ ok: true, data }, 201);
}

// ── PATCH /api/assets ─────────────────────────────────────────────────────

export async function PATCH(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errors(["Invalid JSON body"]);
  }

  if (!body || typeof body !== "object") {
    return errors(["Request body must be a JSON object"]);
  }

  const { id, project_id } = body as Record<string, unknown>;

  if (!id || typeof id !== "string") {
    return json({ ok: false, errors: { id: ["Asset ID is required"] } }, 422);
  }

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("assets")
    .update({ project_id: (project_id ?? null) as string | null })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return json(
      { ok: false, errors: { root: ["Failed to update asset"] } },
      500,
    );
  }

  return json({ ok: true, data });
}

// ── DELETE /api/assets ─────────────────────────────────────────────────────

export async function DELETE(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errors(["Invalid JSON body"]);
  }

  if (!body || typeof body !== "object") {
    return errors(["Request body must be a JSON object"]);
  }

  const { id } = body as Record<string, unknown>;

  if (!id || typeof id !== "string") {
    return json({ ok: false, errors: { id: ["Asset ID is required"] } }, 422);
  }

  const admin = createAdminClient();

  // Fetch the asset first to get its URL for storage cleanup
  const { data: asset } = await admin
    .from("assets")
    .select("url")
    .eq("id", id)
    .single();

  const { error } = await admin.from("assets").delete().eq("id", id);

  if (error) {
    return json(
      { ok: false, errors: { root: ["Failed to delete asset"] } },
      500,
    );
  }

  // Best-effort storage cleanup
  if (asset?.url) {
    const path = storagePathFromUrl(asset.url, "studio-assets");
    if (path) {
      try {
        await admin.storage.from("studio-assets").remove([path]);
      } catch {
        // Storage cleanup is best-effort — don't fail the request
      }
    }
  }

  return json({ ok: true, data: undefined });
}
