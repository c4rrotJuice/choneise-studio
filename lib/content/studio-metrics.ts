import { createClient } from "@/lib/supabase/server";

export type StudioMetrics = {
  totalProjects: number;
  activeExperiments: number;
  productionSystems: number;
};

/**
 * Fetch aggregate studio metrics from the projects table.
 * Falls back to zeroes when the DB is unavailable.
 *
 * Metrics:
 * - totalProjects: count of all projects
 * - activeExperiments: count of experiments (kind = 'Experiment') not archived
 * - productionSystems: count of projects with status = 'Live'
 */
export async function getStudioMetrics(): Promise<StudioMetrics> {
  try {
    const supabase = await createClient();

    // Total projects
    const { count: total } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true });

    // Active experiments (kind = 'Experiment' and status != 'Archived')
    const { count: experiments } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("kind", "Experiment")
      .neq("status", "Archived");

    // Production systems (status = 'Live')
    const { count: live } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("status", "Live");

    return {
      totalProjects: total ?? 0,
      activeExperiments: experiments ?? 0,
      productionSystems: live ?? 0,
    };
  } catch (err) {
    console.warn("getStudioMetrics: unexpected error", err);
    return { totalProjects: 0, activeExperiments: 0, productionSystems: 0 };
  }
}
