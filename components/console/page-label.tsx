"use client"

import { usePathname } from "next/navigation"

const pageLabels: Record<string, string> = {
  "/console": "Dashboard",
  "/console/projects": "Projects",
  "/console/assets": "Assets",
}

export function PageLabel() {
  const pathname = usePathname()
  return <>{pageLabels[pathname] ?? "Console"}</>
}
