"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { signInWithPassword } from "@/lib/auth/client"
import { Button } from "@/components/ui/Button"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: authError } = await signInWithPassword(email, password)

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // On success, navigate to /console. Middleware will confirm the session.
    router.push("/console")
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <p style={styles.eyebrow}>Choneise Studio</p>
          <h1 style={styles.title}>Sign in to the console</h1>
          <p style={styles.copy}>
            Access your studio workspace. Not available to the public.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          {error && (
            <div style={styles.error} role="alert">
              {error}
            </div>
          )}

          <label style={styles.label}>
            <span style={styles.labelText}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@choneise.com"
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            <span style={styles.labelText}>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              style={styles.input}
            />
          </label>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            style={styles.submit}
          >
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "var(--studio-space-6)",
    background:
      "radial-gradient(circle at 50% 30%, rgba(125, 139, 124, 0.07), transparent 40rem), var(--studio-color-bg)",
  },
  card: {
    width: "100%",
    maxWidth: "26rem",
    background:
      "linear-gradient(145deg, rgba(245, 245, 243, 0.05), rgba(245, 245, 243, 0.015)), rgba(20, 23, 27, 0.7)",
    border: "var(--studio-border-width-regular) solid rgba(245, 245, 243, 0.1)",
    borderRadius: "var(--studio-radius-4)",
    padding: "var(--studio-space-8)",
    animation: "page-rise 680ms var(--studio-ease-enter) both",
  },
  header: {
    marginBottom: "var(--studio-space-6)",
  },
  eyebrow: {
    color: "var(--studio-color-text-muted)",
    fontSize: "var(--studio-text-xs)",
    fontWeight: "var(--studio-font-weight-semibold)",
    letterSpacing: "var(--studio-tracking-label)",
    textTransform: "uppercase",
    margin: 0,
    marginBottom: "var(--studio-space-3)",
  },
  title: {
    color: "rgba(245, 245, 243, 0.9)",
    fontSize: "var(--studio-text-xl)",
    fontWeight: "var(--studio-font-weight-regular)",
    letterSpacing: 0,
    lineHeight: "var(--studio-leading-heading)",
    margin: 0,
    marginBottom: "var(--studio-space-2)",
  },
  copy: {
    color: "rgba(170, 166, 154, 0.72)",
    fontSize: "var(--studio-text-sm)",
    lineHeight: "1.6",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--studio-space-4)",
  },
  error: {
    background: "rgba(180, 60, 48, 0.12)",
    border: "1px solid rgba(180, 60, 48, 0.3)",
    borderRadius: "var(--studio-radius-2)",
    color: "rgba(255, 140, 120, 0.9)",
    fontSize: "var(--studio-text-sm)",
    lineHeight: "1.5",
    padding: "var(--studio-space-3) var(--studio-space-4)",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--studio-space-2)",
  },
  labelText: {
    color: "var(--studio-color-text-muted)",
    fontSize: "var(--studio-text-sm)",
    fontWeight: "var(--studio-font-weight-medium)",
  },
  input: {
    appearance: "none",
    background: "var(--studio-color-charcoal-950)",
    border: "var(--studio-border-width-regular) solid var(--studio-color-border)",
    borderRadius: "var(--studio-radius-3)",
    color: "var(--studio-color-text)",
    fontFamily: "var(--studio-font-sans)",
    fontSize: "var(--studio-text-sm)",
    lineHeight: "var(--studio-leading-heading)",
    padding: "var(--studio-space-3) var(--studio-space-4)",
    outline: "none",
    transition: "border-color var(--studio-duration-fast) var(--studio-ease-standard)",
  },
  submit: {
    marginTop: "var(--studio-space-2)",
  },
}
