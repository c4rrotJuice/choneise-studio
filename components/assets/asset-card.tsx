"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { deleteAsset, type AssetRow } from "@/lib/api/assets"
import styles from "./assets.module.css"

// ── Types ───────────────────────────────────────────────────────────────────

type AssetCardProps = {
  asset: AssetRow
  onDeleted: () => void
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function isImageUrl(url: string): boolean {
  const ext = url.split(".").pop()?.toLowerCase().split("?")[0] ?? ""
  const imageExts = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "ico"])
  return imageExts.has(ext)
}

function extractFileName(url: string): string {
  try {
    const path = new URL(url).pathname
    const segments = path.split("/").filter(Boolean)
    return segments[segments.length - 1] || "file"
  } catch {
    const segments = url.split("/").filter(Boolean)
    return segments[segments.length - 1] || "file"
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ── Component ───────────────────────────────────────────────────────────────

export function AssetCard({ asset, onDeleted }: AssetCardProps) {
  const [copied, setCopied] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fileName =
    (asset.meta && typeof asset.meta === "object" && "file_name" in asset.meta
      ? String(asset.meta.file_name)
      : null) ?? extractFileName(asset.url)

  const fileSize =
    asset.meta && typeof asset.meta === "object" && "file_size" in asset.meta
      ? Number(asset.meta.file_size)
      : null

  const showImage = asset.type === "image" || isImageUrl(asset.url)

  const handleCopyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(asset.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard may not be available
    }
  }, [asset.url])

  const handleDelete = useCallback(async () => {
    setDeleting(true)
    const result = await deleteAsset(asset.id)
    setDeleting(false)
    setConfirmDelete(false)
    if (result.ok) {
      onDeleted()
    }
  }, [asset.id, onDeleted])

  return (
    <Card padding="compact" tone="subtle" className={styles.card}>
      {/* Preview */}
      <div className={styles.cardPreview}>
        {showImage ? (
          <img
            src={asset.url}
            alt={fileName}
            className={styles.cardPreviewImage}
            loading="lazy"
          />
        ) : (
          <div className={styles.cardPreviewDoc}>
            <span aria-hidden>&#x1F4C4;</span>
            <span className={styles.cardPreviewDocLabel}>Document</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span className={styles.cardFileName} title={fileName}>
            {fileName}
          </span>
          {fileSize != null && (
            <span className={styles.cardFileInfo}>
              {formatFileSize(fileSize)}
            </span>
          )}
          <span className={styles.cardDate}>
            {new Date(asset.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Actions */}
        <div className={styles.cardActions}>
          <Button variant="quiet" size="compact" onClick={handleCopyUrl}>
            {copied ? (
              <span className={styles.copiedToast}>Copied</span>
            ) : (
              "Copy URL"
            )}
          </Button>

          {confirmDelete ? (
            <span className={styles.deleteConfirm}>
              <Button
                variant="primary"
                size="compact"
                disabled={deleting}
                onClick={handleDelete}
              >
                {deleting ? "Deleting…" : "Confirm"}
              </Button>
              <Button
                variant="quiet"
                size="compact"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </Button>
            </span>
          ) : (
            <Button
              variant="quiet"
              size="compact"
              onClick={() => setConfirmDelete(true)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
