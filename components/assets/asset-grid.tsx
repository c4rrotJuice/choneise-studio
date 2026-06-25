"use client"

import { AssetCard } from "./asset-card"
import type { AssetRow } from "@/lib/api/assets"
import styles from "./assets.module.css"

// ── Types ───────────────────────────────────────────────────────────────────

type AssetGridProps = {
  assets: AssetRow[]
  loading: boolean
  onDeleted: () => void
}

// ── Component ───────────────────────────────────────────────────────────────

export function AssetGrid({ assets, loading, onDeleted }: AssetGridProps) {
  if (loading) {
    return <p className={styles.gridLoading}>Loading assets…</p>
  }

  if (assets.length === 0) {
    return (
      <div className={styles.gridEmpty}>
        <div className={styles.gridEmptyIcon} aria-hidden>
          &#x25C7;
        </div>
        <h2 className={styles.gridEmptyTitle}>No assets uploaded</h2>
        <p className={styles.gridEmptyCopy}>
          Upload images or documents to see them here. Drag and drop files into
          the upload area above.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} onDeleted={onDeleted} />
      ))}
    </div>
  )
}
