import type { NextConfig } from "next"

const isStaticExport = process.env.NEXT_OUTPUT_MODE === "export"

const nextConfig: NextConfig = {
  // Runtime contract: Cloudflare Pages uses explicit static export builds.
  // Leave default output available for future server-capable Next.js deployments.
  ...(isStaticExport ? { output: "export" as const, trailingSlash: true } : {}),
  allowedDevOrigins: ["192.168.188.7"],
}

export default nextConfig
