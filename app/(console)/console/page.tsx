import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Studio Console",
  description: "Choneise Studio Console",
  robots: { index: false, follow: false },
}

export default function ConsolePage() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "var(--studio-space-8)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "var(--studio-container-readable)",
          animation: "page-rise 680ms var(--studio-ease-enter) both",
        }}
      >
        <p
          style={{
            color: "var(--studio-color-text-muted)",
            fontSize: "var(--studio-text-xs)",
            fontWeight: "var(--studio-font-weight-semibold)",
            letterSpacing: "var(--studio-tracking-label)",
            textTransform: "uppercase",
            margin: 0,
            marginBottom: "var(--studio-space-4)",
          }}
        >
          Studio Console
        </p>
        <h1
          style={{
            color: "rgba(245, 245, 243, 0.9)",
            fontSize: "clamp(var(--studio-text-2xl), 4vw, var(--studio-text-4xl))",
            fontWeight: "var(--studio-font-weight-regular)",
            letterSpacing: 0,
            lineHeight: "1.04",
            margin: 0,
            marginBottom: "var(--studio-space-4)",
          }}
        >
          Nothing here yet.
        </h1>
        <p
          style={{
            color: "rgba(170, 166, 154, 0.82)",
            fontSize: "var(--studio-text-md)",
            lineHeight: "1.7",
            margin: 0,
          }}
        >
          The console is the studio&rsquo;s internal surface — a place to manage
          projects, experiments, and assets. It will grow as the studio grows.
        </p>
      </div>
    </main>
  )
}
