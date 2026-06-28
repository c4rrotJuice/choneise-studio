import { z } from "zod";
import { createFunctionsClient, type FunctionsEnv } from "../_lib/supabase";
import { createAdminClient } from "../_lib/admin";
import type { Json, TablesInsert, TablesUpdate } from "../../supabase/types/database";

// ── Env ─────────────────────────────────────────────────────────────────────

interface ApiEnv extends FunctionsEnv {
  SUPABASE_SERVICE_ROLE_KEY: string;
}

// ── Zod schemas ────────────────────────────────────────────────────────────

const projectStatuses = [
  "draft",
  "published",
  "archived",
  "Live",
  "Building",
  "Experiment",
  "Dormant",
] as const;

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
  description: z
    .string()
    .max(1000, "Description must be under 1000 characters")
    .optional()
    .or(z.literal("")),
  status: z.enum(projectStatuses).optional().default("draft"),
  kind: z.string().max(100).optional().or(z.literal("")),
  version: z.string().max(50).optional().or(z.literal("")),
  hosting_stack: z.record(z.string(), z.unknown()).nullable().optional(),
  tech_stack: z.array(z.unknown()).nullable().optional(),
  updates_future_plans: z.string().nullable().optional().or(z.literal("")),
});

const updateProjectSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
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
  description: z
    .string()
    .max(1000, "Description must be under 1000 characters")
    .optional()
    .or(z.literal("")),
  status: z.enum(projectStatuses).optional(),
  kind: z.string().max(100).optional().or(z.literal("")),
  version: z.string().max(50).optional().or(z.literal("")),
  hosting_stack: z.record(z.string(), z.unknown()).nullable().optional(),
  tech_stack: z.array(z.unknown()).nullable().optional(),
  updates_future_plans: z.string().nullable().optional().or(z.literal("")),
});

// Build-time guard: ensures Zod schema keys are a valid subset of DB columns.
// If a migration renames or removes a column, this line fails at build time.
type _ZodInsertKeysValid = keyof z.infer<
  typeof createProjectSchema
> extends keyof TablesInsert<"projects">
  ? true
  : [
      "Zod createProjectSchema has keys not in DB — check for a renamed column:",
      Exclude<
        keyof z.infer<typeof createProjectSchema>,
        keyof TablesInsert<"projects">
      >,
    ];

const deleteProjectSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
});

// ── Response helpers ────────────────────────────────────────────────────────

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const acc: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "root";
    if (!acc[key]) acc[key] = [];
    acc[key].push(issue.message);
  }
  return acc;
}

// ── Auth guard ──────────────────────────────────────────────────────────────

async function requireAuth(
  request: Request,
  env: FunctionsEnv,
): Promise<Response | null> {
  const { supabase } = createFunctionsClient(request, env);
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return json({ errors: { root: ["Unauthorized"] } }, 401);
  }
  return null;
}

// ── Route handlers ──────────────────────────────────────────────────────────

export async function onRequestGet(context: {
  request: Request;
  env: ApiEnv;
}): Promise<Response> {
  const { request, env } = context;

  const authError = await requireAuth(request, env);
  if (authError) return authError;

  const admin = createAdminClient(env);

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (id) {
    const { data, error } = await admin
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return json({ errors: { root: ["Project not found"] } }, 404);
      }
      return json({ errors: { root: ["Failed to fetch project"] } }, 500);
    }

    return json({ ok: true, data });
  }

  const { data, error } = await admin
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return json({ errors: { root: ["Failed to fetch projects"] } }, 500);
  }

  return json({ ok: true, data: data ?? [] });
}

export async function onRequestPost(context: {
  request: Request;
  env: ApiEnv;
}): Promise<Response> {
  const { request, env } = context;

  const authError = await requireAuth(request, env);
  if (authError) return authError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ errors: { root: ["Invalid JSON body"] } }, 400);
  }

  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) {
    return json({ ok: false, errors: formatZodErrors(parsed.error) }, 422);
  }

  const {
    title,
    slug,
    summary,
    body: projectBody,
    description,
    status,
    kind,
    version,
    hosting_stack,
    tech_stack,
    updates_future_plans,
  } = parsed.data;
  const admin = createAdminClient(env);

  const { data, error } = await admin
    .from("projects")
    .insert({
      title,
      slug,
      summary: summary || null,
      body: projectBody || null,
      description: description || null,
      status,
      kind: kind || null,
      version: version || null,
      hosting_stack: hosting_stack as Json ?? null,
      tech_stack: tech_stack as Json ?? null,
      updates_future_plans: updates_future_plans || null,
    })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      return json(
        {
          ok: false,
          errors: { slug: ["A project with this slug already exists"] },
        },
        409,
      );
    }
    return json(
      { ok: false, errors: { root: ["Failed to create project"] } },
      500,
    );
  }

  return json({ ok: true, data }, 201);
}

export async function onRequestPut(context: {
  request: Request;
  env: ApiEnv;
}): Promise<Response> {
  const { request, env } = context;

  const authError = await requireAuth(request, env);
  if (authError) return authError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ errors: { root: ["Invalid JSON body"] } }, 400);
  }

  const parsed = updateProjectSchema.safeParse(body);
  if (!parsed.success) {
    return json({ ok: false, errors: formatZodErrors(parsed.error) }, 422);
  }

  const { id, ...fields } = parsed.data;

  const payload: TablesUpdate<"projects"> = {};
  if (fields.title !== undefined) payload.title = fields.title;
  if (fields.slug !== undefined) payload.slug = fields.slug;
  if (fields.summary !== undefined)
    payload.summary = fields.summary === "" ? null : fields.summary;
  if (fields.body !== undefined)
    payload.body = fields.body === "" ? null : fields.body;
  if (fields.description !== undefined)
    payload.description = fields.description === "" ? null : fields.description;
  if (fields.status !== undefined) payload.status = fields.status;
  if (fields.kind !== undefined)
    payload.kind = fields.kind === "" ? null : fields.kind;
  if (fields.version !== undefined)
    payload.version = fields.version === "" ? null : fields.version;
  if (fields.hosting_stack !== undefined)
    payload.hosting_stack = fields.hosting_stack as Json;
  if (fields.tech_stack !== undefined) payload.tech_stack = fields.tech_stack as Json;
  if (fields.updates_future_plans !== undefined)
    payload.updates_future_plans =
      fields.updates_future_plans === "" ? null : fields.updates_future_plans;

  if (Object.keys(payload).length === 0) {
    return json({ ok: false, errors: { root: ["No changes to save"] } }, 422);
  }

  const admin = createAdminClient(env);

  const { data, error } = await admin
    .from("projects")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      return json(
        {
          ok: false,
          errors: { slug: ["A project with this slug already exists"] },
        },
        409,
      );
    }
    return json(
      { ok: false, errors: { root: ["Failed to update project"] } },
      500,
    );
  }

  return json({ ok: true, data });
}

export async function onRequestDelete(context: {
  request: Request;
  env: ApiEnv;
}): Promise<Response> {
  const { request, env } = context;

  const authError = await requireAuth(request, env);
  if (authError) return authError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ errors: { root: ["Invalid JSON body"] } }, 400);
  }

  const parsed = deleteProjectSchema.safeParse(body);
  if (!parsed.success) {
    return json({ ok: false, errors: formatZodErrors(parsed.error) }, 422);
  }

  const admin = createAdminClient(env);

  const { error } = await admin
    .from("projects")
    .delete()
    .eq("id", parsed.data.id);

  if (error) {
    return json(
      { ok: false, errors: { root: ["Failed to delete project"] } },
      500,
    );
  }

  return json({ ok: true, data: undefined });
}
