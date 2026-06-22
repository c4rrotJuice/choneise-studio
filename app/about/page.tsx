import type { Metadata } from "next"
import { Container } from "@/components/layout/Container"
import { SiteFooter, SiteNav } from "@/components/site/chrome"
import { philosophyPrinciples } from "../site-data"
import { siteConfig } from "../metadata"
import styles from "../content-pages.module.css"

export const metadata: Metadata = {
  title: "About",
  description: "Choneise Studio is an independent product studio building useful software, web tools, and durable systems.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: `About | ${siteConfig.name}`,
    description: "Choneise Studio is an independent product studio building useful software, web tools, and durable systems.",
    url: "/about",
    images: [siteConfig.ogImage],
  },
}

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <SiteNav active="/about" />
        <Container>
          <header className={styles.hero}>
            <p className={styles.kicker}>About</p>
            <h1 className={styles.title}>An independent studio for useful web products.</h1>
            <p className={styles.copy}>
              Choneise is a small digital workshop for building practical software, product
              systems, and focused experiments. The studio stays deliberately small so each product
              can be designed, shipped, and maintained with care.
            </p>
          </header>
        </Container>
      </div>

      <Container>
        <section className={styles.section} aria-labelledby="work-title">
          <div className={styles.split}>
            <div className={styles.sectionHeader}>
              <p className={styles.kicker}>Studio Shape</p>
              <h2 id="work-title" className={styles.sectionTitle}>
                What Choneise builds
              </h2>
            </div>
            <div className={styles.card}>
              <p className={styles.cardCopy}>
                The studio builds small public tools, product experiments, and reusable systems for
                the web. Some work becomes standalone products; some becomes internal capability for
                future releases; selective client work is only taken when it fits the same standard.
              </p>
            </div>
          </div>
        </section>
      </Container>

      <Container>
        <section id="philosophy" className={styles.section} aria-labelledby="philosophy-title">
          <div className={styles.sectionHeader}>
            <p className={styles.kicker}>Philosophy</p>
            <h2 id="philosophy-title" className={styles.sectionTitle}>
              The working rules
            </h2>
          </div>
          <div className={styles.grid}>
            {philosophyPrinciples.map((principle) => (
              <article className={styles.card} key={principle.title}>
                <h3 className={styles.cardTitle}>{principle.title}</h3>
                <p className={styles.cardCopy}>{principle.copy}</p>
              </article>
            ))}
          </div>
        </section>
      </Container>

      <SiteFooter />
    </main>
  )
}
