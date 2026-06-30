import { getStudioMetrics } from "@/lib/content/studio-metrics";
import styles from "./studio-metrics-bar.module.css";

/* ------------------------------------------------------------------ */
/*  Inline SVG icons (keep them small and stroke-first)                */
/* ------------------------------------------------------------------ */

function IconProjects() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect
        x="2.5"
        y="3.5"
        width="5.5"
        height="5.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <rect
        x="10"
        y="3.5"
        width="5.5"
        height="5.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <rect
        x="2.5"
        y="10.5"
        width="5.5"
        height="4"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <rect
        x="10"
        y="10.5"
        width="5.5"
        height="4"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.1"
      />
    </svg>
  );
}

function IconExperiment() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M6.5 1.5V7L2.5 12.5C1.8 13.4 2.4 14.5 3.5 14.5H14.5C15.6 14.5 16.2 13.4 15.5 12.5L11.5 7V1.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="6.5" y1="1.5" x2="11.5" y2="1.5" stroke="currentColor" strokeWidth="1.1" />
      <line x1="9" y1="8.5" x2="9" y2="11" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function IconProduction() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect
        x="1.5"
        y="10.5"
        width="15"
        height="6"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <rect
        x="4"
        y="12.5"
        width="2.5"
        height="2"
        rx="0.5"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <rect
        x="8.5"
        y="12.5"
        width="2.5"
        height="2"
        rx="0.5"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <rect
        x="13"
        y="12.5"
        width="2.5"
        height="2"
        rx="0.5"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <circle cx="5" cy="6.5" r="1.8" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="11" cy="4.5" r="1.4" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="7.5" cy="3" r="1" stroke="currentColor" strokeWidth="1.1" />
      <line
        x1="5"
        y1="8.3"
        x2="5"
        y2="10.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <line
        x1="11"
        y1="5.9"
        x2="11"
        y2="10.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <line
        x1="7.5"
        y1="4"
        x2="7.5"
        y2="10.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconUptime() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 15.5C12.5 15.5 15.5 12.6 15.5 9C15.5 5.4 12.5 2.5 9 2.5C5.5 2.5 2.5 5.4 2.5 9C2.5 10.6 3.2 12 4.3 13"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <polyline
        points="7.5,9 9,10.5 12.5,6.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPrinciple() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 2.5L11.5 7.5L17 8.5L13 12.5L14 18L9 15.5L4 18L5 12.5L1 8.5L6.5 7.5L9 2.5Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Metric item                                                        */
/* ------------------------------------------------------------------ */

type MetricItemProps = {
  icon: React.ReactNode;
  value: string;
  label: string;
  sublabel?: string;
};

function MetricItem({ icon, value, label, sublabel }: MetricItemProps) {
  return (
    <div className={styles.metric}>
      <span className={styles.metricIcon}>{icon}</span>
      <span className={styles.metricValue}>{value}</span>
      <span className={styles.metricLabel}>{label}</span>
      {sublabel ? <span className={styles.metricSublabel}>{sublabel}</span> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export async function StudioMetricsBar() {
  const metrics = await getStudioMetrics();

  return (
    <div className={styles.root} aria-label="Studio metrics">
      <MetricItem
        icon={<IconProjects />}
        value={String(metrics.totalProjects)}
        label="Projects"
      />
      <MetricItem
        icon={<IconExperiment />}
        value={String(metrics.activeExperiments)}
        label="Active"
        sublabel="Experiments"
      />
      <MetricItem
        icon={<IconProduction />}
        value={String(metrics.productionSystems)}
        label="Production"
        sublabel="Systems"
      />
      <MetricItem
        icon={<IconUptime />}
        value="95%"
        label="Uptime"
        sublabel="Focus"
      />
      <MetricItem
        icon={<IconPrinciple />}
        value="Build to Own"
        label="Not to Rent"
      />
    </div>
  );
}
