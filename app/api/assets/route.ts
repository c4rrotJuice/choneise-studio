// Next.js API route handler for /api/assets
//
// This mirrors the Cloudflare Pages Functions at functions/api/assets.ts
// for local development (next dev). In production static exports, this file
// is not included — Cloudflare Functions handle the route instead.
//
// Architecture: delegates to the server actions in app/actions/assets.ts,
// which use the service_role Supabase client (bypasses RLS).

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { Json } from "@/supabase/types/database"
import {
  listAssets,
  createAssetRecord,
  deleteAssetRecord,
} from "@/app/actions/assets"

// ── Route segment config ────────────────────────────────────────────────────

export const dynamic = "force-static"

// ── Helpers ─────────────────────────────────────────────────────────────────

function json(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data, { status })
}

function errors(messages: string[], status = 400): NextResponse {
  return json({ ok: false, errors: { root: messages } }, status)
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

// ── GET /api/assets[?project_id=...] ────────────────────────────────────────

export async function GET(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  const projectId = request.nextUrl.searchParams.get("project_id") ?? undefined

  const result = await listAssets(projectId)

  if (!result.ok) {
    return errors([result.error], 500)
  }

  return json({ ok: true, data: result.data })
}

// ── POST /api/assets ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errors(["Invalid JSON body"])
  }

  // Minimal validation matching the Cloudflare Functions Zod schema
  if (!body || typeof body !== "object") {
    return errors(["Request body must be a JSON object"])
  }

  const { url, type, project_id, meta } = body as Record<string, unknown>

  if (!url || typeof url !== "string") {
    return json({ ok: false, errors: { url: ["URL is required"] } }, 422)
  }

  if (type !== "image" && type !== "document") {
    return json({ ok: false, errors: { type: ['Type must be "image" or "document"'] } }, 422)
  }

  const result = await createAssetRecord({
    url,
    type,
    project_id: (project_id as string) ?? null,
    meta: (meta ?? null) as Json,
  })

  if (!result.ok) {
    return errors([result.error], 500)
  }

  return json({ ok: true, data: result.data }, 201)
}

// ── DELETE /api/assets ─────────────────────────────────────────────────────

export async function DELETE(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errors(["Invalid JSON body"])
  }

  if (!body || typeof body !== "object") {
    return errors(["Request body must be a JSON object"])
  }

  const { id } = body as Record<string, unknown>

  if (!id || typeof id !== "string") {
    return json({ ok: false, errors: { id: ["Asset ID is required"] } }, 422)
  }

  const result = await deleteAssetRecord(id)

  if (!result.ok) {
    return errors([result.error], 500)
  }

  return json({ ok: true, data: undefined })
}
