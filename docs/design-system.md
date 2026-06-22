# Studio Design System

## Source References

The system is derived from `legacy/assets/project style guide.png` and checked against
`legacy/assets/landingpage sample.png`. The intended result is a soft dark editorial
studio interface: charcoal surfaces, off-white typography, sage and amber accents,
thin structure, restrained cards, and quiet motion.

## Component Inventory

### Brand

- `Logo`: text logo primitive with default and muted tones.

### Layout

- `Container`: page, readable, and fixed-width content bounds with tokenized gutters.
- `Section`: page rhythm and sectional surface variants.
- `Grid`: responsive structured grids from one to four columns.
- `Stack`: vertical composition primitive for CSS-free page assembly.

### Typography

- `Heading`: display through compact heading sizes with start or center alignment.
- `Text`: body copy with size, tone, and measure controls.

### UI

- `Button`: anchor or button rendering with primary, secondary, and quiet variants.
- `Card`: structured surface primitive with compact, standard, or editorial padding.
- `Status`: compact status label with a token-colored dot.
- `Tag`: compact metadata label.

### Motion

- `FadeIn`: opacity-only entry motion.
- `Reveal`: subtle opacity and vertical entry motion.
- `Stagger`: tokenized delay composition for motion children.

### Project Presentation

- `ProjectStatus`: maps studio project states to the shared `Status` primitive.
- `ProjectMeta`: renders project metadata as `Tag` primitives.
- `ProjectCard`: composes `Card`, typography, `ProjectStatus`, and `ProjectMeta`.
- `ProjectGrid`: composes `Grid` and `ProjectCard` for project collections.

## Usage Rules

- Build pages from primitives first: `Section`, `Container`, `Stack`, `Grid`,
  typography, and UI primitives should cover normal page assembly.
- Do not add page-specific CSS for layout, spacing, color, cards, or typography. If a
  new page cannot be built without CSS, add or extend a primitive instead.
- Components should consume semantic tokens from `styles/tokens.css`, not hard-coded
  visual values.
- Use palette primitives only inside token definitions. Component CSS should prefer
  semantic tokens such as `--studio-color-bg`, `--studio-color-text-muted`,
  `--studio-color-border`, and `--studio-color-accent`.
- Use `Card` for repeated framed items and real panels. Do not nest cards inside cards.
- Use `Tag` for metadata and `Status` for state. Do not recreate these treatments in
  feature components.
- Keep typography quiet: medium heading weight, regular body weight, no negative
  letter spacing, and uppercase tracking only for labels.
- Keep spacing editorial: sections use large rhythm, cards use standard padding, and
  dense metadata uses compact gaps.

## Motion Rules

- Motion is optional enhancement, not information architecture.
- Prefer `Reveal` for page-level content arrival and `FadeIn` for small opacity-only
  entrances.
- Use `Stagger` only to sequence related children with token durations.
- Keep transforms small and durations tokenized through `styles/motion.css`.
- Respect reduced motion by using the motion primitives instead of one-off CSS
  animations.
- Avoid decorative animation, glow, parallax, or continuous motion unless a product
  interaction explicitly requires it.

## Extension Guidelines

- Extend an existing primitive before creating a new component when the need is a
  variant of layout, spacing, typography, surface, status, or metadata.
- Create domain presentation components, like `ProjectCard`, only as compositions of
  primitives. They should not fetch data, route, or own business rules.
- Add tokens when a value will be reused across components. Do not add one-off CSS
  values to component modules.
- Keep component modules small and local. Shared visual decisions belong in tokens or
  primitives.
- New pages pass this phase when they can be assembled without writing CSS.
