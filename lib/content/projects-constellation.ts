import { createClient } from "@/lib/supabase/server";
import { featuredProjects as fallbackProjects } from "@/app/site-data";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ConstellationNode = {
  id: string;
  name: string;
  status: "Live" | "Building" | "Active" | "Archived";
  is_experiment: boolean;
};

/* ------------------------------------------------------------------ */
/*  Orbit group assignment                                             */
/* ------------------------------------------------------------------ */

/**
 * Production (non-experiment) "Live" projects → inner ring
 * Production "Building" / "Active" → middle ring
 * Experiments → outer ring
 */
export function getOrbitGroup(
  node: ConstellationNode,
): "inner" | "middle" | "outer" {
  if (node.is_experiment) return "outer";
  if (node.status === "Live") return "inner";
  return "middle";
}

/* ------------------------------------------------------------------ */
/*  Data fetcher                                                       */
/* ------------------------------------------------------------------ */

/**
 * Fetch projects for the constellation hero visual.
 * Falls back to hardcoded data when the DB is unavailable.
 */
export async function getConstellationProjects(): Promise<ConstellationNode[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("projects")
      .select("id, title, status, kind")
      .in("status", ["Live", "Building", "Active", "Archived"])
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.warn("getConstellationProjects: query failed", error?.message);
      return mapFallbackToConstellationNodes(fallbackProjects);
    }

    return data.map((row) => ({
      id: row.id,
      name: row.title,
      status: row.status as ConstellationNode["status"],
      is_experiment: row.kind === "Experiment",
    }));
  } catch (err) {
    console.warn("getConstellationProjects: unexpected error", err);
    return mapFallbackToConstellationNodes(fallbackProjects);
  }
}

/* ------------------------------------------------------------------ */
/*  Fallback mapping                                                   */
/* ------------------------------------------------------------------ */

function mapFallbackToConstellationNodes(
  projects: typeof fallbackProjects,
): ConstellationNode[] {
  return projects.map((p) => ({
    id: p.title.toLowerCase().replace(/\s+/g, "-"),
    name: p.title,
    status: mapLegacyStatus(p.status),
    is_experiment: p.kind === "Experiment",
  }));
}

function mapLegacyStatus(
  status: "Live" | "Building" | "Experiment" | "Dormant",
): ConstellationNode["status"] {
  switch (status) {
    case "Live":
      return "Live";
    case "Building":
      return "Building";
    case "Experiment":
      return "Active";
    case "Dormant":
      return "Archived";
  }
}
