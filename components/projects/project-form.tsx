"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  createProject,
  updateProject,
  type ProjectRow,
  type ApiError,
} from "@/lib/api/projects";
import { getAssets, type AssetRow } from "@/lib/api/assets";
import { linkAssetToProject } from "@/app/actions/assets";
import { AssetPickerModal } from "./asset-picker-modal";
import styles from "./projects.module.css";

// ── Types ───────────────────────────────────────────────────────────────────

type ProjectFormProps = {
  project?: ProjectRow | null;
  onSaved?: (project: ProjectRow) => void;
};

type FieldErrors = Record<string, string[]>;

// ── Helpers ─────────────────────────────────────────────────────────────────

function autoSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ── Component ───────────────────────────────────────────────────────────────

export function ProjectForm({ project, onSaved }: ProjectFormProps) {
  const isEditing = Boolean(project);

  // ── Basic info ──
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [summary, setSummary] = useState(project?.summary ?? "");
  const [body, setBody] = useState(project?.body ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [status, setStatus] = useState(project?.status ?? "draft");
  const [kind, setKind] = useState(project?.kind ?? "");
  const [version, setVersion] = useState(project?.version ?? "");
  const [slugManuallySet, setSlugManuallySet] = useState(Boolean(project));

  // ── Hosting stack ──
  const [hostingStack, setHostingStack] = useState<[string, string][]>(() => {
    const hs = project?.hosting_stack;
    if (hs && typeof hs === "object" && !Array.isArray(hs)) {
      return Object.entries(hs as Record<string, unknown>).map(([k, v]) => [
        k,
        String(v ?? ""),
      ]);
    }
    return [];
  });

  // ── Tech stack ──
  const [techStack, setTechStack] = useState<string[]>(() => {
    const ts = project?.tech_stack;
    if (Array.isArray(ts)) {
      return ts.map((item) =>
        typeof item === "string" ? item : JSON.stringify(item),
      );
    }
    return [];
  });

  // ── Updates / future plans ──
  const [updatesFuturePlans, setUpdatesFuturePlans] = useState(
    project?.updates_future_plans ?? "",
  );

  // ── Screenshots ──
  const [screenshots, setScreenshots] = useState<AssetRow[]>([]);
  const [screenshotsLoading, setScreenshotsLoading] = useState(isEditing);
  const [pickerOpen, setPickerOpen] = useState(false);

  // ── Form state ──
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load screenshots on edit ──
  useEffect(() => {
    if (!project?.id) {
      setScreenshotsLoading(false);
      return;
    }
    let cancelled = false;
    getAssets(project.id).then((data) => {
      if (!cancelled) {
        setScreenshots(data.filter((a) => a.type === "image"));
        setScreenshotsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [project?.id]);

  // Auto-slug from title when creating new
  const handleTitleChange = useCallback(
    (value: string) => {
      setTitle(value);
      if (!slugManuallySet && !isEditing) {
        setSlug(autoSlug(value));
      }
    },
    [slugManuallySet, isEditing],
  );

  const handleSlugChange = useCallback((value: string) => {
    setSlugManuallySet(true);
    setSlug(value);
  }, []);

  // ── Hosting stack helpers ──
  const addHostingRow = useCallback(() => {
    setHostingStack((prev) => [...prev, ["", ""]]);
  }, []);

  const updateHostingRow = useCallback(
    (index: number, key: string, value: string) => {
      setHostingStack((prev) => {
        const next = [...prev];
        next[index] = [key, value];
        return next;
      });
    },
    [],
  );

  const removeHostingRow = useCallback((index: number) => {
    setHostingStack((prev) => prev.filter((_, i) => i !== index));
  }, []);

  function hostingStackToObject(): Record<string, unknown> | null {
    const obj: Record<string, unknown> = {};
    let hasEntries = false;
    for (const [key, value] of hostingStack) {
      if (key.trim()) {
        obj[key.trim()] = value;
        hasEntries = true;
      }
    }
    return hasEntries ? obj : null;
  }

  // ── Tech stack helpers ──
  const addTechItem = useCallback(() => {
    setTechStack((prev) => [...prev, ""]);
  }, []);

  const updateTechItem = useCallback((index: number, value: string) => {
    setTechStack((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const removeTechItem = useCallback((index: number) => {
    setTechStack((prev) => prev.filter((_, i) => i !== index));
  }, []);

  function techStackToArray(): unknown[] | null {
    const filtered = techStack.filter((item) => item.trim());
    return filtered.length > 0 ? filtered : null;
  }

  // ── Screenshots helpers ──
  const handleOpenPicker = useCallback(() => {
    setPickerOpen(true);
  }, []);

  const handleClosePicker = useCallback(() => {
    setPickerOpen(false);
  }, []);

  const handleSelectScreenshots = useCallback(
    async (selectedIds: string[]) => {
      if (!project?.id) return;
      // Link each selected asset to this project via server action
      for (const assetId of selectedIds) {
        const result = await linkAssetToProject(assetId, project.id);
        if (result.ok && result.data) {
          const linked = result.data as unknown as AssetRow;
          setScreenshots((prev) => {
            // Don't add duplicates
            if (prev.some((s) => s.id === assetId)) return prev;
            return [...prev, linked];
          });
        }
      }
    },
    [project?.id],
  );

  const removeScreenshot = useCallback(async (assetId: string) => {
    // Unlink the asset (set project_id to null) instead of deleting
    const result = await linkAssetToProject(assetId, null);
    if (result.ok) {
      setScreenshots((prev) => prev.filter((s) => s.id !== assetId));
    }
  }, []);

  // ── Publish helpers ──
  const handlePublish = useCallback(() => setStatus("published"), []);
  const handleDraft = useCallback(() => setStatus("draft"), []);
  const handleArchive = useCallback(() => setStatus("archived"), []);

  // Cleanup autosave timer
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, []);

  const buildPayload = useCallback(() => {
    return {
      title,
      slug,
      summary: summary || undefined,
      body: body || undefined,
      description: description || undefined,
      status,
      kind: kind || undefined,
      version: version || undefined,
      hosting_stack: hostingStackToObject(),
      tech_stack: techStackToArray(),
      updates_future_plans: updatesFuturePlans || undefined,
    };
  }, [
    title,
    slug,
    summary,
    body,
    description,
    status,
    kind,
    version,
    hostingStack,
    techStack,
    updatesFuturePlans,
  ]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSaveState("saving");
      setFieldErrors({});

      const payload = buildPayload();

      let result;
      if (isEditing && project) {
        result = await updateProject({ id: project.id, ...payload });
      } else {
        result = await createProject(payload);
      }

      if (result.ok) {
        setSaveState("saved");
        if (onSaved && result.data) onSaved(result.data);
        // Reset saved indicator after a delay
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const timer = setTimeout(() => setSaveState("idle"), 2000);
        return () => clearTimeout(timer);
      } else {
        setSaveState("error");
        setFieldErrors((result as ApiError).errors ?? {});
      }
    },
    [buildPayload, isEditing, project, onSaved],
  );

  // ── Validation helpers ──
  const hasScreenshots = screenshots.length >= 2;
  const canPublish = status === "published" && hasScreenshots;

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {/* ══════════════════════════════════════════════════════════════════
          Section: Basic Info
          ══════════════════════════════════════════════════════════════════ */}
      <fieldset className={styles.formSection}>
        <legend className={styles.formSectionTitle}>Basic Info</legend>

        {/* Title */}
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

        {/* Slug */}
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

        {/* Summary */}
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

        {/* Body */}
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Body</span>
          <textarea
            className={styles.textarea}
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Full project description…"
            rows={10}
          />
          {fieldErrors.body && (
            <span className={styles.fieldError}>{fieldErrors.body[0]}</span>
          )}
        </label>

        {/* Description */}
        <label className={styles.field}>
          <span className={styles.fieldLabel}>
            Description{" "}
            <span className={styles.fieldLabelHint}>(SEO / meta)</span>
          </span>
          <textarea
            className={styles.textarea}
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief meta-description for search and social cards…"
            rows={3}
            maxLength={1000}
          />
          {fieldErrors.description && (
            <span className={styles.fieldError}>
              {fieldErrors.description[0]}
            </span>
          )}
        </label>

        {/* Status, Kind, Version — inline row */}
        <div className={styles.fieldRow3}>
          {/* Status */}
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
              <option value="Live">Live</option>
              <option value="Building">Building</option>
              <option value="Experiment">Experiment</option>
              <option value="Dormant">Dormant</option>
            </select>
            {fieldErrors.status && (
              <span className={styles.fieldError}>{fieldErrors.status[0]}</span>
            )}
          </label>

          {/* Kind */}
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Kind</span>
            <input
              className={styles.input}
              type="text"
              name="kind"
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              placeholder="e.g. Experiment, Tool"
              maxLength={100}
            />
            {fieldErrors.kind && (
              <span className={styles.fieldError}>{fieldErrors.kind[0]}</span>
            )}
          </label>

          {/* Version */}
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Version</span>
            <input
              className={styles.input}
              type="text"
              name="version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g. v0.1.0"
              maxLength={50}
            />
            {fieldErrors.version && (
              <span className={styles.fieldError}>
                {fieldErrors.version[0]}
              </span>
            )}
          </label>
        </div>
      </fieldset>

      {/* ══════════════════════════════════════════════════════════════════
          Section: Deployment
          ══════════════════════════════════════════════════════════════════ */}
      <fieldset className={styles.formSection}>
        <legend className={styles.formSectionTitle}>Deployment</legend>
        <p className={styles.formSectionHint}>
          Where and how this project is hosted.
        </p>

        {/* Hosting Stack — dynamic key-value pairs */}
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Hosting Stack</span>
          <div className={styles.kvList}>
            {hostingStack.map(([key, value], index) => (
              <div key={index} className={styles.kvRow}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Provider / service"
                  value={key}
                  onChange={(e) =>
                    updateHostingRow(index, e.target.value, value)
                  }
                />
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Plan / details"
                  value={value}
                  onChange={(e) => updateHostingRow(index, key, e.target.value)}
                />
                <button
                  type="button"
                  className={styles.kvRemove}
                  onClick={() => removeHostingRow(index)}
                  aria-label="Remove hosting entry"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="quiet"
            size="compact"
            onClick={addHostingRow}
          >
            + Add hosting entry
          </Button>
          {fieldErrors.hosting_stack && (
            <span className={styles.fieldError}>
              {fieldErrors.hosting_stack[0]}
            </span>
          )}
        </div>
      </fieldset>

      {/* ══════════════════════════════════════════════════════════════════
          Section: Tech Stack
          ══════════════════════════════════════════════════════════════════ */}
      <fieldset className={styles.formSection}>
        <legend className={styles.formSectionTitle}>Tech Stack</legend>
        <p className={styles.formSectionHint}>
          Languages, frameworks, and tools used in this project.
        </p>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Technologies</span>
          <div className={styles.kvList}>
            {techStack.map((item, index) => (
              <div key={index} className={styles.techRow}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="e.g. Next.js, TypeScript, Supabase"
                  value={item}
                  onChange={(e) => updateTechItem(index, e.target.value)}
                />
                <button
                  type="button"
                  className={styles.kvRemove}
                  onClick={() => removeTechItem(index)}
                  aria-label="Remove technology"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="quiet"
            size="compact"
            onClick={addTechItem}
          >
            + Add technology
          </Button>
          {fieldErrors.tech_stack && (
            <span className={styles.fieldError}>
              {fieldErrors.tech_stack[0]}
            </span>
          )}
        </div>
      </fieldset>

      {/* ══════════════════════════════════════════════════════════════════
          Section: Updates / Future Plans
          ══════════════════════════════════════════════════════════════════ */}
      <fieldset className={styles.formSection}>
        <legend className={styles.formSectionTitle}>
          Updates &amp; Future Plans
        </legend>
        <p className={styles.formSectionHint}>
          What&rsquo;s planned or in-progress — shown on the project page.
        </p>

        <label className={styles.field}>
          <textarea
            className={styles.textarea}
            name="updates_future_plans"
            value={updatesFuturePlans}
            onChange={(e) => setUpdatesFuturePlans(e.target.value)}
            placeholder="Outline upcoming features, roadmap items, or maintenance notes…"
            rows={6}
          />
          {fieldErrors.updates_future_plans && (
            <span className={styles.fieldError}>
              {fieldErrors.updates_future_plans[0]}
            </span>
          )}
        </label>
      </fieldset>

      {/* ══════════════════════════════════════════════════════════════════
          Section: Screenshots
          ══════════════════════════════════════════════════════════════════ */}
      <fieldset className={styles.formSection}>
        <legend className={styles.formSectionTitle}>
          Screenshots{" "}
          {!hasScreenshots && (
            <span className={styles.screenshotBadge}>
              min 2 required to publish
            </span>
          )}
        </legend>
        <p className={styles.formSectionHint}>
          Visual previews. At least 2 are required before publishing. Drag or
          reorder is not yet supported — remove and re-add to reorder.
        </p>

        {/* Existing screenshots */}
        {screenshotsLoading ? (
          <p
            style={{
              color: "rgba(170,166,154,0.5)",
              fontSize: "var(--studio-text-sm)",
            }}
          >
            Loading screenshots…
          </p>
        ) : screenshots.length > 0 ? (
          <>
            <div className={styles.screenshotGrid}>
              {screenshots.map((shot, index) => (
                <div key={shot.id} className={styles.screenshotCard}>
                  <span className={styles.screenshotIndex}>{index + 1}</span>
                  <img
                    src={shot.url}
                    alt={`Screenshot ${index + 1}`}
                    className={styles.screenshotImage}
                    loading="lazy"
                  />
                  <button
                    type="button"
                    className={styles.screenshotRemove}
                    onClick={() => removeScreenshot(shot.id)}
                    aria-label={`Remove screenshot ${index + 1}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            {project?.id && (
              <Button
                type="button"
                variant="quiet"
                size="compact"
                onClick={handleOpenPicker}
              >
                + Add more screenshots
              </Button>
            )}
          </>
        ) : (
          <button
            type="button"
            className={styles.screenshotEmptyButton}
            onClick={handleOpenPicker}
          >
            <span className={styles.screenshotEmptyIcon} aria-hidden>
              +
            </span>
            <span>Add Screenshots</span>
          </button>
        )}

        {fieldErrors.screenshots && (
          <span className={styles.fieldError}>
            {fieldErrors.screenshots[0]}
          </span>
        )}
      </fieldset>

      {/* ══════════════════════════════════════════════════════════════════
          Publish controls
          ══════════════════════════════════════════════════════════════════ */}
      <fieldset className={styles.formSection}>
        <legend className={styles.formSectionTitle}>Publish Controls</legend>
        <p className={styles.formSectionHint}>
          Current status: <strong>{status}</strong>. Publishing makes the
          project visible on <code>/projects</code>.
        </p>

        {status === "published" && !hasScreenshots && (
          <div className={styles.formWarning}>
            ⚠ At least 2 screenshots are required for a published project.
          </div>
        )}

        <div className={styles.publishActions}>
          {status !== "draft" && (
            <Button
              type="button"
              variant="secondary"
              size="standard"
              onClick={handleDraft}
            >
              Save as Draft
            </Button>
          )}
          {status !== "published" && (
            <Button
              type="button"
              variant="primary"
              size="standard"
              onClick={handlePublish}
              disabled={!hasScreenshots}
            >
              Publish
            </Button>
          )}
          {status !== "archived" && (
            <Button
              type="button"
              variant="quiet"
              size="standard"
              onClick={handleArchive}
            >
              Archive
            </Button>
          )}
        </div>
      </fieldset>

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

      {/* ── Asset picker modal ── */}
      <AssetPickerModal
        open={pickerOpen}
        onClose={handleClosePicker}
        onSelect={handleSelectScreenshots}
        excludeIds={screenshots.map((s) => s.id)}
      />
    </form>
  );
}
