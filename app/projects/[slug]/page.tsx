import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Container } from "@/components/layout/Container"
import { SiteFooter, SiteNav } from "@/components/site/chrome"
import { createClient } from "@/lib/supabase/server"
import { siteConfig } from "../../metadata"
import styles from "../../content-pages.module.css"

type ProjectDetail = {
  slug: string
  title: string
  description: string | null
  summary: string | null
  body: string | null
  status: string
  kind: string | null
  version: string | null
  hosting_stack: Record<string, unknown> | null
  tech_stack: unknown[] | null
  updates_future_plans: string | null
}

async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single()

    if (error || !data) return null
    return data as ProjectDetail
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) {
    return { title: "Project Not Found" }
  }

  return {
    title: `${project.title} | ${siteConfig.name}`,
    description: project.description ?? project.summary ?? "",
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} | ${siteConfig.name}`,
      description: project.description ?? project.summary ?? "",
      url: `/projects/${project.slug}`,
      images: [siteConfig.ogImage],
    },
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const hostingEntries: ReadonlyArray<readonly [string, string]> =
    project.hosting_stack &&
    typeof project.hosting_stack === "object" &&
    !Array.isArray(project.hosting_stack)
      ? Object.entries(project.hosting_stack)
          .filter(([, v]) => typeof v === "string" || typeof v === "number")
          .map(([k, v]) => [k, String(v)] as const)
      : []

  const techItems: readonly string[] = Array.isArray(project.tech_stack)
    ? project.tech_stack
        .map((item) => (typeof item === "string" ? item : String(item)))
        .filter((v, i, a) => a.indexOf(v) === i)
    : []

  const statusLabel: Record<string, string> = {
    published: "Published",
    Live: "Live",
    Building: "Building",
    Experiment: "Experiment",
    Dormant: "Dormant",
    draft: "Draft",
    archived: "Archived",
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <SiteNav active="/projects" />
        <Container>
          <header className={styles.hero}>
            <p className={styles.kicker}>
              {statusLabel[project.status] ?? project.status}
              {project.kind ? ` · ${project.kind}` : ""}
            </p>
            <h1 className={styles.title}>{project.title}</h1>
            {project.description ? (
              <p className={styles.copy}>{project.description}</p>
            ) : null}
          </header>
        </Container>
      </div>

      <Container>
        <section className={styles.section}>
          <div className={styles.split}>
            <div>
              {project.summary ? (
                <>
                  <h2 className={styles.sectionTitle}>Summary</h2>
                  <p className={styles.copy} style={{ marginBlockStart: "var(--studio-space-4)" }}>
                    {project.summary}
                  </p>
                </>
              ) : null}

              {project.body ? (
                <>
                  <h2 className={styles.sectionTitle} style={{ marginBlockStart: "var(--studio-space-8)" }}>
                    Details
                  </h2>
                  <p className={styles.copy} style={{ marginBlockStart: "var(--studio-space-4)", whiteSpace: "pre-wrap" }}>
                    {project.body}
                  </p>
                </>
              ) : null}

              {project.updates_future_plans ? (
                <>
                  <h2 className={styles.sectionTitle} style={{ marginBlockStart: "var(--studio-space-8)" }}>
                    Updates & Future Plans
                  </h2>
                  <p className={styles.copy} style={{ marginBlockStart: "var(--studio-space-4)", whiteSpace: "pre-wrap" }}>
                    {project.updates_future_plans}
                  </p>
                </>
              ) : null}
            </div>

            <aside>
              {project.version ? (
                <div style={{ marginBlockEnd: "var(--studio-space-6)" }}>
                  <p className={styles.meta}>Version</p>
                  <p className={styles.cardTitle}>{project.version}</p>
                </div>
              ) : null}

              {hostingEntries.length > 0 ? (
                <div style={{ marginBlockEnd: "var(--studio-space-6)" }}>
                  <p className={styles.meta}>Hosting</p>
                  <ul className={styles.list}>
                    {hostingEntries.map(([key, value]) => (
                      <li key={key}>
                        <span style={{ color: "rgba(170, 166, 154, 0.6)" }}>{key}: </span>
                        {value.startsWith("http") ? (
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "rgba(245, 245, 243, 0.72)" }}
                          >
                            {value}
                          </a>
                        ) : (
                          <span style={{ color: "rgba(245, 245, 243, 0.72)" }}>{value}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {techItems.length > 0 ? (
                <div style={{ marginBlockEnd: "var(--studio-space-6)" }}>
                  <p className={styles.meta}>Tech Stack</p>
                  <ul className={styles.list}>
                    {techItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
          </div>
        </section>
      </Container>

      <SiteFooter />
    </main>
  )
}
