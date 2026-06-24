import { createServerClient } from "@supabase/ssr"

/**
 * Environment variables required by the Functions runtime.
 * Must be set in Cloudflare Pages Dashboard (Production + Preview).
 */
export interface FunctionsEnv {
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
}

/**
 * Create a Supabase client for the Cloudflare Pages Functions runtime.
 *
 * Reads cookies from the incoming Request and writes refreshed session
 * cookies back via the returned `responseCookies` array. Callers should
 * forward any returned cookies to the client via Set-Cookie headers.
 */
export function createFunctionsClient(
  request: Request,
  env: FunctionsEnv,
): {
  supabase: ReturnType<typeof createServerClient>
  responseCookies: Array<{ name: string; value: string; options?: Record<string, unknown> }>
} {
  const cookieHeader = request.headers.get("Cookie") ?? ""
  let responseCookies: Array<{ name: string; value: string; options?: Record<string, unknown> }> = []

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookies(cookieHeader)
        },
        setAll(cookiesToSet) {
          responseCookies = cookiesToSet
        },
      },
    },
  )

  return { supabase, responseCookies }
}

function parseCookies(header: string): Array<{ name: string; value: string }> {
  if (!header) return []

  return header
    .split(";")
    .map((part) => {
      const [name, ...rest] = part.trim().split("=")
      return { name: name.trim(), value: rest.join("=").trim() }
    })
    .filter((c) => c.name.length > 0)
}
