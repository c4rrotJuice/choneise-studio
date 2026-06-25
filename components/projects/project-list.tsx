"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Status } from "@/components/ui/Status"
import { deleteProject, type ProjectRow } from "@/lib/api/projects"
import styles from "./projects.module.css"

type ProjectListProps = {
  projects: ProjectRow[]
  onEdit: (project: ProjectRow) => void
  onDeleted: () => void
}

const statusLabel: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
}

const statusTone: Record<string, "draft" | "live" | "build"> = {
  draft: "draft",
  published: "live",
  archived: "build",
}

export function ProjectList({ projects, onEdit, onDeleted }: ProjectListProps) {
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = useCallback(
    async (id: string) => {
      setDeletingId(id)
      const result = await deleteProject(id)
      setDeletingId(null)
      setConfirmId(null)
      if (result.ok) {
        onDeleted()
      }
    },
    [onDeleted],
  )

  if (projects.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon} aria-hidden>
          &#x25A1;
        </div>
        <h2 className={styles.emptyStateTitle}>No projects yet</h2>
        <p className={styles.emptyStateCopy}>
          Create your first project to start building the studio catalog.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {projects.map((project) => (
        <Card key={project.id} padding="standard" tone="subtle" className={styles.listItem}>
          <div className={styles.listItemBody}>
            <div className={styles.listItemInfo}>
              <h3 className={styles.listItemTitle}>{project.title}</h3>
              <p className={styles.listItemSlug}>/{project.slug}</p>
              {project.summary && (
                <p className={styles.listItemSummary}>{project.summary}</p>
              )}
              <p className={styles.listItemDate}>
                Updated{" "}
                {new Date(project.updated_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className={styles.listItemMeta}>
              <Status
                status={statusTone[project.status] ?? "draft"}
                label={statusLabel[project.status] ?? project.status}
              />
            </div>
          </div>
          <div className={styles.listItemActions}>
            <Button
              variant="quiet"
              size="compact"
              onClick={() => onEdit(project)}
            >
              Edit
            </Button>
            {confirmId === project.id ? (
              <span className={styles.deleteConfirm}>
                <Button
                  variant="primary"
                  size="compact"
                  disabled={deletingId === project.id}
                  onClick={() => handleDelete(project.id)}
                >
                  {deletingId === project.id ? "Deleting…" : "Confirm"}
                </Button>
                <Button
                  variant="quiet"
                  size="compact"
                  onClick={() => setConfirmId(null)}
                >
                  Cancel
                </Button>
              </span>
            ) : (
              <Button
                variant="quiet"
                size="compact"
                onClick={() => setConfirmId(project.id)}
                className={styles.deleteButton}
              >
                Delete
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
