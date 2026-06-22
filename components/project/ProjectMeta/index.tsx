import type { ComponentPropsWithoutRef } from "react"
import { Tag } from "@/components/ui/Tag"
import styles from "./ProjectMeta.module.css"

type ProjectMetaProps = {
  items?: readonly string[]
} & Omit<ComponentPropsWithoutRef<"div">, "children">

function cx(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ")
}

export function ProjectMeta({ className, items = [], ...props }: ProjectMetaProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <div className={cx(styles.root, className)} {...props}>
      {items.map((item) => (
        <Tag className={styles.item} key={item}>
          {item}
        </Tag>
      ))}
    </div>
  )
}

export type { ProjectMetaProps }
