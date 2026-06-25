"use client"

import { useActionState, useCallback, useState, useTransition } from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Status } from "@/components/ui/Status"
import { deleteProject } from "@/app/actions/projects"
import type { ProjectRow } from "@/app/actions/projects"
import styles from "./projects.module.css"

type ProjectListProps = {
  projects: ProjectRow[]
  onEdit: (project: ProjectRow) => void
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

export function ProjectList({ projects, onEdit }: ProjectListProps) {
  const [confirmId, setConfirmId] = useState<string | null>(null)

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
              <DeleteConfirm
                projectId={project.id}
                onCancel={() => setConfirmId(null)}
              />
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

function DeleteConfirm({
  projectId,
  onCancel,
}: {
  projectId: string
  onCancel: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [, action] = useActionState(deleteProject, null)

  const handleDelete = useCallback(() => {
    const formData = new FormData()
    formData.set("id", projectId)
    startTransition(() => {
      action(formData)
    })
  }, [projectId, action])

  return (
    <span className={styles.deleteConfirm}>
      <Button
        variant="primary"
        size="compact"
        disabled={isPending}
        onClick={handleDelete}
      >
        {isPending ? "Deleting…" : "Confirm"}
      </Button>
      <Button variant="quiet" size="compact" onClick={onCancel}>
        Cancel
      </Button>
    </span>
  )
}
