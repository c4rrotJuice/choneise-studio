"use client"

import { usePathname } from "next/navigation"
import { Logo } from "@/components/Logo"
import { consoleNavLinks } from "./nav"
import styles from "./console.module.css"

export function ConsoleSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/console") return pathname === "/console"
    return pathname.startsWith(href)
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBrand}>
        <Logo as="a" href="/" tone="muted" size="compact" />
      </div>

      <nav aria-label="Console">
        <ul className={styles.sidebarNav}>
          {consoleNavLinks.map((link) => (
            <li key={link.href}>
              <a
                className={`${styles.sidebarLink} ${isActive(link.href) ? styles.sidebarLinkActive : ""}`}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.sidebarFooter}>
        <p className={styles.sidebarFooterText}>Choneise Studio Console</p>
      </div>
    </aside>
  )
}
