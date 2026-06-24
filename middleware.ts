import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            request.cookies.set(name, value)
          }
          response = NextResponse.next({ request })
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options)
          }
        },
      },
    },
  )

  // Refresh the session — this reads and re-validates the user's auth cookies
  const { data } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Protect /console — redirect unauthenticated users to /login
  if (pathname.startsWith("/console") && !data.user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from /login to /console
  if (pathname === "/login" && data.user) {
    const url = request.nextUrl.clone()
    url.pathname = "/console"
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ["/console/:path*", "/login"],
}
