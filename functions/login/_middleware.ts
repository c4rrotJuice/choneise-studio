/**
 * Cloudflare Pages Functions middleware for /login
 *
 * Redirects already-authenticated users away from the login page
 * to /console. Mirrors the Next.js middleware.ts behavior.
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

  if (data.user) {
    const url = new URL(request.url)
    const consoleUrl = new URL("/console", url.origin)
    return Response.redirect(consoleUrl.toString(), 302)
  }

  // Not authenticated — let them see the login page.
  const response = await next()

  for (const cookie of responseCookies) {
    response.headers.append(
      "Set-Cookie",
      `${cookie.name}=${cookie.value}; Path=/; HttpOnly; SameSite=Lax; Secure`,
    )
  }

  return response
}
