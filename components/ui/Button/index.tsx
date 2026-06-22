import type { ButtonHTMLAttributes, ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import styles from "./Button.module.css"

const variantClassNames = {
  primary: styles.variantPrimary,
  secondary: styles.variantSecondary,
  quiet: styles.variantQuiet,
} as const

const sizeClassNames = {
  compact: styles.sizeCompact,
  standard: styles.sizeStandard,
} as const

type ButtonVariant = keyof typeof variantClassNames
type ButtonSize = keyof typeof sizeClassNames

type ButtonProps<TElement extends ElementType = "button"> = {
  as?: TElement
  children: ReactNode
  className?: string
  size?: ButtonSize
  variant?: ButtonVariant
} & Omit<ComponentPropsWithoutRef<TElement>, "as" | "children" | "className" | "size">

function cx(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ")
}

export function Button<TElement extends ElementType = "button">({
  as,
  children,
  className,
  size = "standard",
  variant = "secondary",
  ...props
}: ButtonProps<TElement>) {
  const Component = as ?? "button"
  const buttonProps =
    Component === "button" && !("type" in props) ? ({ type: "button" } as ButtonHTMLAttributes<HTMLButtonElement>) : {}

  return (
    <Component
      className={cx(styles.root, variantClassNames[variant], sizeClassNames[size], className)}
      {...buttonProps}
      {...props}
    >
      {children}
    </Component>
  )
}

export type { ButtonProps, ButtonSize, ButtonVariant }
