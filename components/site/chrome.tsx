import { Logo } from "@/components/Logo"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { footerColumns, navLinks } from "@/app/site-data"
import styles from "./chrome.module.css"

type SiteNavProps = {
  active: "/" | "/projects" | "/experiments" | "/about"
}

export function SiteNav({ active }: SiteNavProps) {
  return (
    <Container>
      <nav className={styles.nav} aria-label="Primary">
        <Logo as="a" href="/" tone="muted" />
        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <a
              className={`${styles.navLink} ${active === link.href ? styles.navLinkActive : ""}`}
              href={link.href}
              aria-current={active === link.href ? "page" : undefined}
              key={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
        <Button as="a" href="/projects" className={styles.navCta}>
          Enter Studio
        </Button>
      </nav>
    </Container>
  )
}

export function SiteFooter() {
  return (
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
            <a href="/projects">Projects</a>
            <a href="/experiments">Experiments</a>
            <a href="mailto:hello@choneise.com">Email</a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
