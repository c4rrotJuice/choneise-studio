import { Logo } from "@/components/Logo"
import { Container } from "@/components/layout/Container"
import { HeroBackground } from "@/components/layout/hero-background"
import { Stack } from "@/components/layout/Stack"
import { ProjectCard, type ProjectCardProps } from "@/components/project/project-card"
import { Button } from "@/components/ui/Button"
import { LogoMarquee } from "@/components/ui/logo-marquee"
import styles from "./page.module.css"

const featuredProjects: readonly ProjectCardProps[] = [
  {
    description: "Convert grades across different systems. Simple, accurate, useful.",
    kind: "Tool",
    status: "Live",
    title: "Grade Converter",
    version: "v1.0.2",
  },
  {
    description: "Estimate mobile money transfer costs before sending everyday payments.",
    kind: "Tool",
    status: "Building",
    title: "Mobile Money Fee Calculator",
    version: "v0.4.0",
  },
  {
    description: "Explore meanings across languages, contexts, and translation paths.",
    kind: "Experiment",
    status: "Experiment",
    title: "Multilingual Explorer",
    version: "v0.3.1",
  },
  {
    description: "A minimal writing space for quiet notes, drafts, and public thinking.",
    kind: "Experiment",
    status: "Dormant",
    title: "Quiet Journal",
    version: "v0.1.0",
  },
]

const currentBuilds = [
  {
    label: "Now",
    title: "Sharpening small public tools",
    copy: "Improving utility, copy, and release quality for the studio's first live products.",
  },
  {
    label: "Next",
    title: "Packaging reusable systems",
    copy: "Turning repeated product patterns into stable components, templates, and internal tooling.",
  },
  {
    label: "Exploring",
    title: "Language-aware workflows",
    copy: "Testing practical multilingual interfaces for learning, publishing, and everyday web tasks.",
  },
]

const philosophyPrinciples = [
  {
    title: "Build useful things",
    copy: "Start with a clear job, keep the interface honest, and ship work that earns its place.",
  },
  {
    title: "Own the system",
    copy: "Treat product, design, code, operations, and maintenance as one connected responsibility.",
  },
  {
    title: "Move deliberately",
    copy: "Choose slower decisions when they protect quality, focus, and long-term ownership.",
  },
]

const footerColumns = [
  {
    title: "Studio",
    links: [
      { label: "About", href: "/about" },
      { label: "Philosophy", href: "#philosophy" },
    ],
  },
  {
    title: "Projects",
    links: [
      { label: "Featured Work", href: "/projects" },
      { label: "Current Builds", href: "#current-builds" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "Grade Converter", href: "/projects" },
      { label: "Fee Calculator", href: "/projects" },
    ],
  },
  {
    title: "Experiments",
    links: [
      { label: "Explorer", href: "/experiments" },
      { label: "Journal", href: "/experiments" },
    ],
  },
  {
    title: "Notes",
    links: [
      { label: "Writing", href: "/notes" },
      { label: "Updates", href: "/notes" },
    ],
  },
]

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.heroShell}>
        <HeroBackground />
        <Container>
          <nav className={styles.nav} aria-label="Primary">
            <Logo as="a" href="/" tone="muted" />
            <div className={styles.navLinks}>
              <a className={`${styles.navLink} ${styles.navLinkActive}`} href="/" aria-current="page">
                Studio
              </a>
              <a className={styles.navLink} href="#studio">
                Projects
              </a>
              <a className={styles.navLink} href="#studio">
                Tools
              </a>
              <a className={styles.navLink} href="#studio">
                Experiments
              </a>
              <a className={styles.navLink} href="#studio">
                Notes
              </a>
              <a className={styles.navLink} href="#studio">
                About
              </a>
            </div>
            <Button as="a" href="#studio" className={styles.navCta}>
              Enter Studio
            </Button>
          </nav>

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
                <Button as="a" href="#studio" variant="primary" className={styles.heroCta}>
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
        <section className={styles.featuredWork} aria-labelledby="featured-work-title">
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
            {featuredProjects.map((project) => (
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
      <footer className={styles.footer}>
        <Container>
          <div className={styles.footerGrid}>
            <div className={styles.footerManifesto}>
              <Logo as="a" href="/" tone="muted" />
              <p>Building useful things on the web.</p>
            </div>
            <nav className={styles.footerColumns} aria-label="Footer">
              {footerColumns.map((column) => (
                <div className={styles.footerColumn} key={column.title}>
                  <h2 className={styles.footerHeading}>{column.title}</h2>
                  <ul className={styles.footerLinks}>
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <a href={link.href}>{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
          <div className={styles.footerBottom}>
            <p>© 2026 Choneise Studio</p>
            <div className={styles.socialLinks}>
              <a href="https://github.com" aria-label="GitHub">
                GitHub
              </a>
              <a href="mailto:hello@choneise.com">Email</a>
              <a href="https://x.com" aria-label="X">
                X
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </main>
  )
}
