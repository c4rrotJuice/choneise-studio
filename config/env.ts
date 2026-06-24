type PublicEnvKey = "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY"

type PublicEnv = Record<PublicEnvKey, string>

// IMPORTANT: NEXT_PUBLIC_* variables MUST be accessed with static dot notation
// (process.env.NEXT_PUBLIC_FOO) — NOT bracket notation (process.env[key]).
// Next.js/webpack DefinePlugin only inlines static property access at build time.
// Dynamic bracket access survives into the browser bundle where process.env is a
// shim without real values, causing runtime "Missing required env" errors.
function createPublicEnv(): PublicEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL. Add it to your local environment before starting or building.",
    )
  }

  if (!anonKey) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY. Add it to your local environment before starting or building.",
    )
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: url,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
  }
}

// Runtime contract: clientEnv may be imported by browser-capable modules.
// Only NEXT_PUBLIC_* values are allowed here.
export const clientEnv = createPublicEnv()

export function getClientEnv(key: PublicEnvKey): string {
  return clientEnv[key]
}
