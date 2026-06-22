import type { ComponentPropsWithoutRef } from "react"
import styles from "./Status.module.css"

const statusClassNames = {
  build: styles.statusBuild,
  live: styles.statusLive,
  draft: styles.statusDraft,
  experimental: styles.statusExperimental,
} as const

const statusLabels = {
  build: "Build",
  live: "Live",
  draft: "Draft",
  experimental: "Experimental",
} as const

type StatusValue = keyof typeof statusClassNames

type StatusProps = {
  className?: string
  label?: string
  status: StatusValue
} & Omit<ComponentPropsWithoutRef<"span">, "children" | "className">

function cx(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ")
}

export function Status({ className, label, status, ...props }: StatusProps) {
  return (
    <span className={cx(styles.root, statusClassNames[status], className)} {...props}>
      {label ?? statusLabels[status]}
    </span>
  )
}

export type { StatusProps, StatusValue }
