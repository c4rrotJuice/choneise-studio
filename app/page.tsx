import { Logo } from "@/components/Logo"
import { Container } from "@/components/layout/Container"
import { Section } from "@/components/layout/Section"
import { Stack } from "@/components/layout/Stack"
import { Reveal, Stagger } from "@/components/motion"
import { ProjectGrid, type ProjectGridItem } from "@/components/project"
import { Heading } from "@/components/typography/Heading"
import { Text } from "@/components/typography/Text"
import { Button } from "@/components/ui/Button"

const selectedProjects: readonly ProjectGridItem[] = [
  {
    id: "grade-converter",
    description: "Convert grades across different systems. Simple, accurate, useful.",
    meta: ["Tool", "v1.0.2"],
    status: "launched",
    title: "Grade Converter",
  },
  {
    id: "multilingual-explorer",
    description: "Explore meanings across languages and contexts.",
    meta: ["Tool", "v0.3.1"],
    status: "wip",
    title: "Multilingual Explorer",
  },
  {
    id: "quiet-journal",
    description: "A minimal writing space for thinking in public.",
    meta: ["Experiment", "v0.1.0"],
    status: "archived",
    title: "Quiet Journal",
  },
] as const

export default function Home() {
  return (
    <main>
      <Section spacing="editorial">
        <Container>
          <Stack gap="editorial">
            <Logo tone="muted" />
            <Reveal as="header">
              <Stack gap="standard">
                <Text as="p" size="small" tone="strong">
                  Independent Product Studio
                </Text>
                <Heading as="h1" size="1">
                  Build things worth existing.
                </Heading>
                <Text size="large">
                  Choneise is a digital workshop for building useful software, tools, and systems on
                  the web. Some for ourselves, some for others. All with care.
                </Text>
                <Button as="a" href="#studio" variant="primary">
                  Enter Studio
                </Button>
              </Stack>
            </Reveal>
          </Stack>
        </Container>
      </Section>

      <Section id="studio" spacing="standard" variant="subtle">
        <Container>
          <Stack gap="standard">
            <Stack gap="compact">
              <Text as="p" size="small" tone="subtle">
                Currently in the studio
              </Text>
              <Heading as="h2" size="3">
                Selected Work
              </Heading>
            </Stack>
            <Stagger>
              <ProjectGrid projects={selectedProjects} />
            </Stagger>
          </Stack>
        </Container>
      </Section>
    </main>
  )
}
