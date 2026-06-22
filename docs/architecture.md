# Architecture

## Rendering model

Choneise Studio uses the Next.js App Router with static-first rendering. Public routes should remain statically prerendered unless a route has a clear product requirement for server runtime behavior.

The project does not force `output: "export"`, so the same foundation can support future server features under `next start` or a server-capable host. Dynamic rendering flags should be applied only at the route or component boundary that needs them.

Environment access is centralized in `config/env.ts`. Application code should use typed accessors from that module instead of reading `process.env` directly.

## Deployment model

The application builds with `next build` and currently emits static public routes. Because the build uses Next.js default output, deployment should target a Next.js-capable runtime for production and previews.

Supabase is treated as infrastructure configuration only. Local Supabase state, generated temp files, and secrets are not part of the application source tree.

## Folder intent

- `app/`: App Router routes, layouts, and route-level rendering decisions.
- `components/`: Reusable UI components once product UI exists.
- `config/`: Runtime configuration contracts and project-level configuration notes.
- `docs/`: Architecture, deployment, and operating documentation.
- `legacy/`: Historical assets and scripts kept for reference, not active product code.
- `lib/`: Shared application integrations and reusable non-UI helpers.
- `public/`: Static files that must be served publicly.
- `styles/`: Global styles and styling entry points.
- `supabase/`: Supabase infrastructure configuration only.
