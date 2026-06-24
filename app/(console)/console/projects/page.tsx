import type { Metadata } from "next"
import { Button } from "@/components/ui/Button"
import styles from "@/components/console/console.module.css"

export const metadata: Metadata = {
  title: "Projects — Studio Console",
  robots: { index: false, follow: false },
}

export default function ProjectsPage() {
  return (
    <>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Projects</h1>
        <p className={styles.pageDescription}>
          Studio outputs — tools, websites, apps, and experiments that are
          active or in progress.
        </p>
      </header>

      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon} aria-hidden>
          &#x25A1;
        </div>
        <h2 className={styles.emptyStateTitle}>No projects yet</h2>
        <p className={styles.emptyStateCopy}>
          Projects will appear here once they are created in the studio.
          Each project can hold its own updates, assets, and metadata.
        </p>
        <Button variant="secondary" size="standard" disabled>
          Create Project
        </Button>
      </div>
    </>
  )
}
