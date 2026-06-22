import type { CSSProperties } from "react"

export type MotionDuration = "instant" | "fast" | "base" | "slow" | "reveal"

export type MotionTokenStyle = CSSProperties & {
  "--studio-motion-delay"?: string
  "--studio-motion-duration"?: string
  "--studio-motion-stagger-step"?: string
}

export const durationTokens: Record<MotionDuration, string> = {
  instant: "var(--studio-duration-instant)",
  fast: "var(--studio-duration-fast)",
  base: "var(--studio-duration-base)",
  slow: "var(--studio-duration-slow)",
  reveal: "var(--studio-duration-reveal)",
}

export function cx(...classNames: Array<string | undefined | false>) {
  return classNames.filter(Boolean).join(" ")
}
