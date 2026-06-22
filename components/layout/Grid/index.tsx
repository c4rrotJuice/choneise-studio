import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import styles from "./Grid.module.css"

const columnClassNames = {
  1: styles.columnsOne,
  2: styles.columnsTwo,
  3: styles.columnsThree,
  4: styles.columnsFour,
} as const

const gapClassNames = {
  compact: styles.gapCompact,
  standard: styles.gapStandard,
  editorial: styles.gapEditorial,
} as const

type GridColumns = keyof typeof columnClassNames
type GridGap = keyof typeof gapClassNames

type GridProps<TElement extends ElementType = "div"> = {
  as?: TElement
  children: ReactNode
  className?: string
  columns?: GridColumns
  gap?: GridGap
} & Omit<ComponentPropsWithoutRef<TElement>, "as" | "children" | "className">

function cx(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ")
}

export function Grid<TElement extends ElementType = "div">({
  as,
  children,
  className,
  columns = 3,
  gap = "standard",
  ...props
}: GridProps<TElement>) {
  const Component = as ?? "div"

  return (
    <Component className={cx(styles.root, columnClassNames[columns], gapClassNames[gap], className)} {...props}>
      {children}
    </Component>
  )
}

export type { GridColumns, GridGap, GridProps }
