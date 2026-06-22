import type { Metadata } from "next"
import "@/config/env"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "Choneise Studio",
  description: "Choneise Studio scaffold",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
