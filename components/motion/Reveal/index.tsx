"use client"

import { createElement, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react"
import { useMotionEntry, type MotionEntryOptions } from "../shared/useMotionEntry"
import { cx, durationTokens, type MotionDuration, type MotionTokenStyle } from "../shared/types"

type RevealProps<TElement extends ElementType = "div"> = {
  as?: TElement
  children: ReactNode
  className?: string
  delay?: MotionDuration
  duration?: MotionDuration
  once?: MotionEntryOptions["once"]
  rootMargin?: MotionEntryOptions["rootMargin"]
  threshold?: MotionEntryOptions["threshold"]
} & Omit<ComponentPropsWithoutRef<TElement>, "as" | "children" | "className">

export function Reveal<TElement extends ElementType = "div">({
  as,
  children,
  className,
  delay,
  duration = "reveal",
  once,
  rootMargin,
  style,
  threshold,
  ...props
}: RevealProps<TElement>) {
  const Component = as ?? "div"
  const [ref, isEntered] = useMotionEntry<HTMLElement>({ once, rootMargin, threshold })
  const motionStyle: MotionTokenStyle = {
    ...style,
    "--studio-motion-duration": durationTokens[duration],
    ...(delay ? { "--studio-motion-delay": durationTokens[delay] } : null),
  }

  return createElement(
    Component,
    {
      ...props,
      ref,
      className: cx("studio-motion-reveal", className),
      "data-motion-state": isEntered ? "entered" : "idle",
      style: motionStyle,
    },
    children,
  )
}

export type { RevealProps }
