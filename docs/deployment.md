# Deployment

## Local

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Required local environment variables are listed in `.env.example` and validated by `config/env.ts`.

Before merging structural or foundation changes, run:

```bash
npm run lint
npm run typecheck
npm run build
```

## Preview

Preview deployments should run `npm run build` with Node.js 22 or newer and the same required environment variables configured in the hosting provider.

Cloudflare Pages should deploy the generated `out/` directory. The project is static-first for Pages, but it intentionally keeps server-capable Next.js builds available through `npm run build:server` for future App Router features.

```bash
npm run build
npm run preview:deploy
```

## Production

Production should use the same build command:

```bash
npm run build
```

Deploy the generated `out/` directory to Cloudflare Pages. Do not add a Cloudflare adapter or server runtime dependency unless the architecture is deliberately changed and documented.

Secrets and local environment files must be configured in the deployment platform, not committed to the repository.
