import type { ProjectCardProps } from "@/components/project/project-card"

export const navLinks = [
  { label: "Studio", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Experiments", href: "/experiments" },
  { label: "About", href: "/about" },
] as const

export const featuredProjects: readonly ProjectCardProps[] = [
  {
    description: "Convert grades across different systems. Simple, accurate, useful.",
    href: "/projects#grade-converter",
    kind: "Tool",
    status: "Live",
    title: "Grade Converter",
    version: "v1.0.2",
  },
  {
    description: "Estimate mobile money transfer costs before sending everyday payments.",
    href: "/projects#fee-calculator",
    kind: "Tool",
    status: "Building",
    title: "Mobile Money Fee Calculator",
    version: "v0.4.0",
  },
  {
    description: "Explore meanings across languages, contexts, and translation paths.",
    href: "/experiments#multilingual-explorer",
    kind: "Experiment",
    status: "Experiment",
    title: "Multilingual Explorer",
    version: "v0.3.1",
  },
  {
    description: "A minimal writing space for quiet notes, drafts, and public thinking.",
    href: "/experiments#quiet-journal",
    kind: "Experiment",
    status: "Dormant",
    title: "Quiet Journal",
    version: "v0.1.0",
  },
]

export const currentBuilds = [
  {
    label: "Now",
    title: "Sharpening small public tools",
    copy: "Improving utility, copy, and release quality for the studio's first live products.",
  },
  {
    label: "Next",
    title: "Packaging reusable systems",
    copy: "Turning repeated product patterns into stable components, templates, and internal tooling.",
  },
  {
    label: "Exploring",
    title: "Language-aware workflows",
    copy: "Testing practical multilingual interfaces for learning, publishing, and everyday web tasks.",
  },
] as const

export const philosophyPrinciples = [
  {
    title: "Build useful things",
    copy: "Start with a clear job, keep the interface honest, and ship work that earns its place.",
  },
  {
    title: "Own the system",
    copy: "Treat product, design, code, operations, and maintenance as one connected responsibility.",
  },
  {
    title: "Move deliberately",
    copy: "Choose slower decisions when they protect quality, focus, and long-term ownership.",
  },
] as const

export const footerColumns = [
  {
    title: "Studio",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Projects",
    links: [
      { label: "Featured Work", href: "/projects" },
      { label: "Current Builds", href: "/#current-builds" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "Grade Converter", href: "/projects#grade-converter" },
      { label: "Fee Calculator", href: "/projects#fee-calculator" },
    ],
  },
  {
    title: "Experiments",
    links: [
      { label: "Explorer", href: "/experiments#multilingual-explorer" },
      { label: "Journal", href: "/experiments#quiet-journal" },
    ],
  },
  {
    title: "Notes",
    links: [
      { label: "Philosophy", href: "/about#philosophy" },
      { label: "Updates", href: "/#current-builds" },
    ],
  },
] as const
