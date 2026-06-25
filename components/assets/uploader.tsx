"use client"

import { useCallback, useRef, useState } from "react"
import { supabase } from "@/lib/supabase/browser"
import { createAsset } from "@/lib/api/assets"
import styles from "./assets.module.css"

// ── Types ───────────────────────────────────────────────────────────────────

type UploaderProps = {
  onUploaded: () => void
}

type UploadState =
  | { phase: "idle" }
  | { phase: "uploading"; file: string; progress: number }
  | { phase: "error"; message: string }

// ── Constants ───────────────────────────────────────────────────────────────

const BUCKET = "studio-assets"
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MiB

const acceptedImageTypes = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/x-icon",
]

const acceptedDocumentTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]

const acceptedTypes = [...acceptedImageTypes, ...acceptedDocumentTypes]

function getAssetType(mime: string): "image" | "document" {
  if (acceptedImageTypes.includes(mime)) return "image"
  return "document"
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ── Component ───────────────────────────────────────────────────────────────

export function Uploader({ onUploaded }: UploaderProps) {
  const [upload, setUpload] = useState<UploadState>({ phase: "idle" })
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isUploading = upload.phase === "uploading"

  const uploadFile = useCallback(
    async (file: File) => {
      // Validate type
      if (!acceptedTypes.includes(file.type)) {
        setUpload({
          phase: "error",
          message: `Unsupported file type: ${file.type || "unknown"}. Supported: images and documents.`,
        })
        return
      }

      // Validate size
      if (file.size > MAX_FILE_SIZE) {
        setUpload({
          phase: "error",
          message: `File is too large (${formatFileSize(file.size)}). Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`,
        })
        return
      }

      const assetType = getAssetType(file.type)

      // Generate a clean storage path: userId/timestamp-filename
      let userId = "anonymous"
      try {
        const { data } = await supabase.auth.getUser()
        if (data.user) {
          userId = data.user.id
        }
      } catch {
        // Continue with anonymous
      }

      const timestamp = Date.now()
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
      const storagePath = `${userId}/${timestamp}-${safeName}`

      setUpload({ phase: "uploading", file: file.name, progress: 0 })

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        setUpload({
          phase: "error",
          message: `Upload failed: ${uploadError.message}`,
        })
        return
      }

      setUpload({ phase: "uploading", file: file.name, progress: 80 })

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(storagePath)

      const publicUrl = urlData.publicUrl

      // Create the asset record via the API
      const result = await createAsset({
        url: publicUrl,
        type: assetType,
        meta: {
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
        },
      })

      if (!result.ok) {
        setUpload({
          phase: "error",
          message: `Failed to save asset: ${result.errors.root?.join(", ") ?? "Unknown error"}`,
        })
        return
      }

      setUpload({ phase: "idle" })
      onUploaded()
    },
    [onUploaded],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        uploadFile(files[0])
      }
    },
    [uploadFile],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        uploadFile(files[0])
      }
      // Reset input so the same file can be re-uploaded
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    },
    [uploadFile],
  )

  const handleClick = useCallback(() => {
    if (!isUploading) {
      inputRef.current?.click()
    }
  }, [isUploading])

  const handleDismissError = useCallback(() => {
    setUpload({ phase: "idle" })
  }, [])

  return (
    <div className={styles.uploader}>
      <div
        className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ""} ${isUploading ? styles.dropZoneDisabled : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Upload file"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleClick()
          }
        }}
      >
        <div className={styles.dropZoneIcon} aria-hidden>
          &#x2191;
        </div>
        <p className={styles.dropZoneTitle}>
          {isUploading
            ? `Uploading ${upload.file}…`
            : "Drop a file here or click to browse"}
        </p>
        <p className={styles.dropZoneHint}>
          Images and documents only. Maximum {formatFileSize(MAX_FILE_SIZE)}.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          onChange={handleInputChange}
          hidden
          aria-hidden="true"
        />
      </div>

      {/* Progress bar */}
      {upload.phase === "uploading" && (
        <div className={styles.uploadProgress}>
          <div className={styles.uploadProgressBar}>
            <div
              className={styles.uploadProgressFill}
              style={{ inlineSize: `${upload.progress}%` }}
            />
          </div>
          <p className={styles.uploadProgressLabel}>
            {upload.progress < 100 ? "Uploading to storage…" : "Saving record…"}
          </p>
        </div>
      )}

      {/* Error */}
      {upload.phase === "error" && (
        <div className={styles.uploadError}>
          <p>{upload.message}</p>
          <button
            type="button"
            onClick={handleDismissError}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255, 140, 120, 0.85)",
              cursor: "pointer",
              fontSize: "var(--studio-text-xs)",
              marginBlockStart: "var(--studio-space-2)",
              padding: 0,
              textDecoration: "underline",
            }}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  )
}
