import type { Metadata } from "next"
import { Container } from "@/components/layout/Container"
import { ProjectCard } from "@/components/project/project-card"
import { SiteFooter, SiteNav } from "@/components/site/chrome"
import { getFeaturedProjects } from "@/lib/content/projects-server"
import { currentBuilds, featuredProjects as fallbackProjects } from "../site-data"
import { siteConfig } from "../metadata"
import styles from "../content-pages.module.css"

export const metadata: Metadata = {
  title: "Projects",
  description: "Public tools and product systems currently live, building, or being refined by Choneise Studio.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: `Projects | ${siteConfig.name}`,
    description: "Public tools and product systems currently live, building, or being refined by Choneise Studio.",
    url: "/projects",
    images: [siteConfig.ogImage],
  },
}

export default async function ProjectsPage() {
  const dbProjects = await getFeaturedProjects()
  const projects = dbProjects.length > 0 ? dbProjects : fallbackProjects

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <SiteNav active="/projects" />
        <Container>
          <header className={styles.hero}>
            <p className={styles.kicker}>Projects</p>
            <h1 className={styles.title}>Tools that solve small, real jobs.</h1>
            <p className={styles.copy}>
              Choneise builds practical web products with a bias toward clarity, release quality,
              and long-term ownership. This is the public map of what exists and what is underway.
            </p>
          </header>
        </Container>
      </div>

      <Container>
        <section className={styles.section} aria-labelledby="project-list-title">
          <div className={styles.sectionHeader}>
            <p className={styles.kicker}>Existing Work</p>
            <h2 id="project-list-title" className={styles.sectionTitle}>
              Public tools and product experiments
            </h2>
          </div>
          <div className={styles.projectGrid}>
            {projects.map((project) => (
              <div id={project.href?.split("#")[1]} key={project.title}>
                <ProjectCard {...project} href={project.href ?? "/projects"} />
              </div>
            ))}
          </div>
        </section>
      </Container>

      <Container>
        <section className={styles.section} aria-labelledby="underway-title">
          <div className={styles.sectionHeader}>
            <p className={styles.kicker}>Underway</p>
            <h2 id="underway-title" className={styles.sectionTitle}>
              Current build priorities
            </h2>
          </div>
          <div className={styles.grid}>
            {currentBuilds.map((item) => (
              <article className={styles.card} key={item.label}>
                <p className={styles.meta}>{item.label}</p>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardCopy}>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>
      </Container>

      <SiteFooter />
    </main>
  )
}
