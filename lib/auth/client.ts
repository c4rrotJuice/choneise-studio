"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/supabase/types/database"
import { getClientEnv } from "@/config/env"

export function createAuthClient() {
  return createBrowserClient<Database>(
    getClientEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getClientEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  )
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = createAuthClient()
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signOut() {
  const supabase = createAuthClient()
  return supabase.auth.signOut()
}
