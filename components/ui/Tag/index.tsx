import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import styles from "./Tag.module.css"

const toneClassNames = {
  default: styles.toneDefault,
  accent: styles.toneAccent,
  warm: styles.toneWarm,
} as const

type TagTone = keyof typeof toneClassNames

type TagProps<TElement extends ElementType = "span"> = {
  as?: TElement
  children: ReactNode
  className?: string
  tone?: TagTone
} & Omit<ComponentPropsWithoutRef<TElement>, "as" | "children" | "className">

function cx(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ")
}

export function Tag<TElement extends ElementType = "span">({
  as,
  children,
  className,
  tone = "default",
  ...props
}: TagProps<TElement>) {
  const Component = as ?? "span"

  return (
    <Component className={cx(styles.root, toneClassNames[tone], className)} {...props}>
      {children}
    </Component>
  )
}

export type { TagProps, TagTone }
