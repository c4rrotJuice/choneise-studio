"use client"

import { type RefCallback, useEffect, useState } from "react"

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

type MotionEntryOptions = {
  once?: boolean
  rootMargin?: string
  threshold?: number
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION_QUERY).matches
}

export function useMotionEntry<TElement extends Element>({
  once = true,
  rootMargin = "0px 0px -10% 0px",
  threshold = 0.12,
}: MotionEntryOptions = {}): [RefCallback<TElement>, boolean] {
  const [node, setNode] = useState<TElement | null>(null)
  const [isEntered, setIsEntered] = useState(false)

  useEffect(() => {
    if (!node) {
      return
    }

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      setIsEntered(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextIsEntered = entry.isIntersecting

        setIsEntered(nextIsEntered)

        if (nextIsEntered && once) {
          observer.disconnect()
        }
      },
      {
        rootMargin,
        threshold,
      },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [node, once, rootMargin, threshold])

  return [setNode, isEntered]
}

export type { MotionEntryOptions }
