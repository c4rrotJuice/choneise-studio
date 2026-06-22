import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import styles from "./Card.module.css"

const paddingClassNames = {
  compact: styles.paddingCompact,
  standard: styles.paddingStandard,
  editorial: styles.paddingEditorial,
} as const

const toneClassNames = {
  default: styles.toneDefault,
  elevated: styles.toneElevated,
  subtle: styles.toneSubtle,
} as const

type CardPadding = keyof typeof paddingClassNames
type CardTone = keyof typeof toneClassNames

type CardProps<TElement extends ElementType = "article"> = {
  as?: TElement
  children: ReactNode
  className?: string
  padding?: CardPadding
  tone?: CardTone
} & Omit<ComponentPropsWithoutRef<TElement>, "as" | "children" | "className">

function cx(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ")
}

export function Card<TElement extends ElementType = "article">({
  as,
  children,
  className,
  padding = "standard",
  tone = "default",
  ...props
}: CardProps<TElement>) {
  const Component = as ?? "article"

  return (
    <Component className={cx(styles.root, paddingClassNames[padding], toneClassNames[tone], className)} {...props}>
      {children}
    </Component>
  )
}

export type { CardPadding, CardProps, CardTone }
