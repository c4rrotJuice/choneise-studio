type PublicEnvKey = "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY"

type PublicEnv = Record<PublicEnvKey, string>

const publicEnvKeys: PublicEnvKey[] = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
]

function readRequiredEnv(key: string): string {
  const value = process.env[key]

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. Add it to your local environment before starting or building.`,
    )
  }

  return value
}

function createPublicEnv(): PublicEnv {
  return publicEnvKeys.reduce((env, key) => {
    env[key] = readRequiredEnv(key)
    return env
  }, {} as PublicEnv)
}

// Runtime contract: clientEnv may be imported by browser-capable modules.
// Only NEXT_PUBLIC_* values are allowed here.
export const clientEnv = createPublicEnv()

export function getClientEnv(key: PublicEnvKey): string {
  return clientEnv[key]
}

