import { createClient } from "@/lib/supabase/server";
import type { ProjectCardProps } from "@/components/project/project-card";

/**
 * Derive the anchor href from a project's kind and slug.
 * Experiments link to /experiments, everything else to /projects.
 */
function projectHref(kind: string | null, slug: string): string {
  if (kind === "Experiment") {
    return `/experiments#${slug}`;
  }
  return `/projects#${slug}`;
}

/**
 * Fetch projects for public display.
 * Returns ProjectCardProps[] directly from the database.
 * Falls back to an empty array on any error (caller should provide hardcoded fallback).
 */
export async function getFeaturedProjects(): Promise<ProjectCardProps[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("projects")
      .select("slug, title, description, status, kind, version")
      .in("status", ["Live", "Building", "Experiment", "Dormant"])
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.warn(
        "getFeaturedProjects: Supabase query failed",
        error?.message,
      );
      return [];
    }

    return data.map((row) => ({
      description: row.description ?? "",
      href: projectHref(row.kind, row.slug),
      kind: row.kind ?? "",
      status: row.status as ProjectCardProps["status"],
      title: row.title,
      version: row.version ?? "",
    }));
  } catch (err) {
    console.warn("getFeaturedProjects: unexpected error", err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Published projects (for /projects discovery page)
// ---------------------------------------------------------------------------

export type PublishedProject = {
  slug: string;
  title: string;
  description: string | null;
  status: string;
  kind: string | null;
  version: string | null;
  summary: string | null;
  hosting_stack: Record<string, unknown> | null;
  tech_stack: unknown[] | null;
};

/**
 * Fetch public projects for the /projects discovery page.
 * Only returns projects where the `public` boolean column is true.
 * Returns an empty array on error (caller should handle empty state).
 */
export async function getPublishedProjects(): Promise<PublishedProject[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("projects")
      .select(
        "slug, title, description, status, kind, version, summary, hosting_stack, tech_stack",
      )
      .eq("public", true)
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.warn(
        "getPublishedProjects: Supabase query failed",
        error?.message,
      );
      return [];
    }

    return data as PublishedProject[];
  } catch (err) {
    console.warn("getPublishedProjects: unexpected error", err);
    return [];
  }
}
