import type { ComponentPropsWithoutRef } from "react"
import { Status } from "@/components/ui/Status"

const projectStatusLabels = {
  wip: "WIP",
  launched: "Launched",
  archived: "Archived",
} as const

const projectStatusTone = {
  wip: "build",
  launched: "live",
  archived: "draft",
} as const

type ProjectStatusValue = keyof typeof projectStatusLabels

type ProjectStatusProps = {
  status: ProjectStatusValue
} & Omit<ComponentPropsWithoutRef<typeof Status>, "label" | "status">

export function ProjectStatus({ status, ...props }: ProjectStatusProps) {
  return <Status status={projectStatusTone[status]} label={projectStatusLabels[status]} {...props} />
}

export type { ProjectStatusProps, ProjectStatusValue }
