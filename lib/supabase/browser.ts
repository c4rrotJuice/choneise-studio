import { createClient } from "@supabase/supabase-js"
import { getClientEnv } from "@/config/env"
import type { Database } from "@/supabase/types/database"

const supabaseUrl = getClientEnv("NEXT_PUBLIC_SUPABASE_URL")
const supabaseAnonKey = getClientEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
