import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import styles from "./Logo.module.css"

const toneClassNames = {
  default: styles.toneDefault,
  muted: styles.toneMuted,
} as const

const sizeClassNames = {
  compact: styles.sizeCompact,
  standard: styles.sizeStandard,
} as const

type LogoTone = keyof typeof toneClassNames
type LogoSize = keyof typeof sizeClassNames

type LogoProps<TElement extends ElementType = "span"> = {
  as?: TElement
  children?: ReactNode
  className?: string
  size?: LogoSize
  tone?: LogoTone
} & Omit<ComponentPropsWithoutRef<TElement>, "as" | "children" | "className" | "size">

function cx(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ")
}

export function Logo<TElement extends ElementType = "span">({
  as,
  children = "choneise",
  className,
  size = "standard",
  tone = "default",
  ...props
}: LogoProps<TElement>) {
  const Component = as ?? "span"

  return (
    <Component className={cx(styles.root, sizeClassNames[size], toneClassNames[tone], className)} {...props}>
      {children}
    </Component>
  )
}

export type { LogoProps, LogoSize, LogoTone }
