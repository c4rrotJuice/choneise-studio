# Studio Design Language

## Extracted Direction

The legacy references define Choneise as a soft dark, product-first studio system. The visual language is restrained: large areas of charcoal and slate, off-white type, thin structural lines, and small sage or amber signals for identity, status, and action.

The landing sample uses editorial spacing rather than dense application chrome. Primary content has generous breathing room, while project cards and navigation stay structured and quiet. Motion should support reveal and orientation, not call attention to itself.

## Color Rationale

The core palette comes from the project style guide:

- Charcoal `#0D0F12` anchors the primary background.
- Slate `#1A1E23` and stone `#2B3138` provide stepped surfaces without heavy contrast.
- Off white `#F5F5F3` is the primary text and logo color.
- Sage `#7D8B7C` is the main product accent.
- Amber `#D4A75A` is a warm secondary accent for status, focus, and selective emphasis.

Semantic tokens in `styles/tokens.css` separate usage from raw palette values. Components should consume semantic variables such as `--studio-color-bg`, `--studio-color-text-muted`, `--studio-color-border`, and `--studio-color-accent` instead of hard-coded hex values.

## Spacing Logic

The spacing scale uses a compact base for controls and cards, then expands into larger editorial steps for page sections. Small values support navigation, labels, and inline metadata. Larger values support section rhythm, hero spacing, and structured product grids.

Use `--studio-container-page` for page-level width, `--studio-container-readable` for prose, and the fixed container tokens for larger layout decisions. Page layouts should feel open, but not loose.

## Typography

The references use clean grotesk typography with regular and medium weights. Headings are large, calm, and closely set. Labels use uppercase text with deliberate tracking. Body text is muted and readable with relaxed line height.

The token scale is intentionally limited. Avoid one-off font sizes unless a new repeated pattern emerges.

## Component Rules

The active component set lives in `components/` and should follow these rules:

- Prefer semantic color tokens over palette primitives.
- Use thin borders and subtle surface changes instead of heavy shadows.
- Keep corners softly squared with the radius scale; avoid oversized rounded cards.
- Use sage for primary product identity and amber for focused or temporal signals.
- Avoid gradients, glassmorphism, decorative glow, and generic startup styling.
- Keep cards and panels structured with clear alignment, restrained metadata, and stable dimensions.
- Treat motion as quiet reveal, opacity, and small transform changes.
- Respect reduced motion by relying on the primitives in `styles/motion.css`.

## Motion

Motion primitives cover fade, upward reveal, and staggered entrances. Durations are short to medium, with a longer reveal token reserved for page-level entrances. Reduced motion collapses movement and duration while preserving state changes.

Motion should not become a brand effect. It should make content arrival and interaction state legible.
