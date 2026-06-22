import type { MetadataRoute } from "next"
import { siteConfig } from "./metadata"

export const dynamic = "force-static"

const routes = ["", "/projects", "/experiments", "/about"] as const

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date("2026-06-22"),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }))
}
