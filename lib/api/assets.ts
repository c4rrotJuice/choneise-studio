// ── Types ───────────────────────────────────────────────────────────────────

export type AssetRow = {
  id: string;
  project_id: string | null;
  url: string;
  type: string;
  meta: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type ApiError = { ok: false; errors: Record<string, string[]> };
export type ApiSuccess<T = void> = { ok: true; data: T };
export type ApiResult<T = void> = ApiSuccess<T> | ApiError;

// ── Helpers ─────────────────────────────────────────────────────────────────

const API_BASE = "/api/assets";

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

export async function getAssets(projectId?: string): Promise<AssetRow[]> {
  const url = projectId
    ? `${API_BASE}?project_id=${encodeURIComponent(projectId)}`
    : API_BASE;

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok) return [];
  return (json as ApiResult<AssetRow[]>).ok
    ? (json as ApiSuccess<AssetRow[]>).data
    : [];
}

export async function createAsset(payload: {
  url: string;
  type: "image" | "document";
  project_id?: string;
  meta?: Record<string, unknown>;
}): Promise<ApiResult<AssetRow>> {
  return apiFetch<AssetRow>({
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAssetProject(
  id: string,
  projectId: string | null,
): Promise<ApiResult<AssetRow>> {
  return apiFetch<AssetRow>({
    method: "PATCH",
    body: JSON.stringify({ id, project_id: projectId }),
  });
}

export async function deleteAsset(id: string): Promise<ApiResult> {
  return apiFetch({
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}
