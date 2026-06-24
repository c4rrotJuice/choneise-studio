import { createClient } from "@/lib/supabase/server"
import type { User, Session } from "@supabase/supabase-js"

export async function getSession(): Promise<Session | null> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getSession()
  return data.session ?? null
}

export async function getUser(): Promise<User | null> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return data.user ?? null
}
