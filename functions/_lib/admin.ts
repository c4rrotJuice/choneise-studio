import { createClient } from "@supabase/supabase-js"
import type { Database } from "../../supabase/types/database"

/**
 * Create a Supabase admin client for the Cloudflare Pages Functions runtime.
 *
 * Uses the service_role key for elevated operations (insert, update, delete).
 * Must only be used server-side inside Functions handlers — never exposed to
 * the browser.
 */
export function createAdminClient(env: {
  NEXT_PUBLIC_SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
}) {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. This client must only be used " +
        "inside Cloudflare Functions with the secret set in the Pages dashboard.",
    )
  }

  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
  )
}
