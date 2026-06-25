"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Status } from "@/components/ui/Status"
import { ProjectList } from "./project-list"
import { ProjectForm } from "./project-form"
import { getProjects, type ProjectRow } from "@/lib/api/projects"
import styles from "./projects.module.css"

// ── Types ───────────────────────────────────────────────────────────────────

type Panel = "list" | "form"

const statusLabel: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
}

// ── Component ───────────────────────────────────────────────────────────────

export function ProjectEditor() {
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [loading, setLoading] = useState(true)
  const [panel, setPanel] = useState<Panel>("list")
  const [editingProject, setEditingProject] = useState<ProjectRow | null>(null)

  // Fetch projects on mount and after mutations
  const refreshProjects = useCallback(async () => {
    const data = await getProjects()
    setProjects(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refreshProjects()
  }, [refreshProjects])

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
      refreshProjects()
      if (!editingProject) {
        // After creating, stay on form so they can see the result
        // and optionally switch back to list
        setPanel("list")
      }
    },
    [editingProject, refreshProjects],
  )

  const handleDeleted = useCallback(() => {
    refreshProjects()
  }, [refreshProjects])

  const handleBack = useCallback(() => {
    setPanel("list")
    setEditingProject(null)
  }, [])

  if (loading) {
    return (
      <div className={styles.editor}>
        <p style={{ color: "rgba(170,166,154,0.5)", fontSize: "var(--studio-text-sm)" }}>
          Loading projects…
        </p>
      </div>
    )
  }

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
        <ProjectList
          projects={projects}
          onEdit={handleEdit}
          onDeleted={handleDeleted}
        />
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
