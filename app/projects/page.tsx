import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { ProjectCard } from "@/components/project/project-card";
import { SiteFooter, SiteNav } from "@/components/site/chrome";
import { getPublishedProjects } from "@/lib/content/projects-server";
import { siteConfig } from "../metadata";
import styles from "../content-pages.module.css";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Public tools and product systems currently live, building, or being refined by Choneise Studio.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: `Projects | ${siteConfig.name}`,
    description:
      "Public tools and product systems currently live, building, or being refined by Choneise Studio.",
    url: "/projects",
    images: [siteConfig.ogImage],
  },
};

// ---------------------------------------------------------------------------
// Data mappers
// ---------------------------------------------------------------------------

/** Map a DB hosting_stack JSON object to key-value pairs for display. */
function hostingStackEntries(
  hostingStack: Record<string, unknown> | null,
): ReadonlyArray<readonly [string, string]> {
  if (
    !hostingStack ||
    typeof hostingStack !== "object" ||
    Array.isArray(hostingStack)
  )
    return [];
  return Object.entries(hostingStack)
    .filter(([, v]) => typeof v === "string" || typeof v === "number")
    .map(([k, v]) => [k, String(v)] as const);
}

/** Map a DB tech_stack JSON array to a deduplicated string list. */
function techStackList(techStack: unknown[] | null): readonly string[] {
  if (!Array.isArray(techStack)) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of techStack) {
    const s = typeof item === "string" ? item : String(item);
    if (!seen.has(s)) {
      seen.add(s);
      result.push(s);
    }
  }
  return result;
}

/** Extract a deployed URL from the hosting stack if one exists. */
function deployedUrl(
  hostingStack: Record<string, unknown> | null,
): string | undefined {
  if (
    !hostingStack ||
    typeof hostingStack !== "object" ||
    Array.isArray(hostingStack)
  )
    return undefined;
  // Check common keys for a URL
  const urlKeys = [
    "URL",
    "url",
    "Deployed URL",
    "deployed_url",
    "Domain",
    "domain",
  ];
  for (const key of urlKeys) {
    const val = hostingStack[key];
    if (typeof val === "string" && val.startsWith("http")) {
      return val;
    }
  }
  return undefined;
}

/** Map a DB status value to the ProjectCard display status. */
function displayStatus(dbStatus: string) {
  const map: Record<string, "Live" | "Building" | "Experiment" | "Dormant"> = {
    published: "Live",
    Live: "Live",
    Building: "Building",
    Experiment: "Experiment",
    Dormant: "Dormant",
  };
  return map[dbStatus] ?? "Live";
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <SiteNav active="/projects" />
        <Container>
          <header className={styles.hero}>
            <p className={styles.kicker}>Projects</p>
            <h1 className={styles.title}>Tools that solve small, real jobs.</h1>
            <p className={styles.copy}>
              Choneise builds practical web products with a bias toward clarity,
              release quality, and long-term ownership. This is the public map
              of what exists and what is underway.
            </p>
          </header>
        </Container>
      </div>

      <Container>
        <section
          className={styles.section}
          aria-labelledby="project-list-title"
        >
          <div className={styles.sectionHeader}>
            <p className={styles.kicker}>Published</p>
            <h2 id="project-list-title" className={styles.sectionTitle}>
              Public tools and product experiments
            </h2>
          </div>

          {projects.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>No published projects yet</p>
              <p className={styles.emptyCopy}>
                Check back soon — the studio is currently preparing its first
                public releases.
              </p>
            </div>
          ) : (
            <div className={styles.projectGrid}>
              {projects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  title={project.title}
                  description={project.description ?? ""}
                  href={`/projects/${project.slug}`}
                  kind={project.kind ?? "Project"}
                  status={displayStatus(project.status)}
                  version={project.version ?? ""}
                  hostingStack={hostingStackEntries(project.hosting_stack)}
                  deployedUrl={deployedUrl(project.hosting_stack)}
                  techStack={techStackList(project.tech_stack)}
                />
              ))}
            </div>
          )}
        </section>
      </Container>

      <SiteFooter />
    </main>
  );
}
