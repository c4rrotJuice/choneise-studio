import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import styles from "./Container.module.css"

const sizeClassNames = {
  readable: styles.sizeReadable,
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
  page: styles.sizePage,
} as const

const gutterClassNames = {
  compact: styles.gutterCompact,
  standard: styles.gutterStandard,
  editorial: styles.gutterEditorial,
} as const

type ContainerSize = keyof typeof sizeClassNames
type ContainerGutter = keyof typeof gutterClassNames

type ContainerProps<TElement extends ElementType = "div"> = {
  as?: TElement
  children: ReactNode
  className?: string
  gutter?: ContainerGutter
  size?: ContainerSize
} & Omit<ComponentPropsWithoutRef<TElement>, "as" | "children" | "className">

function cx(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ")
}

export function Container<TElement extends ElementType = "div">({
  as,
  children,
  className,
  gutter = "standard",
  size = "page",
  ...props
}: ContainerProps<TElement>) {
  const Component = as ?? "div"

  return (
    <Component
      className={cx(styles.root, sizeClassNames[size], gutterClassNames[gutter], className)}
      {...props}
    >
      {children}
    </Component>
  )
}

export type { ContainerGutter, ContainerProps, ContainerSize }
