"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { getAssets, type AssetRow } from "@/lib/api/assets"
import styles from "./asset-picker-modal.module.css"

// ── Types ───────────────────────────────────────────────────────────────────

type AssetPickerModalProps = {
  open: boolean
  onClose: () => void
  onSelect: (selectedIds: string[]) => void
  excludeIds?: string[]
}

// ── Component ───────────────────────────────────────────────────────────────

export function AssetPickerModal({
  open,
  onClose,
  onSelect,
  excludeIds = [],
}: AssetPickerModalProps) {
  const [allAssets, setAllAssets] = useState<AssetRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  // Fetch all image assets from the library
  useEffect(() => {
    if (!open) {
      setSelected(new Set())
      return
    }
    let cancelled = false
    setLoading(true)
    getAssets().then((data) => {
      if (!cancelled) {
        // Only show image assets, exclude already-linked ones
        setAllAssets(
          data.filter(
            (a) =>
              a.type === "image" &&
              !excludeIds.includes(a.id),
          ),
        )
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [open, excludeIds])

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleConfirm = useCallback(() => {
    onSelect(Array.from(selected))
    onClose()
  }, [selected, onSelect, onClose])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Select screenshots from asset library"
      >
        <header className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            Asset Library — Select Screenshots
          </h2>
          <button
            type="button"
            className={styles.modalClose}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <div className={styles.modalBody}>
          {loading ? (
            <p className={styles.modalLoading}>Loading assets…</p>
          ) : allAssets.length === 0 ? (
            <div className={styles.modalEmpty}>
              <p className={styles.modalEmptyTitle}>No images available</p>
              <p className={styles.modalEmptyCopy}>
                Upload images in the{" "}
                <a href="/console/assets" target="_blank" rel="noopener noreferrer">
                  Assets console
                </a>{" "}
                first, then return here to attach them.
              </p>
            </div>
          ) : (
            <div className={styles.pickerGrid}>
              {allAssets.map((asset) => {
                const isSelected = selected.has(asset.id)
                return (
                  <button
                    key={asset.id}
                    type="button"
                    className={`${styles.pickerCard} ${
                      isSelected ? styles.pickerCardSelected : ""
                    }`}
                    onClick={() => toggle(asset.id)}
                    aria-pressed={isSelected}
                  >
                    <img
                      src={asset.url}
                      alt=""
                      className={styles.pickerImage}
                      loading="lazy"
                    />
                    {isSelected && (
                      <span className={styles.pickerCheck} aria-hidden>
                        ✓
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <footer className={styles.modalFooter}>
          <span className={styles.modalCount}>
            {selected.size} selected
          </span>
          <div className={styles.modalFooterActions}>
            <Button variant="quiet" size="compact" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="compact"
              onClick={handleConfirm}
              disabled={selected.size === 0}
            >
              Add Selected
            </Button>
          </div>
        </footer>
      </div>
    </div>
  )
}
