import type { Metadata } from "next"
import { Button } from "@/components/ui/Button"
import styles from "@/components/console/console.module.css"

export const metadata: Metadata = {
  title: "Assets — Studio Console",
  robots: { index: false, follow: false },
}

export default function AssetsPage() {
  return (
    <>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Assets</h1>
        <p className={styles.pageDescription}>
          Media, files, and visuals used across studio projects and surfaces.
        </p>
      </header>

      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon} aria-hidden>
          &#x25C7;
        </div>
        <h2 className={styles.emptyStateTitle}>No assets uploaded</h2>
        <p className={styles.emptyStateCopy}>
          Assets will appear here once uploaded. The studio supports images,
          documents, and other media types tied to projects.
        </p>
        <Button variant="secondary" size="standard" disabled>
          Upload Asset
        </Button>
      </div>
    </>
  )
}
