import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import styles from "./Text.module.css"

const sizeClassNames = {
  small: styles.sizeSmall,
  medium: styles.sizeMedium,
  large: styles.sizeLarge,
} as const

const toneClassNames = {
  default: styles.toneDefault,
  strong: styles.toneStrong,
  subtle: styles.toneSubtle,
} as const

const measureClassNames = {
  readable: styles.measureReadable,
  compact: styles.measureCompact,
  full: styles.measureFull,
} as const

type TextSize = keyof typeof sizeClassNames
type TextTone = keyof typeof toneClassNames
type TextMeasure = keyof typeof measureClassNames

type TextProps<TElement extends ElementType = "p"> = {
  as?: TElement
  children: ReactNode
  className?: string
  measure?: TextMeasure
  size?: TextSize
  tone?: TextTone
} & Omit<ComponentPropsWithoutRef<TElement>, "as" | "children" | "className" | "size">

function cx(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ")
}

export function Text<TElement extends ElementType = "p">({
  as,
  children,
  className,
  measure = "readable",
  size = "medium",
  tone = "default",
  ...props
}: TextProps<TElement>) {
  const Component = as ?? "p"

  return (
    <Component
      className={cx(styles.root, sizeClassNames[size], toneClassNames[tone], measureClassNames[measure], className)}
      {...props}
    >
      {children}
    </Component>
  )
}

export type { TextMeasure, TextProps, TextSize, TextTone }
