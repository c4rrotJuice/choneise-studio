import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Console",
  robots: { index: false, follow: false },
}

export default async function ConsoleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--studio-color-bg)",
        color: "var(--studio-color-text)",
        fontFamily: "var(--studio-font-sans)",
      }}
    >
      {children}
    </div>
  )
}
