import type { Metadata } from "next"
import { Container } from "@/components/layout/Container"
import { SiteFooter, SiteNav } from "@/components/site/chrome"
import { siteConfig } from "../metadata"
import styles from "../content-pages.module.css"

const experiments = [
  {
    id: "multilingual-explorer",
    status: "Active Experiment",
    title: "Multilingual Explorer",
    copy: "A language-aware interface for comparing meanings, translation paths, and context shifts across everyday terms.",
  },
  {
    id: "quiet-journal",
    status: "Dormant",
    title: "Quiet Journal",
    copy: "A minimal writing environment for private drafts, quiet notes, and public thinking without heavyweight publishing machinery.",
  },
  {
    id: "product-patterns",
    status: "Internal",
    title: "Reusable Product Patterns",
    copy: "Small interface and operations patterns extracted from repeated product work, kept stable enough to reuse across future tools.",
  },
] as const

export const metadata: Metadata = {
  title: "Experiments",
  description: "Focused product experiments from Choneise Studio, including language-aware workflows and small publishing tools.",
  alternates: {
    canonical: "/experiments",
  },
  openGraph: {
    title: `Experiments | ${siteConfig.name}`,
    description: "Focused product experiments from Choneise Studio, including language-aware workflows and small publishing tools.",
    url: "/experiments",
    images: [siteConfig.ogImage],
  },
}

export default function ExperimentsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <SiteNav active="/experiments" />
        <Container>
          <header className={styles.hero}>
            <p className={styles.kicker}>Experiments</p>
            <h1 className={styles.title}>Small tests for future products.</h1>
            <p className={styles.copy}>
              Experiments let the studio test interaction ideas, language workflows, and reusable
              systems before they become durable public tools.
            </p>
          </header>
        </Container>
      </div>

      <Container>
        <section className={styles.section} aria-labelledby="experiments-title">
          <div className={styles.sectionHeader}>
            <p className={styles.kicker}>Lab Notes</p>
            <h2 id="experiments-title" className={styles.sectionTitle}>
              What is being tested
            </h2>
          </div>
          <div className={styles.grid}>
            {experiments.map((experiment) => (
              <article className={styles.card} id={experiment.id} key={experiment.id}>
                <p className={styles.meta}>{experiment.status}</p>
                <h3 className={styles.cardTitle}>{experiment.title}</h3>
                <p className={styles.cardCopy}>{experiment.copy}</p>
              </article>
            ))}
          </div>
        </section>
      </Container>

      <SiteFooter />
    </main>
  )
}
