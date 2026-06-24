"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createAuthClient } from "@/lib/auth/client"
import { ConsoleSignOut } from "./sign-out"
import { PageLabel } from "./page-label"
import styles from "./console.module.css"

export function ConsoleTopbar() {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    const supabase = createAuthClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
    })
  }, [])

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <p className={styles.topbarPageLabel}>
          <PageLabel />
        </p>
      </div>

      <div className={styles.topbarRight}>
        {user?.email && (
          <span className={styles.topbarUser}>{user.email}</span>
        )}
        <ConsoleSignOut />
      </div>
    </header>
  )
}
