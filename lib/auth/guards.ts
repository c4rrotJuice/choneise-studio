import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth/server"

export async function requireAuth() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return user
}
