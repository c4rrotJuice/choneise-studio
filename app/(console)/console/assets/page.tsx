"use client"

import { useCallback, useEffect, useState } from "react"
import { Uploader } from "@/components/assets/uploader"
import { AssetGrid } from "@/components/assets/asset-grid"
import { getAssets, type AssetRow } from "@/lib/api/assets"
import styles from "@/components/console/console.module.css"

export default function AssetsPage() {
  const [assets, setAssets] = useState<AssetRow[]>([])
  const [loading, setLoading] = useState(true)

  const refreshAssets = useCallback(async () => {
    const data = await getAssets()
    setAssets(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refreshAssets()
  }, [refreshAssets])

  const handleUploaded = useCallback(() => {
    refreshAssets()
  }, [refreshAssets])

  const handleDeleted = useCallback(() => {
    refreshAssets()
  }, [refreshAssets])

  return (
    <>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Assets</h1>
        <p className={styles.pageDescription}>
          Media, files, and visuals used across studio projects and surfaces.
        </p>
      </header>

      <Uploader onUploaded={handleUploaded} />

      <AssetGrid
        assets={assets}
        loading={loading}
        onDeleted={handleDeleted}
      />
    </>
  )
}
