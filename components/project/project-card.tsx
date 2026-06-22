import styles from "./project-card.module.css"

type ProjectStatus = "Live" | "Building" | "Experiment" | "Dormant"

type ProjectCardProps = {
  description: string
  href?: string
  kind: string
  status: ProjectStatus
  title: string
  version: string
}

const statusClassNames: Record<ProjectStatus, string> = {
  Live: styles.statusLive,
  Building: styles.statusBuilding,
  Experiment: styles.statusExperiment,
  Dormant: styles.statusDormant,
}

function cx(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ")
}

export function ProjectCard({
  description,
  href = "/projects",
  kind,
  status,
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
      </span>
      <span className={styles.meta}>
        <span>{kind}</span>
        <span className={styles.version}>{version}</span>
      </span>
    </a>
  )
}

export type { ProjectCardProps, ProjectStatus }
