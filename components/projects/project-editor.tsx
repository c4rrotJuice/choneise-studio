"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Status } from "@/components/ui/Status";
import { ProjectList } from "./project-list";
import { ProjectForm } from "./project-form";
import { getProjects, type ProjectRow } from "@/lib/api/projects";
import { getAssets, type AssetRow } from "@/lib/api/assets";
import styles from "./projects.module.css";

// ── Types ───────────────────────────────────────────────────────────────────

type Panel = "list" | "form";

const statusLabel: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
  Live: "Live",
  Building: "Building",
  Experiment: "Experiment",
  Dormant: "Dormant",
};

const statusTone: Record<string, "draft" | "live" | "build" | "experimental"> =
  {
    draft: "draft",
    published: "live",
    archived: "build",
    Live: "live",
    Building: "build",
    Experiment: "experimental",
    Dormant: "draft",
  };

// ── Component ───────────────────────────────────────────────────────────────

export function ProjectEditor() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [panel, setPanel] = useState<Panel>("list");
  const [editingProject, setEditingProject] = useState<ProjectRow | null>(null);

  // Fetch projects on mount and after mutations
  const refreshProjects = useCallback(async () => {
    const data = await getProjects();
    setProjects(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  const handleCreate = useCallback(() => {
    setEditingProject(null);
    setPanel("form");
  }, []);

  const handleEdit = useCallback((project: ProjectRow) => {
    setEditingProject(project);
    setPanel("form");
  }, []);

  const handleSaved = useCallback(
    (savedProject: ProjectRow) => {
      refreshProjects();
      if (!editingProject) {
        // After creating, stay in the form so they can add screenshots
        setEditingProject(savedProject);
      }
    },
    [editingProject, refreshProjects],
  );

  const handleDeleted = useCallback(() => {
    refreshProjects();
  }, [refreshProjects]);

  const handleBack = useCallback(() => {
    setPanel("list");
    setEditingProject(null);
  }, []);

  if (loading) {
    return (
      <div className={styles.editor}>
        <p
          style={{
            color: "rgba(170,166,154,0.5)",
            fontSize: "var(--studio-text-sm)",
          }}
        >
          Loading projects…
        </p>
      </div>
    );
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
  );
}

function PreviewPanel({ project }: { project?: ProjectRow | null }) {
  const [screenshots, setScreenshots] = useState<AssetRow[]>([]);
  const [screenshotsLoaded, setScreenshotsLoaded] = useState(false);

  useEffect(() => {
    if (!project?.id) {
      setScreenshots([]);
      setScreenshotsLoaded(true);
      return;
    }
    let cancelled = false;
    getAssets(project.id).then((data) => {
      if (!cancelled) {
        setScreenshots(data.filter((a) => a.type === "image"));
        setScreenshotsLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [project?.id]);

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
    );
  }

  const techStack = Array.isArray(project.tech_stack) ? project.tech_stack : [];
  const hostingStack =
    project.hosting_stack &&
    typeof project.hosting_stack === "object" &&
    !Array.isArray(project.hosting_stack)
      ? Object.entries(project.hosting_stack as Record<string, unknown>)
      : [];

  return (
    <Card padding="editorial" tone="subtle" className={styles.previewCard}>
      <div className={styles.previewContent}>
        {/* Status + version */}
        <div className={styles.previewHeader}>
          <Status
            status={statusTone[project.status] ?? "draft"}
            label={statusLabel[project.status] ?? project.status}
          />
          {project.version && (
            <span className={styles.previewVersion}>{project.version}</span>
          )}
        </div>

        {/* Title + slug */}
        <h3 className={styles.previewTitle}>{project.title}</h3>
        <p className={styles.previewSlug}>/{project.slug}</p>

        {/* Kind */}
        {project.kind && <p className={styles.previewKind}>{project.kind}</p>}

        {/* Summary + body */}
        {project.summary && (
          <p className={styles.previewSummary}>{project.summary}</p>
        )}
        {project.body && (
          <div className={styles.previewBody}>{project.body}</div>
        )}
        {!project.summary && !project.body && (
          <p className={styles.previewEmpty}>No content to preview yet.</p>
        )}

        {/* ── Tech stack ── */}
        {techStack.length > 0 && (
          <div className={styles.previewSection}>
            <h4 className={styles.previewSectionTitle}>Tech Stack</h4>
            <div className={styles.previewTags}>
              {techStack.map((item, i) => (
                <span key={i} className={styles.previewTag}>
                  {typeof item === "string" ? item : JSON.stringify(item)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Hosting stack ── */}
        {hostingStack.length > 0 && (
          <div className={styles.previewSection}>
            <h4 className={styles.previewSectionTitle}>Hosting</h4>
            <div className={styles.previewKvList}>
              {hostingStack.map(([key, value], i) => (
                <div key={i} className={styles.previewKvRow}>
                  <span className={styles.previewKvKey}>{key}</span>
                  <span className={styles.previewKvValue}>{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Updates / future plans ── */}
        {project.updates_future_plans && (
          <div className={styles.previewSection}>
            <h4 className={styles.previewSectionTitle}>
              Updates &amp; Future Plans
            </h4>
            <p className={styles.previewUpdates}>
              {project.updates_future_plans}
            </p>
          </div>
        )}

        {/* ── Screenshots ── */}
        {screenshotsLoaded && screenshots.length > 0 && (
          <div className={styles.previewSection}>
            <h4 className={styles.previewSectionTitle}>
              Screenshots ({screenshots.length})
            </h4>
            <div className={styles.previewScreenshots}>
              {screenshots.slice(0, 4).map((shot, i) => (
                <img
                  key={shot.id}
                  src={shot.url}
                  alt={`Screenshot ${i + 1}`}
                  className={styles.previewScreenshot}
                  loading="lazy"
                />
              ))}
              {screenshots.length > 4 && (
                <span className={styles.previewScreenshotMore}>
                  +{screenshots.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Date */}
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
  );
}
