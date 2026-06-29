import styles from "./project-card.module.css";

type ProjectStatus = "Live" | "Building" | "Experiment" | "Dormant";

type ProjectCardProps = {
  description: string;
  deployedUrl?: string;
  hostingStack?: ReadonlyArray<readonly [string, string]>;
  href?: string;
  kind: string;
  status: ProjectStatus;
  techStack?: readonly string[];
  title: string;
  version: string;
};

const statusClassNames: Record<ProjectStatus, string> = {
  Live: styles.statusLive,
  Building: styles.statusBuilding,
  Experiment: styles.statusExperiment,
  Dormant: styles.statusDormant,
};

function cx(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function ProjectCard({
  description,
  deployedUrl,
  hostingStack,
  href = "/projects",
  kind,
  status,
  techStack,
  title,
  version,
}: ProjectCardProps) {
  return (
    <a className={styles.card} href={href}>
      <span className={styles.cardTop}>
        <span className={styles.status}>
          <span className={cx(styles.statusDot, statusClassNames[status])} />
          {status}
        </span>
        <span className={styles.arrow} aria-hidden="true">
          ↗
        </span>
      </span>
      <span className={styles.body}>
        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>
        {hostingStack && hostingStack.length > 0 ? (
          <span className={styles.hostingSummary}>
            {hostingStack.map(([key, value]) => (
              <span className={styles.hostingItem} key={key}>
                <span className={styles.hostingKey}>{key}</span>
                <span className={styles.hostingValue}>{value}</span>
              </span>
            ))}
          </span>
        ) : null}
        {deployedUrl ? (
          <span className={styles.deployedUrl}>{deployedUrl}</span>
        ) : null}
        {techStack && techStack.length > 0 ? (
          <span className={styles.techStack}>
            {techStack.map((tech) => (
              <span className={styles.techBadge} key={tech}>
                {tech}
              </span>
            ))}
          </span>
        ) : null}
      </span>
      <span className={styles.meta}>
        <span>{kind}</span>
        <span className={styles.version}>{version}</span>
      </span>
    </a>
  );
}

export type { ProjectCardProps, ProjectStatus };
