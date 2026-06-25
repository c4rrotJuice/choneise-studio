"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Status } from "@/components/ui/Status"
import { ProjectList } from "./project-list"
import { ProjectForm } from "./project-form"
import type { ProjectRow } from "@/app/actions/projects"
import styles from "./projects.module.css"

type ProjectEditorProps = {
  projects: ProjectRow[]
}

type Panel = "list" | "form"

const statusLabel: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
}

export function ProjectEditor({ projects }: ProjectEditorProps) {
  const [panel, setPanel] = useState<Panel>("list")
  const [editingProject, setEditingProject] = useState<ProjectRow | null>(null)

  const handleCreate = useCallback(() => {
    setEditingProject(null)
    setPanel("form")
  }, [])

  const handleEdit = useCallback((project: ProjectRow) => {
    setEditingProject(project)
    setPanel("form")
  }, [])

  const handleSaved = useCallback(
    (_project: ProjectRow) => {
      if (!editingProject) {
        setPanel("list")
      }
    },
    [editingProject],
  )

  const handleBack = useCallback(() => {
    setPanel("list")
    setEditingProject(null)
  }, [])

  return (
    <div className={styles.editor}>
      <header className={styles.editorToolbar}>
        <div className={styles.editorToolbarLeft}>
          {panel === "form" && (
            <Button variant="quiet" size="compact" onClick={handleBack}>
              ← Back to list
            </Button>
          )}
          {panel === "list" && (
            <h2 className={styles.editorToolbarTitle}>
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </h2>
          )}
        </div>
        {panel === "list" && (
          <Button variant="primary" size="standard" onClick={handleCreate}>
            + New Project
          </Button>
        )}
      </header>

      {panel === "list" && (
        <ProjectList projects={projects} onEdit={handleEdit} />
      )}

      {panel === "form" && editingProject && (
        <div className={styles.splitEditor}>
          <div className={styles.splitEditorForm}>
            <ProjectForm
              key={editingProject.id}
              project={editingProject}
              onSaved={handleSaved}
            />
          </div>
          <div className={styles.splitEditorPreview}>
            <PreviewPanel project={editingProject} />
          </div>
        </div>
      )}

      {panel === "form" && !editingProject && (
        <div className={styles.splitEditor}>
          <div className={styles.splitEditorForm}>
            <ProjectForm onSaved={handleSaved} />
          </div>
          <div className={styles.splitEditorPreview}>
            <PreviewPanel />
          </div>
        </div>
      )}
    </div>
  )
}

function PreviewPanel({ project }: { project?: ProjectRow | null }) {
  if (!project) {
    return (
      <Card padding="editorial" tone="subtle" className={styles.previewCard}>
        <div className={styles.previewPlaceholder}>
          <p className={styles.previewPlaceholderTitle}>Preview</p>
          <p className={styles.previewPlaceholderCopy}>
            Fill in the form to see a live preview of the project content.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card padding="editorial" tone="subtle" className={styles.previewCard}>
      <div className={styles.previewContent}>
        <div className={styles.previewHeader}>
          <Status
            status={
              project.status === "published"
                ? "live"
                : project.status === "archived"
                  ? "build"
                  : "draft"
            }
            label={statusLabel[project.status] ?? project.status}
          />
        </div>
        <h3 className={styles.previewTitle}>{project.title}</h3>
        <p className={styles.previewSlug}>/{project.slug}</p>
        {project.summary && (
          <p className={styles.previewSummary}>{project.summary}</p>
        )}
        {project.body && (
          <div className={styles.previewBody}>{project.body}</div>
        )}
        {!project.summary && !project.body && (
          <p className={styles.previewEmpty}>
            No content to preview yet.
          </p>
        )}
        <p className={styles.previewDate}>
          Last updated:{" "}
          {new Date(project.updated_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </Card>
  )
}
