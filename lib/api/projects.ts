// ── Types ───────────────────────────────────────────────────────────────────

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string | null;
  description: string | null;
  status: string;
  kind: string | null;
  version: string | null;
  hosting_stack: Record<string, unknown> | null;
  tech_stack: unknown[] | null;
  updates_future_plans: string | null;
  created_at: string;
  updated_at: string;
};

export type ApiError = { ok: false; errors: Record<string, string[]> };
export type ApiSuccess<T = void> = { ok: true; data: T };
export type ApiResult<T = void> = ApiSuccess<T> | ApiError;

// ── Helpers ─────────────────────────────────────────────────────────────────

const API_BASE = "/api/projects";

async function apiFetch<T>(init?: RequestInit): Promise<ApiResult<T>> {
  const res = await fetch(API_BASE, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  const json = await res.json();

  if (!res.ok) {
    return {
      ok: false,
      errors: json.errors ?? {
        root: [`Request failed with status ${res.status}`],
      },
    };
  }

  return json as ApiResult<T>;
}

// ── Public API ──────────────────────────────────────────────────────────────

export async function getProjects(): Promise<ProjectRow[]> {
  const result = await apiFetch<ProjectRow[]>();
  if (!result.ok) return [];
  return result.data;
}

export async function getProject(id: string): Promise<ProjectRow | null> {
  const url = `${API_BASE}?id=${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok) return null;
  return (json as ApiResult<ProjectRow>).ok
    ? (json as ApiSuccess<ProjectRow>).data
    : null;
}

export async function createProject(payload: {
  title: string;
  slug: string;
  summary?: string;
  body?: string;
  description?: string;
  status?: string;
  kind?: string;
  version?: string;
  hosting_stack?: Record<string, unknown> | null;
  tech_stack?: unknown[] | null;
  updates_future_plans?: string | null;
}): Promise<ApiResult<ProjectRow>> {
  return apiFetch<ProjectRow>({
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateProject(payload: {
  id: string;
  title?: string;
  slug?: string;
  summary?: string;
  body?: string;
  description?: string;
  status?: string;
  kind?: string;
  version?: string;
  hosting_stack?: Record<string, unknown> | null;
  tech_stack?: unknown[] | null;
  updates_future_plans?: string | null;
}): Promise<ApiResult<ProjectRow>> {
  return apiFetch<ProjectRow>({
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteProject(id: string): Promise<ApiResult> {
  return apiFetch({
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}
