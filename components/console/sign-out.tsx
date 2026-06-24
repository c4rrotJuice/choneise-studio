"use client"

import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth/client"
import { Button } from "@/components/ui/Button"

export function ConsoleSignOut() {
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push("/login")
  }

  return (
    <Button variant="quiet" size="compact" onClick={handleSignOut}>
      Sign out
    </Button>
  )
}
