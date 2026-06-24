import { getUser } from "@/lib/auth/server"
import { ConsoleSignOut } from "./sign-out"
import { PageLabel } from "./page-label"
import styles from "./console.module.css"

export async function ConsoleTopbar() {
  const user = await getUser()

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
