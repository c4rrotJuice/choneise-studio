import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import styles from "./Stack.module.css"

const gapClassNames = {
  compact: styles.gapCompact,
  standard: styles.gapStandard,
  editorial: styles.gapEditorial,
} as const

const alignClassNames = {
  start: styles.alignStart,
  center: styles.alignCenter,
} as const

type StackGap = keyof typeof gapClassNames
type StackAlign = keyof typeof alignClassNames

type StackProps<TElement extends ElementType = "div"> = {
  align?: StackAlign
  as?: TElement
  children: ReactNode
  className?: string
  gap?: StackGap
} & Omit<ComponentPropsWithoutRef<TElement>, "as" | "children" | "className">

function cx(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ")
}

export function Stack<TElement extends ElementType = "div">({
  align = "start",
  as,
  children,
  className,
  gap = "standard",
  ...props
}: StackProps<TElement>) {
  const Component = as ?? "div"

  return (
    <Component className={cx(styles.root, gapClassNames[gap], alignClassNames[align], className)} {...props}>
      {children}
    </Component>
  )
}

export type { StackAlign, StackGap, StackProps }
