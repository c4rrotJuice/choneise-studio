import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import styles from "./Section.module.css"

const spacingClassNames = {
  compact: styles.spacingCompact,
  standard: styles.spacingStandard,
  editorial: styles.spacingEditorial,
} as const

const variantClassNames = {
  default: styles.variantDefault,
  subtle: styles.variantSubtle,
  panel: styles.variantPanel,
} as const

type SectionSpacing = keyof typeof spacingClassNames
type SectionVariant = keyof typeof variantClassNames

type SectionProps<TElement extends ElementType = "section"> = {
  as?: TElement
  children: ReactNode
  className?: string
  spacing?: SectionSpacing
  variant?: SectionVariant
} & Omit<ComponentPropsWithoutRef<TElement>, "as" | "children" | "className">

function cx(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ")
}

export function Section<TElement extends ElementType = "section">({
  as,
  children,
  className,
  spacing = "standard",
  variant = "default",
  ...props
}: SectionProps<TElement>) {
  const Component = as ?? "section"

  return (
    <Component
      className={cx(styles.root, spacingClassNames[spacing], variantClassNames[variant], className)}
      {...props}
    >
      {children}
    </Component>
  )
}

export type { SectionProps, SectionSpacing, SectionVariant }
