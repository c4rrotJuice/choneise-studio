import { Container } from "@/components/layout/Container"
import { HeroBackground } from "@/components/layout/hero-background"
import { Stack } from "@/components/layout/Stack"
import { ProjectCard } from "@/components/project/project-card"
import { SiteFooter, SiteNav } from "@/components/site/chrome"
import { Button } from "@/components/ui/Button"
import { LogoMarquee } from "@/components/ui/logo-marquee"
import { getFeaturedProjects } from "@/lib/content/projects-server"
import { currentBuilds, featuredProjects as fallbackProjects, philosophyPrinciples } from "./site-data"
import styles from "./page.module.css"

export default async function Home() {
  const dbProjects = await getFeaturedProjects()
  const projects = dbProjects.length > 0 ? dbProjects : fallbackProjects

  return (
    <main className={styles.page}>
      <div className={styles.heroShell}>
        <HeroBackground />
        <SiteNav active="/" />
        <Container>
          <section className={styles.hero} aria-labelledby="hero-title">
            <Stack className={styles.heroContent} gap="standard">
              <p className={styles.eyebrow}>Independent Product Studio</p>
              <div>
                <h1 id="hero-title" className={styles.heroTitle}>
                  <span className={styles.heroTitlePrimary}>Build things</span>
                  <span>worth existing.</span>
                </h1>
                <p className={styles.heroCopy}>
                  Choneise is a digital workshop for building useful software, tools and systems on
                  the web. Some for ourselves, some for others. All with care.
                </p>
                <Button as="a" href="/projects" variant="primary" className={styles.heroCta}>
                  View our Tools
                </Button>
              </div>
            </Stack>
            <div className={styles.visualSpace} />
          </section>
        </Container>

        <LogoMarquee />
        <div className={styles.scrollCue}>
          <span>Scroll to explore</span>
          <span className={styles.scrollDot} />
        </div>
      </div>
      <Container>
        <section id="studio" className={styles.narrative} aria-labelledby="studio-title">
          <p className={styles.narrativeKicker}>Studio Narrative</p>
          <div className={styles.narrativeGrid}>
            <h2 id="studio-title" className={styles.narrativeTitle}>
              What Choneise Is
            </h2>
            <div className={styles.narrativeCopy}>
              <p>
                Choneise is an independent product studio shaped around product-first work:
                practical software, durable systems, and focused experiments that can become more
                than one-off releases.
              </p>
              <p>
                We build for long-term ownership, choosing selective client work when the problem
                deserves the same care as our own tools. The studio stays small so the work can stay
                deliberate.
              </p>
            </div>
          </div>
        </section>
      </Container>
      <Container>
        <section id="featured-work" className={styles.featuredWork} aria-labelledby="featured-work-title">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionKicker}>Featured Work</p>
              <h2 id="featured-work-title" className={styles.sectionTitle}>
                Selected Projects
              </h2>
            </div>
            <a className={styles.viewAllLink} href="/projects">
              View all projects
              <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className={styles.projectGrid}>
            {projects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </section>
      </Container>
      <Container>
        <section id="current-builds" className={styles.currentBuilds} aria-labelledby="current-builds-title">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionKicker}>Current Builds</p>
              <h2 id="current-builds-title" className={styles.sectionTitle}>
                Now / Next / Exploring
              </h2>
            </div>
          </div>
          <div className={styles.timeline}>
            {currentBuilds.map((item) => (
              <article className={styles.timelineItem} key={item.label}>
                <p className={styles.timelineLabel}>{item.label}</p>
                <h3 className={styles.timelineTitle}>{item.title}</h3>
                <p className={styles.timelineCopy}>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>
      </Container>
      <Container>
        <section id="philosophy" className={styles.philosophy} aria-labelledby="philosophy-title">
          <div className={styles.philosophyHeader}>
            <p className={styles.sectionKicker}>Build Philosophy</p>
            <h2 id="philosophy-title" className={styles.philosophyTitle}>
              Make the work smaller, clearer, and more durable.
            </h2>
          </div>
          <div className={styles.principles}>
            {philosophyPrinciples.map((principle, index) => (
              <article className={styles.principle} key={principle.title}>
                <span className={styles.principleNumber}>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className={styles.principleTitle}>{principle.title}</h3>
                  <p className={styles.principleCopy}>{principle.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </Container>
      <SiteFooter />
    </main>
  )
}
