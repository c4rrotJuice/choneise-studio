Project Runtime Overlay
PROJECT

Choneise is an independent digital product studio focused on building and owning useful software, web tools, and digital systems.

The platform itself serves as a living studio runtime:

It showcases internal products (projects, experiments, tools)
It supports selective client work as a secondary stream
It functions as both a portfolio and operational workspace

The core intent is not presentation alone, but continuous creation, iteration, and publication of digital assets.

Everything inside the system should assume:

Products are primary. The website is the surface layer of an active studio.

STACK
Framework: Next.js (App Router)
Styling: Tailwind CSS (utility-first, soft dark editorial system)
Backend / BaaS: Supabase
Hosting: Cloudflare Pages
Version Control: GitHub
Supporting Principles
Supabase is infrastructure, not the product layer
No heavy frontend libraries unless justified
Minimal dependency philosophy
Prefer native Next.js capabilities over abstraction layers
ARCHITECTURE
High-Level Structure

The system is split into three conceptual layers:

1. Presentation Layer (Frontend)
/app → routes and pages
/components → UI primitives and composable blocks
/styles → design tokens and global styling rules
2. Product Layer (Studio Content Model)

Dynamic, database-driven content representing the studio output:

Projects
Updates
Experiments
Assets
Tags

These are treated as first-class studio entities, not CMS content.

3. Data Layer (Supabase)
Central source of truth for all studio content
Read-heavy, write-light model
Supports future expansion into tooling (analytics, experiments, publishing systems)
Directory Intent
supabase/
├── migrations        → schema evolution (single source of truth)
├── seed              → baseline studio data
├── types             → generated TS types only

lib/supabase/
├── browser.ts        → client-side Supabase access
├── server.ts         → server-side Supabase access
Ownership Rules
UI does not define data shape
Data model defines UI capabilities
Pages are “views of studio state”, not hardcoded content
RULES
Public-facing pages default to static rendering
Dynamic behaviour must be explicitly justified (data freshness, interactivity, studio state)
Supabase is strictly infrastructure (no business logic embedded inside it)
Products should remain independently deployable unless tightly coupled
Avoid premature abstraction layers
Keep system composable, not monolithic
Add complexity only when friction is repeatedly observed in practice
DEPLOYMENT
Primary Host: Cloudflare Pages
Repository: GitHub (single source of version control)
Build Output: Static-first Next.js export where possible
Constraints
Each product may eventually deploy independently
This repo acts as the studio shell, not the runtime for all products
API routes only used when necessary for studio-level coordination
Environment Requirements
Supabase keys (public + service role where required)
Cloudflare build bindings
Node runtime compatible with Next.js latest stable
DATABASE
Technology
Supabase (PostgreSQL)
Core Tables
projects → main studio outputs (apps, tools, websites)
updates → chronological studio activity log
experiments → prototypes, discarded ideas, or tests
assets → media, visuals, files
tags → relational categorisation system
Rules
Migrations are the only source of schema truth
Types must be generated via supabase gen types
No ad-hoc schema changes in production
Data is structured for retrieval, not complexity
FORBIDDEN CHANGES
Do not modify Supabase schema without migration files
Do not introduce heavy UI frameworks or animation libraries without explicit approval
Do not couple product logic directly into UI components
Do not convert static pages into dynamic pages without justification
Do not restructure /app routes without architectural intent
Do not introduce alternative backend systems (Supabase is the sole backend layer)
Do not mix experimental code into production paths without separation
QUALITY BAR
TypeScript must be strict and complete (no implicit any)
All Supabase queries must be typed via generated schema
Linting must pass with zero warnings
Build must succeed on every commit
UI must remain consistent with design system (soft dark, editorial spacing, minimal noise)
Components must be reusable and composable, not page-specific
Any new feature must include:
Type definitions
Clear data source
Predictable state flow
Acceptance Standard

A change is only valid if:

It builds cleanly
It respects static-first philosophy
It preserves separation between UI, product model, and data layer
It does not increase system complexity without observable need