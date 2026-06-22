import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import styles from "./Heading.module.css"

const sizeClassNames = {
  display: styles.sizeDisplay,
  "1": styles.sizeOne,
  "2": styles.sizeTwo,
  "3": styles.sizeThree,
  "4": styles.sizeFour,
} as const

const alignClassNames = {
  start: styles.alignStart,
  center: styles.alignCenter,
} as const

const toneClassNames = {
  default: styles.toneDefault,
  muted: styles.toneMuted,
} as const

type HeadingSize = keyof typeof sizeClassNames
type HeadingAlign = keyof typeof alignClassNames
type HeadingTone = keyof typeof toneClassNames

type HeadingProps<TElement extends ElementType = "h2"> = {
  align?: HeadingAlign
  as?: TElement
  children: ReactNode
  className?: string
  size?: HeadingSize
  tone?: HeadingTone
} & Omit<ComponentPropsWithoutRef<TElement>, "as" | "children" | "className" | "size">

function cx(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ")
}

export function Heading<TElement extends ElementType = "h2">({
  align = "start",
  as,
  children,
  className,
  size = "2",
  tone = "default",
  ...props
}: HeadingProps<TElement>) {
  const Component = as ?? "h2"

  return (
    <Component
      className={cx(styles.root, sizeClassNames[size], alignClassNames[align], toneClassNames[tone], className)}
      {...props}
    >
      {children}
    </Component>
  )
}

export type { HeadingAlign, HeadingProps, HeadingSize, HeadingTone }
