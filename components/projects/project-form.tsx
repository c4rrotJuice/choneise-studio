"use client"

import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { Button } from "@/components/ui/Button"
import { createProject, updateProject } from "@/app/actions/projects"
import type { ProjectRow } from "@/app/actions/projects"
import styles from "./projects.module.css"

// ── Types ───────────────────────────────────────────────────────────────────

type ProjectFormProps = {
  project?: ProjectRow | null
  onSaved?: (project: ProjectRow) => void
}

type FieldErrors = Record<string, string[]>

// ── Helpers ─────────────────────────────────────────────────────────────────

function autoSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

// ── Wrapper action that dispatches to create or update ─────────────────────

async function formAction(
  _prev: Awaited<ReturnType<typeof createProject>> | null,
  formData: FormData,
) {
  const id = formData.get("id")
  if (id && typeof id === "string") {
    return updateProject(_prev, formData)
  }
  return createProject(_prev, formData)
}

// ── Component ───────────────────────────────────────────────────────────────

export function ProjectForm({ project, onSaved }: ProjectFormProps) {
  const isEditing = Boolean(project)
  const [state, dispatch] = useActionState(formAction, null)

  const [title, setTitle] = useState(project?.title ?? "")
  const [slug, setSlug] = useState(project?.slug ?? "")
  const [summary, setSummary] = useState(project?.summary ?? "")
  const [body, setBody] = useState(project?.body ?? "")
  const [status, setStatus] = useState(project?.status ?? "draft")
  const [slugManuallySet, setSlugManuallySet] = useState(Boolean(project))

  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-slug from title when creating new
  const handleTitleChange = useCallback(
    (value: string) => {
      setTitle(value)
      if (!slugManuallySet && !isEditing) {
        setSlug(autoSlug(value))
      }
    },
    [slugManuallySet, isEditing],
  )

  const handleSlugChange = useCallback((value: string) => {
    setSlugManuallySet(true)
    setSlug(value)
  }, [])

  // Handle successful save
  useEffect(() => {
    if (state?.ok && "data" in state && state.data) {
      setSaveState("saved")
      if (onSaved && state.data) onSaved(state.data)
      const timer = setTimeout(() => setSaveState("idle"), 2000)
      return () => clearTimeout(timer)
    }
    if (state && !state.ok) {
      setSaveState("error")
    }
  }, [state, onSaved])

  // Cleanup autosave timer
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    }
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setSaveState("saving")
      const formData = new FormData(e.currentTarget)
      dispatch(formData)
    },
    [dispatch],
  )

  const fieldErrors: FieldErrors = state && !state.ok ? (state as { errors: FieldErrors }).errors : {}

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {isEditing && <input type="hidden" name="id" value={project!.id} />}

      {/* ── Title ── */}
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Title</span>
        <input
          className={styles.input}
          type="text"
          name="title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Project title"
        />
        {fieldErrors.title && (
          <span className={styles.fieldError}>{fieldErrors.title[0]}</span>
        )}
      </label>

      {/* ── Slug ── */}
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Slug</span>
        <input
          className={styles.input}
          type="text"
          name="slug"
          value={slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          placeholder="project-slug"
        />
        {fieldErrors.slug && (
          <span className={styles.fieldError}>{fieldErrors.slug[0]}</span>
        )}
      </label>

      {/* ── Summary ── */}
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Summary</span>
        <input
          className={styles.input}
          type="text"
          name="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="A short description of the project"
          maxLength={500}
        />
        {fieldErrors.summary && (
          <span className={styles.fieldError}>{fieldErrors.summary[0]}</span>
        )}
      </label>

      {/* ── Body ── */}
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Body</span>
        <textarea
          className={styles.textarea}
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Full project description…"
          rows={12}
        />
        {fieldErrors.body && (
          <span className={styles.fieldError}>{fieldErrors.body[0]}</span>
        )}
      </label>

      {/* ── Status ── */}
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Status</span>
        <select
          className={styles.select}
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        {fieldErrors.status && (
          <span className={styles.fieldError}>{fieldErrors.status[0]}</span>
        )}
      </label>

      {/* ── Root error ── */}
      {fieldErrors.root && (
        <div className={styles.formError} role="alert">
          {fieldErrors.root[0]}
        </div>
      )}

      {/* ── Submit + save indicator ── */}
      <div className={styles.formActions}>
        <Button type="submit" variant="primary">
          {isEditing ? "Save Changes" : "Create Project"}
        </Button>
        <span
          className={`${styles.saveIndicator} ${
            saveState === "saving"
              ? styles.saveIndicatorSaving
              : saveState === "saved"
                ? styles.saveIndicatorSaved
                : saveState === "error"
                  ? styles.saveIndicatorError
                  : ""
          }`}
          aria-live="polite"
        >
          {saveState === "saving" && "Saving…"}
          {saveState === "saved" && "✓ Saved"}
          {saveState === "error" && "✗ Save failed"}
        </span>
      </div>
    </form>
  )
}
