import type { Metadata } from "next"
import { ProjectEditor } from "@/components/projects/project-editor"

export const metadata: Metadata = {
  title: "Projects — Studio Console",
  robots: { index: false, follow: false },
}

export default function ProjectsPage() {
  return (
    <>
      <header style={pageHeaderStyle}>
        <h1 style={pageTitleStyle}>Projects</h1>
        <p style={pageDescriptionStyle}>
          Studio outputs — tools, websites, apps, and experiments that are
          active or in progress.
        </p>
      </header>

      <ProjectEditor />
    </>
  )
}

const pageHeaderStyle: React.CSSProperties = {
  marginBlockEnd: "var(--studio-space-8)",
}

const pageTitleStyle: React.CSSProperties = {
  color: "rgba(245, 245, 243, 0.9)",
  fontSize: "var(--studio-text-2xl)",
  fontWeight: "var(--studio-font-weight-regular)",
  letterSpacing: 0,
  lineHeight: "var(--studio-leading-heading)",
  margin: "0 0 var(--studio-space-2)",
}

const pageDescriptionStyle: React.CSSProperties = {
  color: "rgba(170, 166, 154, 0.7)",
  fontSize: "var(--studio-text-sm)",
  lineHeight: 1.6,
  margin: 0,
  maxInlineSize: "var(--studio-container-readable)",
}
