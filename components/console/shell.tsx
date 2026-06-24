import type { ReactNode } from "react"
import { ConsoleSidebar } from "./sidebar"
import { ConsoleTopbar } from "./topbar"
import styles from "./console.module.css"

type ConsoleShellProps = {
  children: ReactNode
}

export function ConsoleShell({ children }: ConsoleShellProps) {
  return (
    <div className={styles.shell}>
      <ConsoleSidebar />
      <div>
        <ConsoleTopbar />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
}
