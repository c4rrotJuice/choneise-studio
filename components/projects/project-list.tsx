"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Status } from "@/components/ui/Status";
import { deleteProject, type ProjectRow } from "@/lib/api/projects";
import styles from "./projects.module.css";

type ProjectListProps = {
  projects: ProjectRow[];
  onEdit: (project: ProjectRow) => void;
  onDeleted: () => void;
};

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

export function ProjectList({ projects, onEdit, onDeleted }: ProjectListProps) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = useCallback(
    async (id: string) => {
      setDeletingId(id);
      const result = await deleteProject(id);
      setDeletingId(null);
      setConfirmId(null);
      if (result.ok) {
        onDeleted();
      }
    },
    [onDeleted],
  );

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
    );
  }

  return (
    <div className={styles.list}>
      {projects.map((project) => {
        const techStack = Array.isArray(project.tech_stack)
          ? project.tech_stack
          : [];
        const hostingStack =
          project.hosting_stack &&
          typeof project.hosting_stack === "object" &&
          !Array.isArray(project.hosting_stack)
            ? Object.entries(project.hosting_stack as Record<string, unknown>)
            : [];

        return (
          <Card
            key={project.id}
            padding="standard"
            tone="subtle"
            className={styles.listItem}
          >
            <div className={styles.listItemBody}>
              <div className={styles.listItemInfo}>
                <h3 className={styles.listItemTitle}>{project.title}</h3>
                <p className={styles.listItemSlug}>/{project.slug}</p>
                {project.summary && (
                  <p className={styles.listItemSummary}>{project.summary}</p>
                )}

                {/* ── Rich metadata chips ── */}
                <div className={styles.listItemChips}>
                  {project.kind && (
                    <span className={styles.listItemChip} data-kind>
                      {project.kind}
                    </span>
                  )}
                  {project.version && (
                    <span className={styles.listItemChip}>
                      {project.version}
                    </span>
                  )}
                  {techStack.length > 0 && (
                    <span className={styles.listItemChip} data-count>
                      {techStack.length} tech{techStack.length !== 1 ? "s" : ""}
                    </span>
                  )}
                  {hostingStack.length > 0 && (
                    <span className={styles.listItemChip} data-count>
                      {hostingStack.length} host
                      {hostingStack.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

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
        );
      })}
    </div>
  );
}
