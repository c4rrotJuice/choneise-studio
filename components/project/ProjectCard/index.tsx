import type { ComponentPropsWithoutRef } from "react"
import { Heading } from "@/components/typography/Heading"
import { Text } from "@/components/typography/Text"
import { Card } from "@/components/ui/Card"
import { ProjectMeta } from "../ProjectMeta"
import { ProjectStatus, type ProjectStatusValue } from "../ProjectStatus"
import styles from "./ProjectCard.module.css"

type ProjectCardProps = {
  description?: string
  meta?: readonly string[]
  status: ProjectStatusValue
  title: string
} & Omit<ComponentPropsWithoutRef<typeof Card>, "children">

function cx(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ")
}

export function ProjectCard({
  className,
  description,
  meta,
  status,
  title,
  ...props
}: ProjectCardProps) {
  return (
    <Card className={cx(styles.root, className)} padding="standard" tone="subtle" {...props}>
      <div className={styles.body}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <Heading as="h3" size="4">
              {title}
            </Heading>
            <ProjectStatus className={styles.status} status={status} />
          </div>
          {description ? (
            <Text measure="full" size="small">
              {description}
            </Text>
          ) : null}
        </div>
        <ProjectMeta className={styles.meta} items={meta} />
      </div>
    </Card>
  )
}

export type { ProjectCardProps }
