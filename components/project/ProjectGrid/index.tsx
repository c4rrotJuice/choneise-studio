import type { ComponentPropsWithoutRef } from "react"
import { Grid } from "@/components/layout/Grid"
import { ProjectCard, type ProjectCardProps } from "../ProjectCard"

type ProjectGridItem = ProjectCardProps & {
  id: string
}

type ProjectGridProps = {
  projects: readonly ProjectGridItem[]
} & Omit<ComponentPropsWithoutRef<typeof Grid>, "children">

export function ProjectGrid({ columns = 3, gap = "compact", projects, ...props }: ProjectGridProps) {
  return (
    <Grid columns={columns} gap={gap} {...props}>
      {projects.map(({ id, ...project }) => (
        <ProjectCard key={id} {...project} />
      ))}
    </Grid>
  )
}

export type { ProjectGridItem, ProjectGridProps }
