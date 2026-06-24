import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/supabase/types/database"

function getServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. This client is only for server-side scripts and must never be exposed to the browser.",
    )
  }

  return key
}

export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getServiceRoleKey(),
  )
}
