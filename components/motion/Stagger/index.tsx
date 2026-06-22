"use client"

import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react"
import { durationTokens, type MotionDuration, type MotionTokenStyle } from "../shared/types"

type StaggerProps = {
  children: ReactNode
  interval?: MotionDuration
}

export function Stagger({ children, interval = "instant" }: StaggerProps) {
  let motionIndex = 0

  return Children.map(children, (child) => {
    if (!isValidElement(child)) {
      return child
    }

    const element = child as ReactElement<{ style?: MotionTokenStyle }>
    const style: MotionTokenStyle = {
      ...element.props.style,
      "--studio-motion-stagger-step": durationTokens[interval],
      "--studio-motion-delay": `calc(${motionIndex} * var(--studio-motion-stagger-step))`,
    }

    motionIndex += 1

    return cloneElement(element, { style })
  })
}

export type { StaggerProps }
