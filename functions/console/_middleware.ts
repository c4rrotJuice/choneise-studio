/**
 * Cloudflare Pages Functions middleware for /console/:path*
 *
 * Runs at the edge before serving static HTML. Validates the Supabase
 * session cookie and redirects unauthenticated users to /login.
 * This is the static-export equivalent of the Next.js middleware.ts guard.
 */
import { createFunctionsClient, type FunctionsEnv } from "../_lib/supabase"

export async function onRequest(context: {
  request: Request
  env: FunctionsEnv
  next: () => Promise<Response>
}): Promise<Response> {
  const { request, env, next } = context
  const { supabase, responseCookies } = createFunctionsClient(request, env)

  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    const url = new URL(request.url)
    const loginUrl = new URL("/login", url.origin)
    return Response.redirect(loginUrl.toString(), 302)
  }

  // User is authenticated — pass through to the static file.
  const response = await next()

  // Forward any refreshed session cookies.
  for (const cookie of responseCookies) {
    response.headers.append(
      "Set-Cookie",
      `${cookie.name}=${cookie.value}; Path=/; HttpOnly; SameSite=Lax; Secure`,
    )
  }

  return response
}
