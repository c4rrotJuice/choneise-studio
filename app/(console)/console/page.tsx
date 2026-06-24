import type { Metadata } from "next"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import styles from "@/components/console/console.module.css"

export const metadata: Metadata = {
  title: "Studio Console",
  description: "Choneise Studio Console",
  robots: { index: false, follow: false },
}

const overviewCards = [
  { label: "Projects", value: "—", muted: "No projects yet" },
  { label: "Experiments", value: "—", muted: "No experiments yet" },
  { label: "Assets", value: "—", muted: "No assets uploaded" },
  { label: "Updates", value: "—", muted: "No activity logged" },
] as const

export default function ConsolePage() {
  return (
    <>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageDescription}>
          An overview of studio activity. Everything here is a live reflection
          of the studio&rsquo;s internal state.
        </p>
      </header>

      <div className={styles.dashboardGrid}>
        {overviewCards.map((card) => (
          <Card key={card.label} padding="editorial" className={styles.dashboardCard}>
            <p className={styles.dashboardCardLabel}>{card.label}</p>
            <p className={styles.dashboardCardValue}>{card.value}</p>
            <p className={styles.dashboardCardMuted}>{card.muted}</p>
          </Card>
        ))}
      </div>

      <section className={styles.activitySection}>
        <h2 className={styles.activitySectionTitle}>Recent Activity</h2>
        <div className={styles.activityPlaceholder}>
          Studio activity will appear here as projects, experiments, and assets
          are created or updated.
        </div>
      </section>

      <div className={styles.quickActions}>
        <Button as="a" href="/console/projects" variant="secondary" size="standard">
          View Projects
        </Button>
        <Button as="a" href="/console/assets" variant="quiet" size="standard">
          Browse Assets
        </Button>
      </div>
    </>
  )
}
