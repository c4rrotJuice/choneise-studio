import { Logo } from "@/components/Logo"
import { Container } from "@/components/layout/Container"
import { HeroBackground } from "@/components/layout/hero-background"
import { Stack } from "@/components/layout/Stack"
import { Button } from "@/components/ui/Button"
import { LogoMarquee } from "@/components/ui/logo-marquee"
import styles from "./page.module.css"

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

        <div className={styles.scrollCue}>
          <span>Scroll to explore</span>
          <span className={styles.scrollDot} />
        </div>
      </div>
      <LogoMarquee />
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
    </main>
  )
}
