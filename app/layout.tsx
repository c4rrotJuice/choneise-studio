import "@/config/env"
import "@/styles/globals.css"
import { organizationJsonLd, websiteJsonLd } from "./metadata"

export { metadata } from "./metadata"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationJsonLd, websiteJsonLd]),
          }}
        />
        {children}
      </body>
    </html>
  )
}
