Project Rules
1. Core Philosophy

Choneise is a product-first digital studio. Every system must prioritise:

Ownership over dependency
Clarity over cleverness
Longevity over speed
Small, composable systems over monoliths

No feature exists unless it supports a real product or experimental surface.

2. Architecture Principles
Public-facing pages default to static rendering
Dynamic behaviour must be explicitly justified
Supabase is treated strictly as infrastructure, not application logic
Products should remain deployable independently
Avoid tightly coupling unrelated modules

Preferred structure:

UI layer: presentation only
Data layer: isolated Supabase clients
Logic layer: pure functions where possible
3. Code Organisation Rules
Feature-based grouping over type-based grouping where practical
Shared components must remain generic and context-free
No cross-feature imports unless placed in /shared
Avoid deep nesting beyond 3 levels where possible
All new modules must have a clearly defined responsibility
4. Styling & UI Rules
Design system is mandatory; no ad-hoc styling patterns
Tailwind is the primary styling method
Visual tone must remain:
soft dark
editorial spacing
restrained motion
Avoid decorative complexity without functional purpose
UI should feel like a tool interface, not marketing
5. State & Data Rules
Server state is preferred over client state
Client state must be minimal and localised
Supabase queries must be:
explicit
typed
reusable via lib/supabase
No direct database calls inside UI components
6. Dependency Rules
Dependencies must be rare, justified, and reviewed
No animation libraries unless absolutely necessary
No UI kits that override design system control
Prefer native Web APIs and lightweight utilities

If a dependency is added, it must solve a repeated, proven friction.

7. Performance Rules
Default to static generation or incremental rendering
Avoid unnecessary client-side JavaScript
Images must be optimised before use
No runtime-heavy abstractions on initial load
8. Testing & Validation
New logic must be testable in isolation
Prefer lightweight unit tests over heavy frameworks
Any Supabase-related logic should include:
schema validation
edge-case handling
No test is required for purely presentational components unless logic exists
9. Deployment Rules
Each product should be independently deployable
No shared deployment bottlenecks across apps
Build outputs must remain clean and reproducible
Environment variables must be explicitly declared and documented
10. Forbidden Changes

The following are not allowed unless explicitly justified:

Introducing heavy frameworks without necessity
Mixing business logic into UI components
Creating global state systems without strong justification
Over-abstracting early-stage systems
Coupling unrelated product domains
Replacing design system components with one-off styling patterns
11. Evolution Rules
Complexity is only introduced after repeated friction
Refactors must be driven by evidence, not preference
New patterns must be documented before adoption
The system is allowed to stay “incomplete” if it remains clean
12. Identity Constraint (Non-Technical)

Every implementation must reflect the studio’s intent:

calm, structured, intentional
experimental but controlled
minimal but not sterile

No output should feel rushed, loud, or overly commercial.